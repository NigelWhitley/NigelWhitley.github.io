/* 
Sudoku Aid v0.3 by Nigel Whitley (c) Copyright 2005-2023
 */
	/*
	This is the object/code for managing a "block" in the puzzle. The data structure 
	mimics the visual layout where a block made up of a rectangular set of "cells".
	A block has one cell for each value (as required by the puzzle rules) and the 
	puzzle has one block per value.
	There are helper functions for accessing rows and columns of cells within the block.
	*/

	import {Position, Position_1d, PuzzlePosition, CellValue, PuzzleValue} from "./SudokuPosition.js";
	import {SudokuStatic, SudokuGlobal} from "./SudokuVars.js";
	import {SudokuCell} from "./SudokuCell.js";

	export class SudokuBlock {

		constructor (parentElement, blockPosition) {
			this.parentElement = parentElement;
			this.position = blockPosition;
	
			//console.log("SudokuBlock");
			this.cells = createArray(SudokuStatic.lastCellRow, SudokuStatic.lastCellColumn);
			this.init();
		}

		// The block is one of the restrictive elements in a Sudoku puzzle.
		// We need to show this as a visual element and consider it in any
		// solution evaluation.
		// Although normally we want to separate form from function, I have combined 
		// them in this object. My justification is that the logical (function) aspect
		// is essentially an expression of the visual layout: any fundamental change
		// to the display side would have a major effect on the logical processing 
		// hence voiding the major reason for keeping them separate.
		// Further, the display processing is primarily in the setup after which the 
		// visual changes are at cell rather than block level. The display 
		// processing can be isolated within the object to just the init() function.

		//this.puzzle = puzzle;

		getCell = function (cellPosition) {
			return this.cells[cellPosition.row][cellPosition.column];
		}

		isFixedValue = function (cellPosition) {
			return this.getCell(cellPosition).isFixedValue();
		}

		getRowCells = function (row) {
			let cells = new Array();
			for ( let column = SudokuStatic.firstCellColumn; column <=SudokuStatic.lastCellColumn; column++) {
				//debugFramework.showMessage("block getRowCells block " + this.position + " pos " + row + " column " + column);
				cells.push( new PuzzlePosition( this.position, new Position(row, column) ) );
			}
			//debugFramework.showMessage("block getRowCells end row " + row + " length " + cells.length + " cells[0] " + cells[0], "append");
			return cells;
		}

		getCellRow = function (cellPosition) {
			return this.getRowCells(cellPosition.row);
		}

		getPuzzleRow = function (puzzlePosition) {
			if (this.block.isSameAs(puzzlePosition.block)) {
				return this.getRowCells(puzzlePosition.cell.row);
			} else {
				return undefined;
			}
		}

		getColumnCells = function (column) {
			let cells = new Array();
			for ( let row = SudokuStatic.firstCellRow; row <=SudokuStatic.lastCellRow; row++) {
				cells.push( new PuzzlePosition( this.position, new Position(row, column) ) );
			}
			return cells;
		}

		getCellColumn = function (cellPosition) {
			return this.getColumnCells(cellPosition.column);
		}

		getPuzzleColumn = function (puzzlePosition) {
			if (this.block.isSameAs(puzzlePosition.block)) {
				return this.getColumnCells(puzzlePosition.cell.column);
			} else {
				return undefined;
			}
		}

		getBlockCells = function () {
			const cells = new Array(SudokuStatic.cellsWide * SudokuStatic.cellsHigh);
			let cell_index = 0;
			for ( let row = SudokuStatic.firstCellRow; row <=SudokuStatic.lastCellRow; row++) {
				for ( let column = SudokuStatic.firstCellColumn; column <=SudokuStatic.lastCellColumn; column++) {
					cells[cell_index++] = new PuzzlePosition( this.position, new Position(row, column));
				}
			}
			return cells;
		}

		getPuzzleBlock = function (puzzlePosition) {
			if (this.block.isSameAs(puzzlePosition.block)) {
				return this.getBlockCells();
			} else {
				return undefined;
			}
		}

		showCells = function () {
			for ( let row = SudokuStatic.firstCellRow; row <=SudokuStatic.lastCellRow; row++) {
				for ( let column = SudokuStatic.firstCellColumn; column <=SudokuStatic.lastCellColumn; column++) {
					let cell = this.getCell(new Position(row, column));
					cell.showCell();
				}
			}
		}

		resetPossibleValues = function ( ) {
			for ( let cellRow=SudokuStatic.firstCellRow; cellRow <= SudokuStatic.lastCellRow; cellRow++) {
				for ( let cellColumn=SudokuStatic.firstCellColumn; cellColumn <= SudokuStatic.lastCellColumn; cellColumn++) {
					this.getCell(new Position(cellRow, cellColumn)).resetPossibleValues();
				}
			}
		}

		clear = function ( ) {
			for ( let cellRow=SudokuStatic.firstCellRow; cellRow <= SudokuStatic.lastCellRow; cellRow++) {
				for ( let cellColumn=SudokuStatic.firstCellColumn; cellColumn <= SudokuStatic.lastCellColumn; cellColumn++) {
					this.getCell(new Position(cellRow, cellColumn)).clear();
				}
			}
		}

		init = function () {
			// To keep things neat, the block is presented as a <TABLE>
			// where each of the cells is a <TD>.
			//const blockTable = document.createElement("TABLE");
			for( let row=SudokuStatic.firstCellRow; row <= SudokuStatic.lastCellRow; row++) {
				//const blockRow=document.createElement("TR");

				for ( let column=SudokuStatic.firstCellColumn; column <= SudokuStatic.lastCellColumn; column++) {
					const currentCell=document.createElement("DIV");

					currentCell.name = "cell"+row+"_"+column;
					currentCell.className ="puzzleCell";
					const cellPosition = new Position(row, column);
					const cell = new SudokuCell(this, currentCell, cellPosition);
					// This assignment needs to match the getCell function
					this.cells[row][column] = cell;
					this.parentElement.appendChild(currentCell);
				}
				//blockTable.appendChild(blockRow);
			}
			//this.parentElement.appendChild(blockTable);
		}

		buildFixedValuesInRow = function ( rowPosition ) {
			const fixedValues = createArray(SudokuStatic.maxValue);
			const cellRow = rowPosition.cell;
			for (column=SudokuStatic.firstCellColumn; column <= SudokuStatic.lastCellColumn; column++) {
				const cellValue = this.getCell(new Position(cellRow, column)).currentValue;
				if ( cellValue != 0 ) {
					fixedValues[cellValue] = new PuzzlePosition(this.position, new Position(cellRow, column));
				}
			}
			return fixedValues;
		}

		buildFixedValuesInColumn = function ( columnPosition ) {
			const fixedValues = createArray(SudokuStatic.maxValue);
			const cellColumn = columnPosition.cell;
			for (row=SudokuStatic.firstCellRow ; row <= SudokuStatic.lastCellRow; row++) {
				const cellValue = this.getCell(new Position(row, cellColumn)).currentValue;
				if ( cellValue != 0 ) {
					fixedValues[cellValue] = new PuzzlePosition(this.position, new Position(row, cellColumn));
				}
			}
			return fixedValues;
		}

		buildFixedValuesInBlock = function () {
			this.fixedValues = createArray(SudokuStatic.maxValue);
			//const fixedValues = createArray(this.maxValue);
			//const cellColumn = rowPosition.cellPosition;
			for (row=SudokuStatic.firstCellRow; row <= SudokuStatic.lastCellRow; row++) {
				for (column=SudokuStatic.firstCellColumn; column <= SudokuStatic.lastCellColumn; column++) {
					const cellValue = this.getCell(new Position(row, column)).currentValue;
					if ( cellValue != 0 ) {
						this.fixedValues[cellValue] = new PuzzlePosition(this.position, new Position(row, column));
					}
				}
			}
			return this.fixedValues;
		}

		addFixedValueInBlock = function (fixedValue, puzzlePosition) {
			this.fixedValues[fixedValue] = puzzlePosition;
			return this.fixedValues;
		}

		//debugFramework.showMessage("Sudoku Aid block init code");
		//debugFramework.showMessage("Sudoku Aid block coord " + this.position.row + ", " + this.position.column);
	}
