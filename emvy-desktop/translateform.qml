
import QtQuick 2.0
import QtQuick.Controls 1.2

Item {
    id: main
    anchors.fill: parent

    Row {
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
                placeholderText: qsTr("Число")
                anchors.left: parent.left
                anchors.right: parent.right
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
                anchors.left: parent.left
                anchors.right: parent.right
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
                anchors.left: parent.left
                anchors.right: parent.right
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
                placeholderText: qsTr("Точность")
                anchors.left: parent.left
                anchors.right: parent.right
            }
        }
    }

    Button {
        text: qsTr("Перевести")
        anchors.right: parent.right
        anchors.rightMargin: 5
        anchors.top: row1.bottom
        anchors.topMargin: 5
    }
}
