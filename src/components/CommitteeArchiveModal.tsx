import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter, Mail, Award, UserCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

interface CommitteeArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommitteeArchiveModal: React.FC<CommitteeArchiveModalProps> = ({ isOpen, onClose }) => {
  const { database } = useData();
  const [selectedTenure, setSelectedTenure] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract distinct tenures
  const tenures = [
    'All',
    ...Array.from(new Set(database.leaders.map((l) => l.tenure).filter((t) => t && t !== 'All'))).sort().reverse(),
  ];

  const filteredLeaders = database.leaders.filter((ldr) => {
    const matchesTenure = selectedTenure === 'All' || ldr.tenure === selectedTenure;
    const matchesSearch =
      ldr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ldr.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ldr.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTenure && matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="committee-archive-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key="committee-archive-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-900"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-stone-900">Full Committee Archive</h3>
                  <p className="text-xs text-stone-500">
                    Historical registry of ANJUMAN-E-HUDA Executive Council Office-Bearers
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-4 bg-white border-b border-stone-200 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search leaders by name or role..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0">
                <span className="text-xs font-mono text-stone-500 flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-emerald-600" /> Tenure:
                </span>
                {tenures.map((tenure, idx) => (
                  <button
                    key={`archive-tenure-${tenure}-${idx}`}
                    onClick={() => setSelectedTenure(tenure)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTenure === tenure
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {tenure === 'All' ? 'All Tenures' : `Tenure ${tenure}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Leader Cards Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeaders.map((leader, idx) => (
                  <div
                    key={`archive-ldr-${leader.id}-${idx}`}
                    className="bg-white border border-stone-200 rounded-xl p-5 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={leader.photo}
                          alt={leader.name}
                          className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0 group-hover:border-emerald-400 transition-colors"
                        />
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                            {leader.role}
                          </span>
                          <h4 className="text-base font-bold text-stone-900 leading-snug">{leader.name}</h4>
                          <span className="text-xs text-amber-800 font-mono font-semibold">Tenure: {leader.tenure}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 mb-3">{leader.department}</p>

                      {leader.quote && (
                        <p className="text-xs italic text-stone-700 font-serif border-l-2 border-emerald-500 pl-3 py-1 mb-3">
                          "{leader.quote}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Executive Council
                      </span>
                      {leader.email && (
                        <a
                          href={`mailto:${leader.email}`}
                          className="hover:text-emerald-700 text-stone-600 flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3 text-stone-400" /> Contact
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>Preserving 3 Decades of Democratic Union Leadership</span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium cursor-pointer transition-colors"
              >
                Close Archive
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
