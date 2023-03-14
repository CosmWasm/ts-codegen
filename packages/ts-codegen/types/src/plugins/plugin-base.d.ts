import { ContractInfo, UtilMapping, IContext } from 'wasm-ast-types';
import { BuilderFile, BuilderFileType } from '../builder';
/**
 * IBuilderPlugin is a common plugin that render generated code.
 */
export interface IBuilderPlugin {
    /**
     * a mapping of utils will be used in generated code.
     */
    utils: UtilMapping;
    /**
     * render generated cdoe.
     * @param name the name of contract
     * @param contractInfo contract
     * @param outPath the path of generated code.
     * @returns info of generated files.
     */
    render(name: string, contractInfo: ContractInfo, outPath: string): Promise<BuilderFile[]>;
}
/**
 * BuilderPluginBase enable ts-codegen users implement their own plugins by only implement a few functions.
 */
export declare abstract class BuilderPluginBase<TOpt extends {
    enabled?: boolean;
}> implements IBuilderPlugin {
    option: TOpt;
    utils: UtilMapping;
    constructor(opt: TOpt);
    render(name: string, contractInfo: ContractInfo, outPath: string): Promise<BuilderFile[]>;
    /**
     * init context here
     * @param contract
     * @param options
     */
    abstract initContext(contract: ContractInfo, options?: TOpt): IContext;
    /**
     * render generated code here.
     * @param name
     * @param context
     */
    abstract doRender(name: string, context: IContext): Promise<{
        type: BuilderFileType;
        pluginType?: string;
        localname: string;
        body: any[];
    }[]>;
}
