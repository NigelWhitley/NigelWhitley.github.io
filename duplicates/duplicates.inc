<?php

	class duplicates_app {
		public $current_page;
		public $xml_file="";
		public $display_mode="";
		public $checked_boxes=array();
		public $original_path;
		public $linked_path;

		public function __construct()
		{
			$this->xml_file="";
			$this->display_mode="";
			$this->checked_boxes=array();
			$this->original_path='/mnt/smb/duplicates';
			$this->linked_path='/duplicates';
		}

		public function show_page()
		{
			$this->check_posted_data();
			if ($this->xml_file == "") {
				//choose_duplicates();
				$this->current_page= new choose_duplicates_page();
				$this->current_page->show();
			} else if ( $this->display_mode == "folder" ) {
				//show_by_folder($duplicates_app);
				$this->current_page= new show_by_folder($this);
				$this->current_page->show();
			} else {
				//show_by_duplicate();
				//$current_page= new show_by_duplicate($duplicates_app->xml_file);
				$this->current_page= new show_by_duplicate($this);
				$this->current_page->show();
			}
		}

		public function check_posted_data()
		{
			$checked_count=0;

			if (isset($_SESSION["delfile"])) {
				#print "<p>";
				#print "Checkboxes ticked<br/>";
				if (is_array($_SESSION["delfile"])) {
					#print_r($_POST["delfile"]);
					foreach ($_SESSION["delfile"] as $file_name => $checkbox) {
						$checked_count++;
						$this->checked_boxes[$checked_count]=$file_name;
					}
				} else {
					#print $_POST["delfile"];
					$checked_count++;
					$this->checked_boxes[$checked_count]=$_SESSION["delfile"];
				}
				#print "</p>";
			}

			# Add a dummy name to the end of the list of checked boxes
			# This means we don't need to check whether the next_checked value is within the valid range
			//$checked_count;
			$checkbox_delimiter=get_checkbox_delimiter();
			$this->checked_boxes[$checked_count+1]="0" . $checkbox_delimiter . "0" . $checkbox_delimiter;

			if (isset($_POST["xml_file"])) {
				$this->xml_file=$_POST["xml_file"];
			} else {
				$this->xml_file="";
			}

			if (isset($_POST["display_mode"])) {
				$this->display_mode=$_POST["display_mode"];
			} else {
				$this->display_mode="duplicates";
			}

		}

	}


require_once "tools.inc";
require_once "basic_page.inc";
require_once "duplicates_page.inc";
require_once "choose_duplicates.inc";
require_once "show_by_duplicate.inc";
require_once "show_by_folder.inc";

?>