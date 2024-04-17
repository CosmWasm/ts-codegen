import { ContractInfo, ReactQueryOptions, TSTypesOptions } from 'wasm-ast-types';
import { ReactQueryPlugin } from '../src/plugins/react-query';
import { TypesPlugin } from '../src/plugins/types';
import { ClientPlugin } from '../src/plugins/client';
import { MessageComposerPlugin } from '../src/plugins/message-composer';
import { RecoilPlugin } from '../src/plugins/recoil';
import { MessageBuilderPlugin } from '../src/plugins/message-builder';

export async function generateReactQuery(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: ReactQueryOptions
) {
  await new ReactQueryPlugin(opts ?? {}).render(
    contractName,
    contractInfo,
    outPath
  );
}

export async function generateTypes(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: TSTypesOptions
) {
  await new TypesPlugin(opts ?? {}).render(
    contractName,
    contractInfo,
    outPath
  );
}

export async function generateClient(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: TSTypesOptions
) {
  await new ClientPlugin(opts ?? {}).render(
    contractName,
    contractInfo,
    outPath
  );
}

export async function generateMessageComposer(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: TSTypesOptions
) {
  await new MessageComposerPlugin(opts ?? {}).render(
    contractName,
    contractInfo,
    outPath
  );
}

export async function generateMessageBuilder(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: TSTypesOptions
) {
  await new MessageBuilderPlugin(opts ?? {}).render(
    contractName,
    contractInfo,
    outPath
  );
}

export async function generateRecoil(
  contractName: string,
  contractInfo: ContractInfo,
  outPath: string,
  opts?: TSTypesOptions
) {
  await new RecoilPlugin(opts ?? {}).render(
    contractName,
    contractInfo,
    outPath
  );
}
