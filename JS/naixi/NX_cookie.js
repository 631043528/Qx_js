/*
奶昔论坛（forum.naixi.net）自动抓 Cookie + formhash - 加强版

用法：
1. 在 QX 的 [rewrite_local] 里配：script-request-body naixi_cookie.js
2. 打开 MitM 并信任证书。
3. 用 Safari 打开奶昔论坛，随便逛几页，点一次签到。
4. 抓到新的 Cookie 或 formhash 时，会弹“抓取成功 ✅”通知。

保存键：
- NAIXI_COOKIE   => Cookie
- NAIXI_UA       => User-Agent
- NAIXI_FORMHASH => formhash
*/

const COOKIE_KEY = "NAIXI_COOKIE";
const UA_KEY = "NAIXI_UA";
const FORMHASH_KEY = "NAIXI_FORMHASH";

if (typeof $request === "undefined" || !$request) {
  $notify("奶昔论坛", "抓取失败", "当前脚本需要配合 rewrite_local 使用");
  $done({});
}

// 1. 请求头
const headers = $request.headers || {};
let cookie = headers["Cookie"] || headers["cookie"] || "";
let ua = headers["User-Agent"] || headers["user-agent"] || "";

// 2. URL 和 body，用来找 formhash
let url = $request.url || "";
let body = $request.body || "";

// 在字符串中寻找 formhash=xxxx 的小工具
function findFormhash(str) {
  if (!str) return null;
  // 尝试匹配 formhash= 后面一串字母数字
  const m = str.match(/formhash=([a-zA-Z0-9]{4,})/);
  return m ? m[1] : null;
}

let formhashFromUrl = findFormhash(url);
let formhashFromBody = findFormhash(body);
let formhash = formhashFromUrl || formhashFromBody;

// 3. 读取原来的值，看看有没有变化
const oldCookie = $prefs.valueForKey(COOKIE_KEY);
const oldUa = $prefs.valueForKey(UA_KEY);
const oldFormhash = $prefs.valueForKey(FORMHASH_KEY);

let changed = false;

// 更新 Cookie
if (cookie && cookie !== oldCookie) {
  if ($prefs.setValueForKey(cookie, COOKIE_KEY)) {
    changed = true;
  }
}

// 更新 UA
if (ua && ua !== oldUa) {
  $prefs.setValueForKey(ua, UA_KEY);
  changed = true;
}

// 更新 formhash
if (formhash && formhash !== oldFormhash) {
  if ($prefs.setValueForKey(formhash, FORMHASH_KEY)) {
    changed = true;
  }
}

// 4. 有任何变化就通知一下
if (changed) {
  let msg = "";
  if (cookie && cookie !== oldCookie) msg += "已更新 Cookie。\n";
  if (ua && ua !== oldUa) msg += "已保存 UA。\n";
  if (formhash && formhash !== oldFormhash) msg += "已捕获 formhash: " + formhash;
  if (!formhash) msg += "本次请求未发现 formhash，继续使用旧的 NAIXI_FORMHASH。";

  $notify("奶昔论坛", "抓取成功 ✅", msg);
}

// 控制台调试用（可选）
console.log(
  "Naixi debug => url:",
  url,
  " formhash:",
  formhash,
  " body length:",
  (body || "").length
);

$done({});