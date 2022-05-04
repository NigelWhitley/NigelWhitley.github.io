<?php
/**
 * Includes the Nonogram_Model class as well as the required sub-classes
 * @package codeigniter.application.models
 */

/**
 * Nonogram_Model extends codeigniters base CI_Model to inherit all codeigniter magic!
 * @author Nigel Whitley
 * @package codeigniter.application.models
 */
class Nonogram_model extends CI_Model
{
	const FILLED_PIXEL = 1;
	const EMPTY_PIXEL = 0;
	const UNSOLVED_PIXEL = -1;
	/*
	* A private variable to represent each column in the database
	*/
	private $nonogram;
	private $puzzle_name;
	private $clues;
	private $filled = array();
	private $empty = array();
	private $length;
	public $max_clues;
	public $solver;
	private $dimensions = array('row','column');

	function __construct()
	{
		parent::__construct();
		foreach ($this->dimensions as $dimension) {
			$this->clues[$dimension] = array();
			$this->length[$dimension] = -1;
			$this->max_clues[$dimension] = 0;
		}
		$this->solver = array();
		//$this->load->model('Range_model');
	}

	/*
	* Class Methods
	*/

	/**
	* utility function for pixel state
	*/
	public static function pixel_is_unsolved($pixel)
	{
		return ( $pixel === Nonogram_model::UNSOLVED_PIXEL );
	}

	public static function pixel_is_empty($pixel)
	{
		return ( $pixel === Nonogram_model::EMPTY_PIXEL );
	}

	public static function pixel_is_filled($pixel)
	{
		return ( $pixel === Nonogram_model::FILLED_PIXEL );
	}

	/**
	*	Get the path for the puzzles folder
	*/
	public static function get_folder_path()
	{
		$folder_path = 'application/puzzles/';
		return $folder_path;
	}


	/**
	*	Build the file name from the puzzle name (for now just add .xml)
	*/
	public static function name_to_file($puzzle_name)
	{
		//$file_name = self::get_folder_path() . $puzzle_name . '.xml';
		$file_name = $puzzle_name . '.xml';
		return $file_name;
	}


	/**
	*	Get the list of puzzle files from the puzzle folder
	*/
	public static function get_puzzle_list()
	{
		$scanned_dir = scandir(Nonogram_model::get_folder_path());
		$puzzle_files = array();
		foreach($scanned_dir as $dir_file) {
			$xml_extension = strpos($dir_file,'.xml');
			if ( $xml_extension !== false ) {
			//if (!in_array($dir_file,array(".",".."))) {
				$puzzle_files[] = substr($dir_file, 0, $xml_extension);
			}
		}
		return $puzzle_files;
	}


	function switch_dimension($dimension)
	{
		$index = array_search($dimension, $this->dimensions);
		if ($index === FALSE) {
			return $dimension;
		} else {
			return $this->dimensions[1-$index];
		}
	}

	public function pixel_state_as_string($pixel)
	{
		if ( $this->pixel_is_unsolved($pixel) ) {
		    $state = 'unsolved';
		} else if ( $this->pixel_is_filled($pixel) ) {
		    $state = 'filled';
		} else if ( $this->pixel_is_empty($pixel) ) {
		    $state = 'empty';
		} else {
		    $state = 'unknown';
		}
		return $state;

	}


	/**
	*	Get the name of the puzzle
	*/
	public function get_puzzle_name()
	{
		return $this->puzzle_name;
	}


	/**
	*	Set the name of the puzzle
	*/
	public function set_puzzle_name($puzzle_name)
	{
		$this->puzzle_name = $puzzle_name;
		$_SESSION['puzzle_name'] = $puzzle_name;
	}


