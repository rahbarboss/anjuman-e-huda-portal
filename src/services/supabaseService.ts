import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  AppDatabase,
  Leader,
  NIICSInCharge,
  Program,
  HighlightItem,
  Wing,
  Announcement,
  HomepageContent,
  ContactSettings,
  CAUResolution,
  StudentInquiry,
  PillarItem,
} from '../types';
import { initialDatabase } from '../defaultData';

export type StorageBucket =
  | 'events'
  | 'notices'
  | 'activities'
  | 'members'
  | 'gallery'
  | 'posters'
  | 'documents'
  | 'logos';

/**
 * Upload an image or file to Supabase Storage with bucket routing
 * Returns the public URL of the uploaded asset
 */
export async function uploadToSupabaseStorage(
  file: File,
  bucket: StorageBucket = 'gallery'
): Promise<{ success: boolean; url?: string; path?: string; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    const filePath = `${Date.now()}_${cleanFileName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error(`[Supabase Storage / ${bucket}] Upload failed:`, uploadError.message, uploadError);
      return { success: false, message: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      success: true,
      url: data.publicUrl,
      path: filePath,
    };
  } catch (err: any) {
    console.error(`[Supabase Storage / ${bucket}] Unexpected error:`, err?.message || err);
    return { success: false, message: err?.message || 'Storage upload failed' };
  }
}

/**
 * Remove an old asset from Supabase Storage by its public URL or path
 */
export async function deleteFromSupabaseStorage(
  publicUrlOrPath: string,
  bucket: StorageBucket = 'gallery'
): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured || !publicUrlOrPath) return false;

  try {
    let filePath = publicUrlOrPath;
    if (publicUrlOrPath.startsWith('http')) {
      const urlObj = new URL(publicUrlOrPath);
      const marker = `/storage/v1/object/public/${bucket}/`;
      const pathParts = urlObj.pathname.split(marker);
      if (pathParts.length < 2) return false;
      filePath = decodeURIComponent(pathParts[1]);
    }

    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      console.warn(`[Supabase Storage / ${bucket}] Delete file warning:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[Supabase Storage / ${bucket}] Error deleting storage file:`, err);
    return false;
  }
}

/**
 * Fetch all content directly from Supabase PostgreSQL tables
 */
export async function fetchContentFromSupabase(): Promise<AppDatabase | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    const [
      settingsRes,
      eventsRes,
      noticesRes,
      activitiesRes,
      membersRes,
      niicsRes,
      wingsRes,
      docsRes,
    ] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 'central').maybeSingle(),
      supabase.from('events').select('*').order('date', { ascending: false }),
      supabase.from('notices').select('*').order('is_pinned', { ascending: false }),
      supabase.from('activities').select('*').order('date', { ascending: false }),
      supabase.from('members').select('*').order('created_at', { ascending: true }),
      supabase.from('niics_directors').select('*').order('created_at', { ascending: true }),
      supabase.from('wings').select('*').order('name', { ascending: true }),
      supabase.from('documents').select('*').order('created_at', { ascending: false }),
    ]);

    // Check if table queries were successful
    if (eventsRes.error || noticesRes.error || membersRes.error || wingsRes.error) {
      console.warn('[Supabase DB] Error reading core tables, might not be fully seeded:', {
        events: eventsRes.error?.message,
        notices: noticesRes.error?.message,
        members: membersRes.error?.message,
        wings: wingsRes.error?.message,
      });
      // If tables exist but are just empty, we still return the mapped structure!
      if (
        eventsRes.error?.message.includes('relation') ||
        eventsRes.error?.message.includes('schema cache')
      ) {
        return null;
      }
    }

    const settings = settingsRes.data;

    const homepage: HomepageContent = {
      heroTitle: settings?.hero_title || 'ANJUMAN-E-HUDA',
      heroSubtitle:
        settings?.hero_subtitle ||
        'The official apex central student organization steering intellectual vigor, cultural distinction, and student welfare across campus.',
      heroBadge: settings?.hero_badge || 'OFFICIAL APEX STUDENT BODY',
      heroBgUrl:
        settings?.hero_bg_url ||
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
      ctaMissionLabel: 'Union Charters & Mission',
      ctaProgramsLabel: 'Central Initiatives Calendar',
      aboutText:
        settings?.about_text ||
        'Founded in 1994, ANJUMAN-E-HUDA is the premier central student union orchestrating moral excellence, scholarly dialogues, community aid, and multidisciplinary competitions.',
      vision:
        settings?.vision ||
        'To nurture morally grounded, intellectually versatile leaders who enrich civil society and advance scholarly excellence.',
      mission:
        settings?.mission ||
        'Upholding student welfare through collaborative leadership, ethical representation, and progressive educational engagement.',
    };

    const leaders: Leader[] = (membersRes.data || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      tenure: m.tenure,
      photo: m.photo,
      department: m.department,
      quote: m.quote,
      email: m.email,
      phone: m.phone,
    }));

    const niicsInCharge: NIICSInCharge[] = (niicsRes.data || []).map((n: any) => ({
      id: n.id,
      name: n.name,
      designation: n.designation,
      tenure: n.tenure,
      photo: n.photo,
      department: n.department,
      jurisdiction: n.jurisdiction,
      campuses: n.campuses || [],
      quote: n.quote,
      email: n.email,
      phone: n.phone,
      officeLocation: n.office_location,
    }));

    const programs: Program[] = (eventsRes.data || []).map((e: any) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      banner: e.banner || '',
      date: e.date,
      time: e.time,
      venue: e.venue,
      description: e.description || '',
      tags: e.tags || [],
      status: e.status,
      registrationLink: e.registration_link,
    }));

    const announcements: Announcement[] = (noticesRes.data || []).map((n: any) => ({
      id: n.id,
      title: n.title,
      category: n.category,
      date: n.date,
      summary: n.summary,
      fileUrl: n.file_url,
      isPinned: Boolean(n.is_pinned),
      urgency: n.urgency,
    }));

    const highlights: HighlightItem[] = (activitiesRes.data || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      imageUrl: a.image_url,
      date: a.date,
      description: a.description || '',
      tags: a.tags || [],
    }));

    const wings: Wing[] = (wingsRes.data || []).map((w: any) => ({
      id: w.id,
      name: w.name,
      shortName: w.short_name,
      description: w.description || '',
      iconName: w.icon_name || 'BookOpen',
      status: w.status,
      currentTenure: w.current_tenure,
      chairman: w.chairman || { name: '', contact: '' },
      convener: w.convener || { name: '', contact: '' },
      history: w.history || [],
    }));

    const latestResolutions: CAUResolution[] = (docsRes.data || [])
      .filter((d: any) => d.category === 'CAU Resolution' || d.category === 'Resolution')
      .map((d: any) => ({
        id: d.id,
        title: d.title,
        date: d.date || '',
        fileNumber: d.file_number || '',
        status: d.status || 'Adopted',
      }));

    // If the database tables are completely empty, perform initial seed
    if (leaders.length === 0 && programs.length === 0 && wings.length === 0) {
      console.log('[Supabase DB] Empty tables detected, initial seed will be available via resetToDefaultSeed');
    }

    const inquiries = await fetchInquiriesFromSupabase();
    const cloudPillars = await fetchPillarsFromSupabase();
    const pillars = cloudPillars.length > 0 ? cloudPillars : (initialDatabase.pillars || []);

    return {
      homepage,
      announcements,
      leaders,
      niicsInCharge,
      programs,
      highlights,
      wings,
      inquiries,
      pillars,
      achievements: {
        totalAchievements: 48,
        totalOutreachInitiatives: 120,
        eventsOrganized: 85,
        activeMembers: 1200,
        items: [],
      },
      cau: {
        constitutionSummary:
          'The Central Advisory Union charter balances collegiate representation with democratic governance.',
        councilMembersCount: 24,
        sessionTerm: '2026-27',
        latestResolutions,
      },
      rankings: {
        topWings: [],
        topParticipants: [],
      },
      contactSettings: {
        campusAddress:
          settings?.campus_address &&
          settings.campus_address !== 'Central Secretariat Quadrangle, Gate 4, Main Campus, Chemmad, Kerala 676306' &&
          !settings.campus_address.includes('Gate 4')
            ? settings.campus_address
            : 'Darul Huda Islamic University',
        officialEmail:
          settings?.official_email &&
          settings.official_email !== 'central.union@anjumanehuda.org' &&
          settings.official_email !== 'secretariat@anjumanehuda.org'
            ? settings.official_email
            : 'anjumanehuda@dhiu.in',
        helplinePhone: settings?.helpline_phone || '+91 98765 43210',
        secondaryPhone: settings?.secondary_phone || '+91 98765 43211',
        officeHours: settings?.office_hours || 'Mon - Sat: 08:30 AM - 05:30 PM (IST)',
        emergencyDesk: settings?.emergency_desk || 'Student Affairs Room 102 (24/7 Helpline available)',
      },
    };
  } catch (err: any) {
    console.warn('[Supabase DB] Failed to fetch content from Supabase:', err?.message || err);
    return null;
  }
}

/**
 * Seed all default initial records into Supabase PostgreSQL tables
 */
export async function seedSupabaseDatabase(db: AppDatabase): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    // 1. Site Settings
    await saveHomepageInSupabase(db.homepage);
    if (db.contactSettings) {
      await updateContactSettingsInSupabase(db.contactSettings);
    }

    // 2. Leaders
    for (const leader of db.leaders) {
      await saveLeaderInSupabase(leader, leader.id);
    }

    // 3. NIICS In-Charge
    for (const item of db.niicsInCharge || []) {
      await saveNIICSInChargeInSupabase(item, item.id);
    }

    // 4. Programs / Events
    for (const prog of db.programs) {
      await saveProgramInSupabase(prog, prog.id);
    }

    // 5. Announcements / Notices
    for (const ann of db.announcements) {
      await saveAnnouncementInSupabase(ann, ann.id);
    }

    // 6. Activities / Highlights
    for (const hl of db.highlights) {
      await saveHighlightInSupabase(hl, hl.id);
    }

    // 7. Wings
    for (const w of db.wings) {
      await saveWingInSupabase(w, w.id);
    }

    // 8. Documents / CAU
    for (const res of db.cau.latestResolutions) {
      await saveCAUResolutionInSupabase(res, res.id);
    }

    // 9. Foundational Pillars
    if (db.pillars && db.pillars.length > 0) {
      for (const p of db.pillars) {
        await savePillarInSupabase(p, p.id);
      }
    }

    return true;
  } catch (err) {
    console.error('[Supabase DB] Error seeding database:', err);
    return false;
  }
}

/* =========================================================================
   HOMEPAGE & SETTINGS CRUD
========================================================================= */

export async function saveHomepageInSupabase(data: Partial<HomepageContent>): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (data.heroTitle !== undefined) updatePayload.hero_title = data.heroTitle;
    if (data.heroSubtitle !== undefined) updatePayload.hero_subtitle = data.heroSubtitle;
    if (data.heroBadge !== undefined) updatePayload.hero_badge = data.heroBadge;
    if (data.heroBgUrl !== undefined) updatePayload.hero_bg_url = data.heroBgUrl;
    if (data.aboutText !== undefined) updatePayload.about_text = data.aboutText;
    if (data.vision !== undefined) updatePayload.vision = data.vision;
    if (data.mission !== undefined) updatePayload.mission = data.mission;

    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'central', ...updatePayload });

    if (error) {
      console.error('[Supabase DB / site_settings] Update homepage failed:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[Supabase DB / site_settings] Error updating homepage:', err);
    return false;
  }
}

export async function updateContactSettingsInSupabase(data: Partial<ContactSettings>): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (data.campusAddress !== undefined) updatePayload.campus_address = data.campusAddress;
    if (data.officialEmail !== undefined) updatePayload.official_email = data.officialEmail;
    if (data.helplinePhone !== undefined) updatePayload.helpline_phone = data.helplinePhone;
    if (data.secondaryPhone !== undefined) updatePayload.secondary_phone = data.secondaryPhone;
    if (data.officeHours !== undefined) updatePayload.office_hours = data.officeHours;
    if (data.emergencyDesk !== undefined) updatePayload.emergency_desk = data.emergencyDesk;

    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'central', ...updatePayload });

    if (error) {
      console.error('[Supabase DB / site_settings] Update contact settings failed:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[Supabase DB / site_settings] Error updating contact settings:', err);
    return false;
  }
}

/* =========================================================================
   LEADERS / MEMBERS CRUD (Table: members)
========================================================================= */

export async function saveLeaderInSupabase(
  leader: Leader | Omit<Leader, 'id'>,
  id?: string
): Promise<{ success: boolean; data?: Leader; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const leaderId = id || ('id' in leader && leader.id ? leader.id : `mbr_${Date.now()}`);
    const row = {
      id: leaderId,
      name: leader.name,
      role: leader.role,
      tenure: leader.tenure,
      photo: leader.photo,
      department: leader.department,
      quote: leader.quote || '',
      email: leader.email || '',
      phone: leader.phone || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('members').upsert(row);
    if (error) {
      console.error('[Supabase DB / members] Save leader failed:', error.message);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      data: {
        id: leaderId,
        ...leader,
      },
    };
  } catch (err: any) {
    console.error('[Supabase DB / members] Unexpected save error:', err);
    return { success: false, message: err?.message || 'Failed to save leader' };
  }
}

export async function deleteLeaderInSupabase(
  id: string,
  photoUrl?: string
): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) {
      console.error('[Supabase DB / members] Delete leader failed:', error.message);
      return { success: false, message: error.message };
    }

    // Clean up media in Storage if applicable
    if (photoUrl && photoUrl.includes('supabase.co')) {
      await deleteFromSupabaseStorage(photoUrl, 'members');
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / members] Unexpected delete error:', err);
    return { success: false, message: err?.message || 'Failed to delete leader' };
  }
}

/* =========================================================================
   PROGRAMS / EVENTS CRUD (Table: events)
========================================================================= */

export async function saveProgramInSupabase(
  program: Program | Omit<Program, 'id'>,
  id?: string
): Promise<{ success: boolean; data?: Program; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const programId = id || ('id' in program && program.id ? program.id : `evt_${Date.now()}`);
    const row = {
      id: programId,
      title: program.title,
      category: program.category,
      banner: program.banner || '',
      date: program.date,
      time: program.time,
      venue: program.venue,
      description: program.description || '',
      tags: program.tags || [],
      status: program.status || 'Upcoming',
      registration_link: program.registrationLink || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('events').upsert(row);
    if (error) {
      console.error('[Supabase DB / events] Save program failed:', error.message);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      data: {
        id: programId,
        ...program,
      },
    };
  } catch (err: any) {
    console.error('[Supabase DB / events] Unexpected save error:', err);
    return { success: false, message: err?.message || 'Failed to save event' };
  }
}

export async function deleteProgramInSupabase(
  id: string,
  bannerUrl?: string
): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      console.error('[Supabase DB / events] Delete program failed:', error.message);
      return { success: false, message: error.message };
    }

    if (bannerUrl && bannerUrl.includes('supabase.co')) {
      await deleteFromSupabaseStorage(bannerUrl, 'events');
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / events] Unexpected delete error:', err);
    return { success: false, message: err?.message || 'Failed to delete program' };
  }
}

/* =========================================================================
   ANNOUNCEMENTS / NOTICES CRUD (Table: notices)
========================================================================= */

export async function saveAnnouncementInSupabase(
  ann: Announcement | Omit<Announcement, 'id'>,
  id?: string
): Promise<{ success: boolean; data?: Announcement; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const annId = id || ('id' in ann && ann.id ? ann.id : `not_${Date.now()}`);
    const row = {
      id: annId,
      title: ann.title,
      category: ann.category,
      date: ann.date,
      summary: ann.summary,
      file_url: ann.fileUrl || '',
      is_pinned: Boolean(ann.isPinned),
      urgency: ann.urgency || 'normal',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('notices').upsert(row);
    if (error) {
      console.error('[Supabase DB / notices] Save notice failed:', error.message);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      data: {
        id: annId,
        ...ann,
      },
    };
  } catch (err: any) {
    console.error('[Supabase DB / notices] Unexpected save error:', err);
    return { success: false, message: err?.message || 'Failed to save notice' };
  }
}

export async function deleteAnnouncementInSupabase(
  id: string,
  fileUrl?: string
): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) {
      console.error('[Supabase DB / notices] Delete notice failed:', error.message);
      return { success: false, message: error.message };
    }

    if (fileUrl && fileUrl.includes('supabase.co')) {
      await deleteFromSupabaseStorage(fileUrl, 'notices');
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / notices] Unexpected delete error:', err);
    return { success: false, message: err?.message || 'Failed to delete notice' };
  }
}

/* =========================================================================
   HIGHLIGHTS / ACTIVITIES CRUD (Table: activities)
========================================================================= */

export async function saveHighlightInSupabase(
  item: HighlightItem | Omit<HighlightItem, 'id'>,
  id?: string
): Promise<{ success: boolean; data?: HighlightItem; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const actId = id || ('id' in item && item.id ? item.id : `act_${Date.now()}`);
    const row = {
      id: actId,
      title: item.title,
      category: item.category,
      image_url: item.imageUrl,
      date: item.date,
      description: item.description || '',
      tags: item.tags || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('activities').upsert(row);
    if (error) {
      console.error('[Supabase DB / activities] Save highlight failed:', error.message);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      data: {
        id: actId,
        ...item,
      },
    };
  } catch (err: any) {
    console.error('[Supabase DB / activities] Unexpected save error:', err);
    return { success: false, message: err?.message || 'Failed to save highlight' };
  }
}

export async function deleteHighlightInSupabase(
  id: string,
  imageUrl?: string
): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) {
      console.error('[Supabase DB / activities] Delete activity failed:', error.message);
      return { success: false, message: error.message };
    }

    if (imageUrl && imageUrl.includes('supabase.co')) {
      await deleteFromSupabaseStorage(imageUrl, 'activities');
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / activities] Unexpected delete error:', err);
    return { success: false, message: err?.message || 'Failed to delete activity' };
  }
}

/* =========================================================================
   WINGS CRUD (Table: wings)
========================================================================= */

export async function saveWingInSupabase(
  wing: Wing | Omit<Wing, 'id'>,
  id?: string
): Promise<{ success: boolean; data?: Wing; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const wingId = id || ('id' in wing && wing.id ? wing.id : `wing_${Date.now()}`);
    const row = {
      id: wingId,
      name: wing.name,
      short_name: wing.shortName,
      description: wing.description || '',
      icon_name: wing.iconName || 'BookOpen',
      status: wing.status || 'Active',
      current_tenure: wing.currentTenure || '2026-27',
      chairman: wing.chairman || { name: '', contact: '' },
      convener: wing.convener || { name: '', contact: '' },
      history: wing.history || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('wings').upsert(row);
    if (error) {
      console.error('[Supabase DB / wings] Save wing failed:', error.message);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      data: {
        id: wingId,
        ...wing,
      },
    };
  } catch (err: any) {
    console.error('[Supabase DB / wings] Unexpected save error:', err);
    return { success: false, message: err?.message || 'Failed to save wing' };
  }
}

export async function deleteWingInSupabase(id: string): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase.from('wings').delete().eq('id', id);
    if (error) {
      console.error('[Supabase DB / wings] Delete wing failed:', error.message);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / wings] Unexpected delete error:', err);
    return { success: false, message: err?.message || 'Failed to delete wing' };
  }
}

/* =========================================================================
   NIICS IN-CHARGE CRUD (Table: niics_directors)
========================================================================= */

export async function saveNIICSInChargeInSupabase(
  item: NIICSInCharge | Omit<NIICSInCharge, 'id'>,
  id?: string
): Promise<{ success: boolean; data?: NIICSInCharge; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const directorId = id || ('id' in item && item.id ? item.id : `niics_${Date.now()}`);
    const row = {
      id: directorId,
      name: item.name,
      designation: item.designation,
      tenure: item.tenure,
      photo: item.photo,
      department: item.department,
      jurisdiction: item.jurisdiction || '',
      campuses: item.campuses || [],
      quote: item.quote || '',
      email: item.email || '',
      phone: item.phone || '',
      office_location: item.officeLocation || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('niics_directors').upsert(row);
    if (error) {
      console.error('[Supabase DB / niics_directors] Save director failed:', error.message);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      data: {
        id: directorId,
        ...item,
      },
    };
  } catch (err: any) {
    console.error('[Supabase DB / niics_directors] Unexpected save error:', err);
    return { success: false, message: err?.message || 'Failed to save director' };
  }
}

export async function deleteNIICSInChargeInSupabase(
  id: string,
  photoUrl?: string
): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase.from('niics_directors').delete().eq('id', id);
    if (error) {
      console.error('[Supabase DB / niics_directors] Delete director failed:', error.message);
      return { success: false, message: error.message };
    }

    if (photoUrl && photoUrl.includes('supabase.co')) {
      await deleteFromSupabaseStorage(photoUrl, 'members');
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / niics_directors] Unexpected delete error:', err);
    return { success: false, message: err?.message || 'Failed to delete director' };
  }
}

/* =========================================================================
   DOCUMENTS & CAU RESOLUTIONS CRUD (Table: documents)
========================================================================= */

export async function saveCAUResolutionInSupabase(
  res: CAUResolution | Omit<CAUResolution, 'id'>,
  id?: string
): Promise<{ success: boolean; data?: CAUResolution; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const resId = id || ('id' in res && res.id ? res.id : `res_${Date.now()}`);
    const row = {
      id: resId,
      title: res.title,
      category: 'CAU Resolution',
      file_url: '',
      file_number: res.fileNumber || '',
      date: res.date || '',
      status: res.status || 'Adopted',
    };

    const { error } = await supabase.from('documents').upsert(row);
    if (error) {
      console.error('[Supabase DB / documents] Save resolution failed:', error.message);
      return { success: false, message: error.message };
    }

    return {
      success: true,
      data: {
        id: resId,
        ...res,
      },
    };
  } catch (err: any) {
    console.error('[Supabase DB / documents] Unexpected save error:', err);
    return { success: false, message: err?.message || 'Failed to save resolution' };
  }
}

export async function deleteCAUResolutionInSupabase(id: string): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
      console.error('[Supabase DB / documents] Delete resolution failed:', error.message);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / documents] Unexpected delete error:', err);
    return { success: false, message: err?.message || 'Failed to delete resolution' };
  }
}

/* =========================================================================
   STUDENT INQUIRIES CRUD (Public INSERT, Admin SELECT/UPDATE/DELETE)
========================================================================= */

export async function fetchInquiriesFromSupabase(): Promise<StudentInquiry[]> {
  if (!supabase || !isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('student_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      category: d.category,
      message: d.message,
      status: (d.status as StudentInquiry['status']) || 'Pending',
      createdAt: d.created_at ? new Date(d.created_at).toISOString().replace('T', ' ').substring(0, 16) : '',
    }));
  } catch {
    return [];
  }
}

export async function addInquiryInSupabase(
  inq: Omit<StudentInquiry, 'id' | 'createdAt' | 'status'>
): Promise<{ success: boolean; data?: StudentInquiry; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }
  try {
    const { data, error } = await supabase
      .from('student_inquiries')
      .insert({
        name: inq.name,
        email: inq.email,
        category: inq.category,
        message: inq.message,
        status: 'Pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase DB / inquiries] Insert failed:', error.message);
      return { success: false, message: error.message };
    }
    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        category: data.category,
        message: data.message,
        status: data.status,
        createdAt: data.created_at ? new Date(data.created_at).toISOString().replace('T', ' ').substring(0, 16) : '',
      },
    };
  } catch (err: any) {
    console.error('[Supabase DB / inquiries] Unexpected insert error:', err);
    return { success: false, message: err?.message || 'Failed to submit inquiry' };
  }
}

export async function updateInquiryStatusInSupabase(
  id: string,
  status: StudentInquiry['status']
): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) return { success: false };
  try {
    const { error } = await supabase
      .from('student_inquiries')
      .update({ status })
      .eq('id', id);
    if (error) {
      console.error('[Supabase DB / inquiries] Update status failed:', error.message);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / inquiries] Unexpected update error:', err);
    return { success: false, message: err?.message };
  }
}

export async function deleteInquiryInSupabase(id: string): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) return { success: false };
  try {
    const { error } = await supabase.from('student_inquiries').delete().eq('id', id);
    if (error) {
      console.error('[Supabase DB / inquiries] Delete inquiry failed:', error.message);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / inquiries] Unexpected delete error:', err);
    return { success: false, message: err?.message };
  }
}

/* =========================================================================
   FOUNDATIONAL PILLARS CRUD (Persisted to Supabase PostgreSQL documents table)
========================================================================= */

export async function fetchPillarsFromSupabase(): Promise<PillarItem[]> {
  if (!supabase || !isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('category', 'Pillar')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return [];
    return data.map((d: any) => {
      try {
        const parsed = JSON.parse(d.file_url) as PillarItem;
        return {
          ...parsed,
          id: parsed.id || d.id.replace(/^pillar_/, ''),
          name: parsed.name || d.title,
          englishTitle: parsed.englishTitle || d.file_number || '',
          desc: parsed.desc || d.date || '',
          arabicMotto: parsed.arabicMotto || d.status || '',
        };
      } catch {
        return {
          id: d.id.replace(/^pillar_/, ''),
          name: d.title,
          englishTitle: d.file_number || '',
          desc: d.date || '',
          arabicMotto: d.status || '',
          colorName: 'emerald',
        };
      }
    });
  } catch (err) {
    console.error('[Supabase DB / documents] Error fetching pillars:', err);
    return [];
  }
}

export async function savePillarInSupabase(
  pillar: PillarItem,
  existingId?: string
): Promise<{ success: boolean; data?: PillarItem; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }
  try {
    const rawId = existingId || pillar.id || `p_${Date.now()}`;
    const pId = rawId.startsWith('pillar_') ? rawId : `pillar_${rawId}`;
    const pillarPayload: PillarItem = {
      ...pillar,
      id: rawId.replace(/^pillar_/, ''),
    };

    const { error } = await supabase.from('documents').upsert({
      id: pId,
      title: pillarPayload.name,
      category: 'Pillar',
      file_url: JSON.stringify(pillarPayload),
      file_number: pillarPayload.englishTitle,
      date: pillarPayload.desc,
      status: pillarPayload.arabicMotto || '',
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[Supabase DB / documents] Save pillar failed:', error.message);
      return { success: false, message: error.message };
    }
    return { success: true, data: pillarPayload };
  } catch (err: any) {
    console.error('[Supabase DB / documents] Unexpected error saving pillar:', err);
    return { success: false, message: err?.message || 'Failed to save pillar' };
  }
}

export async function deletePillarInSupabase(id: string): Promise<{ success: boolean; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }
  try {
    const rawId = id.replace(/^pillar_/, '');
    const pId = `pillar_${rawId}`;
    // Delete both possible id formats to be safe
    const { error } = await supabase.from('documents').delete().in('id', [pId, id, rawId]);
    if (error) {
      console.error('[Supabase DB / documents] Delete pillar failed:', error.message);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('[Supabase DB / documents] Unexpected error deleting pillar:', err);
    return { success: false, message: err?.message || 'Failed to delete pillar' };
  }
}
