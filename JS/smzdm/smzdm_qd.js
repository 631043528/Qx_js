/*
自动签到脚本（远程版）

功能：
- 从 $prefs 中读取保存的 session_id 和 request_key
- 向签到接口发送 POST 请求，完成签到
*/

const COOKIE_KEY = "SMZDM_COOKIE";  // 存储 Cookie（包含 session_id 和其他信息）
const REQUEST_KEY = "SMZDM_REQUEST_KEY";  // 存储 request_key

// 从 $prefs 获取存储的 Cookie 和 request_key
let cookie = $prefs.valueForKey(COOKIE_KEY) || "";
let requestKey = $prefs.valueForKey(REQUEST_KEY) || "";

// 如果没有 Cookie 或 request_key，说明未登录或未获取
if (!cookie || !requestKey) {
  $notify("签到失败", "Cookie 或 request_key 缺失", "请检查 Cookie 和 request_key 是否正确");
  $done({});
}

// 准备请求头
const headers = {
  "Host": "user-api.smzdm.com",
  "Content-Type": "application/x-www-form-urlencoded",
  "request_key": requestKey,  // 从配置读取 request_key
  "Cookie": cookie,  // 从配置读取 Cookie
  "User-Agent": "smzdm 11.1.45 rv:167.8 (iPhone 15 Pro; iOS 26.1; zh-Hans_US)/iphone_smzdmapp/11.1.45"
};

// 准备请求体（如果有其他需要的参数，可以加到这里）
const body = "";

// 请求接口
const url = "https://user-api.smzdm.com/checkin";  // 签到接口

const req = {
  url: url,
  method: "POST",
  headers: headers,
  body: body
};

// 执行请求
$task.fetch(req).then(response => {
  const resBody = response.body || "";
  if (response.statusCode === 200) {
    // 成功处理签到返回的响应
    $notify("签到成功", "成功签到", resBody);
  } else {
    // 失败处理
    $notify("签到失败", "签到请求失败", resBody);
  }
  $done({});
}).catch(error => {
  // 请求出错时的处理
  $notify("签到失败", "请求失败", error.error);
  $done({});
});