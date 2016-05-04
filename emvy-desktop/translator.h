#ifndef TRANSLATOR_H
#define TRANSLATOR_H

#include <QObject>

class Translator : public QObject
{
    Q_OBJECT
public:
    explicit Translator(QObject *parent = 0);

signals:

public slots:
};

#endif // TRANSLATOR_H
