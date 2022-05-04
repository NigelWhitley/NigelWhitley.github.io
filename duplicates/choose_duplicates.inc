<?php

	class choose_duplicates_page extends duplicates_page {
		public $xml_files;
		public function __construct()
		{
		}

		public function pre_page()
		{
			// Choose the xml file containing the duplicates information
			$this->xml_files=glob("*.xml");
			$this->set_title("Choose xml duplicates file");
		}

		public function pre_body()
		{
			// Choose the xml file containing the duplicates information
			$this->body_options="class=\"choose_duplicates\"";
		}

		public function show_main()
		{
			print "<form name=\"f_duplicates\" method=\"POST\" action=\"duplicates.php\">\n";
			print "<h1><span>Available duplicate sets</span></h1>\n";
			print "<h3><span>Click on either \"By folder\" or \"By duplicate\" for the set of duplicates you wish to view</span></h3>\n";
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
			print "<ul><li class=\"file_option\" onClick=\"return view_by_folder('" . $file . "', true)\"><span>By folder</span></li>\n";
			print "<li class=\"file_option\" onClick=\"return view_by_duplicate('" . $file . "', true)\"><span>By duplicate</span></li>\n";
			print "</ul>\n";
			print "</li>\n";
		}
	}

?>