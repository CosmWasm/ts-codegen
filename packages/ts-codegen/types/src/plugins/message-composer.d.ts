import { ContractInfo, RenderContextBase, RenderContext, RenderOptions } from 'wasm-ast-types';
import { BuilderFileType } from '../builder';
import { BuilderPluginBase } from './plugin-base';
export declare const TYPE = "message-composer";
export declare class MessageComposerPlugin extends BuilderPluginBase<RenderOptions> {
    initContext(contract: ContractInfo, options?: RenderOptions): RenderContextBase<RenderOptions>;
    doRender(name: string, context: RenderContext): Promise<{
        type: BuilderFileType;
        pluginType?: string;
        localname: string;
        body: any[];
    }[]>;
}
