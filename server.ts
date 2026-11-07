import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AdmZip from 'adm-zip';
import fs from 'fs';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
let MONGO_URI = process.env.MONGO_URI || '';

// Parse JSON request bodies
app.use(express.json());

// Normalize URL for Netlify Functions, Vercel, and standard Express
app.use((req, _res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '/api');
  } else if (!req.url.startsWith('/api') && req.url !== '/' && !req.url.startsWith('/@') && !req.url.startsWith('/src')) {
    req.url = '/api' + (req.url.startsWith('/') ? '' : '/') + req.url;
  }
  next();
});

// ---------------------------------------------------------------------------
// MONGOOSE SCHEMAS (College Project Standard MERN Architecture)
// ---------------------------------------------------------------------------
const StudentSchema = new mongoose.Schema({
  _id: { type: String },
  rollNo: { type: String, required: true, unique: true },
  admissionNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  classGrade: { type: String, required: true }, // e.g. "Class 10"
  section: { type: String, required: true, default: 'A' }, // e.g. "A", "B"
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  dob: { type: String, default: '2009-05-15' },
  parentName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
});

const SubjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  classGrade: { type: String, required: true },
  teacher: { type: String, required: true },
  maxMarks: { type: Number, default: 100 },
  passMarks: { type: Number, default: 35 },
});

const MarkSchema = new mongoose.Schema({
  _id: { type: String },
  studentId: { type: String, required: true },
  rollNo: { type: String, required: true },
  studentName: { type: String, required: true },
  classGrade: { type: String, required: true },
  section: { type: String, required: true },
  examType: { type: String, required: true }, // "Unit Test 1", "Mid Term", "Unit Test 2", "Model Exam", "Final Exam"
  academicYear: { type: String, default: '2026-2027' },
  marks: [
    {
      subjectCode: String,
      subjectName: String,
      marksObtained: Number,
      maxMarks: { type: Number, default: 100 },
    },
  ],
  totalObtained: { type: Number, default: 0 },
  totalMax: { type: Number, default: 500 },
  percentage: { type: Number, default: 0 },
  grade: { type: String, default: 'F' }, // A+, A, B, C, D, F
  status: { type: String, default: 'Fail' }, // Pass, Fail
  remarks: { type: String, default: 'Good effort.' },
  updatedAt: { type: Date, default: Date.now },
});

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  classGrade: { type: String, required: true },
  section: { type: String, required: true },
  records: [
    {
      studentId: String,
      rollNo: String,
      studentName: String,
      status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
    },
  ],
  recordedAt: { type: Date, default: Date.now },
});

// Models
const StudentModel = mongoose.model('Student', StudentSchema);
const SubjectModel = mongoose.model('Subject', SubjectSchema);
const MarkModel = mongoose.model('Mark', MarkSchema);
const AttendanceModel = mongoose.model('Attendance', AttendanceSchema);

// ---------------------------------------------------------------------------
// INITIAL SAMPLE SEED DATA
// ---------------------------------------------------------------------------
const INITIAL_SUBJECTS = [
  { code: 'ENG101', name: 'English Language & Lit', classGrade: 'Class 10', teacher: 'Mrs. Sarah Mathew', maxMarks: 100, passMarks: 35 },
  { code: 'MAT102', name: 'Mathematics', classGrade: 'Class 10', teacher: 'Mr. Rajesh Kumar', maxMarks: 100, passMarks: 35 },
  { code: 'SCI103', name: 'Science (Phy/Chem/Bio)', classGrade: 'Class 10', teacher: 'Dr. Anita Roy', maxMarks: 100, passMarks: 35 },
  { code: 'SOC104', name: 'Social Science', classGrade: 'Class 10', teacher: 'Mr. David Joseph', maxMarks: 100, passMarks: 35 },
  { code: 'CSC105', name: 'Computer Applications', classGrade: 'Class 10', teacher: 'Ms. Priya Sharma', maxMarks: 100, passMarks: 35 },
  { code: 'ENG091', name: 'English', classGrade: 'Class 9', teacher: 'Mrs. Sarah Mathew', maxMarks: 100, passMarks: 35 },
  { code: 'MAT092', name: 'Mathematics', classGrade: 'Class 9', teacher: 'Mr. Rajesh Kumar', maxMarks: 100, passMarks: 35 },
  { code: 'SCI093', name: 'Science', classGrade: 'Class 9', teacher: 'Dr. Anita Roy', maxMarks: 100, passMarks: 35 },
];

