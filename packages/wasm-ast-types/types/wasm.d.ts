import * as t from '@babel/types';
interface QueryMsg {
    $schema: string;
    title: "QueryMsg";
    oneOf?: any;
    allOf?: any;
    anyOf?: any;
}
interface ExecuteMsg {
    $schema: string;
    title: "ExecuteMsg" | "ExecuteMsg_for_Empty";
    oneOf?: any;
    allOf?: any;
    anyOf?: any;
}
export declare const getMessageProperties: (msg: QueryMsg | ExecuteMsg) => any;
export declare const createWasmQueryMethod: (jsonschema: any) => t.ClassProperty;
export declare const createQueryClass: (className: string, implementsClassName: string, queryMsg: QueryMsg) => t.ExportNamedDeclaration;
export declare const createWasmExecMethod: (jsonschema: any) => t.ClassProperty;
export declare const createExecuteClass: (className: string, implementsClassName: string, extendsClassName: string, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
export declare const createExecuteInterface: (className: string, extendsClassName: string | null, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
export declare const propertySignature: (name: string, typeAnnotation: t.TSTypeAnnotation, optional?: boolean) => {
    type: string;
    key: t.Identifier;
    typeAnnotation: t.TSTypeAnnotation;
    optional: boolean;
};
export declare const createTypedObjectParams: (jsonschema: any, camelize?: boolean) => t.ObjectPattern;
export declare const createPropertyFunctionWithObjectParams: (methodName: string, responseType: string, jsonschema: any) => t.TSPropertySignature;
export declare const createQueryInterface: (className: string, queryMsg: QueryMsg) => t.ExportNamedDeclaration;
export declare const createTypeOrInterface: (Type: string, jsonschema: any) => t.ExportNamedDeclaration;
export declare const createTypeInterface: (jsonschema: any) => t.ExportNamedDeclaration;
export {};
