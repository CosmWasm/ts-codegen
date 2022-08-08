import { TSBuilder, TSBuilderInput } from './builder';

export { default as tsClient } from './generators/ts-client';
export { default as messageComposer } from './generators/message-composer';
export { default as reactQuery } from './generators/react-query';
export { default as recoil } from './generators/recoil';

export * from './utils';
export * from './utils/imports';
export * from './builder';
export * from './bundler';

export default async (input: TSBuilderInput) => {
    const builder = new TSBuilder(input);
    await builder.build()
};

