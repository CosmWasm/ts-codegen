import * as t from '@babel/types';
import { QueryMsg } from './types';
interface ReactQueryHookQuery {
    hookName: string;
    hookParamsTypeName: string;
    hookKeyName: string;
    responseType: string;
    methodName: string;
    jsonschema: any;
}
export declare const createReactQueryHooks: (queryMsg: QueryMsg, contractName: string, QueryClient: string) => any;
export declare const createReactQueryHook: ({ hookName, hookParamsTypeName, responseType, hookKeyName, methodName, jsonschema }: ReactQueryHookQuery) => t.ExportNamedDeclaration;
interface ReactQueryHookQueryInterface {
    QueryClient: string;
    hookParamsTypeName: string;
    responseType: string;
    jsonschema: any;
}
export declare const createReactQueryHookInterface: ({ QueryClient, hookParamsTypeName, responseType, jsonschema }: ReactQueryHookQueryInterface) => t.ExportNamedDeclaration;
export {};
