/*
 * HiFiTi论坛远程签到脚本（远程托管版）
 * 注意：COOKIE 和 UA 从本地配置文件 [prefs] 读取
 */

(async () => {
    // 读取本地配置文件变量
    const COOKIE = $prefs?.valueForKey("HIFITI_COOKIE") || "";
    const USER_AGENT = $prefs?.valueForKey("HIFITI_UA") || "";

    if (!COOKIE) {
        $notify("HiFiTi签到失败", "缺少 Cookie", "请在配置文件 prefs 区块里添加 HIFITI_COOKIE");
        $done();
        return;
    }

    const URL = "https://hifiti.com/sg_sign.htm";

    const headers = {
        "Host": "hifiti.com",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "Cookie": COOKIE,
        "User-Agent": USER_AGENT || "Mozilla/5.0 (iPhone; CPU iPhone OS 26_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/145.0 Mobile/15E148 Safari/604.1",
        "Referer": URL,
        "Accept": "text/plain, */*; q=0.01",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://hifiti.com",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Connection": "keep-alive",
        "Accept-Encoding": "gzip, deflate, br"
    };

    try {
        const response = await $task.fetch({ url: URL, method: "POST", headers: headers });
        let msg = "签到完成";

        try {
            const result = JSON.parse(response.body);
            if (result.code === 0 || result.success) {
                msg = result.message || "签到成功！";
                if (result.data && result.data.points) {
                    msg += `\n获得积分: ${result.data.points}`;
                }
            } else {
                msg = result.message || JSON.stringify(result);
            }
        } catch (e) {
            msg = response.body && response.body.length > 0 ? response.body.substring(0, 100) : "响应为空或格式异常";
        }

        $notify("HiFiTi论坛", "自动签到执行完毕", msg);
        $done();
    } catch (reason) {
        $notify("HiFiTi论坛", "签到请求失败", reason.error || reason);
        $done();
    }
})();