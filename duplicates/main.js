function view_by_folder(filename, clear_session) {
	//alert("view by folder 1000");
	//alert("view by folder Filename is " + filename);
	var xml_file=document.getElementsByName("xml_file");
	//alert("view by folder 2000");
	xml_file[0].value=filename;
	//alert("view by folder 3000");
	var display_mode=document.getElementsByName("display_mode");
	display_mode[0].value="folder";
	//alert("view by folder 5000");
	document.forms["f_duplicates"].action='duplicates.php';
	if ( clear_session ) {
		clearSessionAJAX(filename);
	} else {
		//alert("view by folder 8000");
		document.forms["f_duplicates"].submit();
	}
	return true;
}


function view_by_duplicate(filename, clear_session) {
	//alert("By duplicate Filename is " + filename);
	var xml_file=document.getElementsByName("xml_file");
	xml_file[0].value=filename;
	//alert("Set chosen Filename is " + filename);
	var display_mode=document.getElementsByName("display_mode");
	display_mode[0].value="duplicates";
	//alert("Set chosen Filename by duplicate is " + filename);
	document.forms["f_duplicates"].action='duplicates.php';
	if ( clear_session ) {
		clearSessionAJAX(filename);
	} else {
		document.forms["f_duplicates"].submit();
	}
	return true;
}


function choose_folder() {
	//alert("By duplicate Filename is " + filename);
	//alert("Set chosen Filename is " + filename);
	var xml_file=document.getElementsByName("xml_file");
	xml_file[0].value="";
	var display_mode=document.getElementsByName("display_mode");
	display_mode[0].value="";
	//alert("Set chosen Filename by duplicate is " + filename);
	document.forms["f_duplicates"].action='duplicates.php';
	document.forms["f_duplicates"].submit();
	return true;
}


function changeDuplicateFile(checkbox, delimiter) {
	//var end_of_group=checkbox_value.indexOf(delimiter);
	var checkbox_value = checkbox.value;
	var checkbox_split=split_checkbox_value(checkbox.value, delimiter);
	var file_name=checkbox_split[0];
	var group_id=checkbox_split[1];
	var file_index=checkbox_split[2];
	var group_size=checkbox_split[3];

	//alert("changeFile 1000");
	var base_id="group" + group_id;
	var group_element=document.getElementById(base_id);
	//alert("changeFile 1400");
	//var checkbox_list=group_element.getElementsByName('delfile[]');
	var checkbox_list=group_element.getElementsByTagName('input');
	//alert("changeFile 1700");
	var list_count=checkbox_list.length;
	var checked_count=0;
	var test_count=0;
	//alert("changeFile 2000");
	for (checkbox_index=0; checkbox_index<=(list_count-1); checkbox_index++) {
		//test_count++;
		if (checkbox_list[checkbox_index].checked) {
			checked_count++;
		}
	}

	//alert("changeFile 3000");
	if (checkbox.checked) {
		if ( checked_count == list_count ) {
			checkbox.checked = false;
			alert("Must not delete all files for the image");
		} else {
			//alert(checkbox.parent.parent.getAttribute("class"));
			//alert(checkbox.parentNode.parentNode.nodeName + " not checked");
			checkbox.parentNode.parentNode.setAttribute("class","remove_file");
			alert("Delete file " + file_name);
			changeFileAJAX(file_name, true);
		}
	} else {
		//alert(checkbox.parentNode.parentNode.nodeName + " not checked");
		//alert('checkbox.setAttribute("class", "keep_file");');
		checkbox.parentNode.parentNode.setAttribute("class","keep_file");
		changeFileAJAX(file_name, false);
	}

	return true;
}


