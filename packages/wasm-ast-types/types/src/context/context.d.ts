import { JSONSchema } from "../types";
export interface ReactQueryOptions {
    optionalClient?: boolean;
    v4?: boolean;
    mutations?: boolean;
    camelize?: boolean;
}
export interface RenderOptions {
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
