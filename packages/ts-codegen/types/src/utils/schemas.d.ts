import { JSONSchema } from 'wasm-ast-types';
interface ReadSchemaOpts {
    schemaDir: string;
    schemaOptions?: {
        packed?: boolean;
    };
    clean?: boolean;
}
export declare const readSchemas: ({ schemaDir, schemaOptions, clean }: ReadSchemaOpts) => Promise<any>;
export declare const findQueryMsg: (schemas: any) => any;
export declare const findExecuteMsg: (schemas: any) => any;
export declare const findAndParseTypes: (schemas: any) => Promise<{}>;
export declare const getDefinitionSchema: (schemas: JSONSchema[]) => JSONSchema;
export {};
