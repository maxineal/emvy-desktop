.import "main.js" as Main
.import "stateData.js" as State
.import "strings.js" as Strings
.import "tools.js" as Tools

function execute()
{
    // Подготовка текста
    var text = input_text.text;
    if(checkBox_crAsSpace.cheched) {
        text = Strings.replace(text, "\r\n", " ");
    }
    var array_text = text.split('');
    var n = array_text.length;

    if(checkBox_ignoreCase.checked) {
        for(var i = 0; i < array_text.length; i++) {
            array_text[i] = array_text[i].toUpperCase();
        }
    }


    // Считаем вероятность
    var probability = [];
    while(array_text.length > 0) {
        var count = 0;
        for(var i = 0; i < array_text.length; i++) {
            if(array_text[i] === array_text[0]) {
                if(i !== 0) array_text.splice(i, 1);
                count++;
            }
        }
        probability.push({
                             symbol: array_text[0],
                             probability: count / n
                         });
        array_text.splice(0, 1);
    }

    // Выравнивание вероятности
    var p = 0;
    for(var i = 0; i < probability.length; i++) {
        p += probability[i].probability;
    }
    probability[0].probability += (1 - p);
    probability.sort(function(a, b) {
        return a.probability > b.probability ? -1 : 1;
    });


    for(var i = 0; i < probability.length; i++) {
        console.log(probability[i].symbol + ":" + probability[i].probability);
    }

    console.log(probability);
}

