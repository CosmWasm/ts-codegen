export interface ReactQueryOptions {
  enabled?: boolean;
  optionalClient?: boolean;
  version?: 'v3' | 'v4';
  mutations?: boolean;
  camelize?: boolean;
  queryKeys?: boolean
  queryFactory?: boolean
}

export interface TSClientOptions {
  enabled?: boolean;
  execExtendsQuery?: boolean;
  noImplicitOverride?: boolean;
}
export interface MessageComposerOptions {
  enabled?: boolean;
}
export interface MessageBuilderOptions {
  enabled?: boolean;
}
export interface RecoilOptions {
  enabled?: boolean;
}
export interface TSTypesOptions {
  enabled?: boolean;
  itemsUseTuples?: boolean;
  // deprecated
  aliasExecuteMsg?: boolean;
  aliasEntryPoints?: boolean;
}

export interface UseContractsOptions {
  enabled?: boolean;
};
