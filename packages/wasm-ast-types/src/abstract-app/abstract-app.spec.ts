import autocompounder_schema from '../../../../__fixtures__/abstract/apps/autocompounder.json';
import { expectCode, makeContext } from '../../test-utils';
import { createAppQueryClass, createAppQueryInterface } from './abstract-app';

it('IReadOnlyAutocompounderClient', () => {
  const ctx = makeContext(autocompounder_schema);

  expectCode(
    createAppQueryInterface(
      ctx,
      'IAutocompounderQueryClient',
      autocompounder_schema.query
    )
  );
});


it('AutocompounderQueryClient', () => {
  const ctx = makeContext(autocompounder_schema);

  expectCode(
    createAppQueryClass(
      ctx,
      'Autocompounder',
      'AutocompounderQueryClient',
      'IAutocompounderQueryClient',
      autocompounder_schema.query
    )
  );
});

