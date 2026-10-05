import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppDatabase,
  Leader,
  CoreCommitteePoster,
  NIICSInCharge,
  Program,
  HighlightItem,
  Wing,
  WingProgram,
  Announcement,
  AchievementsData,
  HomepageContent,
  CAUData,
  RankingData,
  ContactSettings,
  StudentInquiry,
  PillarItem,
  TelemetrySettings,
  SocialLink,
} from '../types';
import { initialDatabase, defaultTelemetrySettings, defaultCoreCommitteeWing } from '../defaultData';
import { isSupabaseConfigured } from '../lib/supabase';
import { optimizeImageBeforeUpload } from '../utils/imageOptimizer';
import {
  fetchContentFromSupabase,
  uploadToSupabaseStorage,
  deleteFromSupabaseStorage,
  saveHomepageInSupabase,
  updateContactSettingsInSupabase,
  saveLeaderInSupabase,
  deleteLeaderInSupabase,
  saveCoreCommitteePosterInSupabase,
  deleteCoreCommitteePosterInSupabase,
  saveProgramInSupabase,
  deleteProgramInSupabase,
  saveAnnouncementInSupabase,
  deleteAnnouncementInSupabase,
  saveHighlightInSupabase,
  deleteHighlightInSupabase,
  saveWingInSupabase,
  deleteWingInSupabase,
  saveWingProgramInSupabase,
  deleteWingProgramInSupabase,
  saveNIICSInChargeInSupabase,
  deleteNIICSInChargeInSupabase,
  saveCAUResolutionInSupabase,
  deleteCAUResolutionInSupabase,
  addInquiryInSupabase,
  updateInquiryStatusInSupabase,
  deleteInquiryInSupabase,
  savePillarInSupabase,
  deletePillarInSupabase,
  saveTelemetryInSupabase,
  saveSocialLinkInSupabase,
  deleteSocialLinkInSupabase,
  seedSupabaseDatabase,
  StorageBucket,
} from '../services/supabaseService';

interface DataContextType {
  database: AppDatabase;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateHomepage: (data: Partial<HomepageContent>) => Promise<boolean>;
  addPillar: (pillar: Omit<PillarItem, 'id'>) => Promise<boolean>;
  updatePillar: (id: string, pillar: Partial<PillarItem>) => Promise<boolean>;
  deletePillar: (id: string) => Promise<boolean>;
  addLeader: (leader: Omit<Leader, 'id'>) => Promise<boolean>;
  updateLeader: (id: string, leader: Partial<Leader>) => Promise<boolean>;
  deleteLeader: (id: string) => Promise<boolean>;
  saveCoreCommitteePoster: (poster: CoreCommitteePoster | Omit<CoreCommitteePoster, 'id'>, id?: string) => Promise<boolean>;
  deleteCoreCommitteePoster: (id: string, posterUrl?: string) => Promise<boolean>;
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
  addWingProgram: (program: Omit<WingProgram, 'id'>) => Promise<boolean>;
  updateWingProgram: (id: string, program: Partial<WingProgram>) => Promise<boolean>;
  deleteWingProgram: (id: string) => Promise<boolean>;
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
  uploadMedia: (file: File, bucket?: StorageBucket) => Promise<{ success: boolean; url?: string; message?: string }>;
  updateTelemetry: (telemetry: Partial<TelemetrySettings>) => Promise<boolean>;
  addSocialLink: (link: Omit<SocialLink, 'id'>) => Promise<boolean>;
  updateSocialLink: (id: string, link: Partial<SocialLink>) => Promise<boolean>;
  deleteSocialLink: (id: string) => Promise<boolean>;
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

