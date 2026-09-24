import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigation } from '../context/NavigationContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Home,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { database, addInquiry } = useData();
  const { contactSettings } = database;
  const { navigateTo } = useNavigation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSubmitting(true);
    await addInquiry({
      name: form.name,
      email: form.email,
      category: form.category,
      message: form.message,
    });
    setSubmitting(false);
    setIsSubmitted(true);
    setForm({
      name: '',
      email: '',
      category: 'General Inquiry',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-stone-900 border-b border-stone-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-stone-400 font-mono mb-3">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">Contact & Grievances</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold tracking-wider uppercase font-mono shadow-sm mb-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                CENTRAL SECRETARIAT & 24/7 GRIEVANCE REDRESSAL
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
                Contact & Student Grievances
              </h1>
              <p className="text-stone-300 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Reach out directly to the ANJUMAN-E-HUDA Executive Secretariat, file academic grievances, submit
                event petitions, or connect with our specialized student wings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Secretariat Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Official Contact Channels & Campus HQ */}
          <div className="lg:col-span-5 space-y-6">
            {/* Campus Headquarters Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Central Secretariat HQ</h3>
                  <span className="text-xs text-stone-400 font-mono">Official Campus Headquarters</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 text-xs sm:text-sm text-stone-300 leading-relaxed font-mono">
                {contactSettings?.campusAddress || 'Darul Huda Islamic University'}
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 text-stone-300">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-mono uppercase">Official Email</span>
                    <a
                      href={`mailto:${contactSettings?.officialEmail || 'anjumanehuda@dhiu.in'}`}
                      className="text-white hover:text-emerald-400 font-semibold transition-colors"
                    >
                      {contactSettings?.officialEmail || 'anjumanehuda@dhiu.in'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-stone-300">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-mono uppercase">Helpline Telephone</span>
                    <a
                      href={`tel:${contactSettings?.helplinePhone || '+91 98765 43210'}`}
                      className="text-white hover:text-emerald-400 font-semibold font-mono transition-colors"
                    >
                      {contactSettings?.helplinePhone || '+91 98765 43210'}
                    </a>
                    {contactSettings?.secondaryPhone && (
                      <span className="block text-xs text-stone-400 font-mono mt-0.5">
                        Secondary: {contactSettings.secondaryPhone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 text-stone-300">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-stone-400 font-mono uppercase">Office Hours</span>
                    <span className="text-white font-medium">
                      {contactSettings?.officeHours || 'Monday – Saturday: 08:30 AM – 06:00 PM (IST)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency & Redressal Commitment */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-stone-900 border border-emerald-500/30 text-xs text-stone-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                Guaranteed Redressal Protocol
              </div>
              <p className="leading-relaxed">
                All student grievances filed via this portal are dispatched under encrypted token protocol directly
                to the General Secretary and Student Welfare Ombudsman within 24 working hours.
              </p>
            </div>
          </div>

          {/* Right Column: Live Interactive Grievance & Inquiry Form */}
          <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="pb-4 border-b border-stone-800 mb-6">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                ONLINE SUBMISSION PORTAL
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
                File a Grievance or Message
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Fill out the required fields below. Your inquiry is recorded in the Central Secretariat's dashboard.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Grievance Registered Successfully</h4>
                <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                  Your message has been assigned a formal tracking token and saved to the Executive Secretariat queue.
                  Our team will review your petition promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow cursor-pointer transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Tariq Ahmad"
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="student@univ.edu"
                      className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
                    Inquiry Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry / Feedback</option>
                    <option value="Academic Grievance">Academic Grievance (Grades / Faculty)</option>
                    <option value="Welfare Fellowship">Welfare Fellowship / Hardship Relief</option>
                    <option value="Program Participation">Program Participation / Colloquium Registration</option>
                    <option value="Student Rights / Discipline">Student Rights / Ombudsman Redressal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1.5 uppercase">
                    Your Statement / Grievance Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide detailed description of your request or issue..."
                    className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting to Secretariat...' : 'Submit Grievance to Secretariat'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
