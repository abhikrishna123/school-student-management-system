import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  Award,
  CalendarCheck2,
  BookOpen,
  HelpCircle,
  Database,
  Download,
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, dbStatus, onOpenDbModal }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'marks', label: 'Internal Marks', icon: FileSpreadsheet },
    { id: 'reports', label: 'Report Cards', icon: Award },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'docs', label: 'Viva & Project Docs', icon: HelpCircle },
  ];

  const handleDownloadZip = () => {
    // Download zip package directly from server
    window.location.href = '/api/download-zip';
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40 border-b border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  St. Xavier&apos;s Model School
                </h1>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-medium px-2 py-0.5 rounded border border-indigo-500/30">
                  MERN Stack Mini-Project
                </span>
              </div>
              <p className="text-xs text-slate-400">
                School Student &amp; Internal Mark Assessment Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* MongoDB status indicator */}
            <button
              onClick={onOpenDbModal}
              title="Click to view database connection details or connect MongoDB"
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                dbStatus?.connected
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900'
                  : 'bg-amber-950/80 text-amber-300 border-amber-600/50 hover:bg-amber-900'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <Database className="w-3.5 h-3.5" />
              <span>{dbStatus?.connected ? 'MongoDB: Connected' : 'DB: In-Memory (Mock)'}</span>
            </button>

            {/* Download Project ZIP button */}
            <button
              onClick={handleDownloadZip}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              title="Download complete project ZIP file to send to friend"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
