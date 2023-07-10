import { pascal } from 'case';
import * as w from 'wasm-ast-types';
import { findAndParseTypes, findExecuteMsg, findQueryMsg } from '../utils';
import {
  getMessageProperties,
  ContractInfo,
  RenderOptions,
  RenderContextBase,
  RenderContext
} from 'wasm-ast-types';
import { BuilderFileType } from '../builder';
import { BuilderPluginBase } from './plugin-base';

export class ReactQueryPlugin extends BuilderPluginBase<RenderOptions> {
  initContext(
    contract: ContractInfo,
    options?: RenderOptions
  ): RenderContextBase<RenderOptions> {
    return new RenderContext(contract, options);
  }

  async doRender(
    name: string,
    context: RenderContext
  ): Promise<
    {
      type: BuilderFileType;
      pluginType?: string;
      localname: string;
      body: any[];
    }[]
  > {
    const options = this.option.reactQuery;

    const { enabled } = options;

    if (!enabled) {
      return;
    }

    const { schemas } = context.contract;


    const localname = pascal(`${name}`) + '.react-query.ts';
    const ContractFile = pascal(`${name}`) + `.client`;
    const TypesFile = pascal(`${name}`) + '.types';

    const QueryMsg = findQueryMsg(schemas);
    const ExecuteMsg = findExecuteMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

    const isAbstractApp = context.options.abstractApp?.enabled;

    const ExecuteClient = pascal(`${name}${isAbstractApp ? 'App' : ''}Client`);
    const QueryClient = pascal(
      `${name}${isAbstractApp ? 'App' : ''}QueryClient`
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
          contractName: name,
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
          contractName: name,
          ExecuteClient
        })
      );
    }

    if (typeHash.hasOwnProperty('Coin')) {
      // @ts-ignore
      delete context.utils.Coin;
    }

    return [
      {
        type: 'react-query',
        localname,
        body
      }
    ];
  }
}
