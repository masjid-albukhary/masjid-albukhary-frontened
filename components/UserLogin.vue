<script setup>
import { reactive, watch } from 'vue';
import { z } from 'zod';
import { useI18n } from "#i18n";
import { useRouter } from 'vue-router';
import {navigateTo, useCookie, useNuxtApp} from "#app";

const { t } = useI18n();
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
];
const formSchema = z.object({
  username: z
      .string()
      .min(4, 'Username must be at least 8 characters long'),
  password: z
      .string(),
});
const form = reactive({});
const errors = reactive({});

const {$axios} = useNuxtApp();
const api = $axios()
const { setLocale, locale } = useI18n();
const router = useRouter();
const currentLang = locale.value;
const toggleLanguage = async () => {
  const newLang = currentLang === 'en' ? 'ms' : 'en';

  await setLocale(newLang);

  const currentPath = router.currentRoute.value.path;
  const pathWithoutLang = currentPath.replace(/^\/(en|ms)/, '');

  const newPath = newLang === 'ms' ? `/ms${pathWithoutLang}` : `${pathWithoutLang}`;

  router.push(newPath);
};

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


function validateForm() {
  validateField("username");
  validateField("password");
}

async function handleSubmit() {
  validateForm();

  if (!errors.username && !errors.password) {
    try {

      const response = await api.post('/token/', {
        username: form.username,
        password: form.password,
      });

      console.log('Login tokens:', response.data.access, response.data.refresh);

      useCookie('token', { path: '/' }).value = response.data.access;
      useCookie('refresh_token', { path: '/' }).value = response.data.refresh;

      navigateTo('/admin');
      console.log('Navigated to /admin');
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed.');
      // location.reload();
      errorMessage.value = error.response?.data?.message || 'Login failed.';
    }
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
          <router-link to="/admin/user-registration">{{ t('login.navigation.sign_up') }}</router-link>
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
        <button @click="toggleLanguage" class="translation-btn">
          {{ currentLang === 'en' ? 'Switch to Malay' : 'Switch to English' }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.login-section {
  width: 100%;
  margin: 0 auto;
  padding: 4rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--bg-hover-color);
  gap: 0;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--bg-hover-color);
  border-radius: 8px;
  overflow: hidden;
  flex-wrap: wrap;
  box-shadow: rgba(149, 157, 165, 0.3) 0 8px 24px;
  border: 1px solid rgba(149, 157, 165, 0.3);
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

.translation-btn,
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

.translation-btn:hover,
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

