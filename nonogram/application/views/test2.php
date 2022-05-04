
	<div id="body">
	    <div id='controls-area'>
		<div id='solver-action'>
		    Start
		</div>
		<div id='solver-undo'>
		    Undo
		</div>
	    </div>
	    
	    <?php
		//$row_clues_width = ( $max_row_clues * 1.5 ) . "em";
		$row_clues_margin = ( $max_row_clues ) . "px";
		echo "<div class='column-clues'>";
		echo "<div class='column-clues-row column-totals-row'>";
		echo "<span class='row-clues-heading'>&nbsp</span>";
		echo "<ul>";
		foreach (range(0,count($columns)-1) as $column_index) {
			//echo "column $column_index<br/>";
			$total = $column_totals[$column_index];
			if ( $total == count($rows) ) {
				echo "<li><span class='column-total column-solved'>$total</span></li>";
			} else {
				echo "<li><span class='column-total'>$total</span></li>";
			}
		}
		echo "</ul>";
		echo "</div>";
		foreach (range(1, $max_column_clues) as $clue_index) {
			echo "<div class='column-clues-row'>";
			echo "<span class='row-clues-heading'>&nbsp</span>";
			echo "<ul>";
			foreach (range(0,count($columns)-1) as $column_index) {
				//echo "column $column_index<br/>";
				$clues = $columns[$column_index];
				$clue_offset = $max_column_clues - count($clues);
				if ( $clue_index <= $clue_offset ) {
					echo "<li><span class='no-column-clue'>&nbsp</span></li>";
				} else {
					$clue = $clues[$clue_index - ( $clue_offset + 1 )];
					echo "<li><span class='column-clue'>$clue</span></li>";
				}
			}
			echo "</ul>";
			echo "</div>";
		}
		echo "</div>";
		//echo "<br/>Columns<br/>\n";
		foreach (range(0,count($rows)-1) as $row_index) {
			echo "<div class='puzzle-row'>";
			$total = $row_totals[$row_index];
			if ( $total == count($columns) ) {
				echo "<span class='row-total row-solved'>$total</span>";
			} else {
				echo "<span class='row-total'>$total</span>";
			}
			echo "<span class='row-clues'>";
			//echo "row $row_index :";
			$clues = $rows[$row_index];
			//var_dump($row);
			$clue_offset = $max_row_clues - count($clues);
			if ( $clue_offset > 0 ) {
				echo "<ul>";
				foreach (range(1,$clue_offset) as $clue_index) {
					echo "<li><span class='no-row-clue'>&nbsp</span></li>";
				}
				echo "</ul>";
			}
			if ( count($clues) > 0 ){
				echo "<ul>";
				foreach ($clues as $clue) {
					echo "<li><span class='row-clue'>$clue</span></li>";
				}
				echo "</ul>";
			}
			echo "</span>";
			echo "<ul class='puzzle-pixels'>";
			foreach (range(0,count($columns)-1) as $column_index) {
				if ( isset($solved[$row_index][$column_index]) ) {
				    if ( $solved[$row_index][$column_index] ) {
					$class = "filled-state";
				    } else {
					$class = "empty-state";
				    }
				} else {
					$class = "unsolved-state";
				}
				echo "<li><span class='puzzle-pixel $class'>&nbsp</span></li>";
				//echo "<li><div class='puzzle-pixel $class'>&nbsp</div></li>";
				//echo "<li class='puzzle-pixel $class'>&nbsp</li>";
				//echo "<br/>\n";
			}
			echo "</ul>";
			echo "</div>";
			//echo "<br/>\n";
		}
		echo "</div>";
		?>
	</div>

	<style type='text/css'>
	    /*
	    .row-clues-heading { display: inline-block; width: <?=$row_clues_width;?>; border-style: dotted; border-color: white; border-width: <?="1px ".$max_row_clues."px";?>; }
	    */
	    .row-clues-heading { width: <?=((($max_row_clues+1)*1.5)+1)."em";?>; border-width: <?="1px ".($max_row_clues+1)."px";?>; }
	</style>
