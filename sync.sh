#!/bin/bash


TARGET="/vol1/1000/git/Qx_js"

cd "$TARGET" || exit

echo "--- Ready: $TARGET ---"


git add .


if git diff-index --quiet HEAD --; then
  
else
 
    msg="Update at $(date +'%Y-%m-%d %H:%M')"
    git commit -m "$msg"
    
    git push
    
    echo "--- Success！ ---"
fi
