import { pascal } from 'case';
import * as w from 'wasm-ast-types';
import { findAndParseTypes, findExecuteMsg, findQueryMsg } from '../utils';
import {
  getMessageProperties,
  ContractInfo,
  RenderOptions,
  RenderContextBase,
  RenderContext, createAbstractAppQueryFactory
} from 'wasm-ast-types';
import { BuilderFileType } from '../builder';
import { BuilderPluginBase } from './plugin-base';

export class AbstractAppPlugin extends BuilderPluginBase<RenderOptions> {
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
    const options = this.option.abstractApp ?? {};

    const { enabled } = options;

    if (!enabled) {
      return;
    }

    const { schemas } = context.contract;

    const localname = pascal(`${name}`) + '.app-client.ts';
    const ContractFile = pascal(`${name}`) + '.client';
    const TypesFile = pascal(`${name}`) + '.types';

    const QueryMsg = findQueryMsg(schemas);
    const ExecuteMsg = findExecuteMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

    const ExecuteClient = pascal(`${name}Client`);
    const queryClientName = pascal(`${name}QueryClient`);
    const moduleName = pascal(name);

    const body = [];

    const clientImports = [];

    // TODO: push message builder
    if (QueryMsg) {
      clientImports.push(queryClientName);
    }

    // general contract imports
    body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));

    // client imports
    body.push(w.importStmt(clientImports, `./${ContractFile}`));

    // query messages
    if (QueryMsg) {
      [].push.apply(
        body,
        w.createAbstractAppClass(context, queryClientName, QueryMsg)
      );
      if (options.queryFactory) {
        [].push.apply(
          body,
          w.createAbstractAppQueryFactory(context, moduleName, QueryMsg)
        );
      }
    }

    if (typeHash.hasOwnProperty('Coin')) {
      // @ts-ignore
      delete context.utils.Coin;
    }

    return [
      {
        type: 'abstract-app',
        localname,
        body
      }
    ];
  }
}
