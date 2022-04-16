import { prompt } from '../prompt';
import cosmscript from '../index';

export default async (argv) => {

  const questions = [
    {
      _: true,
      type: 'path',
      name: 'rustContractPath',
      message: 'which directory contains the the Rust contracts?',
      default: './rust'
    },
    {
      _: true,
      type: 'path',
      name: 'outPath',
      message: 'where is the output directory?',
      default: './src'
    }
  ];

  const { rustContractPath, outPath } = await prompt(questions, argv);
  cosmscript(rustContractPath, outPath);
};