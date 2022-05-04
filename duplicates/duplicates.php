<?php

	#Define global variables

	require_once "duplicates.inc";

	function get_checkbox_delimiter() {
		return ":";
	}


	function split_checkbox_value($checkbox_value, $checkbox_delimiter) {
		$next_checked=explode($checkbox_delimiter, $checkbox_value);
		return $next_checked;
	}

	//$checkbox_delimiter=get_checkbox_delimiter();


	$main_app=new duplicates_app();
	$main_app->show_page();


?> 

</html>
