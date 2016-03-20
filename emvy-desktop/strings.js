
function get(scope, id)
{
    var str = "";
    if(scope === "translate") {
        switch(id) {
            case "translate_to10":
                str = "Переводим число {0} в десятичную систему счисления:";

        }
    }
    if(str.length > 0) {
        if(arguments.length > 2) {
            for(var i = 0; i < arguments.length - 2; i++) {
                str = str.replace("{" + i + "}", arguments[i + 2]);
            }
        }
    }
    return str;
}

function printf(str)
{
    if(arguments.length > 1) {
        for(var i = 0; i < arguments.length - 1; i++) {
            str = str.replace("{" + i + "}", arguments[i + 1]);
        }
    }
    return str;
}
