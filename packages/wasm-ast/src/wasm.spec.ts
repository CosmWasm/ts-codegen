import { contractClass } from './wasm';
import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

const expectCode = (ast) => {
    expect(
        generate(ast).code
    ).toMatchSnapshot();
}

const printCode = (ast) => {
    console.log(
        generate(ast).code
    );
}

it('top import', async () => {
    expectCode(
        importStmt([
            'CosmWasmClient',
            'ExecuteResult',
            'SigningCosmWasmClient'
        ], '@cosmjs/cosmwasm-stargate')
    );
});

it('class', async () => {

    printCode(
        t.exportNamedDeclaration(
            t.tsInterfaceDeclaration(
                t.identifier('SG721ReadOnlyInstance'),
                null,
                [],
                t.tSInterfaceBody(
                    [
                        t.tSPropertySignature(
                            t.identifier('contractAddress'),
                            t.tsTypeAnnotation(
                                t.tsStringKeyword()
                            )
                        )
                    ]
                )
            )
        )


    )

});
