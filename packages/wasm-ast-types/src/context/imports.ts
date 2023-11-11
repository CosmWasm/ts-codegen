import * as t from '@babel/types';
import { importAs, importStmt } from "../utils";
import { RenderContext } from './context';
import { relative, dirname, extname } from 'path';


export interface ImportObj {
  type: 'import' | 'default' | 'namespace';
  name: string;
  path: string;
  importAs?: string;
}

export type GetUtilFn = (<TContext = RenderContext>(...args: any[]) => (context: TContext) => ImportObj);
export type UtilMapping = {
  [key: string]:
    | ImportObj
    | string
    | GetUtilFn
};

const makeReactQuerySwitch = (varName) => {
  return (context: RenderContext) => {
    switch (context.options.reactQuery.version) {
      case 'v4':
        return {
          type: 'import',
          path: '@tanstack/react-query',
          name: varName
        }
      case 'v3':
      default:
        return {
          type: 'import',
          path: 'react-query',
          name: varName
        }
    }
  };
}

export const UTILS = {
  selectorFamily: 'recoil',
  MsgExecuteContract: 'cosmjs-types/cosmwasm/wasm/v1/tx',
  MsgExecuteContractEncodeObject: '@cosmjs/cosmwasm-stargate',
  Coin: '@cosmjs/amino',
  toUtf8: '@cosmjs/encoding',
  StdFee: '@cosmjs/amino',
  CosmWasmClient: '@cosmjs/cosmwasm-stargate',
  ExecuteResult: '@cosmjs/cosmwasm-stargate',
  SigningCosmWasmClient: '@cosmjs/cosmwasm-stargate',

  // Types
  CamelCasedProperties: 'type-fest',

  // Abstract
  AbstractClient: '@abstract-money/abstract.js',
  AbstractQueryClient: '@abstract-money/abstract.js',
  AbstractAccountId: '@abstract-money/abstract.js',
  AbstractAccountClient: '@abstract-money/abstract.js',
  AbstractAccountQueryClient: '@abstract-money/abstract.js',
  AppExecuteMsg: '@abstract-money/abstract.js',
  AppExecuteMsgFactory: '@abstract-money/abstract.js',

  // react-query
  createQueryKeys: '@lukemorales/query-key-factory',
  useQuery: makeReactQuerySwitch('useQuery'),
  UseQueryOptions: makeReactQuerySwitch('UseQueryOptions'),
  useMutation: makeReactQuerySwitch('useMutation'),
  UseMutationOptions: makeReactQuerySwitch('UseMutationOptions')
};

export const UTIL_HELPERS = [
  '__contractContextBase__',
];

export const convertUtilsToImportList = (
  context: RenderContext,
  utils: string[],
  registeredUtils?: UtilMapping
): ImportObj[] => {
  return utils.map((util) => {
    let result = null;

    if(registeredUtils){
      result = convertUtil(context, util, registeredUtils);

      if (result) {
        return result;
      }
    }

    result = convertUtil(context, util, UTILS);

    if (result) {
      return result;
    }

    throw new Error(`missing Util! ::[${util}]`);
  });
};

export const convertUtil = (
  context: RenderContext,
  util: string,
  registeredUtils: object
): ImportObj => {
  if (!registeredUtils.hasOwnProperty(util)) return null;
  if (typeof registeredUtils[util] === 'string') {
    return {
      type: 'import',
      path: registeredUtils[util],
      name: util
    };
  } else if (typeof registeredUtils[util] === 'function') {
    return registeredUtils[util](context);
  } else {
    return registeredUtils[util];
  }
};


// __helpers__
export const getImportStatements = (
  list: ImportObj[],
  filepath?: string
) => {

  // swap helpers with helpers file...
  const modifiedImports = list.map(imp => {
      if (filepath && UTIL_HELPERS.includes(imp.path)) {
          const name = imp.path.replace(/__/g, '');
          return {
              ...imp,
              path: getRelativePath(filepath, `./${name}`)
          }
      }
      return imp;
  });

  const imports = modifiedImports.reduce((m, obj) => {
      m[obj.path] = m[obj.path] || [];
      const exists = m[obj.path].find(el =>
          el.type === obj.type && el.path === obj.path && el.name === obj.name);

      // MARKED AS NOT DRY [google.protobuf names]
      // TODO some have google.protobuf.Any shows up... figure out the better way to handle this
      if (/\./.test(obj.name)) {
          obj.name = obj.name.split('.')[obj.name.split('.').length - 1];
      }

      if (!exists) {
          m[obj.path].push(obj);
      }
      return m;
  }, {})


  return Object.entries(imports)
      .reduce((m, [importPath, imports]: [string, ImportObj[]]) => {
          const defaultImports = imports.filter(a => a.type === 'default');
          if (defaultImports.length) {
              if (defaultImports.length > 1) throw new Error('more than one default name NOT allowed.')
              m.push(
                  t.importDeclaration(
                      [
                          t.importDefaultSpecifier(
                              t.identifier(defaultImports[0].name)
                          )
                      ],
                      t.stringLiteral(defaultImports[0].path)
                  )
              )
          }
          const namedImports = imports.filter(a => a.type === 'import' && (!a.importAs || (a.name === a.importAs)));
          if (namedImports.length) {
              m.push(importStmt(namedImports.map(i => i.name), namedImports[0].path));
          }
          const aliasNamedImports = imports.filter(a => a.type === 'import' && (a.importAs && (a.name !== a.importAs)));
          aliasNamedImports.forEach(imp => {
              m.push(importAs(imp.name, imp.importAs, imp.path));
          });

          const namespaced = imports.filter(a => a.type === 'namespace');
          if (namespaced.length) {
              if (namespaced.length > 1) throw new Error('more than one namespaced name NOT allowed.')
              m.push(
                  t.importDeclaration(
                      [
                          t.importNamespaceSpecifier(
                              t.identifier(namespaced[0].name)
                          )
                      ],
                      t.stringLiteral(namespaced[0].path)
                  )
              )
          }
          return m;
      }, [])
};

export const getRelativePath = (f1: string, f2: string) => {
  const rel = relative(dirname(f1), f2);
  let importPath = rel.replace(extname(rel), '');
  if (!/^\./.test(importPath)) importPath = `./${importPath}`;
  return importPath;
}