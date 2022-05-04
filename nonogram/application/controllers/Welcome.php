<?php
defined('BASEPATH') OR exit('No direct script access allowed');
session_start();
class Welcome extends CI_Controller {

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
		//$this->load->view('welcome_message');
		$this->load->model('Nonogram_model');
		$this->load->model('Range_model');
		$puzzle = new Nonogram_model();
		//$nonogram = $puzzle->load_from_file('umbrella');
		//$nonogram = $puzzle->load_from_file('gchq');
		if ( isset($_SESSION['nonogram']) ) {
			$nonogram = $puzzle->load_from_session();
		} else {
			$nonogram = $puzzle->load_from_file('gchq');
			$puzzle->save_to_session();
			$_SESSION['my_count'] = 0;
		}
		/*
		$puzzle->next_solver_line();
		$puzzle->next_solver_line();
		$puzzle->next_solver_line();
		$puzzle->next_solver_line();
		$this->data['solution'] = $puzzle->next_solution();
		*/

		//$clues = $puzzle->get_all_clues('row');
		$this->data['nonogram'] = $nonogram;
		$this->data['clues']['row'] = $puzzle->get_all_clues('row');
		//echo "rows in data<br/>";
		//var_dump($this->data['rows']);
		//echo "columns in data<br/>";
		$this->data['clues']['column'] = $puzzle->get_all_clues('column');
		//var_dump($this->data['columns']);
		#$this->load->view('testing/test_2', $this->data);
		$this->data['max_clues']['row'] = $puzzle->max_clues['row'];
		$this->data['max_clues']['column'] = $puzzle->max_clues['column'];
		$this->data['clue_totals']['row'] = $puzzle->get_clue_totals('row');
		$this->data['clue_totals']['column'] = $puzzle->get_clue_totals('column');
		$this->data['clue_counts']['row'] = $puzzle->get_clue_counts('row');
		$this->data['clue_counts']['column'] = $puzzle->get_clue_counts('column');
		$this->data['puzzle'] = $puzzle;
		$this->data['puzzle_name'] = $puzzle->get_puzzle_name();
		$this->load->view('template.php', array("view" => "puzzle", "title"=>"Page for Testing nonogram", "body" => $this->data));
	}

	public function test_it()
	{
		$this->data['boxes'] = array('box 1', 'box 2', 'box 3', 'box_4');
		$this->load->view('testing/test_it', $this->data);
	}

}
