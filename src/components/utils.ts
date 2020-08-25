export const getKeyValue = <U extends keyof T, T extends object>(key: U) => (
  obj: T
) => obj[key];
