<?php

if(!class_exists("Time")){
    class Time{
        private $autentificationClass;
        
        private $userID;
        private $tagID;
        private $bookingID;

        private $timestamp;

        private $start;
        private $start_bezeichnung;

        private $stop;
        private $stop_bezeichnung;

        private $stundenzahl;
        private $notiz;
        private $datum;
        
        private $mitarbeiterID;


        public function __construct($lCode, $userID=0, $tagID=0, $bookingID=0, $timestamp=0, $start=0, $start_bezeichnung="", $stop=0, $stop_bezeichnung="", $stundenzahl=0, $notiz="", $mitarbeiterID=0){
            
            if($lCode != ""){
                $this->autentificationClass = new Authentification($lCode);
                $db = $this->autentificationClass->getDB();
                
                if($this->autentificationClass->getUserFound()){
                    if($this->autentificationClass->getUserActive()){
                        if($userID > 0){
                            $this->setUserID($userID);
                        }
                        
                        if($tagID > 0){
                            $this->setTagID($tagID);
                        }
                        
                        if($bookingID > 0){
                            $this->setBookingID($bookingID);
                        }
                        
                        if($timestamp > 0){
                            $this->setTimestamp($timestamp);
                        }
                        
                        if($start > 0){
                            $this->setStart($start);
                        }
                        
                        if($start_bezeichnung != ""){
                            $this->setStartBezeichnung($start_bezeichnung);
                        }
                        
                        if($stop > 0){
                            $this->setStop($stop);
                        }
                        
                        if($stop_bezeichnung != ""){
                            $this->setStopBezeichnung($stop_bezeichnung);
                        }
                        
                        if($stundenzahl > 0){
                            $this->setStundenzahl($stundenzahl);
                        }
                        
                        if($notiz != ""){
                            $this->setNotiz($notiz);
                        }

                        if($mitarbeiterID > 0){
                            $this->setMitarbeiterID($mitarbeiterID);
                        }
                    }
                    else{
                        /* Inactive User */
                    }
                }
                else{
                    /* User not Found */
                }
            }
            else{
                /* NO ACCESS! */
            }
        }

        public function __destruct(){

        }
        
        public function getUserID(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->userID;
            }
        }

        public function setUserID($userID){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->userID = $userID;
            }
        }

        public function getTagID(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->tagID;
            }
        }

        public function setTagID($tagID){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->tagID = $tagID;
            }
        }

        public function getBookingID(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->bookingID;
            }
        }

        public function setBookingID($bookingID){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->bookingID = $bookingID;
            }
        }

        public function getTimestamp(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->timestamp;
            }
        }

        public function setTimestamp($timestamp){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->timestamp = $timestamp;
            }
        }

        public function getStart(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->start;
            }
        }

        public function setStart($start){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->start = $start;
            }
        }

        public function getStartBezeichnung(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->start_bezeichnung;
            }
        }

        public function setStartBezeichnung($start_bezeichnung){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->start_bezeichnung = $start_bezeichnung;
            }
        }

        public function getStop(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->stop;
            }
        }

        public function setStop($stop){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->stop = $stop;
            }
        }

        public function getStopBezeichnung(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->stop_bezeichnung;
            }
        }

        public function setStopBezeichnung($stop_bezeichnung){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->stop_bezeichnung = $stop_bezeichnung;
            }
        }

        public function getStundenzahl(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->start;
            }
        }

        public function setStundenzahl($stundenzahl){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->stundenzahl = $stundenzahl;
            }
        }

        public function getNotiz(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->notiz;
            }
        }

        public function setNotiz($notiz){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->notiz = $notiz;
            }
        }
        
        public function getDatum(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->datum;
            }
        }

        public function setDatum($datum){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->datum = $datum;
            }
        }

        public function getMitarbeiterID(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->mitarbeiterID;
            }
        }

        public function setMitarbeiterID($mitarbeiterID){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->mitarbeiterID = $mitarbeiterID;
            }
        }


        public function calculateHoursFromTimestamp(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return gmdate("H:i:s", $this->timestamp);
            }
        }

        public function getWeekDayFromDate($datum){
            $wochenTag = strftime("%A", strtotime($datum));

            return $wochenTag;
        }
        
        public function getTimeTable($onlyToday = false){
            $db = $this->autentificationClass->getDB();

            $userID = $this->getUserID();
            $tagID = $this->getTagID();

            $responseArray = array();
            $currentTimestamp = time();
            
            if($tagID > 0){
                /* Admin staus prüfen */
                if(!$this->autentificationClass->getAdminStatus()){
                    $responseArray['status'] = NO_PERMISSION;
                    return $responseArray;
                }
            }
            else{
                if(!$userID){
                    /* Wenn kein Benutzer übergeben wird den aktuellen benutzer verwenden */
                    $userData = $this->autentificationClass->getUser();
                    $userID = $userData['id'];
                    
                    $this->setUserID($userID);
                }
            }

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    $userTimeQuery = $userTimeArray = array();
                    
                    if($tagID){
                        $selectUserTimeDay= "SELECT id AS tag_id, datum, mitarbeiter_id AS mid, status, notiz FROM ".TAG_TABELLE." WHERE id = '".$tagID."' ORDER BY UNIX_TIMESTAMP(datum) DESC";
                    }
                    else{
                        $selectUserTimeDay = "SELECT id AS tag_id, datum, mitarbeiter_id AS mid, status, notiz FROM ".TAG_TABELLE." WHERE mitarbeiter_id = '".$userID."' ORDER BY UNIX_TIMESTAMP(datum) DESC";
                    }

                    if($onlyToday){
                        $selectUserTimeDay .= " LIMIT 1";
                    }

                    $userTimeQuery = $db->query($selectUserTimeDay);
                    
                    if($userTimeQuery->affectedRows()){
                        $userTimeArray = $db->fetchAll($userTimeQuery);
                    }
        
                    $userAllTimesArray = array();
                    
                    $i = 0;
        
                    if(is_array($userTimeArray) && !empty($userTimeArray)){
        
                        foreach($userTimeArray AS $day){
                            $tagID = $day['tag_id'];
                            $tagDatum = $day['datum'];
                            
                            $userBookingArray = $confirmationUser = $confirmationUserArray = array();
                            
                            /* Alle Zeitbuchungen zu dem Tag erlangen */
                            $selectUserBookings = "SELECT id, tag_id, start, start_bezeichnung, stop, stop_bezeichnung FROM ".ZEIT_TABELLE." WHERE tag_id = '".$tagID."' ORDER BY start ASC";
                            $userBookingQuery = $db->query($selectUserBookings);
                            
                            if($userBookingQuery->affectedRows()){
                                $userBookingArray = $db->fetchAll($userBookingQuery);
                            }
        
                            /* Bestätigungsmitarbeiter bestimmen */
                            $selectConfirmationUser = "SELECT b.id, b.email, b.name, b.vorname, a.datum FROM ".BESTAETIGUNG_TABELLE." AS a, ".MITARBEITER_TABELLE." AS b WHERE a.id_tag = '".$tagID."' AND a.id_mitarbeiter = b.id";
                            $confirmationUser = $db->query($selectConfirmationUser);
        
                            if($confirmationUser->affectedRows()){
                                $confirmationUserArray = $db->fetchAll($confirmationUser);
                            }
        
                            $userAllTimesArray[$tagID][0]['confUser'] = $confirmationUserArray;
                            $userAllTimesArray[$tagID][0]['datum'] = date('d.m.Y', strtotime($tagDatum));
                            $userAllTimesArray[$tagID][0]['datum_timestamp'] = strtotime($tagDatum);
                            $userAllTimesArray[$tagID][0]['wochentag'] = $this->getWeekDayFromDate($tagDatum);
                            $userAllTimesArray[$tagID][0]['status'] = $day['status'];
                            $userAllTimesArray[$tagID][0]['notiz'] = $day['notiz'];

                            $tagessummeArbeit = 0;

                            if(is_array($userBookingArray) && !empty($userBookingArray)){

                                foreach($userBookingArray AS $booking){
                                    /* Arbeitszeiten-Array Zusammenstellung */
                                    $userAllTimesArray[$tagID][$i]['datum'] = date('d.m.Y', strtotime($tagDatum));
                                    $userAllTimesArray[$tagID][$i]['bookingid'] = $booking['id'];
        
                                    $userAllTimesArray[$tagID][$i]['start'] = ($booking['start'] > 0) ? date("H:i:s", $booking['start']) : 0;
                                    $userAllTimesArray[$tagID][$i]['start_timestamp'] = $booking['start'];
                                    
                                    $userAllTimesArray[$tagID][$i]['start_bezeichnung'] = $booking['start_bezeichnung'];
                                    
                                    $userAllTimesArray[$tagID][$i]['ende'] = ($booking['stop'] > 0) ? date("H:i:s", $booking['stop']) : 0;
                                    $userAllTimesArray[$tagID][$i]['ende_timestamp'] = $booking['stop'];
                                    
                                    $userAllTimesArray[$tagID][$i]['end_bezeichnung'] = $booking['stop_bezeichnung'];
        
                                    /* Berechnung der Arbeitszeit */
                                    if($booking['start'] > 0 && $booking['stop'] > 0){
                                        $buchungsZeit = ($booking['stop'] - $booking['start']);   
                                    }
                                    elseif($booking['start'] > 0 && !$booking['stop']){
                                        /* laufende Erfassung */
                                        $buchungsZeit = ($currentTimestamp - $booking['start']);
                                    }
                                    else{
                                        $buchungsZeit = 0;
                                    }
                                    $tagessummeArbeit += ($buchungsZeit);

                                    /* Arbeitszeit von Timestamp in Stunden umrechnen */
                                    $this->setTimestamp($buchungsZeit);
                                    $userAllTimesArray[$tagID][$i]['arbeitszeit'] = $this->calculateHoursFromTimestamp();

                                    $userAllTimesArray[$tagID][$i]['arbeitszeit_timestamp'] = $buchungsZeit;
                                    
                                    $i++;
                                }
                            }

                            /* Arbeitszeit - Tagessumme in Stunden umrechenen*/
                            $this->setTimestamp($tagessummeArbeit);
                            $userAllTimesArray[$tagID][0]['tagessumme'] = $this->calculateHoursFromTimestamp();
                            $userAllTimesArray[$tagID][0]['tagessumme_timestamp'] = $tagessummeArbeit;
                            
                            $i = 0;
                        }
                        
                        /* Möglich Änderungsszeiten bestimmen */
                        $previousBooking = array();
                        $previousKey = 0;
                        
                        foreach($userAllTimesArray AS $key => $day){
                            $lastBooking = 0;
                            $c = $next = $pausenzeitSumme = 0;
                            
                            foreach($day AS $erfassung){
                                
                                $sechsUhrDreizigDesTages = strtotime($erfassung['datum']." 18:30:00");
                                $siebenUhrFuenfUndVierzigDesTages = strtotime($erfassung['datum']." 07:45:00");
                                
                                $jetzt = time();

                                if($erfassung['datum'] == date("d.m.Y", $jetzt)){
                                    $heute = true;
                                }
                                else{
                                    $heute = false;
                                }
                                
                                if($jetzt > $siebenUhrFuenfUndVierzigDesTages){
                                    $jetztNachSiebenUhrFuenfUndVierzig = true;
                                }
                                else{
                                    $jetztNachSiebenUhrFuenfUndVierzig = false;
                                }

                                if($jetzt < $sechsUhrDreizigDesTages){
                                    $jetztVorSechsUhrDreizig = true;
                                }
                                else{
                                    $jetztVorSechsUhrDreizig = false;
                                }

                                if($previousBooking['datum'] == $erfassung['datum']){
                                    $letzteBuchungVomSelbenTag = true;
                                }
                                else{
                                    $letzteBuchungVomSelbenTag = false;
                                }

                                /* Pausenzeit berechnen */
                                if($c == 0){
                                    if($erfassung['start_timestamp'] > 0 && $erfassung['ende_timestamp'] > 0){
                                        $next = $erfassung['ende_timestamp'];
                                    }
                                }
                                else{
                                    $pauseTimestamp = ($erfassung['start_timestamp'] - $next);
                                    $pausenzeitSumme += $pauseTimestamp;
                                    
                                    $this->setTimestamp($pauseTimestamp);
                                    $userAllTimesArray[$key][$c - 1]['pausenzeit_timestamp'] = $pauseTimestamp;
                                    $userAllTimesArray[$key][$c - 1]['pausenzeit'] = $this->calculateHoursFromTimestamp();

                                    $this->setTimestamp($pausenzeitSumme);
                                    $userAllTimesArray[$key][0]['pausenzeit_summe_timestamp'] = $pausenzeitSumme;
                                    $userAllTimesArray[$key][0]['pausenzeit_summe'] = $this->calculateHoursFromTimestamp();

                                    $next = $erfassung['ende_timestamp'];
                                }
                                

                                if($erfassung['start_timestamp'] > 0){
                                    if($lastBooking == 0){
                                        /** erste Buchung immer ab 07:45 Uhr erlauben */
                                        $lastBooking = $siebenUhrFuenfUndVierzigDesTages;
                                    }
        
                                    /* Nicht beendete Erfassungen um 18:30 Uhr des Tages beenden */
                                    if(($erfassung['ende_timestamp'] == 0 && (!$heute || ($heute && !$jetztVorSechsUhrDreizig)))){
                                        $correctWrongTime = $erfassung['ende_timestamp'] = $sechsUhrDreizigDesTages;
        
                                        /* Endzeitpunkt auf 18:30 Uhr setzen */
                                        $SQLSetBookingTime = "UPDATE ".ZEIT_TABELLE." SET stop='".$correctWrongTime."', stop_bezeichnung='Feierabend' WHERE id=".$erfassung['bookingid'];
                                        $setBookingQuery = $db->query($SQLSetBookingTime);
        
                                        /* Vermerk zur fehlerhaften Buchung hinterlegen */
                                        $SQLUpdateWrongBooking = "UPDATE ".TAG_TABELLE." SET notiz = CONCAT(notiz, 'Fehlerhafte Buchung vom: ".$erfassung['datum']."') WHERE id=".$key;
                                        $wrongBookingQuery = $db->query($SQLUpdateWrongBooking);
        
                                        $userAllTimesArray[$key][0]['possibleTimes'][$erfassung['bookingid']][0][0] = $lastBooking;
                                        $userAllTimesArray[$key][0]['possibleTimes'][$erfassung['bookingid']][0][1] = $correctWrongTime;
                                        
                                        $userAllTimesArray[$key][0]['possibleTimes'][$erfassung['bookingid']][1][0] = $lastBooking;
                                        $userAllTimesArray[$key][0]['possibleTimes'][$erfassung['bookingid']][1][1] = $correctWrongTime;
        
                                        
                                        $lastBooking = $correctWrongTime;
        
                                        $previousBooking = $erfassung;
                                        $previousKey = $key;
        
                                    }
                                    else{
                                        /* Wenn Buchung vom heutigen Tag: Aktuellen Zeitpunkt (vor 18:30) als möglichen Endzeitpunkt verwenden */
                                        if($heute){
                                            if($jetztNachSiebenUhrFuenfUndVierzig){
                                                if($jetztVorSechsUhrDreizig){
                                                    /* Jetztiger Zeitpunkt zwischen 07:45 und 18:30: Aktuellen Zeitpunkt Als limit setzen, sonst 18:30 als limit */
                                                    $endeTimestamp = $jetzt;
                                                }
                                                else{
                                                    $endeTimestamp = $sechsUhrDreizigDesTages;
                                                }
                                            }
                                            else{
                                                /* Erfasssung kann noch nicht bearbeitet werden (07:45 - 07:45) */
                                                $endeTimestamp = $siebenUhrFuenfUndVierzigDesTages;
                                            }
                                        }
                                        else{
                                            $endeTimestamp = $sechsUhrDreizigDesTages;
                                        }
                                        
                                        /* Möglicher Start-Bearbeitungszeitbereich: vom Endzeitpunkt der letzten Buchung (oder wenn letzte Buchung nicht von heute: von 07:45 Uhr) bis 18:30  */
                                        $userAllTimesArray[$key][0]['possibleTimes'][$erfassung['bookingid']][0][0] = $lastBooking;
                                        $userAllTimesArray[$key][0]['possibleTimes'][$erfassung['bookingid']][0][1] = $endeTimestamp;

                                        /* Möglicher Stop-Bearbeitungszeitbereich: vom Endzeitpunkt der letzten Buchung (oder wenn letzte Buchung nicht von heute: von 07:45 Uhr) bis 18:30  */
                                        $userAllTimesArray[$key][0]['possibleTimes'][$erfassung['bookingid']][1][0] = $lastBooking;
                                        $userAllTimesArray[$key][0]['possibleTimes'][$erfassung['bookingid']][1][1] = $endeTimestamp;

                                        if(is_array($previousBooking) && count($previousBooking) > 0){
                                            if($letzteBuchungVomSelbenTag){
                                               if($previousBooking['bookingid'] > 0 && $previousKey > 0){
                                                    /* Mögliche Bearbeitung des Stopzeitpunkt der letzten Buchung mit Startzeitpunkt der aktuellen Buchung überschreiben, ansonsten bleibt 18:30 Uhr */
                                                    $userAllTimesArray[$previousKey][0]['possibleTimes'][$previousBooking['bookingid']][0][1] = $erfassung['start_timestamp'];
                                                    $userAllTimesArray[$previousKey][0]['possibleTimes'][$previousBooking['bookingid']][1][1] = $erfassung['start_timestamp'];
                                                }
                                            }
                                        }
        
                                        $lastBooking = $erfassung['ende_timestamp'];
        
                                        $previousBooking = $erfassung;
                                        $previousKey = $key;
                                    }
                                }
                                else{
                                    if($heute){
                                        /* Wenn Buchung vom heutigen Tag: Aktuellen Zeitpunkt (vor 18:30) als möglichen Endzeitpunkt verwenden */
                                        if($jetztNachSiebenUhrFuenfUndVierzig){
                                            if($jetztVorSechsUhrDreizig){
                                                $stopTimestamp = $jetzt;
                                            }
                                            else{
                                                $stopTimestamp = $sechsUhrDreizigDesTages;
                                            }
                                        }
                                        else{
                                            /* Erfasssung noch nicht möglich */
                                            $stopTimestamp = $siebenUhrFuenfUndVierzigDesTages;
                                        }

                                        /* Für Heute start von 07:45 bis jetztiger Zeitpunkt */
                                        $userAllTimesArray[$key][0]['possibleTimes'][0][0][0] = $siebenUhrFuenfUndVierzigDesTages;
                                        $userAllTimesArray[$key][0]['possibleTimes'][0][0][1] = $stopTimestamp;
            
                                        $userAllTimesArray[$key][0]['possibleTimes'][0][1][0] = $siebenUhrFuenfUndVierzigDesTages;
                                        $userAllTimesArray[$key][0]['possibleTimes'][0][1][1] = $stopTimestamp;
                                        
                                        $lastBooking = $stopTimestamp;
                                    }
                                    else{
                                        /* Start & Ende Frei wählbar wenn keine Buchung für den jetzigen Tag */
                                        $userAllTimesArray[$key][0]['possibleTimes'][0][0][0] = $siebenUhrFuenfUndVierzigDesTages;
                                        $userAllTimesArray[$key][0]['possibleTimes'][0][0][1] = $sechsUhrDreizigDesTages;
            
                                        $userAllTimesArray[$key][0]['possibleTimes'][0][1][0] = $siebenUhrFuenfUndVierzigDesTages;
                                        $userAllTimesArray[$key][0]['possibleTimes'][0][1][1] = $sechsUhrDreizigDesTages;
            
                                        $lastBooking = $sechsUhrDreizigDesTages;
                                    }
                                    $previousBooking = $erfassung;
                                    $previousKey = $key;
                                }

                                $c++;
                            }
                        }
        
                        /* Mögliche Manuelle Eintrags-Zeiten bestimmen */
                        foreach($userAllTimesArray AS $key => $day){
                            $i = 0;
        
                            foreach($day AS $erfassung){

                                $sechsUhrDreizigDesTages = strtotime($erfassung['datum']." 18:30:00");
                                $siebenUhrFuenfUndVierzigDesTages = strtotime($erfassung['datum']." 07:45:00");
                                
                                $jetzt = time();

                                if($erfassung['datum'] == date("d.m.Y", $jetzt)){
                                    $heute = true;
                                }
                                else{
                                    $heute = false;
                                }
                                
                                if($jetzt > $siebenUhrFuenfUndVierzigDesTages){
                                    $jetztNachSiebenUhrFuenfUndVierzig = true;
                                }
                                else{
                                    $jetztNachSiebenUhrFuenfUndVierzig = false;
                                }

                                if($jetzt < $sechsUhrDreizigDesTages){
                                    $jetztVorSechsUhrDreizig = true;
                                }
                                else{
                                    $jetztVorSechsUhrDreizig = false;
                                }

                                if($i == 0){
                                    /* Erster Durchlauf */
                                    $userAllTimesArray[$key][0]['possibleEntry'][0][0] = $siebenUhrFuenfUndVierzigDesTages;
    
                                    
                                    if($erfassung['start_timestamp'] > 0){
                                        $userAllTimesArray[$key][0]['possibleEntry'][0][1] = $erfassung['start_timestamp'];
                                        
                                        if($erfassung['ende_timestamp']){
                                            $userAllTimesArray[$key][0]['possibleEntry'][1][0] = $erfassung['ende_timestamp'];
                                            
                                            if($heute){
                                                /* Wenn Buchung vom heutigen Tag: Aktuellen Zeitpunkt (vor 18:30) als möglichen Endzeitpunkt verwenden */
                                                if($jetztNachSiebenUhrFuenfUndVierzig){
                                                    if($jetztVorSechsUhrDreizig){
                                                         /* Jetztiger Zeitpunkt zwischen 07:45 und 18:30: Aktuellen Zeitpunkt Als limit setzen, sonst 18:30 als limit */
                                                        $userAllTimesArray[$key][0]['possibleEntry'][1][1] = $jetzt;
                                                    }
                                                    else{
                                                        $userAllTimesArray[$key][0]['possibleEntry'][1][1] = $sechsUhrDreizigDesTages;
                                                    }
                                                }
                                                else{
                                                    /* Erfasssung kann noch nicht bearbeitet werden (07:45 - 07:45) */
                                                    $userAllTimesArray[$key][0]['possibleEntry'][1][1] = $siebenUhrFuenfUndVierzigDesTages;
                                                }
                                            }
                                            else{
                                                $userAllTimesArray[$key][0]['possibleEntry'][1][1] = $sechsUhrDreizigDesTages;
                                            }
                                        }
                                        else{
                                            $userAllTimesArray[$key][0]['possibleEntry'][1][0] = "laufende Erfassung";
                                        }
                                    }
                                    else{
                                        if($heute){
                                            /* Wenn Buchung vom heutigen Tag: Aktuellen Zeitpunkt (vor 18:30) als möglichen Endzeitpunkt verwenden */
                                             if($jetztNachSiebenUhrFuenfUndVierzig){
                                                if($jetztVorSechsUhrDreizig){
                                                    /* Jetztiger Zeitpunkt zwischen 07:45 und 18:30: Aktuellen Zeitpunkt Als limit setzen, sonst 18:30 als limit */
                                                   $userAllTimesArray[$key][0]['possibleEntry'][0][1] = $jetzt;
                                                }
                                                else{
                                                    $userAllTimesArray[$key][0]['possibleEntry'][0][1] = $sechsUhrDreizigDesTages;
                                                }
                                            }
                                            else{
                                                /* Erfasssung kann noch nicht bearbeitet werden (07:45 - 07:45) */
                                                $userAllTimesArray[$key][0]['possibleEntry'][0][1] = $siebenUhrFuenfUndVierzigDesTages;
                                            }
                                        }
                                        else{
                                            $userAllTimesArray[$key][0]['possibleEntry'][0][1] = $sechsUhrDreizigDesTages;
                                        }
                                    }
                                }
                                else{
                                    if($erfassung['start_timestamp']){
        
                                        if($i > 1){
                                            $userAllTimesArray[$key][0]['possibleEntry'][$i][1] = $erfassung['start_timestamp'];
                                        }
                                        else{
                                            $userAllTimesArray[$key][0]['possibleEntry'][1][1] = $erfassung['start_timestamp'];
                                        }
        
                                        if($erfassung['ende_timestamp'] > 0){
                                            $userAllTimesArray[$key][0]['possibleEntry'][$i + 1][0] = $erfassung['ende_timestamp'];
                                            
                                            if($heute){
                                                /* Wenn Buchung vom heutigen Tag: Aktuellen Zeitpunkt (vor 18:30) als möglichen Endzeitpunkt verwenden */
                                                if($jetztNachSiebenUhrFuenfUndVierzig){
                                                    if($jetztVorSechsUhrDreizig){
                                                        /* Jetztiger Zeitpunkt zwischen 07:45 und 18:30: Aktuellen Zeitpunkt Als limit setzen, sonst 18:30 als limit */
                                                       $userAllTimesArray[$key][0]['possibleEntry'][$i + 1][1] = $jetzt;
                                                    }
                                                    else{
                                                        /* Heute nur bis aktueller zeitpunkt möglich */
                                                        $userAllTimesArray[$key][0]['possibleEntry'][$i + 1][1] = $sechsUhrDreizigDesTages;
                                                    }
                                                }
                                                else{
                                                    /* Erfasssung kann noch nicht bearbeitet werden (07:45 - 07:45) */
                                                    $userAllTimesArray[$key][0]['possibleEntry'][$i + 1][1] = $siebenUhrFuenfUndVierzigDesTages;
                                                }
                                            }
                                            else{
                                                $userAllTimesArray[$key][0]['possibleEntry'][$i + 1][1] = $sechsUhrDreizigDesTages;
                                            }
                                        }
                                        elseif($heute){
                                            $userAllTimesArray[$key][0]['possibleEntry'][$i + 1][0] = "laufende Erfassung";
                                        }
                                    }
                                }
                                $i++;
                            }
                        }
                    }
                    $responseArray['status'] = SUCCESS;
                    $responseArray['userTime'] = $userAllTimesArray;
                    
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function getBookingByID(){
            $db = $this->autentificationClass->getDB();

            $bookingID = $this->getBookingID();
            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){

                    $selectBookingSQL = "SELECT * FROM ".ZEIT_TABELLE." WHERE id='".$bookingID."' ORDER BY start DESC LIMIT 1";
                    $selectCurrentQuery = $db->query($selectBookingSQL);

                    if($selectCurrentQuery->affectedRows()){
                        $bookingArray = $db->fetchArray($selectBookingSQL);
                    }

                    $responseArray['booking'] = $bookingArray;
                    $responseArray['status'] = SUCCESS;
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }
        
        public function setTodayEntry(){
            $db = $this->autentificationClass->getDB();

            $mitarbeiterID = $this->getMitarbeiterID();
            $notiz = $this->getNotiz();
            
            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){

                    if($mitarbeiterID > 0){
                        $userTimeQuery = $insertTodayQuery = $thisDay = array();

                        $selectUserTimeDay = "SELECT id AS tagid, datum, mitarbeiter_id AS mid, status, notiz FROM ".TAG_TABELLE." WHERE mitarbeiter_id = '".$mitarbeiterID."' ORDER BY UNIX_TIMESTAMP(datum) DESC LIMIT 1";
                        $userTimeQuery = $db->query($selectUserTimeDay);
                        
                        if($userTimeQuery->affectedRows()){
                            $thisDay = $db->fetchArray($selectUserTimeDay);
                        }
                        
                        if($thisDay['datum'] == date("Y-m-d", time())){
                            $responseArray['status'] = SUCCESS;
                        }
                        else{
                            if($mitarbeiterID > 0){
                                $sqlInsertToday = "INSERT INTO ".TAG_TABELLE." (datum, mitarbeiter_id, status, notiz) VALUES ('".date("Y-m-d", time())."', '".$mitarbeiterID."', 0, '".$notiz."') ";
                                $insertTodayQuery = $db->query($sqlInsertToday);
                                
                                if($insertTodayQuery->affectedRows()){
                                    $responseArray['status'] = SUCCESS;
                                }
                                else{
                                    $responseArray['status'] = FAILED;
                                }
                            }
                            else{
                                $responseArray['status'] = FAILED;
                            }
                        }
                    }
                    else{
                        $responseArray['status'] = FAILED;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function saveTimeTracking(){
            $db = $this->autentificationClass->getDB();

            $tagID = $this->getTagID();
            $bezeichnung = $this->getStartBezeichnung();
            
            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){

                    $userData = $this->autentificationClass->getUser();
                    $this->setMitarbeiterID($userData['id']);

                    /* Erst Heute setzen, falls nicht */
                    $todayEntry = $this->setTodayEntry();

                    if($todayEntry['status'] == SUCCESS){
                        $getBooking = $this->getLatestTime($tagID);

                        if($getBooking['status'] == SUCCESS){
                            $getBooking = $getBooking['latestTime'];

                            if(is_array($getBooking) && !empty($getBooking)){
                                if($getBooking['stop_bezeichnung'] != "Feierabend"){
                                    /* Nach Feierabend Erfassung deaktiviert */
                                    if($getBooking['stop'] == 0){
                                        /* laufende Aufzeichnung beenden */
                                        $bookingID = $getBooking['id'];
                                        ($bezeichnung == "Pause" || $bezeichnung == "Feierabend") ? $bezeichnung : $bezeichnung = "Pause";
                
                                        /* Update */
                                        $SQLBooking = "UPDATE ".ZEIT_TABELLE." SET stop = '".time()."', stop_bezeichnung = '".$bezeichnung."' WHERE id='".$bookingID."'";
                                    }
                                    else{
                                        /* Neue Aufzeichnung anlegen */
                                        ($bezeichnung == "Start" || $bezeichnung == "Arbeitszeit") ? $bezeichnung : $bezeichnung = "Start";
                
                                        /* Insert */
                                        $SQLBooking = "INSERT INTO ".ZEIT_TABELLE." (tag_id, start, start_bezeichnung) VALUES ('".$tagID."', '".time()."', '".$bezeichnung."')";
                                    }
                
                                    $bookingQuery = $db->query($SQLBooking);
                
                                    if($bookingQuery->affectedRows()){
                                        $responseArray['status'] = SUCCESS;
                                        $responseArray['userTime'] = $this->getTimeTable(true);
                                    }
                                    else{
                                        $responseArray['status'] = FAILED;
                                    }
                                }
                                else{
                                    $responseArray['status'] = FAILED;
                                }
                            }
                            else{
                                /* Neue Aufzeichnung anlegen */
                                ($bezeichnung == "Start" || $bezeichnung == "Arbeitszeit") ? $bezeichnung : $bezeichnung = "Start";
                
                                $SQLFirstBooking = "INSERT INTO ".ZEIT_TABELLE." (tag_id, start, start_bezeichnung) VALUES ('".$tagID."', '".time()."', '".$bezeichnung."')";
                                $newBookingQuery = $db->query($SQLFirstBooking);
                
                                if($newBookingQuery->affectedRows()){
                                    $responseArray['status'] = SUCCESS;
                                }
                                else{
                                    $responseArray['status'] = FAILED;
                                }
                            }
                        }
                        else{
                            $responseArray['status'] = FAILED;
                        }
                    }
                    else{
                        $responseArray['status'] = FAILED;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }
        
        public function getLatestTime($tagID){
            $db = $this->autentificationClass->getDB();

            $tagID = $this->tagID;

            $responseArray = array();
            
            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    $SQLSelectCurrent = "SELECT * FROM ".ZEIT_TABELLE." WHERE tag_id='".$tagID."' ORDER BY start DESC LIMIT 1";
                    $selectCurrentQuery = $db->query($SQLSelectCurrent);
                    
                    if($selectCurrentQuery->affectedRows()){
                        $latestTime = $db->fetchArray($SQLSelectCurrent);
                    }
                    $responseArray['status'] = SUCCESS;
                    $responseArray['latestTime'] = $latestTime;
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function verifyBooking(){
            $db = $this->autentificationClass->getDB();

            $tagID = $this->getTagID();

            $responseArray = array();
             
            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    if($this->autentificationClass->getAdminStatus()){
                        $userData = $this->autentificationClass->getUser();
                        $mitarbeiterID = $userData['id'];

                        /* Tag Bearbeiten */
                        $sqlUpdateDay = "UPDATE ".TAG_TABELLE." SET status = 1, notiz='' WHERE id=".$tagID;
                        $updateDayQuery = $db->query($sqlUpdateDay);
                        
                        if($updateDayQuery->affectedRows()){
                            /** In bestätigungs Tabelle eintragen */
                            $insertBookingVerified = "INSERT INTO ".BESTAETIGUNG_TABELLE." VALUES (".$tagID.",".$mitarbeiterID.", '".date("Y-m-d", time())."')";
                            $bookingVerifiedQuery = $db->query($insertBookingVerified);

                            if($bookingVerifiedQuery->affectedRows()){
                                $responseArray['status'] = SUCCESS;
                            }
                            else{
                                $responseArray['status'] = FAILED;
                            }
                        }
                        else{
                            $responseArray['status'] = FAILED;
                        }
                    }
                    else{
                        $responseArray['status'] = NO_PERMISSION;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function getDailyHoursFromUser(){
            $db = $this->autentificationClass->getDB();
            
            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    $userData = $this->autentificationClass->getUser();
                    
                    $userID = $userData['id'];
                    $stundenzahl = $userData['stundenzahl'];
                    
                    $this->setUserID($userID);
                    $this->setStundenzahl($stundenzahl);

                    $ueberstundenArray = $uArray = array();
                    
                    $tagesDurchlaeufe = 1;
                    $median = 0;
        
                    if($userID > 0 && $userID){
                        $userTimeArray = $this->getTimeTable();

                        if($userTimeArray['status'] == SUCCESS){
                            $userTimeArray = $userTimeArray['userTime'];
                        }
                        else{
                            $userTimeArray = array();
                        }
                        $zeitSumme = 0;
                        
                        $sollStundeninSekunden = ($stundenzahl * 60 * 60);
                        
                        foreach($userTimeArray AS $currentDay){
                            $aZeit = 0;
        
                            $ueberstunde = false;
        
                            foreach($currentDay AS $currentTime){
                                $aZeit += $currentTime['arbeitszeit_timestamp'];
                            }
                            $gesamtTagStamp = $currentDay[0]['tagessumme_timestamp'];
                            
        
                            if($aZeit > 0){
                                $tagDifferenz = $sollStundeninSekunden - $aZeit;
        
                                $zeitSumme += $aZeit;
                                $median++;
        
                                if(substr($tagDifferenz, 0, 1) == "-"){
                                    /* Überstunden kennzeichnen */
                                    $tagDifferenz = ltrim($tagDifferenz, "-");
                                    $ueberstunde = true;
                                }
        
                                $uArray[$tagesDurchlaeufe][0] = $currentDay[0]['datum']; /* Datum */
                                
                                $this->setTimestamp($aZeit);
                                $uArray[$tagesDurchlaeufe][1] = $this->calculateHoursFromTimestamp(); /* Arbeitsszeit */
                                
                                $uArray[$tagesDurchlaeufe][2] = $gesamtTagStamp;
                                $uArray[$tagesDurchlaeufe][3] = (int) $tagDifferenz; /* Tagdifferenz in Timestamp*/
                                $this->setTimestamp($tagDifferenz);
                                $uArray[$tagesDurchlaeufe][4] = ($ueberstunde) ? "-".$this->calculateHoursFromTimestamp() : $this->calculateHoursFromTimestamp(); /* Tagdifferenz*/
                                
                                if($ueberstunde){
                                    $ueberstundenArray[] = $uArray; 
                                }
                                
                                $tagesDurchlaeufe++;
                            }
                        }

                        if($zeitSumme > 0){
                            /* Tagesdurchschnitt der Errechnung */
                            $durschnittsStunde = round(($zeitSumme/$median), 0);
                            $this->setTimestamp($durschnittsStunde);

                            $uArray[0][0] = $this->calculateHoursFromTimestamp(); /* Differnz */
                            
                            /* Soll-Tagesdurchschnitt */
                            $this->setTimestamp($sollStundeninSekunden);
                            $uArray[0][1] = $this->calculateHoursFromTimestamp();
            
                            /* Prozentwert ermittlen */
                            $prozentsatzDurchschnitt = round(($durschnittsStunde/$sollStundeninSekunden), 2);
                            $zahlenArray = explode(".", (string) $prozentsatzDurchschnitt);

                            if($sollStundeninSekunden < $durschnittsStunde){
                                /* Über 100% */
                                if(!$zahlenArray[1]){
                                    $prozentINT = (int) $zahlenArray[0]."00";
                                    $prozent = $prozentINT."%";
                                }
                                else{
                                    if(strlen($zahlenArray[1]) == 1){
                                        $prozentINT = (int) $zahlenArray[0]."0".$zahlenArray[1];
                                        $prozent = $prozentINT."%";
                                    }
                                    else{
                                        $prozentINT = (int) $zahlenArray[0].$zahlenArray[1];
                                        $prozent = $prozentINT."%";
                                    }
                                }
                            }
                            else{
                                $prozentZweiteStelle = $zahlenArray[1];

                                if(strlen($prozentZweiteStelle) == 2){
                                    if($prozentZweiteStelle[0] == 0){
                                        $prozentINT = (int) $prozentZweiteStelle[1];
                                        $prozent = $prozentINT."%";
                                    }
                                    else{
                                        $prozentINT = (int) $prozentZweiteStelle;
                                        $prozent = $prozentINT."%";
                                    }
                                }
                                else{
                                    $prozentINT = (int) $prozentZweiteStelle[0]."0";
                                    $prozent = $prozentINT."%";
                                }
                            }

                            $uArray[0][2] = $prozentINT;
                            $uArray[0][3] = $prozentsatzDurchschnitt;
                            $uArray[0][4] = $prozent;

                        }
                        else{
                            /* Noch keine Erfassungen! */
                            $uArray[0][0] = 0;
                            /* Soll-Tagesdurchschnitt */
                            $this->setTimestamp($sollStundeninSekunden);
                            $uArray[0][1] = $this->calculateHoursFromTimestamp();
                            $uArray[0][2] = 0;
                            $uArray[0][3] = 0;
                            $uArray[0][4] = "0%";
                        }

                        $responseArray['averageTime'] = $uArray;
                        $responseArray['status'] = SUCCESS;                        
                    }
                    else{
                        $responseArray['status'] = FAILED;
                    }

                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function getSumOfDay(){
            $db = $this->autentificationClass->getDB();

            $userID = $this->getMitarbeiterID();
            $tagID = $this->getTagID();

            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    $timeArray = array();

                    if($userID > 0 && $tagID > 0){
                        $this->setUserID($userID);

                        $timeArray = $this->getTimeTable();

                        if($timeArray['status'] == SUCCESS){
                            $timeArray = $timeArray['userTime'];
                        }
                        else{
                            $timeArray = array();
                        }
        
                        $tagessumme = $timeArray[$tagID][0]['tagessumme'];
                        $tagessummeTimestamp = $timeArray[$tagID][0]['tagessumme_timestamp'];
        
                        if($tagessumme != ""){
                            $responseArray['tagessumme'] = $tagessumme;
                            $responseArray['tagessumme_timestamp'] = $tagessummeTimestamp;
                            $responseArray['status'] = SUCCESS;
                        }
                    }
                    else{
                        $responseArray['status'] = FAILED;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function getUnverifiedBookings(){
            $db = $this->autentificationClass->getDB();

            $responseArray = array();
             
            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    if($this->autentificationClass->getAdminStatus()){
                        $returnBookingArray = $unverifiedBookingsQuery = $allBookings = array();

                        $selectUnverifiedBookings = "SELECT a.id AS tagid, a.datum, a.mitarbeiter_id, a.status,a.notiz, b.email, b.name, b.vorname, b.abteilungs_id, c.bezeichnung FROM ".TAG_TABELLE." AS a, ".MITARBEITER_TABELLE." AS b, ".ABTEILUNGS_TABELLE." AS c WHERE a.status = 0 AND a.mitarbeiter_id = b.id AND b.abteilungs_id = c.id AND b.abteilungs_id > 1 ORDER BY(datum) DESC";
                        $unverifiedBookingsQuery = $db->query($selectUnverifiedBookings);

                        if($unverifiedBookingsQuery->affectedRows()){
                            $allBookings = $unverifiedBookingsQuery->fetchAll();
                        }

                        foreach($allBookings AS $booking){
                            $this->setMitarbeiterID($booking['mitarbeiter_id']);
                            $this->setTagID($booking['tagid']);

                            $summenPruefueng = $this->getSumOFDay();

                            if($summenPruefueng['status'] == SUCCESS){
                                if($summenPruefueng['tagessumme_timestamp'] > 0){
                                    /* Nur Tage mit Buchungen ausgeben */
                                    $booking['tagessumme'] = $summenPruefueng['tagessumme'];
                                    
                                    $returnBookingArray[] = $booking;
                                }
                            }
                        }

                        if(is_array($allBookings) && !empty($allBookings)){
                            $responseArray['status'] = SUCCESS;
                            $responseArray['bookings'] = $returnBookingArray;
                        }
                        else{
                            $responseArray['status'] = FAILED;
                        }
                    }
                    else{
                        $responseArray['status'] = NO_PERMISSION;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }
        
        public function getUserComments(){
            $db = $this->autentificationClass->getDB();

            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    if($this->autentificationClass->getAdminStatus()){
                        $userCommentsQuery = $allComments = array();

                        $selectUserComment = "SELECT *, a.id AS tagid FROM ".TAG_TABELLE." AS a, ".MITARBEITER_TABELLE." AS b WHERE COALESCE (notiz, '') <> '' AND a.mitarbeiter_id = b.id AND b.abteilungs_id > 1 ORDER BY (datum) DESC";
                        $userCommentsQuery = $db->query($selectUserComment);

                        if($userCommentsQuery->affectedRows()){
                            $allComments = $userCommentsQuery->fetchAll();
                        }

                        if(is_array($allComments) && !empty($allComments)){
                            $responseArray['status'] = SUCCESS;
                            $responseArray['comments'] = $allComments;
                        }
                        else{
                            $responseArray['status'] = FAILED;
                        }
                    }
                    else{
                        $responseArray['status'] = NO_PERMISSION;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function editUserTime($getSingleDay = 0){
            $db = $this->autentificationClass->getDB();

            $userID = $this->getUserID();

            $tagID = $this->getTagID();
            $bookingID = $this->getBookingID();
            
            $start = $this->getStart();

            $stop = $this->getStop();
            $stop_bezeichnung = $this->getStopBezeichnung();

            $responseArray = array();
            
            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    $insertBookingQuery = $userTag = $responseArray = array();
            
                    $query = false;
                    $save = false;
        
                    if(!$userID){
                        $userData = $this->autentificationClass->getUser();
                        $userID = $userData['id'];
                        
                        $this->setUserID($userID);
                    }
                    
                    $this->setTagID(0);
                    $userTime = $this->getTimeTable();
                    $this->setTagID($tagID);
                    
                    if($userTime['status'] == SUCCESS){
                        $userTime = $userTime['userTime'];
                    }
                    else{
                        $userTime = array();
                    }

                    if($tagID > 0){
                        
                        $userTag = $userTime[$tagID];
        
                        if($start > 0 && $stop > 0){
                            if($start > $stop){
                                /* Wenn start nach stop Zurücksetzen */
                                $start = 0;
                                $stop = 0;
                            }
                        }
                        
                        
                        /** For new Time and New entry */
                        if($bookingID > 0){
                            
                            $möglicheZeit = $userTag[0]['possibleTimes'][$bookingID];
                            
                            if($start > 0 && $stop > 0){
                                
                                /* Start im Zeitfenster */
                                if($start > $möglicheZeit[0][0]){
                                    $save = true;
                                }
                                else{
                                    $start = 0;
                                }

                                /* Stop im Zeitfenster */
                                if($stop < $möglicheZeit[1][1]){
                                    $save = true;
                                }
                                else{
                                    $stop = 0;
                                }
                            }
                            else{

                                /* Wenn Start im Zeitfenster */
                                if($start > 0){
                                    if($start > $möglicheZeit[0][0] && $start < $möglicheZeit[0][1]){
                                        $save = true;
                                    }
                                    else{
                                        /* Start zurücksetzen */
                                        $start = 0;
                                    }
                                }
            
                                /* Wenn Stop im ZeitFenster */
                                if($stop > 0){
                                    if($stop > $möglicheZeit[1][0] && $stop < $möglicheZeit[1][1]){
                                        $save = true;
                                    }
                                    else{
                                        /* Stop Zurücksetzen */
                                        $stop = 0;
                                    }
                                }
                            }
        
                            /* Wenn Feierabend, muss letzte Erfassung sein */
                            if($stop_bezeichnung != ""){
                                if($stop_bezeichnung == "Feierabend"){
                                    if($userTag[count($userTag) - 1]['bookingid'] == $bookingID){
                                        $save = true;
                                    }
                                    else{
                                        $stop_bezeichnung = "";
                                    }
                                }
                                else{
                                    $save = true;
                                }
                            }
        
                            if($save){
                                /* Edit Booking */
                                $SQLUpdateEntry = "UPDATE ".ZEIT_TABELLE." SET ";
        
                                if($start > 0){
                                    $SQLUpdateEntry .= "start ='".$start."'";
                                    $query = true;
                                }
        
                                if($stop > 0){
                                    if($start > 0){
                                        $SQLUpdateEntry .= ",";
                                    }
                                    $SQLUpdateEntry .= "stop ='".$stop."'";
                                    $query = true;
                                }
        
                                if($stop_bezeichnung != ""){
                                    if($start > 0 || $stop > 0){
                                        $SQLUpdateEntry .= ",";
                                    }
                                    $SQLUpdateEntry .= "stop_bezeichnung ='".$stop_bezeichnung."'";
                                    $query = true;
                                }
        
                                if($query == true){
                                    $SQLUpdateEntry .= " WHERE id='".$bookingID."'";
        
                                    $updateTimeQuery = $db->query($SQLUpdateEntry);
    
                                    $action = "Buchung ".$bookingID." bearbeitet";
                                    $log = new Log($userID, $action);
                                    
                                    if($updateTimeQuery->affectedRows()){
                                        $responseArray['status'] = SUCCESS;
                                        
                                        $log->setLogEntry();
                                        unset($log);

                                        /* Neue Tabellen-Daten zusammenstellen */
                                        if($getSingleDay == 0){
                                            $this->setTagID(0);
                                        }
                                        $userTime = $this->getTimeTable();

                                        if($userTime['status'] == SUCCESS){
                                            $userTime = $userTime['userTime'];
                                        }
                                        else{
                                            $userTime = array();
                                        }

                                        $responseArray['userTime'] = $userTime;
                                    }
                                    else{
                                        $responseArray['status'] = FAILED;
                                    }
                                }
                                else{
                                    $responseArray['status'] = SUCCESS;
                                }
                            }
                            else{
                                $responseArray['status'] = FAILED;
                            }
                        }
                        else{
                            $possibleEntries = $userTag[0]['possibleEntry'];
                            $letzeMöglicheErfassung =  $possibleEntries[count($possibleEntries) - 1];

                            if($start > 0){
                                if($start > 0 && $stop == 0){
                                    /* Eintrag für laufende Erfassung */
                                    if($start > $letzeMöglicheErfassung[0] && $start < $letzeMöglicheErfassung[1]){
                                        $save = true;
                                    }
                                }
                                else{
                                    if($stop_bezeichnung != "Feierabend"){
                                        foreach($possibleEntries AS $entry){
                                            if($start > $entry[0] && $start < $entry[1] && $stop > $entry[0] && $stop < $entry[1]){
                                                $save = true;
                                            }
                                        }
                                    }
                                    else{
                                        if($start > $letzeMöglicheErfassung[0] && $start < $letzeMöglicheErfassung[1] && $stop > $letzeMöglicheErfassung[0] && $stop < $letzeMöglicheErfassung[1]){
                                            $save = true;
                                        }
                                    }
                                }
                            }
        
                            if($save){
                                /** Insert booking*/
                                $sqlInsertBooking = "INSERT INTO ".ZEIT_TABELLE." (tag_id, start, start_bezeichnung, stop, stop_bezeichnung) VALUES (".$tagID.", '".$start."', 'Start', '".$stop."', '".$stop_bezeichnung."')";
                                $insertBookingQuery = $db->query($sqlInsertBooking);

                                $action = "Buchung zu TagID: ".$tagID;
                                $log = new Log($userID, $action);
                                
                                
                                if($insertBookingQuery->affectedRows()){
                                    $responseArray['status'] = SUCCESS;
                                    
                                    $log->setLogEntry();
                                    unset($log);

                                    /* Neue Tabellen-Daten zusammenstellen */
                                    if($getSingleDay == 0){
                                        $this->setTagID(0);
                                    }
                                    $userTime = $this->getTimeTable();

                                    if($userTime['status'] == SUCCESS){
                                        $userTime = $userTime['userTime'];
                                    }
                                    else{
                                        $userTime = array();
                                    }

                                    $responseArray['userTime'] = $userTime;

                                }
                                else{
                                    $responseArray['status'] = FAILED;
                                }
                            }
                            else{
                                $responseArray['status'] = FAILED;
                            }
                        }
                    }
                    else{
                        /* Error */
                        $responseArray['status'] = FAILED;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function createCSV(){
            $db = $this->autentificationClass->getDB();

            $userID = $this->getUserID();

            $responseArray = $day = $aktuelleErfassung = $currentEntry = $csvArray = $userTime = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    if(!$userID){
                        $userData = $this->autentificationClass->getUser();
                        $userID = $userData['id'];

                        $this->setUserID($userID);
                    }

                    $this->setUserID($userID);
                    
                    $userTime = $this->getTimeTable();

                    if($userTime['status'] == SUCCESS){
                        $userTime = $userTime['userTime'];
                    }
                    else{
                        $userTime = array();
                    }
                    
                    foreach($userTime AS $key => $day){
                        $i = 0;
                        $skip = false;
        
                        $csvArray[0] = array("Datum","Erfassung von:", "Bis:", "Bezeichnung", "Notiz", "Tagessumme");

                        $aktuelleErfassung[0]['datum'] = $day[0]['datum'];
                        $aktuelleErfassung[0]['wochentag'] = $day[0]['wochentag'];
                        $aktuelleErfassung[0]['notiz'] = $day[0]['notiz'];

                        foreach($day AS $erfassungen){
                            if($i == 0){
                                if($erfassungen['tagessumme_timestamp'] == 0){
                                    /* Leere Tage nicht in die CSV Eintrage */
                                    $skip = true;
                                }
                            }

                            $aktuelleErfassung[$i]['start'] = $erfassungen['start'];
                            $aktuelleErfassung[$i]['start_bezeichnung'] = $erfassungen['start_bezeichnung'];
                            $aktuelleErfassung[$i]['ende'] = $erfassungen['ende'];
                            $aktuelleErfassung[$i]['end_bezeichnung'] = $erfassungen['end_bezeichnung'];
                            $aktuelleErfassung[$i]['tagessumme'] = $erfassungen['tagessumme'];

                            $i++;                    
                        }

                        if(!$skip){
                            $csvArray[] = $aktuelleErfassung;
                            $aktuelleErfassung = array();
                        }
                    }

                    if(count($csvArray) > 1){
                        $filePath = $_SERVER['DOCUMENT_ROOT']."/data/csv/";
                        $ausgabeFilePath =  $_SERVER['HTTP_HOST']."/data/csv/";
        
                        $fileName = "timetable_worker_$userID"."_".time().".csv";
        
                        $file = $filePath.$fileName;
                        $ausgabeFile = $ausgabeFilePath.$fileName;
                        
                        if(!file_exists($filePath)){
                            if(mkdir($filePath, 0777, true)){
                                $filePointer = fopen($file, "w");
                            }
                        }
                        else{
                            $filePointer = fopen($file, "w");
                        }
        
                        fputcsv($filePointer, $csvArray[0], ";");
                        $i = 0;

                        if($filePointer){
        
                            foreach($csvArray AS $currentEntry){
                                $first = true;

                                $datum = $currentEntry[0]['datum'];
                                $notiz = $currentEntry[0]['notiz'];
                                $wochentag = $currentEntry[0]['wochentag'];

                                if($i > 0){
                                    /* Erst nach Überschrift */
                                    foreach($currentEntry AS $k => $entry){
                                        $newArray = array(
                                            "datum" => $datum,
                                            "start" => $entry['start'],
                                            "ende" => $entry['ende'],
                                            "end_bezeichnung" => $entry['end_bezeichnung'],
                                            "notiz" => "",
                                            "tagessumme" => ""
                                        );
                                        fputcsv($filePointer, $newArray, ";");
                                    }
                                    /* Trennung für Tag */
                                    fputcsv($filePointer, [$datum, "", "", "", ($notiz != "" ? $notiz : "-"), $currentEntry[0]['tagessumme']], ";");
                                    fputcsv($filePointer, ['', '', ''], ";");
                                }
                                $i++;
                            }
                            fclose($filePointer);
                        
                            $responseArray['link'] = $ausgabeFile;
                            $responseArray['status'] = SUCCESS;
                        }
                        else{
                            /* Kein Datastream */
                            $responseArray['status'] = FAILED;
                        }
                    }
                    else{
                        /* Keine Arbeitszeiten */
                        $responseArray['status'] = FAILED;
                    }

                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function editDay(){
            $db = $this->autentificationClass->getDB();
            $user = $this->autentificationClass->getUser();
            
            $tagID = $this->getTagID();
            $notiz = $this->getNotiz();

            $responseArray = array();
            
            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    $updateDayQuery = array();

                    if($tagID > 0){
                        $SQLUpdateDayComment = "UPDATE ".TAG_TABELLE." SET notiz='".$notiz."' WHERE id=".$tagID."";
                        $updateDayQuery = $db->query($SQLUpdateDayComment);
                        
                        $action = "Notiz zu Tag ".$tagID;
                        $log = new Log($user['id'], $action);
                        
                        if($updateDayQuery->affectedRows()){
                            $responseArray['status'] = SUCCESS;

                            $log->setLogEntry();
                            unset($log);
                        }
                        else{
                            $responseArray['status'] = FAILED;
                        }
                    }
                    else{
                        $responseArray['status'] = FAILED;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function deleteBooking($getSingleDay = 0){
            $db = $this->autentificationClass->getDB();
            $user = $this->autentificationClass->getUser();

            $bookingID = $this->getBookingID();
            
            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){

                    $deleteEntryQuery = array();

                    if($bookingID > 0){
                        $bookingArray = $this->getBookingByID();

                        $sqlDeleteEntry = "DELETE FROM ".ZEIT_TABELLE." WHERE id=".$bookingID."";
                        $deleteEntryQuery = $db->query($sqlDeleteEntry);

                        $action = "Buchung gelöscht (".json_encode($bookingArray['booking']).")";
                        $log = new Log($user['id'], $action);
                        
                        if($deleteEntryQuery->affectedRows()){
                            $responseArray['status'] = SUCCESS;
                            
                            $log->setLogEntry();
                            unset($log);
                            
                            if($getSingleDay > 0){
                                $this->setTagID($getSingleDay);
                            }

                            $userTime = $this->getTimeTable();

                            if($userTime['status'] == SUCCESS){
                                $userTime = $userTime['userTime'];
                            }
                            else{
                                $userTime = array();
                            }

                            $responseArray['userTime'] = $userTime;

                        }
                        else{
                            $responseArray['status'] = FAILED;
                        }
                    }
                    else{
                        $responseArray['status'] = FAILED;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function setDayEntry(){
            $db = $this->autentificationClass->getDB();

            $userID = $this->getUserID();
            $datum = $this->getTimestamp();

            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){

                    if(!$userID){
                        $userData = $this->autentificationClass->getUser();
                        $userID = $userData['id'];
                        
                        $this->setUserID($userID);
                    }

                    if($userID > 0 && $datum){
                        /* Tag darf nicht in der Zukunft liegen */
                        $currentTime = time();
                        $insertTime = strtotime($datum);

                        if($insertTime < $currentTime){
        
                            $selectExistingEntry = "SELECT * FROM ".TAG_TABELLE." WHERE mitarbeiter_id=".$userID." AND datum='".$datum."'";
                            $existingEntryQuery = $db->query($selectExistingEntry);
        
                            if($existingEntryQuery->affectedRows()){
                                $dayArray = $existingEntryQuery->fetchAll();
                            }
        
                            if(is_array($dayArray) && !empty($dayArray)){
                                /* Tag existiert bereits! */
                                $responseArray['status'] = FAILED;
                            }
                            else{
                                $SQLInsertDayEntry = "INSERT INTO ".TAG_TABELLE." (datum, mitarbeiter_id, status) VALUES ('".$datum."', ".$userID.", 0)";
                                $insertDayEntryQuery = $db->query($SQLInsertDayEntry);
        
                                if($insertDayEntryQuery->affectedRows()){
                                    $responseArray['status'] = SUCCESS;

                                    $userTime = $this->getTimeTable();

                                    if($userTime['status'] == SUCCESS){
                                        $userTime = $userTime['userTime'];
                                    }
                                    else{
                                        $userTime = array();
                                    }

                                    $responseArray['userTime'] = $userTime;
                                }
                                else{
                                    $responseArray['status'] = FAILED;
                                }
                            }
                        }
                        else{
                            $responseArray['status'] = FAILED;
                        }
                    }
                    else{
                        $responseArray['status'] = EMPTY_FIELDS;
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function getUserDashboard(){
            $db = $this->autentificationClass->getDB();
            
            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){

                    $userData = $this->autentificationClass->getUser();
                    $userID = $userData['id'];
                    
                    $this->setUserID($userID);
                    $this->setMitarbeiterID($userID);

                    $this->setTodayEntry();

                    $timeTable = $this->getTimeTable(true);
                    if($timeTable['status'] == SUCCESS){
                        $responseArray['userTime'] = $timeTable['userTime'];
                    }
                    else{
                        $responseArray['userTime'] = array();
                    }
                    
                    if($this->autentificationClass->getAdminStatus()){
                        /* Ist Admin */
                        $responseArray['userComments'] = $this->getUserComments();
                        $responseArray['userBookings'] = $this->getUnverifiedBookings();
                    }
                }
                else{
                    /* Inactive User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }
    }
}
