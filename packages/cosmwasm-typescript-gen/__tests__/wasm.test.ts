import cosmos_msg from '../__fixtures__/vectis/cosmos_msg_for__empty.json';
import execute_msg from '../__fixtures__/vectis/execute_msg_for__empty.json';
import cosmscript from '../src/index';
import { sync as glob } from 'glob';
import { readFileSync } from 'fs';

it('works', async () => {
    const files = glob(__dirname + '/../__fixtures__/vectis/**/*.json');
    const schemas = files.map(file => JSON.parse(readFileSync(file, 'utf-8')));
    await cosmscript('MyContract', schemas, __dirname + '/../__output__/vectis');
})