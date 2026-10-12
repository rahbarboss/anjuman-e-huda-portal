import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ReportProgram, Wing } from '../../types';
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

const PROGRAM_CATEGORIES = [
  'Academic',
  'Cultural',
  'Leadership',
  'Outreach',
  'Sports',
  "Religious & Ta'lim",
  'Debate & Declamation',
  'Symposium',
  'Competition',
  'Conference',
  'Special Session',
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
  const {
    database,
    addProgram,
    updateProgram,
    deleteProgram,
    addWingProgram,
    updateWingProgram,
    deleteWingProgram,
  } = useData();

  // Helper to compute Month and Academic Year robustly
  const getMonthAndYear = (dateStr?: string, existingMonth?: string, existingYear?: string) => {
    let month = '';
    let academicYear = existingYear || '';

    // If existingMonth matches one of the canonical month names (case-insensitive)
    if (existingMonth) {
      const match = ALL_MONTHS.find(
        (m) => m.toLowerCase() === existingMonth.trim().toLowerCase()
      );
      if (match) {
        month = match;
      }
    }

    if (dateStr) {
      // 1. Direct YYYY-MM-DD split
      const parts = dateStr.trim().split(/[-/]/);
      if (parts.length >= 2) {
        let yr = 0;
        let m = 0;
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          yr = parseInt(parts[0], 10);
          m = parseInt(parts[1], 10);
        } else if (parts[2]?.length === 4) {
          // MM/DD/YYYY or DD/MM/YYYY
          yr = parseInt(parts[2], 10);
          m = parseInt(parts[0], 10);
          if (m > 12) m = parseInt(parts[1], 10);
        }

        if (m >= 1 && m <= 12 && !month) {
          month = ALL_MONTHS[m - 1];
        }
        if (yr > 1900 && !academicYear) {
          academicYear = m >= 5 ? `${yr}-${String(yr + 1).slice(-2)}` : `${yr - 1}-${String(yr).slice(-2)}`;
        }
      }

      // 2. Fallback to Date parser if still missing
      if (!month || !academicYear) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          if (!month) {
            const parsedName = d.toLocaleString('en-US', { month: 'long' });
            const match = ALL_MONTHS.find((m) => m.toLowerCase() === parsedName.toLowerCase());
            if (match) month = match;
          }
          if (!academicYear) {
            const yr = d.getFullYear();
            const m = d.getMonth() + 1;
            academicYear = m >= 5 ? `${yr}-${String(yr + 1).slice(-2)}` : `${yr - 1}-${String(yr).slice(-2)}`;
          }
        }
      }
    }

    if (!month) month = 'October';
    if (!academicYear) academicYear = '2026-27';
    return { month, academicYear };
  };

  // Helper to resolve wing cleanly
  const resolveWing = (wingId?: string, wingName?: string) => {
    if (wingId === 'core-committee' || wingName?.toLowerCase().includes('core committee')) {
      return { id: 'core-committee', name: 'Core Committee' };
    }
    if (wingId) {
      const match = database.wings.find((w) => w.id === wingId);
      if (match) return { id: match.id, name: match.name };
    }
    if (wingName) {
      const match = database.wings.find((w) => w.name.toLowerCase() === wingName.toLowerCase());
      if (match) return { id: match.id, name: match.name };
    }
    return { id: 'core-committee', name: 'Core Committee' };
  };

  // Consolidate ALL real programs (both from database.programs and database.wingPrograms)
  const allPrograms: ReportProgram[] = useMemo(() => {
    const list: ReportProgram[] = [];
    const seenIds = new Set<string>();

    // 1. All real programs from database.programs
    (database.programs || []).forEach((p) => {
      if (seenIds.has(p.id)) return;
      seenIds.add(p.id);

      const { id: wingId, name: wingName } = resolveWing(p.wingId, p.wingName);
      const { month, academicYear } = getMonthAndYear(p.date, p.month, p.academicYear);

      list.push({
        id: p.id,
        source: 'program',
        title: p.title || 'Untitled Program',
        category: p.category || 'General',
        wingId,
        wingName,
        date: p.date || new Date().toISOString().split('T')[0],
        time: p.time || '10:00 AM',
        venue: p.venue || 'Darul Huda',
        status: p.status || 'Completed',
        description: p.description || '',
        banner: p.banner || '',
        tags: p.tags || [],
        targetClass: p.targetClass || p.tags?.join(', ') || 'All Campus Students',
        academicYear,
        month,
        registrationLink: p.registrationLink,
      });
    });

    // 2. All real conducted programs from database.wingPrograms
    (database.wingPrograms || []).forEach((wp) => {
      if (seenIds.has(wp.id)) return;
      seenIds.add(wp.id);

      const { id: wingId, name: wingName } = resolveWing(wp.wingId, wp.wingName);
      const { month, academicYear } = getMonthAndYear(wp.date, wp.month, wp.academicYear);

      list.push({
        id: wp.id,
        source: 'wingProgram',
        title: wp.title || 'Untitled Program',
        category: wp.category || wp.targetClass || 'Wing Activity',
        wingId,
        wingName,
        date: wp.date || new Date().toISOString().split('T')[0],
        time: wp.time || '10:00 AM',
        venue: wp.venue || 'Darul Huda',
        status: (wp.status as any) || 'Completed',
        description: wp.description || '',
        banner: wp.banner || '',
        targetClass: wp.targetClass || 'All Campus Students & Scholars',
        academicYear,
        month,
      });
    });

    // Sort by Date descending (latest programs first)
    return list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [database.programs, database.wingPrograms, database.wings]);

  // Distinct Academic Years from real data
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isExporting, setIsExporting] = useState(false);
  const [showMatrix, setShowMatrix] = useState(true);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ReportProgram | null>(null);
  const [programForm, setProgramForm] = useState({
    id: '',
    source: 'program' as 'program' | 'wingProgram',
    wingId: 'core-committee',
    wingName: 'Core Committee',
    title: '',
    category: 'Academic',
    targetClass: 'All Campus Students & Scholars',
    date: new Date().toISOString().split('T')[0],
    academicYear: '2026-27',
    month: 'October',
    time: '10:00 AM',
    venue: 'Darul Hikma',
    description: '',
    status: 'Completed' as 'Completed' | 'Upcoming' | 'Live' | 'Ongoing',
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
          if (p.wingId !== selectedWing && p.wingName !== selectedWing) return false;
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

      // Category Filter
      if (selectedCategory !== 'All' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Status Filter
      if (selectedStatus !== 'All' && p.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesCategory = (p.category || '').toLowerCase().includes(query);
        const matchesClass = (p.targetClass || '').toLowerCase().includes(query);
        const matchesVenue = (p.venue || '').toLowerCase().includes(query);
        const matchesDesc = (p.description || '').toLowerCase().includes(query);
        const matchesWing = (p.wingName || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesClass && !matchesVenue && !matchesDesc && !matchesWing) {
          return false;
        }
      }

      return true;
    });
  }, [allPrograms, selectedWing, selectedYear, selectedMonth, selectedCategory, selectedStatus, searchQuery]);

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
    const upcomingCount = allPrograms.filter((p) => p.status === 'Upcoming' || p.status === 'Live' || p.status === 'Ongoing').length;

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
      source: 'program',
      wingId: 'core-committee',
      wingName: 'Core Committee',
      title: '',
      category: 'Academic',
      targetClass: 'All Campus Students & Scholars',
      date: new Date().toISOString().split('T')[0],
      academicYear: '2026-27',
      month: 'October',
      time: '10:00 AM',
      venue: 'Darul Hikma',
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
      : database.wings.find((w) => w.id !== 'core-committee') || database.wings[0];

    setProgramForm({
      id: '',
      source: 'program',
      wingId: targetWing?.id || 'core-committee',
      wingName: targetWing?.name || 'Specialized Wing',
      title: '',
      category: 'Academic',
      targetClass: 'All Campus Students & Scholars',
      date: new Date().toISOString().split('T')[0],
      academicYear: '2026-27',
      month: 'October',
      time: '10:00 AM',
      venue: 'Darul Hikma',
      description: '',
      status: 'Completed',
    });
    setIsModalOpen(true);
  };

  // Open Edit Program
  const handleOpenEdit = (prog: ReportProgram) => {
    setEditingProgram(prog);
    setProgramForm({
      id: prog.id,
      source: prog.source,
      wingId: prog.wingId,
      wingName: prog.wingName,
      title: prog.title,
      category: prog.category || 'Academic',
      targetClass: prog.targetClass || 'All Campus Students & Scholars',
      date: prog.date,
      academicYear: prog.academicYear,
      month: prog.month,
      time: prog.time || '10:00 AM',
      venue: prog.venue || 'Darul Huda',
      description: prog.description || '',
      status: (prog.status as any) || 'Completed',
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

    const { month, academicYear } = getMonthAndYear(
      programForm.date,
      programForm.month,
      programForm.academicYear
    );

    if (editingProgram) {
      if (editingProgram.source === 'wingProgram') {
        await updateWingProgram(editingProgram.id, {
          title: programForm.title.trim(),
          category: programForm.category,
          wingId: programForm.wingId,
          wingName: finalWingName,
          targetClass: programForm.targetClass.trim(),
          date: programForm.date,
          academicYear,
          month,
          venue: programForm.venue.trim(),
          time: programForm.time,
          description: programForm.description.trim(),
          status: programForm.status as any,
        });
      } else {
        await updateProgram(editingProgram.id, {
          title: programForm.title.trim(),
          category: programForm.category,
          wingId: programForm.wingId,
          wingName: finalWingName,
          targetClass: programForm.targetClass.trim(),
          date: programForm.date,
          academicYear,
          month,
          venue: programForm.venue.trim(),
          time: programForm.time,
          description: programForm.description.trim(),
          status: programForm.status as any,
        });
      }
      showToast(`Program "${programForm.title}" updated successfully.`);
    } else {
      // Add new program directly into database.programs
      await addProgram({
        title: programForm.title.trim(),
        category: programForm.category,
        wingId: programForm.wingId,
        wingName: finalWingName,
        targetClass: programForm.targetClass.trim(),
        date: programForm.date,
        academicYear,
        month,
        venue: programForm.venue.trim(),
        time: programForm.time || '10:00 AM',
        description: programForm.description.trim(),
        status: programForm.status as any,
        banner: '',
        tags: [finalWingName, programForm.category],
      });
      showToast(`New program "${programForm.title}" recorded for ${finalWingName}!`);
    }
    setIsModalOpen(false);
  };

  // Delete Program
  const handleDeleteProgram = (prog: ReportProgram) => {
    requestDelete({
      title: `Delete Program "${prog.title}"`,
      message: `Are you sure you want to permanently delete this program from ${prog.wingName} records? The Excel report will automatically update immediately.`,
      confirmLabel: 'Delete Program',
      onConfirm: async () => {
        if (prog.source === 'wingProgram') {
          await deleteWingProgram(prog.id);
        } else {
          await deleteProgram(prog.id);
        }
        showToast(`Program "${prog.title}" deleted. Excel Report updated.`);
      },
    });
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedWing('All');
    setSelectedYear('All');
    setSelectedMonth('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedWing !== 'All' ||
    selectedYear !== 'All' ||
    selectedMonth !== 'All' ||
    selectedCategory !== 'All' ||
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
              <span>LIVE REPORTING & EXCEL LEDGER SYSTEM</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight flex items-center gap-3">
              <span>REPORT: Wings & Core Committee Ledger</span>
            </h1>

            <p className="text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Official centralized report generator for ANJUMAN-E-HUDA. Compiles all uploaded programs across specialized Wings and Core Committee Year-Wise & Month-Wise. Any edit, addition, or deletion updates the Excel sheet automatically in real time.
            </p>
          </div>

          {/* Action Buttons: 1-Click Master Download & Program Uploads */}
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
              <span>+ Core Committee Program</span>
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

      {/* ================= KPI STATS CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl">
          <span className="text-[11px] font-mono text-stone-400 block mb-1">TOTAL CONDUCTED</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats.total}</span>
            <span className="text-[10px] text-emerald-400 font-mono">Programs</span>
          </div>
        </div>

        <div className="p-4 bg-stone-900 border border-amber-500/30 rounded-2xl bg-amber-950/10">
          <span className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1 mb-1">
            <Crown className="w-3 h-3 text-amber-400" />
            CORE COMMITTEE
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300">{stats.coreCount}</span>
            <span className="text-[10px] text-amber-400/70 font-mono">Apex Events</span>
          </div>
        </div>

        <div className="p-4 bg-stone-900 border border-emerald-500/30 rounded-2xl bg-emerald-950/10">
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mb-1">
            <Layers className="w-3 h-3 text-emerald-400" />
            WINGS PROGRAMS
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-300">{stats.wingsCount}</span>
            <span className="text-[10px] text-emerald-400/70 font-mono">Wings</span>
          </div>
        </div>

        <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl">
          <span className="text-[11px] font-mono text-stone-400 block mb-1">CURRENT 2026-27</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-400">{stats.currentYearCount}</span>
            <span className="text-[10px] text-stone-400 font-mono">This Session</span>
          </div>
        </div>

        <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl">
          <span className="text-[11px] font-mono text-stone-400 block mb-1">COMPLETED</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-green-400">{stats.completedCount}</span>
            <span className="text-[10px] text-stone-400 font-mono">Archived</span>
          </div>
        </div>

        <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl">
          <span className="text-[11px] font-mono text-stone-400 block mb-1">UPCOMING / LIVE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400">{stats.upcomingCount}</span>
            <span className="text-[10px] text-cyan-400/70 font-mono">Scheduled</span>
          </div>
        </div>
      </div>

      {/* ================= YEAR-WISE & MONTH-WISE MATRIX ================= */}
      <div className="p-5 bg-stone-900/90 border border-stone-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Year-Wise & Month-Wise Program Distribution
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              {allPrograms.length} {allPrograms.length === 1 ? 'Program' : 'Programs'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowMatrix(!showMatrix)}
            className="text-xs text-stone-400 hover:text-stone-200 cursor-pointer font-medium"
          >
            {showMatrix ? 'Collapse Matrix' : 'Expand Matrix'}
          </button>
        </div>

        {showMatrix && (
          <div className="overflow-x-auto pt-1">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/60 text-stone-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3 text-left">Academic Year</th>
                  {ALL_MONTHS.map((m) => (
                    <th key={`matrix-hdr-${m}`} className="py-2.5 px-2">
                      {m.slice(0, 3)}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-emerald-400 font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-mono">
                {distinctYears.map((year) => {
                  let rowTotal = 0;
                  return (
                    <tr key={`matrix-row-${year}`} className="hover:bg-stone-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-left font-bold text-amber-300">
                        {year}
                      </td>
                      {ALL_MONTHS.map((month) => {
                        const count = yearMonthSummary.get(year)?.[month] || 0;
                        rowTotal += count;
                        const isSelected = selectedYear === year && selectedMonth === month;
                        return (
                          <td
                            key={`matrix-cell-${year}-${month}`}
                            onClick={() => {
                              if (count > 0) {
                                setSelectedYear(year);
                                setSelectedMonth(month);
                              }
                            }}
                            className={`py-2 px-1 transition-all ${
                              count > 0
                                ? 'text-white font-bold cursor-pointer hover:bg-emerald-950/60'
                                : 'text-stone-600'
                            } ${isSelected ? 'bg-emerald-600 text-white rounded' : ''}`}
                            title={`${month} ${year}: ${count} programs`}
                          >
                            {count > 0 ? (
                              <span className="px-1.5 py-0.5 rounded-md bg-stone-800/80 border border-stone-700/60 inline-block min-w-[20px]">
                                {count}
                              </span>
                            ) : (
                              '–'
                            )}
                          </td>
                        );
                      })}
                      <td className="py-2.5 px-3 font-bold text-emerald-400 bg-stone-950/40">
                        {rowTotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= FILTER TOOLBAR ================= */}
      <div className="p-4 bg-stone-900 border border-stone-800 rounded-3xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by program title, category, venue, wing name, description..."
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
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
              className="px-3.5 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors self-start md:self-auto shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1 text-xs">
          {/* 1. Wing Filter */}
          <div>
            <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
              Filter by Sector / Wing
            </label>
            <select
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Sectors & Wings ({allPrograms.length})</option>
              <option value="core-committee">
                👑 Core Committee ({allPrograms.filter((p) => p.wingId === 'core-committee').length})
              </option>
              {database.wings
                .filter((w) => w.id !== 'core-committee')
                .map((w) => {
                  const count = allPrograms.filter((p) => p.wingId === w.id || p.wingName === w.name).length;
                  return (
                    <option key={`wing-opt-${w.id}`} value={w.id}>
                      {w.name} ({count})
                    </option>
                  );
                })}
            </select>
          </div>

          {/* 2. Academic Year Filter */}
          <div>
            <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Years</option>
              {distinctYears.map((y) => (
                <option key={`year-opt-${y}`} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Month Filter */}
          <div>
            <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
              Month Conducted
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Months</option>
              {ALL_MONTHS.map((m) => (
                <option key={`month-opt-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Category Filter */}
          <div>
            <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {PROGRAM_CATEGORIES.map((cat) => (
                <option key={`cat-opt-${cat}`} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Status Filter */}
          <div>
            <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Live">Live</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= MAIN REPORT TABLE ================= */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Table Header Bar */}
        <div className="p-4 bg-stone-950/60 border-b border-stone-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Archived Program Ledger</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-xs font-mono font-semibold">
              {filteredPrograms.length} {filteredPrograms.length === 1 ? 'Program' : 'Programs'}
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
                  <th className="py-3 px-3.5">Category</th>
                  <th className="py-3 px-3.5">Target Class / Audience</th>
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
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        {isCore ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[11px]">
                            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            Core Committee
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 text-[11px] font-medium">
                            <Layers className="w-3 h-3 text-emerald-400 shrink-0" />
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

                      {/* Category */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-emerald-400 text-[11px] font-mono font-medium">
                          {prog.category || 'General'}
                        </span>
                      </td>

                      {/* Target Class / Audience */}
                      <td className="py-3 px-3.5">
                        <span className="text-stone-300 text-[11px]">
                          {prog.targetClass || 'Campus Wide'}
                        </span>
                      </td>

                      {/* Academic Year */}
                      <td className="py-3 px-3.5 font-mono text-[11px] text-amber-400/90 font-semibold whitespace-nowrap">
                        {prog.academicYear || '2026-27'}
                      </td>

                      {/* Month & Date */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="text-[11px] text-stone-300 font-medium">
                          {prog.month || 'Scheduled'}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                          {prog.date}
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="py-3 px-3.5 text-[11px] text-stone-400 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                          <span className="truncate max-w-[130px]">{prog.venue || 'Darul Huda'}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        {prog.status === 'Completed' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                            Completed
                          </span>
                        ) : prog.status === 'Upcoming' ? (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono font-bold">
                            Upcoming
                          </span>
                        ) : prog.status === 'Live' ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-mono font-bold animate-pulse">
                            Live
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
                            title="Edit Program Details"
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
        <div className="px-5 py-3 bg-stone-950/60 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400 flex-wrap gap-2">
          <span>
            Excel reports are automatically generated from active real database records. Any addition, edit, or deletion is instantly updated.
          </span>
          <span className="font-mono text-emerald-400 font-semibold">
            Format: .xlsx (Multi-Sheet by Wings & Core Committee)
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
                  Sector / Wing Assignment <span className="text-emerald-400">*</span>
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
                  <option value="core-committee">👑 Core Committee (Apex Council)</option>
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
                  Program Name / Title <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  placeholder="e.g. All Kerala Quiz Contest, Annual Symposium, Fiqh Seminar..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Category <span className="text-emerald-400">*</span>
                </label>
                <select
                  value={programForm.category}
                  onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {PROGRAM_CATEGORIES.map((cat) => (
                    <option key={`modal-cat-${cat}`} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Class / Audience */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Target Class / Audience
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
                    <option value="Custom">Custom Audience / Class...</option>
                  </select>

                  {!TARGET_CLASS_PRESETS.includes(programForm.targetClass) && (
                    <input
                      type="text"
                      value={programForm.targetClass}
                      onChange={(e) => setProgramForm({ ...programForm, targetClass: e.target.value })}
                      placeholder="Specify custom audience or target class..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>
              </div>

              {/* Academic Year & Month */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Academic Year <span className="text-emerald-400">*</span>
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
                    Month <span className="text-emerald-400">*</span>
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

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Date Conducted <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={programForm.date}
                    onChange={(e) => {
                      const d = e.target.value;
                      let autoMonth = programForm.month;
                      let autoYear = programForm.academicYear;
                      if (d) {
                        try {
                          const dateObj = new Date(d);
                          if (!isNaN(dateObj.getTime())) {
                            autoMonth = dateObj.toLocaleString('en-US', { month: 'long' });
                            const yr = dateObj.getFullYear();
                            const m = dateObj.getMonth() + 1;
                            autoYear = m >= 5 ? `${yr}-${String(yr + 1).slice(-2)}` : `${yr - 1}-${String(yr).slice(-2)}`;
                          }
                        } catch {}
                      }
                      setProgramForm({
                        ...programForm,
                        date: d,
                        month: autoMonth,
                        academicYear: autoYear,
                      });
                    }}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={programForm.time}
                    onChange={(e) => setProgramForm({ ...programForm, time: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Venue & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={programForm.venue}
                    onChange={(e) => setProgramForm({ ...programForm, venue: e.target.value })}
                    placeholder="e.g. Darul Hikma, ONLINE"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Status</label>
                  <select
                    value={programForm.status}
                    onChange={(e) => setProgramForm({ ...programForm, status: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Description / Conducted Notes
                </label>
                <textarea
                  rows={3}
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  placeholder="Record summary, key speakers, topics covered, or milestones..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {editingProgram ? 'Update Program Record' : 'Save & Add to Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
