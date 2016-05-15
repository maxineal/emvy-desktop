#ifndef DECIMALNUMBER_H
#define DECIMALNUMBER_H

#define PAIR(a, b) pair<int, int>(a, b)
#define OVERLOAD_FUNCTION(func) void DecimalNumber::func(QString n) { DecimalNumber *d = new DecimalNumber; d->setNumber(n); this->func(d); delete d; } \
    void DecimalNumber::func(int n) { this->func(QString::number(n)); } \
    void DecimalNumber::func(DecimalNumber *n)

#define OVERLOAD_TFUNCTION(type, func) type DecimalNumber::func(QString n) { DecimalNumber *d = new DecimalNumber; d->setNumber(n); type a = this->func(d); delete d; return a; } \
    type DecimalNumber::func(int n) { return this->func(QString::number(n)); } \
    type DecimalNumber::func(DecimalNumber *n)

#include <map>
#include <math.h>
#include <QObject>
#include <QDebug>

using namespace std;

class DecimalNumber : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString number READ getNumber WRITE setNumber)

public:
    explicit DecimalNumber(QObject *parent = 0);

    QString getNumber();
    void setNumber(QString s);

    Q_INVOKABLE void add(DecimalNumber *n);
    Q_INVOKABLE void add(QString n);
    Q_INVOKABLE void add(int n);

    Q_INVOKABLE void sub(DecimalNumber *n);
    Q_INVOKABLE void sub(QString n);
    Q_INVOKABLE void sub(int n);

    Q_INVOKABLE void mul(DecimalNumber *n);
    Q_INVOKABLE void mul(QString n);
    Q_INVOKABLE void mul(int n);

    Q_INVOKABLE void div(DecimalNumber *n);
    Q_INVOKABLE void div(QString n);
    Q_INVOKABLE void div(int n);

    Q_INVOKABLE int compare(DecimalNumber *n);
    Q_INVOKABLE int compare(QString n);
    Q_INVOKABLE int compare(int n);

    int length();
    void push(int x);
    int pop();
    int shift();
    void ApplyNumber();

signals:

public slots:

private:
    void Clear();
    bool ValidateNumber(QString &n);

    bool ExistsDigit(int index);
    int GetDigit(int index);
    void SetDigit(int index, int val);
    void AddDigit(int index, int val);
    void SubDigit(int index, int val);
    void Normalize();
    void DotMove(int offset);
    void Copy(DecimalNumber *n);

    map<int, int> digits;
    int min, max;
    QString number;
    bool sign;
};

#endif // DECIMALNUMBER_H
