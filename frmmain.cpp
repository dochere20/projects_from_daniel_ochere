/*
 Datei : frmmain.cpp
 Inhalt: Anwendung zur Simulation eines Online-Banking Apps
 Autor : Daniel Ochere
 Datum : 2021-03-26
*/

#include "frmmain.h"
#include "ui_frmmain.h"
#include "struct_buchung.h"
#include "struct_konto.h"

#include <QRegExp>
#include <QChar>
#include <QtGlobal>

FrmMain::FrmMain(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::FrmMain){
    ui->setupUi(this);
    QRegExp reEingabe("[D][E][0-9]{2}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ][0-9]{2}");
    ui->leIBAN->setValidator(new QRegExpValidator(reEingabe, this));

    QRegExp reEingabe1("[D][E][0-9]{2}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ][0-9]{2}");
    ui->leIBAN2->setValidator(new QRegExpValidator(reEingabe1, this));

    QRegExp reEingabe2("[D][E][0-9]{2}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ][0-9]{2}");
    ui->leIBAN3->setValidator(new QRegExpValidator(reEingabe, this));

    QRegExp reEingabe3("[D][E][0-9]{2}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ][0-9]{2}");
    ui->leIBAN4->setValidator(new QRegExpValidator(reEingabe, this));

    QRegExp reEingabe4("[D][E][0-9]{2}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ][0-9]{2}");
    ui->leIBAN5->setValidator(new QRegExpValidator(reEingabe, this));

    QRegExp reEingabe5("[D][E][0-9]{2}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}[0-9]{4}[ ][0-9]{2}");
    ui->leIBANneu->setValidator(new QRegExpValidator(reEingabe, this));

    QRegExp verwendung ("[a-zA-Z0-9 /s '.' ',']{,40}");
    ui->leZweck->setValidator(new QRegExpValidator(verwendung,this));
}

FrmMain::~FrmMain(){
    delete ui;
}



void FrmMain::on_btnNew_clicked(){
    ui->lwAnzeige->clear();

    QString newName = ui->leNewName->text();
    QString newLastName = ui->leNewlastName->text();

    bool negative = false;
    double kontoStand = ui->leNewKontoStand->text().toDouble();

    Konto P;
    Buchung op;

    QString iban = ui->leIBAN->text();

    QString d = "D";
    QString e = "E";

    QString space = " ";
    QString end = iban;
    QString pruefziffer = "";

    int ergebnis;
    int check = 0;


    for(int u = 0; u < end.length(); u++){
        if(end[u] == d){
            end.remove(end[u]);
        }

        if(end[u] == e){
            end.remove(end[u]);
        }

        if(end[u] == space){
            end.remove(end[u]);
        }
    }


    for(int z = 0; z < end.length(); z++){
        if(check == 0||check == 1){
            pruefziffer = pruefziffer + end[z];

            check++;
        }
    }

    QString p = end.right(18);

    p = p + "1314";

    qlonglong add;
    add = p.toLongLong();

    int pruefung = pruefziffer.toInt();

    ergebnis = add % 97;


    if(newName.isEmpty() == false && newLastName.isEmpty() == false && iban.size() == 27 && kontoStand > 0 && pruefung == ergebnis){

        for(int s = 0; s < konten.size(); s++){
            if(iban == konten[s].iban){
                negative = true;
            }
        }

        if(!negative){
            P.kontostand = kontoStand;
            P.nachname = newLastName;
            P.vorname = newName;
            P.iban = iban;

            op.ziel = "";
            op.betrag = 0;
            op.verwendungszweck = "";

            konten.append(P);
            buchungen.append(op);
        }

        for(int z = 0; z < konten.size(); z++){
            ui->lwAnzeige->addItem("Vorname: " + konten[z].vorname);
            ui->lwAnzeige->addItem("Nachname: " + konten[z].nachname);

            ui->lwAnzeige->addItem("iBAN: " + konten[z].iban);
            ui->lwAnzeige->addItem("Kontostand: " + QString::number(konten[z].kontostand) + " €");
            ui->lwAnzeige->addItem("---");
        }

        if(negative){
            ui->lwAnzeige->clear();
            ui->lwAnzeige->addItem("Bitte überprüfen sie die Eingabe!");
        }

        ui->leNewlastName->clear();
        ui->leNewName->clear();
        ui->leNewKontoStand->clear();
        ui->leIBAN->clear();

    }
    else{
        ui->lwAnzeige->addItem("Bitte Trage in allen Feldern etwas ein ! oder Falsche IBAN");
    }
}

