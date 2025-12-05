<script setup>
	import { computed, ref, reactive } from "vue";
	import { useAuth } from "@/composables/useAuth";

	const { login, register } = useAuth();

	const props = defineProps({
		isLogin: {
			type: Boolean,
			default: true,
		},
	});

	const emit = defineEmits(["success", "modeChange"]);

	const isLogin = ref(props.isLogin);
	const authTypeLabel = computed(() => (isLogin.value ? "Login" : "Register"));

	const user = reactive({
		name: "",
		email: "",
		password: "",
	});

	const submitting = ref(false);

	function toggleAuth() {
		isLogin.value = !isLogin.value;
		emit("modeChange", isLogin.value);
	}

	function clearForm() {
		user.name = "";
		user.email = "";
		user.password = "";
	}

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	async function submitForm() {
		const missingEmail = !isLogin.value && !user.email;
		const invalidEmail = !isLogin.value && user.email && !emailPattern.test(user.email);

		if (!user.name || !user.password || missingEmail) {
			emit("success", [false, "Please fill in all required fields."]);
			return;
		}

		if (invalidEmail) {
			emit("success", [false, "Please enter a valid email address."]);
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

			emit("success", [true, data.message || authTypeLabel.value + " successful"]);
			console.log("Auth success:", data.user);
			clearForm();
		} catch (e) {
			console.error(e);
			emit("success", [false, e.message || authTypeLabel.value + " failed"]);
		} finally {
			submitting.value = false;
		}
	}

	const isNeeded = (label) => (isLogin.value ? label : label + "(*)");
</script>

<template>
	<BForm @submit.prevent="submitForm" novalidate :aria-busy="submitting">
		<div class="mb-3 text-center">
			<p class="text-muted mb-0">
				{{
					isLogin
						? "Log in to continue solving crosswords."
						: "Create an account to track your stats."
				}}
			</p>
		</div>

		<BFormGroup :label="isNeeded('Name')" class="mb-3">
			<BFormInput
				class="auth-name"
				v-model="user.name"
				type="text"
				required
				autocomplete="username"
				aria-required="true"
				aria-label="Name"
				placeholder="Enter your name" />
		</BFormGroup>

		<BFormGroup v-if="!isLogin" label="Email" class="mb-3">
			<BFormInput
				class="auth-email"
				v-model="user.email"
				type="email"
				required
				autocomplete="email"
				aria-required="false"
				aria-label="Email"
				placeholder="Enter your email" />
		</BFormGroup>

		<BFormGroup :label="isNeeded('Password')" class="col mb-3">
			<BFormInput
				class="auth-password"
				v-model="user.password"
				type="password"
				required
				autocomplete="current-password"
				aria-required="true"
				aria-label="Password"
				placeholder="Enter your password" />
			<div v-if="isLogin" class="small forgot-password text-end mt-1 fw-light">
				<button type="button" class="toggle-btn" @click="">Forgot your password?</button>
			</div>
		</BFormGroup>

		<div class="d-grid mb-3">
			<BButton
				type="submit"
				variant="primary"
				:disabled="submitting"
				:aria-disabled="submitting"
				:aria-busy="submitting">
				{{ submitting ? "Please wait..." : authTypeLabel }}
			</BButton>
		</div>

		<div class="text-center small">
			<span v-if="isLogin">
				Not a member yet?
				<button type="button" class="toggle-btn" @click="toggleAuth">Register</button>
			</span>
			<span v-else>
				Already a member?
				<button type="button" class="toggle-btn" @click="toggleAuth">Login</button>
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
