.import "main.js" as Main
.import "stateData.js" as State
.import "strings.js" as Strings
.import "tools.js" as Tools

// TODO: добавить поддержку отрицательных чисел

function execute()
{
    console.time("execute");
    if(validate()) {
        prepareView(true);
        makeOperation();
    }
    else {
        prepareView(false);
    }

    console.timeEnd("execute");
    gc();
}

// Подготовка вида
function prepareView(state)
{
    var $teacher = State.mode !== "student";

    label_text_answer.visible =
            label_answer.visible = state;

    label_text_decision.visible =
            state && $teacher;

    column_add.visible = state && $teacher && comboBox_action.currentIndex <= 1;

    label_add_sign1.text = label_add_sign2.text = comboBox_action.currentIndex === 0 ? "+" : "-";

    Tools.deleteChildren(row_add_number1, row_add_number2, row_add_sum, row_add_correction, row_add_result);
}

function validate()
{
    var num1 = Strings.replace(input_number1.text, "., ", "");
    var num2 = Strings.replace(input_number2.text, "., ", "");
    if(num1.length === 0 || num2.length === 0) {
        Main.msgBox("Оба числа должны быть введены.");
        return false;
    }
    if(!Tools.isNumber(num1, 2) || num1.length % 4 !== 0) {
        Main.msgBox("Число 1 введено неправильно.", {
                        details: "Код BCD состоит из нулей и единиц; его длина должна быть кратна четырем."
                    });
        return false;
    }
    if(!Tools.isNumber(num2, 2) || num2.length % 4 !== 0) {
        Main.msgBox("Число 2 введено неправильно.", {
                        details: "Код BCD состоит из нулей и единиц; его длина должна быть кратна четырем."
                    });
        return false;
    }
    return true;
}

function makeOperation()
{
    var num1 = input_number1.text.split(',').join('.');
    var num2 = input_number2.text.split(',').join('.');

    num1 = Tools.initBcdObject(num1);
    num2 = Tools.initBcdObject(num2);

    if(comboBox_action.currentIndex === 0) {
        add(num1, num2);
    }
    else if(comboBox_action.currentIndex === 1) {
        sub(num1, num2);
    }
    else if(comboBox_action.currentIndex === 2) {
        mul(num1, num2);
    }
}

// Сложение
function add(an, bn)
{
    var max = Math.max(an.max, bn.max);
    var min = Math.min(an.min, bn.min);
    var c = Tools.initBcdObject(0);
    var correctionIndices = [];

    // двоичное сложение
    for(var i = min; i <= max; i++) {
        c.add(i, an.get(i) + bn.get(i));
        if(c.get(i) >= 2) {
            if((i + 1) % 4 === 0) {
                correctionIndices.push(~~(i / 4));
            }
            c.set(i + 1, 1);
            c.sub(i, 2);
        }
    }

    // проверка запрещенных комбинаций
    for(var i = c.minTetrad; i <= c.maxTetrad; i++) {
        if(c.getTetradDecimal(i) > 9) {
            correctionIndices.push(i);
        }
    }

    // корректирующий код
    var corrector = "";
    for(var i = c.maxTetrad; i >= c.minTetrad; i--) {
        if(i === -1) {
            corrector += '.';
        }
        corrector += correctionIndices.indexOf(i) > -1 ? "0110" : "0000";
    }
    corrector = Tools.fixBcd(corrector);
    var d = Tools.initBcdObject(corrector);

    // добавляем корректирующий код
    var result = Tools.initBcdObject(0);
    min = Math.min(d.min, c.min);
    max = Math.max(d.max, c.max);
    for(var i = min; i <= max; i++) {
        result.add(i, c.get(i) + d.get(i));
        if(result.get(i) >= 2) {
            result.set(i + 1, 1);
            result.sub(i, 2);
        }
    }

    label_answer.text = Strings.printf("{0}<sub>bcd</sub> + {1}<sub>bcd</sub> = {2}<sub>bcd</sub>.",
                                       an.toString(), bn.toString(), Tools.fixBcd(result.toString()));

    var hasCorrector = Strings.replace(corrector, '0.', '').length > 0;
    label_add_sign2.visible =
            line_add_second.visible =
            row_add_correction.visible =
            row_add_sum.visible =
            hasCorrector;

    if(State.mode !== "student") {
        var textComponent = Qt.createComponent("qrc:/components/NumberComponent.qml");

        max = Math.max(an.max, bn.max, c.max);
        while((max + 1) % 4 !== 0) max++;
        min = Math.min(an.min, bn.min, c.min);
        while((min) % 4 !== 0) min--;

        for(var i = max; i >= min; i--) {
            if((i + 1) % 4 === 0 && i !== max) {
                var txt = (i === -1 ? "." : " ")
                textComponent.createObject(row_add_number1).text = txt;
                textComponent.createObject(row_add_number2).text = txt;
                textComponent.createObject(row_add_sum).text = txt;
                textComponent.createObject(row_add_correction).text = txt;
                textComponent.createObject(row_add_result).text = txt;
            }

            textComponent.createObject(row_add_number1).text = an.getView(i);
            textComponent.createObject(row_add_number2).text = bn.getView(i);
            textComponent.createObject(row_add_sum).text = c.getView(i);
            textComponent.createObject(row_add_correction).text = d.getView(i);
            textComponent.createObject(row_add_result).text = result.getView(i);
        }
    }
}

