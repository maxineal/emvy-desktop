
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
            $teacher && (action.currentIndex == 1) &&
            (parseFloat(Tools.toDecimal(num1.text, num1_base.value)) <
             parseFloat(Tools.toDecimal(num2.text, num2_base.value)));

    label_text_showAs.visible =
            $teacher && (num1_base.value !== num2_base.value);

    Tools.deleteChildren(asBasedNumber1, asBasedNumber2, asBasedResult);
    column_add_substract.visible = $teacher && (action.currentIndex < 2);

    Tools.deleteChildren(mulBasedNumber1, mulBasedNumber2, mulBasedResult, mulSingleDigit);
    column_multiply.visible = $teacher && (action.currentIndex === 2);

    Tools.deleteChildren(divDevident, divMainBlock, divDivider, divQuotient, div_p);
    column_divide.visible = $teacher && (action.currentIndex === 3);
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
    else if(action.currentIndex === 3) {
        divide(a, b, primaryBase, secondaryBase);
    }
}

// Сложение
function addition(an, bn, base1, base2)
{
    asOperationSign.text = '+';

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
                           num1.text, base1,
                           num2.text, base2,
                           result.toString());

    if(base1 !== 10) {
        var resultInDecimalBase = Tools.toDecimal(result.toString(), base1, 5);
        label_answer.text +=
                Strings.printf(" = {0}<sub>10</sub>", resultInDecimalBase);
    }

    // вывод решения
    if($teacher) {
        var component = Qt.createComponent("qrc:/components/NumberComponent.qml");
        for(var i = result.max; i >= result.min; i--) {
            if(i === -1) {
                component.createObject(asBasedNumber1).text = '.';
                component.createObject(asBasedNumber2).text = '.';
                component.createObject(asBasedResult).text = '.';
            }
            component.createObject(asBasedNumber1).text = an.getView(i);
            component.createObject(asBasedNumber2).text = bn.getView(i);
            component.createObject(asBasedResult).text = result.getView(i);
        }

        label_final_answer.text =
                Strings.printf("Ответ: {0}<sub>{1}</sub>.", result, base1);
    }

    //console.log(result.toString());
}

