'use strict';

var jsData = require('js-data');
var jsDataAdapter = require('js-data-adapter');

var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
babelHelpers;

var axios = require('axios');
var hasFetch = false;

try {
  hasFetch = window && window.fetch;
} catch (e) {}

function isValidString(value) {
  return value != null && value !== '';
}
function join(items, separator) {
  separator || (separator = '');
  return items.filter(isValidString).join(separator);
}
function makePath() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var result = join(args, '/');
  return result.replace(/([^:\/]|^)\/{2,}/g, '$1/');
}

function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

function buildUrl(url, params) {
  if (!params) {
    return url;
  }

  var parts = [];

  jsData.utils.forOwn(params, function (val, key) {
    if (val === null || typeof val === 'undefined') {
      return;
    }
    if (!jsData.utils.isArray(val)) {
      val = [val];
    }

    val.forEach(function (v) {
      if (window.toString.call(v) === '[object Date]') {
        v = v.toISOString();
      } else if (jsData.utils.isObject(v)) {
        v = jsData.utils.toJson(v);
      }
      parts.push(encode(key) + '=' + encode(v));
    });
  });

  if (parts.length > 0) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
  }

  return url;
}

var __super__ = jsDataAdapter.Adapter.prototype;

var DEFAULTS = {
  // Default and user-defined settings
  /**
   * @name HttpAdapter#basePath
   * @type {string}
   */
  basePath: '',

  /**
   * @name HttpAdapter#forceTrailingSlash
   * @type {boolean}
   * @default false
   */
  forceTrailingSlash: false,

  /**
   * @name HttpAdapter#http
   * @type {Function}
   */
  http: axios,

  /**
   * @name HttpAdapter#httpConfig
   * @type {Object}
   */
  httpConfig: {},

  /**
   * @name HttpAdapter#suffix
   * @type {string}
   */
  suffix: '',

  /**
   * @name HttpAdapter#useFetch
   * @type {boolean}
   * @default false
   */
  useFetch: false
};

/**
 * HttpAdapter class.
 *
 * @class HttpAdapter
 * @extends Adapter
 * @param {Object} [opts] Configuration options.
 * @param {string} [opts.basePath=''] TODO
 * @param {boolean} [opts.debug=false] TODO
 * @param {boolean} [opts.forceTrailingSlash=false] TODO
 * @param {Object} [opts.http=axios] TODO
 * @param {Object} [opts.httpConfig={}] TODO
 * @param {string} [opts.suffix=''] TODO
 * @param {boolean} [opts.useFetch=false] TODO
 */
function HttpAdapter(opts) {
  var self = this;
  opts || (opts = {});
  jsData.utils.fillIn(opts, DEFAULTS);
  jsDataAdapter.Adapter.call(self, opts);
}

/**
 * @name module:js-data-http.HttpAdapter
 * @see HttpAdapter
 */

