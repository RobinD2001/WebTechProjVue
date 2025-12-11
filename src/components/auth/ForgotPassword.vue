<script setup>
	import { ref } from "vue";
	import { useI18n } from "vue-i18n";
	import { useAcct } from "@/composables/useAuth";

	const { t } = useI18n();
	const { forgotPassword } = useAcct();
	const email = ref("");
	const submitting = ref(false);
	const feedback = ref({ message: "", variant: "success" });

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	async function submitReset() {
		feedback.value = { message: "", variant: "success" };
		const value = email.value.trim();

		if (!value || !emailPattern.test(value)) {
			feedback.value = {
				message: t("passwordReset.errorEmail"),
				variant: "danger",
			};
			return;
		}

		submitting.value = true;

		try {
			const res = await forgotPassword(email.value);
			const message = res?.message || t("passwordReset.successFallback");
			feedback.value = { message, variant: "success" };
			email.value = "";
		} catch (err) {
			feedback.value = {
				message: err?.message || t("passwordReset.errorGeneric"),
				variant: "danger",
			};
		} finally {
			submitting.value = false;
		}
	}
</script>

<template>
	<BContainer class="password-reset">
		<BRow class="justify-content-center">
			<BCol md="8" lg="6">
				<BCard class="p-4 shadow-sm">
					<h1 class="h4 mb-2 text-center">{{ t("passwordReset.title") }}</h1>
					<p class="text-muted text-center mb-4">
						{{ t("passwordReset.description") }}
					</p>

					<BAlert
						v-if="feedback.message"
						:model-value="true"
						:variant="feedback.variant"
						dismissible
						class="mb-3">
						{{ feedback.message }}
					</BAlert>

					<BForm @submit.prevent="submitReset" novalidate>
						<BFormGroup
							:label="t('passwordReset.labels.email')"
							label-for="reset-email"
							class="mb-3">
							<BFormInput
								id="reset-email"
								v-model="email"
								type="email"
								:placeholder="t('passwordReset.placeholders.email')"
								autocomplete="email"
								:disabled="submitting"
								required />
						</BFormGroup>

						<div class="d-grid">
							<BButton
								type="submit"
								variant="primary"
								:disabled="submitting"
								:aria-busy="submitting">
								{{
									submitting
										? t("passwordReset.sending")
										: t("passwordReset.button")
								}}
							</BButton>
						</div>
					</BForm>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<style scoped>
	.password-reset {
		padding: 2rem 1rem;
		min-height: 70vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
