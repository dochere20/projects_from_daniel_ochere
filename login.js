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

function Login(){
    document.title = "Login";
     
    /* Funktion zum Navigieren der Seiten */
    const navigate = useNavigate();

    /* Server Adresse */
    const baseUrl = "https://" + window.location.hostname + "/zeiterfassungsserver/server.php"; 

    /* Login Meldung */
    const [loginMSG, setMSG] = useState();
    
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
        8 : ["Keinen Benutzer gefunden", "red"],
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
        const message = ((typeof localStorage.getItem("loginMSG") != undefined && localStorage.getItem("loginMSG")) ? localStorage.getItem("loginMSG") : "");

        if(user != ""){
            /* Benutzer bereits angemeldet */
            navigate("/start");
        }

        if(message != ""){
            /* Login-Nachricht aus anderen Seiten übernehmen */
            
            setMSG(message);
            localStorage.setItem("loginMSG", "");

            if(message == "Erfolgreich registriert"){
                $('#errorMsgLogin').css('color', "green");
            }
        }
    }

    function login(){
        /* Eingabewerte: Email und Passwort */
        var emailTxt    = ((typeof $('#inputEmail').val() != undefined && $('#inputEmail').val()) ? $('#inputEmail').val() : "");
        var passTxt     = ((typeof $('#inputPassword').val() != undefined && $('#inputPassword').val()) ? $('#inputPassword').val() : "");
        
        $('#errorMsgLogin').css('color', "red");

        if(emailTxt === "" || !emailTxt.includes("@") || !emailTxt.includes(".")){
            $('#errorMsgLogin').html("Bitte eine gültige E-Mail eingeben");
        }
        else{
            if(passTxt === ""){
                $('#errorMsgLogin').html("Bitte Passwort eingeben");
            }
            else{
                $('#errorMsgLogin').html("<div className='spinner-border' style='width: 2rem; height: 2rem;color:green' role='status'><span className='visually-hidden'>Loading...</span></div>");
                
                /* Encrypt Password */
                var ecryptedPass = sha256(passTxt);

                /* POST-Anfrage - Parameter */
                const formObj = {
                    "loginEmail" : emailTxt,
                    "loginPass" : ecryptedPass.toString()
                }
                const postData = JSON.stringify(formObj);

                const params = new URLSearchParams();

                params.append('postData', postData);
                params.append('action', "login");

                console.log(params);
                
                let axiosConfig = {
                    headers: {
                        'Content-Type' : 'application/json; charset=UTF-8',
                        'Accept' : 'Token',
                        "Access-Control-Allow-Origin" : "*",
                    }
                };

                const serverResult1 = axios({
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
                        /* Statuscode & Login-Code */
                        var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
                        var lCode = ((typeof data.lCode != undefined && data.lCode) ? data.lCode : "");
                        
                        /* Fehlermeldung */
                        var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                        var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                        console.log(outputTxt);

                        /* Ausgabe der Meldung */
                        $('#errorMsgLogin').css('color', outputColor);
                        $('#errorMsgLogin').html(outputTxt);

                        if(statusCode === SUCCESS){
                            if(lCode != ""){
                                localStorage.setItem("user", lCode);
                                console.log(lCode);
                                navigate("/start");
                            }
                            else{
                                navigate("/start");
                            }
                        }
                        else{
                            /* Ungültige Daten vom Server */
                            $('#errorMsgLogin').css('color', outputColor);
                            $('#errorMsgLogin').html(outputTxt);
                        }
                    }
                    else{
                        /* Ungültige Daten vom Server */
                        $('#errorMsgLogin').css('color', errorTxt[INVALID_RESPONSE][1]);
                        $('#errorMsgLogin').html(errorTxt[INVALID_RESPONSE][0]);
                    }
                })
                .catch(function(errorReport){
                    /* Fehlermeldung der Anfrage */
                    var msgError = errorReport.toJSON();
                    
                    console.log(errorReport);
                    console.log(msgError);

                    if(msgError.message != ""){
                        console.log(msgError.message + "(" + SERVER_ERROR + ")");
                        $('#errorMsgLogin').html(msgError.message);
                    }
                })
            }
        }
    }

    /* Aktion nach Aufruf der Seite */
    useEffect(() => {
        checkPageAccess();
    }, []);
    
    
    return( 
        <>
        <Layout />
            <div id="loginBox" className="container mx-auto border rounded text-center ">
                <form className="login" id="formLogin" method="post">
                    <fieldset>
                        <legend>Login</legend>
                            <div className="row row-cols-1">

                                <div className="col">

                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="basic-addon1">@</span>
                                        <input type="email" className="form-control" placeholder="E-Mail" aria-label="E-Mail" aria-describedby="basic-addon1" name="inputEmail" id="inputEmail" />
                                    </div>

                                </div>

                                <div className="col">

                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="basic-addon1">🔒</span>
                                        <input type="password" className="form-control" placeholder="*****" aria-label="E-Mail" aria-describedby="basic-addon1" name="inputPassword" id="inputPassword" />
                                    </div>

                                </div>
                                
                                <div className="col">
                                    <div className="errorMsg" id="errorMsgLogin">{loginMSG}</div>
                                </div>
                                
                                <div className="col">
                                
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">

                                        <input className="btn btn-primary" type="button" name="goToRegister" id="goToRegister" onClick={() => { {navigate("/register");} } } value="Registrieren" />
                                        <input className="btn btn-primary me-md-2" type="button" name="login" id="login" onClick={() => { {login();} } } value="Login" />
                                    
                                    </div>
                                    
                                </div>
                                
                            </div>
                    </fieldset>
                </form>
            </div>
        </>
    )
}
export default Login