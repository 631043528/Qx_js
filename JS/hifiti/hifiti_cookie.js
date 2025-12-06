/*
HiFiTi 论坛 - 自动抓 Cookie 脚本（Quantumult X）

使用方法：
1. 在 [rewrite_local] 里配好规则（后面有示例）。
2. 打开 Quantumult X 的 MitM，并信任证书。
3. Safari 打开 https://hifiti.com/sg_sign.htm，登录后访问一次签到页面。
4. 抓到 Cookie 后会弹通知提示“获取 Cookie 成功”。

Cookie 会保存到 $prefs 里，键名：HIFITI_COOKIE
*/

const COOKIE_KEY = "HIFITI_COOKIE";
const UA_KEY = "HIFITI_UA";

if (typeof $request === "undefined" || !$request.headers) {
  $notify("HiFiTi 论坛", "获取 Cookie 失败", "当前脚本需要配合 rewrite_local 使用");
  $done({});
}

let cookie = $request.headers["Cookie"] || $request.headers["cookie"] || "";
let ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";

if (!cookie) {
  $notify("HiFiTi 论坛", "获取 Cookie 失败", "请求头里没有 Cookie");
  $done({});
}

// 读取旧 cookie
const oldCookie = $prefs.valueForKey(COOKIE_KEY);

// 只有在变化时才更新，避免频繁弹通知
if (oldCookie !== cookie) {
  const ok = $prefs.setValueForKey(cookie, COOKIE_KEY);
  if (ok) {
    let msg = "已成功保存 Cookie。";
    if (ua) {
      $prefs.setValueForKey(ua, UA_KEY);
      msg += "\n并保存了 User-Agent。";
    }
    $notify("HiFiTi 论坛", "获取 Cookie 成功 ✅", msg);
  } else {
    $notify("HiFiTi 论坛", "保存 Cookie 失败 ❌", "请检查 Quantumult X 权限。");
  }
} else {
  // Cookie 没变化就不打扰你了，需要的话可以打开下面这行通知
  // $notify("HiFiTi 论坛", "Cookie 未变化", "仍然使用已保存的 Cookie");
}

$done({});
