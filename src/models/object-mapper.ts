/**
 * "author": "Dan VerWeire <dverweire@gmail.com>",
 * "name": "object-mapper",
 * "description": "Copy properties from one object to another.",
 * "version": "3.0.1",
 * "repository":
 *      "type": "git",
 *      "url": "git://github.com/wankdanker/node-object-mapper.git"
 */

/**
 * Map a object to another using the passed map
 * @param fromObject
 * @param toObject
 * @param propertyMap
 * @returns {*}
 * @constructor
 */
export function objectMapper(fromObject, toObject, propertyMap): any {
    let propertyKeys;

    if (typeof propertyMap === 'undefined') {
        propertyMap = toObject;
        toObject = undefined;
    }

    if (typeof toObject === 'undefined') {
        toObject = {};
    }

    propertyKeys = Object.keys(propertyMap);

    return _map(fromObject, toObject, propertyMap, propertyKeys);
}

/**
 * Make the get of a value with the key in the passed object
 * @param fromObject
 * @param fromKey
 * @constructor
 * @returns {*}
 */
export function getKeyValue(fromObject, fromKey): any {
    let regDot = /\./g
        , keys
        , key
        , result
        ;

    keys = fromKey.split(regDot);
    key = keys.splice(0, 1);

    result = _getValue(fromObject, key[0], keys);

    if (Array.isArray(result)) {
        if (result.length) {
            result = result.reduce(function (a, b) {
                if (Array.isArray(a) && Array.isArray(b)) {
                    return a.concat(b);
                } else if (Array.isArray(a)) {
                    a.push(b);
                    return a;
                } else {
                    return [a, b];
                }
            });
        }
        if (!Array.isArray(result)) {
            result = [result];
        }
    }

    return result;
}

/**
 * Make the set of a value withing the key in the passed object
 * @param baseObject
 * @param destinationKey
 * @param fromValue
 * @returns {*|{}}
 */
export function setKeyValue(baseObject, destinationKey, fromValue) {
    let regDot = /\./g
        , keys
        , key
        ;


    keys = destinationKey.split(regDot);
    key = keys.splice(0, 1);

    return _setValue(baseObject, key[0], keys, fromValue);
}

/**
 * Function that handle each key from map
 * @param fromObject
 * @param toObject
 * @param propertyMap
 * @param propertyKeys
 * @returns {*}
 * @private
 * @recursive
 */
function _map(fromObject, toObject, propertyMap, propertyKeys) {
    let fromKey
        , toKey
        ;

    if (propertyKeys.length) {
        fromKey = propertyKeys.splice(0, 1)[0];
        if (propertyMap.hasOwnProperty(fromKey)) {
            toKey = propertyMap[fromKey];

            toObject = _mapKey(fromObject, fromKey, toObject, toKey);
        } else {
            toObject = null;
        }
        return _map(fromObject, toObject, propertyMap, propertyKeys);
    } else {
        return toObject;
    }
}

/**
 * Function that calls get and set key values
 * @param fromObject
 * @param fromKey
 * @param toObject
 * @param toKey
 * @private
 * @recursive
 */
function _mapKey(fromObject, fromKey, toObject, toKey) {
    let fromValue
        , restToKeys
        , _default = null
        , transform
        ;

    if (Array.isArray(toKey) && toKey.length) {
        toKey = toKey.slice();
        restToKeys = toKey.splice(1);
        toKey = toKey[0];
    }

    if (toKey instanceof Object && Object.getPrototypeOf(toKey) === Object.prototype) {
        _default = toKey.default || null;
        transform = toKey.transform;
        toKey = toKey.key;
    }

    if (Array.isArray(toKey)) {
        transform = toKey[1];
        _default = toKey[2] || null;
        toKey = toKey[0];
    }

    if (typeof _default === 'function') {
        _default = _default(fromObject, fromKey, toObject, toKey);
    }

    fromValue = getKeyValue(fromObject, fromKey);
    if (typeof fromValue === 'undefined' || fromValue === null) {
        fromValue = _default;
    }

    if (typeof fromValue !== 'undefined' && typeof transform === 'function') {
        fromValue = transform(fromValue, fromObject, toObject, fromKey, toKey);
    }

    if (typeof fromValue === 'undefined' || typeof toKey === 'undefined') {
        return toObject;
    }

    toObject = setKeyValue(toObject, toKey, fromValue);

    if (Array.isArray(restToKeys) && restToKeys.length) {
        toObject = _mapKey(fromObject, fromKey, toObject, restToKeys);
    }

    return toObject;
}

