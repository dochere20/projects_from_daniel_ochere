/* Style */
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Alert, Breadcrumb, Card, Form} from 'bootstrap';

import ProgressBar from 'react-percent-bar';

/* React */
import React, {Component} from 'react';
import {useState, useEffect} from "react";

/* JQuery */
import $, { map } from "jquery";

/* Axios*/
import axios from "axios";

/* Crypto-JS */
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

/* Router */
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {useNavigate} from 'react-router-dom'

/* Pages */
import NavigationBar from "../parts/navbar"
import Layout from "../parts/layout"

function Statistiken(){
    document.title = "Statistiken";

    /* Server Adresse */
    const baseUrl = "https://" + window.location.hostname + "/zeiterfassungsserver/server.php";

    /* Server-Antwort Konstanten */
    const FAILED                    = 0;
    const SUCCESS                 = 1;
    const REGISTERED                = 2;
    const WRONG_PASSWORD            = 4;
    const NO_USER_FOUND             = 8;
    const EMPTY_FIELDS              = 16;
    const USER_FOUND                = 32;
    const USER_LOGGED_OUT           = 64;
    const USER_EXISTING             = 128;
    const SERVER_ERROR              = 256;
    const INVALID_RESPONSE          = 512;

    const PASSWORD_NOT_CHANGED      = 1024;
    const EMAIL_NOT_CHANGED         = 2048;
    
    const USER_UPDATED              = 4096;
    const NO_PERMISSION             = 8192;

    const INACTIVE_USER             = 999;

    /* Fehlertexte */
    const errorTxt = {
        0 : ["Fehler aufgetreten", "red"],
        1 : ["Erfolgreich eingeloggt", "#60c860"],
        2 : ["Erfolgreich registriert", "#60c860"],
        4 : ["Falsches Passwort", "red"],
        8 : ["Ungültiger Zugang - Bitte anmelden!", "red"],
        16 : ["Leeres Feld eingegeben", "red"],
        32 : ["Benutzer gefunden", "#60c860"],
        64 : ["Benutzer ausgelogt", "#60c860"],
        128 : ["Benutzer existiert bereits", "red"],
        256 : ["Server zurzeit nicht erreichbar", "red"],
        512 : ["Server Meldet Fehler! - Bitte den Administrator aufsuchen", "red"],
        1024 : ["Passwort wurde nicht geändert!", "red"],
        2048 : ["E-Mail wurde nicht geändert!", "red"],
        4096 : ["Benutzer erfolgreich bearbeitet", "green"],
        8192 : ["Sie haben leider keine Berechtigung für diese Aktion!", "red"],
        999 : ["Dieser Benutzer muss von einem Admin freigeschaltet werden!", "red"]
    }

    /* User-Daten Variablen */
    const [userID, setUserID] = useState();
    const [userEmail, setUserEmail] = useState();
    const [userFirstname, setUserFirstname] = useState();
    const [userLastname, setUserLastname] = useState();
    const [userSection, setUserSection] = useState();
    const [userHours, setUserHours] = useState();
    
    /* Zeittabelle Variable */
    const [timeArray, setTimeArray] = useState();

    const [staticsArray, setStaticsData] = useState();

    /* Fehler Variable */
    const [error, setError] = useState();

    /* Funktion zum Navigieren der Seiten */
    const navigate = useNavigate();

    function checkPageAccess(){
        /* Zugriffsberechtigung prüfen */
        var lCode = ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : "");

        if(lCode.trim() === ""){
            navigate("/login");
        }
        else{
            /* POST-Anfrage - Parameter */
            const formObj = {
                "lCode" : lCode,
            }

            const postData = JSON.stringify(formObj);
            const params = new URLSearchParams();

            params.append('postData', postData);
            params.append('action', "checkUser");

            /* Anfrage an Server */
            const getData = async () => {

                /* HTTP Config */
                let axiosConfig = {
                    headers: {
                        'Content-Type' : 'application/json; charset=UTF-8',
                        'Accept' : 'Token',
                        "Access-Control-Allow-Origin" : "*",
                    }
                };
        
                const serverResult = await axios({
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
                        var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);

                        /* Objekt aus Benutzerdaten */
                        const userData = ((typeof data.userData != undefined && data.userData) ? data.userData : "");

                        /* Fehlermeldung */
                        var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                        var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");
                        
                        console.log(outputTxt);

                        if(statusCode === SUCCESS){
                            /* User-Daten */
                            var id = ((typeof userData.id != undefined && userData.id) ? userData.id : "");
                            var email = ((typeof userData.email != undefined && userData.email) ? userData.email : "");
                            var firstname = ((typeof userData.vorname != undefined && userData.vorname) ? userData.vorname : "");
                            var lastname = ((typeof userData.name != undefined &&userData.name) ? userData.name : "");
                            var section = ((typeof userData.bezeichnung != undefined && userData.bezeichnung) ? userData.bezeichnung : "");
                            var hours = ((typeof userData.stundenzahl != undefined && userData.stundenzahl) ? userData.stundenzahl : "");
                            
                            setUserID(id);
                            setUserEmail(email);
                            setUserFirstname(firstname);
                            setUserLastname(lastname);
                            setUserSection(section);
                            setUserHours(hours);
                        }
                        else{
                            localStorage.setItem("loginMSG", outputTxt);
                            navigate("/logout");
                        }
                    }
                    else{
                        /* Ungültige Daten vom Server */
                        setError(errorTxt[INVALID_RESPONSE][0]);
                    }
                })
                .catch(function(errorReport){
                    /* Fehlermeldung der Anfrage */
                    var msgError = errorReport.toJSON();
                    
                    console.log(errorReport);
                    console.log(msgError);

                    if(msgError.message != ""){
                        console.log(msgError.message + "(" + SERVER_ERROR + ")");
                        setError(msgError.message);
                    }
                })
            }
            getData();
        }
    }

    /* Aktion nach Aufruf der Seite */
    useEffect(() => {
        checkPageAccess();
        getStatics();
    }, []);

    function getStatics(){
        const getTimeStats  = async () => {
            // prüfe Benutzerdaten aus Backend
            const formObj = {
                "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            }

            const postData = JSON.stringify(formObj);
            const params = new URLSearchParams();

            params.append('postData', postData);
            params.append('action', "getUserHours");

            let axiosConfig = {
                headers: {
                    'Content-Type' : 'application/json; charset=UTF-8',
                    'Accept' : 'Token',
                    "Access-Control-Allow-Origin" : "*",
                }
            };
    
            const serverRequest = await axios({
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

                var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
                var avgTime = ((typeof data.averageTime != undefined && data.averageTime) ? data.averageTime : []);
                
                /* Fehlermeldung */
                var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                if(statusCode == SUCCESS){
                    setStaticsData(avgTime);
                }
                else{
                    if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                        localStorage.setItem("loginMSG", outputTxt);
                        navigate("/logout");
                    }
                }
            })
            .catch(function(errorReport){
                var msgError = errorReport.toJSON();

                if(msgError.message != ""){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);
                }
            })
        }
        getTimeStats();
    }

    function fillColorArray(value) {
        var color = "red"
        
        if(value >= 0 && value <= 20){
            color = "red";
        }
        
        if(value >= 21 && value <= 75){
            color = "orange";
        }
        
        if(value >= 76 && value <= 100){
            color = "green";
        }
        
        if(value >= 101 && value <= 110){
            color = "orange";
        }

        if(value >= 111){
            color = "red";
        }

        return color;
    };
    
    if(typeof error != undefined && error){
        return(
            <>
                <Layout />
                <div className="p-5 text-center">
                    <h4 className="mb-3">{error}</h4>
                    
                    Kontakt: <a href="mailto:it.support@modelcarworld.de">it.support@modelcarworld.de</a>
                    
                    <br /><br />
                        
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary" onClick={() => { {navigate("/start");} } }>Zurück zu start</button>
                    </div>

                </div>
            </>
        )
    }
    else{
        if((typeof userID != undefined && userID) && (typeof staticsArray === 'object' && staticsArray)){
           
           var prozent = (typeof staticsArray[0][4] != undefined && staticsArray[0][4] ? staticsArray[0][4] : 0);
           
           var prozentSatz = (typeof staticsArray[0][2] != undefined && staticsArray[0][2] ? staticsArray[0][2] : 0);

           var sollZeit = (typeof staticsArray[0][1] != undefined && staticsArray[0][1] ? staticsArray[0][1] : 0);
           var istZeit = (typeof staticsArray[0][0] != undefined && staticsArray[0][0] ? staticsArray[0][0] : 0);

            return(
                <>
                    <NavigationBar />
                    <Layout />
                    <div className="container px-4 text-center">
                        <div className="row gx-5">
                            <div className="col">
                                <div className="p-3"></div>
                                <h4>Durchschnitt Gesamt</h4>
                                
                                <p><b>Stunden</b></p>
                                <p>Soll: {sollZeit}<div>Täglicher Durschnitt: {istZeit}</div></p>
                                <div className="text-center">
                                    <ProgressBar width="100%" colorShift={false} fillColor={fillColorArray(prozentSatz)} percent={prozentSatz} />
                                </div>
                                <p>Prozent: {prozent}</p>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
        else{
            return(
                <>
                <Layout />
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>

                    <br />
                    
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary" onClick={() => { {navigate("/start");} } }>Zurück zu start</button>
                    </div>
                </>
            )
        }
    }
}
export default Statistiken