export default {
    menu: {
        home: "Home",
        about: "About",
        news: "News",
        booking: "Booking Venue",
        facilities: "Facilities",
        gallery: "Gallery",
        contact: "Contact"
    },

    about: {
        title: "Masjid Al Bukhary Kuala Lumpur Official",
        descriptionTitle: "Get to know more about Albukhary Foundation",
        descriptionText:
            "One simple act of kindness that took place four decades ago marked the beginning of Albukhary Foundation’s journey. When Syed Mokhtar brought home his first salary of RM1,500 as a rice trader in 1974, his mother, Sharifah Rokiah, reminded him that while they lived a humble life, there were others in the community who were poorer. She encouraged him to keep half for the family, and distribute the remaining RM750 to 15 needy families in their community.",
        items: [
            {
                title: "Our Vision",
                content: "To be a beacon of Islamic knowledge, spirituality, and community service, fostering unity and inclusivity while upholding the principles of faith, education, and social welfare."
            },
            {
                title: "Our Mission",
                content: "Spiritual Growth: Provide a welcoming space for prayer, worship, and reflection, promoting a deep connection with Allah.\nEducation & Knowledge: Offer Islamic teachings, Quranic studies, and community learning programs to nurture faith and understanding.\nCommunity Service: Engage in charitable activities, supporting those in need and strengthening community bonds.\nYouth & Leadership Development: Empower the younger generation with guidance, mentorship, and leadership programs.\nInterfaith Harmony: Promote mutual respect and understanding among diverse communities through dialogue and collaboration."
            }
        ]
    },
    booking: {
        booking_structure:{
            title: "How to Book a Hall",
            button: "Book Now",
            steps: [
                { content: "Fill out the hall booking form with your details and preferred hall." },
                { content: "Our team will review your request within 3 days." },
                { content: "If approved, we will contact you through WhatsApp message." },
                { content: "Finalize your arrangements and get ready for a memorable event!" }
            ]
        },

        title: "Booking Form",
        description: "Please fill in the form below to make your booking. Fields marked with an asterisk (*) are required.",
        form_title: "Make Your Booking",
        booking_form: {
            label:{
                first_name: "First Name",
                last_name: "Last Name",
                email: "Email",
                phone: "Contact Number",
                address: "Address",
                postal_code: "Postal Code",
                date_of_nikah: "Date of Nikah",
                time_slot: "Choose your time slot",
                venue: "Select Venue",
                other_docs: "Other Requests/Inquiries",
                other_requests: "Other Requests/Inquiries",
            },
            placeholder: {
                first_name: "Enter your first name",
                last_name: "Enter your last name",
                email: "Enter your email",
                phone: "Enter your contact number",
                address: "Enter your address",
                postal_code: "Enter postal code",
                date_of_nikah: "DD-Month-YYYY (e.g., 10 Sept 2022)",
                time_slot: "Choose your time slot",
                venue: "Select a venue",
                other_docs: "Upload any requests or inquiries",
                other_requests: "Enter any requests or inquiries",
            },
            submit: "Submit Booking"
        }
    }
}