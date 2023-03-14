import { ContractInfo, RenderContext, RenderContextBase, UtilMapping, RenderOptions } from 'wasm-ast-types';
import { BuilderFileType } from '../builder';
import { BuilderPluginBase } from './plugin-base';
export declare class RecoilPlugin extends BuilderPluginBase<RenderOptions> {
    utils: UtilMapping;
    initContext(contract: ContractInfo, options?: RenderOptions): RenderContextBase<RenderOptions>;
    doRender(name: string, context: RenderContext): Promise<{
        type: BuilderFileType;
        pluginType?: string;
        localname: string;
        body: any[];
    }[]>;
}