/**
 * Get the value of key within passed object, considering if there is a array or object
 * @param fromObject
 * @param key
 * @param keys
 * @returns {*}
 * @private
 * @recursive
 */
function _getValue(fromObject, key, keys) {
    let regArray = /(\[\]|\[(.*)\])$/g
        , match
        , arrayIndex
        , isValueArray = false
        , result
        ;

    if (!fromObject) {
        return;
    }

    match = regArray.exec(key);
    if (match) {
        key = key.replace(regArray, '');
        isValueArray = (key !== '');
        arrayIndex = match[2];
    }

    if (keys.length === 0) {
        if (isValueArray) {
            if (typeof arrayIndex === 'undefined') {
                result = fromObject[key];
            } else {
                result = fromObject[key][arrayIndex];
            }
        } else if (Array.isArray(fromObject)) {
            if (key === '') {
                if (typeof arrayIndex === 'undefined') {
                    result = fromObject;
                } else {
                    result = fromObject[arrayIndex];
                }
            } else {
                result = fromObject.map(function (item) {
                    return item[key];
                });
            }
        } else {
            result = fromObject[key];
        }
    } else {
        if (isValueArray) {
            if (Array.isArray(fromObject[key])) {
                if (typeof arrayIndex === 'undefined') {
                    result = fromObject[key].map(function (item) {
                        return _getValue(item, keys[0], keys.slice(1));
                    });
                } else {
                    result = _getValue(fromObject[key][arrayIndex], keys[0], keys.slice(1));
                }
            } else {
                if (typeof arrayIndex === 'undefined') {
                    result = _getValue(fromObject[key], keys[0], keys.slice(1));
                } else {
                    result = _getValue(fromObject[key][arrayIndex], keys[0], keys.slice(1));
                }
            }
        } else if (Array.isArray(fromObject)) {
            if (key === '') {
                if (typeof arrayIndex === 'undefined') {
                    result = _getValue(fromObject, keys[0], keys.slice(1));
                } else {
                    result = _getValue(fromObject[arrayIndex], keys[0], keys.slice(1));
                }
            } else {
                result = fromObject.map(function (item) {
                    result = _getValue(item, keys[0], keys.slice(1));
                });
            }
            if (typeof arrayIndex === 'undefined') {
                result = fromObject.map(function (item) {
                    return _getValue(item, keys[0], keys.slice(1));
                });
            } else {

                result = _getValue(fromObject[arrayIndex], keys[0], keys.slice(1));
            }
        } else {
            result = _getValue(fromObject[key], keys[0], keys.slice(1));
        }
    }

    return result;
}

/**
 * Set the value within the passed object, considering if is a array or object set
 * @param destinationObject
 * @param key
 * @param keys
 * @param fromValue
 * @returns {*}
 * @private
 * @recursive
 */
