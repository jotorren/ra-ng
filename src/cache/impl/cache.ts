import { BinaryHeap } from './yabh';
import { defaults } from './defaults';
import { Utils } from './utils';
import { CacheOptions } from './cachefactory';

const assignMsg = `Cannot assign to read only property`;

/**
 * Provide a custom storage medium, e.g. a polyfill for `localStorage`. Default: `null`.
 *
 * Must implement:
 *
 * - `setItem` - Same API as `localStorage.setItem(key, value)`
 * - `getItem` - Same API as `localStorage.getItem(key)`
 * - `removeItem` - Same API as `localStorage.removeItem(key)`
 *
 * @name Cache~StorageImpl
 * @type {object}
 * @property {function} setItem Implementation of `setItem(key, value)`.
 * @property {function} getItem Implementation of `getItem(key)`.
 * @property {function} removeItem Implementation of `removeItem(key)`.
 */

/**
 * Instances of this class represent a "cache"—a synchronous key-value store.
 * Each instance holds the settings for the cache, and provides methods for
 * manipulating the cache and its data.
 *
 * Generally you don't creates instances of `Cache` directly, but instead create
 * instances of `Cache` via {@link CacheFactory#createCache}.
 *
 * @example
 * import CacheFactory from 'cachefactory';
 *
 * const cacheFactory = new CacheFactory();
 * const options = {...};
 * const cache = cacheFactory.createCache('my-cache', options);
 *
 * cache.put('foo', 'bar');
 * console.log(cache.get('foo')); // "bar"
 *
 * @class Cache
 * @param {string} id A unique identifier for the cache.
 * @param {object} [options] Configuration options.
 * @param {number} [options.cacheFlushInterval=null] See {@link Cache#cacheFlushInterval}.
 * @param {number} [options.capacity=Number.MAX_VALUE] See {@link Cache#capacity}.
 * @param {string} [options.deleteOnExpire="none"] See {@link Cache#deleteOnExpire}.
 * @param {boolean} [options.enabled=true] See {@link Cache#enabled}.
 * @param {number} [options.maxAge=Number.MAX_VALUE] See {@link Cache#maxAge}.
 * @param {function} [options.onExpire=null] See {@link Cache#onExpire}.
 * @param {number} [options.recycleFreq=1000] See {@link Cache#recycleFreq}.
 * @param {Cache~StorageImpl} [options.storageImpl=null] See {@link Cache~StorageImpl}.
 * @param {string} [options.storageMode="memory"] See {@link Cache#storageMode}.
 * @param {string} [options.storagePrefix="cachefactory.caches."] See {@link Cache#storagePrefix}.
 * @param {boolean} [options.storeOnReject=false] See {@link Cache#storeOnReject}.
 * @param {boolean} [options.storeOnResolve=false] See {@link Cache#storeOnResolve}.
 */
export class Cache {
  /**
   * Then unique identifier given to this cache when it was created.
   *
   * @name Cache#id
   * @public
   * @readonly
   * @type {string}
   */
  id: string;

  private $$cacheFlushInterval;
  private $$cacheFlushIntervalId;
  private $$capacity;
  private $$data;
  private $$deleteOnExpire;
  private $$enabled;
  private $$expiresHeap;
  private $$initializing;
  private $$lruHeap;
  private $$maxAge;
  private $$onExpire;
  private $$prefix;
  private $$promises;
  private $$recycleFreq;
  private $$recycleFreqId;
  private $$storage;
  private $$storageMode;
  private $$storagePrefix;
  private $$storeOnReject;
  private $$storeOnResolve;

  private $$parent;

  /**
   * The interval (in milliseconds) on which the cache should remove all of
   * its items. Setting this to `null` disables the interval. The default is
   * `null`.
   *
   * @example <caption>Create a cache the clears itself every 15 minutes</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   cacheFlushInterval: 15 * 60 * 1000
   * });
   *
   * @name Cache#cacheFlushInterval
   * @default null
   * @public
   * @readonly
   * @type {number|null}
   */

  get cacheFlushInterval() {
    return this.$$cacheFlushInterval;
  }
  set cacheFlushInterval(value) {
    throw new Error(`${assignMsg} 'cacheFlushInterval'`);
  }

  /**
   * The maximum number of items that can be stored in the cache. When the
   * capacity is exceeded the least recently accessed item will be removed.
   * The default is `Number.MAX_VALUE`.
   *
   * @example <caption>Create a cache with a capacity of 100</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   capacity: 100
   * });
   *
   * @name Cache#capacity
   * @default Number.MAX_VALUE
   * @public
   * @readonly
   * @type {number}
   */
  get capacity() {
    return this.$$capacity;
  }
  set capacity(value) {
    throw new Error(`${assignMsg} 'capacity'`);
  };

  /**
   * Determines the behavior of a cache when an item expires. The default is
   * `"none"`.
   *
   * Possible values:
   *
   * - `"none"` - Cache will do nothing when an item expires.
   * - `"passive"` - Cache will do nothing when an item expires. Expired
   * items will remain in the cache until requested, at which point they are
   * removed, and `undefined` is returned.
   * - `"aggressive"` - Cache will remove expired items as soon as they are
   * discovered.
   *
   * @example <caption>Create a cache that deletes items as soon as they expire</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   deleteOnExpire: 'aggressive'
   * });
   *
   * @example <caption>Create a cache that doesn't delete expired items until they're accessed</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   deleteOnExpire: 'passive'
   * });
   *
   * @name Cache#deleteOnExpire
   * @default "none"
   * @public
   * @readonly
   * @type {string}
   */
  get deleteOnExpire() {
    return this.$$deleteOnExpire;
  }
  set deleteOnExpire(value) {
    throw new Error(`${assignMsg} 'deleteOnExpire'`);
  };