void FrmMain::on_btnSortKontonr_clicked(){
    ui->lwAnzeige->clear();

    int anz = konten.size();
    int big = 0;
    int i =  0;

    Konto ende;
    Buchung pos;

    for(int x = 0; x < anz; x++){
        while(i < anz){
            if(big < konten[i].iban){
                ende.iban           = konten[i].iban;
                ende.vorname        = konten[i].vorname;
                ende.nachname       = konten[i].nachname;
                ende.kontostand     = konten[i].kontostand;

                pos.ziel                = buchungen[i].ziel;
                pos.betrag              = buchungen[i].betrag;
                pos.verwendungszweck    = buchungen[i].verwendungszweck;

                konten.remove(i);
                konten.prepend(ende);
                buchungen.prepend(pos);
            }

            i = i + 1;
        }
            ui->lwAnzeige->addItem("IBAN: " + konten[x].iban);
            ui->lwAnzeige->addItem("Vorname: " + konten[x].vorname);
            ui->lwAnzeige->addItem("Nachname: " + konten[x].nachname);
            ui->lwAnzeige->addItem("Kontostand: " + QString::number(konten[x].kontostand) + " €");
            ui->lwAnzeige->addItem("---");
    }
}

void FrmMain::on_btnClear_clicked(){
    ui->lwAnzeige->clear();
}

void FrmMain::on_btnSortName_clicked(){
    ui->lwAnzeige->clear();

    int anz             = konten.size();
    QString bigName     = "a";
    int i               =  0;

    Konto reset;
    Buchung pro;

    for(int x = 0; x < anz; x++){
        while(i < anz){
            if(bigName < konten[i].vorname){
                reset.vorname               = konten[i].vorname;
                reset.iban                  = konten[i].iban;
                reset.nachname              = konten[i].nachname;
                reset.kontostand            = konten[i].kontostand;
                pro.verwendungszweck        = buchungen[i].verwendungszweck;
                pro.ziel                    = buchungen[i].ziel;
                pro.betrag                  = buchungen[i].betrag;

                konten.remove(i);
                konten.prepend(reset);
                buchungen.prepend(pro);
            }

            i = i +1;
        }

            ui->lwAnzeige->addItem("IBAN: " + konten[x].iban);
            ui->lwAnzeige->addItem("Vorname: " + konten[x].vorname);
            ui->lwAnzeige->addItem("Nachname: " + konten[x].nachname);
            ui->lwAnzeige->addItem("Kontostand: " + QString::number(konten[x].kontostand) + " €");
            ui->lwAnzeige->addItem("---");
    }
}

