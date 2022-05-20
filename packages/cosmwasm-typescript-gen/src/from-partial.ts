import { pascal, kebab } from "case";
import { header } from './header';
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";
import { compile } from 'json-schema-to-typescript';
import { getMessageProperties } from "wasm-ast-types";

import { parser } from "./parse";

export default async (name: string, schemas: any[], outPath: string) => {

    const FromPartialFile = pascal(`${name}Contract`) + '.from-partial.ts';
    const Contract = pascal(`${name}Contract`) + '.ts';
    const ExecuteMsg = schemas.find(schema => schema.title === 'ExecuteMsg' || schema.title === 'ExecuteMsg_for_Empty');
    const Types = schemas.filter(schema => schema.title !== 'ExecuteMsg' && schema.title !== 'ExecuteMsg_for_Empty' && schema.title !== 'QueryMsg');

    const body = [];

    body.push(
        w.importStmt(['MsgExecuteContractEncodeObject'], 'cosmwasm')
    );
    body.push(
        w.importStmt(['MsgExecuteContract'], 'cosmjs-types/cosmwasm/wasm/v1/tx')
    );
    body.push(
        w.importStmt(['toUtf8'], '@cosmjs/encoding')
    );

    // TYPES
    const allTypes = [];
    for (const typ in Types) {
        const result = await compile(Types[typ], typ);
        allTypes.push(result);
    }
    const typeHash = parser(allTypes);
    body.push(
        w.importStmt(Object.keys(typeHash), `./${Contract}`)
    );


    // execute messages
    if (ExecuteMsg) {
        const children = getMessageProperties(ExecuteMsg);
        if (children.length > 0) {
            const TheClass = pascal(`${name}MessageComposer`);
            const Interface = pascal(`${name}Message`);

            body.push(
                w.createFromPartialInterface(
                    Interface,
                    ExecuteMsg
                )
            );
            body.push(
                w.createFromPartialClass(
                    TheClass,
                    Interface,
                    ExecuteMsg
                )
            );
        }
    }

    const code = header + generate(
        t.program(body)
    ).code;

    mkdirp(outPath);
    writeFileSync(join(outPath, FromPartialFile), code);
};