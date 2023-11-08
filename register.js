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
import Layout from "../parts/layout"

function Register(){
    document.title = "Registrieren";

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

    const INACTIVE_USER             = 999;

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
        8192 : ["Sie haben leider keine Berechtigung für diese Aktion!", "red"],
        999 : ["Dieser Benutzer muss von einem Admin freigeschaltet werden!", "red"]
    }
    
    function checkPageAccess(){
        /* Zugriffsberechtigung prüfen */
        const user = ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : "");
        
        if(user != ""){
            /* Benutzer bereits angemeldet */
            navigate("/start");
        }
    }

    function registerUser(){
        var regEmailTxt         = ((typeof $('#regEmail').val() != undefined && $('#regEmail').val()) ? $('#regEmail').val() : "");
        var regPassTxt          = ((typeof $('#regPassword').val() != undefined && $('#regPassword').val()) ? $('#regPassword').val() : "");
        var regPassAgainTxt     = ((typeof $('#regPasswordAgain').val() != undefined && $('#regPasswordAgain').val()) ? $('#regPasswordAgain').val() : "");

        if(regEmailTxt === "" || !regEmailTxt.includes("@") || !regEmailTxt.includes(".")){
            $('#errorMsgRegister').html("Bitte eine gültige E-Mail eingeben");
            $('#errorMsgRegister').show();
        }
        else{
            if(regPassTxt === "" || regPassTxt != regPassAgainTxt || regPassTxt.length < 8){
                
                if(regPassTxt === "" || regPassAgainTxt === ""){
                    $('#errorMsgRegister').html("Bitte Passwörter eingeben");
                }
                else{
                    if(regPassTxt.length < 8){
                        $('#errorMsgRegister').html("Die Passwörter muss mindestens 8 Zeichen lang sein");
                    }
                    else{
                        $('#errorMsgRegister').html("Die angegebenen Passwörter stimmen nicht überein");
                    }
                }
                $('#errorMsgRegister').show();
            }
            else{
                /* Anfrage an Server senden */
                $('#errorMsgRegister').html("<div className='spinner-border' style='width: 2rem; height: 2rem;color:green' role='status'><span className='visually-hidden'>Loading...</span></div>");
                
                var ecryptedPass = sha256(regPassTxt);
                
                /* POST-Anfrage - Parameter */
                const formObj = {
                    "regEmail" : regEmailTxt,
                    "regPassword" : ecryptedPass.toString(),
                }
                const postData = JSON.stringify(formObj);
        
                const params = new URLSearchParams();

                params.append('postData', postData);
                params.append('action', "register");

                /* HTTP Config */
                let axiosConfig = {
                    headers: {
                        'Content-Type' : 'application/json; charset=UTF-8',
                        'Accept' : 'Token',
                        "Access-Control-Allow-Origin" : "*",
                    }
                };
    
                /* Fehlermeldung zurücksetzen */
                setError();

                const serverResult = axios({
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
                        /* Statuscode & LoginCode */
                        var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
                        var lCode = ((typeof data.lcode != undefined && data.lcode) ? data.lcode : "");
                        
                        /* Fehlermeldung */
                        var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                        var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");
                        
                        console.log(outputTxt);
                        
                        if(statusCode === REGISTERED){
                            localStorage.setItem("loginMSG", outputTxt);
                            navigate("/login");
                            
                        }
                        else{
                            /* Ausgabe der Meldung */
                            $('#errorMsgRegister').css('color', outputColor);
                            $('#errorMsgRegister').html(outputTxt);
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
        }
    }

    /* Aktion nach Aufruf der Seite */
    useEffect(() => {
        checkPageAccess();
    }, []);

    function handler(inputfield, value){
        switch(inputfield){

            case "email":
                if(value.includes("@") && (value.includes(".com") || value.includes(".de"))){
                    $('#regEmail').css("border", "1px solid green");
                }
                else{
                    $('#regEmail').css("border", "1px solid red");
                }
                break;

            case "pass1":
                if(value.length > 7){
                    $('#regPassword').css("border", "1px solid green");
                }
                else{
                    $('#regPassword').css("border", "1px solid red");
                }
                
                break;

            case "pass2":
                if(value.length > 7 && value == $('#regPassword').val()){
                    $('#regPasswordAgain').css("border", "1px solid green");
                }
                else{
                    $('#regPasswordAgain').css("border", "1px solid red");
                }
                
                break;
        }
    }

    return(
        <>
        <Layout />
            <div id="registerBox" className="container-md mx-auto border rounded text-center">
                <form className="register" id="formRegister" method="post">
                    <fieldset>
                        <legend>Registrieren</legend>
                            <div className="row row-cols-1">

                                <div className="col">

                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="basic-addon1">@</span>
                                        <input type="email" className="form-control" placeholder="E-Mail" aria-label="email" aria-describedby="basic-addon1" name="regEmail" id="regEmail" onChange={ (e) => { { handler("email", e.target.value); } } } />
                                    </div>

                                </div>

                                <div className="col">

                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="basic-addon1">🔒</span>
                                        <input type="password" className="form-control" placeholder="*****" aria-label="passwort" aria-describedby="basic-addon1" name="regPassword" id="regPassword" onChange={ (e) => { { handler("pass1", e.target.value); } } } />
                                    </div>

                                </div>

                                
                                <div className="col">

                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="basic-addon1">🔒</span>
                                        <input type="password" className="form-control" placeholder="*****" aria-label="passwortwiederholen" aria-describedby="basic-addon1" name="regPasswordAgain" id="regPasswordAgain" onChange={ (e) => { { handler("pass2", e.target.value); } } }  />
                                    </div>

                                </div>

                                <div className="col">
                                    <div className="errorMsg" id="errorMsgRegister">{error}</div>
                                </div>

                                <div className="col">
                                
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        
                                        <button className="btn btn-primary" type="button" name="backToLogin" id="backToLogin" onClick={() => { {navigate("/login");} } }>Zurück zum Login</button>
                                        <button className="btn btn-primary" type="button" name="register" id="register" onClick={() => { {registerUser();} } }>Jetzt Registrieren</button>

                                    </div>
                                    
                                </div>
                            </div>
                    </fieldset>
                </form>
            </div>
        </>
    )
}
export default Register