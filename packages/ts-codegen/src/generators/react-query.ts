import { pascal } from 'case';
import { header } from '../utils/header';
import { join } from 'path';
import { sync as mkdirp } from 'mkdirp';
import * as w from 'wasm-ast-types';
import { RenderContext } from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from '@babel/generator';
import { findAndParseTypes, findExecuteMsg, findQueryMsg } from '../utils';
import {
  getMessageProperties,
  ReactQueryOptions,
  ContractInfo
} from 'wasm-ast-types';
import { BuilderFile } from '../builder';

export default async (
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  reactQueryOptions?: ReactQueryOptions
): Promise<BuilderFile[]> => {
  const { schemas } = contractInfo;
  const context = new RenderContext(contractInfo, {
    reactQuery: reactQueryOptions ?? {}
  });
  const options = context.options.reactQuery;

  const localname = pascal(`${contractName}`) + '.react-query.ts';
  const ContractFile =
    pascal(`${contractName}`) + `client`;
  const TypesFile = pascal(`${contractName}`) + '.types';

  const QueryMsg = findQueryMsg(schemas);
  const ExecuteMsg = findExecuteMsg(schemas);
  const typeHash = await findAndParseTypes(schemas);

  const isAbstractApp = context.options.abstractApp?.enabled;

  const ExecuteClient = pascal(
    `${contractName}${isAbstractApp ? 'App' : ''}Client`
  );
  const QueryClient = pascal(
    `${contractName}${isAbstractApp ? 'App' : ''}QueryClient`
  );

  const body = [];

  const clientImports = [];

  if (QueryMsg) {
    clientImports.push(QueryClient);
  }

  // check that there are commands within the exec msg
  const shouldGenerateMutationHooks =
    ExecuteMsg &&
    options?.version === 'v4' &&
    options?.mutations &&
    getMessageProperties(ExecuteMsg).length > 0;

  if (shouldGenerateMutationHooks) {
    clientImports.push(ExecuteClient);
  }

  // general contract imports
  body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));

  // client imports
  body.push(w.importStmt(clientImports, `./${ContractFile}`));

  // query messages
  if (QueryMsg) {
    [].push.apply(
      body,
      w.createReactQueryHooks({
        context,
        queryMsg: QueryMsg,
        contractName: contractName,
        QueryClient
      })
    );
  }

  if (shouldGenerateMutationHooks) {
    [].push.apply(
      body,
      w.createReactQueryMutationHooks({
        context,
        execMsg: ExecuteMsg,
        contractName: contractName,
        ExecuteClient
      })
    );
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
      type: 'react-query',
      contract: contractName,
      localname,
      filename: join(outPath, localname)
    }
  ];
};
