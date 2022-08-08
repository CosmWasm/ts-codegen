import { TSClientOptions, ReactQueryOptions } from "wasm-ast-types";

export interface TSBuilderOptions {
    contractDirs: string[];
    outPath: string;

    // TODO: separate types
    typesOnly?: boolean;

    reactQuery?: ReactQueryOptions & { enabled: true };
    tsClient?: TSClientOptions & { enabled: true };
};