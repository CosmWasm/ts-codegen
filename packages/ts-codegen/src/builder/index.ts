import { TSClientOptions, ReactQueryOptions, defaultOptions } from "wasm-ast-types";

import fromPartial from '../generators/from-partial';
import reactQuery from '../generators/react-query';
import recoil from '../generators/recoil';
import tsClient from '../generators/ts-client';

import { basename } from 'path';
import { readSchemas } from '../utils';

import deepmerge from 'deepmerge';
import { pascal } from "case";

const defaultOpts = {
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
    }
}

export interface TSBuilderInput {
    contracts: Array<ContractFile | string>;
    outPath: string;
    options?: TSBuilderOptions;
};

export interface TSBuilderOptions {
    tsClient?: TSClientOptions & { enabled: true };
    reactQuery?: ReactQueryOptions & { enabled: true };
    recoil?: { enabled: true };
    messageComposer?: { enabled: true };
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

    readonly typeFiles: BuilderFile[] = [];
    readonly tsClientFiles: BuilderFile[] = [];
    readonly recoilFiles: BuilderFile[] = [];
    readonly reactQueryFiles: BuilderFile[] = [];

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
        await tsClient(contract.name, schemas, this.outPath, options);
    }

    async renderRecoil(contract: ContractFile) {
        const { enabled, ...options } = this.options.recoil;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        await recoil(contract.name, schemas, this.outPath, options);
    }

    async renderReactQuery(contract: ContractFile) {
        const { enabled, ...options } = this.options.reactQuery;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        await reactQuery(contract.name, schemas, this.outPath, options);
    }

    async renderMessageComposer(contract: ContractFile) {
        const { enabled, ...options } = this.options.messageComposer;
        if (!enabled) return;
        const schemas = await readSchemas({ schemaDir: contract.dir });
        await fromPartial(contract.name, schemas, this.outPath, options);
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