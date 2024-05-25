import * as w from '@cosmwasm/ts-codegen-ast';
import {
  ContractInfo,
  getMessageProperties,
  RenderContext,
  RenderContextBase,
  RenderOptions
} from '@cosmwasm/ts-codegen-ast';
import { pascal } from 'case';

import { BuilderFileType } from '../builder';
import { findAndParseTypes, findExecuteMsg,findQueryMsg } from '../utils';
import { BuilderPluginBase } from './plugin-base';

export class MessageBuilderPlugin extends BuilderPluginBase<RenderOptions> {
  initContext(
    contract: ContractInfo,
    options?: RenderOptions
  ): RenderContextBase<RenderOptions> {
    return new RenderContext(contract, options, this.builder?.builderContext);
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
    const { enabled } = this.options.messageBuilder;

    if (!enabled) {
      return;
    }

    const { schemas } = context.contract;

    const localname = pascal(name) + '.message-builder.ts';
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

        body.push(w.createMessageBuilderClass(context, className, ExecuteMsg));
      }
    }

    const QueryMsg = findQueryMsg(schemas);
    // query messages
    if (QueryMsg) {
      const children = getMessageProperties(QueryMsg);
      if (children.length > 0) {
        const className = pascal(`${name}QueryMsgBuilder`);

        body.push(w.createMessageBuilderClass(context, className, QueryMsg));
      }
    }

    if (typeHash.hasOwnProperty('Coin')) {
      // @ts-ignore
      delete context.utils.Coin;
    }

    return [
      {
        type: 'message-builder',
        localname,
        body
      }
    ];
  }
}
