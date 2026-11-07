import React, { useState, useEffect } from 'react';
import { X, Award, Phone, Mail, MapPin, Calendar, FileText, Printer } from 'lucide-react';
import { getStudentById } from '../api';

export default function StudentDetailsModal({ student, isOpen, onClose, onSelectForReport }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?._id) {
      setLoading(true);
      getStudentById(student._id).then((res) => {
        if (res && res.data) {
          setData(res.data);
        } else {
          setData({ student, marks: [] });
        }
        setLoading(false);
      });
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const currentStudent = data?.student || student;
  const marksHistory = data?.marks || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
              {currentStudent.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base">{currentStudent.name}</h3>
              <p className="text-xs text-slate-300">
                Roll No: <span className="font-mono text-indigo-300">{currentStudent.rollNo}</span> |
                Admission: <span className="font-mono">{currentStudent.admissionNo}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Demographic Information Grid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Class &amp; Section</span>
              <span className="text-slate-800 font-bold text-sm">
                {currentStudent.classGrade} - {currentStudent.section}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Gender</span>
              <span className="text-slate-800 font-semibold">{currentStudent.gender}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Date of Birth</span>
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {currentStudent.dob}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Parent / Guardian</span>
              <span className="text-slate-800 font-semibold">{currentStudent.parentName}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Contact Phone</span>
              <span className="text-slate-800 font-mono font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {currentStudent.phone}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Email Address</span>
              <span className="text-slate-800 font-medium flex items-center gap-1 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {currentStudent.email || 'N/A'}
              </span>
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <span className="text-slate-400 block font-medium">Residential Address</span>
              <span className="text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {currentStudent.address || 'Address on school record'}
              </span>
            </div>
          </div>

          {/* Academic Assessment History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Internal Assessment Record</span>
              </h4>
              <button
                onClick={() => {
                  onSelectForReport(currentStudent);
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Open Official Marksheet</span>
              </button>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading exam records...</div>
            ) : marksHistory.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Exam Term</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Percentage</th>
                      <th className="py-2.5 px-3">Grade</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {marksHistory.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{m.examType}</td>
                        <td className="py-2.5 px-3 font-mono">
                          {m.totalObtained} / {m.totalMax}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-indigo-600">{m.percentage}%</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-100 text-emerald-800">
                            {m.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                              m.status === 'Pass'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 italic">{m.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-lg text-center text-xs text-slate-400">
                No exam marks recorded for this student yet. Use the Internal Marks tab to record scores.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
