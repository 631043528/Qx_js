/*
奶昔论坛自动签到脚本（Quantumult X）

配合 naixi_cookie.js 使用：
- 从 $prefs 读取 NAIXI_COOKIE / NAIXI_FORMHASH / NAIXI_UA
*/

const COOKIE_KEY = "NAIXI_COOKIE";
const UA_KEY = "NAIXI_UA";
const FORMHASH_KEY = "NAIXI_FORMHASH";

let cookie = $prefs.valueForKey(COOKIE_KEY) || "";
let ua = $prefs.valueForKey(UA_KEY) || "";
let formhash = $prefs.valueForKey(FORMHASH_KEY) || "";

// 默认 UA
if (!ua) {
  ua =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile Safari/604.1";
}

function notify(title, subtitle, msg) {
  $notify(title, subtitle, msg);
}

function done() {
  $done();
}

async function signNaixi() {
  if (!cookie) {
    notify(
      "奶昔论坛",
      "签到失败",
      "未获取到 Cookie。\n请先按说明访问签到页面，让 naixi_cookie.js 抓一次 Cookie。"
    );
    return done();
  }
  if (!formhash) {
    notify(
      "奶昔论坛",
      "签到失败",
      "未获取到 formhash。\n请在浏览器中点一次签到按钮，再试一次抓 Cookie。"
    );
    return done();
  }

  const signUrl =
    "https://forum.naixi.net/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=" +
    encodeURIComponent(formhash);

  const req = {
    url: signUrl,
    method: "GET",
    headers: {
      Host: "forum.naixi.net",
      Cookie: cookie,
      "User-Agent": ua,
      Referer: "https://forum.naixi.net/forum.php?forumlist=1",
      Accept: "*/*",
      "X-Requested-With": "XMLHttpRequest",
    },
  };

  try {
    const resp = await $task.fetch(req);
    const body = resp.body || "";
    let msg = body;

    // 为了避免太长，只截取前 120 个字符
    if (msg.length > 120) {
      msg = msg.slice(0, 120) + " ...";
    }

    notify("奶昔论坛", "自动签到执行完毕", msg);
  } catch (e) {
    notify(
      "奶昔论坛",
      "签到请求失败",
      String(e && e.error ? e.error : e)
    );
  } finally {
    done();
  }
}

signNaixi();
