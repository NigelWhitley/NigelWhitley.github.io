function DuplicateFiles() {
	this.file = new Array();
	this.file_element = new Array();
	this.folder_element = new Array();
	DuplicateFiles.prototype.add_duplicate=function (file_name, file_element, folder_element) {
		this.file.push(file_name);
		this.file_element.push(file_element);
		this.folder_element.push(folder_element);
	}
}


function ElementInfo(info, doc_element) {
	this.info = info;
	this.doc_element = doc_element;
}


function GroupedElement(name, id, related_element) {
	this.related_folder = name;
	this.related_element = related_element;

	this.related_folder_id = id;
	this.related_base = null;
	this.reverse_reference = null;
	this.related_file_checkbox = new Array();
	this.reverse_file_checkbox = new Array();

	GroupedElement.prototype.set_folder_id=function (folder_id) {
		this.related_folder_id = null;
	}

	GroupedElement.prototype.set_base=function (base_element) {
		this.related_base = base_element;
	}

	GroupedElement.prototype.set_reverse_reference=function (reverse_reference) {
		this.reverse_reference = reverse_reference;
	}

	GroupedElement.prototype.set_related_file=function (related_file) {
		this.related_file_checkbox.push( related_file );
	}

	GroupedElement.prototype.set_reverse_file=function (reverse_file) {
		this.reverse_file_checkbox.push( reverse_file );
	}

}

