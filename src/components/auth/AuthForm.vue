<script setup>
	import { computed, ref, reactive } from "vue";
	import { useAuth } from "@/composables/useAuth.js";

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
		password: "",
	});

	const submitting = ref(false);

	function toggleAuth() {
		isLogin.value = !isLogin.value;
		emit("modeChange", isLogin.value);
	}

	function clearForm() {
		user.name = "";
		user.password = "";
	}

	async function submitForm() {
		if (!user.name || !user.password) {
			emit("success", [false, "Please fill in both fields."]);
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
</script>

<template>
	<!-- BootstrapVue form instead of raw <form> -->
	<BForm @submit.prevent="submitForm" novalidate :aria-busy="submitting">
		<div class="mb-3 text-center">
			<!-- <h1 class="h4 mb-1 text-decoration">
				{{ isLogin ? "Welcome back" : "Join us" }}
			</h1> -->
			<p class="text-muted mb-0">
				{{
					isLogin
						? "Log in to continue solving crosswords."
						: "Create an account to track your stats."
				}}
			</p>
		</div>

		<BFormGroup label="Name" label-for="auth-name" class="mb-3">
			<BFormInput
				class="auth-name"
				v-model="user.name"
				type="text"
				required
				autocomplete="username"
				aria-required="true"
				placeholder="Enter your name" />
		</BFormGroup>

		<BFormGroup label="Password" label-for="auth-password" class="mb-3">
			<BFormInput
				class="auth-password"
				v-model="user.password"
				type="password"
				required
				autocomplete="current-password"
				aria-required="true"
				placeholder="Enter your password" />
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
				<button type="button" class="toggle-btn" @click="toggleAuth">
					Register
				</button>
			</span>
			<span v-else>
				Already a member?
				<button type="button" class="toggle-btn" @click="toggleAuth">
					Login
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
</style>
