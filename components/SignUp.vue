<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';
import {useI18n} from 'vue-i18n';
import {useNuxtApp} from "#app";

const {t} = useI18n();
const adminQuestions = [
  {
    label: t('sign_up.label.username'),
    type: "text",
    placeholder: t('sign_up.placeholder.username'),
    required: true,
    id: "username",
  },
  {
    label: t('sign_up.label.full_name'),
    type: "text",
    placeholder: t('sign_up.placeholder.full_name'),
    required: true,
    id: "full_name",
  },
  {
    label: t('sign_up.label.email'),
    type: "email",
    placeholder: t('sign_up.placeholder.email'),
    required: true,
    id: "email",
  },
  {
    label: t('sign_up.label.phone'),
    type: "tel",
    placeholder: t('sign_up.placeholder.phone'),
    required: false,
    id: "phone_number",
  },
  {
    label: t('sign_up.label.dob'),
    type: "date",
    placeholder: t('sign_up.placeholder.dob'),
    required: false,
    id: "dob",
  },
  {
    label: t('sign_up.label.gender'),
    type: "select",
    placeholder: t('sign_up.placeholder.gender'),
    required: false,
    id: "gender",
    options: [
      {value: "male", label: "Male"},
      {value: "female", label: "Female"},
    ],
  },
  {
    label: t('sign_up.label.address'),
    type: "text",
    placeholder: t('sign_up.placeholder.address'),
    required: false,
    id: "address",
  },
  {
    label: t('sign_up.label.profile_picture'),
    type: "file",
    placeholder: t('sign_up.placeholder.profile_picture'),
    required: false,
    id: "profile_picture",
  },
  {
    label: t('sign_up.label.password'),
    type: "password",
    placeholder: t('sign_up.placeholder.password'),
    required: true,
    id: "password",
  },
  {
    label: t('sign_up.label.confirm_password'),
    type: "password",
    placeholder: t('sign_up.placeholder.confirm_password'),
    required: true,
    id: "confirm_password",
  },
];

const formSchema = z.object({
  username: z
      .string()
      .min(8, 'First username must be at least 8 characters long'),

  full_name: z
      .string()
      .min(8, 'Last Name must be at least 8 characters long'),

  email: z
      .string()
      .email('Invalid email format'),

  phone_number: z
      .string()
      .regex(/^\d{8,15}$/, 'Invalid phone number'),

  dob: z.string().optional(),

  address: z
      .string()
      .min(8, 'Address must be at least 8 characters long'),

  gender: z.string().optional(),

  profile_picture: z.any().optional(),

  password: z
      .string(),

  confirm_password: z
      .string()
      .refine(value => value === form["password"], "Passwords must match"),

});
const form = reactive({});
const errors = reactive({});
const {$axios} = useNuxtApp();
const api = $axios()
const profile_picture = ref(null);
const handleFileUpload = (event, inputDetails) => {
  if (inputDetails.type !== 'file') {
    return;
  }
  profile_picture.value = event.target.files[0];
};

adminQuestions.forEach((question) => {
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

adminQuestions.forEach((question) => {
  watch(() => form[question.id], () => validateField(question.id));
});

const handleSubmit = async () => {

  const validationResults = formSchema.safeParse(form);
  if (!validationResults.success) {
    console.log('Validation Errors:', validationResults.error.errors);
    alert('Please correct the errors in the form.');
    return;
  }

  const formData = new FormData();
  formData.append('username', form.username);
  formData.append('email', form.email);
  formData.append('password', form.password);

  formData.append('profile[full_name]', form.full_name);
  formData.append('profile[phone]', form.phone_number);
  formData.append('profile[dob]', form.dob);
  formData.append('profile[gender]', form.gender);
  formData.append('profile[address]', form.address);
  if (profile_picture.value) {
    formData.append('profile[profile_picture]', profile_picture.value);
  }

  formData.forEach((value, key) => {
    console.log(key, value);
  });

  try {
    const response = await api.post('/accounts/register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Form Submitted Successfully:', response.data);
    showPopup.value = true;
    location.reload();
  } catch (error) {

    console.error('Failed to submit form:', error.response?.data || error.message);
    alert('An error occurred while submitting the form.');
  }
};

</script>

<template>
  <section class="admin-section">
    <div class="sign-up-container ">

      <div class="admin-form">

        <h2>{{ t('sign_up.title') }}</h2>

        <hr class="divider"/>

        <form @submit.prevent="handleSubmit">
          <div class="admin-form">

            <div class="info" v-for="(question, index) in adminQuestions " :key="index">

              <label class="question-title" :for="question.label">{{ question.label }}</label>

              <input
                  v-if="['text','email', 'file', 'date','tel','password'].includes(question.type)"
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

            </div>
          </div>

          <div>
            <button class="sign-up-submit" type="submit">{{ t('sign_up.submit') }}</button>
          </div>

        </form>

        <hr class="divider"/>


      </div>

    </div>
  </section>
</template>

<style scoped>

section {
  width: 100%;
  height: 100%;
  background: var(--bg-hover-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0;
  gap: 0;
}

@media (max-width: 800px) {
  section {
    margin: 0.5rem;
  }
}

.sign-up-container {
  margin: 0 auto;
  border-radius: 8px;
}

.divider {
  width: 100%;
  max-width: 1000px !important;
  margin: 1rem auto;
  border: 1.5px solid rgba(149, 157, 165, 0.3);
}


.sign-up-container .admin-form {
  flex: 1;
  padding: 0 2.5rem;
}

@media (max-width: 800px) {
  .sign-up-container div {
    display: block;
  }
}

@media (max-width: 1200px) {
  .sign-up-container {
    display: block;
  }
}

.admin-form > h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding-top: 1rem;
  margin: 0 auto;
}

.admin-form {
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

.admin-form .question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.admin-form input,
.admin-form select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.admin-form textarea {
  width: 205%;
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
  .sign-up-container .admin-form {
    padding: 0 .5rem;
  }

  .admin-form textarea {
    width: calc(100% - .5rem);
  }
}

@media (max-width: 800px) {
  .sign-up-container .admin-form {
    padding: 0 .5rem;
  }

  .admin-form textarea {
    width: calc(100% - .5rem);
  }
}

.sign-up-submit {
  width: 90%;
  margin: .5rem auto;
  padding: .5rem;
  display: flex;
  font-size: 1rem;
  border-radius: 1rem 0;
  background-color: var(--primary-color);
  color: var(--text-color);
  text-align: center;
  border: none;
  outline: none;
  transition: background-color .3s ease-in-out;
}

.sign-up-submit:hover {
  background-color: var(--secondary-color);
}

</style>
