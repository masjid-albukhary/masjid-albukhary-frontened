<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';
import {useI18n} from 'vue-i18n'
import {useNuxtApp} from "#app";

const {t} = useI18n()
const {$axios} = useNuxtApp();
const api = $axios()

const activityQuestions = [
  {
    label: t("activity_form.label.title_en"),
    type: "text",
    placeholder: t("activity_form.placeholder.title_en"),
    required: true,
    id: "title_en",
  },
  {
    label: t("activity_form.label.title_my"),
    type: "text",
    placeholder: t("activity_form.placeholder.title_my"),
    required: true,
    id: "title_my",
  },
  {
    label: t("activity_form.label.description_en"),
    type: "textarea",
    placeholder: t("activity_form.placeholder.description_en"),
    required: true,
    id: "description_en",
  },
  {
    label: t("activity_form.label.description_my"),
    type: "textarea",
    placeholder: t("activity_form.placeholder.description_my"),
    required: true,
    id: "description_my",
  },
  {
    label: t("activity_form.label.summary_content_en"),
    type: "textarea",
    placeholder: t("activity_form.placeholder.summary_content_en"),
    required: true,
    id: "summary_content_en",
  },
  {
    label: t("activity_form.label.summary_content_my"),
    type: "textarea",
    placeholder: t("activity_form.placeholder.summary_content_my"),
    required: true,
    id: "summary_content_my",
  },
  {
    label: t("activity_form.label.activity_status"),
    type: "select",
    required: true,
    placeholder: t("activity_form.placeholder.activity_status"),
    id: "activity_status",
    options: [
      {label: "Upcoming", value: "upcoming"},
      {label: "Ongoing", value: "ongoing"},
      {label: "Completed", value: "completed"},
    ],
  },
  {
    label: t("activity_form.label.activity_date"),
    type: "date",
    placeholder: t("activity_form.placeholder.activity_date"),
    required: true,
    id: "activity_date",
  },
  {
    label: t("activity_form.label.activity_type"),
    type: "select",
    required: true,
    id: "activity_type",
    placeholder: t("activity_form.placeholder.activity_type"),
    options: [

      {label: "talk", value: "Talk"},
      {label: "quran class", value: "Quran Class"},
      {label: "community event", value: "Community Event"},
      {label: "fundraising", value: "Fundraising"},
      {label: "volunteer", value: "Volunteer"},
      {label: "others", value: "Others"},
    ],
  },
  {
    label: t("activity_form.label.target_audience"),
    type: "text",
    placeholder: t("activity_form.placeholder.target_audience"),
    id: "target_audience",
  },
  {
    label: t("activity_form.label.estimated_participants"),
    type: "number",
    placeholder: t("activity_form.placeholder.estimated_participants"),
    required: true,
    id: "estimated_participants",
  },
  {
    label: t("activity_form.label.time"),
    type: "text",
    placeholder: t("activity_form.placeholder.time"),
    required: true,
    id: "time",
  },
  {
    label: t("activity_form.label.location"),
    type: "text",
    placeholder: t("activity_form.placeholder.location"),
    required: true,
    id: "location",
  },
  {
    label: t("activity_form.label.poster"),
    type: "file",
    required: true,
    id: "poster",
  },
];
const formSchema = z.object({
  title_en: z
      .string()
      .min(8, 'Activity Title (English) must be at least 8 characters long'),

  title_my: z
      .string()
      .min(8, 'Activity Title (Malay) must be at least 8 characters long'),

  description_en: z
      .string()
      .min(30, 'Description (English) must be at least 30 characters long'),

  description_my: z
      .string()
      .min(30, 'Description (Malay) must be at least 30 characters long'),

  summary_content_en: z
      .string()
      .min(30, 'Description (English) must be at least 30 characters long'),

  summary_content_my: z
      .string()
      .min(30, 'Description (Malay) must be at least 30 characters long'),

  activity_date: z.string().min(1, 'Activity date is required'),

  time: z.string().min(5, 'Time is required (e.g., 8:00 AM - 10:00 AM)'),

  activity_type: z.string().min(1, 'Activity Type is required'),

  location: z.string().min(5, 'Location must be at least 5 characters long'),

  target_audience: z.string().optional(),

  activity_status: z.string().optional(),

  poster: z.any().optional(),

  estimated_participants: z.number().optional(),
});
const form = reactive({});
const errors = reactive({});
activityQuestions.forEach((question) => {
  form[question.id] = "";
  errors[question.id] = "";
});
activityQuestions.forEach((question) => {
  watch(() => form[question.id], () => validateField(question.id));
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

const poster = ref(null);

const handleFileUpload = (event, inputDetails) => {
  if (inputDetails.type !== 'file') {
    return;
  }
  poster.value = event.target.files[0];
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

  formData.append('title_en', form.title_en);
  formData.append('title_my', form.title_my);
  formData.append('description_en', form.description_en);
  formData.append('description_my', form.description_my);
  formData.append('summary_content_en', form.summary_content_en);
  formData.append('summary_content_my', form.summary_content_my);
  formData.append('activity_date', form.activity_date);
  formData.append('time', form.time);
  formData.append('activity_type', form.activity_type);
  formData.append('location', form.location);
  formData.append('target_audience', form.target_audience);
  formData.append('activity_status', form.activity_status);
  formData.append('estimated_participants', form.estimated_participants);
  formData.append('poster', form.poster);
  formData.append('poster', poster.value);

  try {
    const response = await api.post('/content_manager/activities/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert("form has been added successfully.");

    setTimeout(() => {
      location.reload();
    }, 2000);

  } catch (error) {
    // console.log('Form Data Before Validation:', form);
    // console.error('Failed to submit form:', error);
    alert('An error occurred while submitting the form.');
  }
}

</script>

<template>
  <section class="activity-form-section">
    <div class="container">

      <div class="activity-form">

        <h2>{{ t('activity_form.title') }}</h2>

        <form @submit.prevent="handleSubmit">

          <div class="activity-form">

            <div class="info" v-for="(question, index) in activityQuestions " :key="index">
              <label class="question-title" :for="question.label">{{ question.label }}</label>

              <input
                  v-if="['text','email', 'file', 'date','number','url', 'date'].includes(question.type)"
                  :type="question.type"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :id="question.label"
                  :accept="question.type === 'file' ? '.jpg,.jpeg,.png' : ''"
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
            <button class="activity-form-submit" type="submit">Submit</button>
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

.container .activity-form {
  flex: 1;
  padding: 0 2.5rem;
}

@media (max-width: 800px) {
  .container div {
    display: block;
  }

  .container .activity-form {
    padding: 0 .5rem;
  }
}

@media (max-width: 1200px) {
  .container {
    display: block;
  }

  .container .activity-form {
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

.activity-form > h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem 0;
}

.activity-form {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 1rem;
  margin-top: 0.5rem !important;
}

.info {
  flex-basis: calc(50% - 10px);
  box-sizing: border-box;
  display: block;
}

.activity-form .question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.activity-form input,
.activity-form select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.activity-form textarea {
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
  .activity-form textarea {
    width: calc(100% - .5rem);
  }
}

@media (max-width: 800px) {
  .activity-form textarea {
    width: calc(100% - .5rem);
  }
}

.activity-form-submit {
  padding: .5rem 2rem;
  display: flex;
  width: 90%;
  margin: 1rem auto;
  font-size: 1rem;
  border-radius: 1rem 0;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.activity-form-submit:hover {
  background-color: var(--primary-color);
  transition: .3s ease-in-out;
}

</style>
