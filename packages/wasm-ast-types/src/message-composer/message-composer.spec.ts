import execute_msg from '../../../../__fixtures__/basic/execute_msg_for__empty.json';
import {
    createMessageComposerClass,
    createMessageComposerInterface
} from './message-composer'
import { RenderContext } from '../context';
import { expectCode } from '../../test-utils';

it('execute classes', () => {
    const ctx = new RenderContext(execute_msg);
    expectCode(createMessageComposerClass(
        ctx,
        'SG721MessageComposer',
        'SG721Message',
        execute_msg
    ))
});

it('createMessageComposerInterface', () => {
    const ctx = new RenderContext(execute_msg);
    expectCode(createMessageComposerInterface(
        ctx,
        'SG721Message',
        execute_msg
    ))
});
