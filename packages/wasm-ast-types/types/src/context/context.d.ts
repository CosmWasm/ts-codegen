import { JSONSchema } from "../types";
export interface RenderOptions {
}
export interface RenderContext {
    schema: JSONSchema;
    options: RenderOptions;
}
export declare class RenderContext implements RenderContext {
    schema: JSONSchema;
    constructor(schema: JSONSchema, options?: RenderOptions);
    refLookup($ref: string): JSONSchema;
}
