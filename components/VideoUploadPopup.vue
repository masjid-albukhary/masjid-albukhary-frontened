<script setup>
import {defineEmits, defineProps, reactive, ref, watch} from 'vue';
import {z} from 'zod';

const props = defineProps({show: Boolean});
const emit = defineEmits(['update:show']);
const closePopup = () => emit('update:show', false);

const bookingQuestions = [
  {
    label: 'Name Field',
    type: 'text',
    placeholder: 'First Name',
    required: true,
    id: 'name_field',
  },
  {
    label: 'Alert Field',
    type: 'text',
    placeholder: 'First Name',
    required: true,
    id: 'alert_field',
  },
  {
    label: 'Link',
    type: 'url',
    required: true,
    placeholder: 'Upload any requests or inquiries',
    id: 'video_link'
  },
  {
    label: 'Upload Images',
    type: 'file',
    required: true,
    placeholder: 'Upload any requests or inquiries',
    id: 'upload_image'
  },
];

const formSchema = z.object({
  name_field: z.string().min(8, 'Name field name must be at least 8 characters long'),
  alert_field: z.string().min(8, 'Alert field name must be at least 8 characters long'),
  video_link: z.string().url('Invalid URL format').optional(),
  upload_image: z.any().optional("Upload must be a file")
});

const form = reactive(Object.fromEntries(bookingQuestions.map(q => [q.id, ''])));
const errors = reactive(Object.fromEntries(bookingQuestions.map(q => [q.id, ''])));
const evidence_photo = ref(null);
const isPopupVisible = ref(false);

function validateField(field) {
  try {
    formSchema.shape[field].parse(form[field]);
    errors[field] = '';
  } catch (error) {
    errors[field] = error.errors?.[0]?.message || error.message;
  }
}

bookingQuestions.forEach(question => watch(() => form[question.id], () => validateField(question.id)));

const handleFileUpload = (event, inputDetails) => {
  if (inputDetails.type === 'file') {
    evidence_photo.value = event.target.files[0];
  }
};

async function handleSubmit() {
  form.Date = new Date().toLocaleDateString('en-GB');
  const validationResults = formSchema.safeParse(form);

  if (validationResults.success) {
    try {
      const formDataObj = new FormData();
      Object.entries(form).forEach(([key, value]) => value && formDataObj.append(key, value));
      if (evidence_photo.value) formDataObj.append('upload_image', evidence_photo.value);

      await api.post('//', formDataObj);
      Object.keys(form).forEach(key => (form[key] = ''));
      isPopupVisible.value = true;
      location.reload();
    } catch (error) {
      console.error('Error occurred:', error);
      alert(error.response?.data?.detail || 'An error occurred while submitting the form.');
    }
  } else {
    alert('Please correct the errors in the form.');
  }
}
</script>

<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="upload-video-form-container" @click.stop>
      <div class="upload-video-form">
        <h2>Upload Video</h2>
        <form @submit.prevent="handleSubmit">
          <div class="upload-video-form">
            <div class="info" v-for="(question, index) in bookingQuestions" :key="index">
              <label class="question-title" :for="question.label">{{ question.label }}</label>
              <input
                  v-if="['text', 'url', 'file'].includes(question.type)"
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