void FrmMain::on_btnUpdate_clicked(){
    ui->lwAnzeige->clear();

    bool ok                         = false;
    bool vergeben                   = false;
    bool extra                      = false;

    double preis                    = ui->leUpBetrag->text().toDouble();

    QString upname                  = ui->leUpName->text();
    QString upnameNeu               = ui->leUpNameNeu->text();
    QString uplastname              = ui->leUpLastName->text();
    QString uplastnameNeu           = ui->leUpLastNameNeu->text();


    QString iban = ui->leIBAN4->text();
    QString ibanNeu = ui->leIBANneu->text();
    QString auszahlung = ui->leIBAN2->text();


    QString d = "D";
    QString e = "E";

    QString space = " ";
    QString end = ibanNeu;

    int ergebnis;
    int check = 0;

    QString pruefziffer = "";


    for(int u = 0; u < end.length(); u++){
        if(end[u] == d){
            end.remove(end[u]);
        }

        if(end[u] == e){
            end.remove(end[u]);
        }

        if(end[u] == space){
            end.remove(end[u]);
        }
    }


    for(int z = 0; z < end.length();z++){
        if(check == 0||check == 1){
            pruefziffer = pruefziffer + end[z];
            check++;
        }
    }

    QString p = end.right(18);

    p = p + "1314";

    qlonglong add;
    add = p.toLongLong();

    int pruefung = pruefziffer.toInt();

    ergebnis = add % 97;

    bool bestaetigung = false;

    if(ergebnis == pruefung){
        bestaetigung = true;
    }

    if(bestaetigung == true||auszahlung.size() == 27||iban.size() == 27 || ibanNeu.size() == 27  || upname.isEmpty() == false  && upnameNeu.isEmpty() ==false || uplastname.isEmpty() == false && uplastnameNeu.isEmpty() == false){
        for(int g =0; g < konten.size(); g++){
            if(konten[g].vorname == upname){
                konten[g].vorname = upnameNeu;
                ok = true;
            }
        }


        for(int e = 0; e < konten.size(); e++){
            if(konten[e].nachname == uplastname){
                konten[e].nachname = uplastnameNeu;
                 ok = true;
            }
        }


        for(int h = 0; h < konten.size(); h++){
            if(auszahlung == konten[h].iban){
                double erg = konten[h].kontostand + preis;

                if(erg > 0){
                    konten[h].kontostand = erg;
                    ok = true;
                }
                else{
                    ui->lwAnzeige->addItem("Konto darf nicht überzogen werden!");
                }
            }
        }


        if(iban.size() == 27  && ibanNeu.size() == 27 ){
            for(int s = 0; s < konten.size(); s++){
                if(ibanNeu == konten[s].iban){
                    vergeben = true;
                }
            }

            for(int u = 0; u < konten.size(); u++){
                if(iban == konten[u].iban && vergeben == false){
                    konten[u].iban = ibanNeu;
                    extra = true;
                }
            }

            if(vergeben == true){
                extra = false;
            }
        }


        if(ok == true || extra == true && vergeben == false){
            ui->lwAnzeige->addItem("Erfolgreich Bearbeitet Worden !");
        }
        else{
            ui->lwAnzeige->addItem("Es ist nichts zum Bearbeiten gefunden worden!");
        }

        if(bestaetigung == false){
            ui->lwAnzeige->clear();
            ui->lwAnzeige->addItem("Ungültige IBAN!");
        }

        if(vergeben == true && extra == false){
            ui->lwAnzeige->clear();
            ui->lwAnzeige->addItem("Die angegeben IBAN ist bereits vergeben!");
        }

        ui->leUpName->clear();
        ui->leUpNameNeu->clear();
        ui->leUpLastName->clear();
        ui->leUpLastNameNeu->clear();
        ui->leIBAN4->clear();
        ui->leIBANneu->clear();
    }
    else{
        ui->lwAnzeige->clear();

        ui->lwAnzeige->addItem("Bitte Trage etwas ein!");
        ui->lwAnzeige->addItem("Um eine Ein-/ Auszahlung durchzuführen bitte Kontonummer eingeben.");
    }

    ui->leUpBetrag->clear();
    ui->leUpLastName->clear();
    ui->leUpLastNameNeu->clear();
    ui->leUpName->clear();
    ui->leUpNameNeu->clear();
    ui->leIBAN4->clear();
    ui->leIBANneu->clear();
}

