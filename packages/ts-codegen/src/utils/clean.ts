export const clean = (obj: any): any => {
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
            copy[i] = clean(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object || typeof obj === 'object') {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                switch (attr) {
                    case 'leadingComments':
                    case 'trailingComments':
                    case 'loc':
                    case 'start':
                    case 'end':
                        break;
                    default:
                        // @ts-ignore
                        copy[attr] = clean(obj[attr]);
                }
            } else {
                // @ts-ignore
                copy[attr] = clean(obj[attr]);
            }
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};