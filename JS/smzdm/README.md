
#MitM添加

hostname = user-api.smzdm.com

#区块添加
[rewrite_local]
^https:\/\/user-api\.smzdm\.com\/checkin$ url script-response-body https://raw.githubusercontent.com/631043528/Qx_js/main/JS/smzdm/smzdm_qd.js

#定时任务
0 0 * * * url script-response-body https://raw.githubusercontent.com/631043528/Qx_js/main/JS/smzdm/smzdm_qd.js
