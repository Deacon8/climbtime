<<<<<<< HEAD

const MINUTES = 0
const SECONDS = 10

const CYCLE_MS = (MINUTES * 60 + SECONDS) * 1000

// Simple event that calls a function if the time needed has expired
const TimeEvent = class {
	/**
	 * Construct a timeEvent
	 *
	 * @param {number} msLeft the amount of milliseconds at which the event should fire
	 * @param {function} callback a function that handles the event firing
	 */
	constructor (msLeft, callback) {
		this.msLeft = msLeft
		this.callback = callback

		this.hasFired = false
	}

	/** 
	 * Fire the event if the time left is less than the event's time, and it hasn't already fired
	 *
	 * @param {number} timeLeft the ms left on the timer
	 */
	fire(timeLeft) {
		if (timeLeft <= this.msLeft && !this.hasFired) {
			this.callback(timeLeft)

			this.hasFired = true
		}
	}
	
	/**
	 * Reset the timeEvent for another round
	 */
	reset () {
		this.hasFired = false
	}
}

// Global list of TimeEvents
const timeEvents = [
	new TimeEvent(100, (timeLeft) => {
		console.log(`Time left: ${timeLeft}`)
	})
]

const main = () => {
	let startDate

	let isRunning = false

	let triggerStart = false

	const start = () => {
		timeEvents.forEach(timeEvent => {
			timeEvent.reset()
		})

		triggerStart = true

		isRunning = true
	}

	const startBtn = document.querySelector('#start')
	const stopBtn = document.querySelector('#stop')

	const timerText = document.querySelector('#timer')

	startBtn.addEventListener('click', () => {
		start()
	})

	stopBtn.addEventListener('click', () => {
		isRunning = false
	})
	
	// Meat and potatoes function runs every 200ms,
	// updates the timer and checks that it hasn't stopped
	setInterval(() => {
		// Normalise start time to 200ms
		if (triggerStart) {
			startDate = Date.now()

			triggerStart = false
		}

		const curr = Date.now()	

		// Get the time left in the cycle if running, or reset if stopped	
		const timeLeft = () => {
			if (isRunning) {
				return startDate + CYCLE_MS - curr
			} else {
				return CYCLE_MS
			}
		}

		// Check that the timer hasn't expired
		if (timeLeft() <= 0) {
			// Automatically restart
			start()
		}

		const left = timeLeft()

		// Is slow but works enough
		timeEvents.forEach(timeEvent => {
			timeEvent.fire(left)
		})
		
		// Format as date to get helper functions
		const dateLeft = new Date(left)

		const mins = dateLeft.getMinutes()

		// padStart changes 0 to 00, so 5 minutes shows as 5:00
		const secs = String(dateLeft.getSeconds()).padStart(2, '0')
		
		const timerContent = `${mins}:${secs}`

		timerText.textContent = timerContent
	}, 200)
=======
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
>>>>>>> 2f088748114d8b379bfcdab9d08d104ddd193ecf
}

//main()

// Very precise timing because why not
setTimeout(() => {
	main()
}, new Date(Date.now()).getMilliseconds % 200)