const INITIAL_STUDENTS = [
  {
    _id: 'std_01',
    rollNo: '1001',
    admissionNo: 'ADM-2024-001',
    name: 'Aarav Sharma',
    classGrade: 'Class 10',
    section: 'A',
    gender: 'Male',
    dob: '2009-04-12',
    parentName: 'Manoj Sharma',
    phone: '9876543210',
    email: 'aarav.sharma@school.edu',
    address: '42, Green Park Avenue, New Delhi',
    status: 'Active',
    createdAt: new Date('2024-06-10'),
  },
  {
    _id: 'std_02',
    rollNo: '1002',
    admissionNo: 'ADM-2024-002',
    name: 'Diya Patel',
    classGrade: 'Class 10',
    section: 'A',
    gender: 'Female',
    dob: '2009-08-25',
    parentName: 'Kirit Patel',
    phone: '9823456781',
    email: 'diya.patel@school.edu',
    address: '15, Lotus Enclave, Ahmedabad',
    status: 'Active',
    createdAt: new Date('2024-06-11'),
  },
  {
    _id: 'std_03',
    rollNo: '1003',
    admissionNo: 'ADM-2024-003',
    name: 'Rohan Varma',
    classGrade: 'Class 10',
    section: 'A',
    gender: 'Male',
    dob: '2009-01-18',
    parentName: 'Sanjay Varma',
    phone: '9845123456',
    email: 'rohan.varma@school.edu',
    address: '77, Silver Oaks Road, Bangalore',
    status: 'Active',
    createdAt: new Date('2024-06-12'),
  },
  {
    _id: 'std_04',
    rollNo: '1004',
    admissionNo: 'ADM-2024-004',
    name: 'Sneha Kulkarni',
    classGrade: 'Class 10',
    section: 'A',
    gender: 'Female',
    dob: '2009-11-03',
    parentName: 'Vikas Kulkarni',
    phone: '9811223344',
    email: 'sneha.k@school.edu',
    address: '29, Deccan Gymkhana, Pune',
    status: 'Active',
    createdAt: new Date('2024-06-14'),
  },
  {
    _id: 'std_05',
    rollNo: '1005',
    admissionNo: 'ADM-2024-005',
    name: 'Mohammed Bilal',
    classGrade: 'Class 10',
    section: 'A',
    gender: 'Male',
    dob: '2009-07-21',
    parentName: 'Tariq Bilal',
    phone: '9877001122',
    email: 'bilal.m@school.edu',
    address: '104, Rosewood Colony, Hyderabad',
    status: 'Active',
    createdAt: new Date('2024-06-15'),
  },
  {
    _id: 'std_06',
    rollNo: '0901',
    admissionNo: 'ADM-2025-010',
    name: 'Ananya Reddy',
    classGrade: 'Class 9',
    section: 'A',
    gender: 'Female',
    dob: '2010-03-30',
    parentName: 'Venkat Reddy',
    phone: '9899887766',
    email: 'ananya.reddy@school.edu',
    address: '5B, Hillview Apartments, Chennai',
    status: 'Active',
    createdAt: new Date('2025-06-05'),
  },
  {
    _id: 'std_07',
    rollNo: '0902',
    admissionNo: 'ADM-2025-011',
    name: 'Vikram Singh',
    classGrade: 'Class 9',
    section: 'A',
    gender: 'Male',
    dob: '2010-09-14',
    parentName: 'Harpreet Singh',
    phone: '9866554433',
    email: 'vikram.singh@school.edu',
    address: '88, Model Town, Chandigarh',
    status: 'Active',
    createdAt: new Date('2025-06-06'),
  },
];

