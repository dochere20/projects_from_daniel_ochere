<?php

if(!class_exists("User")){
    class User{
        private $autentificationClass;
        
        private $userID;
        private $email;
        private $password;
        private $firstname;
        private $lastname;
        private $hours;
        private $abteilungsID;

        public function __construct($lCode = "", $userID = 0, $email = "", $password = "", $firstname = "", $lastname = "", $hours = 0, $abteilungID = 0){
            
            if($lCode != ""){
                $this->autentificationClass = new Authentification($lCode);

                if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                    /* Nur wenn User Aktiviert && User gefunden ermöglichen */
                    if($userID > 0){
                        $this->setUserID($userID);
                    }

                    if($email != ""){
                        $this->setEmail($email);
                    }
                    
                    if($password != ""){
                        $this->setPassword($password);
                    }

                    if($firstname != ""){
                        $this->setFirstname($firstname);
                    }
                    
                    if($lastname != ""){
                        $this->setLastname($lastname);
                    }
                    
                    if($hours != ""){
                        $this->setHours($hours);
                    }
                    
                    if($abteilungID > 0){
                        $this->setAbteilungsID($abteilungID);
                    }
                }
                else{

                }
            }
            elseif($email != "" && $password != ""){
                /* Für DB-Instanz */
                $this->autentificationClass = new Authentification();
                
                /* User-Login oder User Registration */
                $this->setEmail($email);
                $this->setPassword($password);
            }
            else{
                /* Invalid */
            }
        }

        public function __destruct(){

        }

        public function setUserID($userID){
            $this->userID = $userID;
        }

        public function getUserID(){
            return $this->userID;
        }
        
        public function setEmail($email){
            $this->email = $email;
            
        }
        public function getEmail(){
            return $this->email;
        }
        
        public function setPassword($password){
            $this->password = $password;
        }

        public function getPassword(){
            return $this->password;
        }
        
        public function setFirstname($firstname){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->firstname = $firstname;
            }
        }

        public function getFirstname(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->firstname;
            }
        }
        
        public function setLastname($lastname){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->lastname = $lastname;
            }
        }

        public function getLastname(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->lastname;
            }
        }

        public function setHours($hours){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->hours = $hours;
            }
        }

        public function getHours(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->hours;
            }
        }

        public function setAbteilungsID($abteilungsID){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                $this->abteilungsID = $abteilungsID;
            }
        }

        public function getAbteilungsID(){
            if($this->autentificationClass->getUserActive() && $this->autentificationClass->getUserFound()){
                return $this->abteilungsID;
            }
        }

        public function loginUser(){
            $db = $this->autentificationClass->getDB();
            
            $responseArray = array();
            
            $email = $this->getEmail();
            $password = $this->getPassword();

            if($email != "" && $password != ""){
                $userData = $lCodeArray = $loginQuery = array();
                /* E-Mail Adresse und Passwort prüfen */
                $sqlLogin = "SELECT id, email, passwort FROM ".MITARBEITER_TABELLE." WHERE email='".$email."' LIMIT 1";
                $loginQuery = $db->query($sqlLogin);
                
                if($loginQuery->affectedRows()){
                    $userData = $db->fetchArray($sqlLogin);
                }

                if(is_array($userData) && count($userData) > 0){
                    if($userData['passwort'] == $password){
                        $userID = $userData['id'];
                        
                        $action = "Login ".$userID."(".date("H:i:s", time()).")";
                        $log = new Log($userID, $action);

                        /* Login-Code zu Mitarbeiter setzen */
                        $lCodeArray = $this->setUserLCode($userID);

                        if($lCodeArray['status'] == SUCCESS){
                            /* Antwort */
                            $responseArray['lCode'] = $lCodeArray['lCode'];
                            $responseArray['status'] = SUCCESS;
                            
                            $log->setLogEntry();
                            unset($log);
                        }
                        else{
                            /* Benutzer muss aktiviert werden */
                            $responseArray['status'] = INACTIVE_USER;
                        }
                    }
                    else{
                        $responseArray['status'] = WRONG_PASSWORD;
                    }
                }
                else{
                    $responseArray['status'] = NO_USER_FOUND;
                }
            }
            else{
                /* Error */
                $responseArray['status'] = EMPTY_FIELDS;
            }

            return $responseArray;
        }

        public function setUserLCode($userID){
            $db = $this->autentificationClass->getDB();
            $responseArray = array();

            if($userID > 0){
                $lCode = $userID.$this->autentificationClass->generateLoginCode();

                /* Insert LCode into Table */
                $sqlSetLCode = "UPDATE ".MITARBEITER_TABELLE." SET loginkey='".$lCode."' WHERE id='".$userID."' AND status=1 AND abteilungs_id > 0";
                $setLCodeQuery = $db->query($sqlSetLCode);

                $lCodeSaved = $setLCodeQuery->affectedRows();

                if($lCodeSaved){
                    /* return LCode */
                    $responseArray['lCode'] = $lCode;
                    $responseArray['status'] = SUCCESS;
                }
                else{
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* Error */
                $responseArray['status'] = FAILED;
            }

            return $responseArray;
        }

        public function registerUser(){
            $db = $this->autentificationClass->getDB();

            $regEmail = $this->getEmail();
            $regPassword = $this->getPassword();

            $responseArray = $selectExistingQuery = $saveUser = $existingUser = array();

            if($regEmail != "" && $regPassword != ""){
                /* Check if User Exists */
                $SQLSelectExistingUser = "SELECT id, email FROM ".MITARBEITER_TABELLE." WHERE email = '".$regEmail."' LIMIT 1";
                $selectExistingQuery = $db->query($SQLSelectExistingUser);

                if($selectExistingQuery->affectedRows()){
                    $existingUser = $db->fetchArray($SQLSelectExistingUser);
                }

                if(is_array($existingUser) && count($existingUser) > 0){
                    $responseArray['status'] = USER_EXISTING;
                }
                else{
                    /* Save User in DB */
                    $SQLSaveUser = "INSERT INTO ".MITARBEITER_TABELLE." (email, passwort, name, vorname, abteilungs_id, stundenzahl, status, angelegt_am) VALUES ('".$regEmail."', '".$regPassword."', '','', 0, 8, 0, '".date("Y-m-d", time())."')";
                    $saveUser = $db->query($SQLSaveUser);
                    
                    $action = "Mitarbeiter Registriert (".$regEmail." - ".date("H:i:s", time()).")";
                    $log = new Log(999, $action);

                    $userSaved = $saveUser->affectedRows();

                    if($userSaved){
                        $responseArray['status'] = REGISTERED;
                        
                        $log->setLogEntry();
                        unset($log);
                    }
                    else{
                        $responseArray['status'] = FAILED;
                    }
                }
            }
            else{
                /* Error */
                $responseArray['status'] = EMPTY_FIELDS;
            }

            return $responseArray;
        }

        public function getUserFromLCode(){
            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    $responseArray['userData'] = $this->autentificationClass->getUser();
                    $responseArray['status'] = SUCCESS;
                }
                else{
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                $responseArray['status'] = NO_USER_FOUND;
            }

            return $responseArray;
        }

        public function activateUser($status = 1){
            $db = $this->autentificationClass->getDB();
            $user = $this->autentificationClass->getUser();

            $userID = $this->getUserID();
            $userSection = $this->getAbteilungsID();

            $responseArray = $userQuery = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    if($this->autentificationClass->getAdminStatus()){
                        if($userID > 0){

                            $updateUser = "UPDATE ".MITARBEITER_TABELLE." SET "; 

                            if($userSection > 0){
                                $updateUser .= "abteilungs_id = '".$userSection."' , ";
                            }
                            $updateUser .= "status = '".$status."' WHERE id = '".$userID."' ";
            
                            $userQuery = $db->query($updateUser);

                            $action = "Mitarbeiter ".$userID.(($status == 1) ? " aktiviert" : " gesperrrt")." (".date("H:i:s", time()).")";
                            $log = new Log($user['id'], $action);

                            if($userQuery->affectedRows()){
                                $responseArray['status'] = SUCCESS;

                                $inactivatedUsers = $this->getInactivedUsers();

                                if($inactivatedUsers['status'] == SUCCESS){
                                    $responseArray['inactivatedUsers'] = $inactivatedUsers['inactivatedUsers'];
                                }

                                $log->setLogEntry();
                                unset($log);
                            }
                            else{
                                $responseArray['status'] = FAILED;
                            }
                        }
                        else{
                            /* Error */
                            $responseArray['status'] = FAILED;
                        }
                    }
                    else{
                        $responseArray['status'] = NO_PERMISSION;
                    }
                }
                else{
                    /* Inactive USer */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
           
        }
        
        public function updateUserData(){
            $db = $this->autentificationClass->getDB();
            $user = $this->autentificationClass->getUser();

            $id = $this->getUserID();
            $email = $this->getEmail();
            $password = $this->getPassword();
            $firstname = $this->getFirstname();
            $lastname = $this->getLastname();
            $hours = $this->getHours();
            $abteilung = $this->getAbteilungsID();

            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){

                    if($id > 0){
                
                        $SQLupdateUserData = "UPDATE ".MITARBEITER_TABELLE." SET ";
                        
                        if(trim($email) != ""){
                            $selectExistingUserEmail = "SELECT * FROM ".MITARBEITER_TABELLE." WHERE email='".$email."' AND id <> ".$id;
                            $existingUserQuery = $db->query($selectExistingUserEmail);

                            if($existingUserQuery->affectedRows()){
                                $exisitingUserArray = $existingUserQuery->fetchAll();
                                
                                if(is_array($exisitingUserArray) && count($exisitingUserArray) > 0){
                                    $email = "";
                                    $responseArray['status'] = USER_EXISTING;

                                    return $responseArray;
                                }
                                else{
                                    $SQLupdateUserData .= "email='".$email."'";
                                }
                                
                            }
                        }

                        if(trim($password) != ""){
                            if(trim($email) != ""){
                                $SQLupdateUserData .= ", ";
                            }
                            $SQLupdateUserData .= "passwort='".$password."'";
                        }
        
                        if(trim($firstname) != ""){
                            if(trim($email) != "" || trim($password) != ""){
                                $SQLupdateUserData .= ", ";
                            }
                            $SQLupdateUserData .= "vorname='".$firstname."'";
                        }
                        
                        if(trim($lastname) != ""){
                            if(trim($email) != "" || trim($password) != "" || trim($firstname) != ""){
                                $SQLupdateUserData .= ", ";
                            }
                            $SQLupdateUserData .= "name='".$lastname."'";
                        }
        
                        if($abteilung > 0){
                            if(trim($email) != "" || trim($password) != "" || trim($firstname) != "" || trim($lastname)){
                                $SQLupdateUserData .= ", ";
                            }
                            $SQLupdateUserData .= "abteilungs_id=".$abteilung."";
                        }
        
                        if(trim($email) != "" || trim($password) != "" || trim($firstname) != "" || trim($lastname) || $abteilung > 0){
                            $SQLupdateUserData .= ", ";
                        }
                       
                        $uData = $this->getUserFromID();
                        
                        $SQLupdateUserData .= "stundenzahl=".$hours." WHERE id=".$id."";
                        $updateUserData = $db->query($SQLupdateUserData);

                        $action = "Mitarbeiter ".$id." bearbeitet (".date("H:i:s", time()).") [".json_encode($uData)."]";
                        $log = new Log($user['id'], $action);

                        if($updateUserData->affectedRows()){
                            $responseArray['status'] = USER_UPDATED;

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
                    /* Inactive USer */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;

        }

        public function logoutUser(){
            $lCode = $this->autentificationClass->getLCode();
            $db = $this->autentificationClass->getDB();

            $responseArray = $userQuery = $userIDArray = $sqlLogoutUserQuery = array();

            $sqlUser = "SELECT id FROM ".MITARBEITER_TABELLE." WHERE loginkey ='".$lCode."' LIMIT 1";
            $userQuery = $db->query($sqlUser);
            
            if($userQuery->affectedRows()){
                $userIDArray = $db->fetchArray($sqlUser);
            }
            
            $userID = $userIDArray['id'];

            $action = "Logout ".$userID."(".date("H:i:s", time()).")";
            $log = new Log($userID, $action);

            if($userID > 0){
                $sqlLogoutUser = "UPDATE ".MITARBEITER_TABELLE." SET loginkey='' WHERE id='".$userID."' ";
                $sqlLogoutUserQuery = $db->query($sqlLogoutUser);
                
                $log->setLogEntry();
                unset($log);

                $responseArray['status'] = USER_LOGGED_OUT;
            }
            else{
                $responseArray['status'] = NO_USER_FOUND;
            }

            return $responseArray;
        }

        public function getUserFromID(){
            $db = $this->autentificationClass->getDB();

            $userID = $this->getUserID();

            $responseArray = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    if($this->autentificationClass->getAdminStatus()){
                        $userData = array();

                        if($userID > 0){
                            $sqlUserData = "SELECT a.id, a.email, a.name, a.vorname, a.abteilungs_id, b.bezeichnung, a.stundenzahl, a.status FROM ".MITARBEITER_TABELLE." AS a, ".ABTEILUNGS_TABELLE." AS b WHERE a.id='".$userID."' AND a.abteilungs_id = b.id LIMIT 1";
                            $selectUserQuery = $db->query($sqlUserData);
                            
                            if($selectUserQuery->affectedRows()){
                                $userData = $db->fetchArray($sqlUserData);
                            }

                            if(is_array($userData) && count($userData) > 0){
                                $responseArray['status'] = SUCCESS;
                                $responseArray['editUser'] = $userData;
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
                    /* Inactived User */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }
        
        public function createNewUser(){
            $db = $this->autentificationClass->getDB();
            $user = $this->autentificationClass->getUser();

            $responseArray = array();
            
            $email = $this->getEmail();
            $password = $this->getPassword();
            $firstname = $this->getFirstname();
            $lastname = $this->getLastname();
            $hours = $this->getHours();
            $abteilung = $this->getAbteilungsID();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    if($this->autentificationClass->getAdminStatus()){

                        if($abteilung == 0){
                            $abteilung = 5;
                        }
            
                        if($email != "" && $password != ""){
                            $regData = $this->registerUser();

                            if($regData['status'] == REGISTERED){
                                $SQLupdateUserData = "UPDATE ".MITARBEITER_TABELLE." SET status = 1,";
            
                                if(trim($firstname) != ""){
                                    $SQLupdateUserData .= "vorname='".$firstname."'";
                                }
                                
                                if(trim($lastname) != ""){
                                    if(trim($firstname) != ""){
                                        $SQLupdateUserData .= ", ";
                                    }
                                    $SQLupdateUserData .= "name='".$lastname."'";
                                }
                
                                if($abteilung > 0){
                                    if(trim($firstname) != "" || trim($lastname)){
                                        $SQLupdateUserData .= ", ";
                                    }
                                    $SQLupdateUserData .= "abteilungs_id=".$abteilung."";
                                }
                
                                if(trim($firstname) != "" || trim($lastname) || $abteilung > 0){
                                    $SQLupdateUserData .= ", ";
                                }
            
                                $SQLupdateUserData .= "stundenzahl=".$hours." WHERE email='".$email."'";
                                $updateUserQuery = $db->query($SQLupdateUserData);
        
                                $action = "Benutzer angelegt ".$email."(".date("H:i:s", time()).")";
                                $log = new Log($user['id'], $action);

                                if($updateUserQuery->affectedRows()){
                                    $responseArray = $regData;
                                    
                                    $log->setLogEntry();
                                    unset($log);
                                }
                                else{
                                    $responseArray['status'] = $SQLupdateUserData;
                                }
                            }
                            else{
                                $responseArray = $regData;
                            }
                        }
                        else{
                            $responseArray['status'] = EMPTY_FIELDS;
                        }
            
                    }
                    else{
                        $responseArray['status'] = NO_PERMISSION;
                    }
                }
                else{
                    /* Inactive USer */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function getInactivedUsers(){
            $db = $this->autentificationClass->getDB();
            $responseArray = array();
             
            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    if($this->autentificationClass->getAdminStatus()){

                        $inactivedUsers = $inactiveUsersQuery = array();

                        $selectInactiveUsers = "SELECT id, email, name, vorname, angelegt_am, status FROM ".MITARBEITER_TABELLE." WHERE status = 0 OR abteilungs_id = 0";
                        $inactiveUsersQuery = $db->query($selectInactiveUsers);

                        if($inactiveUsersQuery->affectedRows()){
                            $inactivedUsers = $inactiveUsersQuery->fetchAll();
                        }

                        if(is_array($inactivedUsers) && !empty($inactivedUsers)){
                            $responseArray['status'] = SUCCESS;
                            $responseArray['inactivatedUsers'] = $inactivedUsers;
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
                    /* Inactive USer */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }
        
        public function getAllUserSections(){
            $db = $this->autentificationClass->getDB();

            $responseArray = $allSectionsQuery = $sectionData = array();

            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    $selectAllSections = "SELECT * FROM ".ABTEILUNGS_TABELLE."";
                    $allSectionsQuery = $db->query($selectAllSections);
                    
                    if($allSectionsQuery->affectedRows()){
                        $sectionData = $db->fetchAll($selectAllSections);
                    }

                    return $sectionData;
                }
                else{
                    /* Inactive USer */
                    $responseArray['status'] = INACTIVE_USER;
                }
            }
            else{
                /* No User Found */
                $responseArray['status'] = NO_USER_FOUND; 
            }

            return $responseArray;
        }

        public function getAllUsers(){
            $db = $this->autentificationClass->getDB();

            $responseArray = $allUsersQuery = array();
             
            if($this->autentificationClass->getUserFound()){
                if($this->autentificationClass->getUserActive()){
                    if($this->autentificationClass->getAdminStatus()){
                        $SQLUsers = "SELECT a.id, a.email, a.name, a.vorname, a.abteilungs_id, a.stundenzahl, b.bezeichnung, a.status FROM ".MITARBEITER_TABELLE." AS a, ".ABTEILUNGS_TABELLE." AS b WHERE a.abteilungs_id = b.id";
                        $allUsersQuery = $db->query($SQLUsers);
                        
                        if($allUsersQuery->affectedRows()){
                            $userArray = $db->fetchAll($SQLUsers);
                        }
                        
                        if(is_array($userArray) && count($userArray) > 0){
                            $responseArray['status'] = SUCCESS;
                            $responseArray['users'] = $userArray;
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
    }
}

?>