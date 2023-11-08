/* Style */
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Alert, Breadcrumb, Card, Form} from 'bootstrap';

/* React */
import React, {Component} from 'react';
import {useState, useEffect} from "react";

/* JQuery */
import $ from "jquery";

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

function PageNotFound(){
    document.title = "404";

    /* Server Adresse */
    const baseUrl = "https://" + window.location.hostname + "/zeiterfassungsserver/server.php"; 
    const navigate = useNavigate();

    return(
        <>
            <Layout />
            <h1><center>Seite wurde nicht gefunden!</center></h1>
            <h5><center>Kontakt: <a href="mailto:it.support@modelcarworld.de">it.support@modelcarworld.de</a></center></h5>
                    
            <br /><br />
            
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={() => { {navigate("/start");} } }>Zurück zu start</button>
            </div>
        </>
    )
}
export default PageNotFound