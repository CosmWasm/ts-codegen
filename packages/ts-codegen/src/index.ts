import { TSBuilder, TSBuilderInput } from './builder';

export { default as generateTypes } from './generators/types';
export { default as generateClient } from './generators/client';
export { default as generateMessageComposer } from './generators/message-composer';
export { default as generateMsgBuilder } from './generators/msg-builder';
export { default as generateReactQuery } from './generators/react-query';
export { default as generateRecoil } from './generators/recoil';
export { default as generateAbstractApp } from './generators/abstract-app';

export * from './utils';
export * from './builder';
export * from './bundler';
export * from './plugins';

export default async (input: TSBuilderInput) => {
    const builder = new TSBuilder(input);
    await builder.build();
};
