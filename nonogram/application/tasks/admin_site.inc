<?php

function build_sports_tables ()
{
	$statement='';
	$statement=$statement . 'create table if not exists sports_setup (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',value varchar(30) not null';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists setup_choice (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',value varchar(30) not null';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists team (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists score_types (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',score_value int not null';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists appearance (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',registration_id int unsigned not null references player';
	$statement=$statement . ',fixture_id int unsigned not null references fixture';
	$statement=$statement . ',result_id int unsigned references result';
	$statement=$statement . ',shirt_number int unsigned';
	$statement=$statement . ',from_start varchar(1)';
	$statement=$statement . ',on_at time';
	$statement=$statement . ',off_at time';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists score (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',appearance_id int unsigned not null references appearance';
	$statement=$statement . ',score_type_id int unsigned not null references goal_type';
	$statement=$statement . ',scored_at time';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists player (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists competitor (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',sport_id int unsigned references sport';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists registration (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',player_id int unsigned not null references player';
	$statement=$statement . ',competitor_id int unsigned not null references cpompetitor';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists sport (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',team_size int unsigned not null';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists competition_type (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists competition (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',sport_id int unsigned not null references sport';
	$statement=$statement . ',result_type_id int unsigned not null references result_type';
	$statement=$statement . ',type_id int unsigned not null references competition_type';
	$statement=$statement . ',type_name varchar(30) not null';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists fixture_group (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30)';
	$statement=$statement . ',competition_id int unsigned not null references competition';
	$statement=$statement . ',stage int not null';
	$statement=$statement . ',nominal_date date';
	$statement=$statement . ',nominal_time time';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists result_type (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30) not null';
	$statement=$statement . ',sport_id int unsigned not null references sport';
	$statement=$statement . ',competition_type_id int unsigned not null references competition_type';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists entrant (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',competition_id int unsigned not null references competition';
	$statement=$statement . ',stage int not null';
	$statement=$statement . ',competitor_id int unsigned references competitor';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists fixture (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',competition_id int unsigned not null references competition';
	$statement=$statement . ',fixture_group_id int unsigned not null references fixture_group';
	$statement=$statement . ',fixture_id1 int unsigned references fixture';
	$statement=$statement . ',competitor_id1 int unsigned references competitor';
	$statement=$statement . ',fixture_id2 int unsigned references fixture';
	$statement=$statement . ',competitor_id2 int unsigned references competitor';
	$statement=$statement . ',actual_date date';
	$statement=$statement . ',actual_time time';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists result (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',fixture_id int unsigned references fixture';
	$statement=$statement . ',result varchar(4) not null';
	$statement=$statement . ',outcome_id int unsigned references outcome';
	$statement=$statement . ',position int unsigned';
	$statement=$statement . ',result_date date';
	$statement=$statement . ',result_time time';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists outcome (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(10) not null';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists football_result (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',fixture_id int unsigned references fixture';
	$statement=$statement . ',goals_1 int not null';
	$statement=$statement . ',goals_2 int not null';
	$statement=$statement . ',outcome_id int unsigned references outcome';
	$statement=$statement . ',position int unsigned';
	$statement=$statement . ',result_date date';
	$statement=$statement . ',result_time time';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists league_points (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',name varchar(30)';
	$statement=$statement . ',winner_points int unsigned';
	$statement=$statement . ',loser_points int unsigned';
	$statement=$statement . ',score_draw_points int unsigned';
	$statement=$statement . ',no_score_draw_points int unsigned';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );

	$statement='';
	$statement=$statement . 'create table if not exists competition_points (';
	$statement=$statement . ' id int unsigned not null auto_increment';
	$statement=$statement . ',competition_id int unsigned not null references competition';
	$statement=$statement . ',league_points_id int unsigned not null references league_points';
	$statement=$statement . ',primary key (id)';
	$statement=$statement . ')';
	$result=mysql_query( $statement );
}

?>

