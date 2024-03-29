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

	next_child_index=start_index;
	//if ( node_name != "" ) {
		//next_child_index=start_index;
		while ( ( next_child_index < max_child_index ) && ( children[next_child_index].nodeName != node_name ) ) {
			next_child_index=next_child_index + 1;
		}
	//} else {
		//next_child_index=start_index;
	//}

	//if ( next_child_index >= max_child_index ) {
		//next_child_index=-1;
	//}
	return next_child_index;

}

var extFilesAdded=""; //list of files already added
var extFilesCount=0; //Count of files still being loaded

function isIE() {
	return eval("/*@cc_on!@*/!1");
}

var debugFramework = { debugEnabled : false, debugMain : "debug-text", debugSecondary : "debug-text-2" };
// Display a message in a predefined div
// Note that for this to work the HTML for the text node must have been created elsewhere.
debugFramework.enableDebug = function () {
	var oldDebugState = debugFramework.debugEnabled;
	debugFramework.debugEnabled = true;
	return oldDebugState;
}

debugFramework.disableDebug = function () {
	var oldDebugState = debugFramework.debugEnabled;
	debugFramework.debugEnabled = false;
	return oldDebugState;
}

debugFramework.restoreDebug = function (oldDebugState) {
	debugFramework.debugEnabled = oldDebugState;
}

debugFramework.isDebugEnabled = function () {
	return debugFramework.debugEnabled;
}

debugFramework.showMessage = function (message, append) {
	if ( debugFramework.isDebugEnabled() ) {
		//alert("throttle 1");
		var log_element = document.getElementById(debugFramework.debugMain);
		var pre_message;
		if ( typeof append === 'undefined' ) {
			pre_message = '';
		} else {
			if (isIE()) {
				pre_message = log_element.innerText + ':';
			} else {
				pre_message = log_element.textContent + ':';
			}
			//pre_message = typeof append + ':';
		}
		if (isIE()) {
			log_element.innerText=pre_message + message;
		} else {
			log_element.textContent=pre_message + message;
		}
	}
}

// Display a message in a predefined div
// Note that for this to work the HTML for the text node must have been created elsewhere.
debugFramework.showMessage2 = function (message, append) {
	if ( debugFramework.isDebugEnabled() ) {
		//alert("throttle 1");
		var log_element = document.getElementById(debugFramework.debugSecondary);
		var pre_message;
		if ( typeof append === 'undefined' ) {
			pre_message = '';
		} else {
			if (isIE()) {
				pre_message = log_element.innerText + ':';
			} else {
				pre_message = log_element.textContent + ':';
			}
			//pre_message = typeof append + ':';
		}
		if (isIE()) {
			log_element.innerText=pre_message + message;
		} else {
			log_element.textContent=pre_message + message;
		}
	}
}

function waitForExtFiles(){
	var loopUntilZero = function() {
		if ( extFilesCount > 0 ) {
			setTimeout(loopUntilZero, 1000);
		}
	}
	//setTimeout(loopUntilZero, 1000);
	loopUntilZero();

}


function runWhenReady(readyfn, asyncElement){

	if (isIE()) {
		asyncElement.onreadystatechange = function () {
			if (this.readyState === 'loaded' || this.readyState === 'complete' ) {
				readyfn();
			}
		}
	} else {
		asyncElement.onload = function() {
			readyfn();
		}
	};

}

function loadJsFile(filename){
	if (extFilesAdded.indexOf("["+filename+"]") == -1) {
		var jsElement=document.createElement('script');
		jsElement.setAttribute("type","text/javascript");
		jsElement.setAttribute("src", filename);
		if (typeof jsElement !== "undefined") {
			extFilesCount++;
			runWhenReady(function(){extFilesCount--;}
				, jsElement);
			if (typeof debug_text !== "undefined") {
				debug_text.nodeValue=toString(extFilesCount);
			}
			document.getElementsByTagName("head")[0].appendChild(jsElement);
		}
		extFilesAdded+="["+filename+"]"; //List of files added in the form "[filename1],[filename2],etc"
	}
}


function loadAndRun(readyCallback) {
	var firstScriptElement = document.getElementsByTagName('script')[0]; 
	var scriptElement = document.createElement('script');
	scriptElement.type = 'text/javascript';
	scriptElement.async = false;
	scriptElement.src = scriptUrl;

	var ieLoadBugFix = function (scriptElement, callback) {
		if ( scriptElement.readyState == 'loaded' || scriptElement.readyState == 'complete' ) {
			callback();
		} else {
			setTimeout(function() { ieLoadBugFix(scriptElement, callback); }, 100);
		}
	}

	if ( typeof readyCallback === "function" ) {
		if ( typeof scriptElement.addEventListener !== "undefined" ) {
			scriptElement.addEventListener("load", readyCallback, false)
		} else {
			scriptElement.onreadystatechange = function(){
				scriptElement.onreadystatechange = null;
				ieLoadBugFix(scriptElement, readyCallback);
			}
		}
	}
	firstScriptElement.parentNode.insertBefore(scriptElement, firstScriptElement);
}


function loadCssFile(filename){
	if (extFilesAdded.indexOf("["+filename+"]") == -1) {
		var cssElement=document.createElement("link");
		cssElement.setAttribute("rel", "stylesheet");
		cssElement.setAttribute("type", "text/css");
		cssElement.setAttribute("href", filename);
		if (typeof cssElement !== "undefined") {
			extFilesCount++;
			runWhenReady(function(){extFilesCount--;}
				, cssElement);
			document.getElementsByTagName("head")[0].appendChild(cssElement);
		}
		extFilesAdded+="["+filename+"]"; //List of files added in the form "[filename1],[filename2],etc"
	}
}

