/*
* Author: Wayne Ho
* Mail: hewr2010@gmail.com
* Time: Tue 14 Oct 2014 02:39:09 PM CST
* Purpose: Simple Server for Streaming Video (from StackOverflow)
*/

var http = require('http');
var fs = require('fs');
var util = require('util');
var url = require("url");
var request = require("request");
var path = require("path")

var host = "0.0.0.0", port = "8000";
var hosturl = "http://" + host + ":" + port + "/";
var rootdir = "."
var exts = ["mp4", "ts", "rmvb", "mkv"];

http.createServer(function(req, res) {
	var video_name = url.parse(req.url).pathname;
	var ext = path.extname(video_name).substr(1);
	if (exts.indexOf(ext) < 0) {
		fs.readdir(rootdir, function(err, files) {
			if (err) return done(err);
			content = "";
			files.forEach(function(fn) {
				if (exts.indexOf(path.extname(fn).substr(1)) >= 0) 
					content += "<a href='/" + fn + "'>" + fn + "</a><br>";
			});
			res.writeHeader(200, {"Content-Type": "text/html"});
			res.write(content);
			res.end();
		});
	} else {
		var fn = rootdir + video_name;
		console.log(path);
		var stat = fs.statSync(fn);
		if (req.headers['range']) {
			var ranges = req.headers.range.replace(/bytes=/, "").split("-");
			var start = parseInt(ranges[0], 10);
			var end = ranges[1] ? parseInt(ranges[1], 10) : stat.size - 1;
			var chunksize = (end - start) + 1;
			console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);
			var file = fs.createReadStream(fn, {start: start, end: end});
			res.writeHead(206, {'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size,
								'Content-Length': chunksize,
								'Accept-Ranges': 'bytes',
								'Content-Type': 'video/mp4' });
			file.pipe(res);
		} else {
			console.log('ALL: ' + stat.size);
			res.writeHead(200, {'Content-Length': stat.size,
								'Content-Type': 'video/mp4' });
			fs.createReadStream(fn).pipe(res);
		}
	}
}).listen(port, host);
console.log("server running at " + hosturl);
