/*
 Datei : frmmain.h
 Inhalt: Formular für Bank (Thema Arrays)
 Autor : Daniel Ochere
 Datum : 2021-01-09
*/

#ifndef FRMMAIN_H
#define FRMMAIN_H
#include <QVector>
#include <QWidget>


namespace Ui {
    class FrmMain;
}

class FrmMain : public QWidget{
    Q_OBJECT

public:
    explicit FrmMain(QWidget *parent = nullptr);
    ~FrmMain();

private slots:
    void on_btnSortKontonr_clicked();

    void on_btnNew_clicked();

    void on_btnClear_clicked();

    void on_btnSortName_clicked();

    void on_btnUpdate_clicked();

    void on_btnUeberweisung_clicked();

    void on_leIBAN_textChanged(const QString &arg1);

    void on_leIBAN4_textChanged(const QString &arg1);

    void on_leIBAN3_textChanged(const QString &arg1);

    void on_leIBAN2_textChanged(const QString &arg1);

    void on_leIBANneu_textChanged(const QString &arg1);

    void on_leIBAN5_textChanged(const QString &arg1);

private:
    Ui::FrmMain *ui;

};

#endif // FRMMAIN_H