  /**
   * Marks whether the cache is enabled or not. For a disabled cache,
   * {@link Cache#put} is a no-op. The default is `true`.
   *
   * @example <caption>Create a cache that starts out disabled</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   enabled: false
   * });
   *
   * // The cache is disabled, this is a no-op
   * cache.put('foo', 'bar');
   * console.log(cache.get('foo')); // undefined
   *
   * @name Cache#enabled
   * @default true
   * @public
   * @readonly
   * @type {boolean}
   */
  get enabled() {
    return this.$$enabled;
  }
  set enabled(value) {
    throw new Error(`${assignMsg} 'enabled'`);
  };

  /**
   * Represents how long an item can be in the cache before expires. The
   * cache's behavior toward expired items is determined by
   * {@link Cache#deleteOnExpire}. The default value for `maxAge` is
   * `Number.MAX_VALUE`.
   *
   * @example <caption>Create a cache where items expire after 15 minutes</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   // Items expire after 15 minutes
   *   maxAge: 15 * 60 * 1000
   * });
   * const cache2 = cacheFactory.createCache('my-cache2', {
   *   // Items expire after 15 minutes
   *   maxAge: 15 * 60 * 1000,
   *   // Expired items will only be deleted once they are accessed
   *   deleteOnExpire: 'passive'
   * });
   * const cache3 = cacheFactory.createCache('my-cache3', {
   *   // Items expire after 15 minutes
   *   maxAge: 15 * 60 * 1000,
   *   // Items will be deleted from the cache as soon as they expire
   *   deleteOnExpire: 'aggressive'
   * });
   *
   * @name Cache#maxAge
   * @default Number.MAX_VALUE
   * @public
   * @readonly
   * @type {number}
   */
  get maxAge() {
    return this.$$maxAge;
  }
  set maxAge(value) {
    throw new Error(`${assignMsg} 'maxAge'`);
  };

  /**
   * The `onExpire` callback.
   *
   * @callback Cache~onExpireCallback
   * @param {string} key The key of the expired item.
   * @param {*} value The value of the expired item.
   * @param {function} [done] If in `"passive"` mode and you pass an
   * `onExpire` callback to {@link Cache#get}, then the `onExpire` callback
   * you passed to {@link Cache#get} will be passed to your global
   * `onExpire` callback.
   */

  /**
   * A callback to be executed when expired items are removed from the
   * cache when the cache is in `"passive"` or `"aggressive"` mode. The
   * default is `null`. See {@link Cache~onExpireCallback} for the signature
   * of the `onExpire` callback.
   *
   * @example <caption>Create a cache where items expire after 15 minutes</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   // Items expire after 15 minutes
   *   maxAge: 15 * 60 * 1000,
   *   // Expired items will only be deleted once they are accessed
   *   deleteOnExpire: 'passive',
   *   // Try to rehydrate cached items as they expire
   *   onExpire: function (key, value, done) {
   *     // Do something with key and value
   *
   *     // Will received "done" callback if in "passive" mode and passing
   *     // an onExpire option to Cache#get.
   *     if (done) {
   *       done(); // You can pass whatever you want to done
   *     }
   *   }
   * });
   *
   * @name Cache#onExpire
   * @default null
   * @public
   * @readonly
   * @see Cache~onExpireCallback
   * @type {function}
   */
  get onExpire() {
    return this.$$onExpire;
  }
  set onExpire(value) {
    throw new Error(`${assignMsg} 'onExpire'`);
  };

  /**
   * The frequency (in milliseconds) with which the cache should check for
   * expired items. The default is `1000`. The value of this interval only
   * matters if {@link Cache#deleteOnExpire} is set to `"aggressive"`.
   *
   * @example <caption>Create a cache where items expire after 15 minutes checking every 10 seconds</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   // Items expire after 15 minutes
   *   maxAge: 15 * 60 * 1000,
   *   // Items will be deleted from the cache as soon as they expire
   *   deleteOnExpire: 'aggressive',
   *   // Check for expired items every 10 seconds
   *   recycleFreq: 10 * 1000
   * });
   *
   * @name Cache#recycleFreq
   * @default 1000
   * @public
   * @readonly
   * @type {number|null}
   */
  get recycleFreq() {
    return this.$$recycleFreq;
  }
  set recycleFreq(value) {
    throw new Error(`${assignMsg} 'recycleFreq'`);
  };

