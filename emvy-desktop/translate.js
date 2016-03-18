
.import "stateData.js" as State

function translate()
{
    if(!validateForm()) return false;

    label_answer.visible = true;
    label_short_decision.visible = false;
    if(State.mode == "student")
    {
        shortTranslate();
    }
    else
    {

    }
    gc();
}

function shortTranslate()
{
    label_short_decision.visible = true;

    var $n = number.text.replace(',', '.');
    var $fromBase = fromBase.value;
    var $toBase = toBase.value;
    var $accuracy = accuracy.value;

    // перевод числа в десятичную СС
    if($fromBase !== 10) {
        var tmp = 0;
        var currentN = 0;
        var dotPos = $n.indexOf('.');
        if(dotPos > -1) currentN = dotPos - $n.length + 1;
        for(var i = $n.length - 1; i >= 0; i--) {
            if(i === dotPos) continue;
            tmp += getNumber($n.substr(i, 1)) * Math.pow($fromBase, currentN);
            currentN++;
        }
        $n = parseFloat(tmp);
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
