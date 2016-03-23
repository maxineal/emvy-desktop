
import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1

import "main.js" as Main
import "stateData.js" as State

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
            width: main.width / 2
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
                //validator: DoubleValidator {bottom: 0;}

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
    }

    Button {
        id: btn_translate
        text: qsTr("Перевести")
        anchors.right: parent.right
        anchors.rightMargin: 5
        anchors.top: row1.bottom
        anchors.topMargin: 5

        //onClicked: Translate.translate();
    }

    ComboBox {
        model: [
            "123", "321"
        ]
    }
}
