import execute_msg from "../../../../__fixtures__/basic/execute_msg_for__empty.json";
import ownership from "../../../../__fixtures__/basic/ownership.json";

import {
  createMessageComposerClass,
  createMessageComposerInterface,
} from "./message-composer";
import { expectCode, makeContext } from "../../test-utils";
import * as t from "@babel/types";
import { createReactQueryMutationHooks } from "../react-query";

it("execute classes", () => {
  const ctx = makeContext(execute_msg);
  expectCode(
    createMessageComposerClass(
      ctx,
      "SG721MessageComposer",
      "SG721Message",
      execute_msg
    )
  );
});

it("createMessageComposerInterface", () => {
  const ctx = makeContext(execute_msg);
  expectCode(createMessageComposerInterface(ctx, "SG721Message", execute_msg));
});

it("ownershipClass", () => {
  const ctx = makeContext(ownership);
  expectCode(
    createMessageComposerClass(
      ctx,
      "OwnershipMessageComposer",
      "OwnershipMessage",
      ownership
    )
  );
});

it("ownershipInterface", () => {
  const ownershipCtx = makeContext(ownership);
  expectCode(
    createMessageComposerInterface(ownershipCtx, "OwnershipMessage", ownership)
  );
});
