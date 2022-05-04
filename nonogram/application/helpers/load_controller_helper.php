 
<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!function_exists('load_controller'))
{
    function load_controller($controller_name)
    {
        //require_once(FCPATH . APPPATH . 'controllers/' . $controller_name . '.php');
        require_once(APPPATH . 'controllers/' . $controller_name . '.php');

        $controller = new $controller_name();

        return $controller;
    }
}
?>