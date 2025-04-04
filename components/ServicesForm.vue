<script setup>
import { reactive, watch } from 'vue';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const serviceQuestions = [
  {
    label: t("service_form.label.services_title_en"),
    type: "text",
    placeholder: t("service_form.placeholder.services_title_en"),
    required: true,
    id: "services_title_en",
  },
  {
    label: t("service_form.label.services_title_my"),
    type: "text",
    placeholder: t("service_form.placeholder.services_title_my"),
    required: true,
    id: "services_title_my",
  },
  {
    label: t("service_form.label.services_description_en"),
    type: "textarea",
    placeholder: t("service_form.placeholder.services_description_en"),
    required: true,
    id: "services_description_en",
  },
  {
    label: t("service_form.label.services_description_my"),
    type: "textarea",
    placeholder: t("service_form.placeholder.services_description_my"),
    required: true,
    id: "services_description_my",
  },
  {
    label: t("service_form.label.services_features_en"),
    type: "textarea",
    placeholder: t("service_form.placeholder.services_features_en"),
    required: true,
    id: "services_features_en",
  },
  {
    label: t("service_form.label.services_features_my"),
    type: "textarea",
    placeholder: t("service_form.placeholder.features_my"),
    required: true,
    id: "services_features_my",
  },
  {
    label: t("service_form.label.services_price"),
    type: "number",
    placeholder: t("service_form.placeholder.services_price"),
    required: true,
    id: "services_price",
  },
  {
    label: t("service_form.label.services_capacity"),
    type: "number",
    placeholder: t("service_form.placeholder.services_capacity"),
    required: false,
    id: "services_capacity",
  },
];

const formSchema = z.object({
  services_title_en: z
      .string()
      .min(8, 'Services Title (English) must be at least 8 characters long'),

  services_title_my: z
      .string()
      .min(8, 'Services Title (Malay) must be at least 8 characters long'),

  services_description_en: z
      .string()
      .min(30, 'Description (English) must be at least 30 characters long'),

  services_description_my: z
      .string()
      .min(30, 'Description (Malay) must be at least 30 characters long'),

  services_features_en: z
      .string()
      .min(10, 'Please provide at least one feature in English'),

  services_features_my: z
      .string()
      .min(10, 'Please provide at least one feature in Malay'),

  services_price: z
      .number()
      .min(0, 'Price must be a positive number'),

  services_capacity: z
      .number()
      .min(0, 'Capacity must be a positive number'),
});

const form = reactive(
    serviceQuestions.reduce((acc, { id }) => {
      acc[id] = '';
      return acc;
    }, {})
);

const errors = reactive({});

serviceQuestions.forEach((question) => {
  errors[question.id] = '';
});

function validateField(field) {
  try {
    formSchema.shape[field].parse(form[field]);
    errors[field] = '';
  } catch (error) {
    errors[field] = error.errors ? error.errors[0].message : error.message;
  }
}

serviceQuestions.forEach((question) => {
  watch(() => form[question.id], () => validateField(question.id));
});

async function handleSubmit() {
  form.Date = new Date().toLocaleDateString("en-GB");

  const validationResults = formSchema.safeParse(form);

  if (!validationResults.success) {
    console.log('Validation Errors:', validationResults.error.errors);
    alert("Please correct the errors in the form.");
    return;
  }

  alert("Form Submitted Successfully.");
  location.reload();

  // If validation is successful
  console.log("Form Submitted Successfully:", form);
}
</script>

<template>
  <section class="service-form-section">
    <div class="container">

      <div class="service-form">

        <h2>{{ t('service_form.title') }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="service-form">
            <div class="info" v-for="(question, index) in serviceQuestions " :key="index">
              <label class="question-title" :for="question.label">{{ question.label }}</label>

              <input
                  v-if="['text','email', 'date','number','url', 'date'].includes(question.type)"
                  :type="question.type"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :id="question.label"
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
            <button class="service-form-submit" type="submit">Submit</button>
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

.container .service-form {
  flex: 1;
  padding: 0 2.5rem;
}

@media (max-width: 800px) {
  .container div {
    display: block;
  }

  .container .service-form {
    padding: 0 .5rem;
  }
}

@media (max-width: 1200px) {
  .container {
    display: block;
  }

  .container .service-form {
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

.service-form > h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem 0;
}

.service-form {
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

.service-form .question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.service-form input,
.service-form select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.service-form textarea {
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
  .service-form textarea {
    width: calc(100% - .5rem);
  }
}

@media (max-width: 800px) {
  .service-form textarea {
    width: calc(100% - .5rem);
  }
}

.service-form-submit {
  padding: .5rem 2rem;
  display: flex;
  width: 90%;
  margin: 1rem auto;
  font-size: 1rem;
  border-radius: 1rem 0;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.service-formservice-form-submit:hover {
  background-color: var(--primary-color);
  transition: .3s ease-in-out;
}

</style>
