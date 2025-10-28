export const arrayToMap = <T, K>(array: T[], keySelector: (item: T) => K): Map<K, T> => {
  return new Map(array.map(item => [keySelector(item), item]));
};

export const deleteFromMap = <K, V>(map: Map<K, V>, keyToDelete: K): Map<K, V> => {
  const newMap = new Map(map); // shallow copy
  newMap.delete(keyToDelete);
  return newMap;
};
