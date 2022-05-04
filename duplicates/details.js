var details;
var image_alt;


function details_window(image_file) {
	this.image_file = image_file;
	this.grouped_duplicates = new Array();
}


function getDuplicatesFromDOM(group_id) {
// Get the list of duplicates in a group from the DOM

	//alert("Getting duplicates");
	var duplicates_div=details.document.getElementById("duplicates");
	for (childNode_index=duplicates_div.childNodes.length - 1; childNode_index>=0; childNode_index--) {
		duplicates_div.removeChild(duplicates_div.childNodes[childNode_index]);
	}
	//alert("Removed old duplicates");
	var ordered_list=details.document.createElement('ol');
	//alert("Getting list of duplicate files");
	var duplicates_group=document.getElementById('group'+group_id);
	var image=duplicates_group.getElementsByTagName('img')[0];
	var files_list=duplicates_group.getElementsByTagName('li');
	//alert("Got list of " + files_list.length + " duplicate files");
	for (file_index=0; file_index<files_list.length; file_index++) {
		var file=files_list[file_index];
		var name_span=file.getElementsByClassName("duplicate_file_name")[0];
		var file_name = getTextContent(name_span);
		var file_checkbox=file.getElementsByTagName('input');
		var detail_file=details.document.createElement('li');
		var deleted = file_checkbox.checked;
		//alert("Checking for deleted in index " + response_index);
		if (deleted) {
			detail_file.className = "remove_file";
		} else {
			detail_file.className = "keep_file";
		}
		var file_element=details.document.createTextNode(file_name);
		detail_file.appendChild(file_element);
		ordered_list.appendChild(detail_file);
	}
	duplicates_div.appendChild(ordered_list);
	//alert(xmlhttp.responseText);
	//alert("looking for duplicates node");
	//var duplicates_node=xmlhttp.responseXML.getElementsByTagName('duplicates');
	var image_alt=image.alt;
	resizeDetailImage(image_alt);
	//var image_dimensions=image.alt.substr("Image".length);
	//var dimensions_split=image_dimensions.indexOf("x");
	//var image_height=parseInt( image_dimensions.substr(0, dimensions_split) );
	//var image_width=parseInt(image_dimensions.substr(dimensions_split + 1) );
	
	//alert("fit detail width " + image_width + " height " + image_height);
	//fitDetailImage(image_width, image_height);
	//alert("got duplicates node");
	//alert("Calling ajax for duplicates");
	//var xml_file_elements = document.getElementsByName('xml_file');
	//var xml_file = xml_file_elements[0].value;
	//createAJAXGETRequest(get_ajax_target(), "action=duplicates&xml_file=" + xml_file + "&target=" + group_id, on_state_change);
}

function fitDetailImage(image_width, image_height) {
// resize the image in the detail window to fit the remaining space

	//alert("resize 1a");
	var text_div=details.document.getElementById("text_div");
	//if (text_div) {
	//	alert("resize 1b");
	//}
	var image_div=details.document.getElementById("image_div");
	//if (image_div) {
	//	alert("resize 1d");
	//}
	var detail_image=details.document.getElementById("detail_image");
	//if ( detail_image ) {
	//	alert("resize 2a");
	//} else {
	//	alert("resize 2b");
	//}
	var browser_height=details.window.innerHeight;
	var browser_width=details.window.innerWidth;
	//alert("resize 4 browser width " + browser_width + " height " + browser_height);
	//var div_height=text_div.clientHeight;
	//var div_width=text_div.clientWidth;
	var div_height=text_div.offsetHeight;
	var div_width=text_div.offsetWidth;
	//alert("resize 5 div width " + div_width + " height " + div_height);
	var image_div_top=image_div.offsetTop;
	//alert("resize 5c image div top " + image_div_top);
	var max_height=browser_height - ( image_div_top ); // Available space starts at top of image_div
	var max_width=browser_width;
	//alert("resize 6 max width " + max_width + " height " + max_height);
	//alert("resize 7 offset width " + image_offset_width + " height " + image_offset_height);
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
	//details.document.write("<img id='detail_image' src='" + image_src + "' alt='" + image_alt + "'/>");
	//alert(xmlhttp.responseText);
}


