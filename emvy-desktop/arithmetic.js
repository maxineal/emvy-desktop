
.import "main.js" as Main
.import "stateData.js" as State
.import "strings.js" as Strings
.import "tools.js" as Tools

// TODO: добавить поддержку отрицательных чисел

function execute()
{
    prepareView();
    console.time("execute");
    if(validate()) {
        makeOperation();
    }
    console.timeEnd("execute");
    gc();
}

// Подготовка вида
function prepareView()
{
    var $teacher = State.mode !== 'student';

    label_text_answer.visible =
            label_answer.visible = true;

    label_text_decision.visible =
            label_final_answer.visible = $teacher;
    label_num1_more_num2.visible =
            $teacher &&
            (parseFloat(Tools.toDecimal(num1.text, num1_base.value)) <
             parseFloat(Tools.toDecimal(num2.text, num2_base.value)));

    label_text_showAs.visible =
            $teacher && (num1_base.value !== num2_base.value);

    Tools.deleteChildren(basedNumber1, basedNumber2, basedResult, basedDecision);
    row_add_substract_multiply.visible = $teacher && (action.currentIndex <= 2);
    basedDecision.visible = $teacher && (action.currentIndex === 2);
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
            label_text_showAs.text =
                    Strings.printf("Число {0}<sub>{1}</sub> в {2}-ричной системе счисления: {3}<sub>{2}</sub>.",
                                   num2.text, secondaryBase, primaryBase, n2);
        } else {
            n1 = Tools.fromDecimal(Tools.toDecimal(n1, num1_base.value), num2_base.value, 5);
            primaryBase = num2_base.value;
            secondaryBase = num1_base.value;
            label_text_showAs.text =
                    Strings.printf("Число {0}<sub>{1}</sub> в {2}-ричной системе счисления: {3}<sub>{2}</sub>.",
                                   num1.text, secondaryBase, primaryBase, n1);
        }
    }

    var a = Tools.initSplitNumber(n1);
    var b = Tools.initSplitNumber(n2);

    // сложение
    if(action.currentIndex === 0) {
        addition(a, b, primaryBase, secondaryBase);
    }
    // вычитание
    else if(action.currentIndex === 1) {
        substraction(a, b, primaryBase, secondaryBase);
    }
    else if(action.currentIndex === 2) {
        multiply(a, b, primaryBase, secondaryBase);
    }
}

// Сложение
function addition(an, bn, base1, base2)
{
    operation_sign.text = '+';

    var $teacher = State.mode !== 'student';
    var a, b;
    var min = Math.min(an.min, bn.min);
    var max = Math.max(an.max, bn.max);
    var result = Tools.initSplitNumber(0);

    for(var i = min; i <= max; i++) {
        a = an.get(i);
        b = bn.get(i);
        result.add(i, a + b);

        if(result.get(i) >= base1) {
            result.set(i + 1, 1);
            result.sub(i, base1);
        }
    }

    // ответ
    label_answer.text =
            Strings.printf("{0}<sub>{1}</sub> + {2}<sub>{3}</sub> = {4}<sub>{1}</sub>",
                           num1.text, num1_base.value,
                           num2.text, num2_base.value,
                           result.toString());

    if(base1 !== 10) {
        var resultInDecimalBase = Tools.toDecimal(result.toString(), base1, 5);
        label_answer.text +=
                Strings.printf(" = {0}<sub>10</sub>", resultInDecimalBase);
    }

    // вывод решения
    if($teacher) {
        var component = Qt.createComponent("qrc:/components/textcomponent.qml");
        for(var i = result.max; i >= result.min; i--) {
            component.createObject(basedNumber1).text = (i === -1 ? '.' : '') + an.getView(i);
            component.createObject(basedNumber2).text = (i === -1 ? '.' : '') + bn.getView(i);
            component.createObject(basedResult).text = (i === -1 ? '.' : '') + result.getView(i);
        }

        label_final_answer.text =
                Strings.printf("Ответ: {0}<sub>{1}</sub>.", result, base1);
    }

    //console.log(result.toString());
}