void FrmMain::on_btnUeberweisung_clicked(){
    double uebPreis = ui->leUeBetrag->text().toDouble();

    QString iban            = ui->leIBAN3->text();
    QString ibanZu          = ui->leIBAN5->text();
    QString zweck           = ui->leZweck->text();

    bool allesklar = false;
    bool emd = false;

    Buchung ueber;

    for(int s = 0; s < konten.size(); s++){

        if(iban == konten[s].iban){
            if(konten[s].kontostand - uebPreis > 0){
                allesklar = true;
                konten[s].kontostand = konten[s].kontostand - uebPreis;
            }
            else{
                break;
            }
        }
    }

    for(int r = 0; r < konten.size(); r++){
        if(ibanZu == konten[r].iban && allesklar == true){
            emd                                 = true;
            konten[r].kontostand                = konten[r].kontostand + uebPreis;
            buchungen[r].betrag                 = uebPreis;
            buchungen[r].verwendungszweck       = zweck;
            buchungen[r].ziel                   = ibanZu;
        }
    }

    if(allesklar == false || emd == false){
        ui->lwAnzeige->clear();

        ui->lwAnzeige->addItem("Bei der Überweisung ist ein Fehler aufgetreten!");
    }
    else{
        ui->lwAnzeige->clear();
        ui->lwAnzeige->addItem("Überweisung erfolgreich!");

        for(int x = 0;x < konten.size();x++){
            if(iban == konten[x].iban){
                ui->lwAnzeige->addItem(" --- Überweisung von: ---");

                ui->lwAnzeige->addItem("Vorname: " + konten[x].vorname);
                ui->lwAnzeige->addItem("Nachname: " + konten[x].nachname);

                ui->lwAnzeige->addItem("IBAN: " + konten[x].iban);

                ui->lwAnzeige->addItem("Kontostand: " + QString::number(konten[x].kontostand) + " €");
            }
        }


        for(int z = 0; z < konten.size(); z++){
            if(ibanZu == konten[z].iban){
                ui->lwAnzeige->addItem(" --- An: --- ");

                ui->lwAnzeige->addItem("Vorname: " + konten[z].vorname);
                ui->lwAnzeige->addItem("Nachname: " + konten[z].nachname);

                ui->lwAnzeige->addItem("IBAN: " + konten[z].iban);


                ui->lwAnzeige->addItem("Kontostand: " + QString::number(konten[z].kontostand) + " €");

                ui->lwAnzeige->addItem("---");

                ui->lwAnzeige->addItem("Verwendungszweck: " + buchungen[z].verwendungszweck);
                ui->lwAnzeige->addItem("Betrag: " + QString::number(buchungen[z].betrag) + " €");

            }
            ui->lwAnzeige->addItem(" ");
        }
    }

    ui->leUeBetrag->clear();
    ui->leIBAN3->clear();
    ui->leIBAN5->clear();
    ui->leZweck->clear();

}

void FrmMain::on_leIBAN_textChanged(const QString &arg1){
    QString iban                = ui->leIBAN->text();
    int anz                     = iban.size();

    if(anz == 1 && iban > 0){
        ui->leIBAN->setText("DE");
    }

    if(anz == 4||anz == 9|| anz == 14|| anz == 19|| anz == 24){
        ui->leIBAN->insert(" ");
    }
}

void FrmMain::on_leIBAN4_textChanged(const QString &arg1){
    QString iban            = ui->leIBAN4->text();
    int anz                 = iban.size();

    if(anz == 1 && iban > 0){
        ui->leIBAN4->setText("DE");
    }

    if(anz == 4||anz == 9|| anz == 14|| anz == 19|| anz == 24){
        ui->leIBAN4->insert(" ");
    }
}

void FrmMain::on_leIBAN3_textChanged(const QString &arg1){
    QString iban        = ui->leIBAN3->text();
    int anz             = iban.size();

    if(anz == 1 && iban > 0){
        ui->leIBAN3->setText("DE");
    }

    if(anz == 4||anz == 9|| anz == 14|| anz == 19|| anz == 24){
        ui->leIBAN3->insert(" ");
    }
}

void FrmMain::on_leIBAN2_textChanged(const QString &arg1){
    QString iban        = ui->leIBAN2->text();
    int anz             = iban.size();

    if(anz == 1 && iban > 0){
        ui->leIBAN2->setText("DE");
    }

    if(anz == 4||anz == 9|| anz == 14|| anz == 19|| anz == 24){
        ui->leIBAN2->insert(" ");
    }
}

void FrmMain::on_leIBANneu_textChanged(const QString &arg1){
    QString iban        = ui->leIBANneu->text();
    int anz             = iban.size();

    if(anz == 1 && iban > 0){
        ui->leIBANneu->setText("DE");
    }

    if(anz == 4||anz == 9|| anz == 14|| anz == 19|| anz == 24){
        ui->leIBANneu->insert(" ");
    }
}

void FrmMain::on_leIBAN5_textChanged(const QString &arg1){
    QString iban        = ui->leIBAN5->text();
    int anz             = iban.size();

    if(anz == 1 && iban > 0){
        ui->leIBAN5->setText("DE");
    }

    if(anz == 4||anz == 9|| anz == 14|| anz == 19|| anz == 24){
        ui->leIBAN5->insert(" ");
    }
}
