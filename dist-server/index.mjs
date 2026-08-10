var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/extend/index.js
var require_extend = __commonJS({
  "node_modules/extend/index.js"(exports, module) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;
    var defineProperty = Object.defineProperty;
    var gOPD = Object.getOwnPropertyDescriptor;
    var isArray = function isArray2(arr) {
      if (typeof Array.isArray === "function") {
        return Array.isArray(arr);
      }
      return toStr.call(arr) === "[object Array]";
    };
    var isPlainObject3 = function isPlainObject4(obj) {
      if (!obj || toStr.call(obj) !== "[object Object]") {
        return false;
      }
      var hasOwnConstructor = hasOwn.call(obj, "constructor");
      var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
      if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
      }
      var key2;
      for (key2 in obj) {
      }
      return typeof key2 === "undefined" || hasOwn.call(obj, key2);
    };
    var setProperty = function setProperty2(target, options) {
      if (defineProperty && options.name === "__proto__") {
        defineProperty(target, options.name, {
          enumerable: true,
          configurable: true,
          value: options.newValue,
          writable: true
        });
      } else {
        target[options.name] = options.newValue;
      }
    };
    var getProperty = function getProperty2(obj, name) {
      if (name === "__proto__") {
        if (!hasOwn.call(obj, name)) {
          return void 0;
        } else if (gOPD) {
          return gOPD(obj, name).value;
        }
      }
      return obj[name];
    };
    module.exports = function extend2() {
      var options, name, src, copy, copyIsArray, clone;
      var target = arguments[0];
      var i = 1;
      var length = arguments.length;
      var deep = false;
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (target == null || typeof target !== "object" && typeof target !== "function") {
        target = {};
      }
      for (; i < length; ++i) {
        options = arguments[i];
        if (options != null) {
          for (name in options) {
            src = getProperty(target, name);
            copy = getProperty(options, name);
            if (target !== copy) {
              if (deep && copy && (isPlainObject3(copy) || (copyIsArray = isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && isArray(src) ? src : [];
                } else {
                  clone = src && isPlainObject3(src) ? src : {};
                }
                setProperty(target, { name, newValue: extend2(deep, clone, copy) });
              } else if (typeof copy !== "undefined") {
                setProperty(target, { name, newValue: copy });
              }
            }
          }
        }
      }
      return target;
    };
  }
});

// server/index.ts
import { createServer } from "node:http";
import { join as join2, extname, normalize as normalize2, dirname as dirname2 } from "node:path";
import { readFile as readFile3, stat as stat2 } from "node:fs/promises";
import { fileURLToPath as fileURLToPath2 } from "node:url";

// node_modules/ufo/dist/index.mjs
var r = String.fromCharCode;
var ENC_SLASH_RE = /%2f/gi;
function decode(text2 = "") {
  try {
    return decodeURIComponent("" + text2);
  } catch {
    return "" + text2;
  }
}
function decodePath(text2) {
  return decode(text2.replace(ENC_SLASH_RE, "%252F"));
}
var PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
var PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
var PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
var TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
var JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s2] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s2.length > 0 ? `?${s2.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s2] = path.split("?");
  return s0 + "/" + (s2.length > 0 ? `?${s2.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
var protocolRelative = /* @__PURE__ */ Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search: search2, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search: search2,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search2 = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search: search2,
    hash
  };
}

// node_modules/cookie-es/dist/index.mjs
var NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = options || {};
  const dec = opt.decode || decode2;
  let index2 = 0;
  while (index2 < str.length) {
    const eqIdx = str.indexOf("=", index2);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index2);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index2 = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key2 = str.slice(index2, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key2)) {
      index2 = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key2]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key2] = tryDecode(val, dec);
    }
    index2 = endIdx + 1;
  }
  return obj;
}
function decode2(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode22) {
  try {
    return decode22(str);
  } catch {
    return str;
  }
}
var fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}
function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

// node_modules/radix3/dist/index.mjs
var NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};
function createRouter(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p2) => options.strictTrailingSlash ? p2 : p2.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}
function toRouteMatcher(router2) {
  const table = _routerNodeToTable("", router2.ctx.rootNode);
  return _createMatcher(table, router2.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key2, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key2 || path.startsWith(key2 + "/")) {
      matches.push(value);
    }
  }
  for (const [key2, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key2 + "/")) {
      const subPath = "/" + path.slice(key2.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

// node_modules/defu/dist/defu.mjs
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key2 of Object.keys(baseObject)) {
    if (key2 === "__proto__" || key2 === "constructor") {
      continue;
    }
    const value = baseObject[key2];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key2, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key2])) {
      object[key2] = [...value, ...object[key2]];
    } else if (isPlainObject(value) && isPlainObject(object[key2])) {
      object[key2] = _defu(
        value,
        object[key2],
        (namespace ? `${namespace}.` : "") + key2.toString(),
        merger
      );
    } else {
      object[key2] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p2, c) => _defu(p2, c, "", merger), {})
  );
}
var defu = createDefu();
var defuFn = createDefu((object, key2, currentValue) => {
  if (object[key2] !== void 0 && typeof currentValue === "function") {
    object[key2] = currentValue(object[key2]);
    return true;
  }
});
var defuArrayFn = createDefu((object, key2, currentValue) => {
  if (Array.isArray(object[key2]) && typeof currentValue === "function") {
    object[key2] = currentValue(object[key2]);
    return true;
  }
});

