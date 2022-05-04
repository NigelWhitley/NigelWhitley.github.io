<html>
<head>
<title> UPSportSite </title>
<?php
include "link_css.inc";
?>
</head>
<body>

<?php

include_once "connect_to_db.inc";

$site_header_rule=NULL;

if ( $messages->is_empty() ) {
	$tables=mysql_list_tables("sports");
	if (mysql_num_rows($tables) == 0)
	{

		$site_header_rule = "db_init";
		include "site_header.inc";
		print "<h1>Site initialisation</h1>";
		print "<div id=\"content\">";
		print "<p>";
		print "Creating tables...";
		print "<br/>";
		include_once "db_utils.inc";
		include_once "admin_site.inc";
		build_sports_tables();
		print "Populating the tables...";
		print "<br/>";
		include "sports_population.inc";
		print "<br/>";
		populate_tables();
		print "Database initialised";
		print "<br/>";
		print "</p>";
		print "<h3>Site Administration setup has completed</h3>";
		print "<p>";
		print "The site has been configured to default settings for name, logo and behaviour.";
		print "You will almost certainly want to change the name and logo but you don't need to do that right away.";
		print "You can return to this admin page by clicking the image in the top left of the page.";
		print "</p>";
		print "<p>";
		print "Similarly, you may wish to change the site from team based to competition based if you use it to run a league or cup.";
		print "</p>";
	}
	else
	{
		include "site_header.inc";
		print "<h1>Site Administration</h1>";
		print "<div id=\"content\">";
	}

	print "<p>";
	print "To reconfigure your site, choose one of the options below";
	print "<br/>";
	include "NavList.inc";
	include "NavOption.inc";
	$optionList = new NavList();

	$optionList->add(new NavOption("SiteID", "Site identification", "Site name, logo, etc.", "admin_identification.php") );
	$optionList->add(new NavOption("SiteChar", "Site behaviour", "How your site behaves.", "admin_behaviour.php") );
	$optionList->add(new NavOption("SiteMaint", "Site maintenance", "Maintaining your site.", "admin_maintenance.php?_rebuild") );
	include_once "TableOutputList.inc";
	$list_output = new TableOutputList($optionList);
	$list_output->listAll();
	print "</p>";
	print "<p>";
	print "To begin entering your site data, go to <a href=\"index.php\">Home</a>";
	print "<br/>";
	print "</p>";
}
else {
	$site_header_rule = "db_failure";
	include "site_header.inc";
	print "<div id=\"content\">";

?>
Cannot connect to database.
<?php
}
mysql_close($dbh);

?>
</div>
<?php

include_once "NavList.inc";
$footer_options = new NavList();
$footer_options->addBack();
$footer_options->addStandard("help_page='admin_site'");

include_once "LineOutputList.inc";
$list_output = new LineOutputList($footer_options);
print "<div id=\"footer\">";
$list_output->listAll();
?>
</div>

</body>
</html>
