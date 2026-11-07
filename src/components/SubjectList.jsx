import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, User, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getSubjects, createSubject } from '../api';

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All');
  const [loading, setLoading] = useState(true);

  // Add Subject Form Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    classGrade: 'Class 10',
    teacher: '',
    maxMarks: 100,
    passMarks: 35,
  });
  const [statusMessage, setStatusMessage] = useState('');

  const loadSubjects = async () => {
    setLoading(true);
    const data = await getSubjects({ classGrade: selectedClass });
    setSubjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSubjects();
  }, [selectedClass]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.teacher) {
      alert('Please fill in Code, Name, and Teacher name.');
      return;
    }

    const res = await createSubject(formData);
    if (res.success) {
      setStatusMessage(`Subject ${formData.name} added!`);
      setIsAddOpen(false);
      setFormData({
        code: '',
        name: '',
        classGrade: 'Class 10',
        teacher: '',
        maxMarks: 100,
        passMarks: 35,
      });
      loadSubjects();
      setTimeout(() => setStatusMessage(''), 3000);
    } else {
      alert(res.message || 'Failed to add subject');
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>Academic Curriculum &amp; Faculty Allocation</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Define subjects, maximum internal assessment credits, passing criteria, and assigned teachers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="py-2 px-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Classes</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 8">Class 8</option>
          </select>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading subjects...</div>
        ) : subjects.length > 0 ? (
          subjects.map((sub) => (
            <div
              key={sub._id || sub.code}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {sub.code}
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {sub.classGrade}
                  </span>
                </div>

                <h3 className="mt-3 font-bold text-slate-900 text-base">{sub.name}</h3>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Teacher: <strong className="text-slate-800">{sub.teacher}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Max Marks: <strong>{sub.maxMarks || 100}</strong> | Pass: <strong>{sub.passMarks || 35}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Internal Assessment Weightage</span>
                <span className="text-emerald-600 font-semibold">Active Syllabus</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400">
            No subjects defined for this filter.
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Subject</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Code</label>
                <input
                  type="text"
                  placeholder="e.g. BIO106"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Biology &amp; Health Sciences"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Class / Standard</label>
                <select
                  value={formData.classGrade}
                  onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Class 10">Class 10</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 8">Class 8</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Teacher</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Robert Smith"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pass Marks</label>
                  <input
                    type="number"
                    value={formData.passMarks}
                    onChange={(e) => setFormData({ ...formData, passMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
