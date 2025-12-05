<script setup>
	import { onMounted, ref } from "vue";
	import AddCrossword from "@/components/admin/AddCrossword.vue";
	import GlobalStats from "@/components/admin/GlobalStats.vue";
	import Schedule from "@/components/admin/Schedule.vue";
	import { useAuth } from "@/composables/useAuth";

	const activeContainer = ref(0);
	const isAdmin = ref(false);
	const noAccessMsg = ref("No Access");
	const { checkAdmin } = useAuth();

	onMounted(async () => {
		try {
			const checkData = await checkAdmin();
			isAdmin.value = !!checkData?.access;
			noAccessMsg.value = checkData?.message ?? "No Access";
		} catch (err) {
			console.error("Admin check failed", err);
			isAdmin.value = false;
			noAccessMsg.value = "Unable to verify admin access.";
		}
	});
</script>

<template>
	<BContainer class="p-2 pt-3">
		<h1>Admin</h1>
		<p>Super secret page to do special stuff</p>
		<BTabs v-if="isAdmin" v-model="activeContainer" class="px=3em">
			<BTab title="Crossword Builder">
				<AddCrossword />
			</BTab>
			<BTab title="Global stats">
				<GlobalStats />
			</BTab>
			<BTab title="Schedule">
				<Schedule />
			</BTab>
		</BTabs>
		<BAlert :model-value="!isAdmin" variant="danger">{{ noAccessMsg }}</BAlert>
	</BContainer>
</template>
