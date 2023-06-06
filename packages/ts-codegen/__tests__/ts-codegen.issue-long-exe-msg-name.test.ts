import { TSBuilder } from '../src/builder';

const FIXTURE_DIR = __dirname + '/../../../__fixtures__';
const OUTPUT_DIR = __dirname + '/../../../__output__';

it('issue-long-exe-msg-name', async () => {
  const outPath = OUTPUT_DIR + '/sg721-updatable/out';
  const schemaDir = FIXTURE_DIR + '/sg721-updatable/';

  const builder = new TSBuilder({
    contracts: [schemaDir],
    outPath,
    options: {
      messageComposer: {
        enabled: true
      },
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
