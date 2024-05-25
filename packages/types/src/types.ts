export declare type fieldType = 'Long' | 'Coin' | 'Duration' | 'Height' | string;
export interface Field {
  name: string;
  type: fieldType;
  node: any;
};
export interface Interface {
  name: string;
  fields: Field[]
};

export interface QueryMsg {
  $schema: string;
  title: 'QueryMsg';
  oneOf?: any;
  allOf?: any;
  anyOf?: any;
}

export interface ExecuteMsg {
  $schema: string;
  title: 'ExecuteMsg' | 'ExecuteMsg_for_Empty';
  oneOf?: any;
  allOf?: any;
  anyOf?: any;
}

export interface JSONSchema {
  $ref?: string;
  $schema?: string;
  additionalProperties?: boolean;
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  definitions?: Record<string, JSONSchema>;
  description?: string;
  oneOf?: JSONSchema[];
  properties?: Record<string, JSONSchema>;
  patternProperties?: Record<string, JSONSchema>;
  items?: JSONSchema | JSONSchema[];
  additionalItems?: JSONSchema;
  required?: string[];
  title?: string;
  type?: string | string[]
}


// this is actually what items ends up being most of the time:
export type JSONSchemaType =
  | { type: 'integer'; format?: 'int32' | 'int64' }
  | { type: 'number'; format?: 'float' | 'double' }
  | { type: 'string'; format?: 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri' }
  | { type: 'boolean' }
  | { type: 'object'; properties?: { [key: string]: JSONSchemaType }; required?: string[] }
  | { type: 'array'; items?: JSONSchemaType | JSONSchemaType[]; maxItems?: number; minItems?: number }
  | JSONSchemaType[]; // For tuple definitions
