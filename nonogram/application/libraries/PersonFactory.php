<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class PersonFactory {

	private $_ci;

 	function __construct()
    {
    	//When the class is constructed get an instance of codeigniter so we can access it locally
    	$this->_ci =& get_instance();
    	//Include the person_model so we can use it
    	$this->_ci->load->model("person_model");
    }

    public function getPerson($id = 0) {
    	//Are we getting an individual person or are we getting them all
    	if ($id > 0) {
    		//Getting an individual person
    		$query = $this->_ci->db->get_where("person", array("id" => $id));
    		//Check if any results were returned
    		if ($query->num_rows() > 0) {
    			//Pass the data to our local function to create an object for us and return this new object
    			return $this->createObjectFromData($query->row());
    		}
    		return false;
    	} else {
    		//Getting all the persons
    		$query = $this->_ci->db->select("*")->from("person")->get();
    		//Check if any results were returned
    		if ($query->num_rows() > 0) {
    			//Create an array to store persons
    			$persons = array();
    			//Loop through each row returned from the query
    			foreach ($query->result() as $row) {
    				//Pass the row data to our local function which creates a new person object with the data provided and add it to the persons array
    				$persons[] = $this->createObjectFromData($row);
    			}
    			//Return the persons array
    			return $persons;
    		}
    		return false;
    	}
    }

    public function createObjectFromData($row) {
	//Create a new person_model object
	$person = new Person_Model();
	echo "Create Person from data";
	var_dump($row);
	if ( array_key_exists("id", $row) ) {
	    //Set the ID on the person model
	    $person->setId($row["id"]);
	}
	//Set the ID of the leave group on the person model
	$person->setLeaveGroupId($row["leave_group_id"]);
	//Set the given name on the person model
	$person->setGivenName($row["given_name"]);
	//Set the family name on the person model
	$person->setFamilyName($row["family_name"]);
	//Set the public ref on the person model
	$person->setPublicRef($row["public_ref"]);
	//Return the new person object
	return $person;
    }

    public function createObject() {
    	//Create a new person_model object
    	$person = new Person_Model();
    	//Set the ID on the person model
    	$person->setId(0);
    	//Set the ID of the leave group on the person model
    	$person->setLeaveGroupId(0);
    	//Set the given name on the person model
    	$person->setGivenName("");
    	//Set the family name on the person model
    	$person->setFamilyName("");
    	//Set the public ref on the person model
    	$person->setPublicRef("");
    	//Return the new person object
    	return $person;
    }

} 
