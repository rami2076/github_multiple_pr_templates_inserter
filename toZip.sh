#!/bin/bash

# 出力ZIPファイル名
ZIPFILE="output.zip"

# ZIP化する対象ファイル・ディレクトリの配列
TARGETS=(
  "content.js"
  "icon.png"
  "manifest.json"
  "options.css"
  "options.html"
  "options.js"
)

# 対象ファイルの存在チェック
for f in "${TARGETS[@]}"; do
  if [ ! -e "$f" ]; then
    echo "警告: '$f' は存在しません"
  fi
done

# zipファイル作成
zip -r "$ZIPFILE" "${TARGETS[@]}"

echo "作成完了: $ZIPFILE"
