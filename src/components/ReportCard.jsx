import React, { useState, useEffect } from 'react';
import {
  Award,
  Printer,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  Building,
  Calendar,
} from 'lucide-react';
import { getStudents, getMarks, getSubjects } from '../api';

export default function ReportCard({ initialStudent }) {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudent?._id || '');
  const [selectedExam, setSelectedExam] = useState('Mid Term');
  const [marksData, setMarksData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load students list
  useEffect(() => {
    async function init() {
      const allStudents = await getStudents();
      setStudents(allStudents);
      if (initialStudent?._id) {
        setSelectedStudentId(initialStudent._id);
      } else if (allStudents.length > 0 && !selectedStudentId) {
        setSelectedStudentId(allStudents[0]._id);
      }
    }
    init();
  }, [initialStudent]);

  // Load marks and subjects when student or exam changes
  useEffect(() => {
    async function fetchStudentMarks() {
      if (!selectedStudentId) return;
      setLoading(true);

      const currentStudent = students.find((s) => s._id === selectedStudentId);
      const studentClass = currentStudent?.classGrade || 'Class 10';

      const [marksList, subList] = await Promise.all([
        getMarks({ studentId: selectedStudentId, examType: selectedExam }),
        getSubjects({ classGrade: studentClass }),
      ]);

      setSubjects(subList);

      if (marksList && marksList.length > 0) {
        setMarksData(marksList[0]);
      } else {
        setMarksData(null);
      }
      setLoading(false);
    }

    if (students.length > 0) {
      fetchStudentMarks();
    }
  }, [selectedStudentId, selectedExam, students]);

  const currentStudent = students.find((s) => s._id === selectedStudentId);

  // Navigation helpers
  const currentIndex = students.findIndex((s) => s._id === selectedStudentId);
  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedStudentId(students[currentIndex - 1]._id);
    }
  };
  const handleNext = () => {
    if (currentIndex < students.length - 1) {
      setSelectedStudentId(students[currentIndex + 1]._id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Non-printed Controls bar */}
      <div className="print:hidden bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Official Student Marksheet &amp; Report Card</span>
          </h2>
          <p className="text-xs text-slate-500">
            Generate and print official term evaluation marksheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Select Student */}
          <div className="flex-1 md:flex-none">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
            >
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.rollNo} - {s.name} ({s.classGrade})
                </option>
              ))}
            </select>
          </div>

          {/* Select Exam */}
          <div className="flex-1 md:flex-none">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-indigo-700 font-medium"
            >
              <option value="Unit Test 1">Unit Test 1</option>
              <option value="Mid Term">Mid Term Examination</option>
              <option value="Unit Test 2">Unit Test 2</option>
              <option value="Model Exam">Model / Half Yearly</option>
              <option value="Final Exam">Final Examination</option>
            </select>
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              title="Previous Student"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= students.length - 1}
              className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              title="Next Student"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Marksheet Container */}
      <div className="bg-white rounded-xl border-2 border-slate-300 shadow-lg p-6 sm:p-10 max-w-4xl mx-auto print:border-none print:shadow-none print:p-2 text-slate-800">
        {/* School Header */}
        <div className="text-center border-b-2 border-slate-800 pb-5">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="p-2 bg-indigo-900 text-white rounded-lg shadow-xs print:bg-slate-900">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                St. Xavier&apos;s Model School
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Affiliated to Central Board of Secondary Education (CBSE) &bull; Code: 1985-042
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Institutional Campus: 12, Knowledge Park Boulevard, New Delhi - 110001
          </p>

          <div className="mt-4 inline-block bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest print:border print:border-slate-800">
            Student Academic Progress Report &bull; {selectedExam}
          </div>
        </div>

        {/* Student Demographics Profile */}
        {currentStudent ? (
          <div className="mt-6 bg-slate-50 border border-slate-300 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">
                Student Name:
              </span>
              <span className="font-bold text-sm text-slate-900">{currentStudent.name}</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">Roll No:</span>
              <span className="font-mono font-bold text-indigo-700 text-sm">
                {currentStudent.rollNo}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">
                Class &amp; Section:
              </span>
              <span className="font-bold text-slate-800">
                {currentStudent.classGrade} - {currentStudent.section}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">
                Admission No:
              </span>
              <span className="font-mono text-slate-700">{currentStudent.admissionNo}</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">
                Date of Birth:
              </span>
              <span className="font-medium text-slate-800">{currentStudent.dob}</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">Gender:</span>
              <span className="font-medium text-slate-800">{currentStudent.gender}</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">
                Parent / Guardian:
              </span>
              <span className="font-medium text-slate-800">{currentStudent.parentName}</span>
            </div>

            <div>
              <span className="text-slate-500 block uppercase text-[10px] font-bold">
                Academic Year:
              </span>
              <span className="font-medium text-slate-800">2026 - 2027</span>
            </div>
          </div>
        ) : null}

        {/* Marks Table */}
        <div className="mt-6">
          <table className="w-full text-left text-xs sm:text-sm border-collapse border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <tr>
                <th className="py-2.5 px-3 border border-slate-300 w-12 text-center">S.No</th>
                <th className="py-2.5 px-3 border border-slate-300 w-24">Subject Code</th>
                <th className="py-2.5 px-3 border border-slate-300">Subject Name</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-20">Max Marks</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-20">Pass Marks</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-28">
                  Marks Obtained
                </th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-20">Grade</th>
                <th className="py-2.5 px-3 border border-slate-300 text-center w-20">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Loading mark details...
                  </td>
                </tr>
              ) : marksData && marksData.marks && marksData.marks.length > 0 ? (
                marksData.marks.map((sub, idx) => {
                  const isPass = sub.marksObtained >= 35;
                  let subGrade = 'F';
                  if (sub.marksObtained >= 90) subGrade = 'A+';
                  else if (sub.marksObtained >= 80) subGrade = 'A';
                  else if (sub.marksObtained >= 70) subGrade = 'B';
                  else if (sub.marksObtained >= 60) subGrade = 'C';
                  else if (sub.marksObtained >= 50) subGrade = 'D';
                  else if (sub.marksObtained >= 35) subGrade = 'E';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 border border-slate-300 text-center font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-300 font-mono font-medium text-slate-700">
                        {sub.subjectCode}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-300 font-semibold text-slate-900">
                        {sub.subjectName}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-300 text-center font-mono text-slate-600">
                        {sub.maxMarks || 100}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-300 text-center font-mono text-slate-600">
                        35
                      </td>
                      <td className="py-2.5 px-3 border border-slate-300 text-center font-mono font-bold text-slate-900">
                        {sub.marksObtained}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-indigo-700">
                        {subGrade}
                      </td>
                      <td className="py-2.5 px-3 border border-slate-300 text-center font-semibold">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            isPass ? 'text-emerald-700' : 'text-rose-700 font-bold'
                          }`}
                        >
                          {isPass ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No marks entered for {currentStudent?.name} in {selectedExam}. Visit the &apos;Internal Marks&apos; tab to input exam marks.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Grand Total Row */}
            {marksData && (
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-400 text-xs sm:text-sm">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3 border border-slate-300 text-right uppercase">
                    Grand Total:
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center font-mono">
                    {marksData.totalMax}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center font-mono">-</td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center font-mono text-base text-indigo-800">
                    {marksData.totalObtained}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center text-indigo-800 text-base">
                    {marksData.grade}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span
                      className={`font-extrabold ${
                        marksData.status === 'Pass' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {marksData.status === 'Pass' ? 'PASSED' : 'RE-APPEAR'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Assessment Summary Badges */}
        {marksData && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">Aggregate Percentage</span>
              <span className="text-xl font-extrabold text-indigo-700 font-mono">
                {marksData.percentage}%
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">Final Letter Grade</span>
              <span className="text-xl font-extrabold text-emerald-700">
                {marksData.grade}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">Result Outcome</span>
              <span
                className={`text-base font-extrabold ${
                  marksData.status === 'Pass' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {marksData.status === 'Pass' ? 'PROMOTED' : 'NEEDS IMPROVEMENT'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[11px]">Attendance Eligibility</span>
              <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Eligible (&ge;75%)</span>
              </span>
            </div>
          </div>
        )}

        {/* Remarks Section */}
        <div className="mt-6 border border-slate-200 rounded-lg p-3.5 bg-slate-50 text-xs">
          <span className="font-bold text-slate-800 block mb-1">Class Teacher Remarks:</span>
          <p className="text-slate-600 italic">
            &ldquo;{marksData?.remarks || 'Consistently disciplined with good academic progress.'}&rdquo;
          </p>
        </div>

        {/* Signatures Area */}
        <div className="mt-14 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs text-slate-600">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mx-auto w-3/4 mb-1" />
            <span className="font-semibold text-slate-800 block">Class Teacher</span>
            <span className="text-[10px] text-slate-400">Signature</span>
          </div>

          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mx-auto w-3/4 mb-1" />
            <span className="font-semibold text-slate-800 block">Parent / Guardian</span>
            <span className="text-[10px] text-slate-400">Signature</span>
          </div>

          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mx-auto w-3/4 mb-1" />
            <span className="font-semibold text-slate-800 block">Principal / Headmaster</span>
            <span className="text-[10px] text-slate-400">Official Seal &amp; Sign</span>
          </div>
        </div>

        {/* Print Footer */}
        <div className="mt-8 text-center text-[10px] text-slate-400 print:block">
          Computer Generated Marksheet &bull; School Student Management System (MERN Stack)
        </div>
      </div>
    </div>
  );
}
