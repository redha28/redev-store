<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <div :class="['input-with-icon', { 'has-right-icon': $slots.rightIcon }]">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="['form-input', { error: error }]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus" />

      <!-- Icon slot -->
      <div v-if="$slots.icon" class="input-icon">
        <slot name="icon"></slot>
      </div>

      <!-- Right icon slot -->
      <div v-if="$slots.rightIcon" class="input-icon-right">
        <slot name="rightIcon"></slot>
      </div>
    </div>

    <!-- Error message -->
    <p v-if="error" class="form-error">{{ error }}</p>

    <!-- Help text -->
    <p v-if="help && !error" class="form-help">{{ help }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { generateId } from "@/utils/format";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  help: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "blur", "focus"]);

const id = computed(() => `input-${generateId()}`);

const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
};

const handleBlur = (event) => {
  emit("blur", event);
};

const handleFocus = (event) => {
  emit("focus", event);
};
</script>
