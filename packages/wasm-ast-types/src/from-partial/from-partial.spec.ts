import execute_msg from '../../../../__fixtures__/basic/execute_msg_for__empty.json';
import {
    createFromPartialClass,
    createFromPartialInterface
} from './from-partial'
import { RenderContext } from '../context';
import { expectCode } from '../../test-utils';

it('execute classes', () => {
    const ctx = new RenderContext(execute_msg);
    expectCode(createFromPartialClass(
        ctx,
        'SG721MessageComposer',
        'SG721Message',
        execute_msg
    ))
});

it('createFromPartialInterface', () => {
    const ctx = new RenderContext(execute_msg);
    expectCode(createFromPartialInterface(
        ctx,
        'SG721Message',
        execute_msg
    ))
});
