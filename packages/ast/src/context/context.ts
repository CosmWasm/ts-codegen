import * as t from '@babel/types';
import { JSONSchema } from "@cosmwasm/ts-codegen-types";
import { refLookup } from "../utils";
import { convertUtilsToImportList, getImportStatements, UtilMapping } from "./imports";
import deepmerge from "deepmerge";
import { basename, extname } from 'path'
import { ContractInfo, ProviderInfo, RenderOptions } from '../types';

export interface IContext {
  refLookup($ref: string): JSONSchema;
  addUtil(util: string): void;
  getImports(registeredUtils?: UtilMapping, filepath?: string): (t.ImportNamespaceSpecifier | t.ImportDeclaration | t.ImportDefaultSpecifier)[];
}

export interface IRenderContext<TOpt = RenderOptions> extends IContext {
  contract: ContractInfo;
  options: TOpt;

  addProviderInfo(contractName: string, type: string, classname: string, filename: string): void;
  getProviderInfos(): {
    [key: string]: {
      [key: string]: ProviderInfo;
    };
  };
}

export const defaultOptions: RenderOptions = {
  enabled: true,
  types: {
    enabled: true,
    itemsUseTuples: false,
    aliasExecuteMsg: false
  },
  client: {
    enabled: true,
    execExtendsQuery: true,
    noImplicitOverride: false,
  },
  recoil: {
    enabled: false
  },
  messageComposer: {
    enabled: false
  },
  messageBuilder: {
    enabled: false,
  },
  reactQuery: {
    enabled: false,
    optionalClient: false,
    version: 'v4',
    mutations: false,
    camelize: true,
    queryKeys: false
  },
  useContractsHook: {
    enabled: false
  }
};

export const getDefinitionSchema = (schemas: JSONSchema[]): JSONSchema => {
  const aggregateSchema = {
    definitions: {
      //
    }
  };

  schemas.forEach(schema => {
    schema.definitions = schema.definitions || {};
    aggregateSchema.definitions = {
      ...aggregateSchema.definitions,
      ...schema.definitions
    };
  });

  return aggregateSchema;
};

export class BuilderContext {
  providers: {
    [key: string]: {
      [key: string]: ProviderInfo;
    };
  } = {};

  addProviderInfo(contractName: string, type: string, classname: string, filename: string): void {
    if (!this.providers[contractName]) {
      this.providers[contractName] = {}
    }

    this.providers[contractName][type] = {
      classname,
      filename,
      basename: basename(filename, extname(filename))
    };
  }
  getProviderInfos(): {
    [key: string]: {
      [key: string]: ProviderInfo;
    };
  } {
    return this.providers;
  }
}

/**
 * context object for generating code.
 * only mergeDefaultOpt needs to implementing for combine options and default options.
 * @param TOpt option type
 */
export abstract class RenderContextBase<TOpt = RenderOptions> implements IRenderContext<TOpt> {
  builderContext: BuilderContext;
  contract: ContractInfo;
  utils: Record<string, boolean> = {};
  schema: JSONSchema;
  options: TOpt;

  constructor(
    contract: ContractInfo,
    options?: TOpt,
    builderContext?: BuilderContext
  ) {
    this.contract = contract;
    this.schema = getDefinitionSchema(contract.schemas);
    this.options = this.mergeDefaultOpt(options);
    this.builderContext = builderContext ?? new BuilderContext();
  }
  /**
   * merge options and default options
   * @param options
   */
  abstract mergeDefaultOpt(options: TOpt): TOpt;
  refLookup($ref: string): JSONSchema {
    return refLookup($ref, this.schema)
  }
  addUtil(util: string): void {
    this.utils[util] = true;
  }
  addProviderInfo(contractName: string, type: string, classname: string, filename: string): void {
    this.builderContext.addProviderInfo(contractName, type, classname, filename);
  }
  getProviderInfos(): {
    [key: string]: {
      [key: string]: ProviderInfo;
    };
  } {
    return this.builderContext.providers;
  }
  getImports(registeredUtils?: UtilMapping, filepath?: string): (t.ImportNamespaceSpecifier | t.ImportDeclaration | t.ImportDefaultSpecifier)[] {
    return getImportStatements(
      convertUtilsToImportList(
        this,
        Object.keys(this.utils),
        registeredUtils,
      ),
      filepath
    );
  }
}

export class RenderContext extends RenderContextBase {
  mergeDefaultOpt(options: RenderOptions): RenderOptions {
    return deepmerge(defaultOptions, options ?? {});
  }
}
