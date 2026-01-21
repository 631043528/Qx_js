#!/bin/bash


TARGET="/vol1/1000/git/Qx_js"


cd "$TARGET" || exit

echo "--- 准备同步目录: $TARGET ---"


git add .


if git diff-index --quiet HEAD --; then
    echo "提示：没有检测到任何变动，跳过推送。"
else
    
    msg="Update at $(date +'%Y-%m-%d %H:%M')"
    git commit -m "$msg"
    
    
    echo "正在推送到 GitHub..."
    git push
    echo "--- 同步完成！ ---"
fi