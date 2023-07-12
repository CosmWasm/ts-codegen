import { pascal } from "case";
import * as w from "wasm-ast-types";
import { findAndParseTypes, findExecuteMsg } from "../utils";
import {
  getMessageProperties,
  ContractInfo,
  RenderContextBase,
  RenderContext,
  RenderOptions,
} from "wasm-ast-types";
import { BuilderFileType, TSBuilder, TSBuilderOptions } from "../builder";
import { BuilderPluginBase } from "./plugin-base";
import { TYPE as SIGN_CLIENT_TYPE, QUERY_CLIENT_TYPE } from "./client";
import { TYPE as MESSAGE_COMPOSER_TYPE } from "./message-composer";

export class ContractsContextProviderPlugin extends BuilderPluginBase<TSBuilderOptions> {
  constructor(opt: TSBuilderOptions) {
    super(opt);

    this.utils = {
      ContractBase: "__contractContextBase__",
      IContractConstructor: "__contractContextBase__",
      getSigningClientDefault: "__contractContextBase__",
      getQueryClientDefault: "__contractContextBase__",
      getMessageComposerDefault: "__contractContextBase__",
    };
  }

  initContext(
    contract: ContractInfo,
    options?: TSBuilderOptions
  ): RenderContextBase<TSBuilderOptions> {
    return new RenderContext(contract, options, this.builder.builderContext);
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
    if (!this.option?.useContracts?.enabled) {
      return;
    }

    if (!Object.keys(context.getProviderInfos())?.length) {
      return;
    }

    context.addUtil("ContractBase");
    const localname = pascal(name) + ".provider.ts";

    const body = [];

    const signClientProviderInfo = context.getProviderInfos()[SIGN_CLIENT_TYPE];

    if (signClientProviderInfo) {
      context.addUtil("getSigningClientDefault");

      body.push(
        w.importStmt(
          [signClientProviderInfo.classname],
          `./${signClientProviderInfo.filename}`
        )
      );
    }

    const queryClientProviderInfo =
      context.getProviderInfos()[QUERY_CLIENT_TYPE];

    if (queryClientProviderInfo) {
      context.addUtil("getQueryClientDefault");

      body.push(
        w.importStmt(
          [queryClientProviderInfo.classname],
          `./${queryClientProviderInfo.filename}`
        )
      );
    }

    const messageComposerProviderInfo =
      context.getProviderInfos()[MESSAGE_COMPOSER_TYPE];

    if (messageComposerProviderInfo) {
      context.addUtil("getMessageComposerDefault");

      body.push(
        w.importStmt(
          [messageComposerProviderInfo.classname],
          `./${messageComposerProviderInfo.filename}`
        )
      );
    }

    body.push(w.createProvider(name));

    return [
      {
        type: "plugin",
        localname,
        body,
      },
    ];
  }
}