const INITIAL_MARKS = [
  {
    _id: 'mrk_01',
    studentId: 'std_01',
    rollNo: '1001',
    studentName: 'Aarav Sharma',
    classGrade: 'Class 10',
    section: 'A',
    examType: 'Mid Term',
    academicYear: '2026-2027',
    marks: [
      { subjectCode: 'ENG101', subjectName: 'English Language & Lit', marksObtained: 88, maxMarks: 100 },
      { subjectCode: 'MAT102', subjectName: 'Mathematics', marksObtained: 94, maxMarks: 100 },
      { subjectCode: 'SCI103', subjectName: 'Science (Phy/Chem/Bio)', marksObtained: 91, maxMarks: 100 },
      { subjectCode: 'SOC104', subjectName: 'Social Science', marksObtained: 85, maxMarks: 100 },
      { subjectCode: 'CSC105', subjectName: 'Computer Applications', marksObtained: 98, maxMarks: 100 },
    ],
    totalObtained: 456,
    totalMax: 500,
    percentage: 91.2,
    grade: 'A+',
    status: 'Pass',
    remarks: 'Outstanding performance! Consistently top score in Computer and Math.',
    updatedAt: new Date(),
  },
  {
    _id: 'mrk_02',
    studentId: 'std_02',
    rollNo: '1002',
    studentName: 'Diya Patel',
    classGrade: 'Class 10',
    section: 'A',
    examType: 'Mid Term',
    academicYear: '2026-2027',
    marks: [
      { subjectCode: 'ENG101', subjectName: 'English Language & Lit', marksObtained: 92, maxMarks: 100 },
      { subjectCode: 'MAT102', subjectName: 'Mathematics', marksObtained: 86, maxMarks: 100 },
      { subjectCode: 'SCI103', subjectName: 'Science (Phy/Chem/Bio)', marksObtained: 89, maxMarks: 100 },
      { subjectCode: 'SOC104', subjectName: 'Social Science', marksObtained: 94, maxMarks: 100 },
      { subjectCode: 'CSC105', subjectName: 'Computer Applications', marksObtained: 90, maxMarks: 100 },
    ],
    totalObtained: 451,
    totalMax: 500,
    percentage: 90.2,
    grade: 'A+',
    status: 'Pass',
    remarks: 'Brilliant student with excellent language and social science grasp.',
    updatedAt: new Date(),
  },
  {
    _id: 'mrk_03',
    studentId: 'std_03',
    rollNo: '1003',
    studentName: 'Rohan Varma',
    classGrade: 'Class 10',
    section: 'A',
    examType: 'Mid Term',
    academicYear: '2026-2027',
    marks: [
      { subjectCode: 'ENG101', subjectName: 'English Language & Lit', marksObtained: 74, maxMarks: 100 },
      { subjectCode: 'MAT102', subjectName: 'Mathematics', marksObtained: 78, maxMarks: 100 },
      { subjectCode: 'SCI103', subjectName: 'Science (Phy/Chem/Bio)', marksObtained: 80, maxMarks: 100 },
      { subjectCode: 'SOC104', subjectName: 'Social Science', marksObtained: 72, maxMarks: 100 },
      { subjectCode: 'CSC105', subjectName: 'Computer Applications', marksObtained: 85, maxMarks: 100 },
    ],
    totalObtained: 389,
    totalMax: 500,
    percentage: 77.8,
    grade: 'B',
    status: 'Pass',
    remarks: 'Good progress. Needs to focus a bit more on Social Science.',
    updatedAt: new Date(),
  },
  {
    _id: 'mrk_04',
    studentId: 'std_04',
    rollNo: '1004',
    studentName: 'Sneha Kulkarni',
    classGrade: 'Class 10',
    section: 'A',
    examType: 'Mid Term',
    academicYear: '2026-2027',
    marks: [
      { subjectCode: 'ENG101', subjectName: 'English Language & Lit', marksObtained: 82, maxMarks: 100 },
      { subjectCode: 'MAT102', subjectName: 'Mathematics', marksObtained: 88, maxMarks: 100 },
      { subjectCode: 'SCI103', subjectName: 'Science (Phy/Chem/Bio)', marksObtained: 84, maxMarks: 100 },
      { subjectCode: 'SOC104', subjectName: 'Social Science', marksObtained: 81, maxMarks: 100 },
      { subjectCode: 'CSC105', subjectName: 'Computer Applications', marksObtained: 89, maxMarks: 100 },
    ],
    totalObtained: 424,
    totalMax: 500,
    percentage: 84.8,
    grade: 'A',
    status: 'Pass',
    remarks: 'Very dedicated student with steady all-round performance.',
    updatedAt: new Date(),
  },
  {
    _id: 'mrk_05',
    studentId: 'std_05',
    rollNo: '1005',
    studentName: 'Mohammed Bilal',
    classGrade: 'Class 10',
    section: 'A',
    examType: 'Mid Term',
    academicYear: '2026-2027',
    marks: [
      { subjectCode: 'ENG101', subjectName: 'English Language & Lit', marksObtained: 68, maxMarks: 100 },
      { subjectCode: 'MAT102', subjectName: 'Mathematics', marksObtained: 65, maxMarks: 100 },
      { subjectCode: 'SCI103', subjectName: 'Science (Phy/Chem/Bio)', marksObtained: 70, maxMarks: 100 },
      { subjectCode: 'SOC104', subjectName: 'Social Science', marksObtained: 62, maxMarks: 100 },
      { subjectCode: 'CSC105', subjectName: 'Computer Applications', marksObtained: 75, maxMarks: 100 },
    ],
    totalObtained: 340,
    totalMax: 500,
    percentage: 68.0,
    grade: 'C',
    status: 'Pass',
    remarks: 'Average performance. Capable of higher scores with regular revision.',
    updatedAt: new Date(),
  },
];

