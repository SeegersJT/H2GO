export class Utils {
  /**
   * Generate a formatted ID string: CATEGORY-BRANCH-NUMBER
   * @param category The category of the ID (e.g. "USER", "ORDER")
   * @param branchAbbreviation The branch abbreviation (e.g. "H2GO", "WTBY")
   * @param number The numerical part to pad
   * @returns A string like "CATEGORY-BRANCH-0001"
   */
  static generateID(category: string, branchAbbreviation: string, number: number): string {
    const paddedNumber = String(number).padStart(4, "0");
    return `${category.toUpperCase()}-${branchAbbreviation.toUpperCase()}-${paddedNumber}`;
  }
}
