<?php
# Anfragen von allen Clients erlauben
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

ini_set('display_errors', 0);

date_default_timezone_set('Europe/Berlin'); 
setlocale (LC_TIME, "de_DE");

/* Database Variables */
define('MITARBEITER_TABELLE', 'mitarbeiter');
define('BESTAETIGUNG_TABELLE', 'bestaetigung');
define('ZEIT_TABELLE', 'zeitbuchungen');
define('TAG_TABELLE', 'tag');
define('ABTEILUNGS_TABELLE', 'abteilungen');
define('LOG_TABELLE', 'log');


/* Error-Message Konstanten */
define("FAILED", 0);
define("SUCCESS", 1);
define("REGISTERED", 2);
define("WRONG_PASSWORD", 4);
define("NO_USER_FOUND", 8);
define("EMPTY_FIELDS", 16);
define("USER_FOUND", 32);
define("USER_LOGGED_OUT", 64);
define("USER_EXISTING", 128);
define("PASSWORD_NOT_CHANGED", 1024);
define("EMAIL_NOT_CHANGED", 2048);
define("USER_UPDATED", 4096);
define("NO_PERMISSION", 8192);
define("INACTIVE_USER", 999);

/* DB-Konstanten */
define("DB_HOST", "localhost");
define("DB_USER", "root");
define("DB_PASSWORD", "");
//define("DB_DATABASE", "zeiterfassung");
define("DB_DATABASE", "t_db");
define("DB_PORT", 3306);



# load database
require_once("db/db.php");

# load classes
require_once("classes/log_class.php");
require_once("classes/time_class.php");
require_once("classes/user_class.php");
require_once("classes/authentification_class.php");

$action = $_REQUEST['action'];

#$array = array("test" => $_REQUEST);
#echo json_encode($array);
#echo "dsafa";

