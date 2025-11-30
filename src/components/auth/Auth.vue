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

function blurActiveElement() {
  if (typeof document === "undefined") return;
  const activeElement = document.activeElement;
  if (activeElement && activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}

function closeModal() {
  blurActiveElement();
  isVisible.value = false;
}

function onHide() {
  blurActiveElement();
}

function onFormSubmitted(result) {
  const [success, message] = result;

  showAlert.value = true;
  wasSuccessful.value = success;
  alertMsg.value = message;

  if (success) {
    setTimeout(() => {
      closeModal();
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
    class="authModal"
    :title='isLogin ? "Welcome back" : "Join us"'
    hide-footer="true"
    centered
    :aria-label="modalTitle + ' dialog'"
    header-close-label="Close authentication dialog"
    @hide="onHide"
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
      aria-live="polite"
      aria-atomic="true"
    >
      {{ alertMsg }}
    </BAlert>
  </BModal>
</template>

<style scoped></style>
