import { TSBuilder, TSBuilderInput } from './builder';

export * from './builder';
export * from './bundler';
export * from './plugins';
export * from './utils';

export default async (input: TSBuilderInput) => {
  const builder = new TSBuilder(input);
  await builder.build();
};