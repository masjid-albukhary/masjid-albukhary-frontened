<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';
import Popup from '~/components/SubmitBookingPopup.vue';

const bookingQuestions = [
  {
    label: "Contact Person Name",
    type: "text",
    placeholder: "First Name",
    required: true,
    id: "contact_person_first_name",
  },
  {
    label: "Contact Person Name",
    type: "text",
    placeholder: "Last Name",
    required: true,
    id: "contact_person_last_name",
  },
  {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    id: "email",
  },
  {
    label: "Contact Number",
    type: "text",
    placeholder: "Enter contact number",
    required: true,
    id: "phone",
  },
  {
    label: "Address",
    type: "text",
    placeholder: "Address",
    required: true,
    id: "address",
  },
  {
    label: "Postal Code",
    type: "text",
    placeholder: "Enter postal code",
    required: true,
    id: "postal_code",
  },
  {
    label: "Date of Nikah",
    type: "date",
    placeholder: "DD-Month-YYYY (e.g., 10 Sept 2022)",
    required: true,
    id: "date_of_nikah",
  },
  {
    label: "Choose your time slot",
    type: "radio",
    options: [
      {value: "10 AM", label: "10 AM"},
      {value: "11 AM", label: "11 AM"},
      {value: "2 PM (Mon-Thurs)", label: "2 PM (Mon-Thurs)"},
      {value: "3 PM (Mon-Thurs)", label: "3 PM (Mon-Thurs)"},
    ],
    required: true,
    placeholder: "Choose your time slot",
    id: "time_slot",
  },
  {
    label: "Select Venue",
    type: "select",
    options: [
      {value: "venue_1", label: "Venue 1"},
      {value: "venue_2", label: "Venue 2"},
      {value: "other", label: "Other"},
    ],
    required: true,
    id: "venue",
    placeholder: "Select an option",
  },
  {
    label: "Other Requests/Inquiries",
    type: "file",
    required: true,
    placeholder: "Upload any requests or inquiries",
    id: "supporting_docs",
  },
  {
    label: "Other Requests/Inquiries",
    type: "textarea",
    placeholder: "Enter any requests or inquiries",
    required: false,
    id: "other_requests",
  },
];

const formSchema = z.object({
  contact_person_first_name: z
      .string()
      .min(8, 'First name must be at least 8 characters long'),
  contact_person_last_name: z
      .string()
      .min(8, 'Last Name must be at least 8 characters long'),
  email: z
      .string()
      .email('Invalid email format')
      .regex(/@gmail\.com$/, "Must be a valid email ending with '@gmail.com'"),
  phone: z
      .string()
      .regex(/^\d{8,15}$/, 'Invalid phone number'),
  address: z.string()
      .min(8, 'Address must be at least 8 characters long'),
  postal_code: z
      .string()
      .regex(/^\d{4,8}$/, 'Invalid postal code'),
  date_of_nikah: z.string().optional(),
  time_slot: z.string().optional(),
  venue: z.string().optional(),
  supporting_docs: z.any().optional(),
  other_requests: z
      .string()
      .min(20, 'Detail must be at least 20 characters long'),
});

const form = reactive({});
const errors = reactive({});

bookingQuestions.forEach((question) => {
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

bookingQuestions.forEach((question) => {
  watch(() => form[question.id], () => validateField(question.id));
});

const evidence_photo = ref(null);

const handleFileUpload = (event, inputDetails) => {
  if (inputDetails.type !== 'file') {
    return;
  }
  evidence_photo.value = event.target.files[0];
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
      formDataObj.delete('supporting_docs')

      if (evidence_photo.value) {
        formDataObj.append('supporting_docs', evidence_photo.value)
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
  <div class="contact-section">
    <div class="container">

      <div class="booking-form">

        <h2>Please fill this Booking Form</h2>

        <form @submit.prevent="handleSubmit">
          <div class="booking-form">

            <div class="info" v-for="(question, index) in bookingQuestions " :key="index">

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


            <button @click.once="isPopupVisible = true" class="book-submit" type="submit"> Book Now</button>
            <Popup :show="isPopupVisible" @update:show="isPopupVisible = $event">
            </Popup>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<style scoped>

.contact-section {
  margin: 3rem 7rem;
  border: 2px solid var(--secondary-color);
  border-radius: 0 30px 30px 0;
  box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
}

@media (max-width: 800px) {
  .contact-section {
    margin: 0.5rem;
  }
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 1200px;
}


.container .booking-form {
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

.booking-form > h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem 0;
}

.booking-form {
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

.booking-form .question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.booking-form input,
.booking-form select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.booking-form textarea {
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
  .booking-form textarea {
    width: calc(100% - .5rem);
  }
}

@media (max-width: 800px) {
  .booking-form textarea {
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
