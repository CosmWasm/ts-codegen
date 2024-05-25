import * as t from '@babel/types';
import { QueryMsg } from '@cosmwasm/ts-codegen-types';

import {
  createRecoilQueryClient,
  createRecoilSelector,
  createRecoilSelectors
} from '../../src/recoil/recoil';
import { expectCode, globLegacyContracts, makeContext } from '../../test-utils';

const globbed = globLegacyContracts('basic').find(c => c.name === '/query_msg.json');
const queryMsg = globbed.content as QueryMsg;
const ctx = makeContext(queryMsg);

it('selector', () => {
  expectCode(
    createRecoilSelector(
      ctx,
      'SG721',
      'SG721QueryClient',
      'governanceModules',
      'GovernanceModulesResponse'
    )
  );
});

it('selectors', () => {
  expectCode(
    t.program(
      createRecoilSelectors(ctx, 'SG721', 'SG721QueryClient', queryMsg)
    )
  );
});

it('client', () => {
  expectCode(createRecoilQueryClient(ctx, 'SG721', 'SG721QueryClient'));
});
