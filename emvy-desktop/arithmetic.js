
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
}

function prepareView()
{
    label_answer_text.visible = true;
    label_short_decision.visible = true;


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
            n2 = Tools.fromDecimal(Tools.toDecimal(n2, num2_base.value), num1_base.value);
        } else {
            n1 = Tools.fromDecimal(Tools.toDecimal(n1, num1_base.value), num2_base.value);
            primaryBase = num2_base.value;
            secondaryBase = num1_base.value;
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
        }
    }

    var resultInBase1 = objectToFloat(result, base1);
    var text =
            Strings.printf("{0}<sub>{1}</sub> + {2}<sub>{3}</sub> = {4}<sub>{5}</sub>",
                           num1.text, num1_base.value,
                           num2.text, num2_base.value,
                           resultInBase1, base1);

    var resultInDec = Tools.toDecimal(resultInBase1, base1);
    if(base1 !== base2) {
        text += " = " + Tools.fromDecimal(resultInDec, base2) +
                "<sub>" + base2 + "</sub>";
    }
    text += " = " + resultInDec + "<sub>10</sub>";
    label_short_decision.text = text;
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
    while(n.substr(n.length - 1, 1) === '0') {
        n = n.substr(0, n.length - 1);
    }
    return n;
}
