import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { initialDatabase } from './src/defaultData.ts';
import { AppDatabase } from './src/types.ts';

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with generous payload limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure persistent data directory and file exist
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Read database
function readDb(): AppDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed: AppDatabase = JSON.parse(raw);
      if (!parsed.niicsInCharge || parsed.niicsInCharge.length === 0) {
        parsed.niicsInCharge = initialDatabase.niicsInCharge || [];
        writeDb(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading db.json, falling back to initial data:', err);
  }
  // Initialize with initialDatabase
  writeDb(initialDatabase);
  return initialDatabase;
}

// Write database atomically
function writeDb(data: AppDatabase): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

// Initialize db file on startup
readDb();

// Serve uploads statically
app.use('/uploads', express.static(UPLOAD_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${cleanName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// ======================== API ROUTES ========================

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ANJUMAN-E-HUDA Backend', timestamp: new Date().toISOString() });
});

// 2. Secret Admin Authentication
// Required credentials -> Username: anjuman, Password: anjuman2026
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'anjuman' && password === 'anjuman2026') {
    const token = `huda_auth_${Buffer.from(`anjuman:${Date.now()}`).toString('base64')}`;
    return res.json({
      success: true,
      message: 'Authentication successful. Welcome to ANJUMAN-E-HUDA Central Admin Panel.',
      token,
      user: {
        username: 'anjuman',
        role: 'Central Union Administrator',
        permissions: ['ALL_ACCESS'],
      },
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Access restricted to authorized ANJUMAN-E-HUDA executives.',
  });
});

// 3. Media Management: Drag & Drop upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file was uploaded.' });
  }
  const publicUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    url: publicUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// 4. Get all Content
app.get('/api/content', (_req, res) => {
  const data = readDb();
  res.json(data);
});

// 5. Update complete database
app.post('/api/content', (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid content payload' });
  }
  const current = readDb();
  const merged = { ...current, ...incoming };
  writeDb(merged);
  res.json({ success: true, data: merged });
});

// 6. Section updates
app.put('/api/homepage', (req, res) => {
  const db = readDb();
  db.homepage = { ...db.homepage, ...req.body };
  writeDb(db);
  res.json({ success: true, data: db.homepage });
});

app.put('/api/achievements', (req, res) => {
  const db = readDb();
  db.achievements = { ...db.achievements, ...req.body };
  writeDb(db);
  res.json({ success: true, data: db.achievements });
});

// Leaders CRUD
app.post('/api/leaders', (req, res) => {
  const db = readDb();
  const newLeader = {
    id: `ldr-${Date.now()}`,
    ...req.body,
  };
  db.leaders.unshift(newLeader);
  writeDb(db);
  res.json({ success: true, item: newLeader, leaders: db.leaders });
});

app.put('/api/leaders/:id', (req, res) => {
  const db = readDb();
  const index = db.leaders.findIndex((l) => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Leader not found' });
  }
  db.leaders[index] = { ...db.leaders[index], ...req.body };
  writeDb(db);
  res.json({ success: true, item: db.leaders[index], leaders: db.leaders });
});

app.delete('/api/leaders/:id', (req, res) => {
  const db = readDb();
  db.leaders = db.leaders.filter((l) => l.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, leaders: db.leaders });
});

// Pillars CRUD
app.get('/api/pillars', (_req, res) => {
  const db = readDb();
  res.json({ success: true, pillars: db.pillars || [] });
});

app.post('/api/pillars', (req, res) => {
  const db = readDb();
  if (!db.pillars) db.pillars = [];
  const newItem = {
    id: `pillar-${Date.now()}`,
    ...req.body,
  };
  db.pillars.push(newItem);
  writeDb(db);
  res.json({ success: true, item: newItem, pillars: db.pillars });
});

app.put('/api/pillars/:id', (req, res) => {
  const db = readDb();
  if (!db.pillars) db.pillars = [];
  const index = db.pillars.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Pillar not found' });
  }
  db.pillars[index] = { ...db.pillars[index], ...req.body };
  writeDb(db);
  res.json({ success: true, item: db.pillars[index], pillars: db.pillars });
});

app.delete('/api/pillars/:id', (req, res) => {
  const db = readDb();
  if (!db.pillars) db.pillars = [];
  db.pillars = db.pillars.filter((p: any) => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, pillars: db.pillars });
});

// NIICS In-Charge CRUD
app.get('/api/niics-incharge', (_req, res) => {
  const db = readDb();
  res.json({ success: true, niicsInCharge: db.niicsInCharge || [] });
});

app.post('/api/niics-incharge', (req, res) => {
  const db = readDb();
  if (!db.niicsInCharge) db.niicsInCharge = [];
  const newItem = {
    id: `niics-${Date.now()}`,
    ...req.body,
  };
  db.niicsInCharge.unshift(newItem);
  writeDb(db);
  res.json({ success: true, item: newItem, niicsInCharge: db.niicsInCharge });
});

app.put('/api/niics-incharge/:id', (req, res) => {
  const db = readDb();
  if (!db.niicsInCharge) db.niicsInCharge = [];
  const index = db.niicsInCharge.findIndex((n) => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'NIICS In-Charge not found' });
  }
  db.niicsInCharge[index] = { ...db.niicsInCharge[index], ...req.body };
  writeDb(db);
  res.json({ success: true, item: db.niicsInCharge[index], niicsInCharge: db.niicsInCharge });
});

app.delete('/api/niics-incharge/:id', (req, res) => {
  const db = readDb();
  if (!db.niicsInCharge) db.niicsInCharge = [];
  db.niicsInCharge = db.niicsInCharge.filter((n) => n.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, niicsInCharge: db.niicsInCharge });
});

