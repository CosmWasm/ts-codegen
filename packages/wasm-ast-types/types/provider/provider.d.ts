import * as t from "@babel/types";
import { ProviderInfo } from "../context";
export declare const createProvider: (name: string, providerInfos: {
    [key: string]: ProviderInfo;
}) => t.ExportNamedDeclaration;
export declare const createIContractsContext: (providerInfos: {
    [key: string]: {
        [key: string]: ProviderInfo;
    };
}) => t.ExportNamedDeclaration;
export declare const createProperty: (name: string, providerInfos: {
    [key: string]: ProviderInfo;
}) => t.TSTypeElement;
export declare const createGettingProviders: (providerInfos: {
    [key: string]: {
        [key: string]: ProviderInfo;
    };
}) => t.ExportNamedDeclaration;
