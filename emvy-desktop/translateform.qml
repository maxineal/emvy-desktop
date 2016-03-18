
import QtQuick 2.0
import QtQuick.Controls 1.0
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

                text: "77.12213213213213232131316511"
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
/*
            Row {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: label_fromBase.bottom

                Slider {
                    id: fromBase
                    anchors.left: parent.left
                    anchors.right: fromBaseHint.left
                    anchors.rightMargin: 2
                    minimumValue: 2
                    maximumValue: 36
                    stepSize: 1
                    onValueChanged: fromBaseHint.text = text;
                }

                Text {
                    id: fromBaseHint
                    text: fromBase.value
                    anchors.right: parent.right
                }
            }*/

            ComboBox {
                id: fromBase
                anchors.left: parent.left
                anchors.right: parent.right
                model: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
                currentIndex: 6
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
/*
            Row {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: label_toBase.bottom

                Slider {
                    id: toBase
                    anchors.left: parent.left
                    anchors.right: toBaseHint.left
                    anchors.rightMargin: 2
                    minimumValue: 2
                    maximumValue: 36
                    stepSize: 1
                    onValueChanged: toBaseHint.text = text;
                }

                Text {
                    id: toBaseHint
                    text: toBase.value
                    anchors.right: parent.right
                }
            }*/


            ComboBox {
                id: toBase
                anchors.left: parent.left
                anchors.right: parent.right
                model: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
                currentIndex: 0
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

            TextField {
                id: accuracy
                placeholderText: qsTr("Точность")
                anchors.left: parent.left
                anchors.right: parent.right
                text: "5"
                validator: IntValidator {bottom: 0; top: 20}
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
                id: label_answer
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
