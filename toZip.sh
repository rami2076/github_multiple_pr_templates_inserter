#!/bin/bash

ZIPFILE="output.zip"
TARGETS=(
  "content.js"
  "manifest.json"
  "options.css"
  "options.html"
  "options.js"
  "icons/icon-white-16.png"
  "icons/icon-white-32.png"
  "icons/icon-white-48.png"
  "icons/icon-white-128.png"
)

# スクリプトのあるディレクトリに移動
cd "$(dirname "$0")"

# 出力先ディレクトリ
OUTPUT_DIR="output"

# 出力ディレクトリの初期化（中身のみ削除）
if [ -d "$OUTPUT_DIR" ]; then
  rm -rf "${OUTPUT_DIR:?}/"*
else
  mkdir -p "$OUTPUT_DIR"
fi

# 存在チェック
MISSING=0
for f in "${TARGETS[@]}"; do
  if [ ! -e "$f" ]; then
    echo "エラー: '$f' は存在しません"
    MISSING=1
  fi
done

if [ "$MISSING" -eq 1 ]; then
  echo "ZIP作成を中止します"
  exit 1
fi

# 対象ファイル・ディレクトリを output に構造ごとコピー
for f in "${TARGETS[@]}"; do
  # コピー先ディレクトリを作成
  mkdir -p "$OUTPUT_DIR/$(dirname "$f")"
  # コピー（-a で属性保持、ファイルもディレクトリも対応）
  cp -a "$f" "$OUTPUT_DIR/$f"
done

# outputフォルダに移動してzip作成
pushd "$OUTPUT_DIR" > /dev/null
[ -f "$ZIPFILE" ] && rm "$ZIPFILE"
zip -r "$ZIPFILE" ./*
popd > /dev/null

echo "作成完了: $OUTPUT_DIR/$ZIPFILE"