// General approach is to identify all folders, then identify the specific folder and 
// find those folders with which it shares duplicate files.
// The page is structured as a set of "base" folders. For each base folder there is a 
// list of folders and within each of those folders there are pairs representing 
// duplicate files.
// The first file in each pair belongs to the base folder and the other file belongs to
// other folder. Note that it is possible there are duplicates within a single folder.
// In that special case each pair of files appears only once where the first name
// is "lower" than the second name, according to some sort order which is currently
// the default string sort.
function FolderGroup(base_folder) {

	this.path_delimiter = "/";

	FolderGroup.prototype.find_all_folder_bases=function () {
		//alert("find_all_folder_bases 1000");
		this.all_folder_bases=new Array();

		var all_folder_elements=document.getElementsByClassName("folder_set");
		//alert("find_all_folder_bases 2000 Retrieved " + all_folder_elements + " folder bases");
		for (var element=0; element<all_folder_elements.length; element++) {
			var folder_element=all_folder_elements[element];
			var name_index = getNextChildIndex(folder_element, 0, "SPAN");
			var name_element = folder_element.childNodes[name_index];
			var text_index = getNextChildIndex(name_element, 0, "#text");
			var text_element = name_element.childNodes[text_index];
			var folder_path=text_element.nodeValue.trim();
			//alert("Retrieved " + folder_path + " folder path");
			//alert("find_all_folder_bases 8000 element " + folder_element + " folder path " + folder_path);
			this.all_folder_bases[element]=new ElementInfo({name:folder_path, id:folder_element.id}, folder_element);
		}
		//return this.all_folder_bases;
	}

	FolderGroup.prototype.find_base_info=function (base_folder) {
		//alert("find_base_info 1000 searching for base folder " + base_folder);
		//alert(" in " + all_folder_bases.length + " bases");
		for (var element=0; element<this.all_folder_bases.length; element++) {
			//alert("find_base_info 3000 checking folder " + this.all_folder_bases[element].info.id);
			if (this.all_folder_bases[element].info.id == base_folder) {
				//alert("returning with base info for " + all_folder_bases[element].folder);
				return this.all_folder_bases[element];
				//this.base_folder = this.all_folders[element];
				//break;
			}
		}
		alert("find_base_info 9000 : returning without base info" );
	}

	FolderGroup.prototype.add_related_folders=function( folder_divs ) {
		/* 
		 * Find related folders by getting the name and id info from
		 * the "other" folders for this base
		*/
		var base_id_length = this.base_info.info.id.length;
		//var this_span_index=getNextChildIndex(folder_element, 0, "DIV");
		for (var element=0; element<folder_divs.length; element++) {
			var folder_div = folder_divs[element];
			var folder_id = folder_div.id;
			var related_folder_id = folder_id.substr(base_id_length);
			// Folder name is the data of the first span within the DIV
			//alert("find_related_folders element " + element);
			var name_span_index = getNextChildIndex(folder_div, 0, "SPAN");
			//alert("find_related_folders name_span_index " + name_span_index);
			var name_span = folder_div.childNodes[name_span_index];
			// Get the folder name from the text inside the span
			var name_text_index = getNextChildIndex(name_span, 0, "#text");
			//alert("find_related_folders name_text_index " + name_text_index);
			var name_text = name_span.childNodes[name_text_index];
			//alert("find_related_folders element " + element + " name " + name_text.nodeValue);
			this.related_folders.push( new GroupedElement(name_text.nodeValue.trim(), related_folder_id, folder_div) );
		}
		
		//alert("find_related_folder 500 related length " + related_folders.length);
		//return related_folders;
	}

	FolderGroup.prototype.find_related_folders=function() {
		/* 
		 * Find related folders by getting the name and id info from
		 * the "other" folders for this base
		*/
		var base_element=this.base_info.doc_element;
		//alert("find_related_folders 1000 : base element name " + base_element.nodeName);
		this.related_folders = new Array();
		var other_folder_divs=base_element.getElementsByClassName("other_folder");
		//alert("other folder divs length " + other_folder_divs.length);
		//var other_folder_divs=getElementsByClassName(base_element, "other_folder");
		//alert("other folder divs length " + other_folder_divs.length);
		//var base_folder_id = this.base_info.info.id;
		//var this_span_index=getNextChildIndex(folder_element, 0, "DIV");
		this.add_related_folders(other_folder_divs);
		var same_folder_divs=base_element.getElementsByClassName("same_folder");
		this.add_related_folders(same_folder_divs);
		//alert("find_related_folders 9000 related length " + related_folders.length);
		//return related_folders;
	}

	FolderGroup.prototype.find_related_bases=function () {
		/* 
		 * Find the "base" elements for the related folders, which
		 * will be the base for each of the "other" folders for this base
		*/
		//var base_element=this.base_folder.doc_element;

		//alert("find_related_bases 1000 related length " + this.related_folders.length);
		for (var folder=0; folder<this.related_folders.length; folder++) {
			var related_div = this.related_folders[folder].related_element;
			//alert("find_related_bases 2000 " + related_div.nodeName);
			var folder_name=this.related_folders[folder].name;
			var folder_id=this.related_folders[folder].related_folder_id;
			//this.related_folders[folder] = new GroupedElement(folder_name, related_div)
			// Folder name is the data of the first span within the DIV
			//alert("find_related_bases 2500  " + folder);
			//alert("find_related_bases 2700 " + this.related_folders[folder].related_element.nodeName);
			var related_base_element=document.getElementById(folder_id);
			//alert("find_related_bases 5000");
			//this.related_folders[folder].set_folder_id ( folder_id );
			this.related_folders[folder].set_base ( related_base_element );
			var reverse_id = this.related_folders[folder].related_folder_id + this.base_info.info.id;
			var related_reverse_element=document.getElementById(reverse_id);
			this.related_folders[folder].set_reverse_reference ( related_reverse_element );
		}
		//alert("find_related_bases 9000 ");
	}

	FolderGroup.prototype.get_checkbox_for_base=function(base_div) {
		//alert("get_checkbox_for_base 1000");
		//alert("get_checkbox_for_base 2000 - classname " + base_div.className);
		var name_span_index=getNextChildIndex(base_div, 0, "SPAN");
		//alert("get_checkbox_for_base 3000");
		var controls_span_index=getNextChildIndex(base_div, name_span_index+1, "SPAN");
		//alert("get_checkbox_for_base 4000");
		if ( controls_span_index >= base_div.childNodes.length ) {
			return null;
		}
		var controls_span=base_div.childNodes[controls_span_index];
		//alert("get_checkbox_for_base 5000 - name " + controls_span.nodeName + " class " + controls_span.className);
		var checkbox_span_index=getNextChildIndex(controls_span, 0, "SPAN");
		//alert("get_checkbox_for_base 6000");
		if ( checkbox_span_index >= controls_span.childNodes.length ) {
			return null;
		}
		var checkbox_span=controls_span.childNodes[checkbox_span_index];
		//alert("get_checkbox_for_base 7000 " + checkbox_span.className);
		var checkbox_input_index=getNextChildIndex(checkbox_span, 0, "INPUT");
		//alert("get_checkbox_for_base 8000 - index " + checkbox_input_index);
		//var checkbox_input=checkbox_span.childNodes[checkbox_input_index];
		//alert("get_checkbox_for_base 8400 - length " + checkbox_span.childNodes.length);
		//alert("get_checkbox_for_base 8700 - node " + checkbox_span.childNodes[0].nodeName);
		//alert("get_checkbox_for_base 9000 - checked " + checkbox_input.checked);
		if ( checkbox_input_index >= checkbox_span.childNodes.length ) {
			return null;
		}
		return checkbox_span.childNodes[checkbox_input_index];
	}

	FolderGroup.prototype.changeFolderCheckbox=function(checkbox) {
		// Called when the checkbox for a folder is ticked/unticked
		// The checkbox value is a concatenation of the folder name and the id of the corresponding folder div 

		// Expects the page to have spans for the checkbox and for the folder name within a parent div
		// Get the folder name of the base folder element, then use that to reference the corresponding div element
		//alert("o changeFolder 1000");
		var checkbox_state = checkbox.checked;
		var folder_name=this.base_info.info.name;
		//alert("o changeFolder 2000 : state is " + checkbox_state);
		var ok_to_change = false;
		if (checkbox_state) {
			//alert("o changeFolder 2700 : state is " + checkbox_state);
			for (var base=0; base<this.related_folders.length; base++) {
				//alert("o changeFolder 3300 - base " + base);
				var other_checkbox = this.get_checkbox_for_base(this.related_folders[base].related_base);
				//alert("o changeFolder 3600 - checkbox type" + typeof other_checkbox);
				if ( ( other_checkbox !== null ) && ( ! other_checkbox.checked ) ) {
					//alert("changeFolder 3800 - ok to change - not deleting " + this.related_folders[base].related_folder);
					ok_to_change = true;
				}
			}
		} else {
			//alert("o changeFolder 2900 : unchecking");
			ok_to_change = true;
		}
		
		//alert("o changeFolder 5000 : ok_to_change " + ok_to_change);
		if ( ok_to_change ) {
			//alert("changeFolder 5300 - ok to change");
			// Change the state of the checkbox for the base to this folder
			var base_info = this.get_base_info();
			//alert("changeFolder 5600 - base_info " + base_info.doc_element);
			var base_checkbox = this.get_checkbox_for_base(base_info.doc_element);
			base_checkbox.checked=checkbox_state;
			
			// Change the state of the checkboxes for the other references to this folder
			//alert("changeFolder 6000 - length " + this.related_folders.length);
			for (var reverse=0; reverse<this.related_folders.length; reverse++) {
				//alert("changeFolder 6300 - reverse " + reverse);
				var reverse_reference = this.related_folders[reverse].reverse_reference;
				//alert("changeFolder 6600 - rev ref  " + reverse_reference.nodeName);
				var reverse_checkbox = this.get_checkbox_for_base(reverse_reference);
				if ( reverse_checkbox !== null ) {
					reverse_checkbox.checked=checkbox_state;
				}
			}
			//alert("o changeFolder 7000 - session variables");
			changeFolderAJAX(folder_name, checkbox_state);
		} else {
			checkbox.checked = false;
			alert("Not permitted to delete all the folders duplicating an image");
		}

		//alert("o changeFolder 9000 - ending");
		return true;
	}

	FolderGroup.prototype.findCheckboxInFileSpan=function(file_span, file_name) {
		//alert("o findCheckboxInFileSpan 1000 - file span " + file_span + " name " + file_name);
		var name_span_index = getNextChildIndex(file_span, 0, "SPAN");
		var name_span = file_span.childNodes[name_span_index];
		//alert("o findCheckboxInFileSpan 2000 - name span " + name_span.className);
		var name_index = getNextChildIndex(name_span, 0, "#text");
		var name = name_span.childNodes[name_index].nodeValue;
		//alert("o findCheckboxInFileSpan 4000 - file_name " + file_name + " name " + name);
		if ( name.trim() == file_name.trim() ) {
			//alert("o findCheckboxInFileSpan 4000 - found file_name " + file_name);
			//alert("o findCheckboxInFileSpan 4500 - file span " + file_span.className);
			var checkbox_index=getNextChildIndex(file_span, 0, "INPUT");
			//alert("o findCheckboxInFileSpan 5500 - file checkbox index = " + checkbox_index);
			//alert("o findCheckboxInFileSpan 6000 - found file checkbox " + file_span.childNodes[checkbox_index].nodeName);
			return file_span.childNodes[checkbox_index];
		} else {
			return null;
		}
	}

	FolderGroup.prototype.dumpDuplicateFiles=function() {
		//alert("dumpDuplicateFiles 1000 ");
		var files_dump = "";
		for (duplicate=0; duplicate < this.duplicate_files.file.length; duplicate++) {
			//alert("Duplicate " + duplicate + " name " + this.duplicate_files.file[duplicate] + " state " + this.duplicate_files.file_element[duplicate].checked);
			files_dump = files_dump + "\n" + "Duplicate " + duplicate + " : name " + this.duplicate_files.file[duplicate] + " : state " + this.duplicate_files.file_element[duplicate].checked;
		}
		alert("dumpDuplicateFiles 5000 " + files_dump);
	}

	FolderGroup.prototype.checkDuplicateFiles=function() {
		/* returns true if safe to delete, otherwise false
		 * It's safe to delete if any of the other duplicates are not scheduled for deletion
		*/
		//alert("checkDuplicateFiles 1000 ");
		for (var duplicate=0; duplicate < this.duplicate_files.file.length; duplicate++) {
			//alert("checkDuplicateFiles 2000 Duplicate " + duplicate + " name " + this.duplicate_files.file[duplicate]);
			if ( ! this.duplicate_files.file_element[duplicate].checked ) {
				//alert("checkDuplicateFiles 3000 Duplicate " + duplicate + " name " + this.duplicate_files.folder_element[duplicate]);
				var folder_checkbox = this.get_checkbox_for_base(this.duplicate_files.folder_element[duplicate]);
				//alert("checkDuplicateFiles 4000 Duplicate " + duplicate + " folder " + folder_checkbox);
				if ( ( folder_checkbox === null ) || ( ! folder_checkbox.checked ) ) {
					//alert("checkDuplicateFiles 5000 Duplicate " + duplicate + " ok to delete ");
					return true;
				}
			}
		}
			//alert("checkDuplicateFiles 9000 not ok to delete ");
		return false;
	}

	FolderGroup.prototype.buildDuplicateFiles=function() {
		//alert("o buildDuplicateFiles 1000");
		//alert("o buildDuplicateFiles 1300 - related elements length " + this.related_folders.length );
		this.duplicate_files = new DuplicateFiles();
		//alert("o buildDuplicateFiles 2300 - related folders length " + this.related_folders.length);
		for (var folder=0; folder < this.related_folders.length; folder++) {
			//alert("o buildDuplicateFiles 2500 - folder " + folder);
			for ( var checkbox=0; checkbox<this.related_folders[folder].related_file_checkbox.length; checkbox++ ) {
				// We need to cater for duplicates in the same folder so first check for class of file span 
				// then use the alternate span of the file pair afterwards
				// I.e. if the checkbox is under "this_file" use "other_file" and vice versa.
				var related_file_span = this.related_folders[folder].related_file_checkbox[checkbox].parentNode;
				var related_file_class = related_file_span.className;
				// The div for the file pair is grandparent of the file checkbox
				var file_pair_div = this.related_folders[folder].related_file_checkbox[checkbox].parentNode.parentNode;
				//alert("o buildDuplicateFiles 3000 - checkbox " + checkbox);
				var duplicate_file_class = "other_file";
				if ( related_file_class !== "this_file") {
					duplicate_file_class = "this_file";
				}
				//alert("o buildDuplicateFiles 3300 - duplicate_file_class " + duplicate_file_class);
				//alert("o buildDuplicateFiles 3350 - related_file_class " + related_file_class);
				var file_spans=file_pair_div.getElementsByClassName(duplicate_file_class);
				var file_span = file_spans[0];
				//var span_index = 0;
				var other_checkbox_index = getNextChildIndex(file_span, 0, "INPUT");
				var other_file_checkbox = file_span.childNodes[other_checkbox_index];
				var checkbox_values=split_checkbox_value(other_file_checkbox.value, get_checkbox_delimiter());
				var name = checkbox_values[0];
				//alert("o buildDuplicateFiles 3500 - name span " + name_span.className);
				//alert("o buildDuplicateFiles 3800 - this checkbox type " + this_checkbox.nodeName);
				this.duplicate_files.add_duplicate(name, other_file_checkbox, this.related_folders[folder].related_element);
			}
		}
	}

	// Because a file (or, strictly, its contents) may be duplicated within a folder, 
	// we need to hold the related/reverse file information in arrays. 
	// Typically there will only be a single element in each array but we must cater 
	// for the atypical.
	FolderGroup.prototype.findRelatedFiles=function(file_name) {
		//alert("o findRelatedFiles 1000");
		//alert("o findRelatedFiles 1050 - file_name " + file_name + " with " + this.related_folders.length + " related");
		var base_folder_id = this.base_info.info.id;
		for (var folder=0; folder<this.related_folders.length; folder++) {
			//var related_folder = related_folders[folder];
			//alert("o findRelatedFiles 1100 - folder " + folder);
			this.related_folders[folder].related_file_checkbox = new Array();
			//alert("o findRelatedFiles 1200");
			this.related_folders[folder].reverse_file_checkbox = new Array();
			//this.reverse_file_checkboxes[folder] = new ElementInfo("",null);
			//alert("o findRelatedFiles 1300");
			var related_folder_element = this.related_folders[folder].related_element;
			//alert("o findRelatedFiles 1600 - folder " + this.related_folders[folder].related_element);
			var related_checkbox = this.get_checkbox_for_base(related_folder_element);
			//alert("o findRelatedFiles 2000 - folder checkbox " + related_checkbox.checked);

			var this_file_spans=related_folder_element.getElementsByClassName("this_file");
			//alert("o findRelatedFiles 3700 - spans length " + this_file_spans.length);
			for (var file=0; file< this_file_spans.length; file++) {
				var this_file_span=this_file_spans[file];
				//alert("o findRelatedFiles 4000 - file " + file);
				var this_checkbox = this.findCheckboxInFileSpan(this_file_span, file_name);
				//alert("o findRelatedFiles 4100 - this checkbox typeof " + typeof this_checkbox);
				//alert("o findRelatedFiles 4200 - this checkbox value " + this_checkbox);
				if ( this_checkbox !== null ) {
					//alert("o findRelatedFile 4500 - this checkbox found for " + file_name);
					this.related_folders[folder].related_file_checkbox.push( this_checkbox );
					//alert("o findRelatedFiles 4700 - stored this file checkbox ");
					//found = true;
					//break;
				}
			}

			var reverse_reference_element = this.related_folders[folder].reverse_reference;
			var reverse_file_spans=reverse_reference_element.getElementsByClassName("other_file");
			//alert("o findRelatedFiles 5300 - spans length " + reverse_file_spans.length);
			for (var file=0; file< reverse_file_spans.length; file++) {
				var reverse_file_span=reverse_file_spans[file];
				//alert("o findRelatedFiles 6000 - file " + file);
				var reverse_checkbox = this.findCheckboxInFileSpan(reverse_file_span, file_name);
				//alert("o findRelatedFiles 6200 - name " + name);
				if ( reverse_checkbox !== null ) {
					//alert("o findRelatedFiles 6500 - reverse checkbox found for " + file_name);
					this.related_folders[folder].reverse_file_checkbox.push( reverse_checkbox );
					//alert("o findRelatedFiles 6700 - stored reverse file checkbox ");
					//found = true;
					//break;
				}
			}

			// If the current folder is the "same" folder, we have to check 
			// for duplicates where the file_name matches the "other" file.
			// This is because we only show the duplicate relationships in 
			// one direction when both files are in the same folder. 
			// Therefore the file_name may only appear in the "other" part 
			// of a file pair. When the folders are seperate the inverse 
			// file pair will appear for the inverse folder pair - for the 
			// same folder it is its own "inverse" folder pair.
			if ( this.related_folders[folder].related_folder_id === base_folder_id ) {
				var other_file_spans=related_folder_element.getElementsByClassName("other_file");
				//alert("o findRelatedFiles 23700 - spans length " + this_file_spans.length);
				for (var file=0; file< other_file_spans.length; file++) {
					var other_file_span=other_file_spans[file];
					//alert("o findRelatedFiles 24000 - file " + file);
					var other_checkbox = this.findCheckboxInFileSpan(other_file_span, file_name);
					//alert("o findRelatedFiles 24100 - this checkbox typeof " + typeof this_checkbox);
					//alert("o findRelatedFiles 24200 - this checkbox value " + this_checkbox);
					if ( other_checkbox !== null ) {
						//alert("o findRelatedFile 24500 - this checkbox found for " + file_name);
						this.related_folders[folder].related_file_checkbox.push( other_checkbox );
						//alert("o findRelatedFiles 24700 - stored this file checkbox ");
						//found = true;
						//break;
					}
				}

				var reverse_reference_element = this.related_folders[folder].reverse_reference;
				var reverse_file_spans=reverse_reference_element.getElementsByClassName("this_file");
				//alert("o findRelatedFiles 25300 - spans length " + reverse_file_spans.length);
				for (var file=0; file< reverse_file_spans.length; file++) {
					var reverse_file_span=reverse_file_spans[file];
					//alert("o findRelatedFiles 26000 - file " + file);
					var reverse_checkbox = this.findCheckboxInFileSpan(reverse_file_span, file_name);
					//alert("o findRelatedFiles 26200 - name " + name);
					if ( reverse_checkbox !== null ) {
						//alert("o findRelatedFiles 26500 - reverse checkbox found for " + file_name);
						this.related_folders[folder].reverse_file_checkbox.push( reverse_checkbox );
						//alert("o findRelatedFiles 26700 - stored reverse file checkbox ");
						//found = true;
						//break;
					}
				}
			}
			//alert("o findRelatedFiles 8000 related " + this.related_folders[folder].related_file_checkbox.length + " : reverse " + this.related_folders[folder].reverse_file_checkbox.length );
		}
		//alert("o findRelatedFiles 9000 " );
		return true;
	}

	FolderGroup.prototype.changeFileCheckbox=function(checkbox, file_name) {
		// Called when the checkbox for a file is ticked/unticked
		// The checkbox value is a concatenation of the folder name and the id of the corresponding folder div 

		// Expects the page to have spans for the checkbox and for the file name within a parent div
		// Find the matching file for each related folder.
		//alert("o changeFileCheckbox 1000");
		this.findRelatedFiles(file_name);
		//alert("o changeFileCheckbox 1200");
		var file_checkbox_checked = checkbox.checked;
		//alert("o changeFileCheckbox 1400");
		var folder_name=this.base_info.info.name;
		//alert("o changeFileCheckbox 1700");
		var ok_to_change = false;
		var folder_checkbox = this.get_checkbox_for_base(this.base_info.doc_element);
		if ( file_checkbox_checked && ( ( folder_checkbox == null ) || ( ! folder_checkbox.checked ) ) ) {
			//alert("o changeFileCheckbox 2000");
			this.buildDuplicateFiles();
			//alert("o changeFileCheckbox 2300");
			//this.dumpDuplicateFiles();
			var ok_to_delete = this.checkDuplicateFiles();
			//alert("o changeFileCheckbox 2800");
			if ( ok_to_delete ) {
				//alert("changeFileCheckbox 2900 ok to change");
				ok_to_change = true;
			//} else {
				//alert("changeFileCheckbox 2950 not ok to change");
				//ok_to_change = false;
			}
		} else {
			//alert("o changeFileCheckbox 3900 : unchecking");
			ok_to_change = true;
		}

		//alert("o changeFileCheckbox 5000 : ok_to_change " + ok_to_change);
		if ( ok_to_change ) {
			//alert("changeFileCheckbox 5300 - ok to change");
			// Change the state of the checkbox for the base to this folder
			//var base_info = this.get_base_info();
			//alert("changeFileCheckbox 5600 - base_info " + base_info.doc_element);
			//var base_checkbox = this.get_checkbox_for_base(base_info.doc_element);
			//base_checkbox.checked=checkbox_state;
			
			// Change the state of the checkboxes for the other references to this folder
			//var reverse_references = this.get_reverse_references();
			//alert("changeFileCheckbox 6000 - length " + this.related_folders.length);
			for (var folder_index=0; folder_index<this.related_folders.length; folder_index++) {
				//alert("changeFileCheckbox 6100 - related folder " + folder_index + " - related length " + this.related_folders[folder_index].related_file_checkbox.length);
				for (var checkbox=0; checkbox<this.related_folders[folder_index].related_file_checkbox.length; checkbox++ ) {
					//alert("changeFileCheckbox 6200 - related_folder " + folder_index + " checkbox " + checkbox);
					this.related_folders[folder_index].related_file_checkbox[checkbox].checked = file_checkbox_checked;
				}
				for (var checkbox=0; checkbox<this.related_folders[folder_index].reverse_file_checkbox.length; checkbox++ ) {
					//alert("changeFileCheckbox 6400 - related_folder " + folder_index + " checkbox " + checkbox);
					this.related_folders[folder_index].reverse_file_checkbox[checkbox].checked = file_checkbox_checked;
				}
			}
			//alert("o changeFileCheckbox 7000 - session variables");
			changeFileAJAX(folder_name + this.path_delimiter + file_name, file_checkbox_checked);
		} else {
			checkbox.checked = false;
			alert("May not delete all the files duplicating an image");
		}

		//alert("o changeFileCheckbox 9000 - ending");
		return true;
	}

	FolderGroup.prototype.get_base_info=function() {
		return this.base_info;
	}

	FolderGroup.prototype.get_related_folders=function() {
		//alert(" FolderGroup - get_related_folders - length " + this.related_folders.length);
		return this.related_folders;
	}

	FolderGroup.prototype.get_related_bases=function() {
		//alert(" FolderGroup - get_related_bases - length " + this.related_bases.length);
		return this.related_bases;
	}

	FolderGroup.prototype.get_reverse_references=function() {
		return this.reverse_references;
	}

	FolderGroup.prototype.clear_reverse_file_checkboxes=function() {
		this.reverse_file_checkboxes = new Array();
	}

	//alert("FolderGroup 1000");
	this.value_delimiter = get_checkbox_delimiter();
	
	this.find_all_folder_bases();
	//alert("FolderGroup 2000");
	this.base_info = this.find_base_info(base_folder);
	//alert("FolderGroup 2400 - base_info folder " + this.base_info.folder);
	//alert("FolderGroup 3000");
	this.find_related_folders();
	//alert("FolderGroup 3300 - length " + this.related_folders.length);
	//alert("FolderGroup 4000");
	this.find_related_bases();
	//alert("FolderGroup 5000 - length " + this.related_folders.length);
	//var alert_text="";
	//for (folder=0; folder<this.related_folders.length; folder++) {
		//alert_text=alert_text + "\nFolder " + folder + " id " + this.related_folders[folder].related_folder_id;
	//}
	//alert("FolderGroup 6000 " + alert_text);

}
