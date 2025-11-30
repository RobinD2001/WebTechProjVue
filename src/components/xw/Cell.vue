<script setup>
	import { ref, computed, watch, nextTick } from "vue";

	const props = defineProps({
		cell: {
			type: Object,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
	});

	const emit = defineEmits(["update:value", "update:isSelected", "typed", "move", "backspace"]);

	const inputRef = ref(null);

	const displayValue = computed({
		get() {
			return props.cell.value;
		},
		set(val) {
			const prev = props.cell.value;
			const next = val || "";
			emit("update:value", next);
			// Only treat as a "typed" action when something is entered
			if (next) {
				emit("typed", { previous: prev, current: next });
			}
		},
	});

	const isSelected = computed({
		get() {
			return props.cell.isSelected;
		},
		set(val) {
			emit("update:isSelected", true);
		},
	});

	function onKeydown(e) {
		if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
			e.preventDefault();
			emit("move", e.key);
			return;
		}
		if (e.key === "Backspace") {
			e.preventDefault();
			emit("backspace");
			return;
		}
	}

	function onTab(){
		console.log("Tab pressed");
		interacted();
	}

	watch(
		() => props.isActive,
		(active) => {
			if (active) {
				nextTick(() => {
					if (inputRef.value) {
						inputRef.value.focus();
						inputRef.value.select?.(); // optional: highlight existing letter
					}
				});
			}
		},
		{ immediate: true } // optional: focus the very first active cell on mount
	);

	const cellClasses = computed(() => {
		return {
			"text-center": true,
			"xw-cell-input": true,
			"xw-cell-highlighted": props.cell.isHighlighted,
			"xw-cell-selected": isSelected.value,
			"xw-cell-block": props.cell.isBlock,
		};
	});

	function interacted() {
		isSelected.value = !isSelected.value;		
	}

	const cellAriaLabel = computed(() => {
		const rowNumber = props.cell.row + 1;
		const colNumber = props.cell.col + 1;
		const clueInfo = props.cell.clueNumber ? `, clue ${props.cell.clueNumber}` : "";
		const contentState = props.cell.value ? `, contains '${props.cell.value}'` : ", empty";
		return `Crossword cell row ${rowNumber}, column ${colNumber}${clueInfo}${contentState}`;
	});
</script>
<template>
	<div class="xw-cell-wrapper" :aria-hidden="cell.isBlock" role="presentation">
		<div
			v-if="!cell.isBlock"
			@click="interacted"
			role="gridcell"
			:aria-selected="isSelected"
			:aria-label="`Grid cell ${cell.row + 1}-${cell.col + 1}`">
			<div v-if="props.cell.clueNumber != 0" class="xw-cell-clue">
				{{ props.cell.clueNumber }}
			</div>
			<BFormInput
				ref="inputRef"
				v-model="displayValue"
				maxlength="1"
				:class="cellClasses"
				:aria-label="cellAriaLabel"
				@keydown="onKeydown"
				@keydown.tab.prevent="onTab" />
		</div>
	</div>
</template>

<style scoped>
	.xw-cell-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;
		cursor: pointer;
	}

	.xw-cell-wrapper > div {
		position: absolute;
		inset: 0;
	}

	.xw-cell-input {
		height: 100%;
		width: 100%;
		font-weight: 800;
		text-transform: uppercase;
		padding: 0;
		text-align: center;
		font-size: 2.5rem;
		caret-color: transparent;
		cursor: pointer;
		border: 3px solid var(--accent);
		border-radius: 10px;
		background-color: var(--card);
		color: var(--accent-strong);
		box-shadow: inset 0 0 0 2px rgba(47, 107, 79, 0.08);
	}

	.xw-cell-highlighted {
		background-color: #8bb59f;
		border-color: var(--accent-strong);
		box-shadow: 0 0 0 3px rgba(47, 107, 79, 0.6);
		color: #113023;
	}

	.xw-cell-selected {
		background-color: #5f8f77;
		border-color: var(--accent-strong);
		box-shadow: 0 0 0 3px rgba(47, 107, 79, 0.75);
		color: #0a2016;
	}

	.xw-cell-block {
		background-color: #2D4F39;
	}

	.xw-cell-clue {
		position: absolute;
		top: 0.4rem;
		left: 0.45rem;
		font-size: 0.85rem;
		color: var(--accent-strong);
		font-weight: 700;
		pointer-events: none;
	}
</style>
