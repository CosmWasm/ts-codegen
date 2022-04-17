import { pascal } from "case";
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";

export default (name: string, schemas: any[], outPath: string) => {

    const Contract = pascal(`${name}Contract`) + '.ts';

    const QueryMsg = schemas.find(schema => schema.title === 'QueryMsg');
    const ExecuteMsg = schemas.find(schema => schema.title === 'ExecuteMsg' || schema.title === 'ExecuteMsg_for_Empty');
    const Types = schemas.filter(schema => schema.title !== 'ExecuteMsg' && schema.title !== 'ExecuteMsg_for_Empty' && schema.title !== 'QueryMsg');

    if (!QueryMsg) {
        throw new Error('QueryMsg');
    }
    if (!ExecuteMsg) {
        throw new Error('ExecuteMsg');
    }

    const Client = pascal(`${name}Client`);
    const Instance = pascal(`${name}Instance`);
    const QueryClient = pascal(`${name}QueryClient`);
    const ReadOnlyInstance = pascal(`${name}ReadOnlyInstance`);

    const body = [];

    body.push(
        w.importStmt(['CosmWasmClient', 'ExecuteResult', 'SigningCosmWasmClient'], '@cosmjs/cosmwasm-stargate')
    );

    const definitions = {};
    Types.forEach(type => {
        Object.keys(type.definitions ?? {}).map(Defn => {
            definitions[Defn] = type.definitions[Defn];
        });
    });

    Object.keys(definitions).forEach(Defn => {
        try {
            // hack for some native types we don't yet parse...

            body.push(
                w.createTypeOrInterface(Defn, definitions[Defn])
            )
        } catch (e) {

        }
    });

    Types.forEach(type => {
        body.push(
            w.createTypeInterface(type)
        )
    });


    body.push(
        w.createQueryInterface(ReadOnlyInstance, QueryMsg)
    );
    body.push(
        w.createQueryClass(QueryClient, ReadOnlyInstance, QueryMsg)
    );
    body.push(
        w.createExecuteInterface(
            Instance,
            ReadOnlyInstance,
            ExecuteMsg
        )
    );
    body.push(
        w.createExecuteClass(
            Client,
            Instance,
            QueryClient,
            ExecuteMsg
        )
    );

    const code = generate(
        t.program(body)
    ).code;

    mkdirp(outPath);
    writeFileSync(join(outPath, Contract), code);
};