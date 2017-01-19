
/**
 * Utility methods used by CacheFactory.
 *
 * @example
 * import { Utils } from 'cachefactory'
 * console.log(Utils.isString('foo')) // true
 *
 * @namespace Utils
 * @type {object}
 */
export class Utils {
  static Promise = window['Promise'];

  /**
   * Returns whether the two values are strictly equal.
   *
   * @example
   * import { Utils } from 'cachefactory'
   *
   * console.log(Utils.equals(4, 4) // true
   * console.log(Utils.equals(4, '4') // false
   *
   * @method Utils.equals
   * @param {*} a The first value.
   * @param {*} a The second value.
   * @returns {booleal} Whether the two values are strictly equal.
   */
  static equals(a, b) {
    return a === b;
  }

  /**
   * Proxy for `JSON.parse`.
   *
   * @example
   * import { Utils } from 'cachefactory'
   *
   * const a = Utils.fromJson('{"name":"John"}')
   * console.log(a) // { name: 'John' }
   *
   * @method Utils.fromJson
   * @param {string} json JSON to parse.
   * @returns {object} The parsed object.
   * @see Utils.toJson
   */
  static fromJson(value) {
    return JSON.parse(value);
  }

  /**
   * Returns whether the provided value is a function.
   *
   * @example
   * import { Utils } from 'cachefactory'
   * const a = function (){ console.log('foo bar')}
   * const b = { foo: "bar" }
   * console.log(Utils.isFunction(a)) // true
   * console.log(Utils.isFunction(b)) // false
   *
   * @method Utils.isFunction
   * @param {*} value The value to test.
   * @returns {boolean} Whether the provided value is a function.
   */
  static isFunction(value) {
    return typeof value === 'function';
  }

  /**
   * Returns whether the provided value is a number.
   *
   * @example
   * import { Utils } from 'js-data'
   * const a = 1
   * const b = -1.25
   * const c = '1'
   * console.log(Utils.isNumber(a)) // true
   * console.log(Utils.isNumber(b)) // true
   * console.log(Utils.isNumber(c)) // false
   *
   * @method Utils.isNumber
   * @param {*} value The value to test.
   * @returns {boolean} Whether the provided value is a number.
   */
  static isNumber(value) {
    return typeof value === 'number';
  }

  /**
   * Returns whether the provided value is an object.
   *
   * @example
   * import { Utils } from 'cachefactory'
   * const a = { foo: "bar" }
   * const b = 'foo bar'
   * console.log(Utils.isObject(a)) // true
   * console.log(Utils.isObject(b)) // false
   *
   * @method Utils.isObject
   * @param {*} value The value to test.
   * @returns {boolean} Whether the provided value is an object.
   */
  static isObject(value) {
    return value !== null && typeof value === 'object';
  }

  static isPromise(value) {
    return value && Utils.isFunction(value.then);
  }

  /**
   * Returns whether the provided value is a string.
   *
   * @example
   * import { Utils } from 'cachefactory'
   * console.log(Utils.isString('')) // true
   * console.log(Utils.isString('my string')) // true
   * console.log(Utils.isString(100)) // false
   * console.log(Utils.isString([1,2,4])) // false
   *
   * @method Utils.isString
   * @param {*} value The value to test.
   * @returns {boolean} Whether the provided value is a string.
   */
  static isString(value) {
    return typeof value === 'string';
  }

  /**
   * Proxy for `JSON.stringify`.
   *
   * @example
   * import { Utils } from 'cachefactory'
   *
   * const a = { name: 'John' }
   * console.log(Utils.toJson(a)) // '{"name":"John"}'
   *
   * @method Utils.toJson
   * @param {*} value Value to serialize to JSON.
   * @returns {string} JSON string.
   * @see Utils.fromJson
   */
  static toJson(value) {
    return JSON.stringify(value);
  }
};