function _setValue(destinationObject, key, keys, fromValue) {
    let regArray = /(\[\]|\[(.*)\])$/g
        , regAppendArray = /(\[\]|\[(.*)\]\+)$/g
        , regCanBeNull = /(\?)$/g
        , match
        , appendToArray
        , canBeNull
        , arrayIndex = 0
        , valueIndex
        , isPropertyArray = false
        , isValueArray = false
        , value
        ;

    canBeNull = regCanBeNull.test(key);
    if (canBeNull) {
        key = key.replace(regCanBeNull, '');
    }

    match = regArray.exec(key);
    appendToArray = regAppendArray.exec(key);
    if (match) {
        isPropertyArray = true;
        key = key.replace(regArray, '');
        isValueArray = (key !== '');
    }

    if (appendToArray) {
        match = appendToArray;
        isPropertyArray = true;
        isValueArray = (key !== '');
        key = key.replace(regAppendArray, '');
    }

    if (_isEmpty(destinationObject)) {
        if (isPropertyArray) {
            arrayIndex = match[2] || 0;
            if (isValueArray) {
                destinationObject = {};
                destinationObject[key] = [];
            } else {
                destinationObject = [];
            }
        } else {
            destinationObject = {};
        }
    } else {
        if (isPropertyArray) {
            arrayIndex = match[2] || 0;
        }
    }
    if (keys.length === 0) {
        if (!canBeNull && (fromValue === null || fromValue === undefined)) {
            return destinationObject;
        }
        if (isValueArray) {
            if (Array.isArray(destinationObject[key]) === false) {
                destinationObject[key] = [];
            }
            if (appendToArray) {
                destinationObject[key].push(fromValue);
            } else {
                destinationObject[key][arrayIndex] = fromValue;
            }
        } else if (Array.isArray(destinationObject)) {
            destinationObject[arrayIndex] = fromValue;
        } else {
            destinationObject[key] = fromValue;
        }
    } else {
        if (isValueArray) {
            if (Array.isArray(destinationObject[key]) === false) {
                destinationObject[key] = [];
            }
            if (Array.isArray(fromValue) && _isNextArrayProperty(keys) === false) {
                for (valueIndex = 0; valueIndex < fromValue.length; valueIndex++) {
                    value = fromValue[valueIndex];
                    destinationObject[key][arrayIndex + valueIndex] =
                        _setValue(destinationObject[key][arrayIndex + valueIndex], keys[0], keys.slice(1), value);
                }
            } else {
                destinationObject[key][arrayIndex] = _setValue(destinationObject[key][arrayIndex], keys[0], keys.slice(1), fromValue);
            }
        } else if (Array.isArray(destinationObject)) {
            if (Array.isArray(fromValue)) {
                for (valueIndex = 0; valueIndex < fromValue.length; valueIndex++) {
                    value = fromValue[valueIndex];
                    destinationObject[arrayIndex + valueIndex] =
                        _setValue(destinationObject[arrayIndex + valueIndex], keys[0], keys.slice(1), value);
                }
            } else {
                destinationObject[arrayIndex] = _setValue(destinationObject[arrayIndex], keys[0], keys.slice(1), fromValue);
            }
        } else {
            destinationObject[key] = _setValue(destinationObject[key], keys[0], keys.slice(1), fromValue);
        }
    }


    return destinationObject;
}

/**
 * Check if next key is a array lookup
 * @param keys
 * @returns {boolean}
 * @private
 */
function _isNextArrayProperty(keys) {
    let regArray = /(\[\]|\[(.*)\])$/g
        ;
    return regArray.test(keys[0]);
}

/**
 * Check if passed object is empty, checking for object and array types
 * @param object
 * @returns {boolean}
 * @private
 */
function _isEmpty(object) {
    let empty = false;
    if (typeof object === 'undefined' || object === null) {
        empty = true;
    } else if (_isEmptyObject(object)) {
        empty = true;
    } else if (_isEmptyArray(object)) {
        empty = true;
    }

    return empty;
}

/**
 * Check if passed object is empty
 * @param object
 * @returns {boolean}
 * @private
 */
function _isEmptyObject(object) {
    return typeof object === 'object'
        && Array.isArray(object) === false
        && Object.keys(object).length === 0
        ;
}

/**
 * Check if passed array is empty or with empty values only
 * @param object
 * @returns {boolean}
 * @private
 */
function _isEmptyArray(object) {
    return Array.isArray(object)
        && (object.length === 0
            || object.join('').length === 0)
        ;
}
