import * as t from '@babel/types';
import { ExecuteMsg, QueryMsg } from '../types';
import { RenderContext } from '../context';

export declare const createAbstractAppClass: (
  context: RenderContext,
  className: string,
  msg: ExecuteMsg | QueryMsg
) => t.ExportNamedDeclaration;

/**
 * The address and connect methods in the interface.
 */
export declare const createAppQueryInterface: (
  context: RenderContext,
  className: string,
  mutClassName: string,
  queryMsg: QueryMsg
) => t.ExportNamedDeclaration;

export declare const createAppQueryClass: (
  context: RenderContext,
  _moduleName: string,
  className: string,
  implementsClassName: string,
  queryMsg: QueryMsg
) => t.ExportNamedDeclaration;

/**
 * The address and connect methods in the interface.
 */
export declare const createAppExecuteInterface: (
  context: RenderContext,
  interfaceClassName: string,
  mutClassName: string,
  extendsClassName: string,
  executeMsg: ExecuteMsg
) => t.ExportNamedDeclaration;

export declare const createAppExecuteClass: (
  context: RenderContext,
  uncheckedModuleName: string,
  className: string,
  implementsClassName: string,
  extendsClassName: string,
  execute: ExecuteMsg
) => t.ExportNamedDeclaration;

export declare const createAbstractAppQueryFactory: (
  context: RenderContext,
  moduleName: string,
  msg: QueryMsg
) => t.ExportNamedDeclaration;
