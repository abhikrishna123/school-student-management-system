import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calculator,
  RotateCcw,
} from 'lucide-react';
import { getStudents, getSubjects, getMarks, saveMarks, saveBatchMarks } from '../api';

export default function MarksEntry({ onMarkSaved }) {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedExam, setSelectedExam] = useState('Mid Term');

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [markRows, setMarkRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Load students, subjects and existing marks for this Class + Exam
  const loadData = async () => {
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    const [studentData, subjectData, existingMarks] = await Promise.all([
      getStudents({ classGrade: selectedClass, section: selectedSection }),
      getSubjects({ classGrade: selectedClass }),
      getMarks({ classGrade: selectedClass, examType: selectedExam }),
    ]);

    setStudents(studentData);
    setSubjects(subjectData);

    // Map rows with student info + marks per subject
    const initialRows = studentData.map((std) => {
      const existing = existingMarks.find(
        (m) => (m.studentId === std._id || m.rollNo === std.rollNo) && m.examType === selectedExam
      );

      // Create subject map
      const marksMap = {};
      subjectData.forEach((sub) => {
        const foundSub = existing?.marks?.find((m) => m.subjectCode === sub.code);
        marksMap[sub.code] = foundSub !== undefined ? foundSub.marksObtained : '';
      });

      return {
        studentId: std._id,
        rollNo: std.rollNo,
        studentName: std.name,
        classGrade: std.classGrade,
        section: std.section,
        marksMap,
        remarks: existing?.remarks || '',
      };
    });

    setMarkRows(initialRows);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedClass, selectedSection, selectedExam]);

  // Handle single subject mark change for a student
  const handleMarkChange = (studentId, subjectCode, value) => {
    // Basic number validation
    let numVal = value === '' ? '' : Math.max(0, Math.min(100, Number(value)));

    setMarkRows((prev) =>
      prev.map((row) => {
        if (row.studentId === studentId) {
          return {
            ...row,
            marksMap: {
              ...row.marksMap,
              [subjectCode]: numVal,
            },
          };
        }
        return row;
      })
    );
  };

  const handleRemarkChange = (studentId, value) => {
    setMarkRows((prev) =>
      prev.map((row) => (row.studentId === studentId ? { ...row, remarks: value } : row))
    );
  };

  // Helper to compute stats for a single row
  const computeRowStats = (row) => {
    let totalObt = 0;
    let totalMax = 0;
    let hasFailed = false;
    let allFilled = true;

    subjects.forEach((sub) => {
      const val = row.marksMap[sub.code];
      const max = sub.maxMarks || 100;
      const pass = sub.passMarks || 35;
      totalMax += max;

      if (val === '' || val === undefined) {
        allFilled = false;
      } else {
        const num = Number(val);
        totalObt += num;
        if (num < pass) hasFailed = true;
      }
    });

    const pct = totalMax > 0 ? parseFloat(((totalObt / totalMax) * 100).toFixed(2)) : 0;

    let grade = 'F';
    let status = 'Fail';

    if (!hasFailed && pct >= 35) {
      if (pct >= 90) grade = 'A+';
      else if (pct >= 80) grade = 'A';
      else if (pct >= 70) grade = 'B';
      else if (pct >= 60) grade = 'C';
      else if (pct >= 50) grade = 'D';
      else grade = 'E';
      status = 'Pass';
    }

    return { totalObt, totalMax, pct, grade, status, allFilled };
  };

  // Save single student's marks
  const handleSaveSingle = async (row) => {
    setSaving(true);
    const marksArray = subjects.map((sub) => ({
      subjectCode: sub.code,
      subjectName: sub.name,
      marksObtained: Number(row.marksMap[sub.code]) || 0,
      maxMarks: sub.maxMarks || 100,
      passMarks: sub.passMarks || 35,
    }));

    const payload = {
      studentId: row.studentId,
      rollNo: row.rollNo,
      studentName: row.studentName,
      classGrade: selectedClass,
      section: selectedSection,
      examType: selectedExam,
      marks: marksArray,
      remarks: row.remarks,
    };

    const res = await saveMarks(payload);
    setSaving(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: `Marks saved for ${row.studentName}!` });
      if (onMarkSaved) onMarkSaved();
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
    } else {
      setStatusMessage({ type: 'error', text: res.message || 'Failed to save marks' });
    }
  };

  // Batch Save all students in this class
  const handleBatchSave = async () => {
    if (markRows.length === 0) return;
    setSaving(true);

    const records = markRows.map((row) => {
      const marksArray = subjects.map((sub) => ({
        subjectCode: sub.code,
        subjectName: sub.name,
        marksObtained: Number(row.marksMap[sub.code]) || 0,
        maxMarks: sub.maxMarks || 100,
        passMarks: sub.passMarks || 35,
      }));

      return {
        studentId: row.studentId,
        rollNo: row.rollNo,
        studentName: row.studentName,
        classGrade: selectedClass,
        section: selectedSection,
        examType: selectedExam,
        marks: marksArray,
        remarks: row.remarks,
      };
    });

    const res = await saveBatchMarks({
      classGrade: selectedClass,
      examType: selectedExam,
      records,
    });

    setSaving(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: `Saved marks for all ${records.length} students!` });
      if (onMarkSaved) onMarkSaved();
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } else {
      setStatusMessage({ type: 'error', text: res.message || 'Failed to batch save marks' });
    }
  };

  // Auto-fill demo marks helper (Very helpful for demonstration & viva!)
  const handleAutoFillDemo = () => {
    setMarkRows((prev) =>
      prev.map((row, idx) => {
        const newMap = {};
        subjects.forEach((sub, sIdx) => {
          // Generates high realistic scores
          const base = 70 + ((idx * 7 + sIdx * 5) % 28);
          newMap[sub.code] = Math.min(99, base);
        });
        return {
          ...row,
          marksMap: newMap,
          remarks: 'Good comprehension and class participation.',
        };
      })
    );
    setStatusMessage({
      type: 'success',
      text: 'Auto-filled sample test scores! Click "Save All Class Marks" to record.',
    });
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
            <span>Internal Marks Assessment Portal</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter unit test and term examination scores. Percentage, grade, and pass status compute automatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoFillDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
            title="Populate realistic scores for testing/viva demo"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Fill Demo Marks</span>
          </button>

          <button
            onClick={handleBatchSave}
            disabled={saving || markRows.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Class Marks'}</span>
          </button>
        </div>
      </div>

      {/* Status Notice */}
      {statusMessage.text && (
        <div
          className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Filter Selector Panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 8">Class 8</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Select Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Exam / Assessment Term
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-indigo-700"
          >
            <option value="Unit Test 1">Unit Test 1 (Internal 1)</option>
            <option value="Mid Term">Mid Term Examination</option>
            <option value="Unit Test 2">Unit Test 2 (Internal 2)</option>
            <option value="Model Exam">Model / Pre-Board Exam</option>
            <option value="Final Exam">Final Examination</option>
          </select>
        </div>
      </div>

      {/* Marks Entry Gradebook Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            {selectedClass} - {selectedSection} &bull; {selectedExam} Roster
          </span>
          <span className="text-slate-500 flex items-center gap-1 font-mono">
            <Calculator className="w-3.5 h-3.5 text-indigo-600" />
            Passing threshold: 35 marks per subject
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-16">Roll</th>
                <th className="py-3 px-3 min-w-[140px]">Student Name</th>
                {subjects.map((sub) => (
                  <th key={sub.code} className="py-3 px-2 text-center min-w-[95px]">
                    <div className="truncate font-bold" title={sub.name}>
                      {sub.name}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Max: {sub.maxMarks}
                    </span>
                  </th>
                ))}
                <th className="py-3 px-2 text-center font-bold text-slate-800">Total</th>
                <th className="py-3 px-2 text-center font-bold text-indigo-700">%</th>
                <th className="py-3 px-2 text-center font-bold">Grade</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-3 min-w-[150px]">Remarks</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={subjects.length + 7} className="py-12 text-center text-slate-400">
                    Loading student gradebook...
                  </td>
                </tr>
              ) : markRows.length > 0 ? (
                markRows.map((row) => {
                  const stats = computeRowStats(row);

                  return (
                    <tr key={row.studentId} className="hover:bg-indigo-50/20 transition-colors">
                      {/* Roll No */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        {row.rollNo}
                      </td>

                      {/* Student Name */}
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {row.studentName}
                      </td>

                      {/* Subject Mark Inputs */}
                      {subjects.map((sub) => {
                        const val = row.marksMap[sub.code];
                        const isUnderPass = val !== '' && Number(val) < (sub.passMarks || 35);

                        return (
                          <td key={sub.code} className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min={0}
                              max={sub.maxMarks || 100}
                              value={val !== undefined ? val : ''}
                              onChange={(e) =>
                                handleMarkChange(row.studentId, sub.code, e.target.value)
                              }
                              placeholder="0-100"
                              className={`w-16 px-2 py-1 text-xs text-center font-mono font-semibold rounded border transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                                isUnderPass
                                  ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                                  : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                          </td>
                        );
                      })}

                      {/* Total */}
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-800">
                        {stats.totalObt} / {stats.totalMax}
                      </td>

                      {/* Percentage */}
                      <td className="py-3 px-2 text-center font-mono font-extrabold text-indigo-700">
                        {stats.pct}%
                      </td>

                      {/* Grade Badge */}
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            stats.grade === 'A+' || stats.grade === 'A'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : stats.grade === 'B' || stats.grade === 'C'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : stats.grade === 'D'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {stats.grade}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            stats.status === 'Pass'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {stats.status}
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) => handleRemarkChange(row.studentId, e.target.value)}
                          placeholder="Teacher feedback..."
                          className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>

                      {/* Single Save */}
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => handleSaveSingle(row)}
                          title="Save this student's marks"
                          className="p-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 rounded transition-colors cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={subjects.length + 7} className="py-12 text-center text-slate-400">
                    No students found in {selectedClass} - {selectedSection}. Add students first!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>Grading system: A+ (90-100%), A (80-89%), B (70-79%), C (60-69%), D (50-59%), F (&lt;35)</span>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset / Reload Marks</span>
          </button>
        </div>
      </div>
    </div>
  );
}
