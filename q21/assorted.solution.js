// DO NOT MODIFY THE FUNCTION DEFINITIONS

/**
 * Returns an array containing elements that only exist in the first input array.
 *
 * @param {any[]} a - First array.
 * @param {any[]} b - Second array.
 * @returns {any[]} - Array of elements in a but not b.
 *
 * @example
 * difference([1, 2, 3], [2, 3, 4]) // => [1]
 */
export function difference(a, b) {
  // Method 1: Loop
  const unique_a = [];
  for (const e of a) {
    if (!b.includes(e)) {
      unique_a.push(e);
    }
  }
  return unique_a;

  // Method 2: filter
  return a.filter(e => !b.includes(e));
}

/**
 * Splits an array into chunks of a given size.
 *
 * @param {any[]} arr - Array to split.
 * @param {number} size - Size of each chunk.
 * @returns {any[][]} - Array of chunks.
 *
 * @example
 * chunk([1, 2, 3, 4], 2) // => [[1, 2], [3, 4]]
 */
export function chunk(arr, size) {
  const chunks = [];

  let i = 0;
  while (i < arr.length) {
    const chunk = [];
    for (let c = 0; c < size; c++) {
      if (i >= arr.length) break;
      chunk.push(arr[i]);
      i++;
    }
    chunks.push(chunk);
  }
  return chunks;
}

/**
 * Creates a copy of an object without the specified keys.
 *
 * @param {Object} obj - Original object.
 * @param {string[]} keys - Keys to remove.
 * @returns {Object} - New object without the keys.
 *
 * @example
 * omit({a:1, b:2, c:3}, ['b', 'c']) // => {a:1}
 */
export function omit(obj, keys) {
  const new_obj = {};
  for (const [k,v] of Object.entries(obj)) {
    if (!keys.includes(k)) {
      new_obj[k] = v;
    }
  }
  return new_obj;
}

/**
 * Capitalizes the first letter of every word in a string.
 *
 * @param {string} str - The input string.
 * @returns {string} - The capitalized string.
 *
 * @example
 * capitalizeWords("hello world") // => "Hello World"
 */
export function capitalizeWords(str) {
  if (str === "") return "";

  return str.split(" ").map(s => {
    const str_arr = Array.from(s);
    str_arr[0] = str_arr[0].toUpperCase();
    return str_arr.join("");
  }).join(" ");
}
