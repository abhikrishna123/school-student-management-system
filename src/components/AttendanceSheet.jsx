import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Calendar,
  Save,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { getStudents, getAttendance, saveAttendance } from '../api';

export default function AttendanceSheet() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Load attendance or default students
  const loadAttendance = async () => {
    setLoading(true);
    setStatusMessage('');

    const [studentList, existingAttendance] = await Promise.all([
      getStudents({ classGrade: selectedClass, section: selectedSection }),
      getAttendance({ date: selectedDate, classGrade: selectedClass, section: selectedSection }),
    ]);

    setStudents(studentList);

    if (existingAttendance && existingAttendance.records) {
      setRecords(existingAttendance.records);
    } else {
      // Default to Present for all
      const initial = studentList.map((std) => ({
        studentId: std._id,
        rollNo: std.rollNo,
        studentName: std.name,
        status: 'Present',
      }));
      setRecords(initial);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAttendance();
  }, [selectedDate, selectedClass, selectedSection]);

  const handleStatusChange = (studentId, newStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status: newStatus } : r))
    );
  };

  const handleMarkAll = (statusToSet) => {
    setRecords((prev) => prev.map((r) => ({ ...r, status: statusToSet })));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      date: selectedDate,
      classGrade: selectedClass,
      section: selectedSection,
      records,
    };

    const res = await saveAttendance(payload);
    setSaving(false);

    if (res.success) {
      setStatusMessage('Attendance recorded successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } else {
      alert(res.message || 'Failed to save attendance');
    }
  };

  // Counts
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const lateCount = records.filter((r) => r.status === 'Late').length;
  const total = records.length;
  const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-indigo-600" />
            <span>Daily Attendance Register</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track daily class presence. Required for semester 75% exam qualification compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMarkAll('Present')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving || records.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Date & Class Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Attendance Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

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
      </div>

      {/* Attendance Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Class Strength
          </span>
          <span className="text-xl font-bold text-slate-800">{total}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-emerald-600 block">
            Present
          </span>
          <span className="text-xl font-bold text-emerald-700">{presentCount}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-rose-600 block">Absent</span>
          <span className="text-xl font-bold text-rose-700">{absentCount}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-indigo-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-indigo-600 block">
            Attendance Rate
          </span>
          <span className="text-xl font-bold text-indigo-700">{attendanceRate}%</span>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-20">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class &amp; Section</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    Loading attendance roster...
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((row) => (
                  <tr key={row.studentId} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {row.rollNo}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {row.studentName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {selectedClass} - {selectedSection}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(row.studentId, 'Present')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            row.status === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(row.studentId, 'Late')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            row.status === 'Late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:text-amber-700'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(row.studentId, 'Absent')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            row.status === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-rose-700'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">
                    No students in this class.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 75% Rule Note */}
        <div className="p-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Academic Regulation:</strong> Minimum 75% aggregate attendance is mandatory for semester internal mark credit eligibility.
          </span>
        </div>
      </div>
    </div>
  );
}
