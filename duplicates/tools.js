var extfilesadded="" //list of files already added
 
function loadjsfile(filename){
	if (extfilesadded.indexOf("["+filename+"]") == -1) {
		var fileref=document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);
		if (typeof fileref!="undefined") {
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
		extfilesadded+="["+filename+"]"; //List of files added in the form "[filename1],[filename2],etc"
	}
}

function loadcssfile(filename){
	if (extfilesadded.indexOf("["+filename+"]") == -1) {
		var fileref=document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
		if (typeof fileref!="undefined") {
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
		extfilesadded+="["+filename+"]"; //List of files added in the form "[filename1],[filename2],etc"
	}
}

function isIE() {
	return eval("/*@cc_on!@*/!1");
}

//Fudge get and set textContent functions to cater for old IE limitations.
function setTextContent(element, text) {
	if (isIE()) {
		element.innerText=text;
	} else {
		element.textContent=text;
	}
}

function getTextContent(element) {
	if (isIE()) {
		return element.innerText;
	} else {
		return element.textContent;
	}
}

function addEvent(element, eventType, eventFunction, useCapture)
{
	// Add an event to an element : cross-browser
	if (element === undefined) {
		alert("Cannot add event with no element specified");
	} else if (element.addEventListener){
		element.addEventListener(eventType, eventFunction, useCapture);
		return true;
	} else if (element.attachEvent){
		element.attachEvent("on"+eventType, function () {eventFunction.call(element, window.event)});
	} else {
		alert("Handler could not be added");
	}
}

function removeEvent(element, eventType, eventFunction, useCapture)
{
	// Remove an event to an element : cross-browser
	if (element.removeEventListener){
		element.removeEventListener(eventType, eventFunction, useCapture);
		return true;
	} else if (element.detachEvent){
		var r = element.detachEvent("on"+eventType, eventFunction);
		return r;
	} else {
		alert("Handler could not be removed");
	}
}


function remove_children(main_element) {
	if ( ( main_element ) ) {
		for (var child_index=main_element.childNodes.length-1; child_index>=0; child_index--) {
			remove_children(main_element.childNodes[child_index]);
			main_element.removeChild(main_element.childNodes[child_index]);
		}
	}
}

// Set the current option in a select box using its value rather than an index.
// Parameters
// selectBox: This is the select box for which an option must be selected
// value: This is the value which needs to be selected from the options of selectBox.
function selectItemByValue(selectBox, value){

	for (var option=0; option < selectBox.options.length; option++)
	{
		if (selectBox.options[option].value == value) {
			selectBox.selectedIndex = option;
			break;
		}
	}
}

// This function allows creation of "multi-dimensional" arrays
// and uses an effective base 1 instead of 0
// e.g. createArray (10,20) will create an array of 10 21-element arrays
//	and one empty element because Javascript arrays are zero-based.
//      However, the zero element will be empty and therefore take no space.
//	So arrays can be indexed like [1][2] or [10,20].
function createArray(arrayEnd) {
	//var arr = new Array(arrayEnd || 0),
	//	i = arrayEnd;
	var arraySize = arrayEnd + 1;
	//make_debug("Make array length " + arraySize);
	var arr = new Array(arraySize || 0);

	if (arguments.length > 1) {
		//make_debug("Make arrays");
		var args = Array.prototype.slice.call(arguments, 1);
		var eachArray = 0;
		while (eachArray++ < arrayEnd) {
			//make_debug("Make inner array " + eachArray);
			arr[eachArray] = createArray.apply(this, args);
		}
	}

	return arr;
}


//loadjsfile("myscript.js") //dynamically load and add this .js file
//loadjsfile("javascript.php") //dynamically load "javascript.php" as a JavaScript file
//loadcssfile("mystyle.css") ////dynamically load and add this .css file

function throttle(fn, delay) {
	var timer = null;
	//alert("throttle 1");
	return function () {
		var context = this, args = arguments;
		//alert("throttle 2");
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, args);
		}, delay);
	};
}


function getNextSibling(parent_node, start_index, node_name) {
	//alert("Folder id " + folder_id);
	var children=parent_node.childNodes;
	var max_child_index = children.length;
	var next_child_index=-1;
	if ( ( max_child_index == 0 ) || ( start_index >= max_child_index ) ) {
		return -1;
	} else {
		next_child_index=start_index + 1;
		if ( node_name == "" ) {
			next_child=children[next_child_index];
		} else {
			while ( ( next_child_index < max_child_index ) && ( children[next_child_index].nodeName != node_name ) ) {
				next_child_index=next_child_index + 1;
			}
			if ( next_child_index < max_child_index ) {
				next_child=children[next_child_index];
			} else {
				next_child_index=-1;
			}
		}
		return next_child_index;
	}

}


function getNextChildIndex(parent_node, start_index, node_name) {
	//alert("Folder id " + folder_id);
	var children=parent_node.childNodes;
	var max_child_index = children.length;
	var next_child_index;

	if ( node_name != "" ) {
		next_child_index=start_index - 1;
		do
		{
			next_child_index=next_child_index + 1;
		}
		while ( ( next_child_index < max_child_index ) && ( children[next_child_index].nodeName != node_name ) );
	} else {
		next_child_index=start_index;
	}

	//if ( next_child_index >= max_child_index ) {
		//next_child_index=-1;
	//}
	return next_child_index;

}

	// Repair deficiencies in old IE
	if (! document.getElementsByClassName) { // use native implementation if available
		//alert("Non-native implementation");
		document.getElementsByClassName = function (classname){ return document.querySelectorAll('.' + classname); }
		Element.prototype.getElementsByClassName = function (classname){ return this.querySelectorAll('.' + classname); }
	}

	if (! String.prototype.trim ) { // use native implementation if available
		String.prototype.trim = function (){ return this.replace(/^\s+|\s+$/gm,''); }
	}
