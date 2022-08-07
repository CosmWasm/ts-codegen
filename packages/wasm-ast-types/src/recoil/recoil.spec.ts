import * as t from '@babel/types';
import query_msg from '../../../../__fixtures__/basic/query_msg.json';
import {
    createRecoilSelector,
    createRecoilSelectors,
    createRecoilQueryClient,
} from './recoil';
import { RenderContext } from '../context';
import { expectCode } from '../../test-utils';

const ctx = new RenderContext(query_msg);

it('selector', () => {
    expectCode(createRecoilSelector(
        ctx,
        'SG721',
        'SG721QueryClient',
        'governanceModules'
    ))
});

it('selectors', () => {
    expectCode(t.program(createRecoilSelectors(
        ctx,
        'SG721',
        'SG721QueryClient',
        query_msg
    )))
});

it('client', () => {
    expectCode(createRecoilQueryClient(
        ctx,
        'SG721',
        'SG721QueryClient'
    ))
});
