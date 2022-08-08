import { pascal } from "case";
import { header } from '../utils/header';
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";
import { getMessageProperties } from "wasm-ast-types";
import { findAndParseTypes, findExecuteMsg, getDefinitionSchema } from "../utils";
import { RenderContext, MessageComposerOptions } from "wasm-ast-types";

export default async (
    name: string,
    schemas: any[],
    outPath: string,
    messageComposerOptions?: MessageComposerOptions
) => {

    const context = new RenderContext(getDefinitionSchema(schemas), {
        messageComposer: messageComposerOptions ?? {}
    });
    const options = context.options.messageComposer;

    const FromPartialFile = pascal(`${name}Contract`) + '.message-composer.ts';
    const Contract = pascal(`${name}Contract`);

    const ExecuteMsg = findExecuteMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

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

    if (!typeHash.hasOwnProperty('Coin')) {
        body.push(
            w.importStmt(['Coin'], '@cosmjs/amino')
        );
    }
    body.push(
        w.importStmt(Object.keys(typeHash), `./${Contract}`.replace(/\.ts$/, ''))
    );

    // execute messages
    if (ExecuteMsg) {
        const children = getMessageProperties(ExecuteMsg);
        if (children.length > 0) {
            const TheClass = pascal(`${name}MessageComposer`);
            const Interface = pascal(`${name}Message`);

            body.push(
                w.createMessageComposerInterface(
                    context,
                    Interface,
                    ExecuteMsg
                )
            );
            body.push(
                w.createMessageComposerClass(
                    context,
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