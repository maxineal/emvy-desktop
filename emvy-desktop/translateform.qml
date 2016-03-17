
import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1
import QtQuick.Controls.Styles 1.2

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
                text: qsTr("Основание")
                anchors.left: parent.left
            }

            ComboBox {
                id: fromBase
                anchors.left: parent.left
                anchors.right: parent.right
                model: Main.getBases();
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
                text: qsTr("Конечное основание")
                anchors.left: parent.left
            }

            ComboBox {
                id: toBase
                anchors.left: parent.left
                anchors.right: parent.right
                model: Main.getBases();
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
                inputMask: "90"
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
        anchors.margins: 3

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
