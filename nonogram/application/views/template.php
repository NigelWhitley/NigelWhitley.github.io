 
<?php

function arrayCopy( array $array ) {
        $result = array();
        foreach( $array as $key => $val ) {
            if( is_array( $val ) ) {
                $result[$key] = arrayCopy( $val );
            } elseif ( is_object( $val ) ) {
                $result[$key] = clone $val;
            } else {
                $result[$key] = $val;
            }
        }
        return $result;
}

$this->load->helper('url');
$template_vars = arrayCopy($this->_ci_cached_vars);
if ( array_key_exists("header", $this->_ci_cached_vars)) {
	$header_data = $this->_ci_cached_vars["header"];
	$this->load->view('partials/header', $header_data);
} else {
	$this->load->view('partials/header');
}
if ( array_key_exists("navigation", $this->_ci_cached_vars)) {
	$navigation_data = $this->_ci_cached_vars["navigation"];
	$this->load->view('partials/navigation', $navigation_data);
/*
} else {
	$this->load->view('partials/navigation');
*/
}
$view = $this->_ci_cached_vars["view"];
if ( array_key_exists("body", $this->_ci_cached_vars)) {
	//$body_data = $this->_ci_cached_vars["body"];
	//$this->load->view($view, $body_data);
	$this->load->view($view, $body);
} else {
	$this->load->view($view);
}
if ( array_key_exists("footer", $this->_ci_cached_vars)) {
	$footer_data = $this->_ci_cached_vars["footer"];
	$this->load->view('partials/footer', $footer_data);
} else {
	$this->load->view('partials/footer');
}

//$this->load->view('fragments/header', $this->_ci_cached_vars); // pass $data vars
?>