#ifndef DECIMALNUMBER_H
#define DECIMALNUMBER_H

#define PAIR(a, b) pair<int, int>(a, b)

#include <map>
#include <QObject>
#include <QDebug>

using namespace std;

class DecimalNumber : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString number READ getNumber WRITE setNumber)

public:
    explicit DecimalNumber(QObject *parent = 0);

    QString getNumber() { return "do it"; }
    void setNumber(QString s);

signals:

public slots:

private:
    void Clear();
    bool ValidateNumber(QString &n);

    map<int, int> digits;
    int min, max;
    QString number;
};

#endif // DECIMALNUMBER_H
