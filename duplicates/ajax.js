//var ajax_target_file = "duplicates_ajax.php";

function get_ajax_target() {
	return "duplicates_ajax.php";
}


function createAJAXGETRequest(server_page, request_parameters, callback) {
// Make AJAX call to set session variable

	var requestURL=server_page + "?" + request_parameters;
	makeAJAXRequest(requestURL, callback, null);
}


function createAJAXPOSTRequest(server_page, request_parameters, callback) {
// Make AJAX call to set session variable

	var requestURL=server_page;
	makeAJAXRequest(requestURL, callback, request_parameters);
}


var XMLHttpFactories = [
	function () {return new XMLHttpRequest()},
	function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	function () {return new ActiveXObject("Microsoft.XMLHTTP")}
	];

function createXMLHTTPObject() {
	var xmlhttp = null;
	for (var factory=0;factory<XMLHttpFactories.length;factory++) {
		try {
			xmlhttp = XMLHttpFactories[factory]();
		}
		catch (e) {
			continue;
		}
		//alert('createXMLHTTPObject 8000 factory ' + factory);
		break;
	}
	return xmlhttp;
}

function makeAJAXRequest(requestString, callback, postData) {
	var AJAXrequest = createXMLHTTPObject();
	//alert('makeAJAXrequest 2000 ' + typeof AJAXrequest);
	if ( AJAXrequest === null ) 
		return;
	var method = (postData !== null) ? "POST" : "GET";
	AJAXrequest.onreadystatechange = function () {
		//alert('makeAJAXRequest 4000 readyState ' + AJAXrequest.readyState);
		if (AJAXrequest.readyState == 4) {
			if ( (AJAXrequest.status == 200 ) || ( AJAXrequest.status == 304 ) ) {
				//alert('makeAJAXRequest 5000 response ' + AJAXrequest.responseText);
				callback(AJAXrequest);
				return;
			}
		}
	}
	AJAXrequest.open(method, requestString, true);
	AJAXrequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	if (postData !== null) {
		//alert('makeAJAXrequest 4000 ');
		AJAXrequest.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	}

	if (AJAXrequest.readyState == 4) 
		return;
	//alert('makeAJAXrequest 9000 method ' + method + " : data " + postData);
	AJAXrequest.send(postData);
}

function changeFileAJAX(file_name, removeFile) {
// Make AJAX call to set session variable to remove/keep file
	on_state_change=function(xmlhttp) {
		//alert("indirect function called");
		if ( file_name !== xmlhttp.responseText.trim() ) {
			alert( file_name + " is " + (removeFile)?"not":"still" + " to be deleted" );
		}
	}
	if ( removeFile ) {
		createAJAXGETRequest(get_ajax_target(), "action=delfile&target=" + file_name, on_state_change);
	} else {
		createAJAXGETRequest(get_ajax_target(), "action=keepfile&target=" + file_name, on_state_change);
	}
}


function changeFolderAJAX(folder_name, removeFolder) {
// Make AJAX call to set session variable to remove folder

	on_state_change=function(xmlhttp) {
		//alert("indirect function called");
		alert(xmlhttp.responseText);
	}
	if ( removeFolder ) {
		createAJAXGETRequest(get_ajax_target(), "action=delfolder&target=" + folder_name, on_state_change);
	} else {
		createAJAXGETRequest(get_ajax_target(), "action=keepfolder&target=" + folder_name, on_state_change);
	}
}


function clearSessionAJAX(filename) {
// Make AJAX call to clear session variables then set chosen xml file

	on_state_change=function(xmlhttp) {
		//alert("indirect function called");
		//alert(xmlhttp.responseText);
		document.forms["f_duplicates"].submit();
	}
	createAJAXGETRequest(get_ajax_target(), "action=clearsession&target=" + filename, on_state_change);
}


function getImageInfo(image_name) {
// Make AJAX call to get size etc of image

	on_state_change=function(xmlhttp) {
		//alert("indirect function called");
		alert(xmlhttp.responseText);
	}
	createAJAXGETRequest(get_ajax_target(), "action=imageinfo&target=" + image_name, on_state_change);
}


function setChosenFile(xml_file) {
// Make AJAX call to get size etc of image

	on_state_change=function(xmlhttp) {
		//alert("indirect function called");
		//document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
		alert(xmlhttp.responseText);
	}
	createAJAXGETRequest(get_ajax_target(), "action=setchosenfile&target=" + xml_file, on_state_change);
}


