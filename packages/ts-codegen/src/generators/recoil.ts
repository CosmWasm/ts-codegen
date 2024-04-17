import { pascal } from "case";
import { header } from '../utils/header';
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";
import { findAndParseTypes, findQueryMsg } from "../utils";
import { ContractInfo, RenderContext, RecoilOptions } from "wasm-ast-types";
import { BuilderFile } from "../builder";

export default async (
  name: string,
  contractInfo: ContractInfo,
  outPath: string,
  recoilOptions?: RecoilOptions
): Promise<BuilderFile[]> => {

  const { schemas } = contractInfo;
  const context = new RenderContext(contractInfo, {
    recoil: recoilOptions ?? {}
  });
  const options = context.options.recoil;

  const localname = pascal(name) + '.recoil.ts';
  const ContractFile = pascal(name) + '.client';
  const TypesFile = pascal(name) + '.types';

  const QueryMsg = findQueryMsg(schemas);
  const typeHash = await findAndParseTypes(schemas);

  let QueryClient = null;
  let ReadOnlyInstance = null;

  const body = [];

  body.push(
    w.importStmt(['cosmWasmClient'], './chain')
  );

  body.push(
    w.importStmt(Object.keys(typeHash), `./${TypesFile}`)
  );

  // query messages
  if (QueryMsg) {

    QueryClient = pascal(`${name}QueryClient`);
    ReadOnlyInstance = pascal(`${name}ReadOnlyInterface`);

    body.push(
      w.importStmt([QueryClient], `./${ContractFile}`)
    );

    body.push(w.createRecoilQueryClientType());
    body.push(w.createRecoilQueryClient(
      context,
      name,
      QueryClient
    ));

    const selectors = w.createRecoilSelectors(context, name, QueryClient, QueryMsg);
    body.push(...selectors);

  }

  if (typeHash.hasOwnProperty('Coin')) {
    // @ts-ignore
    delete context.utils.Coin;
  }
  const imports = context.getImports();
  const code = header + generate(
    // @ts-ignore
    t.program([
      ...imports,
      ...body
    ])
  ).code;

  mkdirp(outPath);
  writeFileSync(join(outPath, localname), code);

  return [
    {
      type: 'recoil',
      contract: name,
      localname,
      filename: join(outPath, localname),
    }
  ]
};
