/* Style */
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Alert, Breadcrumb, Card, Form, h1} from 'bootstrap';

/* React */
import React, {Component} from 'react';
import {useState, useEffect} from "react";

/* JQuery */
import $, {map} from "jquery";

/* Axios*/
import axios from "axios";

/* Crypto-JS */
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

/* Router */
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {useNavigate} from 'react-router-dom'


// Für Page
/* {(() => { })()} */

// Für Button 
/* {() => { { } } } */

function Main(){

    const lottoNumbers = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        61, 62, 63, 64, 65, 66, 67, 68, 69, 70
    ]

    var selectedLottoNrs = [];

    function addNumberToSelection(lottoNr){

        if(selectedLottoNrs.includes(lottoNr)){
            $('#lotto_nr_' + lottoNr).removeClass('btn-success');
            $('#lotto_nr_' + lottoNr).addClass('btn-primary');

            delete selectedLottoNrs[selectedLottoNrs.indexOf(lottoNr)];
        }
        else{
            if(selectedLottoNrs.length < 20){
                $('#lotto_nr_' + lottoNr).removeClass('btn-primary');
                $('#lotto_nr_' + lottoNr).addClass('btn-success');
                
                selectedLottoNrs.push(lottoNr);
            }
        }
        selectedLottoNrs = selectedLottoNrs.filter(x => x != null);
    }
    
    function getResults(){
        console.log(selectedLottoNrs);

        if(selectedLottoNrs.length == 20){
            console.log("Alles Gut");
            localStorage.setItem('checkEntries', JSON.stringify(selectedLottoNrs));
            
            navigate("/result");
        }
        else{
            console.log("Nicht genug");
        }
    }

    /* Funktion zum Navigieren der Seiten */
    const navigate = useNavigate();
    

    return(
        <>
            <div>
                <h1>Keno-Auswertung</h1>
            </div>
            
            <div class="lottoNrGrid">
                {
                    lottoNumbers.map((i, index) => 
                    
                        (i % 10 != 0)
                            ? 
                                <><button onClick={() => { {addNumberToSelection(i)} }} class="btn btn-primary selectLottoNr" id={"lotto_nr_" + i}>{i}</button> </>
                            :
                                <><button onClick={() => { {addNumberToSelection(i)} }} class="btn btn-primary selectLottoNr" id={"lotto_nr_" + i}>{i}</button> <br /> </>
                    )
                }
            </div>

            <br/><br />

            <><button type="submit" class="btn btn-primary" onClick={() => { {getResults()} }}>Spiel auswerten!</button> </>
            <><button type="submit" class="btn btn-primary" onClick={() => { {navigate('/setentry')} }}>Neuer Eintrag</button></>

        </>
    )
}
export default Main