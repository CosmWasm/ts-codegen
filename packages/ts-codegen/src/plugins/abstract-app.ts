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
    const MsgBuilderFile = pascal(`${name}`) + '.msg-builder';
    const TypesFile = pascal(`${name}`) + '.types';

    const QueryMsg = findQueryMsg(schemas);
    const ExecuteMsg = findExecuteMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

    const appExecuteClientName = pascal(`${name}AppClient`);
    const appExecuteInterfaceName = pascal(`I${appExecuteClientName}`);
    const appQueryClientName = pascal(`${name}AppQueryClient`);
    const appQueryInterfaceName = pascal(`I${appQueryClientName}`);
    // TODO
    const moduleName = name;

    const body = [];

    const msgBuilderImports = [];
    if (QueryMsg) {
      // TODO: there might not be any execute methods, where we should not generate the connect method
      msgBuilderImports.push(`${pascal(moduleName)}QueryMsgBuilder`);
    }

    if (ExecuteMsg) {
      msgBuilderImports.push(`${pascal(moduleName)}ExecuteMsgBuilder`);
    }

    // general contract imports
    body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));

    // client imports
    body.push(w.importStmt(msgBuilderImports, `./${MsgBuilderFile}`));
    context.addUtil('CamelCasedProperties');

    // query messages
    if (QueryMsg) {
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

    return [
      {
        type: 'abstract-app',
        localname,
        body
      }
    ];
  }
}