switch($action){

    case "login":
        $postData           = json_decode($_REQUEST['postData'], true);

        $loginEmail         = $postData['loginEmail'];
        $loginPasswort      = $postData['loginPass'];

        $user = new User("", 0, $loginEmail, $loginPasswort);
        $loginResponse = $user->loginUser();

        echo json_encode($loginResponse);

        unset($user);
        
    break;

    case "register":
        $postData               = json_decode($_REQUEST['postData'], true);

        $registerEmail          = $postData['regEmail'];
        $registerPasswort       = $postData['regPassword'];

        $user = new User("", 0, $registerEmail, $registerPasswort);
        $registerResponse = $user->registerUser();

        echo json_encode($registerResponse);
        
        unset($user);

    break;

    case "checkUser":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];

        $user = new User($lCode);
        $userResult = $user->getUserFromLCode();
        
        if(ISSET($_REQUEST['getSections']) && $_REQUEST['getSections'] == 1){
            $userResult['sectionData'] = $user->getAllUserSections();
        }

        echo json_encode($userResult);
        
        unset($user);

    break;

    case "logoutUser":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];
        
        $user = new User($lCode);
        $responseArray = $user->logoutUser();
        
        echo json_encode($responseArray);
        
        unset($user);

    break;

    case "getUserTime":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];
        
        $userID             = $postData['userID'];
        $tagID              = $postData['tagID'];

        $time = new Time($lCode, $userID, $tagID);

        $responseArray = $time->getTimeTable();

        echo json_encode($responseArray);
        
        unset($time);

    break;
    
    case "userDashboard":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];
        
        $responseArray = array();

        $user = new User($lCode);
        $time = new Time($lCode);


        $responseArray = $time->getUserDashboard();
        
        $responseArray['userData'] = $user->getUserFromLCode();
        $responseArray['inactivatedUsers'] = $user->getInactivedUsers();

        echo json_encode($responseArray);

        unset($user);
        unset($time);

    break;

    case "updateUserData":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];

        $id                 = $postData['userID'];

        $email              = $postData['userEmail'];
        $password           = $postData['userPassword'];

        $arbeitsstunden     = $postData['userHours'];

        $vorname            = $postData['userFirstname'];
        $nachname           = $postData['userLastname'];

        $abteilung          = 0;

        $user = new User($lCode, $id, $email, $password, $vorname, $nachname, $arbeitsstunden, $abteilung);
        $responseArray = $user->updateUserData();

        echo json_encode($responseArray);
        
        unset($user);

    break;

    case "updateWorkerData":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];
        
        $id                 = $postData['workerID'];

        $email              = $postData['workerEmail'];
        $password           = $postData['workerPassword'];

        $arbeitsstunden     = $postData['workerHours'];

        $vorname            = $postData['workerFirstname'];
        $nachname           = $postData['workerLastname'];

        $abteilung          = $postData['workerSection'];
        
        $user = new User($lCode, $id, $email, $password, $vorname, $nachname, $arbeitsstunden, $abteilung);
        $responseArray = $user->updateUserData();

        echo json_encode($responseArray);

        unset($user);

    break;

    case "setDayComment":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];

        $tagID              = $postData['tagID'];
        $notiz              = $postData['dayComment'];

        $time = new Time($lCode, 0, $tagID, 0, 0, 0, "", 0, "", 0, $notiz);
        $responseArray = $time->editDay();

        echo json_encode($responseArray);

        unset($time);

    break;
    
    case "createWorker":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];

        $email              = $postData['workerEmail'];
        $password           = $postData['workerPassword'];

        $arbeitsstunden     = $postData['workerHours'];

        $vorname            = $postData['workerFirstname'];
        $nachname           = $postData['workerLastname'];

        $abteilung          = $postData['workerSection'];

        $user = new User($lCode, 0, $email, $password, $vorname, $nachname, $arbeitsstunden, $abteilung);
        $responseArray = $user->createNewUser();
        
        echo json_encode($responseArray);

        unset($user);

    break;

    case "getAllUsers":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];

        $user = new User($lCode);
        $responseArray = $user->getAllUsers();

        echo json_encode($responseArray);
        
        unset($user);

    break;

    case "getUserData":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];
        
        $userID             = $postData['userID'];

        $user = new User($lCode, $userID);
        $responseArray = $user->getUserFromID();

        echo json_encode($responseArray);
        
        unset($user);

    break;

    case "activateUser":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];
        
        $userID             = $postData['userID'];
        $setSection         = $postData['userSection'];
        $userStatus         = $postData['uStatus'];

        $user = new User($lCode, $userID, "", "", "", "", 0, $setSection);
        $responseArray = $user->activateUser($userStatus);

        echo json_encode($responseArray);
        
        unset($user);

    break;

    case "confirmUserBooking":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];
        
        $tagID              = $postData['tagID'];

        $time = new Time($lCode, 0, $tagID);
        $responseArray = $time->verifyBooking();

        echo json_encode($responseArray);

        unset($time);

    break;
        
    case "timeTracking":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];
        
        $bezeichnung        = $postData['trackingName'];
        $tagID              = $postData['dayID'];
        
        $time = new Time($lCode, 0, $tagID, 0, 0, 0, $bezeichnung);
        $responseArray = $time->saveTimeTracking();

        echo json_encode($responseArray);
        
        unset($time);

    break;

    case "updateEntry":
        $postData               = json_decode($_REQUEST['postData'], true);
        $lCode                  = $postData['lCode'];

        $tagID                  = $postData['tagID'];
        $userID                 = $postData['userID'];
        $bookingID              = $postData['bookingID'];
        $start                  = $postData['start'];
        $stop                   = $postData['stop'];
        $stop_bezeichnung       = $postData['stop_bezeichnung'];
        $getDay                 = $postData['getDay'];
        
        $time = new Time($lCode, $userID, $tagID, $bookingID, 0, $start, "", $stop, $stop_bezeichnung);
        $responseArray = $time->editUserTime($getDay);

        echo json_encode($responseArray);
        
        unset($time);

    break;

    case "deleteEntry":
        $postData               = json_decode($_REQUEST['postData'], true);
        $lCode                  = $postData['lCode'];
        
        $bookingID              = $postData['bookingID'];
        $userID                 = $postData['userID'];
        $getDay                 = $postData['getDay'];


        $time = new Time($lCode, $userID, 0, $bookingID);
        $responseArray  = $time->deleteBooking($getDay);

        echo json_encode($responseArray);

        unset($time);

    break;

    case "newDayEntry":
        $postData               = json_decode($_REQUEST['postData'], true);
        $lCode                  = $postData['lCode'];

        $date                   = $postData['datum'];
        $userID                 = $postData['userID'];
        
        $time = new Time($lCode, $userID, 0, 0, $date);
        $responseArray = $time->setDayEntry();

        echo json_encode($responseArray);
        
        unset($time);

    break;
    
    case "insertNewEntry":
        $postData               = json_decode($_REQUEST['postData'], true);
        $lCode                  = $postData['lCode'];

        $tagID                  = $postData['tagID'];
        $userID                 = $postData['userID'];
        $start                  = $postData['start'];
        $stop                   = $postData['stop'];
        $stop_bezeichnung       = $postData['stop_bezeichnung'];
        $getDay                 = $postData['getDay'];
        
        $time = new Time($lCode, $userID, $tagID, 0, 0, $start, "", $stop, $stop_bezeichnung);
        $responseArray = $time->editUserTime($getDay);

        echo json_encode($responseArray);

        unset($time);

    break;

    case "getUserHours":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];

        $time = new Time($lCode);
        $responseArray = $time->getDailyHoursFromUser();

        echo json_encode($responseArray);

        unset($time);

    break;
    
    case "requestCSV":
        $postData           = json_decode($_REQUEST['postData'], true);
        $lCode              = $postData['lCode'];
        
        $userID             = $postData['userID'];
        $tagID              = $postData['tagID'];

        $time = new Time($lCode, $userID, $tagID);
        $responseArray = $time->createCSV();

        echo json_encode($responseArray);

        unset($time);

    break;

    default:
        $array = ['Serverstatus' => "Erreichbar"];
        
        $Now = new DateTime();
        #$Now1 = new DateTimeImmutable();
        #$Now2 = new DateTime('now');
        
        $array = [$array, "jetzt", $Now, time(), date("Y-m-d", time())];
        
        echo json_encode($array);
    break;
}

?>