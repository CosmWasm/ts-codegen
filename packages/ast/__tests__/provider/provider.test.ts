import {
  createGettingProviders,
  createIContractsContext,
  createProvider
} from '../../src/provider/provider';
import { PROVIDER_TYPES } from '../../src/utils/constants';
import { expectCode } from '../../test-utils';


// Use 'typeof PROVIDER_TYPES[keyof typeof PROVIDER_TYPES]' to extract the values of PROVIDER_TYPES.
type ProviderTypes = typeof PROVIDER_TYPES[keyof typeof PROVIDER_TYPES];
interface TestProviderInfo {
  classname: string;
}

// Use the values from PROVIDER_TYPES as the keys for TestProviderInfos
type ProviderInfos = {
  [key in ProviderTypes]: TestProviderInfo
};

it('execute class', () => {
  const info: ProviderInfos = {} as ProviderInfos;

  info[PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: 'WhitelistClient'
  };

  info[PROVIDER_TYPES.QUERY_CLIENT_TYPE] = {
    classname: 'WhitelistQueryClient'
  };

  info[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE] = {
    classname: 'WhitelistMessageComposer'
  };

  // @ts-ignore
  expectCode(createProvider('Whitelist', info));
});

it('execute class without message composer', () => {
  const info: ProviderInfos = {};

  info[PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: 'WhitelistClient'
  };

  info[PROVIDER_TYPES.QUERY_CLIENT_TYPE] = {
    classname: 'WhitelistQueryClient'
  };

  // @ts-ignore
  expectCode(createProvider('Whitelist', info));
});

it('create IContractsContext', () => {
  const info: any = {
    Whitelist: {},
    Marketplace: {}
  }

  info['Whitelist'][PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: 'WhitelistClient'
  };

  info['Whitelist'][PROVIDER_TYPES.QUERY_CLIENT_TYPE] = {
    classname: 'WhitelistQueryClient'
  };

  info['Marketplace'][PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: 'MarketplaceClient'
  };

  expectCode(createIContractsContext(info));
});

it('create getProviders', () => {
  const info: any = {
    Whitelist: {},
    Marketplace: {}
  };

  info['Whitelist'][PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: 'WhitelistClient'
  };

  info['Whitelist'][PROVIDER_TYPES.QUERY_CLIENT_TYPE] = {
    classname: 'WhitelistQueryClient'
  };

  info['Marketplace'][PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: 'MarketplaceClient'
  };

  expectCode(createGettingProviders(info));
});
