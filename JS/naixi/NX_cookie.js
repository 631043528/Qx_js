/*
奶昔论坛（forum.naixi.net）自动抓 Cookie + formhash
用于 Quantumult X 的 script-request-header

使用方式：
1. 配好 [rewrite_local] 规则（见后面配置示例）。
2. 开启 MitM，并信任证书。
3. 在 Safari 打开奶昔论坛并点击一次签到（或访问签到链接）。
4. 抓到 Cookie 和 formhash 后会弹“获取成功”的通知。
*/

const COOKIE_KEY = "NAIXI_COOKIE";
const UA_KEY = "NAIXI_UA";
const FORMHASH_KEY = "NAIXI_FORMHASH";

if (typeof $request === "undefined" || !$request.headers) {
  $notify("奶昔论坛", "获取 Cookie 失败", "需要配合 rewrite_local 使用");
  $done({});
}

// 请求头
const headers = $request.headers;
let cookie =
  headers["Cookie"] || headers["cookie"] || "";
let ua =
  headers["User-Agent"] || headers["user-agent"] || "";

// 从 URL 里找 formhash 参数
function getFormhash(url) {
  const match = url.match(/[?&]formhash=([^&]+)/);
  return match ? match[1] : null;
}

const url = $request.url || "";
const formhash = getFormhash(url);

if (!cookie) {
  $notify("奶昔论坛", "获取 Cookie 失败", "请求头中未找到 Cookie");
  $done({});
}

// 读取旧值
const oldCookie = $prefs.valueForKey(COOKIE_KEY);
const oldFormhash = $prefs.valueForKey(FORMHASH_KEY);

let changed = false;

// 更新 Cookie
if (oldCookie !== cookie) {
  if ($prefs.setValueForKey(cookie, COOKIE_KEY)) {
    changed = true;
  }
}

// 更新 UA
if (ua && $prefs.valueForKey(UA_KEY) !== ua) {
  $prefs.setValueForKey(ua, UA_KEY);
  changed = true;
}

// 更新 formhash
if (formhash && oldFormhash !== formhash) {
  if ($prefs.setValueForKey(formhash, FORMHASH_KEY)) {
    changed = true;
  }
}

if (changed) {
  let msg = "已保存 Cookie";
  if (ua) msg += "\n已保存 User-Agent";
  if (formhash) msg += `\n已保存 formhash: ${formhash}`;
  else msg += "\n未在 URL 中找到 formhash，请尝试点一次签到按钮。";
  $notify("奶昔论坛", "获取 Cookie 成功 ✅", msg);
} else {
  // 如不想打扰，可以注释掉这行
  // $notify("奶昔论坛", "提示", "Cookie / formhash 未变化");
}

$done({});