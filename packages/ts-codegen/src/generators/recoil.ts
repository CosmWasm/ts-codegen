import { pascal } from "case";
import { header } from '../utils/header';
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";
import { findAndParseTypes, findQueryMsg, getDefinitionSchema } from "../utils";
import { RenderContext } from "wasm-ast-types";

export default async (name: string, schemas: any[], outPath: string) => {

  const RecoilFile = pascal(`${name}Contract`) + '.recoil.ts';
  const Contract = pascal(`${name}Contract`) + '.ts';

  const QueryMsg = findQueryMsg(schemas);
  const typeHash = await findAndParseTypes(schemas);

  let QueryClient = null;
  let ReadOnlyInstance = null;

  const body = [];

  body.push(
    w.importStmt(['selectorFamily'], 'recoil')
  );

  body.push(
    w.importStmt(['cosmWasmClient'], './chain')
  );

  body.push(
    w.importStmt(Object.keys(typeHash), `./${Contract}`.replace(/\.ts$/, ''))
  );

  const context = new RenderContext(getDefinitionSchema(schemas));


  // query messages
  if (QueryMsg) {

    QueryClient = pascal(`${name}QueryClient`);
    ReadOnlyInstance = pascal(`${name}ReadOnlyInterface`);

    body.push(
      w.importStmt([QueryClient], `./${Contract}`)
    );

    body.push(w.createRecoilQueryClientType());
    body.push(w.createRecoilQueryClient(
      context,
      name,
      QueryClient
    ));

    [].push.apply(body,
      w.createRecoilSelectors(context, name, QueryClient, QueryMsg)
    );

  }

  const code = header + generate(
    t.program(body)
  ).code;

  mkdirp(outPath);
  writeFileSync(join(outPath, RecoilFile), code);
};