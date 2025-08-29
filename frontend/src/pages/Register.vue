<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </router-link>
        </p>
      </div>

      <!-- Register Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Name -->
          <BaseInput
            v-model="form.name"
            type="text"
            label="Full name"
            placeholder="Enter your full name"
            :error="errors.name"
            required>
            <template #icon>
              <UserIcon class="h-5 w-5 text-gray-400" />
            </template>
          </BaseInput>

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

          <!-- Confirm Password -->
          <BaseInput
            v-model="form.passwordConfirmation"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            label="Confirm password"
            placeholder="Confirm your password"
            :error="errors.passwordConfirmation"
            required>
            <template #icon>
              <LockClosedIcon class="h-5 w-5 text-gray-400" />
            </template>
            <template #rightIcon>
              <button
                type="button"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                class="text-gray-400 hover:text-gray-600">
                <EyeIcon v-if="!showPasswordConfirmation" class="h-5 w-5" />
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
          loading-text="Creating account...">
          Create account
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
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const showPasswordConfirmation = ref(false);
const loading = ref(false);
const errors = ref({});

const form = reactive({
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
});

const validationSchema = {
  name: [
    validationRules.required("Name is required"),
    validationRules.minLength(2, "Name must be at least 2 characters"),
  ],
  email: [validationRules.required("Email is required"), validationRules.email()],
  password: [validationRules.required("Password is required"), validationRules.password()],
  passwordConfirmation: [
    validationRules.required("Password confirmation is required"),
    {
      validator: (value) => value === form.password,
      message: "Passwords do not match",
    },
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
    await authStore.register({
      fullName: form.name,
      email: form.email,
      password: form.password,
    });

    // Redirect to login page after successful registration
    router.push("/login");
  } catch (error) {
    // Error is handled by the store and interceptor
    console.error("Registration error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
