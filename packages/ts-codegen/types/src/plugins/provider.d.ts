import { ContractInfo, RenderContextBase, RenderContext } from "wasm-ast-types";
import { BuilderFileType, TSBuilderOptions } from "../builder";
import { BuilderPluginBase } from "./plugin-base";
export declare const GetLocalNameByContractName: (name: any) => string;
export declare const GetLocalBaseNameByContractName: (name: any) => string;
export declare class ContractsContextProviderPlugin extends BuilderPluginBase<TSBuilderOptions> {
    constructor(opt: TSBuilderOptions);
    initContext(contract: ContractInfo, options?: TSBuilderOptions): RenderContextBase<TSBuilderOptions>;
    doRender(name: string, context: RenderContext): Promise<{
        type: BuilderFileType;
        pluginType?: string;
        localname: string;
        body: any[];
    }[]>;
}
