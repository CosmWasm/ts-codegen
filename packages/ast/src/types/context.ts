import { IDLObject, JSONSchema } from "@cosmwasm/ts-codegen-types";
import { MessageBuilderOptions, MessageComposerOptions, ReactQueryOptions, RecoilOptions, TSClientOptions, TSTypesOptions, UseContractsOptions } from "./plugins";

export interface ContractInfo {
  schemas: JSONSchema[];
  responses?: Record<string, JSONSchema>;
  idlObject?: Partial<IDLObject>;
};
export interface RenderOptions {
  enabled?: boolean;
  types?: TSTypesOptions;
  recoil?: RecoilOptions;
  messageComposer?: MessageComposerOptions;
  messageBuilder?: MessageBuilderOptions;
  client?: TSClientOptions;
  reactQuery?: ReactQueryOptions;
  useContractsHook?: UseContractsOptions;
}

export interface ProviderInfo {
  classname: string,
  filename: string,
  basename: string,
}
