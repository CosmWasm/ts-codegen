import { RenderOptions, BuilderContext } from "wasm-ast-types";
import { IBuilderPlugin } from '../plugins';
export interface TSBuilderInput {
    contracts: Array<ContractFile | string>;
    outPath: string;
    options?: TSBuilderOptions;
    plugins?: IBuilderPlugin[];
}
export interface BundleOptions {
    enabled?: boolean;
    scope?: string;
    bundleFile?: string;
    bundlePath?: string;
}
export interface UseContractsOptions {
    enabled?: boolean;
    filename?: string;
}
export type TSBuilderOptions = {
    bundle?: BundleOptions;
    useContractsHooks?: UseContractsOptions;
} & RenderOptions;
export type BuilderFileType = 'type' | 'client' | 'recoil' | 'react-query' | 'message-composer' | 'msg-builder' | 'plugin';
export interface BuilderFile {
    type: BuilderFileType;
    pluginType?: string;
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
    plugins: IBuilderPlugin[];
    builderContext: BuilderContext;
    protected files: BuilderFile[];
    loadDefaultPlugins(): void;
    constructor({ contracts, outPath, options, plugins }: TSBuilderInput);
    build(): Promise<void>;
    private process;
    private render;
    private after;
    bundle(): Promise<void>;
}
