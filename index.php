<?php
# Anfragen von allen Clients erlauben
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

ini_set('display_errors', 0);

/* DB-Konstanten */
define("DB_HOST", "localhost");
define("DB_USER", "root");
define("DB_PASSWORD", "");
define("DB_DATABASE", "keno");
define("DB_PORT", 3306);

/* Error-Message Konstanten */
define("FAILED", 0);
define("SUCCESS", 1);

# load database
require_once("db.php");


$action = $_REQUEST['action'];
$postData = json_decode($_REQUEST['postData'], true);

$db = new db(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
$responseArray = array();

if(!$action){
    echo "Keine Aktion";exit;
}

switch($action){
    
    case "setEntry":
        
        $tipp = $postData['tipp'];
        #var_dump($tipp);

        $sqlInsertEntry = "INSERT INTO keno_entries (entry_values) VALUES ('".$tipp."')";
        #$sqlInsertEntry = "SELECT * FROM keno_entries";
        $queryResult = $db->query($sqlInsertEntry);

        if($queryResult->affectedRows()){
            $responseArray['status'] = SUCCESS;
        }
        else{
            $responseArray['status'] = FAILED;
        }

        #var_dump($db);
        #echo $sqlInsertEntry;

    break;

    case "getResults":
        $tipp = json_decode($postData['tipp']);
        sort($tipp);
        
        $SQLgetAllEntries = "SELECT * FROM keno_entries";
        $queryResult = $db->query($SQLgetAllEntries);
        // affected rows if
        $allResultsArray = $db->fetchAll();

        #echo "<br />---<br />";

        #var_dump($allResultsArray);
        $i = $richtigeTipps = 0;
        $resultArray = array();

        foreach($allResultsArray AS $currentTipp){
            $valuesArray = json_decode($currentTipp['entry_values']);
            sort($valuesArray);

            #echo "--<br />--";
            #var_dump($valuesArray);
            #echo "--<br />--";
            $anzahl = count($valuesArray);
            #echo "<br />".$anzahl;

            foreach($valuesArray AS $currentTipp){
                if(in_array($currentTipp, $tipp)){
                    $resultArray[$i][$currentTipp] = 1;
                    $richtigeTipps++;
                }
                else{
                    $resultArray[$i][$currentTipp] = 0;
                }
            }

            switch($anzahl){

                case 2:
                    switch($richtigeTipps){
                        
                        case 2:
                            $gewinn = "1€->6€; 2€->12€; 5€->30€; 10€->60€";
                        break;

                        default: 
                            $gewinn = "0€";
                        break;
                    }
                break;
                
                case 3:
                    switch($richtigeTipps){

                        case 3:
                            $gewinn = "1€->16€; 2€->32€; 5€->80€; 10€->160€";
                        break;

                        case 2:
                            $gewinn = "1€->1€; 2€->2€; 5€->5€; 10€->10€";
                        break;

                        default: 
                            $gewinn = "0€";
                        break;
                    }
                break;

                case 4:
                    switch($richtigeTipps){

                        case 4:
                            $gewinn = "1€->22€; 2€->44€; 5€->110€; 10€->220€";
                        break;

                        case 3:
                            $gewinn = "1€->2€; 2€->4€; 5€->10€; 10€->20€";
                        break;

                        case 2:
                            $gewinn = "1€->1€; 2€->2€; 5€->5€; 10€->10€";
                        break;

                        default: 
                            $gewinn = "0€";
                        break;
                    }
                break;

                case 5:
                    switch($richtigeTipps){

                        case 5:
                            $gewinn = "1€->100€; 2€->200€; 5€->500€; 10€->1.000€";
                        break;

                        case 4:
                            $gewinn = "1€->7€; 2€->14€; 5€->35€; 10€->70€";
                        break;

                        case 3:
                            $gewinn = "1€->2€; 2€->4€; 5€->10€; 10€->20€";
                        break;

                        default: 
                            $gewinn = "0€";
                        break;
                    }
                break;

                case 6:
                    switch($richtigeTipps){

                        case 6:
                            $gewinn = "1€->500€; 2€->1.000€; 5€->2.500€; 10€->5.000€";
                        break;

                        case 5:
                            $gewinn = "1€->15€; 2€->30€; 5€->75€; 10€->150€";
                        break;

                        case 4:
                            $gewinn = "1€->2€; 2€->4€; 5€->10€; 10€->20€";
                        break;

                        case 3:
                            $gewinn = "1€->1€; 2€->2€; 5€->5€; 10€->10€";
                        break;
    
                        default: 
                            $gewinn = "0€";
                        break;
                    }
                break;

                case 7:
                    switch($richtigeTipps){
                        
                        case 7:
                            $gewinn = "1€->1.000€; 2€->2.000€; 5€->5.000€; 10€->10.000€";
                        break;

                        case 6:
                            $gewinn = "1€->100€; 2€->200€; 5€->500€; 10€->1.000€";
                        break;

                        case 5:
                            $gewinn = "1€->12€; 2€->24€; 5€->60€; 10€->120€";
                        break;

                        case 4:
                            $gewinn = "1€->1€; 2€->2€; 5€->5€; 10€->10€";
                        break;

                        default: 
                            $gewinn = "0€";
                        break;
                    }
                break;

                case 8:
                    switch($richtigeTipps){

                        case 8:
                            $gewinn = "1€->10.000€; 2€->20.000€; 5€->50.000€; 10€->100.000€";
                        break;

                        case 7:
                            $gewinn = "1€->100€; 2€->200€; 5€->500€; 10€->1.000€";
                        break;

                        case 6:
                            $gewinn = "1€->15€; 2€->30€; 5€->75€; 10€->150€";
                        break;

                        case 5:
                            $gewinn = "1€->2€; 2€->4€; 5€->10€; 10€->20€";
                        break;

                        case 4:
                            $gewinn = "1€->1€; 2€->2€; 5€->5€; 10€->10€";
                        break;

                        default: 
                            $gewinn = "[0] 1€->1€; 2€->2€; 5€->5€; 10€->10€";
                        break;
                    }
                break;

                case 9:
                    switch($richtigeTipps){

                        case 9:
                            $gewinn = "1€->50.000€; 2€->100.000€; 5€->250.000€; 10€->500.000€";
                        break;

                        case 8:
                            $gewinn = "1€->1.000€; 2€->2.000€; 5€->5.000€; 10€->10.000€";
                        break;

                        case 7:
                            $gewinn = "1€->20€; 2€->40€; 5€->100€; 10€->200€";
                        break;

                        case 6:
                            $gewinn = "1€->5€; 2€->10€; 5€->25€; 10€->50€";
                        break;

                        case 5:
                            $gewinn = "1€->2€; 2€->4€; 5€->10€; 10€->20€";
                        break;

                        default: 
                            $gewinn = "[0] 1€->2€; 2€->4€; 5€->10€; 10€->20€";
                        break;
                    }
                break;

                case 10:
                    switch($richtigeTipps){
                        case 10:
                            $gewinn = "1€->100.000€; 2€->200.000€; 5€->500.000€; 10€->1.000.000€";
                        break;

                        case 9:
                            $gewinn = "1€->1.000€; 2€->2.000€; 5€->5.000€; 10€->10.000€";
                        break;

                        case 8:
                            $gewinn = "1€->100€; 2€->200€; 5€->500€; 10€->1.000€";
                        break;

                        case 7:
                            $gewinn = "1€->15€; 2€->30€; 5€->75€; 10€->150€";
                        break;

                        case 6:
                            $gewinn = "1€->5€; 2€->10€; 5€->25€; 10€->50€";
                        break;

                        case 5: 
                            $gewinn = "1€->2€; 2€->4€; 5€->10€; 10€->20€";
                        break;

                        default: 
                            $gewinn = "[0] 1€->2€; 2€->4€; 5€->10€; 10€->20€";
                        break;
                    }
                break;

                default:
                    $gewinn = "[000] 1€->2€; 2€->4€; 5€->10€; 10€->20€";
                break;
            }
            $resultArray[$i][0] = $richtigeTipps."/".$anzahl." Richtige Zahlen Gewinn: [".$gewinn."]";


            $i++;
            $richtigeTipps = 0;
        }
        
        $responseArray['status'] = SUCCESS;
        $responseArray['data'] = $resultArray;
        

    break;

    default:

    break;
}

echo json_encode($responseArray);