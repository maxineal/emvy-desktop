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

            text: "Истина - дочь времени, а не авторитета."
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
                id: radioButton_shennon
                exclusiveGroup: encoding_type
                text: qsTr("Шеннон-Фано")
            }

            RadioButton {
                id: radioButton_haffman
                exclusiveGroup: encoding_type
                text: qsTr("Хаффман")
                checked: true
            }
        }

        CheckBox {
            id: checkBox_crAsSpace
            text: qsTr("Перенос строки как пробел")
        }

        CheckBox {
            id: checkBox_ignoreCase
            text: qsTr("Без учета регистра")
            checked: true
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
        onClicked: Encoding.execute()
    }

    ScrollView {
        id: scrollView
        visible: false
        anchors {
            left: parent.left
            right: parent.right
            top: btn_execute.bottom
            bottom: parent.bottom
            margins: 5
            topMargin: 2
        }

        ColumnLayout {
            id: scrollArea
            anchors.left: parent.left
            width: children.width
            height: children.height
            spacing: 8

            RowLayout {
                id: outputArea
                spacing: 8
            }

            RowLayout {
                Text {
                    text: qsTr("K<sub>ср</sub> = ")
                    textFormat: Text.RichText
                }

                Text {
                    id: k_mean
                }
            }

            RowLayout {
                Text {
                    text: qsTr("I<sub>ср</sub> = ")
                    textFormat: Text.RichText
                }

                Text {
                    id: i_mean
                }
            }

            RowLayout {
                Text {
                    text: qsTr("Q = ")
                    textFormat: Text.RichText
                }

                Text {
                    id: quality
                }
            }
        }
    }
}