const INITIAL_ATTENDANCE = [
  {
    date: '2026-11-06',
    classGrade: 'Class 10',
    section: 'A',
    records: [
      { studentId: 'std_01', rollNo: '1001', studentName: 'Aarav Sharma', status: 'Present' },
      { studentId: 'std_02', rollNo: '1002', studentName: 'Diya Patel', status: 'Present' },
      { studentId: 'std_03', rollNo: '1003', studentName: 'Rohan Varma', status: 'Present' },
      { studentId: 'std_04', rollNo: '1004', studentName: 'Sneha Kulkarni', status: 'Absent' },
      { studentId: 'std_05', rollNo: '1005', studentName: 'Mohammed Bilal', status: 'Present' },
    ],
  },
  {
    date: '2026-11-05',
    classGrade: 'Class 10',
    section: 'A',
    records: [
      { studentId: 'std_01', rollNo: '1001', studentName: 'Aarav Sharma', status: 'Present' },
      { studentId: 'std_02', rollNo: '1002', studentName: 'Diya Patel', status: 'Present' },
      { studentId: 'std_03', rollNo: '1003', studentName: 'Rohan Varma', status: 'Late' },
      { studentId: 'std_04', rollNo: '1004', studentName: 'Sneha Kulkarni', status: 'Present' },
      { studentId: 'std_05', rollNo: '1005', studentName: 'Mohammed Bilal', status: 'Present' },
    ],
  },
];

// In-Memory store fallback (allows instant offline/preview running if MongoDB isn't running)
interface InMemoryStore {
  students: any[];
  subjects: any[];
  marks: any[];
  attendance: any[];
}

let inMemoryStore: InMemoryStore = {
  students: JSON.parse(JSON.stringify(INITIAL_STUDENTS)),
  subjects: JSON.parse(JSON.stringify(INITIAL_SUBJECTS)),
  marks: JSON.parse(JSON.stringify(INITIAL_MARKS)),
  attendance: JSON.parse(JSON.stringify(INITIAL_ATTENDANCE)),
};

let isMongoConnected = false;
let mongoErrorMessage = '';

// Helper to calculate grade and pass/fail
function calculateGrade(percentage: number, hasFailedSubject: boolean) {
  if (hasFailedSubject || percentage < 35) {
    return { grade: 'F', status: 'Fail' };
  }
  if (percentage >= 90) return { grade: 'A+', status: 'Pass' };
  if (percentage >= 80) return { grade: 'A', status: 'Pass' };
  if (percentage >= 70) return { grade: 'B', status: 'Pass' };
  if (percentage >= 60) return { grade: 'C', status: 'Pass' };
  if (percentage >= 50) return { grade: 'D', status: 'Pass' };
  return { grade: 'E', status: 'Pass' };
}

// ---------------------------------------------------------------------------
// MONGODB CONNECTION SETUP
// ---------------------------------------------------------------------------
async function connectToMongo(uri: string) {
  if (!uri) {
    isMongoConnected = false;
    mongoErrorMessage = 'No MONGO_URI provided. Running in fast in-memory mode.';
    console.log('[MongoDB] ' + mongoErrorMessage);
    return false;
  }
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return true;
  }
  try {
    console.log('[MongoDB] Attempting connection to:', uri.replace(/:([^:@]+)@/, ':****@'));
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isMongoConnected = true;
    mongoErrorMessage = '';
    MONGO_URI = uri;
    console.log('[MongoDB] Successfully connected to MongoDB Database!');

    // Seed if empty
    const studentCount = await StudentModel.countDocuments();
    if (studentCount === 0) {
      console.log('[MongoDB] Seeding initial student and mark data...');
      await StudentModel.insertMany(INITIAL_STUDENTS);
      await SubjectModel.insertMany(INITIAL_SUBJECTS);
      await MarkModel.insertMany(INITIAL_MARKS);
      await AttendanceModel.insertMany(INITIAL_ATTENDANCE);
      console.log('[MongoDB] Initial data seeded successfully!');
    }
    return true;
  } catch (err: any) {
    isMongoConnected = false;
    mongoErrorMessage = err?.message || 'Failed to connect to MongoDB';
    console.warn('[MongoDB] Connection failed:', mongoErrorMessage);
    console.log('[MongoDB] App will continue in In-Memory Mode with sample data.');
    return false;
  }
}

// Initial connection attempt
connectToMongo(MONGO_URI);

// Ensure DB is connected for serverless invocations (e.g. Vercel)
app.use(async (_req, _res, next) => {
  if (MONGO_URI && mongoose.connection.readyState === 0) {
    try {
      await connectToMongo(MONGO_URI);
    } catch {
      // Continue even if mongo connection fails (in-memory mode)
    }
  }
  next();
});

// ---------------------------------------------------------------------------
// REST API ROUTES
// ---------------------------------------------------------------------------

