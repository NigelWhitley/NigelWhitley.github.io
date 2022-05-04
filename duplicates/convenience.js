function translate_path(filename) {
	//alert("Folder id " + folder_id);
	var original_path="/mnt/smb/duplicates";
	var linked_path="/duplicates";

	var path_start = filename.indexOf(original_path);
	var translated_path;
	if ( path_start == -1 ) {
		translated_path=filename;
	} else {
		var path_end = path_start + original_path.length;
		var before_path = '';
		var after_path = '';

		if ( path_start != 0 ) {
			before_path = filename.substring(0, path_start);
		}

		if ( path_end != filename.length ) {
			after_path = filename.substring(path_end);
		}

		translated_path=before_path + linked_path + after_path;
		//translated_path=linked_path + filename.substring(original_path.length);
	}

	return translated_path;
}


function get_checkbox_delimiter() {
	return ":";
}


function split_checkbox_value(checkbox_value, delimiter) {
	//var end_of_group=checkbox_value.indexOf(delimiter);
	var split_value=checkbox_value.split(delimiter);
	return split_value;
}


function moveToFolder(folder_id) {
	//alert("Folder id " + folder_id);
	window.location.hash = folder_id;

	return true;
}


