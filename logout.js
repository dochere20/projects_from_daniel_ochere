/* Style */
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Alert, Breadcrumb, Card, Form} from 'bootstrap';

/* React */
import React, {Component} from 'react';
import {useState, useEffect} from "react";

/* JQuery */
import $ from "jquery";

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

function Logout(){
    document.title = "Loggin Out...";

    /* Funktion zum Navigieren der Seiten */
    const navigate = useNavigate();

    /* Server Adresse */
    const baseUrl = "https://" + window.location.hostname + "/zeiterfassungsserver/server.php"; 

    /* Server Fehlermeldung */
    const[error, setError] = useState();
     
    /* Server-Antwort Konstanten */
    const FAILED                    = 0;
    const SUCCESS                   = 1;
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

    /* Fehlertexte */
    const errorTxt = {
        0 : ["Fehler aufgetreten", "red"],
        1 : ["Erfolgreich", "#60c860"],
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
        8192 : ["Sie haben leider keine Berechtigung für diese Aktion!", "red"]
    }

    function logOutCurrentUser(){
        var lCode = ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : "");

        if(lCode.trim() === ""){
            /* Benutzer bereits abgemeldet */
            navigate("/login");
        }
        else{
            /* prüfe Benutzerdaten vom Server */
            const formObj = {
                "lCode" : lCode,
            }

            const postData = JSON.stringify(formObj);
            const params = new URLSearchParams();

            params.append('postData', postData);
            params.append('action', "logoutUser");

            let axiosConfig = {
                headers: {
                    'Content-Type' : 'application/json; charset=UTF-8',
                    'Accept' : 'Token',
                    "Access-Control-Allow-Origin" : "*",
                }
            };
    
            const serverResult = axios({
                method: 'post',
                url: baseUrl,
                headers: axiosConfig,
                data: params
            })
            .then(function(serverResult){
                console.log(serverResult);

                /* LoginCode aus Session löschen */
                localStorage.setItem("user", "");    
                
                navigate("/login");
                console.clear();
            })
            .catch(function(errorReport){
                /* Fehlermeldung der Anfrage */
                var msgError = errorReport.toJSON();

                console.log(errorReport);
                console.log(msgError);

                if(msgError.message != ""){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);

                    localStorage.setItem("user", "");

                    /* Fehlerausgabe fürs Login-Formular */
                    localStorage.setItem("loginMSG", msgError.message);

                    navigate("/login");
                }
            })
        }
        var loginMSG = ((typeof localStorage.getItem("loginMSG") != undefined && localStorage.getItem("loginMSG")) ? localStorage.getItem("loginMSG") : "");
        localStorage.clear();
        
        if(loginMSG != ""){
            localStorage.setItem("loginMSG", loginMSG);
        }
    }
    
    /* Aktion nach Aufruf der Seite */
    useEffect(() => {
        logOutCurrentUser();
    }, []);


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
export default Logout