import * as t from '@babel/types';
import { camel, pascal } from 'case';
import { propertySignature } from './babel';
import { RenderContext } from '../context';
import { JSONSchema } from '@cosmology/ts-codegen-types';

export function getResponseType(
  context: RenderContext,
  underscoreName: string
) {
  const methodName = camel(underscoreName);
  return pascal(
    context.contract?.responses?.[underscoreName]?.title
    ??
    // after v1.1 is adopted, we can deprecate this and require the above response
    `${methodName}Response`
  );
};

const getTypeStrFromRef = ($ref: string): string => {
  if ($ref?.startsWith('#/definitions/')) {
    return $ref.replace('#/definitions/', '');
  }
  throw new Error('what is $ref: ' + $ref);
}

export const getTypeFromRef = ($ref: string) => {
  return t.tsTypeReference(t.identifier(getTypeStrFromRef($ref)))
}

const getArrayTypeFromRef = ($ref: string) => {
  return t.tsArrayType(
    getTypeFromRef($ref)
  );
}


export const getTypeOrRef = (obj: JSONSchema): t.TSType => {
  if (obj.$ref) {
    return getTypeFromRef(obj.$ref);
  } else if (typeof obj.type === 'string') {
    return getType(obj.type);
  } else if (Array.isArray(obj.type)) {
    // Handle array of types by creating a union type
    console.log(obj.type);
    const types = obj.type.map(t => getType(t));
    return t.tsUnionType(types);
  } else {
    throw new Error('Type definition not supported or missing: ' + JSON.stringify(obj));
  }
};

const getArrayTypeFromItems = (
  context: RenderContext,
  items: JSONSchema | JSONSchema[]
): t.TSArrayType => {
  if (Array.isArray(items)) {
    // if (context.options.types.itemsUseTuples === true) {
    // Using the modified method with tsTupleType
    // return t.tsArrayType(
    // t.tsTupleType(items.map(item => getTypeOrRef(item)))
    // );
    // } else {
    // Using the original method with nested arrays
    if (items.length > 0 && items[0].type === 'array') {
      return getArrayTypeFromItems(context, items[0]);
    }
    return items.length > 0 ? t.tsArrayType(t.tsArrayType(getTypeOrRef(items[0]))) : t.tsArrayType(t.tsArrayType(t.tsAnyKeyword()));
    // }
  } else {
    const detect = detectType(items.type);

    if (detect.type === 'array') {
      if (Array.isArray(items.items)) {
        return t.tsArrayType(
          t.tsArrayType(
            getTypeOrRef(items.items[0])
          )
        );
      } else if (items.items) {
        return t.tsArrayType(
          getArrayTypeFromItems(context, items.items)
        );
      } else {
        // Handle the case where items.items is undefined for array types
        return t.tsArrayType(t.tsAnyKeyword())
      }
    }

    return t.tsArrayType(
      getType(detect.type)
    );
  }
};

export const detectType = (type: string | string[]) => {
  let optional = false;
  let theType = '';
  if (Array.isArray(type)) {
    if (type.length !== 2) {
      throw new Error('[getType(array length)] case not handled by transpiler. contact maintainers.')
    }
    const [nullableType, nullType] = type;
    if (nullType !== 'null') {
      throw new Error('[getType(null)] case not handled by transpiler. contact maintainers.')
    }
    theType = nullableType;
    optional = true;
  } else {
    theType = type;
  }

  return {
    type: theType,
    optional
  };
}

