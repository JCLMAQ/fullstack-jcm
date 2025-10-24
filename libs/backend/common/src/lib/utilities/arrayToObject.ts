export const convertArrYToObject = (array, keyName) => Object.fromEntries(
  array.map(item => [item[keyName], item])
);

export const convertArrayToObjectWithOutKey = (array, keyName) => Object.fromEntries(
  array.map(({ [keyName]: key, ...item }) => [key, item])
);

// Type-friendly version
export function convertArrayToObject
<
T extends { [prop in string | number]: any },
K extends keyof Pick<T, {
    [Key in keyof T]: T[Key] extends string | number ? Key : never
}[keyof T]> = keyof Pick<T, {
    [Key in keyof T]: T[Key] extends string | number ? Key : never
}[keyof T]>,
A extends T[] = T[]
>
(array: readonly T[], key: K)
{
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue) as { [propkey in A[number][K]]: A[number]; };
}

// Other versions

export const convertArrayToObjectFirst= (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const convertArrayToObjectThird = (array, key) =>
array.reduce((acc, curr) => {
  acc[curr[key]] = curr;
  return acc;
}, {});

// Even concise
export const convertArrayToObjectShort = (array, key) =>
array.reduce((acc, curr) =>(acc[curr[key]] = curr, acc), {});
// Basically everything inside parentheses will be evaluated, only the last value used will be only returned.


