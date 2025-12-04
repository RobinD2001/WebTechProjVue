<script setup>
	import { ref, computed, onMounted, watch } from "vue";
	import { getPrivateXWs, updateCrossword, getXWFromDate } from "@/composables/useXW";
	import { useGridFactory } from "@/composables/xw/useGridFactory";

	const props = defineProps({
		modelValue: Boolean,
		selectedDate: {
			type: String,
			default: "",
		},
	});
	const emit = defineEmits(["update:modelValue", "added"]);
	const onUpdate = (val) => emit("update:modelValue", val);

	const loading = ref(false);
	const error = ref(null);
	const crosswords = ref([]);
	const workingIds = ref(new Set());
	const selectedId = ref(null);
	const clues = ref([]);
	const previewLoading = ref(false);
	const previewError = ref(null);

	const sortedCrosswords = computed(() =>
		[...crosswords.value].sort((a, b) => a.release_date.localeCompare(b.release_date))
	);

	const selectedCrossword = computed(
		() => sortedCrosswords.value.find((cw) => cw.id === selectedId.value) || null
	);

	const { grid, gridSize, setGrid } = useGridFactory();

	const cellSize = computed(() => {
		if (!gridSize.cols) return 36;
		return 180 / gridSize.cols;
	});

	function buildPayloadFromClues(list) {
		if (!list.length) {
			return {
				size: { rows: 0, cols: 0 },
				clueNumbers: [],
				acrossIds: [],
				downIds: [],
			};
		}

		let rows = 0;
		let cols = 0;

		for (const clue of list) {
			const len = (clue.answer ?? "").length;
			if (clue.is_across) {
				rows = Math.max(rows, clue.row + 1);
				cols = Math.max(cols, clue.col + len);
			} else {
				rows = Math.max(rows, clue.row + len);
				cols = Math.max(cols, clue.col + 1);
			}
		}

		const clueNumbers = Array.from({ length: rows }, () => Array(cols).fill(0));
		const acrossIds = Array.from({ length: rows }, () => Array(cols).fill(null));
		const downIds = Array.from({ length: rows }, () => Array(cols).fill(null));

		for (const clue of list) {
			const len = (clue.answer ?? "").length;
			if (len === 0) continue;

			if (clue.is_across) {
				for (let i = 0; i < len; i++) {
					acrossIds[clue.row][clue.col + i] = clue.id ?? clue.start_number;
					if (i === 0) clueNumbers[clue.row][clue.col + i] = clue.start_number;
				}
			} else {
				for (let i = 0; i < len; i++) {
					downIds[clue.row + i][clue.col] = clue.id ?? clue.start_number;
					if (i === 0) clueNumbers[clue.row + i][clue.col] = clue.start_number;
				}
			}
		}

		return {
			size: { rows, cols },
			clueNumbers,
			acrossIds,
			downIds,
		};
	}

	async function loadCrosswords() {
		loading.value = true;
		error.value = null;
		try {
			const list = await getPrivateXWs();
			crosswords.value = list || [];
		} catch (err) {
			console.error(err);
			error.value = "Could not load private crosswords.";
			crosswords.value = [];
		} finally {
			loading.value = false;
		}
	}

	async function handleAdd(cw) {
		if (workingIds.value.has(cw.id)) return;
		workingIds.value.add(cw.id);
		try {
			console.log(cw.id, props.selectedDate);

			await updateCrossword(cw.id, true, props.selectedDate || cw.release_date);
			crosswords.value = crosswords.value.filter((c) => c.id !== cw.id);
			emit("added", cw);
			if (selectedId.value === cw.id) {
				selectedId.value = null;
			}
		} catch (err) {
			console.error(err);
			error.value = "Could not update crossword.";
		} finally {
			workingIds.value.delete(cw.id);
		}
	}

	async function loadPreviewForSelected() {
		if (!selectedCrossword.value) {
			clues.value = [];
			setGrid({ size: { rows: 0, cols: 0 }, clueNumbers: [], acrossIds: [], downIds: [] });
			return;
		}

		previewLoading.value = true;
		previewError.value = null;
		try {
			clues.value = await getXWFromDate(selectedCrossword.value.release_date);
			const payload = buildPayloadFromClues(clues.value);
			setGrid(payload);
		} catch (err) {
			console.error(err);
			previewError.value = "Could not load preview.";
			clues.value = [];
			setGrid({ size: { rows: 0, cols: 0 }, clueNumbers: [], acrossIds: [], downIds: [] });
		} finally {
			previewLoading.value = false;
		}
	}

	watch(selectedId, loadPreviewForSelected);

	onMounted(loadCrosswords);
