import { ExecuteMsg, JSONSchema, QueryMsg } from './types';

export interface KeyedSchema {
  [key: string]: JSONSchema;
}
export interface IDLObject {
  contract_name: string;
  contract_version: string;
  idl_version: string;
  instantiate: JSONSchema;
  execute: ExecuteMsg;
  query: QueryMsg;
  migrate: JSONSchema;
  sudo: JSONSchema;
  responses: KeyedSchema;
}