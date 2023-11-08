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
import {BrowserRouter as Router, Routes, Route, useLinkClickHandler} from "react-router-dom";
import {useNavigate} from 'react-router-dom'

import list from '../lotto_list.png'


// Für Page
/* {(() => { })()} */

// Für Button 
/* {() => { { } } } */



function Result(){

const baseUrl = "http://localhost/lotto_server/";

/* Server-Antwort Konstanten */
const FAILED = 0;
const SUCCESS = 1;

const [tippResults, setTippResults] = useState([]);

/* Aktion nach Aufruf der Seite */
useEffect(() => {
    loadResults();
}, []);

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

    /* Funktion zum Navigieren der Seiten */
    const navigate = useNavigate();
    
    const newTipp = ((typeof localStorage.getItem('checkEntries') != undefined && localStorage.getItem('checkEntries')) ? localStorage.getItem('checkEntries') : '');

    console.log(newTipp);

    function loadResults(){
        if(newTipp != ""){
            /* POST-Anfrage - Parameter */
            const formObj = {
                "tipp" : newTipp,
            }

            const postData = JSON.stringify(formObj);
            const params = new URLSearchParams();

            params.append('postData', postData);
            params.append('action', "getResults");

            /* HTTP Config */
            let axiosConfig = {
                headers: {
                    'Content-Type' : 'application/json; charset=UTF-8',
                    'Accept': 'Token',
                    "Access-Control-Allow-Origin": "*",
                }
            };

            const serverRequest = axios({
                method: 'post',
                url: baseUrl,
                headers: axiosConfig,
                data: params
            })
            .then(function(serverResult){
                /* Objekt - Serverantwort */
                const data = ((typeof serverResult.data != undefined && serverResult.data) ? serverResult.data : "");
                    
                console.log(serverResult);
                console.log(data);

                if(typeof data === 'object'){
                    /* Statuscode */
                    var statusCode = ((typeof data.status != undefined && data.status) ? data.status : "");
                    var tippData = ((typeof data.data != undefined && data.data) ? data.data : []);

                    console.log(statusCode);
                    console.log(tippData);

                    if(statusCode == SUCCESS){
                        setTippResults(tippData);
                    }
                }
                else{
                    /* Ungültige Daten vom Server */
                }
            })
            .catch(function(errorReport){
                /* Fehlermeldung der Anfrage */
                var msgError = errorReport.toJSON();

                if(msgError.message != ""){
                    console.log(msgError.message);
                }
            })
            console.log(serverRequest);
        }
        else{
            console.log("No Number");
        }
    }

    console.log("Acjgin" + tippResults.length);

    if((tippResults.length > 0)){
        
        return(
            <>
                <div>
                    <h1>Keno-Auswertung</h1>
                    
                </div>

                <div>
                    <img id='lottoList' src={list} />
                </div>
                
                <div class="lottoNrGrid">

                    {
                        tippResults.map(function(data) {
                            const allEntries = Object.entries(data);
                            
                            return(
                                allEntries.map(function(lotto){
                                    var currentItemNumber = lotto[0];
                                    var currentItemValue = lotto[1];

                                    if(currentItemNumber == 0){
                                        return(
                                            <>
                                                <div><br /></div>
                                                <h2>{currentItemValue}</h2>
                                            </>
                                        )
                                    }
                                    else{
                                        if(currentItemValue == 1){
                                            return(
                                                <>
                                                    <button class="btn btn-success disabled">{currentItemNumber} </button>
                                                </>
                                            )
                                        }
                                        else{
                                            return(
                                                <>
                                                   <button class="btn btn-danger disabled">{currentItemNumber} </button>
                                                </>
                                            )
                                        }
                                    }

                                    
                                })
                            )
                        })
                    }
                </div>

                <br/><br />

                <button type="submit" class="btn btn-primary" onClick={() => { {navigate('/main')} }}>Neuer Tipp</button>

            </>
        )
    }
    else{
        return(
            <>Loading---</>
        )
    }
}
export default Result