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
                'message-composer'
            ]
        }
    ];

    let { schema, out, name, plugin } = await prompt(questions, argv);
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
            }
        ])
    };
    const { optionalClient, version } = await prompt(questions2, argv);
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
    ///////// END REACT QUERY


    const options: TSBuilderOptions = {
        types: {
            enabled: true
        },
        client: {
            enabled:
                plugin.includes('client') ||
                plugin.includes('recoil') ||
                plugin.includes('react-query')
        },
        reactQuery: {
            enabled: plugin.includes('react-query'),
            optionalClient,
            version,
            mutations
        },
        recoil: {
            enabled: plugin.includes('recoil'),
        },
        messageComposer: {
            enabled: plugin.includes('message-composer')
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