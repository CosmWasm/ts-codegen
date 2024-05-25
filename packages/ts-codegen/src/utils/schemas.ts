import { ContractInfo } from '@cosmwasm/ts-codegen-ast';
import { ExecuteMsg, IDLObject, JSONSchema, QueryMsg } from '@cosmwasm/ts-codegen-types';
import { compile } from '@pyramation/json-schema-to-typescript';
import { readFileSync } from 'fs';
import { sync as glob } from 'glob';

import { cleanse } from './cleanse';
import { parser } from './parse';
interface ReadSchemaOpts {
  schemaDir: string;
  clean?: boolean;
};

export const readSchemas = async ({
  schemaDir, clean = true
}: ReadSchemaOpts): Promise<ContractInfo> => {
  const fn = clean ? cleanse : (schema: JSONSchema[] | Partial<IDLObject>) => schema;
  const files = glob(schemaDir + '/**/*.json')
    .filter(file => !file.match(/\/raw\//));

  const schemas: JSONSchema[] = files
    .map(file => JSON.parse(readFileSync(file, 'utf-8')));

  if (schemas.length > 1) {
    // legacy
    // TODO add console.warn here
    return {
      schemas: fn(schemas)
    };
  }

  if (schemas.length === 0) {
    throw new Error('Error [too few files]: requires one schema file per contract');
  }

  if (schemas.length !== 1) {
    throw new Error('Error [too many files]: CosmWasm v1.1 schemas supports one file');
  }

  const idlObject: Partial<IDLObject> = schemas[0] as Partial<IDLObject>;
  const {
    // contract_name,
    // contract_version,
    idl_version,
    responses,
    instantiate,
    execute,
    query,
    migrate,
    sudo
  } = idlObject;

  if (typeof idl_version !== 'string') {
    // legacy
    return {
      schemas: fn(schemas)
    };
  }

  // TODO use contract_name, etc.
  const idl: Partial<IDLObject> = {
    instantiate,
    execute,
    query,
    migrate,
    sudo
  };
  return {
    schemas: [
      ...Object.values(fn(idl)).filter(Boolean),
      ...Object.values(fn({ ...responses })).filter(Boolean)
    ],
    responses,
    idlObject
  };
};

export const findQueryMsg = (schemas: JSONSchema[]): QueryMsg => {
  const queryMsg = schemas.find(schema => schema.title === 'QueryMsg');
  return queryMsg as QueryMsg;
};

export const findExecuteMsg = (schemas: JSONSchema[]): ExecuteMsg => {
  const executeMsg = schemas.find(schema =>
    schema.title.startsWith('ExecuteMsg')
  );
  return executeMsg as ExecuteMsg;
};

export const findAndParseTypes = async (schemas: JSONSchema[]) => {
  const Types = schemas;
  const allTypes = [];
  for (const typ in Types) {
    if (Types[typ].definitions) {
      for (const key of Object.keys(Types[typ].definitions)) {
        // set title
        Types[typ].definitions[key].title = key;
      }
    }
    const result = await compile(Types[typ] as any, Types[typ].title);
    allTypes.push(result);
  }
  const typeHash = parser(allTypes);
  return typeHash;
};
