import { ref, computed, watch, nextTick } from "vue";

export function useCellInput(props, emit) {
	const inputRef = ref(null);

	const displayValue = computed({
		get() {
			return props.cell.value;
		},
		set(val) {
			const prev = props.cell.value;
			const next = val || "";
			emit("update:value", next);
			if (next) {
				emit("typed", { previous: prev, current: next });
			}
		},
	});

	const isSelected = computed({
		get() {
			return props.cell.isSelected;
		},
		set() {
			emit("update:isSelected", true);
		},
	});

	function onBeforeInput(e) {
		// If full and user types another character, replace the value manually
		if (props.cell.value && e.data && e.inputType === "insertText") {
			e.preventDefault();
			emit("update:value", e.data);
			emit("typed", { previous: props.cell.value, current: e.data });
		}
	}

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

	function onTab() {
		interacted();
	}

	function interacted() {
		isSelected.value = !isSelected.value;
	}

	watch(
		() => props.isActive,
		(active) => {
			if (active) {
				nextTick(() => {
					if (inputRef.value) {
						inputRef.value.focus();
						inputRef.value.select?.();
					}
				});
			}
		},
		{ immediate: true }
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

	const cellAriaLabel = computed(() => {
		const rowNumber = props.cell.row + 1;
		const colNumber = props.cell.col + 1;
		const clueInfo = props.cell.clueNumber ? `, clue ${props.cell.clueNumber}` : "";
		const contentState = props.cell.value ? `, contains '${props.cell.value}'` : ", empty";
		return `Crossword cell row ${rowNumber}, column ${colNumber}${clueInfo}${contentState}`;
	});

	return {
		inputRef,
		displayValue,
		isSelected,
		cellClasses,
		cellAriaLabel,
		onBeforeInput,
		onKeydown,
		onTab,
		interacted,
	};
}
