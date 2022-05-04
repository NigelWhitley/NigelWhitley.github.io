<?php

	class show_by_duplicate extends duplicates_page {
		public $main_app;
		public $xml_file;
		public $thumbnail_height;
		public $image_list;
		public $image_count;
		public $checked_count;
		public $duplicate_group;
		public $reader;

		public function __construct($main_app)
		{
			$this->main_app=$main_app;
			$this->xml_file=$main_app->xml_file;
			$this->thumbnail_height=100;
			$this->image_list=array();
			$this->image_count=0;
			$this->checked_count=0;
			$this->duplicate_group=0;
		}

		public function pre_page()
		{
			// Choose the xml file containing the duplicates information
			parent::pre_page();
			$this->set_title("Show duplicate files by duplicate");
		}

		public function show_title()
		{
			print "<title>Show duplicate files by duplicate</title>";
		}

		public function show_navigation_menu()
		{
			print "<div id=\"nav-menu\">\n";
			print "<ul>\n";
			print "<li onClick=\"return choose_folder();\">\n";
			print "<span id=\"home\">Home</span>\n";
			print "</li>\n";
			print "<li onClick=\"return view_by_folder('" . $this->main_app->xml_file . "', false);\">\n";
			print "<span>Show by folder</span>\n";
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
			print "Show duplicate files by duplicate\n";
			print "</h1>\n";
			print "</div>\n";
		}

		public function show_main()
		{
			print "<form name=\"f_duplicates\" method=\"POST\" action=\"duplicates.php\">";
			print "<input type=\"hidden\" value=\"" . $this->xml_file . "\" name=\"xml_file\">";
			print "<input type=\"hidden\" value=\"\" name=\"display_mode\">\n";
			print "<div id='duplicates_by_duplicate'>\n";
			print "<table id='duplicate_files'>\n";
			$this->read_xml_file();
			print "</table>\n</div>\n";
			print "</form>";
		}

		public function add_duplicate($file_path1, $file_path2) {
			$duplicate_folder1=dirname($file_path1);
			$duplicate_file1=basename($file_path1);
			$duplicate_folder2=dirname($file_path2);
			$duplicate_file2=basename($file_path2);

			$this->duplicate_folders[$duplicate_folder1][$duplicate_folder2][$duplicate_file1] = $duplicate_file2;
			if ( $duplicate_folder1 != $duplicate_folder2 ) {
				$this->duplicate_folders[$duplicate_folder2][$duplicate_folder1][$duplicate_file2] = $duplicate_file1;
			}
		}


		public function read_xml_file() {
		
			$checkbox_delimiter=get_checkbox_delimiter();

			$this->reader = new XMLReader();

			$this->reader->open($this->xml_file);

			$next_checked_index=1;
			$next_checked=split_checkbox_value($this->main_app->checked_boxes[$next_checked_index], $checkbox_delimiter);

			#print "<form name=\"f1\" method=\"POST\" action=\"show_duplicates.php\" onsubmit=\"return checkscript()\">";
			while ($this->reader->read()) {
				switch ($this->reader->nodeType) {
					case (XMLREADER::END_ELEMENT):
						if ($this->reader->name == "duplicated_image") {
							#Check that we still have more than 1
							if ($image_count > 1) {
								#echo "checking image list\n";
								$duplicated_image=$image_list[1];
								$group_HTML = new HTMLchunk();
								$image_id="group" . $duplicate_group;
								$group_HTML->complex_start("tr", array("class"=>"duplicate_file_set", "id"=>$image_id));
								//print "<tr class='duplicate_file_set' id='" . $image_id . "'>\n";
								$image_info=getimagesize($duplicated_image);
								$image_width=$image_info[0];
								$image_height=$image_info[1];
								$path_start=strpos($duplicated_image, $this->main_app->original_path);
								if ( $path_start === FALSE ) {
									$linked_image=$duplicated_image;
								} else {
									$linked_image=substr_replace($duplicated_image, $this->main_app->linked_path, $path_start, strlen($this->main_app->original_path));
								}
								$thumbnail_width=ceil(($image_width/$image_height)*$this->thumbnail_height);
								$image_dir=dirname($duplicated_image);
								$image_file=basename($duplicated_image);
								$group_HTML->complex_start("td", array("class"=>"duplicate_thumbnail"));
								$group_HTML->simple( "img", array("src"=>"$linked_image", "onClick"=>"'return show_details(\"" .$image_dir . "\", \"" . $image_file . "\", " . $duplicate_group . ");'", "width"=>$thumbnail_width, "height"=>$this->thumbnail_height, "alt"=>"Image" . $image_height . "x" . $image_width ) );
								$group_HTML->complex_end("td");
								//print "<td class='duplicate_thumbnail'><img src=\"" . $linked_image . "\" onClick=\"return show_details('" . $image_dir . "', '" . $image_file . "', '" . $duplicate_group . "')\" width=$thumbnail_width height=$this->thumbnail_height alt='Image" . $image_height . "x" . $image_width . "' /></td>\n";
								$group_HTML->complex_start("td", array("class"=>"duplicate_file_list"));
								//print "<td class='duplicate_file_list'>\n";
								$group_HTML->complex_start("ol");
								//print "<ol>\n";
								foreach ($image_list as $file_index => $file) {
									$checked=false;
									$css_checkbox_class="keep_file";
									if ( ($next_checked[0] == $duplicate_group) && ($next_checked[3] == $file) ) {
										$next_checked_index++;
										$next_checked=split_checkbox_value($main_app->checked_boxes[$next_checked_index], $checkbox_delimiter);
										$checked=true;
										$css_checkbox_class="remove_file";
										//$checked=" checked='checked' ";
									}
									if ( isset($_SESSION["delfile"][$file]) ) {
										$checked=true;
										$css_checkbox_class="remove_file";
										//$checked=" checked='checked' ";
									}
									$group_HTML->complex_start("li", array("class"=>$css_checkbox_class));
									//print "<li class='". $css_checkbox_class . "'>";
									$group_HTML->complex_start( "span", array("class"=>"duplicate_delete_checkbox") );
									$group_HTML->simple( "input", array("type"=>"checkbox", "name"=>"delfile[]", "checked"=>$checked, "onClick"=>"'changeDuplicateFile(this, \"" . $checkbox_delimiter . "\");'", "value"=> $file . $checkbox_delimiter . $duplicate_group . $checkbox_delimiter . $file_index . $checkbox_delimiter . $image_count ) );
									$group_HTML->complex_end("span");
									//print "<span class='duplicate_delete_checkbox'><input type='checkbox' name='delfile[]'" . $checked . " onChange='changeDuplicateFile(this, \"" . $checkbox_delimiter . "\")' value='" . $file . $checkbox_delimiter . $duplicate_group . $checkbox_delimiter . $file_index . $checkbox_delimiter . $image_count . "'></span>\n";
									$group_HTML->complex_start("span", array("class"=>"duplicate_file_name"));
									$group_HTML->text($file);
									$group_HTML->complex_end("span");
									//print "<span class='duplicate_file_name'>" . $file . "</span>\n";
									$group_HTML->complex_end("li");
									//print "</li>\n";
								}
								$list_size = count($image_list);
								for ($outer_index=1; $outer_index < $list_size; $outer_index++) {
									for ($inner_index=$outer_index+1; $inner_index <= $list_size; $inner_index++) {
										$this->add_duplicate($image_list[$outer_index], $image_list[$inner_index]);
									}
								}
								$group_HTML->complex_end("ol");
								//print "</ol>\n";
								$group_HTML->complex_end("td");
								//print "</td>\n";
								$group_HTML->complex_end("tr");
								//print "</tr>\n";
								$group_HTML->show();
							}
						}
						break;
					case (XMLREADER::ELEMENT):
						if ($this->reader->name == "duplicated_image") {
							#echo "new image\n";
							$image_list=array();
							$image_count=0;
							$duplicate_group=$this->reader->getAttribute("group_id");
						#} elseif ($reader->name == "file") {
						#	echo "file ";
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
			$this->reader->close();
		}

		public function post_footer()
		{
			print "</body>\n";
		}

	}

?>