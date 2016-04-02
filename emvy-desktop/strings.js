
function printf(str)
{
    if(arguments.length > 1) {
        for(var i = 0; i < arguments.length - 1; i++) {
            try {
                str = str.split('{' + i + '}').join(arguments[i + 1]);
            } catch(e) {
                console.log("Exception in printf. Message: " + e.message);
            }
        }
    }
    return str;
}