function show_details_by_duplicate(image_dir, image_file, group_id) {

	var value_delimiter = get_checkbox_delimiter();
	//alert("Image file is " + image_file);

	//alert("Group id " + group_id);
	if ( ! details || details.closed) {
		details = window.open ("", "details", "dependent, scrollable");
	}

	//var details_div=details.document.getElementsByTagName("div");
	var details_div=details.document.getElementsByTagName("div");
	//alert("Length " + details_div.length);
	if ( details_div.length > 0 ) {
		//alert("Removing div");
		details_div[0].parentNode.removeChild(details_div[0]);
		//details_div[0].parentNode.removeChild(details_div[0]);
		//alert("Removed div x2");
	} else {
		details.document.write('<link rel=stylesheet type="text/css" href="duplicates.css" title="detail_css">');
		//alert("link to css");
	}

	details.document.write("<div>");
	details.document.write("<div id='text_div'>");
	details.document.write("<h1>Details</h1>");

	//alert("place for duplicates");
	details.document.write("<div id=\"duplicates\">");

	details.document.write("<ol>");
	details.document.write("</ol>");
	details.document.write("</div>");
	details.document.write("</div>");

	//alert("show image");
	details.document.write("<div id=\"image_div\">");
	// Display the image here
	image_alt=image_dir + "/" + image_file;
	//alert("image_alt is " + image_alt);
	image_src=translate_path(image_alt);
	//alert("image_src is " + image_src);
	//getImageInfo(image_alt);
	//details.document.write("<h4>AJAX image info</h4>");
	details.document.write("<img id='detail_image' src='" + image_src + "' alt='" + image_alt + "' width=\"10\" height=\"10\"/>");
	//alert(image_src + ":" + image_alt);

	details.document.write("</div>");

	details.document.write("</div>");

	//alert("dup Group id " + group_id);
	getDuplicatesFromDOM(group_id);
	//alert("got duplicates returned ");

	var throttle_resize = throttle(resizeDetailImage2,200);
	//details.window.onresize=function(){throttle(resizeDetailImage,100);};
	details.window.onresize=throttle_resize;
	//getImageInfo(image_alt);
	resizeDetailImage2();
	details.focus("");

	return true;

}


function show_details_by_file(folder, file, folder_id) {

	var value_delimiter = get_checkbox_delimiter();
	//alert("Image id is " + image_id);

	// Display the image here
	image_src=translate_path(folder + "/" + file);
	image_alt=folder + "/" + file;

	//alert("Group id is " + group_id);
	//var details = window.open ("", "details", "dependent, scrollable");
	if ( ! details || details.closed) {
		details = window.open ("", "details", "dependent, scrollable");
	}
	var details_div=details.document.getElementsByTagName("div");
	//alert("Length " + details_div.length);
	if ( details_div.length > 0 ) {
		details_div[0].parentNode.removeChild(details_div[0]);
		//alert("Removed div");
	}
	details.document.write('<link rel=stylesheet type="text/css" href="duplicates.css" title="detail_css">');
	details.document.write("<div>");
	details.document.write("<div id='text_div'>");
	details.document.write("<h1>Details</h1>");

	var folder_element=document.getElementById(folder_id);
	details.document.write("<div>");
	var this_span_index=getNextChildIndex(folder_element, 0, "SPAN");
	var this_span=folder_element.childNodes[this_span_index];
	//details.document.write(this_span.childNodes[0].data + "/" + file);
	details.document.write(image_alt);
	details.document.write("<br/>");

	//details.document.write(this_span.childNodes[0].data);
	//details.document.write("<br/>");

	details.document.write("<br/>");

	details.document.write("</div>");

	// End of text div
	details.document.write("</div>");

	var throttle_resize = throttle(resizeDetailImage2,200);
	//details.window.onresize=function(){throttle(resizeDetailImage,100);};
	details.window.onresize=throttle_resize;

	//details.document.write("<h4>AJAX image info</h4>");

	//var browser_height=window.inner_height;
	//var browser_width=window.inner_width;

	details.document.write("<div id='image_div'>");
	details.document.write("<img id='detail_image' width='10' height='10' src='" + image_src + "' alt='" + image_alt + "'/>");
	details.document.write("</div>");
	//details.document.write("<img src='" + image_src + "' alt='" + image_alt + "' width=1 height=1/>");
	//alert(image_src + ":" + image_alt);

	details.document.write("</div>");

	//throttle(resizeDetailImage,100);
	resizeDetailImage2();
	details.focus("");

	return true;

}
