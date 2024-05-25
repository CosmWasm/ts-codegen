#!/usr/bin/env node
import { readFileSync } from 'fs';

import { cli } from './cli';
import { prompt } from './utils/prompt';

const argv = require('minimist')(process.argv.slice(2));

const question = [
  {
    _: true,
    type: 'string',
    name: 'file',
    message: 'file'
  }
];

(async () => {
  const { file } = await prompt(question, argv);
  const argvv = JSON.parse(readFileSync(file, 'utf-8'));
  await cli(argvv);
})();