function getDuplicatesFromAJAX(group_id) {
// Make AJAX call to get the list of duplicates in a group

	on_state_change=function(xmlhttp) {
		//alert("indirect function called");
		//alert("Getting duplicates");
		//document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
		//for (response_index=0; response_index<xmlhttp.responseXML.length; response_index++) {
		//	alert(xmlhttp.responseXML[response_index]);
		//}
		//alert("Got duplicates");
		var duplicates_div=details.document.getElementById("duplicates");
		for (childNode_index=duplicates_div.childNodes.length - 1; childNode_index>=0; childNode_index--) {
			duplicates_div.removeChild(duplicates_div.childNodes[childNode_index]);
		}
		//alert("Removed old duplicates");
		var unordered_list=details.document.createElement('ul');
		//alert("Getting list of duplicate files");
		var files_list=xmlhttp.responseXML.getElementsByTagName('file');
		//alert("Got list of " + files_list.length + " duplicate files");
		for (response_index=0; response_index<files_list.length; response_index++) {
			var list_element=details.document.createElement('li');
			var deleted = files_list[response_index].getAttribute("deleted");
			//alert("Checking for deleted in index " + response_index);
			if (deleted) {
				list_element.className = "remove_file";
			} else {
				list_element.className = "keep_file";
			}
			unordered_list.appendChild(list_element);
			var file_element=details.document.createTextNode(files_list[response_index].childNodes[0].data);
			list_element.appendChild(file_element);
		}
		duplicates_div.appendChild(unordered_list);
		//alert(xmlhttp.responseText);
		//alert("looking for duplicates node");
		var duplicates_node=xmlhttp.responseXML.getElementsByTagName('duplicates');
		var image_width=duplicates_node[0].getAttribute("image_width");
		var image_height=duplicates_node[0].getAttribute("image_height");
		
		fitDetailImage(image_width, image_height);
		//alert("got duplicates node");
	}
	//alert("Calling ajax for duplicates");
	var xml_file_elements = document.getElementsByName('xml_file');
	var xml_file = xml_file_elements[0].value;
	createAJAXGETRequest(get_ajax_target(), "action=duplicates&xml_file=" + xml_file + "&target=" + group_id, on_state_change);
}

function write_deletions(file_deletions, folder_deletions) {
	var deletions = window.open ("", "deletions", "dependent, scrollable");

	//alert("write_deletions 1000");
	var deletions_div=deletions.document.getElementsByTagName("div");
	//alert("Length " + deletions_div.length);
	if ( deletions_div.length > 0 ) {
		deletions_div[0].parentNode.removeChild(deletions_div[0]);
		//alert("Removed div");
	}
	//alert("write_deletions 2000");
	deletions.document.write('<link rel=stylesheet type="text/css" href="duplicates.css" title="deletions_css">');
	deletions.document.write("<div>");
	deletions.document.write("<h1>Deletions</h1>");

	//deletions.document.write("<table>");

	//var prev_group="0";
	//var group_size=0;
	//var group_count=0;

	//alert("write_deletions 3000");
	var last_index=file_deletions.length;
	if ( last_index > 0 ) {
		deletions.document.write("<div id=file_deletions>");
		deletions.document.write("<h2>File deletions</h2>");
		//for (i = document.getElementsByName('delfile[]').length - 1; i >= 0; i--) {
		//alert("write_deletions 4000 - last index " + last_index);
		for (file_index = 0; file_index<last_index; file_index++) {
			//deletions.document.write("checking " + i + "<br/>");
			var file_name=file_deletions[file_index].getAttribute("filename");
			deletions.document.write("rm " + file_name + "<br/>");
		}

		deletions.document.write("</div>");
	} else {
		deletions.document.write("<h2>No file deletions</h2>");
	}

	deletions.document.write("<br/>");

	//alert("write_deletions 6000");
	var last_index=folder_deletions.length;
	if ( last_index > 0 ) {
		deletions.document.write("<div id=folder_deletions>");
		deletions.document.write("<h2>Folder deletions</h2>");

		//for (i = document.getElementsByName('delfile[]').length - 1; i >= 0; i--) {
		//alert("write_deletions 7000 - last index " + last_index);
		for (folder_index = 0; folder_index<last_index; folder_index++) {
			//deletions.document.write("checking " + i + "<br/>");
			var folder_name=folder_deletions[folder_index].getAttribute("folder");
			deletions.document.write("rm    " + folder_name + "/*<br/>");
			deletions.document.write("rmdir " + folder_name + "<br/>");
		}

		deletions.document.write("</div>");
	} else {
		deletions.document.write("<h2>No folder deletions</h2>");
	}

	deletions.document.write("</div>");

	deletions.focus();

	return true;

}

