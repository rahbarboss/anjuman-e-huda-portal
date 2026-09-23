import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AppDatabase, Leader, NIICSInCharge, Program, HighlightItem, Wing, Announcement, HomepageContent } from '../types';

/**
 * Upload an image or file to Supabase Storage with bucket routing
 * Returns the public URL of the uploaded asset
 */
export async function uploadToSupabaseStorage(
  file: File,
  bucket: 'events' | 'notices' | 'activities' | 'members' | 'gallery' | 'posters' | 'documents' | 'logos' = 'gallery'
): Promise<{ success: boolean; url?: string; message?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase is not configured' };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fileName = `${Date.now()}_${cleanFileName}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return { success: false, message: uploadError.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      success: true,
      url: data.publicUrl,
    };
  } catch (err: any) {
    console.error('Error in uploadToSupabaseStorage:', err);
    return { success: false, message: err.message || 'Storage upload failed' };
  }
}

/**
 * Remove an old asset from Supabase Storage by its public URL
 */
export async function deleteFromSupabaseStorage(
  publicUrl: string,
  bucket: 'events' | 'notices' | 'activities' | 'members' | 'gallery' | 'posters' | 'documents' | 'logos' = 'gallery'
): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured || !publicUrl) return false;

  try {
    // Extract the file path from the public URL
    const urlObj = new URL(publicUrl);
    const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${bucket}/`);
    if (pathParts.length < 2) return false;

    const filePath = decodeURIComponent(pathParts[1]);
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      console.warn('Could not delete old file from storage:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error deleting old storage file:', err);
    return false;
  }
}

/**
 * Fetch all content directly from Supabase tables
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
    ] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 'central').maybeSingle(),
      supabase.from('events').select('*').order('date', { ascending: false }),
      supabase.from('notices').select('*').order('is_pinned', { ascending: false }),
      supabase.from('activities').select('*').order('date', { ascending: false }),
      supabase.from('members').select('*').order('created_at', { ascending: true }),
      supabase.from('niics_directors').select('*').order('created_at', { ascending: true }),
      supabase.from('wings').select('*').order('name', { ascending: true }),
    ]);

    const settings = settingsRes.data;

    const homepage: HomepageContent = {
      heroTitle: settings?.hero_title || 'ANJUMAN-E-HUDA',
      heroSubtitle: settings?.hero_subtitle || 'The official apex central student organization steering intellectual vigor, cultural distinction, and student welfare across campus.',
      heroBadge: settings?.hero_badge || 'OFFICIAL APEX STUDENT BODY',
      heroBgUrl: settings?.hero_bg_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
      ctaMissionLabel: 'Union Charters & Mission',
      ctaProgramsLabel: 'Central Initiatives Calendar',
      aboutText: settings?.about_text || 'Founded in 1994, ANJUMAN-E-HUDA is the premier central student union orchestrating moral excellence, scholarly dialogues, community aid, and multidisciplinary competitions.',
      vision: settings?.vision || 'To nurture morally grounded, intellectually versatile leaders who enrich civil society and advance scholarly excellence.',
      mission: settings?.mission || 'Upholding student welfare through collaborative leadership, ethical representation, and progressive educational engagement.',
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
      isPinned: n.is_pinned,
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
      chairman: w.chairman,
      convener: w.convener,
      history: w.history || [],
    }));

    return {
      homepage,
      announcements,
      leaders,
      niicsInCharge,
      programs,
      highlights,
      wings,
      achievements: {
        totalAchievements: 48,
        totalOutreachInitiatives: 120,
        eventsOrganized: 85,
        activeMembers: 1200,
        items: [],
      },
      cau: {
        constitutionSummary: 'The Central Advisory Union charter balances collegiate representation with democratic governance.',
        councilMembersCount: 24,
        sessionTerm: '2026-27',
        latestResolutions: [],
      },
      rankings: {
        topWings: [],
        topParticipants: [],
      },
      contactSettings: {
        campusAddress: settings?.campus_address || 'Central Secretariat Quadrangle, Gate 4, Main Campus, Chemmad, Kerala 676306',
        officialEmail: settings?.official_email || 'central.union@anjumanehuda.org',
        helplinePhone: settings?.helpline_phone || '+91 98765 43210',
        secondaryPhone: settings?.secondary_phone || '+91 98765 43211',
        officeHours: settings?.office_hours || 'Mon - Sat: 08:30 AM - 05:30 PM (IST)',
        emergencyDesk: settings?.emergency_desk || 'Student Affairs Room 102 (24/7 Helpline available)',
      },
    };
  } catch (err) {
    console.error('Failed to fetch content from Supabase:', err);
    return null;
  }
}
