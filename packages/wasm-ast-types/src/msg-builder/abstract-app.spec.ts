import execute_msg from '../../../../__fixtures__/basic/execute_msg_for__empty.json';
import autocompounder_schema from '../../../../__fixtures__/abstract/apps/autocompounder-schema.json';
import { createMsgBuilderClass } from './msg-builder';
import { expectCode, makeContext } from '../../test-utils';
import { createQueryClass } from '../client';
import { createAbstractAppClass, createReadOnlyAppManager } from './abstract-app';
import { findQueryMsg } from '@cosmwasm/ts-codegen';
import { readSchemas } from '@cosmwasm/ts-codegen/src';

it('readonly manager', () => {
  const ctx = makeContext(autocompounder_schema);

  expectCode(
    createReadOnlyAppManager(
      ctx,
      'Autocompounder',
      'ReadOnlyAutocompounderManager',
      'IReadOnlyAutocompounderManager',
      autocompounder_schema.query
    )
  );
});
