import generate from '@babel/generator';
import execute_msg from './../../../__fixtures__/minter/execute_msg.json';
import arrays from './../../../__fixtures__/arrays/schema/schema.json';

import {
    createType,
    RenderContext,
    processTypes,
    renderProperty,
} from './jsonschema-types'

const expectCode = (ast) => {
    expect(
        generate(ast).code
    ).toMatchSnapshot();
}

const printCode = (ast) => {
    console.log(
        generate(ast).code
    );
}

const context: RenderContext = {
    options: {
        optionalArrays: true
    }
}

it('createType', () => {
    expectCode(createType(
        context,
        arrays,
        'HelloInterface'
    ))
    expectCode(createType(
        context,
        execute_msg,
        'HelloInterface'
    ))
    expectCode(createType(
        context,
        {
            "description": "A point in time in nanosecond precision.\n\nThis type can represent times from 1970-01-01T00:00:00Z to 2554-07-21T23:34:33Z.\n\n## Examples\n\n``` # use cosmwasm_std::Timestamp; let ts = Timestamp::from_nanos(1_000_000_202); assert_eq!(ts.nanos(), 1_000_000_202); assert_eq!(ts.seconds(), 1); assert_eq!(ts.subsec_nanos(), 202);\n\nlet ts = ts.plus_seconds(2); assert_eq!(ts.nanos(), 3_000_000_202); assert_eq!(ts.seconds(), 3); assert_eq!(ts.subsec_nanos(), 202); ```",
            "allOf": [
                {
                    "$ref": "#/definitions/Uint64"
                }
            ]
        },
        'HelloInterface'
    ))
});

it('min max items', () => {
    expectCode(renderProperty(
        context,
        {
            "type": "object",
            "required": [
                "edges"
            ],
            "properties": {
                "edges": {
                    "type": "array",
                    "items": [
                        {
                            "type": "integer",
                            "format": "int32"
                        },
                        {
                            "type": "integer",
                            "format": "int32"
                        }
                    ],
                    "maxItems": 2,
                    "minItems": 2
                }
            }
        },
        'edges'
    ))
});

it('arrays', () => {
    expectCode(renderProperty(
        context,
        {
            "type": "object",
            "required": [
                "edges"
            ],
            "properties": {
                "edges": {
                    "type": "array",
                    "items": [
                        {
                            "type": "integer",
                            "format": "int32"
                        },
                        {
                            "type": "integer",
                            "format": "int32"
                        }
                    ]
                }
            }
        },
        'edges'
    ))
});

it('nested', () => {
    expectCode(renderProperty(
        context,
        {
            "type": "object",
            "required": [
                "nested"
            ],
            "properties": {
                "nested": {
                    "type": "array",
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "array",
                            "items": [
                                {
                                    "type": "integer",
                                    "format": "int32"
                                },
                                {
                                    "type": "integer",
                                    "format": "int32"
                                }
                            ],
                            "maxItems": 2,
                            "minItems": 2
                        },
                        "maxItems": 2,
                        "minItems": 2
                    }
                }
            }
        },
        'nested'
    ))
});

it('supernested', () => {
    expectCode(renderProperty(
        context,
        {
            "type": "object",
            "required": [
                "supernested"
            ],
            "properties": {
                "supernested": {
                    "type": "array",
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "array",
                            "items": {
                                "type": "array",
                                "items": {
                                    "type": "array",
                                    "items": {
                                        "type": "array",
                                        "items": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "type": "string"
                                            }
                                        ],
                                        "maxItems": 2,
                                        "minItems": 2
                                    },
                                    "maxItems": 2,
                                    "minItems": 2
                                }
                            },
                            "maxItems": 2,
                            "minItems": 2
                        },
                        "maxItems": 2,
                        "minItems": 2
                    }
                }
            }
        },
        'supernested'
    ))
});


it('update_edges', () => {
    expectCode(renderProperty(
        context,
        arrays.oneOf[0],
        'update_edges'
    ))
});

it('mint', () => {
    expectCode(renderProperty(
        context,
        {
            "type": "object",
            "required": [
                "mint"
            ],
            "properties": {
                "mint": {
                    "type": "object"
                }
            },
            "additionalProperties": false
        },
        'mint'
    ))
});

it('whitelist', () => {
    expectCode(renderProperty(
        context,
        {
            "type": "object",
            "required": [
                "whitelist"
            ],
            "properties": {
                "whitelist": {
                    "type": "string"
                }
            }
        },
        'whitelist'
    ))
});

it('set_whitelist', () => {
    expectCode(renderProperty(
        context,
        {
            "type": "object",
            "required": [
                "set_whitelist"
            ],
            "properties": {
                "set_whitelist": {
                    "type": "object",
                    "required": [
                        "whitelist"
                    ],
                    "properties": {
                        "whitelist": {
                            "type": "string"
                        }
                    }
                }
            },
            "additionalProperties": false
        },
        'set_whitelist'
    ))
});



it('processTypes', () => {
    processTypes(
        context,
        execute_msg
    ).map(ast => {
        expectCode(ast);
    })
});