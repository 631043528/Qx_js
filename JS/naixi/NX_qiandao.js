/*
奶昔论坛自动签到脚本（Quantumult X 通用版）

通用设计：
- Cookie：从 $prefs 读取 NAIXI_COOKIE（由 naixi_cookie.js 自动抓）
- UA：从 $prefs 读取 NAIXI_UA，没有就用默认 UA
- formhash：优先从 argument 里的 formhash=xxx 读取，其次从 $prefs 的 NAIXI_FORMHASH 读取

使用方法（给每个用户）：
1. 先用抓 Cookie 脚本（naixi_cookie.js）访问签到页面，拿到 NAIXI_COOKIE。
2. 从自己能成功签到的 URL 中抠出 formhash 那一串。
3. 在 [task_local] 的这一条任务后面加 argument=formhash=那一串。
*/

const COOKIE_KEY = "NAIXI_COOKIE";
const UA_KEY = "NAIXI_UA";
const FORMHASH_KEY = "NAIXI_FORMHASH";

// 解析 argument= 里的参数
function getArgStr() {
  if (typeof $environment !== "undefined" && $environment["argument"]) {
    return $environment["argument"];
  }
  return "";
}

function parseArgs(str) {
  const res = {};
  if (!str) return res;
  str.split("&").forEach(part => {
    if (!part) return;
    const [k, ...rest] = part.split("=");
    if (!k) return;
    res[k.trim()] = decodeURIComponent(rest.join("=") || "").trim();
  });
  return res;
}

const args = parseArgs(getArgStr());

// 从本地持久化读取
let cookie = $prefs.valueForKey(COOKIE_KEY) || "";
let ua = $prefs.valueForKey(UA_KEY) || "";
// formhash 优先用 argument 里的，其次用本地保存的
let formhash = args.formhash || $prefs.valueForKey(FORMHASH_KEY) || "";

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
      "未获取到 Cookie。\n请先运行 naixi_cookie.js 抓一次 Cookie（访问签到页面）。"
    );
    return done();
  }

  if (!formhash) {
    notify(
      "奶昔论坛",
      "签到失败",
      "未配置 formhash。\n请在任务的 argument 中添加：formhash=你的那一串。"
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