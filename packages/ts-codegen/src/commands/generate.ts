import { prompt } from '../utils/prompt';
import codegen from '../index';
import { TSBuilderOptions } from '../builder';

export default async (argv) => {
    const questions = [
        {
            _: true,
            type: 'path',
            name: 'schema',
            message: 'which directory contains the the Rust contracts?',
            default: './schema'
        },
        {
            _: true,
            type: 'path',
            name: 'out',
            message: 'where is the output directory?',
            default: './ts'
        },
        {
            _: true,
            type: 'string',
            name: 'name',
            message: 'contract name?'
        },
        {
            type: 'checkbox',
            name: 'plugin',
            message: 'which plugins?',
            choices: [
                'client',
                'recoil',
                'react-query',
                'message-composer',
                'msg-builder',
                'abstract-app'
            ]
        },
        {
            type: 'confirm',
            name: 'bundle',
            message: 'enable bundle?',
            default: true
        }
    ];

    if (argv.typesOnly) {
        argv.plugin = 'types';
    }

    let { schema, out, name, plugin, bundle } = await prompt(questions, argv);
    if (!Array.isArray(plugin)) plugin = [plugin];

    ///////// REACT QUERY
    const questions2 = [];
    if (plugin.includes('react-query')) {
        [].push.apply(questions2, [
            {
                type: 'confirm',
                name: 'optionalClient',
                message: 'optionalClient?',
                default: false
            },
            {
                type: 'list',
                name: 'version',
                message: 'which react-query version?',
                default: 'v3',
                choices: ['v3', 'v4']
            },
            {
                type: 'confirm',
                name: 'queryKeys',
                message: 'queryKeys?',
                default: false
            },
        ])
    };
    const { optionalClient, version, queryKeys } = await prompt(questions2, argv);
    const questions3 = [];
    if (version === 'v4') {
        [].push.apply(questions3, [
            // currently we only support v4 for useMutation
            {
                type: 'confirm',
                name: 'mutations',
                message: 'Generate useMutation hooks?',
                default: false
            }

        ])
    };
    const { mutations } = await prompt(questions3, argv);

    const queryFactoryQuestions  = [];
    if (queryKeys) {
      [].push.apply(queryFactoryQuestions, [
        // Only can use queryFactory if queryKeys is enabled
        {
          type: 'confirm',
          name: 'queryFactory',
          message: 'queryFactory?',
          default: false
        }
      ])
    };
    const { queryFactory } = await prompt(queryFactoryQuestions, argv);
    ///////// END REACT QUERY

    ///////// BUNDLE
    const questions4 = [];
    if (bundle) {
        [].push.apply(questions4, [
            {
                type: 'string',
                name: 'bundleFile',
                message: 'bundleFile?',
                default: 'index.ts'
            },
            {
                type: 'string',
                name: 'bundleScope',
                message: 'bundleScope?',
                default: 'contracts'
            }
        ])
    };
    const { bundleFile, bundleScope } = await prompt(questions4, argv);
    ///////// END BUNDLE

    const options: TSBuilderOptions = {
        types: {
            enabled: true
        },
        client: {
            enabled:
                plugin.includes('client') ||
                plugin.includes('recoil') ||
              // react-query either uses client or abstract-app
              (plugin.includes('react-query') && !plugin.includes('abstract-app'))
        },
        reactQuery: {
            enabled: plugin.includes('react-query'),
            optionalClient,
            queryKeys,
            version,
            mutations,
            queryFactory
        },
        recoil: {
            enabled: plugin.includes('recoil'),
        },
        messageComposer: {
            enabled: plugin.includes('message-composer')
        },
        msgBuilder: {
          enabled: plugin.includes('msg-builder') || plugin.includes('abstract-app')
        },
        bundle: {
            enabled: bundle,
            scope: bundleScope,
            bundleFile
        },
        abstractApp: {
          enabled: plugin.includes('abstract-app'),
        }
    };

    await codegen({
        contracts: [
            {
                name,
                dir: schema
            }
        ],
        outPath: out,
        options
    })
};
