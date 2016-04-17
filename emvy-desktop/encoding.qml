import QtQuick 2.0
import QtQuick.Controls 1.4
import QtQuick.Layouts 1.1

import "main.js" as Main
import "stateData.js" as State
import "tools.js" as Tools
import "encoding.js" as Encoding

Item {
    id: main
    anchors.fill: parent

    Column {
        id: row1
        anchors {
            left: parent.left
            right: parent.right
            top: parent.top
            margins: 3
        }
        spacing: 1

        Label {
            text: qsTr("Текст")
            anchors.left: parent.left
        }

        TextArea {
            id: input_text
            anchors {
                left: parent.left
                right: parent.right
            }
            height: 80

            text: "Васечкин Иван Петрович"
        }
    }

    Row {
        id: row2
        anchors {
            left: parent.left
            right: parent.right
            top: row1.bottom
            margins: 3
        }
        spacing: 3

            Column {
                ExclusiveGroup {
                    id: encoding_type
                }

                RadioButton {
                    id: comboBox_shennon
                    exclusiveGroup: encoding_type
                    checked: true
                    text: qsTr("Шеннон-Фано")
                }

                RadioButton {
                    id: comboBox_haffman
                    exclusiveGroup: encoding_type
                    text: qsTr("Хаффман")
                }
            }

            CheckBox {
                id: checkBox_crAsSpace
                text: qsTr("Перенос строка как пробел")
            }

            CheckBox {
                id: checkBox_ignoreCase
                text: qsTr("Без учета регистра")
            }

    }

    Button {
        id: btn_execute
        text: qsTr("Закодировать")
        anchors {
            right: parent.right
            top: row2.bottom
            margins: 5
        }
        onClicked: Encoding.execute();
    }
}