// 1. System & Database Status
app.get('/api/status', async (_req, res) => {
  let studentCount = 0;
  if (isMongoConnected) {
    try {
      studentCount = await StudentModel.countDocuments();
    } catch {
      studentCount = inMemoryStore.students.length;
    }
  } else {
    studentCount = inMemoryStore.students.length;
  }

  res.json({
    success: true,
    connected: isMongoConnected,
    dbMode: isMongoConnected ? 'MongoDB (Persistent)' : 'In-Memory Simulation (Ready to Connect)',
    mongoUri: MONGO_URI ? MONGO_URI.replace(/:([^:@]+)@/, ':****@') : '',
    studentCount,
    errorMessage: mongoErrorMessage,
    timestamp: new Date().toISOString(),
  });
});

// 2. Connect or switch MongoDB URI dynamically
app.post('/api/connect-db', async (req, res) => {
  const { mongoUri } = req.body;
  if (!mongoUri) {
    return res.status(400).json({ success: false, message: 'Please provide a valid MongoDB connection string' });
  }

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    const connected = await connectToMongo(mongoUri);
    if (connected) {
      return res.json({ success: true, message: 'Successfully connected to MongoDB!' });
    } else {
      return res.status(400).json({ success: false, message: mongoErrorMessage || 'Could not connect to MongoDB' });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Students API
app.get('/api/students', async (req, res) => {
  try {
    const { search, classGrade, section } = req.query;

    if (isMongoConnected) {
      const query: any = {};
      if (classGrade && classGrade !== 'All') query.classGrade = classGrade;
      if (section && section !== 'All') query.section = section;
      if (search) {
        query.$or = [
          { name: { $regex: String(search), $options: 'i' } },
          { rollNo: { $regex: String(search), $options: 'i' } },
          { admissionNo: { $regex: String(search), $options: 'i' } },
        ];
      }
      const students = await StudentModel.find(query).sort({ rollNo: 1 });
      return res.json({ success: true, data: students });
    }

    // In-memory filter
    let result = [...inMemoryStore.students];
    if (classGrade && classGrade !== 'All') {
      result = result.filter((s) => s.classGrade === classGrade);
    }
    if (section && section !== 'All') {
      result = result.filter((s) => s.section === section);
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { rollNo, admissionNo, name, classGrade, section, gender, dob, parentName, phone, email, address } = req.body;

    if (!rollNo || !name || !classGrade) {
      return res.status(400).json({ success: false, message: 'Roll No, Name, and Class are required.' });
    }

    const studentData = {
      rollNo: String(rollNo).trim(),
      admissionNo: admissionNo ? String(admissionNo).trim() : `ADM-${Date.now().toString().slice(-4)}`,
      name: String(name).trim(),
      classGrade: String(classGrade).trim(),
      section: section ? String(section).trim().toUpperCase() : 'A',
      gender: gender || 'Male',
      dob: dob || '2009-01-01',
      parentName: parentName || 'Guardian',
      phone: phone || '0000000000',
      email: email || '',
      address: address || '',
      status: 'Active' as const,
      createdAt: new Date(),
    };

    if (isMongoConnected) {
      // Check existing roll number
      const existing = await StudentModel.findOne({ rollNo: studentData.rollNo });
      if (existing) {
        return res.status(400).json({ success: false, message: `Roll No ${studentData.rollNo} already exists!` });
      }
      const newStudent = await StudentModel.create(studentData as any);
      return res.status(201).json({ success: true, data: newStudent, message: 'Student added successfully' });
    }

    // In-memory check
    if (inMemoryStore.students.some((s: any) => s.rollNo === studentData.rollNo)) {
      return res.status(400).json({ success: false, message: `Roll No ${studentData.rollNo} already exists!` });
    }
    const newStudent = { ...studentData, _id: 'std_' + Date.now() };
    inMemoryStore.students.push(newStudent);
    res.status(201).json({ success: true, data: newStudent, message: 'Student added successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let student = null;

    if (isMongoConnected) {
      student = await StudentModel.findById(id);
    } else {
      student = inMemoryStore.students.find((s: any) => s._id === id || s.rollNo === id);
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Fetch marks for this student
    let marksList = [];
    if (isMongoConnected) {
      marksList = await MarkModel.find({ studentId: student._id }).sort({ updatedAt: -1 });
    } else {
      marksList = inMemoryStore.marks.filter((m: any) => m.studentId === student._id || m.rollNo === student.rollNo);
    }

    res.json({ success: true, data: { student, marks: marksList } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isMongoConnected) {
      const updated = await StudentModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Student not found' });
      return res.json({ success: true, data: updated, message: 'Student updated successfully' });
    }

    const idx = inMemoryStore.students.findIndex((s: any) => s._id === id || s.rollNo === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Student not found' });

    inMemoryStore.students[idx] = { ...inMemoryStore.students[idx], ...updateData };
    res.json({ success: true, data: inMemoryStore.students[idx], message: 'Student updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      await StudentModel.findByIdAndDelete(id);
      await MarkModel.deleteMany({ studentId: id });
      return res.json({ success: true, message: 'Student removed successfully' });
    }

    inMemoryStore.students = inMemoryStore.students.filter((s: any) => s._id !== id && s.rollNo !== id);
    inMemoryStore.marks = inMemoryStore.marks.filter((m: any) => m.studentId !== id && m.rollNo !== id);
    res.json({ success: true, message: 'Student removed successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Subjects API
app.get('/api/subjects', async (req, res) => {
  try {
    const { classGrade } = req.query;
    if (isMongoConnected) {
      const query: any = classGrade && classGrade !== 'All' ? { classGrade } : {};
      const subjects = await SubjectModel.find(query).sort({ code: 1 });
      return res.json({ success: true, data: subjects });
    }

    let result = [...inMemoryStore.subjects];
    if (classGrade && classGrade !== 'All') {
      result = result.filter((s: any) => s.classGrade === classGrade);
    }
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/subjects', async (req, res) => {
  try {
    const { code, name, classGrade, teacher, maxMarks, passMarks } = req.body;
    if (!code || !name || !classGrade) {
      return res.status(400).json({ success: false, message: 'Subject code, name, and class are required' });
    }

    const newSub = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      classGrade: classGrade.trim(),
      teacher: teacher || 'Assigned Teacher',
      maxMarks: Number(maxMarks) || 100,
      passMarks: Number(passMarks) || 35,
    };

    if (isMongoConnected) {
      const created = await SubjectModel.create(newSub);
      return res.status(201).json({ success: true, data: created, message: 'Subject created' });
    }

    inMemoryStore.subjects.push({ ...newSub, _id: 'sub_' + Date.now() });
    res.status(201).json({ success: true, data: newSub, message: 'Subject created' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Marks API (Core Internal Assessment System)
app.get('/api/marks', async (req, res) => {
  try {
    const { classGrade, examType, studentId } = req.query;

    if (isMongoConnected) {
      const query: any = {};
      if (classGrade && classGrade !== 'All') query.classGrade = classGrade;
      if (examType && examType !== 'All') query.examType = examType;
      if (studentId) query.studentId = studentId;

      const marks = await MarkModel.find(query).sort({ totalObtained: -1 });
      return res.json({ success: true, data: marks });
    }

    let result = [...inMemoryStore.marks];
    if (classGrade && classGrade !== 'All') {
      result = result.filter((m) => m.classGrade === classGrade);
    }
    if (examType && examType !== 'All') {
      result = result.filter((m) => m.examType === examType);
    }
    if (studentId) {
      result = result.filter((m) => m.studentId === studentId);
    }
    result.sort((a, b) => b.totalObtained - a.totalObtained);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Save or Update Marks for a Single Student
app.post('/api/marks', async (req, res) => {
  try {
    const { studentId, rollNo, studentName, classGrade, section, examType, marks, remarks } = req.body;

    if (!studentId || !examType || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ success: false, message: 'Student ID, Exam Type, and Marks list are required.' });
    }

    // Auto-calculate Total, %, Grade, and Pass/Fail
    let totalObtained = 0;
    let totalMax = 0;
    let hasFailedSubject = false;

    const formattedMarks = marks.map((m: any) => {
      const obt = Number(m.marksObtained) || 0;
      const max = Number(m.maxMarks) || 100;
      const pass = Number(m.passMarks) || 35;
      totalObtained += obt;
      totalMax += max;
      if (obt < pass) {
        hasFailedSubject = true;
      }
      return {
        subjectCode: m.subjectCode,
        subjectName: m.subjectName,
        marksObtained: obt,
        maxMarks: max,
      };
    });

    const percentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(2)) : 0;
    const { grade, status } = calculateGrade(percentage, hasFailedSubject);

    const markRecord = {
      studentId,
      rollNo,
      studentName,
      classGrade,
      section: section || 'A',
      examType,
      academicYear: '2026-2027',
      marks: formattedMarks,
      totalObtained,
      totalMax,
      percentage,
      grade,
      status,
      remarks: remarks || (status === 'Pass' ? 'Good performance' : 'Needs improvement in weak subjects'),
      updatedAt: new Date(),
    };

    if (isMongoConnected) {
      const updated = await MarkModel.findOneAndUpdate(
        { studentId, examType },
        markRecord,
        { upsert: true, new: true }
      );
      return res.json({ success: true, data: updated, message: 'Marks recorded successfully!' });
    }

    const existingIdx = inMemoryStore.marks.findIndex(
      (m: any) => m.studentId === studentId && m.examType === examType
    );
    if (existingIdx >= 0) {
      inMemoryStore.marks[existingIdx] = { ...inMemoryStore.marks[existingIdx], ...markRecord };
      return res.json({ success: true, data: inMemoryStore.marks[existingIdx], message: 'Marks updated successfully!' });
    } else {
      const newRec = { ...markRecord, _id: 'mrk_' + Date.now() };
      inMemoryStore.marks.push(newRec);
      return res.json({ success: true, data: newRec, message: 'Marks recorded successfully!' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Batch Save Marks for Class
app.post('/api/marks/batch', async (req, res) => {
  try {
    const { classGrade, examType, records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'No records provided for batch save.' });
    }

    const results = [];
    for (const item of records) {
      let totalObtained = 0;
      let totalMax = 0;
      let hasFailedSubject = false;

      const formattedMarks = (item.marks || []).map((m: any) => {
        const obt = Number(m.marksObtained) || 0;
        const max = Number(m.maxMarks) || 100;
        totalObtained += obt;
        totalMax += max;
        if (obt < 35) hasFailedSubject = true;
        return {
          subjectCode: m.subjectCode,
          subjectName: m.subjectName,
          marksObtained: obt,
          maxMarks: max,
        };
      });

      const percentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(2)) : 0;
      const { grade, status } = calculateGrade(percentage, hasFailedSubject);

      const markData = {
        studentId: item.studentId,
        rollNo: item.rollNo,
        studentName: item.studentName,
        classGrade: classGrade || item.classGrade,
        section: item.section || 'A',
        examType: examType || item.examType,
        academicYear: '2026-2027',
        marks: formattedMarks,
        totalObtained,
        totalMax,
        percentage,
        grade,
        status,
        remarks: item.remarks || (status === 'Pass' ? 'Good progress' : 'Needs attention'),
        updatedAt: new Date(),
      };

      if (isMongoConnected) {
        const saved = await MarkModel.findOneAndUpdate(
          { studentId: item.studentId, examType: markData.examType },
          markData,
          { upsert: true, new: true }
        );
        results.push(saved);
      } else {
        const idx = inMemoryStore.marks.findIndex(
          (m: any) => m.studentId === item.studentId && m.examType === markData.examType
        );
        if (idx >= 0) {
          inMemoryStore.marks[idx] = { ...inMemoryStore.marks[idx], ...markData };
          results.push(inMemoryStore.marks[idx]);
        } else {
          const newDoc = { ...markData, _id: 'mrk_' + Math.random().toString(36).substring(2, 9) };
          inMemoryStore.marks.push(newDoc);
          results.push(newDoc);
        }
      }
    }

    res.json({ success: true, count: results.length, message: `Successfully saved marks for ${results.length} students!` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Attendance API
app.get('/api/attendance', async (req, res) => {
  try {
    const { date, classGrade, section } = req.query;

    if (isMongoConnected) {
      const query: any = {};
      if (date) query.date = date;
      if (classGrade && classGrade !== 'All') query.classGrade = classGrade;
      if (section && section !== 'All') query.section = section;

      const record = await AttendanceModel.findOne(query);
      return res.json({ success: true, data: record });
    }

    const found = inMemoryStore.attendance.find((a: any) => {
      let match = true;
      if (date && a.date !== date) match = false;
      if (classGrade && classGrade !== 'All' && a.classGrade !== classGrade) match = false;
      if (section && section !== 'All' && a.section !== section) match = false;
      return match;
    });

    res.json({ success: true, data: found || null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { date, classGrade, section, records } = req.body;
    if (!date || !classGrade || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Date, Class, and Attendance records are required' });
    }

    const payload = {
      date,
      classGrade,
      section: section || 'A',
      records,
      recordedAt: new Date(),
    };

    if (isMongoConnected) {
      const updated = await AttendanceModel.findOneAndUpdate(
        { date, classGrade, section: payload.section },
        payload,
        { upsert: true, new: true }
      );
      return res.json({ success: true, data: updated, message: 'Attendance saved successfully!' });
    }

    const idx = inMemoryStore.attendance.findIndex(
      (a: any) => a.date === date && a.classGrade === classGrade && a.section === payload.section
    );
    if (idx >= 0) {
      inMemoryStore.attendance[idx] = payload;
    } else {
      inMemoryStore.attendance.push(payload);
    }

    res.json({ success: true, data: payload, message: 'Attendance saved successfully!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Dashboard Statistics
app.get('/api/dashboard/stats', async (_req, res) => {
  try {
    let students: any[] = [];
    let marks: any[] = [];
    let subjects: any[] = [];

    if (isMongoConnected) {
      students = await StudentModel.find();
      marks = await MarkModel.find();
      subjects = await SubjectModel.find();
    } else {
      students = inMemoryStore.students;
      marks = inMemoryStore.marks;
      subjects = inMemoryStore.subjects;
    }

    const totalStudents = students.length;
    const totalSubjects = subjects.length;

    // Average mark percentage
    const avgPercentage =
      marks.length > 0
        ? parseFloat((marks.reduce((acc: number, m: any) => acc + (m.percentage || 0), 0) / marks.length).toFixed(1))
        : 0;

    // Grade breakdown
    const gradeCounts: Record<string, number> = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    marks.forEach((m: any) => {
      const g = m.grade || 'F';
      if (gradeCounts[g] !== undefined) gradeCounts[g]++;
      else gradeCounts[g] = 1;
    });

    // Pass percentage
    const passCount = marks.filter((m: any) => m.status === 'Pass').length;
    const passRate = marks.length > 0 ? Math.round((passCount / marks.length) * 100) : 0;

    // Top performers
    const sortedMarks = [...marks].sort((a: any, b: any) => b.totalObtained - a.totalObtained);
    const topPerformers = sortedMarks.slice(0, 5).map((m: any, index: number) => ({
      rank: index + 1,
      name: m.studentName,
      rollNo: m.rollNo,
      classGrade: m.classGrade,
      percentage: m.percentage,
      grade: m.grade,
      totalObtained: m.totalObtained,
      totalMax: m.totalMax,
    }));

    res.json({
      success: true,
      data: {
        totalStudents,
        totalSubjects,
        avgPercentage,
        passRate,
        gradeCounts,
        topPerformers,
        dbMode: isMongoConnected ? 'MongoDB' : 'In-Memory',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. Download Project ZIP (College Submission Packager)
app.get('/api/download-zip', async (_req, res) => {
  try {
    console.log('[Zip Export] Preparing college project zip archive...');
    const zip = new AdmZip();

    const rootDir = process.cwd();
    const filesToInclude = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'index.html',
      'metadata.json',
      '.env.example',
      'server.ts',
      'README.md',
    ];

    // Add root files
    filesToInclude.forEach((f) => {
      const fullPath = path.join(rootDir, f);
      if (fs.existsSync(fullPath)) {
        zip.addLocalFile(fullPath);
      }
    });

    // Add src directory recursively
    const srcDir = path.join(rootDir, 'src');
    if (fs.existsSync(srcDir)) {
      zip.addLocalFolder(srcDir, 'src');
    }

    // Add .env file if it exists, or create a ready-to-run .env
    const envContent = `# School Student Management System - Environment Config
PORT=3000

# To connect your MongoDB:
# 1. Local MongoDB:
MONGO_URI=mongodb://localhost:27017/school_db
# 2. Or MongoDB Atlas (Cloud Free Tier):
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/school_db?retryWrites=true&w=majority
`;
    zip.addFile('.env', Buffer.from(envContent, 'utf8'));

    // Add a Quick Start Guide for the friend
    const quickStart = `# HOW TO RUN THIS PROJECT (FOR MY FRIEND)

Hey! Here are the simple steps to run this School Student Management System on your laptop:

### Prerequisites
- Node.js (v18 or higher recommended)
- Optional: MongoDB Community Server (or a free MongoDB Atlas cluster)

### Step 1: Install Dependencies
Open your terminal in this extracted folder and run:
\`\`\`bash
npm install
\`\`\`

### Step 2: Configure MongoDB (Optional)
Open the \`.env\` file in this folder:
- If you have MongoDB installed locally, leave it as:
  MONGO_URI=mongodb://localhost:27017/school_db
- If you have a MongoDB Atlas cloud URI, paste your connection string there!
- If you don't have MongoDB yet, NO WORRIES! The project has a built-in in-memory fallback so you can demo and test every single feature right away!

### Step 3: Start the Development Server
\`\`\`bash
npm run dev
\`\`\`
Now open your browser at:
http://localhost:3000

### Step 4: Submission & Viva Presentation
Check the "Viva & Project Docs" tab inside the app for:
- Viva questions and answers
- Architecture & ER diagram
- Grading calculation formulas
- REST API endpoint cheat-sheet

All the best for your internal mark evaluation! 🚀
`;
    zip.addFile('QUICK_START_FOR_FRIEND.md', Buffer.from(quickStart, 'utf8'));

    const zipBuffer = zip.toBuffer();

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="school-student-management-system.zip"',
      'Content-Length': zipBuffer.length.toString(),
    });

    res.send(zipBuffer);
  } catch (err: any) {
    console.error('[Zip Export Error]', err);
    res.status(500).json({ success: false, message: 'Failed to create zip file: ' + err.message });
  }
});

// ---------------------------------------------------------------------------
// VITE DEV SERVER / STATIC PROD SERVING
// ---------------------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
  if (isProd) {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // In dev mode, mount Vite middleware for instant HMR and React JSX support
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🎓 School Student Management System is live!`);
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`🗄️ Database: ${isMongoConnected ? 'MongoDB Connected' : 'In-Memory Mode (Set MONGO_URI in .env)'}`);
    console.log(`=======================================================`);
  });
}

const isServerless = Boolean(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);

if (!isServerless) {
  startServer();
}

export default app;
