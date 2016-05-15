
.import "main.js" as Main
.import "stateData.js" as State
.import "strings.js" as Strings
.import "tools.js" as Tools

function translate()
{
    console.time("translate");
    if(!validateForm()) return false;
    clearField();
    makeTranslate();
    prepareView();
    gc();
    console.timeEnd("translate");
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
    var $result = Tools.initDecimalNumber(0);
    var tmp = Tools.initDecimalNumber(0);
    var $teacher = State.mode !== 'student';
    var $answer = "";

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

            tmp.number = $fromBase;
            tmp.pow(i);
            tmp.mul($sn.get(i));
            $result.add(tmp.number);
        }

        if($teacher) {
            label_translateTo10.text += Strings.printf(" = {0}<sub>10</sub>.", $result.number);
        }
    }
    else {
        $result.number = $n;
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

        var digitPart = Tools.initDecimalNumber($result.number);
        digitPart.floor();
        var destBaseResult = '', basedNumber = '';
        while(digitPart.compare(0) !== 0) {
            tmp.number = digitPart.number;
            tmp.mod($toBase);
            basedNumber = Tools.getBasedNumber(tmp.number, $toBase);
            destBaseResult += basedNumber;

            if($teacher) {
                var object = component.createObject(grid_translateFrom10_divide_int);
                object.text = digitPart.number;
                if(digitPart.compare($toBase) >= 0) {
                    object = component.createObject(grid_translateFrom10_divide_int);
                    object.text = basedNumber;
                }
                object.font.bold = true;
            }
            digitPart.div($toBase);
            digitPart.floor();
        }

        // переворачиваем число
        destBaseResult = destBaseResult.split('').reverse().join('');
        if($teacher) {
            digitPart.number = $result.number;
            digitPart.floor();
            label_translateFrom10_divide_int_result.text =
                    Strings.printf("Записываем с нижнего числа:<br>{0}<sub>10</sub>&nbsp;=&nbsp;{1}<sub>{2}</sub>",
                                   digitPart.number, destBaseResult, $toBase);
        }
        delete digitPart;

        // дробная часть
        if($n.toString().indexOf('.') > -1) {
            if($teacher) {
                label_text_translateFrom10_decimal.text =
                        Strings.printf("Переводим дробную часть, умножая ее на {0} и сохраняя целые:",
                                       $toBase);
            }

            destBaseResult += '.';
            var fraction = Tools.initDecimalNumber($result);
            fraction.shiftInt();
            var partedFraction = Tools.initDecimalNumber(0);
            // ---
            for(var i = 0; i < $accuracy; i++)
            {
                if($teacher) {
                    component.createObject(list_translateFrom10_decimal).text = fraction.number;
                    component.createObject(list_translateFrom10_decimal).text = " * " + $toBase + " ";
                }

                fraction.mul($toBase);
                partedFraction.number = fraction.number;
                partedFraction.floor();
                destBaseResult += Tools.getBasedNumber(partedFraction.number, $toBase);
                fraction.shiftInt();

                if($teacher) {
                    component.createObject(list_translateFrom10_decimal).text =
                            "= <b>" + partedFraction.number + "</b>" + fraction.number.substr(1);
                }
            }
            Tools.deleteObjects(fraction, partedFraction);
        }
        $answer = destBaseResult;
    }
    else {
        $result.toFixed($accuracy);
        $answer = $result.number;
    }

    label_answer.text =
            Strings.printf("{0}<sub>{1}</sub> = {2}<sub>{3}</sub>.",
                           $n, $fromBase, $answer, $toBase);
    if($teacher) {
        label_final_answer.text = Strings.printf("Ответ: {0}<sub>{1}</sub>.", $answer, $toBase);
    }

    delete tmp;
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
