<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const facilityQuestions = [
  {
    label: t('facility_form.label.facility_name'),
    type: "text",
    placeholder: t('facility_form.placeholder.facility_name'),
    required: true,
    id: "facility_name",
  },
  {
    label: t('facility_form.label.facility_type'),
    type: "select",
    placeholder: t('facility_form.placeholder.facility_type'),
    required: true,
    id: "facility_type",
    options: ["Prayer", "Education", "Sports", "Community", "Others"]
  },
  {
    label: t('facility_form.label.location'),
    type: "text",
    placeholder: t('facility_form.placeholder.location'),
    required: true,
    id: "location",
  },
  {
    label: t('facility_form.label.upload_photos'),
    type: "file",
    placeholder: t('facility_form.placeholder.upload_photos'),
    required: true,
    id: "photos",
  },
  {
    label: t('facility_form.label.capacity'),
    type: "number",
    placeholder: t('facility_form.placeholder.capacity'),
    required: true,
    id: "capacity",
  },
  {
    label: t('facility_form.label.booking_required'),
    type: "select",
    placeholder: t('facility_form.placeholder.booking_required'),
    required: true,
    id: "booking_required",
    options: [
      { label: t('facility_form.label.yes'), value: "yes" },
      { label: t('facility_form.label.no'), value: "no" }
    ]
  },
  {
    label: t('facility_form.label.equipment'),
    type: "textarea",
    placeholder: t('facility_form.placeholder.equipment'),
    required: true,
    id: "equipment",
  },
  {
    label: t('facility_form.label.rules'),
    type: "textarea",
    placeholder: t('facility_form.placeholder.rules'),
    required: false,
    id: "rules",
  },
  {
    label: t('facility_form.label.description'),
    type: "textarea",
    placeholder: t('facility_form.placeholder.description'),
    required: true,
    id: "description",
  },
]

const formSchema = z.object({
  facility_name: z
      .string()
      .min(5, 'Facility Name must be at least 5 characters long'),

  facility_type: z
      .string()
      .min(3, 'Facility Type is required'),

  description: z
      .string()
      .min(30, 'Description must be at least 30 characters long'),

  location: z
      .string()
      .min(5, 'Location must be at least 5 characters long'),

  photos: z.any().optional(),

  capacity: z
      .number()
      .min(1, 'Capacity must be at least 1'),

  equipment: z
      .string()
      .min(30, 'Equipment must be at least 30 characters long'),

  rules: z
      .string()
      .optional(),

  booking_required: z
      .string().optional(),

  booking_contact: z
      .string()
      .optional(),
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
  if (validationResults.success) {
    try {
      console.log("Sending API Request...");
      const formDataObj = new FormData();
      for (const key in form) {
        const value = form[key];
        if (value === null || value === undefined) {
          continue;
        }
        formDataObj.append(key, value);
      }
      formDataObj.delete('image')

      if (image.value) {
        formDataObj.append('image', image.value)
      }

      const response = await api.post("/maintenance-requests/", formDataObj);
      console.log("Response Data:", response.data);
      Object.keys(form).forEach((key) => (form[key] = ""));
      isPopupVisible.value = true;
      location.reload()
    } catch (error) {
      isPopupVisible.value = false;
      console.error("Error occurred:", error);
      if (error.response) {
        console.error("Backend Error:", error.response.data);
        alert(`Error: ${error.response.data.detail || "Unable to submit the form."}`);
        isPopupVisible.value = false;
        // console.log("Response Data:", response.data.value);
      } else if (error.request) {
        console.error("No response from the server:", error.request);
        alert("Server is not responding. Please try again later.");
        isPopupVisible.value = false;
      } else {
        console.error("Request Setup Error:", error.message);
        alert("An error occurred while submitting the form. Please try again.");
        isPopupVisible.value = false;
      }
      isPopupVisible.value = false;
    }
  } else {
    console.log('Validation Errors:', validationResults.error.errors);
    isPopupVisible.value = false;
    alert("Please correct the errors in the form.");
  }
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
