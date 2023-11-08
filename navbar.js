/* Style */
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Alert, Breadcrumb, Card, Form} from 'bootstrap';

/* Icons */
import {UserCircle, ChartBar, House, SignOut, Info, Calendar} from "@phosphor-icons/react";

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
import logo from '../mcw_logo.png';

function NavBar(){
    /* Funktion zum Navigieren der Seiten */
    const navigate = useNavigate();

    /* Server Adresse */
    const baseUrl = "https://" + window.location.hostname + "/zeiterfassungsserver/server.php"; 
    
    function logOutNow(){
        localStorage.setItem("loginMSG", "Benutzer abgemeldet!");
        navigate("/logout");
    }

    return(
        <>
            <nav className="navbar navbar-expand-sm bg-light fixed-top">
                <div className="container-fluid">
                    
                    <button className="navbar-toggler" type="button" onClick={() => { {navigate("/start");} } } data-mdb-toggle="collapse" data-mdb-target="#dashboardButton" aria-controls="dashboardButton" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars"><span><House></House></span> Dashboard</i>
                    </button>
                    
                    <button className="navbar-toggler" type="button" onClick={() => { {navigate("/arbeitszeiten");} } } data-mdb-toggle="collapse" data-mdb-target="#userTimesButton" aria-controls="userTimesButton" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars"><span><Calendar></Calendar></span> Arbeitszeiten</i>
                    </button>
                    
                    <button className="navbar-toggler" type="button" onClick={() => { {navigate("/statistiken");} } } data-mdb-toggle="collapse" data-mdb-target="#staticsButton" aria-controls="staticsButton" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars"><span><ChartBar></ChartBar></span> Statistiken</i>
                    </button>
                    
                    <a target="_blank" href={"http://" + window.location.hostname + "/data/handbuch/zeiterfassung_handbuch.pdf"}>
                        <button className="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#userManualButton" aria-controls="userManualButton" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fas fa-bars"><span><Info></Info></span> Benutzerhandbuch</i>
                        </button>
                    </a>

                    <button className="navbar-toggler" type="button" onClick={() => { {navigate("/profile");} } } data-mdb-toggle="collapse" data-mdb-target="#profileButton" aria-controls="profileButton" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars"><span><UserCircle></UserCircle></span> Mein Profil</i>
                    </button>

                    <button className="navbar-toggler" type="button" onClick={() => { {logOutNow();} } } data-mdb-toggle="collapse" data-mdb-target="#logoutButton" aria-controls="logoutButton" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-bars"><span><SignOut></SignOut></span> Logout</i>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navbarExample01">

                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                            <li className="nav-item">
                                <a className="nav-link navButton" onClick={() => { {navigate("/start");} } } ><span><House></House></span> Dashboard</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link navButton" onClick={() => { {navigate("/arbeitszeiten");} } } > <span><Calendar></Calendar></span> Arbeitszeiten</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link navButton" onClick={() => { {navigate("/statistiken");} } } ><span><ChartBar></ChartBar></span> Statistiken</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link navButton" target="_blank" href={"http://" + window.location.hostname + "/data/handbuch/zeiterfassung_handbuch.pdf"} ><span><Info></Info></span> Benutzerhandbuch</a>
                            </li>

                        </ul>

                    </div>
                    
                    <div className="text-center titleDivNavBar">
                        <h2>TimeTracker-MCW <img className="navbarIMG" src={logo} /></h2>
                    </div>
                    
                    <div>

                        <li className="nav-item d-flex">
                            <a className="nav-link navButton" onClick={() => { {navigate("/profile");} } } ><span><UserCircle></UserCircle></span> Mein Profil</a>
                        </li>

                        <li className="nav-item d-flex">
                            <a className="nav-link navButton" onClick={() => { {logOutNow();} } }><span><SignOut></SignOut></span> Logout</a>
                        </li>
                        
                    </div>
                </div>
            </nav>
        </>
        
    )
}
export default NavBar