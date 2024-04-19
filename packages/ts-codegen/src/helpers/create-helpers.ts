import { join, dirname, basename, extname } from "path";
import { sync as mkdirp } from "mkdirp";
import { writeContentToFile } from "../utils/files";
import { BuilderFile, TSBuilderInput } from "../builder";
import {
  contractContextBase,
  contractContextBaseShortHandCtor,
  contractsContextTSX,
} from "../helpers";
import { BuilderContext } from "@cosmwasm/ts-codegen-ast";
import { header } from "../utils/header";

const write = (
  outPath: string,
  file: string,
  content: string,
  varname?: string
): BuilderFile => {
  const outFile = join(outPath, file);
  mkdirp(dirname(outFile));
  writeContentToFile(outPath, header + content, outFile);

  return {
    type: "plugin",
    pluginType: "helper",
    contract: varname ?? basename(file, extname(file)),
    localname: file,
    filename: outFile,
  };
};

export const createHelpers = (
  input: TSBuilderInput,
  builderContext: BuilderContext
): BuilderFile[] => {
  const files: BuilderFile[] = [];

  if (
    input.options?.useContractsHook?.enabled &&
    Object.keys(builderContext.providers)?.length
  ) {
    const useShorthandCtor = input.options?.useShorthandCtor;
    files.push(
      write(
        input.outPath,
        "contractContextBase.ts",
        useShorthandCtor
          ? contractContextBaseShortHandCtor
          : contractContextBase
      )
    );
    files.push(
      write(
        input.outPath,
        "contracts-context.tsx",
        contractsContextTSX,
        "contractsContext"
      )
    );
  }

  return files;
};
