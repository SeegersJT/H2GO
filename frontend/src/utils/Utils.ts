export class Utils {
  /**
   * Check if a value is undefined.
   * @param value - The value to check.
   * @returns True if the value is undefined, otherwise false.
   */
  static isUndefined(value: unknown): value is undefined {
    return typeof value === 'undefined'
  }

  /**
   * Check if a value is null.
   * @param value - The value to check.
   * @returns True if the value is null, otherwise false.
   */
  static isNull(value: unknown): value is null {
    return value === null
  }

  /**
   * Check if an array is empty.
   * @param arr - The array to check.
   * @returns True if the array is empty, otherwise false.
   */
  static isEmpty<T>(arr: T[] | null | undefined): boolean {
    return Array.isArray(arr) && arr.length === 0
  }

  /**
   * Check if a string is empty or null.
   * @param str - The string to check.
   * @returns True if the string is empty or null, otherwise false.
   */
  static isEmptyString(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0
  }

  /**
   * Check if a value is null, undefined, or empty.
   * Supports strings, arrays, and objects.
   * @param value
   * @returns boolean
   */
  static isNilOrEmpty(value: unknown): boolean {
    if (this.isNull(value) || this.isUndefined(value)) return true

    if (typeof value === 'string') return value.trim().length === 0
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value as object).length === 0

    return false
  }

  /**
   * Convert a string to Capital Case.
   * Makes the first character uppercase and the rest lowercase.
   * @param str - The string to format.
   * @returns The formatted string in capital case.
   */
  static toCapitalCase(str: string | null | undefined): string {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  /**
   * Safely converts a value to a lowercase string.
   * Returns an empty string for null or undefined values.
   * @param value - The value to normalize.
   * @returns string
   */
  static toLowerSafe(value: unknown): string {
    if (this.isNull(value) || this.isUndefined(value)) return ''
    return String(value).toLowerCase().trim()
  }

  /**
   * Format a number as South African Rand currency (R).
   * @param amount - The amount to format
   * @returns Formatted string, e.g. 1200 -> "R1,200.00"
   */
  static formatCurrency(amount: number | string | null | undefined): string {
    if (this.isNilOrEmpty(amount)) return 'R0.00'

    const numericAmount = typeof amount === 'number' ? amount : Number(amount)
    if (isNaN(numericAmount)) return 'R0.00'

    return numericAmount.toLocaleString('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  /**
   * Format ISO date string to YYYY-MM-DD HH:mm:ss
   */
  static formatDateTime(isoDate: string): string {
    const date = new Date(isoDate)

    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  /**
   * Flatten all string values of an object recursively into a single string
   */
  static flattenObjectStrings = (obj: unknown): string => {
    if (!obj || typeof obj !== 'object') return String(obj ?? '')

    let result = ''

    for (const key in obj) {
      const value = (obj as any)[key]

      if (typeof value === 'object' && value !== null) {
        result += ' ' + Utils.flattenObjectStrings(value)
      } else if (value != null) {
        result += ' ' + String(value)
      }
    }

    return result.toLowerCase()
  }

  /**
   * Checks whether a string has leading or trailing spaces.
   * @param val - The string to check.
   * @returns True if leading or trailing spaces exist, otherwise false.
   */
  static hasLeadingOrTrailingSpaces(value: string | null | undefined): boolean {
    if (!value) return false
    return value.trim() !== value
  }

  /**
   * Validates a South African ID number.
   * Rules:
   * - Must be exactly 13 digits
   * - Must contain a valid date of birth
   * - Must pass the Luhn checksum algorithm
   *
   * @param id - The South African ID number.
   * @returns True if the ID number is valid, otherwise false.
   */
  static isValidSouthAfricanID(id: string | null | undefined): boolean {
    if (!id || !/^\d{13}$/.test(id)) return false

    // Extract date parts (YYMMDD)
    const year = parseInt(id.substring(0, 2), 10)
    const month = parseInt(id.substring(2, 4), 10)
    const day = parseInt(id.substring(4, 6), 10)

    if (month < 1 || month > 12 || day < 1 || day > 31) return false

    // Luhn checksum validation
    let sum = 0
    let alternate = false

    for (let i = id.length - 1; i >= 0; i--) {
      let n = parseInt(id[i], 10)

      if (alternate) {
        n *= 2
        if (n > 9) n -= 9
      }

      sum += n
      alternate = !alternate
    }

    return sum % 10 === 0
  }

  /**
   * Determine user status based on confirmed and active flags.
   * @param confirmed - Whether the user has confirmed their account.
   * @param active - Whether the user account is active.
   * @returns The calculated user status.
   */
  static getUserStatus(confirmed: boolean, active: boolean): any {
    if (!confirmed && !active) {
      return 'Pending Confirmation'
    }

    if (confirmed && !active) {
      return 'Inactive'
    }

    if (confirmed && active) {
      return 'Active'
    }

    return 'Disabled'
  }

  /**
   * Determine address status based on active and isDefault flags.
   * @param active - Whether the address is active.
   * @param isDefault - Whether the address is the default.
   * @returns The calculated address status.
   */
  static getAddressStatus(active: boolean, isDefault: boolean): any {
    if (!active && isDefault) {
      return 'Invalid'
    }

    if (active && isDefault) {
      return 'Default'
    }

    if (active && !isDefault) {
      return 'Active'
    }

    return 'Inactive'
  }
}
