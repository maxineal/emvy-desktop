
.import "main.js" as Main
.import "stateData.js" as State
.import "strings.js" as Strings
.import "tools.js" as Tools

function execute()
{
    console.time("execute");
    prepareView();
    if(validate()) {
        makeOperation();
    }
    console.timeEnd("execute");
    gc();
}

// Подготовка вида
function prepareView()
{
    label_answer_text.visible = true;
    label_short_decision.visible = true;

    if(State.mode !== 'student') {
        label_decision_text.visible = true;

        label_showAs_text.visible = (num1_base.value !== num2_base.value);

        Tools.deleteChildren(basedNumber1);
        Tools.deleteChildren(basedNumber2);
        Tools.deleteChildren(basedResult);
        //grid_addition_substract.visible = (action.currentIndex < 2); // сложение, вычитание
    }
}

// Валидация
function validate()
{
    if(num1.text.length === 0 || num2.text.length === 0) {
        Main.msgBox(qsTr("Введите число."));
    }
    if(!Tools.isNumber(num1.text, num1_base.value)) {
        Main.msgBox("Число 1 введено неправильно.", {
                        details: "Возможно, вы ввели число неправильно или выбрано неверное основание."
                    });
        return false;
    }
    if(!Tools.isNumber(num2.text, num2_base.value)) {
        Main.msgBox("Число 2 введено неправильно.", {
                        details: "Возможно, вы ввели число неправильно или выбрано неверное основание."
                    });
        return false;
    }
    return true;
}

// Выполнение операции
function makeOperation()
{
    var n1 = num1.text;
    var n2 = num2.text;
    var primaryBase = num1_base.value;
    var secondaryBase = num2_base.value;

    // В какой системе производятся вычисления
    if(num1_base.value !== num2_base.value) {
        if(mainbase.currentIndex === 0) {
            n2 = Tools.fromDecimal(Tools.toDecimal(n2, num2_base.value), num1_base.value, 5);
            label_showAs_text.text =
                    Strings.printf("Число {0}<sub>{1}</sub> в {2}-ричной системе счисления: {3}<sub>{2}</sub>.",
                                   num2.text, secondaryBase, primaryBase, n2);
        } else {
            n1 = Tools.fromDecimal(Tools.toDecimal(n1, num1_base.value), num2_base.value, 5);
            primaryBase = num2_base.value;
            secondaryBase = num1_base.value;
            label_showAs_text.text =
                    Strings.printf("Число {0}<sub>{1}</sub> в {2}-ричной системе счисления: {3}<sub>{2}</sub>.",
                                   num1.text, secondaryBase, primaryBase, n1);
        }
    }

    var a = floatToObject(n1, primaryBase);
    var b = floatToObject(n2, primaryBase);

    // сложение
    if(action.currentIndex === 0) {
        addition(a, b, primaryBase, secondaryBase);
    }
}

// Сложение
function addition(an, bn, base1, base2)
{
    var a, b;
    var min = Math.min(an.min, bn.min);
    var max = Math.max(an.max, bn.max);
    var result = {
        min: min,
        max: max
    };

    for(var i = min; i <= max; i++) {
        a = Tools.isDefined(an[i]) ? an[i] : 0;
        b = Tools.isDefined(bn[i]) ? bn[i] : 0;
        if(!Tools.isDefined(result[i])) result[i] = 0;
        result[i] += (a + b);
        if(result[i] >= base1) {
            if(!Tools.isDefined()) {
                result[i + 1] = 0;
            }
            result[i + 1] += 1;
            result[i] -= base1;
            if(i + 1 > result.max) {
                result.max = i + 1;
            }
        }
    }

    var resultInBase1 = objectToFloat(result, base1);
    var text =
            Strings.printf("{0}<sub>{1}</sub> + {2}<sub>{3}</sub> = {4}<sub>{5}</sub>",
                           num1.text, num1_base.value,
                           num2.text, num2_base.value,
                           resultInBase1, base1);

    // если системы счисления не совпадают, вывести две
    var resultInDec = Tools.toDecimal(resultInBase1, base1, 5);
    if(base1 !== base2) {
        text += " = " + Tools.fromDecimal(resultInDec, base2) +
                "<sub>" + base2 + "</sub>";
    }

    // переводим дополнительно в десятичную
    if(base1 !== 10 && base2 !== 10) {
        text += " = " + resultInDec + "<sub>10</sub>";
    }
    label_short_decision.text = text;

    if(State !== 'student') {
        var component = Qt.createComponent("qrc:/components/textcomponent.qml");
        var object;
        var hasDot = false, dotNow = false;
        min = Math.min(min, result.min);
        max = Math.max(max, result.max);

        for(var i = max; i >= min; i--) {
            if(i === -1) {
                component.createObject(basedNumber1).text = '.';
                component.createObject(basedNumber2).text = '.';
                component.createObject(basedResult).text = '.';
            }

            object = component.createObject(basedNumber1);
            object.text = Tools.isDefined(an[i]) ? Tools.getBasedNumber(an[i], 36) : (i < an.min ? '0' : '');

            object = component.createObject(basedNumber2);
            object.text = Tools.isDefined(bn[i]) ? Tools.getBasedNumber(bn[i], 36) : (i < bn.min ? '0' : '');

            object = component.createObject(basedResult);
            object.text = Tools.isDefined(result[i]) ? Tools.getBasedNumber(result[i], 36) : (i < result.min ? '0' : '');
         }
    }
}


// Преобразует число в объект
// Где каждому числовому полю соответствует разряд
function floatToObject(n, base)
{
    var s = n.toString();
    var maxN = s.length - 1;
    if(s.indexOf('.') > -1) {
        maxN = s.indexOf('.') - 1;
    }
    var obj = {max: maxN};
    var sym = '';
    for(var i = 0; i < s.length; i++) {
        sym = s.substr(i, 1);
        if(sym === '.') continue;
        obj[maxN] = Tools.getNumber(sym, base);
        maxN--;
    }
    obj.min = maxN + 1;
    return obj;
}

// Преобразует объект в число
function objectToFloat(obj, base)
{
    var n = '';
    var dot = false;
    for(var i = obj.max; i >= obj.min; i--) {
        if(i < 0 && !dot) {
            n += '.';
            dot = true;
        }
        n += Tools.getBasedNumber(obj[i], base);
    }
    var dotPos = n.indexOf('.');
    if(dotPos > -1) {
        while(n.substr(n.length - 1, 1) === '0' || n.substr(n.length - 1, 1) === '.') {
            n = n.substr(0, n.length - 1);
        }
    }
    return n;
}
