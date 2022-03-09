 
// The timer isn't 100% accurate, can swing +/-4ms

const calcMs = (minutes, seconds) => (minutes * 60 + seconds) * 1000

const CYCLE_MS = calcMs(MINUTES, SECONDS)

var TimeAdd = 0;
var isPaused = false;

const playSound = url => {
	const a = new Audio(url)

	a.play()
}

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
let timeEvents = [
	/*
	// Example of TimeEvent working near 1000ms
	new TimeEvent(1000, (timeLeft) => {
		console.log(`Time left: ${timeLeft}`)
	}),

	// Example of TimeEvent working near 0ms
	new TimeEvent(0, () => {
		console.log("About to reset")
	})*/

	new TimeEvent(calcMs(1, 1), () => {
		playSound('sounds/1min.mp3')
	}),

	new TimeEvent(calcMs(0, 0.5), () => {
		playSound('sounds/finish.mp3')
	}),

	new TimeEvent(calcMs(0, 6), () => {
		playSound('sounds/54321.mp3')
	}),

	new TimeEvent(calcMs(0, 5), () => {
		playSound('sounds/54321.mp3')
	}),

	new TimeEvent(calcMs(0, 4), () => {
		playSound('sounds/54321.mp3')
	}),

	new TimeEvent(calcMs(0, 3), () => {
		playSound('sounds/54321.mp3')
	}),

	new TimeEvent(calcMs(0, 2), () => {
		playSound('sounds/54321.mp3')
	}),
]

if (MINUTES >= 5) {
	timeEvents.push(new TimeEvent(calcMs(5, 0), () => {
		playSound('sounds/1min.mp3')
	}))
}

const main = () => {
	// Date started
	let startDate
	// Paused time stored
	let pauseTime

	// Timer is running
	let isRunning = false
	// Timer is/was paused
	let wasPaused = false

	let resetInterval = undefined

	const start = () => {
		timeEvents.forEach(timeEvent => {
			timeEvent.reset()
		})

		startDate = Date.now()

		isRunning = true
	}

	const pause = () => {
		if (wasPaused) return

		wasPaused = true

		isRunning = false

		pauseTime = Date.now() - startDate

		clearInterval(resetInterval)
	}

	const reset = () => {
		if (isRunning) {
			timeEvents.forEach(timeEvent => {
				timeEvent.fire(0)
			})
			
			// why tf does this work
			start()
		}
	}

	const startBtn = document.querySelector('#start')
	const stopBtn = document.querySelector('#stop')
	const pauseBtn = document.querySelector('#pause')

	const timerText = document.querySelector('#timer')

	startBtn.addEventListener('click', () => {
		if (wasPaused) {
			const timeLeft = CYCLE_MS - pauseTime

			startDate = Date.now() - pauseTime

			setTimeout(() => {
				reset()

				resetInterval = setInterval(reset, CYCLE_MS)
			}, timeLeft)

			wasPaused = false

			isRunning = true
		} else {
			clearInterval(resetInterval)

			start()
			// Automatically reset timer
			resetInterval = setInterval(reset, CYCLE_MS)
		}
	})
	
	pauseBtn.addEventListener('click', () => {
		pause()
	})

	stopBtn.addEventListener('click', () => {
		isRunning = false

		wasPaused = false

		clearInterval(resetInterval)
	})
	
	// Meat and potatoes function runs every 200ms,
	// updates the timer and checks that it hasn't stopped
	setInterval(() => {	
		// Get the time left in the cycle if running, or reset if stopped	
		const timeLeft = () => {
			if (isRunning) {
				return startDate + CYCLE_MS - Date.now()
			} else if (wasPaused) {
				return CYCLE_MS - pauseTime
			} else {
				return CYCLE_MS
			}
		}

		let left = timeLeft() + TimeAdd

		// Is slow but works enough
		timeEvents.forEach(timeEvent => {
			timeEvent.fire(left)
		})

		left = timeLeft()
				
		// Format as date to get helper functions
		const dateLeft = new Date(left)

		const mins = dateLeft.getMinutes()

		// padStart changes 0 to 00, so 5 minutes shows as 5:00
		const secs = String(dateLeft.getSeconds()).padStart(2, '0')
		
		const timerContent = `${mins}:${secs}`

		timerText.textContent = timerContent
	}, 200)
	
}

// Very precise timing because why not
setTimeout(() => {
	main()
}, new Date(Date.now()).getMilliseconds() % 200)