// node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key2, value) {
  if (key2 === "__proto__" || key2 === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key2);
    return;
  }
  return value;
}
function warnKeyDropped(key2) {
  console.warn(`[destr] Dropping "${key2}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

// node_modules/h3/dist/index.mjs
function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}
var H3Error = class extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
};
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key2 in params) {
      params[key2] = decode(params[key2]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (allowHead && event.method === "HEAD") {
    return true;
  }
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected, allowHead)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
var RawBodySymbol = /* @__PURE__ */ Symbol.for("h3RawBody");
var ParsedBodySymbol = /* @__PURE__ */ Symbol.for("h3ParsedBody");
var PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body3 = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body3, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body3);
  } else if (contentType.startsWith("text/")) {
    parsed = body3;
  } else {
    parsed = _parseJSON(body3, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function _parseJSON(body3 = "", strict) {
  if (!body3) {
    return void 0;
  }
  try {
    return destr(body3, { strict });
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body3) {
  const form = new URLSearchParams(body3);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key2, value] of form.entries()) {
    if (hasProp(parsedForm, key2)) {
      if (!Array.isArray(parsedForm[key2])) {
        parsedForm[key2] = [parsedForm[key2]];
      }
      parsedForm[key2].push(value);
    } else {
      parsedForm[key2] = value;
    }
  }
  return parsedForm;
}
var MIMES = {
  html: "text/html",
  json: "application/json"
};
var DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}
function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key2 = getDistinctCookieKey(parsed.name, parsed);
    if (key2 === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}
var defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text2) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text2) {
    event.node.res.statusMessage = sanitizeStatusMessage(text2);
  }
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
var setHeader = setResponseHeader;
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key2, value] of response.headers) {
    if (key2 === "set-cookie") {
      event.node.res.appendHeader(key2, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key2, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}
var H3Event = class {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
};
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}
function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body3 = await handler(event);
  const response = { body: body3 };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
var eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r2) => {
        const handler2 = r2.default || r2;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r2.default || r2) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r2) => r2.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
var lazyEventHandler = defineLazyEventHandler;
var H3Headers = globalThis.Headers;
var H3Response = globalThis.Response;
function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app2 = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app2, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app2;
}
function use(app2, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app2, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app2, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app2.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app2.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app2.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app2;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}
var RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter2(opts = {}) {
  const _router = createRouter({});
  const routes = {};
  let _matcher;
  const router2 = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router2;
  };
  router2.use = router2.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router2[method] = (path, handle2) => router2.add(path, handle2, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router2.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router2.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router2;
}
function toNodeListener(app2) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app2.handler(event);
    } catch (_error) {
      const error = createError(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app2.options.onError) {
        await app2.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app2.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app2.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app2.options.debug);
      if (app2.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app2.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

// server/utils/auth.ts
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
var AUTH_COOKIE = "lunatix-auth";
function adminPassword() {
  const file = process.env.ADMIN_PASSWORD_FILE;
  if (file) {
    try {
      return readFileSync(file, "utf8").trim();
    } catch {
    }
  }
  return process.env.ADMIN_PASSWORD || "changeme";
}
function sign(value) {
  return createHmac("sha256", adminPassword()).update(value).digest("hex");
}
function setAuthCookie(event) {
  const value = `true.${sign("true")}`;
  setCookie(event, AUTH_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}
function clearAuthCookie(event) {
  deleteCookie(event, AUTH_COOKIE, { path: "/" });
}
function isAuthed(event) {
  const cookie = getCookie(event, AUTH_COOKIE) || "";
  const [value, signature] = cookie.split(".");
  if (value !== "true" || !signature) {
    return false;
  }
  const expected = Buffer.from(sign("true"));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length) {
    return false;
  }
  return timingSafeEqual(expected, actual);
}

// server/utils/notes.ts
import { readdir, readFile, writeFile, rename, unlink, mkdir, stat } from "node:fs/promises";
import { join, relative, dirname, basename } from "node:path";

// node_modules/bail/index.js
function bail(error) {
  if (error) {
    throw error;
  }
}

// node_modules/unified/lib/index.js
var import_extend = __toESM(require_extend(), 1);

// node_modules/devlop/lib/default.js
function ok() {
}

// node_modules/is-plain-obj/index.js
function isPlainObject2(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}

// node_modules/trough/lib/index.js
function trough() {
  const fns = [];
  const pipeline = { run, use: use2 };
  return pipeline;
  function run(...values) {
    let middlewareIndex = -1;
    const callback = values.pop();
    if (typeof callback !== "function") {
      throw new TypeError("Expected function as last argument, not " + callback);
    }
    next2(null, ...values);
    function next2(error, ...output) {
      const fn = fns[++middlewareIndex];
      let index2 = -1;
      if (error) {
        callback(error);
        return;
      }
      while (++index2 < values.length) {
        if (output[index2] === null || output[index2] === void 0) {
          output[index2] = values[index2];
        }
      }
      values = output;
      if (fn) {
        wrap(fn, next2)(...output);
      } else {
        callback(null, ...output);
      }
    }
  }
  function use2(middelware) {
    if (typeof middelware !== "function") {
      throw new TypeError(
        "Expected `middelware` to be a function, not " + middelware
      );
    }
    fns.push(middelware);
    return pipeline;
  }
}
function wrap(middleware, callback) {
  let called;
  return wrapped;
  function wrapped(...parameters) {
    const fnExpectsCallback = middleware.length > parameters.length;
    let result;
    if (fnExpectsCallback) {
      parameters.push(done);
    }
    try {
      result = middleware.apply(this, parameters);
    } catch (error) {
      const exception = (
        /** @type {Error} */
        error
      );
      if (fnExpectsCallback && called) {
        throw exception;
      }
      return done(exception);
    }
    if (!fnExpectsCallback) {
      if (result && result.then && typeof result.then === "function") {
        result.then(then, done);
      } else if (result instanceof Error) {
        done(result);
      } else {
        then(result);
      }
    }
  }
  function done(error, ...output) {
    if (!called) {
      called = true;
      callback(error, ...output);
    }
  }
  function then(value) {
    done(null, value);
  }
}

// node_modules/unist-util-stringify-position/lib/index.js
function stringifyPosition(value) {
  if (!value || typeof value !== "object") {
    return "";
  }
  if ("position" in value || "type" in value) {
    return position(value.position);
  }
  if ("start" in value || "end" in value) {
    return position(value);
  }
  if ("line" in value || "column" in value) {
    return point(value);
  }
  return "";
}
function point(point2) {
  return index(point2 && point2.line) + ":" + index(point2 && point2.column);
}
function position(pos) {
  return point(pos && pos.start) + "-" + point(pos && pos.end);
}
function index(value) {
  return value && typeof value === "number" ? value : 1;
}

// node_modules/vfile-message/lib/index.js
var VFileMessage = class extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(causeOrReason, optionsOrParentOrPlace, origin) {
    super();
    if (typeof optionsOrParentOrPlace === "string") {
      origin = optionsOrParentOrPlace;
      optionsOrParentOrPlace = void 0;
    }
    let reason = "";
    let options = {};
    let legacyCause = false;
    if (optionsOrParentOrPlace) {
      if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace };
      } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace };
      } else if ("type" in optionsOrParentOrPlace) {
        options = {
          ancestors: [optionsOrParentOrPlace],
          place: optionsOrParentOrPlace.position
        };
      } else {
        options = { ...optionsOrParentOrPlace };
      }
    }
    if (typeof causeOrReason === "string") {
      reason = causeOrReason;
    } else if (!options.cause && causeOrReason) {
      legacyCause = true;
      reason = causeOrReason.message;
      options.cause = causeOrReason;
    }
    if (!options.ruleId && !options.source && typeof origin === "string") {
      const index2 = origin.indexOf(":");
      if (index2 === -1) {
        options.ruleId = origin;
      } else {
        options.source = origin.slice(0, index2);
        options.ruleId = origin.slice(index2 + 1);
      }
    }
    if (!options.place && options.ancestors && options.ancestors) {
      const parent = options.ancestors[options.ancestors.length - 1];
      if (parent) {
        options.place = parent.position;
      }
    }
    const start = options.place && "start" in options.place ? options.place.start : options.place;
    this.ancestors = options.ancestors || void 0;
    this.cause = options.cause || void 0;
    this.column = start ? start.column : void 0;
    this.fatal = void 0;
    this.file = "";
    this.message = reason;
    this.line = start ? start.line : void 0;
    this.name = stringifyPosition(options.place) || "1:1";
    this.place = options.place || void 0;
    this.reason = this.message;
    this.ruleId = options.ruleId || void 0;
    this.source = options.source || void 0;
    this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
    this.actual = void 0;
    this.expected = void 0;
    this.note = void 0;
    this.url = void 0;
  }
};
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.column = void 0;
VFileMessage.prototype.line = void 0;
VFileMessage.prototype.ancestors = void 0;
VFileMessage.prototype.cause = void 0;
VFileMessage.prototype.fatal = void 0;
VFileMessage.prototype.place = void 0;
VFileMessage.prototype.ruleId = void 0;
VFileMessage.prototype.source = void 0;

// node_modules/vfile/lib/minpath.js
import { default as default2 } from "node:path";

// node_modules/vfile/lib/minproc.js
import { default as default3 } from "node:process";

// node_modules/vfile/lib/minurl.js
import { fileURLToPath } from "node:url";

// node_modules/vfile/lib/minurl.shared.js
function isUrl(fileUrlOrPath) {
  return Boolean(
    fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && // @ts-expect-error: indexing is fine.
    fileUrlOrPath.auth === void 0
  );
}

// node_modules/vfile/lib/index.js
var order = (
  /** @type {const} */
  [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ]
);
var VFile = class {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Uint8Array` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(value) {
    let options;
    if (!value) {
      options = {};
    } else if (isUrl(value)) {
      options = { path: value };
    } else if (typeof value === "string" || isUint8Array(value)) {
      options = { value };
    } else {
      options = value;
    }
    this.cwd = "cwd" in options ? "" : default3.cwd();
    this.data = {};
    this.history = [];
    this.messages = [];
    this.value;
    this.map;
    this.result;
    this.stored;
    let index2 = -1;
    while (++index2 < order.length) {
      const field2 = order[index2];
      if (field2 in options && options[field2] !== void 0 && options[field2] !== null) {
        this[field2] = field2 === "history" ? [...options[field2]] : options[field2];
      }
    }
    let field;
    for (field in options) {
      if (!order.includes(field)) {
        this[field] = options[field];
      }
    }
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   *
   * @returns {string | undefined}
   *   Basename.
   */
  get basename() {
    return typeof this.path === "string" ? default2.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} basename
   *   Basename.
   * @returns {undefined}
   *   Nothing.
   */
  set basename(basename2) {
    assertNonEmpty(basename2, "basename");
    assertPart(basename2, "basename");
    this.path = default2.join(this.dirname || "", basename2);
  }
  /**
   * Get the parent path (example: `'~'`).
   *
   * @returns {string | undefined}
   *   Dirname.
   */
  get dirname() {
    return typeof this.path === "string" ? default2.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} dirname
   *   Dirname.
   * @returns {undefined}
   *   Nothing.
   */
  set dirname(dirname3) {
    assertPath(this.basename, "dirname");
    this.path = default2.join(dirname3 || "", this.basename);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   *
   * @returns {string | undefined}
   *   Extname.
   */
  get extname() {
    return typeof this.path === "string" ? default2.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   *
   * @param {string | undefined} extname
   *   Extname.
   * @returns {undefined}
   *   Nothing.
   */
  set extname(extname2) {
    assertPart(extname2, "extname");
    assertPath(this.dirname, "extname");
    if (extname2) {
      if (extname2.codePointAt(0) !== 46) {
        throw new Error("`extname` must start with `.`");
      }
      if (extname2.includes(".", 1)) {
        throw new Error("`extname` cannot contain multiple dots");
      }
    }
    this.path = default2.join(this.dirname, this.stem + (extname2 || ""));
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   *   Path.
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {URL | string} path
   *   Path.
   * @returns {undefined}
   *   Nothing.
   */
  set path(path) {
    if (isUrl(path)) {
      path = fileURLToPath(path);
    }
    assertNonEmpty(path, "path");
    if (this.path !== path) {
      this.history.push(path);
    }
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   *
   * @returns {string | undefined}
   *   Stem.
   */
  get stem() {
    return typeof this.path === "string" ? default2.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   *
   * @param {string} stem
   *   Stem.
   * @returns {undefined}
   *   Nothing.
   */
  set stem(stem) {
    assertNonEmpty(stem, "stem");
    assertPart(stem, "stem");
    this.path = default2.join(this.dirname || "", stem + (this.extname || ""));
  }
  // Normal prototypal methods.
  /**
   * Create a fatal message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `true` (error; file not usable)
   * and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {never}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Never.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
    message.fatal = true;
    throw message;
  }
  /**
   * Create an info message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `undefined` (info; change
   * likely not needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
    message.fatal = void 0;
    return message;
  }
  /**
   * Create a message for `reason` associated with the file.
   *
   * The `fatal` field of the message is set to `false` (warning; change may be
   * needed) and the `file` field is set to the current file path.
   * The message is added to the `messages` field on `file`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {MessageOptions | null | undefined} [options]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns {VFileMessage}
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = new VFileMessage(
      // @ts-expect-error: the overloads are fine.
      causeOrReason,
      optionsOrParentOrPlace,
      origin
    );
    if (this.path) {
      message.name = this.path + ":" + message.name;
      message.file = this.path;
    }
    message.fatal = false;
    this.messages.push(message);
    return message;
  }
  /**
   * Serialize the file.
   *
   * > **Note**: which encodings are supported depends on the engine.
   * > For info on Node.js, see:
   * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
   *
   * @param {string | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Uint8Array`
   *   (default: `'utf-8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(encoding) {
    if (this.value === void 0) {
      return "";
    }
    if (typeof this.value === "string") {
      return this.value;
    }
    const decoder = new TextDecoder(encoding || void 0);
    return decoder.decode(this.value);
  }
};
function assertPart(part, name) {
  if (part && part.includes(default2.sep)) {
    throw new Error(
      "`" + name + "` cannot be a path: did not expect `" + default2.sep + "`"
    );
  }
}
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error("`" + name + "` cannot be empty");
  }
}
function assertPath(path, name) {
  if (!path) {
    throw new Error("Setting `" + name + "` requires `path` to be set too");
  }
}
function isUint8Array(value) {
  return Boolean(
    value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
  );
}

// node_modules/unified/lib/callable-instance.js
var CallableInstance = (
  /**
   * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
   */
  /** @type {unknown} */
  /**
   * @this {Function}
   * @param {string | symbol} property
   * @returns {(...parameters: Array<unknown>) => unknown}
   */
  (function(property) {
    const self = this;
    const constr = self.constructor;
    const proto = (
      /** @type {Record<string | symbol, Function>} */
      // Prototypes do exist.
      // type-coverage:ignore-next-line
      constr.prototype
    );
    const value = proto[property];
    const apply = function() {
      return value.apply(apply, arguments);
    };
    Object.setPrototypeOf(apply, proto);
    return apply;
  })
);

// node_modules/unified/lib/index.js
var own = {}.hasOwnProperty;
var Processor = class _Processor extends CallableInstance {
  /**
   * Create a processor.
   */
  constructor() {
    super("copy");
    this.Compiler = void 0;
    this.Parser = void 0;
    this.attachers = [];
    this.compiler = void 0;
    this.freezeIndex = -1;
    this.frozen = void 0;
    this.namespace = {};
    this.parser = void 0;
    this.transformers = trough();
  }
  /**
   * Copy a processor.
   *
   * @deprecated
   *   This is a private internal method and should not be used.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   New *unfrozen* processor ({@linkcode Processor}) that is
   *   configured to work the same as its ancestor.
   *   When the descendant processor is configured in the future it does not
   *   affect the ancestral processor.
   */
  copy() {
    const destination = (
      /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
      new _Processor()
    );
    let index2 = -1;
    while (++index2 < this.attachers.length) {
      const attacher = this.attachers[index2];
      destination.use(...attacher);
    }
    destination.data((0, import_extend.default)(true, {}, this.namespace));
    return destination;
  }
  /**
   * Configure the processor with info available to all plugins.
   * Information is stored in an object.
   *
   * Typically, options can be given to a specific plugin, but sometimes it
   * makes sense to have information shared with several plugins.
   * For example, a list of HTML elements that are self-closing, which is
   * needed during all phases.
   *
   * > **Note**: setting information cannot occur on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * > **Note**: to register custom data in TypeScript, augment the
   * > {@linkcode Data} interface.
   *
   * @example
   *   This example show how to get and set info:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   const processor = unified().data('alpha', 'bravo')
   *
   *   processor.data('alpha') // => 'bravo'
   *
   *   processor.data() // => {alpha: 'bravo'}
   *
   *   processor.data({charlie: 'delta'})
   *
   *   processor.data() // => {charlie: 'delta'}
   *   ```
   *
   * @template {keyof Data} Key
   *
   * @overload
   * @returns {Data}
   *
   * @overload
   * @param {Data} dataset
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Key} key
   * @returns {Data[Key]}
   *
   * @overload
   * @param {Key} key
   * @param {Data[Key]} value
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @param {Data | Key} [key]
   *   Key to get or set, or entire dataset to set, or nothing to get the
   *   entire dataset (optional).
   * @param {Data[Key]} [value]
   *   Value to set (optional).
   * @returns {unknown}
   *   The current processor when setting, the value at `key` when getting, or
   *   the entire dataset when getting without key.
   */
  data(key2, value) {
    if (typeof key2 === "string") {
      if (arguments.length === 2) {
        assertUnfrozen("data", this.frozen);
        this.namespace[key2] = value;
        return this;
      }
      return own.call(this.namespace, key2) && this.namespace[key2] || void 0;
    }
    if (key2) {
      assertUnfrozen("data", this.frozen);
      this.namespace = key2;
      return this;
    }
    return this.namespace;
  }
  /**
   * Freeze a processor.
   *
   * Frozen processors are meant to be extended and not to be configured
   * directly.
   *
   * When a processor is frozen it cannot be unfrozen.
   * New processors working the same way can be created by calling the
   * processor.
   *
   * It’s possible to freeze processors explicitly by calling `.freeze()`.
   * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
   * `.stringify()`, `.process()`, or `.processSync()` are called.
   *
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   The current processor.
   */
  freeze() {
    if (this.frozen) {
      return this;
    }
    const self = (
      /** @type {Processor} */
      /** @type {unknown} */
      this
    );
    while (++this.freezeIndex < this.attachers.length) {
      const [attacher, ...options] = this.attachers[this.freezeIndex];
      if (options[0] === false) {
        continue;
      }
      if (options[0] === true) {
        options[0] = void 0;
      }
      const transformer = attacher.call(self, ...options);
      if (typeof transformer === "function") {
        this.transformers.use(transformer);
      }
    }
    this.frozen = true;
    this.freezeIndex = Number.POSITIVE_INFINITY;
    return this;
  }
  /**
   * Parse text to a syntax tree.
   *
   * > **Note**: `parse` freezes the processor if not already *frozen*.
   *
   * > **Note**: `parse` performs the parse phase, not the run phase or other
   * > phases.
   *
   * @param {Compatible | undefined} [file]
   *   file to parse (optional); typically `string` or `VFile`; any value
   *   accepted as `x` in `new VFile(x)`.
   * @returns {ParseTree extends undefined ? Node : ParseTree}
   *   Syntax tree representing `file`.
   */
  parse(file) {
    this.freeze();
    const realFile = vfile(file);
    const parser = this.parser || this.Parser;
    assertParser("parse", parser);
    return parser(String(realFile), realFile);
  }
  /**
   * Process the given file as configured on the processor.
   *
   * > **Note**: `process` freezes the processor if not already *frozen*.
   *
   * > **Note**: `process` performs the parse, run, and stringify phases.
   *
   * @overload
   * @param {Compatible | undefined} file
   * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
   * @returns {undefined}
   *
   * @overload
   * @param {Compatible | undefined} [file]
   * @returns {Promise<VFileWithOutput<CompileResult>>}
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`]; any value accepted as
   *   `x` in `new VFile(x)`.
   * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
   *   Callback (optional).
   * @returns {Promise<VFile> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise a promise, rejected with a fatal error or resolved with the
   *   processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  process(file, done) {
    const self = this;
    this.freeze();
    assertParser("process", this.parser || this.Parser);
    assertCompiler("process", this.compiler || this.Compiler);
    return done ? executor(void 0, done) : new Promise(executor);
    function executor(resolve, reject) {
      const realFile = vfile(file);
      const parseTree = (
        /** @type {HeadTree extends undefined ? Node : HeadTree} */
        /** @type {unknown} */
        self.parse(realFile)
      );
      self.run(parseTree, realFile, function(error, tree, file2) {
        if (error || !tree || !file2) {
          return realDone(error);
        }
        const compileTree = (
          /** @type {CompileTree extends undefined ? Node : CompileTree} */
          /** @type {unknown} */
          tree
        );
        const compileResult = self.stringify(compileTree, file2);
        if (looksLikeAValue(compileResult)) {
          file2.value = compileResult;
        } else {
          file2.result = compileResult;
        }
        realDone(
          error,
          /** @type {VFileWithOutput<CompileResult>} */
          file2
        );
      });
      function realDone(error, file2) {
        if (error || !file2) {
          reject(error);
        } else if (resolve) {
          resolve(file2);
        } else {
          ok(done, "`done` is defined if `resolve` is not");
          done(void 0, file2);
        }
      }
    }
  }
  /**
   * Process the given file as configured on the processor.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `processSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `processSync` performs the parse, run, and stringify phases.
   *
   * @param {Compatible | undefined} [file]
   *   File (optional); typically `string` or `VFile`; any value accepted as
   *   `x` in `new VFile(x)`.
   * @returns {VFileWithOutput<CompileResult>}
   *   The processed file.
   *
   *   The parsed, transformed, and compiled value is available at
   *   `file.value` (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most
   *   > compilers return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  processSync(file) {
    let complete = false;
    let result;
    this.freeze();
    assertParser("processSync", this.parser || this.Parser);
    assertCompiler("processSync", this.compiler || this.Compiler);
    this.process(file, realDone);
    assertDone("processSync", "process", complete);
    ok(result, "we either bailed on an error or have a tree");
    return result;
    function realDone(error, file2) {
      complete = true;
      bail(error);
      result = file2;
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * > **Note**: `run` freezes the processor if not already *frozen*.
   *
   * > **Note**: `run` performs the run phase, not other phases.
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} file
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
   * @returns {undefined}
   *
   * @overload
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   * @param {Compatible | undefined} [file]
   * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {(
   *   RunCallback<TailTree extends undefined ? Node : TailTree> |
   *   Compatible
   * )} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
   *   Callback (optional).
   * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
   *   Nothing if `done` is given.
   *   Otherwise, a promise rejected with a fatal error or resolved with the
   *   transformed tree.
   */
  run(tree, file, done) {
    assertNode(tree);
    this.freeze();
    const transformers = this.transformers;
    if (!done && typeof file === "function") {
      done = file;
      file = void 0;
    }
    return done ? executor(void 0, done) : new Promise(executor);
    function executor(resolve, reject) {
      ok(
        typeof file !== "function",
        "`file` can\u2019t be a `done` anymore, we checked"
      );
      const realFile = vfile(file);
      transformers.run(tree, realFile, realDone);
      function realDone(error, outputTree, file2) {
        const resultingTree = (
          /** @type {TailTree extends undefined ? Node : TailTree} */
          outputTree || tree
        );
        if (error) {
          reject(error);
        } else if (resolve) {
          resolve(resultingTree);
        } else {
          ok(done, "`done` is defined if `resolve` is not");
          done(void 0, resultingTree, file2);
        }
      }
    }
  }
  /**
   * Run *transformers* on a syntax tree.
   *
   * An error is thrown if asynchronous transforms are configured.
   *
   * > **Note**: `runSync` freezes the processor if not already *frozen*.
   *
   * > **Note**: `runSync` performs the run phase, not other phases.
   *
   * @param {HeadTree extends undefined ? Node : HeadTree} tree
   *   Tree to transform and inspect.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {TailTree extends undefined ? Node : TailTree}
   *   Transformed tree.
   */
  runSync(tree, file) {
    let complete = false;
    let result;
    this.run(tree, file, realDone);
    assertDone("runSync", "run", complete);
    ok(result, "we either bailed on an error or have a tree");
    return result;
    function realDone(error, tree2) {
      bail(error);
      result = tree2;
      complete = true;
    }
  }
  /**
   * Compile a syntax tree.
   *
   * > **Note**: `stringify` freezes the processor if not already *frozen*.
   *
   * > **Note**: `stringify` performs the stringify phase, not the run phase
   * > or other phases.
   *
   * @param {CompileTree extends undefined ? Node : CompileTree} tree
   *   Tree to compile.
   * @param {Compatible | undefined} [file]
   *   File associated with `node` (optional); any value accepted as `x` in
   *   `new VFile(x)`.
   * @returns {CompileResult extends undefined ? Value : CompileResult}
   *   Textual representation of the tree (see note).
   *
   *   > **Note**: unified typically compiles by serializing: most compilers
   *   > return `string` (or `Uint8Array`).
   *   > Some compilers, such as the one configured with
   *   > [`rehype-react`][rehype-react], return other values (in this case, a
   *   > React tree).
   *   > If you’re using a compiler that doesn’t serialize, expect different
   *   > result values.
   *   >
   *   > To register custom results in TypeScript, add them to
   *   > {@linkcode CompileResultMap}.
   *
   *   [rehype-react]: https://github.com/rehypejs/rehype-react
   */
  stringify(tree, file) {
    this.freeze();
    const realFile = vfile(file);
    const compiler = this.compiler || this.Compiler;
    assertCompiler("stringify", compiler);
    assertNode(tree);
    return compiler(tree, realFile);
  }
  /**
   * Configure the processor to use a plugin, a list of usable values, or a
   * preset.
   *
   * If the processor is already using a plugin, the previous plugin
   * configuration is changed based on the options that are passed in.
   * In other words, the plugin is not added a second time.
   *
   * > **Note**: `use` cannot be called on *frozen* processors.
   * > Call the processor first to create a new unfrozen processor.
   *
   * @example
   *   There are many ways to pass plugins to `.use()`.
   *   This example gives an overview:
   *
   *   ```js
   *   import {unified} from 'unified'
   *
   *   unified()
   *     // Plugin with options:
   *     .use(pluginA, {x: true, y: true})
   *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
   *     .use(pluginA, {y: false, z: true})
   *     // Plugins:
   *     .use([pluginB, pluginC])
   *     // Two plugins, the second with options:
   *     .use([pluginD, [pluginE, {}]])
   *     // Preset with plugins and settings:
   *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
   *     // Settings only:
   *     .use({settings: {position: false}})
   *   ```
   *
   * @template {Array<unknown>} [Parameters=[]]
   * @template {Node | string | undefined} [Input=undefined]
   * @template [Output=Input]
   *
   * @overload
   * @param {Preset | null | undefined} [preset]
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {PluggableList} list
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *
   * @overload
   * @param {Plugin<Parameters, Input, Output>} plugin
   * @param {...(Parameters | [boolean])} parameters
   * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
   *
   * @param {PluggableList | Plugin | Preset | null | undefined} value
   *   Usable value.
   * @param {...unknown} parameters
   *   Parameters, when a plugin is given as a usable value.
   * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
   *   Current processor.
   */
  use(value, ...parameters) {
    const attachers = this.attachers;
    const namespace = this.namespace;
    assertUnfrozen("use", this.frozen);
    if (value === null || value === void 0) {
    } else if (typeof value === "function") {
      addPlugin(value, parameters);
    } else if (typeof value === "object") {
      if (Array.isArray(value)) {
        addList(value);
      } else {
        addPreset(value);
      }
    } else {
      throw new TypeError("Expected usable value, not `" + value + "`");
    }
    return this;
    function add(value2) {
      if (typeof value2 === "function") {
        addPlugin(value2, []);
      } else if (typeof value2 === "object") {
        if (Array.isArray(value2)) {
          const [plugin, ...parameters2] = (
            /** @type {PluginTuple<Array<unknown>>} */
            value2
          );
          addPlugin(plugin, parameters2);
        } else {
          addPreset(value2);
        }
      } else {
        throw new TypeError("Expected usable value, not `" + value2 + "`");
      }
    }
    function addPreset(result) {
      if (!("plugins" in result) && !("settings" in result)) {
        throw new Error(
          "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
        );
      }
      addList(result.plugins);
      if (result.settings) {
        namespace.settings = (0, import_extend.default)(true, namespace.settings, result.settings);
      }
    }
    function addList(plugins) {
      let index2 = -1;
      if (plugins === null || plugins === void 0) {
      } else if (Array.isArray(plugins)) {
        while (++index2 < plugins.length) {
          const thing = plugins[index2];
          add(thing);
        }
      } else {
        throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
      }
    }
    function addPlugin(plugin, parameters2) {
      let index2 = -1;
      let entryIndex = -1;
      while (++index2 < attachers.length) {
        if (attachers[index2][0] === plugin) {
          entryIndex = index2;
          break;
        }
      }
      if (entryIndex === -1) {
        attachers.push([plugin, ...parameters2]);
      } else if (parameters2.length > 0) {
        let [primary, ...rest] = parameters2;
        const currentPrimary = attachers[entryIndex][1];
        if (isPlainObject2(currentPrimary) && isPlainObject2(primary)) {
          primary = (0, import_extend.default)(true, currentPrimary, primary);
        }
        attachers[entryIndex] = [plugin, primary, ...rest];
      }
    }
  }
};
var unified = new Processor().freeze();
function assertParser(name, value) {
  if (typeof value !== "function") {
    throw new TypeError("Cannot `" + name + "` without `parser`");
  }
}
function assertCompiler(name, value) {
  if (typeof value !== "function") {
    throw new TypeError("Cannot `" + name + "` without `compiler`");
  }
}
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error(
      "Cannot call `" + name + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
  }
}
function assertNode(node) {
  if (!isPlainObject2(node) || typeof node.type !== "string") {
    throw new TypeError("Expected node, got `" + node + "`");
  }
}
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error(
      "`" + name + "` finished async. Use `" + asyncName + "` instead"
    );
  }
}
function vfile(value) {
  return looksLikeAVFile(value) ? value : new VFile(value);
}
function looksLikeAVFile(value) {
  return Boolean(
    value && typeof value === "object" && "message" in value && "messages" in value
  );
}
function looksLikeAValue(value) {
  return typeof value === "string" || isUint8Array2(value);
}
function isUint8Array2(value) {
  return Boolean(
    value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
  );
}

// node_modules/unist-builder/lib/index.js
function u(type, props, value) {
  const node = { type: String(type) };
  if ((value === void 0 || value === null) && (typeof props === "string" || Array.isArray(props))) {
    value = props;
  } else {
    Object.assign(node, props);
  }
  if (Array.isArray(value)) {
    node.children = value;
  } else if (value !== void 0 && value !== null) {
    node.value = String(value);
  }
  return node;
}

// node_modules/uniorg-parse/lib/entities.js
var getOrgEntity = (name) => {
  const e = orgEntities.find((x) => x[0] === name);
  if (!e)
    return null;
  return {
    name,
    latex: e[1],
    requireLatexMath: e[2],
    html: e[3],
    ascii: e[4],
    latin1: e[5],
    utf8: e[6]
  };
};
var orgEntities = [
  // * Letters
  // ** Latin
  ["Agrave", "\\`{A}", false, "&Agrave;", "A", "\xC0", "\xC0"],
  ["agrave", "\\`{a}", false, "&agrave;", "a", "\xE0", "\xE0"],
  ["Aacute", "\\'{A}", false, "&Aacute;", "A", "\xC1", "\xC1"],
  ["aacute", "\\'{a}", false, "&aacute;", "a", "\xE1", "\xE1"],
  ["Acirc", "\\^{A}", false, "&Acirc;", "A", "\xC2", "\xC2"],
  ["acirc", "\\^{a}", false, "&acirc;", "a", "\xE2", "\xE2"],
  ["Amacr", "\\bar{A}", false, "&Amacr;", "A", "\xC3", "\xC3"],
  ["amacr", "\\bar{a}", false, "&amacr;", "a", "\xE3", "\xE3"],
  ["Atilde", "\\~{A}", false, "&Atilde;", "A", "\xC3", "\xC3"],
  ["atilde", "\\~{a}", false, "&atilde;", "a", "\xE3", "\xE3"],
  ["Auml", '\\"{A}', false, "&Auml;", "Ae", "\xC4", "\xC4"],
  ["auml", '\\"{a}', false, "&auml;", "ae", "\xE4", "\xE4"],
  ["Aring", "\\AA{}", false, "&Aring;", "A", "\xC5", "\xC5"],
  ["AA", "\\AA{}", false, "&Aring;", "A", "\xC5", "\xC5"],
  ["aring", "\\aa{}", false, "&aring;", "a", "\xE5", "\xE5"],
  ["AElig", "\\AE{}", false, "&AElig;", "AE", "\xC6", "\xC6"],
  ["aelig", "\\ae{}", false, "&aelig;", "ae", "\xE6", "\xE6"],
  ["Ccedil", "\\c{C}", false, "&Ccedil;", "C", "\xC7", "\xC7"],
  ["ccedil", "\\c{c}", false, "&ccedil;", "c", "\xE7", "\xE7"],
  ["Egrave", "\\`{E}", false, "&Egrave;", "E", "\xC8", "\xC8"],
  ["egrave", "\\`{e}", false, "&egrave;", "e", "\xE8", "\xE8"],
  ["Eacute", "\\'{E}", false, "&Eacute;", "E", "\xC9", "\xC9"],
  ["eacute", "\\'{e}", false, "&eacute;", "e", "\xE9", "\xE9"],
  ["Ecirc", "\\^{E}", false, "&Ecirc;", "E", "\xCA", "\xCA"],
  ["ecirc", "\\^{e}", false, "&ecirc;", "e", "\xEA", "\xEA"],
  ["Euml", '\\"{E}', false, "&Euml;", "E", "\xCB", "\xCB"],
  ["euml", '\\"{e}', false, "&euml;", "e", "\xEB", "\xEB"],
  ["Igrave", "\\`{I}", false, "&Igrave;", "I", "\xCC", "\xCC"],
  ["igrave", "\\`{i}", false, "&igrave;", "i", "\xEC", "\xEC"],
  ["Iacute", "\\'{I}", false, "&Iacute;", "I", "\xCD", "\xCD"],
  ["iacute", "\\'{i}", false, "&iacute;", "i", "\xED", "\xED"],
  ["Icirc", "\\^{I}", false, "&Icirc;", "I", "\xCE", "\xCE"],
  ["icirc", "\\^{i}", false, "&icirc;", "i", "\xEE", "\xEE"],
  ["Iuml", '\\"{I}', false, "&Iuml;", "I", "\xCF", "\xCF"],
  ["iuml", '\\"{i}', false, "&iuml;", "i", "\xEF", "\xEF"],
  ["Ntilde", "\\~{N}", false, "&Ntilde;", "N", "\xD1", "\xD1"],
  ["ntilde", "\\~{n}", false, "&ntilde;", "n", "\xF1", "\xF1"],
  ["Ograve", "\\`{O}", false, "&Ograve;", "O", "\xD2", "\xD2"],
  ["ograve", "\\`{o}", false, "&ograve;", "o", "\xF2", "\xF2"],
  ["Oacute", "\\'{O}", false, "&Oacute;", "O", "\xD3", "\xD3"],
  ["oacute", "\\'{o}", false, "&oacute;", "o", "\xF3", "\xF3"],
  ["Ocirc", "\\^{O}", false, "&Ocirc;", "O", "\xD4", "\xD4"],
  ["ocirc", "\\^{o}", false, "&ocirc;", "o", "\xF4", "\xF4"],
  ["Otilde", "\\~{O}", false, "&Otilde;", "O", "\xD5", "\xD5"],
  ["otilde", "\\~{o}", false, "&otilde;", "o", "\xF5", "\xF5"],
  ["Ouml", '\\"{O}', false, "&Ouml;", "Oe", "\xD6", "\xD6"],
  ["ouml", '\\"{o}', false, "&ouml;", "oe", "\xF6", "\xF6"],
  ["Oslash", "\\O", false, "&Oslash;", "O", "\xD8", "\xD8"],
  ["oslash", "\\o{}", false, "&oslash;", "o", "\xF8", "\xF8"],
  ["OElig", "\\OE{}", false, "&OElig;", "OE", "OE", "\u0152"],
  ["oelig", "\\oe{}", false, "&oelig;", "oe", "oe", "\u0153"],
  ["Scaron", "\\v{S}", false, "&Scaron;", "S", "S", "\u0160"],
  ["scaron", "\\v{s}", false, "&scaron;", "s", "s", "\u0161"],
  ["szlig", "\\ss{}", false, "&szlig;", "ss", "\xDF", "\xDF"],
  ["Ugrave", "\\`{U}", false, "&Ugrave;", "U", "\xD9", "\xD9"],
  ["ugrave", "\\`{u}", false, "&ugrave;", "u", "\xF9", "\xF9"],
  ["Uacute", "\\'{U}", false, "&Uacute;", "U", "\xDA", "\xDA"],
  ["uacute", "\\'{u}", false, "&uacute;", "u", "\xFA", "\xFA"],
  ["Ucirc", "\\^{U}", false, "&Ucirc;", "U", "\xDB", "\xDB"],
  ["ucirc", "\\^{u}", false, "&ucirc;", "u", "\xFB", "\xFB"],
  ["Uuml", '\\"{U}', false, "&Uuml;", "Ue", "\xDC", "\xDC"],
  ["uuml", '\\"{u}', false, "&uuml;", "ue", "\xFC", "\xFC"],
  ["Yacute", "\\'{Y}", false, "&Yacute;", "Y", "\xDD", "\xDD"],
  ["yacute", "\\'{y}", false, "&yacute;", "y", "\xFD", "\xFD"],
  ["Yuml", '\\"{Y}', false, "&Yuml;", "Y", "Y", "\u0178"],
  ["yuml", '\\"{y}', false, "&yuml;", "y", "\xFF", "\xFF"],
  // ** Latin (special face)
  ["fnof", "\\textit{f}", false, "&fnof;", "f", "f", "\u0192"],
  ["real", "\\Re", true, "&real;", "R", "R", "\u211C"],
  ["image", "\\Im", true, "&image;", "I", "I", "\u2111"],
  ["weierp", "\\wp", true, "&weierp;", "P", "P", "\u2118"],
  ["ell", "\\ell", true, "&ell;", "ell", "ell", "\u2113"],
  ["imath", "\\imath", true, "&imath;", "[dotless i]", "dotless i", "\u0131"],
  ["jmath", "\\jmath", true, "&jmath;", "[dotless j]", "dotless j", "\u0237"],
  // ** Greek
  ["Alpha", "A", false, "&Alpha;", "Alpha", "Alpha", "\u0391"],
  ["alpha", "\\alpha", true, "&alpha;", "alpha", "alpha", "\u03B1"],
  ["Beta", "B", false, "&Beta;", "Beta", "Beta", "\u0392"],
  ["beta", "\\beta", true, "&beta;", "beta", "beta", "\u03B2"],
  ["Gamma", "\\Gamma", true, "&Gamma;", "Gamma", "Gamma", "\u0393"],
  ["gamma", "\\gamma", true, "&gamma;", "gamma", "gamma", "\u03B3"],
  ["Delta", "\\Delta", true, "&Delta;", "Delta", "Delta", "\u0394"],
  ["delta", "\\delta", true, "&delta;", "delta", "delta", "\u03B4"],
  ["Epsilon", "E", false, "&Epsilon;", "Epsilon", "Epsilon", "\u0395"],
  ["epsilon", "\\epsilon", true, "&epsilon;", "epsilon", "epsilon", "\u03B5"],
  [
    "varepsilon",
    "\\varepsilon",
    true,
    "&epsilon;",
    "varepsilon",
    "varepsilon",
    "\u03B5"
  ],
  ["Zeta", "Z", false, "&Zeta;", "Zeta", "Zeta", "\u0396"],
  ["zeta", "\\zeta", true, "&zeta;", "zeta", "zeta", "\u03B6"],
  ["Eta", "H", false, "&Eta;", "Eta", "Eta", "\u0397"],
  ["eta", "\\eta", true, "&eta;", "eta", "eta", "\u03B7"],
  ["Theta", "\\Theta", true, "&Theta;", "Theta", "Theta", "\u0398"],
  ["theta", "\\theta", true, "&theta;", "theta", "theta", "\u03B8"],
  ["thetasym", "\\vartheta", true, "&thetasym;", "theta", "theta", "\u03D1"],
  ["vartheta", "\\vartheta", true, "&thetasym;", "theta", "theta", "\u03D1"],
  ["Iota", "I", false, "&Iota;", "Iota", "Iota", "\u0399"],
  ["iota", "\\iota", true, "&iota;", "iota", "iota", "\u03B9"],
  ["Kappa", "K", false, "&Kappa;", "Kappa", "Kappa", "\u039A"],
  ["kappa", "\\kappa", true, "&kappa;", "kappa", "kappa", "\u03BA"],
  ["Lambda", "\\Lambda", true, "&Lambda;", "Lambda", "Lambda", "\u039B"],
  ["lambda", "\\lambda", true, "&lambda;", "lambda", "lambda", "\u03BB"],
  ["Mu", "M", false, "&Mu;", "Mu", "Mu", "\u039C"],
  ["mu", "\\mu", true, "&mu;", "mu", "mu", "\u03BC"],
  ["nu", "\\nu", true, "&nu;", "nu", "nu", "\u03BD"],
  ["Nu", "N", false, "&Nu;", "Nu", "Nu", "\u039D"],
  ["Xi", "\\Xi", true, "&Xi;", "Xi", "Xi", "\u039E"],
  ["xi", "\\xi", true, "&xi;", "xi", "xi", "\u03BE"],
  ["Omicron", "O", false, "&Omicron;", "Omicron", "Omicron", "\u039F"],
  ["omicron", "\\textit{o}", false, "&omicron;", "omicron", "omicron", "\u03BF"],
  ["Pi", "\\Pi", true, "&Pi;", "Pi", "Pi", "\u03A0"],
  ["pi", "\\pi", true, "&pi;", "pi", "pi", "\u03C0"],
  ["Rho", "P", false, "&Rho;", "Rho", "Rho", "\u03A1"],
  ["rho", "\\rho", true, "&rho;", "rho", "rho", "\u03C1"],
  ["Sigma", "\\Sigma", true, "&Sigma;", "Sigma", "Sigma", "\u03A3"],
  ["sigma", "\\sigma", true, "&sigma;", "sigma", "sigma", "\u03C3"],
  ["sigmaf", "\\varsigma", true, "&sigmaf;", "sigmaf", "sigmaf", "\u03C2"],
  ["varsigma", "\\varsigma", true, "&sigmaf;", "varsigma", "varsigma", "\u03C2"],
  ["Tau", "T", false, "&Tau;", "Tau", "Tau", "\u03A4"],
  ["Upsilon", "\\Upsilon", true, "&Upsilon;", "Upsilon", "Upsilon", "\u03A5"],
  ["upsih", "\\Upsilon", true, "&upsih;", "upsilon", "upsilon", "\u03D2"],
  ["upsilon", "\\upsilon", true, "&upsilon;", "upsilon", "upsilon", "\u03C5"],
  ["Phi", "\\Phi", true, "&Phi;", "Phi", "Phi", "\u03A6"],
  ["phi", "\\phi", true, "&phi;", "phi", "phi", "\u0278"],
  ["varphi", "\\varphi", true, "&varphi;", "varphi", "varphi", "\u03C6"],
  ["Chi", "X", false, "&Chi;", "Chi", "Chi", "\u03A7"],
  ["chi", "\\chi", true, "&chi;", "chi", "chi", "\u03C7"],
  ["acutex", "\\acute x", true, "&acute;x", "'x", "'x", "\u{1D465}\u0301"],
  ["Psi", "\\Psi", true, "&Psi;", "Psi", "Psi", "\u03A8"],
  ["psi", "\\psi", true, "&psi;", "psi", "psi", "\u03C8"],
  ["tau", "\\tau", true, "&tau;", "tau", "tau", "\u03C4"],
  ["Omega", "\\Omega", true, "&Omega;", "Omega", "Omega", "\u03A9"],
  ["omega", "\\omega", true, "&omega;", "omega", "omega", "\u03C9"],
  ["piv", "\\varpi", true, "&piv;", "omega-pi", "omega-pi", "\u03D6"],
  ["varpi", "\\varpi", true, "&piv;", "omega-pi", "omega-pi", "\u03D6"],
  [
    "partial",
    "\\partial",
    true,
    "&part;",
    "[partial differential]",
    "[partial differential]",
    "\u2202"
  ],
  // ** Hebrew
  ["alefsym", "\\aleph", true, "&alefsym;", "aleph", "aleph", "\u2135"],
  ["aleph", "\\aleph", true, "&aleph;", "aleph", "aleph", "\u2135"],
  ["gimel", "\\gimel", true, "&gimel;", "gimel", "gimel", "\u2137"],
  ["beth", "\\beth", true, "&beth;", "beth", "beth", "\u05D1"],
  ["dalet", "\\daleth", true, "&daleth;", "dalet", "dalet", "\u05D3"],
  // ** Icelandic
  ["ETH", "\\DH{}", false, "&ETH;", "D", "\xD0", "\xD0"],
  ["eth", "\\dh{}", false, "&eth;", "dh", "\xF0", "\xF0"],
  ["THORN", "\\TH{}", false, "&THORN;", "TH", "\xDE", "\xDE"],
  ["thorn", "\\th{}", false, "&thorn;", "th", "\xFE", "\xFE"],
  // * Punctuation
  // ** Dots and Marks
  ["dots", "\\dots{}", false, "&hellip;", "...", "...", "\u2026"],
  ["cdots", "\\cdots{}", true, "&ctdot;", "...", "...", "\u22EF"],
  ["hellip", "\\dots{}", false, "&hellip;", "...", "...", "\u2026"],
  ["middot", "\\textperiodcentered{}", false, "&middot;", ".", "\xB7", "\xB7"],
  ["iexcl", "!`", false, "&iexcl;", "!", "\xA1", "\xA1"],
  ["iquest", "?`", false, "&iquest;", "?", "\xBF", "\xBF"],
  // ** Dash-like
  ["shy", "\\-", false, "&shy;", "", "", ""],
  ["ndash", "--", false, "&ndash;", "-", "-", "\u2013"],
  ["mdash", "---", false, "&mdash;", "--", "--", "\u2014"],
  // ** Quotations
  ["quot", "\\textquotedbl{}", false, "&quot;", '"', '"', '"'],
  ["acute", "\\textasciiacute{}", false, "&acute;", "'", "\xB4", "\xB4"],
  ["ldquo", "\\textquotedblleft{}", false, "&ldquo;", '"', '"', "\u201C"],
  ["rdquo", "\\textquotedblright{}", false, "&rdquo;", '"', '"', "\u201D"],
  ["bdquo", "\\quotedblbase{}", false, "&bdquo;", '"', '"', "\u201E"],
  ["lsquo", "\\textquoteleft{}", false, "&lsquo;", "`", "`", "\u2018"],
  ["rsquo", "\\textquoteright{}", false, "&rsquo;", "'", "'", "\u2019"],
  ["sbquo", "\\quotesinglbase{}", false, "&sbquo;", ",", ",", "\u201A"],
  ["laquo", "\\guillemotleft{}", false, "&laquo;", "<<", "\xAB", "\xAB"],
  ["raquo", "\\guillemotright{}", false, "&raquo;", ">>", "\xBB", "\xBB"],
  ["lsaquo", "\\guilsinglleft{}", false, "&lsaquo;", "<", "<", "\u2039"],
  ["rsaquo", "\\guilsinglright{}", false, "&rsaquo;", ">", ">", "\u203A"],
  // * Other
  // ** Misc. (often used)
  ["circ", "\\^{}", false, "&circ;", "^", "^", "\u2218"],
  ["vert", "\\vert{}", true, "&vert;", "|", "|", "|"],
  ["vbar", "|", false, "|", "|", "|", "|"],
  ["brvbar", "\\textbrokenbar{}", false, "&brvbar;", "|", "\xA6", "\xA6"],
  ["S", "\\S", false, "&sect;", "paragraph", "\xA7", "\xA7"],
  ["sect", "\\S", false, "&sect;", "paragraph", "\xA7", "\xA7"],
  ["amp", "\\&", false, "&amp;", "&", "&", "&"],
  ["lt", "\\textless{}", false, "&lt;", "<", "<", "<"],
  ["gt", "\\textgreater{}", false, "&gt;", ">", ">", ">"],
  ["tilde", "\\textasciitilde{}", false, "~", "~", "~", "~"],
  ["slash", "/", false, "/", "/", "/", "/"],
  ["plus", "+", false, "+", "+", "+", "+"],
  ["under", "\\_", false, "_", "_", "_", "_"],
  ["equal", "=", false, "=", "=", "=", "="],
  ["asciicirc", "\\textasciicircum{}", false, "^", "^", "^", "^"],
  [
    "dagger",
    "\\textdagger{}",
    false,
    "&dagger;",
    "[dagger]",
    "[dagger]",
    "\u2020"
  ],
  ["dag", "\\dag{}", false, "&dagger;", "[dagger]", "[dagger]", "\u2020"],
  [
    "Dagger",
    "\\textdaggerdbl{}",
    false,
    "&Dagger;",
    "[doubledagger]",
    "[doubledagger]",
    "\u2021"
  ],
  [
    "ddag",
    "\\ddag{}",
    false,
    "&Dagger;",
    "[doubledagger]",
    "[doubledagger]",
    "\u2021"
  ],
  // ** Whitespace
  ["nbsp", "~", false, "&nbsp;", " ", "\xA0", "\xA0"],
  ["ensp", "\\hspace*{.5em}", false, "&ensp;", " ", " ", "\u2002"],
  ["emsp", "\\hspace*{1em}", false, "&emsp;", " ", " ", "\u2003"],
  ["thinsp", "\\hspace*{.2em}", false, "&thinsp;", " ", " ", "\u2009"],
  // ** Currency
  ["curren", "\\textcurrency{}", false, "&curren;", "curr.", "\xA4", "\xA4"],
  ["cent", "\\textcent{}", false, "&cent;", "cent", "\xA2", "\xA2"],
  ["pound", "\\pounds{}", false, "&pound;", "pound", "\xA3", "\xA3"],
  ["yen", "\\textyen{}", false, "&yen;", "yen", "\xA5", "\xA5"],
  ["euro", "\\texteuro{}", false, "&euro;", "EUR", "EUR", "\u20AC"],
  ["EUR", "\\texteuro{}", false, "&euro;", "EUR", "EUR", "\u20AC"],
  ["dollar", "\\$", false, "$", "$", "$", "$"],
  ["USD", "\\$", false, "$", "$", "$", "$"],
  // ** Property Marks
  ["copy", "\\textcopyright{}", false, "&copy;", "(c)", "\xA9", "\xA9"],
  ["reg", "\\textregistered{}", false, "&reg;", "(r)", "\xAE", "\xAE"],
  ["trade", "\\texttrademark{}", false, "&trade;", "TM", "TM", "\u2122"],
  // ** Science et al.
  ["minus", "\\minus", true, "&minus;", "-", "-", "\u2212"],
  ["pm", "\\textpm{}", false, "&plusmn;", "+-", "\xB1", "\xB1"],
  ["plusmn", "\\textpm{}", false, "&plusmn;", "+-", "\xB1", "\xB1"],
  ["times", "\\texttimes{}", false, "&times;", "*", "\xD7", "\xD7"],
  ["frasl", "/", false, "&frasl;", "/", "/", "\u2044"],
  ["colon", "\\colon", true, ":", ":", ":", ":"],
  ["div", "\\textdiv{}", false, "&divide;", "/", "\xF7", "\xF7"],
  ["frac12", "\\textonehalf{}", false, "&frac12;", "1/2", "\xBD", "\xBD"],
  ["frac14", "\\textonequarter{}", false, "&frac14;", "1/4", "\xBC", "\xBC"],
  ["frac34", "\\textthreequarters{}", false, "&frac34;", "3/4", "\xBE", "\xBE"],
  [
    "permil",
    "\\textperthousand{}",
    false,
    "&permil;",
    "per thousand",
    "per thousand",
    "\u2030"
  ],
  ["sup1", "\\textonesuperior{}", false, "&sup1;", "^1", "\xB9", "\xB9"],
  ["sup2", "\\texttwosuperior{}", false, "&sup2;", "^2", "\xB2", "\xB2"],
  ["sup3", "\\textthreesuperior{}", false, "&sup3;", "^3", "\xB3", "\xB3"],
  [
    "radic",
    "\\sqrt{\\,}",
    true,
    "&radic;",
    "[square root]",
    "[square root]",
    "\u221A"
  ],
  ["sum", "\\sum", true, "&sum;", "[sum]", "[sum]", "\u2211"],
  ["prod", "\\prod", true, "&prod;", "[product]", "[n-ary product]", "\u220F"],
  ["micro", "\\textmu{}", false, "&micro;", "micro", "\xB5", "\xB5"],
  ["macr", "\\textasciimacron{}", false, "&macr;", "[macron]", "\xAF", "\xAF"],
  ["deg", "\\textdegree{}", false, "&deg;", "degree", "\xB0", "\xB0"],
  ["prime", "\\prime", true, "&prime;", "'", "'", "\u2032"],
  ["Prime", "\\prime{}\\prime", true, "&Prime;", "''", "''", "\u2033"],
  ["infin", "\\infty", true, "&infin;", "[infinity]", "[infinity]", "\u221E"],
  ["infty", "\\infty", true, "&infin;", "[infinity]", "[infinity]", "\u221E"],
  [
    "prop",
    "\\propto",
    true,
    "&prop;",
    "[proportional to]",
    "[proportional to]",
    "\u221D"
  ],
  [
    "propto",
    "\\propto",
    true,
    "&prop;",
    "[proportional to]",
    "[proportional to]",
    "\u221D"
  ],
  ["not", "\\textlnot{}", false, "&not;", "[angled dash]", "\xAC", "\xAC"],
  ["neg", "\\neg{}", true, "&not;", "[angled dash]", "\xAC", "\xAC"],
  ["land", "\\land", true, "&and;", "[logical and]", "[logical and]", "\u2227"],
  ["wedge", "\\wedge", true, "&and;", "[logical and]", "[logical and]", "\u2227"],
  ["lor", "\\lor", true, "&or;", "[logical or]", "[logical or]", "\u2228"],
  ["vee", "\\vee", true, "&or;", "[logical or]", "[logical or]", "\u2228"],
  ["cap", "\\cap", true, "&cap;", "[intersection]", "[intersection]", "\u2229"],
  ["cup", "\\cup", true, "&cup;", "[union]", "[union]", "\u222A"],
  [
    "smile",
    "\\smile",
    true,
    "&smile;",
    "[cup product]",
    "[cup product]",
    "\u2323"
  ],
  [
    "frown",
    "\\frown",
    true,
    "&frown;",
    "[Cap product]",
    "[cap product]",
    "\u2322"
  ],
  ["int", "\\int", true, "&int;", "[integral]", "[integral]", "\u222B"],
  [
    "therefore",
    "\\therefore",
    true,
    "&there4;",
    "[therefore]",
    "[therefore]",
    "\u2234"
  ],
  [
    "there4",
    "\\therefore",
    true,
    "&there4;",
    "[therefore]",
    "[therefore]",
    "\u2234"
  ],
  ["because", "\\because", true, "&because;", "[because]", "[because]", "\u2235"],
  ["sim", "\\sim", true, "&sim;", "~", "~", "\u223C"],
  [
    "cong",
    "\\cong",
    true,
    "&cong;",
    "[approx. equal to]",
    "[approx. equal to]",
    "\u2245"
  ],
  [
    "simeq",
    "\\simeq",
    true,
    "&cong;",
    "[approx. equal to]",
    "[approx. equal to]",
    "\u2245"
  ],
  [
    "asymp",
    "\\asymp",
    true,
    "&asymp;",
    "[almost equal to]",
    "[almost equal to]",
    "\u2248"
  ],
  [
    "approx",
    "\\approx",
    true,
    "&asymp;",
    "[almost equal to]",
    "[almost equal to]",
    "\u2248"
  ],
  ["ne", "\\ne", true, "&ne;", "[not equal to]", "[not equal to]", "\u2260"],
  ["neq", "\\neq", true, "&ne;", "[not equal to]", "[not equal to]", "\u2260"],
  [
    "equiv",
    "\\equiv",
    true,
    "&equiv;",
    "[identical to]",
    "[identical to]",
    "\u2261"
  ],
  [
    "triangleq",
    "\\triangleq",
    true,
    "&triangleq;",
    "[defined to]",
    "[defined to]",
    "\u225C"
  ],
  ["le", "\\le", true, "&le;", "<=", "<=", "\u2264"],
  ["leq", "\\le", true, "&le;", "<=", "<=", "\u2264"],
  ["ge", "\\ge", true, "&ge;", ">=", ">=", "\u2265"],
  ["geq", "\\ge", true, "&ge;", ">=", ">=", "\u2265"],
  [
    "lessgtr",
    "\\lessgtr",
    true,
    "&lessgtr;",
    "[less than or greater than]",
    "[less than or greater than]",
    "\u2276"
  ],
  [
    "lesseqgtr",
    "\\lesseqgtr",
    true,
    "&lesseqgtr;",
    "[less than or equal or greater than or equal]",
    "[less than or equal or greater than or equal]",
    "\u22DA"
  ],
  ["ll", "\\ll", true, "&Lt;", "<<", "<<", "\u226A"],
  ["Ll", "\\lll", true, "&Ll;", "<<<", "<<<", "\u22D8"],
  ["lll", "\\lll", true, "&Ll;", "<<<", "<<<", "\u22D8"],
  ["gg", "\\gg", true, "&Gt;", ">>", ">>", "\u226B"],
  ["Gg", "\\ggg", true, "&Gg;", ">>>", ">>>", "\u22D9"],
  ["ggg", "\\ggg", true, "&Gg;", ">>>", ">>>", "\u22D9"],
  ["prec", "\\prec", true, "&pr;", "[precedes]", "[precedes]", "\u227A"],
  [
    "preceq",
    "\\preceq",
    true,
    "&prcue;",
    "[precedes or equal]",
    "[precedes or equal]",
    "\u227C"
  ],
  [
    "preccurlyeq",
    "\\preccurlyeq",
    true,
    "&prcue;",
    "[precedes or equal]",
    "[precedes or equal]",
    "\u227C"
  ],
  ["succ", "\\succ", true, "&sc;", "[succeeds]", "[succeeds]", "\u227B"],
  [
    "succeq",
    "\\succeq",
    true,
    "&sccue;",
    "[succeeds or equal]",
    "[succeeds or equal]",
    "\u227D"
  ],
  [
    "succcurlyeq",
    "\\succcurlyeq",
    true,
    "&sccue;",
    "[succeeds or equal]",
    "[succeeds or equal]",
    "\u227D"
  ],
  ["sub", "\\subset", true, "&sub;", "[subset of]", "[subset of]", "\u2282"],
  ["subset", "\\subset", true, "&sub;", "[subset of]", "[subset of]", "\u2282"],
  ["sup", "\\supset", true, "&sup;", "[superset of]", "[superset of]", "\u2283"],
  [
    "supset",
    "\\supset",
    true,
    "&sup;",
    "[superset of]",
    "[superset of]",
    "\u2283"
  ],
  [
    "nsub",
    "\\not\\subset",
    true,
    "&nsub;",
    "[not a subset of]",
    "[not a subset of",
    "\u2284"
  ],
  [
    "sube",
    "\\subseteq",
    true,
    "&sube;",
    "[subset of or equal to]",
    "[subset of or equal to]",
    "\u2286"
  ],
  [
    "nsup",
    "\\not\\supset",
    true,
    "&nsup;",
    "[not a superset of]",
    "[not a superset of]",
    "\u2285"
  ],
  [
    "supe",
    "\\supseteq",
    true,
    "&supe;",
    "[superset of or equal to]",
    "[superset of or equal to]",
    "\u2287"
  ],
  ["setminus", "\\setminus", true, "&setminus;", '" ', '"', "\u29F5"],
  ["forall", "\\forall", true, "&forall;", "[for all]", "[for all]", "\u2200"],
  [
    "exist",
    "\\exists",
    true,
    "&exist;",
    "[there exists]",
    "[there exists]",
    "\u2203"
  ],
  [
    "exists",
    "\\exists",
    true,
    "&exist;",
    "[there exists]",
    "[there exists]",
    "\u2203"
  ],
  [
    "nexist",
    "\\nexists",
    true,
    "&exist;",
    "[there does not exists]",
    "[there does not  exists]",
    "\u2204"
  ],
  [
    "nexists",
    "\\nexists",
    true,
    "&exist;",
    "[there does not exists]",
    "[there does not  exists]",
    "\u2204"
  ],
  ["empty", "\\emptyset", true, "&empty;", "[empty set]", "[empty set]", "\u2205"],
  [
    "emptyset",
    "\\emptyset",
    true,
    "&empty;",
    "[empty set]",
    "[empty set]",
    "\u2205"
  ],
  ["isin", "\\in", true, "&isin;", "[element of]", "[element of]", "\u2208"],
  ["in", "\\in", true, "&isin;", "[element of]", "[element of]", "\u2208"],
  [
    "notin",
    "\\notin",
    true,
    "&notin;",
    "[not an element of]",
    "[not an element of]",
    "\u2209"
  ],
  [
    "ni",
    "\\ni",
    true,
    "&ni;",
    "[contains as member]",
    "[contains as member]",
    "\u220B"
  ],
  ["nabla", "\\nabla", true, "&nabla;", "[nabla]", "[nabla]", "\u2207"],
  ["ang", "\\angle", true, "&ang;", "[angle]", "[angle]", "\u2220"],
  ["angle", "\\angle", true, "&ang;", "[angle]", "[angle]", "\u2220"],
  ["perp", "\\perp", true, "&perp;", "[up tack]", "[up tack]", "\u22A5"],
  ["parallel", "\\parallel", true, "&parallel;", "||", "||", "\u2225"],
  ["sdot", "\\cdot", true, "&sdot;", "[dot]", "[dot]", "\u22C5"],
  ["cdot", "\\cdot", true, "&sdot;", "[dot]", "[dot]", "\u22C5"],
  [
    "lceil",
    "\\lceil",
    true,
    "&lceil;",
    "[left ceiling]",
    "[left ceiling]",
    "\u2308"
  ],
  [
    "rceil",
    "\\rceil",
    true,
    "&rceil;",
    "[right ceiling]",
    "[right ceiling]",
    "\u2309"
  ],
  [
    "lfloor",
    "\\lfloor",
    true,
    "&lfloor;",
    "[left floor]",
    "[left floor]",
    "\u230A"
  ],
  [
    "rfloor",
    "\\rfloor",
    true,
    "&rfloor;",
    "[right floor]",
    "[right floor]",
    "\u230B"
  ],
  ["lang", "\\langle", true, "&lang;", "<", "<", "\u27E8"],
  ["rang", "\\rangle", true, "&rang;", ">", ">", "\u27E9"],
  ["langle", "\\langle", true, "&lang;", "<", "<", "\u27E8"],
  ["rangle", "\\rangle", true, "&rang;", ">", ">", "\u27E9"],
  ["hbar", "\\hbar", true, "&hbar;", "hbar", "hbar", "\u210F"],
  ["mho", "\\mho", true, "&mho;", "mho", "mho", "\u2127"],
  // ** Arrows
  ["larr", "\\leftarrow", true, "&larr;", "<-", "<-", "\u2190"],
  ["leftarrow", "\\leftarrow", true, "&larr;", "<-", "<-", "\u2190"],
  ["gets", "\\gets", true, "&larr;", "<-", "<-", "\u2190"],
  ["lArr", "\\Leftarrow", true, "&lArr;", "<=", "<=", "\u21D0"],
  ["Leftarrow", "\\Leftarrow", true, "&lArr;", "<=", "<=", "\u21D0"],
  ["uarr", "\\uparrow", true, "&uarr;", "[uparrow]", "[uparrow]", "\u2191"],
  ["uparrow", "\\uparrow", true, "&uarr;", "[uparrow]", "[uparrow]", "\u2191"],
  ["uArr", "\\Uparrow", true, "&uArr;", "[dbluparrow]", "[dbluparrow]", "\u21D1"],
  [
    "Uparrow",
    "\\Uparrow",
    true,
    "&uArr;",
    "[dbluparrow]",
    "[dbluparrow]",
    "\u21D1"
  ],
  ["rarr", "\\rightarrow", true, "&rarr;", "->", "->", "\u2192"],
  ["to", "\\to", true, "&rarr;", "->", "->", "\u2192"],
  ["rightarrow", "\\rightarrow", true, "&rarr;", "->", "->", "\u2192"],
  ["rArr", "\\Rightarrow", true, "&rArr;", "=>", "=>", "\u21D2"],
  ["Rightarrow", "\\Rightarrow", true, "&rArr;", "=>", "=>", "\u21D2"],
  ["darr", "\\downarrow", true, "&darr;", "[downarrow]", "[downarrow]", "\u2193"],
  [
    "downarrow",
    "\\downarrow",
    true,
    "&darr;",
    "[downarrow]",
    "[downarrow]",
    "\u2193"
  ],
  [
    "dArr",
    "\\Downarrow",
    true,
    "&dArr;",
    "[dbldownarrow]",
    "[dbldownarrow]",
    "\u21D3"
  ],
  [
    "Downarrow",
    "\\Downarrow",
    true,
    "&dArr;",
    "[dbldownarrow]",
    "[dbldownarrow]",
    "\u21D3"
  ],
  ["harr", "\\leftrightarrow", true, "&harr;", "<->", "<->", "\u2194"],
  ["leftrightarrow", "\\leftrightarrow", true, "&harr;", "<->", "<->", "\u2194"],
  ["hArr", "\\Leftrightarrow", true, "&hArr;", "<=>", "<=>", "\u21D4"],
  ["Leftrightarrow", "\\Leftrightarrow", true, "&hArr;", "<=>", "<=>", "\u21D4"],
  ["crarr", "\\hookleftarrow", true, "&crarr;", "<-'", "<-'", "\u21B5"],
  ["hookleftarrow", "\\hookleftarrow", true, "&crarr;", "<-'", "<-'", "\u21B5"],
  // ** Function names
  ["arccos", "\\arccos", true, "arccos", "arccos", "arccos", "arccos"],
  ["arcsin", "\\arcsin", true, "arcsin", "arcsin", "arcsin", "arcsin"],
  ["arctan", "\\arctan", true, "arctan", "arctan", "arctan", "arctan"],
  ["arg", "\\arg", true, "arg", "arg", "arg", "arg"],
  ["cos", "\\cos", true, "cos", "cos", "cos", "cos"],
  ["cosh", "\\cosh", true, "cosh", "cosh", "cosh", "cosh"],
  ["cot", "\\cot", true, "cot", "cot", "cot", "cot"],
  ["coth", "\\coth", true, "coth", "coth", "coth", "coth"],
  ["csc", "\\csc", true, "csc", "csc", "csc", "csc"],
  ["deg", "\\deg", true, "&deg;", "deg", "deg", "deg"],
  ["det", "\\det", true, "det", "det", "det", "det"],
  ["dim", "\\dim", true, "dim", "dim", "dim", "dim"],
  ["exp", "\\exp", true, "exp", "exp", "exp", "exp"],
  ["gcd", "\\gcd", true, "gcd", "gcd", "gcd", "gcd"],
  ["hom", "\\hom", true, "hom", "hom", "hom", "hom"],
  ["inf", "\\inf", true, "inf", "inf", "inf", "inf"],
  ["ker", "\\ker", true, "ker", "ker", "ker", "ker"],
  ["lg", "\\lg", true, "lg", "lg", "lg", "lg"],
  ["lim", "\\lim", true, "lim", "lim", "lim", "lim"],
  ["liminf", "\\liminf", true, "liminf", "liminf", "liminf", "liminf"],
  ["limsup", "\\limsup", true, "limsup", "limsup", "limsup", "limsup"],
  ["ln", "\\ln", true, "ln", "ln", "ln", "ln"],
  ["log", "\\log", true, "log", "log", "log", "log"],
  ["max", "\\max", true, "max", "max", "max", "max"],
  ["min", "\\min", true, "min", "min", "min", "min"],
  ["Pr", "\\Pr", true, "Pr", "Pr", "Pr", "Pr"],
  ["sec", "\\sec", true, "sec", "sec", "sec", "sec"],
  ["sin", "\\sin", true, "sin", "sin", "sin", "sin"],
  ["sinh", "\\sinh", true, "sinh", "sinh", "sinh", "sinh"],
  ["sup", "\\sup", true, "&sup;", "sup", "sup", "sup"],
  ["tan", "\\tan", true, "tan", "tan", "tan", "tan"],
  ["tanh", "\\tanh", true, "tanh", "tanh", "tanh", "tanh"],
  // ** Signs & Symbols
  ["bull", "\\textbullet{}", false, "&bull;", "*", "*", "\u2022"],
  ["bullet", "\\textbullet{}", false, "&bull;", "*", "*", "\u2022"],
  ["star", "\\star", true, "*", "*", "*", "\u22C6"],
  ["lowast", "\\ast", true, "&lowast;", "*", "*", "\u2217"],
  ["ast", "\\ast", true, "&lowast;", "*", "*", "*"],
  ["odot", "\\odot", true, "o", "[circled dot]", "[circled dot]", "\u0298"],
  [
    "oplus",
    "\\oplus",
    true,
    "&oplus;",
    "[circled plus]",
    "[circled plus]",
    "\u2295"
  ],
  [
    "otimes",
    "\\otimes",
    true,
    "&otimes;",
    "[circled times]",
    "[circled times]",
    "\u2297"
  ],
  [
    "check",
    "\\checkmark",
    true,
    "&checkmark;",
    "[checkmark]",
    "[checkmark]",
    "\u2713"
  ],
  [
    "checkmark",
    "\\checkmark",
    true,
    "&check;",
    "[checkmark]",
    "[checkmark]",
    "\u2713"
  ],
  // ** Miscellaneous (seldom used)
  ["para", "\\P{}", false, "&para;", "[pilcrow]", "\xB6", "\xB6"],
  ["ordf", "\\textordfeminine{}", false, "&ordf;", "_a_", "\xAA", "\xAA"],
  ["ordm", "\\textordmasculine{}", false, "&ordm;", "_o_", "\xBA", "\xBA"],
  ["cedil", "\\c{}", false, "&cedil;", "[cedilla]", "\xB8", "\xB8"],
  ["oline", "\\overline{~}", true, "&oline;", "[overline]", "\xAF", "\u203E"],
  ["uml", "\\textasciidieresis{}", false, "&uml;", "[diaeresis]", "\xA8", "\xA8"],
  ["zwnj", "\\/{}", false, "&zwnj;", "", "", "\u200C"],
  ["zwj", "", false, "&zwj;", "", "", "\u200D"],
  ["lrm", "", false, "&lrm;", "", "", "\u200E"],
  ["rlm", "", false, "&rlm;", "", "", "\u200F"],
  // ** Smilies
  ["smiley", "\\ddot\\smile", true, "&#9786;", ":-)", ":-)", "\u263A"],
  ["blacksmile", "\\ddot\\smile", true, "&#9787;", ":-)", ":-)", "\u263B"],
  ["sad", "\\ddot\\frown", true, "&#9785;", ":-(", ":-(", "\u2639"],
  ["frowny", "\\ddot\\frown", true, "&#9785;", ":-(", ":-(", "\u2639"],
  // ** Suits
  ["clubs", "\\clubsuit", true, "&clubs;", "[clubs]", "[clubs]", "\u2663"],
  ["clubsuit", "\\clubsuit", true, "&clubs;", "[clubs]", "[clubs]", "\u2663"],
  ["spades", "\\spadesuit", true, "&spades;", "[spades]", "[spades]", "\u2660"],
  ["spadesuit", "\\spadesuit", true, "&spades;", "[spades]", "[spades]", "\u2660"],
  ["hearts", "\\heartsuit", true, "&hearts;", "[hearts]", "[hearts]", "\u2665"],
  [
    "heartsuit",
    "\\heartsuit",
    true,
    "&heartsuit;",
    "[hearts]",
    "[hearts]",
    "\u2665"
  ],
  [
    "diams",
    "\\diamondsuit",
    true,
    "&diams;",
    "[diamonds]",
    "[diamonds]",
    "\u25C6"
  ],
  [
    "diamondsuit",
    "\\diamondsuit",
    true,
    "&diams;",
    "[diamonds]",
    "[diamonds]",
    "\u25C6"
  ],
  [
    "diamond",
    "\\diamondsuit",
    true,
    "&diamond;",
    "[diamond]",
    "[diamond]",
    "\u25C6"
  ],
  [
    "Diamond",
    "\\diamondsuit",
    true,
    "&diamond;",
    "[diamond]",
    "[diamond]",
    "\u25C6"
  ],
  ["loz", "\\lozenge", true, "&loz;", "[lozenge]", "[lozenge]", "\u29EB"],
  ["_ ", "\\hspace*{0.5em}", false, "&ensp;", " ", " ", "\u2002"],
  ["_  ", "\\hspace*{1.0em}", false, "&ensp;&ensp;", "  ", "  ", "\u2002\u2002"],
  [
    "_   ",
    "\\hspace*{1.5em}",
    false,
    "&ensp;&ensp;&ensp;",
    "   ",
    "   ",
    "\u2002\u2002\u2002"
  ],
  [
    "_    ",
    "\\hspace*{2.0em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;",
    "    ",
    "    ",
    "\u2002\u2002\u2002\u2002"
  ],
  [
    "_     ",
    "\\hspace*{2.5em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;",
    "     ",
    "     ",
    "\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_      ",
    "\\hspace*{3.0em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "      ",
    "      ",
    "\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_       ",
    "\\hspace*{3.5em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "       ",
    "       ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_        ",
    "\\hspace*{4.0em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "        ",
    "        ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_         ",
    "\\hspace*{4.5em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "         ",
    "         ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_          ",
    "\\hspace*{5.0em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "          ",
    "          ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_           ",
    "\\hspace*{5.5em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "           ",
    "           ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_            ",
    "\\hspace*{6.0em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "            ",
    "            ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_             ",
    "\\hspace*{6.5em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "             ",
    "             ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_              ",
    "\\hspace*{7.0em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "              ",
    "              ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_               ",
    "\\hspace*{7.5em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "               ",
    "               ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_                ",
    "\\hspace*{8.0em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "                ",
    "                ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_                 ",
    "\\hspace*{8.5em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "                 ",
    "                 ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_                  ",
    "\\hspace*{9.0em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "                  ",
    "                  ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_                   ",
    "\\hspace*{9.5em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "                   ",
    "                   ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ],
  [
    "_                    ",
    "\\hspace*{10.0em}",
    false,
    "&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;",
    "                    ",
    "                    ",
    "\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002\u2002"
  ]
];

// node_modules/uniorg-parse/lib/utils.js
var OrgRegexUtils = class {
  constructor(options) {
    this.options = options;
  }
  /**
   * Regexp matching a citation key. Key is located in match group “key”.
   */
  citationKeyRe() {
    return /@(?<key>[-.:?!`'/*@+|(){}<>&_^$#%~\w]+)/g;
  }
  /**
   * Regexp matching a citation prefix. Style, if any, is located in
   * matching group “style”.
   */
  citationPrefixRe() {
    return /\[cite(?:\/(?<style>[/_a-z0-9-]+))?:[\t\n ]*/gm;
  }
  linkPlainRe() {
    return `${this.linkTypesRe()}([^\\]\\[ 	\\n()<>]+(?:\\([\\w0-9_]+\\)|([^\\W 	\\n]|/)))`;
  }
  linkTypesRe() {
    return "(" + this.options.linkTypes.map(escapeRegExp).join("|") + "):";
  }
  /**
   * Regexp possibly matching the beginning of an object. This regexp
   * allows false positives. Dedicated parser (e.g.,
   * Parser.parseBold()) will take care of further filtering. Radio
   * links are not matched by this regexp, as they are treated
   * specially in Parser.parseElement().
   */
  objectRe() {
    return new RegExp([
      // Sub/superscript.
      "(?:[_^][-{(*+.,\\p{Letter}\\p{Number}])",
      // Bold, code, italic, strike-through, underline
      // and verbatim.
      `[*~=+_/][^${this.options.emphasisRegexpComponents.border}]`,
      // Plain links.
      this.linkPlainRe(),
      // Objects starting with "[": citations,
      // footnote reference, statistics cookie,
      // timestamp (inactive) and regular link.
      [
        "\\[(?:",
        ["cite[:/]", "fn:", "(?:[0-9]|(?:%|/[0-9]*)\\])", "\\["].join("|"),
        ")"
      ].join(""),
      // Objects starting with "@": export snippets.
      "@@",
      // Objects starting with "{": macro.
      "\\{\\{\\{",
      // Objects starting with "<": timestamp (active, diary),
      // target, radio target and angular links.
      `<(?:%%|<|[0-9]|${this.linkTypesRe()})`,
      // Objects starting with "$": latex fragment.
      "\\$",
      // Objects starting with "\": line break, entity, latex
      // fragment.
      "\\\\(?:[a-zA-Z\\[\\(]|\\\\[ \\t]*$|_ +)",
      // Objects starting with raw text: inline Babel source block,
      // inline Babel call.
      "(?:call|src)_"
    ].join("|"), "mu");
  }
  // see (org-item-re)
  listItemRe() {
    return new RegExp(`^((?<indent1>[ \\t]+)\\*|(?<indent2>[ \\t]*)(-|\\+|\\d+\\.|\\d+\\)|\\w\\.|\\w\\)))([ \\t]|\\n)`);
  }
  /// Matches a list item and puts everything into groups:
  /// - indent
  /// - bullet
  /// - counter
  /// - checkbox
  /// - tag (description tag)
  // see org-list-full-item-re
  fullListItemRe() {
    return /^(?<indent>[ \t]*)(?<bullet>(?:[-+*]|(?:[0-9]+|[A-Za-z])[.)])(?:[ \t]+|$))(?<counter_group>\[@(?:start:)?(?<counter>[0-9]+|[A-Za-z])\][ \t]*)?(?<checkbox_group>(?<checkbox>\[[ X-]\])(?:[ \t]+|$))?(?:(?<tag>.*?)[ \t]+::(?:[ \t]+|$))?/im;
  }
  listEndRe() {
    return /^[ \t]*\n[ \t]*\n/m;
  }
  paragraphSeparateRe() {
    const listAllowAlphabetical = true;
    const plainListOrderedItemTerminator = [")", "."];
    const term = `[${plainListOrderedItemTerminator.join("")}]`;
    const alpha = listAllowAlphabetical ? "|[A-Za-z]" : "";
    return new RegExp([
      "^(?:",
      [
        // Headlines, inlinetasks.
        "\\*+ ",
        // Footnote definitions.
        "\\[fn:[-_\\w]+\\]",
        // Diary sexps.
        "%%\\(",
        "[ \\t]*(?:" + [
          // Empty lines.
          "$",
          // Tables (any type).
          "\\|",
          "\\+(?:-+\\+)+[ 	]*$",
          // Comments, keyword-like or block-like constructs.
          // Blocks and keywords with dual values need to be
          // double-checked.
          "#(?: |$|\\+(?:begin_\\S+|\\S+(?:\\[.*\\])?:[ \\t]*))",
          // Drawers (any type) and fixed-width areas. Drawers need
          // to be double-checked.
          ":(?: |$|[-_\\w]+:[ \\t]*$)",
          // Horizontal rules.
          "-{5,}[ \\t]*$",
          // LaTeX environments.
          `\\\\begin\\{([A-Za-z0-9*]+)\\}`,
          // Clock lines.
          `CLOCK:`,
          // Lists.
          `(?:[-+*]|(?:[0-9]+${alpha})${term})(?:[ \\t]|$)`
        ].join("|") + ")"
      ].join("|"),
      ")"
    ].join(""), "mi");
  }
  /** The regular expression matching a sub- or superscript. */
  // Using \p{L}|\d instead of \w because js's \w matches underscore and
  // Emacs's doesn't.
  //
  // Adapted from `org-match-substring-regexp`.
  matchSubstringRegex() {
    return new RegExp(`(\\S)([_^])((?:${this.multibraceRe("\\{", "\\}", this.options.matchSexpDepth, "inBraces")})|(?:${this.multibraceRe("\\(", "\\)", this.options.matchSexpDepth, "inBrackets")})|(?:\\*|[+-]?[\\p{L}\\d.,\\\\]*(?:\\p{L}|\\d)))`, "u");
  }
  /** A regular expression matching a sub- or superscript, forcing braces. */
  // Using \p{L}|\d instead of \w because js's \w matches underscore and
  // Emacs's doesn't.
  //
  // Adapted from `org-match-substring-with-braces-regexp`.
  matchSubstringWithBracesRegex() {
    return new RegExp(`(\\S)([_^])(${this.multibraceRe("\\{", "\\}", this.options.matchSexpDepth, "inBraces")})`, "u");
  }
  /**
   * Compile a regex that matches up to `n` nested groups delimited
   * with `left` and `right`. The content of the outermost group is
   * captured in the regex group `name`.
   *
   * Adapted from `org-create-multibrace-regexp` emacs function.
   */
  multibraceRe(left, right, n, name = "") {
    const nothing = `[^${left}${right}]*?`;
    let next2 = `(?:${nothing}${left}${nothing}${right})+${nothing}`;
    let result = nothing;
    for (let i = 1; i < n; i++) {
      result = `${result}|${next2}`;
      next2 = `(?:${nothing}${left}${next2}${right})+${nothing}`;
    }
    const nameRe = name ? `?<${name}>` : "";
    return `${left}(${nameRe}${result})${right}`;
  }
  emphRe() {
    return this.emphTemplate("*/_+");
  }
  verbatimRe() {
    return this.emphTemplate("=~");
  }
  emphTemplate(s2) {
    const { pre, post, border, newline, body: b } = this.options.emphasisRegexpComponents;
    const body3 = newline <= 0 ? b : `${b}*?(?:\\n${b}*?){0,${newline}}`;
    return new RegExp([
      `([${pre}]|^)`,
      // before markers
      `(([${s2}])([^${border}]|[^${border}]${body3}[^${border}])\\3)`,
      `([${post}]|$)`
      // after markers
    ].join(""));
  }
};
function restrictionFor(type) {
  const allObjects = /* @__PURE__ */ new Set([
    "bold",
    "code",
    "entity",
    "export-snippet",
    "footnote-reference",
    "inline-babel-call",
    "inline-src-block",
    "italic",
    "line-break",
    "latex-fragment",
    "link",
    "macro",
    "radio-target",
    "statistics-cookie",
    "strike-through",
    "subscript",
    "superscript",
    "table-cell",
    "target",
    "timestamp",
    "underline",
    "verbatim",
    "citation",
    "citation-reference"
  ]);
  const minimalSet = /* @__PURE__ */ new Set([
    "bold",
    "code",
    "entity",
    "italic",
    "latex-fragment",
    "strike-through",
    "subscript",
    "superscript",
    "underline",
    "verbatim"
  ]);
  const standardSet = new Set(allObjects);
  standardSet.delete("table-cell");
  standardSet.delete("citation-reference");
  const standardSetNoLineBreak = new Set(standardSet);
  standardSetNoLineBreak.delete("line-break");
  const keywordSet = new Set(standardSet);
  keywordSet.delete("footnote-reference");
  const objectRestrictions = {
    bold: standardSet,
    citation: /* @__PURE__ */ new Set([
      "citation-common-prefix",
      "citation-reference",
      "citation-common-suffix"
    ]),
    "citation-common-prefix": minimalSet,
    "citation-common-suffix": minimalSet,
    "citation-reference": /* @__PURE__ */ new Set([
      "citation-prefix",
      "citation-key",
      "citation-suffix"
    ]),
    "citation-prefix": minimalSet,
    "citation-suffix": minimalSet,
    "footnote-reference": standardSet,
    headline: standardSetNoLineBreak,
    inlinetask: standardSetNoLineBreak,
    italic: standardSet,
    "list-item": standardSetNoLineBreak,
    keyword: keywordSet,
    // Ignore all links in a link description.  Also ignore
    // radio-targets and line breaks.
    link: /* @__PURE__ */ new Set([
      "export-snippet",
      "inline-babel-call",
      "inline-src-block",
      "macro",
      "statistics-cookie",
      ...minimalSet
    ]),
    paragraph: standardSet,
    // Remove any variable object from radio target as it would
    // prevent it from being properly recognized.
    "radio-target": minimalSet,
    "strike-through": standardSet,
    subscript: standardSet,
    superscript: standardSet,
    // Ignore inline babel call and inline source block as formulas
    // are possible.  Also ignore line breaks and statistics
    // cookies.
    "table-cell": /* @__PURE__ */ new Set([
      "citation",
      "export-snippet",
      "footnote-reference",
      "link",
      "macro",
      "radio-target",
      "target",
      "timestamp",
      ...minimalSet
    ]),
    "table-row": /* @__PURE__ */ new Set(["table-cell"]),
    underline: standardSet,
    "verse-block": standardSet
  };
  return objectRestrictions[type];
}
var greaterElements = /* @__PURE__ */ new Set([
  "center-block",
  "drawer",
  "dynamic-block",
  "footnote-definition",
  "inlinetask",
  "list-item",
  "plain-list",
  "property-drawer",
  "quote-block",
  "section",
  "special-block",
  "table"
]);
function unescapeCodeInString(s2) {
  return s2.replace(/^[ \t]*,(,*)(\*|#\+)/gm, "$1$2");
}
function escapeRegExp(s2) {
  return s2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// node_modules/uniorg-parse/lib/parse-options.js
var defaultOptions = {
  todoKeywords: ["TODO", "DONE"],
  useSubSuperscripts: true,
  // Interestingly enough, zero-width space (\u200b) is not considered
  // a space in unicode but is considered a space by Emacs. This is
  // why we have to add \u200b explicitly after \s in the
  // regex. Otherwise, the suggested use-case of adding ZWSP as a
  // markup border does not work.
  emphasisRegexpComponents: {
    // deviates from org mode default to allow ndash, mdash, and
    // quotes (’“”)
    pre: `-\u2013\u2014\\s\u200B\\('\u2019"\u201C\u201D\\{`,
    // deviates from org mode default to allow ndash, mdash, and
    // quotes (’“”)
    post: `-\u2013\u2014\\s\u200B.,:!?;'\u2019"\u201C\u201D\\)\\}\\[`,
    border: "\\s\u200B",
    body: ".",
    newline: 1
  },
  linkTypes: [
    "eww",
    "rmail",
    "mhe",
    "irc",
    "info",
    "gnus",
    "docview",
    "bbdb",
    "w3m",
    "printindex",
    "index",
    "bibentry",
    "Autocites",
    "autocites",
    "supercites",
    "Textcites",
    "textcites",
    "Smartcites",
    "smartcites",
    "footcitetexts",
    "footcites",
    "Parencites",
    "parencites",
    "Cites",
    "cites",
    "fnotecite",
    "Pnotecite",
    "pnotecite",
    "Notecite",
    "notecite",
    "footfullcite",
    "fullcite",
    "citeurl",
    "citedate*",
    "citedate",
    "citetitle*",
    "citetitle",
    "Citeauthor*",
    "Autocite*",
    "autocite*",
    "Autocite",
    "autocite",
    "supercite",
    "parencite*",
    "cite*",
    "Smartcite",
    "smartcite",
    "Textcite",
    "textcite",
    "footcitetext",
    "footcite",
    "Parencite",
    "parencite",
    "Cite",
    "Citeauthor",
    "Citealp",
    "Citealt",
    "Citep",
    "Citet",
    "citeyearpar",
    "citeyear*",
    "citeyear",
    "citeauthor*",
    "citeauthor",
    "citetext",
    "citenum",
    "citealp*",
    "citealp",
    "citealt*",
    "citealt",
    "citep*",
    "citep",
    "citet*",
    "citet",
    "nocite",
    "cite",
    "Cref",
    "cref",
    "autoref",
    "eqref",
    "nameref",
    "pageref",
    "ref",
    "label",
    "list-of-tables",
    "list-of-figures",
    "addbibresource",
    "bibliographystyle",
    "printbibliography",
    "nobibliography",
    "bibliography",
    "Acp",
    "acp",
    "Ac",
    "ac",
    "acrfull",
    "acrlong",
    "acrshort",
    "glslink",
    "glsdesc",
    "glssymbol",
    "Glspl",
    "Gls",
    "glspl",
    "gls",
    "bibtex",
    "roam",
    "notmuch-tree",
    "notmuch-search",
    "notmuch",
    "attachment",
    "id",
    "file+sys",
    "file+emacs",
    "shell",
    "news",
    "mailto",
    "https",
    "http",
    "ftp",
    "help",
    "file",
    "elisp",
    "do"
  ],
  matchSexpDepth: 3,
  trackPosition: false
};

// node_modules/vfile-location/lib/index.js
function location(file) {
  const value = String(file);
  const indices = [];
  return { toOffset, toPoint };
  function toPoint(offset) {
    if (typeof offset === "number" && offset > -1 && offset <= value.length) {
      let index2 = 0;
      while (true) {
        let end = indices[index2];
        if (end === void 0) {
          const eol = next(value, indices[index2 - 1]);
          end = eol === -1 ? value.length + 1 : eol + 1;
          indices[index2] = end;
        }
        if (end > offset) {
          return {
            line: index2 + 1,
            column: offset - (index2 > 0 ? indices[index2 - 1] : 0) + 1,
            offset
          };
        }
        index2++;
      }
    }
  }
  function toOffset(point2) {
    if (point2 && typeof point2.line === "number" && typeof point2.column === "number" && !Number.isNaN(point2.line) && !Number.isNaN(point2.column)) {
      while (indices.length < point2.line) {
        const from = indices[indices.length - 1];
        const eol = next(value, from);
        const end = eol === -1 ? value.length + 1 : eol + 1;
        if (from === end) break;
        indices.push(end);
      }
      const offset = (point2.line > 1 ? indices[point2.line - 2] : 0) + point2.column - 1;
      if (offset < indices[point2.line - 1]) return offset;
    }
  }
}
function next(value, from) {
  const cr = value.indexOf("\r", from);
  const lf = value.indexOf("\n", from);
  if (lf === -1) return cr;
  if (cr === -1 || cr + 1 === lf) return lf;
  return cr < lf ? cr : lf;
}

// node_modules/uniorg-parse/lib/reader.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Reader_text;
var _Reader_vfile;
var _Reader_location;
var _Reader_offset;
var _Reader_left;
var _Reader_right;
var _Reader_narrows;
var Reader = class {
  constructor(vfile2) {
    _Reader_text.set(this, void 0);
    _Reader_vfile.set(this, void 0);
    _Reader_location.set(this, void 0);
    _Reader_offset.set(this, 0);
    _Reader_left.set(this, void 0);
    _Reader_right.set(this, void 0);
    _Reader_narrows.set(this, []);
    __classPrivateFieldSet(this, _Reader_text, vfile2.toString(), "f");
    __classPrivateFieldSet(this, _Reader_left, 0, "f");
    __classPrivateFieldSet(this, _Reader_right, __classPrivateFieldGet(this, _Reader_text, "f").length, "f");
    __classPrivateFieldSet(this, _Reader_vfile, vfile2, "f");
    __classPrivateFieldSet(this, _Reader_location, location(vfile2), "f");
  }
  message(reason, offset, ruleId) {
    const point2 = offset !== void 0 ? __classPrivateFieldGet(this, _Reader_location, "f").toPoint(offset) : void 0;
    __classPrivateFieldGet(this, _Reader_vfile, "f").message(reason, point2, ruleId);
  }
  advance(n) {
    if (!n) {
    } else if (typeof n === "number") {
      __classPrivateFieldSet(this, _Reader_offset, __classPrivateFieldGet(this, _Reader_offset, "f") + n, "f");
    } else if (typeof n === "string") {
      if (this.rest().startsWith(n)) {
        __classPrivateFieldSet(this, _Reader_offset, __classPrivateFieldGet(this, _Reader_offset, "f") + n.length, "f");
      } else {
      }
    } else {
      __classPrivateFieldSet(this, _Reader_offset, __classPrivateFieldGet(this, _Reader_offset, "f") + (n.index + n[0].length), "f");
    }
    return n;
  }
  /**
   * Move cursor backwards.
   */
  backoff(n) {
    __classPrivateFieldSet(this, _Reader_offset, Math.max(__classPrivateFieldGet(this, _Reader_left, "f"), __classPrivateFieldGet(this, _Reader_offset, "f") - n), "f");
  }
  match(regex) {
    return regex.exec(this.rest());
  }
  lookingAt(regex) {
    const m = this.match(regex);
    return m?.index === 0 ? m : null;
  }
  forceMatch(regex) {
    const m = this.match(regex);
    if (!m) {
      throw new Error(`match error: ${regex} against ${JSON.stringify(this.rest())}`);
    }
    return m;
  }
  forceLookingAt(regex) {
    const m = this.lookingAt(regex);
    if (!m) {
      throw new Error(`match (lookingAt) error: ${regex} against ${JSON.stringify(this.rest())}`);
    }
    return m;
  }
  peek(n) {
    return __classPrivateFieldGet(this, _Reader_text, "f").substring(__classPrivateFieldGet(this, _Reader_offset, "f"), __classPrivateFieldGet(this, _Reader_offset, "f") + n);
  }
  line() {
    const rest = this.rest();
    const endl = rest.indexOf("\n");
    return rest.substring(0, endl === -1 ? rest.length : endl + 1);
  }
  rest() {
    return __classPrivateFieldGet(this, _Reader_text, "f").substring(__classPrivateFieldGet(this, _Reader_offset, "f"), __classPrivateFieldGet(this, _Reader_right, "f"));
  }
  /**
   * Returns string at [left, right).
   *
   * Ignores narrowing.
   */
  substring(left, right) {
    return __classPrivateFieldGet(this, _Reader_text, "f").substring(left, right);
  }
  eof() {
    return __classPrivateFieldGet(this, _Reader_offset, "f") >= __classPrivateFieldGet(this, _Reader_right, "f");
  }
  offset() {
    return __classPrivateFieldGet(this, _Reader_offset, "f");
  }
  endOffset() {
    return __classPrivateFieldGet(this, _Reader_right, "f");
  }
  resetOffset(offset) {
    __classPrivateFieldSet(this, _Reader_offset, offset, "f");
  }
  /**
   * Narrows buffer to the region [`left`, `right`).
   *
   * If `preserveOffset` is false (default), also resets cursor to the
   * start of the narrowing region.
   */
  narrow(left, right, preserveOffset = false) {
    __classPrivateFieldGet(this, _Reader_narrows, "f").push({
      prevLeft: __classPrivateFieldGet(this, _Reader_left, "f"),
      prevRight: __classPrivateFieldGet(this, _Reader_right, "f"),
      prevOffset: __classPrivateFieldGet(this, _Reader_offset, "f")
    });
    __classPrivateFieldSet(this, _Reader_left, left, "f");
    __classPrivateFieldSet(this, _Reader_right, right, "f");
    if (!preserveOffset) {
      __classPrivateFieldSet(this, _Reader_offset, left, "f");
    }
  }
  /**
   * Cancels the previous narrowing operation.
   *
   * If `preserveOffset` is false (default), restores the cursor
   * position that was current when the narrowing was invoked.
   */
  widen(preserveOffset = false) {
    const narrow = __classPrivateFieldGet(this, _Reader_narrows, "f").pop();
    if (narrow) {
      __classPrivateFieldSet(this, _Reader_left, narrow.prevLeft, "f");
      __classPrivateFieldSet(this, _Reader_right, narrow.prevRight, "f");
      if (!preserveOffset) {
        __classPrivateFieldSet(this, _Reader_offset, narrow.prevOffset, "f");
      }
    }
  }
  withNarrow(left, right, f) {
    this.narrow(left, right);
    const result = f();
    this.widen();
    return result;
  }
  /**
   * Converts start and end offsets to a position object according to the unist spec.
   */
  positionFromOffsets(startOffset, endOffset) {
    const start = __classPrivateFieldGet(this, _Reader_location, "f").toPoint(startOffset);
    const end = __classPrivateFieldGet(this, _Reader_location, "f").toPoint(endOffset);
    if (!start || !end) {
      return null;
    }
    return { start, end };
  }
};
_Reader_text = /* @__PURE__ */ new WeakMap(), _Reader_vfile = /* @__PURE__ */ new WeakMap(), _Reader_location = /* @__PURE__ */ new WeakMap(), _Reader_offset = /* @__PURE__ */ new WeakMap(), _Reader_left = /* @__PURE__ */ new WeakMap(), _Reader_right = /* @__PURE__ */ new WeakMap(), _Reader_narrows = /* @__PURE__ */ new WeakMap();

// node_modules/uniorg-parse/lib/parser.js
var ParseMode;
(function(ParseMode2) {
  ParseMode2[ParseMode2["TopComment"] = 0] = "TopComment";
  ParseMode2[ParseMode2["Headline"] = 1] = "Headline";
  ParseMode2[ParseMode2["Planning"] = 2] = "Planning";
  ParseMode2[ParseMode2["PropertyDrawer"] = 3] = "PropertyDrawer";
  ParseMode2[ParseMode2["NodeProperty"] = 4] = "NodeProperty";
  ParseMode2[ParseMode2["ListItem"] = 5] = "ListItem";
  ParseMode2[ParseMode2["TableRow"] = 6] = "TableRow";
  ParseMode2[ParseMode2["Default"] = 7] = "Default";
})(ParseMode || (ParseMode = {}));
function parse2(file, options) {
  return new Parser(new VFile(file), options).parse();
}
var Parser = class _Parser {
  constructor(file, options = {}) {
    this.r = new Reader(file);
    this.options = { ...defaultOptions, ...options };
    this.re = new OrgRegexUtils(this.options);
  }
  /**
   * Adds position information to node data when trackPosition is enabled
   */
  addPosition(data, startOffset, endOffset) {
    if (!this.options.trackPosition) {
      return data;
    }
    const position2 = this.r.positionFromOffsets(startOffset, endOffset);
    if (!position2) {
      return data;
    }
    return {
      ...data,
      position: position2
    };
  }
  parse() {
    this.parseEmptyLines();
    const startOffset = 0;
    const children = this.parseElements(ParseMode.TopComment);
    const endOffset = this.r.endOffset();
    return u("org-data", this.addPosition({ contentsBegin: startOffset, contentsEnd: endOffset }, startOffset, endOffset), children);
  }
  // General parsing structure
  parseElements(mode, structure) {
    const elements = [];
    let prevOffset = -1;
    while (!this.r.eof()) {
      const offset = this.r.offset();
      if (offset === prevOffset) {
        console.log("elements:", elements, "rest:", JSON.stringify(this.r.rest()));
        throw new Error("no progress (elements), if you see this, please report an issue to https://github.com/rasendubi/uniorg/issues");
      }
      prevOffset = offset;
      const element2 = this.parseElement(mode, structure);
      const type = element2.type;
      const cbeg = element2.contentsBegin;
      const cend = element2.contentsEnd;
      if (cbeg === void 0 || cend === void 0) {
      } else if (greaterElements.has(type)) {
        this.r.narrow(cbeg, cend);
        appendChildren(element2, this.parseElements(_Parser.nextMode(mode, type, true), element2.type === "plain-list" || element2.type === "list-item" ? (
          // @ts-expect-error Property 'structure' does not exist on type 'OrgData'
          element2.structure
        ) : void 0));
        this.r.widen();
        if (element2.structure) {
          delete element2.structure;
        }
      } else {
        this.r.narrow(cbeg, cend);
        appendChildren(element2, this.parseObjects(restrictionFor(element2.type)));
        this.r.widen();
      }
      elements.push(element2);
      mode = _Parser.nextMode(mode, type, false);
    }
    return elements;
  }
  static nextMode(mode, type, parent) {
    if (parent) {
      if (type === "section")
        return ParseMode.Headline;
      if (type === "inlinetask")
        return ParseMode.Headline;
      if (type === "plain-list")
        return ParseMode.ListItem;
      if (type === "property-drawer")
        return ParseMode.NodeProperty;
      if (type === "table")
        return ParseMode.TableRow;
    } else {
      if (mode === ParseMode.TopComment && type === "comment")
        return ParseMode.PropertyDrawer;
      if (mode === ParseMode.Headline)
        return ParseMode.Planning;
      if (mode === ParseMode.Planning && type === "planning")
        return ParseMode.PropertyDrawer;
      if (mode === ParseMode.ListItem)
        return ParseMode.ListItem;
      if (mode === ParseMode.TableRow)
        return ParseMode.TableRow;
      if (mode === ParseMode.NodeProperty)
        return ParseMode.NodeProperty;
    }
    return ParseMode.Default;
  }
  parseElement(mode, structure) {
    if (mode === ParseMode.ListItem)
      return this.parseListItem(structure);
    if (mode === ParseMode.TableRow)
      return this.parseTableRow();
    if (mode === ParseMode.NodeProperty)
      return this.parseNodeProperty();
    if (mode === ParseMode.Headline)
      return this.parseHeadline();
    if (this.atHeading())
      return this.parseSection();
    const isBeginningOfLine = this.r.offset() === 0 || this.r.substring(this.r.offset() - 1, this.r.offset()) === "\n";
    if (isBeginningOfLine && this.r.lookingAt(/^[ \t]*#(?: |$)/m)) {
      return this.parseComment();
    }
    if (mode === ParseMode.Planning && // TODO: check previous line is headline
    this.r.lookingAt(/^[ \t]*(CLOSED:|DEADLINE:|SCHEDULED:)/)) {
      return this.parsePlanning();
    }
    if ((mode === ParseMode.Planning || // && TODO: check previous line is headline
    (mode === ParseMode.PropertyDrawer || mode === ParseMode.TopComment) && !this.r.lookingAt(/\s*$/m)) && this.r.lookingAt(/^[ \t]*:PROPERTIES:[ \t]*\n(?:[ \t]*:\S+:(?: .*)?[ \t]*\n)*?[ \t]*:END:[ \t]*$/im)) {
      return this.parsePropertyDrawer();
    }
    if (!isBeginningOfLine) {
      return this.parseParagraph({});
    }
    if (this.r.lookingAt(/^[ \t]*CLOCK:/)) {
      return this.parseClock();
    }
    const affiliated = this.parseAffiliatedKeywords();
    if (this.r.lookingAt(latexBeginEnvironmentRe)) {
      return this.parseLatexEnvironment(affiliated);
    }
    if (this.r.lookingAt(drawerRe)) {
      return this.parseDrawer(affiliated);
    }
    if (this.r.lookingAt(/[ \t]*:( |$)/m)) {
      return this.parseFixedWidth(affiliated);
    }
    {
      const offset = this.r.offset();
      if (this.r.advance(this.r.lookingAt(/^[ \t]*#\+/))) {
        const blockM = this.r.lookingAt(/^begin_(\S+)/i);
        if (blockM) {
          this.r.resetOffset(offset);
          const blockType = blockM[1].toLowerCase();
          switch (blockType) {
            case "center":
              return this.parseBlock("center-block", "center", affiliated);
            case "comment":
              return this.parseCommentBlock(affiliated);
            case "example":
              return this.parseExampleBlock(affiliated);
            case "export":
              return this.parseExportBlock(affiliated);
            case "quote":
              return this.parseBlock("quote-block", "quote", affiliated);
            case "src":
              return this.parseSrcBlock(affiliated);
            case "verse":
              return this.parseBlock("verse-block", "verse", affiliated);
            default:
              return this.parseSpecialBlock(affiliated);
          }
        }
        if (this.r.lookingAt(/^\S+:/)) {
          this.r.resetOffset(offset);
          return this.parseKeyword(affiliated);
        }
        this.r.resetOffset(offset);
        return this.parseParagraph(affiliated);
      }
    }
    if (this.r.lookingAt(footnoteDefinitionRe)) {
      return this.parseFootnoteDefinition(affiliated);
    }
    if (this.r.lookingAt(/^[ \t]*-{5,}[ \t]*$/m)) {
      return this.parseHorizontalRule(affiliated);
    }
    if (this.r.lookingAt(/^%%\(/)) {
      return this.parseDiarySexp(affiliated);
    }
    const ruleRe = /[ \t]*\+(-+\+)+[ \t]*$/m;
    if (this.r.lookingAt(/^[ \t]*\|/)) {
      return this.parseTable(affiliated);
    } else if (this.r.lookingAt(ruleRe)) {
      const offset = this.r.offset();
      this.r.advance(this.r.line());
      const nextLineOffset = this.r.offset();
      const firstNonTable = this.r.match(/^[ \t]*($|[^|])/m)?.index ?? null;
      this.r.advance(firstNonTable);
      const isTable = this.r.offset() > nextLineOffset && this.r.lookingAt(ruleRe);
      this.r.resetOffset(offset);
      if (isTable) {
        return this.parseTable(affiliated);
      }
    }
    if (this.r.lookingAt(this.re.listItemRe())) {
      if (structure === void 0) {
        const offset = this.r.offset();
        structure = this.parseListStructure();
        this.r.resetOffset(offset);
      }
      return this.parseList(structure, affiliated);
    }
    return this.parseParagraph(affiliated);
  }
  parseObjects(restriction) {
    const objects = [];
    let prevEnd = this.r.offset();
    while (!this.r.eof()) {
      const prevOffset = this.r.offset();
      const mobject = this.parseObject(restriction);
      if (!mobject)
        break;
      if (this.r.offset() === prevOffset) {
        throw new Error(`no progress (parseObject). If you see this, please report an issue to https://github.com/rasendubi/uniorg/issues with the following information: ${JSON.stringify(mobject)}, text: ${JSON.stringify(this.r.rest())}, objects: ${JSON.stringify(objects, null, 2)}`);
      }
      const [objectBegin, o] = mobject;
      if (objectBegin !== prevEnd) {
        const value = this.r.substring(prevEnd, objectBegin);
        objects.push(u("text", this.addPosition({ value }, prevEnd, objectBegin)));
      }
      const cbeg = o.contentsBegin;
      const cend = o.contentsEnd;
      if (cbeg !== void 0 && cend !== void 0) {
        this.r.narrow(cbeg, cend);
        appendChildren(o, this.parseObjects(restrictionFor(o.type)));
        this.r.widen();
      }
      objects.push(o);
      prevEnd = this.r.offset();
    }
    this.r.resetOffset(prevEnd);
    const text2 = this.r.rest();
    this.r.advance(text2.length);
    if (!text2.match(/^[ \t]*$/)) {
      objects.push(u("text", this.addPosition({ value: text2 }, prevEnd, this.r.offset())));
    }
    return objects;
  }
  parseObject(restriction) {
    if (restriction.has("table-cell")) {
      return [this.r.offset(), this.parseTableCell()];
    }
    if (restriction.has("citation-common-prefix")) {
      restriction.delete("citation-common-prefix");
      const begin = this.r.offset();
      const prefix = this.parseCitationCommonPrefix();
      if (prefix) {
        return [begin, prefix];
      }
    }
    if (restriction.has("citation-reference")) {
      const offset = this.r.offset();
      const ref = this.parseCitationReference();
      if (ref) {
        return [offset, ref];
      }
    }
    if (restriction.has("citation-common-suffix")) {
      restriction.delete("citation-common-suffix");
      const begin = this.r.offset();
      const suffix = this.parseCitationCommonSuffix();
      if (suffix) {
        return [begin, suffix];
      }
    }
    if (restriction.has("citation-prefix")) {
      restriction.delete("citation-prefix");
      const offset = this.r.offset();
      const prefix = this.parseCitationPrefix();
      if (prefix) {
        return [offset, prefix];
      }
    }
    if (restriction.has("citation-key")) {
      restriction.delete("citation-key");
      const offset = this.r.offset();
      const key2 = this.parseCitationKey();
      if (key2) {
        return [offset, key2];
      }
    }
    if (restriction.has("citation-suffix")) {
      restriction.delete("citation-suffix");
      const offset = this.r.offset();
      const suffix = this.parseCitationSuffix();
      if (suffix) {
        return [offset, suffix];
      }
    }
    const objectRe = this.re.objectRe();
    while (!this.r.eof()) {
      const m = this.r.match(objectRe);
      if (!m)
        return null;
      this.r.advance(m.index);
      const begin = this.r.offset();
      const o = this.tryParseObject(restriction);
      if (o) {
        if (begin === this.r.offset()) {
          throw new Error("no progress (tryParseObject). If you see this, please report an issue to https://github.com/rasendubi/uniorg/issues.");
        }
        return [begin, o];
      }
      this.r.resetOffset(begin);
      this.r.advance(1);
    }
    return null;
  }
  tryParseObject(restriction) {
    const c = this.r.peek(2);
    switch (c[0]) {
      case "^":
        if (restriction.has("superscript")) {
          return this.parseSuperscript();
        }
        break;
      case "_":
        const offset = this.r.offset();
        const subscript = restriction.has("subscript") && this.parseSubscript();
        if (subscript) {
          return subscript;
        }
        this.r.resetOffset(offset);
        if (restriction.has("underline")) {
          return this.parseUnderline();
        }
        break;
      case "*":
        if (restriction.has("bold")) {
          return this.parseBold();
        }
        break;
      case "/":
        if (restriction.has("italic")) {
          return this.parseItalic();
        }
        break;
      case "~":
        if (restriction.has("code")) {
          return this.parseCode();
        }
        break;
      case "=":
        if (restriction.has("verbatim")) {
          return this.parseVerbatim();
        }
        break;
      case "+":
        if (restriction.has("strike-through")) {
          return this.parseStrikeThrough();
        }
        break;
      case "@":
        if (restriction.has("export-snippet")) {
          return this.parseExportSnippet();
        }
        break;
      case "$":
        if (restriction.has("latex-fragment")) {
          return this.parseLatexFragment();
        }
        break;
      case "<":
        if (c[1] === "<") {
        } else {
          const offset2 = this.r.offset();
          const ts = restriction.has("timestamp") && this.parseTimestamp();
          if (ts)
            return ts;
          this.r.resetOffset(offset2);
          const link = restriction.has("link") && this.parseLink();
          if (link)
            return link;
          this.r.resetOffset(offset2);
        }
        break;
      case "\\":
        if (c[1] === "\\") {
          if (restriction.has("line-break")) {
            return this.parseLineBreak();
          }
        } else {
          const offset2 = this.r.offset();
          const entity = restriction.has("entity") && this.parseEntity();
          if (entity)
            return entity;
          this.r.resetOffset(offset2);
          const fragment = restriction.has("latex-fragment") && this.parseLatexFragment();
          if (fragment)
            return fragment;
          this.r.resetOffset(offset2);
        }
        break;
      case "[":
        if (c[1] === "[") {
          if (restriction.has("link")) {
            return this.parseLink();
          }
        } else if (c[1] === "f") {
          if (restriction.has("footnote-reference")) {
            return this.parseFootnoteReference();
          }
        } else if (c[1] === "c") {
          if (restriction.has("citation")) {
            return this.parseCitation();
          }
        } else {
          const offset2 = this.r.offset();
          const ts = restriction.has("timestamp") && this.parseTimestamp();
          if (ts)
            return ts;
          this.r.resetOffset(offset2);
          const cookie = restriction.has("statistics-cookie") && this.parseStatisticsCookie();
          if (cookie)
            return cookie;
          this.r.resetOffset(offset2);
        }
        break;
      default:
        if (restriction.has("link")) {
          return this.parseLink();
        }
    }
    return null;
  }
  // Elements parsers
  parseSection() {
    const contentsBegin = this.r.offset();
    const m = this.r.forceLookingAt(/^(\*+)[ \t]/m);
    const level = m[1].length;
    this.r.advance(this.r.line());
    const endOfSubtree = this.r.match(new RegExp(`^\\*{1,${level}}[ \\t]`, "m"));
    const contentsEnd = endOfSubtree ? this.r.offset() + endOfSubtree.index : this.r.endOffset();
    this.r.resetOffset(contentsEnd);
    return u("section", this.addPosition({ contentsBegin, contentsEnd }, contentsBegin, contentsEnd), []);
  }
  parseHeadline() {
    const begin = this.r.offset();
    this.r.advance(this.r.line());
    this.r.narrow(begin, this.r.offset());
    const stars = this.r.advance(this.r.forceLookingAt(/^(\*+)[ \t]+/));
    const level = stars[1].length;
    const todoM = this.r.advance(this.r.lookingAt(new RegExp("^" + this.options.todoKeywords.join("|"))));
    const todoKeyword = todoM?.[0] ?? null;
    this.r.advance(this.r.lookingAt(/^[ \t]*/));
    const priorityM = this.r.advance(this.r.lookingAt(/^\[#.\]/));
    const priority = priorityM?.[0][2] ?? null;
    this.r.advance(this.r.lookingAt(/^[ \t]*/));
    const commented = !!this.r.advance(this.r.lookingAt(/^COMMENT/));
    this.r.advance(this.r.lookingAt(/^[ \t]*/));
    const titleStart = this.r.offset();
    const tagsM = this.r.lookingAt(/^(.*?)[ \t]+:([\p{L}\p{N}_@#%:]+):[ \t]*$/mu);
    const tags = tagsM?.[2].split(":") ?? [];
    const titleEnd = tagsM ? titleStart + tagsM.index + tagsM[1].length : titleStart + this.r.forceLookingAt(/.*/)[0].length;
    const rawValue = this.r.substring(titleStart, titleEnd);
    const contentsBegin = titleStart;
    const contentsEnd = titleEnd;
    this.r.widen();
    this.parseEmptyLines();
    return u("headline", this.addPosition({
      level,
      todoKeyword,
      priority,
      commented,
      rawValue,
      tags,
      contentsBegin,
      contentsEnd
    }, begin, titleEnd), []);
  }
  parsePlanning() {
    this.r.narrow(this.r.offset(), this.r.offset() + this.r.line().length);
    this.r.advance(this.r.match(/^[ \t]*/));
    const begin = this.r.offset();
    let scheduled = null;
    let deadline = null;
    let closed = null;
    while (true) {
      const m = this.r.match(/\b(SCHEDULED:|DEADLINE:|CLOSED:) *[\[<]([^\]>]+)[\]>]/);
      if (!m)
        break;
      this.r.advance(m.index + m[1].length);
      this.r.advance(this.r.match(/^[ \t]*/));
      const keyword = m[1];
      const time = this.parseTimestamp();
      if (keyword === "SCHEDULED:")
        scheduled = time;
      if (keyword === "DEADLINE:")
        deadline = time;
      if (keyword === "CLOSED:")
        closed = time;
    }
    const end = this.r.offset();
    this.r.widen();
    this.r.advance(this.r.line());
    this.parseEmptyLines();
    return u("planning", this.addPosition({ scheduled, deadline, closed }, begin, end));
  }
  parsePropertyDrawer() {
    const begin = this.r.offset();
    this.r.advance(this.r.line());
    const contentsBegin = this.r.offset();
    const endM = this.r.forceMatch(/^[ \t]*:END:[ \t]*$/im);
    this.r.advance(endM.index);
    const contentsEnd = this.r.offset();
    this.r.advance(this.r.line());
    const end = this.r.offset();
    this.parseEmptyLines();
    return u("property-drawer", this.addPosition({ contentsBegin, contentsEnd }, begin, end), []);
  }
  parseBlock(type, pattern, affiliated) {
    const endM = this.r.match(new RegExp(`^[ \\t]*#\\+end_${pattern}[ \\t]*$`, "im"));
    if (!endM) {
      return this.parseParagraph(affiliated);
    }
    const begin = this.r.offset();
    const contentsBegin = begin + this.r.line().length;
    const contentsEnd = begin + endM.index;
    this.r.resetOffset(contentsEnd);
    this.r.advance(this.r.line());
    const end = this.r.offset();
    this.parseEmptyLines();
    return u(type, this.addPosition({ affiliated, contentsBegin, contentsEnd }, begin, end), []);
  }
  parseComment() {
    let valueLines = [];
    this.r.advance(this.r.forceLookingAt(/^[ \t]*# ?/));
    const start = this.r.offset();
    valueLines.push(this.r.advance(this.r.line()));
    while (true) {
      const m = this.r.advance(this.r.lookingAt(/^[ \t]*#( |$)/m));
      if (!m)
        break;
      valueLines.push(this.r.advance(this.r.line()));
    }
    let end = this.r.offset();
    if (this.r.substring(end - 1, end) === "\n") {
      end -= 1;
    }
    let value = valueLines.join("");
    if (value[value.length - 1] === "\n") {
      value = value.substring(0, value.length - 1);
    }
    return u("comment", this.addPosition({ value }, start, end));
  }
  parseFixedWidth(affiliated) {
    let valueLines = [];
    const begin = this.r.offset();
    while (true) {
      const m = this.r.lookingAt(/^[ \t]*: ?(.*)$/m);
      if (!m)
        break;
      this.r.advance(this.r.line());
      valueLines.push(m[1]);
    }
    const value = valueLines.join("\n");
    let end = this.r.offset();
    if (this.r.substring(end - 1, end) === "\n") {
      end -= 1;
    }
    return u("fixed-width", this.addPosition({ affiliated, value }, begin, end));
  }
  parseCommentBlock(affiliated) {
    const comment2 = this.parseBlock("comment-block", "comment", affiliated);
    if (comment2.type !== "comment-block") {
      return comment2;
    }
    const { type: _, contentsBegin, contentsEnd, children, ...rest } = comment2;
    const value = this.r.substring(contentsBegin, contentsEnd);
    return u("comment-block", { ...rest, value, affiliated });
  }
  parseSrcBlock(affiliated) {
    const endM = this.r.match(/^[ \t]*#\+end_src[ \t]*$/im);
    if (!endM) {
      return this.parseParagraph(affiliated);
    }
    const headerM = this.r.forceMatch(/^[ \t]*#\+begin_src(?: +(?<language>\S+))?(?<switches>(?: +(?:-(?:l ".+"|[ikr])|[-+]n(?: *[0-9]+)?))+)?(?<parameters>.*)[ \t]*$/im);
    const { language, switches, parameters } = headerM.groups;
    const begin = this.r.offset();
    const contentsBegin = begin + this.r.line().length;
    const contentsEnd = begin + endM.index;
    const value = unescapeCodeInString(this.r.substring(contentsBegin, contentsEnd));
    this.r.resetOffset(contentsEnd);
    this.r.advance(this.r.line());
    const end = begin + endM.index + endM[0].length;
    this.parseEmptyLines();
    return u("src-block", this.addPosition({
      affiliated,
      language,
      switches: switches?.trim() ?? null,
      // using || to convert empty strings to null as well
      parameters: parameters.trim() || null,
      value
    }, begin, end));
  }
  parseExampleBlock(affiliated) {
    const block = this.parseBlock("example-block", "example", affiliated);
    if (block.type !== "example-block") {
      return block;
    }
    const { type: _, contentsBegin, contentsEnd, children, ...rest } = block;
    const value = this.r.substring(contentsBegin, contentsEnd);
    return u("example-block", { ...rest, value, affiliated });
  }
  parseExportBlock(affiliated) {
    const endM = this.r.match(/^[ \t]*#\+end_export[ \t]*$/im);
    if (!endM) {
      return this.parseParagraph(affiliated);
    }
    const headerM = this.r.match(/^[ \t]*#\+begin_export(?:[ \t]+(\S+))?[ \t]*$/im);
    const backend = headerM?.[1] ?? null;
    const begin = this.r.offset();
    const contentsBegin = begin + this.r.line().length;
    const contentsEnd = begin + endM.index;
    const value = unescapeCodeInString(this.r.substring(contentsBegin, contentsEnd));
    this.r.resetOffset(contentsEnd);
    this.r.advance(this.r.line());
    this.parseEmptyLines();
    const end = begin + endM.index + endM[0].length;
    return u("export-block", this.addPosition({ affiliated, backend, value }, begin, end));
  }
  parseSpecialBlock(affiliated) {
    const blockType = this.r.forceLookingAt(/[ \t]*#\+begin_(\S+)/i)[1];
    const endM = this.r.match(new RegExp(`^[ \\t]*#\\+end_${escapeRegExp(blockType)}[ \\t]*$`, "im"));
    if (!endM) {
      this.r.message("incomplete block", this.r.offset(), "uniorg");
      return this.parseParagraph(affiliated);
    }
    const begin = this.r.offset();
    const contentsBegin = begin + this.r.line().length;
    const contentsEnd = begin + endM.index;
    this.r.resetOffset(contentsEnd);
    this.r.advance(this.r.line());
    this.parseEmptyLines();
    const end = begin + endM.index + endM[0].length;
    return u("special-block", this.addPosition({ affiliated, blockType, contentsBegin, contentsEnd }, begin, end), []);
  }
  parseAffiliatedKeywords() {
    const offset = this.r.offset();
    const result = {};
    while (!this.r.eof()) {
      const keywordM = this.r.lookingAt(affiliatedRe);
      if (!keywordM)
        break;
      const rawKeyword = (keywordM.groups.dualKeyword ?? keywordM.groups.regularKeyword ?? keywordM.groups.attributeKeyword).toUpperCase();
      const keyword = keywordTranslationTable[rawKeyword] ?? rawKeyword;
      const isParsed = parsedKeywords.has(keyword);
      this.r.advance(keywordM);
      this.r.narrow(
        this.r.offset(),
        this.r.offset() + this.r.line().length - 1
        /* don't include newline */
      );
      const mainValue = isParsed ? this.parseObjects(restrictionFor("keyword")) : this.r.rest().trim();
      this.r.widen();
      this.r.advance(this.r.line());
      const isDual = dualKeywords.has(keyword);
      const dualValue = isDual ? keywordM.groups.dualValue ?? null : null;
      const value = dualValue === null ? mainValue : [mainValue, dualValue];
      if (multipleKeywords.has(keyword) || // Attributes can always appear on multiple lines.
      keyword.match(/^ATTR_/)) {
        result[keyword] = result[keyword] || [];
        result[keyword].push(value);
      } else {
        result[keyword] = value;
      }
    }
    if (this.r.lookingAt(/^[ \t]*$/m)) {
      this.r.resetOffset(offset);
      return {};
    }
    return result;
  }
  parseKeyword(affiliated) {
    const m = this.r.forceLookingAt(/[ \t]*#\+(\S+):(.*)/);
    const key2 = m[1].toUpperCase();
    const value = m[2].trim();
    const begin = this.r.offset();
    this.r.advance(this.r.line());
    const end = this.r.offset();
    this.parseEmptyLines();
    return u("keyword", this.addPosition({ affiliated, key: key2, value }, begin, end));
  }
  parseLatexEnvironment(affiliated) {
    const beginOffset = this.r.offset();
    const beginM = this.r.advance(this.r.forceLookingAt(latexBeginEnvironmentRe));
    const name = beginM[1];
    const endM = this.r.match(latexEndEnvironmentRe(name));
    if (!endM) {
      this.r.resetOffset(beginOffset);
      return this.parseParagraph(affiliated);
    }
    this.r.advance(endM);
    const endOffset = this.r.offset();
    this.parseEmptyLines();
    const value = this.r.substring(beginOffset, endOffset);
    return u("latex-environment", this.addPosition({ affiliated, value }, beginOffset, endOffset));
  }
  parseDrawer(affiliated) {
    const start = this.r.offset();
    const endM = this.r.match(/^[ \t]*:END:[ \t]*$/im);
    if (!endM) {
      this.r.message("incomplete drawer", this.r.offset(), "uniorg");
      return this.parseParagraph(affiliated);
    }
    const end = start + endM.index + endM[0].length;
    const contentsEnd = this.r.offset() + endM.index;
    const name = this.r.forceLookingAt(drawerRe)[1];
    this.r.advance(this.r.line());
    const contentsBegin = this.r.offset();
    this.r.resetOffset(contentsEnd);
    this.r.advance(this.r.line());
    this.parseEmptyLines();
    return u("drawer", this.addPosition({ affiliated, name, contentsBegin, contentsEnd }, start, end), []);
  }
  parseClock() {
    const start = this.r.offset();
    this.r.advance(this.r.forceMatch(/^[ \t]*CLOCK:[ \t]*/));
    const value = this.parseTimestamp();
    this.r.advance(this.r.match(/^[ \t]+=>[ \t]*/));
    const durationM = this.r.advance(this.r.lookingAt(/^(\S+)[ \t]*$/m));
    const duration = durationM ? durationM[1] : null;
    const status = duration ? "closed" : "running";
    const end = this.r.offset();
    this.parseEmptyLines();
    return u("clock", this.addPosition({ value, duration, status }, start, end));
  }
  parseNodeProperty() {
    const start = this.r.offset();
    const propertyRe = /^[ \t]*:(?<key>\S+):(?:(?<value1>$)|[ \t]+(?<value2>.*?))[ \t]*$/m;
    const m = this.r.forceLookingAt(propertyRe);
    const key2 = m.groups["key"];
    const value = m.groups["value1"] ?? m.groups["value2"];
    const end = this.r.offset() + m.index + m[0].length;
    this.r.advance(this.r.line());
    return u("node-property", this.addPosition({ key: key2, value }, start, end));
  }
  parseParagraph(affiliated) {
    const begin = this.r.offset();
    const contentsBegin = begin;
    this.r.advance(this.r.line());
    let next2 = null;
    while (next2 = this.r.match(this.re.paragraphSeparateRe())) {
      this.r.advance(next2.index);
      const blockBeginM = this.r.lookingAt(/[ \t]*#\+begin_(\S+)/i);
      if (blockBeginM) {
        const blockEndM = this.r.match(new RegExp(`^[ \\t]*#\\+end_${blockBeginM[1]}[ \\t]*$`, "im"));
        if (!blockEndM) {
          this.r.advance(this.r.line());
          continue;
        }
        break;
      }
      const drawerM = this.r.lookingAt(drawerRe);
      if (drawerM) {
        const endM = this.r.match(/^[ \t]*:END:[ \t]*$/im);
        if (!endM) {
          this.r.advance(this.r.line());
          continue;
        }
        break;
      }
      const latexEnvironmentM = this.r.lookingAt(latexBeginEnvironmentRe);
      if (latexEnvironmentM) {
        const name = latexEnvironmentM[1];
        const endM = this.r.match(latexEndEnvironmentRe(name));
        if (!endM) {
          this.r.advance(this.r.line());
          continue;
        }
        break;
      }
      const dualKeywordM = this.r.lookingAt(/[ \t]*#\+(\S+)\[.*\]:/);
      if (dualKeywordM) {
        if (!dualKeywords.has(dualKeywordM[1].toLowerCase())) {
          this.r.advance(this.r.line());
          continue;
        }
        break;
      }
      break;
    }
    const contentsEnd = next2 ? this.r.offset() : this.r.endOffset();
    const end = contentsEnd;
    this.r.resetOffset(contentsEnd);
    this.parseEmptyLines();
    return u("paragraph", this.addPosition({ affiliated, contentsBegin, contentsEnd }, begin, end), []);
  }
  parseFootnoteDefinition(affiliated) {
    const start = this.r.offset();
    const m = this.r.forceLookingAt(footnoteDefinitionRe);
    const label = m[1];
    const begin = this.r.offset();
    this.r.advance(this.r.line());
    const endM = this.r.match(footnoteDefinitionSeparatorRe);
    this.r.advance(endM?.index);
    let contentsEnd = endM ? this.r.offset() : this.r.endOffset();
    if (endM && endM[0][0] === "[") {
      let lines = this.r.substring(begin, this.r.offset()).split("\n");
      lines = lines.slice(1, lines.length - 1);
      while (lines.length) {
        const line = lines.pop();
        if (line.match(affiliatedRe)?.index === 0) {
          this.r.advance(-line.length - 1);
        } else {
          break;
        }
      }
      contentsEnd = this.r.offset();
    }
    const end = contentsEnd;
    this.r.narrow(begin, contentsEnd);
    this.r.advance(this.r.forceMatch(/\][ \r\t\n]*/m));
    const contentsBegin = this.r.offset();
    this.r.widen();
    this.r.resetOffset(contentsEnd);
    this.parseEmptyLines();
    return u("footnote-definition", this.addPosition({ affiliated, label, contentsBegin, contentsEnd }, start, end), []);
  }
  parseHorizontalRule(affiliated) {
    const start = this.r.offset();
    this.r.advance(this.r.line());
    const end = this.r.offset();
    this.parseEmptyLines();
    return u("horizontal-rule", this.addPosition({ affiliated }, start, end));
  }
  parseDiarySexp(affiliated) {
    const start = this.r.offset();
    const value = this.r.forceLookingAt(/^(%%\(.*)[ \t]*$/m)[1];
    this.r.advance(this.r.line());
    const end = this.r.offset();
    this.parseEmptyLines();
    return u("diary-sexp", this.addPosition({ affiliated, value }, start, end));
  }
  parseTable(affiliated) {
    const start = this.r.offset();
    const contentsBegin = this.r.offset();
    const tableType = this.r.lookingAt(/^[ \t]*\|/) ? "org" : "table.el";
    const endRe = new RegExp(`^[ \\t]*($|[^| \\t${tableType === "org" ? "" : "+"}])`, "m");
    const endM = this.r.match(endRe);
    const contentsEnd = endM ? contentsBegin + endM.index : this.r.endOffset();
    this.r.resetOffset(contentsEnd);
    let tblfm = "";
    while (true) {
      const tblfmM = this.r.lookingAt(/^[ \t]*#\+TBLFM: +(.*?)[ \t]*$/m);
      if (!tblfmM)
        break;
      tblfm = tblfm + tblfmM[1];
      this.r.advance(this.r.line());
    }
    const end = this.r.offset();
    this.parseEmptyLines();
    if (tableType === "org") {
      return u("table", this.addPosition({ tableType, tblfm, contentsBegin, contentsEnd }, start, end), []);
    } else {
      return u("table", this.addPosition({
        affiliated,
        tableType,
        tblfm,
        value: this.r.substring(contentsBegin, contentsEnd)
      }, start, end));
    }
  }
  parseTableRow() {
    const start = this.r.offset();
    const rowType = this.r.lookingAt(/^[ \t]*\|-/) ? "rule" : "standard";
    this.r.advance(this.r.forceMatch(/\|/));
    const contentsBegin = this.r.offset();
    this.r.advance(this.r.forceMatch(/^.*?[ \t]*$/m));
    const end = this.r.offset();
    const contentsEnd = rowType === "rule" ? contentsBegin : this.r.offset();
    this.r.advance(this.r.line());
    return u("table-row", this.addPosition({ rowType, contentsBegin, contentsEnd }, start, end), []);
  }
  parseTableCell() {
    const start = this.r.offset();
    this.r.advance(this.r.forceLookingAt(/^[ \t]*/));
    const contentsBegin = this.r.offset();
    const m = this.r.advance(this.r.forceLookingAt(/(.*?)[ \t]*(?:\||$)/m));
    const contentsEnd = contentsBegin + m[1].length;
    const end = contentsBegin + m[0].length;
    return u("table-cell", this.addPosition({ contentsBegin, contentsEnd }, start, end), []);
  }
  parseList(structure, affiliated) {
    const start = this.r.offset();
    const contentsBegin = this.r.offset();
    const item = structure.find((x) => x.begin === contentsBegin);
    if (!item) {
      throw new Error(`parseList: cannot find item. contentsBegin: ${contentsBegin}, structure: ${JSON.stringify(structure, null, 2)}`);
    }
    const indent = item.indent;
    const listType = item.tag ? "descriptive" : "-+*".includes(item.bullet[0]) ? "unordered" : "ordered";
    let pos = item.end;
    while (true) {
      const next2 = structure.find((x) => x.begin === pos && x.indent === indent);
      if (!next2)
        break;
      pos = next2.end;
    }
    const contentsEnd = pos;
    this.r.resetOffset(contentsEnd);
    const end = this.r.offset();
    return u("plain-list", this.addPosition({
      affiliated,
      indent,
      listType,
      contentsBegin,
      contentsEnd,
      // Exposing structure here is temporary as it gets removed in parseElements(). It is only exposed so
      // that parseElements() can pick it up and use it for parsing list items.
      structure
    }, start, end), []);
  }
  parseListItem(structure) {
    const start = this.r.offset();
    const m = this.r.advance(this.r.forceMatch(this.re.fullListItemRe()));
    const bullet = m.groups.bullet;
    const counter = m.groups.counter ?? null;
    const checkbox = m.groups.checkbox === "[ ]" ? "off" : m.groups.checkbox?.toLowerCase() === "[x]" ? "on" : m.groups.checkbox === "[-]" ? "trans" : null;
    const item = structure.find((x) => x.begin === start);
    const contentsBegin = this.r.offset();
    const contentsEnd = item.end;
    this.r.resetOffset(contentsEnd);
    const end = this.r.offset();
    return u("list-item", this.addPosition({
      indent: item.indent,
      bullet,
      counter,
      checkbox,
      contentsBegin,
      contentsEnd,
      structure
    }, start, end), item.tag ? [item.tag] : []);
  }
  parseListStructure() {
    const items = [];
    const struct = [];
    while (true) {
      if (this.r.eof() || this.r.match(this.re.listEndRe())?.index === 0) {
        break;
      }
      const m = this.r.match(this.re.listItemRe());
      if (m) {
        const indent = (m.groups.indent1?.length || 0) + (m.groups.indent2?.length || 0);
        while (items.length && items[items.length - 1].indent >= indent) {
          const item2 = items.pop();
          item2.end = this.r.offset();
          struct.push(item2);
        }
        const fullM = this.r.forceMatch(this.re.fullListItemRe());
        const { bullet, counter, checkbox } = fullM.groups;
        if (indent === 0 && bullet.startsWith("*")) {
          break;
        }
        let tag = null;
        if (fullM.groups.tag !== void 0) {
          const tagStartOffset = this.r.offset() + (fullM.groups.indent?.length ?? 0) + (fullM.groups.bullet?.length ?? 0) + (fullM.groups.counter_group?.length ?? 0) + (fullM.groups.checkbox_group?.length ?? 0);
          const tagStopOffset = tagStartOffset + fullM.groups.tag.length;
          this.r.narrow(tagStartOffset, tagStopOffset);
          tag = u("list-item-tag", {}, this.parseObjects(restrictionFor("list-item")));
          this.r.widen();
        }
        const item = {
          begin: this.r.offset(),
          indent,
          bullet,
          counter: counter ?? null,
          checkbox: checkbox ?? null,
          tag,
          // will be overwritten later
          end: this.r.offset()
        };
        items.push(item);
        this.r.advance(this.r.line());
      } else if (this.r.match(/^[ \t]*\n/)) {
        this.r.advance(this.r.line());
      } else {
        const indent = this.r.forceLookingAt(/^[ \t]*/)[0].length;
        while (items.length && items[items.length - 1].indent >= indent) {
          const item = items.pop();
          item.end = this.r.offset();
          struct.push(item);
        }
        if (!items.length) {
          break;
        }
        const mBlock = this.r.lookingAt(/[ \t]*#\+begin(:|_\S+)/i);
        if (mBlock) {
          this.r.advance(this.r.match(new RegExp(`^[ \\t]*#\\+end${mBlock[1]}[ \\t]*`, "im")));
        } else if (this.r.lookingAt(drawerRe)) {
          this.r.advance(this.r.match(/^[ \t]*:END:[ \t]*$/im));
        }
        this.r.advance(this.r.line());
      }
    }
    this.parseEmptyLines();
    const end = this.r.offset();
    items.forEach((item) => {
      item.end = end;
    });
    struct.push(...items);
    return struct.sort((a, b) => a.begin - b.begin);
  }
  // Object parsers.
  parseSuperscript() {
    if (!this.options.useSubSuperscripts) {
      return null;
    }
    this.r.backoff(1);
    const start = this.r.offset();
    const m = this.r.advance(this.r.lookingAt(this.options.useSubSuperscripts === "{}" ? this.re.matchSubstringWithBracesRegex() : this.re.matchSubstringRegex()));
    if (!m)
      return null;
    const inside = m.groups["inBraces"] || m.groups["inBrackets"];
    const begin = start + m[1].length;
    const contentsBegin = begin + m[2].length + (inside ? 1 : 0);
    const contentsEnd = begin + m[2].length + m[3].length - (inside ? 1 : 0);
    const end = this.r.offset();
    return u("superscript", this.addPosition({ contentsBegin, contentsEnd }, begin, end), []);
  }
  parseSubscript() {
    if (!this.options.useSubSuperscripts) {
      return null;
    }
    this.r.backoff(1);
    const start = this.r.offset();
    const m = this.r.advance(this.r.lookingAt(this.options.useSubSuperscripts === "{}" ? this.re.matchSubstringWithBracesRegex() : this.re.matchSubstringRegex()));
    if (!m)
      return null;
    const inside = m.groups["inBraces"] || m.groups["inBrackets"];
    const begin = start + m[1].length;
    const contentsBegin = begin + m[2].length + (inside ? 1 : 0);
    const contentsEnd = begin + m[2].length + m[3].length - (inside ? 1 : 0);
    const end = this.r.offset();
    return u("subscript", this.addPosition({ contentsBegin, contentsEnd }, begin, end), []);
  }
  parseUnderline() {
    const start = this.r.offset();
    this.r.backoff(1);
    const m = this.r.lookingAt(this.re.emphRe());
    if (!m)
      return null;
    const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
    const contentsEnd = contentsBegin + m[4].length;
    this.r.resetOffset(contentsEnd + 1);
    const end = this.r.offset();
    return u("underline", this.addPosition({ contentsBegin, contentsEnd }, start, end), []);
  }
  parseBold() {
    const start = this.r.offset();
    this.r.backoff(1);
    const m = this.r.lookingAt(this.re.emphRe());
    if (!m)
      return null;
    const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
    const contentsEnd = contentsBegin + m[4].length;
    this.r.resetOffset(contentsEnd + 1);
    const end = this.r.offset();
    return u("bold", this.addPosition({ contentsBegin, contentsEnd }, start, end), []);
  }
  parseItalic() {
    const start = this.r.offset();
    this.r.backoff(1);
    const m = this.r.lookingAt(this.re.emphRe());
    if (!m)
      return null;
    const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
    const contentsEnd = contentsBegin + m[4].length;
    this.r.resetOffset(contentsEnd + 1);
    const end = this.r.offset();
    return u("italic", this.addPosition({ contentsBegin, contentsEnd }, start, end), []);
  }
  parseCode() {
    const start = this.r.offset();
    this.r.backoff(1);
    const m = this.r.lookingAt(this.re.verbatimRe());
    if (!m)
      return null;
    const value = m[4];
    const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
    const contentsEnd = contentsBegin + m[4].length;
    this.r.resetOffset(contentsEnd + 1);
    const end = this.r.offset();
    return u("code", this.addPosition({ value }, start, end), []);
  }
  parseVerbatim() {
    const start = this.r.offset();
    this.r.backoff(1);
    const m = this.r.lookingAt(this.re.verbatimRe());
    if (!m)
      return null;
    const value = m[4];
    const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
    const contentsEnd = contentsBegin + m[4].length;
    this.r.resetOffset(contentsEnd + 1);
    const end = this.r.offset();
    return u("verbatim", this.addPosition({ value }, start, end), []);
  }
  parseStrikeThrough() {
    const start = this.r.offset();
    this.r.backoff(1);
    const m = this.r.lookingAt(this.re.emphRe());
    if (!m)
      return null;
    const contentsBegin = this.r.offset() + m.index + m[1].length + m[3].length;
    const contentsEnd = contentsBegin + m[4].length;
    this.r.resetOffset(contentsEnd + 1);
    const end = this.r.offset();
    return u("strike-through", this.addPosition({ contentsBegin, contentsEnd }, start, end), []);
  }
  parseStatisticsCookie() {
    const begin = this.r.offset();
    const m = this.r.advance(this.r.lookingAt(/\[[0-9]*(\%|\/[0-9]*)\]/));
    if (!m)
      return null;
    const end = this.r.offset();
    const value = this.r.substring(begin, end);
    const postBlank = this.r.advance(this.r.forceLookingAt(/\s*/))[0].length;
    return u("statistics-cookie", this.addPosition({ begin, end, value, postBlank }, begin, end));
  }
  parseEntity() {
    const start = this.r.offset();
    const m = this.r.advance(this.r.lookingAt(/^\\(?:(?<value1>_ +)|(?<value2>there4|sup[123]|frac[13][24]|[a-zA-Z]+)(?<brackets>$|\{\}|\P{Letter}))/mu));
    if (!m)
      return null;
    const hasBrackets = m.groups.brackets === "{}";
    if (m.groups.brackets && !hasBrackets) {
      this.r.backoff(m.groups.brackets.length);
    }
    const end = this.r.offset();
    const value = getOrgEntity(m.groups.value1 ?? m.groups.value2);
    if (!value)
      return null;
    return u("entity", this.addPosition({ useBrackets: hasBrackets, ...value }, start, end));
  }
  parseExportSnippet() {
    const start = this.r.offset();
    const m = this.r.advance(this.r.lookingAt(/@@([-A-Za-z0-9]+):/));
    if (!m)
      return null;
    const backEnd = m[1];
    const contentsBegin = this.r.offset();
    const mend = this.r.advance(this.r.match(/@@/));
    if (!mend)
      return null;
    const end = this.r.offset();
    const contentsEnd = end - 2;
    const value = this.r.substring(contentsBegin, contentsEnd);
    return u("export-snippet", this.addPosition({ backEnd, value }, start, end));
  }
  parseLatexFragment() {
    const begin = this.r.offset();
    const prefix = this.r.peek(2);
    let contents = null;
    if (prefix[0] !== "$") {
      switch (prefix[1]) {
        case "(":
          this.r.advance(this.r.match(/\\\)/));
          contents = this.r.substring(begin + 2, this.r.offset() - 2);
          break;
        case "[":
          this.r.advance(this.r.match(/\\\]/));
          contents = this.r.substring(begin + 2, this.r.offset() - 2);
          break;
        default: {
          const m = this.r.advance(this.r.lookingAt(/^\\[a-zA-Z]+\*?((\[[^\]\[\n{}]*\])|(\{[^{}\n]*\}))*/));
          contents = m?.[0];
        }
      }
    } else if (prefix[1] === "$") {
      const m = this.r.advance(this.r.match(/\$\$((?:.|\n)*?)\$\$/m));
      contents = m?.[1];
    } else {
      const charBefore = this.r.substring(this.r.offset() - 1, this.r.offset());
      if (charBefore !== "$" && !" 	\n,.;".includes(prefix[1]) && (contents = this.r.advance(this.r.match(/\$((?:.|\n)*?)\$/m))?.[1]) && !" 	\n,.".includes(this.r.substring(this.r.offset() - 1, this.r.offset())) && this.r.lookingAt(/^(\p{Punctuation}|\p{White_Space}|\p{Open_Punctuation}|\p{Close_Punctuation}|\\"|'|$)/mu)) {
      } else {
        return null;
      }
    }
    const end = this.r.offset();
    if (begin === end)
      return null;
    const value = this.r.substring(begin, end);
    return u("latex-fragment", this.addPosition({ value, contents: contents ?? value }, begin, end));
  }
  parseLineBreak() {
    const start = this.r.offset();
    const m = this.r.lookingAt(/\\\\[ \t]*$/m);
    if (!m)
      return null;
    this.r.backoff(1);
    if (this.r.peek(1) === "\\")
      return null;
    const end = start + m[0].length;
    this.r.advance(this.r.line());
    return u("line-break", this.addPosition({}, start, end));
  }
  parseFootnoteReference() {
    const begin = this.r.offset();
    const m = this.r.match(footnoteRe);
    if (!m)
      return null;
    const advanceToClosingBracket = () => {
      while (true) {
        const m2 = this.r.advance(this.r.match(/[\[\]]/));
        if (!m2)
          return false;
        if (m2[0] == "[") {
          const closed2 = advanceToClosingBracket();
          if (!closed2)
            return false;
        }
        return true;
      }
    };
    const closed = advanceToClosingBracket();
    if (!closed)
      return null;
    const end = this.r.offset();
    const contentsBegin = begin + m.index + m[0].length;
    const contentsEnd = end - 1;
    const footnoteType = m.groups.inline ? "inline" : "standard";
    const label = footnoteType === "inline" ? m.groups.label_inline ?? null : m.groups.label;
    if (footnoteType === "inline") {
      return u("footnote-reference", this.addPosition({ label, footnoteType, contentsBegin, contentsEnd }, begin, end), []);
    } else {
      return u("footnote-reference", this.addPosition({ label, footnoteType }, begin, end), []);
    }
  }
  parseCitation() {
    const start = this.r.offset();
    let m = this.r.lookingAt(this.re.citationPrefixRe());
    if (!m)
      return null;
    const begin = this.r.offset();
    const style2 = m.groups["style"];
    const contentsBegin = begin + m[0].length;
    const end = this.scanLists();
    if (end === null)
      return null;
    const contentsEnd = end - 1;
    this.r.narrow(begin, end);
    const mKey = this.r.match(this.re.citationKeyRe());
    this.r.widen();
    if (!mKey) {
      return null;
    }
    this.r.resetOffset(end);
    const cite = this.addPosition({
      type: "citation",
      style: style2,
      begin,
      end,
      prefix: null,
      suffix: null,
      contentsBegin,
      contentsEnd,
      children: []
    }, start, end);
    return cite;
  }
  parseCitationCommonPrefix() {
    const begin = this.r.offset();
    const contentsBegin = begin;
    const mKey = this.r.match(this.re.citationKeyRe());
    if (!mKey)
      return null;
    const firstKeyEnd = begin + mKey.index + mKey[0].length;
    const contentsEnd = this.r.withNarrow(begin, firstKeyEnd, () => {
      const m = this.r.rest().lastIndexOf(";");
      return m !== -1 ? this.r.offset() + m : null;
    });
    if (contentsEnd === null) {
      return null;
    }
    const end = contentsEnd + ";".length;
    const prefix = this.addPosition({
      type: "citation-common-prefix",
      contentsBegin,
      contentsEnd,
      children: []
    }, begin, end);
    this.r.resetOffset(end);
    return prefix;
  }
  parseCitationReference() {
    const begin = this.r.offset();
    const contentsBegin = begin;
    const m = this.r.match(this.re.citationKeyRe());
    if (!m)
      return null;
    const key2 = m.groups["key"];
    this.r.advance(m.index);
    const mSeparator = this.r.match(/;/);
    const separator = mSeparator ? this.r.offset() + mSeparator.index : null;
    const contentsEnd = separator ?? this.r.endOffset();
    const end = separator ? separator + 1 : this.r.endOffset();
    const reference = this.addPosition({
      type: "citation-reference",
      key: key2,
      begin,
      end,
      contentsBegin,
      contentsEnd,
      children: []
    }, begin, end);
    this.r.resetOffset(end);
    return reference;
  }
  parseCitationPrefix() {
    const begin = this.r.offset();
    const contentsBegin = begin;
    const m = this.r.match(this.re.citationKeyRe());
    if (!m)
      return null;
    this.r.advance(m.index);
    const end = this.r.offset();
    const contentsEnd = end;
    if (begin === end)
      return null;
    const prefix = this.addPosition({
      type: "citation-prefix",
      contentsBegin,
      contentsEnd,
      children: []
    }, begin, end);
    return prefix;
  }
  parseCitationCommonSuffix() {
    const contentsBegin = this.r.offset();
    const contentsEnd = this.r.endOffset();
    if (contentsBegin === contentsEnd)
      return null;
    this.r.resetOffset(contentsEnd);
    return this.addPosition({
      type: "citation-common-suffix",
      contentsBegin,
      contentsEnd,
      children: []
    }, contentsBegin, contentsEnd);
  }
  parseCitationKey() {
    const start = this.r.offset();
    const m = this.r.match(this.re.citationKeyRe());
    if (!m)
      return null;
    this.r.advance(m);
    const end = this.r.offset();
    const key2 = m.groups["key"];
    return this.addPosition({
      type: "citation-key",
      key: key2
    }, start, end);
  }
  parseCitationSuffix() {
    const contentsBegin = this.r.offset();
    const contentsEnd = this.r.endOffset();
    if (contentsBegin === contentsEnd)
      return null;
    this.r.resetOffset(contentsEnd);
    return this.addPosition({
      type: "citation-suffix",
      contentsBegin,
      contentsEnd,
      children: []
    }, contentsBegin, contentsEnd);
  }
  scanLists() {
    const start = this.r.offset();
    let depth = 0;
    do {
      const m = this.r.advance(this.r.match(/[()[\]]/g));
      if (!m)
        break;
      if (m[0] === "(" || m[0] === "[") {
        depth += 1;
      } else {
        depth -= 1;
      }
    } while (depth !== 0);
    const end = this.r.offset();
    this.r.resetOffset(start);
    return depth === 0 ? end : (
      // didn't find matching closing parenthesis
      null
    );
  }
  parseLink() {
    const initialOffset = this.r.offset();
    const linkBracketRe = /\[\[(?<link>([^\[\]]|\\(\\\\)*[\[\]]|\\+[^\[\]])+)\](\[(?<text>[\s\S]+?)\])?\]/m;
    const bracketM = this.r.advance(this.r.lookingAt(linkBracketRe));
    if (bracketM) {
      const m = bracketM;
      const contents = {};
      if (m.groups.text) {
        const contentsBegin = contents.contentsBegin = initialOffset + 2 + m.groups.link.length + 2;
        contents.contentsEnd = contentsBegin + m.groups.text.length;
      }
      const rawLink = m.groups.link.replace(/[ \t]*\n[ \t]*/m, " ").replace(/(\\+)([\[\]])/g, (p1, p2) => "\\".repeat(p1.length / 2) + p2);
      const { linkType, path } = this.linkType(rawLink);
      return u("link", this.addPosition({
        format: "bracket",
        linkType,
        rawLink,
        path,
        ...contents
      }, initialOffset, this.r.offset()), []);
    }
    const linkPlainRe = new RegExp(`\\b${this.re.linkTypesRe()}([^\\][ \\t\\n()<>]+(?:([\\w0-9_]+)|([^\\p{Punctuation} \\t\\n]|/)))`, "u");
    const plainM = this.r.advance(this.r.lookingAt(linkPlainRe));
    if (plainM) {
      const m = plainM;
      return u("link", this.addPosition({
        format: "plain",
        linkType: m[1],
        rawLink: m[0],
        path: m[2]
      }, initialOffset, this.r.offset()), []);
    }
    const linkAngleRe = new RegExp(`<${this.re.linkTypesRe()}([^>\\n]*(?:\\n[ \\t]*[^> \\t\\n][^>\\n]*)*)>`);
    const angularM = this.r.advance(this.r.lookingAt(linkAngleRe));
    if (angularM) {
      const m = angularM;
      const linkType = m[1];
      const rawLink = m[0].substring(1, m[0].length - 1);
      const path = m[2].replace(/[ \t]*\n[ \t]*/g, "");
      return u("link", this.addPosition({ format: "angle", linkType, rawLink, path }, initialOffset, this.r.offset()), []);
    }
    return null;
  }
  linkType(link) {
    if (link.startsWith("/") || link.match(/^\.\.?\//)) {
      return { linkType: "file", path: link };
    }
    const m = link.match(new RegExp(`^${this.re.linkTypesRe()}`));
    if (m) {
      return { linkType: m[1], path: link.slice(m[0].length) };
    }
    if (link.startsWith("(") && link.endsWith(")")) {
      return { linkType: "coderef", path: link.slice(1, link.length - 1) };
    }
    if (link.startsWith("#")) {
      return { linkType: "custom-id", path: link.slice(1) };
    }
    return { linkType: "fuzzy", path: link };
  }
  parseTimestamp() {
    const tsInternalRe = "\\d{4}-\\d{2}-\\d{2}(:? .*?)?";
    const tsBothRe = `[\\[<](` + tsInternalRe + `)[\\]>]`;
    const timestampRe = new RegExp([
      tsBothRe,
      "(?:<[0-9]+-[0-9]+-[0-9]+[^>\\n]+?\\+[0-9]+[dwmy]>)",
      "(?:<%%(?:([^>\\n]+))>)"
    ].join("|"));
    if (!this.r.lookingAt(timestampRe))
      return null;
    const contentsBegin = this.r.offset();
    const active = this.r.substring(this.r.offset(), this.r.offset() + 1) === "<";
    const m = this.r.advance(this.r.match(/^([<[](%%)?.*?)[\]>](?:--([<[].*?[\]>]))?/));
    if (!m)
      return null;
    const rawValue = m[0];
    const dateStart = m[1];
    const dateEnd = m[3];
    const diary = !!m[2];
    let timeRange = null;
    if (!diary) {
      const timeM = dateStart.match(/[012]?[0-9]:[0-5][0-9](-([012]?[0-9]):([0-5][0-9]))/);
      if (timeM) {
        timeRange = { hour: Number(timeM[2]), minute: Number(timeM[3]) };
      }
    }
    const timestampType = diary ? "diary" : active && (dateEnd || timeRange) ? "active-range" : active ? "active" : dateEnd || timeRange ? "inactive-range" : "inactive";
    const start = diary ? null : _Parser.parseDate(dateStart);
    const end = !start ? null : dateEnd ? _Parser.parseDate(dateEnd) : timeRange ? { ...start, ...timeRange } : null;
    const contentsEnd = this.r.offset();
    return u("timestamp", this.addPosition({
      timestampType,
      rawValue,
      start,
      end
    }, contentsBegin, contentsEnd));
  }
  // Helpers
  static parseDate(s2) {
    const m = s2.match(/(([0-9]{4})-([0-9]{2})-([0-9]{2})( +[^\]+0-9>\r\n -]+)?( +([0-9]{1,2}):([0-9]{2}))?)/);
    if (!m)
      return null;
    return {
      year: Number(m[2]),
      month: Number(m[3]),
      day: Number(m[4]),
      hour: m[7] ? Number(m[7]) : null,
      minute: m[8] ? Number(m[8]) : null
    };
  }
  parseEmptyLines() {
    return _Parser.parseMulti(() => {
      const line = this.r.line();
      if (line.trim().length === 0) {
        this.r.advance(line.length);
        return line;
      }
      return null;
    });
  }
  static parseMulti(parse5) {
    const result = [];
    for (let x = parse5(); x; x = parse5()) {
      result.push(x);
    }
    return result;
  }
  atHeading() {
    return this.r.lookingAt(/^\*+[ \t]/) !== null;
  }
};
var drawerRe = /^[ \t]*:((?:\w|[-_])+):[ \t]*$/m;
var latexBeginEnvironmentRe = /^[ \t]*\\begin\{([A-Za-z0-9*]+)\}/i;
var latexEndEnvironmentRe = (name) => new RegExp(`\\\\end\\{${escapeRegExp(name)}\\}[ \\t]*$`, "mi");
var affiliatedKeywords = [
  "CAPTION",
  "DATA",
  "HEADER",
  "HEADERS",
  "LABEL",
  "NAME",
  "PLOT",
  "RESNAME",
  "RESULT",
  "RESULTS",
  "SOURCE",
  "SRCNAME",
  "TBLNAME"
];
var dualKeywords = /* @__PURE__ */ new Set(["RESULTS", "CAPTION"]);
var parsedKeywords = /* @__PURE__ */ new Set(["CAPTION"]);
var multipleKeywords = /* @__PURE__ */ new Set(["CAPTION", "HEADER"]);
var keywordTranslationTable = {
  DATA: "NAME",
  LABEL: "NAME",
  RESNAME: "NAME",
  SOURCE: "NAME",
  SRCNAME: "NAME",
  TBLNAME: "NAME",
  RESULT: "RESULTS",
  HEADERS: "HEADER"
};
var affiliatedRe = new RegExp([
  "[ \\t]*#\\+(?:",
  [
    // Dual affiliated keywords.
    `(?<dualKeyword>${[...dualKeywords].join("|")})(?:\\[(?<dualValue>.*)\\])?`,
    // Regular affiliated keywords.
    `(?<regularKeyword>${affiliatedKeywords.filter((x) => !dualKeywords.has(x)).join("|")})`,
    // Export attributes.
    `(?<attributeKeyword>ATTR_[-_A-Za-z0-9]+)`
  ].join("|"),
  "):[ \\t]*"
].join(""), "i");
var footnoteRe = /\[fn:(?:(?<label_inline>[-_\w]+)?(?<inline>:)|(?<label>[-_\w]+)\])/;
var footnoteDefinitionRe = /^\[fn:([-_\w]+)\]/;
var footnoteDefinitionSeparatorRe = /^\*|^\[fn:([-_\w]+)\]|^([ \t]*\n){2,}/m;
function appendChildren(node, children) {
  if ("children" in node) {
    const newChildren = [...node.children ?? [], ...children];
    node.children = newChildren;
  }
}

// node_modules/uniorg-parse/lib/unified-org-parse.js
var orgParse = function orgParse2(options = {}) {
  const parser = (_doc, file) => {
    return parse2(file, options);
  };
  Object.assign(this, { Parser: parser });
};
var unified_org_parse_default = orgParse;

// node_modules/property-information/lib/util/schema.js
var Schema = class {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(property, normal, space) {
    this.normal = normal;
    this.property = property;
    if (space) {
      this.space = space;
    }
  }
};
Schema.prototype.normal = {};
Schema.prototype.property = {};
Schema.prototype.space = void 0;

// node_modules/property-information/lib/util/merge.js
function merge(definitions, space) {
  const property = {};
  const normal = {};
  for (const definition of definitions) {
    Object.assign(property, definition.property);
    Object.assign(normal, definition.normal);
  }
  return new Schema(property, normal, space);
}

// node_modules/property-information/lib/normalize.js
function normalize(value) {
  return value.toLowerCase();
}

// node_modules/property-information/lib/util/info.js
var Info = class {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(property, attribute) {
    this.attribute = attribute;
    this.property = property;
  }
};
Info.prototype.attribute = "";
Info.prototype.booleanish = false;
Info.prototype.boolean = false;
Info.prototype.commaOrSpaceSeparated = false;
Info.prototype.commaSeparated = false;
Info.prototype.defined = false;
Info.prototype.mustUseProperty = false;
Info.prototype.number = false;
Info.prototype.overloadedBoolean = false;
Info.prototype.property = "";
Info.prototype.spaceSeparated = false;
Info.prototype.space = void 0;

// node_modules/property-information/lib/util/types.js
var types_exports = {};
__export(types_exports, {
  boolean: () => boolean,
  booleanish: () => booleanish,
  commaOrSpaceSeparated: () => commaOrSpaceSeparated,
  commaSeparated: () => commaSeparated,
  number: () => number,
  overloadedBoolean: () => overloadedBoolean,
  spaceSeparated: () => spaceSeparated
});
var powers = 0;
var boolean = increment();
var booleanish = increment();
var overloadedBoolean = increment();
var number = increment();
var spaceSeparated = increment();
var commaSeparated = increment();
var commaOrSpaceSeparated = increment();
function increment() {
  return 2 ** ++powers;
}

// node_modules/property-information/lib/util/defined-info.js
var checks = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(types_exports)
);
var DefinedInfo = class extends Info {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(property, attribute, mask, space) {
    let index2 = -1;
    super(property, attribute);
    mark(this, "space", space);
    if (typeof mask === "number") {
      while (++index2 < checks.length) {
        const check = checks[index2];
        mark(this, checks[index2], (mask & types_exports[check]) === types_exports[check]);
      }
    }
  }
};
DefinedInfo.prototype.defined = true;
function mark(values, key2, value) {
  if (value) {
    values[key2] = value;
  }
}

// node_modules/property-information/lib/util/create.js
function create(definition) {
  const properties = {};
  const normals = {};
  for (const [property, value] of Object.entries(definition.properties)) {
    const info = new DefinedInfo(
      property,
      definition.transform(definition.attributes || {}, property),
      value,
      definition.space
    );
    if (definition.mustUseProperty && definition.mustUseProperty.includes(property)) {
      info.mustUseProperty = true;
    }
    properties[property] = info;
    normals[normalize(property)] = property;
    normals[normalize(info.attribute)] = property;
  }
  return new Schema(properties, normals, definition.space);
}

// node_modules/property-information/lib/aria.js
var aria = create({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null
  },
  transform(_, property) {
    return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
  }
});

// node_modules/property-information/lib/util/case-sensitive-transform.js
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute;
}

// node_modules/property-information/lib/util/case-insensitive-transform.js
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase());
}

// node_modules/property-information/lib/html.js
var html = create({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alpha: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    blocking: spaceSeparated,
    capture: null,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    closedBy: null,
    colorSpace: null,
    cols: number,
    colSpan: number,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: overloadedBoolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: boolean,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shadowRootClonable: boolean,
    shadowRootCustomElementRegistry: boolean,
    shadowRootDelegatesFocus: boolean,
    shadowRootMode: null,
    shadowRootSerializable: boolean,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: number,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: boolean,
    // Lists. Use CSS to reduce space between items instead
    declare: boolean,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: number,
    // `<img>` and `<object>`
    leftMargin: number,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: number,
    // `<body>`
    marginWidth: number,
    // `<body>`
    noResize: boolean,
    // `<frame>`
    noHref: boolean,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: number,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: booleanish,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: number,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: boolean,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    exportParts: commaSeparated,
    part: spaceSeparated,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: caseInsensitiveTransform
});

// node_modules/property-information/lib/svg.js
var svg = create({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    maskType: "mask-type",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskType: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: caseSensitiveTransform
});

// node_modules/property-information/lib/xlink.js
var xlink = create({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(_, property) {
    return "xlink:" + property.slice(5).toLowerCase();
  }
});

// node_modules/property-information/lib/xmlns.js
var xmlns = create({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: caseInsensitiveTransform
});

// node_modules/property-information/lib/xml.js
var xml = create({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(_, property) {
    return "xml:" + property.slice(3).toLowerCase();
  }
});

// node_modules/property-information/lib/find.js
var cap = /[A-Z]/g;
var dash = /-[a-z]/g;
var valid = /^data[-\w.:]+$/i;
function find(schema, value) {
  const normal = normalize(value);
  let property = value;
  let Type = Info;
  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]];
  }
  if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
    if (value.charAt(4) === "-") {
      const rest = value.slice(5).replace(dash, camelcase);
      property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
    } else {
      const rest = value.slice(4);
      if (!dash.test(rest)) {
        let dashes = rest.replace(cap, kebab);
        if (dashes.charAt(0) !== "-") {
          dashes = "-" + dashes;
        }
        value = "data" + dashes;
      }
    }
    Type = DefinedInfo;
  }
  return new Type(property, value);
}
function kebab($0) {
  return "-" + $0.toLowerCase();
}
function camelcase($0) {
  return $0.charAt(1).toUpperCase();
}

// node_modules/property-information/index.js
var html2 = merge([aria, html, xlink, xmlns, xml], "html");
var svg2 = merge([aria, svg, xlink, xmlns, xml], "svg");

// node_modules/comma-separated-tokens/index.js
function parse3(value) {
  const tokens = [];
  const input = String(value || "");
  let index2 = input.indexOf(",");
  let start = 0;
  let end = false;
  while (!end) {
    if (index2 === -1) {
      index2 = input.length;
      end = true;
    }
    const token = input.slice(start, index2).trim();
    if (token || !end) {
      tokens.push(token);
    }
    start = index2 + 1;
    index2 = input.indexOf(",", start);
  }
  return tokens;
}
function stringify(values, options) {
  const settings = options || {};
  const input = values[values.length - 1] === "" ? [...values, ""] : values;
  return input.join(
    (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
  ).trim();
}

// node_modules/hast-util-parse-selector/lib/index.js
var search = /[#.]/g;
function parseSelector(selector, defaultTagName) {
  const value = selector || "";
  const props = {};
  let start = 0;
  let previous;
  let tagName;
  while (start < value.length) {
    search.lastIndex = start;
    const match = search.exec(value);
    const subvalue = value.slice(start, match ? match.index : value.length);
    if (subvalue) {
      if (!previous) {
        tagName = subvalue;
      } else if (previous === "#") {
        props.id = subvalue;
      } else if (Array.isArray(props.className)) {
        props.className.push(subvalue);
      } else {
        props.className = [subvalue];
      }
      start += subvalue.length;
    }
    if (match) {
      previous = match[0];
      start++;
    }
  }
  return {
    type: "element",
    // @ts-expect-error: tag name is parsed.
    tagName: tagName || defaultTagName || "div",
    properties: props,
    children: []
  };
}

// node_modules/space-separated-tokens/index.js
function parse4(value) {
  const input = String(value || "").trim();
  return input ? input.split(/[ \t\n\r\f]+/g) : [];
}
function stringify2(values) {
  return values.join(" ").trim();
}

// node_modules/hastscript/lib/create-h.js
function createH(schema, defaultTagName, caseSensitive) {
  const adjust = caseSensitive ? createAdjustMap(caseSensitive) : void 0;
  function h2(selector, properties, ...children) {
    let node;
    if (selector === null || selector === void 0) {
      node = { type: "root", children: [] };
      const child = (
        /** @type {Child} */
        properties
      );
      children.unshift(child);
    } else {
      node = parseSelector(selector, defaultTagName);
      const lower = node.tagName.toLowerCase();
      const adjusted = adjust ? adjust.get(lower) : void 0;
      node.tagName = adjusted || lower;
      if (isChild(properties)) {
        children.unshift(properties);
      } else {
        for (const [key2, value] of Object.entries(properties)) {
          addProperty(schema, node.properties, key2, value);
        }
      }
    }
    for (const child of children) {
      addChild(node.children, child);
    }
    if (node.type === "element" && node.tagName === "template") {
      node.content = { type: "root", children: node.children };
      node.children = [];
    }
    return node;
  }
  return h2;
}
function isChild(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return true;
  }
  if (typeof value.type !== "string") return false;
  const record = (
    /** @type {Record<string, unknown>} */
    value
  );
  const keys = Object.keys(value);
  for (const key2 of keys) {
    const value2 = record[key2];
    if (value2 && typeof value2 === "object") {
      if (!Array.isArray(value2)) return true;
      const list = (
        /** @type {ReadonlyArray<unknown>} */
        value2
      );
      for (const item of list) {
        if (typeof item !== "number" && typeof item !== "string") {
          return true;
        }
      }
    }
  }
  if ("children" in value && Array.isArray(value.children)) {
    return true;
  }
  return false;
}
function addProperty(schema, properties, key2, value) {
  const info = find(schema, key2);
  let result;
  if (value === null || value === void 0) return;
  if (typeof value === "number") {
    if (Number.isNaN(value)) return;
    result = value;
  } else if (typeof value === "boolean") {
    result = value;
  } else if (typeof value === "string") {
    if (info.spaceSeparated) {
      result = parse4(value);
    } else if (info.commaSeparated) {
      result = parse3(value);
    } else if (info.commaOrSpaceSeparated) {
      result = parse4(parse3(value).join(" "));
    } else {
      result = parsePrimitive(info, info.property, value);
    }
  } else if (Array.isArray(value)) {
    result = [...value];
  } else {
    result = info.property === "style" ? style(value) : String(value);
  }
  if (Array.isArray(result)) {
    const finalResult = [];
    for (const item of result) {
      finalResult.push(
        /** @type {number | string} */
        parsePrimitive(info, info.property, item)
      );
    }
    result = finalResult;
  }
  if (info.property === "className" && Array.isArray(properties.className)) {
    result = properties.className.concat(
      /** @type {Array<number | string> | number | string} */
      result
    );
  }
  properties[info.property] = result;
}
function addChild(nodes, value) {
  if (value === null || value === void 0) {
  } else if (typeof value === "number" || typeof value === "string") {
    nodes.push({ type: "text", value: String(value) });
  } else if (Array.isArray(value)) {
    for (const child of value) {
      addChild(nodes, child);
    }
  } else if (typeof value === "object" && "type" in value) {
    if (value.type === "root") {
      addChild(nodes, value.children);
    } else {
      nodes.push(value);
    }
  } else {
    throw new Error("Expected node, nodes, or string, got `" + value + "`");
  }
}
function parsePrimitive(info, name, value) {
  if (typeof value === "string") {
    if (info.number && value && !Number.isNaN(Number(value))) {
      return Number(value);
    }
    if ((info.boolean || info.overloadedBoolean) && (value === "" || normalize(value) === normalize(name))) {
      return true;
    }
  }
  return value;
}
function style(styles) {
  const result = [];
  for (const [key2, value] of Object.entries(styles)) {
    result.push([key2, value].join(": "));
  }
  return result.join("; ");
}
function createAdjustMap(values) {
  const result = /* @__PURE__ */ new Map();
  for (const value of values) {
    result.set(value.toLowerCase(), value);
  }
  return result;
}

// node_modules/hastscript/lib/svg-case-sensitive-tag-names.js
var svgCaseSensitiveTagNames = [
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "clipPath",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "foreignObject",
  "glyphRef",
  "linearGradient",
  "radialGradient",
  "solidColor",
  "textArea",
  "textPath"
];

// node_modules/hastscript/lib/index.js
var h = createH(html2, "div");
var s = createH(svg2, "g", svgCaseSensitiveTagNames);

// node_modules/uniorg-rehype/lib/org-to-hast.js
var defaultOptions2 = {
  imageFilenameExtensions: [
    "png",
    "jpeg",
    "jpg",
    "gif",
    "tiff",
    "tif",
    "xbm",
    "xpm",
    "pbm",
    "pgm",
    "ppm",
    "pnm",
    "svg",
    "webp",
    "avif"
  ],
  useSections: false,
  footnotesSection: (footnotes) => [h("h1", {}, "Footnotes:"), ...footnotes],
  handlers: {}
};
var defaultHandlers = {
  citation: renderAsChildren,
  "citation-common-prefix": renderAsChildren,
  "citation-common-suffix": renderAsChildren,
  "citation-reference": renderAsChildren,
  "citation-prefix": renderAsChildren,
  "citation-suffix": renderAsChildren,
  "citation-key": function(org) {
    return this.h(org, "a", { href: "cite:" + org.key }, ["cite:" + org.key]);
  },
  "export-snippet": function(org) {
    if (org.backEnd !== "html")
      return null;
    return u("raw", org.value);
  },
  "line-break": function(org) {
    return this.h(org, "br");
  }
};
function renderAsChildren(org) {
  return this.toHast(org.children, org);
}
var html5Elements = /* @__PURE__ */ new Set([
  "article",
  "aside",
  "audio",
  "canvas",
  "details",
  "figcaption",
  "figure",
  "footer",
  "header",
  "menu",
  "meter",
  "nav",
  "output",
  "progress",
  "section",
  "summary",
  "video"
]);
function orgToHast(org, opts = {}) {
  return new OrgToHast(opts).toHast(org, null);
}
var OrgToHast = class {
  constructor(options) {
    this.footnotesOrder = [];
    this.footnotes = {};
    this.options = { ...defaultOptions2, ...options };
    this.handlers = { ...defaultHandlers, ...this.options.handlers };
  }
  toHast(node, parent) {
    if (node === null) {
      return null;
    }
    const h2 = this.h.bind(this);
    const toHast = this.toHast.bind(this);
    if (Array.isArray(node)) {
      return cleanup(node.map((node2) => toHast(node2, parent)));
    }
    const org = node;
    const handler = this.handlers[org.type];
    if (handler) {
      const rendered = handler.call(this, org);
      if (rendered)
        return cleanup(rendered);
    }
    switch (org.type) {
      case "org-data":
        const children = toHast(org.children, org);
        const footnotes = this.footnotesOrder.map((name, i) => {
          const def = this.footnotes[name];
          if (!def) {
            return null;
          }
          return h2(org, "div", { className: "footnote-definition" }, [
            h2(null, "sup", {}, h2(null, "a", {
              className: "footnum",
              id: `fn.${i + 1}`,
              href: `#fnr.${i + 1}`,
              role: "doc-backlink"
            }, String(i + 1))),
            h2(def, "div", { className: "footdef", role: "doc-footnote" }, toHast(def.children, def))
          ]);
        }).filter((x) => x !== null);
        if (footnotes.length !== 0) {
          const footnoteChildren = cleanup(this.options.footnotesSection(footnotes));
          if (this.options.useSections) {
            children.push(h2(null, "section", {}, footnoteChildren));
          } else {
            children.push(...footnoteChildren);
          }
        }
        return { type: "root", children };
      case "section": {
        const headline = org.children[0];
        if (headline.commented || headline.tags.includes("noexport")) {
          return null;
        }
        const children2 = toHast(org.children, org);
        return this.options.useSections ? h2(org, "section", { class: `section-level-${headline.level}` }, children2) : children2;
      }
      case "headline": {
        const intersperse = (items, sep) => items.flatMap((e) => [sep, e]).slice(1);
        const todo = org.todoKeyword ? [
          h2(org, "span", { className: ["todo-keyword", org.todoKeyword] }, org.todoKeyword),
          " "
        ] : null;
        const priority = org.priority ? [
          h2(org, "span", { className: ["priority", `priority-${org.priority}`] }, `[${org.priority}]`),
          " "
        ] : null;
        const tags = org.tags.length ? [
          u("text", { value: "\xA0\xA0\xA0" }),
          h2(org, "span.tags", {}, intersperse(org.tags.map((x) => h2(org, "span.tag", { className: `tag-${x}` }, x)), "\xA0"))
        ] : null;
        return h2(org, `h${org.level}`, {}, [todo, priority, ...toHast(org.children, org), tags].filter(notNull));
      }
      case "statistics-cookie":
        return h2(org, "span", { className: "statistics-cookie" }, org.value);
      case "plain-list":
        if (org.listType === "unordered") {
          return h2(org, "ul", {}, toHast(org.children, org));
        } else if (org.listType === "ordered") {
          return h2(org, "ol", {}, toHast(org.children, org));
        } else {
          return h2(org, "dl", {}, toHast(org.children, org));
        }
      case "list-item":
        if (org.children[0]?.type === "list-item-tag") {
          return [
            h2(org, "dt", {}, toHast(org.children[0].children, org.children[0])),
            h2(org, "dd", {}, toHast(org.children.slice(1), org))
          ];
        } else {
          return h2(org, "li", {}, toHast(org.children, org));
        }
      case "quote-block":
        return h2(org, "blockquote", {}, toHast(org.children, org));
      case "src-block":
        return h2(org, "pre.src-block", {}, h2(org, "code", {
          className: org.language ? `language-${org.language}` : void 0
        }, removeCommonIndent(org.value)));
      case "verse-block": {
        const commonIndent = calculateCommonIndent(org);
        const hast = h2(org, "pre.verse", {}, toHast(org.children, org));
        return stripCommonIndent(hast, commonIndent);
      }
      case "center-block":
        return h2(org, "div.center", {}, toHast(org.children, org));
      case "comment-block":
        return null;
      case "example-block":
        return h2(org, "div.example", {}, org.value);
      case "export-block":
        if (org.backend === "html") {
          return u("raw", org.value);
        }
        return null;
      case "special-block":
        if (html5Elements.has(org.blockType)) {
          return h2(org, org.blockType, {}, toHast(org.children, org));
        }
        return h2(org, "div", { className: ["special-block", `block-${org.blockType}`] }, toHast(org.children, org));
      case "keyword":
        if (org.key === "HTML") {
          return u("raw", org.value);
        }
        return null;
      case "horizontal-rule":
        return h2(org, "hr", {});
      case "diary-sexp":
        return null;
      case "footnote-reference":
        let idx = 0;
        let id = "";
        if (org.footnoteType === "inline") {
          idx = this.footnotesOrder.length;
          this.footnotesOrder.push(idx);
          this.footnotes[idx] = org;
          id = `fnr.${idx + 1}`;
        } else if (org.footnoteType === "standard") {
          idx = this.footnotesOrder.findIndex((label) => label === org.label);
          if (idx === -1) {
            idx = this.footnotesOrder.length;
            this.footnotesOrder.push(org.label);
            id = `fnr.${idx + 1}`;
          }
        } else {
          throw new Error(`unknown footnoteType: ${org.footnoteType}`);
        }
        return h2(null, "sup", {}, h2(org, "a", {
          href: `#fn.${idx + 1}`,
          className: ["footref"],
          id,
          role: "doc-backlink"
        }, String(idx + 1)));
      case "footnote-definition":
        this.footnotes[org.label] = org;
        return null;
      case "paragraph":
        if (parent?.type === "list-item" && parent.children[0]?.type !== "list-item-tag" && (parent.children.length === 1 || parent.children.length === 2 && parent.children[0] === org && parent.children[1].type === "plain-list")) {
          return toHast(org.children, org);
        }
        return h2(org, "p", {}, toHast(org.children, org));
      case "bold":
        return h2(org, "strong", {}, toHast(org.children, org));
      case "italic":
        return h2(org, "em", {}, toHast(org.children, org));
      case "superscript":
        return h2(org, "sup", {}, toHast(org.children, org));
      case "subscript":
        return h2(org, "sub", {}, toHast(org.children, org));
      case "code":
        return h2(org, "code.inline-code", {}, org.value);
      case "verbatim":
        return h2(org, "code.inline-verbatim", {}, org.value);
      case "strike-through":
        return h2(org, "del", {}, toHast(org.children, org));
      case "underline":
        return h2(org, "span.underline", { style: "text-decoration: underline;" }, toHast(org.children, org));
      case "text":
        return u("text", org.value);
      case "link": {
        let link = org.rawLink;
        if (org.linkType === "file") {
          link = encodeURI(link);
        }
        const isFirstLink = parent?.children.find((org2) => org2.type === "link") === org;
        const attrs = isFirstLink ? getAffiliatedAttrs(parent) : {};
        if (isImageLink(org, this.options)) {
          return h2(org, "img", { ...attrs, src: link });
        }
        return h2(org, "a", { ...attrs, href: link }, org.children.length ? toHast(org.children, org) : org.rawLink);
      }
      case "timestamp":
        return h2(org, "span.timestamp", {}, org.rawValue);
      case "planning":
        return null;
      case "property-drawer":
        return null;
      case "drawer":
        return null;
      case "comment":
        return null;
      case "fixed-width":
        return h2(org, "pre.fixed-width", {}, org.value);
      case "clock":
        return null;
      case "latex-environment":
        return h2(org, "div.math.math-display", {}, org.value);
      case "latex-fragment":
        return h2(org, "span.math.math-inline", {}, org.contents.trim());
      case "entity":
        return u("text", { value: org.utf8 });
      case "table": {
        if (org.tableType === "table.el") {
          return h2(org, "pre.table-el", {}, org.value);
        }
        const table = h2(org, "table", {}, []);
        let hasHead = false;
        let group = [];
        org.children.forEach((r2) => {
          if (r2.rowType === "rule") {
            if (!hasHead) {
              table.children.push(h2(org, "thead", {}, group.map((row) => h2(row, "tr", {}, row.children.map((cell) => h2(cell, "th", {}, toHast(cell.children, cell)))))));
              hasHead = true;
            } else {
              table.children.push(h2(org, "tbody", {}, toHast(group, org)));
            }
            group = [];
          }
          group.push(r2);
        });
        if (group.length) {
          table.children.push(h2(org, "tbody", {}, toHast(group, org)));
        }
        return table;
      }
      case "table-row":
        if (org.rowType === "standard") {
          return h2(org, "tr", {}, toHast(org.children, org));
        } else {
          return null;
        }
      case "table-cell":
        return h2(org, "td", {}, toHast(org.children, org));
      default:
        return org;
    }
  }
  /**
   * Similar to `hast` but respects `hProperties`.
   */
  h(node, selector, properties, children) {
    const element2 = (
      // @ts-expect-error does not match the expected overloads
      h(selector, properties || {}, children || [])
    );
    const attrs = node?.type === "paragraph" && node.children.length === 1 && isImageLink(node.children[0], this.options) ? (
      // If image link is the only child in a paragraph, all attributes
      // are proxied to it.
      {}
    ) : getAffiliatedAttrs(node);
    const hProperties = node?.data?.hProperties ?? {};
    element2.properties = Object.assign({}, element2.properties, attrs, hProperties);
    return element2;
  }
};
var getAffiliatedAttrs = (node) => {
  const attr_html = node?.affiliated?.ATTR_HTML?.flatMap((s2) => s2.split(/(?:[ \t]+|^):(?<x>[-a-zA-Z0-9_]+(?=[ \t]|$))/u).slice(1)) ?? [];
  const attrs = {};
  for (let i = 0; i < attr_html.length; i += 2) {
    const key2 = attr_html[i];
    const value = attr_html[i + 1].trim();
    if (value) {
      attrs[key2] = value;
    }
  }
  return attrs;
};
var removeCommonIndent = (s2) => {
  const lines = s2.split(/\n/g);
  const minIndent = Math.min(...lines.map((l) => l.match(/\S/)?.index ?? Infinity));
  const indent = minIndent === Infinity ? 0 : minIndent;
  return lines.map((l) => l.substring(indent)).join("\n");
};
var isImageLink = (node, options) => {
  const imageRe = new RegExp(`.(${options.imageFilenameExtensions.join("|")})$`, "i");
  return node.type === "link" && node.children.length === 0 && node.rawLink.match(imageRe);
};
function calculateCommonIndent(org) {
  const textParts = [];
  const collect = (n) => {
    if (n.type === "text") {
      textParts.push(n.value);
    } else if ("children" in n && n.children) {
      for (const child of n.children) {
        collect(child);
      }
    }
  };
  collect(org);
  const rawText = textParts.join("");
  const lines = rawText.split("\n").filter((line) => line.trim());
  let commonIndent = 0;
  if (lines.length > 0) {
    commonIndent = Math.min(...lines.map((line) => {
      const match = line.match(/^[ \t]*/);
      return match ? match[0].length : 0;
    }));
  }
  return commonIndent;
}
function stripCommonIndent(element2, commonIndent) {
  let isLineStart = true;
  const handleElement = (element3) => {
    if (!("children" in element3)) {
      return element3;
    }
    const newChildren = [];
    for (const child of element3.children) {
      if (!child)
        continue;
      if (child.type === "text") {
        const lines = child.value.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (i > 0) {
            newChildren.push(u("text", "\n"));
            isLineStart = true;
          }
          let text2 = lines[i];
          if (isLineStart) {
            text2 = text2.substring(commonIndent);
          }
          newChildren.push(u("text", text2));
          isLineStart = false;
        }
      } else if ("children" in child) {
        const processedChild = handleElement(child);
        newChildren.push(processedChild);
        if ("children" in processedChild && processedChild.children.length > 0) {
          const lastNode = processedChild.children[processedChild.children.length - 1];
          isLineStart = lastNode.type === "element" && lastNode.tagName === "br";
        }
      } else {
        newChildren.push(child);
      }
    }
    return { ...element3, children: newChildren };
  };
  return handleElement(element2);
}
var notNull = (x) => x !== null && x !== void 0;
var cleanup = (xs) => {
  const array = Array.isArray(xs) ? xs : [xs];
  return array.flatMap((x) => Array.isArray(x) ? x : [x]).filter(notNull);
};

// node_modules/uniorg-rehype/lib/unified-org-rehype.js
var org2rehype = function org2rehype2(options = {}) {
  return (node, _file) => {
    return orgToHast(node, options);
  };
};
var unified_org_rehype_default = org2rehype;

// node_modules/html-void-elements/index.js
var htmlVoidElements = [
  "area",
  "base",
  "basefont",
  "bgsound",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "image",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
];

// node_modules/zwitch/index.js
var own2 = {}.hasOwnProperty;
function zwitch(key2, options) {
  const settings = options || {};
  function one2(value, ...parameters) {
    let fn = one2.invalid;
    const handlers = one2.handlers;
    if (value && own2.call(value, key2)) {
      const id = String(value[key2]);
      fn = own2.call(handlers, id) ? handlers[id] : one2.unknown;
    }
    if (fn) {
      return fn.call(this, value, ...parameters);
    }
  }
  one2.handlers = settings.handlers || {};
  one2.invalid = settings.invalid;
  one2.unknown = settings.unknown;
  return one2;
}

// node_modules/stringify-entities/lib/core.js
var defaultSubsetRegex = /["&'<>`]/g;
var surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
var controlCharactersRegex = (
  // eslint-disable-next-line no-control-regex, unicorn/no-hex-escape
  /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g
);
var regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
var subsetToRegexCache = /* @__PURE__ */ new WeakMap();
function core(value, options) {
  value = value.replace(
    options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex,
    basic
  );
  if (options.subset || options.escapeOnly) {
    return value;
  }
  return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
  function surrogate(pair, index2, all2) {
    return options.format(
      (pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536,
      all2.charCodeAt(index2 + 2),
      options
    );
  }
  function basic(character, index2, all2) {
    return options.format(
      character.charCodeAt(0),
      all2.charCodeAt(index2 + 1),
      options
    );
  }
}
function charactersToExpressionCached(subset) {
  let cached = subsetToRegexCache.get(subset);
  if (!cached) {
    cached = charactersToExpression(subset);
    subsetToRegexCache.set(subset, cached);
  }
  return cached;
}
function charactersToExpression(subset) {
  const groups = [];
  let index2 = -1;
  while (++index2 < subset.length) {
    groups.push(subset[index2].replace(regexEscapeRegex, "\\$&"));
  }
  return new RegExp("(?:" + groups.join("|") + ")", "g");
}

// node_modules/stringify-entities/lib/util/to-hexadecimal.js
var hexadecimalRegex = /[\dA-Fa-f]/;
function toHexadecimal(code, next2, omit) {
  const value = "&#x" + code.toString(16).toUpperCase();
  return omit && next2 && !hexadecimalRegex.test(String.fromCharCode(next2)) ? value : value + ";";
}

// node_modules/stringify-entities/lib/util/to-decimal.js
var decimalRegex = /\d/;
function toDecimal(code, next2, omit) {
  const value = "&#" + String(code);
  return omit && next2 && !decimalRegex.test(String.fromCharCode(next2)) ? value : value + ";";
}

// node_modules/character-entities-legacy/index.js
var characterEntitiesLegacy = [
  "AElig",
  "AMP",
  "Aacute",
  "Acirc",
  "Agrave",
  "Aring",
  "Atilde",
  "Auml",
  "COPY",
  "Ccedil",
  "ETH",
  "Eacute",
  "Ecirc",
  "Egrave",
  "Euml",
  "GT",
  "Iacute",
  "Icirc",
  "Igrave",
  "Iuml",
  "LT",
  "Ntilde",
  "Oacute",
  "Ocirc",
  "Ograve",
  "Oslash",
  "Otilde",
  "Ouml",
  "QUOT",
  "REG",
  "THORN",
  "Uacute",
  "Ucirc",
  "Ugrave",
  "Uuml",
  "Yacute",
  "aacute",
  "acirc",
  "acute",
  "aelig",
  "agrave",
  "amp",
  "aring",
  "atilde",
  "auml",
  "brvbar",
  "ccedil",
  "cedil",
  "cent",
  "copy",
  "curren",
  "deg",
  "divide",
  "eacute",
  "ecirc",
  "egrave",
  "eth",
  "euml",
  "frac12",
  "frac14",
  "frac34",
  "gt",
  "iacute",
  "icirc",
  "iexcl",
  "igrave",
  "iquest",
  "iuml",
  "laquo",
  "lt",
  "macr",
  "micro",
  "middot",
  "nbsp",
  "not",
  "ntilde",
  "oacute",
  "ocirc",
  "ograve",
  "ordf",
  "ordm",
  "oslash",
  "otilde",
  "ouml",
  "para",
  "plusmn",
  "pound",
  "quot",
  "raquo",
  "reg",
  "sect",
  "shy",
  "sup1",
  "sup2",
  "sup3",
  "szlig",
  "thorn",
  "times",
  "uacute",
  "ucirc",
  "ugrave",
  "uml",
  "uuml",
  "yacute",
  "yen",
  "yuml"
];

// node_modules/character-entities-html4/index.js
var characterEntitiesHtml4 = {
  nbsp: "\xA0",
  iexcl: "\xA1",
  cent: "\xA2",
  pound: "\xA3",
  curren: "\xA4",
  yen: "\xA5",
  brvbar: "\xA6",
  sect: "\xA7",
  uml: "\xA8",
  copy: "\xA9",
  ordf: "\xAA",
  laquo: "\xAB",
  not: "\xAC",
  shy: "\xAD",
  reg: "\xAE",
  macr: "\xAF",
  deg: "\xB0",
  plusmn: "\xB1",
  sup2: "\xB2",
  sup3: "\xB3",
  acute: "\xB4",
  micro: "\xB5",
  para: "\xB6",
  middot: "\xB7",
  cedil: "\xB8",
  sup1: "\xB9",
  ordm: "\xBA",
  raquo: "\xBB",
  frac14: "\xBC",
  frac12: "\xBD",
  frac34: "\xBE",
  iquest: "\xBF",
  Agrave: "\xC0",
  Aacute: "\xC1",
  Acirc: "\xC2",
  Atilde: "\xC3",
  Auml: "\xC4",
  Aring: "\xC5",
  AElig: "\xC6",
  Ccedil: "\xC7",
  Egrave: "\xC8",
  Eacute: "\xC9",
  Ecirc: "\xCA",
  Euml: "\xCB",
  Igrave: "\xCC",
  Iacute: "\xCD",
  Icirc: "\xCE",
  Iuml: "\xCF",
  ETH: "\xD0",
  Ntilde: "\xD1",
  Ograve: "\xD2",
  Oacute: "\xD3",
  Ocirc: "\xD4",
  Otilde: "\xD5",
  Ouml: "\xD6",
  times: "\xD7",
  Oslash: "\xD8",
  Ugrave: "\xD9",
  Uacute: "\xDA",
  Ucirc: "\xDB",
  Uuml: "\xDC",
  Yacute: "\xDD",
  THORN: "\xDE",
  szlig: "\xDF",
  agrave: "\xE0",
  aacute: "\xE1",
  acirc: "\xE2",
  atilde: "\xE3",
  auml: "\xE4",
  aring: "\xE5",
  aelig: "\xE6",
  ccedil: "\xE7",
  egrave: "\xE8",
  eacute: "\xE9",
  ecirc: "\xEA",
  euml: "\xEB",
  igrave: "\xEC",
  iacute: "\xED",
  icirc: "\xEE",
  iuml: "\xEF",
  eth: "\xF0",
  ntilde: "\xF1",
  ograve: "\xF2",
  oacute: "\xF3",
  ocirc: "\xF4",
  otilde: "\xF5",
  ouml: "\xF6",
  divide: "\xF7",
  oslash: "\xF8",
  ugrave: "\xF9",
  uacute: "\xFA",
  ucirc: "\xFB",
  uuml: "\xFC",
  yacute: "\xFD",
  thorn: "\xFE",
  yuml: "\xFF",
  fnof: "\u0192",
  Alpha: "\u0391",
  Beta: "\u0392",
  Gamma: "\u0393",
  Delta: "\u0394",
  Epsilon: "\u0395",
  Zeta: "\u0396",
  Eta: "\u0397",
  Theta: "\u0398",
  Iota: "\u0399",
  Kappa: "\u039A",
  Lambda: "\u039B",
  Mu: "\u039C",
  Nu: "\u039D",
  Xi: "\u039E",
  Omicron: "\u039F",
  Pi: "\u03A0",
  Rho: "\u03A1",
  Sigma: "\u03A3",
  Tau: "\u03A4",
  Upsilon: "\u03A5",
  Phi: "\u03A6",
  Chi: "\u03A7",
  Psi: "\u03A8",
  Omega: "\u03A9",
  alpha: "\u03B1",
  beta: "\u03B2",
  gamma: "\u03B3",
  delta: "\u03B4",
  epsilon: "\u03B5",
  zeta: "\u03B6",
  eta: "\u03B7",
  theta: "\u03B8",
  iota: "\u03B9",
  kappa: "\u03BA",
  lambda: "\u03BB",
  mu: "\u03BC",
  nu: "\u03BD",
  xi: "\u03BE",
  omicron: "\u03BF",
  pi: "\u03C0",
  rho: "\u03C1",
  sigmaf: "\u03C2",
  sigma: "\u03C3",
  tau: "\u03C4",
  upsilon: "\u03C5",
  phi: "\u03C6",
  chi: "\u03C7",
  psi: "\u03C8",
  omega: "\u03C9",
  thetasym: "\u03D1",
  upsih: "\u03D2",
  piv: "\u03D6",
  bull: "\u2022",
  hellip: "\u2026",
  prime: "\u2032",
  Prime: "\u2033",
  oline: "\u203E",
  frasl: "\u2044",
  weierp: "\u2118",
  image: "\u2111",
  real: "\u211C",
  trade: "\u2122",
  alefsym: "\u2135",
  larr: "\u2190",
  uarr: "\u2191",
  rarr: "\u2192",
  darr: "\u2193",
  harr: "\u2194",
  crarr: "\u21B5",
  lArr: "\u21D0",
  uArr: "\u21D1",
  rArr: "\u21D2",
  dArr: "\u21D3",
  hArr: "\u21D4",
  forall: "\u2200",
  part: "\u2202",
  exist: "\u2203",
  empty: "\u2205",
  nabla: "\u2207",
  isin: "\u2208",
  notin: "\u2209",
  ni: "\u220B",
  prod: "\u220F",
  sum: "\u2211",
  minus: "\u2212",
  lowast: "\u2217",
  radic: "\u221A",
  prop: "\u221D",
  infin: "\u221E",
  ang: "\u2220",
  and: "\u2227",
  or: "\u2228",
  cap: "\u2229",
  cup: "\u222A",
  int: "\u222B",
  there4: "\u2234",
  sim: "\u223C",
  cong: "\u2245",
  asymp: "\u2248",
  ne: "\u2260",
  equiv: "\u2261",
  le: "\u2264",
  ge: "\u2265",
  sub: "\u2282",
  sup: "\u2283",
  nsub: "\u2284",
  sube: "\u2286",
  supe: "\u2287",
  oplus: "\u2295",
  otimes: "\u2297",
  perp: "\u22A5",
  sdot: "\u22C5",
  lceil: "\u2308",
  rceil: "\u2309",
  lfloor: "\u230A",
  rfloor: "\u230B",
  lang: "\u2329",
  rang: "\u232A",
  loz: "\u25CA",
  spades: "\u2660",
  clubs: "\u2663",
  hearts: "\u2665",
  diams: "\u2666",
  quot: '"',
  amp: "&",
  lt: "<",
  gt: ">",
  OElig: "\u0152",
  oelig: "\u0153",
  Scaron: "\u0160",
  scaron: "\u0161",
  Yuml: "\u0178",
  circ: "\u02C6",
  tilde: "\u02DC",
  ensp: "\u2002",
  emsp: "\u2003",
  thinsp: "\u2009",
  zwnj: "\u200C",
  zwj: "\u200D",
  lrm: "\u200E",
  rlm: "\u200F",
  ndash: "\u2013",
  mdash: "\u2014",
  lsquo: "\u2018",
  rsquo: "\u2019",
  sbquo: "\u201A",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bdquo: "\u201E",
  dagger: "\u2020",
  Dagger: "\u2021",
  permil: "\u2030",
  lsaquo: "\u2039",
  rsaquo: "\u203A",
  euro: "\u20AC"
};

// node_modules/stringify-entities/lib/constant/dangerous.js
var dangerous = [
  "cent",
  "copy",
  "divide",
  "gt",
  "lt",
  "not",
  "para",
  "times"
];

// node_modules/stringify-entities/lib/util/to-named.js
var own3 = {}.hasOwnProperty;
var characters = {};
var key;
for (key in characterEntitiesHtml4) {
  if (own3.call(characterEntitiesHtml4, key)) {
    characters[characterEntitiesHtml4[key]] = key;
  }
}
var notAlphanumericRegex = /[^\dA-Za-z]/;
function toNamed(code, next2, omit, attribute) {
  const character = String.fromCharCode(code);
  if (own3.call(characters, character)) {
    const name = characters[character];
    const value = "&" + name;
    if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next2 && next2 !== 61 && notAlphanumericRegex.test(String.fromCharCode(next2)))) {
      return value;
    }
    return value + ";";
  }
  return "";
}

// node_modules/stringify-entities/lib/util/format-smart.js
function formatSmart(code, next2, options) {
  let numeric = toHexadecimal(code, next2, options.omitOptionalSemicolons);
  let named;
  if (options.useNamedReferences || options.useShortestReferences) {
    named = toNamed(
      code,
      next2,
      options.omitOptionalSemicolons,
      options.attribute
    );
  }
  if ((options.useShortestReferences || !named) && options.useShortestReferences) {
    const decimal = toDecimal(code, next2, options.omitOptionalSemicolons);
    if (decimal.length < numeric.length) {
      numeric = decimal;
    }
  }
  return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
}

// node_modules/stringify-entities/lib/index.js
function stringifyEntities(value, options) {
  return core(value, Object.assign({ format: formatSmart }, options));
}

// node_modules/hast-util-to-html/lib/handle/comment.js
var htmlCommentRegex = /^>|^->|<!--|-->|--!>|<!-$/g;
var bogusCommentEntitySubset = [">"];
var commentEntitySubset = ["<", ">"];
function comment(node, _1, _2, state) {
  return state.settings.bogusComments ? "<?" + stringifyEntities(
    node.value,
    Object.assign({}, state.settings.characterReferences, {
      subset: bogusCommentEntitySubset
    })
  ) + ">" : "<!--" + node.value.replace(htmlCommentRegex, encode) + "-->";
  function encode($0) {
    return stringifyEntities(
      $0,
      Object.assign({}, state.settings.characterReferences, {
        subset: commentEntitySubset
      })
    );
  }
}

// node_modules/hast-util-to-html/lib/handle/doctype.js
function doctype(_1, _2, _3, state) {
  return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
}

// node_modules/ccount/index.js
function ccount(value, character) {
  const source = String(value);
  if (typeof character !== "string") {
    throw new TypeError("Expected character");
  }
  let count = 0;
  let index2 = source.indexOf(character);
  while (index2 !== -1) {
    count++;
    index2 = source.indexOf(character, index2 + character.length);
  }
  return count;
}

// node_modules/hast-util-whitespace/lib/index.js
var re = /[ \t\n\f\r]/g;
function whitespace(thing) {
  return typeof thing === "object" ? thing.type === "text" ? empty(thing.value) : false : empty(thing);
}
function empty(value) {
  return value.replace(re, "") === "";
}

// node_modules/hast-util-to-html/lib/omission/util/siblings.js
var siblingAfter = siblings(1);
var siblingBefore = siblings(-1);
var emptyChildren = [];
function siblings(increment2) {
  return sibling;
  function sibling(parent, index2, includeWhitespace) {
    const siblings2 = parent ? parent.children : emptyChildren;
    let offset = (index2 || 0) + increment2;
    let next2 = siblings2[offset];
    if (!includeWhitespace) {
      while (next2 && whitespace(next2)) {
        offset += increment2;
        next2 = siblings2[offset];
      }
    }
    return next2;
  }
}

// node_modules/hast-util-to-html/lib/omission/omission.js
var own4 = {}.hasOwnProperty;
function omission(handlers) {
  return omit;
  function omit(node, index2, parent) {
    return own4.call(handlers, node.tagName) && handlers[node.tagName](node, index2, parent);
  }
}

// node_modules/hast-util-to-html/lib/omission/closing.js
var closing = omission({
  body,
  caption: headOrColgroupOrCaption,
  colgroup: headOrColgroupOrCaption,
  dd,
  dt,
  head: headOrColgroupOrCaption,
  html: html3,
  li,
  optgroup,
  option,
  p,
  rp: rubyElement,
  rt: rubyElement,
  tbody,
  td: cells,
  tfoot,
  th: cells,
  thead,
  tr
});
function headOrColgroupOrCaption(_, index2, parent) {
  const next2 = siblingAfter(parent, index2, true);
  return !next2 || next2.type !== "comment" && !(next2.type === "text" && whitespace(next2.value.charAt(0)));
}
function html3(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type !== "comment";
}
function body(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type !== "comment";
}
function p(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return next2 ? next2.type === "element" && (next2.tagName === "address" || next2.tagName === "article" || next2.tagName === "aside" || next2.tagName === "blockquote" || next2.tagName === "details" || next2.tagName === "div" || next2.tagName === "dl" || next2.tagName === "fieldset" || next2.tagName === "figcaption" || next2.tagName === "figure" || next2.tagName === "footer" || next2.tagName === "form" || next2.tagName === "h1" || next2.tagName === "h2" || next2.tagName === "h3" || next2.tagName === "h4" || next2.tagName === "h5" || next2.tagName === "h6" || next2.tagName === "header" || next2.tagName === "hgroup" || next2.tagName === "hr" || next2.tagName === "main" || next2.tagName === "menu" || next2.tagName === "nav" || next2.tagName === "ol" || next2.tagName === "p" || next2.tagName === "pre" || next2.tagName === "section" || next2.tagName === "table" || next2.tagName === "ul") : !parent || // Confusing parent.
  !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
}
function li(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type === "element" && next2.tagName === "li";
}
function dt(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return Boolean(
    next2 && next2.type === "element" && (next2.tagName === "dt" || next2.tagName === "dd")
  );
}
function dd(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type === "element" && (next2.tagName === "dt" || next2.tagName === "dd");
}
function rubyElement(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type === "element" && (next2.tagName === "rp" || next2.tagName === "rt");
}
function optgroup(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type === "element" && next2.tagName === "optgroup";
}
function option(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type === "element" && (next2.tagName === "option" || next2.tagName === "optgroup");
}
function thead(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return Boolean(
    next2 && next2.type === "element" && (next2.tagName === "tbody" || next2.tagName === "tfoot")
  );
}
function tbody(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type === "element" && (next2.tagName === "tbody" || next2.tagName === "tfoot");
}
function tfoot(_, index2, parent) {
  return !siblingAfter(parent, index2);
}
function tr(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type === "element" && next2.tagName === "tr";
}
function cells(_, index2, parent) {
  const next2 = siblingAfter(parent, index2);
  return !next2 || next2.type === "element" && (next2.tagName === "td" || next2.tagName === "th");
}

// node_modules/hast-util-to-html/lib/omission/opening.js
var opening = omission({
  body: body2,
  colgroup,
  head,
  html: html4,
  tbody: tbody2
});
function html4(node) {
  const head2 = siblingAfter(node, -1);
  return !head2 || head2.type !== "comment";
}
function head(node) {
  const seen = /* @__PURE__ */ new Set();
  for (const child2 of node.children) {
    if (child2.type === "element" && (child2.tagName === "base" || child2.tagName === "title")) {
      if (seen.has(child2.tagName)) return false;
      seen.add(child2.tagName);
    }
  }
  const child = node.children[0];
  return !child || child.type === "element";
}
function body2(node) {
  const head2 = siblingAfter(node, -1, true);
  return !head2 || head2.type !== "comment" && !(head2.type === "text" && whitespace(head2.value.charAt(0))) && !(head2.type === "element" && (head2.tagName === "meta" || head2.tagName === "link" || head2.tagName === "script" || head2.tagName === "style" || head2.tagName === "template"));
}
function colgroup(node, index2, parent) {
  const previous = siblingBefore(parent, index2);
  const head2 = siblingAfter(node, -1, true);
  if (parent && previous && previous.type === "element" && previous.tagName === "colgroup" && closing(previous, parent.children.indexOf(previous), parent)) {
    return false;
  }
  return Boolean(head2 && head2.type === "element" && head2.tagName === "col");
}
function tbody2(node, index2, parent) {
  const previous = siblingBefore(parent, index2);
  const head2 = siblingAfter(node, -1);
  if (parent && previous && previous.type === "element" && (previous.tagName === "thead" || previous.tagName === "tbody") && closing(previous, parent.children.indexOf(previous), parent)) {
    return false;
  }
  return Boolean(head2 && head2.type === "element" && head2.tagName === "tr");
}

// node_modules/hast-util-to-html/lib/handle/element.js
var constants = {
  // See: <https://html.spec.whatwg.org/#attribute-name-state>.
  name: [
    ["	\n\f\r &/=>".split(""), "	\n\f\r \"&'/=>`".split("")],
    [`\0	
\f\r "&'/<=>`.split(""), "\0	\n\f\r \"&'/<=>`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(unquoted)-state>.
  unquoted: [
    ["	\n\f\r &>".split(""), "\0	\n\f\r \"&'<=>`".split("")],
    ["\0	\n\f\r \"&'<=>`".split(""), "\0	\n\f\r \"&'<=>`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state>.
  single: [
    ["&'".split(""), "\"&'`".split("")],
    ["\0&'".split(""), "\0\"&'`".split("")]
  ],
  // See: <https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state>.
  double: [
    ['"&'.split(""), "\"&'`".split("")],
    ['\0"&'.split(""), "\0\"&'`".split("")]
  ]
};
function element(node, index2, parent, state) {
  const schema = state.schema;
  const omit = schema.space === "svg" ? false : state.settings.omitOptionalTags;
  let selfClosing = schema.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node.tagName.toLowerCase());
  const parts = [];
  let last;
  if (schema.space === "html" && node.tagName === "svg") {
    state.schema = svg2;
  }
  const attributes = serializeAttributes(state, node.properties);
  const content = state.all(
    schema.space === "html" && node.tagName === "template" ? node.content : node
  );
  state.schema = schema;
  if (content) selfClosing = false;
  if (attributes || !omit || !opening(node, index2, parent)) {
    parts.push("<", node.tagName, attributes ? " " + attributes : "");
    if (selfClosing && (schema.space === "svg" || state.settings.closeSelfClosing)) {
      last = attributes.charAt(attributes.length - 1);
      if (!state.settings.tightSelfClosing || last === "/" || last && last !== '"' && last !== "'") {
        parts.push(" ");
      }
      parts.push("/");
    }
    parts.push(">");
  }
  parts.push(content);
  if (!selfClosing && (!omit || !closing(node, index2, parent))) {
    parts.push("</" + node.tagName + ">");
  }
  return parts.join("");
}
function serializeAttributes(state, properties) {
  const values = [];
  let index2 = -1;
  let key2;
  if (properties) {
    for (key2 in properties) {
      if (properties[key2] !== null && properties[key2] !== void 0) {
        const value = serializeAttribute(state, key2, properties[key2]);
        if (value) values.push(value);
      }
    }
  }
  while (++index2 < values.length) {
    const last = state.settings.tightAttributes ? values[index2].charAt(values[index2].length - 1) : void 0;
    if (index2 !== values.length - 1 && last !== '"' && last !== "'") {
      values[index2] += " ";
    }
  }
  return values.join("");
}
function serializeAttribute(state, key2, value) {
  const info = find(state.schema, key2);
  const x = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
  const y = state.settings.allowDangerousCharacters ? 0 : 1;
  let quote = state.quote;
  let result;
  if (info.overloadedBoolean && (value === info.attribute || value === "")) {
    value = true;
  } else if ((info.boolean || info.overloadedBoolean) && (typeof value !== "string" || value === info.attribute || value === "")) {
    value = Boolean(value);
  }
  if (value === null || value === void 0 || value === false || typeof value === "number" && Number.isNaN(value)) {
    return "";
  }
  const name = stringifyEntities(
    info.attribute,
    Object.assign({}, state.settings.characterReferences, {
      // Always encode without parse errors in non-HTML.
      subset: constants.name[x][y]
    })
  );
  if (value === true) return name;
  value = Array.isArray(value) ? (info.commaSeparated ? stringify : stringify2)(value, {
    padLeft: !state.settings.tightCommaSeparatedLists
  }) : String(value);
  if (state.settings.collapseEmptyAttributes && !value) return name;
  if (state.settings.preferUnquoted) {
    result = stringifyEntities(
      value,
      Object.assign({}, state.settings.characterReferences, {
        attribute: true,
        subset: constants.unquoted[x][y]
      })
    );
  }
  if (result !== value) {
    if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) {
      quote = state.alternative;
    }
    result = quote + stringifyEntities(
      value,
      Object.assign({}, state.settings.characterReferences, {
        // Always encode without parse errors in non-HTML.
        subset: (quote === "'" ? constants.single : constants.double)[x][y],
        attribute: true
      })
    ) + quote;
  }
  return name + (result ? "=" + result : result);
}

// node_modules/hast-util-to-html/lib/handle/text.js
var textEntitySubset = ["<", "&"];
function text(node, _, parent, state) {
  return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node.value : stringifyEntities(
    node.value,
    Object.assign({}, state.settings.characterReferences, {
      subset: textEntitySubset
    })
  );
}

// node_modules/hast-util-to-html/lib/handle/raw.js
function raw(node, index2, parent, state) {
  return state.settings.allowDangerousHtml ? node.value : text(node, index2, parent, state);
}

// node_modules/hast-util-to-html/lib/handle/root.js
function root(node, _1, _2, state) {
  return state.all(node);
}

// node_modules/hast-util-to-html/lib/handle/index.js
var handle = zwitch("type", {
  invalid,
  unknown,
  handlers: { comment, doctype, element, raw, root, text }
});
function invalid(node) {
  throw new Error("Expected node, not `" + node + "`");
}
function unknown(node_) {
  const node = (
    /** @type {Nodes} */
    node_
  );
  throw new Error("Cannot compile unknown node `" + node.type + "`");
}

// node_modules/hast-util-to-html/lib/index.js
var emptyOptions = {};
var emptyCharacterReferences = {};
var emptyChildren2 = [];
function toHtml(tree, options) {
  const options_ = options || emptyOptions;
  const quote = options_.quote || '"';
  const alternative = quote === '"' ? "'" : '"';
  if (quote !== '"' && quote !== "'") {
    throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
  }
  const state = {
    one,
    all,
    settings: {
      omitOptionalTags: options_.omitOptionalTags || false,
      allowParseErrors: options_.allowParseErrors || false,
      allowDangerousCharacters: options_.allowDangerousCharacters || false,
      quoteSmart: options_.quoteSmart || false,
      preferUnquoted: options_.preferUnquoted || false,
      tightAttributes: options_.tightAttributes || false,
      upperDoctype: options_.upperDoctype || false,
      tightDoctype: options_.tightDoctype || false,
      bogusComments: options_.bogusComments || false,
      tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
      tightSelfClosing: options_.tightSelfClosing || false,
      collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
      allowDangerousHtml: options_.allowDangerousHtml || false,
      voids: options_.voids || htmlVoidElements,
      characterReferences: options_.characterReferences || emptyCharacterReferences,
      closeSelfClosing: options_.closeSelfClosing || false,
      closeEmptyElements: options_.closeEmptyElements || false
    },
    schema: options_.space === "svg" ? svg2 : html2,
    quote,
    alternative
  };
  return state.one(
    Array.isArray(tree) ? { type: "root", children: tree } : tree,
    void 0,
    void 0
  );
}
function one(node, index2, parent) {
  return handle(node, index2, parent, this);
}
function all(parent) {
  const results = [];
  const children = parent && parent.children || emptyChildren2;
  let index2 = -1;
  while (++index2 < children.length) {
    results[index2] = this.one(children[index2], index2, parent);
  }
  return results.join("");
}

// node_modules/rehype-stringify/lib/index.js
function rehypeStringify(options) {
  const self = this;
  const settings = { ...self.data("settings"), ...options };
  self.compiler = compiler;
  function compiler(tree) {
    return toHtml(tree, settings);
  }
}

// server/utils/org.ts
var EMPTY_HEADER = {
  title: "",
  date: "",
  filetags: "",
  identifier: "",
  public: false
};
function parseOrg(org) {
  return unified().use(unified_org_parse_default).parse(org);
}
function extractHeader(org) {
  const ast = parseOrg(org);
  const header = { ...EMPTY_HEADER };
  for (const node of ast.children) {
    if (node.type !== "keyword") continue;
    const key2 = node.key;
    const value = (node.value ?? "").trim();
    if (key2 === "TITLE") header.title = value;
    else if (key2 === "DATE") header.date = value;
    else if (key2 === "FILETAGS") header.filetags = value;
    else if (key2 === "IDENTIFIER") header.identifier = value;
    else if (key2 === "PUBLIC") header.public = value === "t" || value === "true";
  }
  return header;
}
function orgToHtml(org) {
  return unified().use(unified_org_parse_default).use(unified_org_rehype_default.default ?? unified_org_rehype_default).use(rehypeStringify).process(org).then((f) => f.toString());
}
function slugifyHeading(text2) {
  return text2.toLowerCase().trim().replace(/[^a-z0-9\u00e0-\u00ff]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "section";
}
function walkHeadlines(node, out) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) walkHeadlines(child, out);
    return;
  }
  if (node.type === "headline") {
    const title = String(node.rawValue ?? "");
    if (title) {
      out.push({ level: node.level ?? 1, title, slug: slugifyHeading(title) });
    }
  }
  for (const key2 of ["children", "content"]) {
    if (node[key2] !== void 0) walkHeadlines(node[key2], out);
  }
}
function buildToc(org) {
  const ast = parseOrg(org);
  const toc = [];
  walkHeadlines(ast, toc);
  return toc;
}
function orgToHtmlWithToc(org) {
  return orgToHtml(org).then((html5) => {
    const toc = buildToc(org);
    if (toc.length === 0) return { html: html5, toc };
    let i = 0;
    const withIds = html5.replace(/<h([1-6])([^>]*)>/g, (m, level, attrs) => {
      const entry = toc[i];
      i++;
      if (!entry || entry.level !== Number(level)) return m;
      const id = ` id="${entry.slug}"`;
      return `<h${level}${attrs}${attrs.includes("id=") ? "" : id}>`;
    });
    return { html: withIds, toc };
  });
}

// server/utils/notes.ts
var DENOTE_RE = /^(\d{8}T\d{6})--([^__]+?)(?:__(.+))?$/;
function dayOfId(id) {
  const m = /^(\d{4})(\d{2})(\d{2})T/.exec(id);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}
function getNotesDir() {
  return process.env.NOTES_DIR || "/root/Notes";
}
function parseDenoteName(filename) {
  const base = basename(filename, ".org");
  const m = DENOTE_RE.exec(base);
  if (!m) return null;
  return {
    identifier: m[1] ?? "",
    title: (m[2] ?? "").replace(/-/g, " "),
    tags: m[3] ? m[3].split("_").filter(Boolean) : []
  };
}
async function listFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  for (const e of entries) {
    const p2 = join(dir, e.name);
    if (e.isDirectory()) out.push(...await listFiles(p2));
    else if (e.isFile() && e.name.endsWith(".org") && !e.name.includes("sync-conflict")) out.push(p2);
  }
  return out;
}
async function listNotes() {
  const dir = getNotesDir();
  const files = await listFiles(dir);
  const notes = [];
  for (const f of files) {
    try {
      const meta = await readNoteMeta(f, dir);
      if (meta) notes.push(meta);
    } catch {
    }
  }
  notes.sort((a, b) => b.updatedAt - a.updatedAt);
  return notes;
}
async function readNoteMeta(fullPath, dir) {
  const name = parseDenoteName(basename(fullPath));
  const raw2 = await readFile(fullPath, "utf-8");
  const header = extractHeader(raw2);
  const st = await stat(fullPath);
  return {
    id: name?.identifier ?? (header.identifier || fallbackId(basename(fullPath))),
    filename: basename(fullPath),
    relPath: relative(dir, fullPath),
    folder: dirname(relative(dir, fullPath)) === "." ? "" : dirname(relative(dir, fullPath)),
    title: header.title || name?.title || basename(fullPath, ".org"),
    date: header.date,
    tags: name?.tags ?? (header.filetags ? header.filetags.replace(/^:|:$/g, "").split(":").filter(Boolean) : []),
    public: header.public,
    updatedAt: st.mtimeMs,
    day: dayOfId(header.identifier || name?.identifier || "")
  };
}
function fallbackId(filename) {
  return basename(filename, ".org").replace(/[^a-z0-9-]/gi, "-").slice(0, 60);
}
function assertNoteId(id) {
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid note id" });
  }
  return id;
}
async function findNote(id) {
  const dir = getNotesDir();
  const files = await listFiles(dir);
  for (const f of files) {
    const name = parseDenoteName(basename(f));
    if ((name?.identifier ?? fallbackId(basename(f))) === id) return { fullPath: f, dir };
  }
  throw createError({ statusCode: 404, statusMessage: "Note not found" });
}
async function readNote(id) {
  const { fullPath } = await findNote(id);
  const raw2 = await readFile(fullPath, "utf-8");
  const header = extractHeader(raw2);
  const dir = getNotesDir();
  const meta = await readNoteMeta(fullPath, dir);
  const { html: html5, toc } = await orgToHtmlWithToc(raw2);
  return {
    id,
    meta: {
      id,
      filename: basename(fullPath),
      title: meta?.title ?? header.title ?? id,
      date: meta?.date ?? "",
      public: header.public,
      tags: meta?.tags ?? []
    },
    html: html5,
    toc
  };
}
function slugify(title) {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "untitled";
}
async function saveNote(id, body3) {
  const org = typeof body3?.org === "string" ? body3.org : null;
  if (org === null) {
    throw createError({ statusCode: 400, statusMessage: "org is required" });
  }
  const { fullPath } = await findNote(id);
  const header = extractHeader(org);
  const nextTitle = header.title;
  const bodyTitle = typeof body3.title === "string" ? body3.title.trim() : "";
  const titleChanged = !!bodyTitle && bodyTitle !== nextTitle;
  const tmp = `${fullPath}.${process.pid}.tmp`;
  await writeFile(tmp, org, "utf-8");
  await rename(tmp, fullPath);
  if (titleChanged && bodyTitle) {
    await renameNoteFile(id, bodyTitle);
  }
  return { rewritten: true, id, meta: { id, title: bodyTitle || nextTitle } };
}
async function createNote(body3) {
  const title = body3.title?.trim() || "Untitled";
  const now = /* @__PURE__ */ new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const identifier = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const name = `${identifier}--${slugify(title)}.org`;
  const folder = body3.folder ? String(body3.folder).replace(/^\/+|\/+$/g, "") : "";
  const targetDir = folder ? join(getNotesDir(), folder) : getNotesDir();
  await mkdir(targetDir, { recursive: true });
  const fullPath = join(targetDir, name);
  const org = `#+title: ${title}
#+identifier: ${identifier}

`;
  await writeFile(fullPath, org, "utf-8");
  return { id: identifier, filename: name, folder };
}
async function listPublicNotes() {
  const all2 = await listNotes();
  return all2.filter((n) => n.public);
}
async function readPublicNote(id) {
  try {
    const { fullPath } = await findNote(id);
    const raw2 = await readFile(fullPath, "utf-8");
    const header = extractHeader(raw2);
    if (!header.public) return null;
    const dir = getNotesDir();
    const meta = await readNoteMeta(fullPath, dir);
    const { html: html5, toc } = await orgToHtmlWithToc(raw2);
    return { meta, html: html5, toc };
  } catch {
    return null;
  }
}
async function removeNote(id) {
  const { fullPath } = await findNote(id);
  await unlink(fullPath);
}
async function renameNoteFile(id, newTitle) {
  const { fullPath } = await findNote(id);
  const dir = dirname(fullPath);
  const raw2 = await readFile(fullPath, "utf-8");
  const header = extractHeader(raw2);
  const identifier = header.identifier || id;
  const tags = header.filetags ? header.filetags.replace(/^:|:$/g, "") : "";
  const name = `${identifier}--${slugify(newTitle)}${tags ? `__${tags}` : ""}.org`;
  if (name === basename(fullPath)) return;
  const newPath = join(dir, name);
  await rename(fullPath, newPath);
}

// server/utils/graph.ts
import { readFile as readFile2 } from "node:fs/promises";
function walkLinks(node, out) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) walkLinks(child, out);
    return;
  }
  if (node.type === "link") {
    const linkType = String(node.linkType ?? "");
    const path = String(node.path ?? "");
    if (linkType && path) out.push({ type: linkType, path });
  }
  for (const key2 of ["children", "content"]) {
    if (node[key2] !== void 0) walkLinks(node[key2], out);
  }
}
async function buildGraph() {
  const notes = await listNotes();
  const byId = /* @__PURE__ */ new Map();
  const byFilename = /* @__PURE__ */ new Map();
  for (const n of notes) {
    byId.set(n.id, n);
    byFilename.set(n.filename, n);
  }
  const nodes = notes.map((n) => ({
    id: n.id,
    title: n.title,
    filename: n.filename,
    day: n.day
  }));
  const edges = [];
  const seen = /* @__PURE__ */ new Set();
  const dir = getNotesDir();
  for (const n of notes) {
    let raw2;
    try {
      raw2 = await readFile2(`${dir}/${n.relPath}`, "utf-8");
    } catch {
      continue;
    }
    const links = [];
    walkLinks(parseOrg(raw2), links);
    for (const link of links) {
      let type = link.type;
      let path = link.path;
      const colon = path.indexOf(":");
      if (type === "fuzzy" && colon > 0) {
        const proto = path.slice(0, colon);
        if (proto === "denote" || proto === "id" || proto === "file") {
          type = proto;
          path = path.slice(colon + 1);
        }
      }
      const target = type === "denote" || type === "id" ? byId.get(path) : byFilename.get(path);
      if (!target) continue;
      const key2 = `${n.id}|${target.id}|${type}`;
      if (seen.has(key2)) continue;
      seen.add(key2);
      edges.push({ from: n.id, to: target.id, kind: type });
    }
  }
  return { nodes, edges };
}

// server/index.ts
var PORT = Number(process.env.PORT || 3100);
var PUBLIC_DIR = process.env.PUBLIC_DIR || join2(dirname2(fileURLToPath2(import.meta.url)), "dist");
var app = createApp();
var router = createRouter2();
function requireAuth(event) {
  if (!isAuthed(event)) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
}
router.get("/api/auth", defineEventHandler((event) => {
  return { authed: isAuthed(event) };
}));
router.post("/api/auth", defineEventHandler(async (event) => {
  const body3 = await readBody(event);
  if (!body3?.password || body3.password !== adminPassword()) {
    throw createError({ statusCode: 401, statusMessage: "Invalid password" });
  }
  setAuthCookie(event);
  return { authed: true };
}));
router.delete("/api/auth", defineEventHandler((event) => {
  clearAuthCookie(event);
  return { authed: false };
}));
router.get("/api/notes", defineEventHandler(async (event) => {
  requireAuth(event);
  return await listNotes();
}));
router.post("/api/notes", defineEventHandler(async (event) => {
  requireAuth(event);
  const body3 = await readBody(event);
  return await createNote(body3 ?? {});
}));
router.get("/api/notes/graph", defineEventHandler(async (event) => {
  requireAuth(event);
  return await buildGraph();
}));
router.get("/api/notes/:id", defineEventHandler(async (event) => {
  requireAuth(event);
  const id = assertNoteId(getRouterParam(event, "id"));
  try {
    return await readNote(id);
  } catch (error) {
    throw createError({ statusCode: error?.statusCode || 404, statusMessage: error?.statusMessage || "Note not found" });
  }
}));
router.put("/api/notes/:id", defineEventHandler(async (event) => {
  requireAuth(event);
  const id = assertNoteId(getRouterParam(event, "id"));
  const body3 = await readBody(event);
  try {
    return await saveNote(id, body3 ?? {});
  } catch (error) {
    throw createError({ statusCode: error?.statusCode || 404, statusMessage: error?.statusMessage || "Note not found" });
  }
}));
router.delete("/api/notes/:id", defineEventHandler(async (event) => {
  requireAuth(event);
  const id = assertNoteId(getRouterParam(event, "id"));
  try {
    await removeNote(id);
    return { ok: true };
  } catch (error) {
    throw createError({ statusCode: error?.statusCode || 404, statusMessage: error?.statusMessage || "Note not found" });
  }
}));
router.get("/api/public", defineEventHandler(async () => {
  return await listPublicNotes();
}));
router.get("/api/public/:id", defineEventHandler(async (event) => {
  const id = assertNoteId(getRouterParam(event, "id"));
  const note = await readPublicNote(id);
  if (!note) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }
  return note;
}));
var MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};
router.use("/**", defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const pathname = decodeURIComponent(url.pathname);
  const root2 = normalize2(PUBLIC_DIR);
  let filePath = normalize2(join2(root2, pathname));
  if (filePath === root2 || filePath.startsWith(root2 + "..") || !filePath.startsWith(root2)) {
    filePath = join2(root2, "index.html");
  }
  try {
    const s2 = await stat2(filePath);
    if (s2.isDirectory()) {
      filePath = join2(filePath, "index.html");
    }
  } catch {
    filePath = join2(root2, "index.html");
  }
  try {
    const data = await readFile3(filePath);
    setHeader(event, "content-type", MIME[extname(filePath)] || "application/octet-stream");
    return data;
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }
}));
app.use(router);
createServer(toNodeListener(app)).listen(PORT, () => {
  console.log(`lunatix website listening on :${PORT}`);
});
