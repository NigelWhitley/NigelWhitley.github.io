BEGIN {file_size="0";
image_count=0;
file_delimiter=";";
print "<?xml version='1.0'?>"
print "<duplicates>";
}

END {
#print "final file_size" $1;
print "</duplicates>";
}

# Split each row into individual files again
{
  split($0, file_list, file_delimiter);
  print "<duplicated_image>";
  for (file_index in file_list)
    {
    #print "Matched index " matching_index[image_index] " is image " images[matching_index[image_index]];
    print "<file>" file_list[file_index] "</file>";
    }

  print "</duplicated_image>";

}

