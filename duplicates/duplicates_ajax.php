<?php
	//session_start();

	#Define global variables
	$checked_boxes=array();
	$chosen_file="";
	$display_mode="";

		#function get_checkbox_delimiter() {
		#	return ":";
		#}


	require_once "duplicates_ajax.inc";
	$checkbox_delimiter=get_checkbox_delimiter();


	function check_posted_data() {
		GLOBAL $checked_boxes;
		GLOBAL $chosen_file;
		GLOBAL $display_mode;

		$checked_count=0;

		if ( ( isset($_GET["action"]) ) && ( isset($_GET["target"]) ) ) {
			#if (isset($_POST["delfile[]"])) {
			if ( $_GET["action"] == "delfolder" ) {
				#print "<p>";
				#print "Checkboxes ticked<br/>";
				#print "</p>";
				$_SESSION["delfolder"][$_GET["target"]]=true;
				#$response="Folder " . $_GET["target"] . " to be deleted";
				#echo count($_SESSION["delfolder"]) . " files to be deleted\n";
				foreach ($_SESSION["delfolder"] as $folder_name => $folder_delete) {
					$response="Folder " . $folder_name . " to be deleted";
					echo $response . "\n";
				}
			} elseif ( $_GET["action"] == "setchosenfile" ) {
				$_SESSION["chosen_file"]=$_GET["target"];
				$response=$_GET["target"] . " chosen as file";
				echo $response . "\n";
			} elseif ( $_GET["action"] == "keepfolder" ) {
				if ( isset($_SESSION["delfolder"][$_GET["target"]]) ) {
					unset($_SESSION["delfolder"][$_GET["target"]]);
					$response="Folder " . $_GET["target"] . " not to be deleted";
				} else {
					$response="Folder " . $_GET["target"] . " not marked for deletion";
				}
				echo $response . "\n";
			} elseif ( $_GET["action"] == "keepfile" ) {
				if ( isset($_SESSION["delfile"][$_GET["target"]]) ) {
					unset($_SESSION["delfile"][$_GET["target"]]);
					//$response="File " . $_GET["target"] . " not to be deleted";
				}
				// This should do different things but I know the hosting service 
				// I'm using at the moment doesn't have session variables so I 
				// ignore the "error" if the session variable is not set
				if ( isset($_SESSION["delfile"][$_GET["target"]]) ) {
					$response=$_GET["target"];
				} else {
					$response=$_GET["target"];
				}
				echo $response . "\n";
			} elseif ( $_GET["action"] == "delfile" ) {
				$_SESSION["delfile"][$_GET["target"]]=true;
				// This should do different things but I know the hosting service 
				// I'm using at the moment doesn't have session variables so I 
				// ignore the "error" if the session variable is still set
				if ( isset($_SESSION["delfile"][$_GET["target"]]) ) {
					$response=$_GET["target"];
				} else {
					$response=$_GET["target"];
				}
				echo $response . "\n";
			} elseif ( $_GET["action"] == "clearsession" ) {
				session_unset();
				$_SESSION["xml_file"]=$_GET["target"];
				$response="Cleared session variables";
				echo $response . "\n";
				#print_r($_SESSION);
			} elseif ( $_GET["action"] == "imageinfo" ) {
				#print "<p>";
				#print "Checkboxes ticked<br/>";
				#print "</p>";
				$duplicated_image=$_GET["target"];
				$image_info=getimagesize($duplicated_image);
				$image_width=$image_info[0];
				$image_height=$image_info[1];
				#$linked_image=substr_replace($duplicated_image, $linked_path, 0, strlen($original_path));
				#$thumbnail_width=ceil(($image_width/$image_height)*$thumbnail_height);
				$response=$image_width . "x" . $image_height . "\n";
				#$response="Folder " . $_GET["target"] . " to be deleted";
				#echo count($_SESSION["delfolder"]) . " files to be deleted\n";
				echo $response . "\n";
				#print_r($_SESSION);
			} elseif ( $_GET["action"] == "resizeinfo" ) {
					get_resize_info();
			} elseif ( $_GET["action"] == "deletions" ) {
					get_deletions();
			} elseif ( $_GET["action"] == "duplicates" ) {
				$group_id=$_GET["target"];
				#$_SESSION{"details"]["group_id"]=$group_id;
				if ( isset($_GET["xml_file"]) ) {
					$status=get_duplicates_in_group($group_id, $_GET["xml_file"]);
				} else {
					$status=get_duplicates_in_group($group_id, 'demo.xml');
				}
				//if (! isset($_SESSION["details"]) ) {
				//	echo $_SESSION["details"];
				//} else {
				//	foreach ($_SESSION["details"] as $key => $value) {
				//		echo "Details key " . $key . " value ". $value . "\n";
				//	}
				//}
				#$response="Folder " . $_GET["target"] . " to be deleted";
				#echo count($_SESSION["delfolder"]) . " files to be deleted\n";
				#echo $response . "\n";
				#print_r($_SESSION);
			}
		} else {
				$response="Action " . $_GET["action"] . " for " . $_GET["target"] . " unknown";
				echo $response;
		}

		#echo $response;

	}



	function choose_duplicates() {
		GLOBAL $chosen_file;
		GLOBAL $display_mode;


		print "<title>Choose xml duplicates file</title>";
		print "</head>";

		// Choose the xml file containing the duplicates information
		$xml_files=glob("*.xml");

		#Have had to create a link to /mnt/smb/personal from DocumentRoot "/srv/httpd/htdocs" to be able to access the images
		#The src in the img tag is a URL so needs to be relative to currentdir or DocumentRoot
		$original_path="/mnt/smb/personal";
		$linked_path="/personal";

	}

	check_posted_data();
	//if ($chosen_file == "") {
	//	choose_duplicates();
	//} else {
	//	show_by_folder();
	//}


?> 
