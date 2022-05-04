
	<div id="body">
	    <div id='debug-area'>
		<div id='debug-info'>
		    &nbsp;
		</div>
		<div id='extra-info'>
		    &nbsp;
		</div>
	    </div>
	    <div id='controls-area'>
		<div id='load-action' class='puzzle-action md-trigger' data-action='load'>
		    Load
		</div>
		<div id='edit-action' class='puzzle-action' data-action='edit'>
		    Edit
		</div>
		<div id='save-action' class='puzzle-action md-trigger' data-action='save'>
		    Save
		</div>
		<div id='clear-action' class='puzzle-action'  data-action='clear' data-puzzle-name='<?=$puzzle_name;?>'>
		    Clear
		</div>
		<div id='solve-action' class='puzzle-action' data-action='solve'>
		    Solve
		</div>
		<div id='undo-action' class='puzzle-action' data-action='undo'>
		    Undo
		</div>
	    </div>
    
	    <div id='puzzle-area'>
	    <?php
	    
		echo "<input type='hidden' name='max-column-clues' value='" . $max_clues['column'] . "' id='max-column-clues'>";
		echo "<input type='hidden' name='max-row-clues' value='" . $max_clues['row'] . "' id='max-row-clues'>";
		//$clues['row']_width = ( $max_clues['row'] * 1.5 ) . "em";
		//$row_clues_margin = ( $max_clues['row'] ) . "px";
		echo "<div class='column-clues'>";
		
		echo "<div class='column-clues-row column-totals-row'>";
		echo "<span class='row-clues-heading'>&nbsp</span>";
		echo "<ul>";
		foreach (range(1,count($clues['column'])) as $column_index) {
			//echo "column $column_index<br/>";
			$total = $clue_totals['column'][$column_index];
			$count = $clue_counts['column'][$column_index];
			echo "<li><span class='line-total column-$column_index' data-column='$column_index' data-count='$count'>$total</span></li>";
		}
		echo "</ul>";
		echo "</div>";
		foreach (range($max_clues['column'], 1) as $clue_index) {
			echo "<div class='column-clues-row clue-index-$clue_index' data-clue-index='" . $clue_index . "'>";
			echo "<span class='row-clues-heading'>&nbsp</span>";
			echo "<ul>";
			foreach (range(1, count($clues['column'])) as $column_index) {
				//echo "column $column_index<br/>";
				$column_clues = $clues['column'][$column_index];
				$clue_count = count($column_clues);
				//$clue_offset = $max_clues['column'] - $clue_count;
				//if ( $clue_index > $clue_offset ) {
				if ( $clue_index > $clue_count ) {
					echo "<li><span class='no-column-clue column-$column_index clue-index-$clue_index' data-clue-index='$clue_index' data-column='$column_index'>&nbsp</span></li>";
				} else {
					//$column_clue_index = $clue_index - ( $clue_offset + 1 );
					$column_clue_index = $clue_count - ($clue_index);
					$column_clue_index1 = $column_clue_index + 1;
					$clue = $column_clues[$column_clue_index];
					echo "<li><span class='line-clue column-$column_index clue-index-$clue_index clue$column_clue_index1' data-clue-index='$clue_index' data-column='$column_index'>" . $clue['length'] . "</span></li>";
				}
			}
			echo "</ul>";
			echo "</div>";
		}
		echo "</div>";
		//echo "<br/>Columns<br/>\n";
		foreach (range(1,count($clues['row'])) as $row_index) {
			echo "<div class='puzzle-row row-$row_index' data-row='$row_index'>";
			$total = $clue_totals['row'][$row_index];
			$count = $clue_counts['row'][$row_index];
			echo "<span class='line-total row-$row_index' data-count='$count' data-row='$row_index'>$total</span>";
			echo "<span class='row-clues'>";
			//echo "row $row_index :";
			$row_clues = $clues['row'][$row_index];
			//var_dump($row);
			$clue_offset = $max_clues['row'] - count($row_clues);
			echo "<ul>";
			$row_clues_count = count($row_clues);
			$clue_index = $max_clues['row'];
			while ( $clue_index > $row_clues_count ) {
				echo "<li><span class='no-row-clue row-$row_index clue-index-".$clue_index."' data-row='$row_index' data-clue-index='$clue_index'></span></li>";
				$clue_index--;
			}
			if ( $row_clues_count > 0 ){
				$clue_num = 0;
				foreach ($row_clues as $clue) {
					$clue_num++;
					echo "<li><span class='line-clue row-$row_index clue$clue_num clue-index-".$clue_index." data-row='$row_index' data-clue-index='$clue_index'>" . $clue['length'] . "</span></li>";
					$clue_index--;
				}
			}
			echo "</ul>";
			echo "</span>";
			$line = $puzzle->get_line('row', $row_index);
			echo "<ul class='puzzle-pixels'>";
			foreach (range(1,count($clues['column'])) as $column_index) {
				if ( Nonogram_model::pixel_is_filled($line[$column_index]) ) {
					$class = "filled-state";
				} elseif ( Nonogram_model::pixel_is_empty($line[$column_index]) ) {
					$class = "empty-state";
				} else {
					$class = "unsolved-state";
				}
				echo "<li><span class='puzzle-action puzzle-pixel $class row-$row_index column-$column_index' data-action='cycle-pixel' data-row='$row_index' data-column='$column_index'>&nbsp</span></li>";
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
	</div>

	<div class="md-modal">
		<div class="md-inner">
			<h3 class="md-title">Modal Dialog</h3>
			<div class="md-content">
				<p>This is a modal window. You can do the following things with it:</p>
				<ul>
					<li><strong>Read:</strong> Modal windows will probably tell you something important so don't forget to read what it says.</li>
					<li><strong>Look:</strong> modal windows enjoy a certain kind of attention; just look at it and appreciate its presence.</li>
					<li><strong>Close:</strong> click on the button below to close the modal.</li>
				</ul>
				<button class="md-close">Close me!</button>
			</div>
		</div>
	</div>

	<div class="md-overlay"></div>

	<style id="dynamic-styles" type='text/css'>
	    .row-clues-heading { width: <?=((($max_clues['row']+1)*1.5)+1)."em";?>; border-width: <?="1px ".($max_clues['row']+1)."px";?>; }
	</style>
