import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { WingProgram, Wing } from '../../types';
import { initialDatabase, defaultCoreCommitteeWing } from '../../defaultData';
import {
  exportMasterExcelReport,
  exportFilteredExcelReport,
} from '../../utils/excelReportExporter';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Crown,
  CheckCircle2,
  Clock,
  MapPin,
  Tag,
  RefreshCw,
  X,
  FileCheck2,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

interface Props {
  showToast: (msg: string) => void;
  requestDelete: (opts: {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => Promise<void> | void;
  }) => void;
  onNavigateTab?: (tab: string) => void;
}

const ALL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const TARGET_CLASS_PRESETS = [
  'All Campus Students & Scholars',
  'Aliya 1st Year',
  'Aliya 2nd Year',
  'Aliya 3rd Year',
  'Sanawiya 1st Year',
  'Sanawiya 2nd Year',
  'Fazilat Final Year',
  'Faculty & Research Fellows',
  'General Public & Community',
];

export const ReportsManagementTab: React.FC<Props> = ({
  showToast,
  requestDelete,
  onNavigateTab,
}) => {
  const { database, addWingProgram, updateWingProgram, deleteWingProgram } = useData();

  // All Wing Programs (including Core Committee programs)
  const allPrograms: WingProgram[] = useMemo(() => {
    return database.wingPrograms && database.wingPrograms.length > 0
      ? database.wingPrograms
      : initialDatabase.wingPrograms || [];
  }, [database.wingPrograms]);

  // Distinct Academic Years
  const distinctYears = useMemo(() => {
    const set = new Set<string>();
    allPrograms.forEach((p) => {
      if (p.academicYear) set.add(p.academicYear);
    });
    const list = Array.from(set).sort().reverse();
    if (!list.includes('2026-27')) list.unshift('2026-27');
    return list;
  }, [allPrograms]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWing, setSelectedWing] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isExporting, setIsExporting] = useState(false);
  const [showMatrix, setShowMatrix] = useState(true);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<WingProgram | null>(null);
  const [programForm, setProgramForm] = useState({
    id: '',
    wingId: 'core-committee',
    wingName: 'Core Committee',
    title: '',
    targetClass: 'All Campus Students & Scholars',
    date: new Date().toISOString().split('T')[0],
    academicYear: '2026-27',
    month: 'October',
    venue: 'Darul Hikma',
    description: '',
    status: 'Completed' as WingProgram['status'],
  });

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter((p) => {
      const isCore =
        p.wingId === 'core-committee' ||
        p.wingName?.toLowerCase().includes('core committee');

      // Wing Filter
      if (selectedWing !== 'All') {
        if (selectedWing === 'core-committee') {
          if (!isCore) return false;
        } else {
          if (p.wingId !== selectedWing) return false;
        }
      }

      // Year Filter
      if (selectedYear !== 'All' && p.academicYear !== selectedYear) {
        return false;
      }

      // Month Filter
      if (selectedMonth !== 'All' && p.month?.toLowerCase() !== selectedMonth.toLowerCase()) {
        return false;
      }

      // Status Filter
      if (selectedStatus !== 'All' && p.status !== selectedStatus) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesClass = p.targetClass?.toLowerCase().includes(query);
        const matchesVenue = p.venue?.toLowerCase().includes(query);
        const matchesDesc = p.description?.toLowerCase().includes(query);
        const matchesWing = (p.wingName || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesClass && !matchesVenue && !matchesDesc && !matchesWing) {
          return false;
        }
      }

      return true;
    });
  }, [allPrograms, selectedWing, selectedYear, selectedMonth, selectedStatus, searchQuery]);

  // Statistics KPI
  const stats = useMemo(() => {
    const total = allPrograms.length;
    const coreCount = allPrograms.filter(
      (p) =>
        p.wingId === 'core-committee' ||
        p.wingName?.toLowerCase().includes('core committee')
    ).length;
    const wingsCount = total - coreCount;
    const currentYearCount = allPrograms.filter((p) => p.academicYear === '2026-27').length;
    const completedCount = allPrograms.filter((p) => p.status === 'Completed').length;
    const upcomingCount = allPrograms.filter((p) => p.status === 'Upcoming' || p.status === 'Ongoing').length;

    return { total, coreCount, wingsCount, currentYearCount, completedCount, upcomingCount };
  }, [allPrograms]);

  // Year & Month Matrix summary
  const yearMonthSummary = useMemo(() => {
    const map = new Map<string, { [month: string]: number }>();

    distinctYears.forEach((y) => {
      map.set(y, {});
      ALL_MONTHS.forEach((m) => {
        map.get(y)![m] = 0;
      });
    });

    allPrograms.forEach((p) => {
      const year = p.academicYear || '2026-27';
      const month = p.month;
      if (!map.has(year)) {
        map.set(year, {});
        ALL_MONTHS.forEach((m) => {
          map.get(year)![m] = 0;
        });
      }
      if (month && map.get(year)![month] !== undefined) {
        map.get(year)![month] += 1;
      }
    });

    return map;
  }, [allPrograms, distinctYears]);

  // Export Complete Master Workbook (.xlsx)
  const handleExportMaster = () => {
    try {
      setIsExporting(true);
      const filename = exportMasterExcelReport(allPrograms, database.wings);
      showToast(`Master Excel Report downloaded: ${filename}`);
    } catch (err: any) {
      console.error(err);
      showToast('Failed to export Master Excel Report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export Filtered Records (.xlsx)
  const handleExportFiltered = () => {
    try {
      if (filteredPrograms.length === 0) {
        showToast('No programs matching current filters to export.');
        return;
      }
      setIsExporting(true);
      let sheetTitle = 'Filtered_Programs';
      if (selectedWing !== 'All') {
        sheetTitle = selectedWing === 'core-committee' ? 'Core_Committee' : selectedWing;
      }
      const filename = exportFilteredExcelReport(
        filteredPrograms,
        sheetTitle,
        `ANJUMAN_E_HUDA_${sheetTitle}_Report`
      );
      showToast(`Excel Sheet downloaded: ${filename} (${filteredPrograms.length} records)`);
    } catch (err: any) {
      console.error(err);
      showToast('Failed to export Excel report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Open Add Core Committee Program
  const handleOpenAddCore = () => {
    setEditingProgram(null);
    setProgramForm({
      id: '',
      wingId: 'core-committee',
      wingName: 'Core Committee',
      title: '',
      targetClass: 'All Campus Students & Scholars',
      date: new Date().toISOString().split('T')[0],
      academicYear: '2026-27',
      month: 'October',
      venue: 'Central Secretariat Quadrangle',
      description: '',
      status: 'Completed',
    });
    setIsModalOpen(true);
  };

  // Open Add Wing Program
  const handleOpenAddWing = (wingId?: string) => {
    setEditingProgram(null);
    const targetWing = wingId
      ? database.wings.find((w) => w.id === wingId)
      : database.wings.find((w) => w.id !== 'core-committee');

    setProgramForm({
      id: '',
      wingId: targetWing?.id || 'wing_iqra',
      wingName: targetWing?.name || 'Specialized Wing',
      title: '',
      targetClass: 'Aliya 1st Year',
      date: new Date().toISOString().split('T')[0],
      academicYear: '2026-27',
      month: 'October',
      venue: 'Darul Hikma',
      description: '',
      status: 'Completed',
    });
    setIsModalOpen(true);
  };

  // Open Edit Program
  const handleOpenEdit = (prog: WingProgram) => {
    setEditingProgram(prog);
    setProgramForm({
      id: prog.id,
      wingId: prog.wingId,
      wingName: prog.wingName || '',
      title: prog.title,
      targetClass: prog.targetClass,
      date: prog.date,
      academicYear: prog.academicYear,
      month: prog.month,
      venue: prog.venue || 'Campus Central',
      description: prog.description || '',
      status: prog.status || 'Completed',
    });
    setIsModalOpen(true);
  };

  // Save Program (Add or Edit)
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.title.trim()) {
      showToast('Please provide a Program Title.');
      return;
    }

    const selectedWingObj = database.wings.find((w) => w.id === programForm.wingId);
    const finalWingName =
      programForm.wingId === 'core-committee'
        ? 'Core Committee'
        : selectedWingObj?.name || programForm.wingName || 'Specialized Wing';

    let month = programForm.month;
    if (programForm.date) {
      try {
        const d = new Date(programForm.date);
        if (!isNaN(d.getTime())) {
          month = d.toLocaleString('en-US', { month: 'long' });
        }
      } catch {}
    }

    const payload: Omit<WingProgram, 'id'> = {
      wingId: programForm.wingId,
      wingName: finalWingName,
      title: programForm.title.trim(),
      targetClass: programForm.targetClass.trim(),
      date: programForm.date,
      academicYear: programForm.academicYear,
      month: month || 'October',
      venue: programForm.venue.trim(),
      description: programForm.description.trim(),
      status: programForm.status,
    };

    if (editingProgram) {
      await updateWingProgram(editingProgram.id, payload);
      showToast(`Program "${payload.title}" updated successfully.`);
    } else {
      await addWingProgram(payload);
      showToast(`New program "${payload.title}" added to ${finalWingName}.`);
    }
    setIsModalOpen(false);
  };

  // Delete Program
  const handleDeleteProgram = (prog: WingProgram) => {
    requestDelete({
      title: `Delete Program "${prog.title}"`,
      message: `Are you sure you want to permanently delete this program from ${prog.wingName || 'Wing'} archives? The Excel report will automatically update immediately.`,
      confirmLabel: 'Delete Program',
      onConfirm: async () => {
        await deleteWingProgram(prog.id);
        showToast(`Program "${prog.title}" deleted.`);
      },
    });
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedWing('All');
    setSelectedYear('All');
    setSelectedMonth('All');
    setSelectedStatus('All');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedWing !== 'All' ||
    selectedYear !== 'All' ||
    selectedMonth !== 'All' ||
    selectedStatus !== 'All';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ================= HEADER SECTION ================= */}
      <div className="p-6 bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950/40 border border-stone-800 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>DYNAMIC EXCEL REPORT & LEDGER GENERATOR</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight flex items-center gap-3">
              <span>REPORT: Wings & Core Committee Ledger</span>
            </h1>

            <p className="text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time central report system. All Wings and Core Committee programs are compiled Year-Wise and Month-Wise. Any additions, modifications, or deletions update the Excel sheet immediately in real time.
            </p>
          </div>

          {/* Action Buttons: 1-Click Master Download */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportMaster}
              disabled={isExporting}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 cursor-pointer shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download Master Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handleExportFiltered}
              disabled={isExporting || filteredPrograms.length === 0}
              className="px-4 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 border border-stone-700 cursor-pointer shadow transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              title="Download currently filtered table view"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Export Filtered ({filteredPrograms.length})</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddCore}
              className="px-3.5 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>+ Core Program</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenAddWing()}
              className="px-3.5 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>+ Wing Program</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= KPI ANALYTICS CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">Total Programs</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-heading">{stats.total}</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-stone-500 mt-1">Across all sectors</span>
        </div>

        <div className="p-4 bg-stone-900 border border-amber-500/30 rounded-2xl flex flex-col justify-between bg-gradient-to-br from-amber-950/20 to-stone-900">
          <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-400" />
            Core Committee
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-heading">{stats.coreCount}</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[10px] text-amber-400/70 mt-1">Apex Council Ledgers</span>
        </div>

        <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-400" />
            Specialized Wings
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-heading">{stats.wingsCount}</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-[10px] text-stone-500 mt-1">{database.wings.length} wings active</span>
        </div>

        <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-400" />
            Session 2026-27
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-heading">{stats.currentYearCount}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-stone-500 mt-1">Current academic session</span>
        </div>

        <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Completed
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-heading">{stats.completedCount}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] text-stone-500 mt-1">Conducted archive</span>
        </div>

        <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl flex flex-col justify-between">
          <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            Upcoming
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-heading">{stats.upcomingCount}</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-[10px] text-stone-500 mt-1">Scheduled events</span>
        </div>
      </div>

      {/* ================= YEAR-WISE & MONTH-WISE BREAKDOWN MATRIX ================= */}
      <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-heading text-white">Year-Wise & Month-Wise Program Distribution</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400">
              Interactive Matrix
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMatrix(!showMatrix)}
            className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
          >
            {showMatrix ? 'Collapse Matrix' : 'Expand Matrix'}
          </button>
        </div>

        {showMatrix && (
          <div className="space-y-3 pt-2">
            {distinctYears.map((year) => {
              const monthsMap = yearMonthSummary.get(year) || {};
              const yearTotal = Object.values(monthsMap).reduce((a, b) => a + b, 0);

              return (
                <div key={`matrix-year-${year}`} className="p-3.5 bg-stone-950/70 border border-stone-800/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedYear(selectedYear === year ? 'All' : year)}
                      className="flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Academic Session: {year}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                        {yearTotal} Programs
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedYear(year);
                        setSelectedMonth('All');
                      }}
                      className="text-[11px] font-mono text-emerald-400 hover:underline cursor-pointer"
                    >
                      Filter Table for {year}
                    </button>
                  </div>

                  {/* Months Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-1">
                    {ALL_MONTHS.map((month) => {
                      const count = monthsMap[month] || 0;
                      const isSelected = selectedYear === year && selectedMonth.toLowerCase() === month.toLowerCase();

                      return (
                        <button
                          key={`month-badge-${year}-${month}`}
                          type="button"
                          onClick={() => {
                            setSelectedYear(year);
                            setSelectedMonth(selectedMonth === month ? 'All' : month);
                          }}
                          className={`p-2 rounded-lg text-center transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-105'
                              : count > 0
                              ? 'bg-stone-900 hover:bg-stone-800 text-stone-200 border-stone-700/80'
                              : 'bg-stone-950/40 text-stone-600 border-stone-900 hover:border-stone-800'
                          }`}
                        >
                          <span className="block text-[10px] font-mono truncate">{month.slice(0, 3)}</span>
                          <span
                            className={`block text-xs font-black mt-0.5 ${
                              count > 0 ? (isSelected ? 'text-white' : 'text-emerald-400 font-mono') : 'text-stone-600'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= FILTER TOOLBAR ================= */}
      <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs by name, category, venue, wing..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9.5 pr-8 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Clear Filter */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* Sector / Wing Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-stone-400 mb-1">Sector / Wing</label>
            <select
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Wings & Core Committee ({allPrograms.length})</option>
              <option value="core-committee">👑 Core Committee ({stats.coreCount})</option>
              {database.wings
                .filter((w) => w.id !== 'core-committee')
                .map((w) => {
                  const wingCount = allPrograms.filter((p) => p.wingId === w.id).length;
                  return (
                    <option key={`opt-wing-${w.id}`} value={w.id}>
                      {w.name} ({wingCount})
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Academic Year Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-stone-400 mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Academic Years</option>
              {distinctYears.map((yr) => (
                <option key={`opt-year-${yr}`} value={yr}>
                  Session {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-stone-400 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Months (Jan–Dec)</option>
              {ALL_MONTHS.map((m) => (
                <option key={`opt-month-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-stone-400 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed ({stats.completedCount})</option>
              <option value="Upcoming">Upcoming ({stats.upcomingCount})</option>
              <option value="Ongoing">Ongoing</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= DATA LEDGER TABLE ================= */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Table Top Header Info */}
        <div className="px-5 py-3.5 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Programs Ledger Table</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
              Showing {filteredPrograms.length} of {allPrograms.length} Records
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-time Live Sync Active</span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          {filteredPrograms.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/40 text-[10px] font-mono uppercase text-stone-400 tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">#</th>
                  <th className="py-3 px-3.5">Sector / Wing</th>
                  <th className="py-3 px-3.5">Program Name</th>
                  <th className="py-3 px-3.5">Category / Target Class</th>
                  <th className="py-3 px-3.5">Academic Year</th>
                  <th className="py-3 px-3.5">Month & Date</th>
                  <th className="py-3 px-3.5">Venue</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {filteredPrograms.map((prog, index) => {
                  const isCore =
                    prog.wingId === 'core-committee' ||
                    prog.wingName?.toLowerCase().includes('core committee');

                  return (
                    <tr
                      key={`prog-row-${prog.id}-${index}`}
                      className="hover:bg-stone-800/40 transition-colors group"
                    >
                      {/* S.No */}
                      <td className="py-3 px-3.5 text-center text-stone-500 font-mono text-[11px]">
                        {index + 1}
                      </td>

                      {/* Sector / Wing */}
                      <td className="py-3 px-3.5">
                        {isCore ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[11px]">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            Core Committee
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 text-[11px] font-medium">
                            <Layers className="w-3 h-3 text-emerald-400" />
                            {prog.wingName || 'Specialized Wing'}
                          </span>
                        )}
                      </td>

                      {/* Program Title & Description preview */}
                      <td className="py-3 px-3.5 max-w-xs">
                        <span className="font-bold text-white block line-clamp-1 group-hover:text-emerald-300 transition-colors">
                          {prog.title}
                        </span>
                        {prog.description && (
                          <span className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                            {prog.description}
                          </span>
                        )}
                      </td>

                      {/* Category / Target Class */}
                      <td className="py-3 px-3.5">
                        <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300 text-[11px] font-mono">
                          {prog.targetClass || 'Campus Wide'}
                        </span>
                      </td>

                      {/* Academic Year */}
                      <td className="py-3 px-3.5 font-mono text-[11px] text-amber-400/90 font-semibold">
                        {prog.academicYear || '2026-27'}
                      </td>

                      {/* Month & Date */}
                      <td className="py-3 px-3.5">
                        <div className="text-[11px] text-stone-300 font-medium">
                          {prog.month || 'Scheduled'}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                          {prog.date}
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="py-3 px-3.5 text-[11px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                          <span className="truncate max-w-[120px]">{prog.venue || 'Campus'}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 text-center">
                        {prog.status === 'Completed' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                            Completed
                          </span>
                        ) : prog.status === 'Upcoming' ? (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono font-bold">
                            Upcoming
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono font-bold">
                            Ongoing
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prog)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Program"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProgram(prog)}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Program"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* Empty State */
            <div className="py-14 px-4 text-center space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-stone-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Programs Match Your Filter Criteria</h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try resetting search parameters or record a new program for Core Committee or Wings.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddCore}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  + Add New Program
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-5 py-3 bg-stone-950/60 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
          <span>
            Excel reports are automatically generated from active database records. Any addition, edit, or deletion is instantly updated.
          </span>
          <span className="font-mono text-emerald-400 font-semibold">
            Format: .xlsx (Multi-Sheet)
          </span>
        </div>
      </div>

      {/* ================= ADD / EDIT PROGRAM MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2.5">
                {programForm.wingId === 'core-committee' ? (
                  <Crown className="w-5 h-5 text-amber-400" />
                ) : (
                  <Layers className="w-5 h-5 text-emerald-400" />
                )}
                <h3 className="text-lg font-bold font-heading text-white">
                  {editingProgram ? 'Edit Program Details' : 'Record New Program'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              {/* Sector / Wing Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Sector / Wing Assignment *
                </label>
                <select
                  value={programForm.wingId}
                  onChange={(e) => {
                    const wid = e.target.value;
                    const wObj = database.wings.find((w) => w.id === wid);
                    setProgramForm({
                      ...programForm,
                      wingId: wid,
                      wingName: wid === 'core-committee' ? 'Core Committee' : wObj?.name || 'Wing',
                    });
                  }}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-semibold"
                >
                  <option value="core-committee">👑 Core Committee (Apex Markazi Majlis)</option>
                  {database.wings
                    .filter((w) => w.id !== 'core-committee')
                    .map((w) => (
                      <option key={`modal-wing-${w.id}`} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Program Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Program Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  placeholder="e.g. Annual Symposium, Fiqh Seminar, Calligraphy Workshop..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Category / Target Class */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Category / Target Class *
                </label>
                <div className="space-y-2">
                  <select
                    value={programForm.targetClass}
                    onChange={(e) => setProgramForm({ ...programForm, targetClass: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {TARGET_CLASS_PRESETS.map((preset) => (
                      <option key={`preset-${preset}`} value={preset}>
                        {preset}
                      </option>
                    ))}
                    <option value="Custom">Other Custom Audience / Category...</option>
                  </select>

                  {!TARGET_CLASS_PRESETS.includes(programForm.targetClass) && (
                    <input
                      type="text"
                      value={programForm.targetClass}
                      onChange={(e) => setProgramForm({ ...programForm, targetClass: e.target.value })}
                      placeholder="Specify custom class or category..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>
              </div>

              {/* Academic Year & Month */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={programForm.academicYear}
                    onChange={(e) => setProgramForm({ ...programForm, academicYear: e.target.value })}
                    placeholder="e.g. 2026-27"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Month *
                  </label>
                  <select
                    value={programForm.month}
                    onChange={(e) => setProgramForm({ ...programForm, month: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ALL_MONTHS.map((m) => (
                      <option key={`modal-m-${m}`} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Venue */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Date Conducted *
                  </label>
                  <input
                    type="date"
                    required
                    value={programForm.date}
                    onChange={(e) => {
                      const d = e.target.value;
                      let autoMonth = programForm.month;
                      if (d) {
                        try {
                          const dateObj = new Date(d);
                          if (!isNaN(dateObj.getTime())) {
                            autoMonth = dateObj.toLocaleString('en-US', { month: 'long' });
                          }
                        } catch {}
                      }
                      setProgramForm({
                        ...programForm,
                        date: d,
                        month: autoMonth,
                      });
                    }}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={programForm.venue}
                    onChange={(e) => setProgramForm({ ...programForm, venue: e.target.value })}
                    placeholder="e.g. Darul Hikma, Auditorium"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Status</label>
                <select
                  value={programForm.status}
                  onChange={(e) => setProgramForm({ ...programForm, status: e.target.value as any })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Program Summary / Description
                </label>
                <textarea
                  rows={3}
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  placeholder="Summarize the program agenda, chief guest, resolutions, or student outcomes..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-emerald-950/40"
                >
                  {editingProgram ? 'Save Changes' : 'Record Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
