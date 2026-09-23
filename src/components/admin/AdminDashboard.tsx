import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Leader,
  NIICSInCharge,
  Program,
  HighlightItem,
  Wing,
  Announcement,
  WingHistoryEntry,
  TopWingStanding,
  TopParticipant,
  CAUResolution,
  ContactSettings,
  StudentInquiry,
} from '../../types';
import { MediaUploadZone } from './MediaUploadZone';
import {
  LayoutDashboard,
  Home,
  Users,
  Layers,
  Sparkles,
  Trophy,
  Bell,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Tag,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Scale,
  Mail,
  FileText,
  CheckCircle,
  Phone,
  MessageSquare,
  Shield,
  Search,
  Crown,
  Building2,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'home'
  | 'about'
  | 'updates'
  | 'leadership'
  | 'participants'
  | 'programs'
  | 'rankings'
  | 'cau'
  | 'contact'
  | 'media';

export const AdminDashboard: React.FC = () => {
  const { adminUser, logout, setActiveView } = useAuth();
  const {
    database,
    updateHomepage,
    addLeader,
    updateLeader,
    deleteLeader,
    addNIICSInCharge,
    updateNIICSInCharge,
    deleteNIICSInCharge,
    addProgram,
    updateProgram,
    deleteProgram,
    addHighlight,
    updateHighlight,
    deleteHighlight,
    addWing,
    updateWing,
    deleteWing,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    updateAchievements,
    updateCAU,
    addCAUResolution,
    updateCAUResolution,
    deleteCAUResolution,
    updateRankings,
    addTopWing,
    updateTopWing,
    deleteTopWing,
    addTopParticipant,
    updateTopParticipant,
    deleteTopParticipant,
    updateContactSettings,
    deleteInquiry,
    updateInquiryStatus,
    resetToDefaultSeed,
  } = useData();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [leadershipSubTab, setLeadershipSubTab] = useState<'cabinet' | 'niics'>('cabinet');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ================= 1. HOME TAB FORM STATE =================
  const [hpForm, setHpForm] = useState(database.homepage);
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHomepage(hpForm);
    showToast('Homepage hero content and imagery saved successfully.');
  };

  // ================= 2. ABOUT TAB FORM STATE =================
  const [aboutForm, setAboutForm] = useState({
    aboutText: database.homepage.aboutText || '',
    vision: database.homepage.vision || '',
    mission: database.homepage.mission || '',
  });

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHomepage({
      aboutText: aboutForm.aboutText,
      vision: aboutForm.vision,
      mission: aboutForm.mission,
    });
    showToast('About narrative, Vision 2030, and Mission saved.');
  };

  // ================= 3. UPDATES (ANNOUNCEMENTS) STATE & MODALS =================
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [annForm, setAnnForm] = useState({
    title: '',
    category: 'Circular' as Announcement['category'],
    date: new Date().toISOString().split('T')[0],
    summary: '',
    isPinned: false,
    urgency: 'normal' as Announcement['urgency'],
  });

  const handleOpenAddAnn = () => {
    setEditingAnn(null);
    setAnnForm({
      title: '',
      category: 'Circular',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      isPinned: false,
      urgency: 'normal',
    });
    setIsAnnModalOpen(true);
  };

  const handleOpenEditAnn = (ann: Announcement) => {
    setEditingAnn(ann);
    setAnnForm({
      title: ann.title,
      category: ann.category,
      date: ann.date,
      summary: ann.summary,
      isPinned: !!ann.isPinned,
      urgency: ann.urgency || 'normal',
    });
    setIsAnnModalOpen(true);
  };

  const handleSaveAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnn) {
      await updateAnnouncement(editingAnn.id, annForm);
      showToast(`Announcement "${annForm.title}" updated.`);
    } else {
      await addAnnouncement(annForm);
      showToast(`New Circular "${annForm.title}" published.`);
    }
    setIsAnnModalOpen(false);
  };

  // ================= 4. LEADERSHIP MODAL & FORM STATE =================
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [leaderForm, setLeaderForm] = useState({
    name: '',
    role: 'President' as Leader['role'],
    tenure: '2026-27',
    photo: '',
    department: '',
    quote: '',
    email: '',
    phone: '',
  });

  const handleOpenAddLeader = () => {
    setEditingLeader(null);
    setLeaderForm({
      name: '',
      role: 'President',
      tenure: '2026-27',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      department: 'Department of Islamic Studies',
      quote: '',
      email: '',
      phone: '',
    });
    setIsLeaderModalOpen(true);
  };

  const handleOpenEditLeader = (ldr: Leader) => {
    setEditingLeader(ldr);
    setLeaderForm({
      name: ldr.name,
      role: ldr.role,
      tenure: ldr.tenure,
      photo: ldr.photo,
      department: ldr.department,
      quote: ldr.quote || '',
      email: ldr.email || '',
      phone: ldr.phone || '',
    });
    setIsLeaderModalOpen(true);
  };

  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLeader) {
      await updateLeader(editingLeader.id, leaderForm);
      showToast(`Leader "${leaderForm.name}" updated successfully.`);
    } else {
      await addLeader(leaderForm);
      showToast(`New Leader "${leaderForm.name}" appointed.`);
    }
    setIsLeaderModalOpen(false);
  };

  // ================= 4.2 NIICS IN-CHARGE MODAL & STATE =================
  const [editingNIICS, setEditingNIICS] = useState<NIICSInCharge | null>(null);
  const [isNIICSModalOpen, setIsNIICSModalOpen] = useState(false);
  const [niicsForm, setNIICSForm] = useState({
    name: '',
    designation: 'Central NIICS In-Charge & Off-Campus Director',
    tenure: '2026-27',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
    department: 'Central Directorate of Off-Campus Affairs & Academic Harmonization',
    jurisdiction: 'Supervisory Jurisdiction across all 6 Recognized Off-Campuses',
    campusesText:
      'DH NIICS Chemmad, DH NIICS Hangal, DH NIICS Punganur, DH NIICS Maharashtra, DH NIICS Assam, DH NIICS West Bengal',
    quote: '',
    email: '',
    phone: '',
    officeLocation: 'Directorate Wing, Central Secretariat Quadrangle, Gate 4',
  });

  const handleOpenAddNIICS = () => {
    setEditingNIICS(null);
    setNIICSForm({
      name: '',
      designation: 'Central NIICS In-Charge & Off-Campus Director',
      tenure: '2026-27',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
      department: 'Central Directorate of Off-Campus Affairs & Academic Harmonization',
      jurisdiction: 'Supervisory Jurisdiction across all 6 Recognized Off-Campuses',
      campusesText:
        'DH NIICS Chemmad, DH NIICS Hangal, DH NIICS Punganur, DH NIICS Maharashtra, DH NIICS Assam, DH NIICS West Bengal',
      quote: '',
      email: '',
      phone: '',
      officeLocation: 'Directorate Wing, Central Secretariat Quadrangle, Gate 4',
    });
    setIsNIICSModalOpen(true);
  };

  const handleOpenEditNIICS = (item: NIICSInCharge) => {
    setEditingNIICS(item);
    setNIICSForm({
      name: item.name,
      designation: item.designation,
      tenure: item.tenure,
      photo: item.photo,
      department: item.department,
      jurisdiction: item.jurisdiction || '',
      campusesText: item.campuses ? item.campuses.join(', ') : '',
      quote: item.quote || '',
      email: item.email || '',
      phone: item.phone || '',
      officeLocation: item.officeLocation || '',
    });
    setIsNIICSModalOpen(true);
  };

  const handleSaveNIICS = async (e: React.FormEvent) => {
    e.preventDefault();
    const campuses = niicsForm.campusesText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const payload = {
      name: niicsForm.name,
      designation: niicsForm.designation,
      tenure: niicsForm.tenure,
      photo: niicsForm.photo,
      department: niicsForm.department,
      jurisdiction: niicsForm.jurisdiction,
      campuses,
      quote: niicsForm.quote,
      email: niicsForm.email,
      phone: niicsForm.phone,
      officeLocation: niicsForm.officeLocation,
    };

    if (editingNIICS) {
      await updateNIICSInCharge(editingNIICS.id, payload);
      showToast(`NIICS In-Charge "${payload.name}" updated successfully.`);
    } else {
      await addNIICSInCharge(payload);
      showToast(`New NIICS In-Charge "${payload.name}" added successfully.`);
    }
    setIsNIICSModalOpen(false);
  };

  // ================= 5. PARTICIPANTS (WINGS) MODAL & STATE =================
  const [editingWing, setEditingWing] = useState<Wing | null>(null);
  const [isWingModalOpen, setIsWingModalOpen] = useState(false);
  const [isAddWingModalOpen, setIsAddWingModalOpen] = useState(false);

  const [newWingForm, setNewWingForm] = useState({
    name: '',
    shortName: '',
    description: '',
    iconName: 'BookOpen',
    status: 'Active' as Wing['status'],
    currentTenure: '2026-27',
    chairman: { name: '', phone: '', contact: '' },
    convener: { name: '', phone: '', contact: '' },
  });

  const handleOpenEditWing = (w: Wing) => {
    // Ensure chairman is set if only manager was present
    const initializedWing: Wing = {
      ...w,
      chairman: w.chairman || w.manager || { name: '', contact: '' },
      manager: w.manager || w.chairman || { name: '', contact: '' },
    };
    setEditingWing(initializedWing);
    setIsWingModalOpen(true);
  };

  const handleSaveNewWing = async (e: React.FormEvent) => {
    e.preventDefault();
    await addWing({
      ...newWingForm,
      manager: newWingForm.chairman,
      history: [],
    });
    showToast(`New Wing "${newWingForm.name}" created.`);
    setIsAddWingModalOpen(false);
    setNewWingForm({
      name: '',
      shortName: '',
      description: '',
      iconName: 'BookOpen',
      status: 'Active',
      currentTenure: '2026-27',
      chairman: { name: '', phone: '', contact: '' },
      convener: { name: '', phone: '', contact: '' },
    });
  };

  // Adding history tenure inside editing wing
  const [newHistoryEntry, setNewHistoryEntry] = useState<WingHistoryEntry>({
    tenure: '2025-26',
    chairman: '',
    convener: '',
  });

  const handleAddWingHistory = async () => {
    if (!editingWing) return;
    const entryToSave: WingHistoryEntry = {
      ...newHistoryEntry,
      manager: newHistoryEntry.chairman,
    };
    const updatedHistory = [...(editingWing.history || []), entryToSave];
    await updateWing(editingWing.id, { history: updatedHistory });
    setEditingWing({ ...editingWing, history: updatedHistory });
    showToast(`Tenure ${newHistoryEntry.tenure} added to ${editingWing.shortName} archives.`);
    setNewHistoryEntry({
      tenure: '2024-25',
      chairman: '',
      convener: '',
    });
  };

  // ================= 6. PROGRAMS MODAL & STATE =================
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [progForm, setProgForm] = useState({
    title: '',
    category: 'Academic' as Program['category'],
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    venue: 'Central Quadrangle, Main Campus',
    banner: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    description: '',
    tags: 'Colloquium, Students',
    status: 'Upcoming' as Program['status'],
  });

  const handleOpenAddProgram = () => {
    setEditingProgram(null);
    setProgForm({
      title: '',
      category: 'Academic',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      venue: 'Central Quadrangle, Main Campus',
      banner: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      description: '',
      tags: 'Symposium, Debate',
      status: 'Upcoming',
    });
    setIsProgramModalOpen(true);
  };

  const handleOpenEditProgram = (prog: Program) => {
    setEditingProgram(prog);
    setProgForm({
      title: prog.title,
      category: prog.category,
      date: prog.date,
      time: prog.time,
      venue: prog.venue,
      banner: prog.banner,
      description: prog.description,
      tags: prog.tags.join(', '),
      status: prog.status,
    });
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = progForm.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = {
      ...progForm,
      tags: tagArray,
    };

    if (editingProgram) {
      await updateProgram(editingProgram.id, payload);
      showToast(`Program "${progForm.title}" updated.`);
    } else {
      await addProgram(payload);
      showToast(`New Program "${progForm.title}" scheduled.`);
    }
    setIsProgramModalOpen(false);
  };

  // Highlights Photo Gallery state
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
  const [hlForm, setHlForm] = useState({
    title: '',
    category: 'Event' as HighlightItem['category'],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleSaveHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    await addHighlight({
      ...hlForm,
      tags: ['Gallery'],
    });
    showToast(`Highlight photo "${hlForm.title}" added to gallery.`);
    setIsHighlightModalOpen(false);
  };

  // ================= 7. RANKINGS MODAL & STATE =================
  const [isTopWingModalOpen, setIsTopWingModalOpen] = useState(false);
  const [topWingForm, setTopWingForm] = useState<TopWingStanding>({
    rank: 1,
    wingName: '',
    points: 500,
    badge: 'Championship Contender',
  });

  const [isTopParticipantModalOpen, setIsTopParticipantModalOpen] = useState(false);
  const [topPartForm, setTopPartForm] = useState<TopParticipant>({
    rank: 1,
    name: '',
    department: '',
    points: 300,
    eventsWon: 2,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  });

  const handleSaveTopWing = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTopWing(topWingForm);
    showToast(`Wing "${topWingForm.wingName}" added to leaderboard.`);
    setIsTopWingModalOpen(false);
  };

  const handleSaveTopParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTopParticipant(topPartForm);
    showToast(`Participant "${topPartForm.name}" added to Scholastic Laureates.`);
    setIsTopParticipantModalOpen(false);
  };

  // Achievements metrics
  const [achForm, setAchForm] = useState(database.achievements);
  const handleSaveAchievements = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAchievements(achForm);
    showToast('Achievements statistics updated.');
  };

  // ================= 8. CAU MODAL & STATE =================
  const [cauForm, setCauForm] = useState({
    constitutionSummary: database.cau?.constitutionSummary || '',
    councilMembersCount: database.cau?.councilMembersCount || 24,
    sessionTerm: database.cau?.sessionTerm || 'Session 2026–27',
  });

  const handleSaveCAUCharter = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCAU(cauForm);
    showToast('CAU Parliamentary Constitution and Session updated.');
  };

  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [resForm, setResForm] = useState({
    title: '',
    fileNumber: 'CAU-RES-2026/01',
    date: new Date().toISOString().split('T')[0],
    status: 'Adopted' as CAUResolution['status'],
  });

  const handleSaveResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCAUResolution(resForm);
    showToast(`Resolution "${resForm.fileNumber}" gazetted.`);
    setIsResolutionModalOpen(false);
  };

  // ================= 9. CONTACT MODAL & STATE =================
  const [contactForm, setContactForm] = useState<ContactSettings>(
    database.contactSettings || {
      campusAddress: 'Student Activity Quadrangle, Main Campus, Gate 4',
      officialEmail: 'secretariat@anjumanehuda.org',
      helplinePhone: '+91 98765 43210',
      secondaryPhone: '+91 98765 43211',
      officeHours: 'Monday – Saturday: 08:30 AM – 06:00 PM',
      emergencyDesk: 'Active',
    }
  );

  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateContactSettings(contactForm);
    showToast('Central Secretariat contact settings updated.');
  };

  // Admin Navigation Menu Items - EXACT 1:1 Match with the user requested layout
  const navMenuItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'home' as AdminTab, label: 'Home', icon: Home },
    { id: 'about' as AdminTab, label: 'About', icon: BookOpen },
    { id: 'updates' as AdminTab, label: 'Updates', icon: Bell },
    { id: 'leadership' as AdminTab, label: 'Leadership', icon: Users },
    { id: 'participants' as AdminTab, label: 'Wings', icon: Layers },
    { id: 'programs' as AdminTab, label: 'Programs', icon: Calendar },
    { id: 'rankings' as AdminTab, label: 'Rankings', icon: Trophy },
    { id: 'cau' as AdminTab, label: 'CAU', icon: Scale },
    { id: 'contact' as AdminTab, label: 'Contact', icon: Mail },
    { id: 'media' as AdminTab, label: 'Media Library', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="h-16 bg-stone-900 border-b border-stone-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-stone-300 p-0.5 shadow flex items-center justify-center overflow-hidden">
            <img
              src="https://i.postimg.cc/ZKC5Cf1Z/image.png"
              alt="ANJUMAN-E-HUDA Official Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              ANJUMAN-E-HUDA Admin Suite
            </h1>
            <p className="text-[10px] text-emerald-400 font-mono">
              Central Union Executive Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('site')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/80 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Main Panels */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Dedicated Admin Sidebar */}
        <aside className="w-full md:w-64 bg-stone-900/95 border-r border-stone-800 p-4 space-y-1 shrink-0">
          <div className="px-3 py-2 text-[10px] font-mono uppercase text-stone-400 tracking-wider">
            EXECUTIVE SECTORS
          </div>

          {navMenuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={`admin-nav-${item.id}-${idx}`}
                id={`admin-menu-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-6 mt-6 border-t border-stone-800/80 px-2 space-y-3 text-xs text-stone-400">
            <div>
              <span className="text-[10px] text-stone-500 font-mono block">DATABASE STATUS</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-xs mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Persistent JSON DB Connected
              </span>
            </div>

            <button
              onClick={async () => {
                if (confirm('Reset all content back to factory default seed data?')) {
                  await resetToDefaultSeed();
                  showToast('Database reset to initial sample records.');
                }
              }}
              className="text-[11px] text-stone-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Seed Data
            </button>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-stone-950">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-900 border border-emerald-500 rounded-xl shadow-2xl text-white text-xs font-semibold flex items-center gap-2 animate-slideUp">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ================= TAB 0: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-2xl font-bold font-heading text-white">Central Admin Overview</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Welcome back, <strong className="text-emerald-400">{adminUser?.username}</strong>. Full
                  management control over ANJUMAN-E-HUDA multi-page sectors.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('leadership')}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 transition-colors cursor-pointer"
                >
                  <span className="text-xs text-stone-400 font-medium">Executive Leaders</span>
                  <p className="text-2xl font-bold font-heading text-white mt-1">
                    {database.leaders.length}
                    <span className="text-xs text-amber-400 font-mono font-normal ml-2">
                      + {(database.niicsInCharge || []).length} NIICS
                    </span>
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab('programs')}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 transition-colors cursor-pointer"
                >
                  <span className="text-xs text-stone-400 font-medium">Scheduled Programs</span>
                  <p className="text-2xl font-bold font-heading text-white mt-1">
                    {database.programs.length}
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab('participants')}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 transition-colors cursor-pointer"
                >
                  <span className="text-xs text-stone-400 font-medium">Specialized Wings</span>
                  <p className="text-2xl font-bold font-heading text-white mt-1">
                    {database.wings.length}
                  </p>
                </div>
                <div
                  onClick={() => setActiveTab('updates')}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 transition-colors cursor-pointer"
                >
                  <span className="text-xs text-stone-400 font-medium">Dispatches & Circulars</span>
                  <p className="text-2xl font-bold font-heading text-white mt-1">
                    {database.announcements.length}
                  </p>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Direct Section Shortcuts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleOpenAddProgram}
                    className="p-3.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold text-stone-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Post New Program</span>
                  </button>
                  <button
                    onClick={handleOpenAddLeader}
                    className="p-3.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold text-stone-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Appoint Leader</span>
                  </button>
                  <button
                    onClick={handleOpenAddAnn}
                    className="p-3.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl text-xs font-semibold text-stone-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-sky-400" />
                    <span>Issue Circular / Notice</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 1: HOME ================= */}
          {activeTab === 'home' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Manage Home Section</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Upload hero background banner, customize bold title, subtitle, badge, and call-to-actions.
                </p>
              </div>

              <form onSubmit={handleSaveHomepage} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Hero Section Bold Title
                  </label>
                  <input
                    type="text"
                    required
                    value={hpForm.heroTitle}
                    onChange={(e) => setHpForm({ ...hpForm, heroTitle: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Hero Subtitle & Motto
                  </label>
                  <textarea
                    rows={3}
                    value={hpForm.heroSubtitle}
                    onChange={(e) => setHpForm({ ...hpForm, heroSubtitle: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Hero Badge Label
                    </label>
                    <input
                      type="text"
                      value={hpForm.heroBadge}
                      onChange={(e) => setHpForm({ ...hpForm, heroBadge: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Hero Background Image URL
                    </label>
                    <input
                      type="text"
                      value={hpForm.heroBgUrl}
                      onChange={(e) => setHpForm({ ...hpForm, heroBgUrl: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Drag and Drop Image Upload Zone for Hero */}
                <MediaUploadZone
                  label="Upload New Hero Background Banner"
                  currentUrl={hpForm.heroBgUrl}
                  onUploadSuccess={(url) => setHpForm({ ...hpForm, heroBgUrl: url })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-800">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      CTA Button 1 Label
                    </label>
                    <input
                      type="text"
                      value={hpForm.ctaMissionLabel || 'Discover Mission'}
                      onChange={(e) => setHpForm({ ...hpForm, ctaMissionLabel: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      CTA Button 2 Label
                    </label>
                    <input
                      type="text"
                      value={hpForm.ctaProgramsLabel || 'Recent Programs'}
                      onChange={(e) => setHpForm({ ...hpForm, ctaProgramsLabel: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Home Settings</span>
                </button>
              </form>
            </div>
          )}

          {/* ================= TAB 2: ABOUT ================= */}
          {activeTab === 'about' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Manage About Section</h2>
                <p className="text-xs text-stone-400 mt-1">
                  Maintain Union Mission, Core Vision, Mandate, and Foundational Pillars.
                </p>
              </div>

              <form onSubmit={handleSaveAbout} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    About ANJUMAN-E-HUDA Overview
                  </label>
                  <textarea
                    rows={4}
                    value={aboutForm.aboutText}
                    onChange={(e) => setAboutForm({ ...aboutForm, aboutText: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Core Vision 2030</label>
                    <textarea
                      rows={3}
                      value={aboutForm.vision}
                      onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Mandated Mission</label>
                    <textarea
                      rows={3}
                      value={aboutForm.mission}
                      onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save About Content</span>
                </button>
              </form>

              {/* Foundational Pillars Display */}
              <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  The 4 Pillars of the Union (Ta'lim, Tarbiyah, Khidmah, Ittihad)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "Ta'lim", en: 'Illuminated Education', desc: 'Rigor in modern disciplines and scholastic literacy.' },
                    { name: 'Tarbiyah', en: 'Character Stewardship', desc: 'Moral discipline, ethics, and empathetic consciousness.' },
                    { name: 'Khidmah', en: 'Public Service', desc: 'Welfare drives, student aid, and altruistic relief.' },
                    { name: 'Ittihad', en: 'Harmonious Unity', desc: 'Inter-departmental camaraderie, fraternity, and peace.' },
                  ].map((p, idx) => (
                    <div key={`about-p-${idx}`} className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs">
                      <div className="flex items-center justify-between text-emerald-400 font-bold font-heading mb-1">
                        <span>{p.name}</span>
                        <span className="text-stone-400 text-[10px] font-mono">{p.en}</span>
                      </div>
                      <p className="text-stone-300">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: UPDATES ================= */}
          {activeTab === 'updates' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-heading text-white">Manage Updates & Circulars</h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Issue circulars, gazettes, notices, and competition results.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddAnn}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Issue New Circular</span>
                </button>
              </div>

              <div className="space-y-3">
                {database.announcements.map((ann, idx) => (
                  <div
                    key={`admin-ann-${ann.id}-${idx}`}
                    className="p-4 bg-stone-900 border border-stone-800 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono mb-1">
                        <span className="px-2 py-0.5 rounded bg-stone-950 text-amber-400 border border-stone-800 font-semibold">
                          {ann.category}
                        </span>
                        <span className="text-stone-400">{ann.date}</span>
                        {ann.isPinned && (
                          <span className="text-red-400 font-bold uppercase tracking-wider">PINNED</span>
                        )}
                        <span className="text-stone-500 uppercase">Urgency: {ann.urgency || 'Normal'}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                      <p className="text-xs text-stone-400 line-clamp-1">{ann.summary}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditAnn(ann)}
                        className="p-2 text-stone-400 hover:text-emerald-400 rounded-lg hover:bg-stone-800 cursor-pointer"
                        title="Edit Circular"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Remove announcement "${ann.title}"?`)) {
                            await deleteAnnouncement(ann.id);
                            showToast('Announcement removed.');
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-red-400 rounded-lg hover:bg-stone-800 cursor-pointer"
                        title="Delete Circular"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: LEADERSHIP ================= */}
          {activeTab === 'leadership' && (
            <div className="space-y-8 max-w-6xl">
              {/* Top Sub-Header & Sub-Column Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-900 border border-stone-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold uppercase">
                      Leadership Directorate
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    Leadership & Off-Campus Governance
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Manage Central Cabinet leaders and the dedicated NIICS In-Charge supervisory role.
                  </p>
                </div>

                {/* Sub-Column Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setLeadershipSubTab('cabinet')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                      leadershipSubTab === 'cabinet'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Central Cabinet ({database.leaders.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadershipSubTab('niics')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                      leadershipSubTab === 'niics'
                        ? 'bg-amber-500 text-stone-950 font-bold shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 text-stone-950" />
                    <span>NIICS In-Charge ({(database.niicsInCharge || []).length})</span>
                  </button>
                </div>
              </div>

              {/* ================= COLUMN 1: CENTRAL CABINET LEADERS ================= */}
              {(leadershipSubTab === 'cabinet') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>Central Cabinet Members</span>
                      </h3>
                      <p className="text-xs text-stone-400">
                        President, General Secretary, Treasurer, and Vice President office-bearers.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddLeader}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Cabinet Leader</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {database.leaders.map((leader, idx) => (
                      <div
                        key={`admin-ldr-${leader.id}-${idx}`}
                        className="p-4 bg-stone-900 border border-stone-800 rounded-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={leader.photo}
                              alt={leader.name}
                              className="w-14 h-14 rounded-lg object-cover border border-stone-700 shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                {leader.role}
                              </span>
                              <h4 className="text-sm font-bold text-white mt-1">{leader.name}</h4>
                              <span className="text-xs text-amber-400 font-mono">Tenure: {leader.tenure}</span>
                            </div>
                          </div>
                          <p className="text-xs text-stone-400 line-clamp-2">{leader.department}</p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-stone-800 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditLeader(leader)}
                            className="p-1.5 text-stone-300 hover:text-emerald-400 rounded hover:bg-stone-800 cursor-pointer"
                            title="Edit Leader"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Remove leader "${leader.name}"?`)) {
                                await deleteLeader(leader.id);
                                showToast(`Leader "${leader.name}" deleted.`);
                              }
                            }}
                            className="p-1.5 text-stone-300 hover:text-red-400 rounded hover:bg-stone-800 cursor-pointer"
                            title="Delete Leader"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= COLUMN 2: NIICS IN-CHARGE SECTION ================= */}
              {(leadershipSubTab === 'niics') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>NIICS In-Charge Directorate (Off-Campus Supervisors)</span>
                      </h3>
                      <p className="text-xs text-stone-400">
                        Supervising authority for all 6 Off-Campuses: Chemmad, Hangal, Punganur, Maharashtra, Assam, West Bengal.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddNIICS}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add NIICS In-Charge</span>
                    </button>
                  </div>

                  {(!database.niicsInCharge || database.niicsInCharge.length === 0) ? (
                    <div className="p-8 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-3">
                      <Crown className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
                      <p className="text-sm text-stone-300">No NIICS In-Charge records found.</p>
                      <button
                        onClick={handleOpenAddNIICS}
                        className="px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Add Central NIICS In-Charge
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {database.niicsInCharge.map((item, idx) => (
                        <div
                          key={`admin-niics-${item.id}-${idx}`}
                          className="p-6 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/20 border-2 border-amber-500/40 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start"
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                            <img
                              src={item.photo}
                              alt={item.name}
                              className="w-24 h-28 rounded-xl object-cover border-2 border-amber-500/40 shadow-lg shrink-0"
                            />
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                                  {item.designation}
                                </span>
                                <span className="text-xs font-mono text-stone-400">
                                  Tenure: <strong className="text-white">{item.tenure}</strong>
                                </span>
                              </div>

                              <h4 className="text-lg font-bold text-white font-heading">{item.name}</h4>
                              <p className="text-xs text-stone-300 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{item.department}</span>
                              </p>

                              {/* Supervised Campuses */}
                              <div className="pt-2">
                                <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">
                                  Supervised Off-Campuses ({item.campuses?.length || 6}):
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {(item.campuses || [
                                    'DH NIICS Chemmad',
                                    'DH NIICS Hangal',
                                    'DH NIICS Punganur',
                                    'DH NIICS Maharashtra',
                                    'DH NIICS Assam',
                                    'DH NIICS West Bengal',
                                  ]).map((c, cIdx) => (
                                    <span
                                      key={`admin-camp-${cIdx}`}
                                      className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-[11px] text-stone-300"
                                    >
                                      • {c}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {item.quote && (
                                <p className="text-xs italic text-stone-300 font-serif border-l-2 border-amber-400 pl-3 py-0.5 mt-2">
                                  "{item.quote}"
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-1">
                                {item.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                    {item.email}
                                  </span>
                                )}
                                {item.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                                    {item.phone}
                                  </span>
                                )}
                                {item.officeLocation && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                                    {item.officeLocation}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end md:self-start pt-2 md:pt-0">
                            <button
                              onClick={() => handleOpenEditNIICS(item)}
                              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-stone-700"
                              title="Edit NIICS In-Charge"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Remove NIICS In-Charge "${item.name}"?`)) {
                                  await deleteNIICSInCharge(item.id);
                                  showToast(`NIICS In-Charge "${item.name}" deleted.`);
                                }
                              }}
                              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-red-800/60"
                              title="Delete NIICS In-Charge"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: PARTICIPANTS (WINGS) ================= */}
          {activeTab === 'participants' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-heading text-white">Manage Specialized Wings</h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Maintain the specialized student wings, designated Chairmen, Conveners, and historical archives.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddWingModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Wing</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {database.wings.map((wing, idx) => (
                  <div
                    key={`admin-wing-${wing.id}-${idx}`}
                    className="p-5 bg-stone-900 border border-stone-800 rounded-2xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                          {wing.status} • {wing.currentTenure}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {wing.history?.length || 0} historical archives
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">{wing.name}</h4>
                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                        {wing.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                        <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-0.5">CHAIRMAN</span>
                          <span className="font-semibold text-white truncate block">
                            {wing.chairman?.name || wing.manager?.name || 'Not assigned'}
                          </span>
                        </div>
                        <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                          <span className="text-[10px] font-mono text-amber-400 font-bold block mb-0.5">CONVENER</span>
                          <span className="font-semibold text-white truncate block">{wing.convener.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                      <button
                        onClick={async () => {
                          if (confirm(`Delete wing "${wing.name}"?`)) {
                            await deleteWing(wing.id);
                            showToast(`Wing "${wing.name}" deleted.`);
                          }
                        }}
                        className="text-stone-400 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>

                      <button
                        onClick={() => handleOpenEditWing(wing)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Wing & History</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 6: PROGRAMS ================= */}
          {activeTab === 'programs' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-heading text-white">Manage All Programs & Gallery</h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Schedule colloquiums, symposiums, dates, venues, and highlights photo gallery.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsHighlightModalOpen(true)}
                    className="px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Add Highlight Photo</span>
                  </button>
                  <button
                    onClick={handleOpenAddProgram}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post New Program</span>
                  </button>
                </div>
              </div>

              {/* Programs List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {database.programs.map((prog, idx) => (
                  <div
                    key={`admin-prog-${prog.id}-${idx}`}
                    className="p-4 bg-stone-900 border border-stone-800 rounded-xl flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <img
                        src={prog.banner}
                        alt={prog.title}
                        className="w-full h-36 object-cover rounded-lg mb-3"
                      />
                      <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400 mb-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {prog.category}
                        </span>
                        <span>{prog.date}</span>
                        <span>• {prog.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{prog.title}</h4>
                      <p className="text-xs text-stone-400 line-clamp-2 mt-1">{prog.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                      <span className="text-stone-400 truncate max-w-[200px]">📍 {prog.venue}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditProgram(prog)}
                          className="p-1.5 text-stone-300 hover:text-emerald-400 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Delete program "${prog.title}"?`)) {
                              await deleteProgram(prog.id);
                              showToast('Program deleted.');
                            }
                          }}
                          className="p-1.5 text-stone-300 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlights Gallery Section */}
              <div className="pt-6 border-t border-stone-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-3">
                  Highlights Photo Gallery ({database.highlights.length} Photos)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {database.highlights.map((h, idx) => (
                    <div key={`admin-hl-${h.id}-${idx}`} className="p-2 bg-stone-900 rounded-xl border border-stone-800 relative group">
                      <img src={h.imageUrl} alt={h.title} className="w-full h-24 object-cover rounded-lg mb-1.5" />
                      <span className="text-[10px] text-stone-300 truncate block font-medium">{h.title}</span>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete highlight photo "${h.title}"?`)) {
                            await deleteHighlight(h.id);
                            showToast('Highlight photo removed.');
                          }
                        }}
                        className="absolute top-3 right-3 p-1 rounded bg-black/80 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 7: RANKINGS ================= */}
          {activeTab === 'rankings' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Manage Rankings & Merit Points</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Update Inter-Wing standings, Scholastic Laureates, and headline statistical metrics.
                </p>
              </div>

              {/* Sector A: Top Wings Championship */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Inter-Wing Points Table ({database.rankings.topWings.length} Wings)
                  </h3>
                  <button
                    onClick={() => setIsTopWingModalOpen(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Wing Standing
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
                      <tr>
                        <th className="py-2.5 px-3">Rank</th>
                        <th className="py-2.5 px-3">Wing Name</th>
                        <th className="py-2.5 px-3">Points</th>
                        <th className="py-2.5 px-3">Badge</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {database.rankings.topWings.map((w, idx) => (
                        <tr key={`tw-${w.wingName}-${idx}`} className="hover:bg-stone-950/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-400">#{w.rank}</td>
                          <td className="py-2.5 px-3 font-semibold text-white">{w.wingName}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{w.points} pts</td>
                          <td className="py-2.5 px-3 text-stone-400">{w.badge}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={async () => {
                                if (confirm(`Remove wing "${w.wingName}" from rankings?`)) {
                                  await deleteTopWing(w.wingName);
                                  showToast('Wing removed from standings.');
                                }
                              }}
                              className="text-stone-400 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sector B: Scholastic Laureates */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Scholastic Laureates ({database.rankings.topParticipants.length} Scholars)
                  </h3>
                  <button
                    onClick={() => setIsTopParticipantModalOpen(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Participant
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {database.rankings.topParticipants.map((p, idx) => (
                    <div key={`admin-part-${p.name}-${idx}`} className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-stone-700" />
                        <div>
                          <span className="text-[10px] font-mono text-amber-400">Rank #{p.rank}</span>
                          <h4 className="text-xs font-bold text-white">{p.name}</h4>
                          <span className="text-[10px] text-emerald-400 font-mono">{p.points} pts • {p.eventsWon} wins</span>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (confirm(`Remove participant "${p.name}"?`)) {
                            await deleteTopParticipant(p.name);
                            showToast('Participant removed.');
                          }
                        }}
                        className="text-stone-400 hover:text-red-400 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sector C: Union Statistical Metrics */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Union Statistical Achievements
                </h3>
                <form onSubmit={handleSaveAchievements} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Total Achievements</label>
                    <input
                      type="number"
                      value={achForm.totalAchievements}
                      onChange={(e) => setAchForm({ ...achForm, totalAchievements: parseInt(e.target.value) || 0 })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Outreach Drives</label>
                    <input
                      type="number"
                      value={achForm.totalOutreachInitiatives}
                      onChange={(e) => setAchForm({ ...achForm, totalOutreachInitiatives: parseInt(e.target.value) || 0 })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Events Organized</label>
                    <input
                      type="number"
                      value={achForm.eventsOrganized}
                      onChange={(e) => setAchForm({ ...achForm, eventsOrganized: parseInt(e.target.value) || 0 })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Active Scholars</label>
                    <input
                      type="number"
                      value={achForm.activeMembers}
                      onChange={(e) => setAchForm({ ...achForm, activeMembers: parseInt(e.target.value) || 0 })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-4 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Update Metrics
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 8: CAU ================= */}
          {activeTab === 'cau' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Central Academic Union (CAU)</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Maintain Senate Constitution, active session term, and gazette official resolutions.
                </p>
              </div>

              {/* Charter Form */}
              <form onSubmit={handleSaveCAUCharter} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Senate Charter & Assembly Session
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">Active Assembly Session</label>
                    <input
                      type="text"
                      value={cauForm.sessionTerm}
                      onChange={(e) => setCauForm({ ...cauForm, sessionTerm: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">Council Senators Count</label>
                    <input
                      type="number"
                      value={cauForm.councilMembersCount}
                      onChange={(e) => setCauForm({ ...cauForm, councilMembersCount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Constitution Summary</label>
                  <textarea
                    rows={3}
                    value={cauForm.constitutionSummary}
                    onChange={(e) => setCauForm({ ...cauForm, constitutionSummary: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Senate Charter
                </button>
              </form>

              {/* Resolutions List */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Adopted Resolutions & Bills ({database.cau?.latestResolutions?.length || 0})
                  </h3>
                  <button
                    onClick={() => setIsResolutionModalOpen(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Gazette New Resolution
                  </button>
                </div>

                <div className="space-y-3">
                  {database.cau?.latestResolutions?.map((res, idx) => (
                    <div key={`cau-res-${res.id}-${idx}`} className="p-4 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono mb-1">
                          <span className="text-emerald-400 font-bold">{res.fileNumber}</span>
                          <span className="text-stone-400">{res.date}</span>
                          <span className="px-2 py-0.5 rounded bg-stone-900 text-amber-400 border border-stone-800">
                            {res.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{res.title}</h4>
                      </div>

                      <button
                        onClick={async () => {
                          if (confirm(`Remove resolution "${res.fileNumber}"?`)) {
                            await deleteCAUResolution(res.id);
                            showToast('Resolution removed.');
                          }
                        }}
                        className="text-stone-400 hover:text-red-400 p-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 9: CONTACT ================= */}
          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Manage Contact & Grievances</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Update secretariat credentials and review student submitted inquiries and petitions.
                </p>
              </div>

              {/* Secretariat Settings Form */}
              <form onSubmit={handleSaveContactSettings} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Central Secretariat Office Credentials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={contactForm.officialEmail}
                      onChange={(e) => setContactForm({ ...contactForm, officialEmail: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">Helpline Phone</label>
                    <input
                      type="text"
                      value={contactForm.helplinePhone}
                      onChange={(e) => setContactForm({ ...contactForm, helplinePhone: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">Secondary Phone</label>
                    <input
                      type="text"
                      value={contactForm.secondaryPhone}
                      onChange={(e) => setContactForm({ ...contactForm, secondaryPhone: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">Office Hours</label>
                    <input
                      type="text"
                      value={contactForm.officeHours}
                      onChange={(e) => setContactForm({ ...contactForm, officeHours: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Campus Physical Address</label>
                  <textarea
                    rows={2}
                    value={contactForm.campusAddress}
                    onChange={(e) => setContactForm({ ...contactForm, campusAddress: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Secretariat Info
                </button>
              </form>

              {/* Student Inquiries / Grievances Inbox */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Incoming Student Petitions & Inquiries ({database.inquiries?.length || 0})
                  </h3>
                  <span className="text-xs text-emerald-400 font-mono">Live Sync</span>
                </div>

                <div className="space-y-3">
                  {(!database.inquiries || database.inquiries.length === 0) && (
                    <p className="text-xs text-stone-500 py-4 text-center">
                      No student petitions submitted yet.
                    </p>
                  )}

                  {database.inquiries?.map((inq, idx) => (
                    <div key={`inq-${inq.id}-${idx}`} className="p-4 bg-stone-950 border border-stone-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {inq.category}
                          </span>
                          <span className="text-stone-400">{inq.createdAt}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            inq.status === 'Resolved' ? 'bg-emerald-900 text-emerald-200' : 'bg-amber-900 text-amber-200'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{inq.name} ({inq.email})</h4>
                        <p className="text-xs text-stone-300 leading-relaxed max-w-xl">{inq.message}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={inq.status}
                          onChange={async (e) => {
                            await updateInquiryStatus(inq.id, e.target.value as any);
                            showToast(`Status updated to ${e.target.value}.`);
                          }}
                          className="px-2.5 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Resolved">Resolved</option>
                        </select>

                        <button
                          onClick={async () => {
                            if (confirm(`Delete inquiry from ${inq.name}?`)) {
                              await deleteInquiry(inq.id);
                              showToast('Inquiry deleted.');
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 10: MEDIA LIBRARY ================= */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold font-heading text-white">Media Library & Dynamic Uploads</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Drag and drop files to generate direct URLs for banners, leader portraits, and event posters.
                </p>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
                <MediaUploadZone
                  label="Central Photo Upload Zone"
                  onUploadSuccess={(url) => {
                    showToast(`File uploaded successfully! URL copied.`);
                  }}
                />

                <div className="pt-4 border-t border-stone-800">
                  <h4 className="text-xs font-mono uppercase text-stone-400 font-semibold mb-3">
                    Active System Presets
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {database.highlights.slice(0, 4).map((h, idx) => (
                      <div key={`admin-preset-${h.id}-${idx}`} className="p-2 bg-stone-950 rounded-xl border border-stone-800">
                        <img src={h.imageUrl} alt={h.title} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <span className="text-[10px] text-stone-300 truncate block">{h.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: LEADER ADD/EDIT ================= */}
      {isLeaderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingLeader ? 'Edit Executive Leader' : 'Appoint New Executive Leader'}
            </h3>

            <form onSubmit={handleSaveLeader} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={leaderForm.name}
                  onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Role</label>
                  <select
                    value={leaderForm.role}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, role: e.target.value as Leader['role'] })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>President</option>
                    <option>General Secretary</option>
                    <option>Treasurer</option>
                    <option>Vice President</option>
                    <option>Joint Secretary</option>
                    <option>Executive Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Tenure Year</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-27"
                    value={leaderForm.tenure}
                    onChange={(e) => setLeaderForm({ ...leaderForm, tenure: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={leaderForm.department}
                  onChange={(e) => setLeaderForm({ ...leaderForm, department: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <MediaUploadZone
                label="Official Portrait Photo"
                currentUrl={leaderForm.photo}
                onUploadSuccess={(url) => setLeaderForm({ ...leaderForm, photo: url })}
              />

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Quote / Vision</label>
                <textarea
                  rows={2}
                  value={leaderForm.quote}
                  onChange={(e) => setLeaderForm({ ...leaderForm, quote: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLeaderModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NIICS IN-CHARGE ADD/EDIT ================= */}
      {isNIICSModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-amber-500/50 rounded-2xl p-6 w-full max-w-xl shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">
                {editingNIICS ? 'Edit NIICS In-Charge' : 'Appoint New NIICS In-Charge'}
              </h3>
            </div>

            <form onSubmit={handleSaveNIICS} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sayyid M. Zubair Al-Bukhari"
                  value={niicsForm.name}
                  onChange={(e) => setNIICSForm({ ...niicsForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Official Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Central NIICS In-Charge & Off-Campus Director"
                    value={niicsForm.designation}
                    onChange={(e) => setNIICSForm({ ...niicsForm, designation: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Tenure Year</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-27"
                    value={niicsForm.tenure}
                    onChange={(e) => setNIICSForm({ ...niicsForm, tenure: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Department / Directorate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Directorate of Off-Campus Affairs & Academic Harmonization"
                  value={niicsForm.department}
                  onChange={(e) => setNIICSForm({ ...niicsForm, department: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <MediaUploadZone
                label="NIICS In-Charge Portrait Image"
                currentUrl={niicsForm.photo}
                onUploadSuccess={(url) => setNIICSForm({ ...niicsForm, photo: url })}
              />

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Supervised Off-Campuses (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="DH NIICS Chemmad, DH NIICS Hangal, DH NIICS Punganur, DH NIICS Maharashtra, DH NIICS Assam, DH NIICS West Bengal"
                  value={niicsForm.campusesText}
                  onChange={(e) => setNIICSForm({ ...niicsForm, campusesText: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Campuses will appear as interactive badges on the leadership showcase.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Vision / Official Quote</label>
                <textarea
                  rows={2}
                  placeholder="Inspiring quote or vision statement for off-campus scholars..."
                  value={niicsForm.quote}
                  onChange={(e) => setNIICSForm({ ...niicsForm, quote: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="niics.director@anjumanehuda.org"
                    value={niicsForm.email}
                    onChange={(e) => setNIICSForm({ ...niicsForm, email: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Direct Hotline / Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43220"
                    value={niicsForm.phone}
                    onChange={(e) => setNIICSForm({ ...niicsForm, phone: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Office Location</label>
                <input
                  type="text"
                  placeholder="Directorate Wing, Central Secretariat Quadrangle, Gate 4"
                  value={niicsForm.officeLocation}
                  onChange={(e) => setNIICSForm({ ...niicsForm, officeLocation: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsNIICSModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 hover:text-white rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold cursor-pointer shadow"
                >
                  {editingNIICS ? 'Update NIICS In-Charge' : 'Appoint NIICS In-Charge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROGRAM ADD/EDIT ================= */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingProgram ? 'Edit Program Details' : 'Create New Program'}
            </h3>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={progForm.title}
                  onChange={(e) => setProgForm({ ...progForm, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Category</label>
                  <select
                    value={progForm.category}
                    onChange={(e) =>
                      setProgForm({ ...progForm, category: e.target.value as Program['category'] })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>Academic</option>
                    <option>Cultural</option>
                    <option>Leadership</option>
                    <option>Outreach</option>
                    <option>Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Status</label>
                  <select
                    value={progForm.status}
                    onChange={(e) =>
                      setProgForm({ ...progForm, status: e.target.value as Program['status'] })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>Upcoming</option>
                    <option>Live</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={progForm.date}
                    onChange={(e) => setProgForm({ ...progForm, date: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={progForm.time}
                    onChange={(e) => setProgForm({ ...progForm, time: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Venue</label>
                <input
                  type="text"
                  required
                  value={progForm.venue}
                  onChange={(e) => setProgForm({ ...progForm, venue: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <MediaUploadZone
                label="Event Banner Image"
                currentUrl={progForm.banner}
                onUploadSuccess={(url) => setProgForm({ ...progForm, banner: url })}
              />

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={progForm.description}
                  onChange={(e) => setProgForm({ ...progForm, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ANNOUNCEMENT ADD/EDIT ================= */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingAnn ? 'Edit Circular / Announcement' : 'Issue New Circular'}
            </h3>

            <form onSubmit={handleSaveAnn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Category</label>
                  <select
                    value={annForm.category}
                    onChange={(e) =>
                      setAnnForm({ ...annForm, category: e.target.value as Announcement['category'] })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>Circular</option>
                    <option>Event Alert</option>
                    <option>Notice</option>
                    <option>Result</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Urgency</label>
                  <select
                    value={annForm.urgency}
                    onChange={(e) =>
                      setAnnForm({ ...annForm, urgency: e.target.value as Announcement['urgency'] })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Gazette</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={annForm.date}
                  onChange={(e) => setAnnForm({ ...annForm, date: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Summary Details</label>
                <textarea
                  rows={3}
                  required
                  value={annForm.summary}
                  onChange={(e) => setAnnForm({ ...annForm, summary: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ann-pinned"
                  checked={annForm.isPinned}
                  onChange={(e) => setAnnForm({ ...annForm, isPinned: e.target.checked })}
                  className="rounded bg-stone-950 border-stone-700 text-emerald-600"
                />
                <label htmlFor="ann-pinned" className="text-xs text-stone-300">
                  Pin to Top of Notices Bar
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: HIGHLIGHT PHOTO ================= */}
      {isHighlightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Add Highlight Photo</h3>
            <form onSubmit={handleSaveHighlight} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={hlForm.title}
                  onChange={(e) => setHlForm({ ...hlForm, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <MediaUploadZone
                label="Highlight Image"
                currentUrl={hlForm.imageUrl}
                onUploadSuccess={(url) => setHlForm({ ...hlForm, imageUrl: url })}
              />
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsHighlightModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT WING & HISTORY ================= */}
      {isWingModalOpen && editingWing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-xl shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">
              Edit Wing & Leadership History: {editingWing.name}
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Update current wing office-bearers or add previous year archive records.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">Chairman</label>
                  <input
                    type="text"
                    value={editingWing.chairman?.name || editingWing.manager?.name || ''}
                    onChange={(e) => {
                      const updated = {
                        name: e.target.value,
                        contact: editingWing.chairman?.contact || editingWing.manager?.contact || '',
                      };
                      setEditingWing({
                        ...editingWing,
                        chairman: updated,
                        manager: updated,
                      });
                    }}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">Convener</label>
                  <input
                    type="text"
                    value={editingWing.convener.name}
                    onChange={(e) =>
                      setEditingWing({
                        ...editingWing,
                        convener: { ...editingWing.convener, name: e.target.value },
                      })
                    }
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Wing Description</label>
                <textarea
                  rows={2}
                  value={editingWing.description}
                  onChange={(e) => setEditingWing({ ...editingWing, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Add Historical Archive Entry */}
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Add Historical Tenure Record (Chairman & Convener)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Tenure (e.g. 2024-25)"
                    value={newHistoryEntry.tenure}
                    onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, tenure: e.target.value })}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Chairman"
                    value={newHistoryEntry.chairman}
                    onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, chairman: e.target.value })}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Convener"
                    value={newHistoryEntry.convener}
                    onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, convener: e.target.value })}
                    className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddWingHistory}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold px-3 py-1.5 cursor-pointer"
                  >
                    + Add Archive
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsWingModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const payload = {
                      ...editingWing,
                      manager: editingWing.chairman || editingWing.manager,
                    };
                    await updateWing(editingWing.id, payload);
                    showToast(`Wing "${editingWing.name}" saved.`);
                    setIsWingModalOpen(false);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Wing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW WING ================= */}
      {isAddWingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Establish New Wing / Council</h3>
            <form onSubmit={handleSaveNewWing} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Wing Name</label>
                <input
                  type="text"
                  required
                  value={newWingForm.name}
                  onChange={(e) => setNewWingForm({ ...newWingForm, name: e.target.value })}
                  placeholder="e.g. Media & Press Wing"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Short Name</label>
                  <input
                    type="text"
                    required
                    value={newWingForm.shortName}
                    onChange={(e) => setNewWingForm({ ...newWingForm, shortName: e.target.value })}
                    placeholder="MPW"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Tenure</label>
                  <input
                    type="text"
                    required
                    value={newWingForm.currentTenure}
                    onChange={(e) => setNewWingForm({ ...newWingForm, currentTenure: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newWingForm.description}
                  onChange={(e) => setNewWingForm({ ...newWingForm, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">Chairman</label>
                  <input
                    type="text"
                    required
                    value={newWingForm.chairman.name}
                    onChange={(e) =>
                      setNewWingForm({
                        ...newWingForm,
                        chairman: { ...newWingForm.chairman, name: e.target.value },
                      })
                    }
                    placeholder="Full Name"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">Convener</label>
                  <input
                    type="text"
                    required
                    value={newWingForm.convener.name}
                    onChange={(e) =>
                      setNewWingForm({
                        ...newWingForm,
                        convener: { ...newWingForm.convener, name: e.target.value },
                      })
                    }
                    placeholder="Full Name"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddWingModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Create Wing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD TOP WING RANKING ================= */}
      {isTopWingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-stone-100">
            <h3 className="text-lg font-bold text-white mb-4">Add Wing to Leaderboard</h3>
            <form onSubmit={handleSaveTopWing} className="space-y-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Rank Position (#)</label>
                <input
                  type="number"
                  required
                  value={topWingForm.rank}
                  onChange={(e) => setTopWingForm({ ...topWingForm, rank: parseInt(e.target.value) || 1 })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-300 mb-1">Wing Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Literary & Debating Club"
                  value={topWingForm.wingName}
                  onChange={(e) => setTopWingForm({ ...topWingForm, wingName: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-300 mb-1">Points</label>
                <input
                  type="number"
                  required
                  value={topWingForm.points}
                  onChange={(e) => setTopWingForm({ ...topWingForm, points: parseInt(e.target.value) || 0 })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-300 mb-1">Standing Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Current Champion"
                  value={topWingForm.badge}
                  onChange={(e) => setTopWingForm({ ...topWingForm, badge: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTopWingModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Standing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD TOP PARTICIPANT ================= */}
      {isTopParticipantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-stone-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Add Scholastic Laureate</h3>
            <form onSubmit={handleSaveTopParticipant} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Rank Position</label>
                  <input
                    type="number"
                    required
                    value={topPartForm.rank}
                    onChange={(e) => setTopPartForm({ ...topPartForm, rank: parseInt(e.target.value) || 1 })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Points</label>
                  <input
                    type="number"
                    required
                    value={topPartForm.points}
                    onChange={(e) => setTopPartForm({ ...topPartForm, points: parseInt(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Student Scholar Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zaid Haris"
                  value={topPartForm.name}
                  onChange={(e) => setTopPartForm({ ...topPartForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Arabic & Linguistics"
                  value={topPartForm.department}
                  onChange={(e) => setTopPartForm({ ...topPartForm, department: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <MediaUploadZone
                label="Portrait Photo"
                currentUrl={topPartForm.photo}
                onUploadSuccess={(url) => setTopPartForm({ ...topPartForm, photo: url })}
              />

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTopParticipantModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Save Laureate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD RESOLUTION (CAU) ================= */}
      {isResolutionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-stone-100">
            <h3 className="text-lg font-bold text-white mb-4">Gazette Senate Resolution</h3>
            <form onSubmit={handleSaveResolution} className="space-y-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">File Number</label>
                <input
                  type="text"
                  required
                  value={resForm.fileNumber}
                  onChange={(e) => setResForm({ ...resForm, fileNumber: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-300 mb-1">Resolution Title</label>
                <input
                  type="text"
                  required
                  value={resForm.title}
                  onChange={(e) => setResForm({ ...resForm, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Status</label>
                  <select
                    value={resForm.status}
                    onChange={(e) => setResForm({ ...resForm, status: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Adopted">Adopted</option>
                    <option value="In Review">In Review</option>
                    <option value="Gazetted">Gazetted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={resForm.date}
                    onChange={(e) => setResForm({ ...resForm, date: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsResolutionModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Gazette Decree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
