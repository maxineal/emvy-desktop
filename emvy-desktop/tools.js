
function isDefined(obj)
{
    if(typeof obj === "object" && obj === null) return false;
    if(typeof obj !== "undefined") return true;
    return false;
}

function getNumber(n, base)
{
    return parseInt(n, isDefined(base) ? base : 36);
}

function getBasedNumber(n, base)
{
    return n.toString(base);
}

function toDecimal(n, base)
{
    if(base === 10) return n;
    var result = 0;
    var currentN = 0;
    var dotPos = n.indexOf('.');
    if(dotPos > -1) currentN = dotPos - n.length + 1;
    for(var i = n.length - 1; i >= 0; i--) {
        if(i === dotPos) continue;
        var currentNumber = Tools.getNumber(n.substr(i, 1));
        result += currentNumber * Math.pow(base, currentN);
        currentN++;
    }
    return parseFloat(result);
}

function fromDecimal(n, base, accuracy)
{
    if(base === 10) return n;
    var acc = isDefined(accuracy) ? accuracy : 5;
    var intPart = (~~n);
    var destBaseResult = "";
    var basedNumber = "";
    while(intPart > 0) {
        basedNumber = Tools.getBasedNumber(intPart % base, base);
        destBaseResult += basedNumber;
        intPart = ~~(intPart / base);
    }

    // переворачиваем число
    destBaseResult = destBaseResult.split('').reverse().join('');

    // дробная часть
    if(n.toString().indexOf('.') > -1) {
        destBaseResult += ".";
        var fraction = n - (~~n);
        var partedFraction = 0;
        for(var i = 0; i < acc; i++)
        {
            fraction *= base;
            partedFraction = ~~fraction;
            destBaseResult += Tools.getBasedNumber(partedFraction, base);
            fraction = fraction - partedFraction;
        }
    }
    while(destBaseResult.substr(destBaseResult.length - 1, 1) === '0') {
        destBaseResult = destBaseResult.substr(0, destBaseResult.length - 1);
    }
    return destBaseResult;
}

function isNumber(n, base, options)
{
    var s = n.toString();
    var allowSign = false;
    var allowDot = true;
    var b = (isDefined(base) && !isNaN(base)) ? parseInt(base) : 10;

    if(isDefined(options)) {
        if(isDefined(options.sign)) {
            allowSign = options.sign;
        }
        if(isDefined(options.dot)) {
            allowDot = options.dot;
        }
    }

    var c = 0;
    var dotFound = false;
    for(var i = 0; i < s.length; i++) {
        c = s.substr(i, 1);
        if(c === '.') {
            if(i === 0 || !allowDot || dotFound) return false;
            dotFound = true;
            continue;
        }
        else if(c === '-') {
            if(i !== 0 || !allowSign) return false;
            continue;
        }
        c = getNumber(c);
        if(isNaN(c) || c >= base) return false;
    }
    return true;
}

