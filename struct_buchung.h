#ifndef STRUCT_BUCHUNG_H
#define STRUCT_BUCHUNG_H

#include <QVector>
#include <QWidget>


#endif // STRUCT_BUCHUNG_H

struct Buchung{
    QString verwendungszweck;
    QString ziel;

    double betrag;
};
    QVector<Buchung>buchungen;

