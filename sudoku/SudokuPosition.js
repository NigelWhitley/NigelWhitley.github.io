/* 
Sudoku Aid v0.3 by Nigel Whitley (c) Copyright 2005-2023
 */
/*
This file holds objects to simplify manipulation of positions within the puzzle 
and a value associated with it.
*/

	export class Position
	// Define a coordinate in the Sudoku square
	{
		constructor (aRow, aColumn) {
			this.row = aRow;
			this.column = aColumn;
		}

		isSameRowAs = function (otherPosition) {
			return this.row == otherPosition.row;
		}

		isSameColumnAs = function (otherPosition) {
			return this.column == otherPosition.column;
		}

		isSameAs = function (otherPosition) {
			return (this.isSameRowAs(otherPosition) && this.isSameColumnAs(otherPosition));
		}

		toString = function () {
			return this.row + ":" + this.column;
		}
	}

	export class Position_1d
	// Define a coordinate in the Sudoku square
	{
		constructor (aBlock, aCell) {
			this.block = aBlock;
			this.cell = aCell;
		}

		isSameBlockAs = function (otherPosition) {
			return this.block == otherPosition.block;
		}

		isSameCellAs = function (otherPosition) {
			return this.cell == otherPosition.cell;
		}

		isSameAs = function (otherPosition) {
			return (this.isSameBlockAs(otherPosition) && this.isSameCellAs(otherPosition));
		}

		toString = function () {
			return this.block + ":" + this.cell;
		}
	}

	export class PuzzlePosition
	// Define a (cell) position in the Sudoku puzzle using both block and cell coordinates
	{
		constructor (aBlockPosition, aCellPosition) {
			this.block = new Position(aBlockPosition.row, aBlockPosition.column);
			this.cell = new Position(aCellPosition.row, aCellPosition.column);
		}

		isSameRowAs = function (otherPosition) {
			return this.block.isSameRowAs(otherPosition.block) && this.cell.isSameRowAs(otherPosition.cell);
		}

		isSameColumnAs = function (otherPosition) {
			return this.block.isSameColumnAs(otherPosition.block) && this.cell.isSameColumnAs(otherPosition.cell);
		}

		isSameBlockAs = function (otherPosition) {
			return this.block.isSameRowAs(otherPosition.block) && this.block.isSameColumnAs(otherPosition.block);
		}

		isSameCellAs = function (otherPosition) {
			return this.cell.isSameRowAs(otherPosition.cell) && this.cell.isSameColumnAs(otherPosition.cell);
		}

		isSameAs = function (otherPosition) {
			return this.isSameBlockAs(otherPosition) && this.isSameCellAs(otherPosition);
		}

		toString = function () {
			return this.block + ":" + this.cell;
		}
	}

	export class CellValue
	// Get the value of a Sudoku cell
	{
		constructor (aCellPosition, aValue) {
			this.value = aValue;
			this.cell = new Position(aCellPosition.row, aCellPosition.column);
		}

		toString = function () {
			return this.cell + "=" + this.value;
		}
	}


	export class PuzzleValue
	// Set a value in a Sudoku cell
	{
		constructor (aPuzzlePosition, aValue) {
			this.value = aValue;
			this.puzzlePosition = new PuzzlePosition(aPuzzlePosition.block, aPuzzlePosition.cell);
		}

		toString = function () {
			return this.puzzlePosition + "=" + this.value;
		}
	}
