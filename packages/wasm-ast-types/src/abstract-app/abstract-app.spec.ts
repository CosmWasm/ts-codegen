import autocompounder_schema from '../../../../__fixtures__/abstract/apps/autocompounder.json';
import ibcmailclient_schema from '../../../../__fixtures__/abstract/apps/ibcmail/client.json';
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
