const fs = require('fs');
const path = require('path');

const sourceDir = '/Users/danialtalgatov/Downloads/logo';
const targetDir = '/Users/danialtalgatov/Downloads/neura-map-2/logos';

console.log('Начинаю копирование логотипов...');
console.log('Источник:', sourceDir);
console.log('Назначение:', targetDir);

// Проверяем существование папок
if (!fs.existsSync(sourceDir)) {
  console.error('Ошибка: исходная папка не найдена!');
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  console.log('Создаю папку назначения...');
  fs.mkdirSync(targetDir, { recursive: true });
}

// Читаем все jpg файлы
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.jpg'));

console.log(`Найдено ${files.length} файлов`);

let copied = 0;
files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✓ Скопирован: ${file}`);
    copied++;
  } catch (error) {
    console.error(`✗ Ошибка при копировании ${file}:`, error.message);
  }
});

console.log(`\nГотово! Успешно скопировано ${copied} из ${files.length} файлов.`);

