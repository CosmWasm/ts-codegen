import { pascal } from "case";
import * as w from "wasm-ast-types";
import { findAndParseTypes, findExecuteMsg } from "../utils";
import {
  MessageComposerOptions,
  getMessageProperties,
  ContractInfo,
  RenderContextBase,
  RenderContext,
  RenderOptions,
} from "wasm-ast-types";
import { BuilderFileType } from "../builder";
import { BuilderPluginBase } from "./plugin-base";

export class MessageComposerPlugin extends BuilderPluginBase<RenderOptions> {
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
    const { enabled } = this.options.messageComposer;

    if (!enabled) {
      return;
    }

    const { schemas } = context.contract;

    const localname = pascal(name) + ".message-composer.ts";
    const TypesFile = pascal(name) + ".types";
    const ExecuteMsg = findExecuteMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

    const body = [];

    body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));

    // execute messages
    if (ExecuteMsg) {
      const children = getMessageProperties(ExecuteMsg);
      if (children.length > 0) {
        const TheClass = pascal(`${name}MsgComposer`);
        const Interface = pascal(`${name}Msg`);

        body.push(
          w.createMessageComposerInterface(context, Interface, ExecuteMsg)
        );
        body.push(
          w.createMessageComposerClass(context, TheClass, Interface, ExecuteMsg)
        );

        context.addProviderInfo(
          name,
          w.PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE,
          TheClass,
          localname
        );
      }
    }

    if (typeHash.hasOwnProperty("Coin")) {
      // @ts-ignore
      delete context.utils.Coin;
    }

    return [
      {
        type: "message-composer",
        localname,
        body,
      },
    ];
  }
}
