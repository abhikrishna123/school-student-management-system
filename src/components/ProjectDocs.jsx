import React, { useState } from 'react';
import {
  HelpCircle,
  Download,
  Database,
  Code,
  Terminal,
  BookOpen,
  CheckCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Cpu,
  Server,
  Layers,
} from 'lucide-react';

export default function ProjectDocs({ dbStatus, onOpenDbModal }) {
  const [openFaq, setOpenFaq] = useState(0);

  const vivaQuestions = [
    {
      q: '1. What is the MERN stack and how does this application utilize it?',
      a: 'MERN comprises MongoDB (NoSQL database), Express.js (backend web framework), React.js (client-side user interface library), and Node.js (JavaScript runtime engine). In our system, React renders interactive components (Gradebook, Report Card, Attendance), Express provides REST API routes (/api/students, /api/marks), and Mongoose models structure student records into MongoDB documents.',
    },
    {
      q: '2. Why did you choose MongoDB over a traditional relational database (MySQL/PostgreSQL)?',
      a: 'MongoDB uses JSON/BSON document storage which naturally matches JavaScript objects in React and Node.js. Educational assessment records benefit from flexible schema structures: for example, a student’s marks record embeds an array of subject scores without requiring rigid foreign key cross-table joins, yielding faster read/write throughput and easier JSON serialization.',
    },
    {
      q: '3. What is Mongoose and what advantages does it provide?',
      a: 'Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It enforces schema validation (e.g., ensuring Roll No is unique and positive marks), default values, type casting, and middleware hooks to safeguard database integrity before documents are committed.',
    },
    {
      q: '4. How is the internal assessment mark, percentage, and letter grade calculated?',
      a: 'Total Marks Obtained = sum of scores across all subjects. Total Maximum Marks = sum of subject max marks. Percentage = (Total Obtained / Total Max) * 100. If any subject score is under 35, the student is marked as "Fail" regardless of percentage. Otherwise, standard academic grade bands apply: 90%+ is A+, 80-89% is A, 70-79% is B, 60-69% is C, 50-59% is D, and <35 is F.',
    },
    {
      q: '5. What is the significance of the 75% attendance threshold?',
      a: 'Under standard university and state board regulations, students must maintain at least 75% aggregate class attendance to qualify for semester examinations and internal mark credits. Our system tracks daily present/absent logs and visually flags students who risk falling below this eligibility cutoff.',
    },
    {
      q: '6. How does the application handle offline or non-MongoDB environments?',
      a: 'To guarantee seamless peer review and evaluation during project defense, the server features an intelligent fallback mechanism: if MONGO_URI is absent or the MongoDB daemon is offline, it activates an in-memory replica seeded with sample students and marks. Once MongoDB is connected, it switches to persistent storage without altering API signatures.',
    },
    {
      q: '7. What is REST and which HTTP methods are implemented?',
      a: 'REST (Representational State Transfer) is an architectural style for networked systems. Our backend implements GET (retrieve students/marks), POST (create new student/record attendance), PUT (update student details), and DELETE (remove student records).',
    },
    {
      q: '8. How are CORS and client-server communication configured in Vite & Express?',
      a: 'In development, Vite runs in middleware mode mounted directly onto the Express application instance via vite.middlewares. This serves both API endpoints and React hot module reloads over the same origin (port 3000), eliminating CORS cross-origin configuration friction.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
            College Mini-Project Submission Kit
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-2">
            Project Architecture, Setup Guide &amp; Viva Notes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete technical documentation for 2nd year internal mark evaluation and peer deployment.
          </p>
        </div>

        <a
          href="/api/download-zip"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Project ZIP</span>
        </a>
      </div>

      {/* Instructions for Friend Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
          <Terminal className="w-5 h-5" />
          <span>How Your Friend Can Run This on Their Laptop</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="font-bold text-indigo-700 block mb-1">Step 1: Extract &amp; Install</span>
            <p className="text-slate-600 mb-2">Unzip the downloaded file, open terminal inside the folder:</p>
            <code className="block bg-slate-900 text-emerald-400 p-2 rounded font-mono text-[11px]">
              npm install
            </code>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="font-bold text-indigo-700 block mb-1">Step 2: MongoDB (Optional)</span>
            <p className="text-slate-600 mb-2">In .env, set your MongoDB URI or leave default for in-memory mode:</p>
            <code className="block bg-slate-900 text-emerald-400 p-2 rounded font-mono text-[11px]">
              MONGO_URI=mongodb://...
            </code>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="font-bold text-indigo-700 block mb-1">Step 3: Start the App</span>
            <p className="text-slate-600 mb-2">Run the full-stack server and open your browser:</p>
            <code className="block bg-slate-900 text-emerald-400 p-2 rounded font-mono text-[11px]">
              npm run dev
            </code>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Zero-friction deployment:</strong> The application runs immediately even before MongoDB is installed because of the built-in fallback simulation engine!
            </span>
          </div>
          <button
            onClick={onOpenDbModal}
            className="text-xs font-semibold underline text-emerald-800 hover:text-emerald-950 cursor-pointer ml-2"
          >
            Configure DB
          </button>
        </div>
      </div>

      {/* Technical Objectives & Scope Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>Project Objectives &amp; Technical Requirements Compliance</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Module / Requirement</th>
                <th className="py-2.5 px-3">Technology Used</th>
                <th className="py-2.5 px-3">Implementation Description</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Student Profiles &amp; Admissions</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">React + Express + Mongo</td>
                <td className="py-2.5 px-3 text-slate-600">Full CRUD operations for Roll No, Name, Standard, Guardian, Phone, and Status.</td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Completed</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Internal Marks Assessment</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">Node.js Calculation Engine</td>
                <td className="py-2.5 px-3 text-slate-600">Auto-computation of Total, Percentage, Letter Grade (A+ to F), and Pass/Fail threshold.</td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Completed</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Printable Marksheet / Report Card</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">Tailwind Print CSS</td>
                <td className="py-2.5 px-3 text-slate-600">Formal school progress report with school header, subject breakdown, and signatures.</td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Completed</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Attendance Register &amp; 75% Rule</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">React State + Mongoose</td>
                <td className="py-2.5 px-3 text-slate-600">Daily attendance roster, present/absent/late toggles, and 75% eligibility warning indicator.</td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Completed</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Database Layer &amp; Mongoose Schemas</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">MongoDB / Mongoose ODM</td>
                <td className="py-2.5 px-3 text-slate-600">Mongoose schemas for Students, Marks, Subjects, and Attendance with in-memory fallback.</td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Completed</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Project Packaging &amp; Distribution</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">AdmZip / Dynamic Stream</td>
                <td className="py-2.5 px-3 text-slate-600">Automated zip archive generation to bundle code, .env, and docs for peers/submission.</td>
                <td className="py-2.5 px-3 text-center"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Schema Viewer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <span>MongoDB Mongoose Schemas (ER Model)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Student Schema */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto">
            <span className="text-amber-400 font-bold block mb-2">// 1. StudentSchema</span>
            <pre className="text-[11px] leading-relaxed">
{`{
  rollNo: { type: String, unique: true },
  admissionNo: { type: String, unique: true },
  name: { type: String, required: true },
  classGrade: String, // e.g. "Class 10"
  section: String,    // e.g. "A"
  gender: String,     // "Male" | "Female"
  dob: String,        // "YYYY-MM-DD"
  parentName: String,
  phone: String,
  status: "Active" | "Inactive"
}`}
            </pre>
          </div>

          {/* Mark Schema */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto">
            <span className="text-amber-400 font-bold block mb-2">// 2. MarkSchema</span>
            <pre className="text-[11px] leading-relaxed">
{`{
  studentId: String,
  rollNo: String,
  studentName: String,
  examType: String, // "Mid Term", etc.
  marks: [
    {
      subjectCode: String,
      marksObtained: Number,
      maxMarks: Number
    }
  ],
  totalObtained: Number,
  percentage: Number,
  grade: String,   // A+, A, B, C, D, F
  status: "Pass" | "Fail"
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Viva-Voce Q&A Cheat Sheet */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Viva-Voce Examination Q&amp;A Cheat Sheet
              </h3>
              <p className="text-xs text-slate-500">
                Common questions asked by university external examiners during project review.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            8 Essential Questions
          </span>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200">
                    <strong className="text-indigo-700 block mb-1">Model Answer:</strong>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
