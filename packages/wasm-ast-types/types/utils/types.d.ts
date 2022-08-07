import * as t from '@babel/types';
import { TSTypeAnnotation } from '@babel/types';
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
export interface JSONSchema {
    $ref?: string;
    $schema?: string;
    additionalProperties?: boolean;
    allOf?: JSONSchema[];
    anyOf?: JSONSchema[];
    definitions?: Record<string, JSONSchema>;
    description?: string;
    oneOf?: JSONSchema[];
    properties?: Record<string, JSONSchema>;
    patternProperties?: Record<string, JSONSchema>;
    items?: JSONSchema[] | JSONSchema;
    additionalItems?: JSONSchema;
    required?: string[];
    title?: string;
    type?: string;
}
export declare const getTypeFromRef: ($ref: any) => t.TSTypeReference;
export declare const getType: (type: any) => t.TSBooleanKeyword | t.TSNumberKeyword | t.TSStringKeyword;
export declare const getPropertyType: (context: RenderContext, schema: JSONSchema, prop: string) => {
    type: any;
    optional: boolean;
};
export declare function getPropertySignatureFromProp(context: RenderContext, jsonschema: JSONSchema, prop: string, camelize: boolean): {
    type: string;
    key: t.Identifier;
    typeAnnotation: t.TSTypeAnnotation;
    optional: boolean;
};
export declare const getParamsTypeAnnotation: (context: RenderContext, jsonschema: any, camelize?: boolean) => t.TSTypeAnnotation;
export declare const createTypedObjectParams: (context: RenderContext, jsonschema: JSONSchema, camelize?: boolean) => t.ObjectPattern;
