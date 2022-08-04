import * as t from '@babel/types';

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