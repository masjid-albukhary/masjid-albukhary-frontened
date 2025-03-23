<script setup>

import {reactive, ref, watch} from 'vue';
import {z} from 'zod';

const {t} = useI18n();

const loginQuestions = [
  {
    label: t('login.label.username'),
    type: "text",
    placeholder: t('login.label.username'),
    required: true,
    id: "username",
  },
  {
    label: t('login.label.password'),
    type: "password",
    placeholder: t('login.placeholder.password'),
    required: true,
    id: "password",
  },
  {
    label: t('login.label.confirm_password'),
    type: "password",
    placeholder: t('login.placeholder.confirm_password'),
    required: true,
    id: "confirm_password",
  },
];

const formSchema = z.object({
  username: z
      .string()
      .min(8, 'First username must be at least 8 characters long'),
  password: z
      .string(),
  confirm_password: z
      .string()
      .refine(value => value === form["password"], "Passwords must match"),

});

const form = reactive({});
const errors = reactive({});

loginQuestions.forEach((question) => {
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

loginQuestions.forEach((question) => {
  watch(() => form[question.id], () => validateField(question.id));
});

const isPopupVisible = ref(false)

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

      const response = await api.post("//", formDataObj);
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
  <section class="login-section">
    <div class="login-container">

      <div class="login-info-container">
        <div class="login-image-container">
          <img src="../public/images/login.png" alt="Login Image" class="login-image"/>
        </div>
        <div class="login-info">
          <router-link to="/">{{ t('login.navigation.home') }}</router-link>
          <span> | </span>
          <router-link to="/sign-up">{{ t('login.navigation.sign_up') }}</router-link>
        </div>
      </div>

      <div class="login-form-container">
        <h2>{{ t('login.welcome') }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group" v-for="(question, index) in loginQuestions" :key="index">
            <label :for="question.label" class="question-title">{{ question.label }}</label>
            <input

                v-if="['text', 'password'].includes(question.type)"
                :type="question.type"
                v-model="form[question.id]"
                :placeholder="question.placeholder"
                :id="question.label"
                @input="validateField(question.id)"
            />
            <span v-if="errors[question.id]" class="error">{{ errors[question.id] }}</span>
          </div>
          <button class="login-submit" type="submit">{{t('login.button')}}</button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.login-section {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 4rem 0;
  background: linear-gradient(120deg, #0b78d2 50%, #489fe7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  margin: 0 auto;
  box-shadow: rgba(149, 157, 165, 0.3) 0 8px 24px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.login-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: var(--bg-color);
  padding: 2rem;
}

.login-image {
  width: 100%;
  max-width: 350px;
  object-fit: cover;
}

.login-info {
  margin-top: 1.5rem;
  font-size: 1.2rem;
}

.login-info a,
.login-info span {
  text-decoration: none;
  font-weight: normal;
  color: var(--primary-color);
}

.login-info a:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

.login-form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
}

.login-form-container h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.question-title {
  font-size: 1rem;
  color: var(--primary-color);
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #eee;
  border-radius: 5px;
  outline: none;
  font-size: 1rem;
}

.error {
  color: red;
  font-size: 0.9rem;
  display: block;
  margin-top: 0.3rem;
}

.login-submit {
  width: 100%;
  padding: 0.7rem;
  font-size: 1rem;
  border-radius: 8px;
  background-color: var(--primary-color);
  color: var(--text-color);
  text-align: center;
  cursor: pointer;
  border: none;
  margin-top: 1rem;
}

.login-submit:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

@media (max-width: 800px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 90%;
    padding: 1rem;
  }

  .login-info-container {
    padding: 1rem;
  }

  .login-form-container {
    padding: 1rem;
  }
}
</style>