function get_deletions() {
// Get the deletions from the session variables

	on_state_change=function(xmlhttp) {
		//alert("indirect function called");
		//alert("getting deletions response");
		var tmpXML=xmlhttp.responseXML.length;
		//alert("response length " + tmpXML);
		var file_deletions=xmlhttp.responseXML.getElementsByTagName('deleted_file');
		//alert(file_deletions + " file deletions in response");
		//alert("getting resize attributes");
		//alert("calling fitDetailImage width " + image_width + " height " + image_height);
		var folder_deletions=xmlhttp.responseXML.getElementsByTagName('deleted_folder');
		//alert("getting resize attributes");
		//alert("calling fitDetailImage width " + image_width + " height " + image_height);
		write_deletions(file_deletions, folder_deletions);
	}
	//alert("resize2 called");
	createAJAXGETRequest(get_ajax_target(), "action=deletions&target=", on_state_change);
}


function resizeDetailImage2() {
// Make AJAX call to resize the image in the detail window

	on_state_change=function(xmlhttp) {
		//alert("indirect function called");
		//alert("getting resize response");
		//var resize_node=xmlhttp.responseXML.getElementsByTagName('resize');
		//alert("getting resize attributes");
		//var image_width=resize_node[0].getAttribute("image_width");
		//var image_height=resize_node[0].getAttribute("image_height");
		//var group_id=resize_node[0].getAttribute("group_id");
		//var group_id=resize_node[0].getAttribute("group_id");
		var delim_index =  xmlhttp.responseText.indexOf("x");
		var image_width = xmlhttp.responseText.substr(0, delim_index);
		var image_height = xmlhttp.responseText.substr(delim_index+1);
		//alert("calling fitDetailImage width " + image_width + " height " + image_height);
		fitDetailImage(image_width, image_height);
	}
	//alert("resize2 called");
	var image_element=details.document.getElementsByTagName('img')[0];
	var image_src=image_element.src;
	var image_alt=image_element.alt;
	//alert("resize2 called image source is "+image_alt);
	createAJAXGETRequest(get_ajax_target(), "action=imageinfo&target="+image_alt, on_state_change);
}


function resizeDetailImage(image_alt) {
// Make AJAX call to resize the image in the detail window

	on_state_change=function(xmlhttp) {
		//alert("indirect function called");
		var text_div=details.document.getElementById("text_div");
		//alert("resize 1b");
		var detail_image=details.document.getElementById("detail_image");
		var browser_height=details.window.innerHeight;
		var browser_width=details.window.innerWidth;
		//alert("resize 4 browser width " + browser_width + " height " + browser_height);
		var div_height=text_div.offsetHeight;
		var div_width=text_div.offsetWidth;
		//alert("resize 5 div width " + div_width + " height " + div_height);
		var max_height=browser_height - ( div_height + 10 ); // Adjust by 10 because the "real" value returned is too small
		var max_width=browser_width;
		//alert("resize 6 max width " + max_width + " height " + max_height);
		var delim_index =  xmlhttp.responseText.indexOf("x");
		var image_width = xmlhttp.responseText.substr(0, delim_index);
		var image_height = xmlhttp.responseText.substr(delim_index+1);
		//alert("resize 8 width " + image_width + " height " + image_height);
		if ( image_width > max_width ) {
			image_height = Math.floor( ( image_height * max_width ) / image_width);
			image_width = max_width;
		}
		if ( image_height > max_height ) {
			image_width = Math.floor( ( image_width * max_height ) / image_height);
			image_height = max_height;
		}
		
		//alert("resize 12");
		detail_image.setAttribute("width", "" + image_width);
		//alert("resize 12b width " + image_width + " height " + image_height);
		detail_image.setAttribute("height", "" + image_height);
		//alert("resize 14 width " + image_width + " height " + image_height);
	}
	//alert("resize detail image " + image_alt);
	createAJAXGETRequest(get_ajax_target(), "action=imageinfo&target=" + image_alt, on_state_change);
}
