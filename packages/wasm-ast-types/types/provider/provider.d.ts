import * as t from "@babel/types";
export declare const createProvider: (name: string, methods: t.ClassMethod[]) => t.ExportNamedDeclaration;
export declare const createProviderFunction: (functionName: string, classname: string) => t.ClassMethod;
