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
            className="relative w-full max-w-5xl max-h-[90vh] bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-100"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">Full Committee Archive</h3>
                  <p className="text-xs text-stone-400">
                    Historical registry of ANJUMAN-E-HUDA Executive Council Office-Bearers
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-4 bg-stone-900/90 border-b border-stone-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search leaders by name or role..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 sm:pb-0">
                <span className="text-xs font-mono text-stone-400 flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5" /> Tenure:
                </span>
                {tenures.map((tenure, idx) => (
                  <button
                    key={`archive-tenure-${tenure}-${idx}`}
                    onClick={() => setSelectedTenure(tenure)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTenure === tenure
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {tenure === 'All' ? 'All Tenures' : `Tenure ${tenure}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Leader Cards Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeaders.map((leader, idx) => (
                  <div
                    key={`archive-ldr-${leader.id}-${idx}`}
                    className="bg-stone-950 border border-stone-800 rounded-xl p-5 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={leader.photo}
                          alt={leader.name}
                          className="w-16 h-16 rounded-xl object-cover border border-stone-700 shrink-0 group-hover:border-emerald-400 transition-colors"
                        />
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/80 mb-1">
                            {leader.role}
                          </span>
                          <h4 className="text-base font-bold text-white leading-snug">{leader.name}</h4>
                          <span className="text-xs text-amber-400/90 font-mono">Tenure: {leader.tenure}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-400 mb-3">{leader.department}</p>

                      {leader.quote && (
                        <p className="text-xs italic text-stone-300 font-serif border-l-2 border-emerald-500/50 pl-3 py-1 mb-3">
                          "{leader.quote}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Executive Council
                      </span>
                      {leader.email && (
                        <a
                          href={`mailto:${leader.email}`}
                          className="hover:text-emerald-400 flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" /> Contact
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Preserving 3 Decades of Democratic Union Leadership</span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-medium cursor-pointer"
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
