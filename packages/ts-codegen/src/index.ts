import { TSBuilder, TSBuilderInput } from './builder';

export * from './utils';
export * from './builder';
export * from './bundler';
export * from './plugins';

export default async (input: TSBuilderInput) => {
    const builder = new TSBuilder(input);
    await builder.build();
};