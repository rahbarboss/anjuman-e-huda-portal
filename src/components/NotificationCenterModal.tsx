import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Search, Calendar, FileText, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ isOpen, onClose }) => {
  const { database } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);

  const categories = ['All', 'Circular', 'Event Alert', 'Notice', 'Result'];

  const filteredAnnouncements = database.announcements.filter((ann) => {
    const matchesCat = selectedCategory === 'All' || ann.category === selectedCategory;
    const matchesSearch =
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="notification-center-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="notification-center-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[85vh] bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-100"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">Central Notification Center</h3>
                  <p className="text-xs text-stone-400">
                    Official circulars, academic notices, and union event gazettes
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

            {/* Search & Filter Toolbar */}
            <div className="px-6 py-4 bg-stone-900/90 border-b border-stone-800/80 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search circulars..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={`notice-cat-${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-stone-800/70 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-stone-800/60">
              {filteredAnnouncements.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-sm">
                  No circulars or notifications found matching your filter criteria.
                </div>
              ) : (
                filteredAnnouncements.map((item, idx) => (
                  <div key={`notice-item-${item.id}-${idx}`} className="pt-4 first:pt-0 group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono tracking-wider ${
                            item.category === 'Circular'
                              ? 'bg-blue-900/60 text-blue-300 border border-blue-500/30'
                              : item.category === 'Event Alert'
                              ? 'bg-amber-900/60 text-amber-300 border border-amber-500/30'
                              : item.category === 'Result'
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30'
                              : 'bg-stone-800 text-stone-300 border border-stone-700'
                          }`}
                        >
                          {item.category}
                        </span>
                        {item.isPinned && (
                          <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-md font-semibold">
                            PINNED
                          </span>
                        )}
                        {item.urgency === 'urgent' && (
                          <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            URGENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <h4 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-sm text-stone-300 leading-relaxed mb-3">{item.summary}</p>

                    <div className="flex items-center gap-3 text-xs">
                      <button
                        onClick={() => setSelectedNotice(item)}
                        className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Read Official Circular
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Official Dispatches from Central Academic Union (CAU)</span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>

          {/* Deep Circular Detail Popover */}
          {selectedNotice && (
            <div
              key="notice-detail-popover"
              className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90"
              onClick={() => setSelectedNotice(null)}
            >
              <div
                className="w-full max-w-lg bg-stone-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl text-stone-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
                  <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                    ANJUMAN-E-HUDA GAZETTE ARCHIVE
                  </span>
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="text-stone-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{selectedNotice.title}</h3>
                <p className="text-xs text-stone-400 font-mono mb-4">
                  Date of Issue: {selectedNotice.date} • Category: {selectedNotice.category}
                </p>
                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-sm text-stone-300 leading-relaxed mb-6 font-serif">
                  "{selectedNotice.summary}"
                  <br />
                  <br />
                  <em className="text-xs text-stone-400 not-italic block border-t border-stone-800 pt-3">
                    By order of the General Secretary & Central Academic Council, ANJUMAN-E-HUDA. All department
                    representatives are instructed to circulate this bulletin.
                  </em>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-xs cursor-pointer"
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
