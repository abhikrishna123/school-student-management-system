# School Student Management & Internal Assessment System (SSMS)

> **College Mini-Project / Internal Mark Submission**  
> **Course:** Full Stack Web Development / Database Management Systems (MERN Stack)  
> **Target Year:** 2nd Year Computer Science / IT / BCA  
> **Built with:** React.js, Node.js, Express.js, MongoDB & Mongoose  

---

## 📌 1. Project Overview & Scope

The **School Student Management & Internal Assessment System** is a full-stack web application developed to modernize and automate student records, internal marks evaluation, grade generation, and attendance management for schools and educational institutions.

### Core Objectives:
1. **Centralized Student Directory:** Maintain complete student profiles including Roll No, Admission No, Class/Section, DOB, Guardian details, contact info, and status.
2. **Automated Internal Mark Calculation:** Eliminate manual grade calculation errors by automatically computing subject totals, percentages, grade letters (A+, A, B, C, D, F), and pass/fail verdicts.
3. **Printable Marksheets & Report Cards:** Generate formal student report cards with school headers, subject breakdowns, class rank, and remarks ready for printing or parent meetings.
4. **Attendance Tracking:** Record date-wise attendance with percentage calculation and visual warnings for students below the 75% internal assessment eligibility threshold.
5. **Flexible Database Layer:** Fully configured for MongoDB via Mongoose with an automatic in-memory fallback for instant demonstration if local MongoDB service is inactive.
6. **One-Click Project Export:** Downloadable `.zip` archive containing the entire source code, environment config, and quick-start instructions for peer collaboration or project submission.

---

## 🛠️ 2. Technical Stack & Architecture

- **Frontend:** React.js (JavaScript/JSX), Tailwind CSS, Lucide React icons
- **Backend:** Node.js, Express.js REST API
- **Database:** MongoDB (via Mongoose ODM) with fallback in-memory simulation
- **Build & Dev Tool:** Vite with Express middleware integration
- **Packaging:** Adm-Zip for on-the-fly zip distribution

```
+-------------------------------------------------------------+
|                      React Frontend                         |
|  [Dashboard] [Students] [Marks Entry] [Report Card] [Docs]  |
+------------------------------+------------------------------+
                               |
                        Fetch / REST API
                               |
+------------------------------v------------------------------+
|                   Node.js + Express Server                  |
|                (Middleware, Controllers, Routes)            |
+------------------------------+------------------------------+
                               |
                        Mongoose ODM
                               |
        +----------------------+----------------------+
        |                                             |
+-------v---------------+                     +-------v---------------+
|    MongoDB Atlas      |                     |  In-Memory Fallback   |
|   (or Local mongod)   |                     | (Runs even without DB)|
+-----------------------+                     +-----------------------+
```

---

## 📊 3. Grading & Assessment Logic

| Percentage Range | Grade Letter | Description | Status |
| :--- | :--- | :--- | :--- |
| **90% – 100%** | **A+** | Outstanding Performance | Pass |
| **80% – 89%** | **A** | Excellent | Pass |
| **70% – 79%** | **B** | Very Good | Pass |
| **60% – 69%** | **C** | Good / Satisfactory | Pass |
| **50% – 59%** | **D** | Average | Pass |
| **Below 50% / Failed Subject (<35)** | **F** | Needs Improvement | Fail |

*Note: Even if total percentage is high, if a student scores below 35 in any individual subject, the system flags the result as Fail for academic re-assessment.*

---

## 🚀 4. How to Run (Step-by-Step)

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18+ recommended)
- Optional: MongoDB Community Server installed locally OR a free MongoDB Atlas cloud cluster

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure MongoDB in `.env`
Open the `.env` file in the root folder:

**Option A: Local MongoDB**
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/school_db
```

**Option B: MongoDB Atlas (Cloud Free Tier)**
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/school_db?retryWrites=true&w=majority
```

*(If you don't configure `MONGO_URI`, the server will automatically run in in-memory mode so you can test all features without setup friction!)*

### Step 3: Run the Application
```bash
npm run dev
```

Open your browser at:  
👉 **http://localhost:3000**

---

## 📡 5. REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | Get server status and MongoDB connection state |
| `POST` | `/api/connect-db` | Test and switch MongoDB URI from the client UI |
| `GET` | `/api/dashboard/stats` | Aggregated dashboard metrics & top rankers |
| `GET` | `/api/students` | Get all students (supports `?search=`, `?classGrade=`) |
| `POST` | `/api/students` | Register a new student |
| `GET` | `/api/students/:id` | Get student profile and academic history |
| `PUT` | `/api/students/:id` | Update student information |
| `DELETE` | `/api/students/:id` | Remove student and associated records |
| `GET` | `/api/subjects` | List all subjects and assigned teachers |
| `POST` | `/api/subjects` | Add a new subject |
| `GET` | `/api/marks` | Query internal marks by class, term, or student |
| `POST` | `/api/marks` | Save or update student marks |
| `POST` | `/api/marks/batch` | Batch entry of marks for an entire class |
| `GET` | `/api/attendance` | Get date-wise class attendance |
| `POST` | `/api/attendance` | Record daily attendance roster |
| `GET` | `/api/download-zip` | Download complete project submission `.zip` |

---

## 🎓 6. Viva-Voce Questions & Model Answers

### Q1: What is the MERN stack?
**Answer:** MERN stands for MongoDB, Express.js, React.js, and Node.js. It is a full-stack JavaScript architecture where JavaScript is used for both client-side rendering (React) and server-side execution (Node/Express), interacting with a document-oriented database (MongoDB).

### Q2: Why choose MongoDB over MySQL for student records?
**Answer:** MongoDB is a NoSQL document database. It stores records in flexible, JSON-like BSON format. For school management, student documents can easily embed contact numbers, parent info, and variable subject marks without complex multi-table joins. It scales horizontally and maps naturally to JavaScript objects.

### Q3: What is Mongoose and why do we use it?
**Answer:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation, default values, type casting, middleware (hooks), and an easy query API so that invalid data (e.g., negative marks or missing roll numbers) cannot enter the database.

### Q4: How is the internal mark percentage and grade computed?
**Answer:** The total marks obtained across all subjects are divided by the total maximum marks and multiplied by 100. If any subject score is less than the passing threshold (35 marks), the status is set to Fail regardless of the aggregate percentage. Otherwise, percentage bands (90%+: A+, 80%+: A, etc.) determine the grade letter.

### Q5: What is the purpose of the 75% attendance threshold?
**Answer:** Most educational boards and universities enforce a mandatory minimum of 75% attendance to qualify for semester examinations. In our system, attendance below 75% triggers a visual warning alert in the student's marksheet and attendance sheet.
