export type LeaderRole =
  | 'President'
  | 'General Secretary'
  | 'Treasurer'
  | 'Vice President'
  | 'Joint Secretary'
  | 'Executive Member';

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
  category: 'Circular' | 'Event Alert' | 'Notice' | 'Result';
  date: string;
  summary: string;
  fileUrl?: string;
  isPinned: boolean;
  urgency: 'normal' | 'high' | 'urgent';
}

export interface Program {
  id: string;
  title: string;
  category: 'Academic' | 'Cultural' | 'Leadership' | 'Outreach' | 'Sports' | "Religious & Ta'lim";
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
  manager?: string; // backwards compatibility
  convener: string;
  assistant?: string;
  keyMilestone?: string;
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
  manager?: { name: string; contact?: string; photo?: string };
  convener: { name: string; contact?: string; photo?: string };
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

export interface AppDatabase {
  homepage: HomepageContent;
  announcements: Announcement[];
  leaders: Leader[];
  niicsInCharge?: NIICSInCharge[];
  programs: Program[];
  highlights: HighlightItem[];
  wings: Wing[];
  achievements: AchievementsData;
  cau: CAUData;
  rankings: RankingData;
  contactSettings?: ContactSettings;
  inquiries?: StudentInquiry[];
}
