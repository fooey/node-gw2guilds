import { isNil, reduce } from 'lodash';

export type UnknownObject = Record<string, unknown>;
export type EmptyObject = Record<string, never>;
export type AnyObject = Record<string, any>;
export type TypedObject<T> = Record<string, T>;

export function typedObjectKeys<T extends AnyObject>(typedObject: T): Array<keyof T> {
  return Object.keys(typedObject);
}

export function compactObject<T extends AnyObject>(o: T) {
  return reduce(
    o,
    (acc, cur, key) => {
      if (!isNil(cur)) {
        return { ...acc, [key]: cur };
      }
      return acc;
    },
    {}
  );
}
