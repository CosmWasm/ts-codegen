import { RenderContext } from '../context';
import * as t from '@babel/types';
import { QueryMsg } from '../types';

/**
 * Create a react-query factory for use in queries.
 * @param context
 * @param moduleName
 * @param queryMsg
 * @todo get rid of `isAbtsractApp` in favor of context option
 */
export declare const createQueryOptionsFactory: (
  context: RenderContext,
  moduleName: string,
  queryMsg: QueryMsg,
  isAbstractApp: boolean
) => t.ExportNamedDeclaration;
