#include "decimalnumber.h"

/**
 * @brief DecimalNumber::DecimalNumber
 * @param parent
 * Конструктор
 */
DecimalNumber::DecimalNumber(QObject *parent) : QObject(parent)
{
    this->Clear();
    this->digits.insert(PAIR(0, 0));
}

// Очистка данных
void DecimalNumber::Clear()
{
    this->min = this->max = 0;
    this->digits.clear();
}

// Проверяет число
bool DecimalNumber::ValidateNumber(QString &n)
{
    n = n.replace(',', '.');
    int dotCount = 0;
    for(int i = 0; i < n.length(); i++)
    {
        if(n.mid(i, 1) == ".")
        {
            dotCount++;
            continue;
        }
        bool ok = false;
        n.mid(i, 1).toInt(&ok);
        if(!ok) return false;
    }
    return dotCount < 1;
}

void DecimalNumber::setNumber(QString s)
{
    this->Clear();
    this->ValidateNumber(s);
    int dot = s.indexOf('.');
    int currentDigit = (dot > -1) ? dot - s.length() + 1 : 0;
    this->min = currentDigit;
    for(int i = s.length() - 1; i >= 0; i--)
    {
        if(i == dot) continue;
        this->digits.insert(PAIR(currentDigit, s.mid(i, 1).toInt()));
        currentDigit++;
    }
    this->max = currentDigit != 0 ? currentDigit - 1 : 0;
}
