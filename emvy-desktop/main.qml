import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Dialogs 1.1

import "main.js" as Main

ApplicationWindow {
    id: root
    visible: true
    width: 640
    height: 480
    minimumWidth: 300
    minimumHeight: 200
    title: qsTr("Emvy Desktop")

    menuBar: MenuBar {
        Menu {
            title: qsTr("Работа")
            MenuItem {
                text: qsTr("&Системы счисления")
                onTriggered: Main.selectQml("translateform.qml");
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
            title: qsTr("Режим")
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
    }

    Item {
        id: main_layout
        anchors.fill: parent

        // Загрузка начального экрана
        Component.onCompleted: Main.selectQml("translateform.qml");
    }


}

