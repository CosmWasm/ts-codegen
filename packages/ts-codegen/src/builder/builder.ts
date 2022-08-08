import { TSClientOptions, ReactQueryOptions, defaultOptions } from "wasm-ast-types";
import { header } from '../utils/header';
import { join } from "path";
import { writeFileSync } from 'fs';
import { sync as mkdirp } from "mkdirp";
import messageComposer from '../generators/message-composer';
import reactQuery from '../generators/react-query';
import recoil from '../generators/recoil';
import tsClient from '../generators/ts-client';

import { basename } from 'path';
import { readSchemas } from '../utils';

import deepmerge from 'deepmerge';
import { pascal } from "case";
import { createFileBundle, recursiveModuleBundle } from "../bundler";

import generate from '@babel/generator';
import * as t from '@babel/types';

const defaultOpts: TSBuilderOptions = {
    tsClient: {
        enabled: true
    },
    recoil: {
        enabled: false
    },
    reactQuery: {
        enabled: false
    },
    messageComposer: {
        enabled: false
    },
    bundle: true
}

export interface TSBuilderInput {
    contracts: Array<ContractFile | string>;
    outPath: string;
    options?: TSBuilderOptions;
};

export interface TSBuilderOptions {
    tsClient?: TSClientOptions & { enabled: boolean };
    reactQuery?: ReactQueryOptions & { enabled: boolean };
    recoil?: { enabled: boolean };
    messageComposer?: { enabled: boolean };
    ///// END PLUGINS

    bundle?: boolean;
};

export interface BuilderFile {
    contract: string;
    localname: string;
    filename: string;
};

export interface ContractFile {
    name: string;
    dir: string;
}
export class TSBuilder {
    contracts: Array<ContractFile | string>;
    outPath: string;
    options?: TSBuilderOptions;

    // TODO: separate types
    typesOnly?: boolean;

    protected tsClientFiles: BuilderFile[] = [];
    protected recoilFiles: BuilderFile[] = [];
    protected reactQueryFiles: BuilderFile[] = [];
    protected messageComposerFiles: BuilderFile[] = [];

    constructor({ contracts, outPath, options }: TSBuilderInput) {
        this.contracts = contracts;
        this.outPath = outPath;
        this.options = deepmerge(
            deepmerge(
                defaultOptions,
                defaultOpts
            ),
            options ?? {}
        );
    }

    getContracts(): ContractFile[] {
        return this.contracts.map(contractOpt => {
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
        });
    }

    async renderTsClient(contract: ContractFile) {
        const { enabled, ...options } = this.options.tsClient;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        const files = await tsClient(contract.name, schemas, this.outPath, options);
        [].push.apply(this.tsClientFiles, files);
    }

    async renderRecoil(contract: ContractFile) {
        const { enabled, ...options } = this.options.recoil;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        const files = await recoil(contract.name, schemas, this.outPath, options);
        [].push.apply(this.recoilFiles, files);
    }

    async renderReactQuery(contract: ContractFile) {
        const { enabled, ...options } = this.options.reactQuery;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        const files = await reactQuery(contract.name, schemas, this.outPath, options);
        [].push.apply(this.reactQueryFiles, files);
    }

    async renderMessageComposer(contract: ContractFile) {
        const { enabled, ...options } = this.options.messageComposer;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        const files = await messageComposer(contract.name, schemas, this.outPath, options);
        [].push.apply(this.messageComposerFiles, files);
    }

    async build() {
        const contracts = this.getContracts();
        for (let c = 0; c < contracts.length; c++) {
            const contract = contracts[c];
            await this.renderTsClient(contract);
            await this.renderMessageComposer(contract);
            await this.renderReactQuery(contract);
            await this.renderRecoil(contract);
        }
    }

    async bundle() {

        const allFiles = [
            ...this.reactQueryFiles,
            ...this.recoilFiles,
            ...this.tsClientFiles,
            ...this.messageComposerFiles
        ];

        const bundleFile = 'bundle.ts';
        const bundleVariables = {};
        const importPaths = [];

        allFiles.forEach(file => {
            createFileBundle(
                `contracts.${file.contract}`,
                file.localname,
                bundleFile,
                importPaths,
                bundleVariables
            );

        });

        const ast = recursiveModuleBundle(bundleVariables);

        const code = generate(t.program(
            [
                ...importPaths,
                ...ast
            ]
        )).code;

        mkdirp(this.outPath);
        writeFileSync(join(this.outPath, bundleFile), code);

    }
}