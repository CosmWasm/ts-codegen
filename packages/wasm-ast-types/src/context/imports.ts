import * as t from '@babel/types';
import { importAs, importStmt } from "../utils";
import { RenderContext } from './context';

export interface ImportObj {
  type: 'import' | 'default' | 'namespace';
  name: string;
  path: string;
  importAs?: string;
}

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
  MsgExecuteContract: 'cosmjs-types/cosmwasm/wasm/v1/tx',
  MsgExecuteContractEncodeObject: 'cosmwasm',
  Coin: '@cosmjs/amino',
  toUtf8: '@cosmjs/encoding',
  selectorFamily: 'recoil',
  StdFee: '@cosmjs/amino',
  CosmWasmClient: '@cosmjs/cosmwasm-stargate',
  ExecuteResult: '@cosmjs/cosmwasm-stargate',
  CosmWasmSigner: '@confio/relayer',

  // react-query
  useQuery: makeReactQuerySwitch('useQuery'),
  UseQueryOptions: makeReactQuerySwitch('UseQueryOptions'),
  useMutation: makeReactQuerySwitch('useMutation'),
  UseMutationOptions: makeReactQuerySwitch('UseMutationOptions')

};

export const convertUtilsToImportList = (
  context: RenderContext,
  utils: string[]
): ImportObj[] => {
  return utils.map(util => {
    if (!UTILS.hasOwnProperty(util)) throw new Error(`missing Util! ::[${util}]`);
    if (typeof UTILS[util] === 'string') {
      return {
        type: 'import',
        path: UTILS[util],
        name: util
      };
    } else if (typeof UTILS[util] === 'function') {
      return UTILS[util](context);
    } else {
      UTILS[util];
    }
  });
}

export const getImportStatements = (list: ImportObj[]) => {
  const imports = list.reduce((m, obj) => {
    m[obj.path] = m[obj.path] || [];
    const exists = m[obj.path].find(el => el.type === obj.type && el.path === obj.path && el.name === obj.name);

    // TODO some have google.protobuf.Any shows up... figure out the better way to handle this
    if (/\./.test(obj.name)) {
      obj.name = obj.name.split('.')[obj.name.split('.').length - 1];
    }

    if (!exists) m[obj.path].push(obj);
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
