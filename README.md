# Smart Job Tracker – AI-Powered Job Portal

Smart Job Tracker is a full-stack job portal platform that allows **employers** to post job listings and **job seekers** to search, apply, and track their job applications. It features resume and cover letter generation using Gemini AI, creating a seamless career management experience.

---

## Features

### For Job Seekers:
- Browse job listings with filters (category, location, type)
- Upload or generate AI-powered resumes and cover letters
- Apply to jobs with one click
- Smart tracking of applications, interview dates and follow-ups

### For Employers:
- Post and manage job listings
- View applications and download resumes
- Easy dashboard to control your listings

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Modern UI with bright light blue, black and white theme)
- **Backend:** Python (Flask or FastAPI – customizable)
- **AI Integration:** Gemini API for resume and cover letter generation
- **Database:** SQL (PostgreSQL or SQLite recommended)
- **Hosting:** GitHub or custom server deployment

---

## Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/SaddamHussainSafi/Smart-Job-Tracking
   cd job
````

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment**

   * Create a `.env` file with Gemini API credentials
   * Configure the database connection

4. **Run the app**

   ```bash
   python app.py
   ```

---

## Project Structure

```
/job
│
├── /static               # CSS, JS, assets
├── /templates            # HTML templates
├── /routes               # Flask/FastAPI routes
├── /ai                   # Gemini API handlers
├── /models               # Database models
├── /auth                 # Login and Signup logic
├── app.py                # Main application
└── README.md             # This file
```

---

## AI-Powered Tools

* Resume Generator
* Cover Letter Generator
* Job Match Scoring (planned)

---

## Authors

* **Saddam Hussain Safi** – [GitHub](https://github.com/SaddamHussainSafi)
* **Rajni Bhatia** – [GitHub](https://github.com/SaddamHussainSafi)
* **Simranjeet Kaur** – [GitHub](https://github.com/SaddamHussainSafi)

---

## Disclaimer

This project was built with the assistance of **ChatGPT** for planning, documentation, and AI integration concepts.

---

## License

This project is open-source under the [MIT License](LICENSE).