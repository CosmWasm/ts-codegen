import * as t from '@babel/types';
import nested from 'nested-obj';
import {
  dirname, extname,
  relative} from 'path';

export interface BundleData {
    __export?: boolean;
    [key: string]: boolean | BundleData;
}

export const recursiveModuleBundle = (obj: BundleData): t.ExportNamedDeclaration[] => {
  return Object.keys(obj).map(key => {
    const value = obj[key];
    if (typeof value === 'object' && value && value.__export) {
      // e.g. abci
      // 1. create variable for abci
      // 2. splat ALL _0, parms into abci
      // 3. export that variable

      const nmspc = t.variableDeclaration('const',
        [t.variableDeclarator(
          t.identifier(key),
          t.objectExpression(
            Object.keys(obj[key])
              .filter(a => a !== '__export')
              .filter(a => a.startsWith('_'))
              .map(a => t.spreadElement(t.identifier(a)))
          )
        )]
      );

      const others = Object.keys(obj[key])
        .filter(a => a !== '__export')
        .filter(a => !a.startsWith('_'));
      if (others.length) {
        throw new Error('namespace and package not supported, yet.')
      }

      // return nmspc;
      return t.exportNamedDeclaration(nmspc, []);
    } else if (typeof value === 'object' && value) {
      // you can make a namespace for obj[key]
      // e.g. libs
      return t.exportNamedDeclaration(
        t.tsModuleDeclaration(
          t.identifier(key),
          t.tsModuleBlock(recursiveModuleBundle(obj[key] as BundleData))
        )
      )
    } else {
      throw new Error('Invalid structure for BundleData');
    }
  });
};

export const importNamespace = (ident: string, path: string) => t.importDeclaration(
  [
    t.importNamespaceSpecifier(t.identifier(ident))
  ],
  t.stringLiteral(path.replace(extname(path), ''))
);

let counter = 0;
export const createFileBundle = (
  pkg: string,
  filename: string,
  bundleFile: string,
  importPaths: (t.ImportDeclaration | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier)[],
  bundleVariables: BundleData
) => {
  let rel = relative(dirname(bundleFile), filename);
  if (!rel.startsWith('.')) rel = `./${rel}`;
  const variable = `_${counter++}`;
  importPaths.push(importNamespace(variable, rel));
  nested.set(bundleVariables, pkg + '.__export', true);
  nested.set(bundleVariables, pkg + '.' + variable, true);
}