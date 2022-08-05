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

export const renderType = (
    schema: JsonSchemaObject,
    prop: string
) => {
    const properties = schema.properties ?? {};
    const type = properties[prop].type;

    switch (type) {
        case 'string':
            return t.tsStringKeyword();
        case 'boolean':
            return t.tSBooleanKeyword();
        case 'integer':
            return t.tsNumberKeyword();
        case 'object':
            if (properties[prop].properties) {
                const childSchema: JsonSchemaObject = properties[prop];
                return t.tsTypeLiteral(
                    Object.keys(childSchema.properties).map(property => {
                        return renderProperty(childSchema, property);
                    })
                );
            }
            return t.tsObjectKeyword();
        default:
            throw new Error('renderType() contact maintainers [unknown type]: ' + type);
    }
}

export const renderProperty = (
    schema: JsonSchemaObject,
    prop: string
) => {
    return tsPropertySignature(
        t.identifier(prop),
        t.tsTypeAnnotation(
            renderType(schema, prop)
        ),
        !schema.required?.includes?.(prop)
    );
};