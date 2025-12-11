<script setup>
	import { ref } from "vue";
	import { useI18n } from "vue-i18n";
	import { useAcct } from "@/composables/useAuth";

	const { t } = useI18n();
	const { resetPassword } = useAcct();

	const props = defineProps({
		token: {
			type: String,
			required: true,
		},
	});

	const newPw = ref("");
	const confirmPw = ref("");
	const submitting = ref(false);
	const feedback = ref({ message: "", variant: "success" });

	function validatePasswords(password, confirm) {
		if (!password || !confirm) {
			return t("passwordUpdate.errorRequired");
		}
		if (password.length < 8) {
			return t("passwordUpdate.errorLength");
		}
		if (password !== confirm) {
			return t("passwordUpdate.errorMatch");
		}
		return null;
	}

	async function submitNewPw() {
		feedback.value = { message: "", variant: "success" };
		const password = newPw.value.trim();
		const confirm = confirmPw.value.trim();
		const validationError = validatePasswords(password, confirm);

		if (validationError) {
			feedback.value = { message: validationError, variant: "danger" };
			return;
		}

		submitting.value = true;
		try {
			const res = await resetPassword(props.token, password);
			const message = res?.message || t("passwordUpdate.success");
			feedback.value = { message, variant: "success" };
			newPw.value = "";
			confirmPw.value = "";
		} catch (err) {
			feedback.value = {
				message: err?.message || t("passwordUpdate.errorGeneric"),
				variant: "danger",
			};
		} finally {
			submitting.value = false;
		}
	}
</script>

<template>
	<BContainer class="password-update">
		<BRow class="justify-content-center">
			<BCol md="8">
				<BCard class="p-4 shadow-sm">
					<h1 class="h4 mb-2 text-center">{{ t("passwordUpdate.title") }}</h1>
					<p class="text-muted text-center mb-4">
						{{ t("passwordUpdate.description") }}
					</p>

					<BAlert
						v-if="feedback.message"
						:model-value="true"
						:variant="feedback.variant"
						dismissible
						class="mb-3">
						{{ feedback.message }}
					</BAlert>

					<BForm @submit.prevent="submitNewPw" novalidate>
						<BFormGroup
							:label="t('passwordUpdate.labels.password')"
							label-for="new-password"
							class="mb-3">
							<BFormInput
								id="new-password"
								v-model="newPw"
								type="password"
								:placeholder="t('passwordUpdate.placeholders.password')"
								autocomplete="new-password"
								:disabled="submitting"
								required />
						</BFormGroup>

						<BFormGroup
							:label="t('passwordUpdate.labels.confirm')"
							label-for="confirm-password"
							class="mb-4">
							<BFormInput
								id="confirm-password"
								v-model="confirmPw"
								type="password"
								:placeholder="t('passwordUpdate.placeholders.confirm')"
								autocomplete="new-password"
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
										? t("passwordUpdate.sending")
										: t("passwordUpdate.button")
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
	.password-update {
		padding: 2rem 1rem;
		min-height: 70vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
