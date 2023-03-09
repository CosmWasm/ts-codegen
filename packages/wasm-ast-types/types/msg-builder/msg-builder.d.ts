import * as t from '@babel/types';
import { ExecuteMsg, QueryMsg } from '../types';
import { RenderContext } from '../context';
export declare const createMsgBuilderClass: (context: RenderContext, className: string, msg: ExecuteMsg | QueryMsg) => t.ExportNamedDeclaration;
