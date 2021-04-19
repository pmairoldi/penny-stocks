export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const removeItem = <T>(
  array: T[],
  callback: (item: T) => boolean
): void => {
  const index = array.findIndex(callback);
  if (index > -1) {
    array.splice(index, 1);
  }
};

export const replaceItem = <T>(
  array: T[],
  callback: (item: T) => boolean,
  item: T
): void => {
  const index = array.findIndex(callback);
  if (index > -1) {
    array[index] = item;
  }
};
