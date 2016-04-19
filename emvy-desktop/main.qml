import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1
import QtQuick.Dialogs 1.2

import "main.js" as Main

ApplicationWindow {
    id: root
    visible: true
    width: 640
    height: 480
    minimumWidth: 300
    minimumHeight: 200
    title: qsTr("Emvy Desktop")

    property string activeLayout: ""

    menuBar: MenuBar {
        Menu {
            title: qsTr("&Работа")
            MenuItem {
                text: qsTr("&Системы счисления")
                onTriggered: Main.selectQml("translateform.qml");
            }

            MenuItem {
                text: qsTr("&Арифметика")
                onTriggered: Main.selectQml("arithmetic.qml");
            }

            MenuItem {
                text: qsTr("&Перевод BCD");
                onTriggered: Main.selectQml("bcd_translate.qml");
            }

            MenuItem {
                text: qsTr("А&рифметические операции BCD");
                onTriggered: Main.selectQml("bcd_arithmetic.qml");
            }

            MenuItem {
                text: qsTr("&Коды Хаффмана, Шеннона-Фано");
                onTriggered: Main.selectQml("encoding.qml");
            }

            MenuItem {
                text: qsTr("&Очистка")
                onTriggered: Main.clearLayout();
            }

            MenuItem {
                text: qsTr("Exit")
                onTriggered: Qt.quit();
            }
        }
        Menu {
            title: qsTr("Р&ежим")
            MenuItem {
                id: mode_student
                text: qsTr("&Студент")
                checkable: true
                checked: true
                onTriggered: Main.switchMode(0);
            }
            MenuItem {
                id: mode_teacher
                text: qsTr("&Преподаватель")
                checkable: true
                onTriggered: Main.switchMode(1);
            }
        }

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
    }

    Item {
        id: main_layout
        anchors.fill: parent

        // Загрузка начального экрана
        Component.onCompleted: Main.selectQml("encoding.qml");
    }

    MessageDialog {
        id: messageDialogSimple
        title: qsTr("Emvy Desktop")
    }

    MessageDialog {
        id: messageDialogDetailed
        title: qsTr("Emvy Desktop")
    }
}

