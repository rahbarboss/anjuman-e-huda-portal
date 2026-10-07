import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Search, Calendar, FileText, AlertCircle, Eye, Download, ExternalLink } from 'lucide-react';
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
            className="relative w-full max-w-4xl max-h-[85vh] bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-900"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-stone-900">Central Notification Center</h3>
                  <p className="text-xs text-stone-500">
                    Official circulars, academic notices, and union event gazettes
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

            {/* Search & Filter Toolbar */}
            <div className="px-6 py-4 bg-white border-b border-stone-200 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search circulars..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={`notice-cat-${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-stone-200">
              {filteredAnnouncements.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-sm">
                  No circulars or notifications found matching your filter criteria.
                </div>
              ) : (
                filteredAnnouncements.map((item, idx) => {
                  const itemImg = item.imageUrl || item.fileUrl;
                  const isImg = itemImg && !itemImg.endsWith('.pdf');

                  return (
                    <div key={`notice-item-${item.id}-${idx}`} className="pt-4 first:pt-0 group">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono tracking-wider ${
                              item.category === 'Circular'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : item.category === 'Event Alert'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : item.category === 'Result'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            {item.category}
                          </span>
                          {item.isPinned && (
                            <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md font-semibold">
                              PINNED
                            </span>
                          )}
                          {item.urgency === 'urgent' && (
                            <span className="flex items-center gap-1 text-[10px] text-red-600 font-semibold">
                              <AlertCircle className="w-3 h-3" />
                              URGENT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{item.date}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {isImg && (
                          <div
                            onClick={() => setSelectedNotice(item)}
                            className="w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 cursor-pointer relative group/thumb shadow-xs"
                          >
                            <img
                              src={itemImg}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-stone-900/30 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors mb-1.5">
                            {item.title}
                          </h4>
                          <p className="text-sm text-stone-600 leading-relaxed mb-3">{item.summary}</p>

                          <div className="flex items-center gap-3 text-xs">
                            <button
                              onClick={() => setSelectedNotice(item)}
                              className="text-emerald-700 hover:text-emerald-800 font-medium underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Read Official Circular & View Flyer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>Official Dispatches from Central Union Secretariat</span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>

          {/* Deep Circular Detail Popover */}
          {selectedNotice && (() => {
            const popoverImg = selectedNotice.imageUrl || selectedNotice.fileUrl;
            const isPopoverImg = popoverImg && !popoverImg.endsWith('.pdf');

            return (
              <div
                key="notice-detail-popover"
                className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedNotice(null)}
              >
                <div
                  className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl text-stone-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                    <span className="text-xs font-mono text-emerald-700 uppercase font-semibold">
                      ANJUMAN-E-HUDA GAZETTE ARCHIVE
                    </span>
                    <button
                      onClick={() => setSelectedNotice(null)}
                      className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {isPopoverImg && (
                    <div className="w-full bg-stone-50 rounded-xl p-3 border border-stone-200 mb-4 flex flex-col items-center">
                      <img
                        src={popoverImg}
                        alt={selectedNotice.title}
                        className="max-h-[50vh] w-auto max-w-full object-contain rounded-lg shadow-md"
                      />
                      <div className="w-full flex items-center justify-between pt-2 mt-2 border-t border-stone-200 text-[11px] font-mono text-stone-500">
                        <span>Official Gazette Poster</span>
                        <a
                          href={popoverImg}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open High-Res</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-stone-900 mb-2">{selectedNotice.title}</h3>
                  <p className="text-xs text-stone-500 font-mono mb-4">
                    Date of Issue: {selectedNotice.date} • Category: {selectedNotice.category}
                  </p>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm text-stone-700 leading-relaxed mb-6 font-serif">
                    "{selectedNotice.summary}"
                    <br />
                    <br />
                    <em className="text-xs text-stone-500 not-italic block border-t border-stone-200 pt-3 font-sans">
                      By order of the General Secretary & Central Academic Council, ANJUMAN-E-HUDA. All department
                      representatives are instructed to circulate this bulletin.
                    </em>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {popoverImg ? (
                      <a
                        href={popoverImg}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-stone-600" />
                        <span>Download Attached Document</span>
                      </a>
                    ) : <span />}

                    <button
                      onClick={() => setSelectedNotice(null)}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      Acknowledge & Close
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
