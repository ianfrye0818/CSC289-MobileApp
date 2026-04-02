/**
 * Extracts the union type of all values from an object/const.
 * Use with typeof: ValueOf<typeof MyConst> => 'a' | 'b' | 'c'
 */
export type ValueOf<T> = T[keyof T];
