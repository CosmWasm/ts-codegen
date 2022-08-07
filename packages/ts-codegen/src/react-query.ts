import { pascal } from "case";
import { header } from './header';
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import { RenderContext } from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";
import { findAndParseTypes, findExecuteMsg, findQueryMsg, getDefinitionSchema } from './utils';
import { getMessageProperties, ReactQueryOptions } from "wasm-ast-types";
import { cosmjsAminoImportStatements } from './imports';

export default async (
    contractName: string,
    schemas: any[],
    outPath: string,
    reactQueryOptions?: ReactQueryOptions
) => {
    const context = new RenderContext(getDefinitionSchema(schemas), {
        reactQuery: reactQueryOptions ?? {}
    });
    const options = context.options.reactQuery;

    const ReactQueryFile = pascal(`${contractName}Contract`) + '.react-query.ts';
    const Contract = pascal(`${contractName}Contract`)

    const QueryMsg = findQueryMsg(schemas);
    const ExecuteMsg = findExecuteMsg(schemas);
    const typeHash = await findAndParseTypes(schemas);

    const ExecuteClient = pascal(`${contractName}Client`);
    const QueryClient = pascal(`${contractName}QueryClient`);

    const body = [];

    const reactQueryImports = ['useQuery', 'UseQueryOptions']
    const clientImports = []

    QueryMsg && clientImports.push(QueryClient)

    // check that there are commands within the exec msg
    const shouldGenerateMutationHooks = ExecuteMsg && options?.v4 && options?.mutations && getMessageProperties(ExecuteMsg).length > 0

    if (shouldGenerateMutationHooks) {
        body.push(w.importStmt(['ExecuteResult'], '@cosmjs/cosmwasm-stargate'));
        body.push(cosmjsAminoImportStatements(typeHash))
        reactQueryImports.push('useMutation', 'UseMutationOptions')
        clientImports.push(ExecuteClient)
    }

    // react-query imports
    body.push(
        w.importStmt(reactQueryImports, options?.v4 ? '@tanstack/react-query' : 'react-query')
    );

    // general contract imports
    body.push(w.importStmt(Object.keys(typeHash), `./${Contract}`));

    // client imports
    body.push(w.importStmt(clientImports, `./${Contract}`));

    // query messages
    if (QueryMsg) {
        [].push.apply(body,
            w.createReactQueryHooks({
                context,
                queryMsg: QueryMsg,
                contractName: contractName,
                QueryClient
            })
        );
    }

    if (shouldGenerateMutationHooks) {
        [].push.apply(body,
            w.createReactQueryMutationHooks({
                context,
                execMsg: ExecuteMsg,
                contractName: contractName,
                ExecuteClient
            })
        );
    }



    const code = header + generate(
        t.program(body)
    ).code;

    mkdirp(outPath);
    writeFileSync(join(outPath, ReactQueryFile), code);
};
