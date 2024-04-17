import { TSBuilder } from '../src/builder';

const FIXTURE_DIR = __dirname + '/../../../__fixtures__';

it('issue-98', async () => {
  const outPath = FIXTURE_DIR + '/issues/98/out';
  const schemaDir = FIXTURE_DIR + '/issues/98/';

  const builder = new TSBuilder({
    contracts: [
      schemaDir
    ],
    outPath,
    options: {
      types: {
        enabled: true
      },
      client: {
        enabled: true
      },
      reactQuery: {
        enabled: true
      }
    }
  });
  await builder.build();
});