import { pascal } from 'case';
import * as w from 'wasm-ast-types';
import { findExecuteMsg, findAndParseTypes, findQueryMsg } from '../utils';
import {
  RenderContext,
  ContractInfo,
  RenderContextBase,
  getMessageProperties,
  RenderOptions
} from 'wasm-ast-types';
import { BuilderFileType } from '../builder';
import { BuilderPluginBase } from './plugin-base';

export class ClientPlugin extends BuilderPluginBase<RenderOptions> {
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
    const { enabled } = this.option.client;

    if (!enabled) {
      return;
    }

    const { schemas } = context.contract;

    const localname = pascal(name) + '.client.ts';
    const TypesFile = pascal(name) + '.types';
    const QueryMsg = findQueryMsg(schemas);
    const ExecuteMsg = findExecuteMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

    let Client = null;
    let Instance = null;
    let QueryClient = null;
    let ReadOnlyInstance = null;

    const body = [];

    body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));

    // query messages
    if (QueryMsg) {
      QueryClient = pascal(`${name}QueryClient`);
      ReadOnlyInstance = pascal(`${name}ReadOnlyInterface`);

      body.push(w.createQueryInterface(context, ReadOnlyInstance, QueryMsg));
      body.push(
        w.createQueryClass(context, QueryClient, ReadOnlyInstance, QueryMsg)
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
            context,
            Instance,
            this.option.client.execExtendsQuery ? ReadOnlyInstance : null,
            ExecuteMsg
          )
        );

        body.push(
          w.createExecuteClass(
            context,
            Client,
            Instance,
            this.option.client.execExtendsQuery ? QueryClient : null,
            ExecuteMsg
          )
        );
      }
    }

    if (typeHash.hasOwnProperty('Coin')) {
      // @ts-ignore
      delete context.utils.Coin;
    }

    return [
      {
        type: 'client',
        localname,
        body
      }
    ];
  }
}
