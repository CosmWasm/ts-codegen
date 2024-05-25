import generate from '@babel/generator';
import { parse, ParserPlugin } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import { sync as mkdirp } from 'mkdirp';
import { dirname } from 'path';

import { unused } from './unused';

export const writeAstToFile = (
  outPath: string,
  program: t.Statement[],
  filename: string,
  removeUnusedImports = false,
  isTsDisable = false,
  isEslintDisable = false
) => {
  const ast = t.program(program);
  const content = generate(ast as any).code;

  if (removeUnusedImports) {
    const plugins: ParserPlugin[] = ['typescript'];
    const newAst = parse(content, {
      sourceType: 'module',
      plugins,
    });
    traverse(newAst as any, unused);
    const content2 = generate(newAst as any).code;
    writeContentToFile(
      outPath,
      content2,
      filename,
      isTsDisable,
      isEslintDisable
    );
  } else {
    writeContentToFile(
      outPath,
      content,
      filename,
      isTsDisable,
      isEslintDisable
    );
  }
};

export const writeContentToFile = (
  outPath: string,
  content: string,
  filename: string,
  isTsDisable = false,
  isEslintDisable = false
) => {
  let esLintPrefix = '';
  let tsLintPrefix = '';

  let nameWithoutPath = filename.replace(outPath, '');
  // strip off leading slash
  if (nameWithoutPath.startsWith('/'))
    nameWithoutPath = nameWithoutPath.replace(/^\//, '');

  if (isTsDisable) {
    tsLintPrefix = `//@ts-nocheck\n`;
  }

  if (isEslintDisable) {
    esLintPrefix = `/* eslint-disable */\n`;
  }

  const text = tsLintPrefix + esLintPrefix + content;
  mkdirp(dirname(filename));
  writeFileSync(filename, text);
};
