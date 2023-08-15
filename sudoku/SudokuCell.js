/* 
Sudoku Aid v0.3 by Nigel Whitley (c) Copyright 2005-2023
 */
	/*
	This is the object/code for managing a "cell" in the puzzle. The main function of 
	the SudokuCell object is to keep track of the possible values for that cell and
	whether a final value has been "fixed" in it (definitely allocated to the cell).
	There are helper functions for maintaining the "state" of each possible value.
	Initially all values are possible. As the puzzle is defined, then during the 
	solution process, some possible values are excluded. Depending on the level
	of aid, possible values may have attributes attached to denote additional 
	information for the user.
	*/
	import {SudokuStatic, SudokuGlobal} from "/SudokuVars.js";
	import {Position, Position_1d, PuzzlePosition, CellValue, PuzzleValue} from "/SudokuPosition.js";

	//console.log("SudokuCell");
	export class SudokuCell {
		constructor (block, parentElement, cellPosition) {
			//console.log("SudokuCell");
			this.block = block;
			//this.puzzle = this.block.puzzle;
			this.cellElement = parentElement;
			this.position = cellPosition;
			this.excludedValues = new Array();
	
			this.init();
	
		}

		init = function () {
			this.blockPosition = this.block.position;
			this.possibleValues = createArray(SudokuStatic.maxValue);
			this.possibleState = createArray(SudokuStatic.maxValue);
			this.clear();
			this.showCell();
		}

		clear = function () {
            this.clearExcludedValues();
			this.clearValue();
		}

		clearValue = function ()
		// Clear the fixed value in a square
		{
			this.currentValue = 0;
			this.resetPossibleValues();
		}

		clearExcludedValues = function ()
		// Clear the excluded values in a square
		{
			this.excludedValues = createArray(0);
		}


		resetPossibleValues = function () {
			if ( ! this.isFixedValue() ) {
				this.possibleCount = 0;
				for ( let possible_index=1; possible_index <= SudokuStatic.maxValue; possible_index++) {
					this.possibleValues[possible_index] = possible_index;
                    // Excluded values are not possible
                    if (this.excludedValues.includes(possible_index)) {
                        this.possibleState[possible_index] = "excluded";
                    } else {                      
                        this.possibleState[possible_index] = "possible";
                        this.possibleCount++;
                    }
				}
			}
		}

		isFixedValue = function () {
			return ( this.currentValue != 0 );
		}

		isValuePossible = function ( value ) {
			return ( ( ! this.isValueExcluded(value) ) && ( ! this.isValueIgnored(value) ) );
		}

		isValueExcluded = function (value) {
			return ( this.possibleState[value] === "excluded" );
		}

		isValueIgnored = function (value) {
			return ( this.possibleState[value] === "impossible" );
		}

		valueNotPossible = function (value) {
			return ( ! this.isValuePossible(value) );
		}


		excludePossibleValue = function ( value ) {
			let stateChanged = false;
			if (! this.isValueExcluded(value)) {
				this.possibleState[value] = "excluded";
				this.possibleCount--;
				stateChanged = true;
			}
			return stateChanged;
		}


		undoExcludePossibleValue = function ( value ) {
			let stateChanged = false;
            const findValue = this.excludedValues.indexOf(value);
            this.excludedValues.splice(findValue, 1);
			if (this.isValueExcluded(value)) {
				this.possibleState[value] = "possible";
				this.possibleCount++;
				stateChanged = true;
			}
			return stateChanged;
		}


		// Need to have a state which indicates the value would be excluded
		// if the group or pin processing were set to filter rather than show. 
		// This allows the processing to ignore those "possible" values as the 
		// search continues but still display them in the cells.
		ignorePossibleValue = function ( value ) {
			let stateChanged = false;
			if ( this.isValuePossible(value) ) {
				this.possibleState[value] = "impossible";
				stateChanged = true;
			}
			return stateChanged;
		}


		onlyPossibleValue = function ( value ) {
			this.possibleState[value] = "single";
		}


		setStateForPossibleValue = function ( state, value ) {
			let stateChanged = false;
			if (! this.isValueExcluded(value)) {
				if ( this.possibleState[value] !== state ) {
					this.possibleState[value] = state;
					stateChanged = true;
				}
			}
			return stateChanged;
		}


		addStateForPossibleValue = function ( state, value ) {
			if ( this.isValuePossible(value) ) {
				if ( this.possibleState[value].indexOf(state) == -1 ) {
					this.possibleState[value] = this.possibleState[value] + " " + state;
				}
			}
		}


		// Fix the supplied value as the final value for that cell
		// We sanity check that it is not an impossible value i.e. it has not been marked as such by the "filter" aid options
		clickPossibleValue = function (element, event)
		// Fix a value in a square
		{
			//console.log("Clicked possible value");
            const is_impossible = $(element).hasClass("impossible");
            if (!is_impossible) {
                //const table_cell=element.parentNode.parentNode.parentNode;
                const table_cell=element.parentNode.parentNode;
                const cell_name = table_cell.name;
                const row = cell_name.substr( 4, 1);
                const column = cell_name.substr( 6, 1);

                const clicked_text=element.childNodes[0].nodeValue;
                const clickedValue = parseInt(clicked_text.valueOf());
                const clickedPosition = new PuzzlePosition(this.blockPosition, this.position);
                SudokuGlobal.puzzle.fixValue(clickedValue, clickedPosition);

                // Record the change so we can undo it
				SudokuGlobal.controls.storeUndo("FixValue", {value: clickedValue, position: clickedPosition});
            }

		}


		// Fix the supplied value as the final value for that cell
		// We sanity check that it is not an impossible value i.e. it has not been marked as such by the "filter" aid options
		fixValue = function (value)
		// Fix a value in a square
		{
                this.currentValue = value;
		}


        // Used for manually removing a posssible value. It will add the value to a list of excluded values for the cell.
		contextPossibleValue = function (element, event)
		// Remove a possible value in a square
		{
            //console.log("Removing from cell");
			const table_cell=element.parentNode.parentNode.parentNode;
			const cell_name = table_cell.name;
			const row = cell_name.substr( 4, 1);
			const column = cell_name.substr( 6, 1);
            console.log("row "+row+", column "+column);

			const clicked_text=element.childNodes[0].nodeValue;
            //console.log("excluding value "+clicked_text);
			const contextValue = parseInt(clicked_text.valueOf());
			const contextPosition = new PuzzlePosition(this.blockPosition, this.position);
			SudokuGlobal.puzzle.removeValue(parseInt(contextValue), contextPosition);
			SudokuGlobal.controls.storeUndo("RemoveValue", {value: contextValue, position: contextPosition});
            event.preventDefault();

		}

        // Used for manually removing a posssible value. It will add the value to a list of excluded values for the cell.
		removeValue = function (value)
		// Remove a possible value in a square
		{
            //console.log("excluding value "+clicked_text);
			this.excludedValues.push(value);

		}

		getPossibleValues = function ()
		// Get all values which can be in the cell ie not excluded.
		{
			const possibleValues = new Array();
			// If the cell has a fixed value we return no possible values
			// It could be argued that there is only one possible value i.e.
			// the fixed value, but any calling process would need to check
			// separately for a fixed value regardless.
			if ( ! this.isFixedValue() ) {
				for ( let eachValue=1; eachValue <= SudokuStatic.maxValue ; eachValue++ ) {
					//debugFramework.showMessage2("value " + eachValue, "append");
					if ( this.isValuePossible(eachValue) ) {
						possibleValues.push(eachValue);
					}
				}

			}
			return possibleValues;

		}

		// Display the cell.
		// If it has a fixed value we display that value only (with a suitable class).
		// Otherwise we display the possible values in a table, with classes set to indicate how it is to be displayed.
		// For example, a value may be marked as "excluded" or be part of a group.
		showCell = function () {
			remove_children(this.cellElement);
			this.cellElement.className = "puzzleCell centred_text";
			if ( this.isFixedValue() ) {
				const currentText=document.createTextNode("");
				currentText.nodeValue = this.currentValue;
				this.cellElement.className = "puzzleCell centred_text fixed_value";
				this.cellElement.appendChild(currentText);
			} else {

				//const possibleTable=document.createElement("TABLE");
				//possibleTable.className = "centred_table set_font";
				//this.cellElement.appendChild(possibleTable);
				let possibleValue = 1;
				for ( let eachRow=SudokuStatic.firstPossRow; eachRow <= SudokuStatic.lastPossRow; eachRow++) {
					//const possibleRow=document.createElement("TR");
					//possibleTable.appendChild(possibleRow);

					for ( let eachColumn=SudokuStatic.firstPossColumn; eachColumn <= SudokuStatic.lastPossColumn; eachColumn++) {
						//const possibleDetail=document.createElement("TD");
						const possibleDetail=document.createElement("DIV");
						this.cellElement.appendChild(possibleDetail);
						if ( this.isValueExcluded(possibleValue) ) {
							possibleDetail.className="possibleCell";
						} else {
							possibleDetail.className="possibleCell " + this.possibleState[possibleValue];
							const possibleText = document.createTextNode(possibleValue);
							possibleDetail.appendChild(possibleText);
							const that = this;
                            
                            // Left click - fix value
							const clickfunc=function(e) {
								that.clickPossibleValue(this, e); // pass-through the event object
							}; 
							addEvent(possibleDetail, "click", clickfunc, false);
                            
                            // Right click - remove possible value
							const contextfunc=function(e) {
								that.contextPossibleValue(this, e); // pass-through the event object
							}; 
							addEvent(possibleDetail, "contextmenu", contextfunc, false);
						}
						possibleValue++;
					}
				}

				this.cellElement.className ="puzzleCell";
			}
		}

	}