// Setup prototype inheritance from Adapter
HttpAdapter.prototype = Object.create(jsDataAdapter.Adapter.prototype, {
  constructor: {
    value: HttpAdapter,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

Object.defineProperty(HttpAdapter, '__super__', {
  configurable: true,
  value: jsDataAdapter.Adapter
});

/**
 * Alternative to ES6 class syntax for extending `HttpAdapter`.
 *
 * @example <caption>Using the ES2015 class syntax.</caption>
 * class MyHttpAdapter extends HttpAdapter {...}
 * const adapter = new MyHttpAdapter()
 *
 * @example <caption>Using {@link HttpAdapter.extend}.</caption>
 * var instanceProps = {...}
 * var classProps = {...}
 *
 * var MyHttpAdapter = HttpAdapter.extend(instanceProps, classProps)
 * var adapter = new MyHttpAdapter()
 *
 * @name HttpAdapter.extend
 * @method
 * @param {Object} [instanceProps] Properties that will be added to the
 * prototype of the subclass.
 * @param {Object} [classProps] Properties that will be added as static
 * properties to the subclass itself.
 * @return {Object} Subclass of `HttpAdapter`.
 */
HttpAdapter.extend = jsData.utils.extend;

jsData.utils.addHiddenPropsToTarget(HttpAdapter.prototype, {
  /**
   * @name HttpAdapter#afterDEL
   * @method
   * @param {string} url
   * @param {Object} config
   * @param {Object} opts
   * @param {Object} response
   */
  afterDEL: jsDataAdapter.noop2,

  /**
   * @name HttpAdapter#afterGET
   * @method
   * @param {string} url
   * @param {Object} config
   * @param {Object} opts
   * @param {Object} response
   */
  afterGET: jsDataAdapter.noop2,

  /**
   * @name HttpAdapter#afterHTTP
   * @method
   * @param {Object} config
   * @param {Object} opts
   * @param {Object} response
   */
  afterHTTP: jsDataAdapter.noop2,

  /**
   * @name HttpAdapter#afterPOST
   * @method
   * @param {string} url
   * @param {Object} data
   * @param {Object} config
   * @param {Object} opts
   * @param {Object} response
   */
  afterPOST: jsDataAdapter.noop2,

  /**
   * @name HttpAdapter#afterPUT
   * @method
   * @param {string} url
   * @param {Object} data
   * @param {Object} config
   * @param {Object} opts
   * @param {Object} response
   */
  afterPUT: jsDataAdapter.noop2,

  /**
   * @name HttpAdapter#beforeDEL
   * @method
   * @param {Object} url
   * @param {Object} config
   * @param {Object} opts
   */
  beforeDEL: jsDataAdapter.noop,

  /**
   * @name HttpAdapter#beforeGET
   * @method
   * @param {Object} url
   * @param {Object} config
   * @param {Object} opts
   */
  beforeGET: jsDataAdapter.noop,

  /**
   * @name HttpAdapter#beforeHTTP
   * @method
   * @param {Object} config
   * @param {Object} opts
   */
  beforeHTTP: jsDataAdapter.noop,

  /**
   * @name HttpAdapter#beforePOST
   * @method
   * @param {Object} url
   * @param {Object} data
   * @param {Object} config
   * @param {Object} opts
   */
  beforePOST: jsDataAdapter.noop,

  /**
   * @name HttpAdapter#beforePUT
   * @method
   * @param {Object} url
   * @param {Object} data
   * @param {Object} config
   * @param {Object} opts
   */
  beforePUT: jsDataAdapter.noop,

  _count: function _count(mapper, query, opts) {
    var self = this;
    return self.GET(self.getPath('count', mapper, opts.params, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _create: function _create(mapper, props, opts) {
    var self = this;
    return self.POST(self.getPath('create', mapper, props, opts), self.serialize(mapper, props, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _createMany: function _createMany(mapper, props, opts) {
    var self = this;
    return self.POST(self.getPath('createMany', mapper, null, opts), self.serialize(mapper, props, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _destroy: function _destroy(mapper, id, opts) {
    var self = this;
    return self.DEL(self.getPath('destroy', mapper, id, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _destroyAll: function _destroyAll(mapper, query, opts) {
    var self = this;
    return self.DEL(self.getPath('destroyAll', mapper, null, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _end: function _end(mapper, opts, response) {
    return [this.deserialize(mapper, response, opts), response];
  },
  _find: function _find(mapper, id, opts) {
    var self = this;
    return self.GET(self.getPath('find', mapper, id, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _findAll: function _findAll(mapper, query, opts) {
    var self = this;
    return self.GET(self.getPath('findAll', mapper, opts.params, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _sum: function _sum(mapper, field, query, opts) {
    var self = this;
    return self.GET(self.getPath('sum', mapper, opts.params, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _update: function _update(mapper, id, props, opts) {
    var self = this;
    return self.PUT(self.getPath('update', mapper, id, opts), self.serialize(mapper, props, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _updateAll: function _updateAll(mapper, props, query, opts) {
    var self = this;
    return self.PUT(self.getPath('updateAll', mapper, null, opts), self.serialize(mapper, props, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },
  _updateMany: function _updateMany(mapper, records, opts) {
    var self = this;
    return self.PUT(self.getPath('updateMany', mapper, null, opts), self.serialize(mapper, records, opts), opts).then(function (response) {
      return self._end(mapper, opts, response);
    });
  },


  /**
   * Retrieve the number of records that match the selection `query`.
   *
   * @name HttpAdapter#count
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @param {string} [opts.params] TODO
   * @param {string} [opts.suffix={@link HttpAdapter#suffix}] TODO
   * @return {Promise}
   */
  count: function count(mapper, query, opts) {
    var self = this;
    query || (query = {});
    opts || (opts = {});
    opts.params = self.getParams(opts);
    opts.params.count = true;
    opts.suffix = self.getSuffix(mapper, opts);
    jsData.utils.deepMixIn(opts.params, query);
    opts.params = self.queryTransform(mapper, opts.params, opts);

    return __super__.count.call(self, mapper, query, opts);
  },


  /**
   * Create a new the record from the provided `props`.
   *
   * @name HttpAdapter#create
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} props Properties to send as the payload.
   * @param {Object} [opts] Configuration options.
   * @param {string} [opts.params] TODO
   * @param {string} [opts.suffix={@link HttpAdapter#suffix}] TODO
   * @return {Promise}
   */
  create: function create(mapper, props, opts) {
    var self = this;
    opts || (opts = {});
    opts.params = self.getParams(opts);
    opts.params = self.queryTransform(mapper, opts.params, opts);
    opts.suffix = self.getSuffix(mapper, opts);

    return __super__.create.call(self, mapper, props, opts);
  },


  /**
   * Create multiple new records in batch.
   *
   * @name HttpAdapter#createMany
   * @method
   * @param {Object} mapper The mapper.
   * @param {Array} props Array of property objects to send as the payload.
   * @param {Object} [opts] Configuration options.
   * @param {string} [opts.params] TODO
   * @param {string} [opts.suffix={@link HttpAdapter#suffix}] TODO
   * @return {Promise}
   */
  createMany: function createMany(mapper, props, opts) {
    var self = this;
    opts || (opts = {});
    opts.params = self.getParams(opts);
    opts.params = self.queryTransform(mapper, opts.params, opts);
    opts.suffix = self.getSuffix(mapper, opts);

    return __super__.createMany.call(self, mapper, props, opts);
  },


  /**
   * Make an Http request to `url` according to the configuration in `config`.
   *
   * @name HttpAdapter#DEL
   * @method
   * @param {string} url Url for the request.
   * @param {Object} [config] Http configuration that will be passed to
   * {@link HttpAdapter#HTTP}.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  DEL: function DEL(url, config, opts) {
    var self = this;
    var op = void 0;
    config || (config = {});
    opts || (opts = {});
    config.url = url || config.url;
    config.method = config.method || 'delete';

    // beforeDEL lifecycle hook
    op = opts.op = 'beforeDEL';
    return jsData.utils.resolve(self[op](url, config, opts)).then(function (_config) {
      // Allow re-assignment from lifecycle hook
      config = jsData.utils.isUndefined(_config) ? config : _config;
      op = opts.op = 'DEL';
      self.dbg(op, url, config, opts);
      return self.HTTP(config, opts);
    }).then(function (response) {
      // afterDEL lifecycle hook
      op = opts.op = 'afterDEL';
      return jsData.utils.resolve(self[op](url, config, opts, response)).then(function (_response) {
        // Allow re-assignment from lifecycle hook
        return jsData.utils.isUndefined(_response) ? response : _response;
      });
    });
  },


  /**
   * Transform the server response object into the payload that will be returned
   * to JSData.
   *
   * @name HttpAdapter#deserialize
   * @method
   * @param {Object} mapper The mapper used for the operation.
   * @param {Object} response Response object from {@link HttpAdapter#HTTP}.
   * @param {Object} opts Configuration options.
   * @return {(Object|Array)} Deserialized data.
   */
  deserialize: function deserialize(mapper, response, opts) {
    opts || (opts = {});
    if (jsData.utils.isFunction(opts.deserialize)) {
      return opts.deserialize(mapper, response, opts);
    }
    if (jsData.utils.isFunction(mapper.deserialize)) {
      return mapper.deserialize(mapper, response, opts);
    }
    if (response && response.hasOwnProperty('data')) {
      return response.data;
    }
    return response;
  },


  /**
   * Destroy the record with the given primary key.
   *
   * @name HttpAdapter#destroy
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to destroy.
   * @param {Object} [opts] Configuration options.
   * @param {string} [opts.params] TODO
   * @param {string} [opts.suffix={@link HttpAdapter#suffix}] TODO
   * @return {Promise}
   */
  destroy: function destroy(mapper, id, opts) {
    var self = this;
    opts || (opts = {});
    opts.params = self.getParams(opts);
    opts.params = self.queryTransform(mapper, opts.params, opts);
    opts.suffix = self.getSuffix(mapper, opts);

    return __super__.destroy.call(self, mapper, id, opts);
  },


  /**
   * Destroy the records that match the selection `query`.
   *
   * @name HttpAdapter#destroyAll
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @param {string} [opts.params] TODO
   * @param {string} [opts.suffix={@link HttpAdapter#suffix}] TODO
   * @return {Promise}
   */
  destroyAll: function destroyAll(mapper, query, opts) {
    var self = this;
    query || (query = {});
    opts || (opts = {});
    opts.params = self.getParams(opts);
    jsData.utils.deepMixIn(opts.params, query);
    opts.params = self.queryTransform(mapper, opts.params, opts);
    opts.suffix = self.getSuffix(mapper, opts);

    return __super__.destroyAll.call(self, mapper, query, opts);
  },


  /**
   * Log an error.
   *
   * @name HttpAdapter#error
   * @method
   * @param {...*} [args] Arguments to log.
   */
  error: function error() {
    if (console) {
      var _console;

      (_console = console)[typeof console.error === 'function' ? 'error' : 'log'].apply(_console, arguments);
    }
  },


  /**
   * Make an Http request using `window.fetch`.
   *
   * @name HttpAdapter#fetch
   * @method
   * @param {Object} config Request configuration.
   * @param {Object} config.data Payload for the request.
   * @param {string} config.method Http method for the request.
   * @param {Object} config.headers Headers for the request.
   * @param {Object} config.params Querystring for the request.
   * @param {string} config.url Url for the request.
   * @param {Object} [opts] Configuration options.
   */
  fetch: function (_fetch) {
    function fetch(_x, _x2) {
      return _fetch.apply(this, arguments);
    }

    fetch.toString = function () {
      return _fetch.toString();
    };

    return fetch;
  }(function (config, opts) {
    var requestConfig = {
      method: config.method,
      // turn the plain headers object into the Fetch Headers object
      headers: new Headers(config.headers)
    };

    if (config.data) {
      requestConfig.body = jsData.utils.toJson(config.data);
    }

    return fetch(new Request(buildUrl(config.url, config.params), requestConfig)).then(function (response) {
      response.config = {
        method: config.method,
        url: config.url
      };
      return response.json().then(function (data) {
        response.data = data;
        return response;
      });
    });
  }),


  /**
   * Retrieve the record with the given primary key.
   *
   * @name HttpAdapter#find
   * @method
   * @param {Object} mapper The mapper.
   * @param {(string|number)} id Primary key of the record to retrieve.
   * @param {Object} [opts] Configuration options.
   * @param {string} [opts.params] TODO
   * @param {string} [opts.suffix={@link HttpAdapter#suffix}] TODO
   * @return {Promise}
   */
  find: function find(mapper, id, opts) {
    var self = this;
    opts || (opts = {});
    opts.params = self.getParams(opts);
    opts.params = self.queryTransform(mapper, opts.params, opts);
    opts.suffix = self.getSuffix(mapper, opts);

    return __super__.find.call(self, mapper, id, opts);
  },


  /**
   * Retrieve the records that match the selection `query`.
   *
   * @name HttpAdapter#findAll
   * @method
   * @param {Object} mapper The mapper.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @param {string} [opts.params] TODO
   * @param {string} [opts.suffix={@link HttpAdapter#suffix}] TODO
   * @return {Promise}
   */
  findAll: function findAll(mapper, query, opts) {
    var self = this;
    query || (query = {});
    opts || (opts = {});
    opts.params = self.getParams(opts);
    opts.suffix = self.getSuffix(mapper, opts);
    jsData.utils.deepMixIn(opts.params, query);
    opts.params = self.queryTransform(mapper, opts.params, opts);

    return __super__.findAll.call(self, mapper, query, opts);
  },


  /**
   * TODO
   *
   * @name HttpAdapter#GET
   * @method
   * @param {string} url The url for the request.
   * @param {Object} config Request configuration options.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  GET: function GET(url, config, opts) {
    var self = this;
    var op = void 0;
    config || (config = {});
    opts || (opts = {});
    config.url = url || config.url;
    config.method = config.method || 'get';

    // beforeGET lifecycle hook
    op = opts.op = 'beforeGET';
    return jsData.utils.resolve(self[op](url, config, opts)).then(function (_config) {
      // Allow re-assignment from lifecycle hook
      config = jsData.utils.isUndefined(_config) ? config : _config;
      op = opts.op = 'GET';
      self.dbg(op, url, config, opts);
      return self.HTTP(config, opts);
    }).then(function (response) {
      // afterGET lifecycle hook
      op = opts.op = 'afterGET';
      return jsData.utils.resolve(self[op](url, config, opts, response)).then(function (_response) {
        // Allow re-assignment from lifecycle hook
        return jsData.utils.isUndefined(_response) ? response : _response;
      });
    });
  },


  /**
   * @name HttpAdapter#getEndpoint
   * @method
   * @param {Object} mapper TODO
   * @param {*} id TODO
   * @param {boolean} opts TODO
   * @return {string} Full path.
   */
  getEndpoint: function getEndpoint(mapper, id, opts) {
    var self = this;
    opts || (opts = {});
    opts.params = jsData.utils.isUndefined(opts.params) ? {} : opts.params;
    var relationList = mapper.relationList || [];
    var endpoint = jsData.utils.isUndefined(opts.endpoint) ? jsData.utils.isUndefined(mapper.endpoint) ? mapper.name : mapper.endpoint : opts.endpoint;

    relationList.forEach(function (def) {
      if (def.type !== 'belongsTo' || !def.parent) {
        return;
      }
      var item = void 0;
      var parentKey = def.foreignKey;
      var parentDef = def.getRelation();
      var parentId = opts.params[parentKey];

      if (parentId === false || !parentKey || !parentDef) {
        if (parentId === false) {
          delete opts.params[parentKey];
        }
        return false;
      } else {
        delete opts.params[parentKey];

        if (jsData.utils.isObject(id)) {
          item = id;
        }

        if (item) {
          parentId = parentId || def.getForeignKey(item) || (def.getLocalField(item) ? jsData.utils.get(def.getLocalField(item), parentDef.idAttribute) : null);
        }

        if (parentId) {
          var _ret = function () {
            delete opts.endpoint;
            var _opts = {};
            jsData.utils.forOwn(opts, function (value, key) {
              _opts[key] = value;
            });
            jsData.utils._(_opts, parentDef);
            endpoint = makePath(self.getEndpoint(parentDef, parentId, _opts), parentId, endpoint);
            return {
              v: false
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
        }
      }
    });

    return endpoint;
  },


  /**
   * @name HttpAdapter#getPath
   * @method
   * @param {string} method TODO
   * @param {Object} mapper TODO
   * @param {(string|number)?} id TODO
   * @param {Object} opts Configuration options.
   */
  getPath: function getPath(method, mapper, id, opts) {
    var self = this;
    opts || (opts = {});
    var args = [jsData.utils.isUndefined(opts.basePath) ? jsData.utils.isUndefined(mapper.basePath) ? self.basePath : mapper.basePath : opts.basePath, self.getEndpoint(mapper, jsData.utils.isString(id) || jsData.utils.isNumber(id) || method === 'create' ? id : null, opts)];
    if (method === 'find' || method === 'update' || method === 'destroy') {
      args.push(id);
    }
    return makePath.apply(jsData.utils, args);
  },
  getParams: function getParams(opts) {
    opts || (opts = {});
    if (jsData.utils.isUndefined(opts.params)) {
      return {};
    }
    return jsData.utils.copy(opts.params);
  },
  getSuffix: function getSuffix(mapper, opts) {
    opts || (opts = {});
    if (jsData.utils.isUndefined(opts.suffix)) {
      if (jsData.utils.isUndefined(mapper.suffix)) {
        return this.suffix;
      }
      return mapper.suffix;
    }
    return opts.suffix;
  },


  /**
   * Make an Http request.
   *
   * @name HttpAdapter#HTTP
   * @method
   * @param {Object} config Request configuration options.
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  HTTP: function HTTP(config, opts) {
    var self = this;
    var start = new Date();
    opts || (opts = {});
    var payload = config.data;
    var cache = config.cache;
    var timeout = config.timeout;
    config = jsData.utils.copy(config, null, null, null, ['data', 'cache', 'timeout']);
    config = jsData.utils.deepMixIn(config, self.httpConfig);
    config.data = payload;
    config.cache = cache;
    config.timeout = timeout;
    if (self.forceTrailingSlash && config.url[config.url.length - 1] !== '/') {
      config.url += '/';
    }
    config.method = config.method.toUpperCase();
    var suffix = config.suffix || opts.suffix || self.suffix;
    if (suffix && config.url.substr(config.url.length - suffix.length) !== suffix) {
      config.url += suffix;
    }

    function logResponse(data) {
      var str = start.toUTCString() + ' - ' + config.method.toUpperCase() + ' ' + config.url + ' - ' + data.status + ' ' + (new Date().getTime() - start.getTime()) + 'ms';
      if (data.status >= 200 && data.status < 300) {
        if (self.log) {
          self.dbg('debug', str, data);
        }
        return data;
      } else {
        if (self.error) {
          self.error('\'FAILED: ' + str, data);
        }
        return jsData.utils.reject(data);
      }
    }

    if (!self.http) {
      throw new Error('You have not configured this adapter with an http library!');
    }

    return jsData.utils.resolve(self.beforeHTTP(config, opts)).then(function (_config) {
      config = _config || config;
      if (hasFetch && (self.useFetch || opts.useFetch || !self.http)) {
        return self.fetch(config, opts).then(logResponse, logResponse);
      }
      return self.http(config).then(logResponse, logResponse).catch(function (err) {
        return self.responseError(err, config, opts);
      });
    }).then(function (response) {
      return jsData.utils.resolve(self.afterHTTP(config, opts, response)).then(function (_response) {
        return _response || response;
      });
    });
  },


  /**
   * TODO
   *
   * @name HttpAdapter#POST
   * @method
   * @param {*} url TODO
   * @param {Object} data TODO
   * @param {Object} config TODO
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  POST: function POST(url, data, config, opts) {
    var self = this;
    var op = void 0;
    config || (config = {});
    opts || (opts = {});
    config.url = url || config.url;
    config.data = data || config.data;
    config.method = config.method || 'post';

    // beforePOST lifecycle hook
    op = opts.op = 'beforePOST';
    return jsData.utils.resolve(self[op](url, data, config, opts)).then(function (_config) {
      // Allow re-assignment from lifecycle hook
      config = jsData.utils.isUndefined(_config) ? config : _config;
      op = opts.op = 'POST';
      self.dbg(op, url, data, config, opts);
      return self.HTTP(config, opts);
    }).then(function (response) {
      // afterPOST lifecycle hook
      op = opts.op = 'afterPOST';
      return jsData.utils.resolve(self[op](url, data, config, opts, response)).then(function (_response) {
        // Allow re-assignment from lifecycle hook
        return jsData.utils.isUndefined(_response) ? response : _response;
      });
    });
  },


  /**
   * TODO
   *
   * @name HttpAdapter#PUT
   * @method
   * @param {*} url TODO
   * @param {Object} data TODO
   * @param {Object} config TODO
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  PUT: function PUT(url, data, config, opts) {
    var self = this;
    var op = void 0;
    config || (config = {});
    opts || (opts = {});
    config.url = url || config.url;
    config.data = data || config.data;
    config.method = config.method || 'put';

    // beforePUT lifecycle hook
    op = opts.op = 'beforePUT';
    return jsData.utils.resolve(self[op](url, data, config, opts)).then(function (_config) {
      // Allow re-assignment from lifecycle hook
      config = jsData.utils.isUndefined(_config) ? config : _config;
      op = opts.op = 'PUT';
      self.dbg(op, url, data, config, opts);
      return self.HTTP(config, opts);
    }).then(function (response) {
      // afterPUT lifecycle hook
      op = opts.op = 'afterPUT';
      return jsData.utils.resolve(self[op](url, data, config, opts, response)).then(function (_response) {
        // Allow re-assignment from lifecycle hook
        return jsData.utils.isUndefined(_response) ? response : _response;
      });
    });
  },


  /**
   * TODO
   *
   * @name HttpAdapter#queryTransform
   * @method
   * @param {Object} mapper TODO
   * @param {*} params TODO
   * @param {*} opts TODO
   * @return {*} Transformed params.
   */
  queryTransform: function queryTransform(mapper, params, opts) {
    opts || (opts = {});
    if (jsData.utils.isFunction(opts.queryTransform)) {
      return opts.queryTransform(mapper, params, opts);
    }
    if (jsData.utils.isFunction(mapper.queryTransform)) {
      return mapper.queryTransform(mapper, params, opts);
    }
    return params;
  },


  /**
   * Error handler invoked when the promise returned by {@link HttpAdapter#http}
   * is rejected. Default implementation is to just return the error wrapped in
   * a rejected Promise, aka rethrow the error. {@link HttpAdapter#http} is
   * called by {@link HttpAdapter#HTTP}.
   *
   * @name HttpAdapter#responseError
   * @method
   * @param {*} err The error that {@link HttpAdapter#http} rejected with.
   * @param {Object} config The `config` argument that was passed to {@link HttpAdapter#HTTP}.
   * @param {*} opts The `opts` argument that was passed to {@link HttpAdapter#HTTP}.
   * @return {Promise}
   */
  responseError: function responseError(err, config, opts) {
    return jsData.utils.reject(err);
  },


  /**
   * TODO
   *
   * @name HttpAdapter#serialize
   * @method
   * @param {Object} mapper TODO
   * @param {Object} data TODO
   * @param {*} opts TODO
   * @return {*} Serialized data.
   */
  serialize: function serialize(mapper, data, opts) {
    opts || (opts = {});
    if (jsData.utils.isFunction(opts.serialize)) {
      return opts.serialize(mapper, data, opts);
    }
    if (jsData.utils.isFunction(mapper.serialize)) {
      return mapper.serialize(mapper, data, opts);
    }
    return data;
  },


  /**
   * Retrieve the sum of the field of the records that match the selection query.
   *
   * @name HttpAdapter#sum
   * @method
   * @param {Object} mapper The mapper.
   * @param {string} field The field to sum.
   * @param {Object} query Selection query.
   * @param {Object} [opts] Configuration options.
   * @param {string} [opts.params] TODO
   * @param {string} [opts.suffix={@link HttpAdapter#suffix}] TODO
   * @return {Promise}
   */
  sum: function sum(mapper, field, query, opts) {
    var self = this;
    query || (query = {});
    opts || (opts = {});
    if (!jsData.utils.utils.isString(field)) {
      throw new Error('field must be a string!');
    }
    opts.params = self.getParams(opts);
    opts.params.sum = field;
    opts.suffix = self.getSuffix(mapper, opts);
    jsData.utils.deepMixIn(opts.params, query);
    opts.params = self.queryTransform(mapper, opts.params, opts);

    return __super__.sum.call(self, mapper, field, query, opts);
  },


  /**
   * TODO
   *
   * @name HttpAdapter#update
   * @method
   * @param {Object} mapper TODO
   * @param {*} id TODO
   * @param {*} props TODO
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  update: function update(mapper, id, props, opts) {
    var self = this;
    opts || (opts = {});
    opts.params = self.getParams(opts);
    opts.params = self.queryTransform(mapper, opts.params, opts);
    opts.suffix = self.getSuffix(mapper, opts);

    return __super__.update.call(self, mapper, id, props, opts);
  },


  /**
   * TODO
   *
   * @name HttpAdapter#updateAll
   * @method
   * @param {Object} mapper TODO
   * @param {Object} props TODO
   * @param {Object} query TODO
   * @param {Object} [opts] Configuration options.
   * @return {Promise}
   */
  updateAll: function updateAll(mapper, props, query, opts) {
    var self = this;
    query || (query = {});
    opts || (opts = {});
    opts.params = self.getParams(opts);
    jsData.utils.deepMixIn(opts.params, query);
    opts.params = self.queryTransform(mapper, opts.params, opts);
    opts.suffix = self.getSuffix(mapper, opts);

    return __super__.updateAll.call(self, mapper, props, query, opts);
  },


  /**
   * Update multiple records in batch.
   *
   * {@link HttpAdapter#beforeUpdateMany} will be called before calling
   * {@link HttpAdapter#PUT}.
   * {@link HttpAdapter#afterUpdateMany} will be called after calling
   * {@link HttpAdapter#PUT}.
   *
   * @name HttpAdapter#updateMany
   * @method
   * @param {Object} mapper The mapper.
   * @param {Array} records Array of property objects to send as the payload.
   * @param {Object} [opts] Configuration options.
   * @param {string} [opts.params] TODO
   * @param {string} [opts.suffix={@link HttpAdapter#suffix}] TODO
   * @return {Promise}
   */
  updateMany: function updateMany(mapper, records, opts) {
    var self = this;
    opts || (opts = {});
    opts.params = self.getParams(opts);
    opts.params = self.queryTransform(mapper, opts.params, opts);
    opts.suffix = self.getSuffix(mapper, opts);

    return __super__.updateMany.call(self, mapper, records, opts);
  }
});

/**
 * Add an Http actions to a mapper.
 *
 * @example
 * // CommonJS
 * var JSData = require('js-data')
 * // It is recommended to use DataStore in the browser
 * var DataStore = JSData.DataStore
 *
 * var JSDataHttp = require('js-data-http')
 * var HttpAdapter = JSDataHttp.HttpAdapter
 * var addAction = JSDataHttp.addAction
 *
 * var adapter = new HttpAdapter()
 * var store = new DataStore()
 *
 * store.registerAdapter('http', adapter, { default: true })
 * store.defineMapper('school')
 *
 * // GET /reports/schools/:school_id/teachers
 * addAction('getTeacherReports', {
 *   basePath: 'reports/schools',
 *   pathname: 'teachers',
 *   method: 'GET'
 * })(store.getMapper('school'))
 *
 * // /reports/schools/1234/teachers
 * store.getMapper('school').getTeacherReports(1234).then(function (response) {
 *   // ...
 * })
 *
 * @name module:js-data-http.addAction
 * @method
 * @param {string} name Name of the new action.
 * @param {Object} [opts] Action configuration
 * @param {string} [opts.adapter]
 * @param {string} [opts.pathname]
 * @param {Function} [opts.request]
 * @param {Function} [opts.response]
 * @param {Function} [opts.responseError]
 * @return {Function} Decoration function, which should be passed the mapper to
 * decorate when invoked.
 */
function addAction(name, opts) {
  if (!name || !jsData.utils.isString(name)) {
    throw new TypeError('action(name[, opts]): Expected: string, Found: ' + (typeof name === 'undefined' ? 'undefined' : babelHelpers.typeof(name)));
  }
  return function (mapper) {
    if (mapper[name]) {
      throw new Error('action(name[, opts]): ' + name + ' already exists on target!');
    }
    opts.request = opts.request || function (config) {
      return config;
    };
    opts.response = opts.response || function (response) {
      return response;
    };
    opts.responseError = opts.responseError || function (err) {
      return jsData.utils.reject(err);
    };
    mapper[name] = function (id, _opts) {
      var self = this;
      if (jsData.utils.isObject(id)) {
        _opts = id;
      }
      _opts = _opts || {};
      var adapter = self.getAdapter(opts.adapter || self.defaultAdapter || 'http');
      var config = {};
      jsData.utils.fillIn(config, opts);
      if (!_opts.hasOwnProperty('endpoint') && config.endpoint) {
        _opts.endpoint = config.endpoint;
      }
      if (typeof _opts.getEndpoint === 'function') {
        config.url = _opts.getEndpoint(self, _opts);
      } else {
        var args = [_opts.basePath || self.basePath || adapter.basePath, adapter.getEndpoint(self, jsData.utils.isSorN(id) ? id : null, _opts)];
        if (jsData.utils.isSorN(id)) {
          args.push(id);
        }
        args.push(opts.pathname || name);
        config.url = makePath.apply(null, args);
      }
      config.method = config.method || 'GET';
      config.mapper = self.name;
      jsData.utils.deepMixIn(config, _opts);
      return jsData.utils.resolve(config).then(_opts.request || opts.request).then(function (config) {
        return adapter.HTTP(config);
      }).then(function (data) {
        if (data && data.config) {
          data.config.mapper = self.name;
        }
        return data;
      }).then(_opts.response || opts.response, _opts.responseError || opts.responseError);
    };
    return mapper;
  };
}

/**
 * Add multiple Http actions to a mapper. See {@link HttpAdapter.addAction} for
 * action configuration options.
 *
 * @example
 * // CommonJS
 * var JSData = require('js-data')
 * // It is recommended to use DataStore in the browser
 * var DataStore = JSData.DataStore
 *
 * var JSDataHttp = require('js-data-http')
 * var HttpAdapter = JSDataHttp.HttpAdapter
 * var addActions = JSDataHttp.addActions
 *
 * var adapter = new HttpAdapter()
 * var store = new DataStore()
 *
 * store.registerAdapter('http', adapter, { default: true })
 * store.defineMapper('school')
 *
 * addActions({
 *   // GET /reports/schools/:school_id/teachers
 *   getTeacherReports: {
 *     basePath: 'reports/schools',
 *     pathname: 'teachers',
 *     method: 'GET'
 *   }
 * })(store.getMapper('school'))
 *
 * // /reports/schools/1234/teachers
 * store.getMapper('school').getTeacherReports(1234).then(function (response) {
 *   // ...
 * })
 *
 * @name module:js-data-http.addActions
 * @method
 * @param {Object.<string, Object>} opts Object where the key is an action name
 * and the value is the configuration for the action.
 * @return {Function} Decoration function, which should be passed the mapper to
 * decorate when invoked.
 */
function addActions(opts) {
  opts || (opts = {});
  return function (mapper) {
    jsData.utils.forOwn(opts, function (value, key) {
      addAction(key, value)(mapper);
    });
    return mapper;
  };
}

/**
 * Details of the current version of the `js-data-http` module.
 *
 * @name module:js-data-http.version
 * @type {Object}
 * @property {string} version.full The full semver value.
 * @property {number} version.major The major version number.
 * @property {number} version.minor The minor version number.
 * @property {number} version.patch The patch version number.
 * @property {(string|boolean)} version.alpha The alpha version value,
 * otherwise `false` if the current version is not alpha.
 * @property {(string|boolean)} version.beta The beta version value,
 * otherwise `false` if the current version is not beta.
 */
var version = {
  beta: 7,
  full: '3.0.0-beta.7',
  major: 3,
  minor: 0,
  patch: 0
};

/**
 * Registered as `js-data-http` in NPM and Bower. The build of `js-data-http`
 * that works on Node.js is registered in NPM as `js-data-http-node`. The build
 * of `js-data-http` that does not bundle `axios` is registered in NPM and Bower
 * as `js-data-fetch`.
 *
 * @example <caption>Script tag</caption>
 * var HttpAdapter = window.JSDataHttp.HttpAdapter
 * var adapter = new HttpAdapter()
 *
 * @example <caption>CommonJS</caption>
 * var HttpAdapter = require('js-data-Http').HttpAdapter
 * var adapter = new HttpAdapter()
 *
 * @example <caption>ES2015 Modules</caption>
 * import {HttpAdapter} from 'js-data-Http'
 * const adapter = new HttpAdapter()
 *
 * @example <caption>AMD</caption>
 * define('myApp', ['js-data-Http'], function (JSDataHttp) {
 *   var HttpAdapter = JSDataHttp.HttpAdapter
 *   var adapter = new HttpAdapter()
 *
 *   // ...
 * })
 *
 * @module js-data-http
 */

exports.HttpAdapter = HttpAdapter;
exports.addAction = addAction;
exports.addActions = addActions;
exports.version = version;
//# sourceMappingURL=js-data-http-node.js.map