import generate from '@babel/generator';
import * as t from '@babel/types';
import { ContractInfo, defaultOptions,IContext, UtilMapping } from '@cosmwasm/ts-codegen-ast';
import deepmerge from 'deepmerge';
import { writeFileSync } from 'fs';
import { sync as mkdirp } from 'mkdirp';
import { join } from 'path';

import {
  BuilderFile,
  BuilderFileType,
  TSBuilder,
} from '../builder';
import { header } from '../utils/header';

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
   * prop to indicate to execute the render function in the lifecycle of main process or after
   */
  readonly lifecycle: 'main' | 'after';

  defaultContractName?: string;

  /**
   * render generated cdoe.
   * @param name the name of contract
   * @param contractInfo contract
   * @param outPath the path of generated code.
   * @returns info of generated files.
   */
  render(
    outPath: string,
    name?: string,
    contractInfo?: ContractInfo,
  ): Promise<BuilderFile[]>;
}

/**
 * BuilderPluginBase enable ts-codegen users implement their own plugins by only implement a few functions.
 */
export abstract class BuilderPluginBase<TOpt extends { enabled?: boolean }>
implements IBuilderPlugin {
  builder?: TSBuilder;
  options: TOpt;
  utils: UtilMapping;
  /**
   * prop to indicate to execute the render function in the lifecycle of main process or after
   */
  lifecycle: 'main' | 'after';

  defaultContractName?: string;

  constructor(opts?: TOpt, builder?: TSBuilder) {
    this.options = opts;
    this.builder = builder;
    this.lifecycle = 'main';
  }

  setBuilder(builder: TSBuilder): void {
    this.builder = builder;
  }

  async render(
    outPath: string,
    name?: string,
    contractInfo?: ContractInfo,
  ): Promise<BuilderFile[]> {
    if (!this.options) {
      this.options = this.getDefaultOptions(this.options);
    }

    const { enabled } = this.options;

    if (!enabled) {
      return;
    }

    const context = this.initContext(contractInfo, this.options);

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

  /**
   * get default options
   */
  getDefaultOptions(opts: TOpt): any {
    return deepmerge(defaultOptions, opts ?? {});
  }
}
