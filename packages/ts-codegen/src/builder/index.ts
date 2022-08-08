import { TSClientOptions, ReactQueryOptions, defaultOptions } from "wasm-ast-types";

import fromPartial from '../generators/from-partial';
import reactQuery from '../generators/react-query';
import recoil from '../generators/recoil';
import tsClient from '../generators/ts-client';

import { dirname, basename } from 'path';
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
    contractDirs: string[];
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

export class TSBuilder {
    contractDirs: string[];
    outPath: string;
    options?: TSBuilderOptions;

    // TODO: separate types
    typesOnly?: boolean;

    readonly typeFiles: BuilderFile[] = [];
    readonly tsClientFiles: BuilderFile[] = [];
    readonly recoilFiles: BuilderFile[] = [];
    readonly reactQueryFiles: BuilderFile[] = [];

    constructor({ contractDirs, outPath, options }: TSBuilderInput) {
        this.contractDirs = contractDirs;
        this.outPath = outPath;
        this.options = deepmerge(
            deepmerge(
                defaultOptions,
                defaultOpts
            ),
            options ?? {}
        );
    }

    build() {
        this.contractDirs.forEach(schemaDir => {
            const schemas = readSchemas({ schemaDir });
            const name = basename(schemaDir);
            const contractName = pascal(name);
            console.log({
                contractName
            })
        });
    }
}