// Вычитание
function substraction(an, bn, base1, base2)
{
    operation_sign.text = '-';

    // ЕСЛИ an МЕНЬШЕ bn
    var inverseSign = false;
    if(parseFloat(Tools.toDecimal(an.toString(), base1)) <
            parseFloat(Tools.toDecimal(bn.toString(), base1))) {
        label_num1_more_num2.text =
                Strings.printf("{0}<sub>{1}</sub> меньше, чем {2}<sub>{1}</sub>.<br>" +
                               "Переставим их местами и добавим к ответу минус.",
                               an.toString(), base1, bn.toString());
        inverseSign = true;

        var tmp = bn;
        bn = an;
        an = tmp;
    }

    var $teacher = State.mode !== 'student';
    var a, b;
    var acopy = Tools.copySplitNumber(an);
    var bcopy = Tools.copySplitNumber(bn);
    var min = Math.min(an.min, bn.min);
    var max = Math.max(an.max, bn.max);
    var result = Tools.initSplitNumber(0);

    for(var i = min; i <= max; i++) {
        a = an.get(i);
        b = bn.get(i);
        if(a < b) {
            for(var j = i + 1; j <= max; j++) {
                if(an.get(j) !== 0)
                {
                    an.sub(j, 1);
                    a += base1;
                    //a = Tools.basedAdd(a, 10, base1);
                    for(var k = j - 1; k > i; k--) {
                        an.set(k, base1 - 1);
                    }
                    break;
                }
            }
        }
        //result.set(i, Tools.basedSub(a, b, base1));
        result.set(i, a - b);
    }
    result.normalize();

    // ответ
    label_answer.text =
            Strings.printf("{0}<sub>{1}</sub> - {2}<sub>{3}</sub> = {4}{5}<sub>{1}</sub>",
                           num1.text, num1_base.value,
                           num2.text, num2_base.value,
                           inverseSign ? '-' : '', result.toString());
    if(base1 !== 10) {
        var resultInDecimalBase = Tools.toDecimal(result.toString(), base1, 5);
        label_answer.text +=
                Strings.printf(" = {0}<sub>10</sub>", resultInDecimalBase);
    }

    // вывод решения
    if($teacher) {
        var component = Qt.createComponent("qrc:/components/textcomponent.qml");
        for(var i = max; i >= min; i--) {
            component.createObject(basedNumber1).text = (i === -1 ? '.' : '') + acopy.getView(i);
            component.createObject(basedNumber2).text = (i === -1 ? '.' : '') + bcopy.getView(i);
            component.createObject(basedResult).text = (i === -1 ? '.' : '') + result.getView(i);
        }

        label_final_answer.text =
                Strings.printf("Ответ: {0}{1}<sub>{2}</sub>.", inverseSign ? '-' : '',result, base1);
    }
}

// Умножение
function multiply(an, bn, base1, base2)
{
    operation_sign.text = '*';

    var $teacher = State.mode !== 'student';
    var a, b;
    var count = bn.max + Math.abs(bn.min) + 1;
    var len = an. max + Math.abs(an.min) + 1;
    var el = {};
    var ind1, ind2;
    var max = 0;

    // поэлементное умножение
    for(var i = bn.min; i <= bn.max; i++) {
        b = bn.get(i);
        ind1 = i + Math.abs(bn.min);
        el[ind1] = Tools.initSplitNumber();

        for(var j = an.min; j <= an.max; j++) {
            a = an.get(j);
            ind2 = j + Math.abs(an.min);

            el[ind1].add(ind1 + ind2, a * b);
            if(el[ind1].get(ind1 + ind2) >= base1) {
                el[ind1].set(ind1 + ind2 + 1, ~~(el[ind1].get(ind1 + ind2) / base1));
                el[ind1].set(ind1 + ind2, el[ind1].get(ind1 + ind2) % base1);
            }

            if(el[ind1].max > max) {
                max = el[ind1].max;
            }
        }
        console.log(el[ind1].toString());
    }

    // сложение
    var result = Tools.initSplitNumber();
    for(var i = 0; i <= max; i++) {
        for(var j = 0; j <= Math.abs(bn.min) + bn.max; j++) {
            result.add(i, el[j].get(i));
            if(result.get(i) >= base1) {
                result.set(i, ~~(result.get(i) / base1));
                result.set(i, result.get(i) % base1);
            }
        }
    }

    console.log(result.toString());

    // вывод решения
    if($teacher) {
        var textComponent = Qt.createComponent("qrc:/components/textcomponent.qml");
        var mulContainerComponent = Qt.createComponent("qrc:/components/MulContainer.qml");

        // вывод первого множителя
        for(var i = an.max; i >= an.min; i--) {
            textComponent.createObject(basedNumber1).text = an.getView(i);
        }

        // вывод второго множителя
        for(var i = bn.max; i >= bn.min; i--) {
            textComponent.createObject(basedNumber2).text = bn.getView(i);
        }

        // вывод промежуточного результата
        for(var j = 0; j <= Math.abs(bn.min) + bn.max; j++) {
            var container = mulContainerComponent.createObject(basedDecision);
            for(var i = max; i >= 0; i--) {
                textComponent.createObject(container).text = el[j].getView(i);
            }
        }

        // результирующая линия
        Qt.createComponent("qrc:/components/ResultLine.qml").createObject(basedResult);

        // вывод конечного результата
        /*
        for(var i = result.max; i >= result.min; i--) {
            textComponent.createObject(basedResult).text = result.getView(i);
        }*/
    }


/*
    // тест
    var object = Qt.createQmlObject("import QtQuick 2.0;" +
                                    "Column { Rectangle {color: 'red'; width: 20; height: 20} }",
                                    row_add_substract, "dynamicChild");
    var object2 = Qt.createQmlObject("import QtQuick 2.0;" +
                                     "Rectangle {color: 'yellow'; width: 20; height: 20}",
                                     object, "dynamicChild2");
                                     */

}
