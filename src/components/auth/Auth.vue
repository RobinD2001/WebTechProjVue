<script setup>
import { ref, computed } from "vue";
import { BModal, BAlert } from "bootstrap-vue-3";
import AuthForm from "./AuthForm.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isLogin = ref(true);
const showAlert = ref(false);
const wasSuccessful = ref(false);
const alertMsg = ref("");

const isVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const modalTitle = computed(() => {
  return isLogin.value ? "Login" : "Register";
});

function onFormSubmitted(result) {
  const [success, message] = result;

  showAlert.value = true;
  wasSuccessful.value = success;
  alertMsg.value = message;

  if (success) {
    setTimeout(() => {
      isVisible.value = false;
    }, 500);
  }

  setTimeout(() => {
    dismissAlert();
  }, 5000);
}

function dismissAlert() {
  showAlert.value = false;
}
</script>

<template>
  <BModal
    v-model="isVisible"
    id="authModal"
    :title="modalTitle"
    hide-footer="true"
    centered
  >
    <AuthForm
      :isLogin="isLogin"
      @success="onFormSubmitted($event)"
      @modeChange="isLogin = $event"
    />
    <BAlert
      :model-value="showAlert"
      :variant="wasSuccessful ? 'success' : 'danger'"
      dismissible
      class="mb-3"
      @dismissed="dismissAlert"
    >
      {{ alertMsg }}
    </BAlert>
  </BModal>
</template>

<style scoped></style>
