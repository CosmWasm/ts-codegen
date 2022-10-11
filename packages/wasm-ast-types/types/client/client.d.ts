import * as t from '@babel/types';
import { QueryMsg, ExecuteMsg } from '../types';
import { RenderContext } from '../context';
import { JSONSchema } from '../types';
export declare const CONSTANT_EXEC_PARAMS: (t.AssignmentPattern | t.Identifier)[];
export declare const FIXED_EXECUTE_PARAMS: t.Identifier[];
export declare const createWasmQueryMethod: (context: RenderContext, jsonschema: any) => t.ClassProperty;
export declare const createQueryClass: (context: RenderContext, className: string, implementsClassName: string, queryMsg: QueryMsg) => t.ExportNamedDeclaration;
export declare const getWasmMethodArgs: (context: RenderContext, jsonschema: JSONSchema) => t.ObjectProperty[];
export declare const createWasmExecMethod: (context: RenderContext, jsonschema: JSONSchema) => t.ClassProperty;
export declare const createExecuteClass: (context: RenderContext, className: string, implementsClassName: string, extendsClassName: string | null, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
export declare const createExecuteInterface: (context: RenderContext, className: string, extendsClassName: string | null, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
export declare const createPropertyFunctionWithObjectParams: (context: RenderContext, methodName: string, responseType: string, jsonschema: JSONSchema) => t.TSPropertySignature;
export declare const createPropertyFunctionWithObjectParamsForExec: (context: RenderContext, methodName: string, responseType: string, jsonschema: JSONSchema) => t.TSPropertySignature;
export declare const createQueryInterface: (context: RenderContext, className: string, queryMsg: QueryMsg) => t.ExportNamedDeclaration;
export declare const createTypeOrInterface: (context: RenderContext, Type: string, jsonschema: JSONSchema) => t.ExportNamedDeclaration;
export declare const createTypeInterface: (context: RenderContext, jsonschema: JSONSchema) => t.ExportNamedDeclaration;
