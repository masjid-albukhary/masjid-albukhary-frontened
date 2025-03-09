<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';
import Popup from '~/components/SubmitBookingPopup.vue';

const newsQuestions = [
  {
    label: "Title",
    type: "text",
    placeholder: "Enter news title",
    required: true,
    id: "title",
  },
  {
    label: "Category",
    type: "select",
    options: [
      {label: "Politics", value: "politics"},
      {label: "Business", value: "business"},
      {label: "Local News", value: "local-news"},
    ],
    placeholder: "Select a category",
    required: true,
    id: "category",
  },
  {
    label: "News Content",
    type: "textarea",
    placeholder: "Write the full news article here...",
    required: true,
    id: "content",
  },
  {
    label: "Summary",
    type: "textarea",
    placeholder: "Enter a short summary of the news...",
    required: true,
    id: "summary",
  },
  {
    label: "Image Upload",
    type: "file",
    required: false,
    id: "image",
  },
  {
    label: "Location",
    type: "text",
    placeholder: "Enter city, country",
    required: true,
    id: "location",
  },
  {
    label: "Date of Event",
    type: "date",
    required: true,
    id: "event_date",
  },
];


const formSchema = z.object({
  title: z
      .string()
      .min(8, 'Title  must be at least 15 characters long'),
  content: z
      .string()
      .min(8, 'Content must be at least 50 characters long'),
  summary: z
      .string()
      .min(8, 'Summary must be at least 50 characters long'),
  location: z
      .string()
      .min(8, 'Location must be at least 50 characters long'),
  event_date: z.string().optional(),
  category: z.string().optional(),
  image: z.any().optional(),
});

const form = reactive({});
const errors = reactive({});

newsQuestions.forEach((question) => {
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

newsQuestions.forEach((question) => {
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
  <div class="news-form-section">
    <div class="container">

      <div class="news-form">

        <h2>This is  News Form</h2>

        <form @submit.prevent="handleSubmit">
          <div class="news-form">
            <div class="info" v-for="(question, index) in newsQuestions " :key="index">
              <label class="question-title" :for="question.label">{{ question.label }}</label>

              <input
                  v-if="question.type === 'text'||question.type === 'email' || question.type === 'file' || question.type === 'date'"
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
            <button class="news-form-submit" type="submit">Submit</button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>

.news-form-section {
  margin: 2rem 1rem;
  border: 2px solid var(--secondary-color);
  border-radius: 0 30px 30px 0;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
  background-color: white;
}

@media (max-width: 800px) {
  .news-form-section {
    margin: 0.5rem;
  }
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 1200px;
}

.container .news-form {
  flex: 1;
  padding: 0 2.5rem;
}

@media (max-width: 800px) {
  .container div {
    display: block;
  }
  .container .news-form {
    padding: 0 .5rem;
  }
}

@media (max-width: 1200px) {
  .container {
    display: block;
  }
  .container .news-form {
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

.news-form > h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem 0;
}

.news-form {
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

.news-form .question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.news-form input,
.news-form select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.news-form textarea {
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
  .news-form textarea {
    width: calc(100% - .5rem);
  }
}

@media (max-width: 800px) {
  .news-form textarea {
    width: calc(100% - .5rem);
  }
}

.news-form-submit {
  padding: .5rem 2rem;
  display: flex;
  width: 90%;
  margin: 1rem auto;
  font-size: 1rem;
  border-radius: 1rem 0 ;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.news-form-submit:hover {
  background-color: var(--primary-color);
  transition: .3s ease-in-out;
}

</style>
