import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1

import "main.js" as Main
import "stateData.js" as State
import "tools.js" as Tools
import "bcd_translate.js" as BcdTranslate

Item {
    id: main
    anchors.fill: parent

    Item {
        id: row1
        height: item1.height
        anchors {
            left: parent.left
            right: parent.right
            top: parent.top
            margins: 3
        }

        Column {
            id: item1
            anchors.left: parent.left
            width: main.width / 3
            spacing: 1

            Label {
                text: qsTr("Число")
                anchors {
                    left: parent.left
                    right: parent.right
                }
            }

            TextField {
                id: input_num
                anchors {
                    left: parent.left
                    right: parent.right
                }
                placeholderText: qsTr("Число")
                text: "10412345"
            }
        }

        Column {
            id: item2
            anchors {
                left: item1.right
                leftMargin: 3
            }
            width: main.width / 3
            spacing: 1

            Label {
                text: qsTr("Действие")
                anchors {
                    left: parent.left
                    right: parent.right
                }
            }

            ComboBox {
                id: comboBox_action
                anchors {
                    left: parent.left
                    right: parent.right
                }
                model: [qsTr("Десятичное число в BCD"), qsTr("BCD в десятичное число")];
                currentIndex: 0;
            }
        }

        Column {
            id: item3
            spacing: 1
            anchors {
                left: item2.right
                leftMargin: 3
                right: parent.right
            }

            Label {
                text: qsTr("Тип BCD кода")
                anchors {
                    left: parent.left
                    right: parent.right
                }
            }

            ComboBox {
                id: comboBox_type
                anchors {
                    left: parent.left
                    right: parent.right
                }
                model: [qsTr("упакованный"), qsTr("неупакованный")];
                currentIndex: 0;
                //enabled: comboBox_action.currentIndex !== 1;
            }
        }
    }

    Button {
        id: btn_execute
        text: qsTr("Перевести")
        anchors {
            right: parent.right
            rightMargin: 5
            top: row1.bottom
            topMargin: 5
        }

        onClicked: BcdTranslate.execute();
    }

    // Поле вывода
    ScrollView {
        id: scrollView
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
            width: children.width;
            height: children.height + 20;

            Text {
                id: label_text_answer
                text: qsTr("Ответ:")
                font.bold: false
                visible: false
                textFormat: Text.AutoText
            }

            Text {
                id: label_answer
                text: ""
                wrapMode: Text.Wrap
                visible: false
                textFormat: Text.RichText
            }
        }
    }
}

