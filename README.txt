Мобильная палитра APTS — APTS-MB-5

https://buzulutskiy.github.io/apts-mobile-palette/
Проверка для созвона: https://buzulutskiy.github.io/apts-mobile-palette/#check

Одна формула для всех цветных растяжек. Профилей brand/standard больше нет.
mb-secondary принимает любой брендовый HEX и считает его так же, как статусные
цвета. Одинаковый HEX даёт одинаковые оттенки независимо от имени.
mb-neutral — готовая исходная шкала. 13 одиночных цветов не расширяются.

Вход: #RRGGBB, непрозрачный sRGB. Выход: 10 оттенков 50–900, база на 500.
C = (T*(1000000-k) + B*k + 500000)/1000000, деление целочисленное.
T = 255 до 500, иначе 0; B — исходный канал RGB; k — общий вес ступени.
Все ступени считаются непосредственно из базы. Половины округляются вверх.
Используется прежняя кривая standard. Она ближе к четырём цветовым группам;
фиолетовая растяжка теперь отличается от Figma, особенно на тёмных ступенях.

Swift:
let shades = try APTSPalette.generate(hex: "#21C45D")
let preset = try APTSPalette.generate(name: "mb-correct")

Kotlin:
val shades = AptsPalette.generateFromHex("#21C45D")
val preset = AptsPalette.generate("mb-correct")

Android-формат:
val argb = android.graphics.Color.parseColor(preset.getValue(500))
val hex = String.format(java.util.Locale.ROOT, "#%08X", argb)
Для mb-correct: #21C45D = #FF21C45D = Int -14564259.
Compose: color.toArgb() перед сравнением; сырое Color.value — не 32-битный HEX.

На вкладке «Проверка HEX» можно менять базу, вставлять RGB/ARGB/ColorInt,
сравнивать все 10 ступеней и отдельно видеть несовпадение прозрачности.
Сравнение идёт с генератором; исходные значения Figma показаны рядом.
Скачивание контрольного JSON не меняет палитру и сохраняет текущую базу.

JSONC: algorithm с одной таблицей weights; ramps с 6 цветными растяжками
и fixedScale mb-neutral; fixed с 13 одиночными цветами; base и overlays.
Публичные генераторы принимают только 6-значный HEX; адаптация Android ARGB
показана отдельно, а поле диагностики принимает все описанные форматы.

Исходники: src/page.html, src/app.js и src/green-check.*.
palette-engine.js — генерация; color-inspector.js — нормализация записи.
APTSPalette.swift и AptsPalette.kt — полные исходники мобильных платформ.
В index.html всё встроено; внешних зависимостей и отправки значений на сервер нет.

Проверки: npm test, npm run build. Swift/JavaScript совпали на 2610 значениях HEX,
включая все 256 значений каждого канала. Kotlin не компилировался в этой среде;
контрольные значения приложены в test-vectors.json.
GitHub Pages публикует корень main. После изменений выполнить npm run build
и закоммитить исходники вместе с index.html.