  /**
   * Determines the storage medium used by the cache. The default is
   * `"memory"`.
   *
   * Possible values:
   *
   * - `"memory"`
   * - `"localStorage"`
   * - `"sessionStorage"`
   *
   * @example <caption>Create a cache that stores its data in localStorage</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   storageMode: 'localStorage'
   * });
   *
   * @example <caption>Provide a custom storage implementation</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   storageMode: 'localStorage',
   *   storageImpl: {
   *     setItem: function (key, value) {
   *       console.log('setItem', key, value);
   *       localStorage.setItem(key, value);
   *     },
   *     getItem: function (key) {
   *       console.log('getItem', key);
   *       localStorage.getItem(key);
   *     },
   *     removeItem: function (key) {
   *       console.log('removeItem', key);
   *       localStorage.removeItem(key);
   *     }
   *   }
   * });
   *
   * @name Cache#storageMode
   * @default "memory"
   * @public
   * @readonly
   * @type {string}
   */
  get storageMode() {
    return this.$$storageMode;
  }
  set storageMode(value) {
    throw new Error(`${assignMsg} 'storageMode'`);
  };

  /**
   * The prefix used to namespace the keys for items stored in
   * `localStorage` or `sessionStorage`. The default is
   * `"cachefactory.caches."` which is conservatively long in order any
   * possible conflict with other data in storage. Set to a shorter value
   * to save storage space.
   *
   * @example
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   storageMode: 'localStorage',
   *   // Completely remove the prefix to save the most space
   *   storagePrefix: ''
   * });
   * cache.put('foo', 'bar');
   * console.log(localStorage.get('my-cache.data.foo')); // "bar"
   *
   * @name Cache#storagePrefix
   * @default "cachefactory.caches."
   * @public
   * @readonly
   * @type {string}
   */
  get storagePrefix() {
    return this.$$storagePrefix;
  }
  set storagePrefix(value) {
    throw new Error(`${assignMsg} 'storagePrefix'`);
  };

  /**
   * If set to `true`, when a promise is inserted into the cache and is then
   * rejected, then the rejection value will overwrite the promise in the
   * cache. The default is `false`.
   *
   * @name Cache#storeOnReject
   * @default false
   * @public
   * @readonly
   * @type {boolean}
   */
  get storeOnReject() {
    return this.$$storeOnReject;
  }
  set storeOnReject(value) {
    throw new Error(`${assignMsg} 'storeOnReject'`);
  };

  /**
   * If set to `true`, when a promise is inserted into the cache and is then
   * resolved, then the resolution value will overwrite the promise in the
   * cache. The default is `false`.
   *
   * @name Cache#storeOnResolve
   * @default false
   * @public
   * @readonly
   * @type {boolean}
   */
  get storeOnResolve() {
    return this.$$storeOnResolve;
  }
  set storeOnResolve(value) {
    throw new Error(`${assignMsg} 'storeOnResolve'`);
  }

  constructor(id, options: CacheOptions = defaults) {
    if (!Utils.isString(id)) {
      id = JSON.stringify(id);
    }

    // Writable
    this.$$cacheFlushInterval = undefined;
    this.$$cacheFlushIntervalId = undefined;
    this.$$capacity = undefined;
    this.$$data = {};
    this.$$deleteOnExpire = undefined;
    this.$$enabled = undefined;
    this.$$expiresHeap = new BinaryHeap((x) => x.accessed, Utils.equals);
    this.$$initializing = true;
    this.$$lruHeap = new BinaryHeap((x) => x.accessed, Utils.equals);
    this.$$maxAge = undefined;
    this.$$onExpire = undefined;
    this.$$prefix = '';
    this.$$promises = {};
    this.$$recycleFreq = undefined;
    this.$$recycleFreqId = undefined;
    this.$$storage = undefined;
    this.$$storageMode = undefined;
    this.$$storagePrefix = undefined;
    this.$$storeOnReject = undefined;
    this.$$storeOnResolve = undefined;

    // Read-only
    this.$$parent = options['parent'];

    this.id = id;
    this.setOptions(options, true);
    this.$$initializing = false;
  }

  /**
   * Destroys this cache and all its data and renders it unusable.
   *
   * @example
   * cache.destroy();
   *
   * @method Cache#destroy
   */
  destroy() {
    clearInterval(this.$$cacheFlushIntervalId);
    clearInterval(this.$$recycleFreqId);
    this.removeAll();
    if (this.$$storage) {
      this.$$storage().removeItem(`${this.$$prefix}.keys`);
      this.$$storage().removeItem(this.$$prefix);
    }
    this.$$storage = null;
    this.$$data = null;
    this.$$lruHeap = null;
    this.$$expiresHeap = null;
    this.$$prefix = null;
    if (this.$$parent) {
      this.$$parent.caches[this.id] = undefined;
    }
  }

  /**
   * Disables this cache. For a disabled cache, {@link Cache#put} is a no-op.
   *
   * @example
   * cache.disable();
   *
   * @method Cache#disable
   */
  disable() {
    this.$$enabled = false;
  }

  /**
   * Enables this cache. For a disabled cache, {@link Cache#put} is a no-op.
   *
   * @example
   * cache.enable();
   *
   * @method Cache#enable
   */
  enable() {
    this.$$enabled = true;
  }

