/* Style */
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Alert, Breadcrumb, Card, Form} from 'bootstrap';

/* Icons */
import {Alarm, Users, User, Play, Calendar, Table, Prohibit, ClockClockwise, LockKeyOpen, Chats, Key, Clock, X, Briefcase} from "@phosphor-icons/react";

/* React */
import React, {Component} from 'react';
import {useState, useEffect} from "react";

/* JQuery */
import $, { map } from "jquery";

/* Axios*/
import axios from "axios";

/* CSV-Downloader */
import { CSVLink, CSVDownload } from "react-csv";

/* Crypto-JS */
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

/* Router */
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import {useNavigate} from 'react-router-dom'

/* TimePicker */
import TimePicker from 'react-time-picker';

/* Pages */
import NavigationBar from "../parts/navbar"
import Layout from "../parts/layout"

function Start(){
    document.title = "Startseite";
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
        0 : ["Fehler aufgetreten!", "red"],
        1 : ["Erfolgreich!", "#60c860"],
        2 : ["Erfolgreich registriert!", "#60c860"],
        4 : ["Falsches Passwort", "red"],
        8 : ["Ungültiger Zugang - Bitte anmelden!", "red"],
        16 : ["Leeres Feld eingegeben", "red"],
        32 : ["Benutzer gefunden", "#60c860"],
        64 : ["Benutzer ausgeloggt", "#60c860"],
        128 : ["Benutzer existiert bereits", "red"],
        256 : ["Server zurzeit nicht erreichbar", "red"],
        512 : ["Server Meldet Fehler! - Bitte den Administrator aufsuchen", "red"],
        1024 : ["Passwort wurde nicht geändert!", "red"],
        2048 : ["E-Mail wurde nicht geändert!", "red"],
        4096 : ["Benutzer erfolgreich bearbeitet", "green"],
        8192 : ["Sie haben leider keine Berechtigung für diese Aktion!", "red"],
        999 : ["Dieser Benutzer muss von einem Admin freigeschaltet werden!", "red"],
    }

	/* User-Daten Variablen */
    const [userID, setUserID] = useState();
    const [userEmail, setUserEmail] = useState();
    const [userFirstname, setUserFirstname] = useState();
    const [userLastname, setUserLastname] = useState();
    const [userSection, setUserSection] = useState();
    const [userSectionID, setUserSectionID] = useState();
    const [userHours, setUserHours] = useState();

	/* Zeittabelle Variable */
    const [timeArray, setTimeArray] = useState([]);
	
	/* Fehler Variable */
    const [error, setError] = useState();

    const [currentTrackingID, setTrackingID] = useState();
    const [dayID, setDayID] = useState();

    const [userBookings, setUserBookings] = useState([]);
    const [userComments, setUserComments] = useState([]);
    const [inactivatedUsers, setInactivatedUser] = useState([]);

    const [allSections, setSectionArray] = useState("");


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

			/* POST-Anfrage - Parameter */
            const postData = JSON.stringify(formObj);
            const params = new URLSearchParams();

            params.append('postData', postData);
            params.append('action', "checkUser");
            params.append('getSections', 1);

            /* Anfrage an Server */
            const getData = async () => {

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

						/* Objekt aus Benutzerdaten & Arbeitszeiten */
						const userData = ((typeof data.userData != undefined && data.userData) ? data.userData : []);
						const userTime = ((typeof data.userTime != undefined && data.userTime) ? data.userTime : []);
                        const getUserSections = ((typeof data.sectionData != undefined && data.sectionData) ? data.sectionData : []);

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
                            
                            setSectionArray(getUserSections);
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
                    
                    console.log(error);
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
        getUserPage();
    }, []);

    function getUserPage(){
        const getTable  = async () => {
            /* POST-Anfrage - Parameter */
            const formObj = {
               "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            }

           const postData = JSON.stringify(formObj);
           const params = new URLSearchParams();

           params.append('postData', postData);
           params.append('action', "userDashboard");

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
                const userData = ((typeof data.userData.userData != undefined && data.userData.userData) ? data.userData.userData : []);

                var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);

                /* Fehlermeldung */
                var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

				console.log(serverResult);
				console.log(data);

                if(userData.status == INACTIVE_USER || userData.status == NO_USER_FOUND){
                    localStorage.setItem("loginMSG", outputTxt);
                    navigate("/logout");
                }
                

				if(typeof data === 'object'){
                    /* Zeittabelle */
                    setTimeArray(userT);

                    console.log(outputTxt);

                    if(userData.bezeichnung == "Personalwesen"){
                        const getUserComments = ((typeof data.userComments != undefined && data.userComments) ? data.userComments : []);
                        const getUserBookings = ((typeof data.userBookings != undefined && data.userBookings) ? data.userBookings : []);
                        const getInactivatedUsers = ((typeof data.inactivatedUsers != undefined && data.inactivatedUsers) ? data.inactivatedUsers : []);

                        if(typeof getUserComments === 'object'){
                            if(getUserComments.status == SUCCESS){
                                setUserComments(getUserComments.comments);
                            }
                            else{
                                if(getUserComments.status == NO_PERMISSION){
                                    localStorage.setItem("loginMSG", errorTxt[getUserComments.status][0]);
                                    navigate("/logout");
                                }
                            }
                        }

                        if(typeof getUserBookings === 'object'){
                            if(getUserBookings.status == SUCCESS){
                                setUserBookings(getUserBookings.bookings);
                            }
                            else{
                                if(getUserBookings.status == NO_PERMISSION){
                                    localStorage.setItem("loginMSG", errorTxt[getUserBookings.status][0]);
                                    navigate("/logout");
                                }
                            }
                        }

                        if(typeof getInactivatedUsers === 'object'){
                            if(getInactivatedUsers.status == SUCCESS){
                                setInactivatedUser(getInactivatedUsers.inactivatedUsers);
                            }
                        }
                        else{
                            if(getInactivatedUsers.status == NO_PERMISSION){
                                localStorage.setItem("loginMSG", errorTxt[getInactivatedUsers.status][0]);
                                navigate("/logout");
                            }
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

                console.log(errorReport);
                console.log(msgError);

                if(msgError.message != ""){
                    console.log(msgError.message + "(" + SERVER_ERROR + ")");
                    setError(msgError.message);
                }
           })
       }
       getTable();
    }


    /* Time Tracking */
    function timeTracking(selectValue){
        $('#startTrackingBtn').html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span><span class='sr-only'></span>");
        $('#stopTrackingBtn').html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span><span class='sr-only'></span>");
        
        $('#startTrackingBtn').prop("disabled", true);
        $('#stopTrackingBtn').prop("disabled", true);

        /* POST-Anfrage - Parameter */
        const formObj = {
            "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            "trackingName" : selectValue,
            "dayID" : ((typeof dayID != undefined && dayID) ? dayID : 0)
        }

        const postData = JSON.stringify(formObj);
        const params = new URLSearchParams();

        params.append('postData', postData);
        params.append('action', "timeTracking");

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
            
            /* Statuscode */
            var statusCode = ((typeof data.status != undefined && data.status) ? data.status : 0);
            
            /* Fehlermeldung */
            var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
            var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");
            
            console.log(serverResult);
            console.log(data);

            console.log(outputTxt);

            if(statusCode == SUCCESS){
                setTimeout( () => { navigate("/arbeitszeiten"); }, 1000)
            }
            else{
                if(statusCode == INACTIVE_USER || statusCode == NO_USER_FOUND){
                    localStorage.setItem("loginMSG", outputTxt);
                    navigate("/logout");
                }
                else{
                    $('#startTrackingBtn').addClass("btn-danger");
                    $('#stopTrackingBtn').addClass("btn-danger");

                    /* Fehlermeldung ausgeben */
                    setError(outputTxt);

                    setTimeout(function() {
                        navigate("/arbeitszeiten");
                    }, 2000);
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
                setError(msgError.message);
            }
        })
    }

    function activateUser(id, email){
        $('#sectionInput').data("sectionForUser", id);
        $('#selectBoxBtn').removeClass("d-none");

        $('#userEmail').html("Benutzer: " + email);

        window.scrollTo({top: 0, behavior: 'smooth'});

        function blink() {
            $('#selectBoxBtn').fadeOut(500).fadeIn(500);
        };
        blink();
    }

    function closeActivateUser(){
        $('#selectBoxBtn').addClass("d-none");
        $('#userEmail').html("");
    }

    function showBooking(id, name, tagID){
        localStorage.setItem("showUserTime", id);
        localStorage.setItem("showUserName", name);
        localStorage.setItem("showBookings", tagID);

        navigate("/arbeitszeiten");
    }

    function changeUserSection(value){
        var userID = $('#sectionInput').data("sectionForUser");
        var value = $('#sectionInput').val();
        
        /* POST-Anfrage - Parameter */
        const formObj = {
            "lCode" : ((typeof localStorage.getItem("user") != undefined && localStorage.getItem("user")) ? localStorage.getItem("user") : ""),
            "userID" : userID,
            "userSection" : value,
            "uStatus" : 1
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
                const updateInactivatedUsers = ((typeof data.inactivatedUsers != undefined && data.inactivatedUsers) ? data.inactivatedUsers : []);

                /* Fehlermeldung */
                var outputTxt   = ((typeof errorTxt[statusCode][0] != undefined && errorTxt[statusCode][0]) ? errorTxt[statusCode][0] : "");
                var outputColor = ((typeof errorTxt[statusCode][1] != undefined && errorTxt[statusCode][1]) ? errorTxt[statusCode][1] : "red");

                console.log(outputTxt);
                /* ToDo: Ausgabe */
                if(statusCode === SUCCESS){
                    /* nach oben scrollen und ausgeben und mitarbeiter aus liste löschen */
                    $('#mainSuccessMSG').removeClass('d-none');
                    $('#mainSuccessMSG').text("Mitarbeiter ist erfolgreich aktiviert worden!");
                    
                    setTimeout( () => {
                        $('#mainSuccessMSG').addClass('d-none');
                    }, 2000)

                    setInactivatedUser(updateInactivatedUsers);
                    closeActivateUser();
                    
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
                else{

                    if(statusCode === NO_PERMISSION || statusCode == NO_USER_FOUND || statusCode == INACTIVE_USER){
                        localStorage.setItem("loginMSG", outputTxt);
                        navigate("/logout");
                    }
                    setTimeout( () => {
                        /* Nach oben scroll + fehlerausgabe */
                        $('#mainErrorMSG').removeClass('d-none');
                        $('#mainErrorMSG').text("Tag konnte nicht angelegt werden!");
                            
                        setTimeout( () => {
                            $('#mainErrorMSG').addClass('d-none');
                        }, 3000)

                        window.scrollTo({top: 0, behavior: 'smooth'});
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
        

    if(typeof error != undefined && error){
        return(
            <>
                <Layout />
                <div className="p-5 text-center">
                    <h4 className="mb-3">{error}</h4>
                    Kontakt: <a href="mailto:it.support@modelcarworld.de">it.support@modelcarworld.de</a>
                    
                    <br /><br />
                        
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary" onClick={ () => { {navigate(0);} } }>Zurück zu start</button>
                    </div>

                </div>
            </>
        )
    }
    else{
        if((typeof userID != undefined && userID)){
            /* Array mit den Key = Tag-IDs, Value = Reihe */
            const objKeys = Object.entries(timeArray).reverse();
        
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
                        rowIndex.datum_timestamp
                    ];
                    x++;
                });
                i++;
            });

            console.log("<<<<----- [Table-Array] ----->>>>");
            console.log(tableArray);
            console.log("<<<<----------->>>>");
            
            var titleButton = "";
            var inactiveButton = false;
            var gestartet = false;
            

            if(Array.isArray(tableArray)){
                var tabArray = tableArray[0];

                if(Array.isArray(tabArray)){
                    var tabInnerArray = tabArray[(tabArray.length > 0) ? tabArray.length - 1 : tabArray.length];

                    if(Array.isArray(tabInnerArray)){
                        if(tabInnerArray.at(8) == "Feierabend"){
                            /* Letzte Erfassung - Feierabend */
                            titleButton = "Erfassung nach Feierabend nicht Möglich!";
                            inactiveButton = true;
                        }

                        var nowOBJ = new Date();

                        var datum = tabInnerArray.at(1);
                        const date = datum.split(".");
                        
                        const day = date[0];
                        const month = date[1];
                        const year = date[2];
                        
                        var dateString = year + "-" + month + "-" + day;

                        var vonOBJ = new Date(dateString + " 07:45");
                        var bisOBJ = new Date(dateString + " 18:30");

                        var vonTimestamp = Math.round(vonOBJ.getTime() / 1000);
                        var bisTimestamp = Math.round(bisOBJ.getTime() / 1000);
                        var nowTimestamp = Math.round(nowOBJ.getTime() / 1000);


                        if(vonTimestamp < nowTimestamp && bisTimestamp > nowTimestamp){}else{
                            /* Muss zwischen 07:45 Uhr und 18:30 Uhr */
                            titleButton = "Erfassung außerhalb des Möglichen Zeitraums!";

                            inactiveButton = true;
                            gestartet = false;
                        }
                        
                        if(tabInnerArray.at(4) > 0 && tabInnerArray.at(2) > 0 && tabInnerArray.at(7) == 0){
                            /* Erfassung bereits begonnen */
                            gestartet = true;
                        }
                    }
                    else{
                        inactiveButton = false;
                        gestartet = false;
                    }
                }
                else{
                    inactiveButton = false;
                    gestartet = false;
                }
            }
            else{
                inactiveButton = false;
                gestartet = false;
            }
              
            return(
                <>
                <NavigationBar />
                <Layout />

                    <div className="smallHeaderHomepage">
                    
                    <div id={"mainSuccessMSG"} className="alert alert-success d-none" role="alert">Test</div>
                    <div id={"mainErrorMSG"} className="alert alert-danger d-none" role="alert">Test</div>

                        <h3><span><Alarm></Alarm></span> Zeiterfassung</h3>
                        {
                            (inactiveButton) 
                            ?
                                <button className="btn btn-primary" type="button" title={titleButton} disabled><span><span><Prohibit></Prohibit></span> Erfassung nicht möglich!</span></button>
                            :
                                (gestartet) 
                                ?
                                    <button onClick={ () => { {$('#stopTracking').removeClass("d-none");} } } id="stopTrackingBtn" className="btn btn-primary" type="button" info={titleButton}><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Laufende Erfassung Stoppen...</button>
                                :
                                    <button onClick={ () => { {timeTracking("Start");} } } id="startTrackingBtn" className="btn btn-primary" type="button" info={titleButton}><span><span><Play></Play></span> Erfassung starten</span></button>
                        }
                    </div>

                    <br />
                    
                    <div className="h-100 d-flex align-items-center justify-content-center container d-none" id="stopTracking">

                        <div className="h-100 d-flex align-items-center justify-content-center container">
                            <select id="stopBezeichnung" className="form-select">
                                <option value="Pause">Pause</option>
                                <option value="Feierabend">Feierabend</option>
                            </select>
                        </div>

                        <div className="h-100 d-flex align-items-center justify-content-center container">
                            <button type="button" className="btn btn-primary" onClick={ () => { {timeTracking($('#stopBezeichnung').find(":selected").val());$('#stopTracking').addClass("d-none");} } } >Bestätigen</button>
                        </div>

                    </div>
                    
                    <div className="userInfo">
                        {
                            (userEmail) 
                            ?
                                "Angemeldet als: " + userEmail + " (" + userFirstname + " " + userLastname + ")" 
                            :
                                ""
                        }
                    </div>
                    
                    <div>
                        <table className="table startTable">

                            <thead>
                                <tr>
                                    <th id="headDate" scope="col">Datum</th>
                                    <th scope="col">Zeit Von</th>
                                    <th scope="col">Zeit Bis</th>
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

                                            return(
                                                <>
                                                    {
                                                        Array.isArray(tableRow) 
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
                                                                
                                                                count++;
                                                                
                                                                if(start_timestamp > 0 && ende_timestamp == 0 && !currentTrackingID){
                                                                    setTrackingID(buchungsid);
                                                                }
                                                                
                                                                if(count === 1){
                                                                    /* Werte nur in tableRow[0] enthalten */ 
                                                                    tagessumme              = tableData.at(9);
                                                                    tagessumme_timestamp    = tableData.at(10);
                                                                    notiz                   = tableData.at(13);
                                                                    bestBenutzer            = tableData.at(14);
                                                                    status                  = tableData.at(15);
                                                                    wochentag               = tableData.at(16);

                                                                    if(!dayID && tagID > 0){
                                                                        setDayID(tagID);
                                                                    }
                                                                    
                                                                    return(
                                                                        <>
                                                                            <th id={tagID} rowSpan={(tableRow.length * 2) + 1} className="tblHeader tableBorderTop">
  
                                                                                {
                                                                                    datum + " [" + wochentag + "]"
                                                                                }
                                                                                
                                                                                {
                                                                                    (tagessumme_timestamp > 0) 
                                                                                    ?
                                                                                        <p>
                                                                                            {"(" + tagessumme + ")"}
                                                                                        </p>
                                                                                    :
                                                                                        ""
                                                                                }

                                                                                {
                                                                                    /* Notiz + Input */
                                                                                    (notiz)
                                                                                    ?
                                                                                        <div className="noticeFieldHeader">
                                                                                            Notiz:
                                                                                            <p id={"notiz_" + tagID}>{notiz}</p>
                                                                                        </div>
                                                                                    :
                                                                                        <p></p>
                                                                                }

                                                                            </th>

                                                                            {
                                                                                (tagessumme_timestamp == 0) 
                                                                                ?
                                                                                    <tr className="tableBorderTop startTableCells"><td colSpan="6">Keine Erfassungen Heute</td></tr>
                                                                                : 
                                                                                    <tr id={buchungsid} className="tableBorderTop">

                                                                                        <td className="startTableCells" id={"start" + buchungsid}>
                                                                                            {start}
                                                                                        </td>

                                                                                        <td className="startTableCells">
                                                                                            {
                                                                                                (!ende_timestamp && endbezeichnung == "") 
                                                                                                ?
                                                                                                    <div className="spinner-grow spinner-grow-sm text-danger timeSpinner" role="status"><span className="sr-only" alt="Erfassung stoppen" title="Erfassung stoppen"></span></div> 
                                                                                                :
                                                                                                    ende
                                                                                            }
                                                                                        </td>

                                                                                        <td className="startTableCells">
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

                                                                                    <td colSpan="6" className="text-center startTableCells">
                                                                                        {
                                                                                            (endbezeichnung)
                                                                                            ?
                                                                                                endbezeichnung
                                                                                            :
                                                                                                ""
                                                                                        }
                                                                                    </td>

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
                                                                                <tr className="tableBorderTop startTableCells"><td colSpan="6">Keine Erfassungen</td></tr> 
                                                                            : 
                                                                                <tr id={buchungsid} className="tableBorderTop">

                                                                                    <td className="startTableCells">
                                                                                        {start}
                                                                                    </td>

                                                                                    <td className="startTableCells">
                                                                                        {
                                                                                            (!ende_timestamp && endbezeichnung == "")
                                                                                            ?
                                                                                                <div className="spinner-grow spinner-grow-sm text-danger timeSpinner" role="status"><span className="sr-only" alt="Erfassung stoppen" title="Erfassung stoppen"></span></div>
                                                                                            :
                                                                                                ende
                                                                                        }
                                                                                    </td>

                                                                                    <td className="startTableCells">
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

                                                                                <td colSpan="6" className="text-center startTableCells">
                                                                                    {
                                                                                        (endbezeichnung)
                                                                                        ?
                                                                                            endbezeichnung
                                                                                        :
                                                                                            ""
                                                                                    }
                                                                                </td>

                                                                            </tr>
                                                                        }
                                                                    </>
                                                                );
                                                            })
                                                        :
                                                            <tr>
                                                                <td colSpan="6" className="text-center">Leer</td>
                                                            </tr>
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

                    {
                        (() => {
                            
                            if(userSection === "Personalwesen"){
                                return(
                                    <>
                                        <div className="h-100 d-flex align-items-center justify-content-center container">
                                            <button className="btn btn-primary" onClick={ () => { {navigate("/benutzerverwaltung");} } } ><span><Users></Users></span> Zur Benutzerverwaltung ➔</button>
                                        </div>

                                        <div id="selectBoxBtn" className="centerItem d-none border">

                                            <p id="userEmail"></p>

                                            <select className="form-select-sm" name={"sectionInput"} id={"sectionInput"}>                            
                                                {
                                                    (Array.isArray(allSections) && allSections.length > 1)
                                                    ?
                                                    
                                                        allSections.map(section => 
                                                            <option value={section.id}>{section.bezeichnung}</option>
                                                        )
                                                    :
                                                        <option value="5">Buchaltung</option>
                                                }
                                            </select>

                                            <div className="w-100 spaceField"></div>

                                            <button id="selectUserSection" onClick={ () => { {changeUserSection();} } } className="btn btn-primary" type="button"><span><Briefcase></Briefcase></span> Abteilung zuweisen</button><span> </span>
                                            <button className="btn btn-danger" onClick={ () => { {closeActivateUser();} } } ><span><X></X></span> Schließen</button>
                                        
                                        </div>

                                        {
                                            (() => {

                                                if(typeof inactivatedUsers == 'object'){
                                                    if(inactivatedUsers.length){
                                                        return(
                                                            <>
                                                                <div className="container px-4 borderBox">
                                                                <h4 className="boxHeader"><span><LockKeyOpen></LockKeyOpen></span> Mitarbeiter auf der Warteliste</h4> 

                                                                    <div className="row gx-5">

                                                                        <div className="col startPageBox">
                                                                            <table className="table table-hover">
                                                                                <tbody>
                                                                                    {
                                                                                        (Array.isArray(inactivatedUsers))
                                                                                        ?
                                                                                            inactivatedUsers.map(user =>{

                                                                                                var id = user.id;

                                                                                                var email = user.email;

                                                                                                var name = user.vorname;
                                                                                                var nachname = user.name;

                                                                                                var datum = (user.angelegt_am != "0000-00-00") ? user.angelegt_am : "";
                                                                                                
                                                                                                return(
                                                                                                    <>
                                                                                                        <tr>
                                                                                                            <td className="startpageTable">
                                                                                                                <span><User></User></span> {email}
                                                                                                            </td>

                                                                                                            <td className="startpageTable">
                                                                                                                {
                                                                                                                    (datum) 
                                                                                                                    ?
                                                                                                                        <span><Clock></Clock> {datum} </span>
                                                                                                                    :
                                                                                                                        ""
                                                                                                                }
                                                                                                            </td>

                                                                                                            <td className="startpageTable">
                                                                                                                <button onClick={ () => { {activateUser(id, email);} } } className="btn btn-primary btn-sm" type="button"><span><Key></Key></span> Jetzt aktivieren</button>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                );

                                                                                            })
                                                                                        :
                                                                                            <>
                                                                                                <div className="container px-4">
                                                                                                <h4><span><LockKeyOpen></LockKeyOpen></span> Mitarbeiter auf der Warteliste</h4> 
                                                                                                    <p>Keine</p>
                                                                                                </div>
                                                                                            </>
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </>
                                                        );
                                                    }
                                                    else{
                                                        return(
                                                            <>
                                                                <div className="container px-4 borderBox">
                                                                <h4 className="boxHeader"><span><LockKeyOpen></LockKeyOpen></span> Mitarbeiter auf der Warteliste</h4> 
                                                                    <p>Keine</p>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                }
                                            })()
                                        }
                                        
                                        <div className="row gx-5"></div>
                                        
                                        {
                                            (() => {

                                                if(typeof userComments == 'object'){
                                                    if(userComments.length){
                                                        return(
                                                            <>
                                                                <div className="container px-4 borderBox">
                                                                <h4 className="boxHeader"><span><Chats></Chats></span> Mitarbeiter-Notizen</h4> 
                                                                        
                                                                    <div className="row gx-5">

                                                                        <div className="col startPageBox">
                                                                            <table className="table table-hover">
                                                                                <tbody>
                                                                                    {
                                                                                        (Array.isArray(userComments)) 
                                                                                        ?
                                                                                            userComments.map(comment =>{
                                                                                                var id = comment.id;
                                                                                                var datum = comment.datum;
                                                                                                var status = comment.status;
                                                                                                var name = comment.vorname + " " + comment.name;
                                                                                                var notiz = comment.notiz;
                                                                                                var email = comment.email;
                                                                                                var tagid = comment.tagid;

                                                                                                return(
                                                                                                    <>
                                                                                                        <tr>
                                                                                                            <td className="startpageTable">
                                                                                                                <span><User></User> </span>{email}
                                                                                                            </td>
                                                                                                            
                                                                                                            <td className="startpageTable">
                                                                                                                <span><Calendar></Calendar> </span>{datum}
                                                                                                            </td>
                                                                                                            
                                                                                                            <td className="startpageTable">
                                                                                                                <span><Chats></Chats> </span>{notiz}
                                                                                                            </td>
                                                                                                            
                                                                                                            <td className="startpageTable">
                                                                                                                <button className="btn btn-primary" onClick={ () => { {showBooking(id, name, tagid);} } } type="button"><span><Table></Table></span> Buchungen ansehen</button>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                );
                                                                                            })
                                                                                        :
                                                                                            <>
                                                                                                <div className="container px-4">
                                                                                                <h4><span><Chats></Chats></span> Mitarbeiter-Notizen</h4> 
                                                                                                    <p>Keine</p>
                                                                                                </div>
                                                                                            </>
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </>
                                                        );
                                                    }
                                                    else{
                                                        return( 
                                                            <>
                                                                <div className="container px-4 borderBox">
                                                                <h4 className="boxHeader"><span><Chats></Chats></span> Mitarbeiter-Notizen</h4> 
                                                                    <p>Keine</p>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                }
                                            })()
                                        }
                                        
                                        {   
                                            (() => {

                                                if(typeof userBookings == 'object'){
                                                    if(userBookings.length){
                                                        return(
                                                            <>
                                                                <div className="container px-4 borderBox">
                                                                <h4 className="boxHeader"><span><Clock></Clock></span> Unbestätigte Arbeitszeiten</h4>
                                                                    
                                                                    <div className="row gx-5">

                                                                        <div className="col startPageBox">
                                                                            <table className="startpageTable table table-hover">
                                                                                <tbody>
                                                                                    {
                                                                                        (Array.isArray(userBookings)) 
                                                                                        ? 
                                                                                            userBookings.map(booking =>{

                                                                                                var tagid = booking.tagid;
                                                                                                var mID = booking.mitarbeiter_id;

                                                                                                var datum = booking.datum;

                                                                                                var name = booking.vorname + " " + booking.name;

                                                                                                var notiz = booking.notiz;
                                                                                                var email = booking.email;

                                                                                                var tagessumme = booking.tagessumme;
                                                                                                
                                                                                                return(
                                                                                                    <>
                                                                                                        <tr>
                                                                                                            <td className="startpageTable">
                                                                                                                <span><User></User> </span>{email}
                                                                                                            </td>
                                                                                                            
                                                                                                            <td className="startpageTable">
                                                                                                                <span><Calendar></Calendar> </span>{datum}
                                                                                                            </td>
                                                                                                            
                                                                                                            <td className="startpageTable">
                                                                                                                <span><Chats></Chats> </span>{notiz}
                                                                                                            </td>
                                                                                                            
                                                                                                            <td className="startpageTable">
                                                                                                                <span><ClockClockwise></ClockClockwise> </span>{tagessumme}
                                                                                                            </td>
                                                                                                            
                                                                                                            <td className="startpageTable">
                                                                                                               <button className="btn btn-primary" onClick={ () => { {showBooking(mID, name, tagid);} } } type="button"><span><Table></Table></span> Buchungen ansehen</button>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                );
                                                                                            })
                                                                                        :
                                                                                            <>
                                                                                                <div className="container px-4">
                                                                                                <h4><span><Clock></Clock></span> Unbestätigte Arbeitszeiten</h4> 
                                                                                                    <p>Keine</p>
                                                                                                </div>
                                                                                            </>
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </>
                                                        );
                                                    }
                                                    else{
                                                        return( 
                                                            <>
                                                                <div className="container px-4 borderBox">
                                                                <h4 className="boxHeader"><span><Clock></Clock></span> Unbestätigte Zeiten</h4> 
                                                                    <p>Keine</p>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                }
                                            })()
                                        }
                                    </>
                                );
                            }
                        })()
                    }
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
export default Start