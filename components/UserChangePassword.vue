<script setup>
import {defineEmits, defineProps, reactive, watch} from 'vue';
import {z} from 'zod';
import {useNuxtApp} from "#app";

const changePasswordQuestions = [
  {
    label: "Current Password",
    type: "password",
    placeholder: "Enter Current Password",
    id: "old_password",
  },
  {
    label: "New Password",
    type: "password",
    placeholder: "Enter New Password",
    id: "new_password"
  },
  {
    label: "Confirm New Password",
    type: "password",
    placeholder: "Confirm New Password",
    id: "confirm_password"
  },
];

const formSchema = z.object({
  "old_password": z
      .string(),
  "new_password": z.string()
      .min(10, "Password must be at least 10 characters long")
      .max(15, "Password must not exceed 15 characters")
      .regex(/[a-zA-Z]/, "Password must include at least one letter")
      .regex(/\d/, "Password must include at least one number")
      .regex(/[@$!%*?&]/, "Password must include at least one special character"),
  "confirm_password": z
      .string()
      .refine(value => value === form["new_password"], "Passwords must match"),
});

const {$axios} = useNuxtApp();
const api = $axios()
const props = defineProps({show: Boolean});
const emit = defineEmits(['update:show']);
const closePopup = () => emit('update:show', false);

const form = reactive(Object.fromEntries(changePasswordQuestions.map(q => [q.id, ''])));
const errors = reactive(Object.fromEntries(changePasswordQuestions.map(q => [q.id, ''])));

changePasswordQuestions.forEach(question => watch(() => form[question.id], () => validateField(question.id)));

function validateField(field) {
  try {
    formSchema.shape[field].parse(form[field]);
    errors[field] = '';
  } catch (error) {
    errors[field] = error.errors?.[0]?.message || error.message;
  }
}

const handleSubmit = async () => {
  try {
    const response = await api.post(`/users/change-password/`, form);

    console.log('Success:', response.data);
    alert("Password changed successfully");
    location.reload()
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

definePageMeta({
  middleware: 'auth',
});

</script>

<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="upload-video-form-container" @click.stop>
      <div class="upload-video-form">
        <h2>Upload Video</h2>
        <form @submit.prevent="handleSubmit">
          <div class="upload-video-form">
            <div class="info" v-for="(question, index) in changePasswordQuestions" :key="index">
              <label class="question-title" :for="question.label">{{ question.label }}</label>
              <input
                  v-if="['text', 'password', 'file'].includes(question.type)"
                  :type="question.type"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :id="question.label"
                  @input="validateField(question.id)"
              />
              <span v-if="errors[question.id]" class="error">{{ errors[question.id] }}</span>
            </div>
          </div>
          <button class="upload-image" type="submit">Change Password</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.upload-video-form-container {
  background: var(--bg-color);
  padding: 20px;
  border-radius: 8px;
  max-width: 50%;
  width: 100%;
  text-align: start;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

@media (max-width: 1024px) {
  .upload-video-form-container {
    max-width: 80%;
  }
}

@media (max-width: 768px) {
  .upload-video-form-container {
    max-width: 90%;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .upload-video-form-container {
    max-width: 95%;
    padding: 10px;
  }
}

.upload-video-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
}

.upload-video-form > h2 {
  text-align: center;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.info {
  display: block;
  margin-bottom: 0.5rem;
}

.question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.upload-video-form select,
.upload-video-form input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  outline: none;
}

.error {
  color: red;
  font-size: 1rem;
}

.upload-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 1rem auto;
  padding: 0.5rem 2rem;
  font-size: 1rem;
  border-radius: 1rem 0;
  background-color: var(--primary-color);
  color: var(--text-color);
  text-align: center;
  cursor: pointer;
}

.upload-image:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

</style>
