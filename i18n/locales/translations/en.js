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
        booking_structure: {
            title: "How to Book a Hall",
            button: "Book Now",
            steps: [
                {content: "Fill out the hall booking form with your details and preferred hall."},
                {content: "Our team will review your request within 3 days."},
                {content: "If approved, we will contact you through WhatsApp message."},
                {content: "Finalize your arrangements and get ready for a memorable event!"}
            ]
        },

        title: "Booking Form",
        description: "Please fill in the form below to make your booking. Fields marked with an asterisk (*) are required.",
        form_title: "Make Your Booking",
        booking_form: {
            label: {
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
    },
    contact: {
        title: "Get in touch with us",
        description: "Reach out to us with any questions or concerns you may have, and we’ll be happy to help.",
        your_details: "Your Details",
        send_message: "Send Message",
        form: {
            name: "Name",
            email: "Email Address",
            phone: "Phone Number",
            subject: "Subject",
            message: "Message",
            name_placeholder: "Enter your full name",
            email_placeholder: "Enter your email",
            phone_placeholder: "Enter your phone number",
            subject_placeholder: "Enter subject",
            message_placeholder: "Type your message here...",
        }
    },
    prayer_time: "Prayer Time",
    mosque_location: "Albukhary Mosque Location",
    footer: {
        quickLinks: "Quick Links",
        socialMedia: "Social Media",
        bankDetails: "Bank Details",
        accountNo: "Account No",
        generalInfo: {
            address: "Jln Hang Tuah, Bukit Bintang, 55200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
            phone: "(60) 4774 7300",
            email: "info"
        },
        links: {
            home: "Home",
            about: "About",
            news: "News",
            booking: "Booking Venue",
            facilities: "Facilities",
            gallery: "Gallery",
            contact: "Contact"
        },
        media: {
            facebook: "Facebook",
            instagram: "Instagram",
            youtube: "YouTube",
            whatsapp: "WhatsApp"
        }
    },


    // admin side

    login: {
        label: {
            username: "Username",
            password: "Password",
            confirm_password: "Confirm Password"
        },
        placeholder: {
            username: "Enter your username",
            password: "Enter your password",
            confirm_password: "Re-enter your password"
        },
        navigation: {
            home: "Home",
            sign_up: "Sign Up"
        },
        welcome: "Welcome Back",
        button: "Log In"
    },
    sign_up: {
        title: "Please fill this Form",
        label: {
            username: "Username",
            full_name: "Full Name",
            email: "Email",
            phone: "Phone Number",
            dob: "Date of Birth",
            gender: "Gender",
            address: "Address",
            user_role: "User Role",
            profile_picture: "Profile Picture",
            password: "Password",
            confirm_password: "Confirm Password",
        },
        placeholder: {
            username: "Enter your username",
            full_name: "Enter your full name",
            email: "Enter your email",
            phone: "Enter your phone number",
            dob: "",
            gender: "Select your gender",
            address: "Enter your address",
            user_role: "Select user role",
            profile_picture: "",
            password: "Enter your password",
            confirm_password: "Re-enter your password",
        },
        submit: "Sign Up",
    },
    admin_header: {
        upload_image: "Upload Image",
        upload_video: "Upload Video",
        logout: "Logout"
    },
    admin_sidebar: {
        admin_title: 'Admin Panel',
        admin: "Admin",
        booking_overview: "Booking Overview",
        facility_form: "Facility Form",
        activity_form: "Activity Form",
        news_form: "News Form"
    },
    news_form: {
        title: "Title",
        category: "Category",
        news_content: "News Content",
        summary: "Summary",
        image_upload: "Image Upload",
        location: "Location",
        date_of_event: "Date of Event",
    },
    facility_form: {
        title:"This is Facility Form",
        label: {
            facility_name: "Facility Name",
            facility_type: "Facility Type / Category",
            location: "Location / Block Name",
            upload_photos: "Upload Facility Photos",
            capacity: "Capacity",
            booking_required: "Is booking required?",
            equipment: "Equipment Available",
            rules: "Special Rules or Notes",
            description: "Description",
            yes: "Yes",
            no: "No"
        },
        placeholder: {
            facility_name: "Enter facility name (e.g., Prayer Hall, Library)",
            facility_type: "Select facility category",
            location: "Enter location or block (e.g., Main Building, Level 2)",
            upload_photos: "Upload images (Max 3-5)",
            capacity: "Enter capacity (e.g., 100 people)",
            booking_required: "Is booking required?",
            equipment: "Example: Microphone, Air-Conditioning, Projector, Chairs",
            rules: "Example: Booking required, official use only",
            description: "Describe the facility, capacity, usage, or any rules"
        }
    },
    activity_form: {
        title: "Activity Form",
        label: {
            title_en: "Activity Title (English)",
            title_my: "Activity Title (Malay)",
            description_en: "Description (English)",
            description_my: "Description (Malay)",
            activity_date: "Activity Date",
            time: "Time (Start - End)",
            activity_type: "Activity Type",
            location: "Location",
            target_audience: "Target Audience",
            speaker: "Speaker / Guest Name",
            poster: "Upload Poster / Image",
            estimated_participants: "Estimated Participants",
            live_stream: "Live Streaming Available?",
            live_stream_link: "Live Stream Link (if any)",
            notes: "Additional Notes",
        },
        placeholder: {
            title_en: "Enter activity title in English",
            title_my: "Masukkan tajuk aktiviti dalam Bahasa Melayu",
            description_en: "Enter activity description in English",
            description_my: "Masukkan deskripsi aktiviti dalam Bahasa Melayu",
            activity_date: "Enter activity date",
            time: "E.g., 8:00 AM - 10:00 AM",
            activity_type: "Select Activity Type",
            location: "Enter location",
            target_audience: "Target Audience",
            speaker: "Enter speaker or guest name",
            estimated_participants: "Enter estimated number of participants",
            live_stream: "Select Live Streaming Available",
            live_stream_link: "Paste live stream link if available",
            notes: "Add any extra information",
        },
        options: {
            talk: "Religious Talk / Ceramah",
            quran_class: "Quran Class / Kelas Al-Quran",
            community_event: "Community Event / Program Komuniti",
            fundraising: "Fundraising / Derma",
            volunteer: "Volunteer Activity / Aktiviti Sukarelawan",
            others: "Others / Lain-lain",
            yes: "Yes / Ya",
            no: "No / Tidak",
        },
    },
}