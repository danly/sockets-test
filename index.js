var express=require("express"),
	app=express(),
	ejs=require("ejs"),
	http=require("http").Server(app),
	path=require("path"),
	bodyParser=require("body-parser"),
	// server=require("http").Server(app),
	io=require("socket.io")(http);

// server.listen(9001);
// body parser config
app.set('view engine', 'ejs')
	.use(express.static(path.join(__dirname,"node_modules")))
	.use(bodyParser.urlencoded({extended: true}));
app.get("/", function (req, res){
	res.locals.test="does this work?";
	res.render('index');
	io.on('connection', function (socket){
		console.log('a user connected');
		socket.on('disconnect', function(){
			console.log('user disconnected');
		});
		socket.on('chat message', function(msg){
			console.log('message: ' + msg);
			io.emit('chat message', msg);
		});
	});
});
app.get("/ns/:id", function (req, res){
	res.locals.foo="cceas";
	res.render('room');
	io.of("/ns/"+req.params.id).on('connection', function (socket){
		console.log("FROM NAMESPACE");
		socket.on('chat message', function(msg){
			console.log('message: ' + msg);
			io.emit('chat message', msg);
		});
	});
});
// new room
http.listen(process.env.PORT || 9000, function (){
	console.log("listening on port 9000");
});