  /**
   * Retrieve an item from the cache, it it exists.
   *
   * @example <caption>Retrieve an item from the cache</caption>
   * cache.put('foo', 'bar');
   * cache.get('foo'); // "bar"
   *
   * @example <caption>Retrieve a possibly expired item while in passive mode</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   deleteOnExpire: 'passive',
   *   maxAge: 15 * 60 * 1000
   * });
   * cache.get('foo', {
   *   // Called if "foo" is expired
   *   onExpire: function (key, value) {
   *     // Do something with key and value
   *   }
   * });
   *
   * @example <caption>Retrieve a possibly expired item while in passive mode with global onExpire callback</caption>
   * import CacheFactory from 'cachefactory';
   *
   * const cacheFactory = new CacheFactory();
   * const cache = cacheFactory.createCache('my-cache', {
   *   deleteOnExpire: 'passive',
   *   maxAge: 15 * 60 * 1000
   *   onExpire: function (key, value, done) {
   *     console.log('Expired item:', key);
   *     if (done) {
   *       done('foo', key, value);
   *     }
   *   }
   * });
   * cache.get('foo', {
   *   // Called if "foo" is expired
   *   onExpire: function (msg, key, value) {
   *     console.log(msg); // "foo"
   *     // Do something with key and value
   *   }
   * });
   *
   * @method Cache#get
   * @param {string|string[]} key The key of the item to retrieve.
   * @param {object} [options] Configuration options.
   * @param {function} [options.onExpire] TODO
   * @returns {*} The value for the specified `key`, if any.
   */
  get(key, options = {}) {
    if (Array.isArray(key)) {
      const keys = key;
      const values = [];

      keys.forEach((key) => {
        const value = this.get(key, options);
        if (value !== null && value !== undefined) {
          values.push(value);
        }
      });

      return values;
    } else {
      if (Utils.isNumber(key)) {
        key = '' + key;
      }

      if (!this.enabled) {
        return;
      }
    }

    if (!Utils.isString(key)) {
      throw new TypeError(`"key" must be a string!`);
    } else if (!options || !Utils.isObject(options)) {
      throw new TypeError(`"options" must be an object!`);
    } else if (options['onExpire'] && !Utils.isFunction(options['onExpire'])) {
      throw new TypeError(`"options.onExpire" must be a function!`);
    }

    let item;

    if (this.$$storage) {
      if (this.$$promises[key]) {
        return this.$$promises[key];
      }

      const itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);

      if (itemJson) {
        item = Utils.fromJson(itemJson);
      }
    } else if (Utils.isObject(this.$$data)) {
      item = this.$$data[key];
    }

    if (!item) {
      return;
    }

    let value = item.value;
    let now = new Date().getTime();

    if (this.$$storage) {
      this.$$lruHeap.remove({
        key: key,
        accessed: item.accessed
      });
      item.accessed = now;
      this.$$lruHeap.push({
        key: key,
        accessed: now
      });
    } else {
      this.$$lruHeap.remove(item);
      item.accessed = now;
      this.$$lruHeap.push(item);
    }

    if (this.$$deleteOnExpire === 'passive' && 'expires' in item && item.expires < now) {
      this.remove(key);

      if (this.$$onExpire) {
        this.$$onExpire(key, item.value, options['onExpire']);
      } else if (options['onExpire']) {
        options['onExpire'].call(this, key, item.value);
      }
      value = undefined;
    } else if (this.$$storage) {
      this.$$storage().setItem(`${this.$$prefix}.data.${key}`, Utils.toJson(item));
    }

