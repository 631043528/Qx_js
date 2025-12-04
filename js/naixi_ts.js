/*
* 奶昔论坛通用签到脚本 (最终完整版)
* 依赖配置: QX Task 配置中，请使用简洁参数格式 (去掉 argument=)
*/

console.log("--- Script Execution Started ---");

// --- 1. 读取参数 (直接解析 $task.url 的原始查询字符串) ---
const urlString = $task.url || "";
// 🚨 关键修改: 直接解析 $task.url 的查询部分
const query = urlString.includes('?') ? urlString.split('?')[1] : '';

console.log("Raw Query String:", query); // 强制输出日志 2 (检查参数是否成功读取)

// 从 Raw Query String 中解析 cookie 和 formhash
const params = Object.fromEntries(
    (query || '').split('&')
    .filter(Boolean)
    .map(p => p.split('='))
);

// 注意：Cookie 和 formhash 需要解码，以防某些字符在 URL 中被编码
const Cookie = decodeURIComponent(params.cookie || '');
const formhash = decodeURIComponent(params.formhash || '');
const Host = "forum.naixi.net";

// --- 2. 参数检查 ---
if (!Cookie || !formhash) {
    $notify("奶昔论坛", "签到失败：参数缺失", "请检查 Quantumult X 任务配置中 Cookie 和 formhash 是否正确传入。");
    console.log("Error: Cookie or formhash is missing after parsing.");
    $done();
    return;
}
console.log("Cookie and formhash successfully parsed. Starting fetch...");

// --- 3. 构造请求 ---
const url = `https://${Host}/plugin.php?id=k_misign:sign&operation=qiandao&format=text&formhash=${formhash}`;

const headers = {
    "Host": Host,
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    "Cookie": Cookie, // 使用动态 Cookie
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
    console.log("Fetch success. Message:", msg);
    $done();
}, reason => {
    $notify("奶昔论坛", "签到失败", "网络错误或请求被拒绝: " + reason.error);
    console.log("Fetch failed. Reason:", reason.error);
    $done();
});