export const getTypeInfo = (
  context: RenderContext,
  info: JSONSchema
) => {
  let type = undefined;
  let optional = undefined;

  // Handle nullable types using 'anyOf' schema
  if (Array.isArray(info.anyOf)) {
    if (info.anyOf.length !== 2) {
      throw new Error('case not handled by transpiler. contact maintainers.');
    }
    const [nullableType, nullType] = info.anyOf;
    if (nullType?.type !== 'null') {
      throw new Error('[nullableType.type]: case not handled by transpiler. contact maintainers.');
    }
    if (!nullableType?.$ref) {
      if (nullableType.title) {
        type = t.tsTypeReference(t.identifier(nullableType.title));
      } else {
        throw new Error('[nullableType.title] case not handled by transpiler. contact maintainers.');
      }
    } else {
      type = getTypeFromRef(nullableType.$ref);
    }
    optional = true;
  } else if (typeof info.type === 'string') {
    console.log('is string')
    // Process type when it's explicitly defined
    if (info.type === 'array') {
      if (typeof info.items === 'object' && !Array.isArray(info.items)) {
        if (info.items.$ref) {
          type = getArrayTypeFromRef(info.items.$ref);
        } else if (info.items.title) {
          type = t.tsArrayType(t.tsTypeReference(t.identifier(info.items.title)));
        } else if (info.items.type) {
          type = getArrayTypeFromItems(context, info.items);
        } else {
          throw new Error('[info.items] case not handled by transpiler. contact maintainers.');
        }
        // type = getArrayTypeFromItems(context, info.items);
      } else {
        if (Array.isArray(info.items)) {
          type = getArrayTypeFromItems(context, info.items);
        } else {
          throw new Error('[info.items] case not handled by transpiler. contact maintainers.');
        }
      }
    } else {
      const detect = detectType(info.type);
      type = getType(detect.type);
      optional = detect.optional;
    }
  } else if (Array.isArray(info.type)) {
    console.log('is arr', info.type)
    // Handle multiple types, typically nullable types
    if (info.type.length !== 2) {
      throw new Error('please report this to maintainers (field type): ' + JSON.stringify(info, null, 2));
    }
    const [nullableType, nullType] = info.type;
    if (nullType !== 'null') {
      throw new Error('please report this to maintainers (field type): ' + JSON.stringify(info, null, 2));
    }

    if (nullableType === 'array' && typeof info.items === 'object' && !Array.isArray(info.items)) {
      if (info.items.type) {
        const detect = detectType(info.items.type);
        if (detect.type === 'array') {
          console.log('items type')
          type = t.tsArrayType(getArrayTypeFromItems(context, info.items));
        } else {
          type = t.tsArrayType(getType(detect.type));
        }
        optional = detect.optional;
      } else if (info.items.$ref) {
        type = getArrayTypeFromRef(info.items.$ref);
      } else if (info.items.type) {
        type = getArrayTypeFromItems(context, info.items);
      } else {
        throw new Error('[info.items] case not handled by transpiler. contact maintainers.');
      }
    } else {
      const detect = detectType(nullableType);
      optional = detect.optional;
      if (detect.type === 'array') {
        type = getArrayTypeFromItems(context, info.items);
      } else {
        type = getType(detect.type);
      }
    }

    optional = true;  // Ensure optional is set for nullable types
  }
  console.log({ type })

  return {
    type,
    optional
  };
};

export const getType = (type: string) => {
  switch (type) {
    case 'string':
      return t.tsStringKeyword();
    case 'boolean':
      return t.tSBooleanKeyword();
    case 'integer':
      return t.tsNumberKeyword();
    case 'null':
      return t.tsNullKeyword();
    case 'number':
      return t.tsNumberKeyword();
    default:
      throw new Error('contact maintainers [unknown type]: ' + type);
  }
}

export const getPropertyType = (
  context: RenderContext,
  schema: JSONSchema,
  prop: string
) => {
  const props = schema.properties ?? {};
  let info = props[prop];

  let type = null;
  let optional = !schema.required?.includes(prop);

  if (info.allOf && info.allOf.length === 1) {
    info = info.allOf[0];
  }

  if (typeof info.$ref === 'string') {
    type = getTypeFromRef(info.$ref)
  }

  const typeInfo = getTypeInfo(context, info);
  if (typeof typeInfo.optional !== 'undefined') {
    optional = typeInfo.optional;
  }
  if (typeof typeInfo.type !== 'undefined') {
    console.log(JSON.stringify(typeInfo, null, 2))
    type = typeInfo.type;
  }

  if (!type) {
    throw new Error('cannot find type for ' + JSON.stringify(info))
  }

  if (schema.required?.includes(prop)) {
    optional = false;
  }

  return { type, optional };
};


