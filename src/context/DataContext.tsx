import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppDatabase,
  Leader,
  NIICSInCharge,
  Program,
  HighlightItem,
  Wing,
  Announcement,
  AchievementsData,
  HomepageContent,
  CAUData,
  RankingData,
  ContactSettings,
  StudentInquiry,
} from '../types';
import { initialDatabase } from '../defaultData';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  fetchContentFromSupabase,
  uploadToSupabaseStorage,
} from '../services/supabaseService';

interface DataContextType {
  database: AppDatabase;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateHomepage: (data: Partial<HomepageContent>) => Promise<boolean>;
  addLeader: (leader: Omit<Leader, 'id'>) => Promise<boolean>;
  updateLeader: (id: string, leader: Partial<Leader>) => Promise<boolean>;
  deleteLeader: (id: string) => Promise<boolean>;
  addNIICSInCharge: (item: Omit<NIICSInCharge, 'id'>) => Promise<boolean>;
  updateNIICSInCharge: (id: string, item: Partial<NIICSInCharge>) => Promise<boolean>;
  deleteNIICSInCharge: (id: string) => Promise<boolean>;
  addProgram: (program: Omit<Program, 'id'>) => Promise<boolean>;
  updateProgram: (id: string, program: Partial<Program>) => Promise<boolean>;
  deleteProgram: (id: string) => Promise<boolean>;
  addHighlight: (highlight: Omit<HighlightItem, 'id'>) => Promise<boolean>;
  updateHighlight: (id: string, highlight: Partial<HighlightItem>) => Promise<boolean>;
  deleteHighlight: (id: string) => Promise<boolean>;
  addWing: (wing: Omit<Wing, 'id'>) => Promise<boolean>;
  updateWing: (id: string, wing: Partial<Wing>) => Promise<boolean>;
  deleteWing: (id: string) => Promise<boolean>;
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<boolean>;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;
  updateAchievements: (achievements: Partial<AchievementsData>) => Promise<boolean>;
  updateCAU: (cau: Partial<CAUData>) => Promise<boolean>;
  addCAUResolution: (res: Omit<CAUData['latestResolutions'][0], 'id'>) => Promise<boolean>;
  updateCAUResolution: (id: string, res: Partial<CAUData['latestResolutions'][0]>) => Promise<boolean>;
  deleteCAUResolution: (id: string) => Promise<boolean>;
  updateRankings: (rankings: Partial<RankingData>) => Promise<boolean>;
  addTopWing: (wing: RankingData['topWings'][0]) => Promise<boolean>;
  updateTopWing: (wingName: string, wing: Partial<RankingData['topWings'][0]>) => Promise<boolean>;
  deleteTopWing: (wingName: string) => Promise<boolean>;
  addTopParticipant: (p: RankingData['topParticipants'][0]) => Promise<boolean>;
  updateTopParticipant: (name: string, p: Partial<RankingData['topParticipants'][0]>) => Promise<boolean>;
  deleteTopParticipant: (name: string) => Promise<boolean>;
  updateContactSettings: (settings: Partial<ContactSettings>) => Promise<boolean>;
  addInquiry: (inq: Omit<StudentInquiry, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  deleteInquiry: (id: string) => Promise<boolean>;
  updateInquiryStatus: (id: string, status: StudentInquiry['status']) => Promise<boolean>;
  uploadMedia: (file: File) => Promise<{ success: boolean; url?: string; message?: string }>;
  resetToDefaultSeed: () => Promise<boolean>;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [database, setDatabase] = useState<AppDatabase>(initialDatabase);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      if (isSupabaseConfigured) {
        const cloudData = await fetchContentFromSupabase();
        if (cloudData) {
          setDatabase(cloudData);
          setError(null);
          setLoading(false);
          return;
        }
      }

      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setDatabase(data);
        setError(null);
      } else {
        // Fallback to local storage or initial database
        console.warn('API returned non-OK status, keeping current data');
      }
    } catch (err) {
      console.warn('Backend API warming up or unreachable, using local database state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateHomepage = async (data: Partial<HomepageContent>): Promise<boolean> => {
    try {
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setDatabase((prev) => ({ ...prev, homepage: { ...prev.homepage, ...data } }));
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    // Optimistic fallback
    setDatabase((prev) => ({ ...prev, homepage: { ...prev.homepage, ...data } }));
    return true;
  };

  const addLeader = async (leader: Omit<Leader, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/leaders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leader),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.leaders) {
          setDatabase((prev) => ({ ...prev, leaders: json.leaders }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    const newLdr: Leader = { ...leader, id: `ldr-${Date.now()}` };
    setDatabase((prev) => ({ ...prev, leaders: [newLdr, ...prev.leaders] }));
    return true;
  };

  const updateLeader = async (id: string, leader: Partial<Leader>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/leaders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leader),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.leaders) {
          setDatabase((prev) => ({ ...prev, leaders: json.leaders }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      leaders: prev.leaders.map((l) => (l.id === id ? { ...l, ...leader } : l)),
    }));
    return true;
  };

  const deleteLeader = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/leaders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.leaders) {
          setDatabase((prev) => ({ ...prev, leaders: json.leaders }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      leaders: prev.leaders.filter((l) => l.id !== id),
    }));
    return true;
  };

  const addNIICSInCharge = async (item: Omit<NIICSInCharge, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/niics-incharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.niicsInCharge) {
          setDatabase((prev) => ({ ...prev, niicsInCharge: json.niicsInCharge }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    const newItem: NIICSInCharge = { ...item, id: `niics-${Date.now()}` };
    setDatabase((prev) => ({
      ...prev,
      niicsInCharge: [newItem, ...(prev.niicsInCharge || [])],
    }));
    return true;
  };

  const updateNIICSInCharge = async (id: string, item: Partial<NIICSInCharge>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/niics-incharge/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.niicsInCharge) {
          setDatabase((prev) => ({ ...prev, niicsInCharge: json.niicsInCharge }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      niicsInCharge: (prev.niicsInCharge || []).map((n) => (n.id === id ? { ...n, ...item } : n)),
    }));
    return true;
  };

  const deleteNIICSInCharge = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/niics-incharge/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.niicsInCharge) {
          setDatabase((prev) => ({ ...prev, niicsInCharge: json.niicsInCharge }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      niicsInCharge: (prev.niicsInCharge || []).filter((n) => n.id !== id),
    }));
    return true;
  };

  const addProgram = async (program: Omit<Program, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.programs) {
          setDatabase((prev) => ({ ...prev, programs: json.programs }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    const newProg: Program = { ...program, id: `prog-${Date.now()}` };
    setDatabase((prev) => ({ ...prev, programs: [newProg, ...prev.programs] }));
    return true;
  };

  const updateProgram = async (id: string, program: Partial<Program>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/programs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.programs) {
          setDatabase((prev) => ({ ...prev, programs: json.programs }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      programs: prev.programs.map((p) => (p.id === id ? { ...p, ...program } : p)),
    }));
    return true;
  };

  const deleteProgram = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.programs) {
          setDatabase((prev) => ({ ...prev, programs: json.programs }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      programs: prev.programs.filter((p) => p.id !== id),
    }));
    return true;
  };

  const addHighlight = async (highlight: Omit<HighlightItem, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(highlight),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.highlights) {
          setDatabase((prev) => ({ ...prev, highlights: json.highlights }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    const newHl: HighlightItem = { ...highlight, id: `hl-${Date.now()}` };
    setDatabase((prev) => ({ ...prev, highlights: [newHl, ...prev.highlights] }));
    return true;
  };

  const updateHighlight = async (id: string, highlight: Partial<HighlightItem>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/highlights/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(highlight),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.highlights) {
          setDatabase((prev) => ({ ...prev, highlights: json.highlights }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h) => (h.id === id ? { ...h, ...highlight } : h)),
    }));
    return true;
  };

  const deleteHighlight = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/highlights/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.highlights) {
          setDatabase((prev) => ({ ...prev, highlights: json.highlights }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h.id !== id),
    }));
    return true;
  };

  const addWing = async (wing: Omit<Wing, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/wings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wing),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.wings) {
          setDatabase((prev) => ({ ...prev, wings: json.wings }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    const newWing: Wing = { ...wing, id: `wing-${Date.now()}` };
    setDatabase((prev) => ({ ...prev, wings: [...prev.wings, newWing] }));
    return true;
  };

  const updateWing = async (id: string, wing: Partial<Wing>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/wings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wing),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.wings) {
          setDatabase((prev) => ({ ...prev, wings: json.wings }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      wings: prev.wings.map((w) => (w.id === id ? { ...w, ...wing } : w)),
    }));
    return true;
  };

  const deleteWing = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/wings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.wings) {
          setDatabase((prev) => ({ ...prev, wings: json.wings }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      wings: prev.wings.filter((w) => w.id !== id),
    }));
    return true;
  };

  const addAnnouncement = async (announcement: Omit<Announcement, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.announcements) {
          setDatabase((prev) => ({ ...prev, announcements: json.announcements }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    const newAnn: Announcement = { ...announcement, id: `ann-${Date.now()}` };
    setDatabase((prev) => ({ ...prev, announcements: [newAnn, ...prev.announcements] }));
    return true;
  };

  const updateAnnouncement = async (id: string, announcement: Partial<Announcement>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.announcements) {
          setDatabase((prev) => ({ ...prev, announcements: json.announcements }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      announcements: prev.announcements.map((a) => (a.id === id ? { ...a, ...announcement } : a)),
    }));
    return true;
  };

  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.announcements) {
          setDatabase((prev) => ({ ...prev, announcements: json.announcements }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((a) => a.id !== id),
    }));
    return true;
  };

  const updateAchievements = async (achievements: Partial<AchievementsData>): Promise<boolean> => {
    try {
      const res = await fetch('/api/achievements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievements),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setDatabase((prev) => ({ ...prev, achievements: json.data }));
          return true;
        }
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      achievements: { ...prev.achievements, ...achievements },
    }));
    return true;
  };

  const uploadMedia = async (file: File): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      if (isSupabaseConfigured) {
        const cloudRes = await uploadToSupabaseStorage(file, 'gallery');
        if (cloudRes.success && cloudRes.url) {
          return { success: true, url: cloudRes.url };
        }
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, url: data.url };
      }
      return { success: false, message: data.message || 'Upload failed' };
    } catch (err: any) {
      console.error('Upload error:', err);
      // Fallback: convert to base64 DataURL so user can still see uploaded image immediately
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ success: true, url: reader.result as string });
        };
        reader.onerror = () => {
          resolve({ success: false, message: 'Failed to read file' });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const resetToDefaultSeed = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/reset-seed', { method: 'POST' });
      if (res.ok) {
        setDatabase(initialDatabase);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    setDatabase(initialDatabase);
    return true;
  };

  // ================= CAU OPERATIONS =================
  const updateCAU = async (cau: Partial<CAUData>): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      cau: { ...prev.cau, ...cau },
    }));
    return true;
  };

  const addCAUResolution = async (res: Omit<CAUData['latestResolutions'][0], 'id'>): Promise<boolean> => {
    const newRes = {
      ...res,
      id: `cau-res-${Date.now()}`,
    };
    setDatabase((prev) => ({
      ...prev,
      cau: {
        ...prev.cau,
        latestResolutions: [newRes, ...prev.cau.latestResolutions],
      },
    }));
    return true;
  };

  const updateCAUResolution = async (id: string, updated: Partial<CAUData['latestResolutions'][0]>): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      cau: {
        ...prev.cau,
        latestResolutions: prev.cau.latestResolutions.map((r) =>
          r.id === id ? { ...r, ...updated } : r
        ),
      },
    }));
    return true;
  };

  const deleteCAUResolution = async (id: string): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      cau: {
        ...prev.cau,
        latestResolutions: prev.cau.latestResolutions.filter((r) => r.id !== id),
      },
    }));
    return true;
  };

  // ================= RANKINGS OPERATIONS =================
  const updateRankings = async (rankings: Partial<RankingData>): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      rankings: { ...prev.rankings, ...rankings },
    }));
    return true;
  };

  const addTopWing = async (wing: RankingData['topWings'][0]): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topWings: [...prev.rankings.topWings, wing].sort((a, b) => a.rank - b.rank),
      },
    }));
    return true;
  };

  const updateTopWing = async (wingName: string, updated: Partial<RankingData['topWings'][0]>): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topWings: prev.rankings.topWings.map((w) =>
          w.wingName === wingName ? { ...w, ...updated } : w
        ),
      },
    }));
    return true;
  };

  const deleteTopWing = async (wingName: string): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topWings: prev.rankings.topWings.filter((w) => w.wingName !== wingName),
      },
    }));
    return true;
  };

  const addTopParticipant = async (p: RankingData['topParticipants'][0]): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topParticipants: [...prev.rankings.topParticipants, p].sort((a, b) => a.rank - b.rank),
      },
    }));
    return true;
  };

  const updateTopParticipant = async (name: string, updated: Partial<RankingData['topParticipants'][0]>): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topParticipants: prev.rankings.topParticipants.map((p) =>
          p.name === name ? { ...p, ...updated } : p
        ),
      },
    }));
    return true;
  };

  const deleteTopParticipant = async (name: string): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topParticipants: prev.rankings.topParticipants.filter((p) => p.name !== name),
      },
    }));
    return true;
  };

  // ================= CONTACT SETTINGS & INQUIRIES =================
  const updateContactSettings = async (settings: Partial<ContactSettings>): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      contactSettings: {
        campusAddress: prev.contactSettings?.campusAddress || initialDatabase.contactSettings!.campusAddress,
        officialEmail: prev.contactSettings?.officialEmail || initialDatabase.contactSettings!.officialEmail,
        helplinePhone: prev.contactSettings?.helplinePhone || initialDatabase.contactSettings!.helplinePhone,
        secondaryPhone: prev.contactSettings?.secondaryPhone || initialDatabase.contactSettings!.secondaryPhone,
        officeHours: prev.contactSettings?.officeHours || initialDatabase.contactSettings!.officeHours,
        emergencyDesk: prev.contactSettings?.emergencyDesk || initialDatabase.contactSettings!.emergencyDesk,
        ...settings,
      },
    }));
    return true;
  };

  const addInquiry = async (inq: Omit<StudentInquiry, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    const newInquiry: StudentInquiry = {
      ...inq,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending',
    };
    setDatabase((prev) => ({
      ...prev,
      inquiries: [newInquiry, ...(prev.inquiries || [])],
    }));
    return true;
  };

  const deleteInquiry = async (id: string): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      inquiries: (prev.inquiries || []).filter((item) => item.id !== id),
    }));
    return true;
  };

  const updateInquiryStatus = async (id: string, status: StudentInquiry['status']): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      inquiries: (prev.inquiries || []).map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    }));
    return true;
  };

  return (
    <DataContext.Provider
      value={{
        database,
        loading,
        error,
        refreshData: fetchContent,
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
        addInquiry,
        deleteInquiry,
        updateInquiryStatus,
        uploadMedia,
        resetToDefaultSeed,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