      // Offline / Local Development Fallback
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setDatabase(data);
        setError(null);
      } else {
        console.warn('[DataContext] Local API returned non-OK status');
      }
    } catch (err: any) {
      console.warn('[DataContext] Content fetch error:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  /* =========================================================================
     HOMEPAGE & SETTINGS
  ========================================================================= */

  const updateHomepage = async (data: Partial<HomepageContent>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const ok = await saveHomepageInSupabase(data);
      if (!ok) return false;
      setDatabase((prev) => ({ ...prev, homepage: { ...prev.homepage, ...data } }));
      return true;
    }

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
    setDatabase((prev) => ({ ...prev, homepage: { ...prev.homepage, ...data } }));
    return true;
  };

  /* =========================================================================
     FOUNDATIONAL PILLARS CRUD
  ========================================================================= */

  const addPillar = async (pillar: Omit<PillarItem, 'id'>): Promise<boolean> => {
    const rawId = `p_${Date.now()}`;
    const newPillar: PillarItem = {
      ...pillar,
      id: rawId,
    };

    if (isSupabaseConfigured) {
      const res = await savePillarInSupabase(newPillar);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          pillars: [...(prev.pillars || []), res.data!],
        }));
        return true;
      }
      return false;
    }

    try {
      await fetch('/api/pillars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPillar),
      });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      pillars: [...(prev.pillars || []), newPillar],
    }));
    return true;
  };

  const updatePillar = async (id: string, pillar: Partial<PillarItem>): Promise<boolean> => {
    const existing = (database.pillars || []).find((p) => p.id === id);
    if (!existing) return false;
    const updated: PillarItem = { ...existing, ...pillar, id };

    if (isSupabaseConfigured) {
      const res = await savePillarInSupabase(updated, id);
      if (res.success) {
        setDatabase((prev) => ({
          ...prev,
          pillars: (prev.pillars || []).map((p) => (p.id === id ? updated : p)),
        }));
        return true;
      }
      return false;
    }

    try {
      await fetch(`/api/pillars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pillar),
      });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      pillars: (prev.pillars || []).map((p) => (p.id === id ? updated : p)),
    }));
    return true;
  };

  const deletePillar = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        await deletePillarInSupabase(id);
      } catch (e) {
        console.error('Supabase delete pillar error:', e);
      }
    }

    try {
      await fetch(`/api/pillars/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      pillars: (prev.pillars || []).filter((p) => p.id !== id),
    }));
    return true;
  };

  const updateContactSettings = async (settings: Partial<ContactSettings>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const ok = await updateContactSettingsInSupabase(settings);
      if (!ok) return false;
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
    }

    try {
      await fetch('/api/contact-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch (err) {
      console.error(err);
    }
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

  /* =========================================================================
     LEADERS / MEMBERS
  ========================================================================= */

  const addLeader = async (leader: Omit<Leader, 'id'>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await saveLeaderInSupabase(leader);
      if (res.success && res.data) {
        setDatabase((prev) => ({ ...prev, leaders: [res.data!, ...prev.leaders] }));
        return true;
      }
      return false;
    }

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
    if (isSupabaseConfigured) {
      const existing = database.leaders.find((l) => l.id === id);
      const merged = existing ? { ...existing, ...leader } : (leader as Leader);
      const res = await saveLeaderInSupabase(merged, id);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          leaders: prev.leaders.map((l) => (l.id === id ? res.data! : l)),
        }));
        return true;
      }
      return false;
    }

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
    if (isSupabaseConfigured) {
      try {
        const existing = database.leaders.find((l) => l.id === id);
        await deleteLeaderInSupabase(id, existing?.photo);
      } catch (e) {
        console.error('Supabase delete leader error:', e);
      }
    }

    try {
      await fetch(`/api/leaders/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      leaders: prev.leaders.filter((l) => l.id !== id),
    }));
    return true;
  };

  /* =========================================================================
     CORE COMMITTEE POSTERS (Year-wise A4 Rosters)
  ========================================================================= */

  const saveCoreCommitteePoster = async (
    poster: CoreCommitteePoster | Omit<CoreCommitteePoster, 'id'>,
    id?: string
  ): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await saveCoreCommitteePosterInSupabase(poster, id);
      if (res.success && res.data) {
        setDatabase((prev) => {
          const currentPosters = prev.coreCommitteePosters || [];
          const exists = currentPosters.some((p) => p.id === res.data!.id || p.tenure === res.data!.tenure);
          const updatedPosters = exists
            ? currentPosters.map((p) => (p.id === res.data!.id || p.tenure === res.data!.tenure ? res.data! : p))
            : [res.data!, ...currentPosters];
          return { ...prev, coreCommitteePosters: updatedPosters };
        });
        return true;
      }
    }

    const posterId = id || ('id' in poster && poster.id ? poster.id : `ccp-${Date.now()}`);
    const newPoster: CoreCommitteePoster = {
      ...poster,
      id: posterId,
      uploadedAt: new Date().toISOString(),
    };
    setDatabase((prev) => {
      const currentPosters = prev.coreCommitteePosters || [];
      const exists = currentPosters.some((p) => p.id === posterId || p.tenure === newPoster.tenure);
      const updatedPosters = exists
        ? currentPosters.map((p) => (p.id === posterId || p.tenure === newPoster.tenure ? newPoster : p))
        : [newPoster, ...currentPosters];
      return { ...prev, coreCommitteePosters: updatedPosters };
    });
    return true;
  };

  const deleteCoreCommitteePoster = async (id: string, posterUrl?: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      await deleteCoreCommitteePosterInSupabase(id, posterUrl);
    }
    setDatabase((prev) => ({
      ...prev,
      coreCommitteePosters: (prev.coreCommitteePosters || []).filter((p) => p.id !== id),
    }));
    return true;
  };

  /* =========================================================================
     PROGRAMS / EVENTS
  ========================================================================= */

  const addProgram = async (program: Omit<Program, 'id'>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await saveProgramInSupabase(program);
      if (res.success && res.data) {
        setDatabase((prev) => ({ ...prev, programs: [res.data!, ...prev.programs] }));
        return true;
      }
      return false;
    }

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
    const newProg: Program = { ...program, id: `prg-${Date.now()}` };
    setDatabase((prev) => ({ ...prev, programs: [newProg, ...prev.programs] }));
    return true;
  };

  const updateProgram = async (id: string, program: Partial<Program>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const existing = database.programs.find((p) => p.id === id);
      const merged = existing ? { ...existing, ...program } : (program as Program);
      const res = await saveProgramInSupabase(merged, id);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          programs: prev.programs.map((p) => (p.id === id ? res.data! : p)),
        }));
        return true;
      }
      return false;
    }

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
    if (isSupabaseConfigured) {
      try {
        const existing = database.programs.find((p) => p.id === id);
        await deleteProgramInSupabase(id, existing?.banner);
      } catch (e) {
        console.error('Supabase delete program error:', e);
      }
    }

    try {
      await fetch(`/api/programs/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      programs: prev.programs.filter((p) => p.id !== id),
    }));
    return true;
  };

  /* =========================================================================
     ANNOUNCEMENTS / NOTICES
  ========================================================================= */

  const addAnnouncement = async (announcement: Omit<Announcement, 'id'>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await saveAnnouncementInSupabase(announcement);
      if (res.success && res.data) {
        setDatabase((prev) => ({ ...prev, announcements: [res.data!, ...prev.announcements] }));
        return true;
      }
      return false;
    }

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
    if (isSupabaseConfigured) {
      const existing = database.announcements.find((a) => a.id === id);
      const merged = existing ? { ...existing, ...announcement } : (announcement as Announcement);
      const res = await saveAnnouncementInSupabase(merged, id);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          announcements: prev.announcements.map((a) => (a.id === id ? res.data! : a)),
        }));
        return true;
      }
      return false;
    }

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
    if (isSupabaseConfigured) {
      try {
        const existing = database.announcements.find((a) => a.id === id);
        await deleteAnnouncementInSupabase(id, existing?.fileUrl, existing?.imageUrl);
      } catch (e) {
        console.error('Supabase delete announcement error:', e);
      }
    }

    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((a) => a.id !== id),
    }));
    return true;
  };

  /* =========================================================================
     HIGHLIGHTS / ACTIVITIES
  ========================================================================= */

  const addHighlight = async (highlight: Omit<HighlightItem, 'id'>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await saveHighlightInSupabase(highlight);
      if (res.success && res.data) {
        setDatabase((prev) => ({ ...prev, highlights: [res.data!, ...prev.highlights] }));
        return true;
      }
      return false;
    }

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
    if (isSupabaseConfigured) {
      const existing = database.highlights.find((h) => h.id === id);
      const merged = existing ? { ...existing, ...highlight } : (highlight as HighlightItem);
      const res = await saveHighlightInSupabase(merged, id);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          highlights: prev.highlights.map((h) => (h.id === id ? res.data! : h)),
        }));
        return true;
      }
      return false;
    }

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
    if (isSupabaseConfigured) {
      try {
        const existing = database.highlights.find((h) => h.id === id);
        await deleteHighlightInSupabase(id, existing?.imageUrl);
      } catch (e) {
        console.error('Supabase delete highlight error:', e);
      }
    }

    try {
      await fetch(`/api/highlights/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h.id !== id),
    }));
    return true;
  };

  /* =========================================================================
     SPECIALIZED WINGS
  ========================================================================= */

  const addWing = async (wing: Omit<Wing, 'id'>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await saveWingInSupabase(wing);
      if (res.success && res.data) {
        setDatabase((prev) => ({ ...prev, wings: [...prev.wings, res.data!] }));
        return true;
      }
      return false;
    }

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
    const newWing: Wing = { ...wing, id: `wng-${Date.now()}` };
    setDatabase((prev) => ({ ...prev, wings: [...prev.wings, newWing] }));
    return true;
  };

  const updateWing = async (id: string, wing: Partial<Wing>): Promise<boolean> => {
    const existing = database.wings.find((w) => w.id === id) || (id === 'core-committee' ? defaultCoreCommitteeWing : undefined);
    const oldChairmanPhoto = existing?.chairman?.photo || existing?.chairmanPhoto || existing?.manager?.photo;
    const oldConvenerPhoto = existing?.convener?.photo || existing?.convenerPhoto;

    const merged = existing ? { ...existing, ...wing } : (wing as Wing);
    let finalWing: Wing = merged;

    if (isSupabaseConfigured) {
      try {
        const res = await saveWingInSupabase(merged, id, oldChairmanPhoto, oldConvenerPhoto);
        if (res.success && res.data) {
          finalWing = res.data;
        }
      } catch (e) {
        console.error('Supabase update wing error:', e);
      }
    }

    try {
      const res = await fetch(`/api/wings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalWing),
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
    setDatabase((prev) => {
      const exists = prev.wings.some((w) => w.id === id);
      return {
        ...prev,
        wings: exists
          ? prev.wings.map((w) => (w.id === id ? finalWing : w))
          : [finalWing, ...prev.wings],
      };
    });
    return true;
  };

  const deleteWing = async (id: string): Promise<boolean> => {
    const existing = database.wings.find((w) => w.id === id);
    if (isSupabaseConfigured) {
      try {
        await deleteWingInSupabase(
          id,
          existing?.chairman?.photo || existing?.chairmanPhoto,
          existing?.convener?.photo || existing?.convenerPhoto
        );
      } catch (e) {
        console.error('Supabase delete wing error:', e);
      }
    }

    try {
      await fetch(`/api/wings/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      wings: prev.wings.filter((w) => w.id !== id),
    }));
    return true;
  };

  /* =========================================================================
     WING PROGRAMS (Conducted Program Archives & Target Classes)
  ========================================================================= */

  const addWingProgram = async (program: Omit<WingProgram, 'id'>): Promise<boolean> => {
    let savedProgram: WingProgram | null = null;

    if (isSupabaseConfigured) {
      try {
        const res = await saveWingProgramInSupabase(program);
        if (res.success && res.data) {
          savedProgram = res.data;
        }
      } catch (e) {
        console.error('Supabase add wing program error:', e);
      }
    }

    const payload = savedProgram || {
      ...program,
      id: `wprog_${Date.now()}`,
    };

    try {
      await fetch('/api/wing-programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      wingPrograms: [payload, ...(prev.wingPrograms || [])],
    }));
    return true;
  };

  const updateWingProgram = async (id: string, program: Partial<WingProgram>): Promise<boolean> => {
    const existing = (database.wingPrograms || []).find((wp) => wp.id === id);
    if (!existing) return false;

    const merged = { ...existing, ...program };
    let finalProgram: WingProgram = merged;

    if (isSupabaseConfigured) {
      try {
        const res = await saveWingProgramInSupabase(merged, id);
        if (res.success && res.data) {
          finalProgram = res.data;
        }
      } catch (e) {
        console.error('Supabase update wing program error:', e);
      }
    }

    try {
      await fetch(`/api/wing-programs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProgram),
      });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      wingPrograms: (prev.wingPrograms || []).map((wp) => (wp.id === id ? finalProgram : wp)),
    }));
    return true;
  };

  const deleteWingProgram = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        await deleteWingProgramInSupabase(id);
      } catch (e) {
        console.error('Supabase delete wing program error:', e);
      }
    }

    try {
      await fetch(`/api/wing-programs/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      wingPrograms: (prev.wingPrograms || []).filter((wp) => wp.id !== id),
    }));
    return true;
  };

  /* =========================================================================
     NIICS IN-CHARGE
  ========================================================================= */

  const addNIICSInCharge = async (item: Omit<NIICSInCharge, 'id'>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await saveNIICSInChargeInSupabase(item);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          niicsInCharge: [...(prev.niicsInCharge || []), res.data!],
        }));
        return true;
      }
      return false;
    }

    try {
      const res = await fetch('/api/niics', {
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
    const newNiics: NIICSInCharge = { ...item, id: `niics-${Date.now()}` };
    setDatabase((prev) => ({ ...prev, niicsInCharge: [...(prev.niicsInCharge || []), newNiics] }));
    return true;
  };

  const updateNIICSInCharge = async (id: string, item: Partial<NIICSInCharge>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const existing = (database.niicsInCharge || []).find((n) => n.id === id);
      const merged = existing ? { ...existing, ...item } : (item as NIICSInCharge);
      const res = await saveNIICSInChargeInSupabase(merged, id);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          niicsInCharge: (prev.niicsInCharge || []).map((n) => (n.id === id ? res.data! : n)),
        }));
        return true;
      }
      return false;
    }

    try {
      const res = await fetch(`/api/niics/${id}`, {
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
    if (isSupabaseConfigured) {
      try {
        const existing = (database.niicsInCharge || []).find((n) => n.id === id);
        await deleteNIICSInChargeInSupabase(id, existing?.photo);
      } catch (e) {
        console.error('Supabase delete NIICS in-charge error:', e);
      }
    }

    try {
      await fetch(`/api/niics/${id}`, { method: 'DELETE' });
      await fetch(`/api/niics-incharge/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }

    setDatabase((prev) => ({
      ...prev,
      niicsInCharge: (prev.niicsInCharge || []).filter((n) => n.id !== id),
    }));
    return true;
  };

  /* =========================================================================
     CAU RESOLUTIONS
  ========================================================================= */

  const updateCAU = async (cau: Partial<CAUData>): Promise<boolean> => {
    setDatabase((prev) => ({
      ...prev,
      cau: { ...prev.cau, ...cau },
    }));
    return true;
  };

  const addCAUResolution = async (res: Omit<CAUData['latestResolutions'][0], 'id'>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const r = await saveCAUResolutionInSupabase(res);
      if (r.success && r.data) {
        setDatabase((prev) => ({
          ...prev,
          cau: {
            ...prev.cau,
            latestResolutions: [r.data!, ...prev.cau.latestResolutions],
          },
        }));
        return true;
      }
      return false;
    }

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

  const updateCAUResolution = async (
    id: string,
    updated: Partial<CAUData['latestResolutions'][0]>
  ): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const existing = database.cau.latestResolutions.find((r) => r.id === id);
      const merged = existing ? { ...existing, ...updated } : (updated as any);
      await saveCAUResolutionInSupabase(merged, id);
    }

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
    if (isSupabaseConfigured) {
      await deleteCAUResolutionInSupabase(id);
    } else {
      try {
        await fetch(`/api/cau/resolutions/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error(err);
      }
    }

    setDatabase((prev) => ({
      ...prev,
      cau: {
        ...prev.cau,
        latestResolutions: prev.cau.latestResolutions.filter((r) => r.id !== id),
      },
    }));
    return true;
  };

  /* =========================================================================
     RANKINGS & PARTICIPANTS
  ========================================================================= */

  const updateRankings = async (rankings: Partial<RankingData>): Promise<boolean> => {
    try {
      await fetch('/api/rankings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rankings),
      });
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      rankings: { ...prev.rankings, ...rankings },
    }));
    return true;
  };

  const addTopWing = async (wing: RankingData['topWings'][0]): Promise<boolean> => {
    const updatedWings = [...database.rankings.topWings, wing].sort((a, b) => a.rank - b.rank);
    try {
      await fetch('/api/rankings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topWings: updatedWings }),
      });
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topWings: updatedWings,
      },
    }));
    return true;
  };

  const updateTopWing = async (wingName: string, updated: Partial<RankingData['topWings'][0]>): Promise<boolean> => {
    const updatedWings = database.rankings.topWings.map((w) =>
      w.wingName === wingName ? { ...w, ...updated } : w
    );
    try {
      await fetch('/api/rankings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topWings: updatedWings }),
      });
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topWings: updatedWings,
      },
    }));
    return true;
  };

  const deleteTopWing = async (wingName: string): Promise<boolean> => {
    const updatedWings = database.rankings.topWings.filter((w) => w.wingName !== wingName);
    try {
      await fetch('/api/rankings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topWings: updatedWings }),
      });
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topWings: updatedWings,
      },
    }));
    return true;
  };

  const addTopParticipant = async (p: RankingData['topParticipants'][0]): Promise<boolean> => {
    const updatedParticipants = [...database.rankings.topParticipants, p].sort((a, b) => a.rank - b.rank);
    try {
      await fetch('/api/rankings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topParticipants: updatedParticipants }),
      });
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topParticipants: updatedParticipants,
      },
    }));
    return true;
  };

  const updateTopParticipant = async (
    name: string,
    updated: Partial<RankingData['topParticipants'][0]>
  ): Promise<boolean> => {
    const updatedParticipants = database.rankings.topParticipants.map((p) =>
      p.name === name ? { ...p, ...updated } : p
    );
    try {
      await fetch('/api/rankings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topParticipants: updatedParticipants }),
      });
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topParticipants: updatedParticipants,
      },
    }));
    return true;
  };

  const deleteTopParticipant = async (name: string): Promise<boolean> => {
    try {
      await fetch(`/api/rankings/participants/${encodeURIComponent(name)}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
    setDatabase((prev) => ({
      ...prev,
      rankings: {
        ...prev.rankings,
        topParticipants: prev.rankings.topParticipants.filter((p) => p.name !== name),
      },
    }));
    return true;
  };

  /* =========================================================================
     INQUIRIES & ACHIEVEMENTS
  ========================================================================= */

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

  const updateTelemetry = async (telemetryUpdate: Partial<TelemetrySettings>): Promise<boolean> => {
    const current = database.telemetry || defaultTelemetrySettings;
    const merged: TelemetrySettings = {
      ...current,
      ...telemetryUpdate,
      cards: telemetryUpdate.cards || current.cards,
    };

    if (isSupabaseConfigured) {
      await saveTelemetryInSupabase(merged);
    }

    try {
      await fetch('/api/telemetry', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
    } catch (err) {
      // Local server optional fallback
    }

    setDatabase((prev) => ({
      ...prev,
      telemetry: merged,
      achievements: {
        ...prev.achievements,
        totalAchievements: merged.cards?.find((c) => c.id === 'stat-achievements')?.value ?? prev.achievements.totalAchievements,
        eventsOrganized: merged.cards?.find((c) => c.id === 'stat-programs')?.value ?? prev.achievements.eventsOrganized,
        activeMembers: merged.cards?.find((c) => c.id === 'stat-scholars')?.value ?? prev.achievements.activeMembers,
      },
    }));
    return true;
  };

  const addInquiry = async (inq: Omit<StudentInquiry, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await addInquiryInSupabase(inq);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          inquiries: [res.data!, ...(prev.inquiries || [])],
        }));
        return true;
      }
      return false;
    }

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
    if (isSupabaseConfigured) {
      await deleteInquiryInSupabase(id);
    } else {
      try {
        await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error(err);
      }
    }
    setDatabase((prev) => ({
      ...prev,
      inquiries: (prev.inquiries || []).filter((item) => item.id !== id),
    }));
    return true;
  };

  const updateInquiryStatus = async (id: string, status: StudentInquiry['status']): Promise<boolean> => {
    if (isSupabaseConfigured) {
      await updateInquiryStatusInSupabase(id, status);
    }
    setDatabase((prev) => ({
      ...prev,
      inquiries: (prev.inquiries || []).map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    }));
    return true;
  };

  /* =========================================================================
     MEDIA STORAGE UPLOAD (Phase 4 & Phase 5)
  ========================================================================= */

  const uploadMedia = async (
    file: File,
    bucket: StorageBucket = 'gallery'
  ): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      let fileToUpload = file;
      // Ensure proper image MIME type if missing or empty
      if (!fileToUpload.type || !fileToUpload.type.startsWith('image/')) {
        const ext = fileToUpload.name.split('.').pop()?.toLowerCase() || '';
        let mime = 'image/jpeg';
        if (ext === 'png') mime = 'image/png';
        else if (ext === 'webp') mime = 'image/webp';
        else if (ext === 'svg') mime = 'image/svg+xml';
        else if (ext === 'gif') mime = 'image/gif';
        else if (ext === 'avif') mime = 'image/avif';
        fileToUpload = new File([fileToUpload], fileToUpload.name, { type: mime });
      }

      // 1. Primary Reliable Server Storage (Saves directly to public/uploads/ with HEIC auto-conversion)
      // This is the original smooth and dependable method requested by the user.
      try {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            // Optional: Background sync to Supabase Storage if configured and available
            if (isSupabaseConfigured) {
              uploadToSupabaseStorage(fileToUpload, bucket).catch(() => {});
            }
            return { success: true, url: data.url };
          }
        }
      } catch (serverErr) {
        console.warn('[uploadMedia] Server upload error, attempting fallbacks:', serverErr);
      }

      // 2. Client-side Base64 Data URL fallback so photo upload NEVER fails or breaks
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ success: true, url: reader.result as string });
        };
        reader.onerror = () => {
          resolve({ success: false, message: 'Could not read image file.' });
        };
        reader.readAsDataURL(fileToUpload);
      });
    } catch (err: any) {
      console.error('[UploadMedia Error]:', err);
      return { success: false, message: err?.message || 'Upload failed' };
    }
  };

  /* =========================================================================
     SOCIAL MEDIA HANDLES
  ========================================================================= */

  const addSocialLink = async (link: Omit<SocialLink, 'id'>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await saveSocialLinkInSupabase(link);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          socialLinks: [...(prev.socialLinks || []), res.data!],
        }));
        return true;
      }
    }

    const newLink: SocialLink = {
      ...link,
      id: `soc-${Date.now()}`,
    };
    setDatabase((prev) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newLink],
    }));
    return true;
  };

  const updateSocialLink = async (id: string, link: Partial<SocialLink>): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const existing = (database.socialLinks || []).find((s) => s.id === id);
      const merged = existing ? { ...existing, ...link } : (link as SocialLink);
      const res = await saveSocialLinkInSupabase(merged, id);
      if (res.success && res.data) {
        setDatabase((prev) => ({
          ...prev,
          socialLinks: (prev.socialLinks || []).map((s) => (s.id === id ? res.data! : s)),
        }));
        return true;
      }
    }

    setDatabase((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).map((s) => (s.id === id ? { ...s, ...link } : s)),
    }));
    return true;
  };

  const deleteSocialLink = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      const res = await deleteSocialLinkInSupabase(id);
      if (res.success) {
        setDatabase((prev) => ({
          ...prev,
          socialLinks: (prev.socialLinks || []).filter((s) => s.id !== id),
        }));
        return true;
      }
    }

    setDatabase((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((s) => s.id !== id),
    }));
    return true;
  };

  const resetToDefaultSeed = async (): Promise<boolean> => {
    try {
      if (isSupabaseConfigured) {
        await seedSupabaseDatabase(initialDatabase);
      }
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

  return (
    <DataContext.Provider
      value={{
        database,
        loading,
        error,
        refreshData: fetchContent,
        updateHomepage,
        addPillar,
        updatePillar,
        deletePillar,
        addLeader,
        updateLeader,
        deleteLeader,
        saveCoreCommitteePoster,
        deleteCoreCommitteePoster,
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
        addWingProgram,
        updateWingProgram,
        deleteWingProgram,
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
        updateTelemetry,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
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
