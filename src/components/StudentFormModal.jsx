import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { createStudent, updateStudent } from '../api';

export default function StudentFormModal({ isOpen, onClose, studentToEdit, onSuccess }) {
  const [formData, setFormData] = useState({
    rollNo: '',
    admissionNo: '',
    name: '',
    classGrade: 'Class 10',
    section: 'A',
    gender: 'Male',
    dob: '2009-06-15',
    parentName: '',
    phone: '',
    email: '',
    address: '',
    status: 'Active',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        rollNo: studentToEdit.rollNo || '',
        admissionNo: studentToEdit.admissionNo || '',
        name: studentToEdit.name || '',
        classGrade: studentToEdit.classGrade || 'Class 10',
        section: studentToEdit.section || 'A',
        gender: studentToEdit.gender || 'Male',
        dob: studentToEdit.dob || '2009-06-15',
        parentName: studentToEdit.parentName || '',
        phone: studentToEdit.phone || '',
        email: studentToEdit.email || '',
        address: studentToEdit.address || '',
        status: studentToEdit.status || 'Active',
      });
    } else {
      // Auto-suggest next roll number or blank
      setFormData({
        rollNo: '',
        admissionNo: `ADM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        classGrade: 'Class 10',
        section: 'A',
        gender: 'Male',
        dob: '2009-06-15',
        parentName: '',
        phone: '',
        email: '',
        address: '',
        status: 'Active',
      });
    }
    setError('');
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic College Project Form Validation
    if (!formData.rollNo.trim()) {
      setError('Please enter a Roll Number (e.g., 1006).');
      return;
    }
    if (!formData.name.trim()) {
      setError('Please enter the Student Full Name.');
      return;
    }
    if (!formData.parentName.trim()) {
      setError('Please enter Parent or Guardian Name.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter a Contact Phone Number.');
      return;
    }

    setSubmitting(true);

    let res;
    if (studentToEdit) {
      res = await updateStudent(studentToEdit._id, formData);
    } else {
      res = await createStudent(formData);
    }

    setSubmitting(false);

    if (res.success) {
      onSuccess(res.message || 'Saved successfully');
      onClose();
    } else {
      setError(res.message || 'Operation failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-600 rounded-md">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {studentToEdit ? 'Edit Student Details' : 'Student Admission Form'}
              </h3>
              <p className="text-xs text-slate-300">
                {studentToEdit
                  ? `Updating record for Roll No: ${studentToEdit.rollNo}`
                  : 'Enroll a new student into the school register'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Roll No */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="rollNo"
                placeholder="e.g. 1006"
                value={formData.rollNo}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Admission No */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admission No / ID
              </label>
              <input
                type="text"
                name="admissionNo"
                placeholder="e.g. ADM-2024-006"
                value={formData.admissionNo}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Class Grade */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Class / Grade <span className="text-rose-500">*</span>
              </label>
              <select
                name="classGrade"
                value={formData.classGrade}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 8">Class 8</option>
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent / Guardian Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="parentName"
                placeholder="e.g. Ramesh Sharma"
                value={formData.parentName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. student@school.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Address
              </label>
              <textarea
                name="address"
                rows={2}
                placeholder="e.g. House No. 24, Gandhi Road, City"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : studentToEdit ? 'Update Student' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
