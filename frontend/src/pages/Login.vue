<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </router-link>
        </p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Email -->
          <BaseInput
            v-model="form.email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            :error="errors.email"
            required>
            <template #icon>
              <EnvelopeIcon class="h-5 w-5 text-gray-400" />
            </template>
          </BaseInput>

          <!-- Password -->
          <BaseInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Enter your password"
            :error="errors.password"
            required>
            <template #icon>
              <LockClosedIcon class="h-5 w-5 text-gray-400" />
            </template>
            <template #rightIcon>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-gray-400 hover:text-gray-600">
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </template>
          </BaseInput>
        </div>

        <!-- Submit Button -->
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          block
          :loading="loading"
          loading-text="Signing in...">
          Sign in
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { validateForm, validationRules } from "@/utils/validators";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const loading = ref(false);
const errors = ref({});

const form = reactive({
  email: "",
  password: "",
});

const validationSchema = {
  email: [validationRules.required("Email is required"), validationRules.email()],
  password: [
    validationRules.required("Password is required"),
    validationRules.minLength(6, "Password must be at least 6 characters"),
  ],
};

const handleSubmit = async () => {
  // Clear previous errors
  errors.value = {};

  // Validate form
  const validation = validateForm(form, validationSchema);
  if (!validation.isValid) {
    errors.value = Object.fromEntries(
      Object.entries(validation.errors).map(([key, value]) => [key, value[0]])
    );
    return;
  }

  loading.value = true;

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    });

    // Redirect to products page
    router.push("/products");
  } catch (error) {
    // Check if this is a validation error that should be shown in form
    if (error.response?.status === 422) {
      // Handle validation errors from backend
      const backendErrors = error.response.data?.errors || {};
      errors.value = Object.fromEntries(
        Object.entries(backendErrors).map(([key, value]) => [
          key,
          Array.isArray(value) ? value[0] : value,
        ])
      );
    }
    // Other errors (like 401 Invalid credentials) are handled by interceptor
    console.error("Login error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
