import babelTraverse from '@babel/traverse';
import { parse } from '@babel/parser';
import generate from '@babel/generator';
import { camel } from 'case';
import stringify from 'ast-stringify';

export const parser = (codes) => {

    const hash = {};
    codes.forEach(code => {

        const plugins = [
            'objectRestSpread',
            'classProperties',
            'optionalCatchBinding',
            'asyncGenerators',
            'decorators-legacy',
            'typescript',
            'dynamicImport'
        ];

        const ast = parse(code, {
            sourceType: 'module',
            // babelrc: false,
            plugins
        });

        const visitor = visitorFn({
            addType(key, node) {
                hash[key] = node;
            }
        })
        babelTraverse(ast, visitor);
    });

    return hash;

}

const visitorFn = (parser) => ({
    TSTypeAliasDeclaration(path) {
        parser.addType(path.node.id.name, path.parentPath.node);
    },
    TSInterfaceDeclaration(path) {
        parser.addType(path.node.id.name, path.parentPath.node);
    }
});

