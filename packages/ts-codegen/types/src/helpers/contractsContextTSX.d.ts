export declare const contractsContextTSX = "\nimport React, { useEffect, useMemo, useRef, useState, useContext } from 'react';\nimport {\n  CosmWasmClient,\n  SigningCosmWasmClient,\n} from '@cosmjs/cosmwasm-stargate';\n\nimport { IContractsContext, getProviders } from './contractContextProviders';\n\nexport interface ContractsConfig {\n  address: string | undefined;\n  getCosmWasmClient: () => Promise<CosmWasmClient>;\n  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>;\n}\n\nconst ContractsContext = React.createContext<IContractsContext | null>(null);\n\nexport const ContractsProvider = ({\n  children,\n  contractsConfig,\n}: {\n  children: React.ReactNode;\n  contractsConfig: ContractsConfig;\n}) => {\n  const [cosmWasmClient, setCosmWasmClient] = useState<CosmWasmClient>();\n  const [signingCosmWasmClient, setSigningCosmWasmClient] =\n    useState<SigningCosmWasmClient>();\n\n  const { address, getCosmWasmClient, getSigningCosmWasmClient } =\n    contractsConfig;\n\n  const prevAddressRef = useRef<string | undefined>(address);\n\n  const contracts: IContractsContext = useMemo(() => {\n    return getProviders(address, cosmWasmClient, signingCosmWasmClient);\n  }, [address, cosmWasmClient, signingCosmWasmClient]);\n\n  useEffect(() => {\n    const connectSigningCwClient = async () => {\n      if (address && prevAddressRef.current !== address) {\n        const signingCosmWasmClient = await getSigningCosmWasmClient();\n        setSigningCosmWasmClient(signingCosmWasmClient);\n      } else if (!address) {\n        setSigningCosmWasmClient(undefined);\n      }\n      prevAddressRef.current = address;\n    };\n    connectSigningCwClient();\n  }, [address, getSigningCosmWasmClient]);\n\n  useEffect(() => {\n    const connectCosmWasmClient = async () => {\n      const cosmWasmClient = await getCosmWasmClient();\n      setCosmWasmClient(cosmWasmClient);\n    };\n    connectCosmWasmClient();\n  }, [getCosmWasmClient]);\n\n  return (\n    <ContractsContext.Provider value={contracts}>\n      {children}\n    </ContractsContext.Provider>\n  );\n};\n\nexport const useContracts = () => {\n  const contracts: IContractsContext = useContext(ContractsContext);\n  if (contracts === null) {\n    throw new Error('useContracts must be used within a ContractsProvider');\n  }\n  return contracts;\n};\n";
