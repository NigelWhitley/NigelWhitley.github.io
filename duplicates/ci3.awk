BEGIN {file_size="0";
image_count=0;
group_count=0;
file_count=0;
duplicate_count=0;
print "<?xml version='1.0'?>"
print "<duplicates>";
}

# When file size changes
$1!=file_size {
if (image_count > 0) {
  #print image_count " images of size " file_size;
  diff_files();
  }
#print "changing file_size from " file_size " to " $1;
file_size=$1;
delete images;
image_count=0;
}

#Store the file name
{image_count=image_count+1;
 images[image_count]=$2;
}

END {
#print "final file_size" $1;
diff_files();
file_size=$1;
image_count=0;
print "</duplicates>";
}

function save_matching_index(matched_image_index)
{
    matching_image_count++;
    matching_index[matching_image_count]=matched_image_index;
}

function diff_files ()
{
while (length(images)>0) {
matching_image_count=0;
for (image_index in images)
  {
  #print "image for " image_index " is " images[image_index];
  if (matching_image_count==0)
    {
    #print "Record first image as image " image_index;
    save_matching_index(image_index);
    base_image_index=image_index;
    #matching_image_count++;
    #matching_index[matching_image_count]=image_index;
    }
  else
    {
    #print "Check difference between "  images[base_image_index] " and " images[image_index];
    differs=system("./ci3.sh " images[image_index] " " images[base_image_index]);
    if ( differs == 0 )
      {
      save_matching_index(image_index);
      #matching_image_count++;
      #matching_index[matching_image_count]=image_index;
      }
    }
  }

#Only print sets of files which match, not individuals with no matches
if (length(matching_index)>1) {
#print length(matching_index) " files matched";
  group_count++;
  duplicate_count=0;
  print "<duplicated_image group_id=\"" group_count "\">";
  single_line="";
  #file_delimiter=""
  for (image_index in matching_index)
    {
    file_count++; #Used for unique id for files across groups
    duplicate_count++; #Used for unique id for files within groups
    #print "Matched index " matching_index[image_index] " is image " images[matching_index[image_index]];
    print "<file file_id=\"" file_count "\" duplicate_id=\"" duplicate_count "\">" images[matching_index[image_index]] "</file>";
    #single_line=single_line file_delimiter images[matching_index[image_index]];
    delete images[matching_index[image_index]];
    #file_delimiter=";";
    }

  print "</duplicated_image>";
  #print single_line;
  }
else
  {
  #print length(matching_index) " files matched";
  delete images[base_image_index];
  }

#print length(images) " remaining";
delete matching_index;
}

}

function delarray (array1)
{
for (index1 in array1)
  {
  delete array1[index1];
  }
}
