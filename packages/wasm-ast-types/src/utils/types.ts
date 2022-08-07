import * as t from '@babel/types';
import { camel } from 'case';
import { propertySignature } from './babel';
import { TSTypeAnnotation } from '@babel/types';
import { RenderContext } from '../context';
import { JSONSchema } from '../types';

const getTypeStrFromRef = ($ref) => {
  if ($ref?.startsWith('#/definitions/')) {
    return $ref.replace('#/definitions/', '');
  }
  throw new Error('what is $ref: ' + $ref);
}

export const getTypeFromRef = ($ref) => {
  return t.tsTypeReference(t.identifier(getTypeStrFromRef($ref)))
}

const getArrayTypeFromRef = ($ref) => {
  return t.tsArrayType(
    getTypeFromRef($ref)
  );
}

const getArrayTypeFromItems = (items) => {
  if (items.type === 'array') {
    if (Array.isArray(items.items)) {
      return t.tsArrayType(
        t.tsArrayType(
          getType(items.items[0].type)
        )
      );
    } else {
      return t.tsArrayType(
        getArrayTypeFromItems(
          items.items
        )
      );
    }
  }
  return t.tsArrayType(
    getType(items.type)
  );
}


export const getType = (type) => {
  switch (type) {
    case 'string':
      return t.tsStringKeyword();
    case 'boolean':
      return t.tSBooleanKeyword();
    case 'integer':
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

  if (Array.isArray(info.anyOf)) {
    // assuming 2nd is null, but let's check to ensure
    if (info.anyOf.length !== 2) {
      throw new Error('case not handled by transpiler. contact maintainers.')
    }
    const [nullableType, nullType] = info.anyOf;
    if (nullType?.type !== 'null') {
      throw new Error('[nullableType.type]: case not handled by transpiler. contact maintainers.')
    }
    if (!nullableType?.$ref) {
      if (nullableType.title) {
        type = t.tsTypeReference(t.identifier(nullableType.title));
      } else {
        throw new Error('[nullableType.title] case not handled by transpiler. contact maintainers.')
      }
    } else {
      type = getTypeFromRef(nullableType?.$ref);
    }
    optional = true;
  }

  if (typeof info.type === 'string') {
    if (info.type === 'array') {
      if (info.items.$ref) {
        type = getArrayTypeFromRef(info.items.$ref);
      } else if (info.items.title) {
        type = t.tsArrayType(
          t.tsTypeReference(
            t.identifier(info.items.title)
          )
        );
      } else if (info.items.type) {
        type = getArrayTypeFromItems(info.items);
      } else {
        throw new Error('[info.items] case not handled by transpiler. contact maintainers.')
      }
    } else {
      type = getType(info.type);
    }
  }

  if (Array.isArray(info.type)) {
    // assuming 2nd is null, but let's check to ensure
    if (info.type.length !== 2) {
      throw new Error('please report this to maintainers (field type): ' + JSON.stringify(info, null, 2))
    }
    const [nullableType, nullType] = info.type;
    if (nullType !== 'null') {
      throw new Error('please report this to maintainers (field type): ' + JSON.stringify(info, null, 2))
    }

    if (nullableType === 'array') {
      type = t.tsArrayType(
        getType(info.items.type)
      );
    } else {
      type = getType(nullableType);
    }

    optional = true;
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
    });
    const uniqUnionTypes = [...new Set(unionTypes)];

    if (uniqUnionTypes.length === 1) {
      return propertySignature(
        camelize ? camel(prop) : prop,
        t.tsTypeAnnotation(
          t.tsTypeReference(
            t.identifier(uniqUnionTypes[0])
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
                t.identifier(typ)
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
    });
    const uniqUnionTypes = [...new Set(unionTypes)];
    if (uniqUnionTypes.length === 1) {
      return propertySignature(
        camelize ? camel(prop) : prop,
        t.tsTypeAnnotation(
          t.tsTypeReference(
            t.identifier(uniqUnionTypes[0])
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
                t.identifier(typ)
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
    console.log(jsonschema, prop);
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
): t.ObjectPattern => {

  const keys = Object.keys(jsonschema.properties ?? {});
  if (!keys.length) {

    // is there a ref?
    if (jsonschema.$ref) {
      const obj = context.refLookup(jsonschema.$ref);
      if (obj) {
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
