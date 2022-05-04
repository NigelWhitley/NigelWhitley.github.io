create table if not exists sports_setup (
 id int unsigned not null auto_increment
,name varchar(30) not null
,value varchar(30) not null
,primary key (id)
);

create table if not exists setup_choice (
 id int unsigned not null auto_increment
,name varchar(30) not null
,value varchar(30) not null
,primary key (id)
);

create table if not exists team (
 id int unsigned not null auto_increment
,name varchar(30) not null
,primary key (id)
);

create table if not exists score_types (
 id int unsigned not null auto_increment
,name varchar(30) not null
,score_value int not null
,primary key (id)
);

create table if not exists appearance (
 id int unsigned not null auto_increment
,registration_id int unsigned not null references player
,fixture_id int unsigned not null references fixture
,result_id int unsigned references result
,shirt_number int unsigned
,from_start varchar(1)
,on_at time
,off_at time
,primary key (id)
);

create table if not exists score (
 id int unsigned not null auto_increment
,appearance_id int unsigned not null references appearance
,score_type_id int unsigned not null references goal_type
,scored_at time
,primary key (id)
);

create table if not exists player (
 id int unsigned not null auto_increment
,name varchar(30) not null
,primary key (id)
);

create table if not exists competitor (
 id int unsigned not null auto_increment
,name varchar(30) not null
,sport_id int unsigned references sport
,primary key (id)
);

create table if not exists registration (
 id int unsigned not null auto_increment
,player_id int unsigned not null references player
,competitor_id int unsigned not null references cpompetitor
,primary key (id);
)

create table if not exists sport (
 id int unsigned not null auto_increment
,name varchar(30) not null
,team_size int unsigned not null
,primary key (id)
);

create table if not exists competition_type (
 id int unsigned not null auto_increment
,name varchar(30) not null
,primary key (id)
);

create table if not exists competition (
 id int unsigned not null auto_increment
,name varchar(30) not null
,sport_id int unsigned not null references sport
,result_type_id int unsigned not null references result_type
,type_id int unsigned not null references competition_type
,type_name varchar(30) not null
,primary key (id)
);

create table if not exists fixture_group (
 id int unsigned not null auto_increment
,name varchar(30)
,competition_id int unsigned not null references competition
,stage int not null
,nominal_date date
,nominal_time time
,primary key (id)
);

create table if not exists result_type (
 id int unsigned not null auto_increment
,name varchar(30) not null
,sport_id int unsigned not null references sport
,competition_type_id int unsigned not null references competition_type
,primary key (id)
);

create table if not exists entrant (
 id int unsigned not null auto_increment
,competition_id int unsigned not null references competition
,stage int not null
,competitor_id int unsigned references competitor
,primary key (id)
);

create table if not exists fixture (
 id int unsigned not null auto_increment
,competition_id int unsigned not null references competition
,fixture_group_id int unsigned not null references fixture_group
,fixture_id1 int unsigned references fixture
,competitor_id1 int unsigned references competitor
,fixture_id2 int unsigned references fixture
,competitor_id2 int unsigned references competitor
,actual_date date
,actual_time time
,primary key (id)
);

create table if not exists result (
 id int unsigned not null auto_increment
,fixture_id int unsigned references fixture
,result varchar(4) not null
,outcome_id int unsigned references outcome
,position int unsigned
,result_date date
,result_time time
,primary key (id)
);

create table if not exists outcome (
 id int unsigned not null auto_increment
,name varchar(10) not null
,primary key (id)
);

create table if not exists football_result (
 id int unsigned not null auto_increment
,fixture_id int unsigned references fixture
,goals_1 int not null
,goals_2 int not null
,outcome_id int unsigned references outcome
,position int unsigned
,result_date date
,result_time time
,primary key (id)
);

create table if not exists league_points (
 id int unsigned not null auto_increment
,name varchar(30)
,winner_points int unsigned
,loser_points int unsigned
,score_draw_points int unsigned
,no_score_draw_points int unsigned
,primary key (id)
);

create table if not exists competition_points (
 id int unsigned not null auto_increment
,competition_id int unsigned not null references competition
,league_points_id int unsigned not null references league_points
,primary key (id)
);

