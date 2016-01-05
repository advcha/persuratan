<?php

class DbHandler {

    private $conn;

    function __construct() {
        require_once 'dbConnect.php';
        // opening db connection
        $db = new dbConnect();
        $this->conn = $db->connect();
    }
    /**
     * Fetching single record
     */
    public function getOneRecord($query) {
        $r = $this->conn->query($query.' LIMIT 1') or die($this->conn->error.__LINE__);
        return $result = $r->fetch_assoc();    
    }
    /**
     * Fetching multiple record
     */
    public function getRecords($query) {
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
        //return $result = $r->fetch_assoc();    
        $result=array();
        while($row=$r->fetch_assoc()){
			$result[]=$row;
		}
		return $result;
    }
    /**
     * Updating record
     */
    public function updateRecord($query) {
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
        $result=array();
        if($r){
			$result[]=array("result"=>"success");
		}
		return $result;
    }
    /**
     * Deleting record
     */
    public function deleteRecord($query) {
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);
        $result=array();
        if($r){
			$result[]=array("result"=>"success");
		}
		return $result;
    }
    /**
     * Creating new record
     */
    public function insertIntoTable($obj, $column_names, $table_name) {
        
        $c = (array) $obj;
        $keys = array_keys($c);
        $columns = '';
        $values = '';
        foreach($column_names as $desired_key){ // Check the obj received. If blank insert blank into the array.
           if(!in_array($desired_key, $keys)) {
                $$desired_key = '';
            }else{
                $$desired_key = $c[$desired_key];
            }
            $columns = $columns.$desired_key.',';
            $values = $values."'".$$desired_key."',";
        }
        $query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }
    /**
     * Creating new record
     */
    public function insertRecord($table_name, $data) {
        
        $columns = '';
        $values = '';
        foreach($data as $key=>$value){ // Check the obj received. If blank insert blank into the array.
            $columns = $columns.$key.',';
            $values = $values."'".$value."',";
        }
        $query = "INSERT INTO ".$table_name."(".trim($columns,',').") VALUES(".trim($values,',').")";
        $r = $this->conn->query($query) or die($this->conn->error.__LINE__);

        if ($r) {
            $new_row_id = $this->conn->insert_id;
            return $new_row_id;
            } else {
            return NULL;
        }
    }
    
	public function getSession(){
		if (!isset($_SESSION)) {
			session_start();
		}
		$sess = array();
		if(isset($_SESSION['iduser']))
		{
			$sess["iduser"] = $_SESSION['iduser'];
			$sess["nama_lengkap"] = $_SESSION['nama_lengkap'];
			$sess["userlevel"] = $_SESSION['userlevel'];
		}
		else
		{
			$sess["iduser"] = '';
			$sess["nama_lengkap"] = '';
			$sess["userlevel"] = '';
		}
		return $sess;
	}
	public function destroySession(){
		if (!isset($_SESSION)) {
		session_start();
		}
		if(isSet($_SESSION['iduser']))
		{
			unset($_SESSION['iduser']);
			unset($_SESSION['nama_lengkap']);
			unset($_SESSION['userlevel']);
			$info='info';
			if(isSet($_COOKIE[$info]))
			{
				setcookie ($info, '', time() - $cookie_time);
			}
			$msg="Logged Out Successfully...";
		}
		else
		{
			$msg = "Not logged in...";
		}
		return $msg;
	}
 
}

?>