// Вычитание
function substraction(an, bn, base1, base2)
{
    asOperationSign.text = '-';

    // ЕСЛИ an МЕНЬШЕ bn
    var inverseSign = false;
    if(parseFloat(Tools.toDecimal(an.toString(), base1)) <
            parseFloat(Tools.toDecimal(bn.toString(), base1))) {
        label_num1_more_num2.text =
                Strings.printf("{0}<sub>{1}</sub> меньше, чем {2}<sub>{1}</sub>.<br>" +
                               "Переставим их местами, вычтем и добавим к ответу минус.",
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
                           num1.text, base1,
                           num2.text, base2,
                           inverseSign ? '-' : '', result.toString());
    if(base1 !== 10) {
        var resultInDecimalBase = Tools.toDecimal(result.toString(), base1, 5);
        label_answer.text +=
                Strings.printf(" = {0}<sub>10</sub>", resultInDecimalBase);
    }

    // вывод решения
    if($teacher) {
        var component = Qt.createComponent("qrc:/components/NumberComponent.qml");
        for(var i = max; i >= min; i--) {
            if(i === -1) {
                component.createObject(asBasedNumber1).text = '.';
                component.createObject(asBasedNumber2).text = '.';
                component.createObject(asBasedResult).text = '.';
            }
            component.createObject(asBasedNumber1).text = acopy.getView(i);
            component.createObject(asBasedNumber2).text = bcopy.getView(i);
            component.createObject(asBasedResult).text = result.getView(i);
        }

        label_final_answer.text =
                Strings.printf("Ответ: {0}{1}<sub>{2}</sub>.", inverseSign ? '-' : '',result, base1);
    }
}

// Умножение
function multiply(an, bn, base1, base2)
{
    var $teacher = State.mode !== 'student';
    var a, b;
    var count = bn.max + Math.abs(bn.min) + 1;
    var len = an. max + Math.abs(an.min) + 1;
    var el = {};
    var ind1, ind2;
    var max = 0;

    // TODO: пофиксить лидирующие нули

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

    var strResult = result.toString();
    if(an.min < 0 || bn.min < 0) {
        var arrayResult = strResult.split('');
        arrayResult.splice(arrayResult.length - Math.abs(an.min) - Math.abs(bn.min), 0, '.');
        strResult = arrayResult.join('');
    }

    // ответ
    var inverseSign = false;
    label_answer.text =
            Strings.printf("{0}<sub>{1}</sub> * {2}<sub>{3}</sub> = {4}{5}<sub>{1}</sub>",
                           num1.text, base1,
                           num2.text, base2,
                           (inverseSign ? '-' : ''), strResult.toString());
    if(base1 !== 10) {
        var resultInDecimalBase = Tools.toDecimal(strResult, base1, 5);
        label_answer.text +=
                Strings.printf(" = {0}<sub>10</sub>", resultInDecimalBase);
    }

    // вывод решения
    if($teacher) {
        var textComponent = Qt.createComponent("qrc:/components/NumberComponent.qml");
        var mulContainerComponent = Qt.createComponent("qrc:/components/RowContainer.qml");

        // вывод первого множителя
        for(var i = an.max; i >= an.min; i--) {
            textComponent.createObject(mulBasedNumber1).text = an.getView(i);
        }

        // вывод второго множителя
        for(var i = bn.max; i >= bn.min; i--) {
            textComponent.createObject(mulBasedNumber2).text = bn.getView(i);
        }

        // вывод промежуточного результата
        for(var j = 0; j <= Math.abs(bn.min) + bn.max; j++) {
            var container = mulContainerComponent.createObject(mulSingleDigit);
            for(var i = max; i >= 0; i--) {
                textComponent.createObject(container).text = el[j].getView(i);
            }
        }

        // вывод конечного результата
        for(var i = result.max; i >= result.min; i--) {
            textComponent.createObject(mulBasedResult).text = result.getView(i);
        }

        label_final_answer.text =
                Strings.printf("Ответ: {0}{1}<sub>{2}</sub>.", inverseSign ? '-' : '', strResult, base1);
    }
}

function divide(an, bn, base1, base2)
{
    var array_an = [];
    for(var i = an.max; i >= an.min; i--) {
        array_an.push(an.get(i));
    }

    var dec_bn = parseInt(Tools.toDecimal(bn.toString(false), base1));
    var array_divident = [];
    var dec_divident, accuracy = 0;
    var result = "";

    while((array_an.length > 0) ||
          ((dec_divident = parseInt(array_divident.join(''))) !== 0) && accuracy < 10) {

        if(array_an.length > 0) {
            array_divident.push(array_an.shift());
        }
        else {
            array_divident.push(0);
            if(array_an.length === 0) {
                if(accuracy === 0) result += ".";
                accuracy++;
            }
        }

        while((dec_divident = parseInt(array_divident.join(''))) < dec_bn && (dec_divident !== 0)) {
            result += "0";

            if(array_an.length > 0) {
                array_divident.push(array_an.shift());
            }
            else {
                array_divident.push(0);
                if(array_an.length === 0 && dec_divident < dec_bn) {
                    if(accuracy === 0) result += ".";
                    accuracy++;
                }
            }
        }

        var delta = ~~(dec_divident / dec_bn);
        result += '' + delta;
        var radical = dec_divident - (dec_bn * delta);
        array_divident = radical.toString().split('');
        console.log(delta);
    }

    console.log("End");

    /*
    var anCopy = Tools.copySplitNumber(an);
    var bnNumber = bn.toString();

    var divident = Tools.initSplitNumber();
    var dec_bn = parseFloat(Tools.toDecimal(bnNumber, base1));
    var dec_divident, accuracy = 0;
    var result = "";

    while(anCopy.length() > 0 ||
          (((dec_divident = parseFloat(Tools.toDecimal(divident, base1))) !== 0) && accuracy < 5)) {

        // добавляем цифру
        if(anCopy.length() > 0) {
            divident.set(-1, anCopy.get(anCopy.max));
            anCopy.max--;
        }
        else {
            divident.set(-1, 0);
            accuracy++;
        }

        while((dec_divident = parseFloat(Tools.toDecimal(divident, base1))) < dec_bn) {
            result += "0";
            if(anCopy.length() > 0) {
                divident.set(-1, anCopy.get(anCopy.max));
                anCopy.max--;
            }
            else {
                divident.set(-1, 0);
            }

            if(anCopy.length() <= 0) {
                if(accuracy === 0) result += ".";
                accuracy++;
            }
        }

        var res = ~~(dec_divident / dec_bn);
        result += res;
        var radical = dec_divident - (result * dec_bn);
        divident.parse(radical);
        console.log(res);

    }*/

    console.log("Result = " + result);



    /*var $teacher = State.mode !== 'student';
    var a, b;
    var decA, decB, decC;
    var strResult = '';

    // Получаем делитель в десятичной СС
    b = bn.toString();
    if(b.indexOf('.') > -1) {
        b = b.split('.').join('');
        while(b.substr(0, 1) === '0' && b.length > 1) {
            b = b.substr(1);
        }
    }
    decB = parseInt(b, base1);

    a = an.getView(an.max);
    decA = parseInt(a, base1);
    var index = an.max; // текущая цифра
    var accuracy = 0; // цифра после запятой
    var hasDot = false;

    if(an.isLess(bn)) {
        strResult += '0.';
        hasDot = true;
    }

    while(decA !== 0 || index > an.min) {
        console.log('Now a = ' + a + '; decA = ' + decA);
        var preventZero = false;

        // Если текущие делимое меньше делителя
        while(decA < decB) {
            a += (an.getView(--index) + '');
            decA = parseInt(a, base1);

            if(index >= an.min || preventZero) strResult += '0';
            else if(index < an.min && !preventZero) {
                preventZero = true;
            }
        }

        decC = ~~(decA / decB);
        strResult += decC.toString(base1);
        decA -= decB * decC;
        if(decA === 0) a = '';
        else a = decA.toString(base1);

        if(index - 1 >= an.min) {
            a += (an.getView(--index) + '');
            decA = parseInt(a, base1);
        }
        else {
            if(!hasDot) {
                strResult += '.';
                hasDot = true;
            }
        }
    }*/

    // Убираем лидирующие нули в результате
    /*while(strResult.length > 1 && strResult.substr(0, 1) === '0') {
        strResult = strResult.substr(1);
    }
    var arrayResult = strResult.split('');*/

    /*
    if($teacher) {
        var textComponent = Qt.createComponent("qrc:/components/NumberComponent.qml");
        var rowContainerComponent = Qt.createComponent("qrc:/components/RowContainer.qml");
        var columnWithLine = Qt.createComponent("qrc:/components/ColumnWithLine.qml");

        // делимое
        for(var i = an.max; i >= an.min; i--) {
            textComponent.createObject(divDevident).text = an.getView(i);
        }

        // промежуточные вычисления в главном блоке


        // делитель
        divDivider.text = bn.toString().split('.').join('');

        // частное
        divQuotient.text = strResult;
    }*/

    /*
    var strResult = '';
    a = 0;
    for(var i = an.max; i >= an.min; i--) {
        if(a === 0) a = an.getView(i);
        else a += '' + an.getView(i);
        decA = parseInt(a, base1);

        while(decA < decB) {
            i--;
            if(i >= an.min) a += ('' + an.getView(i));
            else a += '0';
            decA = parseInt(a, base1);
            if(i === an.min - 1) strResult += '.';
            else strResult += '0';
        }

        var c = ~~(decA / decB);
        strResult += c.toString(base1);

        console.log('Divide ' + a + " / " + b + ' = ' + Tools.fromDecimal(~~(decA / decB), base1, 5));
        a = decA - (decB * c);
    }*/

    //console.log('Result: ' + strResult);
}
