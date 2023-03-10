import { ContractInfo } from "wasm-ast-types";
import { MsgBuilderOptions } from "wasm-ast-types";
import { BuilderFile } from "../builder";
declare const _default: (name: string, contractInfo: ContractInfo, outPath: string, msgBuilderOptions?: MsgBuilderOptions) => Promise<BuilderFile[]>;
export default _default;
