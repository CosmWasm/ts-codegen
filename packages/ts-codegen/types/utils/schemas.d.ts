import { JSONSchema } from 'wasm-ast-types';
export declare const readSchemas: ({ schemaDir, argv, clean }: {
    schemaDir: any;
    argv: any;
    clean?: boolean;
}) => Promise<any>;
export declare const findQueryMsg: (schemas: any) => any;
export declare const findExecuteMsg: (schemas: any) => any;
export declare const findAndParseTypes: (schemas: any) => Promise<{}>;
export declare const getDefinitionSchema: (schemas: JSONSchema[]) => JSONSchema;
