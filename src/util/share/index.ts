export const assertNever = (x: never) => {
  throw new Error("This code should not be called");
};

export const getUnionEnumValues = <T extends Record<string, any>>(obj: T) => {
  return Object.values(obj) as [(typeof obj)[keyof T]];
};
