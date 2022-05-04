import * as t from '@babel/types';
import { QueryMsg, ExecuteMsg } from './types';
export declare const identifier: (name: string, typeAnnotation: t.TSTypeAnnotation, optional?: boolean) => t.Identifier;
export declare const getPropertyType: (schema: any, prop: any) => {
    type: any;
    optional: any;
};
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
export declare const createPropertyFunctionWithObjectParamsForExec: (methodName: string, responseType: string, jsonschema: any) => t.TSPropertySignature;
export declare const createQueryInterface: (className: string, queryMsg: QueryMsg) => t.ExportNamedDeclaration;
export declare const createTypeOrInterface: (Type: string, jsonschema: any) => t.ExportNamedDeclaration;
export declare const createTypeInterface: (jsonschema: any) => t.ExportNamedDeclaration;
