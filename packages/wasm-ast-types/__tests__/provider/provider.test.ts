import {
  createGettingProviders,
  createIContractsContext,
  createProvider
} from '../../src/provider/provider';
import { PROVIDER_TYPES } from '../../src/utils/constants';
import { expectCode } from '../../test-utils';

it('execute class', () => {
  const info = {};

  info[PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: 'WhitelistClient'
  };

  info[PROVIDER_TYPES.QUERY_CLIENT_TYPE] = {
    classname: 'WhitelistQueryClient'
  };

  info[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE] = {
    classname: 'WhitelistMessageComposer'
  };

  expectCode(createProvider('Whitelist', info));
});

it('execute class without message composer', () => {
  const info = {};

  info[PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: 'WhitelistClient'
  };

  info[PROVIDER_TYPES.QUERY_CLIENT_TYPE] = {
    classname: 'WhitelistQueryClient'
  };

  expectCode(createProvider('Whitelist', info));
});

it('create IContractsContext', () => {
  const info = {
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

  expectCode(createIContractsContext(info));
});

it('create getProviders', () => {
  const info = {
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
