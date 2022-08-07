import { JSONSchema } from "../types";

export interface RenderOptions { }

export interface RenderContext {
    schema: JSONSchema;
    options: RenderOptions;
}

const defaultOptions = {

};

export class RenderContext implements RenderContext {
    schema: JSONSchema;
    constructor(
        schema: JSONSchema,
        options?: RenderOptions
    ) {
        this.schema = schema;
        if (options) this.options = options;
        else this.options = defaultOptions;
    }
    refLookup($ref: string) {
        const refName = $ref.replace('#/definitions/', '')
        return this.schema.definitions?.[refName];
    }
}