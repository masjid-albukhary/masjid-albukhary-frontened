<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';
import {useNuxtApp} from "#app";

const {$axios} = useNuxtApp();
const api = $axios()
const {t} = useI18n();
const AboutContentQuestions = [
  {
    label: t('about_content_form.label.title_en'),
    type: "text",
    placeholder: t('about_content_form.placeholder.title_en'),
    required: true,
    id: "about_title_en",
  },
  {
    label: t('about_content_form.label.title_my'),
    type: "text",
    placeholder: t('about_content_form.placeholder.title_my'),
    required: true,
    id: "about_title_my",
  },
  {
    label: t('about_content_form.label.content_en'),
    type: "text",
    placeholder: t('about_content_form.placeholder.content_en'),
    required: true,
    id: "about_content_en",
  },
  {
    label: t('about_content_form.label.content_my'),
    type: "text",
    placeholder: t('about_content_form.placeholder.content_my'),
    required: true,
    id: "about_content_my",
  },
  {
    label: t('about_content_form.label.about_content_image'),
    type: "file",
    required: false,
    id: "about_content_image",
  },
]
const formSchema = z.object({
  about_title_en: z.string().min(10, 'Title must be at least 10 characters long'),
  about_title_my: z.string().min(10, 'Title must be at least 15 characters long'),
  about_content_en: z.string().min(100, 'Content must be at least 100 characters long'),
  about_content_my: z.string().min(100, 'Content must be at least 100 characters long'),
  about_content_image: z.any().optional(),
});
const form = reactive({});
const errors = reactive({});

AboutContentQuestions.forEach((question) => {
  form[question.id] = "";
  errors[question.id] = "";
});

function validateField(field) {
  try {
    formSchema.shape[field].parse(form[field]);
    errors[field] = "";
  } catch (error) {
    console.error(`Validation failed for field: ${field}`, error);
    errors[field] = error.errors ? error.errors[0].message : error.message;
  }
}

AboutContentQuestions.forEach((question) => {
  watch(() => form[question.id], () => validateField(question.id));
});

const about_content_image = ref(null);
const handleFileUpload = (event, inputDetails) => {
  if (inputDetails.type !== 'file') {
    return;
  }
  about_content_image.value = event.target.files[0];
};
const handleSubmit = async () => {
  form.Date = new Date().toLocaleDateString('en-GB');

  const validationResults = formSchema.safeParse(form);

  if (!validationResults.success) {
    console.log('Validation Errors:', validationResults.error.errors);
    alert('Please correct the errors in the form.');
    return;
  }

  const formData = new FormData();

  formData.append('about_title_en', form.about_title_en);
  formData.append('about_title_my', form.about_title_my);
  formData.append('about_content_en', form.about_content_en);
  formData.append('about_content_my', form.about_content_my);
  formData.append('about_content_image', about_content_image.value);

  try {
    const response = await api.post('/content_manager/about-us-content/', formData, {
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
  <section class="about-management-form">

    <div class="container">

      <div class="about-management-form">

        <h2>{{t('about_content_form.title')}}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="about-management-form">
            <div class="info" v-for="(question, index) in AboutContentQuestions " :key="index">
              <label class="question-title" :for="question.label">{{ question.label }}</label>

              <input
                  v-if="question.type === 'text'||question.type === 'email' || question.type === 'file' || question.type === 'date'"
                  :type="question.type"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :id="question.label"
                  :accept="question.type === 'file' ? '.doc,.docx,.pdf,.jpg,.jpeg,.png,.gif' : ''"
                  @change="(e) => handleFileUpload(e, question)"
                  @input="validateField(question.id)"
              />


              <select
                  v-if="question.type === 'select' ||  question.type === 'radio'"
                  v-model="form[question.id]"
                  :id="question.label"
                  @change="validateField(question.id)"
              >
                <option value="" disabled>{{ question.placeholder }}</option>
                <option v-for="option in question.options" :key="option.value" :value="option.value">{{
                    option.label
                  }}
                </option>
              </select>

              <span v-if="errors[question.id]" class="error">{{ errors[question.id] }}</span>

              <textarea
                  v-if="question.type === 'textarea'"
                  :id="question.label"
                  :name="question.label"
                  :placeholder="question.placeholder"
                  v-model="form[question.id]"
              />

            </div>
          </div>

          <div>
            <button class="about-management-form-submit" type="submit">Submit</button>
          </div>

        </form>
      </div>

    </div>
  </section>
</template>

<style scoped>

section {
  margin: 2rem 1rem;
  border: 2px solid var(--secondary-color);
  border-radius: 0 30px 30px 0;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
  background-color: white;

  button {
    border: none;
    outline: none;
  }
}

@media (max-width: 800px) {
  section {
    margin: 0.5rem;
  }
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 1200px;
}

.container .about-management-form {
  flex: 1;
  padding: 0 2.5rem;
}

@media (max-width: 800px) {
  .container div {
    display: block;
  }

  .container .about-management-form {
    padding: 0 .5rem;
  }
}

@media (max-width: 1200px) {
  .container {
    display: block;
  }

  .container .about-management-form {
    padding: 0 .5rem;
  }
}

.container .description h2 {
  font-size: 1.2rem;
  padding: .5rem 0;
  font-weight: bold;
  color: var(--primary-color);
  text-align: center;
}

.container .description p {
  font-size: 1rem;
  padding: 1rem 0;
  font-weight: normal;
  color: var(--primary-color);
  text-align: justify;
}

.about-management-form > h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem 0;
}

.about-management-form {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 1rem;
  margin-top: 0.5rem !important;
}

.info {
  flex-basis: 100%;
  box-sizing: border-box;
  display: block;
}

.about-management-form .question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.about-management-form input,
.about-management-form select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.about-management-form textarea {
  width: 100%;
  min-height: 4rem;
  max-height: 4rem;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.error {
  color: red;
  font-size: 1rem;
}

@media (max-width: 1200px) {
  .about-management-form textarea {
    width: calc(100% - .5rem);
  }
}

@media (max-width: 800px) {
  .about-management-form textarea {
    width: calc(100% - .5rem);
  }
}

.about-management-form-submit {
  padding: .5rem 2rem;
  display: flex;
  width: 90%;
  margin: 1rem auto;
  font-size: 1rem;
  border-radius: 1rem 0;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.about-management-form-submit:hover {
  background-color: var(--primary-color);
  transition: .3s ease-in-out;
}

</style>
