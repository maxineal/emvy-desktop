.import "main.js" as Main
.import "stateData.js" as State
.import "strings.js" as Strings
.import "tools.js" as Tools

var _columnComponent = Qt.createComponent("qrc:/components/Column.qml");
var _textComponent = Qt.createComponent("qrc:/components/Text.qml");
var _horLine = Qt.createComponent("qrc:/components/HorizontalLine.qml");
var _verLine = Qt.createComponent("qrc:/components/VerticalLine.qml");

// TODO: исправить рекурсию

var decimalProbability = true;
var symbols_n = 0;

function execute()
{
    console.time("execute");
    decimalProbability = main_menu_encoding_pt_decimal.checked;
    var array = fillProbabilityArray();
    if(array === null) return;

    Tools.deleteChildren(outputArea);
    drawSymbolsAndProbabilities(array);

    var kMean = 0, iMean = 0;

    // Шеннон-Фано 
    if(radioButton_shennon.checked) {
        var maxColIndex = shennonFano(array, 0, array.length, 0);
        for(var i = 0; i < maxColIndex + 1; i++) {
            var a = [];
            for(var j = 0; j < array.length; j++) {
                a.push(Tools.isDefined(array[j][i]) ? array[j][i] : " ");
            }
            drawColumn(i + 1, a, true);
        }
        var finalCode = shennonFanoFinalCode(array, maxColIndex);
        drawColumn("Код", finalCode, true);
        // Считаем Kср
        for(var i = 0; i < finalCode.length; i++) {
            kMean += finalCode[i].length *
                    (decimalProbability ? array[i].probability : array[i].probability / symbols_n);
            delete finalCode[i];
        }
    }
    // Хаффман
    else {
        var table = haffmanMakeTable(array);
        haffman(table);
        haffmanBack(table);
        drawHaffmanTable(table);

        // Считаем Kср
        for(var i = 0; i < table[0].length; i++) {
            kMean += table[0][i].code.length *
                    (decimalProbability ? array[i].probability : array[i].probability / symbols_n);
        }

        // Очистка таблицы
        for(var i = 0; i < table.length; i++) {
            for(var j = 0; j < table[i].length; j++) delete table[i][j];
        }
        table = null;
    }

    // Избыточность
    // Считаем Iср
    var lp = 0;
    for(var i = 0; i < array.length; i++) {
        lp = (decimalProbability ? array[i].probability : array[i].probability / symbols_n);
        iMean += lp * Tools.getBaseLog(2, lp);
    }
    iMean *= -1;

    k_mean.text = kMean;
    i_mean.text = iMean;
    quality.text = (kMean / iMean) - 1;

    for(var i = 0; i < array.length; i++) delete array[i];
    array = null;

    scrollView.visible = true;
    gc();

    console.timeEnd("execute");
}

// Отрисовка таблицы Хаффмана
function drawHaffmanTable(table)
{
    for(var i = 0; i < table.length; i++) {
        _verLine.createObject(outputArea);
        var column1 = _columnComponent.createObject(outputArea);
        _textComponent.createObject(column1).text = "";

        _verLine.createObject(outputArea);
        var column2 = _columnComponent.createObject(outputArea);
        _textComponent.createObject(column2).text = "";

        for(var j = 0; j < table[i].length; j++) {
            _textComponent.createObject(column2).text = table[i][j].probability + (decimalProbability ? "" : "/" + symbols_n);
            _textComponent.createObject(column1).text = table[i][j].code;
        }
    }
}

// Обратный ход Хаффмана
function haffmanBack(table)
{
    var colIndex = table.length - 1;
    table[colIndex][0].code = "0"; table[colIndex][1].code = "1";
    var delta, prevLen;
    for(; colIndex >= 1; colIndex--) {
        delta = 0;
        prevLen = table[colIndex - 1].length;
        for(var i = 0; i < table[colIndex].length; i++) {
            if(table[colIndex][i].hasParent) {
                delta++;
                table[colIndex - 1][prevLen - 2].code = table[colIndex][i].code + "0";
                table[colIndex - 1][prevLen - 1].code = table[colIndex][i].code + "1";
                continue;
            }
            table[colIndex - 1][i - delta].code = table[colIndex][i].code;
        }
    }
}

// Хаффман
function haffman(table)
{
    var colIndex = table.length;
    var lastLen = 10;
    while(lastLen !== 2) {
        colIndex = table.length;
        var col = haffmanCopyColumn(table[colIndex - 1]);
        var oldLen = col.length;
        var sum = col.pop().probability + col.pop().probability;
        var inserted = false;
        for(var i = 0; i < col.length; i++) {
            col[i].hasParent = false;
            if((sum > col[i].probability) && !inserted) {
                col.splice(i, 0, {probability: sum, code: "", hasParent: true});
                inserted = true;
            }
        }
        if(!inserted) {
            col.push({probability: sum, code: "", hasParent: true});
        }
        lastLen = col.length;
        table.push(col);
    }
}


