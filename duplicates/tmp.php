<?php
	session_start();

	#Define global variables
	$checked_boxes=array();
	$chosen_file="";
	$display_mode="";

		#function get_checkbox_delimiter() {
		#	return ":";
		#}


	require_once "duplicates_ajax.inc";
	$checkbox_delimiter=get_checkbox_delimiter();


	$_SESSION["delfile"]["/mnt/smb/personal/hot/stars/fakes/anna-kournikova/1/fake_anna_kournikova_3.jpg"]="";
	//print "getting deletions\n";
	$status=get_deletions();
	//if ( $_SESSION["details"]["group_id"] == $group_id ) {
		//echo "post Matched group id\n";
		#unset($_SESSION["details"]["group_id"]);
	//} else {
		#$_SESSION["details"]["group_id"] = $group_id;
		//echo "post Did not match group id\n";
	//}
	#$status=get_resize_info();
	//check_posted_data();


?> 
