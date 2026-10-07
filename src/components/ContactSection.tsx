import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ContactSection: React.FC = () => {
  const { database } = useData();
  const contactSettings = database.contactSettings;
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    studentId: '',
    email: '',
    category: 'Academic Query',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        department: '',
        studentId: '',
        email: '',
        category: 'Academic Query',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 font-mono">
            Direct Student Helpdesk
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 mt-1">
            Connect with Central Union
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Reach out to the Central Union office, submit grievances, or request fellowship guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 5 Cols: Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
              <h3 className="text-lg font-bold font-heading text-stone-900 pb-3 border-b border-stone-200">
                Union Secretariat Office
              </h3>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-600 uppercase font-mono">Address</h4>
                  <p className="text-sm text-stone-800 mt-0.5">
                    {contactSettings?.campusAddress || 'Darul Huda Islamic University'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-600 uppercase font-mono">Helpline</h4>
                  <p className="text-sm text-stone-800 mt-0.5">
                    {contactSettings?.helplinePhone || '+91 98765 43210'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-sky-700 flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-600 uppercase font-mono">Email Secretariat</h4>
                  <a
                    href={`mailto:${contactSettings?.officialEmail || 'anjumanehuda@dhiu.in'}`}
                    className="text-sm text-stone-800 hover:text-emerald-700 mt-0.5 block transition-colors font-medium"
                  >
                    {contactSettings?.officialEmail || 'anjumanehuda@dhiu.in'}
                  </a>
                  <p className="text-xs text-stone-500">grievance@dhiu.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-purple-700 flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-600 uppercase font-mono">Visiting Hours</h4>
                  <p className="text-sm text-stone-800 mt-0.5">
                    Monday to Saturday: 09:00 AM - 05:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Student Helpdesk Form */}
          <div className="lg:col-span-7 bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold font-heading text-stone-900 mb-2">
              Official Grievance & Suggestion Desk
            </h3>
            <p className="text-xs text-stone-600 mb-6">
              Messages submitted here are routed directly to the General Secretary and relevant Wing Manager.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col items-center text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 animate-bounce" />
                <h4 className="text-lg font-bold text-stone-900">Grievance Ticket Registered</h4>
                <p className="text-xs text-stone-600 max-w-md">
                  Jazakallah Khair. Your representation has been logged with Reference #AH-
                  {Math.floor(100000 + Math.random() * 900000)}. The secretariat will review within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tariq Masood"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Student ID / Roll No</label>
                    <input
                      type="text"
                      required
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      placeholder="e.g. 2026-CS-041"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g. Department of Law"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
                    >
                      <option>Academic Query</option>
                      <option>Hostel & Campus Facilities</option>
                      <option>Welfare Fellowship Request</option>
                      <option>Program Participation</option>
                      <option>General Representation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@university.edu"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Representation Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Elaborate on your representation or inquiry..."
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 shadow-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Official Representation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
