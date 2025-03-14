import * as t from '@babel/types';
import { identifier, tsPropertySignature } from '../utils';
export interface JsonSchemaObject {
    $ref?: string;
    type?: string;
    description?: string;
    required?: string[];
    properties?: object;
    additionalProperties?: boolean;
}
export interface JsonSchemaDefnObject {
    $schema?: string;
    title?: string;
    type?: string;
    description?: string;
    oneOf?: JsonSchemaObject[];
    anyOf?: JsonSchemaObject[];
    allOf?: JsonSchemaObject[];
    definitions?: Record<string, JsonSchemaDefnObject>;
}
export interface RenderType {
    type: string;
}
export interface JsonArrayObj {
    type: 'array',
    items: { type: string, format: string }[] | { type: string, [k: string]: any };
    maxItems?: number;
    minItems?: number;
}

export interface RenderOptions {
    optionalArrays: boolean;
}
export interface RenderContext {
    definitions?: any;
    options: RenderOptions;
}

const schemaPropertyKeys = (schema: JsonSchemaObject) => {
    return Object.keys(schema.properties ?? {});
}

export const createType = (
    context: RenderContext,
    schema: JsonSchemaDefnObject,
    name: string
) => {
    let key = null;
    if (schema.anyOf) key = 'anyOf';
    if (schema.oneOf) key = 'oneOf';
    if (schema.allOf) key = 'allOf';

    if (!key) {
        if (schema.type) {
            return t.exportNamedDeclaration(
                t.tsTypeAliasDeclaration(
                    t.identifier(name),
                    null,
                    renderType(schema)
                )
            )
        }
    }
    const members = schema[key].map(childSchema => {
        return renderSchema(
            context,
            childSchema
        );
    });

    if (key) {
        return t.exportNamedDeclaration(
            t.tsTypeAliasDeclaration(
                t.identifier(name),
                null,
                key === 'allOf' ?
                    t.tsIntersectionType(members) :
                    t.tsUnionType(members)
            )
        );
    }

    throw new Error('createType() schema')
};

export const additionalPropertiesUnknownType = (
    context: RenderContext,
    schema: JsonSchemaObject,
    prop: string
) => {
    return t.tsPropertySignature(
        t.identifier(prop),
        t.tsTypeAnnotation(
            t.tsTypeLiteral(
                [
                    t.tsIndexSignature(
                        [
                            identifier(
                                prop,
                                t.tsTypeAnnotation(
                                    t.tsStringKeyword()
                                )
                            )
                        ],
                        t.tsTypeAnnotation(
                            t.tsUnknownKeyword()
                        )
                    )
                ]
            )
        )
    );
};

export const renderType = (obj: RenderType) => {
    switch (obj.type) {
        case 'string':
            return t.tsStringKeyword();
        case 'boolean':
            return t.tSBooleanKeyword();
        case 'integer':
            return t.tsNumberKeyword();
        default:
            throw new Error('contact maintainers [unknown type]: ' + obj.type);
    }
}

export const renderObjectType = (
    context: RenderContext,
    schema: JsonSchemaObject,
    name: string
) => {
    const properties = schema.properties ?? {};
    if (properties[name].properties) {
        const childSchema: JsonSchemaObject = properties[name];
        return t.tsTypeLiteral(
            schemaPropertyKeys(childSchema)
                .map(property => {
                    return renderProperty(
                        context,
                        childSchema,
                        property
                    );
                })
        );
    }
    return t.tsObjectKeyword();
}

export const renderSchema = (
    context: RenderContext,
    schema: JsonSchemaObject
): t.TSTypeLiteral | t.TSTypeReference => {

    if (schema.$ref) {
        return getTypeFromRef(schema.$ref);
    }

    return t.tsTypeLiteral(schemaPropertyKeys(schema).map(key => {
        return renderProperty(
            context,
            schema,
            key
        );
    }));
}

const renderItemsTuple = (items: { type: string }[]) => {
    return t.tsTupleType(items.map(item => {
        return renderType(item)
    }))
};

const renderArrayType = (
    context: RenderContext,
    schema: JsonArrayObj
) => {
    if (Array.isArray(schema.items)) {
        if ((schema.minItems || schema.maxItems) && schema.maxItems === schema.minItems) {
            return renderItemsTuple(schema.items);
        }
        return t.tsArrayType(
            renderType(
                schema.items[0]
            )
        );
    }
    if (Array.isArray(schema)) {
        if ((schema.minItems || schema.maxItems) && schema.maxItems === schema.minItems) {
            return renderItemsTuple(schema);
        }
        return t.tsArrayType(
            renderType(
                schema[0]
            )
        );
    }

    switch (schema.items.type) {
        case 'array':
            if (context.options.optionalArrays) {
                return t.tsUnionType([
                    t.tsTupleType([]),
                    t.tsArrayType(
                        renderArrayType(
                            context,
                            schema.items.items
                        )
                    )
                ]);
            }
            return t.tsArrayType(
                renderArrayType(
                    context,
                    schema.items.items
                )
            );
    }
    throw new Error('renderArrayType() contact maintainer: unknown type')
}


const getTypeFromRef = ($ref) => {
    if ($ref?.startsWith('#/definitions/')) {
        return t.tsTypeReference(t.identifier($ref.replace('#/definitions/', '')))
    }
    throw new Error('what is $ref: ' + $ref);
}


export const renderTypeObjectProperty = (
    context: RenderContext,
    schema: JsonSchemaObject,
    name: string
) => {
    const properties = schema.properties ?? {};
    const prop = properties[name];
    const type = prop.type;

    switch (type) {
        case 'string':
            return t.tsStringKeyword();
        case 'boolean':
            return t.tSBooleanKeyword();
        case 'integer':
            return t.tsNumberKeyword();
        case 'object':
            return renderObjectType(
                context, schema, name
            );
        case 'array':
            if (context.options.optionalArrays) {
                return t.tsUnionType([
                    t.tsTupleType([]),
                    renderArrayType(context, prop)
                ]);
            }
            return renderArrayType(context, prop);
    }

    if (prop.$ref) {
        return getTypeFromRef(prop.$ref);
    }

    throw new Error('renderTypeObjectProperty() contact maintainers [unknown type]: ' + type);
}

export const renderProperty = (
    context: RenderContext,
    schema: JsonSchemaObject,
    prop: string
) => {
    return tsPropertySignature(
        t.identifier(prop),
        t.tsTypeAnnotation(
            renderTypeObjectProperty(
                context,
                schema,
                prop
            )
        ),
        !schema.required?.includes?.(prop)
    );
};

export const processTypes = (
    context: RenderContext,
    schema: JsonSchemaDefnObject
) => {
    const definitions = schema.definitions ?? {};
    const defns = Object.keys(definitions).map(name => {
        return createType(
            context,
            definitions[name],
            name
        );
    });

    const main = createType(
        context,
        schema,
        schema.title
    );

    return [
        main,
        ...defns
    ];
};