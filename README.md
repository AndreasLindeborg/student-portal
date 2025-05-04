#  Student Portal – TDDE41

This repository contains the Student Portal (module 3) for a multi-module quiz system.

The goal of this module is to allow students to:
-  Log in securely  
-  View available quizzes for all courses student is enrolled in
-  Take a quiz. The app can:  run the quiz according to teacher specification.
-  Retrieve the results for a given quiz. Check if their results are published
-  Take a practice test similar to a given quiz : another quiz with the same settings but new questions is generated and the answers are visible straight away after the quiz

The Student Portal interacts with other modules (Teacher Portal, Database Module) through a shared folder using standardized JSON formats.

---

## Repository Structure

```
student-portal/
├── public/                     # Static assets (if any)
├── src/                        # Application source code
│   ├── app/                    # Next.js pages and API routes
│   ├── components/             # Reusable UI components
│   ├── types/                  # Shared TypeScript types (e.g., Quiz, Result)
│   └── utils/                  # Helper functions (e.g., shuffling logic)
├── shared-files/               # Shared folder simulating cross-module communication via JSON
│   ├── quizzes/                # Quiz definitions (e.g., quiz_001.json)
│   ├── results/                # Result files (e.g., result_001_1.json)
│   ├── answers/                # Submitted answers (e.g., answers_001_1.json)
│   ├── users/                  # Student files (e.g., student_1.json)
│   └── practice/               # Generated practice quiz files
├── andli890-klaod937.pdf           # Lab report submitted to Lisam
├── README.md                   # This file
└── package.json                # Project dependencies and scripts
```

---

## Tools & Frameworks

The project is built with:
- **Next.js (App Router)** – full-stack framework for routing, API, and pages  
- **TypeScript** – static typing for JavaScript  
- **Tailwind CSS** – UI styling framework  
- **LocalStorage** – to store student session ID (part of the Web Storage API) 
- **File system API** – to read/write JSON files in the shared folder  

---
## Notes

- This project uses a file-based communication approach between modules via a shared folder.
- The JSON format is predefined and agreed on with other modules to make module integration easier.
- The system is built as a proof-of-concept

---

## Run

- Clone the repo
- npm install
- npm run dev
- http://localhost:3000 