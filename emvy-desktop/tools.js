
// Проверяет, определена ли переменная
function isDefined(obj)
{
    if(typeof obj === "object" && obj === null) return false;
    if(typeof obj !== "undefined") return true;
    return false;
}

// Переводит строку в число
function getNumber(n, base)
{
    if(!isDefined(n)) return 0;
    if(!isNaN(n)) return n;
    var a = parseInt(n, isDefined(base) ? base : 36);
    return a;
}


function getBasedNumber(n, base)
{
    var a = parseInt(n).toString(isDefined(base) ? base : 36);
    if(a == "NaN") return 0;
    return a;
}


function toDecimal(n, base, accuracy)
{
    if(base === 10) return n;
    var result = 0;
    var currentN = 0;

    n = n.toString();
    var dotPos = n.indexOf('.');
    if(dotPos > -1) currentN = dotPos - n.length + 1;
    for(var i = n.length - 1; i >= 0; i--) {
        if(i === dotPos) continue;
        var currentNumber = Tools.getNumber(n.substr(i, 1));
        result += currentNumber * Math.pow(base, currentN);
        currentN++;
    }
    if(isDefined(accuracy)) {
        if(result.toString().indexOf('.') > -1) {
            result = result.toFixed(accuracy);
        }
    }
    return parseFloat(result);
}

function fromDecimal(n, base, accuracy)
{
    if(base === 10) {
        if(n.toString().indexOf('.') > -1) {
            return n.toFixed(accuracy);
        }
        return n;
    }
    var acc = isDefined(accuracy) ? accuracy : 5;
    var intPart = (~~n);
    var destBaseResult = "";
    var basedNumber = "";
    if(intPart == 0) {
        destBaseResult = "0";
    }
    else {
        while(intPart > 0) {
            basedNumber = Tools.getBasedNumber(intPart % base, base);
            destBaseResult += basedNumber;
            intPart = ~~(intPart / base);
        }
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
    /*
    while(destBaseResult.length > 1 && destBaseResult.substr(destBaseResult.length - 1, 1) === '0') {
        destBaseResult = destBaseResult.substr(0, destBaseResult.length - 1);
    }*/
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

// Удаляет дочерние элементы в контейнере
function deleteChildren(obj)
{
    var object;
    for(var i = 0; i < arguments.length; i++) {
        object = arguments[i];
        for(var j = 0; j < object.children.length; j++) {
            object.children[j].destroy();
        }
    }
}

// Клонирует объект
function cloneObject(obj)
{
    if(obj === null || typeof obj !== 'object') return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if(obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

// Сложение a, b в системе счисления base
function basedAdd(a, b, base)
{
    var ab = toDecimal(a, base);
    var bb = toDecimal(b, base);
    return fromDecimal(ab + bb, base);
}

// Вычитание b из a, в системе счисления base
function basedSub(a, b, base)
{
    var ab = toDecimal(a, base);
    var bb = toDecimal(b, base);
    return fromDecimal(ab - bb, base);
}

// Умножение a на b в СС base
function basedMul(a, b, base)
{
    var ab = toDecimal(a, base);
    var bb = toDecimal(b, base);
    return fromDecimal(ab * bb, base);
}

// Деление a на b в СС base
function basedDiv(a, b, base)
{
    var ab = toDecimal(a, base);
    var bb = toDecimal(b, base);
    return fromDecimal(ab / bb, base);
}

// Создает число, разбитое на разряды
function initSplitNumber(n, base)
{
    var object = {
        min: 0, // минимальный разряд
        max: 0, // максимальный разряд
        digits: {
            0: 0
        },

        // Парсит число
        parse: function(num) {
            n = num.toString();
            var currentDigit = 0;
            var dot = n.toString().indexOf('.');
            if(dot > -1) {
                currentDigit = dot - n.length + 1;
            }
            this.min = currentDigit;
            for(var i = n.length - 1; i >= 0; i--) {
                if(i === dot) continue;
                this.digits[currentDigit] = getNumber(n.substr(i, 1), 36);
                currentDigit++;
            }
            this.max = currentDigit != 0 ? currentDigit - 1 : 0;
        },

        // Проверяет есть ли цифра в разряде
        exists: function(index) {
            return isDefined(this.digits[index]);
        },

        // Получает число из разряда
        get: function(index) {
            return isDefined(this.digits[index]) ? parseInt(this.digits[index]) : 0;
        },

        // Устанавливает цифру в разряд
        set: function(index, value) {
            if(index === -1) {
                index = this.min - 1;
            }
            if(index < this.min) this.min = index;
            if(index > this.max) this.max = index;
            this.digits[index] = value;
        },

        // Удаляет цифру из разряда
        remove: function(index) {
            if(index >= this.min && index <= this.max) {
                delete this.digits[index];
            }
        },

        // Получает число для отображения
        // Если число есть в разряде, то вернется это число
        // Если индекс меньше минимального разряда, вернется 0
        // Если больше, то вернется пустая строка
        getView: function(index) {
            if(index > this.max) return '';
            return getBasedNumber(this.get(index)).toString();
        },

        // Получает количество цифр
        length: function() {
            var len = 0;
            for(var i = this.max; i >= this.min; i--) {
                if(isDefined(this.digits[i])) len++;
            }
            return len;
        },

        // Прибавляет к цифре в разряд
        add: function(index, value) {
            this.set(index, this.get(index) + value);
        },

        sub: function(index, value) {
            this.add(index, -value);
        },

        // Нормализация числа
        normalize: function() {
            for(var i = this.max; i >= this.min; i--) {
                if(this.get(i) !== 0 || i === 0) {
                    this.max = i;
                    break;
                } else {
                    if(isDefined(this.digits[i])) {
                        delete this.digits[i];
                    }
                }
            }
        },

        // Определяет, является ли цифра значимой
        isSignificant: function(index) {
            return (index <= this.max && index >= this.min);
        },

        // Возвращает число в виде строки
        // Если первый аргумент неопределен или равен истине, то строка будет содержать разделяющую запятую.
        toString: function() {
            var a = '';
            for(var i = this.max; i >= this.min; i--) {
                if(i === -1 && (!isDefined(arguments[0]) || arguments[0])) a += '.';
                a += getBasedNumber(this.get(i), 36);
            }
            return a;
        },

        isLess: function(num) {
            if(this.max < num.max) return true;
            for(var i = Math.max(this.max, num.max); i >= Math.min(this.min, num.min); i--) {
                if(this.get(i) < num.get(i)) return true;
            }
            return false;
        }
    };
    if(isDefined(n)) object.parse(n);
    return object;
}

// Копирует число в новый объект
function copySplitNumber(object)
{
    var newObject = initSplitNumber(0);
    newObject.min = object.min;
    newObject.max = object.max;
    for(var i = object.min; i <= object.max; i++) {
        newObject.digits[i] = object.digits[i];
    }
    return newObject;
}

