/* 
Sudoku Aid v0.3 by Nigel Whitley (c) Copyright 2005-2023
 */
 
/*
This file is just to load all of the constituent Javascript files from one place.
This keeps the specifics of the Javascript implementation away from the HTML HEAD and 
let me add/remove or rename things without touching the main HTML file.
Once everything became relatively stable I could have folded the definitions back into the 
HEAD of the HTML, but leaving it means I have more flexibilty if/when I want to do 
*another* major revision. :-D
*/


function dummyCallback() {
}


import {SudokuStatic, SudokuGlobal} from "./SudokuVars.js";
import {SudokuControls} from "./SudokuControls.js";
import {SudokuPuzzle} from "./SudokuPuzzle.js";


export default function initSudoku() {
    // Store references to various sections of the document in case
    // we need to manipulate them dynamically.
    SudokuGlobal.pageBody = document.body;
    SudokuGlobal.controlsSection = document.getElementById("controls_section");
    SudokuGlobal.contentSection = document.getElementById("content_section");
    SudokuGlobal.puzzleSection = document.getElementById("puzzle_section");
    SudokuGlobal.infoSection = document.getElementById("info_section");
    SudokuGlobal.titleSection = document.getElementById("title_section");
    SudokuGlobal.legalSection = document.getElementById("legal_section");

    SudokuGlobal.puzzle = new SudokuPuzzle();
    SudokuGlobal.puzzle.displayPuzzle();
    // Make the info section the same height as the puzzle section
    var puzzleHeight = SudokuGlobal.puzzleSection.offsetHeight;
    // We need to take off the border height
    SudokuGlobal.infoSection.setAttribute("style", "height:" + (puzzleHeight-2) + "px");
    SudokuGlobal.controls = new SudokuControls();
}

initSudoku();
