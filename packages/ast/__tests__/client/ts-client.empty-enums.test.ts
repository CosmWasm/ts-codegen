import {
  createQueryClass,
  createQueryInterface
} from '../../src';
import { expectCode, getMsgQueryLegacyFixture, makeContext } from '../../test-utils';

const queryMsg = getMsgQueryLegacyFixture('daodao/cw-admin-factory', '/query_msg.json');
const ctx = makeContext(queryMsg);

it('query classes', () => {
  expectCode(createQueryClass(
    ctx,
    'SG721QueryClient',
    'SG721ReadOnlyInstance',
    queryMsg
  ));
});

it('query interface', () => {
  expectCode(
    createQueryInterface(
      ctx,
      'ReadOnlyInstance',
      queryMsg
    )
  );
});
