
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

    var $teacher = State.mode !== "student";

    // перевод числа в десятичную СС
    if($fromBase !== 10) {
        if($teacher) label_translateTo10.text = $n + "<sub>" + $fromBase + "</sub>&nbsp;=&nbsp;";

        var tmp = 0, currentN = 0;
        var dotPos = $n.indexOf('.');
        var currentNumber = 0;
        if(dotPos > -1) currentN = dotPos - $n.length + 1;
        for(var i = $n.length - 1; i >= 0; i--) {
            if(i === dotPos) continue;
            currentNumber = getNumber($n.substr(i, 1));
            if($teacher) {
                label_translateTo10.text += currentNumber + " * " + $fromBase + "<sup>" + currentN + "</sup>";
                if(i !== 0) label_translateTo10.text += "&nbsp;+&nbsp;";
            }

            tmp += currentNumber * Math.pow($fromBase, currentN);
            currentN++;
        }
        $n = parseFloat(tmp);

        if($teacher) {
            label_translateTo10_text.text = Strings.get("translate", "translate_to10", $n);
            label_translateTo10.text += "&nbsp;=&nbsp;" + $n + "<sub>10</sub>";
            label_translateTo10_text.visible = true;
            label_translateTo10.visible = true;
        }
    }

    // перевод числа в нужную СС
    var $result = $n;
    if($toBase !== 10) {
        var decimalResult = "";
        var decimal = (~~$n);
        while(decimal > 0) {
            decimalResult += getBasedNumber(decimal % $toBase, $toBase);
            decimal = ~~(decimal / $toBase);
        }
        decimalResult = decimalResult.split('').reverse().join('');

        if($n.toString().indexOf('.') > -1)
        {
            decimalResult += '.';
            var fraction = $n - (~~$n);
            var partedFraction = 0;
            for(var i = 0; i < $accuracy; i++)
            {
                fraction *= $toBase;
                partedFraction = ~~fraction;
                decimalResult += getBasedNumber(partedFraction, $toBase);
                fraction = fraction - partedFraction;
            }
        }
        $n = decimalResult;
    }

    var htmlText = number.text + '<sub>' + $fromBase + '</sub>&nbsp;=&nbsp;' +
            $n + '<sub>' + $toBase + '</sub>';
    label_short_decision.text = htmlText;

    // Базовый вывод
    label_answer_text.visible = true;
    label_short_decision.visible = true;

    if(State.mode != "student") {
        //setExtendedOutputState(true);
    }
}

function setExdendedOutputVisible(state)
{
    label_decision_text.visible = state;
    label_translateTo10_text.visible = state;
    label_translateTo10.visible = state;
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
