<?php
defined('BASEPATH') OR exit('No direct script access allowed');
session_start();
class Ajax extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		//$this->load->model('Nonogram_model');
		//$puzzle = new Nonogram_model();
		$_SESSION['my_count']++;
		echo $_SESSION['my_count'];
		
	}


	public function next_solver_line()
	{
		$this->load->model('Nonogram_model');
		$this->load->model('Range_model');

		$puzzle = new Nonogram_model();
		$puzzle->load_from_session();
		//echo json_encode(array('solution'=>'none'));
		$lines = $puzzle->next_solver_line();
		//echo json_encode(array('solution'=>'none'));
		//return;
		$puzzle->save_to_session();
		$json_return = json_encode($lines);
		//$_SESSION['my_count']++;
		echo $json_return;

		//echo "{}";
		
	}


	public function next_solution()
	{
		$this->load->model('Nonogram_model');
		$this->load->model('Range_model');
		$puzzle = new Nonogram_model();
		$puzzle->load_from_session();
		$solution = $puzzle->next_solution();
		//echo json_encode(array('solution'=>'none'));
		$puzzle->save_to_session();
		echo json_encode($solution);
		/*
		var_debug($solution);
		//echo json_encode(array('solution'=>'none'));
		//return;
		$json_return = json_encode($solution);
		//$_SESSION['my_count']++;
		echo $json_return;
		*/
	}


	public function clue_solved()
	{
		$this->load->model('Nonogram_model');
		$this->load->model('Range_model');
		$puzzle = new Nonogram_model();
		$puzzle->load_from_session();
		$mode = $_GET['mode'];
		$index = $_GET['index'];
		$clue_index = $_GET['clue_index'];
		$start = $_GET['start'];
		//echo json_encode(array('solution'=>'none'));
		$solution = $puzzle->clue_solved($mode, $index, $clue_index, $start);
		//echo json_encode(array('solution'=>'none'));
		//return;
		$puzzle->save_to_session();
		$json_return = json_encode($solution);
		//$_SESSION['my_count']++;
		echo $json_return;
		
		
	}


	public function cycle_pixel()
	{
		$this->load->model('Nonogram_model');
		$puzzle = new Nonogram_model();
		$puzzle->load_from_session();
		$row = $_GET['row'];
		$column = $_GET['column'];
		$solution = $puzzle->cycle_pixel($row, $column);

		$puzzle->save_to_session();
		//$save_state = $puzzle->save_to_file("nono4");
		$json_return = json_encode($solution);
		//$_SESSION['my_count']++;
		echo $json_return;
		
		
	}


	public function get_puzzle_list()
	{
		$this->load->model('Nonogram_model');
		$puzzle_files = Nonogram_model::get_puzzle_list();

		$json_return = json_encode($puzzle_files);
		//$_SESSION['my_count']++;
		echo $json_return;
		
		
	}


	public function solver()
	{
		//$this->load->model('Nonogram_model');
		//$puzzle = new Nonogram_model();
		$solving = array('component' => 'row', 'index' => 1, 'action' =>'none');
		$solving['action'] = $_GET['action'];
		if ( $solving['action'] == 'auto_solve' ) {
		    $solving = $this->auto_solve();
		}
		/*
		if ( $_REQUEST['action'] ) {
			$solving = array('component' => 'row', 'index' => 1, 'action'=>$_REQUEST['action']);
		} else {
			$solving = array('component' => 'row', 'index' => 1, 'action'=>'none');
		}
		*/
		$json_return = json_encode($solving);
		$_SESSION['solving'] = $solving;
		//$_SESSION['my_count']++;
		echo $json_return;
		
	}


	public function test()
	{
		//$this->load->model('Nonogram_model');
		//$puzzle = new Nonogram_model();
		$solving = array('component' => 'row', 'index' => 1, 'action' =>'none');
		$solving['action'] = $_GET['action'];
		/*
		if ( $_REQUEST['action'] ) {
			$solving = array('component' => 'row', 'index' => 1, 'action'=>$_REQUEST['action']);
		} else {
			$solving = array('component' => 'row', 'index' => 1, 'action'=>'none');
		}
		*/
		$json_return = json_encode($solving);
		$_SESSION['solving'] = $solving;
		//$_SESSION['my_count']++;
		echo $json_return;
		
	}


	public function test2()
	{
		$this->load->model('Nonogram_model');
		$puzzle = new Nonogram_model();
		$nonogram = $puzzle->load_from_file('nono2');
		$this->data['nonogram'] = $nonogram;
		$this->data['rows'] = $puzzle->get_row_clues();
		//echo "rows in data<br/>";
		//var_dump($this->data['rows']);
		//echo "columns in data<br/>";
		$this->data['columns'] = $puzzle->get_column_clues();
		//var_dump($this->data['columns']);
		#$this->load->view('testing/test_2', $this->data);
		$this->data['max_row_clues'] = $puzzle->max_row_clues;
		$this->data['max_column_clues'] = $puzzle->max_column_clues;
		$this->data['row_totals'] = $puzzle->get_row_totals();
		$this->data['column_totals'] = $puzzle->get_column_totals();
		/*
		$solved = $puzzle->get_solved();
		var_dump($solved);
		$this->data['solved'] = $solved;
		*/
		$this->data['solved'] = $puzzle->get_solved();
		//var_dump($this->data['solved']);
		//echo "Loading view<br/>";
		//$this->load->view('test2', $this->data);
		$this->load->view('template.php', array("view" => "puzzle", "title"=>"Page for Testing nonogram", "body" => $this->data));
	}


	public function load_puzzle()
	{
		$this->load->model('Nonogram_model');
		$puzzle = new Nonogram_model();
		//echo json_encode(array('solution'=>'none'));

		if ( isset($_GET['puzzle_name']) ){
		    $puzzle_name = $_GET['puzzle_name'];
		    $puzzle_state = $puzzle->load_from_file($puzzle_name);
		    $puzzle->save_to_session();
		}
		$json_return = json_encode($puzzle_state);
		//$_SESSION['my_count']++;
		echo $json_return;

		//echo "{}";
		
	}


	public function save_puzzle()
	{
		$this->load->model('Nonogram_model');

		if ( isset($_GET['puzzle_name']) ){
		    $puzzle_name = $_GET['puzzle_name'];
		} else {
		    $puzzle_name = null;
		}
		$puzzle = new Nonogram_model();
		$puzzle->load_from_session();
		//echo json_encode(array('solution'=>'none'));

		//if ( isset($_GET['puzzle_name']) ){
		if ( isset($puzzle_name) ){
		    //$puzzle_name = $_GET['puzzle_name'];
		    $save_state = $puzzle->save_to_file($puzzle_name);
		    $save_state['debug']['puzzle_name'] = $puzzle_name;
		} else {
		    $save_state = $puzzle->save_to_file();
		}
		$json_return = json_encode($save_state);
		//$_SESSION['my_count']++;
		echo $json_return;

		//echo "{}";
		
	}


}
