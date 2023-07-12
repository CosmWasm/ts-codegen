import execute_msg from "../../../../__fixtures__/basic/execute_msg_for__empty.json";
import query_msg from "../../../../__fixtures__/basic/query_msg.json";
import ownership from "../../../../__fixtures__/basic/ownership.json";
import { createProvider } from "./provider";

import { expectCode, makeContext } from "../../test-utils";
import { PROVIDER_TYPES } from "../utils/constants";

it("execute class", () => {
  let info = {};

  info[PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: "WhitelistClient"
  }

  info[PROVIDER_TYPES.QUERY_CLIENT_TYPE] = {
    classname: "WhitelistQueryClient"
  }

  info[PROVIDER_TYPES.MESSAGE_COMPOSER_TYPE] = {
    classname: "WhitelistMessageComposer"
  }

  expectCode(createProvider("Whitelist", info));
});

it("execute class without message composer", () => {
  let info = {};

  info[PROVIDER_TYPES.SIGNING_CLIENT_TYPE] = {
    classname: "WhitelistClient"
  }

  info[PROVIDER_TYPES.QUERY_CLIENT_TYPE] = {
    classname: "WhitelistQueryClient"
  }

  expectCode(createProvider("Whitelist", info));
});
