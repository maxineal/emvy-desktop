
.import "stateData.js" as State

function switchMode(modeId)
{
    State.mode = (modeId === 0 ? "student" : "teacher");
    mode_teacher.checked = !(mode_student.checked = (modeId === 0));
}

var component = null, object = null;

function selectQml(layoutName)
{
    clearLayout();
    component = Qt.createComponent("qrc:/" + layoutName);
    object = component.createObject(main_layout);
}

function clearLayout()
{
    if(object !== null) object.destroy();
    if(component !== null) component.destroy();
    component = object = null;
}


