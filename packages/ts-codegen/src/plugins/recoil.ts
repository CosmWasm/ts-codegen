import * as w from '@cosmwasm/ts-codegen-ast';
import {
  ContractInfo,
  RenderContext,
  RenderContextBase,
  RenderOptions,
  UtilMapping
} from '@cosmwasm/ts-codegen-ast';
import { pascal } from 'case';

import { BuilderFileType } from '../builder';
import { findAndParseTypes, findQueryMsg } from '../utils';
import { BuilderPluginBase } from './plugin-base';

export class RecoilPlugin extends BuilderPluginBase<RenderOptions> {
  utils: UtilMapping = {
    selectorFamily: 'recoil',
  };
  initContext(
    contract: ContractInfo,
    options?: RenderOptions
  ): RenderContextBase<RenderOptions> {
    return new RenderContext(contract, options, this.builder?.builderContext);
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
    const { enabled } = this.options.recoil;

    if (!enabled) {
      return;
    }

    const { schemas } = context.contract;

    const localname = pascal(name) + '.recoil.ts';
    const ContractFile = pascal(name) + '.client';
    const TypesFile = pascal(name) + '.types';

    const QueryMsg = findQueryMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

    let QueryClient = null;
    let ReadOnlyInstance = null;

    const body = [];

    body.push(w.importStmt(['cosmWasmClient'], './chain'));

    body.push(w.importStmt(Object.keys(typeHash), `./${TypesFile}`));

    // query messages
    if (QueryMsg) {
      QueryClient = pascal(`${name}QueryClient`);
      ReadOnlyInstance = pascal(`${name}ReadOnlyInterface`);

      body.push(w.importStmt([QueryClient], `./${ContractFile}`));

      body.push(w.createRecoilQueryClientType());
      body.push(w.createRecoilQueryClient(context, name, QueryClient));

      const selectors = w.createRecoilSelectors(context, name, QueryClient, QueryMsg);

      body.push(...selectors);
    }

    if (typeHash.hasOwnProperty('Coin')) {
      // @ts-ignore
      delete context.utils.Coin;
    }

    return [
      {
        type: 'recoil',
        localname,
        body
      }
    ];
  }
}
