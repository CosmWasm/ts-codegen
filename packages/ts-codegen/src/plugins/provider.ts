import { pascal } from "case";
import * as w from "wasm-ast-types";
import { ContractInfo, RenderContextBase, RenderContext } from "wasm-ast-types";
import { BuilderFileType, TSBuilderOptions } from "../builder";
import { BuilderPluginBase } from "./plugin-base";

export class ContractsContextProviderPlugin extends BuilderPluginBase<TSBuilderOptions> {
  constructor(opt: TSBuilderOptions) {
    super(opt);

    this.utils = {
      ContractBase: "__contractContextBase__",
      IContractConstructor: "__contractContextBase__",
      EmptyClient: "__contractContextBase__",
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

    const providerInfo = context.getProviderInfos()[name];

    if (!Object.keys(providerInfo)?.length) {
      return;
    }

    context.addUtil("ContractBase");
    context.addUtil("IContractConstructor");

    const localname = pascal(name) + ".provider.ts";
    let needEmptyClientType = false;

    const body = [];

    const signClientProviderInfo =
      providerInfo[w.PROVIDER_TYPES.SIGNING_CLIENT_TYPE];

    if (signClientProviderInfo) {
      body.push(
        w.importStmt(
          [signClientProviderInfo.classname],
          `./${signClientProviderInfo.basename}`
        )
      );
    } else {
      needEmptyClientType = true;
    }

    const queryClientProviderInfo =
      providerInfo[w.PROVIDER_TYPES.QUERY_CLIENT_TYPE];

    if (queryClientProviderInfo) {
      body.push(
        w.importStmt(
          [queryClientProviderInfo.classname],
          `./${queryClientProviderInfo.basename}`
        )
      );
    } else {
      needEmptyClientType = true;
    }

    const messageComposerProviderInfo =
      providerInfo[w.PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE];

    if (messageComposerProviderInfo) {
      body.push(
        w.importStmt(
          [messageComposerProviderInfo.classname],
          `./${messageComposerProviderInfo.basename}`
        )
      );
    } else {
      needEmptyClientType = true;
    }

    if(needEmptyClientType){
      context.addUtil("EmptyClient")
    }

    body.push(w.createProvider(name, providerInfo));

    return [
      {
        type: "plugin",
        localname,
        body,
      },
    ];
  }
}
