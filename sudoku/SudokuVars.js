/* 
Sudoku Aid v0.3 by Nigel Whitley (c) Copyright 2005-2023
 */
	// Define "namespaces" for values which are global to the program.
	// Those which are not expected to change are under SudokuStatic and are 
	// typically parameters.
	// Those which could change or are defined dynamically are under SudokuGlobals.

export class SudokuStatic {
		static maxValue = 9;
		static longPuzzleDimension = 3;
	
		static setDimensions() {
			SudokuStatic.valueSeparator = new String(':');
			SudokuStatic.valueSeparatorLength = SudokuStatic.valueSeparator.length;

			SudokuStatic.shortPuzzleDimension = SudokuStatic.maxValue / SudokuStatic.longPuzzleDimension;
	
			SudokuStatic.blocksWide = SudokuStatic.shortPuzzleDimension;
			SudokuStatic.blocksHigh = SudokuStatic.longPuzzleDimension;
			SudokuStatic.cellsWide = SudokuStatic.longPuzzleDimension;
			SudokuStatic.cellsHigh = SudokuStatic.shortPuzzleDimension;
			SudokuStatic.possWide = SudokuStatic.longPuzzleDimension;
			SudokuStatic.possHigh = SudokuStatic.shortPuzzleDimension;
	
			SudokuStatic.firstBlockRow = 1;
			SudokuStatic.lastBlockRow = ( SudokuStatic.blocksHigh + 1 ) - SudokuStatic.firstBlockRow;
			SudokuStatic.firstBlockColumn = 1;
			SudokuStatic.lastBlockColumn = ( SudokuStatic.blocksWide + 1 ) - SudokuStatic.firstBlockColumn;
	
			SudokuStatic.firstCellRow = 1;
			SudokuStatic.lastCellRow = ( SudokuStatic.cellsHigh + 1 ) - SudokuStatic.firstBlockRow;
			SudokuStatic.firstCellColumn = 1;
			SudokuStatic.lastCellColumn = ( SudokuStatic.cellsWide + 1 ) - SudokuStatic.firstBlockColumn;
	
			SudokuStatic.firstPossRow = 1;
			SudokuStatic.lastPossRow = ( SudokuStatic.possHigh + 1 ) - SudokuStatic.firstBlockRow;
			SudokuStatic.firstPossColumn = 1;
			SudokuStatic.lastPossColumn = ( SudokuStatic.possWide + 1 ) - SudokuStatic.firstBlockColumn;
		}
	}

	SudokuStatic.setDimensions();

export class SudokuGlobal {
	static blocks = createArray(SudokuStatic.lastBlockRow, SudokuStatic.lastBlockColumn);
	static currentValues = new Array(SudokuStatic.maxValue);
	static possibleValues = new Array();
	static undoList = new Array();
	static undoIndex = 0;
	static undoCount = 0;
    
};
