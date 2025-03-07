<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';

const adminQuestions = [
  {
    label: "Username",
    type: "text",
    placeholder: "Enter your username",
    required: true,
    id: "username",
  },
  {
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
    id: "full_name",
  },
  {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    id: "email",
  },
  {
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter your phone number",
    required: false,
    id: "phone",
  },
  {
    label: "Date of Birth",
    type: "date",
    placeholder: "",
    required: false,
    id: "dob",
  },
  {
    label: "Gender",
    type: "select",
    placeholder: "Select your gender",
    required: false,
    id: "gender",
    options: [
      {value: "male", label: "Male"},
      {value: "female", label: "Female"},
    ],
  },
  {
    label: "Address",
    type: "text",
    placeholder: "Enter your address",
    required: false,
    id: "address",
  },
  {
    label: "User Role",
    type: "select",
    placeholder: "Select user role",
    required: true,
    id: "user_role",
    options: [
      {label: "admin", value: "Admin"},
      {label: "superAdmin", value: "super Admin"},
    ],
  },
  {
    label: "Profile Picture",
    type: "file",
    placeholder: "",
    required: false,
    id: "profile_picture",
  },
  {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    id: "password",
  },
  {
    label: "Confirm Password",
    type: "password",
    placeholder: "Re-enter your password",
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
  user_role: z.string().optional(),
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
      formDataObj.delete('profile_picture')

      if (profile_picture.value) {
        formDataObj.append('profile_picture', profile_picture.value)
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
  <div class="admin-section">
    <div class="container">

      <div class="admin-form">

        <h2>Please fill this Form</h2>

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

            <button class="book-submit" type="submit">Sign Up</button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>

.admin-section {
  margin: 3rem 7rem;
  border: 2px solid var(--secondary-color);
  border-radius: 0 30px 30px 0;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
}

@media (max-width: 800px) {
  .admin-section {
    margin: 0.5rem;
  }
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 1200px;
}


.container .admin-form {
  flex: 1;
  padding: 0 2.5rem;
}

@media (max-width: 800px) {
  .container div {
    display: block;
  }
}

@media (max-width: 1200px) {
  .container {
    display: block;
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

.admin-form > h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem 0;
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

.book-submit {
  width: 90%;
  margin: 2rem auto;
  padding: .5rem 2rem;
  display: flex;
  font-size: 1rem;
  border-radius: 1rem 0;
  background-color: var(--primary-color);
  color: var(--text-color);
  text-align: center;
}

.book-submit:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
  transition: background-color .3s ease-in-out, color .3s ease-in-out;
}

</style>
