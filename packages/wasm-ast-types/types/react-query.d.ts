import * as t from '@babel/types';
import { ExecuteMsg, QueryMsg } from './types';
import { JSONSchema, RenderContext } from './utils/types';
export interface ReactQueryOptions {
    optionalClient?: boolean;
    v4?: boolean;
    mutations?: boolean;
}
interface ReactQueryHookQuery {
    context: RenderContext;
    hookName: string;
    hookParamsTypeName: string;
    hookKeyName: string;
    responseType: string;
    methodName: string;
    jsonschema: any;
    options?: ReactQueryOptions;
}
interface ReactQueryHooks {
    context: RenderContext;
    queryMsg: QueryMsg;
    contractName: string;
    QueryClient: string;
    options?: ReactQueryOptions;
}
export declare const createReactQueryHooks: ({ context, queryMsg, contractName, QueryClient, options }: ReactQueryHooks) => any;
export declare const createReactQueryHook: ({ context, hookName, hookParamsTypeName, responseType, hookKeyName, methodName, jsonschema, options, }: ReactQueryHookQuery) => t.ExportNamedDeclaration;
interface ReactQueryMutationHookInterface {
    context: RenderContext;
    ExecuteClient: string;
    mutationHookParamsTypeName: string;
    jsonschema: JSONSchema;
    useMutationTypeParameter: t.TSTypeParameterInstantiation;
}
/**
 * Example:
```
export interface Cw4UpdateMembersMutation {
  client: Cw4GroupClient
  args: {
    tokenId: string
    remove: string[]
  }
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, Pick<Cw4UpdateMembersMutation, 'args'>>,
    'mutationFn'
  >
}
```
 */
export declare const createReactQueryMutationArgsInterface: ({ context, ExecuteClient, mutationHookParamsTypeName, useMutationTypeParameter, jsonschema, }: ReactQueryMutationHookInterface) => t.ExportNamedDeclaration;
interface ReactQueryMutationHooks {
    context: RenderContext;
    execMsg: ExecuteMsg;
    contractName: string;
    ExecuteClient: string;
    options?: ReactQueryOptions;
}
export declare const createReactQueryMutationHooks: ({ context, execMsg, contractName, ExecuteClient, options }: ReactQueryMutationHooks) => any;
interface ReactQueryMutationHook {
    context: RenderContext;
    mutationHookName: string;
    mutationHookParamsTypeName: string;
    execMethodName: string;
    useMutationTypeParameter: t.TSTypeParameterInstantiation;
    hasMsg: boolean;
}
/**
 *
 * Example:
```
export const useCw4UpdateMembersMutation = ({ client, options }: Omit<Cw4UpdateMembersMutation, 'args'>) =>
  useMutation<ExecuteResult, Error, Pick<Cw4UpdateMembersMutation, 'args'>>(
    ({ args }) => client.updateMembers(args),
    options
  )
```
 */
export declare const createReactQueryMutationHook: ({ context, mutationHookName, mutationHookParamsTypeName, execMethodName, useMutationTypeParameter, hasMsg, }: ReactQueryMutationHook) => t.ExportNamedDeclaration;
interface ReactQueryHookQueryInterface {
    context: RenderContext;
    QueryClient: string;
    hookParamsTypeName: string;
    responseType: string;
    jsonschema: any;
    options?: ReactQueryOptions;
}
export declare const createReactQueryHookInterface: ({ context, QueryClient, hookParamsTypeName, responseType, jsonschema, options, }: ReactQueryHookQueryInterface) => t.ExportNamedDeclaration;
export {};
