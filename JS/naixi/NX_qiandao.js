/*
奶昔论坛自动签到脚本（Quantumult X 通用版）

从本地持久化读取：
- NAIXI_COOKIE   => Cookie（naixi_cookie.js 抓）
- NAIXI_UA       => UA（naixi_cookie.js 抓）
- NAIXI_FORMHASH => formhash（naixi_cookie.js 抓）
*/

const COOKIE_KEY = "NAIXI_COOKIE";
const UA_KEY = "NAIXI_UA";
const FORMHASH_KEY = "NAIXI_FORMHASH";

function notify(title, subtitle, msg) {
  $notify(title, subtitle, msg);
}

function done() {
  $done();
}

async function signNaixi() {
  let cookie = $prefs.valueForKey(COOKIE_KEY) || "";
  let ua = $prefs.valueForKey(UA_KEY) || "";
  let formhash = $prefs.valueForKey(FORMHASH_KEY) || "";

  if (!ua) {
    ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile Safari/604.1";
  }

  if (!cookie) {
    notify(
      "奶昔论坛",
      "签到失败",
      "本地没有 NAIXI_COOKIE。\n请先打开奶昔论坛并点击一次签到按钮，让 naixi_cookie.js 抓取 Cookie。"
    );
    return done();
  }

  if (!formhash) {
    notify(
      "奶昔论坛",
      "签到失败",
      "本地没有 NAIXI_FORMHASH。\n请再打开签到页面 / 点击一次签到，让 naixi_cookie.js 抓取 formhash。"
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

    if (msg.length > 150) {
      msg = msg.slice(0, 150) + " ...";
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