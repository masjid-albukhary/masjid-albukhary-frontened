export default {
    menu: {
        home: "Home",
        about: "About",
        news: "Activities",
        services: "Services",
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
                booking_date: "Booking dates",
                time_slot: "Choose your time slot",
                venue: "Select Venue",
                guests: "Guests",
                services: "Select Services",
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
                booking_date: "DD-Month-YYYY (e.g., 10 Sept 2022)",
                guests: "Enter number of guests",
                time_slot: "Choose your time slot",
                venue: "Select a venue",
                services: "Select a services",
                other_docs: "Upload any requests or inquiries",
                other_requests: "Enter any requests or inquiries",
            },
            submit: "Submit Booking"
        },
        booking_popup:{
            messages: "Thank you for submitting your request. We have successfully received your application, and our team will review it within the next 3 days. We will keep you informed about the progress and let you know if any further information is needed. Al Bukhary Mosque",
            sub_message:"Thank you for your patience."
        },
        booking_structure: {
            title: "How to Book a Hall",
            button: "Book Now",
            steps: [
                {content: "Fill out the hall booking form with your details and preferred hall."},
                {content: "Our team will review your request within 3 days."},
                {content: "If approved, we will contact you through WhatsApp message."},
                {content: "Finalize your arrangements and get ready for a memorable event!"}
            ]
        }
    },
    service:{
        service_title: "Our Service",
        service_description: "Ar-Bukhary Mosque provides rental of our facilities. From prayer halls to conference rooms, our spaces are well-equipped and comfortable for various events.",
        button: "Book now",
        booking_structure: {
            title: "Book Your Masjid Services Easily – Let Us Help You with Your Special Moments!",
            steps: [
                {content: "Fill out the hall booking form with your details and preferred date."},
                {content: "Our team will review your request within 3 days."},
                {content: "If approved, we will contact you via WhatsApp for confirmation"},
                {content: "Finalize your arrangements and prepare for a smooth and blessed event"}
            ]
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
        },
        popup:{
            title: "Thank You for Reaching Out!",
            message: "In the meantime, feel free to explore our website for more information, or reach out to us again if you have any other questions.",
            thanksMessage:"Thanks for your patience!",
        }
    },
    members:{
        title:"Meet Our Community",
    },
    map_mosque: {
        mosque_location: "Albukhary Mosque Location",
        prayer_time: "Prayer Time",
    },
    donation: {
        title: "Scan our QR Code to support our Masjid activities and projects",
    },
    footer: {
        quickLinks: "Quick Links",
        socialMedia: "Social Media",
        bankDetails: "Bank Details",
        accountNo: "Account No",
        generalInfo: {
            address: "Jln Hang Tuah, Bukit Bintang, 55200 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
            phone: "Phone Number",
            email: "Email Address",
        },
        links: {
            home: "Home",
            about: "About",
            news: "News",
            services: "Services",
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
    activities:{
        title: "Activities",
    },
    facilities: {
        title:"Our Facilities",
        amenities:"Amenities",
        facilities_form: {
            title: "Book your Wedding/Solemnisation Venue",
            description:"Please fill in the form below to complete your booking. We encourage you to read the stipulated terms and conditions here before submitting the form.",
            button: "Register your Interest",
        },

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
        title: "Admin Registration Form",
        label: {
            username: "Username",
            full_name: "Full Name",
            email: "Email Address",
            phone: "Phone Number",
            dob: "Date of Birth",
            gender: "Gender",
            address: "Residential Address",
            profile_picture: "Profile Picture",
            password: "Password",
            confirm_password: "Confirm Password",
        },
        placeholder: {
            username: "Enter your username",
            full_name: "Enter your full name",
            email: "Enter your email address",
            phone: "Enter your phone number",
            dob: "Select your date of birth",
            gender: "Select your gender",
            address: "Enter your residential address",
            profile_picture: "Upload a profile picture",
            password: "Create a password",
            confirm_password: "Confirm your password",
        },
        submit: "Register",
        home_btn: "Go to Home",
        login_btn: "Back to Login",
    },
    admin_header: {
        upload_new_member: "Add Member",
        upload_image: "Upload Image",
        upload_video: "Upload Video",
        logout: "Logout"
    },
    admin_sidebar: {
        admin_title: "Administration Panel",
        admin: "Dashboard Overview",

        booking_overview: "Booking Management",
        contact_messages_overview: "Messages Management",

        facility_form: "New Facility",
        facilities_dashboard: "Facility Management",

        news_form: "Create Activity",
        news_dashboard: "Activity Management",

        about_content_form: "New About Section",
        about_content_dashboard: "About Section Management",

        service_form: "New Service",
        service_dashboard: "Service Management",
        service_overview_dashboard: "Services Overview",

        users_form: "Register User",
        users_dashboard: "User Management",

        images_dashboard: "Image Library",
        videos_dashboard: "Video Library",

        dashboard_section: "Dashboard",
        about_section: "About Section",
        facility_section: "Facility Management",
        news_section: "Activity Management",
        services_section: "Services",
        users_section: "User Management",
        media_section: "Media Library"
    },
    about_content_form: {
        title: "About Content Management",
        label: {
            title_en: "Title (English)",
            title_my: "Title (Malay)",
            content_en: "Content (English)",
            content_my: "Content (Malay)",
            about_content_image: "Upload Image",
        },
        placeholder: {
            title_en: "Enter title in English",
            title_my: "Masukkan tajuk dalam Bahasa Melayu",
            content_en: "Enter content in English",
            content_my: "Masukkan kandungan dalam Bahasa Melayu",
        },
    },
    facility_form: {
        title: "This is Facility Form",
        label: {
            facility_name_en: "Facility Name (English)",
            facility_name_my: "Facility Name (Bahasa Melayu)",
            facility_category: "Facility Type / Category",
            facility_description_en: "Facility Description (English)",
            facility_description_my: "Facility Description (Bahasa Melayu)",
            location: "Location / Block Name",
            facility_photo: "Facility Photos",
            facility_capacity: "Maximum Capacity",
            facility_price: "Price",
            facility_features_en: "Facility Features (English)",
            facility_features_my: "Facility Features (Bahasa Melayu)",
        },
        placeholder: {
            facility_name_en: "E.g., Prayer Hall, Library",
            facility_name_my: "Contoh: Surau, Perpustakaan",
            facility_category: "Choose a facility category",
            facility_description_en: "Describe usage, rules, and other facility details",
            facility_description_my: "Terangkan penggunaan, peraturan, dan butiran kemudahan",
            facility_location: "E.g., Main Building, Level 2",
            facility_photo: "Upload up to 3–5 images",
            facility_capacity: "E.g., 100 people",
            facility_price: "E.g., 100 RM",
            facility_features_en: "E.g., Microphone, Air-Conditioning, Projector, Chairs",
            facility_features_my: "Contoh: Mikrofon, Penyaman Udara, Projektor, Kerusi",
        }
    },
    activity_form: {
        title: "Activity Form",
        label: {
            title_en: "Activity Title (English)",
            title_my: "Activity Title (Malay)",
            description_en: "Description (English)",
            description_my: "Description (Malay)",
            summary_content_en: "Summary (English)",
            summary_content_my: "Summary (Malay)",
            activity_date: "Activity Date",
            time: "Time (Start - End)",
            activity_type: "Activity Type",
            location: "Location",
            target_audience: "Target Audience",
            activity_status :"Activity Status",
            poster: "Upload Poster / Image",
            estimated_participants: "Estimated Participants",
        },
        placeholder: {
            title_en: "Enter activity title in English",
            title_my: "Masukkan tajuk aktiviti dalam Bahasa Melayu",
            description_en: "Enter activity description in English",
            description_my: "Masukkan deskripsi aktiviti dalam Bahasa Melayu",
            summary_content_en: "Enter summary in English",
            summary_content_my: "Masukkan ringkasan dalam bahasa Inggeris Bahasa Melayu",
            activity_date: "Enter activity date",
            time: "E.g., 8:00 AM - 10:00 AM",
            activity_type: "Select Activity Type",
            location: "Enter location",
            target_audience: "Target Audience",
            activity_status :"Activity Status",
            estimated_participants: "Enter estimated number of participants",
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
    service_form: {
        title: "Service Form",
        label: {
            services_title_en: "Service Title (English)",
            services_title_my: "Service Title (Malay)",
            services_description_en: "Service Description (English)",
            services_description_my: "Service Description (Malay)",
            services_features_en: "Service Features (English)",
            services_features_my: "Service Features (Malay)",
            services_price: "Price (RM)",
            services_poster: "Upload Service Poster",
            services_capacity: "Estimated Capacity",
        },
        placeholder: {
            services_title_en: "Enter the service title in English",
            services_title_my: "Enter the service title in Malay",
            services_description_en: "Enter the service description in English",
            services_description_my: "Enter the service description in Malay",
            services_features_en: "Enter the service features in English (comma separated)",
            services_features_my: "Enter the service features in Malay (comma separated)",
            services_price: "Enter the price in RM",
            services_capacity: "Enter the estimated number of Estimated capacity",
        },
    },
}