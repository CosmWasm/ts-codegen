import { sync as mkdirp } from "mkdirp";
import { join } from "path";
import { writeFileSync } from "fs";
import { header } from "../utils/header";
import { ContractInfo, UtilMapping, IContext } from "wasm-ast-types";
import generate from "@babel/generator";
import * as t from "@babel/types";
import {
  BuilderFile,
  BuilderFileType,
  TSBuilder,
  TSBuilderOptions,
} from "../builder";

/**
 * IBuilderPlugin is a common plugin that render generated code.
 */
export interface IBuilderPlugin {
  /**
   * a mapping of utils will be used in generated code.
   */
  utils: UtilMapping;

  builder?: TSBuilder;

  setBuilder(builder: TSBuilder): void;

  /**
   * render generated cdoe.
   * @param name the name of contract
   * @param contractInfo contract
   * @param outPath the path of generated code.
   * @returns info of generated files.
   */
  render(
    name: string,
    contractInfo: ContractInfo,
    outPath: string
  ): Promise<BuilderFile[]>;
}

/**
 * BuilderPluginBase enable ts-codegen users implement their own plugins by only implement a few functions.
 */
export abstract class BuilderPluginBase<TOpt extends { enabled?: boolean }>
  implements IBuilderPlugin {
  builder?: TSBuilder;
  option: TOpt;
  utils: UtilMapping;

  constructor(opt: TOpt, builder?: TSBuilder) {
    this.option = opt;
    this.builder = builder;
  }

  setBuilder(builder: TSBuilder): void {
    this.builder = builder;
  }

  async render(
    name: string,
    contractInfo: ContractInfo,
    outPath: string
  ): Promise<BuilderFile[]> {
    const { enabled } = this.option;

    if (!enabled) {
      return;
    }

    const context = this.initContext(contractInfo, this.option);

    const results = await this.doRender(name, context);

    if (!results || !results.length) {
      return [];
    }

    return results.map((result) => {
      const imports = context.getImports(this.utils, result.localname);
      // @ts-ignore
      const code = header + generate(t.program([...imports, ...result.body])).code;

      mkdirp(outPath);
      const filename = join(outPath, result.localname);
      writeFileSync(filename, code);

      return {
        type: result.type,
        pluginType: result.pluginType,
        contract: name,
        localname: result.localname,
        filename,
      };
    });
  }

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
  abstract doRender(
    name: string,
    context: IContext
  ): Promise<
    {
      type: BuilderFileType;
      pluginType?: string;
      localname: string;
      body: any[];
    }[]
  >;
}
