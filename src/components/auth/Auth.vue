<script setup>
    import { computed, ref, reactive } from "vue";
    import { useRouter } from "vue-router";
    import { useAuth } from "@/composables/useAuth.js"

    const router = useRouter();
    const { login, register, logout } = useAuth();

    const authType = ref("login");

    const errorMessage = ref("");
    const successMessage = ref("");

    const user = reactive({
        name: "",
        password: "",
    });

    function switchType(view) {
        authType.value = view;
        errorMessage.value = "";
        successMessage.value = "";
    }

    const submitLabel = computed(() =>
        authType.value.charAt(0).toUpperCase() + authType.value.slice(1)
    );

	async function submitForm(){
		errorMessage.value = "";
		successMessage.value = "";

		try {
			let data;

            if (authType.value === "login") {
                data = await login({
                    name: user.name,
                    password: user.password
                });
            } else {
                data = await register({
                    name: user.name,
                    password: user.password
                });
            }

			successMessage.value = data.message || submitLabel.value+" successful";

			console.log("Auth success:", data.user);
            router.push({ name: "home"});
		} catch(e) {
			console.error(e);
            errorMessage.value = e.message || submitLabel.value + " failed";
		}

		user.name = "";
		user.password = "";
	}
</script>

<template>
  <div class="auth">
    <div class="auth_toggle">
      <button
        type="button"
        :class="{ 'auth_toggle-button--active': authType === 'login' }"
        class="auth_toggle-button"
        @click="switchType('login')"
      >
        Login
      </button>
      <button
        type="button"
        :class="{ 'auth_toggle-button--active': authType === 'register' }"
        class="auth_toggle-button"
        @click="switchType('register')"
      >
        Register
      </button>
    </div>
    <div>
		<form @submit.prevent="submitForm">
			<table>
				<tbody>
					<tr>
						<td>
							<span>Username:</span>
						</td>
						<td>
							<input type="text" v-model="user.name" required>
						</td>
					</tr>
					<tr>
						<td>
							<span>Password:</span>
						</td>
						<td>
							<input type="password" v-model="user.password" required>
						</td>
					</tr>
				</tbody>
			</table>
			<p v-if="errorMessage" style="color: red">
				{{ errorMessage }}
			</p>
			<p v-if="successMessage" style="color: green">
				{{ successMessage }}
			</p>
			<button type="submit">{{ submitLabel }}</button>
		</form>
        <button @click="logout()">Logout</button>
	</div>
</div>
</template>

<style scoped>
    .auth {
    display: inline-block;
    padding: 16px;
    border: 1px solid #d0d7de;
    border-radius: 4px;
    background: #6e6565;
    }

    .auth_toggle {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    }

    .auth_toggle-button {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 3px;
    background: white;
    cursor: pointer;
    }

    .auth_toggle-button--active {
    background: #0ea5e9;
    color: white;
    border-color: #0284c7;
    }

	form {
		border: 1px solid #cccccc;
		padding: 0.5em;
	}
</style>
