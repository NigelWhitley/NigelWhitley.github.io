<?php
/**
 * Includes the Clue_Model class as well as the required sub-classes
 * @package codeigniter.application.models
 */

/**
 * Clue_Model extends codeigniters base CI_Model to inherit all codeigniter magic!
 * @author Nigel Whitley
 * @package codeigniter.application.models
 */
class Clue_model extends CI_Model
{
	
	/*
	* A private variable to represent each column in the database
	*/
	private $_id;
	private $_leave_group_id;
	private $_given_name;
	private $_family_name;
	private $_public_ref;

	function __construct()
	{
		parent::__construct();
	}

	/*
	* SET's & GET's
	* Set's and get's allow you to retrieve or set a private variable on an object
	*/


	/**
		ID
	**/

	/**
	* @return int [$this->_id] Return this objects ID
	*/
	public function getId()
	{
		return $this->_id;
	}

	/**
	* @param int Integer to set this objects ID to
	*/
	public function setId($value)
	{
		$this->_id = $value;
	}

	/**
		LEAVE GROUP ID
	**/

	/**
	* @return int [$this->_leave_group_id] Return the id of the object's leave group
	*/
	public function getLeaveGroupId()
	{
		return $this->_leave_group_id;
	}

	/**
	* @param int Integer to set objects leave group id
	*/
	public function setLeaveGroupId($value)
	{
		$this->_leave_group_id = $value;
	}

	/**
		NAME
	**/

	/**
	* @return string [$this->_given_name] [$this->_family_name] Return this objects name
	*/
	public function getName()
	{
		return $this->getGivenName() . " " . $this->getFamilyName();
	}

	/**
	* @param string String to set this objects name to
	*/
	public function setName($value)
	{
		$this->_username = $value;
	}

	/**
		GIVEN NAME
	**/

	/**
	* @return string [$this->_given_name] Return given name
	*/
	public function getGivenName()
	{
		return $this->_given_name();
	}

	/**
	* @param string String to set given name
	*/
	public function setGivenName($value)
	{
		$this->_given_name = $value;
	}

	/**
		FAMILY NAME
	**/

	/**
	* @return string [$this->_family_name] Return this objects family name
	*/
	public function getFamilyName()
	{
		return $this->_family_name();
	}

	/**
	* @param string String to set family name to
	*/
	public function setFamilyName($value)
	{
		$this->_family_name = $value;
	}

	/**
		Public reference (typically used by customer to uniquely reference a person)
	**/

	/**
	* @return string [$this->_public_ref] Return this objects public reference
	*/
	public function getPublicRef()
	{
		return $this->_public_ref();
	}

	/**
	* @param string String to set public reference to
	*/
	public function setPublicRef($value)
	{
		$this->_public_ref = $value;
	}

	/*
	* Class Methods
	*/

	/**
	*	Commit method, this will comment the entire object to the database
	*/
	public function commit()
	{
		$data = array(
			'family_name' => $this->_family_name,
			'given_name' => $this->_given_name,
			'public_ref' => $this->_public_ref
		);

		if ($this->_id > 0) {
			//We have an ID so we need to update this object because it is not new
			if ($this->db->update("person", $data, array("id" => $this->_id))) {
				return true;
			}
		} else {
			//We dont have an ID meaning it is new and not yet in the database so we need to do an insert
			if ($this->db->insert("person", $data)) {
				//Now we can get the ID and update the newly created object
				$this->_id = $this->db->insert_id();
				return true;
			}
		}
		return false;
	}
} 
