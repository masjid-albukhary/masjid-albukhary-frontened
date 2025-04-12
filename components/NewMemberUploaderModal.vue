<script setup>
import { defineEmits, defineProps, reactive, ref, watch } from 'vue';
import { z } from 'zod';
import {useNuxtApp} from "#app";

const {$axios} = useNuxtApp();
const api = $axios()
const props = defineProps({ show: Boolean });
const emit = defineEmits(['update:show']);
const closePopup = () => emit('update:show', false);
const uploadVideosQuestions = [
  {
    label: 'Name',
    type: 'text',
    placeholder: 'Enter Name',
    required: true,
    id: 'name',
  },
  {
    label: 'Role',
    type: 'text',
    placeholder: 'Role',
    required: true,
    id: 'role',
  },
  {
    label: 'Upload Images',
    type: 'file',
    required: true,
    placeholder: 'Upload any requests or inquiries',
    id: 'photo',
  },
];
const formSchema = z.object({
  name: z.string().min(8, 'Name must be at least 8 characters long'),
  role: z.string().min(8, 'Role must be at least 8 characters long'),
  photo: z.any().optional('Upload must be a file'),
});
const form = reactive(Object.fromEntries(uploadVideosQuestions.map((q) => [q.id, ''])));
const errors = reactive(Object.fromEntries(uploadVideosQuestions.map((q) => [q.id, ''])));
const evidence_photo = ref(null);
function validateField(field) {
  try {
    formSchema.shape[field].parse(form[field]);
    errors[field] = '';
  } catch (error) {
    errors[field] = error.errors?.[0]?.message || error.message;
  }
}
uploadVideosQuestions.forEach((question) => watch(() => form[question.id], () => validateField(question.id)));
const handleFileUpload = (event, inputDetails) => {
  if (inputDetails.type === 'file') {
    evidence_photo.value = event.target.files[0];
  }
};
async function handleSubmit() {
  form.Date = new Date().toLocaleDateString('en-GB');

  const validationResults = formSchema.safeParse(form);

  if (!validationResults.success) {
    console.log('Validation Errors:', validationResults.error.errors);
    alert('Please correct the errors in the form.');
    return;
  }

  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('role', form.role);
  formData.append('photo', evidence_photo.value);

  try {
    const response = await api.post('/content_manager/member/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Form Submitted Successfully:', response.data);
    alert('Form Submitted Successfully.');

    location.reload();

  } catch (error) {
    console.error('Failed to submit form:', error);
    alert('An error occurred while submitting the form.');
  }
}
</script>


<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="new-community-member-form-container" @click.stop>
      <div class="new-community-member-form">
        <h2>New Community Member</h2>
        <form @submit.prevent="handleSubmit">
          <div class="new-community-member-form">
            <div class="info" v-for="(question, index) in uploadVideosQuestions" :key="index">
              <label class="question-title" :for="question.label">{{ question.label }}</label>
              <input
                  v-if="['text','file'].includes(question.type)"
                  :type="question.type"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :id="question.label"
                  :accept="question.type === 'file' ? '.jpg,.jpeg,.png' : ''"
                  @change="(e) => handleFileUpload(e, question)"
                  @input="validateField(question.id)"
              />
              <span v-if="errors[question.id]" class="error">{{ errors[question.id] }}</span>
            </div>
          </div>
          <button class="upload-image" type="submit">Upload Image</button>
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

.new-community-member-form-container {
  background: var(--bg-color);
  padding: 20px;
  border-radius: 8px;
  max-width: 50%;
  width: 100%;
  text-align: start;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

@media (max-width: 1024px) {
  .new-community-member-form-container {
    max-width: 80%;
  }
}

@media (max-width: 768px) {
  .new-community-member-form-container {
    max-width: 90%;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .new-community-member-form-container {
    max-width: 95%;
    padding: 10px;
  }
}

.new-community-member-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
}

.new-community-member-form > h2 {
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

.new-community-member-form input {
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
