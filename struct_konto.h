#ifndef STRUCT_KONTO_H
#define STRUCT_KONTO_H

#include <QVector>
#include <QWidget>

#endif // STRUCT_KONTO_H

struct Konto{
    QString iban;
    QString nachname;
    QString vorname;

    double kontostand;
};
    QVector<Konto>konten;


