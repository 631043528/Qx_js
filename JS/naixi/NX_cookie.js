/*
奶昔论坛（forum.naixi.net）自动抓 Cookie
简化版：只抓 Cookie 和 UA，不再强制获取 formhash

使用方式：
1. 配好 [rewrite_local] 规则（见配置示例）。
2. 打开 MitM 并信任证书。
3. Safari 打开奶昔论坛并点击一次签到。
4. 抓到 Cookie 后会弹“获取 Cookie 成功”的通知。

Cookie 保存键：NAIXI_COOKIE
UA 保存键：NAIXI_UA
*/

const COOKIE_KEY = "NAIXI_COOKIE";
const UA_KEY = "NAIXI_UA";

if (typeof $request === "undefined" || !$request.headers) {
  $notify("奶昔论坛", "获取 Cookie 失败", "需要配合 rewrite_local 使用");
  $done({});
}

const headers = $request.headers;
let cookie = headers["Cookie"] || headers["cookie"] || "";
let ua = headers["User-Agent"] || headers["user-agent"] || "";

if (!cookie) {
  $notify("奶昔论坛", "获取 Cookie 失败", "请求头中未找到 Cookie");
  $done({});
}

const oldCookie = $prefs.valueForKey(COOKIE_KEY);
let changed = false;

if (oldCookie !== cookie) {
  if ($prefs.setValueForKey(cookie, COOKIE_KEY)) {
    changed = true;
  }
}

if (ua && $prefs.valueForKey(UA_KEY) !== ua) {
  $prefs.setValueForKey(ua, UA_KEY);
  changed = true;
}

if (changed) {
  let msg = "已成功保存 Cookie。";
  if (ua) msg += "\n并保存了 User-Agent。";
  $notify("奶昔论坛", "获取 Cookie 成功 ✅", msg);
} else {
  // 不打扰你
  // $notify("奶昔论坛", "提示", "Cookie 未变化，将继续使用旧的 Cookie");
}

$done({});