import * as t from '@babel/types';
import { ExecuteMsg } from '../types';
import { RenderContext } from '../context';
export declare const createMsgBuilderClass: (context: RenderContext, className: string, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
export declare const createMsgBuilderInterface: (context: RenderContext, className: string, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
