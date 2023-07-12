import * as t from "@babel/types";
import { ProviderInfo } from "../context";
export declare const createProvider: (name: string, providerInfos: {
    [key: string]: ProviderInfo;
}) => t.ExportNamedDeclaration;