function changeFolderFile(checkbox, delimiter) {
	// Called when the checkbox for a file is ticked/unticked hen viewed by folder
	// The checkbox value is a concatenation of the folder name and the id of the corresponding folder div 

	// Expects the page to have spans for the checkbox and for the folder name within a parent div
	//var folder_div = checkbox.parentNode;
	//var folder_span_index=getNextChildIndex(folder_element, 0, "SPAN");
	//var folder_span=folder_div.childNodes[folder_span_index];
	//var folder_name = folder_span.childNodes[0].data;

	// Get the folder name and the id of the base folder element, then use that to reference the corresponding div element
	//alert("changeFolderFile 1000");
	var checkbox_state = checkbox.checked;
	var checkbox_value = checkbox.value;
	//alert("changeFolderFile 2000");
	var checkbox_split=split_checkbox_value(checkbox.value, delimiter);
	var full_file_name=checkbox_split[0];
	var file_name=checkbox_split[1];
	var folder_name=checkbox_split[2];
	var folder_id=checkbox_split[3];
	//var folder_name=checkbox_split[0];
	//alert("changeFolderFile 3000 - folder " + folder_name);
	var folderGroup = new FolderGroup(folder_id);
	//alert("changeFolderFile 4000 : state is " + checkbox_state);
	folderGroup.changeFileCheckbox(checkbox, file_name);
	return true;
}


function changeFolder(checkbox, delimiter) {
	// Called when the checkbox for a folder is ticked/unticked
	// The checkbox value is a concatenation of the folder name and the id of the corresponding folder div 

	// Expects the page to have spans for the checkbox and for the folder name within a parent div
	//var folder_div = checkbox.parentNode;
	//var folder_span_index=getNextChildIndex(folder_element, 0, "SPAN");
	//var folder_span=folder_div.childNodes[folder_span_index];
	//var folder_name = folder_span.childNodes[0].data;

	// Get the folder name and the id of the base folder element, then use that to reference the corresponding div element
	//alert("changeFolder 1000");
	var checkbox_state = checkbox.checked;
	var checkbox_value = checkbox.value;
	//alert("changeFolder 2000");
	var checkbox_split=split_checkbox_value(checkbox.value, delimiter);
	var folder_name=checkbox_split[0];
	var folder_id=checkbox_split[1];
	//alert("changeFolder 3000 - folder " + folder_name + " - id " + folder_id);
	var folderGroup = new FolderGroup(folder_id);
	//alert("changeFolder 4000 : state is " + checkbox_state);
	folderGroup.changeFolderCheckbox(checkbox);
	return true;
}


function checkscript() {

	var boxesTicked = "";
	var fullGroups = "";
	var checkGroups = "";
	var value_delimiter = get_checkbox_delimiter();

	var last_checkbox=document.getElementsByName('delfile[]').length - 1;
	//var prev_group="0";
	//var group_size=0;
	//var group_count=0;

	//for (i = document.getElementsByName('delfile[]').length - 1; i >= 0; i--) {
	for (i = 0; i<document.getElementsByName('delfile[]').length - 1; i++) {
		if (document.getElementsByName('delfile[]')[i].checked) {
			boxesTicked = "OK";
		}

	}

	if (boxesTicked == "") {
		alert ("You must select a box to continue.");
		return false;
	}
	else
		//alert ("show " + checkGroups);
		return true;
}


function count_checked_boxes(checkboxes) {
	var last_checkbox=checkboxes.length - 1;
	var checked_count=0;
	for (checkbox_index = 0; checkbox_index<=last_checkbox; checkbox_index++) {
		if (checkboxes[checkbox_index].checked) {
			checked_count=checked_count + 1;
		}

	}
	return checked_count;
}


function show_deletions() {

	//alert ("show_deletions");
	//alert ("got checked_count");
	var file_checkboxes=document.getElementsByName('delfile[]');
	var folder_checkboxes=document.getElementsByName('delfolder[]');
	var checked_count=0;
	//for (i = document.getElementsByName('delfile[]').length - 1; i >= 0; i--) {
	checked_count=count_checked_boxes(file_checkboxes);
	checked_count=checked_count + count_checked_boxes(folder_checkboxes);
	if (checked_count == 0) {
		alert ("You have not selected anything to delete.");
		return false;
	} else {

		//alert ("did not exit.");
		get_deletions();
	}


}


