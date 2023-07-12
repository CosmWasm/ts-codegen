import { RenderContext, ContractInfo, RenderContextBase, RenderOptions } from 'wasm-ast-types';
import { BuilderFileType } from '../builder';
import { BuilderPluginBase } from './plugin-base';
export declare const TYPE = "client";
export declare const QUERY_CLIENT_TYPE = "queryClient";
export declare class ClientPlugin extends BuilderPluginBase<RenderOptions> {
    initContext(contract: ContractInfo, options?: RenderOptions): RenderContextBase<RenderOptions>;
    doRender(name: string, context: RenderContext): Promise<{
        type: BuilderFileType;
        pluginType?: string;
        localname: string;
        body: any[];
    }[]>;
}
