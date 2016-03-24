
import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1

import "main.js" as Main
import "stateData.js" as State
import "arithmetic.js" as Arithmetic

Item {
    id: main
    anchors.fill: parent

    Item {
        id: row1
        height: item1.height
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 3

        Column {
            id: item1
            width: main.width / 3
            anchors.left: parent.left
            spacing: 1

            Label {
                text: qsTr("Число 1")
                anchors.left: parent.left
            }

            TextField {
                id: num1
                placeholderText: qsTr("Число 1")
                anchors.left: parent.left
                anchors.right: parent.right
                text: "77.1221"
            }

            Label {
                text: qsTr("Основание")
                anchors.left: parent.left
            }

            SpinBox {
                id: num1_base
                anchors {
                    left: parent.left
                    right: parent.right
                }
                minimumValue: 2
                maximumValue: 36
                stepSize: 1
                value: 8
            }
        }

        Column {
            id: item2
            width: main.width / 3
            anchors {
                left: item1.right
                leftMargin: 3
            }

            Label {
                text: qsTr("Действие")
                anchors.left: parent.left
            }

            ComboBox {
                id: action
                anchors {
                    left: parent.left
                    right: parent.right
                }
                model: ["сложить", "вычесть", "умножить", "разделить"];
            }

            Label {
                text: qsTr("В какой системе счисления")
                anchors.left: parent.left
            }

            ComboBox {
                id: mainbase
                anchors {
                    left: parent.left
                    right: parent.right
                }
                model: num1_base.value != num2_base.value ? [num1_base.value, num2_base.value] : [num1_base.value];
            }
        }

        Column {
            id: item3
            anchors {
                left: item2.right
                leftMargin: 3
                right: parent.right
            }
            spacing: 1

            Label {
                text: qsTr("Число 2")
                anchors.left: parent.left
            }

            TextField {
                id: num2
                placeholderText: qsTr("Число 2")
                anchors.left: parent.left
                anchors.right: parent.right
                text: "33a.23"
            }

            Label {
                text: qsTr("Основание")
                anchors.left: parent.left
            }

            SpinBox {
                id: num2_base
                anchors {
                    left: parent.left
                    right: parent.right
                }
                minimumValue: 2
                maximumValue: 36
                stepSize: 1
                value: 16
            }
        }
    }

    Button {
        id: btn_execute
        text: qsTr("Выполнить действие")
        anchors.right: parent.right
        anchors.rightMargin: 5
        anchors.top: row1.bottom
        anchors.topMargin: 5

        onClicked: Arithmetic.execute();
    }

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
                id: label_answer_text
                text: qsTr("Ответ:")
                font.bold: false
                visible: false
                textFormat: Text.AutoText
            }

            Text {
                id: label_short_decision
                text: ""
                wrapMode: Text.Wrap
                visible: false
                textFormat: Text.RichText
            }
        }
    }
}
