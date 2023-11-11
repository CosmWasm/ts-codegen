import { ContractInfo } from "wasm-ast-types";
import { MessageBuilderOptions } from "wasm-ast-types";
import { BuilderFile } from "../builder";
declare const _default: (name: string, contractInfo: ContractInfo, outPath: string, messageBuilderOptions?: MessageBuilderOptions) => Promise<BuilderFile[]>;
export default _default;
