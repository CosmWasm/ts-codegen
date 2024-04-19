import { pascal } from "case";
import * as w from "@cosmwasm/ts-codegen-ast";
import { ContractInfo, RenderContextBase, RenderContext } from "@cosmwasm/ts-codegen-ast";
import { BuilderFileType, TSBuilderOptions } from "../builder";
import { BuilderPluginBase } from "./plugin-base";
import { GetLocalBaseNameByContractName } from "./provider";

export class ContractsProviderBundlePlugin extends BuilderPluginBase<TSBuilderOptions> {
  constructor(opt?: TSBuilderOptions) {
    super(opt);

    this.lifecycle = "after";

    this.defaultContractName = "contractContextProviders";

    this.utils = {
      CosmWasmClient: "@cosmjs/cosmwasm-stargate",
      SigningCosmWasmClient: "@cosmjs/cosmwasm-stargate",
      IQueryClientProvider: "__contractContextBase__",
      ISigningClientProvider: "__contractContextBase__",
      IMessageComposerProvider: "__contractContextBase__",
    };
  }

  initContext(
    contract: ContractInfo,
    options?: TSBuilderOptions
  ): RenderContextBase<TSBuilderOptions> {
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
    if (!this.options?.useContractsHook?.enabled) {
      return;
    }

    const providerInfos = context.getProviderInfos();

    if (!Object.keys(providerInfos || {})?.length) {
      return;
    }

    const localname = "contractContextProviders.ts";

    const body = [];

    context.addUtil("CosmWasmClient");
    context.addUtil("SigningCosmWasmClient");

    context.addUtil("IQueryClientProvider");
    context.addUtil("ISigningClientProvider");
    context.addUtil("IMessageComposerProvider");

    for (const name in providerInfos) {
      if (Object.prototype.hasOwnProperty.call(providerInfos, name)) {
        const providerInfo = providerInfos[name];

        for (const key in providerInfo) {
          if (Object.prototype.hasOwnProperty.call(providerInfo, key)) {
            const info = providerInfo[key];

            body.push(
              w.importStmt(
                [info.classname],
                `./${info.basename}`
              )
            );
          }
        }

        body.push(
          w.importStmt(
            [pascal(name)],
            `./${GetLocalBaseNameByContractName(name)}`
          )
        );
      }
    }

    body.push(w.createIContractsContext(providerInfos));
    body.push(w.createGettingProviders(providerInfos));

    return [
      {
        type: "plugin",
        pluginType: "contractContextProviders",
        localname,
        body,
      },
    ];
  }
}
