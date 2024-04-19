import {
  BuilderContext,
  ContractInfo,
  RenderContext,
  RenderContextBase,
  RenderOptions,
} from "wasm-ast-types";
import { ClientPlugin, MessageComposerPlugin, TSBuilderOptions } from "../src";
import { ContractsContextProviderPlugin } from "../src/plugins/provider";
import { ContractsProviderBundlePlugin } from "../src/plugins/provider-bundle";

export class TestClientPlugin extends ClientPlugin {
  builderContext: BuilderContext;

  constructor(opts: RenderOptions, builderContext: BuilderContext) {
    super(opts);
    this.builderContext = builderContext;
  }

  initContext(
    contract: ContractInfo,
    options?: RenderOptions
  ): RenderContextBase<RenderOptions> {
    return new RenderContext(contract, options, this.builderContext);
  }
}

export class TestMessageComposerPlugin extends MessageComposerPlugin {
  builderContext: BuilderContext;

  constructor(opts: RenderOptions, builderContext: BuilderContext) {
    super(opts);
    this.builderContext = builderContext;
  }

  initContext(
    contract: ContractInfo,
    options?: RenderOptions
  ): RenderContextBase<RenderOptions> {
    return new RenderContext(contract, options, this.builderContext);
  }
}

export class TestContractsContextProviderPlugin extends ContractsContextProviderPlugin {
  builderContext: BuilderContext;

  constructor(opts: TSBuilderOptions, builderContext: BuilderContext) {
    super(opts);
    this.builderContext = builderContext;
  }

  initContext(
    contract: ContractInfo,
    options?: TSBuilderOptions
  ): RenderContextBase<TSBuilderOptions> {
    return new RenderContext(contract, options, this.builderContext);
  }
}

export class TestContractsProviderBundlePlugin extends ContractsProviderBundlePlugin {
  builderContext: BuilderContext;

  constructor(opts: TSBuilderOptions, builderContext: BuilderContext) {
    super(opts);
    this.builderContext = builderContext;
  }

  initContext(
    contract: ContractInfo,
    options?: TSBuilderOptions
  ): RenderContextBase<TSBuilderOptions> {
    return new RenderContext(contract, options, this.builderContext);
  }
}
