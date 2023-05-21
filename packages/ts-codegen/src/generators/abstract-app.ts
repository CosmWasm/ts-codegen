import { pascal } from 'case';
import { header } from '../utils/header';
import { join } from 'path';
import { sync as mkdirp } from 'mkdirp';
import * as w from 'wasm-ast-types';
import {
  AbstractAppOptions,
  ContractInfo, getMessageProperties,
  RenderContext
} from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from '@babel/generator';
import { findAndParseTypes, findExecuteMsg, findQueryMsg } from '../utils';
import { BuilderFile } from '../builder';

export default async (
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  abstractAppOptions?: AbstractAppOptions
): Promise<BuilderFile[]> => {
  const { schemas } = contractInfo;
  const context = new RenderContext(contractInfo, {
    abstractApp: abstractAppOptions ?? {}
  });
  const options = context.options.abstractApp;

  const localname = pascal(`${contractName}`) + '.app-client.ts';
  const ContractFile = pascal(`${contractName}`) + '.client';
  const MsgBuilderFile = pascal(`${contractName}`) + '.msg-builder';
  const TypesFile = pascal(`${contractName}`) + '.types';

  const QueryMsg = findQueryMsg(schemas);
  const ExecuteMsg = findExecuteMsg(schemas);
  const typeHash = await findAndParseTypes(schemas);

  const executeClientName = pascal(`${contractName}Client`);
  const queryClientName = pascal(`${contractName}QueryClient`);
  const appExecuteClientName = pascal(`${contractName}AppClient`);
  const appExecuteInterfaceName = pascal(`I${appExecuteClientName}`);
  const appQueryClientName = pascal(`${contractName}AppQueryClient`);
  const appQueryInterfaceName = pascal(`I${appQueryClientName}`);
  // TODO
  const moduleName = contractName;

  const body = [];

  const clientImports = [];
  const msgBuilderImports = [];
  if (QueryMsg) {
    clientImports.push(queryClientName);
    // TODO: there might not be any execute methods, where we should not generate the connect method
    // connect (xxx, yyy) -> executeClientName
    clientImports.push(executeClientName);
    msgBuilderImports.push(`${pascal(moduleName)}QueryMsgBuilder`);
  }

  if (ExecuteMsg) {
    msgBuilderImports.push(`${pascal(moduleName)}ExecuteMsgBuilder`);
  }

  // general contract imports
  body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));

  // client imports
  body.push(w.importStmt(clientImports, `./${ContractFile}`));
  body.push(w.importStmt(msgBuilderImports, `./${MsgBuilderFile}`));
  context.addUtil('CamelCasedProperties');

  // query messages
  if (QueryMsg) {
    console.log('QueryMsg', QueryMsg);

    body.push(
      w.createAppQueryInterface(
        context,
        appQueryInterfaceName,
        appExecuteClientName,
        QueryMsg
      )
    );

    body.push(
      w.createAppQueryClass(
        context,
        moduleName,
        appQueryClientName,
        appQueryInterfaceName,
        QueryMsg
      )
    );
  }

  // execute messages
  if (ExecuteMsg) {
    const children = getMessageProperties(ExecuteMsg);
    if (children.length > 0) {
      console.log('ExecuteMsg', ExecuteMsg);
      body.push(
        w.createAppExecuteInterface(
          context,
          appExecuteInterfaceName,
          appExecuteClientName,
          appQueryInterfaceName,
          ExecuteMsg
        )
      );

      body.push(
        w.createAppExecuteClass(
          context,
          moduleName,
          appExecuteClientName,
          appExecuteInterfaceName,
          appQueryClientName,
          ExecuteMsg
        )
      );
    }
  }

  if (typeHash.hasOwnProperty('Coin')) {
    // @ts-ignore
    delete context.utils.Coin;
  }
  const imports = context.getImports();
  const code = header + generate(t.program([...imports, ...body])).code;

  mkdirp(outPath);
  writeFileSync(join(outPath, localname), code);

  return [
    {
      type: 'abstract-app',
      contract: contractName,
      localname,
      filename: join(outPath, localname)
    }
  ];
};
