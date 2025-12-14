#!/bin/bash

# Скрипт для копирования логотипов команд
# Запустите этот скрипт из корневой папки проекта

SOURCE="/Users/danialtalgatov/Downloads/logo"
TARGET="./logos"

echo "Копирование логотипов из $SOURCE в $TARGET..."

# Создаем папку если её нет
mkdir -p "$TARGET"

# Копируем все jpg файлы
count=0
for file in "$SOURCE"/*.jpg; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        cp "$file" "$TARGET/$filename"
        echo "✓ Скопирован: $filename"
        ((count++))
    fi
done

echo ""
echo "Готово! Скопировано $count логотипов."

