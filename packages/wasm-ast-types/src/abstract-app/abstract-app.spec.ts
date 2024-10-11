import autocompounder_schema from '../../../../__fixtures__/abstract/apps/autocompounder.json';
import betting_schema from '../../../../__fixtures__/abstract/apps/betting.json';
import ibcmailclient_schema from '../../../../__fixtures__/abstract/apps/ibcmail/client.json';
import dex_schema from '../../../../__fixtures__/abstract/adapters/dex/dex.json';
import { expectCode, makeContext } from '../../test-utils';
import {
  createAppExecuteClass,
  createAppExecuteInterface,
  createAppQueryClass,
  createAppQueryInterface
} from './abstract-app';

it('IAutocompounderAppQueryClient', () => {
  const ctx = makeContext(autocompounder_schema.query);

  expectCode(
    createAppQueryInterface(
      ctx,
      'IAutocompounderAppQueryClient',
      'AutocompounderAppClient',
      autocompounder_schema.query
    )
  );
});

it('AutocompounderAppQueryClient', () => {
  const ctx = makeContext(autocompounder_schema.query);

  expectCode(
    createAppQueryClass(
      ctx,
      'Autocompounder',
      'AutocompounderAppQueryClient',
      'IAutocompounderAppQueryClient',
      autocompounder_schema.query
    )
  );
});

it('IAutocompounderAppClient', () => {
  const ctx = makeContext(autocompounder_schema.execute);

  expectCode(
    createAppExecuteInterface(
      ctx,
      'IAutocompounderAppClient',
      'AutocompounderAppClient',
      'IAutocompounderAppQueryClient',
      autocompounder_schema.execute
    )
  );
});

it('AutocompounderAppClient', () => {
  const ctx = makeContext(autocompounder_schema.execute);

  expectCode(
    createAppExecuteClass(
      ctx,
      'Autocompounder',
      'AutocompounderAppClient',
      'IAutocompounderAppClient',
      'AutocompounderAppQueryClient',
      autocompounder_schema.execute
    )
  );
});

it('IBettingAppQueryClient', () => {
  const ctx = makeContext(betting_schema.query);

  expectCode(
    createAppQueryInterface(
      ctx,
      'IBettingAppQueryClient',
      'BettingAppClient',
      betting_schema.query
    )
  );
});

it('BettingAppQueryClient', () => {
  const ctx = makeContext(betting_schema.query);

  expectCode(
    createAppQueryClass(
      ctx,
      'Betting',
      'BettingAppQueryClient',
      'IBettingAppQueryClient',
      betting_schema.query
    )
  );
});

it('IBettingAppClient', () => {
  const ctx = makeContext(betting_schema.execute);

  expectCode(
    createAppExecuteInterface(
      ctx,
      'IBettingAppClient',
      'BettingAppClient',
      'IBettingAppQueryClient',
      betting_schema.execute
    )
  );
});

it('BettingAppClient', () => {
  const ctx = makeContext(betting_schema.execute);

  expectCode(
    createAppExecuteClass(
      ctx,
      'Betting',
      'BettingAppClient',
      'IBettingAppClient',
      'BettingAppQueryClient',
      betting_schema.execute
    )
  );
});

it('IbcMailClientAppClient', () => {
  const ctx = makeContext(ibcmailclient_schema.execute);

  expectCode(
    createAppExecuteClass(
      ctx,
      'IbcMailClient',
      'IbcMailClientAppClient',
      'IIbcMailClientAppClient',
      'IbcMailClientAppQueryClient',
      ibcmailclient_schema.execute
    )
  );
});

it('DexAdapterClient', () => {
  const ctx = makeContext(dex_schema.execute, { abstractApp: { moduleType: 'adapter' }});

  expectCode(
    createAppExecuteClass(
      ctx,
      'DexClient',
      'DexAdapterClient',
      'IDexAdapterClient',
      'DexAdapterQueryClient',
      dex_schema.execute
    )
  );
});
