import * as t from '@babel/types';
import { identifier, tsPropertySignature } from './utils';

interface JsonSchemaObject {
    type: string;
    required?: string[];
    properties?: object;
    additionalProperties?: boolean;
}


export const createInterface = () => {
    return t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
            t.identifier('InstantiateMsg'),
            null,
            [],
            t.tsInterfaceBody([
                t.tsPropertySignature(
                    t.identifier('admin'),
                    t.tsTypeAnnotation(
                        t.tsUnionType(
                            [
                                t.tsStringKeyword(),
                                t.tsNullKeyword()
                            ]
                        )
                    )
                ),
                t.tsPropertySignature(
                    t.identifier('members'),
                    t.tsTypeAnnotation(
                        t.tsArrayType(
                            t.tsTypeReference(
                                t.identifier('Member')
                            )
                        )
                    )
                )
            ])
        )
    );
};

export const additionalPropertiesUnknownType = (
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

const renderArrayType1 = (schema, items) => {
    if (items.type === 'array') {
        if (Array.isArray(items.items)) {
            return t.tsArrayType(
                t.tsArrayType(
                    renderType(
                        items.items[0]
                    )
                )
            );
        } else {
            return t.tsArrayType(
                renderArrayType(
                    schema,
                    items.items
                )
            );
        }
    }
    return t.tsArrayType(
        renderType(items)
    );
}


interface RenderType {
    type: string;
}

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
            Object.keys(childSchema.properties).map(property => {
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

interface JsonArrayObj {
    type: 'array',
    items: { type: string, format: string }[] | { type: string, [k: string]: any };
    maxItems?: number;
    minItems?: number;
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
        if (schema.maxItems === schema.minItems) {
            return renderItemsTuple(schema.items);
        }
        return t.tsArrayType(
            renderType(
                schema.items[0]
            )
        );
    }
    if (Array.isArray(schema)) {
        if (schema.maxItems === schema.minItems) {
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
        default:
            throw new Error('renderTypeObjectProperty() contact maintainers [unknown type]: ' + type);
    }
}

export interface RenderOptions {
    optionalArrays: boolean;
}
export interface RenderContext {
    definitions?: any;
    options: RenderOptions;
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