	/**
	*	Extracts the row and column clues from the xml
	*/
	public function extract_rows_and_columns()
	{
		$this->solved = array();
		foreach ($this->dimensions as $dimension) {
			$this->clues[$dimension] = array();
			$this->max_clues[$dimension] = 0;
			$this->length[$dimension] = -1;
		}
		foreach ($this->nonogram->clues->clues_for as $clues_for) {
			$clue_list = array();
			foreach ($clues_for->clue as $clue) {
				//echo "<p>clue is " . $clue . "</p>";
				$clue_list[] = array('length' =>(integer) $clue, 'start' => 0);
			}
			$attributes = $clues_for->attributes();
			//echo "<p>Clues for</p>";
			//var_dump($attributes);
			//var_dump($attributes->type);
			if ( array_search($attributes->type, $this->dimensions) !== FALSE) {
				//echo "<p>" . $attributes->type . ":" . $attributes->index . "</p>";
				$index = (integer) $attributes->index;
				$type = (string) $attributes->type;
				//echo "<p>" . $type . ":" . $index . "</p>";
				$this->clues[$type][$index] = $clue_list;
				if ( $index > $this->length[$type] ) {
					$this->length[$type] = $index;
				}
				if ( count($clue_list) > $this->max_clues[$type] ) {
					$this->max_clues[$type] = count($clue_list);
				}
			} else {
			    echo "<p>Unknown type for clues</p>";
			}
		}
		//Create any "empty" rows or columns
		foreach ($this->dimensions as $dimension) {
			foreach ( range(1, $this->length[$dimension]) AS $index ) {
				if ( ! key_exists($index, $this->clues[$dimension]) ) {
					$this->clues[$dimension][$index] = array();
				}
			}
		}
	}


	/**
	*	Extracts the solved elements from the xml
	*/
	public function extract_known()
	{
		if ( isset($this->nonogram->filled) ) {
			foreach ($this->nonogram->filled->position as $filled) {
				$attributes = $filled->attributes();
				$this->filled[(int) $attributes->row][(int) $attributes->column] = true;
				//echo "<h5>Solved cell :" . (int) $attributes->row . "," . (int) $attributes->column . " - " . $attributes->state . "</h5>";
			}
		}

		if ( isset($this->nonogram->empty) ) {
			foreach ($this->nonogram->empty->position as $empty) {
				$attributes = $empty->attributes();
				$this->empty[(int) $attributes->row][(int) $attributes->column] = true;
				//echo "<h5>Solved cell :" . (int) $attributes->row . "," . (int) $attributes->column . " - " . $attributes->state . "</h5>";
			}
		}

		//var_dump($this->solved);
		//echo "<h6>Extracted solved</h6>";
	}


	/**
	*	Loads a puzzle from an xml file in the puzzles folder
	*/
	public function load_from_file($puzzle_name = 'nono1')
	{
		$this->nonogram = simplexml_load_file(self::get_folder_path() . $this->name_to_file($puzzle_name));
		$this->extract_rows_and_columns();
		$this->extract_known();
		$this->set_puzzle_name($puzzle_name);
		$this->solver['phase'] = 1;
		$this->solver['mode'] = 'row';
		$this->solver['index'] = 0;
		return $this->nonogram;
	}


	/**
	*	Saves a puzzle as an xml file in the puzzles folder
	*/
	public function save_to_file($puzzle_name = 'nono5')
	{
		$this->set_puzzle_name($puzzle_name);
		$dom = new DOMDocument('1.0');
		$dom->preserveWhiteSpace = false;
		$dom->formatOutput = true;
		$dom->loadXml($this->nonogram->asXML());
		$status = array('save-status' => $dom->save(self::get_folder_path() . $this->name_to_file($puzzle_name)));
		return $status;
	}


	/**
	*	Save puzzle to session
	*/
	public function save_to_session()
	{
		foreach ($this->dimensions as $dimension) {
			$_SESSION['clues'][$dimension] = $this->clues[$dimension];
			$_SESSION['length'][$dimension] = $this->length[$dimension];
			$_SESSION['max_clues'][$dimension] = $this->max_clues[$dimension];
		}
		$_SESSION['filled'] = $this->filled;
		$_SESSION['empty'] = $this->empty;
		$_SESSION['solved'] = $this->solved;
		$_SESSION['solver'] = $this->solver;
		$_SESSION['puzzle_name'] = $this->puzzle_name;
		$_SESSION['nonogram'] = $this->nonogram->asXml();
	}


	/**
	*	Load puzzle from session
	*/
	public function load_from_session()
	{
		foreach ($this->dimensions as $dimension) {
			$this->clues[$dimension] = $_SESSION['clues'][$dimension];
			$this->length[$dimension] = $_SESSION['length'][$dimension];
			$this->max_clues[$dimension] = $_SESSION['max_clues'][$dimension];
		}
		$this->filled = $_SESSION['filled'];
		$this->empty = $_SESSION['empty'];
		$this->solved = $_SESSION['solved'];
		$this->solver = $_SESSION['solver'];
		$this->puzzle_name = $_SESSION['puzzle_name'];
		$this->nonogram = simplexml_load_string($_SESSION['nonogram']);
	}


