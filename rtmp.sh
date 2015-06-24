ffmpeg -re -i "/Users/hewr1993/Movies/2.mp4" -vcodec libx264 -vprofile baseline -acodec aac -ar 44100 -strict -2 -ac 1 -f flv -s 1280x720 -q 10 rtmp://166.111.206.70:1935/myapp/6
