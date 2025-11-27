<script setup>
	import ClueList from "@/components/xw/ClueList.vue";
	import { reactive } from "vue";

	const gridSize = reactive({ x: 4, y: 4 });

	const props = defineProps({
		selectedDownId: Number,
		selectedAcrossId: Number,
	});
	const emit = defineEmits(["gridCalculated", "clueSelected"]);

	const allClues = reactive([
		{ id: 0, x: 0, y: 0, length: 3, body: "Place for relaxation", across: true },
		{ id: 0, x: 0, y: 2, length: 4, body: "... Legends", across: true },
		{ id: 0, x: 1, y: 0, length: 4, body: "Leader of church", across: false },
		{ id: 0, x: 0, y: 0, length: 4, body: "Marvel founder Lee", across: false },
		{ id: 0, x: 3, y: 1, length: 3, body: "Tool of a lumberjack", across: false },
	]);

	const acrossClues = reactive([]);
	const downClues = reactive([]);

	function setIds() {
		allClues.sort((a, b) => a.y * gridSize.x + a.x - (b.y * gridSize.x + b.x));

		let sameCellClues = 0;
		for (let i = 0; i < allClues.length; i++) {
			allClues[i].id = i - sameCellClues;

			if (
				i > 0 &&
				allClues[i].x === allClues[i - 1].x &&
				allClues[i].y === allClues[i - 1].y
			) {
				allClues[i].id--;
				sameCellClues++;
			}

			const clueNumber = allClues[i].id + 1;

			if (allClues[i].across) {
				acrossClues.push({ id: clueNumber, body: allClues[i].body });
			} else {
				downClues.push({ id: clueNumber, body: allClues[i].body });
			}
		}
	}
	setIds();

	function computeGrid() {
		const rows = gridSize.y;
		const cols = gridSize.x;

		const clueNumberGrid = [];
		const acrossIdGrid = [];
		const downIdGrid = [];

		for (let r = 0; r < rows; r++) {
			clueNumberGrid.push(Array(cols).fill(0));
			acrossIdGrid.push(Array(cols).fill(null));
			downIdGrid.push(Array(cols).fill(null));
		}

		for (const clue of allClues) {
			const clueNumber = clue.id + 1;
			const { x, y, length, across } = clue;

			clueNumberGrid[y][x] = clueNumber;

			if (across) {
				for (let dx = 0; dx < length; dx++) {
					acrossIdGrid[y][x + dx] = clue.id + 1;
				}
			} else {
				for (let dy = 0; dy < length; dy++) {
					downIdGrid[y + dy][x] = clue.id + 1;
				}
			}
		}

		emit("gridCalculated", {
			size: { rows, cols },
			clueNumbers: clueNumberGrid,
			acrossIds: acrossIdGrid,
			downIds: downIdGrid,
		});
	}
	computeGrid();

	function setClue(c, downSelected) {
		emit("clueSelected", { down: downSelected, id: c.id });
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
						'bg-warning': props.selectedAcrossId == clue.id,
						'cursor-pointer': true,
					}">
					<strong>{{ clue.id }}.</strong> {{ clue.body }}
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
						'bg-warning': props.selectedDownId == clue.id,
						'cursor-pointer': true,
					}">
					<strong>{{ clue.id }}.</strong> {{ clue.body }}
				</BListGroupItem>
			</BListGroup>
		</BRow>
	</BCol>
</template>