	/**
	* Next to solve
	*/
	public function next_solver_line()
	{
		//$this->load->model('Range_model');
		$previous_line = array('mode' => $this->solver['mode'], 'index' => $this->solver['index']);
		if ( $this->solver['index'] == $this->length[$this->solver['mode']] ) {
			$this->solver['mode'] = $this->switch_dimension($this->solver['mode']);
			$this->solver['index'] = 1;
		} else {
			$this->solver['index']++;
		}
		$next_line = array('mode' => $this->solver['mode'], 'index' => $this->solver['index']);

		/*
		if ( $this->solver['mode'] == 'row' ) {
			$range = $this->get_range_for_row($this->solver['index']);
		} else {
			$range = $this->get_range_for_column($this->solver['index']);
		}
		*/

		$_SESSION['solver'] = $this->solver;
		return array('previous_line' => $previous_line, 'next_line' => $next_line);
	}


	/**
	* Next solution using current line
	*/
	public function next_solution()
	{
		$range = $this->get_range_for_line($this->solver['mode'], $this->solver['index']);
		/*
		$range = new Range_model(10, array(2), array());
		$range_solution = array('length' => 10, 'clues' => array(3), 'fixed' => array(), 'min_clue' => 3);
		//$range_solution = $range->get_params();
		return $range_solution;
		*/
		//return $range;
		//return $range->get_params();
		//return $range->solve();
		$range_solution = $range->solve();
		$range_solution['mode'] = $this->solver['mode'];
		$range_solution['index'] = $this->solver['index'];
		$range_solution['last_row'] = $this->length['row'];
		$range_solution['last_column'] = $this->length['column'];
		if ( $range_solution['outcome'] === 'range_changed' ) {
			$this->update_from_solution($range_solution);
			$range_solution['outcome'] = 'line_changed';
		}
		/*
		$range_solution['mode'] = $this->solver['mode'];
		$range_solution['index'] = $this->solver['index'];
		$range_solution['last_row'] = $this->length['row'];
		$range_solution['last_column'] = $this->length['column'];
		*/
		return $range_solution;
		/*
		*/
	}


	public function update_from_solution($solution)
	{
		if ( isset($solution['solved']) && ( count($solution['solved']) > 0 ) ) {
			foreach ($solution['solved'] as $clue_index => $clue) {
				$this->clues[$solution['mode']][$solution['index']][$clue_index]['start'] = $clue['start'];
			}
		}

		if ( isset($solution['fill']) && ( count($solution['fill']) > 0 ) ) {
			foreach ($solution['fill'] as $pixel) {
				$this->set_pixel($solution['mode'], $solution['index'], $pixel, self::FILLED_PIXEL);
			}
		}

		if ( isset($solution['empty']) && ( count($solution['empty']) > 0 ) ) {
			foreach ($solution['empty'] as $pixel) {
				$this->set_pixel($solution['mode'], $solution['index'], $pixel, self::EMPTY_PIXEL);
			}
		}


	}


	/**
	*	Set a clue as solved and also return the pixels to fill or empty
	*/
	public function clue_solved($dimension, $index, $clue_index, $start)
	{
		//$this->load->model('Range_model');
		$this->clues[$dimension][$index][$clue_index]['start'] = $start;
		$clue = $this->clues[$dimension][$index][$clue_index];
		$last_pixel = $this->length[$dimension];
		$last_filled = $start + $clue['length'] - 1;
		$fill = range($start, $last_filled);
		$empty = array();
		if ($start > 1) {
		    $empty[] = $start - 1;
		}
		if ($last_filled < $last_pixel) {
		    $empty[] = $last_filled + 1;
		}
		$this->save_to_session();
		return array('outcome'=> 'pixels_changed', 'dimension' => $dimension, 'index' => $index, 'clue_index' => $clue_index, 'fill'=>$fill, 'empty' => $empty);
	}


