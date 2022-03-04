 
// The timer isn't 100% accurate, can swing +/-4ms

const MINUTES = 0
const SECONDS = 10

const calcMs = (minutes, seconds) => (minutes * 60 + seconds) * 1000

const CYCLE_MS = calcMs(MINUTES, SECONDS)

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
const timeEvents = [
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

	new TimeEvent(calcMs(0, 0), () => {
		playSound('sounds/Finish.mp3')
	}),

	new TimeEvent(calcMs(0, 5), () => {
		playSound('sounds/54331.mp3')
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

	new TimeEvent(calcMs(0, 1), () => {
		playSound('sounds/54321.mp3')
	}),
]

const main = () => {
	let startDate

	let isRunning = false

	let resetInterval = undefined

	const start = () => {
		timeEvents.forEach(timeEvent => {
			timeEvent.reset()
		})

		startDate = Date.now()

		isRunning = true
	}

	const startBtn = document.querySelector('#start')
	const stopBtn = document.querySelector('#stop')

	const timerText = document.querySelector('#timer')

	startBtn.addEventListener('click', () => {
		clearInterval(resetInterval)

		start()

		// Automatically reset timer
		resetInterval = setInterval(() => {
			if (isRunning) {
				// why tf does this work`
				start()

				timeEvents.forEach(timeEvent => {
					timeEvent.fire(0)
				})
			}
		}, CYCLE_MS)

	})

	stopBtn.addEventListener('click', () => {
		isRunning = false

		clearInterval(resetInterval)
	})
	
	// Meat and potatoes function runs every 200ms,
	// updates the timer and checks that it hasn't stopped
	setInterval(() => {	
		// Get the time left in the cycle if running, or reset if stopped	
		const timeLeft = () => {
			if (isRunning) {
				return startDate + CYCLE_MS - Date.now()
			} else {
				return CYCLE_MS
			}
		}

		let left = timeLeft()

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
