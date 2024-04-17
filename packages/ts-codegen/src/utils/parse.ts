import babelTraverse from '@babel/traverse';
import { parse, ParserPlugin } from '@babel/parser';

export const parser = (codes: string[]) => {

    const hash: Record<string, any> = {};
    codes.forEach(code => {

        const plugins: ParserPlugin[] = [
            'typescript',
        ];

        const ast = parse(code, {
            sourceType: 'module',
            plugins
        });

        const visitor = visitorFn({
            addType(key: string, node: any) {
                hash[key] = node;
            }
        })
        babelTraverse(ast as any, visitor);
    });

    return hash;

}

const visitorFn = (parser: any) => ({
    TSTypeAliasDeclaration(path: any) {
        parser.addType(path.node.id.name, path.parentPath.node);
        // if (path.node.id.name.endsWith('For_Empty')) {
        //     const newName = path.node.id.name.replace(/For_Empty$/, '_for_Empty');
        //     path.parentPath.node.declaration.id.name = newName;
        //     parser.addType(newName, path.parentPath.node);
        // } else {
        //     parser.addType(path.node.id.name, path.parentPath.node);
        // }
    },
    TSInterfaceDeclaration(path: any) {
        parser.addType(path.node.id.name, path.parentPath.node);
    }
});

