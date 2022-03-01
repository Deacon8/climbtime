var start = document.getElementById("start");
var stop = document.getElementById("stop");
var timer = document.getElementById("timer");
const date = Date();
var startTime;
var currentTime;

function start()
{	
	startTime = date.getTime();
	currentTime = startTime;
	timer.innerHTML = 5-(currentTime/1000-startTime/1000);
	setInterval(run(), 1000);
	console.log("ssss");
}

function stop()
{
	
}

function run()
{	
	currentTime = date.getTime();
	timer.innerHTML = 5-(currentTime/1000-startTime/1000);
}
