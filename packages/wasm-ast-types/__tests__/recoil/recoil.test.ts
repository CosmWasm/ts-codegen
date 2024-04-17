import * as t from '@babel/types';

import query_msg from '../../../../__fixtures__/basic/query_msg.json';
import {
  createRecoilQueryClient,
  createRecoilSelector,
  createRecoilSelectors
} from '../../src/recoil/recoil';
import { expectCode, makeContext } from '../../test-utils';

const ctx = makeContext(query_msg);

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
      createRecoilSelectors(ctx, 'SG721', 'SG721QueryClient', query_msg)
    )
  );
});

it('client', () => {
  expectCode(createRecoilQueryClient(ctx, 'SG721', 'SG721QueryClient'));
});
