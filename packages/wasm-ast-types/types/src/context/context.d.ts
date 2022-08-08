import { JSONSchema } from "../types";
export interface ReactQueryOptions {
    optionalClient?: boolean;
    version?: 'v3' | 'v4';
    mutations?: boolean;
    camelize?: boolean;
}
export interface TSClientOptions {
    aliasExecuteMsg?: boolean;
}
export interface MessageComposerOptions {
}
export interface RecoilOptions {
}
export interface RenderOptions {
    tsClient: TSClientOptions;
    reactQuery: ReactQueryOptions;
}
export interface RenderContext {
    schema: JSONSchema;
    options: RenderOptions;
}
export declare const defaultOptions: RenderOptions;
export declare class RenderContext implements RenderContext {
    schema: JSONSchema;
    constructor(schema: JSONSchema, options?: RenderOptions);
    refLookup($ref: string): JSONSchema;
}
