.import "main.js" as Main
.import "stateData.js" as State
.import "strings.js" as Strings
.import "tools.js" as Tools

// Выполнение перевода
function execute()
{
    console.time("execute");
    if(validate()) {
        prepareView(true);
        translate();
    }
    else {
        prepareView(false);
    }

    console.timeEnd("execute");
}


// Подготовка вида
function prepareView(state)
{
    label_text_answer.visible =
            label_answer.visible = state;
}

function validate()
{
    var num = input_num.text.split(',').join('.');

    // десятичное в bcd
    if(comboBox_action.currentIndex === 0) {
        if(num.length === 0) {
            Main.msgBox(qsTr("Введите число."));
            return false;
        }
        if(!Tools.isNumber(num, 10)) {
            Main.msgBox("Число введено неправильно.", {
                            details: "Десятичное число содержит недопустимые знаки."
                        });
            return false;
        }
    }
    // bcd в десятичное
    else {
        if(num.split('.').join('').length % (comboBox_type.currentIndex === 0 ? 4 : 8) !== 0) {
            Main.msgBox(qsTr("BCD код содержит неверное число цифр."));
            return false;
        }
        if(!Tools.isNumber(num, 2)) {
            Main.msgBox("Число введено неправильно.", {
                            details: "BCD код содержит недопустимые знаки."
                        });
            return false;
        }
    }
    return true;
}

function translate()
{
    var num = input_num.text.split(',').join('.');
    var packed = comboBox_type.currentIndex === 0;
    var dec_to_bcd = comboBox_action.currentIndex === 0;

    var result = "";
    var buffer = "";
    var step = 1;
    if(!dec_to_bcd) {
        step = packed ? 4 : 8;
    }

    for(var i = 0; i < num.length; i += step) {
        if(num.substr(i, 1) === '.') {
            result += '.';
            i -= (step - 1);
            continue;
        }
        buffer = num.substr(i, step);
        buffer = dec_to_bcd ? Tools.fromDecimal(buffer, 2, 0) : Tools.toDecimal(buffer, 2, 0);
        if(dec_to_bcd) {
            while(buffer.length < (packed ? 4 : 8)) {
                buffer = "0" + buffer;
            }
        }
        result += buffer;
    }

    // ответ
    label_answer.text =
            Strings.printf("{0}<sub>{1}</sub> = {2}<sub>{3}</sub>",
                           num, dec_to_bcd ? 10 : "bcd",
                           result, !dec_to_bcd ? 10 : "bcd");
}
