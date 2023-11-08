/* Style */
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Alert, Breadcrumb, Card, Form} from 'bootstrap';

/* Icons */
import {User, List, Pencil, Trash, Calendar, CalendarPlus, SealCheck, Note, NotePencil, FileCsv} from "@phosphor-icons/react";

/* React */
import React, {Component} from 'react';
import {useState, useEffect} from "react";
import TimePicker from 'react-time-picker';

/* JQuery */
import $ from "jquery";

/* Axios*/
import axios from "axios";

/* CSV-Downloader */
import { CSVLink, CSVDownload } from "react-csv";

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

function Arbeitszeiten(){
    document.title = "Arbeitszeiten";

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
        1 : ["Erfolgreich", "green"],
        2 : ["Erfolgreich registriert", "green"],
        4 : ["Falsches Passwort", "red"],
        8 : ["Ungültiger Zugang - Bitte anmelden!", "red"],
        16 : ["Leeres Feld eingegeben", "red"],
        32 : ["Benutzer gefunden", "green"],
        64 : ["Benutzer ausgeloggt", "green"],
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

    /* Zeittabelle */
    const [timeArray, setTimeArray] = useState([]);
    
    /* Fehler Variablen */
    const [error, setError] = useState();

    /* Admin-Funktion für User */
    const [workerName, setWorkerName] = useState("");
    const [workerID, setWorkerID] = useState("");
    const [workerDayID, setWorkerDayID] = useState("");

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
                        "Access-Control-Allow-Origin": "*",
                    }
                };
        
                const serverResult = await axios({
                    method: 'post',
                    url: baseUrl,
                    /*headers: axiosConfig,*/
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
                        const userData = ((typeof data.userData != undefined && data.userData) ? data.userData : "");
                        const userTime = ((typeof data.userTime != undefined && data.userTime) ? data.userTime : "");

                        /* Fehlermeldung */
                        var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                        var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");
                        
                        console.log(outputTxt);

                        if(statusCode === SUCCESS){
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

                    if((typeof msgError.message != undefined && msgError.message)){
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
        getUserTime();
    }, []);

    function getUserTime(){

        const getTable  = async () => {
            /* POST-Anfrage - Parameter */
            const formObj = {
               "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
               "userID" : ((typeof localStorage.getItem("showUserTime") != undefined && localStorage.getItem("showUserTime")) ? localStorage.getItem("showUserTime") : 0),
               "tagID" : ((typeof localStorage.getItem("showBookings") != undefined && localStorage.getItem("showBookings")) ? localStorage.getItem("showBookings") : 0)
            }

           const postData = JSON.stringify(formObj);
           const params = new URLSearchParams();

           params.append('postData', postData);
           params.append('action', "getUserTime");

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
               /* Objekt Serverantwort & Zeittabelle */
               const data = ((typeof serverResult.data != undefined && serverResult.data) ? serverResult.data : []);
               const userT = ((typeof data.userTime != undefined && data.userTime) ? data.userTime : []);

               var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
               
                /* Fehlermeldung */
                var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

               console.log(serverResult);
               console.log(data);

                if(typeof data === 'object'){
                    /* Zeittabelle */
                    setTimeArray(userT);
                }
                else{
                    /* Ungültige Daten vom Server */
                    setError(errorTxt[INVALID_RESPONSE][0]);
                    console.log(errorTxt[INVALID_RESPONSE][0]);
                }

                if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                    localStorage.setItem("loginMSG", outputTxt);
                    navigate("/logout");
                }

                if(statusCode == NO_PERMISSION){
                    localStorage.setItem("showUserTime", "");
                    localStorage.setItem("showUserName", "");
                    localStorage.setItem("showBookings", "");
                    
                    navigate("/start");
                }
           })
           .catch(function(errorReport){
                /* Fehlermeldung der Anfrage */
                var msgError = errorReport.toJSON();

                if((typeof msgError.message != undefined && msgError.message)){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);
                }

                console.log(errorReport);
                console.log(msgError);
           })
       }
       getTable();

       setWorkerID((typeof localStorage.getItem("showUserTime") != undefined && localStorage.getItem("showUserTime")) ? localStorage.getItem("showUserTime") : 0);
       setWorkerName((typeof localStorage.getItem("showUserName") != undefined && localStorage.getItem("showUserName")) ? localStorage.getItem("showUserName") : "");
       setWorkerDayID((typeof localStorage.getItem("showBookings") != undefined && localStorage.getItem("showBookings")) ? localStorage.getItem("showBookings") : 0);
       
       localStorage.setItem("showUserTime", "");
       localStorage.setItem("showUserName", "");
       localStorage.setItem("showBookings", "");
    }

    function showInput(id, notiz){
        $('#txt_' + id).val(notiz);
        $('#textInput_' + id).removeClass("d-none");
    }

    function hideInput(id){
        $('#textInput_' + id).addClass("d-none");
    }

    function showEditTime(id){
        $('.eDay_' + id).removeClass("d-none");
        $('.btnEdit_' + id).removeClass("d-none");
        $('.btnDel_' + id).removeClass("d-none");
    }

    function hideEditTime(id){
        $('.eDay_' + id).addClass("d-none");
        $('.btnEdit_' + id).addClass("d-none");
        $('.btnDel_' + id).addClass("d-none");
    }

    function showNewInsertTime(id){
        $('#insertDayTime_' + id).removeClass("d-none");
        $('#insertDayTime_' + id).addClass("insertEntryTD");
    }

    function showInsertTime(id){
        $('#insertTime_' + id).removeClass("d-none");
        $('#iEntry_' + id).addClass('insertEntryTD');
    }

    function closeNewEntry(id){
        $('#insertDayTime_' + id).addClass("d-none");
        $('#insertDayTime_' + id).removeClass("insertEntryTD");
    }

    function closeExistingEntry(id){
        $('#insertTime_' + id).addClass("d-none");
        $('#iEntry_' + id).removeClass("insertEntryTD");
    }

    function saveComment(id){
        var comment = $('#txt_' + id).val();

        /* POST-Anfrage - Parameter */
        const formObj = {
            "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            "dayComment" : comment,
            "tagID" : id
        }

        const postData = JSON.stringify(formObj);
        const params = new URLSearchParams();

        params.append('postData', postData);
        params.append('action', "setDayComment");

        /* HTTP Config */
        let axiosConfig = {
            headers: {
                'Content-Type' : 'application/json; charset=UTF-8',
                'Accept' : 'Token',
                "Access-Control-Allow-Origin" : "*",
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
                var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);

                /* Fehlermeldung */
                var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                console.log(outputTxt);

                if(statusCode === SUCCESS){
                    $('#txt_' + id).css("border", "1px solid green");
                    $('#notiz_' + id).text(comment);
                    //$('#btnEditNote_' + id).prop("value", "Notiz bearbeiten");
                    $('#btnEditNote_' + id).html("Notiz bearbeiten");

                    setTimeout(() => {
                        hideInput(id);
                    }, 1000)

                    $('#successMSG_' + id).text("Notiz erfasst!");
                }
                else{
                    if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                        localStorage.setItem("loginMSG", outputTxt);
                        navigate("/logout");
                    }
                    else{
                        $('#txt_' + id).css("border", "1px solid red");

                        setTimeout(() => {
                            hideInput(id);
                        }, 1000)

                        $('#successMSG_' + id).text("Notiz nicht erfasst worden!");
                    }
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

            if((typeof msgError.message != undefined && msgError.message)){
                console.log(msgError.message + "(" + SERVER_ERROR + ")");
                setError(msgError.message);
            }
        })
    }


    function confirmEntry(tagID){
        /* POST-Anfrage - Parameter */
        const formObj = {
            "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            "tagID" : tagID,
        }

        const postData = JSON.stringify(formObj);
        const params = new URLSearchParams();

        params.append('postData', postData);
        params.append('action', "confirmUserBooking");

        /* HTTP Config */
        let axiosConfig = {
            headers: {
                'Content-Type' : 'application/json; charset=UTF-8',
                'Accept' : 'Token',
                "Access-Control-Allow-Origin" : "*",
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
                var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);

                /* Fehlermeldung */
                var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                console.log(outputTxt);

                /* ToDo: Seite nicht neu laden + Meldung  */
                if(statusCode === SUCCESS){
                    $('#btnConf_' + tagID).remove();

                    $('#successMSG_' + tagID).removeClass('d-none');
                    $('#successMSG_' + tagID).text("Erhalt bestätigt!");
                    
                    $('#icon_' + tagID).html("");
                    
                    setTimeout(() => {
                        $('#successMSG_' + tagID).addClass('d-none');
                    }, 3000)
                }
                else{
                    if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                        localStorage.setItem("loginMSG", outputTxt);
                        navigate("/logout");
                    }
                    else{
                        $('#btnConf_' + tagID).removeClass("btn-primary");
                        $('#btnConf_' + tagID).addClass("btn-danger");

                        $('#errorMSG_' + tagID).removeClass('d-none');
                        $('#errorMSG_' + tagID).text("Erhalt konnte nicht bestätigt werden!");
                        
                        setTimeout(() => {
                            $('#errorMSG_' + tagID).addClass('d-none');
                        }, 3000)
                    }
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

            if((typeof msgError.message != undefined && msgError.message)){
                console.log(msgError.message + "(" + SERVER_ERROR + ")");
                setError(msgError.message);
            }
        })
    };

    function setEntryExisting(tagID){
        var uID = (workerID ? workerID : userID);
        var dayID = (workerDayID ? workerDayID : 0);

        const possibleEntries = timeArray[tagID][0].possibleEntry;
        const dayTimes = timeArray[tagID];

        var validTime = false;
        var letzteErfassung = dayTimes[dayTimes.length - 1];

        var start = $('#existingStart_' + tagID).val();
        var stop = $('#existingStop_' + tagID).val();
        
        if(typeof start != undefined && start){
            var datum = $('#existingStop_' + tagID).data("datum");

            const today = new Date();

            const date = datum.split(".");
            const todayString = today.toDateString();
            
            const day = date[0];
            const month = date[1];
            const year = date[2];

            const dateString = year + "-" + month + "-" + day;
            
            /* StartZeit Timestamp */
            var startDateOBJ = new Date(dateString + " " + start);
            const startTimestamp = Math.round(startDateOBJ.getTime() / 1000);
            
            const dateStr = startDateOBJ.toDateString();
            
            var stopTimestamp = 0;
            var stop_bezeichnung = "";

            if((typeof stop != undefined && stop)){

                if(stop > start){
                    var stopDateOBJ = new Date(dateString + " " + stop);
                    stopTimestamp = Math.round(stopDateOBJ.getTime() / 1000);
                    
                    stop_bezeichnung = $('#existingStopBezeichnung_' + tagID).val();
                    
                    if(stop_bezeichnung == "Feierabend"){
                        var zeitraumVon = possibleEntries[possibleEntries.length - 1][0];
                        var zeitraumBis = possibleEntries[possibleEntries.length - 1][1];

                        if(startTimestamp > zeitraumVon && startTimestamp < zeitraumBis && stopTimestamp > zeitraumVon && stopTimestamp < zeitraumBis){
                            validTime = true;
                        }
                    }
                    else{
                    
                        (Array.isArray(possibleEntries)) 
                        ?
                            possibleEntries.map(entry => {

                                var zeitraumVon = entry[0];
                                var zeitraumBis = entry[1];

                                if(startTimestamp > zeitraumVon && startTimestamp < zeitraumBis && stopTimestamp > zeitraumVon && stopTimestamp < zeitraumBis){
                                    validTime = true;
                                }
                            })
                        :
                            console.log("No Entries");

                    }

                    /* Prüfen ob nicht nach Feierabend */
                    if(validTime){
                        if(letzteErfassung.end_bezeichnung == "Feierabend"){

                            if(startTimestamp > letzteErfassung.ende_timestamp){
                                validTime = false;
                                var lastBookingID = letzteErfassung.bookingid;

                                showEditTime(lastBookingID);

                                $('#eStart_' + lastBookingID).css("border", "1px solid red");
                                $('#eStop_' + lastBookingID).css("border", "1px solid red");
            
                                $('#eSelectStop_' + lastBookingID).css("border", "1px solid red");

                                $('#existingStart_' + tagID).css("border", "1px solid red");
                                $('#existingStop_' + tagID).css("border", "1px solid red");
            
                                $('#errorExistingMSG_' + tagID).removeClass('d-none');
                                $('#errorExistingMSG_' + tagID).text("Erfassung nach Feierabend!");
                                
                                setTimeout(() => {
                                    $('#errorExistingMSG_' + tagID).addClass('d-none');
                                }, 3000)
                            }
                        }
                    }
                    else{
                        $('#existingStart_' + tagID).css("border", "1px solid red");
                        $('#existingStop_' + tagID).css("border", "1px solid red");
        
                        $('#errorExistingMSG_' + tagID).removeClass('d-none');
                        $('#errorExistingMSG_' + tagID).text("Zeit liegt nicht im möglichen Zeitfenster!");
                        
                        setTimeout(() => {
                            $('#errorExistingMSG_' + tagID).addClass('d-none');
                        }, 3000)
                    }
                }
                else{
                    $('#existingStart_' + tagID).css("border", "1px solid red");
                    $('#existingStop_' + tagID).css("border", "1px solid red");

                    $('#errorExistingMSG_' + tagID).removeClass('d-none');
                    $('#errorExistingMSG_' + tagID).text("Start liegt vor Stop!");
                    
                    setTimeout(() => {
                        $('#errorExistingMSG_' + tagID).addClass('d-none');
                    }, 3000)
                }
            }
            else{
                var letzteMöglicheErfassung = possibleEntries[possibleEntries.length - 1];

                if(letzteMöglicheErfassung[0] != "laufende Erfassung"){
                    if(letzteErfassung.end_bezeichnung != "Feierabend"){
                        if(todayString == dateStr){
                            var possibleFrom = letzteMöglicheErfassung[0];
                            var possibleTo = letzteMöglicheErfassung[1];

                            if(startTimestamp > possibleFrom && startTimestamp < possibleTo){
                                validTime = true;
                            }

                            if(!validTime){
                                $('#eStart_' + lastBookingID).css("border", "1px solid red");

                                $('#errorExistingMSG_' + tagID).removeClass('d-none');
                                $('#errorExistingMSG_' + tagID).text("Erfassung nicht möglich!");
                                
                                setTimeout(() => {
                                    $('#errorExistingMSG_' + tagID).addClass('d-none');
                                }, 3000)
                            }
                        }
                        else{
                            var lastBookingID = letzteErfassung.bookingid;
                            showEditTime(lastBookingID);

                            $('#eStart_' + lastBookingID).css("border", "1px solid red");
                            $('#eStop_' + lastBookingID).css("border", "1px solid red");
        
                            $('#eSelectStop_' + lastBookingID).css("border", "1px solid red");
        
                            $('#errorExistingMSG_' + tagID).removeClass('d-none');
                            $('#errorExistingMSG_' + tagID).text("Stopzeit muss angegeben werden!");
                            
                            setTimeout(() => {
                                $('#errorExistingMSG_' + tagID).addClass('d-none');
                            }, 3000)
                        }
                    }
                    else{
                        var lastBookingID = letzteErfassung.bookingid;
                        showEditTime(lastBookingID);

                        $('#eStart_' + lastBookingID).css("border", "1px solid red");
                        $('#eStop_' + lastBookingID).css("border", "1px solid red");
    
                        $('#eSelectStop_' + lastBookingID).css("border", "1px solid red");
    
                        $('#errorExistingMSG_' + tagID).removeClass('d-none');
                        $('#errorExistingMSG_' + tagID).text("Die Erfassung ist bereits beendet worden!");
                        
                        setTimeout(() => {
                            $('#errorExistingMSG_' + tagID).addClass('d-none');
                        }, 3000)
                    }
                }
                else{
                    
                    var lastBookingID = letzteErfassung.bookingid;
                                        
                    showEditTime(lastBookingID);

                    $('#eStart_' + lastBookingID).css("border", "1px solid red");
                    $('#eStop_' + lastBookingID).css("border", "1px solid red");

                    $('#eSelectStop_' + lastBookingID).css("border", "1px solid red");

                    $('#errorExistingMSG_' + tagID).removeClass('d-none');
                    $('#errorExistingMSG_' + tagID).text("Es läuft bereits eine Erfasssung!");
                    
                    setTimeout(() => {
                        $('#errorExistingMSG_' + tagID).addClass('d-none');
                    }, 3000)
                }
            }

            if(validTime){
                closeExistingEntry(tagID);
                
                /* POST-Anfrage - Parameter */
                const formObj = {
                    "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
                    "userID" : uID,
                    "tagID" : tagID,
                    "start" : startTimestamp,
                    "stop" : stopTimestamp,
                    "stop_bezeichnung" : stop_bezeichnung,
                    "getDay": dayID
                }

                const postData = JSON.stringify(formObj);
                const params = new URLSearchParams();

                params.append('postData', postData);
                params.append('action', "updateEntry");

                /* HTTP Config */
                let axiosConfig = {
                    headers: {
                        'Content-Type' : 'application/json; charset=UTF-8',
                        'Accept' : 'Token',
                        "Access-Control-Allow-Origin" : "*",
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
                        var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
                        const updatedUserTime = ((typeof data.userTime != undefined && data.userTime) ? data.userTime : []);

                        /* Fehlermeldung */
                        var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                        var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                        console.log(outputTxt);

                        if(statusCode === SUCCESS){
                            $('#successExistingMSG_' + tagID).removeClass('d-none');
                            $('#successExistingMSG_' + tagID).text("Erfolgreich gespeichert");
                            
                            /* Tabelle Aktualisieren */
                            setTimeArray(updatedUserTime);
                            
                            setTimeout(() => {
                                $('#successExistingMSG_' + tagID).addClass('d-none');

                                /* Eingabe Felder leeren */
                                $('#existingStart_' + tagID).val("");
                                $('#existingStop_' + tagID).val("");
                                
                                showEditTime(tagID);
                            }, 3000)

                        }
                        else{
                            if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                                localStorage.setItem("loginMSG", outputTxt);
                                navigate("/logout");
                            }
                            else{
                                $('#existingStart_' + tagID).css("border", "1px solid red");
                                $('#existingStop_' + tagID).css("border", "1px solid red");
            
                                $('#errorExistingMSG_' + tagID).removeClass('d-none');
                                $('#errorExistingMSG_' + tagID).text("Leider ist ein Fehler aufgetreten");
                                
                                setTimeout(() => {
                                    $('#errorExistingMSG_' + tagID).addClass('d-none');
                                }, 3000)
                            }
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

                    if((typeof msgError.message != undefined && msgError.message)){
                        console.log(msgError.message + "(" + SERVER_ERROR + ")");
                        setError(msgError.message);
                    }
                })
            }
        }
        else{
            $('#errorExistingMSG_' + tagID).removeClass('d-none');
            $('#errorExistingMSG_' + tagID).text("Start muss angegeben werden!");
            
            setTimeout(() => {
                $('#errorExistingMSG_' + tagID).addClass('d-none');
            }, 3000)
        }
    }

    function setNewEntryForEmpty(tagID){
        var uID = (workerID ? workerID : userID);
        var dayID = (workerDayID ? workerDayID : 0);

        if((typeof tagID != undefined && tagID)){
            const possibleTimes = timeArray[tagID][0].possibleTimes[0];

            var startFrom = possibleTimes[0][0];
            var startBis = possibleTimes[0][1];

            var stopVon = possibleTimes[1][0];
            var stopBis = possibleTimes[1][1];

            var start = $('#start_' + tagID).val();
            var stop = $('#stop_' + tagID).val();

            var stop_bezeichnung = $('#stopBezeichnung_' + tagID).val();

            if((typeof start != undefined && start)){
                var startZeit = 0;var startBezeichnung = "";
                var stopZeit = 0;var stopBezeichnung = "";
                
                var datum = $('#stop_' + tagID).data("datum");

                const today = new Date();

                const date = datum.split(".");
                const todayString = today.toDateString();
                
                const day = date[0];
                const month = date[1];
                const year = date[2];

                const dateString = year + "-" + month + "-" + day;
                
                /* StartZeit Timestamp */
                var startDateOBJ = new Date(dateString + " " + start);
                const startTimestamp = Math.round(startDateOBJ.getTime()/1000);
                
                const dateStr = startDateOBJ.toDateString();

                /* Heute Timestamp */
                const nowTimestampLegit = Math.round(today.getTime() / 1000);

                if((typeof stop != undefined && stop)){
                    /* StopZeit Timestamp */
                    var stopDateOBJ = new Date(dateString + " " + stop);
                    const stopTimestamp = Math.round(stopDateOBJ.getTime()/1000);

                    if(startTimestamp > stopTimestamp){
                        $('#errorMSG_' + tagID).removeClass('d-none');
                        $('#errorMSG_' + tagID).text("Start liegt nach Stop!");
                        
                        setTimeout(() => {
                            $('#errorMSG_' + tagID).addClass('d-none');
                        }, 3000)
                    }
                    else{
                        /* Ist die Zeit im möglichen Zeitfenster? */
                        if(startTimestamp > startFrom && startTimestamp < startBis){
                            if(stopTimestamp > stopVon && stopTimestamp < stopBis){

                                if(stopTimestamp < nowTimestampLegit || todayString != dateStr){
                                    /* Erfassung für selben tag nicht in der Zukunft oder vergangener Tag */
                                    startZeit = startTimestamp;

                                    stopZeit = stopTimestamp;
                                    stopBezeichnung = stop_bezeichnung;
                                    
                                    $('#successMSG_' + tagID).removeClass('d-none');
                                    $('#successMSG_' + tagID).text("Eintrag im möglichen Zeitfenster!");
                                    
                                    setTimeout(() => {
                                        $('#successMSG_' + tagID).addClass('d-none');
                                    }, 3000)
                                }
                                else{
                                    /* Selber Tag & Erfassung liegt in der Zukunft */
                                    $('#errorMSG_' + tagID).removeClass('d-none');
                                    $('#errorMSG_' + tagID).text("Stop liegt in der Zukunft!");
                                    
                                    setTimeout(() => {
                                        $('#errorMSG_' + tagID).addClass('d-none');
                                    }, 3000)
                                }
                            }
                            else{
                                $('#errorMSG_' + tagID).removeClass('d-none');
                                $('#errorMSG_' + tagID).text("Stop außerhalb des möglichen Zeitfensters!");
                                
                                setTimeout(() => {
                                    $('#errorMSG_' + tagID).addClass('d-none');
                                }, 3000)
                            }
                        }
                        else{
                            $('#errorMSG_' + tagID).removeClass('d-none');
                            $('#errorMSG_' + tagID).text("Start außerhalb des möglichen Zeitfensters!");
                            
                            setTimeout(() => {
                                $('#errorMSG_' + tagID).addClass('d-none');
                            }, 3000)
                        }
                    }
                }
                else{
                    /* Nur start erfassen */
                    if(todayString == dateStr){
                        if(startTimestamp > startFrom && startTimestamp < startBis){
                            if(startTimestamp < nowTimestampLegit){
                                startZeit = startTimestamp;

                                $('#successMSG_' + tagID).removeClass('d-none');
                                $('#successMSG_' + tagID).text("Laufende Erfassung wird eingetragen!");
                                
                                setTimeout(() => {
                                    $('#successMSG_' + tagID).addClass('d-none');
                                }, 3000)

                            }
                            else{
                                $('#errorMSG_' + tagID).removeClass('d-none');
                                $('#errorMSG_' + tagID).text("Start liegt in der Zukunft!");
                                
                                setTimeout(() => {
                                    $('#errorMSG_' + tagID).addClass('d-none');
                                }, 3000)
                            }
                        }
                        else{
                            $('#errorMSG_' + tagID).removeClass('d-none');
                            $('#errorMSG_' + tagID).text("Start außerhalb des möglichen Zeitfensters");
                            
                            setTimeout(() => {
                                $('#errorMSG_' + tagID).addClass('d-none');
                            }, 3000)
                        }
                    }
                    else{
                        /* Vergangener Tag: stop muss angegeben werden */
                        $('#errorMSG_' + tagID).removeClass('d-none');
                        $('#errorMSG_' + tagID).text("Stop muss angegeben werden!");
                        
                        setTimeout(() => {
                            $('#errorMSG_' + tagID).addClass('d-none');
                        }, 3000)
                    }
                }

                if(startZeit > 0){

                    closeNewEntry(tagID);

                    /* POST-Anfrage - Parameter */
                    const formObj = {
                        "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
                        "userID" : uID,
                        "tagID" : tagID,
                        "start" : startZeit,
                        "stop" : stopZeit,
                        "stop_bezeichnung" : stopBezeichnung,
                        "getDay": dayID
                    }

                    const postData = JSON.stringify(formObj);
                    const params = new URLSearchParams();

                    params.append('postData', postData);
                    params.append('action', "insertNewEntry");

                    /* HTTP Config */
                    let axiosConfig = {
                        headers: {
                            'Content-Type' : 'application/json; charset=UTF-8',
                            'Accept' : 'Token',
                            "Access-Control-Allow-Origin" : "*",
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
                            var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
                            const updatedUserTime = ((typeof data.userTime != undefined && data.userTime) ? data.userTime : []);

                            /* Fehlermeldung */
                            var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                            var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                            console.log(outputTxt);

                            /* ToDo: Seite nicht neu laden + Meldung  */
                            if(statusCode === SUCCESS){
                                $('#successMSG_' + tagID).removeClass('d-none');
                                $('#successMSG_' + tagID).text("Erfolgreich gespeichert!");

                                setTimeArray(updatedUserTime);

                                setTimeout(() => {
                                    $('#successMSG_' + tagID).addClass('d-none');
                                }, 3000)            
                            }
                            else{

                                if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                                    localStorage.setItem("loginMSG", outputTxt);
                                    navigate("/logout");
                                }
                                else{
                                    $('#errorMSG_' + tagID).removeClass('d-none');
                                    $('#errorMSG_' + tagID).text("ERfassung konnte nicht erfasst werden!");
                                    
                                    setTimeout(() => {
                                        $('#errorMSG_' + tagID).addClass('d-none');
                                    }, 3000)
                                }
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

                        if((typeof msgError.message != undefined && msgError.message)){
                            console.log(msgError.message + "(" + SERVER_ERROR + ")");
                            setError(msgError.message);
                        }
                    })
                }
            }
            else{
                $('#errorMSG_' + tagID).removeClass('d-none');
                $('#errorMSG_' + tagID).text("Start muss angegeben werden!");
                
                setTimeout(() => {
                    $('#errorMSG_' + tagID).addClass('d-none');
                }, 3000)
            }
        }
    }
    
    function deleteUserTime(bookingID){
        var uID = (workerID ? workerID : userID);
        var dayID = (workerDayID ? workerDayID : 0);

        /* POST-Anfrage - Parameter */
        const formObj = {
            "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            "bookingID" : bookingID,
            "userID" : uID,
            "getDay": dayID
        }

        const postData = JSON.stringify(formObj);
        const params = new URLSearchParams();

        params.append('postData', postData);
        params.append('action', "deleteEntry");

        /* HTTP Config */
        let axiosConfig = {
            headers: {
                'Content-Type' : 'application/json; charset=UTF-8',
                'Accept' : 'Token',
                "Access-Control-Allow-Origin" : "*",
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
                var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
                const updatedUserTime = ((typeof data.userTime != undefined && data.userTime) ? data.userTime : []);

                /* Fehlermeldung */
                var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                console.log(outputTxt);

                if(statusCode === SUCCESS){
                    setTimeArray(updatedUserTime);

                    setTimeout(() => {
                        $('#successMSG_' + tagID).removeClass('d-none');
                    }, 3000)
                }
                else{
                    if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                        localStorage.setItem("loginMSG", outputTxt);
                        navigate("/logout");
                    }
                    else{
                        var tagID = $('#btnDel_' + bookingID).data('tag');

                        $('#errorMSG_' + tagID).removeClass('d-none');
                        $('#errorMSG_' + tagID).text("Buchung konnte nicht gelöscht werden!");
                        
                        setTimeout(() => {
                            $('#errorMSG_' + tagID).addClass('d-none');
                        }, 3000)
                    }
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

            if((typeof msgError.message != undefined && msgError.message)){
                console.log(msgError.message + "(" + SERVER_ERROR + ")");
                setError(msgError.message);
            }
        })
    }

    function editUserTime(bookingID, tagID, end_bezeichnung){
        var uID = (workerID ? workerID : userID);  
        var dayID = (workerDayID ? workerDayID : 0);

        var endBezeichnung      = $('#eSelectStop_' + bookingID).val();
        var initEndBezeichnung  = $('#eSelectStop_' + bookingID).val();
        
        var start;
        var stop;

        const possibleTimes = timeArray[tagID][0].possibleTimes[bookingID];
        const possibleEntries = timeArray[tagID][0].possibleEntry;

        var startVon = possibleTimes[0][0];
        var startBis = possibleTimes[0][1];

        var stopVon = possibleTimes[1][0];
        var stopBis = possibleTimes[1][1];

        start = $('#eStart_' + bookingID).val();
        
        var datum = $('#eStart_' + bookingID).data("datum");

        stop = $('#eStop_' + bookingID).val();

        $('#eStop_' + bookingID).css("border", "");
        $('#eStart_' + bookingID).css("border", "");

        var startZeit = 0;
        var stopZeit = 0;

        const dayTimes = timeArray[tagID];
        var letzteErfassung = dayTimes[dayTimes.length - 1];

        function blinkErrorBox() {
            $('#errorMSG_' + tagID).fadeOut(500).fadeIn(500);
        }

        function blinkSuccessBox() {
            $('#successMSG_' + tagID).fadeOut(500).fadeIn(500);
        }

        var x = getOffset(document.getElementById("tblDay_" + tagID)).left;
        var y = getOffset(document.getElementById("tblDay_" + tagID)).top;

        window.scrollTo({top: y-180, behavior: 'smooth'});
        
        if((typeof start != undefined && start) || (typeof stop != undefined && stop)){
            const today = new Date();
            const date = datum.split(".");
                        
            const todayString = today.toDateString();
            
            const day = date[0];
            const month = date[1];
            const year = date[2];

            var dateString = year + "-" + month + "-" + day;

            /* Heute Timestamp */
            const nowTimestampLegit = Math.round(today.getTime()/1000);

            if((typeof start != undefined && start) && (typeof stop != undefined && stop)){
                /* Start-Zeit Timestamp */
                var startDateOBJ = new Date(dateString + " " + start);
                var startTimestamp = Math.round(startDateOBJ.getTime() / 1000);
                
                var dateStr = startDateOBJ.toDateString();

                /* Stop-Zeit Timestamp */
                var stopDateOBJ = new Date(dateString + " " + stop);
                var stopTimestamp = Math.round(stopDateOBJ.getTime() / 1000);

                if(startTimestamp < stopTimestamp){
                    if(startTimestamp > startVon && stopTimestamp < stopBis){
                        /* Bereich von Start und Stop möglich */
                        startZeit = startTimestamp;
                        stopZeit = stopTimestamp;

                        $('#eStart_' + bookingID).css("border", "1px solid green");
                        $('#eStop_' + bookingID).css("border", "1px solid green");
                    }
                    else{
                        if(startTimestamp < startVon){
                            $('#eStart_' + bookingID).css("border", "1px solid red");
                            
                            $('#errorMSG_' + tagID).removeClass('d-none');
                            $('#errorMSG_' + tagID).text("Start liegt außerhalb des möglichen Zeitfensters!");
                            
                            blinkErrorBox();

                            setTimeout(() => {
                                $('#errorMSG_' + tagID).addClass('d-none');
                            }, 3000)
                        }
                        else{
                            if(stopTimestamp > stopBis){
                                $('#eStop_' + bookingID).css("border", "1px solid red");
                            
                                $('#errorMSG_' + tagID).removeClass('d-none');
                                $('#errorMSG_' + tagID).text("Stop liegt außerhalb des möglichen Zeitfensters!");
                                
                                blinkErrorBox();

                                setTimeout(() => {
                                    $('#errorMSG_' + tagID).addClass('d-none');
                                }, 3000)
                            }
                        }
                    }
                }
                else{
                    $('#eStart_' + bookingID).css("border", "1px solid red");
                    $('#eStop_' + bookingID).css("border", "1px solid red");
                    
                    $('#errorMSG_' + tagID).removeClass('d-none');
                    $('#errorMSG_' + tagID).text("Start ist später als Stop!");
                    
                    blinkErrorBox();

                    setTimeout(() => {
                        $('#errorMSG_' + tagID).addClass('d-none');
                    }, 3000)
                }
            }
            else{
                if((typeof stop != undefined && stop)){
                    /* Stop-Zeit Timestamp */
                    var stopDateOBJ = new Date(dateString + " " + stop);

                    var stopTimestamp = Math.round(stopDateOBJ.getTime() / 1000);
                    var dateStr = stopDateOBJ.toDateString();
                    
                    if((typeof stopTimestamp != undefined && stopTimestamp)){
                        if(stopTimestamp > stopVon && stopTimestamp < stopBis){
                            stopZeit = stopTimestamp;

                            $('#eStop_' + bookingID).css("border", "1px solid green");
                        }
                        else{
                            $('#eStop_' + bookingID).css("border", "1px solid red");

                            $('#errorMSG_' + tagID).removeClass('d-none');
                            $('#errorMSG_' + tagID).text("Stop außerhalb des möglichen Zeifensters!");
                            
                            blinkErrorBox();

                            setTimeout(() => {
                                $('#errorMSG_' + tagID).addClass('d-none');
                            }, 3000)
                        }
                    }
                }
                else{
                    if((typeof start != undefined && start)){
                        /* Start-Zeit Timestamp */
                        var startDateOBJ = new Date(dateString + " " + start);
                        var startTimestamp = Math.round(startDateOBJ.getTime() / 1000);

                        var dateStr = startDateOBJ.toDateString();

                        if((typeof startTimestamp != undefined && startTimestamp)){
                            if(startTimestamp > startVon && startTimestamp < startBis){
                                $('#eStart_' + bookingID).css("border", "1px solid green");
    
                                startZeit = startTimestamp
                            }
                            else{
                                $('#eStart_' + bookingID).css("border", "1px solid red");
                                
                                $('#errorMSG_' + tagID).removeClass('d-none');
                                $('#errorMSG_' + tagID).text("Start liegt außerhalb des möglichen Zeitfensters!");
                                
                                blinkErrorBox();

                                setTimeout(() => {
                                    $('#errorMSG_' + tagID).addClass('d-none');
                                }, 3000)
                            }
                        }
                    }
                }
            }
        }

        if(bookingID != letzteErfassung.bookingid){
            /* Wenn die Buchung nicht die letzte Buchung ist, kann nichts geändert werden */
            if(endBezeichnung == "Feierabend"){
                $('#eSelectStop_' + bookingID).css("border", "1px solid red");
            }
            else{
                $('#eSelectStop_' + bookingID).css("border", "");
            }
            endBezeichnung = "";
        }
        else{
            if((typeof letzteErfassung.start_timestamp != undefined && letzteErfassung.start_timestamp > 0) && (typeof letzteErfassung.ende_timestamp == undefined || letzteErfassung.ende_timestamp == 0)){
                /* Wenn die Erfassung läuft und kein Stop angegeben wird Bezeichnung nicht ändern */
                if(stopZeit == 0){
                    endBezeichnung = "";
                }
            }
        }

        if(endBezeichnung == end_bezeichnung){
            /* Bezeichnung wurde nicht geändert */
            endBezeichnung = "";
        }
        
        if(startZeit > 0 || stopZeit > 0 || endBezeichnung != ""){

            /* POST-Anfrage - Parameter */
            const formObj = {
                "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
                "userID" : uID,
                "tagID" : tagID,
                "bookingID" : bookingID,
                "start" : startZeit,
                "stop" : stopZeit,
                "stop_bezeichnung" : endBezeichnung,
                "getDay": dayID
            }

            const postData = JSON.stringify(formObj);
            const params = new URLSearchParams();

            params.append('postData', postData);
            params.append('action', "updateEntry");

            /* HTTP Config */
            let axiosConfig = {
                headers: {
                    'Content-Type' : 'application/json; charset=UTF-8',
                    'Accept' : 'Token',
                    "Access-Control-Allow-Origin" : "*",
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
                    var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
                    const tableData = ((typeof data.userTime != undefined && data.userTime) ? data.userTime : []);

                    /* Fehlermeldung */
                    var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                    var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                    console.log(outputTxt);

                    /* ToDo: Seite nicht neu laden + Meldung  */
                    if(statusCode === SUCCESS){
                        $('#eStart_' + bookingID).css("border", "1px solid green");
                        $('#eStop_' + bookingID).css("border", "1px solid green");
                        $('#eSelectStop_' + bookingID).css("border", "1px solid green");

                        $('#successMSG_' + tagID).removeClass('d-none');
                        $('#successMSG_' + tagID).text("Erfassung ist bearbeitet Worden!");
                        
                        blinkSuccessBox();

                        /* Tabelle aktualisieren mit den neuen Daten */
                        setTimeArray(tableData);
                                                
                        setTimeout(() => {
                            $('#successMSG_' + tagID).addClass('d-none');

                            /* Eingabe zurücksetzen */
                            $('#eStart_' + bookingID).val("");
                            $('#eStop_' + bookingID).val("");

                        }, 2000)
                    }
                    else{
                        if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                            localStorage.setItem("loginMSG", outputTxt);
                            navigate("/logout");
                        }
                        else{
                            $('#eStart_' + bookingID).css("border", "");
                            $('#eStop_' + bookingID).css("border", "");
                            $('#eSelectStop_' + bookingID).css("border", "");

                            $('#errorMSG_' + tagID).removeClass('d-none');
                            $('#errorMSG_' + tagID).text("Fehler beim Bearbeiten der Erfassung!");
                            
                            blinkErrorBox();
                            
                            setTimeout(() => {
                                $('#errorMSG_' + tagID).addClass('d-none');
                            }, 3000)
                        }
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

                if((typeof msgError.message != undefined && msgError.message)){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);
                }
            })
        }
        else{

            if((typeof start != undefined && start) || (typeof stop != undefined && stop) || end_bezeichnung != initEndBezeichnung){
                /* Ein Eintrag bearbeitet worden */
            }
            else{
                
                $('#eStart_' + bookingID).css("border", "1px solid red");
                $('#eStop_' + bookingID).css("border", "1px solid red");

                $('#eSelectStop_' + bookingID).css("border", "1px solid red");


                $('#errorMSG_' + tagID).removeClass('d-none');
                $('#errorMSG_' + tagID).text("Bitte ändern!");
                
                blinkErrorBox();

                setTimeout(() => {
                    $('#errorMSG_' + tagID).addClass('d-none');
                    $('#eStart_' + bookingID).css("border", "");
                    $('#eStop_' + bookingID).css("border", "");

                    $('#eSelectStop_' + bookingID).css("border", "");
                }, 3000)
            }
        }
    }

    function saveDayEntry(){
        var newDayDate = $('#dayEntryDate').val();
        var uID = (workerID ? workerID : userID);

        const dateTime = new Date(newDayDate);
        $('#dayEntryDate').val("");
        if(dateTime != "Invalid Date"){

            /* POST-Anfrage - Parameter */
            const formObj = {
                "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
                "datum" : newDayDate,
                "userID" : uID
            }

            const postData = JSON.stringify(formObj);
            const params = new URLSearchParams();

            params.append('postData', postData);
            params.append('action', "newDayEntry");

            /* HTTP Config */
            let axiosConfig = {
                headers: {
                    'Content-Type' : 'application/json; charset=UTF-8',
                    'Accept' : 'Token',
                    "Access-Control-Allow-Origin" : "*",
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
                    var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
                    const updatedUserTime = ((typeof data.userTime != undefined && data.userTime) ? data.userTime : []);

                    /* Fehlermeldung */
                    var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                    var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                    
                    console.log(outputTxt);

                    /* ToDo: Seite nicht neu laden + Meldung  */
                    if(statusCode === SUCCESS){
                        $('#mainSuccessMSG').removeClass('d-none');
                        $('#mainSuccessMSG').text("Tag ist angelegt worden!");
                        
                        setTimeout(() => {
                            $('#mainSuccessMSG').addClass('d-none');
                        }, 2000)

                        setTimeArray(updatedUserTime);
                        
                        setTimeout(() => {
                            /* Tag in der Tabelle anzeigen */
                            $('#searchDay').val(newDayDate);
                            $('#submitSearch').click();
                            $('#searchDay').val("");

                        }, 3000)
                        
                    }
                    else{
                        if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                            localStorage.setItem("loginMSG", outputTxt);
                            navigate("/logout");
                        }
                        else{
                            $('#mainErrorMSG').removeClass('d-none');
                            $('#mainErrorMSG').text("Tag konnte nicht angelegt werden!");
                            
                            setTimeout(() => {
                                $('#mainErrorMSG').addClass('d-none');
                            }, 3000)

                            $('#searchDay').val(newDayDate);
                            $('#submitSearch').click();
                            $('#searchDay').val("");
                        }
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

                if((typeof msgError.message != undefined && msgError.message)){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);
                }
            })
        }
        else{
            /* Ungültiges Datum */
            $('#mainErrorMSG').removeClass('d-none');
            $('#mainErrorMSG').text("Ungültiges Datum!");
            
            setTimeout(() => {
                $('#mainErrorMSG').addClass('d-none');
            }, 3000)
        }
    }

    function showDatePicker(){
        $('.enterDay').removeClass("d-none");
    }

    function closeThis(){
        $('.enterDay').addClass('d-none');
    }

    function generateCSV(){

        window.scrollTo({top: 0, behavior: 'smooth'});

        /* POST-Anfrage - Parameter */
        const formObj = {
            "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            "userID" : (workerID ? workerID : 0),
            "tagID" : (workerDayID ? workerDayID : 0)
        }

        const postData = JSON.stringify(formObj);
        const params = new URLSearchParams();

        params.append('postData', postData);
        params.append('action', "requestCSV");

        /* HTTP Config */
        let axiosConfig = {
            headers: {
                'Content-Type' : 'application/json; charset=UTF-8',
                'Accept' : 'Token',
                "Access-Control-Allow-Origin" : "*",
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
                var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);

                /* Fehlermeldung */
                var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                console.log(outputTxt);

                if(statusCode == SUCCESS){
                    $('#csvLink').html("<br /><a href='http://" + data.link + "' target='_blank'> CSV-Datei Herunterladen →</a>");
                }
                else{
                     if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                        localStorage.setItem("loginMSG", outputTxt);
                        navigate("/logout");
                    }
                    else{
                        $('#mainErrorMSG').removeClass('d-none');
                        $('#mainErrorMSG').text("CSV Datei konnte nicht erstellt werden!");
                        
                        setTimeout(() => {
                            $('#mainErrorMSG').addClass('d-none');
                        }, 3000)
                    }
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
    
    function getOffset(el){
        var _x = 0;
        var _y = 0;
        
        while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)){
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        return {top: _y, left: _x};
    }

    function getBreakTimeColor(breakTime, workTime){
        var sixHours = 21600;
        var nineHours = 32400;

        var thirtyMin = 1800;
        var fortyfiveMin = 2700;
        
        var txtColor;

        if(workTime >= sixHours && workTime < nineHours){
            /* Mehr als 6 Stunden Arbeitszeit - mindestens 30 Min Pause */
            if(breakTime < thirtyMin){
                txtColor = "text-danger";
            }
            else{
                txtColor = "text-success";
            }
        }
        else{
            if(workTime >= nineHours){
                /* Mehr als 9 Stunden Arbeitszeit - mindestens 45 Min Pause */
                if(breakTime < fortyfiveMin){
                    txtColor = "text-danger";
                }
                else{
                    txtColor = "text-success";
                }
            }
            else{
                /* Standard OK */
                txtColor = "text-success";
            }
        }
        return txtColor;
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
                        <button className="btn btn-primary" onClick={() => { {navigate("/start");} } }>Zurück zu start</button>
                    </div>
                </div>
            </>
        )
    }
    else{
        if((typeof userID != undefined && userID)){
            /* Array mit den Key = Tag-IDs, Value = Reihe */
            const objKeys = Object.entries(timeArray).reverse();
            
            function bubbleSort(array){
                const length = array.length;

                for(var i = 0; i < length; i++){
                    for(var j = 0; j < length - 1; j++){
                        if(array[j][0].at(17) < array[j + 1][0].at(17)){
                            var temp = array[j];

                            array[j] = array[j + 1];
                            array[j + 1] = temp;
                        }
                    }
                }
                return array;
            }
            
            console.log("<<<<----- [TimeOBJ] ----->>>>");
            console.log(timeArray);
            console.log("<<<<----------->>>>");
            
            var tableArray = [];
            var i = 0;

            objKeys.forEach(rowData => {
                
                tableArray[i] = [];

                var x = 0;
                
                rowData[1].forEach(rowIndex => {
                    tableArray[i][x] = [
                        rowData[0],
                        rowIndex.datum,
                        rowIndex.bookingid,
                        (rowIndex.start) ? rowIndex.start : "",
                        rowIndex.start_timestamp,
                        rowIndex.start_bezeichnung,  
                        (rowIndex.ende) ? rowIndex.ende : "",
                        rowIndex.ende_timestamp,
                        (rowIndex.end_bezeichnung) ? rowIndex.end_bezeichnung : "",
                        (rowIndex.tagessumme) ? rowIndex.tagessumme : "",
                        (rowIndex.tagessumme_timestamp) ? rowIndex.tagessumme_timestamp : 0,
                        rowIndex.arbeitszeit,
                        rowIndex.arbeitszeit_timestamp,
                        (rowIndex.notiz) ? rowIndex.notiz : "",
                        (rowIndex.confUser) ? rowIndex.confUser : [],
                        rowIndex.status,
                        rowIndex.wochentag,
                        rowIndex.datum_timestamp,
                        (rowIndex.pausenzeit ? rowIndex.pausenzeit : ""),
                        (rowIndex.pausenzeit_timestamp ? rowIndex.pausenzeit_timestamp : 0),
                        (rowIndex.pausenzeit_summe ? rowIndex.pausenzeit_summe : ""),
                        (rowIndex.pausenzeit_summe_timestamp ? rowIndex.pausenzeit_summe_timestamp : 0),
                    ];
                    x++;
                });
                i++;
            });
            
            console.log("<<<<----- [Table Array] ----->>>>");
            console.log(tableArray);
            console.log("<<<<----------->>>>");

            if(Array.isArray(tableArray)){
                tableArray = bubbleSort(tableArray);
            }

            function getDayByTxt(){
                var dayTxt = $('#searchDay').val();

                var dayArray = dayTxt.split("-");
                dayTxt = dayArray[2] + "." + dayArray[1] + "." + dayArray[0];

                var found = false;
        
                (Array.isArray(tableArray))
                ?
                    tableArray.map(entry => {
                        if(entry[0].at(1) == dayTxt){
                            var x = getOffset(document.getElementById("tblDay_" + entry[0].at(0))).left;
                            var y = getOffset(document.getElementById("tblDay_" + entry[0].at(0))).top;

                            setTimeout( () => {
                                window.scrollTo({top: y - 180, behavior: 'smooth'});
                            }, 100)

                            found = true;
                        }
                    })
                :
                    console.log("Empty");
                ;
                
                if(found){
                    $('#searchDay').css("border", "1px solid green");
                }
                else{
                    $('#searchDay').css("border", "1px solid red");
                }

            }

            return(
                <>
                <NavigationBar />
                <Layout />
                    {
                        (typeof workerID != undefined && workerID) 
                        ? 
                            (workerDayID) 
                            ? 
                                <div>
                                    <h1 className="text-center">Arbeitszeiten von Mitarbeiter: {workerName}</h1>
                                </div>
                            :
                                <div>
                                    <h1 className="text-center">Arbeitszeiten von Mitarbeiter: {workerName}</h1>
                                </div>
                        :
                            <h1 className="text-center">Arbeitszeiten</h1>
                    }

                    <button className="btn btn-primary" onClick={ () => { {showDatePicker();} } }><span><Calendar></Calendar></span> Neuen Tag anlegen</button>
                    <span> </span><br /><br />
                    
                    <input type="date" id="dayEntryDate" className="d-none enterDay" name="trip-start"></input> <button className="btn btn-sm btn-primary d-none enterDay" onClick={ () => { {closeThis();} } } >Schließen</button> <button className="btn btn-sm btn-primary d-none enterDay" onClick={ () => { { saveDayEntry(); } } } >→</button>
                    
                    <div className="smallHeader">
                        {
                            Array.isArray(tableArray)
                            ?
                                (tableArray.length > 0)
                                ?
                                    <>
                                        <button className="btn btn-primary" onClick={ () => { {generateCSV();} } } ><span><FileCsv></FileCsv></span><span className="bTag"> CSV-Datei generieren</span></button><span> </span>
                                        
                                        <br/><div id="csvLink"></div><br/>
                                        
                                        <div id={"mainSuccessMSG"} className="alert alert-success d-none" role="alert"></div>
                                        <div id={"mainErrorMSG"} className="alert alert-danger d-none" role="alert"></div>

                                        <div>
                                            <input type="date" id="searchDay"></input> <button id="submitSearch" className="btn btn-primary" onClick={ () => { {getDayByTxt();} } } >→</button>
                                        </div>
                                    </>
                                :
                                    ""
                            :
                                ""
                        }
                    </div>
                    {
                        (typeof workerID != undefined && workerID) 
                        ? 
                            (workerDayID) 
                            ? 
                                <div>
                                    <a href={"#"} className="link-primary" onClick={ () => { {navigate("/start");} } } >← Zurück</a>
                                </div>
                            :
                                <div>
                                    <a href={"#"} className="link-primary" onClick={ () => { {navigate("/benutzerverwaltung");} } } >← Zurück</a>
                                </div>
                        :
                            ""
                    }
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th id="headDate" scope="col">Datum</th>
                                    <th scope="col">Zeit Von</th>
                                    <th scope="col">Zeit Bis</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (() => {
                                        /* Keine Erfassungen */
                                        if(tableArray.length === 0){
                                            return(
                                                <tr>
                                                    <td colSpan="6" className="text-center">Leer</td>
                                                </tr>
                                            )
                                        }
                                    })()
                                    
                                }
                                
                                {
                                    (Array.isArray(tableArray)) 
                                    ? 
                                        tableArray.map(tableRow => {
                                            var count = 0;
                                            
                                            var tagessumme;
                                            var tagessumme_timestamp;
                                            var notiz;
                                            var bestBenutzer;
                                            var status;
                                            var wochentag;
                                            var pausenzeit_summe;
                                            var pausenzeit_summe_timestamp;

                                            return(
                                                <>
                                                    {
                                                        (Array.isArray(tableRow))
                                                        ?
                                                            tableRow.map(tableData =>{
                                                                var tagID                   = tableData.at(0); 
                                                                var datum                   = tableData.at(1); 
                                                                var buchungsid              = tableData.at(2)
                                                                var start                   = tableData.at(3);
                                                                var start_timestamp         = tableData.at(4);
                                                                var startbezeichnung        = tableData.at(5); 
                                                                var ende                    = tableData.at(6);
                                                                var ende_timestamp          = tableData.at(7); 
                                                                var endbezeichnung          = tableData.at(8);

                                                                var arbeitszeit             = tableData.at(11);
                                                                var pausenzeit              = tableData.at(18);
                                                                var pausenzeit_timestamp    = tableData.at(19);
                                                                var today                   = false;

                                                                count++;

                                                                if(count === 1){
                                                                    /* Werte nur in tableRow[0] enthalten */ 
                                                                    tagessumme                  = tableData.at(9);
                                                                    tagessumme_timestamp        = tableData.at(10);
                                                                    notiz                       = tableData.at(13);
                                                                    bestBenutzer                = tableData.at(14);
                                                                    status                      = tableData.at(15);
                                                                    wochentag                   = tableData.at(16);
                                                                    pausenzeit_summe            = tableData.at(20);
                                                                    pausenzeit_summe_timestamp  = tableData.at(21);
                                                                    
                                                                    /* Prüfen ob Heute */
                                                                    var datum_timestamp     = tableData.at(17);
                                                                    var todayOBJ            = new Date();

                                                                    todayOBJ.toLocaleString("de-DE");
                                                                    todayOBJ.setUTCHours(-2, 0, 0, 0);
                                                                    
                                                                    var todayTimestamp = (Math.round(todayOBJ.getTime() / 1000));
                                                                    
                                                                    if(todayTimestamp == datum_timestamp){
                                                                        today = true;
                                                                    }
                                                                    
                                                                    return(
                                                                        <>
                                                                            <th id={"tblDay_" + tagID} rowSpan={(tableRow.length * 2) + 1} className="tblHeader tableBorderTop">
                                                                                
                                                                                {
                                                                                    datum + " [" + wochentag + "]"
                                                                                }
                                                                                
                                                                                {
                                                                                    (tagessumme_timestamp > 0) 
                                                                                    ?
                                                                                       (pausenzeit_summe_timestamp > 0)
                                                                                        ?
                                                                                            <>
                                                                                                <p>
                                                                                                    {"Arbeitszeit Gesamt: (" + tagessumme + ")"}
                                                                                                    <p className={getBreakTimeColor(pausenzeit_summe_timestamp, tagessumme_timestamp)}>
                                                                                                        {"Pause Gesamt: (" + pausenzeit_summe + ")"}
                                                                                                    </p>
                                                                                                </p>
                                                                                            </>
                                                                                               
                                                                                        :
                                                                                            <>
                                                                                                <p>
                                                                                                    {"Arbeitszeit Gesamt: (" + tagessumme + ")"}
                                                                                                    <p className={getBreakTimeColor(0, tagessumme_timestamp)}>
                                                                                                        {"Pause Gesamt: (00:00:00)"}
                                                                                                    </p>
                                                                                                </p>
                                                                                            </>
                                                                                    :
                                                                                        "" 
                                                                                }
                                                                                
                                                                                {
                                                                                    (Array.isArray(bestBenutzer) && status == 1) 
                                                                                    ?
                                                                                        <div className="noticeFieldHeader">
                                                                                            <span>Erhalt Bestätigt: </span>
                                                                                            
                                                                                            <p>
                                                                                                <span><User></User></span>
                                                                                                ({bestBenutzer[0].vorname} {bestBenutzer[0].name})
                                                                                                {" " + bestBenutzer[0].email}
                                                                                            </p>
                                                                                            
                                                                                            {
                                                                                                (bestBenutzer[0].datum != "0000-00-00") 
                                                                                                ?
                                                                                                    " Am: " + bestBenutzer[0].datum 
                                                                                                :
                                                                                                    ""
                                                                                            }
                                                                                        </div> 
                                                                                    : 
                                                                                        ""
                                                                                }

                                                                                {
                                                                                    /* Notiz + Input */
                                                                                    (notiz)
                                                                                    ?
                                                                                        <>
                                                                                            <div className="noticeFieldHeader">
                                                                                                Notiz: 
                                                                                                    <p id={"notiz_" + tagID}>{notiz}</p>
                                                                                            </div>

                                                                                            <div>
                                                                                                <button type="button" className="btn btn-primary" id={"btnEditNote_" + tagID} onClick={ () => { {showInput(tagID, notiz);} } } ><span><NotePencil></NotePencil></span> Notiz bearbeiten</button>
                                                                                            </div>
                                                                                        </>
                                                                                    :
                                                                                        <div className="noticeFieldHeader">
                                                                                            <p>
                                                                                                <span id={"notiz_" + tagID}> </span><br />
                                                                                                <button type="button" className="btn btn-primary" id={"btnEditNote_" + tagID} onClick={ () => { {showInput(tagID);} } } ><span><Note></Note></span> Notiz erfassen</button>
                                                                                            </p>
                                                                                        </div>
                                                                                }
                                                                                
                                                                                <div id={"textInput_" + tagID} className="border d-none">
                                                                                    <p>
                                                                                        <input type="text" id={"txt_" + tagID} className="form-control form-control-sm" /><br />
                                                                                        <button id={"btn_" + tagID} className="btn btn-primary btn-sm" onClick={ () => { {saveComment(tagID);} } } >Speichern</button><span> </span>
                                                                                        <button id={"btnClose_" + tagID} onClick={ () => { {hideInput(tagID);} } } className="btn btn-danger btn-sm">Schließen</button>
                                                                                    </p>
                                                                                </div>
                                                                                
                                                                                {
                                                                                    /* Erhalt bestätigen */
                                                                                    (userSection == "Personalwesen" && status == 0 && workerID > 0 && !today) 
                                                                                    ?
                                                                                        <div>
                                                                                            <button type="button" id={"btnConf_" + tagID} className="btn btn-success" onClick={ () => { {confirmEntry(tagID);} } }><span><SealCheck></SealCheck></span> Erhalt bestätigen</button>
                                                                                        </div> 
                                                                                    :
                                                                                        ""
                                                                                }
                                                                                
                                                                                {
                                                                                    /* Zeiteintrag Buttons */
                                                                                    (status == 0 || userSection == "Personalwesen")
                                                                                    ? 
                                                                                        (tagessumme_timestamp == 0) 
                                                                                        ?
                                                                                            <p>
                                                                                                <button type="button" className="btn btn-primary " onClick={ () => { {showNewInsertTime(tagID);} } } ><span><CalendarPlus></CalendarPlus></span> Buchung Erfassen</button>
                                                                                            </p> 
                                                                                        :
                                                                                            <p>
                                                                                                <div>
                                                                                                    <button type="button" className="btn btn-primary " onClick={ () => { {showEditTime(tagID);} } } ><span><List></List></span> Zeiteinträge bearbeiten</button>
                                                                                                </div>
                                                                                                    
                                                                                                <br />
                                                                                                
                                                                                                <div>
                                                                                                    <button type="button" className="btn btn-primary" onClick={ () => { {showInsertTime(tagID);} } } ><span><CalendarPlus></CalendarPlus></span> Zeit manuell eintragen</button>
                                                                                                </div>
                                                                                            </p>
                                                                                    :
                                                                                        ""
                                                                                }

                                                                                <div id={"successMSG_" + tagID} className="alert alert-success d-none" role="alert"></div>
                                                                                <div id={"errorMSG_" + tagID} className="alert alert-danger d-none" role="alert"></div>

                                                                            </th>
                                                                            {
                                                                                (tagessumme_timestamp == 0) 
                                                                                ? 
                                                                                    <tr className="tableBorderTop">
                                                                                        <td colSpan="6">Keine Erfassungen
                                                                                            {
                                                                                                (() => {
                                                                                                    if(!bestBenutzer.length){
                                                                                                        return(
                                                                                                            <>
                                                                                                                <div className="d-none text-center" id={"insertDayTime_" + tagID}>
                                                                                                                    
                                                                                                                    <label className="lblEntryBox">Start: </label>
                                                                                                                    
                                                                                                                    <p></p>
                                                                                                                    
                                                                                                                    <input type="time" id={"start_" + tagID} data-datum={datum} min="07:45" max="18:30"></input>

                                                                                                                    <p></p>
                                                                                                                    
                                                                                                                    <label className="lblEntryBox">Stop: </label>
                                                                                                                    
                                                                                                                    <p></p>

                                                                                                                    <input type="time" id={"stop_" + tagID} data-datum={datum} min="07:45" max="18:30"></input><br />
                                                                                                                     
                                                                                                                    <p></p>

                                                                                                                    <select id={"stopBezeichnung_" + tagID} className="form-select-sm" aria-label="Default select example">
                                                                                                                        <option value="Pause">Pause</option>
                                                                                                                        <option value="Feierabend">Feierabend</option>
                                                                                                                    </select>

                                                                                                                    <p></p>
                                                                                                                    
                                                                                                                    <button type="button" className="btn btn-primary btn-sm" onClick={ () => { {setNewEntryForEmpty(tagID);} } }>Speichern</button><span> </span>
                                                                                                                    <button type="button" className="btn btn-danger btn-sm" onClick={ () => { {closeNewEntry(tagID);} } }>Schließen</button>
                                                                                                                </div>
                                                                                                            </>
                                                                                                            
                                                                                                        );
                                                                                                    }
                                                                                                    
                                                                                                })()
                                                                                            }
                                                                                        </td>
                                                                                    </tr> 
                                                                                :
                                                                                    <tr id={"tblBooking_" + buchungsid} className="tableBorderTop">
                                                                                        
                                                                                        <td id={"start" + buchungsid}>
                                                                                            {start}

                                                                                            <span> </span>
                                                                                            
                                                                                            <input type="time" id={"eStart_" + buchungsid} className={"eDay_" + tagID + " d-none"} data-datum={datum} min="07:45" max="18:30"></input>
                                                                                        </td>

                                                                                        <td>

                                                                                            {
                                                                                                (!ende_timestamp && endbezeichnung == "")
                                                                                                ?
                                                                                                    <div className="spinner-grow spinner-grow-sm text-danger timeSpinner" role="status"><span className="sr-only" alt="Erfassung laufend.." title="Erfassung stoppen"></span></div>
                                                                                                :
                                                                                                    ende
                                                                                            }
                                                                                            
                                                                                            <span> </span>

                                                                                            <input type="time" id={"eStop_" + buchungsid} className={"eDay_" + tagID + " d-none"} data-datum={datum} min="07:45" max="18:30"></input>
                                                                                            
                                                                                            <select id={"eSelectStop_" + buchungsid} className={"eDay_"+ tagID + " form-select d-none"}>

                                                                                                <>
                                                                                                    <option value="Pause">Pause</option>
                                                                                                    <option value="Feierabend">Feierabend</option>
                                                                                                </>

                                                                                            </select>

                                                                                        </td>

                                                                                        <td>
                                                                                            <button type="button" onClick={ () => { {editUserTime(buchungsid, tagID, endbezeichnung);} } } className={"btn btn-primary btn-xs d-none btnEdit_" + tagID}><span><Pencil></Pencil></span> Buchung bearbeiten</button><span> </span>
                                                                                            <button type="button" onClick={ () => { {deleteUserTime(buchungsid);} } } className={"btn btn-danger btn-xs d-none btnDel_" + tagID} data-tag={tagID} id={"btnDel_" + buchungsid}><span><Trash></Trash></span> Buchung löschen</button>    
                                                                                        </td>

                                                                                        <td>
                                                                                            {
                                                                                                (arbeitszeit)
                                                                                                ?
                                                                                                    "(" + arbeitszeit + ")"
                                                                                                :
                                                                                                    ""
                                                                                            }
                                                                                        </td>
                                                                                        
                                                                                        <td id={"iEntry_" + tagID} rowSpan={(tableRow.length * 2)}>
                                                                                            <div className="d-none insertEntryBox text-center" id={"insertTime_" + tagID}>
                                                                                                <label className="lblEntryBox" htmlFor={"existingStart_" + tagID}>Start:</label>
                                                                                                
                                                                                                <p></p>
                                                                                                
                                                                                                <input type="time" id={"existingStart_" + tagID} data-datum={datum} min="07:45" max="18:30"></input>

                                                                                                <p></p>
                                                                                                
                                                                                                <label className="lblEntryBox" htmlFor={"existingStop_" + tagID}>Stop:</label>
                                                                                                
                                                                                                <p></p>
                                                                                                
                                                                                                <input type="time" id={"existingStop_" + tagID} data-datum={datum} min="07:45" max="18:30"></input><br />
                                                                                                
                                                                                                <p></p>

                                                                                                <select id={"existingStopBezeichnung_" + tagID} className="form-select-sm" aria-label="Default select example">
                                                                                                    <option value={"Pause"}>Pause</option>
                                                                                                    <option value={"Feierabend"}>Feierabend</option>
                                                                                                </select>
                                                                                                
                                                                                                <p></p>

                                                                                                <button type="button" className="btn btn-primary btn-sm" onClick={ () => { {setEntryExisting(tagID);} } }>Speichern</button> <span> </span>
                                                                                                <button type="button" className="btn btn-danger btn-sm" onClick={ () => { {closeExistingEntry(tagID);} } }>Schließen</button>
                                                                                            </div>

                                                                                            <br/>

                                                                                            <div id={"successExistingMSG_" + tagID} className="alert alert-success d-none" role="alert"></div>
                                                                                            <div id={"errorExistingMSG_" + tagID} className="alert alert-danger d-none" role="alert"></div>
                                                                                        </td> 
                                                                                    </tr>
                                                                            }

                                                                            {
                                                                                <tr>
                                                                                    <td colSpan="6" className="text-center">{(endbezeichnung) ?  (pausenzeit_timestamp > 0 && pausenzeit != "") ? endbezeichnung + " (" + pausenzeit + ")" : endbezeichnung : ""}</td>
                                                                                </tr>
                                                                            }
                                                                        </>
                                                                    );
                                                                }

                                                                return(
                                                                    <>
                                                                        {
                                                                            (tagessumme_timestamp == 0) 
                                                                            ?
                                                                                <tr className="tableBorderTop"><td colSpan="6">Keine Erfassungen<p>Jetzt Erfassen</p></td></tr>
                                                                            : 
                                                                                <tr id={"tblBooking_" + buchungsid} className="tableBorderTop">
                                                                                    
                                                                                    <td>
                                                                                        {start}

                                                                                        <span> </span>

                                                                                        <input type="time" id={"eStart_" + buchungsid} className={"eDay_" + tagID + " d-none"} data-datum={datum} min="07:45" max="18:30"></input>
                                                                                    </td>

                                                                                    <td>
                                                                                        {
                                                                                            (!ende_timestamp && endbezeichnung == "") 
                                                                                            ?
                                                                                                <div className="alert alert-danger" role="alert">Erfassung läuft...</div> 
                                                                                            :
                                                                                                ende
                                                                                        }

                                                                                        <span> </span>
                                                                                        
                                                                                        <input type="time" id={"eStop_" + buchungsid} className={"eDay_" + tagID + " d-none"} data-datum={datum} min="07:45" max="18:30"></input>
                                                                                        
                                                                                        <select id={"eSelectStop_" + buchungsid} className={"eDay_" + tagID + " form-select d-none"}>
                                                                                     
                                                                                            <>
                                                                                                <option value="Pause">Pause</option>
                                                                                                <option value="Feierabend">Feierabend</option>
                                                                                            </>
                                                                                
                                                                                        </select>
                                                                                        
                                                                                    </td>

                                                                                    <td>
                                                                                        <button type="button" onClick={ () => { {editUserTime(buchungsid, tagID, endbezeichnung);} } } className={"btn btn-primary btn-xs d-none btnEdit_" + tagID}><span><Pencil></Pencil></span> Buchung bearbeiten</button><span> </span>
                                                                                        <button type="button" onClick={ () => { {deleteUserTime(buchungsid);} } } className={"btn btn-danger btn-xs d-none btnDel_" + tagID} id={"btnDel_" + buchungsid} data-tag={tagID}><span><Trash></Trash></span> Buchung löschen</button>
                                                                                    </td>
                                                                                    
                                                                                    <td>
                                                                                        {
                                                                                            (arbeitszeit)
                                                                                            ?
                                                                                                "(" + arbeitszeit + ")" 
                                                                                            :
                                                                                                ""
                                                                                        }
                                                                                    </td>
                                                                                
                                                                                </tr>
                                                                        }

                                                                        {
                                                                            <tr>
                                                                                <td colSpan="6" className="text-center">{(endbezeichnung) ?  (pausenzeit_timestamp > 0 && pausenzeit != "") ? endbezeichnung + " (" + pausenzeit + ")" : endbezeichnung : ""}</td>
                                                                            </tr>
                                                                        }
                                                                    </>
                                                                );
                                                                
                                                            })
                                                        :
                                                            <tr></tr>
                                                    }
                                                </>
                                            );
                                        })
                                    :
                                        <tr>
                                            <td colSpan="6" className="text-center">Leer</td>
                                        </tr>
                            }
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
                        <button className="btn btn-primary" onClick={ () => { {navigate("/start");} } }>Zurück zu start</button>
                    </div>

                </>
            )
        }
    }
}
export default Arbeitszeiten