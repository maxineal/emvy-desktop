
.import "stateData.js" as State

function switchMode(modeId)
{
    State.mode = (modeId === 0 ? "student" : "teacher");
    mode_teacher.checked = !(mode_student.checked = (modeId === 0));
    gc();
}

var component = null, object = null;

function selectQml(layoutName)
{
    clearLayout();
    component = Qt.createComponent("qrc:/" + layoutName);
    object = component.createObject(main_layout);
    gc();
}

function clearLayout()
{
    if(object !== null) object.destroy();
    if(component !== null) component.destroy();
    component = object = null;
}

function msgBox(text, data)
{
    var hasData = false;
    var object = messageDialogSimple;
    if(typeof data === "object" && data !== null) {
        hasData = true;
        if(typeof data.details !== "undefined") {
            object = messageDialogDetailed;
            object.detailedText = data.details;
        }
    }

    object.text = text;
    object.icon = 2;

    if(hasData) {
        if(typeof data.icon !== "undefined") {
            messageDialog.icon = data.icon;
        }
    }
    object.open();
    gc();
}


