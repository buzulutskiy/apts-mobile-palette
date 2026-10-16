Мобильная палитра APTS

Страница: https://buzulutskiy.github.io/apts-mobile-palette/

Три вкладки: палитра, сравнение с Figma, исходный код iOS/Android.
Страница работает без внешних библиотек и позволяет скачать JSONC.

Профили
brand — для настраиваемого mb-secondary. Базовый HEX может быть любым.
standard — общий профиль ссылок и индикаторов.
mb-neutral — готовая нейтральная шкала.
13 одиночных цветов, включая mb-background, остаются без расширения.

Пример
Swift:
let brandHex = "#965DF5"
let shades = try APTSPalette.generate(hex: brandHex, profile: "brand")

Kotlin:
val brandHex = "#965DF5"
val shades = AptsPalette.generate(brandHex, "brand")

В результате ключ 500 содержит brandHex, другие ключи — оттенки 50–900.
По готовому имени: generate(name: "mb-link") в Swift или generate("mb-link") в Kotlin.

Формула
C = (T*(1000000-k) + B*k + 500000)/1000000, целочисленно.
B — исходный канал RGB, k — вес ступени в выбранном профиле.
T = 255 до ступени 500, иначе 0. Половины округляются вверх.
Каждая ступень рассчитывается непосредственно из базы.

Файлы
index.html — автономная страница GitHub Pages.
src/page.html, src/app.js — редактируемые исходники интерфейса.
palette-engine.js — генератор JavaScript.
palette-data.json — конфигурация и эталонные данные для сравнения.
APTSPalette.swift, AptsPalette.kt — исходники мобильных платформ.
apts-mobile.jsonc — готовые значения и параметры двух профилей.
test-vectors.json — контрольные результаты для проверки платформ.

Обновление страницы
Требуется Node.js. Сторонних зависимостей нет.
npm test
npm run build
Закоммитить изменённые исходники вместе с пересобранным index.html.
GitHub Pages публикует корень ветки main.

Проверки
5 тестов JavaScript. Swift скомпилирован и проверен по контрольным HEX.
Kotlin в этой среде не компилировался: перед интеграцией Android нужно
прогнать test-vectors.json.
