import { JSONSchema } from "../types";
import { refLookup } from "../utils";
import { convertUtilsToImportList, getImportStatements, UtilMapping } from "./imports";
import deepmerge from "deepmerge";
import { basename, extname } from 'path'

/// Plugin Types
export interface ReactQueryOptions {
  enabled?: boolean;
  optionalClient?: boolean;
  version?: 'v3' | 'v4';
  mutations?: boolean;
  camelize?: boolean;
  queryKeys?: boolean
  queryFactory?: boolean
}

export interface AbstractAppOptions {
  enabled?: boolean;
  clientPrefix?: string;
  moduleType?: 'app' | 'adapter'
}

export interface TSClientOptions {
  enabled?: boolean;
  execExtendsQuery?: boolean;
  noImplicitOverride?: boolean;
}
export interface MessageComposerOptions {
  enabled?: boolean;
}
export interface MessageBuilderOptions {
  enabled?: boolean;
}
export interface RecoilOptions {
  enabled?: boolean;
}
export interface TSTypesOptions {
  enabled?: boolean;
  // deprecated
  aliasExecuteMsg?: boolean;
  aliasEntryPoints?: boolean;
}

/// END Plugin Types

interface KeyedSchema {
  [key: string]: JSONSchema;
}
export interface IDLObject {
  contract_name: string;
  contract_version: string;
  idl_version: string;
  instantiate: JSONSchema;
  execute: JSONSchema;
  query: JSONSchema;
  migrate: JSONSchema;
  sudo: JSONSchema;
  responses: KeyedSchema;
}

export interface ContractInfo {
  schemas: JSONSchema[];
  responses?: Record<string, JSONSchema>;
  idlObject?: IDLObject;
};
export interface RenderOptions {
    enabled?: boolean;
    types?: TSTypesOptions;
    recoil?: RecoilOptions;
    messageComposer?: MessageComposerOptions;
    messageBuilder?: MessageBuilderOptions;
    client?: TSClientOptions;
    reactQuery?: ReactQueryOptions;
    abstractApp?: AbstractAppOptions
}

export interface ProviderInfo {
  classname: string,
  filename: string,
  basename: string,
}

export interface IContext {
  refLookup($ref: string);
  addUtil(util: string);
  addUtils(util: string[]);
  getImports(registeredUtils?: UtilMapping, filepath?: string);
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
  abstractApp: {
    enabled: false,
    clientPrefix: 'App',
    moduleType: 'app'
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
  utils: string[] = [];
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
    this.builderContext = builderContext;
  }
  /**
   * merge options and default options
   * @param options
   */
  abstract mergeDefaultOpt(options: TOpt): TOpt;
  refLookup($ref: string) {
    return refLookup($ref, this.schema)
  }
  addUtil(util: string) {
    this.utils[util] = true;
  }
  addUtils(utils: string[]) {
    utils.forEach(util => {
      this.utils[util] = true;
    });
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
  getImports(registeredUtils?: UtilMapping, filepath?: string) {
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
