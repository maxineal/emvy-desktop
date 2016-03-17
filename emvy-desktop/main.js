
.import "stateData.js" as State

function switchMode(modeId)
{
    State.mode = (modeId === 0 ? "student" : "teacher");
    mode_teacher.checked = !(mode_student.checked = (modeId === 0));
}

function selectQml(layoutName)
{
    var component = Qt.createComponent("qrc:/" + layoutName);
    var object = component.createObject(main_layout);
}

function getBases()
{
    var bases = [];
    for(var i = 2; i <= 36; i++) bases.push(i);
    return bases;
}

