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
			const raw = val || "";
			const next = raw.slice(-1).toUpperCase(); // always keep most recent character
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
			"bg-warning": props.cell.isHighlighted,
			"bg-info": isSelected.value,
		};
	});

	function interacted() {
		isSelected.value = !isSelected.value;
	}
</script>
<template>
	<div class="xw_cell_wrapper">
		<div v-if="!cell.isBlock" @click="interacted">
			<div v-if="props.cell.clueNumber != 0" class="xw-cell-clue">
				{{ props.cell.clueNumber }}
			</div>
			<BFormInput
				ref="inputRef"
				v-model="displayValue"
				maxlength="1"
				:class="cellClasses"
				@keydown="onKeydown"
				@keydown.tab.prevent />
		</div>
	</div>
</template>

<style scoped>
	.xw-cell_wrapper {
		width: 100%;
		height: 100%;
		aspect-ratio: 1 / 1;
		cursor: pointer;
	}

	.xw-cell-input {
		height: 100%;
		font-weight: bold;
		text-transform: uppercase;
		padding: 0;
		padding-top: 0.3em;
		text-align: center;
		font-size: 5.25rem;
		caret-color: transparent;
		cursor: pointer;
	}

	.xw-cell-clue {
		position: absolute;
		margin: 0.5em;
		font-size: 2.3em;
	}
</style>
