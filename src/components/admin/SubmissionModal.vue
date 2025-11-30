<script setup>
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		default: "success",
	},
	message: {
		type: String,
		default: "",
	},
});

const emit = defineEmits(["update:modelValue"]);

const onUpdate = (val) => emit("update:modelValue", val);
</script>

<template>
	<BModal
		:model-value="props.modelValue"
		@update:model-value="onUpdate"
		title="Upload Result"
		ok-only>
		<BAlert :variant="props.status === 'success' ? 'success' : 'danger'" class="mb-0">
			{{ props.message || (props.status === "success" ? "Upload succeeded." : "Upload failed.") }}
		</BAlert>
	</BModal>
</template>