// Копирует столбец значений Хаффмана
function haffmanCopyColumn(oldcol)
{
    var col = [];
    for(var i = 0; i < oldcol.length; i++) {
        col.push({
                     probability: Tools.cloneObject(oldcol[i].probability),
                     hasParent: Tools.cloneObject(oldcol[i].hasParent),
                     code: Tools.cloneObject(oldcol[i].code)
                 });
    }
    return col;
}

// Создает таблицу базовую таблицу Хаффмана
function haffmanMakeTable(array)
{
    var table = [];
    table[0] = [];
    for(var i = 0; i < array.length; i++) {
        table[0].push({probability: array[i].probability, code: "", hasParent: false});
    }
    return table;
}

// --------------------------------------------------------------------------------------------

// Шеннон-Фано
function shennonFano(array, a, b, colIndex)
{
    if(b - a < 2) return colIndex - 1;

    // Разбиваем вероятности по половине
    var halfProbability = 0;
    for(var i = a; i < b; i++) {
        halfProbability += array[i].probability / 2;
    }

    // Ищем средний индекс
    var p = 0;
    var c = a;
    for(var i = a; i < b; i++) {
        p += array[i].probability;
        if(p >= halfProbability) {
            c = i;
            break;
        }
    }

    // Расставляем биты
    for(var i = a; i < b; i++) {
        array[i][colIndex] = i <= c ? 0 : 1;
    }

    // Обрабатываем следующие интервалы
    var nextColIndex1 = shennonFano(array, a, c + 1, colIndex + 1);
    var nextColIndex2 = shennonFano(array, c + 1, b, colIndex + 1);

    return Math.max(colIndex, nextColIndex1, nextColIndex2);
}

// Собирает конечный результат Шеннона-Фано
function shennonFanoFinalCode(array, maxColIndex)
{
    var a = [];
    for(var i = 0; i < array.length; i++) {
        a[i] = "";
        for(var j = 0; j < maxColIndex + 1; j++) {
            a[i] += (Tools.isDefined(array[i][j])) ? array[i][j] : "";
        }
    }
    return a;
}

// Отрисовывает символы и вероятности
function drawSymbolsAndProbabilities(probs)
{
    var a = [], b = [];
    for(var i = 0; i < probs.length; i++) {
        a.push(probs[i].symbol);
        b.push(probs[i].probability + (decimalProbability ? "" : "/" + symbols_n));
    }
    drawColumn(qsTr("Символ"), a);
    drawColumn(qsTr("Вероятность"), b);
    delete a; delete b;
}

// Добавляет столбец в таблицу
function drawColumn(title, data, vertline)
{
    if(vertline) {
        _verLine.createObject(outputArea);
    }
    var column = _columnComponent.createObject(outputArea);
    var object = _textComponent.createObject(column);
    object.text = "<b>" + title + "</b>";
    object.textFormat = Qt.RichText
    //_horLine.createObject(column);

    for(var i = 0; i < data.length; i++) {
        object = _textComponent.createObject(column);
        object.text = data[i];
    }
}

// Заполнение массива вероятностями
function fillProbabilityArray()
{
    // Подготовка текста
    var text = input_text.text;
    if(checkBox_crAsSpace.checked) {
        text = text.split('\n').join('');
    }
    // уберем возврат каретки
    text = text.split('\r').join('');

    symbols_n = text.length;
    if(symbols_n === 0) {
        Main.msgBox("Введите текст.");
        return null;
    }

    // Не учитывать регистр
    var array_text = text.split('');
    if(checkBox_ignoreCase.checked) {
        for(var i = 0; i < array_text.length; i++) {
            array_text[i] = array_text[i].toUpperCase();
        }
    }

    for(var i = 0; i < array_text.length; i++) {
        if(array_text[i] === ' ') array_text[i] = 'пробел';
        else if(array_text[i] === '\n') array_text[i] = 'перенос строки';
    }

    // Считаем вероятность
    var probability = [];
    while(array_text.length > 0) {
        var symbol = array_text.shift();
        var count = 1;
        for(var i = 0; i < array_text.length; i++) {
            if(array_text[i] === symbol) {
                array_text.splice(i, 1);
                i--;
                count++;
            }
        }
        probability.push({
                             symbol: symbol,
                             probability: decimalProbability ? (count / symbols_n) : count
                         });
    }

    // Сортировка по убыванию
    probability.sort(function(a, b) {
        if(a.probability === b.probability) {
            return a.symbol.charCodeAt(0) < b.symbol.charCodeAt(0) ? -1 : 1;
        }
        return a.probability > b.probability ? -1 : 1;
    });
    return probability;
}
