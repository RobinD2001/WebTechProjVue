import { ref, computed, onMounted, onBeforeUnmount } from "vue";

export function useCrosswordTimer() {
	const countdownSeconds = ref(3);
	const isCountingDown = ref(true);
	const elapsedMs = ref(0);
	let countdownInterval = null;
	let elapsedInterval = null;

	const timerDisplay = computed(() => {
		if (isCountingDown.value) {
			return countdownSeconds.value.toString();
		}
		return new Date(elapsedMs.value).toISOString().substring(11, 19);
	});

	const timerClass = computed(() => (isCountingDown.value ? "countdown" : "running"));

	function clearIntervals() {
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = null;
		}
		if (elapsedInterval) {
			clearInterval(elapsedInterval);
			elapsedInterval = null;
		}
	}

	function startElapsed() {
		const startedAt = Date.now();
		elapsedMs.value = 0;
		elapsedInterval = setInterval(() => {
			elapsedMs.value = Date.now() - startedAt;
		}, 1000);
	}

	function startCountdown() {
		clearIntervals();
		countdownSeconds.value = 3;
		isCountingDown.value = true;

		countdownInterval = setInterval(() => {
			countdownSeconds.value -= 1;
			if (countdownSeconds.value <= 0) {
				countdownSeconds.value = 0;
				clearInterval(countdownInterval);
				countdownInterval = null;
				isCountingDown.value = false;
				startElapsed();
			}
		}, 1000);
	}

	function stopTimer() {
		clearIntervals();
	}

	onMounted(() => {
		startCountdown();
	});

	onBeforeUnmount(() => {
		clearIntervals();
	});

	return {
		timerDisplay,
		timerClass,
		isCountingDown,
		elapsedMs,
		startCountdown,
		stopTimer,
	};
}
