import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, Key, Server } from 'lucide-react';
import { connectMongo } from '../api';

export default function DbConnectModal({ isOpen, onClose, dbStatus, onConnected }) {
  const defaultUri = 'mongodb+srv://admin:admin123@cluster0.ueskciq.mongodb.net/school_db?retryWrites=true&w=majority';
  const [mongoUri, setMongoUri] = useState(
    dbStatus?.mongoUri && !dbStatus.mongoUri.includes('****') ? dbStatus.mongoUri : defaultUri
  );
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!mongoUri.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid MongoDB connection string' });
      return;
    }

    setConnecting(true);
    setMessage({ type: '', text: '' });

    const res = await connectMongo(mongoUri.trim());
    setConnecting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Connected to MongoDB successfully!' });
      if (onConnected) onConnected();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMessage({
        type: 'error',
        text: res.message || 'Could not connect to MongoDB. Ensure mongod daemon is running or check your Atlas credentials.',
      });
    }
  };

  const handleUseLocal = () => {
    setMongoUri('mongodb://localhost:27017/school_db');
  };

  const handleUseAtlasTemplate = () => {
    setMongoUri('mongodb+srv://admin:admin123@cluster0.ueskciq.mongodb.net/school_db?retryWrites=true&w=majority');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                MongoDB Database Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Connect your local MongoDB server or cloud Atlas cluster.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Indicator */}
        <div
          className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
            dbStatus?.connected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="font-semibold">
              Current Status: {dbStatus?.connected ? 'MongoDB Live Connection' : 'In-Memory Simulation Mode'}
            </span>
          </div>
          <span className="text-[11px] font-mono font-medium">
            {dbStatus?.studentCount || 0} students loaded
          </span>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              MongoDB Connection URI (MONGO_URI)
            </label>
            <input
              type="text"
              value={mongoUri}
              onChange={(e) => setMongoUri(e.target.value)}
              placeholder="mongodb://localhost:27017/school_db"
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Quick Presets:</span>
            <button
              type="button"
              onClick={handleUseLocal}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
            >
              Localhost (27017)
            </button>
            <button
              type="button"
              onClick={handleUseAtlasTemplate}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium cursor-pointer"
            >
              MongoDB Atlas Template
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Note for Project Evaluator &amp; Friend:</span>
            <p>
              When running locally, start MongoDB with <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">mongod</code> in your terminal. If you haven’t started MongoDB yet, don’t worry! The in-memory fallback will automatically retain all records in memory while you demo the app.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={connecting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
            >
              {connecting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Server className="w-3.5 h-3.5" />
                  <span>Connect to MongoDB</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