// Вычитание
function sub(an, bn)
{
    var max = Math.max(an.max, bn.max);
    var min = Math.min(an.min, bn.min);
    var c = Tools.initBcdObject(0);
    var correctionIndices = [];
    var acopy = Tools.copyBcdObject(an);

    // двоичное вычитание
    var a, b;
    var tetradIndex = 0;
    for(var i = min; i <= max; i++) {
        a = an.get(i);
        b = bn.get(i);
        if(a < b) {
            tetradIndex = ~~(i / 4);
            for(var j = i + 1; j <= max; j++) {
                if(an.get(j) !== 0)
                {
                    // межтетрадный перенос
                    if(~~(j / 4) !== tetradIndex) {
                        correctionIndices.push(tetradIndex);
                    }
                    an.sub(j, 1);
                    a += 2;
                    for(var k = j - 1; k > i; k--) {
                        an.set(k, 1);
                    }
                    break;
                }
            }
        }
        c.set(i, a - b);
    }

    // коррекция
    var result = Tools.initBcdObject(0);
    for(var i = c.maxTetrad; i >= c.minTetrad; i--) {
        var tetrad = c.getTetrad(i);
        if(correctionIndices.indexOf(i) > -1) {
            var s = Tools.basedSub(tetrad, "0110", 2);
            result.setTetrad(i, s);
        }
        else
        {
            result.setTetrad(i, c.getTetrad(i));
        }
    }

    // вывод
    label_answer.text = Strings.printf("{0}<sub>bcd</sub> - {1}<sub>bcd</sub> = {2}<sub>bcd</sub>.",
                                       an.toString(), bn.toString(), Tools.fixBcd(result.toString()));


    label_add_sign2.visible =
            line_add_second.visible =
            row_add_correction.visible =
            row_add_sum.visible =
            correctionIndices.length > 0;

    if(State.mode !== "student") {
        var textComponent = Qt.createComponent("qrc:/components/NumberComponent.qml");

        max = Math.max(an.max, bn.max, c.max);
        while((max + 1) % 4 !== 0) max++;
        min = Math.min(an.min, bn.min, c.min);
        while((min) % 4 !== 0) min--;

        var corrector = [0, 1, 1, 0];
        var tetradIndex, tetradDiv;

        for(var i = max; i >= min; i--) {
            if((i + 1) % 4 === 0 && i !== max) {
                var txt = (i === -1 ? "." : " ")
                textComponent.createObject(row_add_number1).text = txt;
                textComponent.createObject(row_add_number2).text = txt;
                textComponent.createObject(row_add_sum).text = txt;
                textComponent.createObject(row_add_correction).text = txt;
                textComponent.createObject(row_add_result).text = txt;
            }

            tetradIndex = ~~(i / 4);
            tetradDiv = i - (~~(i / 4));

            textComponent.createObject(row_add_number1).text = acopy.getView(i);
            textComponent.createObject(row_add_number2).text = bn.getView(i);
            textComponent.createObject(row_add_sum).text = c.getView(i);
            textComponent.createObject(row_add_correction).text =
                    (correctionIndices.indexOf(tetradIndex) > -1 ? corrector[tetradDiv] : 0);
            textComponent.createObject(row_add_result).text = result.getView(i);
        }
    }

    console.log(correctionIndices);
    console.log(c.toString());
    console.log(result.toString());
}

// Умножение
function mul()
{

}

