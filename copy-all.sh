#!/bin/bash
set -e

SOURCE="/Users/danialtalgatov/Downloads/logo"
TARGET="/Users/danialtalgatov/Downloads/neura-map-2/logos"

echo "=== Копирование логотипов ==="
echo "Источник: $SOURCE"
echo "Назначение: $TARGET"
echo ""

count=0
for file in "$SOURCE"/*.jpg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        cp "$file" "$TARGET/$filename"
        echo "✓ $filename"
        ((count++))
    fi
done

echo ""
echo "=== Готово! Скопировано $count файлов ==="
ls -1 "$TARGET"/*.jpg 2>/dev/null | wc -l | xargs echo "Всего jpg файлов в папке:"

