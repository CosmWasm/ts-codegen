import * as t from '@babel/types';
import { clean } from '../utils/clean';
import { pascal } from 'case';
import { findExecuteMsg, findAndParseTypes, findQueryMsg } from '../utils';
import {
  ContractInfo,
  RenderContext,
  RenderContextBase,
  RenderOptions
} from 'wasm-ast-types';
import { BuilderFileType } from '../builder';
import { BuilderPluginBase } from './plugin-base';

export class TypesPlugin extends BuilderPluginBase<RenderOptions> {
  initContext(
    contract: ContractInfo,
    options?: RenderOptions
  ): RenderContextBase<RenderOptions> {
    return new RenderContext(contract, options);
  }

  async doRender(
    name: string,
    context: RenderContext
  ): Promise<
    {
      type: BuilderFileType;
      pluginType?: string;
      localname: string;
      body: any[];
    }[]
  > {
    const { enabled } = this.option.types;

    if (!enabled) {
      return;
    }

    const { schemas } = context.contract;
    const options = this.option.types;

    const localname = pascal(name) + '.types.ts';
    const ExecuteMsg = findExecuteMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

    const body = [];

    // TYPES
    Object.values(typeHash).forEach((type: t.Node) => {
      body.push(clean(type));
    });

    // alias the ExecuteMsg
    if (options.aliasExecuteMsg && ExecuteMsg) {
      body.push(
        t.exportNamedDeclaration(
          t.tsTypeAliasDeclaration(
            t.identifier(`${name}ExecuteMsg`),
            null,
            t.tsTypeReference(t.identifier('ExecuteMsg'))
          )
        )
      );
    }

    return [
      {
        type: 'type',
        localname,
        body
      }
    ];
  }
}
