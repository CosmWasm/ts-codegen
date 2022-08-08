import { TSClientOptions, ReactQueryOptions } from "wasm-ast-types";
export interface TSBuilderInput {
    contracts: Array<ContractFile | string>;
    outPath: string;
    options?: TSBuilderOptions;
}
export interface TSBuilderOptions {
    tsClient?: TSClientOptions & {
        enabled: boolean;
    };
    reactQuery?: ReactQueryOptions & {
        enabled: boolean;
    };
    recoil?: {
        enabled: boolean;
    };
    messageComposer?: {
        enabled: boolean;
    };
    bundle?: boolean;
}
export interface BuilderFile {
    contract: string;
    localname: string;
    filename: string;
}
export interface ContractFile {
    name: string;
    dir: string;
}
export declare class TSBuilder {
    contracts: Array<ContractFile | string>;
    outPath: string;
    options?: TSBuilderOptions;
    typesOnly?: boolean;
    protected tsClientFiles: BuilderFile[];
    protected recoilFiles: BuilderFile[];
    protected reactQueryFiles: BuilderFile[];
    protected messageComposerFiles: BuilderFile[];
    constructor({ contracts, outPath, options }: TSBuilderInput);
    getContracts(): ContractFile[];
    renderTsClient(contract: ContractFile): Promise<void>;
    renderRecoil(contract: ContractFile): Promise<void>;
    renderReactQuery(contract: ContractFile): Promise<void>;
    renderMessageComposer(contract: ContractFile): Promise<void>;
    build(): Promise<void>;
}
