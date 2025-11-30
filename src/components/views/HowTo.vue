<script setup>
const tips = [
	{
		title: "Start with the short ones",
		body: "Fill in the 3- and 4-letter clues first. They give anchors for longer answers.",
	},
	{
		title: "Use crossings",
		body: "Each letter is shared by an across and a down clue. If one is tricky, solve the other to reveal letters.",
	},
	{
		title: "Check your work",
		body: "One wrong letter can block everything. If a word feels forced, rethink it.",
	},
];
</script>

<template>
	<BContainer fluid class="howto-page">
		<section class="hero">
			<h1>How to play</h1>
		</section>

		<BRow class="g-3">
			<BCol lg="7">
				<BCard class="panel">
					<h3>Basics</h3>
					<ul class="list">
						<li>Use the keyboard to type letters. Backspace clears a cell.</li>
						<li>Arrow keys move to neighbouring cells; tab switches between across/down.</li>
						<li>Black squares block paths; answers never skip over them.</li>
						<li>Every entry reads left-to-right (across) or top-to-bottom (down).</li>
					</ul>
					<h4>Controls</h4>
					<ul class="list">
						<li><code>Tab</code> – switch direction</li>
						<li><code>Backspace</code> – clear cell</li>
						<li><code>Arrow keys</code> – move through the grid and switch directions</li>
					</ul>
				</BCard>
			</BCol>

			<BCol lg="5">
				<BCard class="panel">
					<h3>Pro tips</h3>
					<ul class="tips">
						<li v-for="tip in tips" :key="tip.title">
							<strong>{{ tip.title }}</strong>
							<p>{{ tip.body }}</p>
						</li>
					</ul>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<style scoped>
.howto-page {
	max-width: 1100px;
	margin: 0 auto;
	padding: 2.5rem 1.5rem 3rem;
    padding-top: 0;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.hero {
	text-align: center;
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
}

.eyebrow {
	margin: 0;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	font-size: 0.75rem;
	color: var(--accent-strong);
}

.lede {
	margin: 0;
	font-size: 1.05rem;
}

.panel {
	border: 1px solid var(--border);
	border-radius: 12px;
	background: var(--card);
	box-shadow: var(--shadow);
}

.list {
	padding-left: 1.2rem;
	margin: 0.5rem 0 1rem;
	display: grid;
	gap: 0.4rem;
}

.tips {
	list-style: none;
	padding: 0;
	margin: 0.5rem 0 0;
	display: grid;
	gap: 0.75rem;
}

.tips p {
	margin: 0.2rem 0 0;
}

.demo-card {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 1.5rem;
	align-items: center;
}

.grid {
	display: grid;
	grid-template-columns: repeat(5, 48px);
	grid-template-rows: repeat(5, 48px);
	gap: 4px;
	border: 1px solid var(--border);
	padding: 10px;
	background: var(--bg-alt);
	border-radius: 10px;
	justify-content: center;
}

.cell {
	display: flex;
	justify-content: center;
	align-items: center;
	background: #fdfaf3;
	border: 1px solid var(--border);
	font-weight: 700;
	position: relative;
	border-radius: 6px;
}

.cell.number {
	align-items: flex-start;
	justify-content: flex-start;
	padding: 4px;
	font-size: 0.75rem;
}

.cell.block {
	background: #262626;
	border-color: #1c1c1c;
}

.muted {
	color: var(--muted);
}

@media (max-width: 768px) {
	.demo-card {
		grid-template-columns: 1fr;
	}
}
</style>
