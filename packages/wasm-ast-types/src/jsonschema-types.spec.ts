import { importStmt } from './utils'
import generate from '@babel/generator';
import * as t from '@babel/types';

import execute_msg from './../../../__fixtures__/minter/execute_msg.json';
import arrays from './../../../__fixtures__/arrays/schema/schema.json';

import {
    createInterface,
    createType,
    RenderContext,
    renderProperty
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
    printCode(createType(
        context,
        arrays,
        'HelloInterface'
    ))
    printCode(createType(
        context,
        execute_msg,
        'HelloInterface'
    ))
});

it('renderProperty', () => {
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


it('renderProperty', () => {
    expectCode(renderProperty(
        context,
        arrays.oneOf[0],
        'update_edges'
    ))
});

it('renderProperty', () => {
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

it('renderProperty', () => {
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

it('renderProperty', () => {
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
