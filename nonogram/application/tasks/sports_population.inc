<?php
// Populate the array with the initial set of data for the sports_setup table
function sports_setup_populate_data(&$population_array)
{
	$population_array = array(
			1 => array(
				"name" => "OperatingMode"
				,"value"=>"Team"
			)
			,2 => array(
				"name" => "SportMode"
				,"value"=>"Single"
			)
			,3 => array(
				"name" => "SiteName"
				,"value"=>"Our Site"
			)
			,4 => array(
				"name" => "SiteLogo"
				,"value"=>"site.png"
			)
		);
}

// Populate the array with the initial set of data for the sports_setup table
function setup_choice_populate_data(&$population_array)
{
	$population_array = array(
			1 => array(
				"name" => "OperatingMode"
				,"value"=>"Team"
			)
			,2 => array(
				"name" => "OperatingMode"
				,"value"=>"Competition"
			)
			,3 => array(
				"name" => "SportMode"
				,"value"=>"Single"
			)
			,4 => array(
				"name" => "SportMode"
				,"value"=>"Multi"
			)
		);
}

// Populate the array with the initial set of data for the league_points table
function league_points_populate_data(&$population_array)
{
	$population_array = array(
			1 => array(
				"name" => "Standard"
				,"winner_points"=>3
				,"loser_points"=>0
				,"score_draw_points"=>1
				,"no_score_draw_points"=>1
			)
		);
}

// Populate the array with the initial set of data for the competition_type table
function competition_type_populate_data(&$population_array)
{
	$population_array = array(
			1 => array
				( "name" => "Friendly" ),
			2 => array
				( "name" => "Knockout" ),
			3 => array
				( "name" => "League" )
		);
}

// Populate the array with the initial set of data for the outcome table
function outcome_populate_data(&$population_array)
{
	$population_array = array(
			1 => array
				( "name" => "Complete" ),
			2 => array
				( "name" => "Abandoned" ),
			3 => array
				( "name" => "Postponed" ),
			4 => array
				( "name" => "Cancelled" ),
			5 => array
				( "name" => "Replay" )
		);
}

// Populate the array with the initial set of data for the result_type table
function result_type_populate_data(&$population_array)
{
	$population_array = array(
			1 => array
				( "name" => "Totals" )
		);
}

// Populate the array with the initial set of data for the sport table
function sport_populate_data(&$population_array)
{
	$population_array = array(
			1 => array
				( "name" => "Football"
				,"team_size" => 11 )
		);
}

// Populate the sports_setup table with an initial set of data
function populate_table($table_name, $population_array)
{
	foreach ($population_array as $key => $row) {
		db_insert_row($table_name, $row );
	}
}

// Populate the tables in the sports database with an initial set of data
function populate_tables()
{
	$population_array=0;
	sports_setup_populate_data($population_array);
	populate_table( "sports_setup", $population_array);

	league_points_populate_data($population_array);
	populate_table( "league_points", $population_array);

	competition_type_populate_data($population_array);
	populate_table( "competition_type", $population_array);

	outcome_populate_data($population_array);
	populate_table( "outcome", $population_array);

	result_type_populate_data($population_array);
	populate_table( "result_type", $population_array);

	sport_populate_data($population_array);
	populate_table( "sport", $population_array);
}

?>

