import { prompt } from './utils/prompt';
import { Commands as commands } from './cmds';
import { MinimistArgs } from '@cosmology/ts-codegen-types';

const question = [
  {
    _: true,
    type: 'fuzzy',
    name: 'cmd',
    message: 'what do you want to do?',
    choices: Object.keys(commands)
  }
];

export const cli = async (argv: MinimistArgs) => {
  var { cmd } = await prompt(question, argv);
  if (typeof commands[cmd] === 'function') {
    await commands[cmd](argv);
  } else {
    console.log('command not found.');
  }
};
