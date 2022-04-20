import * as t from '@babel/types';
interface QueryMsg {
    $schema: string;
    title: "QueryMsg";
    oneOf?: any;
    allOf?: any;
    anyOf?: any;
}
export declare const createWasmRecoilMethod: (jsonschema: any) => void;
export declare const createRecoilSelector: (keyPrefix: string, QueryClient: string, methodName: string) => t.ExportNamedDeclaration;
export declare const createRecoilSelectors: (keyPrefix: string, QueryClient: string, queryMsg: QueryMsg) => any;
export declare const createRecoilQueryClientType: () => {
    type: string;
    id: {
        type: string;
        name: string;
    };
    typeAnnotation: {
        type: string;
        members: {
            type: string;
            key: {
                type: string;
                name: string;
            };
            computed: boolean;
            typeAnnotation: {
                type: string;
                typeAnnotation: {
                    type: string;
                };
            };
        }[];
    };
};
export declare const createRecoilQueryClient: (keyPrefix: string, QueryClient: string) => t.ExportNamedDeclaration;
export {};
