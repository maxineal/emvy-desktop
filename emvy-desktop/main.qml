import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1
import QtQuick.Dialogs 1.2

import "main.js" as Main
import "stateData.js" as State
import "tools.js" as Tools

ApplicationWindow {
    id: root
    visible: true
    width: 640
    height: 480
    minimumWidth: 420
    minimumHeight: 200
    title: qsTr("Emvy Desktop")

    property string activeLayout: ""

    menuBar: MenuBar {
        Menu {
            title: qsTr("&Работа")
            MenuItem {
                text: qsTr("&Системы счисления")
                shortcut: "Ctrl+1"
                onTriggered: Main.selectQml("translateform.qml");
            }

            MenuItem {
                text: qsTr("&Арифметика")
                shortcut: "Ctrl+2"
                onTriggered: Main.selectQml("arithmetic.qml");
            }

            MenuSeparator { }

            MenuItem {
                text: qsTr("&Перевод BCD");
                shortcut: "Ctrl+3"
                onTriggered: Main.selectQml("bcd_translate.qml");
            }

            MenuItem {
                text: qsTr("А&рифметические операции BCD");
                shortcut: "Ctrl+4"
                onTriggered: Main.selectQml("bcd_arithmetic.qml");
            }

            MenuSeparator { }

            MenuItem {
                text: qsTr("&Коды Хаффмана, Шеннона-Фано");
                shortcut: "Ctrl+5"
                onTriggered: Main.selectQml("encoding.qml");
            }
/*
            MenuItem {
                text: qsTr("&Очистка")
                onTriggered: Main.clearLayout();
            }*/

            MenuSeparator { }

            MenuItem {
                text: qsTr("Выход")
                shortcut: "Alt+F4"
                onTriggered: Qt.quit();
            }
        }
        Menu {
            title: qsTr("Р&ежим")
            MenuItem {
                id: mode_student
                text: qsTr("&Студент")
                shortcut: "Ctrl+F1"
                checkable: true
                checked: true
                onTriggered: Main.switchMode(0);
            }
            MenuItem {
                id: mode_teacher
                text: qsTr("&Преподаватель")
                shortcut: "Ctrl+F2"
                checkable: true
                //onTriggered: Main.switchMode(1);
                onTriggered: Main.requireTeacherMode();
            }
        }

        // Опции для кодирования
        Menu {
            id: main_menu_encoding_options
            title: qsTr("&Опции")
            visible: activeLayout === "encoding";

            Menu {
                id: main_menu_encoding_probability_type
                title: qsTr("&Тип вероятностей")

                ExclusiveGroup {
                    id: main_menu_encoding_pt_group
                }

                MenuItem {
                    id: main_menu_encoding_pt_decimal
                    text: qsTr("&Десятичные")
                    checkable: true
                    exclusiveGroup: main_menu_encoding_pt_group
                }

                MenuItem {
                    id: main_menu_encoding_pt_div
                    text: qsTr("Д&роби")
                    checkable: true
                    checked: true
                    exclusiveGroup: main_menu_encoding_pt_group
                }
            }
        }

        // Справка
        Menu
        {
            title: qsTr("&Справка")

            MenuItem {
                id: main_menu_help
                text: qsTr("&Помощь")
                shortcut: "F1"
            }

            MenuItem {
                id: main_menu_about
                text: qsTr("&О программе")
                onTriggered: Main.msgBox("Кодирование информации 1.0\n(Emvy Desktop)\n\nБронников Максим, 2016");
            }
        }
    }

    Item {
        id: main_layout
        anchors.fill: parent

        // Загрузка начального экрана
        Component.onCompleted: Main.selectQml("translateform.qml");
    }

    MessageDialog {
        id: messageDialogSimple
        title: qsTr("Emvy Desktop")
    }

    MessageDialog {
        id: messageDialogDetailed
        title: qsTr("Emvy Desktop")
    }

    Dialog {
        id: passwordDialog
        visible: false
        title: qsTr("Режим преподавателя");
        standardButtons: StandardButton.Ok | StandardButton.Cancel
        onRejected: {
            Main.switchMode(0);
            passwordField.text = "";
        }
        onAccepted: {
            if(passwordField.text === "123pda")
            {
                State.teacherModeAvailable = true;
                Main.switchMode(1);
            }
            else
            {
                Main.switchMode(0);
                passwordDialog.open();
            }
            passwordField.text = "";
        }

        ColumnLayout
        {
            anchors {
                left: parent.left
                right: parent.right
            }

            Label
            {
                text: qsTr("Пароль:");
            }

            TextField
            {
                id: passwordField
                echoMode: TextInput.Password
                anchors {
                    left: parent.left
                    right: parent.right
                }

            }
        }
    }
}

