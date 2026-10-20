var crypto = require("crypto");
var fs = require("fs");

var COOKIE_NAME = "classpro_teacher_session";
var SESSION_TTL_MS = 8 * 60 * 60 * 1000;
var LOGIN_WINDOW_MS = 10 * 60 * 1000;
var LOGIN_LIMIT = 8;

function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString("hex");
  var hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return "scrypt$" + salt + "$" + hash;
}

function verifyPassword(password, stored) {
  var parts = String(stored || "").split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  var actual = crypto.scryptSync(String(password || ""), parts[1], 64);
  var expected;
  try { expected = Buffer.from(parts[2], "hex"); } catch (error) { return false; }
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function readAccounts(file) {
  try {
    var parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(parsed.teachers) ? parsed.teachers : [];
  } catch (error) { return []; }
}

function publicProfile(account) {
  return {
    id: String(account.id || ""),
    username: String(account.username || ""),
    displayName: String(account.displayName || account.username || ""),
    classIds: Array.isArray(account.classIds) ? account.classIds.map(String) : []
  };
}

function parseCookies(req) {
  return String(req && req.headers && req.headers.cookie || "").split(";").reduce(function (out, part) {
    var at = part.indexOf("=");
    if (at < 0) return out;
    out[part.slice(0, at).trim()] = decodeURIComponent(part.slice(at + 1).trim());
    return out;
  }, {});
}

function passwordVersion(account) {
  return crypto.createHash("sha256").update(String(account && account.passwordHash || "")).digest("hex").slice(0, 16);
}

function createAuth(options) {
  options = options || {};
  var accounts = options.accounts || readAccounts(options.accountsFile || "");
  var signingKey = crypto.createHash("sha256").update(String(options.sessionSecret || crypto.randomBytes(32).toString("hex"))).digest();
  var failures = new Map();

  function findAccount(username) {
    var target = String(username || "").trim().toLowerCase();
    return accounts.find(function (account) {
      return String(account.username || account.id || "").trim().toLowerCase() === target;
    }) || null;
  }

  function createToken(account, expiresAt) {
    var payload = Buffer.from(JSON.stringify({
      sub: String(account.username || account.id || "").trim().toLowerCase(),
      exp: expiresAt,
      ver: passwordVersion(account)
    })).toString("base64url");
    var signature = crypto.createHmac("sha256", signingKey).update(payload).digest("base64url");
    return payload + "." + signature;
  }

  function accountFromToken(token) {
    var parts = String(token || "").split(".");
    if (parts.length !== 2) return null;
    var actual = Buffer.from(parts[1]);
    var expected = Buffer.from(crypto.createHmac("sha256", signingKey).update(parts[0]).digest("base64url"));
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    try {
      var payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
      var account = findAccount(payload.sub);
      if (!account || account.disabled || Number(payload.exp) <= Date.now()) return null;
      return payload.ver === passwordVersion(account) ? account : null;
    } catch (error) { return null; }
  }

  function login(username, password, address) {
    var key = String(address || "unknown") + "|" + String(username || "").trim().toLowerCase(), now = Date.now();
    var attempts = (failures.get(key) || []).filter(function (time) { return now - time < LOGIN_WINDOW_MS; });
    if (attempts.length >= LOGIN_LIMIT) return { ok: false, status: 429, message: "登录尝试过多，请稍后再试。" };
    var account = findAccount(username);
    if (!account || account.disabled || !verifyPassword(password, account.passwordHash)) {
      attempts.push(now); failures.set(key, attempts);
      return { ok: false, status: 401, message: "账号或密码不正确。" };
    }
    failures.delete(key);
    var expiresAt = now + SESSION_TTL_MS;
    return { ok: true, token: createToken(account, expiresAt), profile: publicProfile(account), expiresAt: expiresAt };
  }

  function authenticate(req) {
    var account = accountFromToken(parseCookies(req)[COOKIE_NAME]);
    return account ? publicProfile(account) : null;
  }

  function logout() {}

  function canAccess(profile, classId) {
    return !!profile && profile.classIds.indexOf(String(classId || "")) >= 0;
  }

  return {
    configured: accounts.length > 0,
    login: login,
    authenticate: authenticate,
    logout: logout,
    canAccess: canAccess
  };
}

module.exports = {
  COOKIE_NAME: COOKIE_NAME,
  SESSION_TTL_MS: SESSION_TTL_MS,
  createAuth: createAuth,
  hashPassword: hashPassword,
  verifyPassword: verifyPassword
};