    return value;
  }

  /**
   * Retrieve information about the whole cache or about a particular item in
   * the cache.
   *
   * @example <caption>Retrieve info about the cache</caption>
   * const info = cache.info();
   * info.id; // "my-cache"
   * info.capacity; // 100
   * info.maxAge; // 600000
   * info.deleteOnExpire; // "aggressive"
   * info.cacheFlushInterval; // null
   * info.recycleFreq; // 10000
   * info.storageMode; // "localStorage"
   * info.enabled; // false
   * info.size; // 1234
   *
   * @example <caption>Retrieve info about an item in the cache</caption>
   * const info = cache.info('foo');
   * info.created; // 1234567890
   * info.accessed; // 1234567990
   * info.expires; // 1234569999
   * info.isExpired; // false
   *
   * @method Cache#info
   * @param {string} [key] If specified, retrieve info for a particular item in
   * the cache.
   * @returns {*} The information object.
   */
  info(key) {
    if (key) {
      let item;
      if (this.$$storage) {
        const itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);
        if (itemJson) {
          item = Utils.fromJson(itemJson);
        }
      } else if (Utils.isObject(this.$$data)) {
        item = this.$$data[key];
      }
      if (item) {
        return {
          created: item.created,
          accessed: item.accessed,
          expires: item.expires,
          isExpired: (new Date().getTime() - item.created) > (item.maxAge || this.$$maxAge)
        };
      }
    } else {
      return {
        id: this.id,
        capacity: this.capacity,
        maxAge: this.maxAge,
        deleteOnExpire: this.deleteOnExpire,
        onExpire: this.onExpire,
        cacheFlushInterval: this.cacheFlushInterval,
        recycleFreq: this.recycleFreq,
        storageMode: this.storageMode,
        storageImpl: this.$$storage ? this.$$storage() : undefined,
        enabled: this.enabled,
        size: this.$$lruHeap && this.$$lruHeap.size() || 0
      };
    }
  }

  /**
   * Retrieve a list of the keys of items currently in the cache.
   *
   * @example
   * const keys = cache.keys();
   *
   * @method Cache#keys
   * @returns {string[]} The keys of the items in the cache
   */
  keys() {
    if (this.$$storage) {
      const keysJson = this.$$storage().getItem(`${this.$$prefix}.keys`);

      if (keysJson) {
        return Utils.fromJson(keysJson);
      } else {
        return [];
      }
    } else {
      return Object.keys(this.$$data).filter((key) => this.$$data[key]);
    }
  }

  /**
   * Retrieve an object of the keys of items currently in the cache.
   *
   * @example
   * const keySet = cache.keySet();
   *
   * @method Cache#keySet
   * @returns {object} The keys of the items in the cache.
   */
  keySet() {
    const set = {};
    this.keys().forEach((key) => {
      set[key] = key;
    });
    return set;
  }

  /**
   * Insert an item into the cache.
   *
   * @example
   * const inserted = cache.put('foo', 'bar');
   *
   * @method Cache#put
   * @param {string} key The key under which to insert the item.
   * @param {*} value The value to insert.
   * @param {object} [options] Configuration options.
   * @param {boolean} [options.storeOnReject] See {@link Cache#storeOnReject}.
   * @param {boolean} [options.storeOnResolve] See {@link Cache#storeOnResolve}.
   * @returns {*} The inserted value.
   */
  put(key, value, options = {}) {
    const storeOnResolve = options['storeOnResolve'] !== undefined ? !!options['storeOnResolve'] : this.$$storeOnResolve;
    const storeOnReject = options['storeOnReject'] !== undefined ? !!options['storeOnReject'] : this.$$storeOnReject;

    const getHandler = (shouldStore, isError) => {
      return (v) => {
        if (shouldStore) {
          this.$$promises[key] = undefined;
          if (Utils.isObject(v) && 'status' in v && 'data' in v) {
            v = [v.status, v.data, v.headers(), v.statusText];
            this.put(key, v);
          } else {
            this.put(key, v);
          }
        }
        if (isError) {
          if (Utils.Promise) {
            return Utils.Promise.reject(v);
          } else {
            throw v;
          }
        } else {
          return v;
        }
      };
    };

    if (!this.$$enabled || !Utils.isObject(this.$$data) || value === null || value === undefined) {
      return;
    }
    if (Utils.isNumber(key)) {
      key = '' + key;
    }

    if (!Utils.isString(key)) {
      throw new TypeError(`"key" must be a string!`);
    }

    const now = new Date().getTime();
    const item = {
      key: key,
      value: Utils.isPromise(value) ? value.then(getHandler(storeOnResolve, false), getHandler(storeOnReject, true)) : value,
      created: options['created'] === undefined ? now : options['created'],
      accessed: options['accessed'] === undefined ? now : options['accessed']
    };
    if (Utils.isNumber(options['maxAge'])) {
     item['maxAge'] = options['maxAge'];
    }

    if (options['expires'] === undefined) {
      item['expires'] = item.created + (item['maxAge'] || this.$$maxAge);
    } else {
      item['expires'] = options['expires'];
    }

    if (this.$$storage) {
      if (Utils.isPromise(item.value)) {
        this.$$promises[key] = item.value;
        return this.$$promises[key];
      }
      const keysJson = this.$$storage().getItem(`${this.$$prefix}.keys`);
      const keys = keysJson ? Utils.fromJson(keysJson) : [];
      const itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);

      // Remove existing
      if (itemJson) {
        this.remove(key);
      }
      // Add to expires heap
      this.$$expiresHeap.push({
        key: key,
        expires: item['expires']
      });
      // Add to lru heap
      this.$$lruHeap.push({
        key: key,
        accessed: item.accessed
      });
      // Set item
      this.$$storage().setItem(`${this.$$prefix}.data.${key}`, Utils.toJson(item));
      let exists = false;
      keys.forEach((_key) => {
        if (_key === key) {
          exists = true;
          return false;
        }
      });
      if (!exists) {
        keys.push(key);
      }
      this.$$storage().setItem(`${this.$$prefix}.keys`, Utils.toJson(keys));
    } else {
      // Remove existing
      if (this.$$data[key]) {
        this.remove(key);
      }
      // Add to expires heap
      this.$$expiresHeap.push(item);
      // Add to lru heap
      this.$$lruHeap.push(item);
      // Set item
      this.$$data[key] = item;
      this.$$promises[key] = undefined;
    }

    // Handle exceeded capacity
    if (this.$$lruHeap.size() > this.$$capacity) {
      this.remove(this.$$lruHeap.peek().key);
    }

    return value;
  }

  /**
   * Remove an item from the cache.
   *
   * @example
   * const removed = cache.remove('foo');
   *
   * @method Cache#remove
   * @param {string} key The key of the item to remove.
   * @returns {*} The value of the removed item, if any.
   */
  remove(key) {
    if (Utils.isNumber(key)) {
      key = '' + key;
    }
    this.$$promises[key] = undefined;
    if (this.$$storage) {
      const itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);

      if (itemJson) {
        let item = Utils.fromJson(itemJson);
        this.$$lruHeap.remove({
          key: key,
          accessed: item.accessed
        });
        this.$$expiresHeap.remove({
          key: key,
          expires: item.expires
        });
        this.$$storage().removeItem(`${this.$$prefix}.data.${key}`);
        let keysJson = this.$$storage().getItem(`${this.$$prefix}.keys`);
        let keys = keysJson ? Utils.fromJson(keysJson) : [];
        let index = keys.indexOf(key);

        if (index >= 0) {
          keys.splice(index, 1);
        }
        this.$$storage().setItem(`${this.$$prefix}.keys`, Utils.toJson(keys));
        return item.value;
      }
    } else if (Utils.isObject(this.$$data)) {
      let value = this.$$data[key] ? this.$$data[key].value : undefined;
      this.$$lruHeap.remove(this.$$data[key]);
      this.$$expiresHeap.remove(this.$$data[key]);
      this.$$data[key] = undefined;
      return value;
    }
  }

  /**
   * Remove all items from the cache.
   *
   * @example
   * cache.removeAll();
   *
   * @method Cache#removeAll
   */
  removeAll() {
    const storage = this.$$storage;
    const keys = this.keys();
    this.$$lruHeap.removeAll();
    this.$$expiresHeap.removeAll();

    if (storage) {
      storage().setItem(`${this.$$prefix}.keys`, Utils.toJson([]));
      keys.forEach((key) => {
        storage().removeItem(`${this.$$prefix}.data.${key}`);
      });
    } else if (Utils.isObject(this.$$data)) {
      this.$$data = {};
    }
    this.$$promises = {};
  }

  /**
   * Remove expired items from the cache, if any.
   *
   * @example
   * const expiredItems = cache.removeExpired();
   *
   * @method Cache#removeExpired
   * @returns {object} The expired items, if any.
   */
  removeExpired() {
    const now = new Date().getTime();
    const expired = {};
    let expiredItem;

    while ((expiredItem = this.$$expiresHeap.peek()) && expiredItem.expires <= now) {
      expired[expiredItem.key] = expiredItem.value ? expiredItem.value : null;
      this.$$expiresHeap.pop();
    }

    Object.keys(expired).forEach((key) => {
      this.remove(key);
    });

    if (this.$$onExpire) {
      Object.keys(expired).forEach((key) => {
        this.$$onExpire(key, expired[key]);
      });
    }

    return expired;
  }

  /**
   * Update the {@link Cache#cacheFlushInterval} for the cache. Pass in `null`
   * to disable the interval.
   *
   * @example
   * cache.setCacheFlushInterval(60 * 60 * 1000);
   *
   * @method Cache#setCacheFlushInterval
   * @param {number|null} cacheFlushInterval The new {@link Cache#cacheFlushInterval}.
   */
  setCacheFlushInterval(cacheFlushInterval) {
    if (cacheFlushInterval === null) {
      this.$$cacheFlushInterval = null;
    } else if (!Utils.isNumber(cacheFlushInterval)) {
      throw new TypeError(`"cacheFlushInterval" must be a number!`);
    } else if (cacheFlushInterval <= 0) {
      throw new Error(`"cacheFlushInterval" must be greater than zero!`);
    }
    this.$$cacheFlushInterval = cacheFlushInterval;
    clearInterval(this.$$cacheFlushIntervalId);
    this.$$cacheFlushIntervalId = undefined;
    if (this.$$cacheFlushInterval) {
      this.$$cacheFlushIntervalId = setInterval(() => this.removeAll(), this.$$cacheFlushInterval);
    }
  }

  /**
   * Update the {@link Cache#capacity} for the cache. Pass in `null` to reset
   * to `Number.MAX_VALUE`.
   *
   * @example
   * cache.setCapacity(1000);
   *
   * @method Cache#setCapacity
   * @param {number|null} capacity The new {@link Cache#capacity}.
   */
  setCapacity(capacity) {
    if (capacity === null) {
      this.$$capacity = Number.MAX_VALUE;
    } else if (!Utils.isNumber(capacity)) {
      throw new TypeError(`"capacity" must be a number!`);
    } else if (capacity <= 0) {
      throw new Error(`"capacity" must be greater than zero!`);
    } else {
      this.$$capacity = capacity;
    }
    const removed = {};
    while (this.$$lruHeap.size() > this.$$capacity) {
      removed[this.$$lruHeap.peek().key] = this.remove(this.$$lruHeap.peek().key);
    }
    return removed;
  }

  /**
   * Update the {@link Cache#deleteOnExpire} for the cache. Pass in `null` to
   * reset to `"none"`.
   *
   * @example
   * cache.setDeleteOnExpire('passive');
   *
   * @method Cache#setDeleteOnExpire
   * @param {string|null} deleteOnExpire The new {@link Cache#deleteOnExpire}.
   */
  setDeleteOnExpire(deleteOnExpire, setRecycleFreq) {
    if (deleteOnExpire === null) {
      deleteOnExpire = 'none';
    } else if (!Utils.isString(deleteOnExpire)) {
      throw new TypeError(`"deleteOnExpire" must be a string!`);
    } else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
      throw new Error(`"deleteOnExpire" must be "none", "passive" or "aggressive"!`);
    }
    this.$$deleteOnExpire = deleteOnExpire;
    if (setRecycleFreq !== false) {
      this.setRecycleFreq(this.$$recycleFreq);
    }
  }

  /**
   * Update the {@link Cache#maxAge} for the cache. Pass in `null` to reset to
   * to `Number.MAX_VALUE`.
   *
   * @example
   * cache.setMaxAge(60 * 60 * 1000);
   *
   * @method Cache#setMaxAge
   * @param {number|null} maxAge The new {@link Cache#maxAge}.
   */
  setMaxAge(maxAge) {
    if (maxAge === null) {
      this.$$maxAge = Number.MAX_VALUE;
    } else if (!Utils.isNumber(maxAge)) {
      throw new TypeError(`"maxAge" must be a number!`);
    } else if (maxAge <= 0) {
      throw new Error(`"maxAge" must be greater than zero!`);
    } else {
      this.$$maxAge = maxAge;
    }
    const keys = this.keys();

    this.$$expiresHeap.removeAll();

    if (this.$$storage) {
      keys.forEach((key) => {
        const itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);
        if (itemJson) {
          const item = Utils.fromJson(itemJson);
          if (this.$$maxAge === Number.MAX_VALUE) {
            item.expires = Number.MAX_VALUE;
          } else {
            item.expires = item.created + (item.maxAge || this.$$maxAge);
          }
          this.$$expiresHeap.push({
            key: key,
            expires: item.expires
          });
        }
      });
    } else {
      keys.forEach((key) => {
        const item = this.$$data[key];
        if (item) {
          if (this.$$maxAge === Number.MAX_VALUE) {
            item.expires = Number.MAX_VALUE;
          } else {
            item.expires = item.created + (item.maxAge || this.$$maxAge);
          }
          this.$$expiresHeap.push(item);
        }
      });
    }

    if (this.$$deleteOnExpire === 'aggressive') {
      return this.removeExpired();
    } else {
      return {};
    }
  }

  /**
   * Update the {@link Cache#onExpire} for the cache. Pass in `null` to unset
   * the global `onExpire` callback of the cache.
   *
   * @example
   * cache.setOnExpire(function (key, value, done) {
   *   // Do something
   * });
   *
   * @method Cache#setOnExpire
   * @param {function|null} onExpire The new {@link Cache#onExpire}.
   */
  setOnExpire(onExpire) {
    if (onExpire === null) {
      this.$$onExpire = null;
    } else if (!Utils.isFunction(onExpire)) {
      throw new TypeError(`"onExpire" must be a function!`);
    } else {
      this.$$onExpire = onExpire;
    }
  }

  /**
   * Update multiple cache options at a time.
   *
   * @example
   * cache.setOptions({
   *   maxAge: 60 * 60 * 1000,
   *   deleteOnExpire: 'aggressive'
   * });
   *
   * @example <caption>Set two options, and reset the rest to the configured defaults</caption>
   * cache.setOptions({
   *   maxAge: 60 * 60 * 1000,
   *   deleteOnExpire: 'aggressive'
   * }, true);
   *
   * @method Cache#setOptions
   * @param {object} options The options to set.
   * @param {boolean} [strict] Reset options not passed to `options` to the
   * configured defaults.
   */
  setOptions(options = {}, strict = false) {
    if (!Utils.isObject(options)) {
      throw new TypeError(`"options" must be an object!`);
    }

    if (options['storagePrefix'] !== undefined) {
      this.$$storagePrefix = options['storagePrefix'];
    } else if (strict) {
      this.$$storagePrefix = defaults.storagePrefix;
    }

    this.$$prefix = this.$$storagePrefix + this.id;

    if (options['enabled'] !== undefined) {
      this.$$enabled = !!options['enabled'];
    } else if (strict) {
      this.$$enabled = defaults.enabled;
    }

    if (options['deleteOnExpire'] !== undefined) {
      this.setDeleteOnExpire(options['deleteOnExpire'], false);
    } else if (strict) {
      this.setDeleteOnExpire(defaults.deleteOnExpire, false);
    }

    if (options['recycleFreq'] !== undefined) {
      this.setRecycleFreq(options['recycleFreq']);
    } else if (strict) {
      this.setRecycleFreq(defaults.recycleFreq);
    }

    if (options['maxAge'] !== undefined) {
      this.setMaxAge(options['maxAge']);
    } else if (strict) {
      this.setMaxAge(defaults.maxAge);
    }

    if (options['storeOnResolve'] !== undefined) {
      this.$$storeOnResolve = !!options['storeOnResolve'];
    } else if (strict) {
      this.$$storeOnResolve = defaults.storeOnResolve;
    }

    if (options['storeOnReject'] !== undefined) {
      this.$$storeOnReject = !!options['storeOnReject'];
    } else if (strict) {
      this.$$storeOnReject = defaults.storeOnReject;
    }

    if (options['capacity'] !== undefined) {
      this.setCapacity(options['capacity']);
    } else if (strict) {
      this.setCapacity(defaults.capacity);
    }

    if (options['cacheFlushInterval'] !== undefined) {
      this.setCacheFlushInterval(options['cacheFlushInterval']);
    } else if (strict) {
      this.setCacheFlushInterval(defaults.cacheFlushInterval);
    }

    if (options['onExpire'] !== undefined) {
      this.setOnExpire(options['onExpire']);
    } else if (strict) {
      this.setOnExpire(defaults.onExpire);
    }

    if (options['storageMode'] !== undefined || options['storageImpl'] !== undefined) {
      this.setStorageMode(options['storageMode'] || defaults.storageMode, options['storageImpl'] || defaults.storageImpl);
    } else if (strict) {
      this.setStorageMode(defaults.storageMode, defaults.storageImpl);
    }
  }

  /**
   * Update the {@link Cache#recycleFreq} for the cache. Pass in `null` to
   * disable the interval.
   *
   * @example
   * cache.setRecycleFreq(10000);
   *
   * @method Cache#setRecycleFreq
   * @param {number|null} recycleFreq The new {@link Cache#recycleFreq}.
   */
  setRecycleFreq(recycleFreq) {
    if (recycleFreq === null) {
      this.$$recycleFreq = null;
    } else if (!Utils.isNumber(recycleFreq)) {
      throw new TypeError(`"recycleFreq" must be a number!`);
    } else if (recycleFreq <= 0) {
      throw new Error(`"recycleFreq" must be greater than zero!`);
    } else {
      this.$$recycleFreq = recycleFreq;
    }
    clearInterval(this.$$recycleFreqId);
    if (this.$$deleteOnExpire === 'aggressive' && this.$$recycleFreq) {
      this.$$recycleFreqId = setInterval(() => this.removeExpired(), this.$$recycleFreq);
    } else {
      this.$$recycleFreqId = undefined;
    }
  }

  /**
   * Update the {@link Cache#storageMode} for the cache.
   *
   * @method Cache#setStorageMode
   * @param {string} storageMode The new {@link Cache#storageMode}.
   * @param {object} storageImpl The new {@link Cache~StorageImpl}.
   */
  setStorageMode(storageMode, storageImpl) {
    if (!Utils.isString(storageMode)) {
      throw new TypeError(`"storageMode" must be a string!`);
    } else if (storageMode !== 'memory' && storageMode !== 'localStorage' && storageMode !== 'sessionStorage') {
      throw new Error(`"storageMode" must be "memory", "localStorage", or "sessionStorage"!`);
    }

    const prevStorage = this.$$storage;
    const prevData = this.$$data;
    let shouldReInsert = false;
    let items = {};

    const load = (prevStorage, prevData) => {
      const keys = this.keys();
      const prevDataIsObject = Utils.isObject(prevData);
      keys.forEach((key) => {
        if (prevStorage) {
          const itemJson = prevStorage().getItem(`${this.$$prefix}.data.${key}`);
          if (itemJson) {
            items[key] = Utils.fromJson(itemJson);
          }
        } else if (prevDataIsObject) {
          items[key] = prevData[key];
        }
        this.remove(key);
        shouldReInsert || (shouldReInsert = true);
      });
    };

    if (!this.$$initializing) {
      load(prevStorage, prevData);
    }

    this.$$storageMode = storageMode;

    if (storageImpl) {
      if (!Utils.isObject(storageImpl)) {
        throw new TypeError(`"storageImpl" must be an object!`);
      } else if (typeof storageImpl.setItem !== 'function') {
        throw new Error(`"storageImpl" must implement "setItem(key, value)"!`);
      } else if (typeof storageImpl.getItem !== 'function') {
        throw new Error(`"storageImpl" must implement "getItem(key)"!`);
      } else if (typeof storageImpl.removeItem !== 'function') {
        throw new Error(`"storageImpl" must implement "removeItem(key)"!`);
      }
      this.$$storage = () => storageImpl;
    } else if (this.$$storageMode === 'localStorage') {
      try {
        localStorage.setItem('cachefactory', 'cachefactory');
        localStorage.removeItem('cachefactory');
        this.$$storage = () => localStorage;
      } catch (e) {
        this.$$storage = null;
        this.$$storageMode = 'memory';
      }
    } else if (this.$$storageMode === 'sessionStorage') {
      try {
        sessionStorage.setItem('cachefactory', 'cachefactory');
        sessionStorage.removeItem('cachefactory');
        this.$$storage = () => sessionStorage;
      } catch (e) {
        this.$$storage = null;
        this.$$storageMode = 'memory';
      }
    } else {
      this.$$storage = null;
      this.$$storageMode = 'memory';
    }

    if (this.$$initializing) {
      load(this.$$storage, this.$$data);
    }

    if (shouldReInsert) {
      Object.keys(items).forEach((key) => {
        const item = items[key];
        this.put(key, item.value, {
          created: item.created,
          accessed: item.accessed,
          expires: item.expires
        });
      });
    }
  }

  /**
   * Reset an item's age in the cache, or if `key` is unspecified, touch all
   * items in the cache.
   *
   * @example
   * cache.touch('foo');
   *
   * @method Cache#touch
   * @param {string} [key] The key of the item to touch.
   * @param {object} [options] Options to pass to {@link Cache#put} if
   * necessary.
   */
  touch(key, options) {
    if (key) {
      const val = this.get(key, {
        onExpire: (k, v) => this.put(k, v)
      });
      if (val) {
        this.put(key, val, options);
      }
    } else {
      const keys = this.keys();
      for (let i = 0; i < keys.length; i++) {
        this.touch(keys[i], options);
      }
    }
  }

  /**
   * Retrieve the values of all items in the cache.
   *
   * @example
   * const values = cache.values();
   *
   * @method Cache#values
   * @returns {array} The values of the items in the cache.
   */
  values() {
    return this.keys().map((key) => this.get(key));
  }
}
