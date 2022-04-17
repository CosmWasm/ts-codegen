import { pascal } from "case";
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";
import { compile } from 'json-schema-to-typescript';

import { parser } from "./parse";

export default async (name: string, schemas: any[], outPath: string) => {

    const Contract = pascal(`${name}Contract`) + '.ts';

    const QueryMsg = schemas.find(schema => schema.title === 'QueryMsg');
    const ExecuteMsg = schemas.find(schema => schema.title === 'ExecuteMsg' || schema.title === 'ExecuteMsg_for_Empty');
    const Types = schemas.filter(schema => schema.title !== 'ExecuteMsg' && schema.title !== 'ExecuteMsg_for_Empty' && schema.title !== 'QueryMsg');

    const Client = pascal(`${name}Client`);
    const Instance = pascal(`${name}Instance`);
    const QueryClient = pascal(`${name}QueryClient`);
    const ReadOnlyInstance = pascal(`${name}ReadOnlyInstance`);

    const body = [];

    body.push(
        w.importStmt(['CosmWasmClient', 'ExecuteResult', 'SigningCosmWasmClient'], '@cosmjs/cosmwasm-stargate')
    );

    // TYPES
    const allTypes = [];
    for (const typ in Types) {
        const result = await compile(Types[typ], typ);
        allTypes.push(result);
    }
    const typeHash = parser(allTypes);
    Object.values(typeHash).forEach(type => {
        body.push(
            type
        )
    });


    // query messages
    if (QueryMsg) {
        body.push(
            w.createQueryInterface(ReadOnlyInstance, QueryMsg)
        );
        body.push(
            w.createQueryClass(QueryClient, ReadOnlyInstance, QueryMsg)
        );
    }

    // [ ] handle case: what if there is no QueryMsg?
    if (ExecuteMsg) {
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
    }

    const code = generate(
        t.program(body)
    ).code;

    mkdirp(outPath);
    writeFileSync(join(outPath, Contract), code);
};