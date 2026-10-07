const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = process.env.VITE_SUPABASE_URL || 'https://zfvyxvajgnodiatiqyoh.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmdnl4dmFqZ25vZGlhdGlxeW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNjAyNzcsImV4cCI6MjEwNTczNjI3N30.ZzJc6f-p6U3jL0Zf3-z3kC8YqP1yR4n0-Yg9jK9q9_A';

const supabase = createClient(url, key);

async function fullSync() {
  console.log('[Supabase Sync] Starting sync...');
  const t0 = Date.now();

  try {
    const [
      eventsRes,
      noticesRes,
      activitiesRes,
      membersRes,
      niicsRes,
      wingsRes,
      postersRes,
      wpRes,
    ] = await Promise.all([
      supabase.from('events').select('*').order('date', { ascending: false }),
      supabase.from('notices').select('*').order('is_pinned', { ascending: false }),
      supabase.from('activities').select('*').order('date', { ascending: false }),
      supabase.from('members').select('*').order('created_at', { ascending: true }),
      supabase.from('niics_directors').select('*').order('created_at', { ascending: true }),
      supabase.from('wings').select('*').order('name', { ascending: true }),
      supabase.from('core_committee_posters').select('*').order('tenure', { ascending: false }),
      supabase.from('wing_programs').select('*').order('date', { ascending: false }),
    ]);

    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    let currentDb = {};
    if (fs.existsSync(dbPath)) {
      try {
        currentDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      } catch (e) {
        currentDb = {};
      }
    }

    // 1. Programs (from Supabase 'events')
    if (eventsRes.data && eventsRes.data.length > 0) {
      currentDb.programs = eventsRes.data.map(e => ({
        id: e.id,
        title: e.title,
        category: e.category,
        banner: e.banner || '',
        date: e.date,
        time: e.time || '',
        venue: e.venue || '',
        description: e.description || '',
        tags: e.tags || [],
        status: e.status || 'Completed',
        registrationLink: e.registration_link || '',
      }));
      console.log(`[Supabase Sync] Synced ${currentDb.programs.length} programs`);
    }

    // 2. Leaders (from Supabase 'members')
    if (membersRes.data && membersRes.data.length > 0) {
      currentDb.leaders = membersRes.data.map(m => {
        let photo = m.photo || '';
        // If photo matches the whatsapp pattern, use the 200 OK storage URL
        if (m.id === 'mbr_1790513192534') {
          photo = 'https://zfvyxvajgnodiatiqyoh.supabase.co/storage/v1/object/public/members/1790513168625_whatsapp_image_2026_09_27_at_5_42_03_pm.jpeg';
        } else if (m.id === 'mbr_1790513273181') {
          photo = 'https://zfvyxvajgnodiatiqyoh.supabase.co/storage/v1/object/public/members/1790513240766_whatsapp_image_2026_09_27_at_5_42_49_pm.webp';
        } else if (m.id === 'mbr_1790513359652') {
          photo = 'https://zfvyxvajgnodiatiqyoh.supabase.co/storage/v1/object/public/members/1790513358092_whatsapp_image_2026_09_27_at_5_41_23_pm.jpeg';
        } else if (m.id === 'mbr_1790513339531') {
          photo = 'https://zfvyxvajgnodiatiqyoh.supabase.co/storage/v1/object/public/members/1790513336999_whatsapp_image_2026_09_27_at_5_42_27_pm.webp';
        } else if (m.id === 'mbr_1790960830424') {
          photo = 'https://zfvyxvajgnodiatiqyoh.supabase.co/storage/v1/object/public/members/1790960804254_gulshad.webp';
        }

        return {
          id: m.id,
          name: m.name,
          role: m.role,
          tenure: m.tenure || '2026-27',
          photo: photo,
          department: m.department || '',
          quote: m.quote || '',
          email: m.email || '',
          phone: m.phone || '',
          order: typeof m.order_index === 'number' ? m.order_index : (typeof m.order === 'number' ? m.order : undefined),
        };
      });
      console.log(`[Supabase Sync] Synced ${currentDb.leaders.length} leaders`);
    }

    // 3. Core Committee Posters
    if (postersRes.data && postersRes.data.length > 0) {
      currentDb.coreCommitteePosters = postersRes.data.map(p => ({
        id: p.id,
        tenure: p.tenure,
        posterUrl: p.poster_url || p.posterUrl,
        title: p.title || ('Core Committee ' + p.tenure),
        description: p.description || '',
        uploadedAt: p.created_at || '',
      }));
      console.log(`[Supabase Sync] Synced ${currentDb.coreCommitteePosters.length} core committee posters`);
    }

    // 4. NIICS In-Charge
    if (niicsRes.data && niicsRes.data.length > 0) {
      currentDb.niicsInCharge = niicsRes.data.map(n => ({
        id: n.id,
        name: n.name,
        designation: n.designation || 'Central NIICS In-Charge',
        tenure: '2026-27',
        photo: 'https://zfvyxvajgnodiatiqyoh.supabase.co/storage/v1/object/public/members/1790959869831_ali_ustad.jpeg',
        department: n.department || 'Central NIICS In-Charge & Academic Harmonization',
        jurisdiction: n.jurisdiction || 'Supervisory Jurisdiction across all 6 Recognized Off-Campuses',
        campuses: n.campuses || [
          'DH NIICS Chemmad',
          'DH NIICS Hangal',
          'DH NIICS Punganur',
          'DH NIICS Maharashtra',
          'DH NIICS Assam',
          'DH NIICS West Bengal'
        ],
        quote: n.quote || '',
        email: n.email || 'muhammedalihudawi@gmail.com',
        phone: n.phone || '7070502477',
        officeLocation: n.office_location || 'DARUL HUDA ISLAMIC UNIVERSITY',
      }));
      console.log(`[Supabase Sync] Synced ${currentDb.niicsInCharge.length} NIICS In-Charge`);
    }

    // 5. Wing Programs
    if (wpRes.data && wpRes.data.length > 0) {
      currentDb.wingPrograms = wpRes.data.map(wp => ({
        id: wp.id,
        wingId: wp.wing_id || wp.wingId,
        wingName: wp.wing_name || wp.wingName || '',
        title: wp.title || wp.program_name || '',
        targetClass: wp.target_class || wp.targetClass || wp.category || '',
        date: wp.date || '',
        academicYear: wp.academic_year || wp.academicYear || wp.year || '2026-27',
        month: wp.month || '',
        description: wp.description || '',
        venue: wp.venue || '',
        status: wp.status || 'Completed',
        createdAt: wp.created_at || '',
      }));
      console.log(`[Supabase Sync] Synced ${currentDb.wingPrograms.length} wing programs`);
    }

    // 6. Notices (Announcements)
    if (noticesRes.data && noticesRes.data.length > 0) {
      currentDb.announcements = noticesRes.data.map(n => ({
        id: n.id,
        title: n.title,
        category: n.category || 'Notice',
        date: n.date,
        summary: n.summary || '',
        imageUrl: n.image_url || n.file_url || '',
        fileUrl: n.file_url || n.image_url || '',
        isPinned: Boolean(n.is_pinned),
        urgency: n.urgency || 'normal',
      }));
      console.log(`[Supabase Sync] Synced ${currentDb.announcements.length} announcements`);
    }

    // 7. Highlights
    if (activitiesRes.data && activitiesRes.data.length > 0) {
      currentDb.highlights = activitiesRes.data.map(a => ({
        id: a.id,
        title: a.title,
        category: a.category || 'Event',
        imageUrl: a.image_url || '',
        date: a.date,
        description: a.description || '',
        tags: a.tags || [],
      }));
      console.log(`[Supabase Sync] Synced ${currentDb.highlights.length} highlights`);
    }

    // 8. Wings (with lightweight photos)
    if (wingsRes.data && wingsRes.data.length > 0) {
      currentDb.wings = wingsRes.data.map(w => {
        let ch = typeof w.chairman === 'string' ? JSON.parse(w.chairman) : (w.chairman || {});
        let co = typeof w.convener === 'string' ? JSON.parse(w.convener) : (w.convener || {});
        let chPhoto = w.chairman_photo || ch.photo || '';
        let coPhoto = w.convener_photo || co.photo || '';

        // Extract base64 to uploads file to keep payload lightweight (~30 KB)
        if (chPhoto && chPhoto.startsWith('data:image')) {
          const match = chPhoto.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (match) {
            const fn = 'wing_' + w.id + '_chairman.' + (match[1] === 'jpeg' ? 'jpg' : match[1]);
            const target = path.join(process.cwd(), 'public', 'uploads', fn);
            if (!fs.existsSync(target)) {
              fs.writeFileSync(target, Buffer.from(match[2], 'base64'));
            }
            chPhoto = '/uploads/' + fn;
          }
        }
        if (coPhoto && coPhoto.startsWith('data:image')) {
          const match = coPhoto.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (match) {
            const fn = 'wing_' + w.id + '_convener.' + (match[1] === 'jpeg' ? 'jpg' : match[1]);
            const target = path.join(process.cwd(), 'public', 'uploads', fn);
            if (!fs.existsSync(target)) {
              fs.writeFileSync(target, Buffer.from(match[2], 'base64'));
            }
            coPhoto = '/uploads/' + fn;
          }
        }

        return {
          id: w.id,
          name: w.name,
          shortName: w.short_name || w.name,
          description: w.description || '',
          iconName: w.icon_name || 'BookOpen',
          status: w.status || 'Active',
          currentTenure: w.current_tenure || '2026-27',
          chairman: {
            name: ch.name || '',
            contact: ch.contact || '',
            photo: chPhoto,
          },
          chairmanPhoto: chPhoto,
          convener: {
            name: co.name || '',
            contact: co.contact || '',
            photo: coPhoto,
          },
          convenerPhoto: coPhoto,
          history: Array.isArray(w.history) ? w.history : [],
        };
      });
      console.log(`[Supabase Sync] Synced ${currentDb.wings.length} wings`);
    }

    fs.writeFileSync(dbPath, JSON.stringify(currentDb, null, 2));
    console.log(`[Supabase Sync] Successfully saved to ${dbPath} in ${Date.now() - t0}ms. Size: ${fs.statSync(dbPath).size} bytes`);
  } catch (err) {
    console.error('[Supabase Sync] Error during sync:', err);
  }
}

fullSync();
