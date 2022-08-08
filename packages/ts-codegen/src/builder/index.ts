import { TSClientOptions, ReactQueryOptions, defaultOptions } from "wasm-ast-types";
import deepmerge from 'deepmerge';

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
    reactQuery?: ReactQueryOptions & { enabled: true };
    tsClient?: TSClientOptions & { enabled: true };
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
}