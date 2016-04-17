import QtQuick 2.0
import QtQuick.Controls 1.2
import QtQuick.Layouts 1.1

import "main.js" as Main
import "stateData.js" as State
import "tools.js" as Tools
import "bcd_arithmetic.js" as BcdArithmetic

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
            width: main.width / 3
            anchors.left: parent.left
            spacing: 2

            Label {
                text: qsTr("Число 1")
                anchors.left: parent.left
            }

            TextField {
                id: input_number1
                placeholderText: qsTr("Число 1")
                anchors {
                    left: parent.left
                    right: parent.right
                }
                //text: "00010101010000110101"
                //text: "0111100101100101.0001"
                text: "00010101"
            }
        }

        Column {
            id: item2
            width: parent.width / 3
            anchors {
                left: item1.right
                leftMargin: 3
            }
            spacing: 1

            Label {
                text: qsTr("Действие")
            }

            ComboBox {
                id: comboBox_action
                anchors {
                    left: parent.left
                    right: parent.right
                }
                model: ["сложение", "вычитание", "умножение"];
                currentIndex: 1
            }
        }

        Column {
            id: item3
            anchors {
                left: item2.right
                leftMargin: 3
                right: parent.right
            }
            spacing: 2

            Label {
                text: qsTr("Число 2")
                anchors.left: parent.left
            }

            TextField {
                id: input_number2
                placeholderText: qsTr("Число 2")
                anchors {
                    left: parent.left
                    right: parent.right
                }
                //text: "00011001000100110001"
                //text: "1001100001110110"
                text: "00001001"
            }
        }
    }

    Button {
        id: btn_execute
        text: qsTr("Выполнить действие")
        anchors {
            right: parent.right
            top: row1.bottom
            margins: 5
        }
        onClicked: BcdArithmetic.execute();
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
                visible: true
                textFormat: Text.AutoText
            }

            Text {
                id: label_answer
                text: ""
                wrapMode: Text.Wrap
                visible: true
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
                id: label_num1_more_num2
                visible: false
                textFormat: Text.RichText
            }

            ColumnLayout {
                id: column_add
                visible: false
                spacing: 1

                RowLayout {
                    Layout.alignment: Qt.AlignVCenter

                    Text {
                        id: label_add_sign1
                        text: '+'
                    }

                    ColumnLayout {
                        spacing: 0

                        RowLayout {
                            id: row_add_number1
                            spacing: 1
                            Layout.alignment: Qt.AlignRight
                        }

                        RowLayout {
                            id: row_add_number2
                            spacing: 1
                            Layout.alignment: Qt.AlignRight
                        }

                        Rectangle {
                            height: 1
                            anchors {
                                left: parent.left
                                right: parent.right
                            }
                            color: '#000000'
                        }
                    }
                }

                RowLayout {
                    Layout.alignment: Qt.AlignVCenter

                    Text {
                        id: label_add_sign2
                        text: '+'
                    }

                    ColumnLayout {
                        spacing: 0

                        RowLayout {
                            id: row_add_sum
                            spacing: 1
                            Layout.alignment: Qt.AlignRight
                        }

                        RowLayout {
                            id: row_add_correction
                            spacing: 1
                            Layout.alignment: Qt.AlignRight
                        }

                        Rectangle {
                            id: line_add_second
                            height: 1
                            anchors {
                                left: parent.left
                                right: parent.right
                            }
                            color: '#000000'
                        }
                    }
                }

                // Результат
                RowLayout {
                    id: row_add_result
                    spacing: 1
                    Layout.alignment: Qt.AlignRight
                }
            }
        }
    }
}

