export type LeaderRole =
  | 'President'
  | 'General Secretary'
  | 'Treasurer'
  | 'Vice President'
  | 'Joint Secretary'
  | 'Executive Member'
  | (string & {});

export interface Leader {
  id: string;
  name: string;
  role: LeaderRole;
  tenure: string; // e.g. "2026-27", "2025-26", "2024-25"
  photo: string;
  department: string;
  quote?: string;
  email?: string;
  phone?: string;
  order?: number; // Duty & post sequence number (1 = Top/First, 2 = Second, etc.)
}

export interface CoreCommitteePoster {
  id: string;
  tenure: string; // e.g. "2026-27", "2025-26", "2024-25"
  posterUrl: string;
  title?: string;
  description?: string;
  uploadedAt?: string;
}

export interface NIICSInCharge {
  id: string;
  name: string;
  designation: string; // e.g. "Central NIICS In-Charge & Off-Campus Director"
  tenure: string; // e.g. "2026-27", "2025-26"
  photo: string;
  department: string;
  jurisdiction?: string;
  campuses?: string[];
  quote?: string;
  email?: string;
  phone?: string;
  officeLocation?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Circular' | 'Event Alert' | 'Notice' | 'Result' | string;
  date: string;
  summary: string;
  imageUrl?: string;
  fileUrl?: string;
  isPinned: boolean;
  urgency: 'normal' | 'high' | 'urgent';
}

export interface Program {
  id: string;
  title: string;
  category: 'Academic' | 'Cultural' | 'Leadership' | 'Outreach' | 'Sports' | "Religious & Ta'lim" | string;
  banner: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  tags: string[];
  status: 'Upcoming' | 'Live' | 'Completed';
  registrationLink?: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  category: 'All' | 'Event' | 'Announcement';
  imageUrl: string;
  date: string;
  description: string;
  tags: string[];
}

export interface WingHistoryEntry {
  tenure: string;
  chairman?: string;
  chairmanPhoto?: string;
  manager?: string; // backwards compatibility
  convener: string;
  convenerPhoto?: string;
  assistant?: string;
  keyMilestone?: string;
}

export interface WingProgram {
  id: string;
  wingId: string;
  wingName?: string;
  title: string; // Program Name
  targetClass: string; // Category / Class e.g. "Aliya 1st Year", "Sanawiya", "Fazilat", "All Campus Scholars"
  date: string; // YYYY-MM-DD
  academicYear: string; // e.g. "2026-27", "2025-26", "2024-25"
  month: string; // e.g. "October", "November" etc.
  description?: string;
  venue?: string;
  status?: 'Completed' | 'Upcoming' | 'Ongoing';
  createdAt?: string;
}

export interface Wing {
  id: string;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  status: 'Active' | 'Under Review' | 'Project Phase';
  currentTenure: string;
  chairman?: { name: string; contact?: string; photo?: string };
  chairmanPhoto?: string;
  manager?: { name: string; contact?: string; photo?: string };
  convener: { name: string; contact?: string; photo?: string };
  convenerPhoto?: string;
  assistant?: { name: string; contact?: string; photo?: string };
  history: WingHistoryEntry[];
}

export interface AchievementRecord {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  badge?: string;
}

export interface AchievementsData {
  totalAchievements: number;
  totalOutreachInitiatives: number;
  eventsOrganized: number;
  activeMembers: number;
  items: AchievementRecord[];
}

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroBgUrl: string;
  ctaMissionLabel: string;
  ctaProgramsLabel: string;
  aboutText: string;
  vision: string;
  mission: string;
}

export interface CAUData {
  constitutionSummary: string;
  councilMembersCount: number;
  sessionTerm: string;
  latestResolutions: Array<{
    id: string;
    title: string;
    date: string;
    fileNumber: string;
    status: 'Adopted' | 'In Review' | 'Gazetted';
  }>;
}

export interface RankingData {
  topWings: Array<{ rank: number; wingName: string; points: number; badge: string }>;
  topParticipants: Array<{
    rank: number;
    name: string;
    department: string;
    points: number;
    eventsWon: number;
    photo?: string;
  }>;
}

export type CAUResolution = CAUData['latestResolutions'][0];
export type TopWingStanding = RankingData['topWings'][0];
export type TopParticipant = RankingData['topParticipants'][0];

export interface ContactSettings {
  campusAddress: string;
  officialEmail: string;
  helplinePhone: string;
  secondaryPhone: string;
  officeHours: string;
  emergencyDesk: string;
}

export interface StudentInquiry {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  createdAt: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
}

export interface PillarItem {
  id: string;
  name: string; // e.g. "Ta'lim"
  englishTitle: string; // e.g. "Illuminated Education"
  desc: string; // e.g. "Rigor in modern disciplines and scholastic literacy."
  arabicMotto?: string;
  arabicMeaning?: string;
  colorName?: string;
  badge?: string;
  keyPoints?: string[];
  wingAffiliation?: string;
}

export interface SocialLink {
  id: string;
  platform: string; // e.g. "Instagram", "YouTube", "Facebook", "Twitter / X", "WhatsApp", "Telegram", "LinkedIn", "Website"
  url: string; // e.g. "https://instagram.com/anjuman_e_huda"
  icon: string; // "instagram" | "youtube" | "facebook" | "twitter" | "linkedin" | "whatsapp" | "telegram" | "globe" | custom
  isActive?: boolean;
  displayOrder?: number;
}

export type BannerOrientation = 'landscape' | 'portrait';

export interface Banner {
  id: string;
  title?: string;
  imageUrl: string; // Primary image (Landscape or Left Portrait)
  imageUrl2?: string; // Secondary image (Right Portrait in dual portrait pair)
  title2?: string; // Optional title for right portrait banner
  linkUrl?: string; // Link for primary image
  linkUrl2?: string; // Link for secondary image
  orientation: BannerOrientation; // 'landscape' | 'portrait'
  displayOrder?: number;
  isActive: boolean;
  createdAt?: string;
  fileSizeKb?: number;
  fileSizeKb2?: number;
}

export interface AppDatabase {
  homepage: HomepageContent;
  announcements: Announcement[];
  leaders: Leader[];
  coreCommitteePosters?: CoreCommitteePoster[];
  niicsInCharge?: NIICSInCharge[];
  programs: Program[];
  highlights: HighlightItem[];
  wings: Wing[];
  wingPrograms?: WingProgram[];
  achievements: AchievementsData;
  cau: CAUData;
  rankings: RankingData;
  contactSettings?: ContactSettings;
  inquiries?: StudentInquiry[];
  pillars?: PillarItem[];
  telemetry?: TelemetrySettings;
  socialLinks?: SocialLink[];
  banners?: Banner[];
}

export interface TelemetryCard {
  id: string;
  value: number;
  suffix: string;
  label: string;
  badge: string;
  trend: string;
  targetSection: string;
  color: 'emerald' | 'amber' | 'cyan' | 'purple' | string;
}

export interface TelemetrySettings {
  title: string;
  academicSession: string;
  hintText: string;
  cards: TelemetryCard[];
}
