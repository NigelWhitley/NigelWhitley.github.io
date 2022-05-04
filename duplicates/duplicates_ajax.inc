<?php
	class ResponseXML
	{

		protected $element_stack = array();
		protected $line = array();
		//protected $last_line_output = -1;

		function start()
		{
			$this->line = array();
			//header('Content-Type: text/xml');
			//header('Content-Type: text/html');
			$this->line[count($this->line)]='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
			$this->line[count($this->line)]="<response>";
		}

		function complex_start($name, $attributes=array() )
		{
			$start_line="<$name";
			if ($attributes) {
				foreach($attributes as $key => $val) {
					$start_line=$start_line . " " . $key . "=\"" . $val . "\"";
				}
			}
			$start_line= $start_line . ">";
			$this->line[count($this->line)]=$start_line;
}

		function complex_end($name)
		{
			$this->line[count($this->line)]="</" . $name . ">";
		}

		function simple($name, $attributes=array() )
		{
			$simple_line="<$name";
			if ($attributes) {
				foreach($attributes as $key => $val) {
					$simple_line=$simple_line . " " . $key . "=\"" . $val . "\"";
				}
			}
			$simple_line= $simple_line . "></$name>";
			$this->line[count($this->line)]=$simple_line;
		}

		function text($text)
		{
			$this->line[count($this->line)]="$text";
			//echo "\n";
		}

		function end()
		{
			$this->line[count($this->line)]="</response>";
		}

		function show()
		{
			header('Content-Type: text/xml');
			//header('Content-Type: text/html');
			foreach($this->line as $line_index => $response_line) {
				echo $response_line . "\n";
			}
		}

	}


	function get_checkbox_delimiter() {
		return ":";
	}

	#Define global variables
	function split_checkbox_value($checkbox_value, $checkbox_delimiter) {
		$next_checked=explode($checkbox_delimiter, $checkbox_value);
		return $next_checked;
	}


	function get_duplicates_in_group($group_id, $xml_file) {
		$response=new ResponseXML();
		$duplicate_files = array();
		$reader = new XMLReader();

		//$reader->open($_SESSION["xml_file"]);
		$reader->open($xml_file);

		$read_status=$reader->read();
		$found_group=false;
		#echo "while loop start" . "<br/>\n";
		while ( ($read_status) && (! $found_group) ) {
			#echo "node type " . $reader->nodeType . "<br/>\n";
			switch ($reader->nodeType) {
				case (XMLREADER::ELEMENT):
					#$found_group=true;
					#echo "node name  " . $reader->name . "<br/>\n";
					if ($reader->name == "duplicated_image") {
						#echo "duplicate group  " . $reader->getAttribute("group_id") . "<br/>\n";
						if ($reader->getAttribute("group_id") == $group_id ) {
							$found_group=true;
							#echo "found group  " . $group_id. "<br/>\n";
						} else {
							$read_status=$reader->read();
						}
					} else {
						$read_status=$reader->read();
					}
					break;
				default:
					$read_status=$reader->read();
					break;
			}
		}
		#echo "while loop end" . "<br/>\n";

		if ($found_group) {
			#echo "found group , looping though files <br/>\n";
			$image_count=0;
			$duplicate_group=$reader->getAttribute("group_id");
			$end_of_files=false;
			while ( (! $end_of_files) && ($reader->read() ) ) {
				switch ($reader->nodeType) {
					case (XMLREADER::END_ELEMENT):
						#$found_group=true;
						#echo "node name end " . $reader->name . "<br/>\n";
						if ($reader->name == "duplicated_image") {
							if ($reader->getAttribute("group_id") == $group_id ) {
								$end_of_files=true;
								#echo "end of files for group  " . $group_id. "<br/>\n";
							}
						}
						break;
					case (XMLREADER::TEXT):
						#For this xml, the only entity with text values is the "file" element
						if (file_exists($reader->value)) {
							$duplicate_files[$image_count]=$reader->value;
							$image_count++;
						}
						break;
					default:
						break;
				}
			}
			if ($reader->nodeType == XMLREADER::END_ELEMENT) {
				if ($reader->name == "duplicated_image") {
					#echo "checking image list\n";
					$duplicated_image=$duplicate_files[0];
					$image_info=getimagesize($duplicated_image);
					$image_width=$image_info[0];
					$image_height=$image_info[1];
					$_SESSION["details"]= array( "group_id" => $group_id, "image_width" => $image_width, "image_height" => $image_height, "count"=>count($duplicate_files) );

					$response->start();
					//$linked_image=substr_replace($duplicated_image, $linked_path, 0, strlen($original_path));
					$duplicate_group=$reader->getAttribute("group_id");
					$response->complex_start("duplicates", array("group_id" => $group_id,   "image_height" => $image_height, "image_width" => $image_width) );
					foreach ($duplicate_files as $file_index => $file) {
						$deleted = "";
						if ( isset($_SESSION["delfile"][$file]) ) {
							if ( isset($_SESSION["delfolder"][dirname($file)]) ) {
								$deleted = "both";
							} else {
								$deleted = "file";
							}
						} else {
							if ( isset($_SESSION["delfolder"][dirname($file)]) ) {
								$deleted = "folder";
							} else {
								$deleted = "";
							}
							//$response->complex_start("file", array());
						}
						if ( $deleted != "" ) {
							$response->complex_start("file", array("deleted" => $deleted));
						} else {
							$response->complex_start("file", array());
						}
						$response->text($file);
						$response->complex_end("file");
					}
					$response->complex_end("duplicates");
					$response->end();
				}
			}
		}

		$reader->close();
		$response->show();
		return true;
	}


	function get_resize_info() {
				$response=new ResponseXML();
				$response->start();
				#$response->simple("resize", array("group_id" => $_SESSION["details"]["group_id"],   "image_height" => $_SESSION["details"]["image_height"], "image_width" => $_SESSION["details"]["image_width"]) );
				if (isset($_SESSION["details"])) {
					$response->simple("resize", array("group_id" => $_SESSION["details"]["group_id"], "image_height" => $_SESSION["details"]["image_height"], "image_width" => $_SESSION["details"]["image_width"]) );
				} else {
					$response->simple("resize", array("group_id" => -111, "image_height" => 500, "image_width" => 400) );
				}
				$response->end();
				$response->show();
	}


	function get_deletions() {
		$response=new ResponseXML();
		$response->start();
		if (isset($_SESSION["delfile"]) ) {
			foreach ($_SESSION["delfile"] as $filename => $file_info) {
				$response->simple("deleted_file", array("filename" => $filename ) );
			}
		}

		if (isset($_SESSION["delfolder"]) ) {
			foreach ($_SESSION["delfolder"] as $folder => $folder_info) {
				$response->simple("deleted_folder", array("folder" => $folder ) );
			}
		}

		$response->end();
		$response->show();
		return true;
	}


?>