import React, { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  PlusCircle,
  FileCheck,
  CalendarCheck,
  Download,
  AlertCircle,
  Database,
  Trophy,
} from 'lucide-react';
import { getDashboardStats } from '../api';

export default function Dashboard({ setActiveTab, onOpenAddStudent, onOpenDbModal, dbStatus }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const data = await getDashboardStats();
      if (data) {
        setStats(data);
      }
      setLoading(false);
    }
    loadStats();
  }, [dbStatus]);

  return (
    <div className="space-y-6">
      {/* Welcome & System Status Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-100 mb-2">
            Academic Year 2026 - 2027
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            School Student &amp; Internal Mark Portal
          </h2>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Manage student admissions, subject performance, internal test evaluations, attendance compliance, and generate printable term report cards.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-4 py-2 rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Admit New Student</span>
            </button>
            <button
              onClick={() => setActiveTab('marks')}
              className="inline-flex items-center gap-2 bg-indigo-900/60 hover:bg-indigo-900 text-white font-medium px-4 py-2 rounded-lg text-xs border border-white/20 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Enter Internal Marks</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="inline-flex items-center gap-2 bg-indigo-900/60 hover:bg-indigo-900 text-white font-medium px-4 py-2 rounded-lg text-xs border border-white/20 transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Take Daily Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database Connection Notice for Viva / Friend */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
              dbStatus?.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-800">
                Database Engine: {dbStatus?.connected ? 'MongoDB Live' : 'In-Memory Simulation Mode'}
              </h4>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  dbStatus?.connected
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {dbStatus?.connected ? 'Connected via Mongoose' : 'Active (Zero-Config)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {dbStatus?.connected
                ? `Storing records to ${dbStatus?.mongoUri || 'MongoDB database'}. Changes are saved persistently.`
                : 'Running in safe in-memory fallback. You can test all features right now or click Configure DB to connect to your local MongoDB or Atlas.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenDbModal}
            className="flex-1 sm:flex-none text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            Configure DB
          </button>
          <a
            href="/api/download-zip"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Project ZIP</span>
          </a>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Students
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalStudents ?? 0}
            </span>
            <span className="text-xs text-slate-500">Enrolled Students</span>
          </div>
          <button
            onClick={() => setActiveTab('students')}
            className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            View student directory &rarr;
          </button>
        </div>

        {/* Subjects & Faculty */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Subjects Offered
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats?.totalSubjects ?? 0}
            </span>
            <span className="text-xs text-slate-500">Active Courses</span>
          </div>
          <button
            onClick={() => setActiveTab('subjects')}
            className="mt-3 text-xs font-medium text-purple-600 hover:text-purple-800 cursor-pointer"
          >
            Manage syllabus &amp; faculty &rarr;
          </button>
        </div>

        {/* Average Performance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Internal Mark Avg
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : `${stats?.avgPercentage ?? 0}%`}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Overall Aggregate</span>
          </div>
          <button
            onClick={() => setActiveTab('marks')}
            className="mt-3 text-xs font-medium text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            View marks breakdown &rarr;
          </button>
        </div>

        {/* Pass Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Exam Pass Rate
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : `${stats?.passRate ?? 0}%`}
            </span>
            <span className="text-xs text-slate-500">Threshold &ge; 35 marks</span>
          </div>
          <button
            onClick={() => setActiveTab('reports')}
            className="mt-3 text-xs font-medium text-amber-600 hover:text-amber-800 cursor-pointer"
          >
            Print report cards &rarr;
          </button>
        </div>
      </div>

      {/* Two Column Layout: Top Rankers + Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Rankers Leaderboard */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-md">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Academic Merit List (Top Rankers)
              </h3>
            </div>
            <span className="text-xs text-slate-500">Mid-Term Assessment</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Total Marks</th>
                  <th className="py-2.5 px-3">Percentage</th>
                  <th className="py-2.5 px-3">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.topPerformers && stats.topPerformers.length > 0 ? (
                  stats.topPerformers.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                            idx === 0
                              ? 'bg-amber-400 text-amber-950 shadow-xs'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-800'
                              : idx === 2
                              ? 'bg-amber-600/30 text-amber-900'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {student.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">
                        {student.rollNo}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {student.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{student.classGrade}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {student.totalObtained} / {student.totalMax}
                      </td>
                      <td className="py-3 px-3 font-bold text-indigo-600">
                        {student.percentage}%
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {student.grade}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      No marks recorded yet. Click &apos;Enter Internal Marks&apos; to add assessment scores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Distribution & Quick Info */}
        <div className="space-y-6">
          {/* Grade Distribution Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Internal Grade Breakdown
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Distribution of letter grades across all recorded tests.
            </p>

            <div className="space-y-3">
              {[
                { grade: 'A+', range: '90 - 100%', color: 'bg-emerald-500' },
                { grade: 'A', range: '80 - 89%', color: 'bg-blue-500' },
                { grade: 'B', range: '70 - 79%', color: 'bg-indigo-500' },
                { grade: 'C', range: '60 - 69%', color: 'bg-amber-500' },
                { grade: 'D', range: '50 - 59%', color: 'bg-orange-500' },
                { grade: 'F', range: 'Below 50% / Failed', color: 'bg-rose-500' },
              ].map((item) => {
                const count = stats?.gradeCounts?.[item.grade] || 0;
                const total = stats?.totalStudents || 1;
                const barWidth = Math.min(100, Math.round((count / total) * 100));

                return (
                  <div key={item.grade} className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-700">
                        Grade {item.grade}{' '}
                        <span className="text-slate-400 font-normal">({item.range})</span>
                      </span>
                      <span className="font-bold text-slate-900">{count} students</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* College Project Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>Internal Mark Mini-Project Submission</span>
            </div>
            <p>
              This web app implements the full <strong>MERN architecture</strong>: React frontend, Express REST APIs, Mongoose data models, and an on-the-fly zip export system.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setActiveTab('docs')}
                className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                Read Viva preparation &amp; ER diagram &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
