/*
* 奶昔论坛通用签到脚本 (最终调试版)
* 强制在开始和读取参数后输出日志
*/

console.log("--- Script Execution Started ---"); // 强制输出日志 1

// --- 1. 读取参数 (使用 $task.url 确保 Cron 任务环境兼容性) ---
const urlString = $task.url || "";
const argumentString = new URLSearchParams(urlString).get('argument');

console.log("Raw Argument String:", argumentString); // 强制输出日志 2 (检查参数是否成功读取)

// 从 argument 字符串中解析 cookie 和 formhash
const params = Object.fromEntries(
    (argumentString || '').split('&')
    .filter(Boolean)
    .map(p => p.split('='))
);

const Cookie = decodeURIComponent(params.cookie || '');
const formhash = decodeURIComponent(params.formhash || '');
const Host = "forum.naixi.net";

// --- 2. 参数检查 ---
if (!Cookie || !formhash) {
    $notify("奶昔论坛", "签到失败：参数缺失", "请在 Quantumult X 任务 argument 字段传入 cookie 和 formhash!");
    $done();
    return;
}
console.log("Cookie and formhash successfully parsed."); // 强制输出日志 3 (检查解析是否成功)

// --- 3. 构造请求 ---
const url = `https://${Host}/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=${formhash}`;
// ... (Headers and request construction remain the same)

const headers = {
    "Host": Host,
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    "Cookie": Cookie, 
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 26_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/145.0 Mobile/15E148 Safari/604.1",
    "Referer": "https://forum.naixi.net/forum.php?forumlist=1",
    "Accept": "*/*",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "X-Requested-With": "XMLHttpRequest"
};

const myRequest = {
    url: url,
    method: "GET",
    headers: headers
};

// --- 4. 发送请求并处理结果 ---
$task.fetch(myRequest).then(response => {
    let body = response.body;
    let msg = "";

    // 提取 CDATA 中的纯文本
    if (body.indexOf("CDATA") !== -1) {
        let match = body.match(/CDATA\[(.*?)\]/);
        msg = (match && match[1]) ? match[1] : "签到完成，详情见日志";
    } else {
        msg = body;
    }
    
    $notify("奶昔论坛", "自动签到状态", msg);
    $done();
}, reason => {
    $notify("奶昔论坛", "签到失败", "网络错误或请求被拒绝: " + reason.error);
    $done();
});
