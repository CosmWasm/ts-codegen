import { pascal } from "case";
import { header } from './header';
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";
import { clean } from "./clean";
import { getMessageProperties } from "wasm-ast-types";
import { findAndParseTypes, findExecuteMsg, findQueryMsg } from "./utils";

export default async (name: string, schemas: any[], outPath: string) => {

  const Contract = pascal(`${name}Contract`) + '.ts';

  const QueryMsg = findQueryMsg(schemas);
  const ExecuteMsg = findExecuteMsg(schemas);
  const typeHash = await findAndParseTypes(schemas);

  let Client = null;
  let Instance = null;
  let QueryClient = null;
  let ReadOnlyInstance = null;

  const body = [];
  body.push(
    w.importStmt(['CosmWasmClient', 'ExecuteResult', 'SigningCosmWasmClient'], '@cosmjs/cosmwasm-stargate')
  );

  if (typeHash.hasOwnProperty('Coin')) {
    body.push(
      w.importStmt(['StdFee'], '@cosmjs/amino')
    );
  } else {
    body.push(
      w.importStmt(['Coin', 'StdFee'], '@cosmjs/amino')
    );
  }


  // TYPES
  Object.values(typeHash).forEach((type: t.Node) => {
    body.push(
      clean(type)
    )
  });

  // alias the ExecuteMsg
  ExecuteMsg && body.push(
    t.exportNamedDeclaration(
      t.tsTypeAliasDeclaration(
        t.identifier(`${name}ExecuteMsg`),
        null,
        t.tsTypeReference(t.identifier('ExecuteMsg'))
      )
    )
  )


  // query messages
  if (QueryMsg) {

    QueryClient = pascal(`${name}QueryClient`);
    ReadOnlyInstance = pascal(`${name}ReadOnlyInterface`);

    body.push(
      w.createQueryInterface(ReadOnlyInstance, QueryMsg)
    );
    body.push(
      w.createQueryClass(QueryClient, ReadOnlyInstance, QueryMsg)
    );
  }

  // execute messages
  if (ExecuteMsg) {
    const children = getMessageProperties(ExecuteMsg);
    if (children.length > 0) {
      Client = pascal(`${name}Client`);
      Instance = pascal(`${name}Interface`);

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
  }

  const code = header + generate(
    t.program(body)
  ).code;

  mkdirp(outPath);
  writeFileSync(join(outPath, Contract), code);
};
