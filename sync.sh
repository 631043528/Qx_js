#!/bin/bash

# 锁定目标目录
TARGET="/vol1/1000/git/Qx_js"

# 切换到目标目录，如果失败则退出
cd "$TARGET" || exit

echo "--- 准备同步目录: $TARGET ---"

# 1. 自动添加修改
git add .

# 2. 判断是否有东西需要提交
if git diff-index --quiet HEAD --; then
    echo "提示：没有检测到任何变动，跳过推送。"
else
    # 使用当前时间作为默认备注
    msg="Update at $(date +'%Y-%m-%d %H:%M')"
    git commit -m "$msg"
    
    # 3. 推送
    echo "正在推送到 GitHub..."
    git push
    echo "--- 同步完成！ ---"
fi
