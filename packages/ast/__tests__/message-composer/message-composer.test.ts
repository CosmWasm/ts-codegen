import {
  createMessageComposerClass,
  createMessageComposerInterface,
} from "../../src";
import { expectCode, getLegacyFixture, getMsgExecuteLegacyFixture, makeContext } from "../../test-utils";

const execMsg = getMsgExecuteLegacyFixture('basic', '/execute_msg_for__empty.json')
const ownership = getLegacyFixture('basic', '/ownership.json')


it("execute classes", () => {
  const ctx = makeContext(execMsg);
  expectCode(
    createMessageComposerClass(
      ctx,
      "SG721MessageComposer",
      "SG721Message",
      execMsg
    )
  );
});

it("createMessageComposerInterface", () => {
  const ctx = makeContext(execMsg);
  expectCode(createMessageComposerInterface(ctx, "SG721Message", execMsg));
});

it("ownershipClass", () => {
  const ctx = makeContext(ownership);
  expectCode(
    createMessageComposerClass(
      ctx,
      "OwnershipMessageComposer",
      "OwnershipMessage",
      // @ts-ignore
      ownership
    )
  );
});

it("ownershipInterface", () => {
  const ownershipCtx = makeContext(ownership);
  expectCode(
    // @ts-ignore
    createMessageComposerInterface(ownershipCtx, "OwnershipMessage", ownership)
  );
});
