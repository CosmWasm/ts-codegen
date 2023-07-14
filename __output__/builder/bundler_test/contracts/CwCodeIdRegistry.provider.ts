/**
* This file was automatically generated by @cosmwasm/ts-codegen@latest.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { ContractBase, IContractConstructor } from "./contractContextBase";
import { CwCodeIdRegistryClient, CwCodeIdRegistryQueryClient } from "./CwCodeIdRegistry.client";
import { CwCodeIdRegistryMessageComposer } from "./CwCodeIdRegistry.message-composer";
export class CwCodeIdRegistry extends ContractBase<CwCodeIdRegistryClient, CwCodeIdRegistryQueryClient, CwCodeIdRegistryMessageComposer> {
  constructor({
    address,
    cosmWasmClient,
    signingCosmWasmClient
  }: IContractConstructor) {
    super(address, cosmWasmClient, signingCosmWasmClient, CwCodeIdRegistryClient, CwCodeIdRegistryQueryClient, CwCodeIdRegistryMessageComposer);
  }

}