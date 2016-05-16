
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
    if(a === "NaN") return 0;
    return a;
}

function toDecimal(n, base, accuracy)
{
    if(base === 10) return n;
    var result = initDecimalNumber(0);
    var currentN = 0;
    var tmp = initDecimalNumber(0);

    n = n.toString();
    var dotPos = n.indexOf('.');
    if(dotPos > -1) currentN = dotPos - n.length + 1;
    for(var i = n.length - 1; i >= 0; i--) {
        if(i === dotPos) continue;
        var currentNumber = Tools.getNumber(n.substr(i, 1));
        tmp.number = base;
        tmp.pow(currentN);
        tmp.mul(currentNumber);
        result.add(tmp.number);
        currentN++;
    }
    if(isDefined(accuracy)) {
        result.toFixed(accuracy);
    }
    var answer = result.number;
    deleteObjects(result, tmp);
    return parseFloat(result.number);
}

function fromDecimal(n, base, accuracy)
{
    if(base === 10) {
        if(n.toString().indexOf('.') > -1 && isDefined(accuracy)) {
            return n.toFixed(accuracy);
        }
        return n;
    }
    var acc = isDefined(accuracy) ? accuracy : 5;
    var intPart = initDecimalNumber(n);
    var tmp = initDecimalNumber(0);
    intPart.floor();

    var destBaseResult = "", basedNumber = "";
    if(intPart.compare(0) === 0) {
        destBaseResult = "0";
    }
    else {
        while(intPart.compare(0) > 0) {
            tmp.number = intPart.number;
            tmp.mod(base);
            basedNumber = Tools.getBasedNumber(tmp.number, base);
            destBaseResult += basedNumber;
            intPart.div(base);
            intPart.floor();
        }
    }

    // переворачиваем число
    destBaseResult = destBaseResult.split('').reverse().join('');

    // дробная часть
    if(n.toString().indexOf('.') > -1) {
        destBaseResult += ".";
        intPart.number = n;
        intPart.shiftInt();
        tmp.number = 0;
        for(var i = 0; i < acc; i++)
        {
            intPart.mul(base);
            tmp.number = intPart.number;
            tmp.floor();
            destBaseResult += Tools.getBasedNumber(tmp.number, base);
            intPart.shiftInt();
        }
    }
    deleteObjects(intPart, tmp);
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
        if(c === '.' || c === ',') {
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

// Удаляет объекты
function deleteObjects()
{
    for(var i = 0; i < arguments.length; i++) {
        delete arguments[i];
    }
}

// Сложение a, b в системе счисления base
function basedAdd(a, b, base)
{
    var ab = toDecimal(a, base);
    var bb = toDecimal(b, base);
    return fromDecimal(ab + bb, base).toString();
}

// Вычитание b из a, в системе счисления base
function basedSub(a, b, base)
{
    var ab = toDecimal(a, base);
    var bb = toDecimal(b, base);
    return fromDecimal(ab - bb, base).toString();
}

// Умножение a на b в СС base
function basedMul(a, b, base)
{
    var ab = toDecimal(a, base);
    var bb = toDecimal(b, base);
    return fromDecimal(ab * bb, base).toString();
}

// Деление a на b в СС base
function basedDiv(a, b, base)
{
    var ab = toDecimal(a, base);
    var bb = toDecimal(b, base);
    return fromDecimal(ab / bb, base).toString();
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
            n = n.split(',').join('.');
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
            if(index === "-infinity") {
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

function initBcdObject(bcd)
{
    var object = {
        min: 0,
        max: 0,
        minTetrad: 0,
        maxTetrad: 0,
        digits: {
            0: 0
        },

        parse: function(b) {
            b = fixBcd(b);
            this.min = 0;
            var dot = b.indexOf('.');
            if(dot > -1) this.min = dot - b.length + 1;
            var currentIndex = this.min;
            for(var i = b.length - 1; i >= 0; i--) {
                if(b[i] === '.') continue;
                this.digits[currentIndex++] = parseInt(b[i]);
            }
            this.max = currentIndex - 1;
            this.updateTetradInfo();
        },

        updateTetradInfo: function() {
            this.minTetrad = ~~(this.min / 4);
            this.maxTetrad = ~~(this.max / 4);
        },

        // Получает число из разряда
        get: function(index) {
            return isDefined(this.digits[index]) ? parseInt(this.digits[index]) : 0;
        },

        // Устанавливает цифру в разряд
        set: function(index, value) {
            if(index === "-infinity") {
                index = this.min - 1;
            }
            if(index < this.min) this.min = index;
            if(index > this.max) this.max = index;
            this.digits[index] = value;
            this.updateTetradInfo();
        },

        // Удаляет цифру из разряда
        remove: function(index) {
            if(index >= this.min && index <= this.max) {
                delete this.digits[index];
            }
            this.updateTetradInfo();
        },

        // Получает число для отображения
        // Если число есть в разряде, то вернется это число
        // Если индекс меньше минимального разряда, вернется 0
        // Если больше, то вернется пустая строка
        getView: function(index) {
            //if(index > this.max) return '';
            return this.get(index).toString();
        },

        getTetrad: function(index) {
            var min = (index * 4);
            var max = min + 3;
            var data = "";
            for(var i = max; i >= min; i--) {
                data += this.getView(i);
            }
            return data;
        },

        setTetrad: function(index, data) {
            data = fixBcd(data).split('');
            var min = (index * 4);
            var max = min + 3;
            for(var i = max, p = 0; i >= min; i--, p++) {
                this.set(i, parseInt(data[p], 2));
            }
        },

        getTetradDecimal: function(index) {
            return parseInt(this.getTetrad(index), 2);
        },

        setTetradDecimal: function(index, dec) {
            var bcd = fixBcd(dec.toString());
            this.setTetrad(index, bcd);
        },

        // Прибавляет к цифре в разряд
        add: function(index, value) {
            this.set(index, this.get(index) + value);
        },

        sub: function(index, value) {
            this.add(index, -value);
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
    };
    if(isDefined(bcd)) object.parse(bcd);
    return object;
}

// Копирует число в новый объект
function copyBcdObject(object)
{
    var newObject = initBcdObject(object.toString());
    return newObject;
}

// Добавляет нули в код BCD
function fixBcd(bcd, packed)
{
    bcd = bcd.toString();
    var fromBack = bcd.indexOf('.');
    if(fromBack > -1) {
        fromBack = bcd.length - fromBack;
    }
    var bcdFixed = bcd.split('.').join('');
    var pkd = isDefined(packed) ? packed : true;
    while(bcdFixed.length % (bcdFixed ? 4 : 8) !== 0) {
        bcdFixed = "0" + bcdFixed;
    }
    if(fromBack > 0) {
        bcdFixed = bcdFixed.substr(0, bcdFixed.length - fromBack + 1) + '.' + bcdFixed.substr(bcdFixed.length - fromBack + 1);
    }
    return bcdFixed;
}

// Разбивает код BCD по тетрадам
function splitBcdToArray(bcd, packed)
{
    var bcd = fixBcd(bcd);
    var index = bcd.indexOf('.');
    bcd = bcd.split('.').join('');
    var a = bcd.match(/.{1,4}/g);
    if(index > -1) {
        a.splice(index / 4, 0, ['.']);
    }
    return a;
}

// Возвращает индекс дочернего элемента из его ID
function getChildIndexByInternalId(parent, id)
{
    for(var i = 0; i < parent.children.length; i++) {
        if(parent.children[i].internalId === id) return i;
    }
    return 0;
}

// Возвращает первый дочерний элемент
function getFirstChild(parent)
{
    if(parent.children.length === 0) return parent;
    return parent.children[0];
}

// Возвращает последний дочерний элемент
function getLastChild(parent)
{
    if(parent.children.length === 0) return parent;
    return parent.children[parent.children.length - 1];
}

// Возвращает логарифм x по основанию y
function getBaseLog(x, y)
{
    return Math.log(y) / Math.log(x);
}

// Возвращает экземпляр класса DecimalNumber
function initDecimalNumber(n)
{
    var obj = Qt.createQmlObject("import Emvy 1.0; DecimalNumber { }", root, "decimalNumberObject");
    obj.objectName = "DecimalNumber";
    if(isDefined(n)) {
        if(typeof n === "object" && n.objectName === "DecimalNumber") {
            obj.number = n.number;
        }
        else {
            obj.number = n;
        }
    }
    return obj;
}