// * Example usage *
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

//Helper methods for handling styles and stylesheets, bundled as a class
//The methods will all be static so don't use prototype as we will never instantiate a class
function nooStyles () {};

//Still indent the static methods as though they are defined inside class
	nooStyles.getSheets = function () {
		var all_sheets = new Array();
		for (var sheet_index=0; sheet_index<document.styleSheets.length; sheet_index++) {
			var sheet = document.styleSheets[sheet_index];
			var sheet_desc = sheet.href + '::' + sheet.title;
			all_sheets.push(sheet_desc);
		}
		return all_sheets;
	}

	nooStyles.getUniqueSheet = function (unique_title) {
		for (var sheet_index=0; sheet_index<document.styleSheets.length; sheet_index++) {
			var sheet = document.styleSheets[sheet_index];
			if (sheet.title == unique_title) {
				return sheet;
			}
		}
	}

	nooStyles.getSheetDescs = function () {
		var all_sheets = new Array();
		for (var sheet_index=0; sheet_index<document.styleSheets.length; sheet_index++) {
			var sheet = document.styleSheets[sheet_index];
			var sheet_desc = sheet.href + '::' + sheet.title;
			all_sheets.push(sheet_desc);
		}
		return all_sheets;
	}

	nooStyles.getInlineSheets = function () {
		var inline_sheets = new Array();
		for (var sheet_index=0; sheet_index<document.styleSheets.length; sheet_index++) {
			var sheet = document.styleSheets[sheet_index];
			if ( sheet.href === null ) {
				var sheet_desc = sheet_index;
				inline_sheets.push(sheet_desc);
			}
		}
		return inline_sheets;
	}

	nooStyles.getCrossProperty = function (property) {
		var cross_property;
		if ( ( property === 'rules' ) || ( property === 'cssRules') ) {
			cross_property = document.styleSheets[0].rules ? 'rules' : 'cssRules';
		} else if ( ( property === 'addRule' ) || ( property === 'insertRule') ) {
			cross_property = document.styleSheets[0].addRule ? 'addRule' : 'insertRule';
		} else if ( ( property === 'removeRule' ) || ( property === 'deleteRule') ) {
			cross_property = document.styleSheets[0].removeRule ? 'removedRule' : 'deleteRule';
		}
		
		return cross_property;
	}

	nooStyles.getMatchingRules = function (rule_condition) {
		var matching_rules = new Array();
		for (var sheet_index=0; sheet_index<sheet_index<document.styleSheets.length; sheet_index++) {
			//var sheet = document.styleSheets[sheet_index];
			var sheet_rules = document.styleSheets[sheet_index][nooStyles.getCrossProperty('rules')];
			for (var rule=0;rule<sheet_rules.length;rule++) {
				if ( sheet_rules[rule].selectorText === rule_condition ) {
					matching_rules.push([sheet_index, rule]);
				}
			}
		}
		return matching_rules;
	}

	nooStyles.getMatchingInlineRules = function (rule_condition) {
		var matching_rules = new Array();
		var inline_sheets = nooStyles.getInlineSheets();
		for (var sheet_index=0; sheet_index<inline_sheets.length; sheet_index++) {
			var inline_sheet = inline_sheets[sheet_index];
			var sheet_rules = document.styleSheets[inline_sheet][nooStyles.getCrossProperty('rules')];
			for (var rule=0;rule<sheet_rules.length;rule++) {
				if ( sheet_rules[rule].selectorText === rule_condition ) {
					matching_rules.push([inline_sheet, rule]);
				}
			}
		}
		return matching_rules;
	}

	nooStyles.getRuleValue = function (sheet, rule, attribute) {
		var rule_values;
		var sheet_rules = document.styleSheets[sheet][nooStyles.getCrossProperty('rules')];
		if (sheet_rules[rule].style[attribute]) {
			rule_values.push([sheet, rule, sheet_rules[rule].style[attribute]]);
		//} else {
			//matching_rules.push([sheet, rule, null]);
		}
		return rule_values;
	}

	nooStyles.changeRuleValue = function (sheet, rule, attribute, value) {
		var rules_changed = 0;
		var sheet_rules = document.styleSheets[sheet][nooStyles.getCrossProperty('rules')];
		if (sheet_rules[rule].style[attribute]) {
			sheet_rules[rule].style[attribute] = value;
			rules_changed++;
		}
		return rules_changed;
	}

	nooStyles.setRuleValue = function (sheet, rule, attribute, value) {
		var rules_changed = 0;
		var sheet_rules = document.styleSheets[sheet][nooStyles.getCrossProperty('rules')];
		sheet_rules[rule].style[attribute] = value;
		rules_changed++;
		return rules_changed;
	}

	nooStyles.setInlineRules = function (rule_condition, attribute, value) {
		var rules_changed = 0;
		var matched_rules = nooStyles.getMatchingInlineRules (rule_condition);
		for (var matched_rule=0; matched_rule < matched_rules.length; matched_rule++) {
			var sheet = matched_rules[matched_rule][0];
			var rule = matched_rules[matched_rule][1];
			nooStyles.setRuleValue(sheet, rule, attribute, value);
			rules_changed++;
		}
		return rules_changed;
	}
