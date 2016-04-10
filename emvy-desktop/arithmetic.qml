
import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1

import "main.js" as Main
import "stateData.js" as State
import "arithmetic.js" as Arithmetic
import "tools.js" as Tools

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
                //text: "10448602"
                text: "1236"
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
                value: 10
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
                currentIndex: 3
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
//                currentIndex: 1
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
                //text: "da"
                text: "4"
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
                value: 10
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

            Text {
                id: label_text_decision
                text: qsTr("<b>Решение:</b>")
                visible: false
                anchors.topMargin: 20
                textFormat: Text.RichText
            }

            Text {
                id: label_text_showAs
                visible: false
                textFormat: Text.RichText
            }

            Text {
                id: label_num1_more_num2
                visible: false
                textFormat: Text.RichText
            }

            /*
            Text {
                id: label_text_multiply_without_dots
                visible: false
                text: qsTr('Перемножаем числа без учета запятых.')
            }
            */

            // Сложение и вычитание
            ColumnLayout {
                id: column_add_substract
                visible: false
                width: children.width
                spacing: 1

                RowLayout {
                    Layout.alignment: Qt.AlignRight

                    RowLayout {
                        Layout.alignment: Qt.AlignVCenter

                        Text {
                            id: asOperationSign
                            text: '+'
                        }

                        ColumnLayout {
                            spacing: 0

                            Row {
                                id: asBasedNumber1
                                spacing: 1
                                Layout.alignment: Qt.AlignRight
                            }

                            Row {
                                id: asBasedNumber2
                                spacing: 1
                                Layout.alignment: Qt.AlignRight
                            }
                        }
                    }
                }

                Rectangle {
                    height: 1
                    anchors {
                        left: parent.left
                        right: parent.right
                    }
                    color: '#000000'
                }

                // Результат
                Row {
                    id: asBasedResult
                    spacing: 1
                    Layout.alignment: Qt.AlignRight
                }
            }

            // Умножение
            ColumnLayout {
                id: column_multiply
                visible: false
                //width: children.width
                spacing: 1

                RowLayout {
                    Layout.alignment: Qt.AlignRight

                    RowLayout {
                        Layout.alignment: Qt.AlignVCenter

                        Text {
                            text: '*'
                        }

                        ColumnLayout {
                            spacing: 0

                            Row {
                                id: mulBasedNumber1
                                spacing: 1
                                Layout.alignment: Qt.AlignRight
                            }

                            Row {
                                id: mulBasedNumber2
                                spacing: 1
                                Layout.alignment: Qt.AlignRight
                            }
                        }
                    }
                }

                // линия
                Rectangle {
                    height: 1
                    anchors {
                        left: parent.left
                        right: parent.right
                    }
                    color: '#000000'
                    visible: mulSingleDigit.children.length > 1;
                }

                // промежуточные вычисления
                ColumnLayout {
                    id: mulSingleDigit
                    visible: children.length > 1;
                }

                // линия
                Rectangle {
                    height: 1
                    anchors {
                        left: parent.left
                        right: parent.right
                    }
                    color: '#000000'
                }

                // Результат
                Row {
                    id: mulBasedResult
                    spacing: 1
                    Layout.alignment: Qt.AlignRight
                }
            }

            // Деление
            ColumnLayout {
                id: column_divide
                visible: true
                spacing: 1

                RowLayout {
                    ColumnLayout {
                        // Делимое
                        Row {
                            id: divDevident
                            spacing: 1
                            Layout.alignment: Qt.AlignRight

                            /*
                            Text {
                                text: "4"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "6"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "6"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                            */
                        }

                        // Главный блок, промежуточные вычисления
                        Row {
                            id: divMainBlock

                            /*
                            Text {
                                text: "4"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                            */
                        }
                    }

                    // Линия
                    Rectangle {
                        color: '#000000'
                        width: 1
                        anchors {
                            top: parent.top
                            bottom: parent.bottom
                        }
                    }

                    ColumnLayout {
                        spacing: 2

                        // Делимое
                        Text {
                            text: ''
                            id: divDivider
                            Layout.alignment: Qt.AlignLeft
                        }
/*
                        Row {
                            id: divDivider
                            spacing: 1
                            Layout.alignment: Qt.AlignLeft

                            /*
                            Text {
                                text: "4"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                        }*/

                        // Линия
                        Rectangle {
                            color: '#000000'
                            height: 1
                            anchors {
                                left: parent.left
                                right: parent.right
                            }
                        }

                        // Частное
                        Text {
                            id: divQuotient
                            text: ''

                            /*
                            Text {
                                text: "1"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "1"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "6"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "."
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "5"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                            */
                        }
                    }
                }

                // Промежуточные вычисления
                ColumnLayout {
                    id: div_p

                    /*
                    ColumnLayout {
                        Rectangle {
                            color: '#000000'
                            height: 1
                            anchors {
                                left: parent.left
                                right: parent.right
                            }
                        }

                        Row {
                            Text {
                                text: " "
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "6"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                        }

                        Row {
                            Layout.alignment: Qt.AlignRight

                            Text {
                                text: "4"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                        }
                    }

                    ColumnLayout {
                        anchors.left: div_p.children[0].right
                        anchors.leftMargin: -10

                        Rectangle {
                            color: '#000000'
                            height: 1
                            anchors {
                                left: parent.left
                                right: parent.right
                            }
                        }

                        Row {
                            Text {
                                text: "2"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "6"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                        }

                        Row {
                            Layout.alignment: Qt.AlignRight

                            Text {
                                text: "2"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "4"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                        }
                    }

                    ColumnLayout {
                        anchors.left: div_p.children[1].right
                        anchors.leftMargin: -10

                        Rectangle {
                            color: '#000000'
                            height: 1
                            anchors {
                                left: parent.left
                                right: parent.right
                            }
                        }

                        Row {
                            Text {
                                text: "2"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "0"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                        }

                        Row {
                            Layout.alignment: Qt.AlignRight

                            Text {
                                text: "2"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }

                            Text {
                                text: "0"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                        }
                    }

                    ColumnLayout {
                        anchors.left: div_p.children[2].right
                        anchors.leftMargin: -10

                        Rectangle {
                            color: '#000000'
                            height: 1
                            anchors {
                                left: parent.left
                                right: parent.right
                            }
                        }

                        Row {
                            Text {
                                text: "0"
                                width: 10
                                horizontalAlignment: Text.AlignHCenter
                            }
                        }
                    }
                    */
                }
            }

            // Ответ
            Text {
                id: label_final_answer
                visible: false
                anchors.bottomMargin: 20
                textFormat: Text.RichText
            }
        }
    }
}
