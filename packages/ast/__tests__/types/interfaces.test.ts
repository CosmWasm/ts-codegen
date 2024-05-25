
import { createTypeOrInterface } from '../../src';
import { expectCode, getLegacyFixture, makeContext } from '../../test-utils';

const topLevel = getLegacyFixture('misc/schema', '/arrays-top-level.json');
const nested = getLegacyFixture('misc/schema', '/arrays-nested.json');


it('top level', async () => {
  expectCode(
    createTypeOrInterface(makeContext(topLevel), 'Type', topLevel)
  );
});

it('nested', async () => {
  const ctx = makeContext(nested);
  expectCode(
    createTypeOrInterface(ctx, 'Type', nested)
  );
});

it('nested ctx', async () => {
  const ctx = makeContext(nested, {
    types: {
      itemsUseTuples: true
    }
  });
  expectCode(
    createTypeOrInterface(ctx, 'Type', nested)
  );
});
