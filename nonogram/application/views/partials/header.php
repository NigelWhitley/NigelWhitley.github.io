<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php echo $title ?></title>
<?php
        $ci = &get_instance();
        $header_css = $ci->config->item('header_css');
        $header_js  = $ci->config->item('header_js');
 
        foreach($header_css AS $item){
            $http_index = strpos($item, "http");
            if (strpos($item, "http") !== false) {
		echo '<link rel="stylesheet" href="'.$item.'" type="text/css" />'."\n";
            } else {
		echo '<link rel="stylesheet" href="'.base_url('css/'.$item).'" type="text/css" />'."\n";
            }
            //echo '<link rel="stylesheet" href="'.base_url().'css/'.$item.'" type="text/css" />'."\n";
        }
 
        foreach($header_js AS $item){
            if (strpos($item, "http") !== false) {
		echo '<script type="text/javascript" src="'.$item.'"></script>'."\n";
            } else {
		echo '<script type="text/javascript" src="'.base_url('js/'.$item).'"></script>'."\n";
            }
            echo '<script type="text/javascript">var ajax_base = "' . base_url("Ajax") . "/" . '";</script>'."\n";
        }
?>
</head>
<body>

