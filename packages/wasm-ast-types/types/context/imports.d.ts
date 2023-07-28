import { RenderContext } from './context';
export interface ImportObj {
    type: 'import' | 'default' | 'namespace';
    name: string;
    path: string;
    importAs?: string;
}
export declare type GetUtilFn = (<TContext = RenderContext>(...args: any[]) => (context: TContext) => ImportObj);
export declare type UtilMapping = {
    [key: string]: ImportObj | string | GetUtilFn;
};
export declare const UTILS: {
    selectorFamily: string;
    MsgExecuteContract: string;
    MsgExecuteContractEncodeObject: string;
    Coin: string;
    toUtf8: string;
    StdFee: string;
    CosmWasmClient: string;
    ExecuteResult: string;
    SigningCosmWasmClient: string;
    useQuery: (context: RenderContext) => {
        type: string;
        path: string;
        name: any;
    };
    UseQueryOptions: (context: RenderContext) => {
        type: string;
        path: string;
        name: any;
    };
    useMutation: (context: RenderContext) => {
        type: string;
        path: string;
        name: any;
    };
    UseMutationOptions: (context: RenderContext) => {
        type: string;
        path: string;
        name: any;
    };
};
export declare const UTIL_HELPERS: string[];
export declare const convertUtilsToImportList: (context: RenderContext, utils: string[], registeredUtils?: UtilMapping) => ImportObj[];
export declare const convertUtil: (context: RenderContext, util: string, registeredUtils: object) => ImportObj;
export declare const getImportStatements: (list: ImportObj[], filepath?: string) => any[];
export declare const getRelativePath: (f1: string, f2: string) => string;
