<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const facilityQuestions = [
  {
    label: t('facility_form.label.facility_name_en'),
    type: "text",
    placeholder: t('facility_form.placeholder.facility_name_en'),
    required: true,
    id: "facility_name_en",
  },
  {
    label: t('facility_form.label.facility_name_my'),
    type: "text",
    placeholder: t('facility_form.placeholder.facility_name_my'),
    required: true,
    id: "facility_name_my",
  },
  {
    label: t('facility_form.label.facility_category'),
    type: "select",
    placeholder: t('facility_form.placeholder.facility_category'),
    required: true,
    id: "facility_category",
    options: [
      {value: "wedding_hall" , label: "Wedding Hall"},
      {value: "education" , label: "Education"},
      {value: "quran_class" , label: "Quran Class"},
      {value: "sports" , label: "Sports"},
      {value: "community_event" , label: "Community Event"},
      {value: "others" , label: "Others"},
    ]
  },
  {
    label: t('facility_form.label.location'),
    type: "text",
    placeholder: t('facility_form.placeholder.location'),
    required: true,
    id: "facility_location",
  },
  {
    label: t('facility_form.label.facility_description_en'),
    type: "textarea",
    placeholder: t('facility_form.placeholder.facility_description_en'),
    required: true,
    id: "facility_description_en",
  },
  {
    label: t('facility_form.label.facility_description_my'),
    type: "textarea",
    placeholder: t('facility_form.placeholder.facility_description_my'),
    required: true,
    id: "facility_description_my",
  },
  {
    label: t('facility_form.label.facility_features_en'),
    type: "textarea",
    placeholder: t('facility_form.placeholder.facility_features_en'),
    required: false,
    id: "facility_features_en",
  },
  {
    label: t('facility_form.label.facility_features_my'),
    type: "textarea",
    placeholder: t('facility_form.placeholder.facility_features_my'),
    required: false,
    id: "facility_features_my",
  },
  {
    label: t('facility_form.label.capacity'),
    type: "number",
    placeholder: t('facility_form.placeholder.capacity'),
    required: true,
    id: "facility_capacity",
  },
  {
    label: t('facility_form.label.facility_price'),
    type: "number",
    placeholder: t('facility_form.placeholder.facility_price'),
    required: true,
    id: "facility_price",
  },
  {
    label: t('facility_form.label.facility_photo'),
    type: "file",
    placeholder: t('facility_form.placeholder.facility_photo'),
    required: true,
    id: "facility_photo",
  },
]

const formSchema = z.object({
  facility_name_en: z
      .string()
      .min(5, 'Facility Name must be at least 5 characters long'),

  facility_name_my: z
      .string()
      .min(5, 'Facility Name must be at least 5 characters long'),

  facility_category: z
      .string()
      .min(3, 'Facility Type is required'),

  facility_features_en: z
      .string()
      .min(30, 'Description must be at least 30 characters long'),

  facility_features_my: z
      .string()
      .min(30, 'Description must be at least 30 characters long'),

  facility_description_en: z
      .string()
      .min(30, 'Description must be at least 30 characters long'),

  facility_description_my: z
      .string()
      .min(30, 'Description must be at least 30 characters long'),

  facility_location: z
      .string()
      .min(5, 'Location must be at least 5 characters long'),

  facility_photo: z.any().optional(),

  facility_capacity: z
      .number()
      .min(1, 'Capacity must be at least 1'),

  price_capacity: z
      .number()
      .min(1, 'Capacity must be at least 1'),

});

const form = reactive({});
const errors = reactive({});

facilityQuestions.forEach((question) => {
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

facilityQuestions.forEach((question) => {
  watch(() => form[question.id], () => validateField(question.id));
});

const image = ref(null);

const handleFileUpload = (event, inputDetails) => {
  if (inputDetails.type !== 'file') {
    return;
  }
  image.value = event.target.files[0];
};

async function handleSubmit() {
  form.Date = new Date().toLocaleDateString("en-GB");

  const validationResults = formSchema.safeParse(form);

  if (!validationResults.success) {
    console.log('Validation Errors:', validationResults.error.errors);
    alert("Please correct the errors in the form.");
    return;
  }

  alert("Form Submitted Successfully.");
  // location.reload();

  // If validation is successful
  console.log("Form Submitted Successfully:", form);
}
</script>

<template>
  <section class="facility-form-section">
    <div class="container">

      <div class="facility-form">

        <h2>{{ t('facility_form.title') }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="facility-form">
            <div class="info" v-for="(question, index) in facilityQuestions " :key="index">
              <label class="question-title" :for="question.label">{{ question.label }}</label>

              <input
                  v-if="['text','email', 'file', 'date', 'radio','number'].includes(question.type)"
                  :type="question.type"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :id="question.label"
                  :accept="question.type === 'file' ? '.jpg,.jpeg,.png,' : ''"
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
            <button class="facility-form-submit" type="submit">Submit</button>
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

.container .facility-form {
  flex: 1;
  padding: 0 2.5rem;
}

@media (max-width: 800px) {
  .container div {
    display: block;
  }

  .container .facility-form {
    padding: 0 .5rem;
  }
}

@media (max-width: 1200px) {
  .container {
    display: block;
  }

  .container .facility-form {
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

.facility-form > h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem 0;
}

.facility-form {
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

.facility-form .question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.facility-form input,
.facility-form input[type="checkbox"],
.facility-form input[type="radio"],
.facility-form input[type="number"],
.facility-form select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.facility-form textarea {
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
  .facility-form textarea {
    width: calc(100% - .5rem);
  }
}

@media (max-width: 800px) {
  .facility-form textarea {
    width: calc(100% - .5rem);
  }
}

.facility-form-submit {
  padding: .5rem 2rem;
  display: flex;
  width: 90%;
  margin: 1rem auto;
  font-size: 1rem;
  border-radius: 1rem 0;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.facility-form-submit:hover {
  background-color: var(--primary-color);
  transition: .3s ease-in-out;
}

</style>
