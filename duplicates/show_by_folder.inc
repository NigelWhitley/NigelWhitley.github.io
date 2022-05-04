<?php

	class show_by_folder extends duplicates_page {
		public $main_app;
		public $xml_file;
		public $duplicates;
		public $duplicate_folders_info;
		public $lookup_folder_ids;
		public $checked_count;
		public $duplicate_group;
		public $reader;

		public function __construct($main_app)
		{
			$this->main_app=$main_app;
			$this->xml_file=$main_app->xml_file;
			$this->duplicates=array();
			$this->duplicate_folders_info=array();
			$this->lookup_folder_ids=array();
			$this->checked_count=0;
			$this->duplicate_group=0;
		}

		public function pre_page()
		{
			// Choose the xml file containing the duplicates information
			parent::pre_page();
			$this->set_title("Show duplicate files by folder");
		}

		public function show_navigation_menu()
		{
			print "<div id=\"nav-menu\">\n";
			print "<ul>\n";
			print "<li onClick=\"return choose_folder();\" >\n";
			print "<span id=\"home\">Home</span>\n";
			print "</li>\n";
			print "<li onClick=\"return view_by_duplicate('" . $this->xml_file . "', false);\">\n";
			print "<span>Show by duplicate</span>\n";
			print "</li>\n";
			print "<li onClick=\"return show_deletions();\">\n";
			print "<span>Show deletions</span>\n";
			print "</li>\n";
			print "<li onClick='history.back()'>\n";
			print "<span title='Previous page'>Back</span>\n";
			print "</li>\n";
			print "</ul>\n";
			print "</div>\n";
		}

		public function show_heading()
		{
			print "<div id=\"header\">\n";
			print "<h1>\n";
			print "Show duplicate files by folder\n";
			print "</h1>\n";
			print "</div>\n";
		}

		public function show_main()
		{
			print "<form name=\"f_duplicates\" method=\"POST\" action=\"show_duplicates_by_folder.php\" onsubmit=\"return checkscript()\">\n";
			print "<input type=\"hidden\" value=\"" . $this->main_app->xml_file . "\" name=\"xml_file\">\n";
			print "<input type=\"hidden\" value=\"" . $this->main_app->display_mode . "\" name=\"display_mode\">\n";

			$this->read_xml_file();
			$this->sort_folders();
			$this->display_folders();
			//$this->dump_folders();

			print "</form>";

		}

		public function dump_folders() {

			$checkbox_delimiter=get_checkbox_delimiter();

			print "<div class='folders'>\n";
			foreach ($this->duplicates as $this_folder => $matched_folders) {
				# Check whether all files in this folder matched
				print "<br/>This Folder name " . $this_folder . "\n";
				print "<br/>--id--" . $this->duplicate_folders_info[$this_folder]["folder_id"] . "\n";
				//print "<span class='this_folder'>" . $this_folder . "</span>\n";
				#print "\n";
				foreach ($matched_folders as $matched_folder => $file_list) {
					if ( $this_folder == $matched_folder ) {
						print "<br/>Same Folder name " . $matched_folder . "\n";
						# Both files are in the same folder
						print "\n";
					} else {
						// This method opens a div for the matched folder but doesn't close it
						// This allows the method for matched files to put the files 
						// inside the same div. We must remember to close it after though.
						print "<br/>Other Folder name " . $matched_folder . "\n";
					}

					foreach ($file_list as $this_file => $duplicates) {
						foreach ($duplicates as $group_id => $other_files) {
							foreach ($other_files as $other_file) {
								print "<br/>This file name " . $this_file . " === " . $group_id . " === " . $other_file . "\n";
							}
						}
					}

				}
			}
			print "</div>\n";

		}

		public function display_folders() {

			$checkbox_delimiter=get_checkbox_delimiter();

			print "<div class='folders'>\n";
			foreach ($this->duplicates as $this_folder => $matched_folders) {
				# Check whether all files in this folder matched
				print "<div id='" . $this->duplicate_folders_info[$this_folder]["folder_id"] . "' class='folder_set'>\n";
				$name_HTML = new HTMLchunk();
				$name_HTML->complex_start( "span", array("class"=>"this_folder") );
				$name_HTML->text( $this_folder );
				$name_HTML->complex_end("span");
				$name_HTML->show();
				
				//print "<span class='this_folder'>" . $this_folder . "</span>\n";
				$controls_HTML = new HTMLchunk();
				$controls_HTML->complex_start( "span", array("class"=>"folder_controls") );
				//print "<span class='folder_controls'>\n";
				if ( $this->duplicate_folders_info[$this_folder]["removable"] ) {
					$this_checked=(isset($_SESSION["delfolder"][$this_folder])?"checked":"");
					$controls_HTML->complex_start( "span", array("class"=>"folder_delete_checkbox") );
					$controls_HTML->simple( "input", array("type"=>"checkbox", "name"=>"delfolder[]", "checked"=>isset($_SESSION["delfolder"][$this_folder]), "onClick"=>"'changeFolder(this, \"" . $checkbox_delimiter . "\");'", "value"=> $this_folder . $checkbox_delimiter . $this->duplicate_folders_info[$this_folder]["folder_id"] ) );
					$controls_HTML->complex_end("span");
					//print "<span class='folder_delete_checkbox'><input type='checkbox' name='delfolder[]'" . $this_checked . " onChange='changeFolder(this, \"" . $checkbox_delimiter . "\")' value='" . $this_folder . $checkbox_delimiter . $this->duplicate_folders_info[$this_folder]["folder_id"] . "'></span>\n";
					//$this_folder_text="Remove folder?";
					$controls_HTML->complex_start( "span", array("class"=>"folder_delete_text") );
					$controls_HTML->text("Remove folder?");
					$controls_HTML->complex_end("span");
					//print "<span class='folder_delete_text'>" . $this_folder_text . "</span>\n";
				}
				/*
				$controls_HTML->complex_start( "span", array("class"=>"folder_delete_button") );
				$controls_HTML->text("Delete files");
				$controls_HTML->complex_end("span");
				//print "<span class='folder_delete_button'>" . "Delete files" . "</span>\n";
				$controls_HTML->complex_start( "span", array("class"=>"folder_keep_button") );
				$controls_HTML->text("Keep files");
				$controls_HTML->complex_end("span");
				//print "<span class='folder_keep_button'>" . "Keep files" . "</span>\n";
				*/
				$controls_HTML->complex_end("span");
				//print "</span>\n";
				$controls_HTML->show();
				#print "\n";
				foreach ($matched_folders as $matched_folder => $file_list) {
					if ( $this_folder == $matched_folder ) {
						# Both files are in the same folder
						print "<div class='same_folder' id='" . $this->duplicate_folders_info[$this_folder]["folder_id"] . $this->duplicate_folders_info[$this_folder]["folder_id"] . "'><span>" . $matched_folder . "</span>";
						print "\n";
					} else {
						// This method opens a div for the matched folder but doesn't close it
						// This allows the method for matched files to put the files 
						// inside the same div. We must remember to close it after though.
						$this->display_other_folder($this_folder, $matched_folder, $file_list);
					}
					$this->display_matched_files($this_folder, $matched_folder, $file_list);
					print "</div>\n";  // Close same/matched folder div
				}
				print "</div>\n";
			}
			print "</div>\n";

		}

		//Display the options for the entire matched folder - not used when duplicate files are in the same folder.
		public function display_other_folder($this_folder, $matched_folder, $file_list) {

			$checkbox_delimiter=get_checkbox_delimiter();

			# Check whether all files in other folder matched
			$matched_files=glob($matched_folder . "/*");
			foreach ($matched_files as $matched_index => $file_name) {
				# remove from the list if not a file e.g. if it's a directory
				if ( filetype($file_name) != "file" ) {
					unset($matched_files[$matched_index]);
				}
			}
			$file_count=count($file_list);
			$folder_class="other_folder";
			$parent_check=strpos($this_folder, $matched_folder . "/");
			$child_check=strpos($matched_folder, $this_folder . "/");
			if ( $this->duplicate_folders_info[$matched_folder]["removable"] ) {
			//if ( count($matched_files) == $file_count ) {
				$folder_class.=" all_other_folder";
			} elseif ( $this->duplicate_folders_info[$this_folder]["removable"] && ( $file_count == $this->duplicate_folders_info[$this_folder]["file_count"] ) ) {
			//} elseif ( count($this_files) == $file_count ) {
				$folder_class.=" all_this_folder";
			} elseif ( ! ($parent_check === false) ) {
				$folder_class.=" parent_folder";
			} elseif ( ! ($child_check === false) ) {
				$folder_class.=" child_folder";
			} else {
				$folder_class.=" some_other_folder";
			}
			$folder_pair_id = $this->duplicate_folders_info[$this_folder]["folder_id"] . $this->duplicate_folders_info[$matched_folder]["folder_id"];
			//print "<div class='" . $folder_class . "'><span class='clickable_span' onClick='moveToFolder(\"" . $this->duplicate_folders_info[$matched_folder]["folder_id"] . "\");'>" . $matched_folder . "</span>";
			print "<div class='" . $folder_class . "' id='" . $folder_pair_id . "'>";
			$controls_HTML = new HTMLchunk();
			print "\n";
			//print "\n";
			//print "<span class='folder_controls'>\n";
			$controls_HTML->complex_start( "span", array("class"=>"clickable_span",  "onClick"=>"'moveToFolder(\"" . $this->duplicate_folders_info[$matched_folder]["folder_id"] . "\");'") );
			$controls_HTML->text($matched_folder);
			$controls_HTML->complex_end("span");
			$controls_HTML->complex_start( "span", array("class"=>"folder_controls") );
			if ( $this->duplicate_folders_info[$matched_folder]["removable"] && ( $file_count == $this->duplicate_folders_info[$matched_folder]["file_count"] ) ) {
				//$matched_checked=isset($_SESSION["delfolder"][$matched_folder])?"checked":"";
				$controls_HTML->complex_start( "span", array("class"=>"dup_folder_delete_checkbox") );
				$controls_HTML->simple( "input", array("type"=>"checkbox", "name"=>"dup_folder[]", "checked"=>isset($_SESSION["delfolder"][$matched_folder]), "onClick"=>"'changeFolder(this, \"" . $checkbox_delimiter . "\")'","value"=>$matched_folder . $checkbox_delimiter . $this->duplicate_folders_info[$matched_folder]["folder_id"] ) );
				$controls_HTML->complex_end("span");
				$controls_HTML->complex_start( "span", array("class"=>"folder_delete_text") );
				$controls_HTML->text("Remove folder?");
				$controls_HTML->complex_end("span");
				//print "<span class='dup_folder_delete_checkbox'><input type='checkbox' name='dup_folder[]'" . $matched_checked . " onChange='changeFolder(this, \"" . $checkbox_delimiter . "\")' value='" . $matched_folder . $checkbox_delimiter . $this->duplicate_folders_info[$matched_folder]["folder_id"] . "'></span>\n";
				//print "<span class='folder_delete_text'>" . $this_folder_text . "</span>\n";
			}
			/*
			$controls_HTML->complex_start( "span", array("class"=>"folder_delete_button") );
			$controls_HTML->text("Delete files");
			$controls_HTML->complex_end("span");
			//print "<span class='folder_delete_button'>" . "Delete files" . "</span>\n";
			$controls_HTML->complex_start( "span", array("class"=>"folder_keep_button") );
			$controls_HTML->text("Keep files");
			$controls_HTML->complex_end("span");
			//print "<span class='folder_keep_button'>" . "Keep files" . "</span>\n";
			*/
			$controls_HTML->complex_end("span");
			//print "</span>\n";
			$controls_HTML->show();
		}


		public function display_matched_files($this_folder, $matched_folder, $file_list) {

			$checkbox_delimiter=get_checkbox_delimiter();

			$files_HTML = new HTMLchunk();
			$files_HTML->complex_start( "div", array("class"=>"file_pairs") );
			//print "<div class='file_pairs'>\n";
			foreach ($file_list as $this_file => $grouped_files) {
				$group_id=key($grouped_files);
				$matched_files=$grouped_files[$group_id];
				foreach ($matched_files as $matched_file) {
					$this_file_full=$this_folder . "/" . $this_file;
					//$matched_file=$duplicate["match"];
					//$duplicate_group=$duplicate["group"];
					$matched_file_full=$matched_folder . "/" . $matched_file;
					$this_checked=(isset($_SESSION["delfile"][$this_file_full])?"checked":"");
					$matched_checked=(isset($_SESSION["delfile"][$matched_file_full])?"checked":"");
					//$this_checked=(isset($_SESSION["delfile"][$this_folder . "/" . $this_file])?"checked":"");
					//$matched_checked=(isset($_SESSION["delfile"][$matched_folder . "/" . $matched_file])?"checked":"");
					$files_HTML->complex_start( "div", array("class"=>"file_pair,group" . $group_id) );
					//print "<div class='file_pair'>";
					$files_HTML->complex_start( "span", array("class"=>"this_file") );
					//print "<span class='this_file'>";
					$files_HTML->simple( "input", array("type"=>"checkbox", "name"=>"delfile[]", "checked"=>isset($_SESSION["delfile"][$this_file_full]), "onClick"=>"'changeFolderFile(this, \"" . $checkbox_delimiter . "\");'","value"=>$this_file_full . $checkbox_delimiter . $this_file . $checkbox_delimiter . $this_folder . $checkbox_delimiter . $this->duplicate_folders_info[$this_folder]["folder_id"] ) );
					//print "<input type='checkbox' name='delfile[]'" . $this_checked . " onChange='changeFolderFile(this, \"" . $checkbox_delimiter . "\")' value='" . $this_file_full . $checkbox_delimiter . $this_file . $checkbox_delimiter . $this_folder . $checkbox_delimiter . $this->duplicate_folders_info[$this_folder]["folder_id"] . "'>\n";
					$files_HTML->complex_start( "span", array("class"=>"this_file_name", "onClick"=>"'show_details_by_file(\"" . $this_folder . "\", \"" . $this_file . "\", \"" . $this->duplicate_folders_info[$this_folder]["folder_id"] . "\") ;'") );
					//print "<span onClick='show_details_by_file(\"" . $this_folder . "\", \"" . $this_file . "\", \"" . $this->duplicate_folders_info[$this_folder]["folder_id"] . "\");' class='this_file_name'>" . $this_file . "</span>";
					$files_HTML->text($this_file);
					$files_HTML->complex_end("span");
					$files_HTML->complex_end("span");
					//print "</span>\n";
					//print "<span onClick='show_details_by_file(\"" . $matched_folder . "\", \"" . $matched_file . "\", \"" . $duplicate_folders_info[$matched_folder]["folder_id"] . "\");' class='other_file'>" . $matched_file . "</span><br/>";
					$files_HTML->complex_start( "span", array("class"=>"other_file") );
					//print "<span class='other_file'>";
					$files_HTML->simple( "input", array("type"=>"checkbox", "name"=>"matchedfile[]", "checked"=>isset($_SESSION["delfile"][$matched_file_full]), "onClick"=>"'changeFolderFile(this, \"" . $checkbox_delimiter . "\");'","value"=>$matched_file_full . $checkbox_delimiter . $matched_file . $checkbox_delimiter . $matched_folder . $checkbox_delimiter . $this->duplicate_folders_info[$matched_folder]["folder_id"] ) );
					//print "<input type='checkbox' name='matchedfile[]'" . $matched_checked . " onChange='changeFolderFile(this, \"" . $checkbox_delimiter . "\")' value='" . $matched_file_full . $checkbox_delimiter . $matched_file . $checkbox_delimiter . $matched_folder . $checkbox_delimiter . $this->duplicate_folders_info[$matched_folder]["folder_id"] . "'>\n";
					$files_HTML->complex_start( "span", array("class"=>"other_file_name", "onClick"=>"'show_details_by_file(\"" . $matched_folder . "\", \"" . $matched_file . "\", \"" . $this->duplicate_folders_info[$matched_folder]["folder_id"] . "\") ;'") );
					//print "<span onClick='show_details_by_file(\"" . $matched_folder . "\", \"" . $matched_file . "\", \"" . $this->duplicate_folders_info[$matched_folder]["folder_id"] . "\");' class='other_file_name'>" . $matched_file . "</span>";
					$files_HTML->text($matched_file);
					$files_HTML->complex_end("span");
					//print "</span>\n";
					$files_HTML->complex_end("span");
					$files_HTML->complex_end("div");
					//print "</div>\n";
				}
			}
			$files_HTML->complex_end("div");
			//print "</div>\n";
			$files_HTML->show();

		}

		public function add_duplicate($file_path1, $file_path2, $duplicate_group) {

			$duplicate_folder1=dirname($file_path1);
			$duplicate_file1=basename($file_path1);
			$duplicate_folder2=dirname($file_path2);
			$duplicate_file2=basename($file_path2);
			if ( ! isset($this->duplicates[$duplicate_folder1][$duplicate_folder2][$duplicate_file1][$duplicate_group]) ) {
				$this->duplicates[$duplicate_folder1][$duplicate_folder2][$duplicate_file1][$duplicate_group] = array($duplicate_file2);
			} else {
				$this->duplicates[$duplicate_folder1][$duplicate_folder2][$duplicate_file1][$duplicate_group][] = $duplicate_file2;
			}
			//print "THIS folder $duplicate_folder1 : file $duplicate_file1 : group $duplicate_group : OTHER folder $duplicate_folder2 : file $duplicate_file2<br/>\n";
			if ( $duplicate_folder1 != $duplicate_folder2 ) {
				if ( ! isset($this->duplicates[$duplicate_folder2][$duplicate_folder1][$duplicate_file2][$duplicate_group]) ) {
					$this->duplicates[$duplicate_folder2][$duplicate_folder1][$duplicate_file2][$duplicate_group] = array($duplicate_file1);
				} else {
					$this->duplicates[$duplicate_folder2][$duplicate_folder1][$duplicate_file2][$duplicate_group][] = $duplicate_file1;
				}
				//print "THIS folder $duplicate_folder2 : file $duplicate_file2 : group $duplicate_group : OTHER folder $duplicate_folder1 : file $duplicate_file1<br/>\n";
			}
		}


		public function read_xml_file() {
		
			$checkbox_delimiter=get_checkbox_delimiter();

			$duplicate_group=0;
			$this->reader = new XMLReader();

			$this->reader->open($this->main_app->xml_file);
			//print "<div class='folders'>\n";
			while ($this->reader->read()) {
				//print "<h4> read node " . $this->reader->nodeType . "</h4>\n";
				switch ($this->reader->nodeType) {
					case (XMLREADER::END_ELEMENT):
						if ($this->reader->name == "duplicated_image") {
							#Check that we still have more than 1
							if ($image_count > 1) {
								$list_size = count($image_list);
								for ($outer_index=1; $outer_index < $list_size; $outer_index++) {
									for ($inner_index=$outer_index+1; $inner_index <= $list_size; $inner_index++) {
										$this->add_duplicate($image_list[$outer_index], $image_list[$inner_index], $duplicate_group);
									}
								}
							}
						}
						break;
					case (XMLREADER::ELEMENT):
						//print "<h4> read element node " . $this->reader->name . "</h4>\n";
						if ($this->reader->name == "duplicated_image") {
							#echo "new image\n";
							$image_list=array();
							$image_count=0;
							$duplicate_group=$this->reader->getAttribute("group_id");
							$duplicate_group=$duplicate_group + 1;
						}
						break;
					case (XMLREADER::TEXT):
						#For this xml, the only entity with text values is the "file" element
						if (file_exists($this->reader->value)) {
							$image_count++;
							$image_list[$image_count]=$this->reader->value;
						}
						break;
				}
			}
			//print "</div>\n";
			$this->reader->close();

			#Sort the data at each level

		}


		public function sort_folders() {

			#Sort the data at each level

			ksort($this->duplicates);
			$folder_id_index = 0;
			$this->duplicate_folders_info=array();
			$lookup_folder_ids=array();
			foreach ($this->duplicates as $this_folder=>$other_folders) {
				$this->duplicate_folders_info[$this_folder]["folder_id"]="folder" . $folder_id_index;
				$this->lookup_folder_ids[$folder_id_index]=$this_folder;
				$folder_id_index++;
				ksort($this->duplicates[$this_folder]);
				foreach ($this->duplicates[$this_folder] as $other_folder=>$file_pairs) {
					ksort($this->duplicates[$this_folder][$other_folder]);
				}

				// Check whether the folder can be removed completely. Will still need to check for each file
				$this_files=glob($this_folder . "/*");
				$this_files_total=count($this_files);
				foreach ($this_files as $this_index => $file_name) {
					# remove from the list if not a file e.g. if it's a directory
					if ( filetype($file_name) != "file" ) {
						unset($this_files[$this_index]);
					}
				}

				# Only allow this folder to be removed if it contains only files and all files are duplicated elsewhere
				$this_folder_removable=true;
				$this->duplicate_folders_info[$this_folder]["file_count"] = count($this_files);
				# If the length of the array has changed, something other than a file was found
				if ( $this_files_total == count($this_files) ) {
					//print "<p>" . $this_files_total . " files in folder " . $this_folder . "</p>";
					$check_files=$this_files; # Make a copy of the file list so we can remove those found
					foreach ($check_files as $check_index => $check_file) {
						$check_files[$check_index] = basename($check_file); # Only the file name is stored in the matched array
					}
					# Check the files in each matched folder
					foreach ($this->duplicates[$this_folder] as $matched_folder => $file_list) {
						//print "<p>" . count($file_list) . " matched files in matched folder " . $matched_folder . "</p>";
						# If all files are matched in this folder, we don't need to check each one
						if ( count($file_list) == $this_files_total ) {
							//print "<p>All files matched in folder " . $matched_folder . "</p>";
							$check_files = array();
						} else {
							foreach ($check_files as $check_index => $check_file) {
								if ( array_key_exists($check_file, $file_list) ) {
									unset($check_files[$check_index]);
								}
							}
						}
					}
					# If there are any files in the array then some of the files are not matched (duplicates) and we should not remove the folder
					if (count($check_files) > 0 ) {
						//print "<p>All files not matched for folder " . $this_folder . "</p>";
						$this_folder_removable=false;
					}
				} else {
					//print "<p>Not only files in folder " . $this_folder . "</p>";
					$this_folder_removable=false;
				}
				
				$this->duplicate_folders_info[$this_folder]["removable"] = $this_folder_removable;
			}
		}


	}


?>
