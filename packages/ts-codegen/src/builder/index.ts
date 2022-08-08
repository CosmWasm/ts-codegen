import { TSClientOptions, ReactQueryOptions, defaultOptions } from "wasm-ast-types";

import messageComposer from '../generators/message-composer';
import reactQuery from '../generators/react-query';
import recoil from '../generators/recoil';
import tsClient from '../generators/ts-client';

import { basename } from 'path';
import { readSchemas } from '../utils';

import deepmerge from 'deepmerge';
import { pascal } from "case";

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
        this.tsClientFiles = await tsClient(contract.name, schemas, this.outPath, options);
    }

    async renderRecoil(contract: ContractFile) {
        const { enabled, ...options } = this.options.recoil;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        this.recoilFiles = await recoil(contract.name, schemas, this.outPath, options);
    }

    async renderReactQuery(contract: ContractFile) {
        const { enabled, ...options } = this.options.reactQuery;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        this.reactQueryFiles = await reactQuery(contract.name, schemas, this.outPath, options);
    }

    async renderMessageComposer(contract: ContractFile) {
        const { enabled, ...options } = this.options.messageComposer;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        this.messageComposerFiles = await messageComposer(contract.name, schemas, this.outPath, options);
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
}