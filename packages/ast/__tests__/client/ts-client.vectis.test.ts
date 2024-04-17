import {
  expectCode,
  makeContext,
} from '../../test-utils';

import {
  vectisCanExecuteRelayResponse,
  vectisCosmosMsgForEmpty,
  vectisExecuteMsgForEmpty,
  vectisInfoResponse,
  vectisRelayTransaction
} from '../../test-utils/fixtures';

import { ExecuteMsg } from '../../src';

import {
  createExecuteClass,
  createExecuteInterface,
  createQueryClass,
  createTypeInterface
} from '../../src';

it('cosmos_msg_for__empty', () => {
  const ctx = makeContext(vectisCosmosMsgForEmpty);
  expectCode(createTypeInterface(ctx, vectisCosmosMsgForEmpty));
});

it('execute_msg_for__empty', () => {
  const ctx = makeContext(vectisExecuteMsgForEmpty);
  expectCode(createTypeInterface(ctx, vectisExecuteMsgForEmpty));
});

it('can_execute_relay_response', () => {
  const ctx = makeContext(vectisCanExecuteRelayResponse);
  expectCode(createTypeInterface(ctx, vectisCanExecuteRelayResponse));
});

it('info_response', () => {
  const ctx = makeContext(vectisInfoResponse);
  expectCode(createTypeInterface(ctx, vectisInfoResponse));
});

it('relay_transaction', () => {
  const ctx = makeContext(vectisRelayTransaction);
  expectCode(createTypeInterface(ctx, vectisRelayTransaction));
});

it('query classes', () => {
  const ctx = makeContext(vectisCosmosMsgForEmpty);
  expectCode(
    createQueryClass(
      ctx,
      'SG721QueryClient',
      'SG721ReadOnlyInstance',
      // @ts-ignore
      vectisCosmosMsgForEmpty
    )
  );
});

it('query classes', () => {
  const ctx = makeContext(vectisExecuteMsgForEmpty);
  expectCode(
    createQueryClass(
      ctx,
      'SG721QueryClient',
      'SG721ReadOnlyInstance',
      // @ts-ignore
      vectisExecuteMsgForEmpty
    )
  );
});

it('execute classes array types', () => {
  const ctx = makeContext(vectisExecuteMsgForEmpty);
  expectCode(
    createExecuteClass(
      ctx,
      'SG721Client',
      'SG721Instance',
      null,
      // @ts-ignore
      vectisExecuteMsgForEmpty as ExecuteMsg
    )
  );
});

it('execute interfaces no extends', () => {
  const ctx = makeContext(vectisExecuteMsgForEmpty);
  expectCode(
    // @ts-ignore
    createExecuteInterface(ctx, 'SG721Instance', null, vectisExecuteMsgForEmpty)
  );
});
