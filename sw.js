try {
  self["workbox:core:7.0.0"] && _();
} catch {
}
const $ = (s, ...e) => {
  let t = s;
  return e.length > 0 && (t += ` :: ${JSON.stringify(e)}`), t;
}, G = $;
class u extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(e, t) {
    const n = G(e, t);
    super(n), this.name = e, this.details = t;
  }
}
const z = (s) => new URL(String(s), location.href).href.replace(new RegExp(`^${location.origin}`), "");
try {
  self["workbox:cacheable-response:7.0.0"] && _();
} catch {
}
class J {
  /**
   * To construct a new CacheableResponse instance you must provide at least
   * one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param {Object} config
   * @param {Array<number>} [config.statuses] One or more status codes that a
   * `Response` can have and be considered cacheable.
   * @param {Object<string,string>} [config.headers] A mapping of header names
   * and expected values that a `Response` can have and be considered cacheable.
   * If multiple headers are provided, only one needs to be present.
   */
  constructor(e = {}) {
    this._statuses = e.statuses, this._headers = e.headers;
  }
  /**
   * Checks a response to see whether it's cacheable or not, based on this
   * object's configuration.
   *
   * @param {Response} response The response whose cacheability is being
   * checked.
   * @return {boolean} `true` if the `Response` is cacheable, and `false`
   * otherwise.
   */
  isResponseCacheable(e) {
    let t = !0;
    return this._statuses && (t = this._statuses.includes(e.status)), this._headers && t && (t = Object.keys(this._headers).some((n) => e.headers.get(n) === this._headers[n])), t;
  }
}
class x {
  /**
   * To construct a new CacheableResponsePlugin instance you must provide at
   * least one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param {Object} config
   * @param {Array<number>} [config.statuses] One or more status codes that a
   * `Response` can have and be considered cacheable.
   * @param {Object<string,string>} [config.headers] A mapping of header names
   * and expected values that a `Response` can have and be considered cacheable.
   * If multiple headers are provided, only one needs to be present.
   */
  constructor(e) {
    this.cacheWillUpdate = async ({ response: t }) => this._cacheableResponse.isResponseCacheable(t) ? t : null, this._cacheableResponse = new J(e);
  }
}
function v(s) {
  s.then(() => {
  });
}
const X = (s, e) => e.some((t) => s instanceof t);
let L, I;
function Y() {
  return L || (L = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Z() {
  return I || (I = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const W = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), H = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakMap(), T = /* @__PURE__ */ new WeakMap();
function ee(s) {
  const e = new Promise((t, n) => {
    const r = () => {
      s.removeEventListener("success", i), s.removeEventListener("error", a);
    }, i = () => {
      t(f(s.result)), r();
    }, a = () => {
      n(s.error), r();
    };
    s.addEventListener("success", i), s.addEventListener("error", a);
  });
  return e.then((t) => {
    t instanceof IDBCursor && W.set(t, s);
  }).catch(() => {
  }), T.set(e, s), e;
}
function te(s) {
  if (M.has(s))
    return;
  const e = new Promise((t, n) => {
    const r = () => {
      s.removeEventListener("complete", i), s.removeEventListener("error", a), s.removeEventListener("abort", a);
    }, i = () => {
      t(), r();
    }, a = () => {
      n(s.error || new DOMException("AbortError", "AbortError")), r();
    };
    s.addEventListener("complete", i), s.addEventListener("error", a), s.addEventListener("abort", a);
  });
  M.set(s, e);
}
let P = {
  get(s, e, t) {
    if (s instanceof IDBTransaction) {
      if (e === "done")
        return M.get(s);
      if (e === "objectStoreNames")
        return s.objectStoreNames || H.get(s);
      if (e === "store")
        return t.objectStoreNames[1] ? void 0 : t.objectStore(t.objectStoreNames[0]);
    }
    return f(s[e]);
  },
  set(s, e, t) {
    return s[e] = t, !0;
  },
  has(s, e) {
    return s instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in s;
  }
};
function se(s) {
  P = s(P);
}
function ne(s) {
  return s === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(e, ...t) {
    const n = s.call(C(this), e, ...t);
    return H.set(n, e.sort ? e.sort() : [e]), f(n);
  } : Z().includes(s) ? function(...e) {
    return s.apply(C(this), e), f(W.get(this));
  } : function(...e) {
    return f(s.apply(C(this), e));
  };
}
function re(s) {
  return typeof s == "function" ? ne(s) : (s instanceof IDBTransaction && te(s), X(s, Y()) ? new Proxy(s, P) : s);
}
function f(s) {
  if (s instanceof IDBRequest)
    return ee(s);
  if (D.has(s))
    return D.get(s);
  const e = re(s);
  return e !== s && (D.set(s, e), T.set(e, s)), e;
}
const C = (s) => T.get(s);
function ae(s, e, { blocked: t, upgrade: n, blocking: r, terminated: i } = {}) {
  const a = indexedDB.open(s, e), o = f(a);
  return n && a.addEventListener("upgradeneeded", (c) => {
    n(f(a.result), c.oldVersion, c.newVersion, f(a.transaction), c);
  }), t && a.addEventListener("blocked", (c) => t(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    c.oldVersion,
    c.newVersion,
    c
  )), o.then((c) => {
    i && c.addEventListener("close", () => i()), r && c.addEventListener("versionchange", (h) => r(h.oldVersion, h.newVersion, h));
  }).catch(() => {
  }), o;
}
function ie(s, { blocked: e } = {}) {
  const t = indexedDB.deleteDatabase(s);
  return e && t.addEventListener("blocked", (n) => e(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    n.oldVersion,
    n
  )), f(t).then(() => {
  });
}
const oe = ["get", "getKey", "getAll", "getAllKeys", "count"], ce = ["put", "add", "delete", "clear"], k = /* @__PURE__ */ new Map();
function U(s, e) {
  if (!(s instanceof IDBDatabase && !(e in s) && typeof e == "string"))
    return;
  if (k.get(e))
    return k.get(e);
  const t = e.replace(/FromIndex$/, ""), n = e !== t, r = ce.includes(t);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(t in (n ? IDBIndex : IDBObjectStore).prototype) || !(r || oe.includes(t))
  )
    return;
  const i = async function(a, ...o) {
    const c = this.transaction(a, r ? "readwrite" : "readonly");
    let h = c.store;
    return n && (h = h.index(o.shift())), (await Promise.all([
      h[t](...o),
      r && c.done
    ]))[0];
  };
  return k.set(e, i), i;
}
se((s) => ({
  ...s,
  get: (e, t, n) => U(e, t) || s.get(e, t, n),
  has: (e, t) => !!U(e, t) || s.has(e, t)
}));
try {
  self["workbox:expiration:7.0.0"] && _();
} catch {
}
const he = "workbox-expiration", w = "cache-entries", j = (s) => {
  const e = new URL(s, location.href);
  return e.hash = "", e.href;
};
class le {
  /**
   *
   * @param {string} cacheName
   *
   * @private
   */
  constructor(e) {
    this._db = null, this._cacheName = e;
  }
  /**
   * Performs an upgrade of indexedDB.
   *
   * @param {IDBPDatabase<CacheDbSchema>} db
   *
   * @private
   */
  _upgradeDb(e) {
    const t = e.createObjectStore(w, { keyPath: "id" });
    t.createIndex("cacheName", "cacheName", { unique: !1 }), t.createIndex("timestamp", "timestamp", { unique: !1 });
  }
  /**
   * Performs an upgrade of indexedDB and deletes deprecated DBs.
   *
   * @param {IDBPDatabase<CacheDbSchema>} db
   *
   * @private
   */
  _upgradeDbAndDeleteOldDbs(e) {
    this._upgradeDb(e), this._cacheName && ie(this._cacheName);
  }
  /**
   * @param {string} url
   * @param {number} timestamp
   *
   * @private
   */
  async setTimestamp(e, t) {
    e = j(e);
    const n = {
      url: e,
      timestamp: t,
      cacheName: this._cacheName,
      // Creating an ID from the URL and cache name won't be necessary once
      // Edge switches to Chromium and all browsers we support work with
      // array keyPaths.
      id: this._getId(e)
    }, i = (await this.getDb()).transaction(w, "readwrite", {
      durability: "relaxed"
    });
    await i.store.put(n), await i.done;
  }
  /**
   * Returns the timestamp stored for a given URL.
   *
   * @param {string} url
   * @return {number | undefined}
   *
   * @private
   */
  async getTimestamp(e) {
    const n = await (await this.getDb()).get(w, this._getId(e));
    return n == null ? void 0 : n.timestamp;
  }
  /**
   * Iterates through all the entries in the object store (from newest to
   * oldest) and removes entries once either `maxCount` is reached or the
   * entry's timestamp is less than `minTimestamp`.
   *
   * @param {number} minTimestamp
   * @param {number} maxCount
   * @return {Array<string>}
   *
   * @private
   */
  async expireEntries(e, t) {
    const n = await this.getDb();
    let r = await n.transaction(w).store.index("timestamp").openCursor(null, "prev");
    const i = [];
    let a = 0;
    for (; r; ) {
      const c = r.value;
      c.cacheName === this._cacheName && (e && c.timestamp < e || t && a >= t ? i.push(r.value) : a++), r = await r.continue();
    }
    const o = [];
    for (const c of i)
      await n.delete(w, c.id), o.push(c.url);
    return o;
  }
  /**
   * Takes a URL and returns an ID that will be unique in the object store.
   *
   * @param {string} url
   * @return {string}
   *
   * @private
   */
  _getId(e) {
    return this._cacheName + "|" + j(e);
  }
  /**
   * Returns an open connection to the database.
   *
   * @private
   */
  async getDb() {
    return this._db || (this._db = await ae(he, 1, {
      upgrade: this._upgradeDbAndDeleteOldDbs.bind(this)
    })), this._db;
  }
}
class ue {
  /**
   * To construct a new CacheExpiration instance you must provide at least
   * one of the `config` properties.
   *
   * @param {string} cacheName Name of the cache to apply restrictions to.
   * @param {Object} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
   * that will be used when calling `delete()` on the cache.
   */
  constructor(e, t = {}) {
    this._isRunning = !1, this._rerunRequested = !1, this._maxEntries = t.maxEntries, this._maxAgeSeconds = t.maxAgeSeconds, this._matchOptions = t.matchOptions, this._cacheName = e, this._timestampModel = new le(e);
  }
  /**
   * Expires entries for the given cache and given criteria.
   */
  async expireEntries() {
    if (this._isRunning) {
      this._rerunRequested = !0;
      return;
    }
    this._isRunning = !0;
    const e = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1e3 : 0, t = await this._timestampModel.expireEntries(e, this._maxEntries), n = await self.caches.open(this._cacheName);
    for (const r of t)
      await n.delete(r, this._matchOptions);
    this._isRunning = !1, this._rerunRequested && (this._rerunRequested = !1, v(this.expireEntries()));
  }
  /**
   * Update the timestamp for the given URL. This ensures the when
   * removing entries based on maximum entries, most recently used
   * is accurate or when expiring, the timestamp is up-to-date.
   *
   * @param {string} url
   */
  async updateTimestamp(e) {
    await this._timestampModel.setTimestamp(e, Date.now());
  }
  /**
   * Can be used to check if a URL has expired or not before it's used.
   *
   * This requires a look up from IndexedDB, so can be slow.
   *
   * Note: This method will not remove the cached entry, call
   * `expireEntries()` to remove indexedDB and Cache entries.
   *
   * @param {string} url
   * @return {boolean}
   */
  async isURLExpired(e) {
    if (this._maxAgeSeconds) {
      const t = await this._timestampModel.getTimestamp(e), n = Date.now() - this._maxAgeSeconds * 1e3;
      return t !== void 0 ? t < n : !0;
    } else
      return !1;
  }
  /**
   * Removes the IndexedDB object store used to keep track of cache expiration
   * metadata.
   */
  async delete() {
    this._rerunRequested = !1, await this._timestampModel.expireEntries(1 / 0);
  }
}
const d = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration < "u" ? registration.scope : ""
}, S = (s) => [d.prefix, s, d.suffix].filter((e) => e && e.length > 0).join("-"), de = (s) => {
  for (const e of Object.keys(d))
    s(e);
}, q = {
  updateDetails: (s) => {
    de((e) => {
      typeof s[e] == "string" && (d[e] = s[e]);
    });
  },
  getGoogleAnalyticsName: (s) => s || S(d.googleAnalytics),
  getPrecacheName: (s) => s || S(d.precache),
  getPrefix: () => d.prefix,
  getRuntimeName: (s) => s || S(d.runtime),
  getSuffix: () => d.suffix
}, F = /* @__PURE__ */ new Set();
function fe(s) {
  F.add(s);
}
class E {
  /**
   * @param {ExpirationPluginOptions} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
   * that will be used when calling `delete()` on the cache.
   * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
   * automatic deletion if the available storage quota has been exceeded.
   */
  constructor(e = {}) {
    this.cachedResponseWillBeUsed = async ({ event: t, request: n, cacheName: r, cachedResponse: i }) => {
      if (!i)
        return null;
      const a = this._isResponseDateFresh(i), o = this._getCacheExpiration(r);
      v(o.expireEntries());
      const c = o.updateTimestamp(n.url);
      if (t)
        try {
          t.waitUntil(c);
        } catch {
        }
      return a ? i : null;
    }, this.cacheDidUpdate = async ({ cacheName: t, request: n }) => {
      const r = this._getCacheExpiration(t);
      await r.updateTimestamp(n.url), await r.expireEntries();
    }, this._config = e, this._maxAgeSeconds = e.maxAgeSeconds, this._cacheExpirations = /* @__PURE__ */ new Map(), e.purgeOnQuotaError && fe(() => this.deleteCacheAndMetadata());
  }
  /**
   * A simple helper method to return a CacheExpiration instance for a given
   * cache name.
   *
   * @param {string} cacheName
   * @return {CacheExpiration}
   *
   * @private
   */
  _getCacheExpiration(e) {
    if (e === q.getRuntimeName())
      throw new u("expire-custom-caches-only");
    let t = this._cacheExpirations.get(e);
    return t || (t = new ue(e, this._config), this._cacheExpirations.set(e, t)), t;
  }
  /**
   * @param {Response} cachedResponse
   * @return {boolean}
   *
   * @private
   */
  _isResponseDateFresh(e) {
    if (!this._maxAgeSeconds)
      return !0;
    const t = this._getDateHeaderTimestamp(e);
    if (t === null)
      return !0;
    const n = Date.now();
    return t >= n - this._maxAgeSeconds * 1e3;
  }
  /**
   * This method will extract the data header and parse it into a useful
   * value.
   *
   * @param {Response} cachedResponse
   * @return {number|null}
   *
   * @private
   */
  _getDateHeaderTimestamp(e) {
    if (!e.headers.has("date"))
      return null;
    const t = e.headers.get("date"), r = new Date(t).getTime();
    return isNaN(r) ? null : r;
  }
  /**
   * This is a helper method that performs two operations:
   *
   * - Deletes *all* the underlying Cache instances associated with this plugin
   * instance, by calling caches.delete() on your behalf.
   * - Deletes the metadata from IndexedDB used to keep track of expiration
   * details for each Cache instance.
   *
   * When using cache expiration, calling this method is preferable to calling
   * `caches.delete()` directly, since this will ensure that the IndexedDB
   * metadata is also cleanly removed and open IndexedDB instances are deleted.
   *
   * Note that if you're *not* using cache expiration for a given cache, calling
   * `caches.delete()` and passing in the cache's name should be sufficient.
   * There is no Workbox-specific method needed for cleanup in that case.
   */
  async deleteCacheAndMetadata() {
    for (const [e, t] of this._cacheExpirations)
      await self.caches.delete(e), await t.delete();
    this._cacheExpirations = /* @__PURE__ */ new Map();
  }
}
try {
  self["workbox:routing:7.0.0"] && _();
} catch {
}
const K = "GET", b = (s) => s && typeof s == "object" ? s : { handle: s };
class p {
  /**
   * Constructor for Route class.
   *
   * @param {workbox-routing~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, n = K) {
    this.handler = b(t), this.match = e, this.method = n;
  }
  /**
   *
   * @param {workbox-routing-handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response
   */
  setCatchHandler(e) {
    this.catchHandler = b(e);
  }
}
class A extends p {
  /**
   * If the regular expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * the captured values will be passed to the
   * {@link workbox-routing~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, n) {
    const r = ({ url: i }) => {
      const a = e.exec(i.href);
      if (a && !(i.origin !== location.origin && a.index !== 0))
        return a.slice(1);
    };
    super(r, t, n);
  }
}
class pe {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = /* @__PURE__ */ new Map(), this._defaultHandlerMap = /* @__PURE__ */ new Map();
  }
  /**
   * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  get routes() {
    return this._routes;
  }
  /**
   * Adds a fetch event listener to respond to events when a route matches
   * the event's request.
   */
  addFetchListener() {
    self.addEventListener("fetch", (e) => {
      const { request: t } = e, n = this.handleRequest({ request: t, event: e });
      n && e.respondWith(n);
    });
  }
  /**
   * Adds a message event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */
  addCacheListener() {
    self.addEventListener("message", (e) => {
      if (e.data && e.data.type === "CACHE_URLS") {
        const { payload: t } = e.data, n = Promise.all(t.urlsToCache.map((r) => {
          typeof r == "string" && (r = [r]);
          const i = new Request(...r);
          return this.handleRequest({ request: i, event: e });
        }));
        e.waitUntil(n), e.ports && e.ports[0] && n.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle.
   * @param {ExtendableEvent} options.event The event that triggered the
   *     request.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */
  handleRequest({ request: e, event: t }) {
    const n = new URL(e.url, location.href);
    if (!n.protocol.startsWith("http"))
      return;
    const r = n.origin === location.origin, { params: i, route: a } = this.findMatchingRoute({
      event: t,
      request: e,
      sameOrigin: r,
      url: n
    });
    let o = a && a.handler;
    const c = e.method;
    if (!o && this._defaultHandlerMap.has(c) && (o = this._defaultHandlerMap.get(c)), !o)
      return;
    let h;
    try {
      h = o.handle({ url: n, request: e, event: t, params: i });
    } catch (l) {
      h = Promise.reject(l);
    }
    const m = a && a.catchHandler;
    return h instanceof Promise && (this._catchHandler || m) && (h = h.catch(async (l) => {
      if (m)
        try {
          return await m.handle({ url: n, request: e, event: t, params: i });
        } catch (N) {
          N instanceof Error && (l = N);
        }
      if (this._catchHandler)
        return this._catchHandler.handle({ url: n, request: e, event: t });
      throw l;
    })), h;
  }
  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {boolean} options.sameOrigin The result of comparing `url.origin`
   *     against the current origin.
   * @param {Request} options.request The request to match.
   * @param {Event} options.event The corresponding event.
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */
  findMatchingRoute({ url: e, sameOrigin: t, request: n, event: r }) {
    const i = this._routes.get(n.method) || [];
    for (const a of i) {
      let o;
      const c = a.match({ url: e, sameOrigin: t, request: n, event: r });
      if (c)
        return o = c, (Array.isArray(o) && o.length === 0 || c.constructor === Object && // eslint-disable-line
        Object.keys(c).length === 0 || typeof c == "boolean") && (o = void 0), { route: a, params: o };
    }
    return {};
  }
  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to associate with this
   * default handler. Each method has its own default.
   */
  setDefaultHandler(e, t = K) {
    this._defaultHandlerMap.set(t, b(e));
  }
  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setCatchHandler(e) {
    this._catchHandler = b(e);
  }
  /**
   * Registers a route with the router.
   *
   * @param {workbox-routing.Route} route The route to register.
   */
  registerRoute(e) {
    this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
  }
  /**
   * Unregisters a route with the router.
   *
   * @param {workbox-routing.Route} route The route to unregister.
   */
  unregisterRoute(e) {
    if (!this._routes.has(e.method))
      throw new u("unregister-route-but-not-found-with-method", {
        method: e.method
      });
    const t = this._routes.get(e.method).indexOf(e);
    if (t > -1)
      this._routes.get(e.method).splice(t, 1);
    else
      throw new u("unregister-route-route-not-registered");
  }
}
let g;
const me = () => (g || (g = new pe(), g.addFetchListener(), g.addCacheListener()), g);
function R(s, e, t) {
  let n;
  if (typeof s == "string") {
    const i = new URL(s, location.href), a = ({ url: o }) => o.href === i.href;
    n = new p(a, e, t);
  } else if (s instanceof RegExp)
    n = new A(s, e, t);
  else if (typeof s == "function")
    n = new p(s, e, t);
  else if (s instanceof p)
    n = s;
  else
    throw new u("unsupported-route-type", {
      moduleName: "workbox-routing",
      funcName: "registerRoute",
      paramName: "capture"
    });
  return me().registerRoute(n), n;
}
function B(s, e) {
  const t = new URL(s);
  for (const n of e)
    t.searchParams.delete(n);
  return t.href;
}
async function we(s, e, t, n) {
  const r = B(e.url, t);
  if (e.url === r)
    return s.match(e, n);
  const i = Object.assign(Object.assign({}, n), { ignoreSearch: !0 }), a = await s.keys(e, i);
  for (const o of a) {
    const c = B(o.url, t);
    if (r === c)
      return s.match(o, n);
  }
}
class ge {
  /**
   * Creates a promise and exposes its resolve and reject functions as methods.
   */
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}
async function _e() {
  for (const s of F)
    await s();
}
function ye(s) {
  return new Promise((e) => setTimeout(e, s));
}
try {
  self["workbox:strategies:7.0.0"] && _();
} catch {
}
function y(s) {
  return typeof s == "string" ? new Request(s) : s;
}
class be {
  /**
   * Creates a new instance associated with the passed strategy and event
   * that's handling the request.
   *
   * The constructor also initializes the state that will be passed to each of
   * the plugins handling this request.
   *
   * @param {workbox-strategies.Strategy} strategy
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params] The return value from the
   *     {@link workbox-routing~matchCallback} (if applicable).
   */
  constructor(e, t) {
    this._cacheKeys = {}, Object.assign(this, t), this.event = t.event, this._strategy = e, this._handlerDeferred = new ge(), this._extendLifetimePromises = [], this._plugins = [...e.plugins], this._pluginStateMap = /* @__PURE__ */ new Map();
    for (const n of this._plugins)
      this._pluginStateMap.set(n, {});
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  /**
   * Fetches a given request (and invokes any applicable plugin callback
   * methods) using the `fetchOptions` (for non-navigation requests) and
   * `plugins` defined on the `Strategy` object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `requestWillFetch()`
   * - `fetchDidSucceed()`
   * - `fetchDidFail()`
   *
   * @param {Request|string} input The URL or request to fetch.
   * @return {Promise<Response>}
   */
  async fetch(e) {
    const { event: t } = this;
    let n = y(e);
    if (n.mode === "navigate" && t instanceof FetchEvent && t.preloadResponse) {
      const a = await t.preloadResponse;
      if (a)
        return a;
    }
    const r = this.hasCallback("fetchDidFail") ? n.clone() : null;
    try {
      for (const a of this.iterateCallbacks("requestWillFetch"))
        n = await a({ request: n.clone(), event: t });
    } catch (a) {
      if (a instanceof Error)
        throw new u("plugin-error-request-will-fetch", {
          thrownErrorMessage: a.message
        });
    }
    const i = n.clone();
    try {
      let a;
      a = await fetch(n, n.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
      for (const o of this.iterateCallbacks("fetchDidSucceed"))
        a = await o({
          event: t,
          request: i,
          response: a
        });
      return a;
    } catch (a) {
      throw r && await this.runCallbacks("fetchDidFail", {
        error: a,
        event: t,
        originalRequest: r.clone(),
        request: i.clone()
      }), a;
    }
  }
  /**
   * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
   * the response generated by `this.fetch()`.
   *
   * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
   * so you do not have to manually call `waitUntil()` on the event.
   *
   * @param {Request|string} input The request or URL to fetch and cache.
   * @return {Promise<Response>}
   */
  async fetchAndCachePut(e) {
    const t = await this.fetch(e), n = t.clone();
    return this.waitUntil(this.cachePut(e, n)), t;
  }
  /**
   * Matches a request from the cache (and invokes any applicable plugin
   * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
   * defined on the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cachedResponseWillByUsed()
   *
   * @param {Request|string} key The Request or URL to use as the cache key.
   * @return {Promise<Response|undefined>} A matching response, if found.
   */
  async cacheMatch(e) {
    const t = y(e);
    let n;
    const { cacheName: r, matchOptions: i } = this._strategy, a = await this.getCacheKey(t, "read"), o = Object.assign(Object.assign({}, i), { cacheName: r });
    n = await caches.match(a, o);
    for (const c of this.iterateCallbacks("cachedResponseWillBeUsed"))
      n = await c({
        cacheName: r,
        matchOptions: i,
        cachedResponse: n,
        request: a,
        event: this.event
      }) || void 0;
    return n;
  }
  /**
   * Puts a request/response pair in the cache (and invokes any applicable
   * plugin callback methods) using the `cacheName` and `plugins` defined on
   * the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cacheWillUpdate()
   * - cacheDidUpdate()
   *
   * @param {Request|string} key The request or URL to use as the cache key.
   * @param {Response} response The response to cache.
   * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
   * not be cached, and `true` otherwise.
   */
  async cachePut(e, t) {
    const n = y(e);
    await ye(0);
    const r = await this.getCacheKey(n, "write");
    if (!t)
      throw new u("cache-put-with-no-response", {
        url: z(r.url)
      });
    const i = await this._ensureResponseSafeToCache(t);
    if (!i)
      return !1;
    const { cacheName: a, matchOptions: o } = this._strategy, c = await self.caches.open(a), h = this.hasCallback("cacheDidUpdate"), m = h ? await we(
      // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
      // feature. Consider into ways to only add this behavior if using
      // precaching.
      c,
      r.clone(),
      ["__WB_REVISION__"],
      o
    ) : null;
    try {
      await c.put(r, h ? i.clone() : i);
    } catch (l) {
      if (l instanceof Error)
        throw l.name === "QuotaExceededError" && await _e(), l;
    }
    for (const l of this.iterateCallbacks("cacheDidUpdate"))
      await l({
        cacheName: a,
        oldResponse: m,
        newResponse: i.clone(),
        request: r,
        event: this.event
      });
    return !0;
  }
  /**
   * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
   * executes any of those callbacks found in sequence. The final `Request`
   * object returned by the last plugin is treated as the cache key for cache
   * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
   * been registered, the passed request is returned unmodified
   *
   * @param {Request} request
   * @param {string} mode
   * @return {Promise<Request>}
   */
  async getCacheKey(e, t) {
    const n = `${e.url} | ${t}`;
    if (!this._cacheKeys[n]) {
      let r = e;
      for (const i of this.iterateCallbacks("cacheKeyWillBeUsed"))
        r = y(await i({
          mode: t,
          request: r,
          event: this.event,
          // params has a type any can't change right now.
          params: this.params
          // eslint-disable-line
        }));
      this._cacheKeys[n] = r;
    }
    return this._cacheKeys[n];
  }
  /**
   * Returns true if the strategy has at least one plugin with the given
   * callback.
   *
   * @param {string} name The name of the callback to check for.
   * @return {boolean}
   */
  hasCallback(e) {
    for (const t of this._strategy.plugins)
      if (e in t)
        return !0;
    return !1;
  }
  /**
   * Runs all plugin callbacks matching the given name, in order, passing the
   * given param object (merged ith the current plugin state) as the only
   * argument.
   *
   * Note: since this method runs all plugins, it's not suitable for cases
   * where the return value of a callback needs to be applied prior to calling
   * the next callback. See
   * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
   * below for how to handle that case.
   *
   * @param {string} name The name of the callback to run within each plugin.
   * @param {Object} param The object to pass as the first (and only) param
   *     when executing each callback. This object will be merged with the
   *     current plugin state prior to callback execution.
   */
  async runCallbacks(e, t) {
    for (const n of this.iterateCallbacks(e))
      await n(t);
  }
  /**
   * Accepts a callback and returns an iterable of matching plugin callbacks,
   * where each callback is wrapped with the current handler state (i.e. when
   * you call each callback, whatever object parameter you pass it will
   * be merged with the plugin's current state).
   *
   * @param {string} name The name fo the callback to run
   * @return {Array<Function>}
   */
  *iterateCallbacks(e) {
    for (const t of this._strategy.plugins)
      if (typeof t[e] == "function") {
        const n = this._pluginStateMap.get(t);
        yield (i) => {
          const a = Object.assign(Object.assign({}, i), { state: n });
          return t[e](a);
        };
      }
  }
  /**
   * Adds a promise to the
   * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
   * of the event event associated with the request being handled (usually a
   * `FetchEvent`).
   *
   * Note: you can await
   * {@link workbox-strategies.StrategyHandler~doneWaiting}
   * to know when all added promises have settled.
   *
   * @param {Promise} promise A promise to add to the extend lifetime promises
   *     of the event that triggered the request.
   */
  waitUntil(e) {
    return this._extendLifetimePromises.push(e), e;
  }
  /**
   * Returns a promise that resolves once all promises passed to
   * {@link workbox-strategies.StrategyHandler~waitUntil}
   * have settled.
   *
   * Note: any work done after `doneWaiting()` settles should be manually
   * passed to an event's `waitUntil()` method (not this handler's
   * `waitUntil()` method), otherwise the service worker thread my be killed
   * prior to your work completing.
   */
  async doneWaiting() {
    let e;
    for (; e = this._extendLifetimePromises.shift(); )
      await e;
  }
  /**
   * Stops running the strategy and immediately resolves any pending
   * `waitUntil()` promises.
   */
  destroy() {
    this._handlerDeferred.resolve(null);
  }
  /**
   * This method will call cacheWillUpdate on the available plugins (or use
   * status === 200) to determine if the Response is safe and valid to cache.
   *
   * @param {Request} options.request
   * @param {Response} options.response
   * @return {Promise<Response|undefined>}
   *
   * @private
   */
  async _ensureResponseSafeToCache(e) {
    let t = e, n = !1;
    for (const r of this.iterateCallbacks("cacheWillUpdate"))
      if (t = await r({
        request: this.request,
        response: t,
        event: this.event
      }) || void 0, n = !0, !t)
        break;
    return n || t && t.status !== 200 && (t = void 0), t;
  }
}
class O {
  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   */
  constructor(e = {}) {
    this.cacheName = q.getRuntimeName(e.cacheName), this.plugins = e.plugins || [], this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions;
  }
  /**
   * Perform a request strategy and returns a `Promise` that will resolve with
   * a `Response`, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a Workbox
   * {@link workbox-routing.Route}, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `FetchEvent`
   * listener by passing it to `event.respondWith()`.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   */
  handle(e) {
    const [t] = this.handleAll(e);
    return t;
  }
  /**
   * Similar to {@link workbox-strategies.Strategy~handle}, but
   * instead of just returning a `Promise` that resolves to a `Response` it
   * it will return an tuple of `[response, done]` promises, where the former
   * (`response`) is equivalent to what `handle()` returns, and the latter is a
   * Promise that will resolve once any promises that were added to
   * `event.waitUntil()` as part of performing the strategy have completed.
   *
   * You can await the `done` promise to ensure any extra work performed by
   * the strategy (usually caching responses) completes successfully.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   * @return {Array<Promise>} A tuple of [response, done]
   *     promises that can be used to determine when the response resolves as
   *     well as when the handler has completed all its work.
   */
  handleAll(e) {
    e instanceof FetchEvent && (e = {
      event: e,
      request: e.request
    });
    const t = e.event, n = typeof e.request == "string" ? new Request(e.request) : e.request, r = "params" in e ? e.params : void 0, i = new be(this, { event: t, request: n, params: r }), a = this._getResponse(i, n, t), o = this._awaitComplete(a, i, n, t);
    return [a, o];
  }
  async _getResponse(e, t, n) {
    await e.runCallbacks("handlerWillStart", { event: n, request: t });
    let r;
    try {
      if (r = await this._handle(t, e), !r || r.type === "error")
        throw new u("no-response", { url: t.url });
    } catch (i) {
      if (i instanceof Error) {
        for (const a of e.iterateCallbacks("handlerDidError"))
          if (r = await a({ error: i, event: n, request: t }), r)
            break;
      }
      if (!r)
        throw i;
    }
    for (const i of e.iterateCallbacks("handlerWillRespond"))
      r = await i({ event: n, request: t, response: r });
    return r;
  }
  async _awaitComplete(e, t, n, r) {
    let i, a;
    try {
      i = await e;
    } catch {
    }
    try {
      await t.runCallbacks("handlerDidRespond", {
        event: r,
        request: n,
        response: i
      }), await t.doneWaiting();
    } catch (o) {
      o instanceof Error && (a = o);
    }
    if (await t.runCallbacks("handlerDidComplete", {
      event: r,
      request: n,
      response: i,
      error: a
    }), t.destroy(), a)
      throw a;
  }
}
class V extends O {
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    let n = await t.cacheMatch(e), r;
    if (!n)
      try {
        n = await t.fetchAndCachePut(e);
      } catch (i) {
        i instanceof Error && (r = i);
      }
    if (!n)
      throw new u("no-response", { url: e.url, error: r });
    return n;
  }
}
const Q = {
  /**
   * Returns a valid response (to allow caching) if the status is 200 (OK) or
   * 0 (opaque).
   *
   * @param {Object} options
   * @param {Response} options.response
   * @return {Response|null}
   *
   * @private
   */
  cacheWillUpdate: async ({ response: s }) => s.status === 200 || s.status === 0 ? s : null
};
class xe extends O {
  /**
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   * @param {number} [options.networkTimeoutSeconds] If set, any network requests
   * that fail to respond within the timeout will fallback to the cache.
   *
   * This option can be used to combat
   * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
   * scenarios.
   */
  constructor(e = {}) {
    super(e), this.plugins.some((t) => "cacheWillUpdate" in t) || this.plugins.unshift(Q), this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0;
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    const n = [], r = [];
    let i;
    if (this._networkTimeoutSeconds) {
      const { id: c, promise: h } = this._getTimeoutPromise({ request: e, logs: n, handler: t });
      i = c, r.push(h);
    }
    const a = this._getNetworkPromise({
      timeoutId: i,
      request: e,
      logs: n,
      handler: t
    });
    r.push(a);
    const o = await t.waitUntil((async () => await t.waitUntil(Promise.race(r)) || // If Promise.race() resolved with null, it might be due to a network
    // timeout + a cache miss. If that were to happen, we'd rather wait until
    // the networkPromise resolves instead of returning null.
    // Note that it's fine to await an already-resolved promise, so we don't
    // have to check to see if it's still "in flight".
    await a)());
    if (!o)
      throw new u("no-response", { url: e.url });
    return o;
  }
  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs array
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  _getTimeoutPromise({ request: e, logs: t, handler: n }) {
    let r;
    return {
      promise: new Promise((a) => {
        r = setTimeout(async () => {
          a(await n.cacheMatch(e));
        }, this._networkTimeoutSeconds * 1e3);
      }),
      id: r
    };
  }
  /**
   * @param {Object} options
   * @param {number|undefined} options.timeoutId
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs Array.
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getNetworkPromise({ timeoutId: e, request: t, logs: n, handler: r }) {
    let i, a;
    try {
      a = await r.fetchAndCachePut(t);
    } catch (o) {
      o instanceof Error && (i = o);
    }
    return e && clearTimeout(e), (i || !a) && (a = await r.cacheMatch(t)), a;
  }
}
class Ee extends O {
  /**
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   */
  constructor(e = {}) {
    super(e), this.plugins.some((t) => "cacheWillUpdate" in t) || this.plugins.unshift(Q);
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    const n = t.fetchAndCachePut(e).catch(() => {
    });
    t.waitUntil(n);
    let r = await t.cacheMatch(e), i;
    if (!r)
      try {
        r = await n;
      } catch (a) {
        a instanceof Error && (i = a);
      }
    if (!r)
      throw new u("no-response", { url: e.url, error: i });
    return r;
  }
}
self.__WB_DISABLE_DEV_LOGS = !0;
const Re = new p(
  ({ request: s, sameOrigin: e }) => {
    const t = !e, n = s.destination === "image", r = s.url.includes("/avatars/"), i = s.url.includes("/emoji/");
    return t && n && (r || i);
  },
  new V({
    cacheName: "remote-images",
    plugins: [
      new E({
        maxEntries: 50,
        maxAgeSeconds: 3 * 24 * 60 * 60,
        // 3 days
        purgeOnQuotaError: !0
      }),
      new x({
        statuses: [0, 200]
      })
    ]
  })
);
R(Re);
const De = new p(
  ({ request: s, sameOrigin: e }) => {
    const t = s.url.includes("/icons/");
    return e && t;
  },
  new V({
    cacheName: "icons",
    plugins: [
      new E({
        maxEntries: 50,
        maxAgeSeconds: 3 * 24 * 60 * 60,
        // 3 days
        purgeOnQuotaError: !0
      }),
      new x({
        statuses: [0, 200]
      })
    ]
  })
);
R(De);
const Ce = new A(
  /^https?:\/\/[^\/]+\/api\/v\d+\/(instance|custom_emojis|preferences|lists\/\d+|announcements)$/,
  new Ee({
    cacheName: "api-extended",
    plugins: [
      new E({
        maxAgeSeconds: 24 * 60 * 60
        // 1 day
      }),
      new x({
        statuses: [0, 200]
      })
    ]
  })
);
R(Ce);
const ke = new A(
  // Matches:
  // - statuses/:id/context - some contexts are really huge
  /^https?:\/\/[^\/]+\/api\/v\d+\/(statuses\/\d+\/context)/,
  new xe({
    cacheName: "api",
    networkTimeoutSeconds: 5,
    plugins: [
      new E({
        maxAgeSeconds: 5 * 60
        // 5 minutes
      }),
      new x({
        statuses: [0, 200]
      })
    ]
  })
);
R(ke);
//# sourceMappingURL=sw.js.map
