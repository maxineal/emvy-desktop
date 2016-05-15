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
    this->sign = true;
}

// Проверяет число
bool DecimalNumber::ValidateNumber(QString &n)
{
    n = n.replace(',', '.').replace(' ', "");
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

// ------------------------------------------------------
// Работа с разрядами

bool DecimalNumber::ExistsDigit(int index)
{
    return this->digits.find(index) != this->digits.end();
}

// Возвращает цифру из разряда index
int DecimalNumber::GetDigit(int index)
{
    if(!this->ExistsDigit(index)) return 0;
    return this->digits[index];
}

void DecimalNumber::SetDigit(int index, int val)
{
    if(this->ExistsDigit(index)) this->digits[index] = val;
    else this->digits.insert(PAIR(index, val));
    if(this->max < index) this->max = index;
    if(this->min > index) this->min = index;
}

void DecimalNumber::AddDigit(int index, int val)
{
    this->SetDigit(index, this->GetDigit(index) + val);
}

void DecimalNumber::SubDigit(int index, int val)
{
    this->SetDigit(index, this->GetDigit(index) - val);
}

void DecimalNumber::Normalize()
{
    // Лидирующие нули
    while(this->GetDigit(this->max) == 0 && this->max > 0)
    {
        this->digits.erase(this->max);
        this->max--;
    }
    // Завершающие нули
    while(this->GetDigit(this->min) == 0 && this->min < 0)
    {
        this->digits.erase(this->min);
        this->min++;
    }
}

void DecimalNumber::DotMove(int offset)
{
    if(offset < 0)
    {
        for(int i = this->min; i <= this->max; i++)
        {
            this->SetDigit(i + offset, this->GetDigit(i));
            this->digits.erase(i);
        }
    }
    else
    {
        for(int i = this->max; i >= this->min; i--)
        {
            this->SetDigit(i + offset, this->GetDigit(i));
            this->digits.erase(i);
        }
    }
    this->min += offset;
    this->max += offset;
}

void DecimalNumber::ApplyNumber()
{
    this->setNumber(this->number);
}

void DecimalNumber::Copy(DecimalNumber *n)
{
    this->digits = n->digits;
    this->min = n->min;
    this->max = n->max;
    this->sign = n->sign;
}

int DecimalNumber::length()
{
    return this->digits.size();
}

int DecimalNumber::shift()
{
    int value = this->digits[this->max];
    if(this->length() > 1)
    {
        this->digits.erase(this->max);
        this->max--;
    }
    return value;
}

// ----------------------------------------------------

// Возвращает число в виде строки
QString DecimalNumber::getNumber()
{
    QString s = "";
    int max = std::max(this->max, 0);
    for(int i = max; i >= this->min; i--)
    {
        if(i == -1) s += ".";
        s += QString::number(this->GetDigit(i));
    }
    return s;
}

// Устанавливает число
void DecimalNumber::setNumber(QString s)
{
    this->Clear();
    this->ValidateNumber(s);
    if(s.length() > 1 && s.mid(0, 1) == "-")
    {
        s = s.mid(1, s.length() - 1);
        this->sign = false;
    }
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
    this->Normalize();
}

// ------------------------------------------------------
// Сложение
OVERLOAD_FUNCTION(add)
{
    int min = std::min(this->min, n->min);
    int max = std::max(this->max, n->max);
    for(int i = min; i <= max; i++)
    {
        this->AddDigit(i, n->GetDigit(i));
        if(this->GetDigit(i) >= 10)
        {
            if(this->max < i + 1) this->max = i + 1;
            this->AddDigit(i + 1, 1);
            this->SubDigit(i, 10);
        }
    }
    this->Normalize();
}

// ------------------------------------------------------
// Вычитание
OVERLOAD_FUNCTION(sub)
{
    int min = std::min(this->min, n->min);
    int max = std::max(this->max, n->max);
    for(int i = min; i <= max; i++)
    {
        if(this->GetDigit(i) < n->GetDigit(i))
        {
            for(int j = i + 1; j <= max; j++)
            {
                if(this->GetDigit(j) > 0)
                {
                    this->SubDigit(j, 1);
                    this->AddDigit(i, 10);
                    for(int k = j - 1; k > i; k--) this->SetDigit(k, 9);
                    break;
                }
            }
        }
        this->SubDigit(i, n->GetDigit(i));
    }
    this->Normalize();
}

// ------------------------------------------------------
// Умножение
OVERLOAD_FUNCTION(mul)
{
    DecimalNumber *result = new DecimalNumber();
    int a, b, mul;
    for(int i = n->min; i <= n->max; i++)
    {
        a = i - n->min;
        for(int j = this->min; j <= this->max; j++)
        {
            b = j - this->min;
            result->AddDigit(a + b, this->GetDigit(j) * n->GetDigit(i));
            for(int k = a + b; k <= result->max; k++)
            {
                mul = result->GetDigit(k);
                if(mul / 10 > 0)
                {
                    result->AddDigit(k + 1, mul / 10);
                    result->SetDigit(k, mul % 10);
                }
                else break;
            }
        }
    }
    if(this->min < 0 || n->min < 0) result->DotMove(this->min + n->min);
    result->Normalize();
    this->Copy(result);
    delete result;
}

// ------------------------------------------------------
// Деление
OVERLOAD_FUNCTION(div)
{
    DecimalNumber *divided = new DecimalNumber();
    DecimalNumber *mul = new DecimalNumber();
    QString result = "", dived = "";
    int accuracy = 0;

    divided->number = "0";
    for(int i = this->max; i >= this->min && divided->number.length() - 1 < n->length(); i++)
        divided->number += QString::number(this->shift());

    while((this->length() > 0))
    {
        divided->ApplyNumber();
        if(divided->compare(n) == -1)
        {
            result += "0";
            divided->number += QString::number(this->shift());
            continue;
        }

        for(int i = 10; i > 0; i--)
        {
            mul->Copy(n);
            mul->mul(i);
            if(mul->compare(divided) <= 0)
            {
                result += QString::number(i);
                divided->sub(mul);
                divided->number = divided->getNumber();
                break;
            }
        }

        divided->number += QString::number(this->shift());
    }
}

// ----------------------------------------------------------
// Сравнение
OVERLOAD_TFUNCTION(int, compare)
{
    if(this->sign ^ n->sign) return this->sign ? 1 : -1;
    int a, b;
    if(this->max != n->max) return this->max > n->max ? 1 : -1;
    else
    {
        for(int i = this->max; i >= std::max(this->min, 0); i--)
        {
            a = this->GetDigit(i);
            b = n->GetDigit(i);
            if(a != b) return a > b ? 1 : -1;
        }
    }
    if(this->min < 0 || n->min < 0)
    {
        for(int i = -1; i >= std::min(this->min, n->min); i--)
        {
            a = this->GetDigit(i);
            b = n->GetDigit(i);
            if(a != b) return a > b ? 1 : -1;
        }
    }
    return 0;
}
