/* Style */
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Alert, Breadcrumb, Card, Form} from 'bootstrap';

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

function Profile(){
    document.title = "Benutzerprofil";

    /* Server Adresse */
    const baseUrl = "https://" + window.location.hostname + "/zeiterfassungsserver/server.php"; 
    
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
    const [userID, setUserID]                   = useState();
    const [userEmail, setUserEmail]             = useState();
    const [userFirstname, setUserFirstname]     = useState();
    const [userLastname, setUserLastname]       = useState();
    const [userSection, setUserSection]         = useState();
    const [userHours, setUserHours]             = useState();
    const [sectionArray, setSectionArray]       = useState([]);
    
    /* Fehler Variablen */
    const [error, setError]                      = useState();
    const [formError, setFormError]              = useState();

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
                    /* Objekt Serverantwort */
                    const data = ((typeof serverResult.data != undefined && serverResult.data) ? serverResult.data : 0);

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
    }, []);
    

    function saveData(){
        var userUpdateID            = ((typeof $('#inputID').val() != undefined && $('#inputID').val()) ? $('#inputID').val() : "");
        var userUpdateFirstname     = ((typeof $('#inputFirstname').val().trim() != undefined && $('#inputFirstname').val().trim()) ? $('#inputFirstname').val().trim() : "");
        var userUpdateLastname      = ((typeof $('#inputLastname').val().trim() != undefined && $('#inputLastname').val().trim()) ? $('#inputLastname').val().trim() : "");
        var userUpdateEmail         = ((typeof $('#inputEmail').val().trim() != undefined && $('#inputEmail').val().trim()) ? $('#inputEmail').val().trim() : "");
        var userUpdatePassword      = ((typeof $('#userPass').val().trim() != undefined && $('#userPass').val().trim()) ? $('#userPass').val().trim() : "");
        var userUpdatePasswordAgain = ((typeof $('#userPassAgain').val().trim() != undefined && $('#userPassAgain').val().trim()) ? $('#userPassAgain').val().trim() : "");
        var userUpdateHours         = ((typeof $('#rangeBar').val() != undefined && $('#rangeBar').val()) ? $('#rangeBar').val() : 8);

        var saveMessage             = "";
        
        var saveEmail               = true;
        var savePassword            = true;
        var saveFirstname           = true;
        var saveLastname            = true;

        /* Fehlmeldung zurücksetzen */
        setFormError();

        if(userUpdatePassword != ""){
            if(userUpdatePassword != userUpdatePasswordAgain){
                saveMessage += "<p style='color:" + errorTxt[PASSWORD_NOT_CHANGED][1] + "'>" + errorTxt[PASSWORD_NOT_CHANGED][0] + "<p />";
                savePassword = false;
            }
        }

        if(!userUpdateEmail != ""){
            if(!userUpdateEmail.includes("@") || (!userUpdateEmail.includes(".com") && !userUpdateEmail.includes(".de"))){
                saveMessage += "<p style='color:" + errorTxt[EMAIL_NOT_CHANGED][1] + "'>" + errorTxt[EMAIL_NOT_CHANGED][0] + "<p />";
                saveEmail = false;
            }
        }

        if(userUpdateFirstname.trim() === ""){
            saveFirstname = false;
        }

        if(userUpdateLastname.trim() === ""){
            saveLastname = false;
        }

        /* POST-Anfrage - Parameter */
        const formObj = {
            "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            "userID" : userUpdateID,
            "userFirstname" : (saveFirstname && userUpdateFirstname != "") ? userUpdateFirstname : "",
            "userLastname" : (saveLastname && userUpdateLastname != "") ? userUpdateLastname : "",
            "userEmail" : (saveEmail && userUpdateEmail != "") ? userUpdateEmail : "",
            "userPassword" : (savePassword && userUpdatePassword != "" && userUpdatePassword.length > 7) ? sha256(userUpdatePassword).toString() : "",
            "userHours" : userUpdateHours
        }
        const postData = JSON.stringify(formObj);
        
        const params = new URLSearchParams();

        params.append('postData', postData);
        params.append('action', "updateUserData");

        /* HTTP Config */
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
            /* Objekt - Serverantwort */
            const data = ((typeof serverResult.data != undefined && serverResult.data) ? serverResult.data : "");
            
            console.log(serverResult);
            console.log(data);

            /* Statuscode */
            var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);

            /* Fehlermeldung */
            var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
            var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");
            
            console.log(outputTxt);
            
            $('#inputEmail').css("border", "");

            if(statusCode == FAILED){
                $('#messageField').css("color", "orange");
                $('#messageField').html("Es ist nicht bearbeitet worden<br />" + saveMessage);
            }
            else{
                /* Ausgabe der Meldung */
                $('#messageField').css("color", outputColor);
                $('#messageField').html(outputTxt + "<br />" + saveMessage);

                if(statusCode == USER_EXISTING){
                    $('#inputEmail').css("border", "1px solid red");
                }
            }
        })
        .catch(function(errorReport){
            /* Fehlermeldung der Anfrage */
            var msgError = errorReport.toJSON();
            
            console.log(errorReport);
            console.log(msgError);

            if(msgError.message != ""){
                console.log(msgError.message + "(" + SERVER_ERROR + ")");
                setFormError(msgError.message);
            }
        })

        /* Spinner + Nachricht */
        $('#messageField').html("<div className='spinner-border' style='width: 2rem; height: 2rem;color:green' role='status'><span className='visually-hidden'>Loading...</span></div>");
        $('#messageField').html(saveMessage);
    }

    function handler(variable, value){
        switch(variable){

            case "firstname":
                setUserFirstname(value);
            break;

            case "lastname":
                setUserLastname(value);
            break;

            case "email":
                setUserEmail(value);
            break;

            case "hours":
                setUserHours(value);
                
                var num = ((typeof $('#rangeBar').val() != undefined && $('#rangeBar').val()) ? $('#rangeBar').val() : 4);
                $('#hours').html(num);

            break;

            case "pass1":
                if(value.length > 7){
                    $('#userPass').css("border", "1px solid green");
                }
                else{
                    $('#userPass').css("border", "1px solid red");
                }

                if($('#userPassAgain').val() != ""){
                    if(value != $('#userPassAgain').val()){
                        $('#userPassAgain').css("border", "1px solid red");
                    }
                    else{
                        $('#userPassAgain').css("border", "1px solid green");
                    }
                }

            break;
            
            case "pass2":
                if(value.length > 7 && value == $('#userPass').val()){
                    $('#userPassAgain').css("border", "1px solid green");
                }
                else{
                    $('#userPassAgain').css("border", "1px solid red");
                }
            break;
        }
    }
    const backLink = window.location.hostname;

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
        if(typeof userID != undefined && userID){

            return(
                <>
                    <NavigationBar />
                    <Layout />
                    
                    <div id="profileBox" className="container mx-auto border rounded">
                        <div className="row">
                            
                            <div className="">
                                
                                <div className="row">
                                    
                                    <div className="col">
                                        <label>Mitarbeiter ID</label>
                                    </div>

                                    <div className="col">
                                        <input className="form-control" type="text" name="inputID" id="inputID" value={userID} disabled />
                                    </div>

                                </div>

                            </div>
                            
                            <div className="w-100 spaceField"></div>

                            <div className="">

                                <label>Vorname</label>
                                    <input type="text" className="form-control" placeholder="Vorname" id="inputFirstname" onChange={(e) => { {handler("firstname", e.target.value);} } } value={userFirstname} />

                                <div className="spaceInput"></div>
                                
                                <label>Nachname</label>
                                    <input type="text" className="form-control" placeholder="Nachname" id="inputLastname" onChange={(e) => { {handler("lastname", e.target.value);} } } value={userLastname} />

                            </div>

                            <div className="w-100 spaceField"></div>

                            <div className="">

                                <label>E-Mail</label>
                                    <input type="email" className="form-control" placeholder="E-Mail" aria-label="E-Mail" aria-describedby="basic-addon1" id="inputEmail" onChange={(e) => { {handler("email", e.target.value);} } } value={userEmail} />
                                
                                <div className="spaceInput"></div>
                                
                                <label>Passwort</label>
                                    <input type="password"  className="form-control" placeholder="***** (min. 8 Zeichen)" aria-label="userPass" id="userPass" onChange={(e) => { {handler("pass1", e.target.value);} } } />

                                <div className="spaceInput"></div>

                                <label>Passwort wiederholen</label>
                                    <input type="password"  className="form-control" placeholder="*****" aria-label="userPassAgain" id="userPassAgain" onChange={(e) => { {handler("pass2", e.target.value);} } } />

                            </div>

                            <div className="w-100 spaceField"></div>

                            <div className="">

                                <label>Stundenanzahl</label>
                                    <input type="range" className="form-range" min="4" max="8" step="1" onChange={(e) => { {handler("hours", e.target.value);} } } value={userHours} id="rangeBar" name="rangeBar" /><span id="hours">{userHours}</span>

                            </div>

                            <div className="w-100 spaceField"></div>


                            <div className="">
                                <label title="Abteilung wird vom Personalwesen zugewiesen!">Abteilung: {userSection}</label>
                            </div>

                            <div className="w-100 spaceField"></div>

                            <div id="messageField">{formError}</div>
                            
                            <div>

                                <div className="row">
                                    <div className="col-7"></div>
                                    <div className="col-4"><input className="btn btn-primary" type="button" name="updateProfile" id="updateProfile" value="Speichern" onClick={() => { {saveData();} } }/></div>
                                </div>
                                
                            </div>

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
}
export default Profile