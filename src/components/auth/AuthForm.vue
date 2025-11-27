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
	<BForm @submit.prevent="submitForm" novalidate>
		<div class="mb-3 text-center">
			<h1 class="h4 mb-1">
				{{ isLogin ? "Welcome back" : "Join us" }}
			</h1>
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
				id="auth-name"
				v-model="user.name"
				type="text"
				required
				autocomplete="username"
				placeholder="Enter your name" />
		</BFormGroup>

		<BFormGroup label="Password" label-for="auth-password" class="mb-3">
			<BFormInput
				id="auth-password"
				v-model="user.password"
				type="password"
				required
				autocomplete="current-password"
				placeholder="Enter your password" />
		</BFormGroup>

		<div class="d-grid mb-3">
			<BButton type="submit" variant="primary" :disabled="submitting">
				{{ submitting ? "Please wait..." : authTypeLabel }}
			</BButton>
		</div>

		<div class="text-center small">
			<span v-if="isLogin">
				Not a member yet?
				<BButton
					variant="link"
					size="sm"
					class="p-0 align-baseline text-decoration-underline"
					@click="toggleAuth">
					Register
				</BButton>
			</span>
			<span v-else>
				Already a member?
				<BButton
					variant="link"
					size="sm"
					class="p-0 align-baseline text-decoration-underline"
					@click="toggleAuth">
					Login
				</BButton>
			</span>
		</div>
	</BForm>
</template>
