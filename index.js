var start = document.getElementById("start");
var stop = document.getElementById("stop");
var timer = document.getElementById("timer");
var startTime;
var currentTime;
var minutes = 5;
var seconds = 0;

function starte()
{	
	startTime = new Date().getTime();
	currentTime = startTime;
	timer.innerHTML = "5:00";
	minutes = 4;
	seconds = 59;
	setInterval(run, 1000);
}

function stope()
{	
	console.log("stp[");
	clearInterval();
}

function run()
{	
	if(seconds < 10)
	{
		timer.innerHTML = minutes + ":" + "0" + seconds;//(seconds.toFixed(2));
	}
	timer.innerHTML = minutes + ":" + seconds;//(seconds.toFixed(2));
	seconds--;
	if(seconds < 1)
	{
		minutes--;
		seconds = 59;
	}
	if(minutes < 0)
	{
		minutes = 5;
		seconds = 0;
	}
}
