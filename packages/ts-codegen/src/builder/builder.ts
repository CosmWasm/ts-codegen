import { RenderOptions, defaultOptions, RenderContext, ContractInfo, MessageComposerOptions, BuilderContext } from "wasm-ast-types";

import { header } from '../utils/header';
import { join } from "path";
import { writeFileSync } from 'fs';
import { sync as mkdirp } from "mkdirp";

import { basename } from 'path';
import { readSchemas } from '../utils';
import { IBuilderPlugin } from '../plugins';

import deepmerge from 'deepmerge';
import { pascal } from "case";
import { createFileBundle, recursiveModuleBundle } from "../bundler";

import generate from '@babel/generator';
import * as t from '@babel/types';
import { ReactQueryPlugin } from "../plugins/react-query";
import { RecoilPlugin } from "../plugins/recoil";
import { MessageBuilderPlugin } from "../plugins/message-builder";
import { MessageComposerPlugin } from "../plugins/message-composer";
import { ClientPlugin } from "../plugins/client";
import { TypesPlugin } from "../plugins/types";
import { ContractsContextProviderPlugin } from "../plugins/provider";
import { createHelpers } from "../generators/create-helpers";
import { ContractsProviderBundlePlugin } from "../plugins/provider-bundle";

const defaultOpts: TSBuilderOptions = {
    bundle: {
        enabled: true,
        scope: 'contracts',
        bundleFile: 'bundle.ts'
    }
}

export interface TSBuilderInput {
    contracts: Array<ContractFile | string>;
    outPath: string;
    options?: TSBuilderOptions;
    plugins?: IBuilderPlugin[];
};

export interface BundleOptions {
    enabled?: boolean;
    scope?: string;
    bundleFile?: string;
    bundlePath?: string;
};

export interface UseContractsOptions {
    enabled?: boolean;
};

export type TSBuilderOptions = {
    bundle?: BundleOptions;
    /**
     * Enable using shorthand constructor.
     * Default: false
     */
    useShorthandCtor?: boolean;
    useContractsHooks?: UseContractsOptions;
} & RenderOptions;

export type BuilderFileType = 'type' | 'client' | 'recoil' | 'react-query' | 'message-composer' | 'message-builder' | 'plugin';

export interface BuilderFile {
    type: BuilderFileType;
    pluginType?: string;
    contract: string;
    //filename only: Factory.client.ts
    localname: string;
    //full path: contracts/Factory.client.ts
    filename: string;
};

export interface ContractFile {
    name: string;
    dir: string;
}

function getContract(contractOpt): ContractFile {
    if (typeof contractOpt === 'string') {
        const name = basename(contractOpt);
        const contractName = pascal(name);
        return {
            name: contractName,
            dir: contractOpt
        }
    }
    return {
        name: pascal(contractOpt.name),
        dir: contractOpt.dir
    };
}

export class TSBuilder {
    contracts: Array<ContractFile | string>;
    outPath: string;
    options?: TSBuilderOptions;
    plugins: IBuilderPlugin[] = [];
    builderContext: BuilderContext = new BuilderContext();

    protected files: BuilderFile[] = [];

    loadDefaultPlugins() {
        [].push.apply(this.plugins, [
            new TypesPlugin(this.options),
            new ClientPlugin(this.options),
            new MessageComposerPlugin(this.options),
            new ReactQueryPlugin(this.options),
            new RecoilPlugin(this.options),
            new MessageBuilderPlugin(this.options),
            new ContractsContextProviderPlugin(this.options),
        ]);
    }

    constructor({ contracts, outPath, options, plugins }: TSBuilderInput) {
        this.contracts = contracts;
        this.outPath = outPath;
        this.options = deepmerge(
            deepmerge(
                defaultOptions,
                defaultOpts
            ),
            options ?? {}
        );

        this.loadDefaultPlugins();

        if (plugins && plugins.length) {
            [].push.apply(this.plugins, plugins);
        }

        this.plugins.forEach(plugin => plugin.setBuilder(this))
    }

    async build() {
        await this.process();
        await this.after();
    }

    // lifecycle functions
    private async process() {
        for (const contractOpt of this.contracts) {
            const contract = getContract(contractOpt);
            //resolve contract schema.
            const contractInfo = await readSchemas({
                schemaDir: contract.dir
            });

            //lifecycle and plugins.
            await this.render(contract.name, contractInfo);
        }
    }

    private async render(name: string, contractInfo: ContractInfo) {
        for (const plugin of this.plugins) {
            let files = await plugin.render(name, contractInfo, this.outPath);
            if (files && files.length) {
                [].push.apply(this.files, files);
            }
        }
    }

    private async after() {

        //create useContracts bundle file
        const contractsProviderBundlePlugin = new ContractsProviderBundlePlugin(this.options);
        contractsProviderBundlePlugin.setBuilder(this);

        //contractContextProviders.ts
        const files = await contractsProviderBundlePlugin.render(
            "contractContextProviders",
            {
                schemas: [],
            },
            this.outPath
        );

        if (files && files.length) {
            [].push.apply(this.files, files);
        }

        const helpers = createHelpers({
            outPath: this.outPath,
            contracts: this.contracts,
            options: this.options,
            plugins: this.plugins,
        }, this.builderContext);

        if (helpers && helpers.length) {
            [].push.apply(this.files, helpers);
        }

        if (this.options.bundle.enabled) {
            this.bundle();
        }
    }

    async bundle() {
        const allFiles = this.files;

        const bundleFile = this.options.bundle.bundleFile;
        const bundlePath = join(
            this.options?.bundle?.bundlePath ?? this.outPath,
            bundleFile
        );
        const bundleVariables = {};
        const importPaths = [];

        allFiles.forEach(file => {
            createFileBundle(
                `${this.options.bundle.scope}.${file.contract}`,
                file.filename,
                bundlePath,
                importPaths,
                bundleVariables
            );

        });

        const ast = recursiveModuleBundle(bundleVariables);
        let code = generate(t.program(
            [
                ...importPaths,
                ...ast
            ]
        )).code;

        if (this.options?.bundle?.bundlePath) {
            mkdirp(this.options?.bundle?.bundlePath);
        }

        mkdirp(this.outPath);

        if (code.trim() === '') code = 'export {};'

        writeFileSync(bundlePath, header + code);

    }
}
