import { ref, computed, onBeforeUnmount } from "vue";

export function useCrosswordTimer() {
	const elapsedMs = ref(0);
	let elapsedInterval = null;

	const timerDisplay = computed(() => new Date(elapsedMs.value).toISOString().substring(11, 19));
	const timerClass = computed(() => "running");

	function clearIntervals() {
		if (elapsedInterval) {
			clearInterval(elapsedInterval);
			elapsedInterval = null;
		}
	}

	function startTimer() {
		clearIntervals();
		const startedAt = Date.now();
		// Reset whenever a new crossword loads so elapsed time belongs to the active puzzle.
		elapsedMs.value = 0;
		elapsedInterval = setInterval(() => {
			elapsedMs.value = Date.now() - startedAt;
		}, 1000);
	}

	function stopTimer() {
		clearIntervals();
	}

	onBeforeUnmount(() => {
		clearIntervals();
	});

	return {
		timerDisplay,
		timerClass,
		elapsedMs,
		startTimer,
		stopTimer,
	};
}
