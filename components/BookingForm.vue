<script setup>
import {reactive, ref, watch} from 'vue';
import {z} from 'zod';

const {t} = useI18n();
import Popup from '~/components/SubmitBookingPopup.vue';

const bookingQuestions = [
  {
    label: t('booking.booking_form.label.first_name'),
    type: "text",
    placeholder: t('booking.booking_form.placeholder.first_name'),
    required: true,
    id: "first_name",
  },
  {
    label: t('booking.booking_form.label.last_name'),
    type: "text",
    placeholder: t('booking.booking_form.placeholder.last_name'),
    required: true,
    id: "last_name",
  },
  {
    label: t('booking.booking_form.label.email'),
    type: "email",
    placeholder: t('booking.booking_form.placeholder.email'),
    required: true,
    id: "email",
  },
  {
    label: t('booking.booking_form.label.phone'),
    type: "text",
    placeholder: t('booking.booking_form.placeholder.phone'),
    required: true,
    id: "phone",
  },
  {
    label: t('booking.booking_form.label.address'),
    type: "text",
    placeholder: t('booking.booking_form.placeholder.address'),
    required: true,
    id: "address",
  },
  {
    label: t('booking.booking_form.label.postal_code'),
    type: "text",
    placeholder: t('booking.booking_form.placeholder.postal_code'),
    required: true,
    id: "postal_code",
  },
  {
    label: t('booking.booking_form.label.booking_date'),
    type: "date",
    placeholder: t('booking.booking_form.placeholder.booking_date'),
    required: true,
    id: "booking_date",
  },
  {
    label: t('booking.booking_form.label.guests'),
    type: "number",
    placeholder: t('booking.booking_form.placeholder.guests'),
    required: true,
    id: "guests",
  },
  {
    label: t('booking.booking_form.label.time_slot'),
    type: "radio",
    options: [
      {value: "10 AM", label: "10 AM"},
      {value: "11 AM", label: "11 AM"},
      {value: "2 PM (Mon-Thurs)", label: "2 PM (Mon-Thurs)"},
      {value: "3 PM (Mon-Thurs)", label: "3 PM (Mon-Thurs)"},
    ],
    required: true,
    placeholder: t('booking.booking_form.placeholder.time_slot'),
    id: "time_slot",
  },
  {
    label: t('booking.booking_form.label.venue'),
    type: "select",
    options: [
      {value: "venue_1", label: "Venue 1"},
      {value: "venue_2", label: "Venue 2"},
      {value: "other", label: "Other"},
    ],
    required: true,
    id: "venue",
    placeholder: t('booking.booking_form.placeholder.venue'),
  },
  {
    label: t('booking.booking_form.label.services'),
    type: "select",
    options: [
      {value: "circumcision_event", label: "Circumcision Event at Masjid Al-Bukhari"},
      {value: "aqiqah", label: "Aqiqah with Masjid Al-Bukhari"},
      {value: "quran_classes", label: "Quran Classes (6 - 18 years old)"},
      {value: "zakat_fitrah", label: "Zakat Fitrah"},
      {value: "solemnisation", label: "Solemnisation at Al-Bukhari Mosque"},
      {value: "qurban_event", label: "Participate in Our Qurban Event"},
      {value: "yasin_tahlil", label: "Yasin & Tahlil"},
      {value: "funeral_management", label: "Jenazah or Funeral Management"},
      {value: "catering", label: "Catering from Our Own Kitchen"},
      {value: "e_wasiat", label: "E-Wasiat"},
      {value: "e_khairat_kematian", label: "E-Khairat Kematian"},
      {value: "other", label: "Other"},
    ],
    required: true,
    id: "services",
    placeholder: t('booking.booking_form.placeholder.services'),
  },
  {
    label: t('booking.booking_form.label.other_docs'),
    type: "file",
    required: true,
    placeholder: t('booking.booking_form.placeholder.other_docs'),
    id: "other_docs",
  },
  {
    label: t('booking.booking_form.label.other_requests'),
    type: "textarea",
    placeholder: t('booking.booking_form.placeholder.other_requests'),
    required: false,
    id: "other_requests",
  },
];

const formSchema = z.object({
  first_name: z
      .string()
      .min(8, 'First name must be at least 8 characters long'),

  last_name: z
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

  booking_date: z.string().optional(),

  time_slot: z.string().optional(),

  venue: z.string().optional(),

  services: z.string().optional(),

  other_docs: z.any().optional(),

  guests: z.number().optional(),

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
      formDataObj.delete('other_docs')

      if (evidence_photo.value) {
        formDataObj.append('other_docs', evidence_photo.value)
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
  <section class="booking-form-section">
    <div class="container">

      <div class="booking-form">

        <h2>{{ t('booking.title') }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="booking-form">

            <div class="info" v-for="(question, index) in bookingQuestions " :key="index">

              <label class="question-title" :for="question.label">{{ question.label }}</label>

              <input
                  v-if="['text','email', 'file', 'date', 'number'].includes(question.type)"
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


            <button @click.once="isPopupVisible = true" class="book-venue-submit" type="submit">
              {{ t('booking.booking_form.submit') }}
            </button>
            <Popup :show="isPopupVisible" @update:show="isPopupVisible = $event">
            </Popup>
          </div>

        </form>
      </div>

    </div>
  </section>
</template>

<style scoped>
section {
  margin: 3rem auto;
}

@media (max-width: 800px) {
  .booking-form-section {
    margin: 1rem;
    border-radius: 10px;
  }
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1000px;
  margin: auto;
  border: 2px solid var(--secondary-color);
  border-radius: 0 30px 30px 0;
  box-shadow: rgba(99, 99, 99, 0.4) 0 2px 8px 0;
}

@media (max-width: 1200px) {
  .container {
    flex-direction: column;
  }
}

.container .booking-form {
  flex: 1;
  padding: 1rem;
  min-width: 300px;
}

.booking-form h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  text-align: center;
  padding: 1rem 0;
}

.booking-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.info {
  flex: 1 1 calc(50% - 1rem);
  min-width: 280px;
}

.booking-form .question-title {
  font-size: 1rem;
  color: var(--primary-color);
}

.booking-form input,
.booking-form select,
.booking-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #EEEEEE;
  border-radius: 5px;
  outline: none;
}

.booking-form textarea {
  min-height: 4rem;
  max-height: 6rem;
}

.error {
  color: red;
  font-size: 1rem;
}

.book-venue-submit {
  width: 100%;
  margin: 2rem auto;
  padding: 0.75rem;
  display: block;
  font-size: 1rem;
  border-radius: 1rem 0;
  background-color: var(--primary-color);
  color: var(--text-color);
  text-align: center;
  cursor: pointer;
  border: none;
  outline: none;
}

.book-venue-submit:hover {
  background-color: var(--secondary-color);
  transition: background-color 0.3s ease-in-out;
}

@media (max-width: 600px) {
  .booking-form input,
  .booking-form select {
    padding: 0.75rem;
  }

  .book-venue-submit {
    padding: 1rem;
  }

  .booking-form h2 {
    font-size: 1.6rem;
  }

  .booking-form .question-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 350px) {
  .container .booking-form,
  .info {
    min-width: 250px;
  }
}
</style>