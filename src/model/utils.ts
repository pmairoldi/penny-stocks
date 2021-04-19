export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function removeItem<T>(
  array: T[],
  callback: (item: T) => boolean
): void {
  const index = array.findIndex(callback);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function replaceItem<T>(
  array: T[],
  callback: (item: T) => boolean,
  item: T
): void {
  const index = array.findIndex(callback);
  if (index > -1) {
    array[index] = item;
  }
}

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length;
  let temporaryValue: T;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
