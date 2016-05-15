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

DecimalNumber::DecimalNumber(DecimalNumber *obj) : QObject(NULL)
{
    this->Clear();
    this->Copy(obj);
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

    // Если ноль, сделать положительным числом
    if(this->digits.size() == 1 && !this->sign)
    {
        if(this->digits[0] == 0) this->sign = true;
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
    QString s = this->sign ? "" : "-";
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
        s = s.mid(1);
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
    DecimalNumber *a = new DecimalNumber(this);
    DecimalNumber *b = new DecimalNumber(n);

    if(a->sign ^ b->sign)
    {
        if(!a->sign)
        {
            a->sign = true;
            b->sub(a);
            this->Copy(b);
        }
        else
        {
            b->sign = true;
            a->sub(b);
            this->Copy(a);
        }
        delete a;
        delete b;
        return;
    }

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
    delete a;
    delete b;
}

// ------------------------------------------------------
// Вычитание
OVERLOAD_FUNCTION(sub)
{
    DecimalNumber *a = new DecimalNumber(this);
    DecimalNumber *b = new DecimalNumber(n);
    if(!a->sign && !b->sign)
    {
        b->sign = true;
        a->add(b);
        a->sign = b->sign = false;
        this->Copy(a);
    }
    else if(!a->sign && b->sign)
    {
        a->sign = true;
        a->add(b);
        a->sign = false;
        this->Copy(a);
    }
    else if(a->sign && !b->sign)
    {
        b->sign = true;
        a->add(b);
        b->sign = false;
        this->Copy(a);
    }
    if(!(a->sign && b->sign))
    {
        delete a; delete b;
        return;
    }

    bool reverseSign = false;
    if(a->compare(b) == -1)
    {
        std::swap(a, b);
        reverseSign = true;
    }

    int min = std::min(a->min, b->min);
    int max = std::max(a->max, b->max);
    for(int i = min; i <= max; i++)
    {
        if(a->GetDigit(i) < b->GetDigit(i))
        {
            for(int j = i + 1; j <= max; j++)
            {
                if(a->GetDigit(j) > 0)
                {
                    a->SubDigit(j, 1);
                    a->AddDigit(i, 10);
                    for(int k = j - 1; k > i; k--) a->SetDigit(k, 9);
                    break;
                }
            }
        }
        a->SubDigit(i, b->GetDigit(i));
    }
    this->Copy(a);
    this->Normalize();
    if(reverseSign) this->sign = !this->sign;
    delete a;
    delete b;
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
    result->sign = !(this->sign ^ n->sign);
    this->Copy(result);
    delete result;
}

// ------------------------------------------------------
// Деление
OVERLOAD_FUNCTION(div)
{
    DecimalNumber *divider = new DecimalNumber();
    DecimalNumber *divided = new DecimalNumber();
    DecimalNumber *mul = new DecimalNumber();
    QString result = "", dived = "";
    int accuracy = 0;

    QString num = n->getNumber();
    num.replace('.', "").replace('-', "");
    divider->setNumber(num);
    divided->number = "0";

    vector<QString> mainDiv;
    for(int i = this->min; i <= this->max; i++) mainDiv.push_back(QString::number(this->GetDigit(i)));

    while(!mainDiv.empty() || (divided->number != "0" && accuracy < ACCURACY))
    {
        divided->ApplyNumber();
        if(divided->compare(divider) == -1)
        {
            result += "0";
            if(!mainDiv.empty())
            {
                divided->number += mainDiv.back();
                mainDiv.pop_back();
            }
            else
            {
                divided->number += "0";
                if(accuracy == 0) result += ".";
                accuracy++;
            }
            continue;
        }

        // Подбор множителя
        for(int i = 10; i > 0; i--)
        {
            mul->Copy(divider);
            mul->mul(i);
            if(mul->compare(divided) <= 0)
            {
                result += QString::number(i);
                divided->sub(mul);
                divided->number = divided->getNumber();
                break;
            }
        }

        // Следующая цифра
        if(!mainDiv.empty())
        {
            divided->number += mainDiv.back();
            mainDiv.pop_back();
        }
        else
        {
            divided->number += "0";
            if(accuracy == 0) result += ".";
            accuracy++;
        }

        if(mainDiv.empty() && divided->number.toULongLong() == 0)
        {
            result += "0";
            break;
        }
    }

    int offsetDot = 0;
    QString buffer = this->getNumber();
    if(buffer.indexOf('.') > -1) offsetDot -= buffer.length() - buffer.indexOf('.') - 1;
    buffer = n->getNumber();
    if(buffer.indexOf('.') > -1) offsetDot += buffer.length() - buffer.indexOf('.') - 1;
    if(offsetDot != 0)
    {
        int newPos = result.indexOf('.') + offsetDot;
        result.replace('.', "");
        result = result.mid(0, newPos) + "." + result.mid(newPos);
    }
    if(result.length() > 0 && result.mid(result.length() - 1, 1) == ".") result = result.mid(0, result.length() - 1);
    bool sign = this->sign;
    this->setNumber(result);
    this->sign = !(sign ^ n->sign);
    delete divider;
    delete divided;
    delete mul;
}

// ----------------------------------------------------------
// Деление с остатком
OVERLOAD_FUNCTION(mod)
{
    DecimalNumber *divider = new DecimalNumber();
    DecimalNumber *divided = new DecimalNumber();
    DecimalNumber *mul = new DecimalNumber();
    int accuracy = 0;

    QString num = n->getNumber();
    num.replace('.', "").replace('-', "");
    divider->setNumber(num);
    divided->number = "0";

    vector<QString> mainDiv;
    for(int i = this->min; i <= this->max; i++) mainDiv.push_back(QString::number(this->GetDigit(i)));

    while(!mainDiv.empty() || (divided->number != "0" && accuracy < ACCURACY))
    {
        divided->ApplyNumber();
        if(divided->compare(divider) == -1)
        {
            if(!mainDiv.empty())
            {
                divided->number += mainDiv.back();
                mainDiv.pop_back();
            }
            else
            {
                this->setNumber(divided->number);
                return;
            }
            continue;
        }

        // Подбор множителя
        for(int i = 10; i > 0; i--)
        {
            mul->Copy(divider);
            mul->mul(i);
            if(mul->compare(divided) <= 0)
            {
                divided->sub(mul);
                divided->number = divided->getNumber();
                break;
            }
        }

        // Следующая цифра
        if(!mainDiv.empty())
        {
            divided->number += mainDiv.back();
            mainDiv.pop_back();
        }
        else
        {
            this->setNumber(divided->number);
            return;
        }
        if(mainDiv.empty() && divided->number.toULongLong() == 0) break;
    }

    this->Normalize();
    delete divider;
    delete divided;
    delete mul;
}

// ----------------------------------------------------------
// Возведение в степень
OVERLOAD_FUNCTION(pow)
{
    if(n->compare(0) == 0)
    {
        this->setNumber("1");
        return;
    }
    else if(n->compare(1) == 0) return;
    int step = n->compare(0);
    DecimalNumber *m = new DecimalNumber(this);
    n->sub(step);
    while(n->compare(0) != 0)
    {
        this->mul(m);
        n->sub(step);
    }
    if(!n->sign)
    {
        m->setNumber("1");
        m->div(this);
        this->Copy(m);
    }
}

// ----------------------------------------------------------
// Сравнение
OVERLOAD_TFUNCTION(int, compare)
{
    // Сравнение с нулем
    if(this->digits.size() == 1 && n->digits.size() == 1)
    {
        if(this->digits[0] == n->digits[0] && this->digits[0] == 0) return 0;
    }

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

// ----------------------------------------------------------
// Округление
void DecimalNumber::floor()
{
    while(this->min < 0)
    {
        this->digits.erase(this->min);
        this->min++;
    }
}

void DecimalNumber::toFixed(uint n)
{
    int a = -n;
    if(this->min < a) this->digits[a] += (this->digits[a-1] >= 5 ? 1 : 0);
    while(this->min < a)
    {
        this->digits.erase(this->min);
        this->min++;
    }
}

// Отбрасывает целую часть
void DecimalNumber::shiftInt()
{
    while(this->max > 0)
    {
        this->digits.erase(this->max);
        this->max--;
    }
    this->digits[0] = 0;
}

QString DecimalNumber::toString()
{
    return this->getNumber();
}
