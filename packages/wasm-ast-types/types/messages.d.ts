import * as t from '@babel/types';
import { ExecuteMsg } from './types';
import { RenderContext } from './utils/types';
export declare const createFromPartialClass: (context: RenderContext, className: string, implementsClassName: string, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
export declare const createFromPartialInterface: (context: RenderContext, className: string, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
