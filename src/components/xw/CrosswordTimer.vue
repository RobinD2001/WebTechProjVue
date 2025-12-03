<script setup>
	defineProps({
		display: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			default: "running",
		},
	});
</script>

<template>
	<div class="xw-timer" :class="state" aria-live="polite">
		{{ display }}
	</div>
</template>

<style scoped>
	.xw-timer {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 700;
		padding: 0.35rem 0.9rem;
		border-radius: 12px;
		border: 2px solid var(--border);
		background: var(--card);
		min-width: 96px;
		text-align: center;
		transition: color 150ms ease;
	}

	.xw-timer.countdown {
		color: #c62828;
	}

	.xw-timer.running {
		color: var(--accent-strong);
	}
</style>
