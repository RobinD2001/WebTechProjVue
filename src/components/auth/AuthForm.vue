<script setup>
	import { computed, ref, reactive } from "vue";
	import { useRoute, useRouter } from "vue-router";
	import { useI18n } from "vue-i18n";
	import { useAuth } from "@/composables/useAuth";
	import { DEFAULT_LOCALE } from "@/i18n";

	const { login, register } = useAuth();
	const { t } = useI18n();
	const route = useRoute();
	const router = useRouter();

	const props = defineProps({
		isLogin: {
			type: Boolean,
			default: true,
		},
	});

	const emit = defineEmits(["success", "modeChange", "close"]);

	const isLogin = ref(props.isLogin);
	const authTypeLabel = computed(() => (isLogin.value ? t("auth.login") : t("auth.register")));
	const locale = computed(() => (route.params.locale ? route.params.locale : DEFAULT_LOCALE));

	const user = reactive({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const submitting = ref(false);

	function toggleAuth() {
		isLogin.value = !isLogin.value;
		emit("modeChange", isLogin.value);
	}

	function goToForgotPassword() {
		emit("close");
		router.push({ name: "pwforgot", params: { locale: locale.value } });
	}

	function clearForm() {
		user.name = "";
		user.email = "";
		user.password = "";
		user.confirmPassword = "";
	}

	// Keep client-side rules lenient; backend remains the source of truth.
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	async function submitForm() {
		const missingEmail = !isLogin.value && !user.email;
		const missingConfirm = !isLogin.value && !user.confirmPassword;
		const invalidEmail = !isLogin.value && user.email && !emailPattern.test(user.email);
		const passwordTooShort = !isLogin.value && user.password && user.password.length < 8;
		const passwordMismatch =
			!isLogin.value &&
			user.password &&
			user.confirmPassword &&
			user.password !== user.confirmPassword;

		if (!user.name || !user.password || missingEmail || missingConfirm) {
			emit("success", [false, t("auth.errorMissing")]);
			return;
		}

		if (invalidEmail) {
			emit("success", [false, t("auth.errorEmail")]);
			return;
		}

		if (passwordTooShort) {
			emit("success", [false, t("passwordUpdate.errorLength")]);
			return;
		}

		if (passwordMismatch) {
			emit("success", [false, t("passwordUpdate.errorMatch")]);
			return;
		}

		submitting.value = true;

		try {
			const data = isLogin.value
				? await login({
						name: user.name,
						password: user.password,
				  })
				: await register({
						name: user.name,
						email: user.email,
						password: user.password,
				  });

			const successMessage =
				data.message ||
				(isLogin.value ? t("auth.successLogin") : t("auth.successRegister"));
			emit("success", [true, successMessage]);
			clearForm();
		} catch (e) {
			console.error(e);
			const action = authTypeLabel.value;
			emit("success", [false, e.message || t("auth.errorFailed", { action })]);
		} finally {
			submitting.value = false;
		}
	}

	const labelWithRequired = (key) => (isLogin.value ? t(key) : `${t(key)}(*)`);
</script>

<template>
	<BForm @submit.prevent="submitForm" novalidate :aria-busy="submitting">
		<div class="mb-3 text-center">
			<p class="text-muted mb-0">
				{{ isLogin ? $t("auth.introLogin") : $t("auth.introRegister") }}
			</p>
		</div>

		<BFormGroup :label="labelWithRequired('auth.labels.name')" class="mb-3">
			<BFormInput
				class="auth-name"
				v-model="user.name"
				type="text"
				required
				autocomplete="username"
				aria-required="true"
				:aria-label="$t('auth.labels.name')"
				:placeholder="$t('auth.placeholders.name')" />
		</BFormGroup>

		<BFormGroup v-if="!isLogin" :label="labelWithRequired('auth.labels.email')" class="mb-3">
			<BFormInput
				class="auth-email"
				v-model="user.email"
				type="email"
				required
				autocomplete="email"
				aria-required="false"
				:aria-label="$t('auth.labels.email')"
				:placeholder="$t('auth.placeholders.email')" />
		</BFormGroup>

		<BFormGroup :label="labelWithRequired('auth.labels.password')" class="col mb-3">
			<BFormInput
				class="auth-password"
				v-model="user.password"
				type="password"
				required
				:autocomplete="isLogin ? 'current-password' : 'new-password'"
				aria-required="true"
				:aria-label="$t('auth.labels.password')"
				:placeholder="$t('auth.placeholders.password')" />
			<div v-if="isLogin" class="small forgot-password text-end mt-1 fw-light">
				<button type="button" class="toggle-btn" @click="goToForgotPassword">
					{{ $t("auth.forgotPassword") }}
				</button>
			</div>
		</BFormGroup>

		<BFormGroup
			v-if="!isLogin"
			:label="labelWithRequired('auth.labels.confirmPassword')"
			class="col mb-3">
			<BFormInput
				class="auth-password-confirm"
				v-model="user.confirmPassword"
				type="password"
				required
				autocomplete="new-password"
				aria-required="true"
				:aria-label="$t('auth.labels.confirmPassword')"
				:placeholder="$t('auth.placeholders.confirmPassword')" />
		</BFormGroup>

		<div class="d-grid mb-3">
			<BButton
				type="submit"
				variant="primary"
				:disabled="submitting"
				:aria-disabled="submitting"
				:aria-busy="submitting">
				{{ submitting ? $t("auth.pleaseWait") : authTypeLabel }}
			</BButton>
		</div>

		<div class="text-center small">
			<span v-if="isLogin">
				{{ $t("auth.notMember") }}
				<button type="button" class="toggle-btn" @click="toggleAuth">
					{{ $t("auth.toggleRegister") }}
				</button>
			</span>
			<span v-else>
				{{ $t("auth.alreadyMember") }}
				<button type="button" class="toggle-btn" @click="toggleAuth">
					{{ $t("auth.toggleLogin") }}
				</button>
			</span>
		</div>
	</BForm>
</template>

<style scoped>
	.toggle-btn {
		background: transparent;
		border: none;
		color: var(--bs-primary);
		padding: 0;
		font-size: 0.875rem;
		text-decoration: none;
		cursor: pointer;
	}

	.toggle-btn:focus,
	.toggle-btn:active,
	.toggle-btn:hover {
		color: var(--bs-primary);
		outline: none;
		box-shadow: none;
		text-decoration: underline;
	}

	.forgot-password {
		display: block;
	}
</style>
