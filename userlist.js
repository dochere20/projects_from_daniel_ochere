/* Style */
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Alert, Breadcrumb, Card, Form} from 'bootstrap';

/* Icons */
import {Lock, LockOpen, Calendar, Pencil, UserPlus} from "@phosphor-icons/react";

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

function Userlist(){
    document.title = "Benutzerverwaltung";

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
    const [allSections, setSectionArray] = useState([]);

    /* User Variable */
    const [allUsersArray ,setAllUsersArray] = useState([]);
    
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

                    /* Objekt aus Benutzerdaten & Arbeitszeiten */
                    const userData = ((typeof data.userData != undefined && data.userData) ? data.userData : []);
                    const userTime = ((typeof data.userTime != undefined && data.userTime) ? data.userTime : []);
                    const getUserSections = ((typeof data.sectionData != undefined && data.sectionData) ? data.sectionData : []);


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

                                setSectionArray(getUserSections);
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
        getAllUsers();
    }, []);
    
    function getAllUsers() {
        const allUsers  = async () => {
            /* POST-Anfrage - Parameter */
            const formObj = {
                "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            }

            const postData = JSON.stringify(formObj);
            const params = new URLSearchParams();

            params.append('postData', postData);
            params.append('action', "getAllUsers");

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

                    /* Objekt aus Benutzerdaten & Arbeitszeiten */
                    const usersObj = ((typeof data.users != undefined && data.users) ? data.users : "");

                    /* Fehlermeldung */
                    var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                    var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                    console.log(outputTxt);
                     
                    if(statusCode === SUCCESS){
                        if(typeof usersObj === 'object'){
                            setAllUsersArray(usersObj);
                        }
                        else{
                            /* Ungültige Daten vom Server */
                            setError(errorTxt[INVALID_RESPONSE][0]);
                            console.log(errorTxt[INVALID_RESPONSE][0]);
                        }
                    }
                    else{
                        setError(errorTxt[statusCode][0]);
                        
                        setTimeout(() => {
                            navigate("/start");
                        }, 1000)
                    }
                }
                else{
                    /* Ungültige Daten vom Server */
                    setError(errorTxt[INVALID_RESPONSE][0]);
                    console.log(errorTxt[INVALID_RESPONSE][0]);
                }
            })
            .catch(function(errorReport){
                /* Fehlermeldung der Anfrage */
                var msgError = errorReport.toJSON();

                if(msgError.message != ""){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);
                }
            })
        }
        allUsers();
    }
    
    function activateUser(userID){
        $('#sect_' + userID).removeClass("d-none");
    }

    function selectUserSection(value, userID, status){
        /* Benutzer aktivieren */
        const activate  = async () => {
            /* POST-Anfrage - Parameter */
            const formObj = {
                "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
                "userID" : userID,
                "userSection" : value,
                "uStatus" : ((status === 1) ? 0 : 1)
            }

            const postData = JSON.stringify(formObj);
            const params = new URLSearchParams();

            params.append('postData', postData);
            params.append('action', "activateUser");

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

                    /* Fehlermeldung */
                    var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                    var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                    console.log(outputTxt);

                    if(statusCode === SUCCESS){
                        getAllUsers();

                        if(status == 0){
                            $('#sect_' + userID).addClass("d-none");
                        }
                    }
                    else{
                        /* ToDo: Error */
                        $('#mainErrorMSG').removeClass('d-none');
                        
                        if(status == 0){
                            $('#mainErrorMSG').text("Mitarbeiter konnte nicht aktiviert werden!");
                        }
                        else{
                            $('#mainErrorMSG').text("Mitarbeiter konnte nicht gesperrt werden!");
                        }
                        
                        window.scrollTo({top: 0, behavior: 'smooth'});
                        
                        setTimeout(() => {
                            $('#mainErrorMSG').addClass('d-none');
                        }, 3000)
                }

                }
                else{
                    /* Ungültige Daten vom Server */
                    setError(errorTxt[INVALID_RESPONSE][0]);
                    console.log(errorTxt[INVALID_RESPONSE][0]);
                }
            })
            .catch(function(errorReport){
                /* Fehlermeldung der Anfrage */
                var msgError = errorReport.toJSON();

                if(msgError.message != ""){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);
                }
            })
        }
        activate();
    }

    function viewUserTimes(userID, userName){
        localStorage.setItem("showUserTime", userID);
        localStorage.setItem("showUserName", userName);

        navigate("/arbeitszeiten");
    }

    function editUser(userID, userName){
        localStorage.setItem("edUserID", userID);
        localStorage.setItem("edUserName", userName);

        navigate("/userprofile");
    }

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
        if(((typeof userID != undefined && userID) && (typeof allUsersArray === 'object' && allUsersArray))){

           /* {(() => { })()} */

            return(
                <>
                    <NavigationBar />
                    <Layout />
                    
                    <div id={"mainSuccessMSG"} className="alert alert-success text-center d-none" role="alert"></div>
                    <div id={"mainErrorMSG"} className="alert alert-danger text-center d-none" role="alert"></div>
                    
                    <h1 className="text-center">Benutzerverwaltung</h1>
                    
                    <button onClick={() => { {navigate("/userprofile")} } } className="btn btn-primary" type="button"><span><UserPlus></UserPlus></span> Neuen Benutzer anlegen</button>
                    

                    
                    <div className="h-100 d-flex align-items-center justify-content-center usersTableBox">
                        
                        <table className="table table-hover">
                            <thead className="userTableHeader">
                                <th className="userTableHead">Mitarbeiter ID</th>
                                <th className="userTableHead">Name</th>
                                <th className="userTableHead">Nachname</th>
                                <th className="userTableHead">E-Mail</th>
                                <th className="userTableHead">Abteilung</th>
                                <th className="userTableHead">Stundenzahl</th>
                                <th className="userTableHead">Aktiviert</th>
                                <th className="userTableHead"></th>
                            </thead>

                            <tbody>
                                {
                                    (() => {
                                        /* Nur ein User (aktuelle User) */
                                        if(allUsersArray.length == 1){
                                            return(
                                                <tr>
                                                    <td colSpan="8" className="text-center">Leer</td>
                                                </tr>
                                            )
                                        }
                                    })()
                                }

                                {
                                    allUsersArray.map(x => {
                                        if(x.id != userID)
                                        return(
                                            <tr>
                                                <td className="userTableCells">{x.id}</td>
                                                <td className="userTableCells">{x.vorname}</td>
                                                <td className="userTableCells">{x.name}</td>
                                                <td className="userTableCells">{x.email}</td>
                                                <td className="userTableCells">{(x.abteilungsID === 0) ? "Nicht zugewiesen" : x.bezeichnung}</td>
                                                <td className="userTableCells">{x.stundenzahl}</td>
                                                <td className="userTableCells">{(x.status) ? "✓" : "X"}</td>
                                                <td className="userTableCells">
                                                    <div className="" role="group" aria-label="Basic example">
                                                        <button type="button" onClick={() => editUser(x.id, x.vorname + " " + x.name) } className="btn btn-primary"><span title="Benutzer bearbeiten"><Pencil></Pencil></span> Benutzer bearbeiten</button><span> </span>
                                                        <button type="button" onClick={() => viewUserTimes(x.id, x.vorname + " " + x.name) } className="btn btn-primary"><span title="Arbeitszeiten ansehen"><Calendar></Calendar></span> Arbeitszeiten ansehen</button><br/><br />
                                                        <button type="button" onClick={() => (x.status == 0) ? activateUser(x.id) : selectUserSection(x.abteilungsID, x.id, x.status) } className={"btn " + ((x.status) ? "btn-danger" : "btn-success")} >{(x.status) ? <span title="Benutzer sperren"><Lock></Lock></span> : <span title="Benutzer aktivieren"><LockOpen></LockOpen></span> }</button>
                                                        <p></p>
                                                        <select className="form-select d-none" onChange={(e) => selectUserSection(e.target.value, e.target.getAttribute("data-uID"), e.target.getAttribute("data-status"))} data-uID={x.id} data-status={x.status} name={"sect_" + x.id} id={"sect_" + x.id}>
                                                            {
                                                                (Array.isArray(allSections)) 
                                                                ?                                                                            
                                                                    allSections.map(section => {
                                                                        return(
                                                                            <>          
                                                                                <option value={section.id}>{section.bezeichnung}</option>
                                                                            </>
                                                                        )
                                                                    })
                                                                :
                                                                    <>
                                                                        <option value="5">Buchaltung</option>
                                                                        <option value="7">Einkauf</option>
                                                                    </>
                                                            }
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                )}
                            </tbody>
                        </table>

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
export default Userlist