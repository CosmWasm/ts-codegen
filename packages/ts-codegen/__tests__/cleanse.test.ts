import { writeFileSync } from 'fs';
import { sync as mkdirp } from 'mkdirp';

import { readSchemas } from '../src/utils';

const FIXTURE_DIR = __dirname + '/../../../__fixtures__';
const OUTPUT_DIR = __dirname + '/../../../__output__';


it('sg721', async () => {
  const out = OUTPUT_DIR + '/sg721';
  const schemaDir = FIXTURE_DIR + '/sg721/';

  const clean = await readSchemas({ schemaDir, clean: true });
  const orig = await readSchemas({ schemaDir, clean: false });

  mkdirp(out);
  writeFileSync(out + '/orig.json', JSON.stringify(orig, null, 2));
  writeFileSync(out + '/clean.json', JSON.stringify(clean, null, 2));

})

it('daodao/cw-code-id-registry', async () => {
  const out = OUTPUT_DIR + '/daodao/cw-code-id-registry';
  const schemaDir = FIXTURE_DIR + '/daodao/cw-code-id-registry/';

  const clean = await readSchemas({ schemaDir, clean: true });
  const orig = await readSchemas({ schemaDir, clean: false });

  mkdirp(out);
  writeFileSync(out + '/orig.json', JSON.stringify(orig, null, 2));
  writeFileSync(out + '/clean.json', JSON.stringify(clean, null, 2));
})

it('issues/103', async () => {
  const out = OUTPUT_DIR + '/issues/103';
  const schemaDir = FIXTURE_DIR + '/issues/103/';

  const clean = await readSchemas({ schemaDir, clean: true });
  const orig = await readSchemas({ schemaDir, clean: false });

  mkdirp(out);
  writeFileSync(out + '/orig.json', JSON.stringify(orig, null, 2));
  writeFileSync(out + '/clean.json', JSON.stringify(clean, null, 2));
})

