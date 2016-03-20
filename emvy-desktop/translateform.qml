
import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1

import "main.js" as Main
import "stateData.js" as State
import "translate.js" as Translate

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
            width: main.width / 4
            anchors.left: parent.left

            Label {
                text: qsTr("Число")
                anchors.left: parent.left
            }

            TextField {
                id: number
                placeholderText: qsTr("Число")
                anchors.left: parent.left
                anchors.right: parent.right
                validator: DoubleValidator {bottom: 0;}

                text: "77.1221"
            }
        }

        Column {
            id: item2
            width: main.width / 4
            spacing: -1
            anchors.left: item1.right
            anchors.leftMargin: 3

            Label {
                id: label_fromBase
                text: qsTr("Основание")
                anchors.left: parent.left
            }

            SpinBox {
                id: fromBase
                anchors.left: parent.left
                anchors.right: parent.right
                minimumValue: 2
                maximumValue: 36
                stepSize: 1
                value: 8
            }
        }

        Column {
            id: item3
            width: main.width / 4
            spacing: -1
            anchors.left: item2.right
            anchors.leftMargin: 3

            Label {
                id: label_toBase
                text: qsTr("Конечное основание")
                anchors.left: parent.left
            }

            SpinBox {
                id: toBase
                anchors.left: parent.left
                anchors.right: parent.right
                minimumValue: 2
                maximumValue: 36
                stepSize: 1
                value: 16
            }
        }

        Column {
            id: item4
            spacing: -1
            anchors.left: item3.right
            anchors.leftMargin: 3
            anchors.right: parent.right

            Label {
                text: qsTr("Точность")
                anchors.left: parent.left
            }

            SpinBox {
                id: accuracy
                anchors.left: parent.left
                anchors.right: parent.right
                minimumValue: 0
                maximumValue: 20
                stepSize: 1
                value: 5
            }
        }
    }

    Button {
        id: btn_translate
        text: qsTr("Перевести")
        anchors.right: parent.right
        anchors.rightMargin: 5
        anchors.top: row1.bottom
        anchors.topMargin: 5

        onClicked: Translate.translate();
    }

    ScrollView {
        id: scrollView
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: btn_translate.bottom
        anchors.bottom: parent.bottom
        anchors.margins: 5
        anchors.topMargin: 2

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

            Text {
                id: label_decision_text
                text: qsTr("<b>Решение:</b>")
                visible: false
                anchors.top: label_short_decision.bottom
                anchors.topMargin: 10
                textFormat: Text.RichText
            }

            Text {
                id: label_translateTo10_text
                visible: false
            }

            Text {
                id: label_translateTo10
                visible: false
                textFormat: Text.RichText
            }

            Text {
                id: label_translateFrom10_text
                anchors.top: label_translateTo10.bottom
                anchors.topMargin: 10
                visible: false
            }

            Text {
                id: label_translateFrom10_divide_int_text
                visible: false
            }
        }
    }
}
