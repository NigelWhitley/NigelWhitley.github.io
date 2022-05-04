<?php

	class demo_duplicater extends basic_page {
		public $image_files;
		public $root_folder = "content";
		public $base_folder = "base";
		public function __construct()
		{
		}

		public function pre_heading()
		{
			// Get the names of the base image files
			
			$this->image_files=glob("*.jpg");

			#Have had to create a link to /mnt/smb/personal from DocumentRoot "/srv/httpd/htdocs" to be able to access the images
			#The src in the img tag is a URL so needs to be relative to currentdir or DocumentRoot
		}

		public function show_heading()
		{
			print "<title>Dummy duplicate images for demo</title>";
			print "</head>";
		}

		public function show_main()
		{
			print "<body class=\"demo_duplicater\">\n";

			#Add a dummy name to the end of the list of checked boxesTicked
			# This means we don't need to check whether the next_checked value is within the valid range
			//$checked_count;

			#print "<form name=\"f_choose_file\" method=\"POST\" action=\"show_duplicates.php\" onsubmit=\"return choose_file();\">\n";
			print "<form name=\"f_duplicates\" method=\"POST\" action=\"duplicates.php\">\n";
			print "<h1><span>Click on 'Duplicate' to build a new set of duplicated images</span></h1>\n";
			print "<h3><span id="">Duplicate</span></h3>\n";
			print "<input type=\"hidden\" value=\"\" name=\"xml_file\">\n";
			print "<input type=\"hidden\" value=\"\" name=\"display_mode\">\n";
			print "<div id=file_list_div>\n";
			print "<ul id=file_list>\n";

			foreach ($this->xml_files as $file_index => $file) {
				$this->show_file_choices($file);
			}

			print "</ul>\n";
			print "</div>\n";
			
			print "</form>";

		}

		public function show_file_choices($file) {
			print "<li class='xml_file_row'>\n";
			print "<span class='xml_file'>" . $file . "</span>\n";
			print "<ul><li class=\"file_option\" onClick=\"return demo_duplicate_images('" . $file . "', true)\"><span>By folder</span></li>\n";
			print "<li class=\"file_option\" onClick=\"return view_by_duplicate('" . $file . "', true)\"><span>By duplicate</span></li>\n";
			print "</ul>\n";
			print "</li>\n";
		}

		public function post_footer()
		{
			print "</body>\n";
		}

	}

?>