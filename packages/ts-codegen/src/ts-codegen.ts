#!/usr/bin/env node
import { cli } from './cli';

let argv = require('minimist')(process.argv.slice(2));

(async () => {
  await cli(argv);
})();
