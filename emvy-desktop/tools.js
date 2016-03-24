/**
  tools.js
 **/

function isDefined(obj)
{
    if(typeof obj === "object" && obj === null) return false;
    if(typeof obj !== "undefined") return true;
    return false;
}

function getNumber(n)
{
    if(!isNaN(n)) return n;
    return parseInt(n, 36);
}

function getBasedNumber(n, base)
{
    return n.toString(base);
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

