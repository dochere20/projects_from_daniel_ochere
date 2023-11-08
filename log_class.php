<?php

if(!class_exists("Log")){
    class Log{

        private $action;
        private $mitarbeiterID;
        private $db;

        public function __construct($mitarbeiterID, $action = ""){
            $this->db = $db = new db(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
            
            if($action != ""){
                $this->setAction($action);
            }

            if($mitarbeiterID > 0){
                $this->mitarbeiterID = $mitarbeiterID;
            }
        }

        public function __destruct(){

        }

        public function getAction(){
            return $this->action;
        }

        public function setAction($action){
            $this->action = $action;
        }

        public function getMitarbeiterID(){
            return $this->mitarbeiterID;
        }

        public function setMitarbeiterID($mitarbeiterID){
            $this->mitarbeiterID = $mitarbeiterID;
        }

        public function setDB($db){
            $this->db = $db;
        }

        public function getDB(){
            return $this->db;
        }

        public function setLogEntry(){
            $db = $this->getDB();

            $action = $this->getAction();
            $mitarbeiterID = $this->getMitarbeiterID();

            if($mitarbeiterID > 0){
                $sqlInsertLogEntry = "INSERT INTO " . LOG_TABELLE . " (datum, aktion, mitarbeiter_id) VALUES ('".date("Y-m-d", time())."', '".$action."', '".$mitarbeiterID."')";
                $logEntryQuery = $db->query($sqlInsertLogEntry);
                
                if($logEntryQuery->affectedRows()){
                    $responseArray['status'] = SUCCESS;
                }
                else{
                    $responseArray['status'] = FAILED;
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
?>