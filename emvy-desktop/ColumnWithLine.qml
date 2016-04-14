import QtQuick 2.0
import QtQuick.Layouts 1.0
import "qrc:/tools.js" as Tools

ColumnLayout {
    property int internalId

    anchors.left: (internalId === 0) ? parent.left :
                                       parent.children[Tools.getChildIndexByInternalId(parent, internalId - 1)].right;


    width: children.width
    spacing: 1

    Rectangle {
        color: '#000000'
        height: 1
        anchors {
            left: parent.left
            right: parent.right
        }
    }

    MouseArea {
        anchors.fill: parent

        onClicked: {
            console.log(Tools.getLastChild(divMainBlock));
        }
    }

    /*
    Rectangle {
        color: "#14fb23"
        opacity: 0.25
        anchors.fill: parent
    }*/
}
