<script setup>
	import { useCellInput } from "@/composables/xw/useCellInput";

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

	const {
		inputRef,
		displayValue,
		isSelected,
		cellClasses,
		cellAriaLabel,
		onBeforeInput,
		onKeydown,
		onTab,
		interacted,
	} = useCellInput(props, emit);
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
				@beforeinput="onBeforeInput"
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
		padding-top: 0.9rem;
		text-align: center;
		font-size: 2.5rem;
		caret-color: transparent;
		cursor: pointer;
		border: 3px solid var(--accent);
		border-radius: 10px;
		background-color: #faf8f2;
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
		background-color: #2d4f39;
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
