
.import "stateData.js" as State
.import "strings.js" as Strings

function translate()
{
    if(!validateForm()) return false;
    setExdendedOutputVisible(false);
    makeTranslate();
    gc();
    return true;
}

function makeTranslate()
{
    var $n = number.text.replace(',', '.');
    var $fromBase = fromBase.value;
    var $toBase = toBase.value;
    var $accuracy = accuracy.value;
    var $result = 0;

    var $teacher = State.mode !== "student";

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
            var currentNumber = getNumber($n.substr(i, 1));
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
            label_translateTo10_text.visible = true;
            label_translateTo10.visible = true;
        }
    } else {
        $result = parseFloat($n);
    }

    // перевод в нужную СС
    if($toBase !== 10) {
        if($teacher) {
            label_translateFrom10_text.text = Strings.printf(qsTr("Переводим число из десятичной в {0} систему счисления."), $toBase);
            label_translateFrom10_divide_int_text.text = Strings.printf(qsTr("Делим целую часть числа на {0}, сохраняя остатки:"), $toBase);
            label_translateFrom10_text.visible = label_translateFrom10_divide_int_text.visible = true;
        }

        var intPart = (~~$result);
        var destBaseResult = "";
        while(intPart > 0) {
            destBaseResult += getBasedNumber(intPart % $toBase, $toBase);
            intPart = ~~(intPart / $toBase);
        }
        destBaseResult = destBaseResult.split('').reverse().join('');

        if($result.toString().indexOf('.') > -1) {
            destBaseResult += ".";
            var fraction = $result - (~~$result);
            var partedFraction = 0;
            for(var i = 0; i < $accuracy; i++)
            {
                fraction *= $toBase;
                partedFraction = ~~fraction;
                destBaseResult += getBasedNumber(partedFraction, $toBase);
                fraction = fraction - partedFraction;
            }
        }
        $result = destBaseResult;
    } else {
        // Вывод краткого ответа
        if($result.toString().indexOf('.') > -1) {
            $result = $result.toFixed($accuracy);
        }
    }

    label_short_decision.text = Strings.printf("{0}<sub>{1}</sub>&nbsp;=&nbsp;{2}<sub>{3}</sub>", $n, $fromBase, $result, $toBase);
    label_short_decision.visible = label_answer_text.visible = true;

    if($teacher) {
        label_decision_text.visible = true;
    }
}

function setExdendedOutputVisible(state)
{
    label_decision_text.visible = state;
    label_translateTo10_text.visible = state;
    label_translateTo10.visible = state;
    label_translateFrom10_text.visible = state;
    label_translateFrom10_divide_int_text.visible = state;
}

function getNumber(a)
{
    if(!isNaN(a)) return a;
    return parseInt(a, 36);
}

function getBasedNumber(a, b)
{
    return a.toString(b);
}

function validateForm()
{
    if(number.text.length === 0) return false;
    return true;
}
