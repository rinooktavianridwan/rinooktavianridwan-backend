import * as _ from 'lodash';

/**
 * StringUtil
 * @description Utility class for string manipulation
 * @export
 * @class StringUtil
 */
export class StringUtil {
  /**
   * Convert a string to snake_case
   * @param str - The string to convert
   * @returns The snake_case version of the string
   */
  static toSnakeCase(str: string): string {
    return _.snakeCase(str);
  }

  /**
   * Convert a string to camelCase
   * @param str - The string to convert
   * @returns The camelCase version of the string
   */
  static toCamelCase(str: string): string {
    return _.camelCase(str);
  }

  /**
   * Convert object keys to snake_case recursively
   * @param obj - The object to convert
   * @returns A new object with snake_case keys
   */
  static keysToSnakeCase<T extends Record<string, unknown>>(obj: T): T {
    if (Array.isArray(obj)) {
      return obj.map((item) =>
        this.keysToSnakeCase(item as Record<string, unknown>),
      ) as unknown as T;
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = _.snakeCase(key);
        const value = obj[key as keyof T];
        if (value !== null && typeof value === 'object') {
          (acc as Record<string, unknown>)[snakeKey] = this.keysToSnakeCase(
            value as Record<string, unknown>,
          );
        } else {
          (acc as Record<string, unknown>)[snakeKey] = value;
        }
        return acc;
      }, {} as T);
    }
    return obj;
  }

  /**
   * Convert object keys to camelCase recursively
   * @param obj - The object to convert
   * @returns A new object with camelCase keys
   */
  static keysToCamelCase<T extends Record<string, unknown>>(obj: T): T {
    if (Array.isArray(obj)) {
      return obj.map((item) =>
        this.keysToCamelCase(item as Record<string, unknown>),
      ) as unknown as T;
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = _.camelCase(key);
        const value = obj[key as keyof T];
        if (value !== null && typeof value === 'object') {
          (acc as Record<string, unknown>)[camelKey] = this.keysToCamelCase(
            value as Record<string, unknown>,
          );
        } else {
          (acc as Record<string, unknown>)[camelKey] = value;
        }
        return acc;
      }, {} as T);
    }
    return obj;
  }

  /**
   * Convert a string to Title Case
   * @param str - The string to convert
   * @returns The Title Case version of the string
   */
  static toTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
