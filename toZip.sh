#!/bin/bash

# 使用方法チェック
content.js
icon.png
LICENCE
manifest.json
options.css
options.html
options.js

# 出力ファイル名（.zip拡張子自動追加）
ZIPFILE="github-pr-multiple-template-inserter"
shift

# もし .zip が末尾についてなければ付ける
if [[ "$ZIPFILE" != *.zip ]]; then
  ZIPFILE="${ZIPFILE}.zip"
fi

# 対象ファイルの存在チェック
for f in "$@"; do
  if [ ! -e "$f" ]; then
    echo "エラー: ファイル '$f' が存在しません"
    exit 1
  fi
done

# zipファイル作成
zip -r "$ZIPFILE" "$@"

echo "作成完了: $ZIPFILE"
