import { pascal } from "case";

const cleanFor = (str: string) => {
    /*
        1. look at first char after _for_
        2. ONLY if you find capitals after, modify it
    */
    while (/_[a-z]+_[A-Z]/.test(str)) {
        const m = str.match(/(_[a-z]+_)[A-Z]/);
        str = str.replace(m[1], pascal(m[1]));
    }

    return str;
};

const cleanNullable = (str: string) => {
    if (/^Nullable_/.test(str)) {
        str = str.replace(/^Nullable_/, 'Nullable');
    }

    return str;
};

export const cleanse = (obj: any): any => {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = cleanse(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object || typeof obj === 'object') {
        copy = {};

        // https://github.com/CosmWasm/cosmwasm-typescript-gen/issues/27
        if (Array.isArray(obj.enum) && obj.enum.length === 0) {
            delete obj.enum;
            if (!obj.type) {
                obj.type = 'string';
            }
        }

        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {

                if (/_for_/.test(attr)) {
                    // @ts-ignore
                    copy[cleanFor(attr)] = cleanse(obj[attr]);
                } else if (/^Nullable_/.test(attr)) {
                    // @ts-ignore
                    copy[cleanNullable(attr)] = cleanse(obj[attr]);
                } else {
                    switch (attr) {
                        case 'title':
                        case '$ref':
                            if (typeof obj[attr] === 'string') {
                                // @ts-ignore
                                copy[attr] = cleanse(
                                    cleanNullable(cleanFor(obj[attr]))
                                );
                            } else {
                                // @ts-ignore
                                copy[attr] = cleanse(obj[attr]);
                            }
                            break;
                        default:
                            // @ts-ignore
                            copy[attr] = cleanse(obj[attr]);
                    }
                }

            } else {
                // @ts-ignore
                copy[attr] = cleanse(obj[attr]);
            }
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};