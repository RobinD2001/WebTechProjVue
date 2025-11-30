<script setup>
	import { ref, reactive, computed } from "vue";
	import GridVisualizer from "@/components/admin/GridVisualizer.vue";
	import { addCrosswordToDB } from "@/composables/useXW";

	const clues = ref([]);
	const today = new Date().toISOString().split("T")[0];
	const releaseDate = ref(today);
	const isPublic = ref(false);
	const showAlert = ref(false);
	const alertVariant = ref("success");
	const alertMessage = ref("");
	const newClue = reactive({
		clue: "",
		answer: "",
		row: "",
		col: "",
		down: false,
	});

	const gridForViz = computed(() => {
		const { rows, cols, cells } = buildGrid(clues.value);
		return { rows, cols, cells };
	});

	function buildGrid(clueList) {
		if (!clueList.length) return { rows: 0, cols: 0, cells: [], startNumbers: new Map() };

		let maxRow = 0;
		let maxCol = 0;

		clueList.forEach((c) => {
			const length = c.answer.length || 0;
			if (length === 0) return;
			const endRow = c.down ? c.row + length - 1 : c.row;
			const endCol = c.down ? c.col : c.col + length - 1;
			maxRow = Math.max(maxRow, endRow);
			maxCol = Math.max(maxCol, endCol);
		});

		const rows = maxRow + 1;
		const cols = maxCol + 1;
		const cells = Array.from({ length: rows }, () =>
			Array.from({ length: cols }, () => ({
				isBlock: true,
				letter: "",
				clueNumber: 0,
				conflict: false,
			}))
		);

		clueList.forEach((c) => {
			const answer = c.answer.toString();
			for (let i = 0; i < answer.length; i++) {
				const row = c.down ? c.row + i : c.row;
				const col = c.down ? c.col : c.col + i;
				if (row >= 0 && col >= 0 && row < rows && col < cols) {
					const cell = cells[row][col];
					const newLetter = answer[i] || "";
					cell.conflict = !cell.isBlock && cell.letter && cell.letter !== newLetter;
					cell.isBlock = false;
					cell.letter = newLetter;
				}
			}
		});

		const startPositions = new Set(clueList.map((c) => `${c.row}-${c.col}`));
		const startNumbers = new Map();
		let clueNumber = 1;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (cells[r][c].isBlock) continue;
				const key = `${r}-${c}`;
				if (startPositions.has(key)) {
					cells[r][c].clueNumber = clueNumber;
					startNumbers.set(key, clueNumber);
					clueNumber++;
				}
			}
		}

		return { rows, cols, cells, startNumbers };
	}

	function updateStartNumbers() {
		const { startNumbers } = buildGrid(clues.value);
		clues.value = clues.value.map((clue) => {
			const key = `${clue.row}-${clue.col}`;
			return { ...clue, start_number: startNumbers.get(key) ?? null };
		});
	}

	function addClue() {
		if (!newClue.clue.trim() || !newClue.answer.trim()) return;

		const row = Number(newClue.row) - 1;
		const col = Number(newClue.col) - 1;
		if (Number.isNaN(row) || Number.isNaN(col)) return;
		if (row < 0 || col < 0) return;

		clues.value.push({
			clue: newClue.clue.trim(),
			answer: newClue.answer.trim(),
			row,
			col,
			down: newClue.down,
			start_number: null,
		});

		updateStartNumbers();
		console.log(clues);

		newClue.clue = "";
		newClue.answer = "";
		newClue.row = "";
		newClue.col = "";
		newClue.down = false;
	}

	function deleteClue(index) {
		clues.value.splice(index, 1);
		updateStartNumbers();
	}

	function openAlert(variant, message) {
		alertVariant.value = variant;
		alertMessage.value = message;
		showAlert.value = true;
	}

	async function submitCrossword() {
		if (!clues.value.length) return;
		updateStartNumbers();
		try {
			const res = await addCrosswordToDB({
				clues: clues.value,
				releaseDate: releaseDate.value,
				isPublic: isPublic.value,
			});
			openAlert("success", res?.message || "Crossword uploaded successfully.");
			clues.value = [];
		} catch (err) {
			openAlert("danger", err?.message || "Upload failed. Please try again.");
		}
	}
</script>

<template>
	<section class="p-4">
		<BAlert :model-value="showAlert" :variant="alertVariant" dismissible @dismissed="showAlert = false">
			{{ alertMessage }}
		</BAlert>
		<BListGroup class="mb-4">
			<BListGroupItem
				v-for="(clue, index) in clues"
				:key="`${clue.clue}-${index}`"
				class="d-flex align-items-center justify-content-between gap-3">
				<div>
					<div class="fw-semibold">{{ clue.clue }}</div>
					<small class="text-muted">
						{{ clue.down ? "Down" : "Across" }} • Ans: {{ clue.answer }} • Row
						{{ clue.row + 1 }} • Col {{ clue.col + 1 }}
					</small>
				</div>
				<BButton size="sm" variant="outline-danger" @click="deleteClue(index)">
					Delete
				</BButton>
			</BListGroupItem>
			<BListGroupItem v-if="!clues.length" class="text-muted">
				No clues added yet.
			</BListGroupItem>
		</BListGroup>

		<BRow class="p-5">
			<GridVisualizer class="col mx-6" :grid="gridForViz"></GridVisualizer>
			<BForm class="col-6 mx-4" @submit.prevent="addClue">
				<BInputGroup class="mb-3">
					<BInputGroupText>Clue</BInputGroupText>
					<BFormInput v-model="newClue.clue" required />
				</BInputGroup>
				<BInputGroup class="mb-3">
					<BInputGroupText>Answer</BInputGroupText>
					<BFormInput v-model="newClue.answer" required />
				</BInputGroup>
				<BRow class="mb-3">
					<BCol>
						<BInputGroup>
							<BInputGroupText>Row</BInputGroupText>
							<BFormInput v-model="newClue.row" type="number" min="1" required />
						</BInputGroup>
					</BCol>
					<BCol>
						<BInputGroup>
							<BInputGroupText>Col</BInputGroupText>
							<BFormInput v-model="newClue.col" type="number" min="1" required />
						</BInputGroup>
					</BCol>
				</BRow>
				<BFormCheckbox v-model="newClue.down" switch class="mb-3">
					Down clue (unchecked = Across)
				</BFormCheckbox>
				<BButtonGroup class="d-flex gap-2 mb-3 mt-4">
					<BButton type="submit" class="w-50">Add to Crossword</BButton>
					<BButton @click="submitCrossword" type="button" class="bg-warning text-dark"
						>Upload to Database</BButton
					>
				</BButtonGroup>
				<BRow class="mb-3">
					<BCol>
						<BInputGroup>
							<BInputGroupText>Release date</BInputGroupText>
							<BFormInput v-model="releaseDate" type="date" />
						</BInputGroup>
					</BCol>
					<BCol class="d-flex align-items-center">
						<BFormCheckbox v-model="isPublic" switch> Public crossword </BFormCheckbox>
					</BCol>
				</BRow>
			</BForm>
		</BRow>
	</section>
</template>
