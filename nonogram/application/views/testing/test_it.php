	<div class="h1">Page for Testing</div>

	<div id="body">
	    <div class="row">
		<div class="small-4 column">
		col 1
		</div>
		<div class="small-4 column">
		col 2
		</div>
		<div class="small-4 column">
		col 3
		</div>
	    </div>
	    <div class="row">
		<div>
		    <table  class="large-12 columns" role="grid">
			<!--
			<tr>
			    <th >First Name</th>
			    <th >Last Name</th>
			    <th >Actions</th>
			</tr>
			-->
	    <?php
			$box_count = 0;
			foreach ($boxes as $box)
			{
	    ?>
			    <?php if ($box_count == 0){ ?>
				<tr class="row">
			    <?php } ?>
			    <td class="large-4 columns"><?php echo $box ?></td>
			    <?php if ($box_count == 2) { ?>
				</tr>
			    <?php
				    $box_count = 0;
				} else {
				    $box_count++;
				}
			    ?>
	    <?php
			}
			if ($box_count > 0) { ?>
			    </tr>
			<?php } ?>
			<!--
			<tr>
			    <td>Nigel</td>
			    <td>Whitley</td>
			    <td><a href="#" class="small radius button">Edit</a></td>
			</tr>
			-->
		    </table>
		</div>
	    </div>
	</div>

	<p class="footer">Page rendered in <strong>{elapsed_time}</strong> seconds. <?php echo  (ENVIRONMENT === 'development') ?  'CodeIgniter Version <strong>' . CI_VERSION . '</strong>' : '' ?></p>
