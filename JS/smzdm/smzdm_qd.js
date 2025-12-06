// 提取 Cookie 中的 session_id
var sessionId = $request.headers['Cookie'].match(/session_id=([^;]+)/)[1];

// 提交签到请求
var request = {
  url: 'https://user-api.smzdm.com/checkin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'smzdm 11.1.45 rv:167.8 (iPhone 15 Pro; iOS 26.1; zh-Hans_US)/iphone_smzdmapp/11.1.45',
    'Cookie': $request.headers['Cookie']
  },
  body: `session_id=${sessionId}&request_key=715134021764891704`
};

// 发起签到请求
$httpClient.post(request, function(error, response, data) {
  if (error) {
    $notification.post('签到失败', '', '请检查网络或 Cookie 配置');
  } else {
    var json = JSON.parse(data);
    if (json.success) {
      $notification.post('签到成功', '', '已成功签到');
    } else {
      $notification.post('签到失败', '', json.message);
    }
  }
});