// Programs CRUD
app.post('/api/programs', (req, res) => {
  const db = readDb();
  const newProg = {
    id: `prog-${Date.now()}`,
    ...req.body,
  };
  db.programs.unshift(newProg);
  writeDb(db);
  res.json({ success: true, item: newProg, programs: db.programs });
});

app.put('/api/programs/:id', (req, res) => {
  const db = readDb();
  const index = db.programs.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Program not found' });
  }
  db.programs[index] = { ...db.programs[index], ...req.body };
  writeDb(db);
  res.json({ success: true, item: db.programs[index], programs: db.programs });
});

app.delete('/api/programs/:id', (req, res) => {
  const db = readDb();
  db.programs = db.programs.filter((p) => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, programs: db.programs });
});

// Highlights CRUD
app.post('/api/highlights', (req, res) => {
  const db = readDb();
  const newHl = {
    id: `hl-${Date.now()}`,
    ...req.body,
  };
  db.highlights.unshift(newHl);
  writeDb(db);
  res.json({ success: true, item: newHl, highlights: db.highlights });
});

app.put('/api/highlights/:id', (req, res) => {
  const db = readDb();
  const index = db.highlights.findIndex((h) => h.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Highlight not found' });
  }
  db.highlights[index] = { ...db.highlights[index], ...req.body };
  writeDb(db);
  res.json({ success: true, item: db.highlights[index], highlights: db.highlights });
});

app.delete('/api/highlights/:id', (req, res) => {
  const db = readDb();
  db.highlights = db.highlights.filter((h) => h.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, highlights: db.highlights });
});

// Wings CRUD
app.post('/api/wings', (req, res) => {
  const db = readDb();
  const newWing = {
    id: `wing-${Date.now()}`,
    ...req.body,
  };
  db.wings.push(newWing);
  writeDb(db);
  res.json({ success: true, item: newWing, wings: db.wings });
});

app.put('/api/wings/:id', (req, res) => {
  const db = readDb();
  const index = db.wings.findIndex((w) => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Wing not found' });
  }
  db.wings[index] = { ...db.wings[index], ...req.body };
  writeDb(db);
  res.json({ success: true, item: db.wings[index], wings: db.wings });
});

app.delete('/api/wings/:id', (req, res) => {
  const db = readDb();
  db.wings = db.wings.filter((w) => w.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, wings: db.wings });
});

// Announcements CRUD
app.post('/api/announcements', (req, res) => {
  const db = readDb();
  const newAnn = {
    id: `ann-${Date.now()}`,
    ...req.body,
  };
  db.announcements.unshift(newAnn);
  writeDb(db);
  res.json({ success: true, item: newAnn, announcements: db.announcements });
});

app.put('/api/announcements/:id', (req, res) => {
  const db = readDb();
  const index = db.announcements.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Announcement not found' });
  }
  db.announcements[index] = { ...db.announcements[index], ...req.body };
  writeDb(db);
  res.json({ success: true, item: db.announcements[index], announcements: db.announcements });
});

app.delete('/api/announcements/:id', (req, res) => {
  const db = readDb();
  db.announcements = db.announcements.filter((a) => a.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, announcements: db.announcements });
});

// CAU Operations
app.put('/api/cau', (req, res) => {
  const db = readDb();
  db.cau = { ...db.cau, ...req.body };
  writeDb(db);
  res.json({ success: true, data: db.cau });
});

app.delete('/api/cau/resolutions/:id', (req, res) => {
  const db = readDb();
  if (db.cau && db.cau.latestResolutions) {
    db.cau.latestResolutions = db.cau.latestResolutions.filter((r) => r.id !== req.params.id);
    writeDb(db);
  }
  res.json({ success: true, cau: db.cau });
});

// Rankings Operations
app.put('/api/rankings', (req, res) => {
  const db = readDb();
  db.rankings = { ...db.rankings, ...req.body };
  writeDb(db);
  res.json({ success: true, data: db.rankings });
});

app.delete('/api/rankings/wings/:name', (req, res) => {
  const db = readDb();
  if (db.rankings && db.rankings.topWings) {
    db.rankings.topWings = db.rankings.topWings.filter((w) => w.wingName !== decodeURIComponent(req.params.name));
    writeDb(db);
  }
  res.json({ success: true, rankings: db.rankings });
});

app.delete('/api/rankings/participants/:name', (req, res) => {
  const db = readDb();
  if (db.rankings && db.rankings.topParticipants) {
    db.rankings.topParticipants = db.rankings.topParticipants.filter((p) => p.name !== decodeURIComponent(req.params.name));
    writeDb(db);
  }
  res.json({ success: true, rankings: db.rankings });
});

// Contact & Inquiries Operations
app.put('/api/contact-settings', (req, res) => {
  const db = readDb();
  db.contactSettings = { ...db.contactSettings, ...req.body };
  writeDb(db);
  res.json({ success: true, data: db.contactSettings });
});

app.delete('/api/inquiries/:id', (req, res) => {
  const db = readDb();
  if (db.inquiries) {
    db.inquiries = db.inquiries.filter((inq) => inq.id !== req.params.id);
    writeDb(db);
  }
  res.json({ success: true, inquiries: db.inquiries });
});

// Reset to seed data
app.post('/api/reset-seed', (_req, res) => {
  writeDb(initialDatabase);
  res.json({ success: true, data: initialDatabase });
});

// ======================== SERVER & VITE ========================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ANJUMAN-E-HUDA server is active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
