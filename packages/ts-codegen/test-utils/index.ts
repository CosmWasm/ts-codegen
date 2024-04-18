import {
  BuilderContext,
  ContractInfo,
  ReactQueryOptions,
  RenderOptions,
  TSTypesOptions,
} from "wasm-ast-types";
import { ReactQueryPlugin } from "../src/plugins/react-query";
import { TypesPlugin } from "../src/plugins/types";
import { ClientPlugin } from "../src/plugins/client";
import { MessageComposerPlugin } from "../src/plugins/message-composer";
import { RecoilPlugin } from "../src/plugins/recoil";
import { MessageBuilderPlugin } from "../src/plugins/message-builder";
import { ContractsContextProviderPlugin } from "../src/plugins/provider";
import { ContractsProviderBundlePlugin } from "../src/plugins/provider-bundle";
import { TSBuilderOptions } from "../src/builder";
import { createDefaultContractInfo } from "../src/utils/contracts";
import {
  TestContractsContextProviderPlugin,
  TestClientPlugin,
  TestMessageComposerPlugin,
  TestContractsProviderBundlePlugin,
} from "./testPlugins";
import deepmerge from "deepmerge";

export const testDefaultOptions: RenderOptions = {
  enabled: true,
  types: {
    enabled: true,
    itemsUseTuples: false,
    aliasExecuteMsg: false,
  },
  client: {
    enabled: true,
    execExtendsQuery: true,
    noImplicitOverride: false,
  },
  recoil: {
    enabled: true,
  },
  messageComposer: {
    enabled: true,
  },
  messageBuilder: {
    enabled: true,
  },
  reactQuery: {
    enabled: true,
    optionalClient: false,
    version: "v4",
    mutations: false,
    camelize: true,
    queryKeys: false,
  },
  useContractsHook: {
    enabled: true,
  },
};

export async function generateReactQuery(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: ReactQueryOptions
) {
  const options = opts
    ? deepmerge(testDefaultOptions, { reactQuery: opts })
    : testDefaultOptions;

  await new ReactQueryPlugin(options).render(
    outPath,
    contractName,
    contractInfo
  );
}

export async function generateTypes(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: TSTypesOptions
) {
  await new TypesPlugin(opts ?? testDefaultOptions).render(
    outPath,
    contractName,
    contractInfo
  );
}

export async function generateClient(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  builderContext?: BuilderContext,
  opts?: RenderOptions
) {
  if (builderContext) {
    await new TestClientPlugin(
      opts ?? testDefaultOptions,
      builderContext
    ).render(outPath, contractName, contractInfo);
  } else {
    await new ClientPlugin(opts ?? testDefaultOptions).render(
      outPath,
      contractName,
      contractInfo
    );
  }
}

export async function generateMessageComposer(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  builderContext?: BuilderContext,
  opts?: RenderOptions
) {
  if (builderContext) {
    await new TestMessageComposerPlugin(
      opts ?? testDefaultOptions,
      builderContext
    ).render(outPath, contractName, contractInfo);
  } else {
    await new MessageComposerPlugin(opts ?? testDefaultOptions).render(
      outPath,
      contractName,
      contractInfo
    );
  }
}

export async function generateMessageBuilder(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: RenderOptions
) {
  await new MessageBuilderPlugin(opts ?? testDefaultOptions).render(
    outPath,
    contractName,
    contractInfo
  );
}

export async function generateRecoil(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: RenderOptions
) {
  await new RecoilPlugin(opts ?? testDefaultOptions).render(
    outPath,
    contractName,
    contractInfo
  );
}

export async function generateContractHooks(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  builderContext?: BuilderContext
) {
  await new TestContractsContextProviderPlugin(
    {
      enabled: true,
      useShorthandCtor: true,
      useContractsHook: {
        enabled: true,
      },
    },
    builderContext
  ).render(outPath, contractName, contractInfo);

  await new TestContractsProviderBundlePlugin(
    {
      enabled: true,
      useShorthandCtor: true,
      useContractsHook: {
        enabled: true,
      },
    },
    builderContext
  ).render(outPath, undefined, contractInfo ?? createDefaultContractInfo());
}
