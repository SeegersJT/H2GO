export class Utils {
  /**
   * Check if a value is undefined.
   * @param {any} value - The value to check.
   * @returns {boolean} True if the value is undefined, otherwise false.
   */
  static isUndefined = (value) => typeof value === 'undefined'

  /**
   * Check if a value is null.
   * @param {any} value - The value to check.
   * @returns {boolean} True if the value is null, otherwise false.
   */
  static isNull = (value) => value === null

  /**
   * Check if an array is empty.
   * @param {Array} arr - The array to check.
   * @returns {boolean} True if the array is empty, otherwise false.
   */
  static isEmpty = (arr) => !this.isNull(arr) && arr.length === 0

  /**
   * Check if a string is empty or null.
   * @param {string} str - The string to check.
   * @returns {boolean} True if the string is empty or null, otherwise false.
   */
  static isEmptyString = (str) => !str || str.trim().length === 0
}
