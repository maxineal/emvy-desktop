#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlComponent>

#include "decimalnumber.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    qmlRegisterType<DecimalNumber>("Emvy", 1, 0, "DecimalNumber");

    QLocale::setDefault(QLocale::c());

    QQmlApplicationEngine engine;
    engine.load(QUrl(QStringLiteral("qrc:/main.qml")));

    return app.exec();
}

