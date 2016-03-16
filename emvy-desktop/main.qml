import QtQuick 2.0
import QtQuick.Controls 1.2
import QtWebKit 3.0

ApplicationWindow {
    visible: true
    width: 640
    height: 480
    minimumWidth: 300
    minimumHeight: 200
    title: qsTr("Emvy Desktop")

    menuBar: MenuBar {
        Menu {
            title: qsTr("File")
            MenuItem {
                text: qsTr("&Open")
                onTriggered: console.log("Open action triggered");
            }
            MenuItem {
                text: qsTr("Exit")
                onTriggered: Qt.quit();
            }
        }
    }
/*
    ScrollView {
        anchors.fill: parent
        WebView {
            anchors.fill: parent
            url: "http://emvy.tk/translating"
        }
    }*/
}

