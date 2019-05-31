/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   json-table-mixin.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

export {JsonTableMixin};


/**
 * Common methods for `json-table` views
 */
declare function JsonTableMixin<T extends new (...args: any[]) => {}>(base: T): T & JsonTableMixinConstructor;

interface JsonTableMixinConstructor {
  new(...args: any[]): JsonTableMixin;
}

export {JsonTableMixinConstructor};

interface JsonTableMixin {

  /**
   * In pagination, page index
   */
  page: number|null|undefined;

  /**
   * Number of items in pagination per page.
   * Allowed values are 10, 15, 20, 25, 50 and 100.
   */
  itemsPerPage: number|null|undefined;

  /**
   * If true then the pagination will be enabled for the arrays.
   */
  paginate: boolean|null|undefined;

  /**
   * Returns true if given argument is an array
   *
   * @param arr Candidate to test for object
   */
  isArray(arr: any|null): Boolean|null;

  /**
   * Returns true if given argument is an object.
   *
   * @param obj Candidate to test for object
   */
  isObject(obj: any|null): Boolean|null;

  /**
   * Check if given object is one of the primitives.
   *
   * @param obj An object to test
   * @returns True if the object is one of:
   * - string
   * - number
   * - boolean
   * - undefined
   * - null
   */
  isPrimitive(obj: any|null): any;

  /**
   * Creates a data model for single proerty.
   *
   * @param key A property name in the JSON structure
   * @param value Value associated with the property.
   * @returns Internal data model for a property. Model contains following
   * keys:
   *
   * - key - a property name
   * - value - property value - without applying data model. Thois will be done in child elements
   * - isObject - set if the value is type of Object
   * - isEnum - set if the value is type of array and contains primitives only
   * - isArray - set if the value is type of Array and contains complex objects
   * - isPrimitive - set if the value is type a primitive
   */
  getPropertyModel(key: String|null, value: any|null): {[key: String|null]: any|null};

  /**
   * Creates a model for a value.
   *
   * @param value Array item or property value to create a model from.
   * @returns Internal data model for a property value or array item. Model
   * contains following keys:
   *
   * - value - property value - without applying data model. Thois will be done in child elements
   * - isObject - set if the value is type of Object
   * - isEnum - set if the value is type of array and contains primitives only
   * - isArray - set if the value is type of Array and contains complex objects
   * - isPrimitive - set if the value is type a primitive
   */
  getItemModel(value: any|null): {[key: String|null]: any|null};

  /**
   * Checks if given array is enum (contains primitives only).
   *
   * @param arr An array to test.
   * @returns True if the array contains primitive values only. False otherwise.
   */
  isEnum(arr: any[]|null): Boolean|null;

  /**
   * Computes if the passed record's object is a type of array or enum.
   */
  _isEnumOrArray(record: any): any;

  /**
   * Computes the size of item's value.
   */
  _computeArraySize(record: any): any;
}
