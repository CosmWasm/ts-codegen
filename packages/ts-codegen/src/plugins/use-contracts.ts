import { pascal } from 'case';
import * as w from 'wasm-ast-types';
import { findAndParseTypes, findExecuteMsg } from '../utils';
import {
  getMessageProperties,
  ContractInfo,
  RenderContextBase,
  RenderContext,
  RenderOptions
} from 'wasm-ast-types';
import { BuilderFileType, TSBuilderOptions } from '../builder';
import { BuilderPluginBase } from './plugin-base';

export class ContractsContextPlugin extends BuilderPluginBase<TSBuilderOptions> {
  initContext(
    contract: ContractInfo,
    options?: TSBuilderOptions
  ): RenderContextBase<TSBuilderOptions> {
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
    const { enabled } = this.option.useContracts;

    if (!enabled) {
      return;
    }

    const localname = pascal(name) + '.message-composer.ts';

    const TypesFile = pascal(name) + '.types';

    // const ExecuteMsg = findExecuteMsg(schemas);
    // const typeHash = await findAndParseTypes(schemas);

    const body = [];

    // body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));

    // // execute messages
    // if (ExecuteMsg) {
    //   const children = getMessageProperties(ExecuteMsg);
    //   if (children.length > 0) {
    //     const TheClass = pascal(`${name}MessageComposer`);
    //     const Interface = pascal(`${name}Message`);

    //     body.push(
    //       w.createMessageComposerInterface(context, Interface, ExecuteMsg)
    //     );
    //     body.push(
    //       w.createMessageComposerClass(context, TheClass, Interface, ExecuteMsg)
    //     );
    //   }
    // }

    // if (typeHash.hasOwnProperty('Coin')) {
    //   // @ts-ignore
    //   delete context.utils.Coin;
    // }

    return [
      {
        type: 'message-composer',
        localname,
        body
      }
    ];
  }
}
