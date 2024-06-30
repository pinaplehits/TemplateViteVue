/**
 * Sorts an array of objects based on the specified key.
 *
 * @param {Array<Object>} data - The array of objects to be sorted.
 * @param {string} key - The key in the objects to sort by.
 * @returns {Array<Object>} The sorted array of objects.
 *
 * The function performs the following steps:
 * 1. Sorts the array of objects based on the specified key.
 * 2. Converts the values to numbers if possible for numerical sorting, otherwise keeps them as strings for string sorting.
 * 3. Returns the sorted array.
 */
export function sortDataByKey(data, key) {
  return data.sort((a, b) => {
    let x = isNaN(a[key]) ? a[key] : Number(a[key])
    let y = isNaN(b[key]) ? b[key] : Number(b[key])

    if (x < y) return -1
    if (x > y) return 1
    return 0
  })
}