	/**
	*	Extract the information from a row or column to make ranges for the unsolved clues
	*/
	public function get_range_for_line($dimension, $index)
	{
		//$this->load->model('Range_model');
		$length = $this->length[$dimension];
		$clues = $this->clues[$dimension][$index];
		$line = $this->get_line($dimension, $index);

		$range = new Range_model($clues, $line);
		return $range;
	}


	/**
	*	Gets clues for a specific row or column
	*/
	public function get_clues($dimension, $index)
	{
		return $this->clues[$dimension][$index];
	}


	/**
	*	Gets clues for all rows or columns
	*/
	public function get_all_clues($dimension)
	{
		$clues = array();
		foreach (range(1, $this->length[$dimension]) AS $index) {
			$clues[$index] = $this->get_clues($dimension, $index);
		}
		return $clues;
	}


	/**
	*	Gets clues total length
	*/
	public function get_clues_length($dimension, $index)
	{
		$clues = $this->get_clues($dimension, $index);
		if (count($clues) > 0) {
			$clues_length = count($clues) - 1;
			foreach($clues AS $clue) {
				$clues_length += $clue['length'];
			}
		} else {
			$clues_length = 0;
		}
		return $clues_length;
	}


	/**
	*	Gets number of clues for line (useful for edit)
	*/
	public function get_clues_count($dimension, $index)
	{
		$clues = $this->get_clues($dimension, $index);
		return count($clues);
	}


	/**
	*	Gets all clue totals
	*/
	public function get_clue_totals($dimension)
	{
		$totals = array();
		foreach (range(1, $this->length[$dimension]) AS $index) {
			$totals[$index] = $this->get_clues_length($dimension, $index);
		}
		return $totals;
	}


	/**
	*	Gets all clue counts
	*/
	public function get_clue_counts($dimension)
	{
		$totals = array();
		foreach (range(1, $this->length[$dimension]) AS $index) {
			$totals[$index] = $this->get_clues_count($dimension, $index);
		}
		return $totals;
	}


	/**
	*	Convert from dimension, index, pixel to row,column
	*/
	public function dimension_to_row_column($dimension, $index, $pixel)
	{
		if ($dimension === 'row') {
		    return array('row' => $index, 'column' => $pixel);
		} else {
		    return array('row' => $pixel, 'column' => $index);
		}
	}


	/**
	*	Convert from row,column to dimension, index, pixel 
	*/
	public function row_column_to_dimension($row, $column, $dimension = 'row')
	{
		if ($dimension === 'row') {
		    return array('index' => $row, 'pixel' => $column);
		} else {
		    return array('index' => $column, 'pixel' => $row);
		}
	}


	/**
	*	Gets all filled cells of nonogram
	*/
	public function get_filled()
	{
		return $this->filled;
	}


	/**
	*	Gets all empty cells of nonogram
	*/
	public function get_empty()
	{
		return $this->empty;
	}


	/**
	*	Gets pixels along a given line
	*/
	public function get_line($dimension, $index)
	{
		$pixels = array();
		foreach (range(1, $this->length[$dimension]) as $pixel) {
			$pixels[$pixel] = $this->get_pixel($dimension, $index, $pixel);
		}
		return $pixels;
	}


	/**
	*	Gets pixel value within a given line
	*/
	public function get_pixel($dimension, $index, $pixel)
	{
		$row_column = $this->dimension_to_row_column($dimension, $index, $pixel);
		if ( isset($this->filled[$row_column['row']][$row_column['column']]) ) {
		    return self::FILLED_PIXEL;
		} elseif ( isset($this->empty[$row_column['row']][$row_column['column']]) ) {
		    return self::EMPTY_PIXEL;
		} else {
		    return self::UNSOLVED_PIXEL;
		}
	}


