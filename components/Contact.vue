<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';

const contactQuestions = [
  {
    label: "Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
    id: "name",
    icon: "user"
  },
  {
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    id: "email",
    icon: "mail"
  },
  {
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter your phone number",
    required: false,
    id: "phone",
    icon: "phone"
  },
  {
    label: "Subject",
    type: "text",
    placeholder: "Enter subject",
    required: false,
    id: "subject",
    icon: "edit"
  },
  {
    label: "Message",
    type: "textarea",
    placeholder: "Type your message here...",
    required: true,
    id: "message",
    icon: "message-circle"
  }
]

const formSchema = z.object({
  name: z
      .string()
      .min(8, 'First name must be at least 8 characters long'),
  email: z
      .string()
      .email('Invalid email format')
      .regex(/@gmail\.com$/, "Must be a valid email ending with '@gmail.com'"),
  phone: z
      .string()
      .regex(/^\d{8,15}$/, 'Invalid phone number'),
  subject: z
      .string()
      .min(8, 'First name must be at least 8 characters long'),
  message: z
      .string()
      .min(20, 'Detail must be at least 20 characters long')
});

const form = reactive({});
const errors = reactive({});

contactQuestions.forEach((question) => {
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

contactQuestions.forEach((question) => {
  watch(() => form[question.id], () => validateField(question.id));
});

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


      const response = await api.post("/maintenance-requests/", formDataObj);
      console.log("Response Data:", response.data);
      Object.keys(form).forEach((key) => (form[key] = ""));
      location.reload()
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response) {
        console.error("Backend Error:", error.response.data);
        alert(`Error: ${error.response.data.detail || "Unable to submit the form."}`);
        // console.log("Response Data:", response.data.value);
      } else if (error.request) {
        console.error("No response from the server:", error.request);
        alert("Server is not responding. Please try again later.");
      } else {
        console.error("Request Setup Error:", error.message);
        alert("An error occurred while submitting the form. Please try again.");
      }
    }
  } else {
    console.log('Validation Errors:', validationResults.error.errors);
    alert("Please correct the errors in the form.");
  }
}

</script>

<template>
  <section class="contact-section">
    <div class="container">

      <div class="contact-info-container">

        <div class="contact-image-container">
          <img src="../public/images/contact-image.jpg" alt="contact-png" class="contact-image"/>
        </div>

        <div class="contact-info">
          <h3>Get on touch with us</h3>
          <span>
            Reach out to us with any questions or concerns you may have, and we’ll be happy to help
          </span>
        </div>

      </div>

      <div class="contact-form">

        <h2>Your Details</h2>

        <form @submit.prevent="handleSubmit">
          <div class="contact-form">
            <div class="info" v-for="(question, index) in contactQuestions " :key="index">
              <label class="question-title" :for="question.label">{{ question.label }}</label>

              <input
                  v-if="question.type === 'text'||question.type === 'email' ||question.type === 'tel'"
                  :type="question.type"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :id="question.label"
                  @input="validateField(question.id)"
              />

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
            <button @click.once="isPopupVisible = true" class="contact-submit" type="submit">Send Message</button>
          </div>

        </form>
      </div>

    </div>
  </section>
</template>

<style scoped>

.contact-section {
  background-color: var(--bg-color);
  width: 100%;
  margin: 3rem auto;
  padding: 5rem 0;
}

.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 800px) {
  .contact-section {
    margin: 0.5rem;
  }

  .container {
    grid-template-columns: 1fr;
    max-width: 1200px;
  }
}

.contact-image-container .contact-image {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  height: 100%;
  object-fit: cover;
  align-content: center;
}

.contact-info-container {
  display: block;
  align-items: center;
  text-align: center;
}

.contact-info-container div {
  text-align: center;
  align-items: center;
  margin: 3rem auto;
}

.contact-info-container .contact-info h3 {
  color: var(--secondary-color);
  font-size: var(--text-size-h6);
}

.contact-info-container .contact-info span {
  color: var(--text-hover);
  font-size: 1rem;
}


.container .contact-form {
  flex: 1;
  padding: 0 2rem;
}

@media (max-width: 800px) {
  .container div {
    display: block;
  }

  .container .contact-form {
    flex: 1;
    padding: 1rem;
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

.contact-form > h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem 0;
}

.contact-form {
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

.contact-form .question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.contact-form input,
.contact-form select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.contact-form textarea {
  width: 205%;
  min-height: 5rem;
  max-height: 5rem;
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
  .contact-form textarea {
    width: calc(100% - .5rem);
  }
}

@media (max-width: 800px) {
  .contact-formcontact-form textarea {
    width: calc(100% - .5rem);
  }
}

.contact-submit {
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

.contact-submit:hover {
  background-color: var(--secondary-color);
  color: var(--text-hover);
  transition: background-color .3s ease-in-out, color .3s ease-in-out;
}

</style>
