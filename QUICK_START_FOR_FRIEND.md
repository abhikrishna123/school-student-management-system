# HOW TO RUN THIS PROJECT (FOR MY FRIEND)

Hey! Here are the simple steps to run this School Student Management System on your laptop:

### Prerequisites
- Node.js (v18 or higher recommended)
- Optional: MongoDB Community Server (or a free MongoDB Atlas cluster)

### Step 1: Install Dependencies
Open your terminal in this extracted folder and run:
```bash
npm install
```

### Step 2: Configure MongoDB (Optional)
Open the `.env` file in this folder:
- If you have MongoDB installed locally, leave it as:
  MONGO_URI=mongodb://localhost:27017/school_db
- If you have a MongoDB Atlas cloud URI, paste your connection string there!
- If you don't have MongoDB yet, NO WORRIES! The project has a built-in in-memory fallback so you can demo and test every single feature right away!

### Step 3: Start the Development Server
```bash
npm run dev
```
Now open your browser at:
http://localhost:3000

### Step 4: Submission & Viva Presentation
Check the "Viva & Project Docs" tab inside the app for:
- Viva questions and answers
- Architecture & ER diagram
- Grading calculation formulas
- REST API endpoint cheat-sheet

All the best for your internal mark evaluation! 🚀
