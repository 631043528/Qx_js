/*
奶昔论坛（forum.naixi.net）自动抓 Cookie + formhash（简单稳定版）

专门抓这类请求：
GET /plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=xxxx

使用方式：
1. 在 [rewrite_local] 里用 script-request-header 挂这个脚本（见配置示例）。
2. 开启 MitM 并信任证书。
3. 用 Safari 打开奶昔论坛，点击“签到”按钮（会发起那条 GET）。
4. 抓到新的 Cookie / formhash 会弹通知。

保存键：
- NAIXI_COOKIE   => Cookie
- NAIXI_UA       => User-Agent
- NAIXI_FORMHASH => formhash
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

// 从 URL 里提取 formhash
function getFormhash(u) {
  if (!u) return null;
  const m = u.match(/[?&]formhash=([^&]+)/);
  return m ? m[1] : null;
}

const formhash = getFormhash(url);

// 旧值
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
  $notify("奶昔论坛", "抓取成功 ✅", msg.trim() || "已有数据更新");
}

// 调试用
console.log("Naixi capture => url:", url, " formhash:", formhash);

$done({});