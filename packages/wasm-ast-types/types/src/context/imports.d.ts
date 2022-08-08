export interface ImportObj {
    type: 'import' | 'default' | 'namespace';
    name: string;
    path: string;
    importAs?: string;
}
export declare const UTILS: {
    Registry: string;
    SigningStargateClient: string;
    toUtf8: string;
    _m0: {
        type: string;
        path: string;
        name: string;
    };
};
export declare const convertUtilsToImportList: (utils: any) => ImportObj[];
export declare const getImportStatements: (list: ImportObj[]) => any[];
