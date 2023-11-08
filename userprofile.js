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

function UserProfile(){
    document.title = "Mitarbeiter-Profil";

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
        1 : ["Erfolgreich", "#60c860"],
        2 : ["Erfolgreich registriert", "#60c860"],
        4 : ["Falsches Passwort", "red"],
        8 : ["Ungültiger Zugang - Bitte anmelden!", "red"],
        16 : ["Ungültige Eingaben", "red"],
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
    const [userSectionID, setUserSectionID] = useState();
    const [userHours, setUserHours] = useState();

    /* User-Daten Variablen */
    const [eUserID, seteUserID] = useState();
    const [eUserEmail, seteUserEmail] = useState();
    const [eUserFirstname, seteUserFirstname] = useState();
    const [eUserLastname, seteUserLastname] = useState();
    const [eUserSection, seteUserSection] = useState();
    const [eUserSectionID, seteUserSectionID] = useState();
    const [eUserHours, seteUserHours] = useState();

    /* Fehler Variable */
    const [error, setError] = useState();
    const [formError, setFormError] = useState();

    /* Admin-Funktion für User */
    const [editName, setEditName] = useState();
    const [editID, setEditID] = useState();

    const [allSections, setSectionData] = useState([]);
    
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
            params.append('getSections', 1);

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

                if(typeof data === 'object'){
                    /* Statuscode */
                    var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);

                    /* Objekt aus Benutzerdaten */
                    const userData = ((typeof data.userData != undefined && data.userData) ? data.userData : "");
                    const getUserSections = ((typeof data.sectionData != undefined && data.sectionData) ? data.sectionData : "");
                    

                    /* Fehlermeldung */
                    var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                    var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");
                    
                    console.log(outputTxt);

                    if(statusCode === SUCCESS){
                        if(typeof userData === 'object'){
                            if(userData.bezeichnung === "Personalwesen"){
                                /* User-Daten */
                                var id = ((typeof userData.id != undefined && userData.id) ? userData.id : "");
                                var email = ((typeof userData.email != undefined && userData.email) ? userData.email : "");
                                var firstname = ((typeof userData.vorname != undefined && userData.vorname) ? userData.vorname : "");
                                var lastname = ((typeof userData.name != undefined && userData.name) ? userData.name : "");
                                var section = ((typeof userData.bezeichnung != undefined && userData.bezeichnung) ? userData.bezeichnung : "");
                                var hours = ((typeof userData.stundenzahl != undefined && userData.stundenzahl) ? userData.stundenzahl : "");
                                
                                setUserID(id);
                                setUserEmail(email);
                                setUserFirstname(firstname);
                                setUserLastname(lastname);
                                setUserSection(section);
                                setUserHours(hours);

                                setSectionData(getUserSections);
                            }
                            else{
                                /* Kein Zugriff auf dieses Seite */
                                setError(errorTxt[NO_PERMISSION][0]);
                                
                                setTimeout(() => {
                                    navigate("/start");
                                }, 1000)
                            }
                        }
                        else{
                            /* Ungültige Daten vom Server */
                            setError(errorTxt[INVALID_RESPONSE][0]);
                        }
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
                var msgError = error.toJSON();
                
                console.log(errorReport);
                console.log(msgError);

                if(msgError.message != ""){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);
                }
            })
        }
    }

    /* Aktion nach Aufruf der Seite */
    useEffect(() => {
        checkPageAccess();
        getUserData();
    }, []);

    /** ToDo */
    function getUserData(){
        console.clear();

        const getUser  = async () => {
            /* POST-Anfrage - Parameter */
            const formObj = {
               "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
               "userID" : ((typeof localStorage.getItem("edUserID") != undefined && localStorage.getItem("edUserID")) ? localStorage.getItem("edUserID") : 0)
            }

           const postData = JSON.stringify(formObj);
           const params = new URLSearchParams();

           params.append('postData', postData);
           params.append('action', "getUserData");

           /* HTTP Config */
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

            if(typeof data === 'object'){
                /* Statuscode */
                var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);

                /* Objekt aus Benutzerdaten */
                const editUserData = ((typeof data.editUser != undefined && data.editUser) ? data.editUser : "");
                const sectionData = ((typeof data.sections != undefined && data.sections) ? data.sections : "");
                

                /* Fehlermeldung */
                var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");
                
                console.log(outputTxt);

                if(statusCode === SUCCESS){
                    if(typeof editUserData === 'object'){
                        /* User-Daten */
                        var id = ((typeof editUserData.id != undefined && editUserData.id) ? editUserData.id : "");
                        var email = ((typeof editUserData.email != undefined && editUserData.email) ? editUserData.email : "");
                        var firstname = ((typeof editUserData.vorname != undefined && editUserData.vorname) ? editUserData.vorname : "");
                        var lastname = ((typeof editUserData.name != undefined && editUserData.name) ? editUserData.name : "");
                        var section = ((typeof editUserData.bezeichnung != undefined && editUserData.bezeichnung) ? editUserData.bezeichnung : "");
                        var abteilungsID = ((typeof editUserData.abteilungs_id != undefined && editUserData.abteilungs_id) ? editUserData.abteilungs_id : "");
                        var hours = ((typeof editUserData.stundenzahl != undefined && editUserData.stundenzahl) ? editUserData.stundenzahl : "");
                        
                        seteUserID(id);
                        seteUserEmail(email);
                        seteUserFirstname(firstname);
                        seteUserLastname(lastname);
                        seteUserSection(section);
                        seteUserSectionID(abteilungsID);
                        seteUserHours(hours);
                    }
                    else{
                        /* Ungültige Daten vom Server */
                        setError(errorTxt[INVALID_RESPONSE][0]);
                    }
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

                if(msgError.message != ""){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);
                }

                console.log(errorReport);
                console.log(msgError);
           })
       }
       getUser();
       
       setEditID((typeof localStorage.getItem("edUserID") != undefined && localStorage.getItem("edUserID")) ? localStorage.getItem("edUserID") : 0);
       setEditName((typeof localStorage.getItem("edUserName") != undefined && localStorage.getItem("edUserName")) ? localStorage.getItem("edUserName") : "");
       
       localStorage.setItem("edUserID", "");
       localStorage.setItem("edUserName", "");
    }
    
    
    function saveData(){
        var userUpdateID            = ((typeof $('#inputID').val() != undefined && $('#inputID').val()) ? $('#inputID').val() : "");
        var userUpdateFirstname     = ((typeof $('#inputFirstname').val().trim() != undefined && $('#inputFirstname').val().trim()) ? $('#inputFirstname').val().trim() : "");
        var userUpdateLastname      = ((typeof $('#inputLastname').val().trim() != undefined && $('#inputLastname').val().trim()) ? $('#inputLastname').val().trim() : "");
        var userUpdateEmail         = ((typeof $('#inputEmail').val().trim() != undefined && $('#inputEmail').val().trim()) ? $('#inputEmail').val().trim() : "");
        var userUpdatePassword      = ((typeof $('#userPass').val().trim() != undefined && $('#userPass').val().trim()) ? $('#userPass').val().trim() : "");
        var userUpdatePasswordAgain = ((typeof $('#userPassAgain').val().trim() != undefined && $('#userPassAgain').val().trim()) ? $('#userPassAgain').val().trim() : "");
        var userUpdateSection       = ((typeof $('#inputSection').find(':selected').val().trim() != undefined && $('#inputSection').find(':selected').val().trim()) ? $('#inputSection').find(':selected').val().trim() : "");
        var userUpdateHours         = ((typeof $('#rangeBar').val() != undefined && $('#rangeBar').val()) ? $('#rangeBar').val() : "");

        var saveMessage             = "";
        
        var saveEmail               = true;
        var savePassword            = true;
        var saveFirstname           = true;
        var saveLastname            = true;

        /* Fehlmeldung zurücksetzen */
        setFormError();

        if(userUpdatePassword != ""){
            if(userUpdateID > 0){
                if(userUpdatePassword != userUpdatePasswordAgain || userUpdatePassword.length < 8 || userUpdatePasswordAgain < 8){
                    saveMessage += "<p style='color:" + errorTxt[PASSWORD_NOT_CHANGED][1] + "'>" + errorTxt[PASSWORD_NOT_CHANGED][0] + "<p />";
                    savePassword = false;
                }
            }
            else{
                if(userUpdatePassword != userUpdatePasswordAgain || userUpdatePassword.length < 8 || userUpdatePasswordAgain < 8){
                    saveMessage += "<p style='color:red'>Ungültiges Passwort<p />";
                    savePassword = false;
                }
            }
        }

        if(userUpdateEmail != ""){
            if(userUpdateID > 0){
                if(!userUpdateEmail.includes("@") || (!userUpdateEmail.includes(".de") && !userUpdateEmail.includes(".com"))){
                    saveMessage += "<p style='color:" + errorTxt[EMAIL_NOT_CHANGED][1] + "'>" + errorTxt[EMAIL_NOT_CHANGED][0] + "<p />";
                    saveEmail = false;
                }
            }
            else{
                if(!userUpdateEmail.includes("@") || (!userUpdateEmail.includes(".de") && !userUpdateEmail.includes(".com"))){
                    saveMessage += "<p style='color:red'>Ungültige E-Mail<p />";
                    saveEmail = false;
                }
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
            "workerID" : (userUpdateID ? userUpdateID : 0),
            "workerFirstname" : (saveFirstname && userUpdateFirstname != "") ? userUpdateFirstname : "",
            "workerLastname" : (saveLastname && userUpdateLastname != "") ? userUpdateLastname : "",
            "workerEmail" : (saveEmail && userUpdateEmail != "") ? userUpdateEmail : "",
            "workerPassword" : (savePassword && userUpdatePassword != "" && userUpdatePassword.length > 7) ? sha256(userUpdatePassword).toString() : "",
            "workerHours" : userUpdateHours,
            "workerSection" : userUpdateSection
        }
        const postData = JSON.stringify(formObj);
        
        const params = new URLSearchParams();
        params.append('postData', postData);

        if(userUpdateID > 0){
            params.append('action', "updateWorkerData");
        }
        else{
            params.append('action', "createWorker");
        }

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

            $('#inputEmail').css("border", "");

            if(statusCode == FAILED){
                if(userUpdateID > 0){
                    /* Ausgabe der Meldung */
                    $('#messageField').css("color", "orange");
                    $('#messageField').html("Es wurde nichts geändert!<br />" + saveMessage);
                }
            }
            else{
                /* Ausgabe der Meldung */
                $('#messageField').css("color", outputColor);
                $('#messageField').html(outputTxt+"<br />" + saveMessage);

                if(statusCode == USER_EXISTING){
                    $('#inputEmail').css("border", "1px solid red");
                }
            }

            
            if(statusCode == REGISTERED || statusCode == USER_UPDATED){
                setTimeout(function() {
                    navigate('/benutzerverwaltung');
                }, 2000);
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
                seteUserFirstname(value);
            break;

            case "lastname":
                seteUserLastname(value);
            break;

            case "email":
                seteUserEmail(value);
            break;

            case "hours":
                seteUserHours(value);
                
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

            case "sectionid":
                seteUserSectionID(value);
            break;
        }
    }

    if(typeof error != undefined && error){
        return(
            <>
                <Layout />
                <div className="userInfo"><b>{(userEmail) ? 'Angemeldet als: ' + userEmail + " (" + userFirstname + " " + userLastname + ")" : ""}</b></div>
                <div className="p-5 text-center">
                    <h4 className="mb-3">{error}</h4>
                    
                    Kontakt: <a href="mailto:it.support@modelcarworld.de">it.support@modelcarworld.de</a>
                    
                    <br /><br />
                        
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary" onClick={ () => { {navigate("/start");} } }>Zurück zu start</button>
                    </div>

                </div>
            </>
        )
    }
    else{
        if((typeof allSections === 'object' && allSections)){

            return(
                <>                   
                    <NavigationBar />
                    <Layout />
                    
                    <div id="profileBox" className="container mx-auto border rounded"> 
                    
                        <div className="row">
                            <div className="row">
                                {
                                    (() => {
                                        if(editID){
                                            return(
                                                <p className="smallHeaderHomepage">Mitarbeiter bearbeiten</p>
                                            )
                                        }
                                        else{
                                            return(
                                                <p className="smallHeaderHomepage">Mitarbeiter</p>
                                            )
                                        }
                                    })()
                                }
                            </div>
                        
                            <div className="w-100 spaceField"></div>
                            
                            <div className="">
                                
                                <div className="row">
                                    
                                    <div className="col">
                                        <label>Mitarbeiter ID</label>
                                    </div>

                                    <div className="col">
                                        <input className="form-control" type="text" name="inputID" id="inputID" value={(editID) ? editID : ""} />
                                    </div>

                                </div>

                            </div>
                            
                            <div className="w-100 spaceField"></div>

                            <div className="">

                                <label>Vorname</label>
                                    <input type="text" className="form-control" placeholder="Vorname" onChange={ (e) => { {handler("firstname", e.target.value);} } } id="inputFirstname" value={eUserFirstname} />

                                <div className="spaceInput"></div>
                                
                                <label>Nachname</label>
                                    <input type="text" className="form-control" placeholder="Nachname" onChange={ (e) => { {handler("lastname", e.target.value);} } } id="inputLastname" value={eUserLastname} />

                            </div>

                            <div className="w-100 spaceField"></div>

                            <div className="">

                                <label>E-Mail</label>
                                    <input type="email" className="form-control" placeholder="E-Mail" aria-label="E-Mail" aria-describedby="basic-addon1" id="inputEmail" onChange={ (e) => { {handler("email", e.target.value);} } }value={eUserEmail} />
                                
                                <div className="spaceInput"></div>
                                
                                <label>Passwort</label>
                                    <input type="password"  className="form-control" placeholder="***** (min. 8 Zeichen)" aria-label="userPass" id="userPass" onChange={ (e) => { {handler("pass1", e.target.value);} } } />

                                <div className="spaceInput"></div>

                                <label>Passwort wiederholen</label>
                                    <input type="password"  className="form-control" placeholder="***** (min. 8 Zeichen)" aria-label="userPassAgain" id="userPassAgain" onChange={ (e) => { {handler("pass2", e.target.value);} } } />

                            </div>

                            <div className="w-100 spaceField"></div>

                            <div className="">

                                <label>Stundenanzahl</label>
                                    <input type="range" className="form-range" min="4" max="8" step="1" id="rangeBar" name="rangeBar" onChange={ (e) => { {handler("hours", e.target.value);} } } value={eUserHours} /><span id="hours">{(eUserHours) ? eUserHours : 6}</span>

                            </div>

                            <div className="w-100 spaceField"></div>


                            <div className="">
                                <select className="form-select" id="inputSection" onChange={ (e) => { {handler("sectionid", e.target.value);} } } value={eUserSectionID} name="inputSection">
                                    /* Abteilungen */
                                    {
                                        (Array.isArray(allSections) && allSections.length > 0)
                                        ?
                                            allSections.map(section => {
                                                return(<option value={section.id}>{section.bezeichnung}</option>);
                                            })
                                        :
                                            <option value="5">Buchaltung</option>
                                    }
                                </select>
                            </div>

                            <div className="w-100 spaceField"></div>

                            <div id="messageField">{formError}</div>
                            
                            <div>

                                <div className="row">
                                    <div className="col-7"></div>

                                    <div className="col-4">
                                        <button className="btn btn-primary" name="updateProfile" id="updateProfile" onClick={ () => { {saveData();} } }>Speichern</button>
                                    </div>
                                </div>
                                
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
                        <button className="btn btn-primary" onClick={ () => { {navigate("/start");} } }>Zurück zu start</button>
                    </div>
                </>
            )
        }
    }
}
export default UserProfile