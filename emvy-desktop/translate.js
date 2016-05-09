
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
            label_text_translateTo10.text =
                    Strings.printf("Переводим число {0} в десятичную систему счисления:", $n);
            label_translateTo10.text = Strings.printf("{0}<sub>{1}</sub> = ", $n, $fromBase);
        }

        var $sn = Tools.initSplitNumber($n, $fromBase);
        for(var i = $sn.min; i <= $sn.max; i++) {
            if($teacher) {
                label_translateTo10.text +=
                        Strings.printf("{0} * {1}<sup>{2}</sup>", $sn.get(i), $fromBase, i);
                if(i !== $sn.max) label_translateTo10.text += ' + ';
            }

            $result += $sn.get(i) * Math.pow($fromBase, i);
        }

        if($teacher) {
            label_translateTo10.text += Strings.printf(" = {0}<sub>10</sub>.", $result);
        }
    }
    else {
        $result = parseFloat($n);
    }

    // перевод из десятичной СС
    if($toBase !== 10) {
        var component;
        if($teacher) {
            component = Qt.createComponent("qrc:/components/Text.qml");
            label_text_translateFrom10.text =
                    Strings.printf("Переводим число из десятичной в {0}-ричную систему счисления.", $toBase);
            label_text_translateFrom10_divide_int.text =
                    Strings.printf("Делим целую часть числа на {0}, сохраняя остатки:", $toBase);
        }


        var digitPart = Math.floor($result);
        var destBaseResult = '', basedNumber = '';
        while(digitPart > 0) {
            basedNumber = Tools.getBasedNumber(digitPart % $toBase, $toBase);
            destBaseResult += basedNumber;

            if($teacher) {
                var object = component.createObject(grid_translateFrom10_divide_int);
                object.text = digitPart;
                if(digitPart >= $toBase) {
                    object = component.createObject(grid_translateFrom10_divide_int);
                    object.text = basedNumber;
                }
                object.font.bold = true;
            }
            digitPart = Math.floor(digitPart / $toBase);
        }

        // переворачиваем число
        destBaseResult = destBaseResult.split('').reverse().join('');
        if($teacher) {
            label_translateFrom10_divide_int_result.text =
                    Strings.printf("Записываем с нижнего числа:<br>{0}<sub>10</sub>&nbsp;=&nbsp;{1}<sub>{2}</sub>",
                                   Math.floor($result), destBaseResult, $toBase);
        }

        // дробная часть
        if($n.toString().indexOf('.') > -1) {
            if($teacher) {
                label_text_translateFrom10_decimal.text =
                        Strings.printf("Переводим дробную часть, умножая ее на {0} и сохраняя целые:",
                                       $toBase);
            }

            destBaseResult += '.';
            var fraction = $result - Math.floor($result);
            var partedFraction = 0;
            for(var i = 0; i < $accuracy; i++)
            {
                if($teacher) {
                    component.createObject(list_translateFrom10_decimal).text = fraction;
                    component.createObject(list_translateFrom10_decimal).text = " * " + $toBase + " ";
                }

                fraction *= $toBase; partedFraction = Math.floor(fraction);
                destBaseResult += Tools.getBasedNumber(partedFraction, $toBase);
                fraction = fraction - partedFraction;

                if($teacher) {
                    component.createObject(list_translateFrom10_decimal).text =
                            "= <b>" + partedFraction + "</b>" + fraction.toString().substr(1);
                }
            }
        }
        $result = destBaseResult;
    }
    else {
        $result = $result.toFixed($accuracy);
    }

    label_answer.text =
            Strings.printf("{0}<sub>{1}</sub> = {2}<sub>{3}</sub>.",
                           $n, $fromBase, $result, $toBase);
    if($teacher) {
        label_final_answer.text = Strings.printf("Ответ: {0}<sub>{1}</sub>.", $result, $toBase);
    }
}

// Обработка вида
function prepareView()
{
    var $teacher = State.mode !== 'student';

    label_text_answer.visible =
            label_answer.visible = true;

    // решение
    label_text_decision.visible =
            label_final_answer.visible = $teacher;

    // перевод в десятичную СС
    label_text_translateTo10.visible =
            label_translateTo10.visible = ($teacher && (fromBase.value !== 10));

    // перевод из десятичной СС
    label_text_translateFrom10.visible =
            label_text_translateFrom10_divide_int.visible =
            grid_translateFrom10_divide_int.visible =
            label_translateFrom10_divide_int_result.visible = ($teacher && (toBase.value) !== 10);

    // перевод из десятичной СС дробной части
    label_text_translateFrom10_decimal.visible =
            list_translateFrom10_decimal.visible =
            ($teacher && (toBase.value !== 10) && number.text.indexOf('.') > -1);
}

// Очищает поле
function clearField()
{
    Tools.deleteChildren(grid_translateFrom10_divide_int);
    Tools.deleteChildren(list_translateFrom10_decimal);
}
