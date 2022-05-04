BEGIN {dir="";}
tolower($0)~".jpg" {printf "%10.10i %s\n", $1, $2;}
#$0~".jpg" {print $1 " " $2;}
# NF==1 {dir=substr($0,1,length($0)-1);}
# $1!~"total" && $2 !~ "/" && NF==2 {print $1 " " dir "/" $2;}

