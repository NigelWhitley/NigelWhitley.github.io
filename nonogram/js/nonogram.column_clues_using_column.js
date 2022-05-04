$(document).ready(function (){
    var solver_running = false;
    var solver_tick = 0;
    function is_editing() {
	return ($("#edit-action").length == 0);
    }
    
    function is_solving() {
	return (!is_editing() && ($("#solve-action").length == 0));
    }
    
    function get_clues(component_type, index) {
	$.getJSON(ajax_base+"test", {'action':'get_clues', 'component_type':component_type, 'index': index}, 
	    function (solution) {
		$('#debug-info').text(solution.component + ':' + solution.index + ':' + solution.action);
	    }
	);
    }
    
    function auto_solve() {
	$.getJSON(ajax_base+"test", {'action':'auto_solve'}, 
	    function (solution) {
		$('#debug-info').text(solution.component + ':' + solution.index + ':' + solution.action);
	    }
	);
    }

    function clue_solved(mode, index, clue_index, clue_start) {
	$.getJSON(ajax_base+"clue_solved", {'action':'clue_solved', 'mode': mode, 'index': index, 'clue': clue_index, 'start':clue_start}, 
	    function (solution) {
		$('#extra-info').text(solution.component + ':' + solution.index + ':' + solution.action);
		    $('.'+main_axis+solution.row+'.'+cross_axis+'column').removeClass('empty').removeClass('unsolved').adClass('filled');
	    }
	);
    }

    function fix_pixels(filled, empty) {
	$.getJSON(ajax_base+"fill_pixel", {'action':'fill_pixel', 'row': row, 'column': column}, 
	    function (solution) {
		$('#extra-info').text(solution.component + ':' + solution.index + ':' + solution.action);
		    $('.'+main_axis+solution.row+'.'+cross_axis+'column').removeClass('empty').removeClass('unsolved').adClass('filled');
	    }
	);
    }

    function fill_pixel(row, column) {
	$.getJSON(ajax_base+"fill_pixel", {'action':'fill_pixel', 'row': row, 'column': column}, 
	    function (solution) {
		$('#extra-info').text(solution.component + ':' + solution.index + ':' + solution.action);
		    $('.'+main_axis+solution.row+'.'+cross_axis+'column').removeClass('empty').removeClass('unsolved').adClass('filled');
	    }
	);
    }

    function empty_pixel(row, column) {
	$.getJSON(ajax_base+"empty_pixel", {'action':'empty_pixel', 'row': row, 'column': column}, 
	    function (solution) {
		$('#extra-info').text(solution.component + ':' + solution.index + ':' + solution.action);
	    }
	);
    }

    function cycle_pixel(row, column) {
	$.getJSON(ajax_base+"cycle_pixel", {'action':'cycle_pixel', 'row': row, 'column': column}, 
	    function (solution) {
		$('#extra-info').text(solution.old_state + ':' + solution.new_state + ' - row ' + row + ' column ' + column);
		//$('.row'+row+'.column'+column).removeClass('empty').removeClass('unsolved').addClass('filled');
		var clicked_cell = '.row'+row+'.column'+column;
		//console.debug(myClasses);
		if (solution.new_state == 'filled') {
		    $(clicked_cell).removeClass("empty-state").removeClass("unsolved-state").addClass("filled-state");
		    //alert("Clicked pixel with filled state");
		} else if (solution.new_state == 'empty') {
		    $(clicked_cell).removeClass("filled-state").removeClass("unsolved-state").addClass("empty-state");
		    //alert("Clicked pixel with empty state");
		} else if (solution.new_state == 'unsolved') {
		    $(clicked_cell).removeClass("filled-state").removeClass("empty-state").addClass("unsolved-state");
		    //alert("Clicked pixel with unsolved state");
		} else {
		    alert("Clicked pixel with no known state");
		}
	    }
	);
    }

    function range_solved(solution) {
	var solved_clues = "";
	var main_axis = solution.mode;
	if ( main_axis == 'row' ) {
	    var cross_axis = 'column';
	}else {
	    var cross_axis = 'row';
	}
	for (var clue_index=0; clue_index < solution.solved.length; clue_index++) {
	    var clue = solution.solved[clue_index];
	    //$this->clue_solved(solution.mode, solution.index, clue_index, clue.start);
	    $.getJSON(ajax_base+"clue_solved", {'mode':solution.mode, 'index':solution.index, 'clue_index': clue_index, 'start':clue.start}, 
		function (clue_solution) {
		    //console.debug(clue_solution);
		    if ( clue_solution.outcome == 'pixels_changed' ) {
			for (var pixel_index=0; pixel_index < clue_solution.fill.length; pixel_index++) {
			    $('.'+main_axis+clue_solution.index+'.'+cross_axis+clue_solution.fill[pixel_index]).removeClass('empty-state').removeClass('unsolved-state').addClass('filled-state');
			    //$('#extra-info').text(solution.outcome + ':' + main_axis+solution.index + ':' + cross_axis+solution.fill[pixel_index]);
			}
			for (var pixel_index=0; pixel_index < clue_solution.empty.length; pixel_index++) {
			    $('.'+main_axis+clue_solution.index+'.'+cross_axis+clue_solution.empty[pixel_index]).removeClass('filled-state').removeClass('unsolved-state').addClass('empty-state');
			    //$('#extra-info').text(solution.outcome + ':' + main_axis+solution.index + ':' + cross_axis+solution.empty[pixel_index]);
			}
			var clue_index1 = parseInt(clue_solution.clue_index) + 1;
			$('.line-clue.'+main_axis+clue_solution.index+'.clue'+clue_index1).removeClass('clue-unsolved').addClass('clue-solved');
			//$('#extra-info').text('.row-clue.'+main_axis+solution.index+'.clue'+clue_index1+'::'+clue_solution.clue_index);
		    } else {
			    $('#debug-info').text(clue_solution.outcome + ':' + clue_solution.index + ':' + clue_solution.mode+':'+clue_solution.length);
		    }
		}
	    );

	    //$('.'+main_axis+solution.index+'.'+cross_axis+solution.empty[pixel_index]).removeClass('filled-state').removeClass('unsolved-state').addClass('empty-state');
	    //$('#extra-info').text(solution.outcome + ':' + clue.start + ':' + clue.length);
	}
	//$('#extra-info').text(solution.outcome + ':' + solution.index + ':' + solution.mode+':'+solved_clues);
    }

    function range_changed(solution) {
	var solved_clues = "";
	var main_axis = solution.mode;
	if ( main_axis == 'row' ) {
	    var cross_axis = 'column';
	}else {
	    var cross_axis = 'row';
	}
	if ( solution.outcome == 'line_changed' ) {
		for (var pixel_index=0; pixel_index < solution.fill.length; pixel_index++) {
		    $('.'+main_axis+solution.index+'.'+cross_axis+solution.fill[pixel_index]).removeClass('empty-state').removeClass('unsolved-state').addClass('filled-state');
		    //$('#extra-info').text(solution.outcome + ':' + main_axis+solution.index + ':' + cross_axis+solution.fill[pixel_index]);
		}
		for (var pixel_index=0; pixel_index < solution.empty.length; pixel_index++) {
		    $('.'+main_axis+solution.index+'.'+cross_axis+solution.empty[pixel_index]).removeClass('filled-state').removeClass('unsolved-state').addClass('empty-state');
		    //$('#extra-info').text(solution.outcome + ':' + main_axis+solution.index + ':' + cross_axis+solution.empty[pixel_index]);
		}
		//$('.line-clue.'+main_axis+clue_solution.index+'.clue'+clue_index1).removeClass('clue-unsolved').addClass('clue-solved');
		$('#extra-info').text(main_axis+'::'+solution.index);
		console.debug(solution.solved);
		console.debug(Object.keys(solution.solved));
		//console.debug(solution);
		//for (var clue_index=0; clue_index < solution.solved.length; clue_index++) {
		var solved_clues = Object.keys(solution.solved);
		//foreach (var clue_index=0; clue_index < solution.solved.length; clue_index++) {
		for (var clue_index=0; clue_index < solved_clues.length; clue_index++) {
		    var clue_key = solved_clues[clue_index];
		    var clue_key1 = parseInt(clue_key) + 1;
		    var clue = solution.solved[clue_key];
		    //$this->clue_solved(solution.mode, solution.index, clue_index, clue.start);
		    $('.line-clue.'+main_axis+solution.index+'.clue'+clue_key1).removeClass('clue-unsolved').addClass('clue-solved');
		}

		//$('.'+main_axis+solution.index+'.'+cross_axis+solution.empty[pixel_index]).removeClass('filled-state').removeClass('unsolved-state').addClass('empty-state');
		//$('#extra-info').text(solution.outcome + ':' + clue.start + ':' + clue.length);
	} else {
		$('#debug-info').text(solution.outcome + ':' + solution.index + ':' + solution.mode+':'+solution.length);
	}

	//$('#extra-info').text(solution.outcome + ':' + solution.index + ':' + solution.mode+':'+solved_clues);
    }

    function auto_solver_tick() {
	solver_tick++;
	$('#debug-info').text('Solver tick is ' + solver_tick);
	$.getJSON(ajax_base+"next_solver_line", {}, 
	    function (lines) {
		//console.debug(lines);
		var prev_mode = lines.previous_line.mode;
		var prev_index = lines.previous_line.index;
		var next_mode = lines.next_line.mode;
		var next_index = lines.next_line.index;
		$('.line-total.'+prev_mode+prev_index).removeClass('line-solving');
		$('.line-total.'+next_mode+next_index).addClass('line-solving');
		//$('#extra-info').text('.'+next_mode+'-total.'+next_mode+next_index);
		$.getJSON(ajax_base+"next_solution", {'action':'auto_solve'}, 
		    function (solution) {
			if ( solution.outcome == 'range_solved' ) {
				range_solved(solution);
			} else if ( solution.outcome == 'line_changed' ) {
				range_changed(solution);
			} else if ( solution.outcome == 'already_solved' ) {
			    $('#debug-info').text(solution.outcome + ':' + solution.index + ':' + solution.mode);
			} else {
				$('#debug-info').text(solution.outcome + ':' + solution.index + ':' + solution.mode+':'+solution.length);
			}
			//$('#debug-info').text(solution.clues + ':' + solution.fixed + ':' + solution.min_clues+':'+solution.length);
		    }
		);
	    }
	);
    }

    function cyclePixelClicked(clicked_cell) {
	//var myClasses = this.classList;
	var all_cell_classes = clicked_cell.className;
	var cell_classes = clicked_cell.className.split(' ');
	var row_class_start = all_cell_classes.indexOf("row");
	var from_row_class = all_cell_classes.substr(row_class_start);
	var row_class_end = from_row_class.indexOf(" ");
	var row_number = from_row_class.substr("row".length, row_class_end - "row".length);
	var column_class_start = all_cell_classes.indexOf("column");
	var from_column_class = all_cell_classes.substr(column_class_start);
	var column_class_end = from_column_class.indexOf(" ");
	if (column_class_end == -1) {
	    var column_class_end = from_column_class.length;
	}
	var column_number = from_column_class.substr("column".length, column_class_end - "column".length);
	//alert("Clicked cell has classes " + all_cell_classes + " : rownum " + row_number + " : colnum " + column_number);
	cycle_pixel(row_number, column_number);
    }

    $('.puzzle-actiona').click(function(e){
	e.stopPropagation();
	if ( $(this).hasClass('md-trigger') ) {
	    modalActionClicked(this);
	} else {
	    var puzzle_action = $(this).attr('data-action');
	    if (puzzle_action === 'solve') {
		solveActionClicked(this);
	    } else if (puzzle_action === 'edit') {
		editActionClicked(this);
	    } else if (puzzle_action === 'clear') {
		clearActionClicked(this);
	    } else if (puzzle_action === 'undo') {
		undoActionClicked(this);
	    } else if (puzzle_action === 'cycle-pixel') {
		cyclePixelClicked(this);
	    } else {
		alert('Unknown puzzle action - '+ puzzle_action);
	    }
	}
    });

    
    function puzzleActionClick() {
	$('.puzzle-action').click(function(e){
	    puzzleActionClicked(e, this);
	});
    }

    
    function puzzleActionClicked(e, clickedobject) {
	e.stopPropagation();
	if ( $(clickedobject).hasClass('md-trigger') ) {
	    modalActionClicked(clickedobject);
	} else {
	    var puzzle_action = $(clickedobject).attr('data-action');
	    if (puzzle_action === 'solve') {
		solveActionClicked(clickedobject);
	    } else if (puzzle_action === 'edit') {
		editActionClicked(clickedobject);
	    } else if (puzzle_action === 'cancel-edit') {
		cancelEditActionClicked(clickedobject);
	    } else if (puzzle_action === 'clear') {
		clearActionClicked(clickedobject);
	    } else if (puzzle_action === 'undo') {
		undoActionClicked(clickedobject);
	    } else if (puzzle_action === 'cycle-pixel') {
		cyclePixelClicked(clickedobject);
	    } else {
		alert('Unknown puzzle action - '+ puzzle_action);
	    }
	}
    }
    
    
    puzzleActionClick();
    
    
    function solveActionClicked(actionElement) {
	if (solver_running) {
	    clearTimeout(solver_timer);
	    solver_running = false;
	    $('#debug-info').text('No auto solver');
	    $(actionElement).text('Solve');
	    $('.line-solving').removeClass('line-solving');
	} else {
	    //solver_timer = setTimeout(auto_solver_tick, 3000);
	    solver_timer = setInterval(auto_solver_tick, 1000);
	    solver_running = true;
	    $('#debug-info').text('Running auto solver');
	    $(actionElement).text('Stop');
	}
    };


    function undoActionClicked(actionElement) { alert("Undo"); };


    function clearActionClicked(actionElement) {
	var puzzle_name = $(actionElement).attr('data-puzzle-name');
	//alert("Clear puzzle " + puzzle_name);
	$.getJSON(ajax_base+"load_puzzle", {'action':'load', 'puzzle_name': puzzle_name}, 
	    function (load_result) {
		document.location = document.location;
	    }
	);
    };

    /* Adding the editing interface
     * ----------------------------
     * In edit mode we need to allow addition of clues as well as changing the values.
     * The initial page rendering stored a count of the number of clues in each column and row.
     * It also stored the highest number of clues for any column and for any row.
     * To add a clue we will show a '+' symbol in front of the clues for a row or column.
     * Each "+" must also have a click method attached. 
     * COLUMNS:
     * For columns, we need to add a row of column clue cells. 
     * For each column we do the following -
     * If there are the highest number of clues in the column then the plus will go in the new row.
     * Otherwise a new 'no-column-clue' will go there and we will change an existing "no-column-clue" to be the "+".
     * The "no-column-clue" cells added must have the relevant clue index assigned.
     * 
     * ROWS:
     * For rows, we need to add a clue cell in the clue section of each row. 
     * We also need to adjust the width of that section to cater for the new cell.
     * For each row we do the following -
     * If there are the highest number of clues in the row then the plus will go in the new cell.
     * Otherwise a new 'no-row-clue' will go there and we will change an existing "no-row-clue" to be the "+".
     * The "no-row-clue" cells added must have the relevant clue index assigned.
     */
    
    function addColumnClueSymbols(actionElement) {
	var column_clues = $(".column-clues .line-total");
	$('#debug-info').text(column_clues.length);
	//need to insert a new row into the clues area so we can show "+" symbols
	//start by copying a "known good" row of the right length - the totals row
	var clues_total_row = $(".column-clues-row.column-totals-row");
	//var new_clues_row = $(".column-clues-row.column-totals-row").clone();
	var new_clues_row = $(clues_total_row).clone();
	new_clues_row = $(new_clues_row).removeClass("column-totals-row");
	$(new_clues_row).find("li span").each( function(index, value) {
		var column_index=$(value).data('column');
		$(value).replaceWith("<span class='no-column-clue column"+column_index+"' data-column='"+column_index+"'>&nbsp;</span>");
	});
	var max_clue_index = parseInt($('#max-column-clues').val());
	var new_clue_index = max_clue_index+1;
	$(new_clues_row).attr('data-clue-index',new_clue_index).addClass("clue-index-"+new_clue_index);
	$(clues_total_row).after(new_clues_row);
	
	$.each(column_clues, function(index, value) {
		//var clues_count=column_total[0].get_attribute('count');
		//var clues_count=total_as_html.get_attribute('data-count');
		var clues_count=$(value).data('count');
		var clues_column=$(value).data('column');
		var add_clue_index = clues_count + 1;
		var selector = ".column-clues-row.clue-index-"+add_clue_index+" span.column"+clues_column;
		//console.log(index + ':' + clues_count + ':' + add_clue_index + ':' + selector);
		//Add a plus sign above the clue
		if (add_clue_index === new_clue_index) {
		    $(new_clues_row).find("span.column"+clues_column).replaceWith("<span class='add-column-clue column"+add_clue_index+"' data-column='"+add_clue_index+"'>+</span>");
		} else {
		    $(".column-clues-row.clue-index-"+add_clue_index+" span.column"+clues_column).replaceWith("<span class='add-column-clue column"+add_clue_index+"' data-column='"+add_clue_index+"'>+</span>");
		}
	});
    };


    function addRowClueSymbols(actionElement) {
	var puzzle_rows = $(".puzzle-row");
	var max_clue_index = parseInt($('#max-row-clues').val());
	var new_clue_index = max_clue_index+1;
	$(puzzle_rows).each( function(index, value) {
	    var row_total_span = $(value).find(".line-total");
	    var row_clue_count = $(row_total_span).data("count");
	    var row_number = $(row_total_span).data("row");
	    var row_clues = $(value).find(".row-clues");
	    console.log('row index ' + index + ':' + row_clue_count + ':' + new_clue_index + ':' + max_clue_index);
	    if (row_clue_count == max_clue_index) {
		$(row_clues).find("ul").prepend("<li><span class='add-row-clue clue-index-"+new_clue_index+"' data-clue-index='"+new_clue_index+"'>+</span></li>");
	    } else {
		$(row_clues).find("ul").prepend("<li><span class='no-row-clue clue-index-"+new_clue_index+"' data-clue-index='"+new_clue_index+"'>&nbsp</span></li>");
		var add_clue_index = row_clue_count + 1;
		$(row_clues).find("ul li span.clue-index-"+add_clue_index).replaceWith("<span class='add-row-clue clue-index-"+add_clue_index+"' data-clue-index='"+add_clue_index+"'>+</span>");
	    }
	    
	});
	var dynamic_styles = $("#dynamic-styles");
	//console.log('dynamic styles ');
	var clue_count_for_edit = max_clue_index + 2;
	var style_inner_html = makeDynamicStyle(clue_count_for_edit);
	//console.log(style_inner_html);
	$(dynamic_styles).html(style_inner_html);
    };


    /* Removing the editing interface
     * ------------------------------
     * We reverse the changes made when adding the interface.
     * Basically this means removing the extra "clue" cells (including the new cell row).
     * We need to remove the click method, convert "+" to "no clue" cells and set the clue-index on them.
     */
    
    function removeColumnClueSymbols(actionElement) {
	var column_clues = $(".column-clues .line-total");
	$('#debug-info').text(column_clues.length);
	//need to insert a new row into the clues area so we can show "+" symbols
	//start by copying a "known good" row of the right length - the totals row
	var max_clue_index = parseInt($('#max-column-clues').val());
	var new_clue_index = max_clue_index+1;
	var new_clues_row = $(".column-clues-row.clue-index-"+new_clue_index);
	new_clues_row.remove();
	var plus_cells = $(".add-column-clue");
	plus_cells.off();
	$.each(plus_cells, function(index, value) {
		var clue_index=$(value).data('clue-index');
		$(value).replaceWith("<span class='no-column-clue clue-index"+clue_index+"' data-clue-index='"+clue_index+"'>&nbsp;</span>");
	});
    };


    function removeRowClueSymbols(actionElement) {
	var puzzle_rows = $(".puzzle-row");
	var max_clue_index = parseInt($('#max-row-clues').val());
	var new_clue_index = max_clue_index+1;
	var new_clues = $(".puzzle-row .row-clues .clue-index-" + new_clue_index);
	new_clues.remove();
	var plus_cells = $(".add-row-clue");
	plus_cells.off();
	
	$.each(plus_cells, function(index, value) {
		var clue_index=$(value).data('clue-index');
		$(value).replaceWith("<span class='no-column-clue clue-index"+clue_index+"' data-clue-index='"+clue_index+"'>&nbsp;</span>");
	});
	var dynamic_styles = $("#dynamic-styles");
	//console.log('dynamic styles ');
	var clue_count_for_edit = max_clue_index + 1;
	var style_inner_html = makeDynamicStyle(clue_count_for_edit);
	//console.log(style_inner_html);
	$(dynamic_styles).html(style_inner_html);
    };


    function makeDynamicStyle(row_clue_count) {
	var style_inner_html = ".row-clues-heading { width: "+((row_clue_count*1.5)+1)+"em; border-width: 1px "+(row_clue_count)+"px; }";
	//console.log(style_inner_html);
	//$(dynamic_styles).replaceWith(style_html);
	return style_inner_html;
    };


    function editActionClicked(actionElement) {
	var puzzle_name = $(actionElement).attr('data-puzzle-name');
	//alert("Edit puzzle " + puzzle_name);
	$('#debug-info').text('Editing puzzle');
	addColumnClueSymbols();
	addRowClueSymbols();
	var row_clues = $(".puzzle-row .line-total");

	$('#edit-action').replaceWith("<div id='cancel-edit-action' class='puzzle-action' data-action='cancel-edit'>Cancel</div>");
	$('#solve-action').hide();
	puzzleActionClick();

	/*
	$.getJSON(ajax_base+"edit_puzzle", {'action':'edit', 'puzzle_name': puzzle_name}, 
	    function (edit_result) {
		document.location = document.location;
	    }
	);
	*/
    };
  
    function cancelEditActionClicked(actionElement) {
	var puzzle_name = $(actionElement).attr('data-puzzle-name');
	//alert("Edit puzzle " + puzzle_name);
	$('#debug-info').text('Cancelling Editing puzzle');
	removeColumnClueSymbols();
	removeRowClueSymbols();
	var row_clues = $(".puzzle-row .line-total");

	$('#cancel-edit-action').replaceWith("<div id='edit-action' class='puzzle-action' data-action='edit'>Edit</div>");
	$('#solve-action').show();
	puzzleActionClick();

	/*
	$.getJSON(ajax_base+"edit_puzzle", {'action':'edit', 'puzzle_name': puzzle_name}, 
	    function (edit_result) {
		document.location = document.location;
	    }
	);
	*/
    };
  
    function modalActionClicked(actionElement) {
	var modal_action = $(actionElement).attr('data-action');
	if (modal_action === 'load') {
	    showLoadModal();
	} else {
	    showSaveModal();
	}
    }

    function showLoadModal() { 
	$.getJSON(ajax_base+"get_puzzle_list", {}, 
	    function (puzzles) {
		//console.log(puzzles);
		document.existing_puzzles = puzzles;
		$(".md-title").text('Load puzzle');
		//$(".md-content").replaceWith("<ul></ul");
		$(".md-content").empty().append("<ul></ul");
		$.each(puzzles, function(index, value) {
			console.log(value);
			$(".md-content ul").append('<li class="md-action" data-action="load" data-puzzle="' + value + '">' + value + '</li>');
		});
		$(".md-content").append('<div class="md-actions"></div>');
		$(".md-content .md-actions").append('<span class="md-button md-action" data-action="cancel">Cancel</span>');
		showModal();
	    }
	);
    }

    function showSaveModal() { 
	$.getJSON(ajax_base+"get_puzzle_list", {}, 
	    function (puzzles) {
		//console.log(puzzles);
		document.existing_puzzles = puzzles;
		$(".md-title").text('Save puzzle');
		//$(".md-content").replaceWith("<ul></ul");
		$(".md-content").empty();
		$(".md-content").append('<div class="md-inputs"></div>');
		$(".md-content .md-inputs").append('<label for="puzzle-name">Puzzle name</label>');
		$(".md-content .md-inputs").append('<input class="md-input md-keylog" data-action="file" name="puzzle-name" id="md-puzzle-name"/>');
		$(".md-content").append("<ul></ul");
		$.each(puzzles, function(index, value) {
			console.log(value);
			$(".md-content ul").append('<li class="md-action" data-action="set-name" data-puzzle="' + value + '">' + value + '</li>');
		});
		$(".md-content").append('<div class="md-actions"></div>');
		$(".md-content .md-actions").append('<span id="md-cancel" class="md-button md-action" data-action="cancel">Cancel</span>');
		$(".md-content .md-actions").append('<span id="md-save" class="md-button md-action btn-disabled" data-action="save">Save</span>');
		showModal();
	    }
	);
    }

    function loadPuzzle(puzzleName){
	//alert('Load puzzle ' + $(actionElement).attr('data-puzzle') + ' clicked');
	$.getJSON(ajax_base+"load_puzzle", {'action':'load', 'puzzle_name': puzzleName}, 
	    function (load_result) {
		document.location = document.location;
	    }
	);
    };

    function savePuzzle(puzzleName){
	//console.log('Puzzle name is ' + puzzleName);
	$.getJSON(ajax_base+"save_puzzle", {'action':'save', 'puzzle_name': puzzleName}, 
	    function (save_result) {
		//alert('Save result is '+ save_result);
		$('#clear-action').prop('data-puzzle-name', puzzleName);
		$('#clear-action').attr('data-puzzle-name', puzzleName);
		//alert($('#clear-action').attr('data-puzzle-name'));
		hideModal();
	    }
	);
    };

    function takeModalAction(actionElement){
	//alert($(actionElement).attr('data-action'));
	var modal_action = $(actionElement).attr('data-action');
	if (modal_action === 'load') {
	    loadPuzzle($(actionElement).attr('data-puzzle'));
	} else if (modal_action === 'set-name') {
	    //alert('Set name ' + $(actionElement).text());
	    setPuzzleName($(actionElement).text());
	} else if (modal_action === 'save') {
	    //alert('Save ' + $('#md-puzzle-name').val());
	    if ( ! $(actionElement).hasClass('btn-disabled') ) {
		savePuzzle($('#md-puzzle-name').val());
	    }
	} else if (modal_action === 'cancel') {
	    //alert('Cancel ' + $(actionElement).text());
	    hideModal();
	} else {
	    //alert('unknown action ' + $(actionElement).text());
	    hideModal();
	}
    };

    function configureSaveButton(){
	//alert($(actionElement).attr('data-action'));
	//alert(puzzleName);
	var puzzle_name = $('#md-puzzle-name').val();
	//alert(puzzle_name);
	if ( puzzle_name.length == 0 ) {
	    $('#md-save').addClass('btn-disabled');
	} else {
	    $('#md-save').removeClass('btn-disabled');
	    //alert(document.existing_puzzles);
	    var name_index = document.existing_puzzles.indexOf(puzzle_name);
	    //alert(name_index);
	    console.log(name_index != -1);
	    if ( name_index != -1 ) {
		//alert($('#md-save').text + "Overwrite");
		$('#md-save').text("Overwrite");
	    } else {
		$('#md-save').text("Save");
	    }
	}
    };

    function setPuzzleName(puzzleName){
	//alert($(actionElement).attr('data-action'));
	//alert(puzzleName);
	$('#md-puzzle-name').val(puzzleName);
	configureSaveButton();
    };

    function keyPuzzleName(actionElement){
	//alert($(actionElement).attr('data-action'));
	var puzzle_name = $(actionElement).val();
	//alert(puzzle_name);
	configureSaveButton();
    };

    function showModal(){
	    $('.md-modal').delay(300).fadeIn(200);
	    //$(useThis).addClass('md-active');
	    $('.md-modal').addClass('md-show');
	    $('.md-action').click(function(e){
		e.stopPropagation();
		takeModalAction(this);
	    });
	    $('.md-keylog').keyup(function(e){
		e.stopPropagation();
		keyPuzzleName(this);
	    });
    };

    function hideModal(){
	    $('.md-modal').fadeOut(200);
	    //$(useThis).removeClass('md-active');
	    $('.md-modal').removeClass('md-show');
	    $('.md-action').unbind('click');
	    $('.md-keylog').unbind('keyup');
    }

    
    $(document.body).click( function(e) {
	hideModal();
    });

    $('.md-close').click( function(e) {
	hideModal();
    });

    $(".md-modal").click( function(e) {
	e.stopPropagation();
    });

    
});
