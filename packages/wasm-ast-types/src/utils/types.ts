import * as t from '@babel/types';

const getTypeFromRef = ($ref) => {
    switch ($ref) {
        case '#/definitions/Binary':
            return t.tsTypeReference(t.identifier('Binary'))
        default:
            if ($ref.startsWith('#/definitions/')) {
                return t.tsTypeReference(t.identifier($ref.replace('#/definitions/', '')))
            }
            throw new Error('what is $ref: ' + $ref);
    }
}

const getArrayTypeFromRef = ($ref) => {
    return t.tsArrayType(
        getTypeFromRef($ref)
    );
}
const getArrayTypeFromType = (type) => {
    return t.tsArrayType(
        getType(type)
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


export const getPropertyType = (schema, prop) => {
    const props = schema.properties ?? {};
    let info = props[prop];

    let type = null;
    let optional = schema.required?.includes(prop);

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
            throw new Error('case not handled by transpiler. contact maintainers.')
        }
        type = getTypeFromRef(nullableType?.$ref);
        optional = true;
    }

    if (typeof info.type === 'string') {
        if (info.type === 'array') {
            if (info.items.$ref) {
                type = getArrayTypeFromRef(info.items.$ref);
            } else {
                type = getArrayTypeFromType(info.items.type);
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