	/**
	*	Sets pixel value within a given line
	*/
	public function set_pixel($dimension, $index, $pixel, $pixel_value)
	{
		$row_column = $this->dimension_to_row_column($dimension, $index, $pixel);
		if ( $this->pixel_is_filled($pixel_value) ) {
			if ( ! isset($this->filled[$row_column['row']][$row_column['column']]) ) {
				if ( isset($this->empty[$row_column['row']][$row_column['column']]) ) {
				    unset($this->empty[$row_column['row']][$row_column['column']]);
				    list($empty) = $this->nonogram->empty->xpath('position[@row='.$row_column['row'].'][@column='.$row_column['column'].']');
				    //$row_colummn['empty'] = $empty;
				    unset($empty[0]);
				}
				$this->filled[$row_column['row']][$row_column['column']] = true;
				//Store in nonogram xml
				//$filled_element = new SimpleXmlElement('<position row="' . $row_column['row'] . '" column="' . $row_column['column'] . '" initial="n"></position>');
				//Make sure that the filled element exists
				if(! $this->nonogram->xpath('filled')) {
					$new_filled = $this->nonogram->addChild("filled");
				}
				$new_solved_pixel = $this->nonogram->filled->addChild("position");
				$new_solved_pixel->addAttribute("row", $row_column['row']);
				$new_solved_pixel->addAttribute("column", $row_column['column']);
				$new_solved_pixel->addAttribute("initial", 'n');
			}
		} elseif ( $this->pixel_is_empty($pixel_value) ) {
			if ( ! isset($this->empty[$row_column['row']][$row_column['column']]) ) {
				if ( isset($this->filled[$row_column['row']][$row_column['column']]) ) {
				    unset($this->filled[$row_column['row']][$row_column['column']]);
				    list($filled) = $this->nonogram->filled->xpath('position[@row='.$row_column['row'].'][@column='.$row_column['column'].']');
				    //$row_colummn['filled'] = $filled;
				    unset($filled[0]);
				}
				$this->empty[$row_column['row']][$row_column['column']] = true;
				//Store in nonogram xml
				//$filled_element = new SimpleXmlElement('<position row="' . $row_column['row'] . '" column="' . $row_column['column'] . '" initial="n"></position>');
				//Make sure that the filled element exists
				if(! $this->nonogram->xpath('empty')) {
					$new_filled = $this->nonogram->addChild("empty");
				}
				$new_solved_pixel = $this->nonogram->empty->addChild("position");
				$new_solved_pixel->addAttribute("row", $row_column['row']);
				$new_solved_pixel->addAttribute("column", $row_column['column']);
				$new_solved_pixel->addAttribute("initial", 'n');
			}

		} else {
			// Must be setting a filled or empty pixel to unsolved so we need to delete from the relevant array
			if ( isset($this->filled[$row_column['row']][$row_column['column']]) ) {
				unset($this->filled[$row_column['row']][$row_column['column']]);
				list($filled) = $this->nonogram->filled->xpath('position[@row='.$row_column['row'].'][@column='.$row_column['column'].']');
				//$row_colummn['filled'] = $filled;
				unset($filled[0]);
			} elseif ( isset($this->empty[$row_column['row']][$row_column['column']]) ) {
				unset($this->empty[$row_column['row']][$row_column['column']]);
				list($empty) = $this->nonogram->empty->xpath('position[@row='.$row_column['row'].'][@column='.$row_column['column'].']');
				//$row_colummn['empty'] = $empty;
				unset($empty[0]);
			}
		}
		return $row_column;

	}


	public function cycle_pixel($row, $column)
	{
		$pixel = $this->get_pixel("row", $row, $column);
		$solution = array("row"=>$row, "column"=>$column);
		$solution["old_state"] = $this->pixel_state_as_string($pixel);
		if ( $this->pixel_is_unsolved($pixel) ) {
		    $solution["row_column"] = $this->set_pixel("row", $row, $column, Nonogram_model::FILLED_PIXEL);
		} else if ( $this->pixel_is_filled($pixel) ) {
		    $solution["row_column"] = $this->set_pixel("row", $row, $column, Nonogram_model::EMPTY_PIXEL);
		} else if ( $this->pixel_is_empty($pixel) ) {
		    $solution["row_column"] = $this->set_pixel("row", $row, $column, Nonogram_model::UNSOLVED_PIXEL);
		}
		$pixel_now = $this->get_pixel("row", $row, $column);
		$solution["new_state"] = $this->pixel_state_as_string($pixel_now);
		return $solution;

	}


	/**
	*	Gets specific row of nonogram
	*/
	public function get_row($index)
	{
		if (($index < 1) || ($index > $this->length['row'])) {
			return null;
		} else {
			return $this->clues['row'][$index];
		}
	}


	/**
	*	Gets specific column of nonogram
	*/
	public function get_column($index)
	{
		if (($index < 1) || ($index > $this->length['row'])) {
			return null;
		} else {
			return $this->column_clues[$index];
		}
	}


} 
