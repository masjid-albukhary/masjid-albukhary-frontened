<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const {setLocale, locale} = useI18n();
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
    id: "phone",
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
      .email('Invalid email format')
      .regex(/@gmail\.com$/, "Must be a valid email ending with '@gmail.com'"),

  phone: z
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

const profile_picture = ref(null);
const handleFileUpload = (event, inputDetails) => {
  if (inputDetails.type !== 'file') {
    return;
  }
  profile_picture.value = event.target.files[0];
};

const currentLang = locale.value;
const toggleLanguage = async () => {
  const newLang = currentLang === 'en' ? 'ms' : 'en';

  await setLocale(newLang);

  const currentPath = router.currentRoute.value.path;
  const pathWithoutLang = currentPath.replace(/^\/(en|ms)/, '');

  const newPath = newLang === 'ms' ? `/ms${pathWithoutLang}` : `${pathWithoutLang}`;

  router.push(newPath);
};

async function handleSubmit() {
  form.Date = new Date().toLocaleDateString("en-GB");

  const validationResults = formSchema.safeParse(form);

  if (!validationResults.success) {
    console.log('Validation Errors:', validationResults.error.errors);
    alert("Please correct the errors in the form.");
    return;
  }

  // If validation is successful
  console.log("Form Submitted Successfully:", form);
}

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

        <div class="buttons-container">

          <div class="buttons">
            <router-link to="/" class="login-btn">
              {{ t('sign_up.home_btn') }}
            </router-link>
            <router-link to="/login" class="sign-up-btn">
              {{ t('sign_up.login_btn') }}
            </router-link>
          </div>

          <button @click="toggleLanguage" class="translation-btn">
            {{ currentLang === 'en' ? 'Switch to Malay' : 'Switch to English' }}
          </button>
        </div>


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
  padding: 4rem 0;
  gap: 0;
}

@media (max-width: 800px) {
  section {
    margin: 0.5rem;
  }
}

.sign-up-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: rgba(149, 157, 165, 0.3) 0 8px 24px;
  border: 1px solid rgba(149, 157, 165, 0.3);
}

.divider {
  width: 100%;
  max-width: 1000px !important;
  margin: 1rem auto;
  border: 1.5px solid rgba(149, 157, 165, 0.3) ;
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
  flex-basis: calc(50% - 10px);
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
  .admin-form textarea {
    width: calc(100% - .5rem);
  }
}

@media (max-width: 800px) {
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

.buttons-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  font-size: 1.2rem;
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.sign-up-btn,
.login-btn {
  padding: .5rem 1rem;
  color: var(--primary-color);
  border: none;
  text-decoration: none;
  transition: all 0.3s ease;
}


.translation-btn {
  padding: .5rem 1rem;
  color: var(--primary-color);
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sign-up-btn:hover,
.login-btn:hover,
.translation-btn:hover {
  color: var(--secondary-color);
  text-decoration: underline;
}

@media (max-width: 600px) {

  .buttons-container {
    flex-direction: column;
  }

  .buttons-container {
    width: 90%;
  }

  .buttons {
    flex-direction: column;
    gap: 10px;
  }
}


</style>
