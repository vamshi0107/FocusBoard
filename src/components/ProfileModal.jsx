import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  ExternalLink, 
  Award, 
  CheckCircle, 
  Code2, 
  Briefcase, 
  Pencil, 
  Save 
} from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, profile, onSaveProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
    setIsEditing(false);
  }, [profile, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Gradient Background */}
        <div className="relative h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-4 flex justify-between items-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold tracking-wide uppercase">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Candidate Portfolio</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close profile modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Content Container */}
        <div className="px-6 pb-6 pt-0 overflow-y-auto space-y-6">
          {/* Avatar & Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-slate-900 text-white border-4 border-white shadow-lg flex items-center justify-center text-2xl font-extrabold tracking-wider bg-gradient-to-tr from-indigo-700 to-indigo-500">
                  {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active Candidate" />
              </div>

              <div>
                <h3 id="profile-title" className="text-xl font-extrabold text-slate-900 leading-tight">
                  {formData.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-indigo-600 flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{formData.role}</span>
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3" />
                  <span>Assessment Submission Complete</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto shadow-xs"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-500" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Edit Profile Form vs. View Details */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Candidate Role / Title
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Candidate Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Bio Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  About Candidate
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {formData.bio}
                </p>
              </div>

              {/* Contact & Links Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`mailto:${formData.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-slate-800"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{formData.email}</p>
                  </div>
                </a>

                <a
                  href={formData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-slate-400 hover:bg-slate-50 transition-all text-slate-800"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GitHub</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">{formData.github.replace('https://github.com/', '@')}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                </a>
              </div>

              {/* Assessment Implementation Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Technical Project Overview
                </h4>
                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Assigned Project:</span>
                    <span className="font-bold text-white">FocusBoard Task Management</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Evaluation Specs:</span>
                    <span className="text-indigo-300 font-semibold">21/21 Steps Complete</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Responsive Breakpoints:</span>
                    <span className="text-slate-200">1440px · 768px · 390px</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Live Application:</span>
                    <a 
                      href={formData.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>focusboard-kohl.vercel.app</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Core Skills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Verified Competencies & Skills</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium">
            Candidate ID: <code className="font-mono text-slate-600">VR-2026-MF</code>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
