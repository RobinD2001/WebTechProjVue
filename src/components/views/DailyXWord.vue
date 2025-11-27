<script setup>
	import CrosswordApp from "@/components/xw/CrosswordApp.vue";
</script>

<template>
	<h1>Crossword Demo</h1>
	<br />
	<CrosswordApp />
</template>

<style scoped>
	.cell--selected {
		fill: blue;
		border: 5px solid black;
	}

	.cell {
		stroke-width: 3;
		stroke: black;
	}
</style>