</script>

<template>
	<BModal
		:model-value="props.modelValue"
		:title="props.selectedDate"
		@update:model-value="onUpdate"
		ok-only="true"
		ok-title="Close"
		size="xl">
		<div class="mb-2 small text-muted">Tap +Add to publish a crossword.</div>
		<div v-if="loading" class="text-center py-3">Loading…</div>
		<div v-else class="d-flex gap-3 flex-column flex-md-row">
			<div class="flex-fill scroll-area list-area">
				<div v-if="error" class="text-danger small mb-2">{{ error }}</div>
				<div v-if="!sortedCrosswords.length && !error" class="text-muted">
					No private crosswords.
				</div>
				<BListGroup flush v-else>
					<BListGroupItem
						v-for="cw in sortedCrosswords"
						:key="cw.id"
						:active="cw.id === selectedId"
						class="d-flex align-items-center justify-content-between"
						@click="selectedId = cw.id">
						<div class="d-flex flex-column">
							<span class="fw-semibold">{{ cw.release_date.substring(0, 10) }}</span>
							<small class="text-muted">ID: {{ cw.id }}</small>
						</div>
						<BButton
							size="sm"
							variant="primary"
							:disabled="workingIds.has(cw.id)"
							@click.stop="handleAdd(cw)">
							+Add
						</BButton>
					</BListGroupItem>
				</BListGroup>
			</div>
			<div class="flex-fill preview-area">
				<div class="fw-semibold mb-2">
					Preview
					<span v-if="selectedCrossword"
						>({{ selectedCrossword.release_date?.substring(0, 10) }})</span
					>
				</div>
				<div v-if="previewLoading" class="text-center py-3 small text-muted">
					Loading preview…
				</div>
				<div v-else>
					<div v-if="previewError" class="text-danger small mb-2">{{ previewError }}</div>
					<div v-if="!grid.length" class="text-muted small">
						Select a crossword to preview.
					</div>
					<div
						v-else
						class="preview-grid"
						:style="{
							gridTemplateColumns: `repeat(${gridSize.cols}, ${cellSize}px)`,
							gridTemplateRows: `repeat(${gridSize.rows}, ${cellSize}px)`,
						}">
						<div
							v-for="cell in grid.flat()"
							:key="`${cell.row}-${cell.col}`"
							:class="['cell', { block: cell.isBlock }]">
							<span v-if="cell.clueNumber" class="clue-number">{{
								cell.clueNumber
							}}</span>
						</div>
					</div>
					<div v-if="clues.length" class="mt-3 clues">
						<div class="fw-semibold mb-1">Clues</div>
						<div class="clue-list">
							<div v-for="clue in clues" :key="clue.id" class="small">
								<strong>{{ clue.start_number }}.</strong> {{ clue.clue }}
								{{ clue.question + ": " + clue.answer || 0 }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</BModal>
</template>

<style scoped>
	.scroll-area {
		max-height: 320px;
		overflow-y: auto;
	}

	.list-area {
		min-width: 220px;
	}

	.preview-area {
		min-width: 240px;
	}

	.preview-grid {
		display: grid;
		gap: 2px;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 6px;
		background: var(--card);
	}

	.cell {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fdfaf3;
		border: 1px solid var(--border);
		border-radius: 4px;
	}

	.cell.block {
		background: #262626;
		border-color: #1c1c1c;
	}

	.clue-number {
		position: absolute;
		top: 2px;
		left: 3px;
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--muted);
	}

	.clue-list {
		max-height: 140px;
		overflow-y: auto;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 8px;
		background: var(--card);
	}
</style>
