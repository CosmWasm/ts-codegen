import { JSONSchema } from "../types";
import deepmerge from "deepmerge";

/// Plugin Types
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
/// END Plugin Types

export interface RenderOptions {
    tsClient: TSClientOptions;
    reactQuery: ReactQueryOptions;
}

export interface RenderContext {
    schema: JSONSchema;
    options: RenderOptions;
}

export const defaultOptions: RenderOptions = {
    tsClient: {
        aliasExecuteMsg: false
    },
    reactQuery: {
        optionalClient: false,
        version: 'v3',
        mutations: false,
        camelize: true
    }
};

export class RenderContext implements RenderContext {
    schema: JSONSchema;
    constructor(
        schema: JSONSchema,
        options?: RenderOptions
    ) {
        this.schema = schema;
        this.options = deepmerge(defaultOptions, options ?? {});
    }
    refLookup($ref: string) {
        const refName = $ref.replace('#/definitions/', '')
        return this.schema.definitions?.[refName];
    }
}