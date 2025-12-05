<script setup>
	const props = defineProps({
		modelValue: Boolean,
		puzzleId: {
			type: [String, Number],
			default: "unknown",
		},
		timeDisplay: {
			type: String,
			default: "--:--",
		},
		isAuthenticated: {
			type: Boolean,
			default: false,
		},
	});

	const emit = defineEmits(["update:modelValue"]);
	const onUpdate = (val) => emit("update:modelValue", val);
</script>

<template>
	<BModal
		:model-value="props.modelValue"
		@update:model-value="onUpdate"
		ok-only="true"
		centered
		title="Great solve!">
		<div class="winner-content">
			<div class="time-card">
				<div class="puzzle-id">Puzzle ID: {{ props.puzzleId }}</div>
				<div class="label">Your time</div>
				<div class="time">{{ props.timeDisplay }}</div>
				<div class="subtext">Nice work finishing this mini.</div>
			</div>

			<div class="panel">
				<p class="mb-2">
					Come back tomorrow for a fresh puzzle or browse older Minis in the archive.
				</p>
				<p v-if="!props.isAuthenticated" class="auth-reminder">
					<strong>Tip:</strong> Sign in to track your solves and appear on the
					leaderboard.
				</p>
			</div>
		</div>
	</BModal>
</template>

<style scoped>
	.winner-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.time-card {
		padding: 1rem;
		border: 2px solid var(--border);
		border-radius: 12px;
		background: var(--card);
		text-align: center;
		box-shadow: var(--shadow);
	}

	.label {
		font-size: 0.95rem;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
	}

	.time {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--accent-strong);
		line-height: 1.1;
	}

	.puzzle-id {
		font-weight: 700;
		color: var(--accent);
		margin-bottom: 0.25rem;
	}

	.subtext {
		color: var(--muted);
		font-size: 0.95rem;
	}

	.auth-reminder {
		margin: 0;
		color: #c62828;
		font-weight: 600;
	}
</style>
