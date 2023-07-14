import * as t from "@babel/types";
export declare const writeAstToFile: (outPath: string, program: t.Statement[], filename: string, removeUnusedImports?: boolean, isTsDisable?: boolean, isEslintDisable?: boolean) => void;
export declare const writeContentToFile: (outPath: string, content: string, filename: string, isTsDisable?: boolean, isEslintDisable?: boolean) => void;
