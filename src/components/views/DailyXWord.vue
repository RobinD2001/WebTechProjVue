<script setup>
	import CrosswordApp from "@/components/xw/CrosswordApp.vue";
	import { computed } from "vue"
	const todayDate = computed(() => new Date());
	const todayIso = computed(() => todayDate.value.toISOString().split("T")[0]);
	const todayLabel = computed(() => todayDate.value.toLocaleDateString());
</script>

<template>
	<h1>
		Crossword of the day:
		<time :datetime="todayDate" aria-label="Today's crossword date">{{ todayLabel }}</time>
	</h1>
	<br />

	<CrosswordApp :date="todayIso" />
</template>


