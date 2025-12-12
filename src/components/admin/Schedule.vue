<script setup>
	import { ref, watch } from "vue";
	import CrosswordApp from "../xw/CrosswordApp.vue";
	import PrivateCrosswordModal from "./PrivateCrosswordModal.vue";
	import { getXWInfo } from "@/composables/useXW";

	const statusOptions = ["Private", "Scheduled", "Public"];

	const today = new Date();
	const currentYear = today.getFullYear();
	const currentWeek = getISOWeek(today);
	const todayIso = toIso(today);

	const selectedYear = ref(currentYear);
	const selectedWeek = ref(currentWeek);
	const selectedDate = ref("");
	const weekEntries = ref([]);
	const selectedEntry = ref(null);
	const showPrivateModal = ref(false);

	const yearOptions = [currentYear, currentYear + 1];
	const weekOptions = Array.from({ length: 53 }, (_, i) => i + 1);

	function toIso(dateObj) {
		return dateObj.toISOString().slice(0, 10);
	}

	function getISOWeek(date) {
		const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
		const dayNum = tmp.getUTCDay() || 7;
		tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
		const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
		return Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
	}

	function getISOWeekStart(year, week) {
		const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
		const dayOfWeek = simple.getUTCDay() || 7;
		const isoWeekStart = new Date(simple);
		isoWeekStart.setUTCDate(simple.getUTCDate() - dayOfWeek + 1);
		return isoWeekStart;
	}

	function buildWeek(year, week) {
		const start = getISOWeekStart(year, week);
		return Array.from({ length: 7 }, (_, i) => {
			const day = new Date(start);
			day.setUTCDate(start.getUTCDate() + i);
			return { date: toIso(day), status: "Private" };
		});
	}

	async function refreshWeek(year, week) {
		const newWeek = buildWeek(year, week);
		weekEntries.value = newWeek;
		const inWeek = newWeek.find((d) => d.date === selectedDate.value);
		selectedDate.value = inWeek ? inWeek.date : newWeek[0]?.date ?? selectedDate.value;

		await Promise.all(
			newWeek.map(async (entry) => {
				try {
					const info = await getXWInfo(entry.date);
					const isPublic = info?.isPublic;

					if (!isPublic) {
						entry.status = "Private";
						return;
					}
					entry.status = entry.date > todayIso ? "Scheduled" : "Public";
				} catch (err) {
					console.error("Failed to fetch crossword info for", entry.date, err);
					entry.status = "Private";
				}
			})
		);

		weekEntries.value = [...newWeek];
	}

	function cycleStatus(entry) {
		const idx = statusOptions.indexOf(entry.status);
		const nextIdx = (idx + 1) % statusOptions.length;
		entry.status = statusOptions[nextIdx];
	}

	function statusVariant(status) {
		const normalized = status.toLowerCase();
		if (normalized === "public") return "success";
		if (normalized === "scheduled") return "warning";
		return "secondary";
	}

	function handleStatusClick(entry) {
		if (entry.status === "Private") {
			selectedEntry.value = entry;
			selectedDate.value = entry.date;
			showPrivateModal.value = true;
		}
	}

	function goToPreviousWeek() {
		let year = Number(selectedYear.value);
		let week = Number(selectedWeek.value) - 1;
		if (week < 1) {
			week = 53;
			year -= 1;
		}
		selectedYear.value = year;
		selectedWeek.value = week;
	}

	function goToNextWeek() {
		let year = Number(selectedYear.value);
		let week = Number(selectedWeek.value) + 1;
		if (week > 53) {
			week = 1;
			year += 1;
		}
		selectedYear.value = year;
		selectedWeek.value = week;
	}

	function handleSelectDate(date) {
		selectedDate.value = date;
	}

	async function handleAdded(cw) {
		const date = (cw?.release_date || "").substring(0, 10);
		const entry = weekEntries.value.find((e) => e.date === date);
		if (entry) {
			entry.status = date > todayIso ? "Scheduled" : "Public";
			weekEntries.value = [...weekEntries.value];
		}
		await refreshWeek(Number(selectedYear.value), Number(selectedWeek.value));
	}

	refreshWeek(currentYear, currentWeek);

	watch([selectedYear, selectedWeek], ([year, week]) => {
		refreshWeek(Number(year), Number(week));
	});
</script>

<template>
	<BContainer fluid class="schedule-page">
		<BCard class="panel mb-3">
			<BRow class="g-3 mb-2">
				<BCol md="6">
					<div class="d-flex align-items-center gap-2">
						<BButton
							variant="outline-secondary"
							class="rounded-circle"
							aria-label="Previous week"
							@click="goToPreviousWeek">
							&lt;&lt;
						</BButton>
						<BFormGroup
							label="Year"
							label-for="year-select"
							label-class="fw-bold"
							class="flex-grow-1 mb-0">
							<BFormSelect
								id="year-select"
								v-model="selectedYear"
								:options="yearOptions" />
						</BFormGroup>
					</div>
				</BCol>
				<BCol md="6">
					<div class="d-flex align-items-center gap-2">
						<BFormGroup
							label="Week"
							label-for="week-select"
							label-class="fw-bold"
							class="flex-grow-1 mb-0">
							<BFormSelect
								id="week-select"
								v-model="selectedWeek"
								:options="weekOptions" />
						</BFormGroup>
						<BButton
							variant="outline-secondary"
							class="rounded-circle"
							aria-label="Next week"
							@click="goToNextWeek">
							&gt;&gt;
						</BButton>
					</div>
				</BCol>
			</BRow>
			<BListGroup flush>
				<BListGroupItem
					v-for="entry in weekEntries"
					:key="entry.date"
					:active="entry.date === selectedDate"
					class="d-flex align-items-center justify-content-between"
					@click="handleSelectDate(entry.date)">
					<div class="fw-semibold">{{ entry.date }}</div>
					<BButton
						size="sm"
						:variant="statusVariant(entry.status)"
						:disabled="entry.status !== 'Private'"
						class="text-capitalize"
						@click.stop="handleStatusClick(entry)">
						{{ entry.status }}
					</BButton>
				</BListGroupItem>
			</BListGroup>
		</BCard>

		<BCard class="panel">
			<CrosswordApp :date="selectedDate" />
		</BCard>

		<PrivateCrosswordModal
			v-model="showPrivateModal"
			:selected-date="selectedDate"
			@added="handleAdded" />
	</BContainer>
</template>

<style scoped>
	.schedule-page {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
</style>
