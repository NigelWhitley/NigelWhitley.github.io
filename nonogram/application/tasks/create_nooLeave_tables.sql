use nooLeave;

create table if not exists nooLeave_setup (
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

create table if not exists leave_group (
 id int unsigned not null auto_increment
,name varchar(30) not null
,primary key (id)
);

create table if not exists person (
 id int unsigned not null auto_increment
,leave_group_id int unsigned not null references leave_group
,given_name varchar(30) not null
,family_name varchar(30) not null
,public_ref varchar(30)
,primary key (id)
);

create table if not exists leave_period (
 id int unsigned not null auto_increment
,period_start date
,period_end date
,primary key (id)
);

create table if not exists entitlement (
 id int unsigned not null auto_increment
,person_id int unsigned not null references person
,period_id int unsigned not null references leave_period
,original int
,taken int
,requested int
,name varchar(30) not null
,primary key (id)
);

create table if not exists request_status (
 id int unsigned not null auto_increment
,name varchar(30) not null
,primary key (id)
);

create table if not exists leave_request (
 id int unsigned not null auto_increment
,entitlement_id int unsigned not null references entitlement
,request_status_id int unsigned not null references request_status
,period_start date
,period_end date
,leave_days int
,primary key (id)
);
