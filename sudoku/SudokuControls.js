/* 
Sudoku Aid v0.3 by Nigel Whitley (c) Copyright 2005-2023
 */
	/*
	This is the object/code for generating and managing controls for the puzzle. 
	The only controls at present are a select box for the offered level of aid 
	and an "undo" to allow the user to backtrack.
	Since it must interact with the puzzle object itself, some of the elements
	are made available directly though the SudokuGlobal namespace.
	*/

	import {SudokuStatic, SudokuGlobal} from "./SudokuVars.js";
	import {Position, PuzzlePosition} from "./SudokuPosition.js";
	
	export class SudokuControls {
		constructor () {
			SudokuStatic.aidLevels = [["Basic","basic"], ["Auto","auto"], ["Show Groups","showgrp"], ["Filter Groups","filgrp"], ["Show Pins","showpin"], ["Filter Pins","filpin"]];

			this.init();
		}

		init = function () {
			// Sudoku puzzle is built as nested tables (sacrilege I know).
			// This could be done with nested divs, but the layout of the puzzle is
			// integral to the design of the code so form and function 
			// are far more intertwined than most applications.
			//this.controlsSection = document.getElementById("controls_section");
			SudokuGlobal.undoIndex = 0;
			this.undoInfo = new Array();
			this.undoCount = 0;
			SudokuControls.puzzleFile = 'Sudoku.dat';
			remove_children(SudokuGlobal.controlsSection);
			this.buildControls();
		}

		buildControls = function () {
			this.controlsForm = document.createElement("form");
			SudokuGlobal.controlsSection.appendChild(this.controlsForm);
			this.buildLoadButton();
			this.buildSaveButton();
			this.buildUndoButton();
			this.buildRedoButton();
			this.buildAidLevel();
		}


		buildButton = function (buttonName, buttonLabel, buttonAction, initialClass) {
			const button = document.createElement("input");

			button.setAttribute("type","button");
			button.setAttribute("name",buttonName);
			button.setAttribute("value",buttonLabel);

			//this.loadUndoFixValue(saveButton);
			const loadfunc=function(e) {
				buttonAction(this, e); // pass-through the event object
			}; 
			addEvent(button, "click", loadfunc, false);
			button.className = initialClass;
			this.controlsForm.appendChild(button);
			return button;
		}


		// We use the HTML5 file selector to load a puzzle file.
		// The approach is to have the selector hidden then, when the "Load" button is clicked, 
		// we simulate a click on it which brings up the file selector dialog.
		// If/when the user selects a file we need to respond to the "change" event for the selector.
		buildLoadButton = function () {
			// Respond to a file selection
			SudokuControls.fileSelector = $('#file-selector');
			const that = this;
			SudokuControls.fileSelector.change( function() { that.loadFile() });

			// To show the file selector dialog when the "Load" button is clicked we simulate a click on the selector
			var fileClick = function () {
				SudokuControls.fileSelector.click();
			}
			this.loadButton = this.buildButton("LoadButton", "Load", fileClick, "");
		}


		buildSaveButton = function () {
			SudokuControls.saveButton = this.buildButton("saveButton", "Save", this.saveFile, "hide");
		}


		buildUndoButton = function () {
			SudokuControls.undoButton = this.buildButton("undoButton", "Undo", this.undo, "hide");
		}


		buildRedoButton = function () {
			var initClass = "";
			// We hide the redo button if the the undo list is empty
			if (SudokuGlobal.undoList.length === 0) {
				initClass = "hide";
			}
			SudokuControls.redoButton = this.buildButton("redoButton", "Redo", this.redo, initClass);
		}


		buildAidLevel = function () {
			SudokuGlobal.aidLevel = document.createElement("select");

			SudokuGlobal.aidLevel.setAttribute("name","aidLevel");
			SudokuGlobal.aidLevel.setAttribute("id","aidLevel");

			for (var levelIndex = 0; levelIndex < SudokuStatic.aidLevels.length; levelIndex++) {
				var aidLevelOption = document.createElement("option");
				//debugFramework.showMessage("level index " + levelIndex);
				//debugFramework.showMessage("text " + this.aidLevels[levelIndex][0]);
				aidLevelOption.value = SudokuStatic.aidLevels[levelIndex][1];
				var aidLevelOptionText = document.createTextNode(SudokuStatic.aidLevels[levelIndex][0]);
				aidLevelOption.appendChild(aidLevelOptionText);
				SudokuGlobal.aidLevel.appendChild(aidLevelOption);
			}
			SudokuGlobal.currentAidLevel = 1;
			SudokuGlobal.aidLevel.selectedIndex = SudokuGlobal.currentAidLevel;

			var that = this; 
			var levelChange=function(e) {
				var aidLevel = {previous: SudokuGlobal.currentAidLevel};
				that.aidLevelChanged(); // ensure context is this object
                aidLevel.current = SudokuGlobal.currentAidLevel;
				SudokuGlobal.controls.storeUndo("SetAidLevel", aidLevel);
			}; 
			addEvent(SudokuGlobal.aidLevel, "change", levelChange, false);
			//this.aidLevel.className = "hide";
			this.controlsForm.appendChild(SudokuGlobal.aidLevel);
		}

		changeAidLevel = function (aidLevel) {
			
			SudokuGlobal.currentAidLevel = aidLevel;
			//debugFramework.restoreDebug(oldDebugState);

			SudokuGlobal.puzzle.provideAid();
			
		}

		aidLevelChanged = function () {
			this.changeAidLevel(SudokuGlobal.aidLevel.selectedIndex);
			
		}

		// We display the Undo, Redo and Save butons depending on the state of the Undo list
		showUndoRedo = function () {
			if (SudokuGlobal.undoIndex === 0) {
				SudokuControls.undoButton.className = "hide";
				SudokuControls.saveButton.className = "hide";
			} else {
				SudokuControls.undoButton.className = "";
				SudokuControls.saveButton.className = "";				
			}

			if (SudokuGlobal.undoList.length === SudokuGlobal.undoIndex){
				SudokuControls.redoButton.className = "hide";
			} else {
				SudokuControls.redoButton.className = "";				
			}
		}


		storeUndo = function (undoAction, undoData) {
			SudokuGlobal.undoList[SudokuGlobal.undoIndex++] = [undoAction, undoData];
			SudokuGlobal.undoList.length = SudokuGlobal.undoIndex;
			this.showUndoRedo();
		}


		undo = function () {
		// Undo an action - this will be either a FixValue or change of Aid Level
			var undoInfo = SudokuGlobal.undoList[--SudokuGlobal.undoIndex];
			var undoAction = undoInfo[0];
			var undoData = undoInfo[1];
			if (SudokuGlobal.undoIndex === 0) {
				SudokuControls.undoButton.className = "hide";
				SudokuControls.saveButton.className = "hide";
			}
			SudokuControls.redoButton.className = "";
			
			SudokuGlobal.puzzle.undo(undoAction, undoData);

			//var undoCell = this.blocks[blockRow][blockColumn].cells[cellRow][cellColumn];
			//var undoValue = undoCell.currentValue;

		}


		redo = function () {
		// Undo an action - this will be either a FixValue or change of Aid Level
			var undoInfo = SudokuGlobal.undoList[SudokuGlobal.undoIndex++];
			var undoAction = undoInfo[0];
			var undoData = undoInfo[1];
			if (SudokuGlobal.undoIndex === 1) {
				SudokuControls.undoButton.className = "";
			}
			if (SudokuGlobal.undoIndex === SudokuGlobal.undoList.length) {
				SudokuControls.redoButton.className = "hide";
			}
			
			SudokuGlobal.puzzle.redo(undoAction, undoData);

			//var undoCell = this.blocks[blockRow][blockColumn].cells[cellRow][cellColumn];
			//var undoValue = undoCell.currentValue;

		}


		saveFile = function (saveAction, saveData) {
			// Build the set of data we want to store
			// Basically we store the list of actions the user has taken to create the puzzle in its current state
			var puzzleData = {
				undoList: SudokuGlobal.undoList,
				undoIndex: SudokuGlobal.undoIndex
			};

			saveTextFile(SudokuControls.puzzleFile, JSON.stringify(puzzleData));
		}


		loadFile = function () {
			// Load the set of Sudoku data
			// Basically we restore the puzzle state by redoing the actions the user has taken
			const selectedFile = SudokuControls.fileSelector[0].files[0];

			const reader = new FileReader(selectedFile);
			const that = this;

			reader.onload = function() {
				//console.log(reader.result);
				that.loadPuzzleData(JSON.parse(reader.result));
				SudokuGlobal.puzzle.provideAid();
			};

			reader.onerror = function() {
				console.log(reader.error);
			};

			reader.readAsText(selectedFile);
		}


		loadPuzzleData = function (puzzleData) {
			//console.log("loadPuzzleData called");
			//console.log(puzzleData);
			// Load the set of Sudoku data
			// Basically we restore the puzzle state by redoing the actions the user has taken
			// Start by clearing out the existing undo list
			SudokuGlobal.undoList = new Array();
			SudokuGlobal.undoIndex = 0;
			SudokuGlobal.puzzle.clear();
			let undoData;

			// Now populate it with the loaded data
			const undoCount = puzzleData.undoList.length;
			for (let puzzleIndex = 0; puzzleIndex < undoCount; puzzleIndex++) {
				let undoInfo = puzzleData.undoList[puzzleIndex];
				let undoAction = undoInfo[0];
				switch (undoAction) {
					case "FixValue":
						let positionData = undoInfo[1].position;
						let position = new PuzzlePosition(new Position(positionData.block.row, positionData.block.column), new Position(positionData.cell.row, positionData.cell.column));
						undoData = {value: undoInfo[1].value, 
									position: position};
					default:
						undoData = undoInfo[1];
						break;
				}
				this.storeUndo(undoAction, undoData);
			}

			// Now reset the undoIndex and redo each action up to the stored undoIndex
			SudokuGlobal.undoIndex = 0;
			const loadedUndoIndex = puzzleData.undoIndex;
			for (let puzzleIndex = 0; puzzleIndex < loadedUndoIndex; puzzleIndex++) {
				this.redo();
			}

			//console.log("loadPuzzleData ending");
			//console.log(SudokuGlobal.undoList);
		}


	}
