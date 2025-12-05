/**
 * hifiti.com 每日签到脚本 for Quantumult X
 * 使用方法：在脚本中填入你的 COOKIE，
 * 在 Quantumult X 的 [task_local] 中添加定时运行配置。
 */

(async () => {
  // ---------- 请把下面的 COOKIE 字符串替换为你自己的 cookie ----------
  const COOKIE = 'bbs_token=...; HMACCOUNT=...; bbs_sid=...; Hm_lpvt_23819a3dd53d3be5031ca942c6cbaf25=...; Hm_lvt_23819a3dd53d3be5031ca942c6cbaf25=...';
  // -----------------------------------------------------------------------

  const request = {
    url: 'https://hifiti.com/sg_sign.htm',
    method: 'POST',
    headers: {
      'Host': 'hifiti.com',
      'Origin': 'https://hifiti.com',
      'Referer': 'https://hifiti.com/sg_sign.htm',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/145.0  Mobile/15E148 Safari/604.1',
      'Accept': 'text/plain, */*; q=0.01',
      'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'X-Requested-With': 'XMLHttpRequest',
      'Connection': 'keep-alive',
      // Content-Length: 0  
      'Cookie': COOKIE
    },
    body: '' //
  };

  try {
    const resp = await $task.fetch(request);
    const status = resp.status || resp.statusCode || 0;
    let body = resp.body || '';

    // 尝试解析 
    try {
      const j = JSON.parse(body);
      body = JSON.stringify(j, null, 2);
    } catch (e) {
      // 非 JSON 返回则保持原样
    }

    const title = 'hifiti 每日签到';
    const subtitle = `HTTP ${status}`;
    // 发通知（Quantumult X 支持 $notify）
    $notify(title, subtitle, body);
  } catch (err) {
    $notify('hifiti 签到失败', '', String(err));
  } finally {
    $done();
  }
})();