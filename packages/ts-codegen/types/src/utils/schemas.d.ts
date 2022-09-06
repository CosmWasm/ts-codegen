import { JSONSchema } from 'wasm-ast-types';
import { IDLObject } from '../types';
interface ReadSchemaOpts {
    schemaDir: string;
    clean?: boolean;
}
interface ReadSchemasValue {
    schemas: JSONSchema[];
    idlObject?: IDLObject;
}
export declare const readSchemas: ({ schemaDir, clean }: ReadSchemaOpts) => Promise<ReadSchemasValue>;
export declare const findQueryMsg: (schemas: any) => any;
export declare const findExecuteMsg: (schemas: any) => any;
export declare const findAndParseTypes: (schemas: any) => Promise<{}>;
export declare const getDefinitionSchema: (schemas: JSONSchema[]) => JSONSchema;
export {};
