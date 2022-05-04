    
    <div class="row">
      <div class="large-12 columns">
        <h1>All Persons</h1>
      </div>
    </div>
    
    <div class="row">
      <div>
	<table  class="large-12 columns" role="grid">
	  <tr class="row">
	    <th class="large-4 columns">First Name</th>
	    <th class="large-6 columns">Last Name</th>
	    <th class="large-2 columns">Actions</th>
	  </tr>
	  <!--
	  <tr>
	    <th >First Name</th>
	    <th >Last Name</th>
	    <th >Actions</th>
	  </tr>
	  -->
<?php
	  foreach ($data as $row)
	  {
?>
	    <tr class="row">
	      <td class="large-4 columns">$row->given_name</td>
	      <td class="large-6 columns">$row->family_name</td>
	      <td class="large-2 columns"><a href="#" class="small radius button">Edit</a></td>
	    </tr>
<?php
	  }
?>
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
    
    <div class="row">
	<?php echo anchor('person/add/' . $groupId, 'Add', array('class' => 'radius button')); ?>
    </div>
    <!--
    <script src="js/vendor/jquery.js"></script>
    <script src="js/foundation.min.js"></script>
    <script>
      $(document).foundation();
    </script>
    -->
