import { expectCode, makeContext } from '../../test-utils';
import { query as etfQuery } from '../../../../__fixtures__/abstract/apps/etf.json';
import { query as subscriptionQuery } from '../../../../__fixtures__/abstract/apps/subscription.json';
import { query as autocompounderQuery } from '../../../../__fixtures__/abstract/apps/autocompounder.json';
import { createQueryOptionsFactory } from './query-options-factory';
import query_msg from '../../../../__fixtures__/basic/query_msg.json';

it('etf', () => {
  const ctx = makeContext(etfQuery);
  expectCode(createQueryOptionsFactory(ctx, 'Etf', etfQuery, true));
});

it('subscription', () => {
  const ctx = makeContext(subscriptionQuery);
  expectCode(
    createQueryOptionsFactory(ctx, 'Subscription', subscriptionQuery, true)
  );
});

it('queryMsg', () => {
  const ctx = makeContext(query_msg);
  expectCode(createQueryOptionsFactory(ctx, 'Contract', query_msg, false));
});

it('autocompounderQueryMsg', () => {
  const ctx = makeContext(autocompounderQuery);
  expectCode(
    createQueryOptionsFactory(ctx, 'Autocompounder', autocompounderQuery, false)
  );
});
