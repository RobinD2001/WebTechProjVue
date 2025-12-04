<script setup>
	const tips = [
		{
			title: "Use Crossings",
			body: "Once you solve a clue, use it to help solve the intersecting words. Just one correct answer can unlock several others.",
		},
		{
			title: "Double-Check Your Answers",
			body: "A single incorrect letter can throw off the entire puzzle. If something feels off or forced, take a step back and reassess.",
		},
		{
			title: "Play Every Day",
			body: "Like any muscle, your brain gets stronger with regular use. Daily practice sharpens your skills and speeds up your solving.",
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
						<li>
							All answers are written left-to-right (across) or top-to-bottom (down) -
							never diagonally or backwards.
						</li>
						<li>
							Multi-word answers are written without spaces (e.g., put on → puton).
						</li>
						<li>
							Clues are concise and often include clever wordplay, abbreviations, or
							puns.
						</li>
						<li>Proper nouns, slang, and pop culture references are commonly used.</li>
					</ul>
					<h4>Controls</h4>
					<ul class="list">
						<li><code>Arrow keys</code> - Navigate the grid</li>
						<li><code>Backspace</code> - Clear the current cell</li>
						<li><code>Tab</code> - Switch clue direction (across/down)</li>
						<li>
							<code>Mouse</code> - Highlight the clue or its corresponding grid cells
						</li>
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
