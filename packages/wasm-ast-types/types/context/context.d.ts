import { JSONSchema } from "../types";
export interface ReactQueryOptions {
    enabled?: boolean;
    optionalClient?: boolean;
    version?: 'v3' | 'v4';
    mutations?: boolean;
    camelize?: boolean;
}
export interface TSClientOptions {
    enabled?: boolean;
}
export interface MessageComposerOptions {
    enabled?: boolean;
}
export interface RecoilOptions {
    enabled?: boolean;
}
export interface TSTypesOptions {
    enabled?: boolean;
    aliasExecuteMsg?: boolean;
}
export interface RenderOptions {
    types?: TSTypesOptions;
    recoil?: RecoilOptions;
    messageComposer?: MessageComposerOptions;
    client?: TSClientOptions;
    reactQuery?: ReactQueryOptions;
}
export interface RenderContext {
    schema: JSONSchema;
    options: RenderOptions;
}
export declare const defaultOptions: RenderOptions;
export declare class RenderContext implements RenderContext {
    schema: JSONSchema;
    utils: string[];
    constructor(schema: JSONSchema, options?: RenderOptions);
    refLookup($ref: string): JSONSchema;
    addUtil(util: string): void;
    getImports(): any[];
}
