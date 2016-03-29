
.import "main.js" as Main
.import "stateData.js" as State
.import "strings.js" as Strings
.import "tools.js" as Tools

function translate()
{
    if(!validateForm()) return false;
    clearField();
    makeTranslate();
    prepareView();
    gc();
    return true;
}

// Валидация данных
function validateForm()
{
    if(number.text.length === 0) {
        Main.msgBox("Введите число.");
        return false;
    }
    if(!Tools.isNumber(number.text.replace(',', '.'), fromBase.value)) {
        Main.msgBox("Число введено неправильно.", {
                        details: "Возможно, вы ввели число неправильно или выбрано неверное основание."
                    });
        return false;
    }
    return true;
}

// Перевод числа
function makeTranslate()
{
    var $n = number.text.replace(',', '.');
    var $fromBase = fromBase.value;
    var $toBase = toBase.value;
    var $accuracy = accuracy.value;
    var $result = 0

    var $teacher = State.mode !== 'student';

    // перевод в десятичную СС
    if($fromBase !== 10) {
        if($teacher) {
            label_translateTo10_text.text = Strings.get("translate", "translate_to10", $n);
            label_translateTo10.text = $n + "<sub>" + $fromBase + "</sub>&nbsp;=&nbsp;";
        }

        var currentN = 0;
        var dotPos = $n.indexOf('.');
        if(dotPos > -1) currentN = dotPos - $n.length + 1;
        for(var i = $n.length - 1; i >=0; i--) {
            if(i === dotPos) continue;
            var currentNumber = Tools.getNumber($n.substr(i, 1));
            if($teacher) {
                label_translateTo10.text += currentNumber + ' * ' + $fromBase + "<sup>" + currentN + "</sup>";
                if(i !== 0) label_translateTo10.text += "&nbsp;+&nbsp;";
            }
            $result += currentNumber * Math.pow($fromBase, currentN);
            currentN++;
        }
        $result = parseFloat($result);
        if($teacher) {
            label_translateTo10.text += "&nbsp;=&nbsp;" + $result + "<sub>10</sub>";
        }
    } else {
        $result = parseFloat($n);
    }

    // перевод в нужную СС
    if($toBase !== 10) {
        if($teacher) {
            label_translateFrom10_text.text = Strings.printf(qsTr("Переводим число из десятичной в {0} систему счисления."), $toBase);
            label_translateFrom10_divide_int_text.text = Strings.printf(qsTr("Делим целую часть числа на {0}, сохраняя остатки:"), $toBase);
        }


        var component = null, object = null;
        if($teacher) {
            component = Qt.createComponent("qrc:/components/textcomponent.qml");
        }

        var intPart = (~~$result);
        var destBaseResult = "";
        var basedNumber = "";
        while(intPart > 0) {
            basedNumber = Tools.getBasedNumber(intPart % $toBase, $toBase);
            if($teacher) {
                object = component.createObject(grid_translateFrom10_divide_int);
                object.text = intPart;
                if(intPart >= $toBase) {
                    object = component.createObject(grid_translateFrom10_divide_int);
                    object.text = basedNumber;
                }
                object.font.bold = true;
            }
            destBaseResult += basedNumber;
            intPart = ~~(intPart / $toBase);
        }

        // переворачиваем число
        destBaseResult = destBaseResult.split('').reverse().join('');
        if($teacher) {
            label_translateFrom10_divide_int_result.text =
                    Strings.printf("Записываем с нижнего числа:<br>{0}<sub>10</sub>&nbsp;=&nbsp;{1}<sub>{2}</sub>",
                                   ~~($result), destBaseResult, $toBase);
        }

        // дробная часть
        if($result.toString().indexOf('.') > -1) {
            if($teacher) {
                label_translateFrom10_decimal_text.text = Strings.printf("Переводим дробную часть, умножая ее на {0} и сохраняя целые:", $toBase);
            }

            destBaseResult += ".";
            var fraction = $result - (~~$result);
            var partedFraction = 0;
            for(var i = 0; i < $accuracy; i++)
            {
                if($teacher) {
                    object = component.createObject(list_translateFrom10_decimal);
                    object.text = fraction;
                    object = component.createObject(list_translateFrom10_decimal);
                    object.text = " * " + $toBase + " ";
                }

                fraction *= $toBase;
                partedFraction = ~~fraction;
                destBaseResult += Tools.getBasedNumber(partedFraction, $toBase);
                fraction = fraction - partedFraction;
                if($teacher) {
                    object = component.createObject(list_translateFrom10_decimal);
                    object.text = "= <b>" + partedFraction + "</b>" + fraction.toString().substr(1);
                }
            }
        }
        $result = destBaseResult;

        if(component !== null) {
            component.destroy();
            component = null;
        }
    } else {
        if($result.toString().indexOf('.') > -1) {
            $result = $result.toFixed($accuracy);
        }
    }

    label_short_decision.text = Strings.printf("{0}<sub>{1}</sub>&nbsp;=&nbsp;{2}<sub>{3}</sub>", $n, $fromBase, $result, $toBase);
    if($teacher) {
        label_answer.text = Strings.printf("Ответ: {0}<sub>{1}</sub>.", $result, $toBase);
    }
}

// Очищает поле
function clearField()
{
    Tools.deleteChildren(grid_translateFrom10_divide_int);
    Tools.deleteChildren(list_translateFrom10_decimal);
}

// Обработка вида
function prepareView()
{
    var $teacher = State.mode !== 'student';

    label_answer_text.visible = label_short_decision.visible = true;

    // решение
    label_decision_text.visible = label_answer.visible = $teacher;

    // перевод в десятичную СС
    label_translateTo10_text.visible = label_translateTo10.visible = ((fromBase.value !== 10) && $teacher);

    // перевод из десятичной СС
    label_translateFrom10_text.visible =
            label_translateFrom10_divide_int_text.visible =
            grid_translateFrom10_divide_int.visible =
            label_translateFrom10_divide_int_result.visible = ((toBase.value !== 10) && $teacher);

    // перевод из десятичной СС дробной части
    label_translateFrom10_decimal_text.visible =
            list_translateFrom10_decimal.visible =
            ((toBase !== 10) && $teacher && number.text.indexOf('.') > -1);
}
