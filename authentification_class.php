<?php

/* Includes */

if(!class_exists("Authentification")){
    class Authentification{
        private $db;

        private $lCode;

        private $user = NULL;
        private $userFound = false;
        
        private $admin = false;
        private $userActive = false;

        public function __construct($lCode = ""){
            
            $db = $this->db = new db(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);

            if($lCode != ""){
                /* Mitarbeiter mit dem Login-Code ermitteln */
                $sqlUserData = "SELECT a.id, a.email, a.name, a.vorname, a.abteilungs_id, b.bezeichnung, a.stundenzahl, a.status FROM ".MITARBEITER_TABELLE." AS a, ".ABTEILUNGS_TABELLE." AS b WHERE loginkey='".$lCode."' AND a.abteilungs_id = b.id LIMIT 1";
                $userQuery = $db->query($sqlUserData);
                
                if($userQuery->affectedRows()){
                    $userData = $db->fetchArray($sqlUserData);
                }

                if(is_array($userData) && count($userData) > 0){
                    $this->setUserFound(true);

                    if($userData['status'] != 0 || $userData['abteilungs_id'] != 0){
                        /* Wenn Benutzer aktiviert */
                        $this->setUser($userData);
                        $this->setUserActive(true);

                        if($userData['bezeichnung'] == "Personalwesen"){
                            /* Wenn Personalwesen Status setzen */
                            $this->setAdminStatus(true);
                        }
                    }
                }
            }
        }

        public function __destruct(){

        }

        public function setLCode($lCode){
            $this->lCode = $lCode;
        }

        public function getLCode(){
            return $this->lCode;
        }

        public function setUser($user){
            if(is_array($user) && !empty($user)){
                $this->user = $user;
            }
        }
        
        public function getUser(){
            return $this->user;
        }

        public function setUserFound($userStatus){
            $this->userFound = $userStatus;
        }

        public function getUserFound(){
            return $this->userFound;
        }

        public function setUserActive($active){
            $this->userActive = $active;
        }

        public function getUserActive(){
            return $this->userActive;
        }

        public function getDB(){
            return $this->db;
        }

        public function setDB($db_host="localhost", $db_user="root", $db_password="", $db_database="t_db", $db_port=3306){
            if($db_host != "" && $db_user != "" && $db_database != ""){
                $this->db = new db($db_host, $db_user, $db_password, $db_database);
            }
        }

        public function setAdminStatus($admin){
            $this->admin = $admin;
        }

        public function getAdminStatus(){
            return $this->admin;
        }

        public function generateLoginCode(){
            $UserSessionCode    = time();

            for($i = 0; $i < 10; $i++){
                $UserSessionCode .= rand(0, 10);
            }
    
            return $UserSessionCode;
        }        
    }

}


?>