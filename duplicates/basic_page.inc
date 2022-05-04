<?php

	class basic_page {
		public $body_options="";
		public $page_title="";

		public function __construct()
		{
		}

		public function pre_page()
		{
		}

		public function page_start()
		{
?>
<html>
<?php
		}

		public function pre_head()
		{
		}

		public function show_head()
		{
?>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<?php
			$this->show_css_includes();
			$this->show_js_includes();
			$this->show_title();
?>
</head>
<?php
		}

		public function show_css_includes()
		{
		}

		public function show_js_includes()
		{
?>
<script type="text/javascript" language="JavaScript" src="tools.js"></script>
<script type="text/javascript" language="JavaScript" src="includes.js"></script>
<?php
		}

		public function set_title($title) 
		{
			$this->page_title=$title;
		}

		public function show_title()
		{
			print "<title>$this->page_title</title>";
		}

		public function pre_body()
		{
		}

		public function show_heading()
		{
		}

		public function show_navigation_menu()
		{
		}

		public function show_main()
		{
		}

		public function pre_footer()
		{
		}

		public function show_footer()
		{
		}

		public function show_body()
		{
			print "<body $this->body_options>\n";
			$this->show_heading();
			$this->show_navigation_menu();
			$this->show_main();
			$this->pre_footer();
			$this->show_footer();
			print "</body>\n";
		}

		public function post_body()
		{
		}

		public function show()
		{
			$this->pre_page();
			$this->page_start();
			$this->pre_head();
			$this->show_head();
			$this->pre_body();
			$this->show_body();
			$this->post_body();
		}

	}

?>