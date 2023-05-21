import autocompounder_schema from '../../../../__fixtures__/abstract/apps/autocompounder.json';
import { expectCode, makeContext } from '../../test-utils';
import {
  createAppExecuteClass,
  createAppExecuteInterface,
  createAppQueryClass,
  createAppQueryInterface
} from './abstract-app';

it('IAutocompounderAppQueryClient', () => {
  const ctx = makeContext(autocompounder_schema);

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
  const ctx = makeContext(autocompounder_schema);

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
  const ctx = makeContext(autocompounder_schema);

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
  const ctx = makeContext(autocompounder_schema);

  expectCode(
    createAppExecuteClass(
      ctx,
      'Autocompounder',
      'AutocompounderAppClient',
      'IAutocompounderAppClient',
      autocompounder_schema.execute
    )
  );
});
