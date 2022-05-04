import * as t from '@babel/types';
import { ExecuteMsg } from './types';
export declare const createFromPartialClass: (className: string, implementsClassName: string, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
export declare const createFromPartialInterface: (className: string, execMsg: ExecuteMsg) => t.ExportNamedDeclaration;
