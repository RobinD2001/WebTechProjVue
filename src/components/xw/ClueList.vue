<script setup>
	import { computed, ref, watch } from "vue";

	const props = defineProps({
		selectedDownId: Number,
		selectedAcrossId: Number,
		clues: Array,
	});
	const emit = defineEmits(["gridCalculated", "clueSelected"]);

	const acrossClues = ref([]);
	const downClues = ref([]);
	const allClues = ref([]);

	const gridSize = computed(() => {
		if (allClues.value.length == 0) return { rows: 0, cols: 0 };

		let bounds = { rows: 0, cols: 0 };

		for (const c of allClues.value) {
			let clueEnd = c.is_across
				? { row: c.row, col: c.col + c.answer.length }
				: { row: c.row + c.answer.length, col: c.col };

			bounds.rows = Math.max(bounds.rows, clueEnd.row);
			bounds.cols = Math.max(bounds.cols, clueEnd.col);
		}

		return { rows: bounds.rows, cols: bounds.cols };
	});

	function setIds() {
		allClues.value.sort(
			(a, b) => a.y * gridSize.value.cols + a.x - (b.y * gridSize.value.cols + b.x)
		);

		let sameCellClues = 0;
		for (let i = 0; i < allClues.value.length; i++) {
			allClues.value[i].id = i - sameCellClues;

			if (
				i > 0 &&
				allClues.value[i].x === allClues.value[i - 1].x &&
				allClues.value[i].y === allClues.value[i - 1].y
			) {
				allClues.value[i].id--;
				sameCellClues++;
			}

			const clueNumber = allClues.value[i].id + 1;

			if (allClues.value[i].across) {
				acrossClues.value.push({ id: clueNumber, body: allClues.value[i].body });
			} else {
				downClues.value.push({ id: clueNumber, body: allClues.value[i].body });
			}
		}
	}

	function computeGrid() {
		const { rows, cols } = gridSize.value;

		const clueNumberGrid = [];
		const acrossIdGrid = [];
		const downIdGrid = [];

		for (let r = 0; r < rows; r++) {
			clueNumberGrid.push(Array(cols).fill(0));
			acrossIdGrid.push(Array(cols).fill(null));
			downIdGrid.push(Array(cols).fill(null));
		}
		console.log(acrossIdGrid);

		for (const clue of allClues.value) {
			const { row, col, question, answer, is_across, start_number } = clue;

			clueNumberGrid[row][col] = start_number;

			if (is_across) {
				for (let dx = 0; dx < answer.length; dx++) {
					acrossIdGrid[row][col + dx] = start_number;
				}
				acrossClues.value.push(clue);
			} else {
				for (let dy = 0; dy < answer.length; dy++) {
					downIdGrid[row + dy][col] = start_number;
				}
				downClues.value.push(clue);
			}
		}

		acrossClues.value.sort((a, b) => a.start_number - b.start_number);
		downClues.value.sort((a, b) => a.start_number - b.start_number);

		emit("gridCalculated", {
			size: { rows, cols },
			clueNumbers: clueNumberGrid,
			acrossIds: acrossIdGrid,
			downIds: downIdGrid,
		});
	}

	watch(
		() => props.clues,
		(newClues) => {
			acrossClues.value = [];
			downClues.value = [];
			allClues.value = [...(newClues ?? [])];

			if (allClues.value.length === 0) {
				emit("gridCalculated", {
					size: { rows: 0, cols: 0 },
					clueNumbers: [],
					acrossIds: [],
					downIds: [],
				});
				return;
			}

			//setIds();
			computeGrid();
		},
		{ immediate: true }
	);

	function setClue(c, downCluesSelected) {
		emit("clueSelected", { down: downCluesSelected, id: c.start_number });
	}
</script>

<template>
	<BCol id="xw_clues">
		<BRow class="mb-5">
			<BListGroup>
				<BListGroupItem>
					<h3>Across</h3>
				</BListGroupItem>
				<BListGroupItem
					@click="setClue(clue, false)"
					v-for="clue in acrossClues"
					:class="{
						highlighted: props.selectedAcrossId == clue.start_number,
						'cursor-pointer': true,
					}">
					<strong>{{ clue.start_number }}.</strong> {{ clue.question }}
				</BListGroupItem>
			</BListGroup>
		</BRow>
		<BRow>
			<BListGroup>
				<BListGroupItem>
					<h3>Down</h3>
				</BListGroupItem>
				<BListGroupItem
					@click="setClue(clue, true)"
					v-for="clue in downClues"
					:class="{
						highlighted: props.selectedDownId == clue.start_number,
						'cursor-pointer': true,
					}">
					<strong>{{ clue.start_number }}.</strong> {{ clue.question }}
				</BListGroupItem>
			</BListGroup>
		</BRow>
	</BCol>
</template>

<style scoped>
	.cursor-pointer {
		cursor: pointer;
	}

	.highlighted {
		background-color: #8bb59f;
		border-color: var(--accent-strong);
		color: #0a2016;
		box-shadow: 0 0 0 2px rgba(47, 107, 79, 0.6) inset;
	}
</style>
