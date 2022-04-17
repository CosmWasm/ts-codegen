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
