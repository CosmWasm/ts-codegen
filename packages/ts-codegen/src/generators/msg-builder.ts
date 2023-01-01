import { pascal } from "case";
import { header } from "../utils/header";
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from "wasm-ast-types";
import * as t from "@babel/types";
import { writeFileSync } from "fs";
import generate from "@babel/generator";
import { ContractInfo, getMessageProperties } from "wasm-ast-types";
import { findAndParseTypes, findExecuteMsg, findQueryMsg } from '../utils';
import { RenderContext, MsgBuilderOptions } from 'wasm-ast-types';
import { BuilderFile } from "../builder";

export default async (
  name: string,
  contractInfo: ContractInfo,
  outPath: string,
  msgBuilderOptions?: MsgBuilderOptions
): Promise<BuilderFile[]> => {
  const { schemas } = contractInfo;
  const context = new RenderContext(contractInfo, {
    msgBuilder: msgBuilderOptions ?? {},
  });
  // const options = context.options.msgBuilder;

  const localname = pascal(name) + ".msg-builder.ts";
  const TypesFile = pascal(name) + ".types";
  const ExecuteMsg = findExecuteMsg(schemas);
  const typeHash = await findAndParseTypes(schemas);

  const body = [];

  body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));

  // execute messages
  if (ExecuteMsg) {
    const children = getMessageProperties(ExecuteMsg);
    if (children.length > 0) {
      const className = pascal(`${name}ExecuteMsgBuilder`);

      body.push(
        w.createMsgBuilderClass(context, className, ExecuteMsg)
      );
    }
  }

  const QueryMsg = findQueryMsg(schemas);
  // query messages
  if (QueryMsg) {
    const children = getMessageProperties(QueryMsg);
    if (children.length > 0) {
      const className = pascal(`${name}QueryMsgBuilder`);

      body.push(
        w.createMsgBuilderClass(context, className, QueryMsg)
      );
    }
  }

  if (typeHash.hasOwnProperty("Coin")) {
    // @ts-ignore
    delete context.utils.Coin;
  }
  const imports = context.getImports();
  const code = header + generate(t.program([...imports, ...body])).code;

  mkdirp(outPath);
  writeFileSync(join(outPath, localname), code);

  return [
    {
      type: "msg-builder",
      contract: name,
      localname,
      filename: join(outPath, localname),
    },
  ];
};
