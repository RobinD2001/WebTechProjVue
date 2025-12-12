<script setup>
	import { computed, ref, watch } from "vue";
	import { useI18n } from "vue-i18n";
	import { buildGridPayloadFromClues, emptyGridPayload } from "@/utils/clueGrid";

	const props = defineProps({
		selectedDownId: Number,
		selectedAcrossId: Number,
		clues: Array,
	});
	const emit = defineEmits(["gridCalculated", "clueSelected"]);

	const acrossClues = ref([]);
	const downClues = ref([]);
	const allClues = ref([]);
	const gridPayload = ref(emptyGridPayload());
	const { t } = useI18n();

	const gridSize = computed(() => {
		return gridPayload.value.size || { rows: 0, cols: 0 };
	});

	watch(
		() => props.clues,
		(newClues) => {
			acrossClues.value = [];
			downClues.value = [];
			allClues.value = [...(newClues ?? [])];

			if (allClues.value.length === 0) {
				gridPayload.value = emptyGridPayload();
				emit("gridCalculated", gridPayload.value);
				return;
			}

			gridPayload.value = buildGridPayloadFromClues(allClues.value);
			acrossClues.value = [...allClues.value.filter((c) => c.is_across)].sort(
				(a, b) => a.start_number - b.start_number
			);
			downClues.value = [...allClues.value.filter((c) => !c.is_across)].sort(
				(a, b) => a.start_number - b.start_number
			);
			emit("gridCalculated", gridPayload.value);
		},
		{ immediate: true }
	);

	function setClue(c, downCluesSelected) {
		emit("clueSelected", { down: downCluesSelected, id: c.start_number });
	}
</script>

<template>
	<div id="xw_clues" :aria-label="$t('crossword.clueListAria')" class="clue-stack">
		<section class="clue-pad tilt-left">
			<div class="clue-pad-header">
				<h3>{{ $t("crossword.across") }}</h3>
			</div>
			<ul class="clue-items" :aria-label="$t('crossword.acrossAria')">
				<li
					v-for="clue in acrossClues"
					:key="`across-${clue.start_number}`"
					:class="{
						highlighted: props.selectedAcrossId == clue.start_number,
						'clue-item': true,
					}"
					role="button"
					tabindex="0"
					:aria-current="props.selectedAcrossId == clue.start_number ? 'true' : undefined"
					@click="setClue(clue, false)"
					@keydown.enter.prevent="setClue(clue, false)"
					@keydown.space.prevent="setClue(clue, false)">
					<span class="clue-number">{{ clue.start_number }}.</span>
					<span class="clue-text"> {{ clue.question }} </span>
				</li>
			</ul>
		</section>
		<section class="clue-pad tilt-right">
			<div class="clue-pad-header">
				<h3>{{ $t("crossword.down") }}</h3>
			</div>
			<ul class="clue-items" :aria-label="$t('crossword.downAria')">
				<li
					v-for="clue in downClues"
					:key="`down-${clue.start_number}`"
					:class="{
						highlighted: props.selectedDownId == clue.start_number,
						'clue-item': true,
					}"
					tag="li"
					role="button"
					tabindex="0"
					:aria-current="props.selectedDownId == clue.start_number ? 'true' : undefined"
					@click="setClue(clue, true)"
					@keydown.enter.prevent="setClue(clue, true)"
					@keydown.space.prevent="setClue(clue, true)">
					<span class="clue-number">{{ clue.start_number }}.</span>
					<span class="clue-text"> {{ clue.question }} </span>
				</li>
			</ul>
		</section>
	</div>
</template>

<style scoped>
	.clue-stack {
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
	}

	.clue-pad {
		position: relative;
		padding: 1.2rem 1.5rem 1.5rem;
		background-color: #f7eed5;
		border: 2px solid #d6ccb2;
		border-radius: 18px;
		box-shadow: 0 18px 26px rgba(35, 79, 58, 0.18);
		overflow: hidden;
	}

	.clue-pad::before {
		content: "";
		position: absolute;
		inset: 0;
		opacity: 0.6;
		pointer-events: none;
	}

	.clue-pad::after {
		content: "";
		position: absolute;
		inset: 0 0 -6px 0;
		border-radius: 18px;
		box-shadow: 0 10px 18px rgba(35, 79, 58, 0.18);
		z-index: -1;
	}

	.tilt-left {
		transform: rotate(-0.5deg);
	}

	.tilt-right {
		transform: rotate(0.5deg);
	}

	.clue-pad-header h3 {
		margin: 0 0 0.35rem;
		color: var(--accent-strong);
		font-size: 1.5rem;
	}

	.clue-items {
		list-style: none;
		padding: 0;
		margin: 0;
		position: relative;
		z-index: 1;
	}

	.clue-item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.6rem;
		align-items: center;
		padding: 0.55rem 0.25rem;
		color: var(--accent-strong);
		border-bottom: 1px solid rgba(45, 79, 57, 0.16);
		cursor: pointer;
		transition: background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
	}

	.clue-item:last-child {
		border-bottom: none;
	}

	.clue-item:hover {
		transform: translateX(2px);
	}

	.clue-number {
		font-weight: 800;
		font-family: var(--font-heading);
	}

	.clue-text {
		font-size: 1.05rem;
		line-height: 1.4;
	}

	.highlighted {
		background-color: rgba(47, 107, 79, 0.12);
		box-shadow: inset 0 0 0 2px rgba(47, 107, 79, 0.45);
		border-radius: 10px;
	}

	@media (max-width: 960px) {
		.tilt-left,
		.tilt-right {
			transform: none;
		}
	}
</style>
