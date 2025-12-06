/*
奶昔论坛（forum.naixi.net）自动抓 Cookie + formhash（更稳版本）

专门抓这类请求：
GET /plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=xxxx

当前用法：
- 你在 [rewrite_local] 里写了：
  ^https?:\/\/forum\.naixi\.net\/plugin\.php\?id=k_misign:sign&operation=qiandao&format=text&formhash=.+ url script-request-header NX_cookie.js

功能：
- 保存 Cookie 到 NAIXI_COOKIE
- 保存 UA 到 NAIXI_UA
- 从 URL 里解析 formhash 保存到 NAIXI_FORMHASH
*/

const COOKIE_KEY = "NAIXI_COOKIE";
const UA_KEY = "NAIXI_UA";
const FORMHASH_KEY = "NAIXI_FORMHASH";

if (typeof $request === "undefined" || !$request) {
  $notify("奶昔论坛", "抓取失败", "当前脚本需要配合 script-request-header 使用");
  $done({});
}

const url = $request.url || "";
const headers = $request.headers || {};
const cookie = headers["Cookie"] || headers["cookie"] || "";
const ua = headers["User-Agent"] || headers["user-agent"] || "";

// --- 关键：不用正则，手动按 ? 和 & 拆分参数，找 formhash ---
function getFormhash(u) {
  if (!u) return null;
  const qIndex = u.indexOf("?");
  if (qIndex === -1) return null;

  const query = u.substring(qIndex + 1); // 去掉 '?'
  const parts = query.split("&");

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;
    const kv = part.split("=");
    const key = kv[0];
    const val = kv.slice(1).join("="); // 防止值里面带 '='

    if (key === "formhash" && val) {
      return val;
    }
  }

  return null;
}

const formhash = getFormhash(url);

// --- 旧值 ---
const oldCookie = $prefs.valueForKey(COOKIE_KEY);
const oldUa = $prefs.valueForKey(UA_KEY);
const oldFormhash = $prefs.valueForKey(FORMHASH_KEY);

let changed = false;
let msg = "";

// 更新 Cookie
if (cookie && cookie !== oldCookie) {
  if ($prefs.setValueForKey(cookie, COOKIE_KEY)) {
    changed = true;
    msg += "已更新 Cookie。\n";
  }
}

// 更新 UA
if (ua && ua !== oldUa) {
  $prefs.setValueForKey(ua, UA_KEY);
  changed = true;
  msg += "已保存 UA。\n";
}

// 更新 formhash
if (formhash && formhash !== oldFormhash) {
  if ($prefs.setValueForKey(formhash, FORMHASH_KEY)) {
    changed = true;
    msg += "已捕获 formhash: " + formhash + "\n";
  }
}

if (changed) {
  // 为了方便你确认，顺便把 URL 打出来
  msg += "\n当前 URL：\n" + url;
  $notify("奶昔论坛", "抓取成功 ✅", msg.trim());
} else {
  // 调试用，不打扰就注释掉
  // $notify("奶昔论坛", "没有变化", "URL:\n" + url + "\nformhash: " + (formhash || "未解析到"));
}

// 控制台调试
console.log("Naixi capture => url:", url, " formhash:", formhash);

$done({});