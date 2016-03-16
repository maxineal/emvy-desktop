
var Mode = "student";
function switchMode(modeId)
{
    Mode = (modeId === 0 ? "student" : "teacher");
    mode_teacher.checked = !(mode_student.checked = (modeId === 0));
}

function selectQml(layoutName)
{
    var component = Qt.createComponent("qrc:/" + layoutName);
    var object = component.createObject(main_layout);
}

function getBases()
{

}
