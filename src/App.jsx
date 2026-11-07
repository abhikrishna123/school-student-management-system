import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentFormModal from './components/StudentFormModal';
import StudentDetailsModal from './components/StudentDetailsModal';
import MarksEntry from './components/MarksEntry';
import ReportCard from './components/ReportCard';
import AttendanceSheet from './components/AttendanceSheet';
import SubjectList from './components/SubjectList';
import ProjectDocs from './components/ProjectDocs';
import DbConnectModal from './components/DbConnectModal';
import { getStatus } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbStatus, setDbStatus] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToView, setStudentToView] = useState(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [reportStudent, setReportStudent] = useState(null);

  // Success Notification Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchDbStatus = async () => {
    const status = await getStatus();
    setDbStatus(status);
  };

  useEffect(() => {
    fetchDbStatus();
    // Poll db status occasionally
    const interval = setInterval(fetchDbStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenAddStudent = () => {
    setStudentToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditStudent = (student) => {
    setStudentToEdit(student);
    setIsFormModalOpen(true);
  };

  const handleOpenDetails = (student) => {
    setStudentToView(student);
  };

  const handleSelectForReport = (student) => {
    setReportStudent(student);
    setActiveTab('reports');
  };

  const handleFormSuccess = (msg) => {
    showToast(msg);
    setRefreshKey((prev) => prev + 1);
    fetchDbStatus();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dbStatus={dbStatus}
        onOpenDbModal={() => setIsDbModalOpen(true)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onOpenAddStudent={handleOpenAddStudent}
            onOpenDbModal={() => setIsDbModalOpen(true)}
            dbStatus={dbStatus}
          />
        )}

        {activeTab === 'students' && (
          <StudentList
            onOpenAddModal={handleOpenAddStudent}
            onOpenEditModal={handleOpenEditStudent}
            onOpenDetailsModal={handleOpenDetails}
            refreshKey={refreshKey}
          />
        )}

        {activeTab === 'marks' && (
          <MarksEntry
            onMarkSaved={() => {
              showToast('Marks updated successfully!');
              fetchDbStatus();
            }}
          />
        )}

        {activeTab === 'reports' && (
          <ReportCard initialStudent={reportStudent} />
        )}

        {activeTab === 'attendance' && (
          <AttendanceSheet />
        )}

        {activeTab === 'subjects' && (
          <SubjectList />
        )}

        {activeTab === 'docs' && (
          <ProjectDocs
            dbStatus={dbStatus}
            onOpenDbModal={() => setIsDbModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="print:hidden bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            🎓 <strong>School Student &amp; Internal Mark Assessment System</strong> &bull; 2nd Year Computer Science Mini-Project
          </span>
          <span className="text-slate-400">
            Stack: React (JS) + Node.js + Express + MongoDB (Mongoose)
          </span>
        </div>
      </footer>

      {/* Modals */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        studentToEdit={studentToEdit}
        onSuccess={handleFormSuccess}
      />

      <StudentDetailsModal
        isOpen={!!studentToView}
        onClose={() => setStudentToView(null)}
        student={studentToView}
        onSelectForReport={handleSelectForReport}
      />

      <DbConnectModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        dbStatus={dbStatus}
        onConnected={() => {
          fetchDbStatus();
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
}
