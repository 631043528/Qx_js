/*
自动抓取并保存 session_id 和 request_key 的脚本

功能：
- 自动从请求中提取 session_id、request_key 和 Cookie 参数
- 将它们保存到 Quantumult X 的 $prefs 中，以便后续使用
*/

const COOKIE_KEY = "SMZDM_COOKIE";  // 存储 Cookie（包含 session_id 和其他信息）
const REQUEST_KEY = "SMZDM_REQUEST_KEY";  // 存储 request_key

// 获取当前请求的 URL 和请求头
if (typeof $request === "undefined" || !$request) {
  $notify("自动抓取失败", "当前脚本需要配合 script-request-header 使用", "请确保重写规则正确");
  $done({});
}

const url = $request.url || "";
const headers = $request.headers || {};
const cookie = headers["Cookie"] || headers["cookie"] || "";
const ua = headers["User-Agent"] || headers["user-agent"] || "";

// 提取 Cookie 中的 session_id
function getSessionId(cookie) {
  const match = cookie.match(/session_id=([^;]+)/);
  return match ? match[1] : null;
}

// 提取 URL 中的 request_key
function getRequestKey(url) {
  const match = url.match(/[?&]request_key=([^&]+)/);
  return match ? match[1] : null;
}

// 获取 session_id 和 request_key
const sessionId = getSessionId(cookie);
const requestKey = getRequestKey(url);

// 如果抓到了参数，保存到 $prefs 中
let changed = false;
let msg = "";

if (sessionId && !$prefs.valueForKey(COOKIE_KEY)) {
  $prefs.setValueForKey(sessionId, COOKIE_KEY);
  changed = true;
  msg += "已抓取并保存 session_id。\n";
}

if (requestKey && !$prefs.valueForKey(REQUEST_KEY)) {
  $prefs.setValueForKey(requestKey, REQUEST_KEY);
  changed = true;
  msg += "已抓取并保存 request_key。\n";
}

if (changed) {
  $notify("自动抓取成功 ✅", "成功抓取参数", msg.trim());
} else {
  $notify("自动抓取失败", "未能抓取到有效的参数", "请确认当前请求包含 session_id 和 request_key");
}

$done({});