export function getPropertySignatureFromProp(
  context: RenderContext,
  jsonschema: JSONSchema,
  prop: string,
  camelize: boolean
) {
  if (jsonschema.properties[prop].type === 'object') {
    if (jsonschema.properties[prop].title) {
      return propertySignature(
        camelize ? camel(prop) : prop,
        t.tsTypeAnnotation(
          t.tsTypeReference(t.identifier(jsonschema.properties[prop].title))
        )
      );
    } else {
      throw new Error('getPropertySignatureFromProp() contact maintainer');
    }
  }

  if (Array.isArray(jsonschema.properties[prop].allOf)) {
    const isOptional = !jsonschema.required?.includes(prop);
    const unionTypes = jsonschema.properties[prop].allOf.map(el => {
      if (el.title) return el.title;
      if (el.$ref) return getTypeStrFromRef(el.$ref);
      return el.type;
    }).filter(a => typeof a === 'string');
    // ONLY SUPPORT string types for now!
    // e.g. NOT supporting nullable types or type: string[] yet

    // @ts-ignore:next-line
    const uniqUnionTypes = [...new Set(unionTypes)];

    if (uniqUnionTypes.length === 1) {
      return propertySignature(
        camelize ? camel(prop) : prop,
        t.tsTypeAnnotation(
          t.tsTypeReference(
            t.identifier(uniqUnionTypes[0] as string)
          )
        ),
        isOptional
      );
    } else {
      return propertySignature(
        camelize ? camel(prop) : prop,
        t.tsTypeAnnotation(
          t.tsUnionType(
            uniqUnionTypes.map(typ =>
              t.tsTypeReference(
                t.identifier(typ as string)
              )
            )
          )
        ),
        isOptional
      );
    }
  } else if (Array.isArray(jsonschema.properties[prop].oneOf)) {
    const isOptional = !jsonschema.required?.includes(prop);
    const unionTypes = jsonschema.properties[prop].oneOf.map(el => {
      if (el.title) return el.title;
      if (el.$ref) return getTypeStrFromRef(el.$ref);
      return el.type;
    }).filter(a => typeof a === 'string');
    // ONLY SUPPORT string types for now!
    // e.g. NOT supporting nullable types or type: string[] yet

    const uniqUnionTypes = [...new Set(unionTypes)];
    if (uniqUnionTypes.length === 1) {
      return propertySignature(
        camelize ? camel(prop) : prop,
        t.tsTypeAnnotation(
          t.tsTypeReference(
            t.identifier(uniqUnionTypes[0] as string)
          )
        ),
        isOptional
      );
    } else {
      return propertySignature(
        camelize ? camel(prop) : prop,
        t.tsTypeAnnotation(
          t.tsUnionType(
            uniqUnionTypes.map(typ =>
              t.tsTypeReference(
                t.identifier(typ as string)
              )
            )
          )
        ),
        isOptional
      );
    }

  }

  try {
    getPropertyType(context, jsonschema, prop);
  } catch (e) {
    console.log(e);
    console.log(JSON.stringify(jsonschema, null, 2), prop);
  }

  const { type, optional } = getPropertyType(context, jsonschema, prop);
  return propertySignature(
    camelize ? camel(prop) : prop,
    t.tsTypeAnnotation(
      type
    ),
    optional
  );
}

export const getParamsTypeAnnotation = (
  context: RenderContext,
  jsonschema: any,
  camelize: boolean = true
): t.TSTypeAnnotation => {
  const keys = Object.keys(jsonschema.properties ?? {});

  if (!keys.length && jsonschema.$ref) {
    return t.tsTypeAnnotation(getTypeFromRef(jsonschema.$ref))
  }

  if (!keys.length) return undefined;

  const typedParams = keys.map(prop => getPropertySignatureFromProp(
    context,
    jsonschema,
    prop,
    camelize
  ));

  return t.tsTypeAnnotation(
    t.tsTypeLiteral(
      // @ts-ignore:next-line
      [
        ...typedParams
      ]
    )
  )
}

export const createTypedObjectParams = (
  context: RenderContext,
  jsonschema: JSONSchema,
  camelize: boolean = true
): (t.Identifier | t.Pattern | t.RestElement) => {

  const keys = Object.keys(jsonschema.properties ?? {});
  if (!keys.length) {
    // is there a ref?
    if (jsonschema.$ref) {
      const obj = context.refLookup(jsonschema.$ref);
      // If there is a oneOf, then we need to create a type for it
      if (obj?.oneOf) {
        // the actual type of the ref
        const refType = jsonschema.$ref.split('/').pop();
        const refName = camel(refType);
        const id = t.identifier(refName);
        id.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(refType)));
        return id
      } else if (obj) {
        return createTypedObjectParams(
          context,
          obj,
          camelize
        );
      }
    }

    // no results...
    return;
  }

  const params = keys.map(prop => {
    return t.objectProperty(
      camelize ? t.identifier(camel(prop)) : t.identifier(prop),
      camelize ? t.identifier(camel(prop)) : t.identifier(prop),
      false,
      true
    );
  });

  const obj = t.objectPattern(
    [
      ...params
    ]
  );

  obj.typeAnnotation = getParamsTypeAnnotation(
    context,
    jsonschema,
    camelize
  );

  return obj;
};