<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class GroupFactory {

	private $_ci;

 	function __construct()
    {
    	//When the class is constructed get an instance of codeigniter so we can access it locally
    	$this->_ci =& get_instance();
    	//Include the group_model so we can use it
    	$this->_ci->load->model("group_model");
    }

    public function getGroup($id = 0) {
    	//Are we getting an individual group or are we getting them all
    	if ($id > 0) {
    		//Getting an individual group
    		$query = $this->_ci->db->get_where("leave_group", array("id" => $id));
    		//Check if any results were returned
    		if ($query->num_rows() > 0) {
    			//Pass the data to our local function to create an object for us and return this new object
    			return $this->createObjectFromData($query->row());
    		}
    		return false;
    	} else {
    		//Getting all the groups
    		$query = $this->_ci->db->select("*")->from("leave_group")->get();
    		//Check if any results were returned
    		if ($query->num_rows() > 0) {
    			//Create an array to store groups
    			$groups = array();
    			//Loop through each row returned from the query
    			foreach ($query->result() as $row) {
    				//Pass the row data to our local function which creates a new group object with the data provided and add it to the groups array
    				$groups = $this->createObjectFromData($row);
    			}
    			//Return the groups array
    			return $groups;
    		}
    		return false;
    	}
    }

    public function createObject() {
	//Create a new group_model object
	$group = new Group_Model();
	//Set the ID on the group model
	$group->setId(0);
	//Set the name on the group model
	$group->setName("");
	return $group;
    }

    public function createObjectFromData($row) {
	//Create a new group_model object
	$group = new Group_Model();
	//Set the ID on the group model
	//echo "<br/> from data <br/>";
	//var_dump($row);
	//if ( array_key_exists("id", $row) ) {
	if ( $row->id > 0 ) {
	    //$group->setId($row["id"]);
	    $group->setId($row->id);
	} else {
	    $group->setId(0);
	}
	//Set the name on the group model
	$group->setName($row->name);
	return $group;
    }

} 
