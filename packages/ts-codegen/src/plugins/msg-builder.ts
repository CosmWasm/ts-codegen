import { pascal } from 'case';
import * as w from 'wasm-ast-types';
import { findAndParseTypes, findQueryMsg, findExecuteMsg } from '../utils';
import {
  getMessageProperties,
  RenderContext,
  RenderContextBase,
  ContractInfo,
  RenderOptions
} from 'wasm-ast-types';
import { BuilderFileType } from '../builder';
import { BuilderPluginBase } from './plugin-base';

export class MsgBuilderPlugin extends BuilderPluginBase<RenderOptions> {
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
    const { enabled } = this.option.msgBuilder;

    if (!enabled) {
      return;
    }

    const { schemas } = context.contract;

    const localname = pascal(name) + '.msg-builder.ts';
    const TypesFile = pascal(name) + '.types';
    const ExecuteMsg = findExecuteMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

    const body = [];

    body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));
    body.push(w.importStmt(['CamelCasedProperties'], 'type-fest'));

    // execute messages
    if (ExecuteMsg) {
      const children = getMessageProperties(ExecuteMsg);
      if (children.length > 0) {
        const className = pascal(`${name}ExecuteMsgBuilder`);

        body.push(w.createMsgBuilderClass(context, className, ExecuteMsg));
      }
    }

    const QueryMsg = findQueryMsg(schemas);
    // query messages
    if (QueryMsg) {
      const children = getMessageProperties(QueryMsg);
      if (children.length > 0) {
        const className = pascal(`${name}QueryMsgBuilder`);

        body.push(w.createMsgBuilderClass(context, className, QueryMsg));
      }
    }

    if (typeHash.hasOwnProperty('Coin')) {
      // @ts-ignore
      delete context.utils.Coin;
    }

    return [
      {
        type: 'msg-builder',
        localname,
        body
      }
    ];
  }
}
