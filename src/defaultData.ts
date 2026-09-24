import { AppDatabase } from './types';

export const initialDatabase: AppDatabase = {
  homepage: {
    heroTitle: "ANJUMAN-E-HUDA",
    heroSubtitle:
      "Dedicated to intellectual rigor, moral stewardship, student empowerment, and visionary community leadership at the heart of our campus.",
    heroBadge: "NIICS STUDENTS' UNION",
    heroBgUrl:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80",
    ctaMissionLabel: "Discover Mission",
    ctaProgramsLabel: "Recent Programs",
    aboutText:
      "ANJUMAN-E-HUDA is the premier student governing union committed to fostering academic excellence, moral leadership, social harmony, and creative enrichment across all departments. Founded on the principle of Ta'lim (intellectual and spiritual illumination), the union serves as the unified voice and catalyst for student welfare and progress.",
    vision:
      "To sculpt enlightened scholars and ethical trailblazers capable of positively impacting society through knowledge, service, and universal brotherhood.",
    mission:
      "To foster an inclusive campus environment, champion democratic student representation, organize transformative academic and socio-cultural initiatives, and nurture holistic talent.",
  },
  announcements: [
    {
      id: 'ann-1',
      title: 'Annual Grand Ta\'lim Convocation & Youth Summit 2026 Announced',
      category: 'Event Alert',
      date: '2026-09-20',
      summary:
        'Registration is now open for the 32nd Annual Grand Summit. Distinguished speakers and international delegates will deliberate on ethical education.',
      isPinned: true,
      urgency: 'urgent',
    },
    {
      id: 'ann-2',
      title: 'Central Academic Union (CAU) Gazette No. 4/2026: Welfare Grants Released',
      category: 'Circular',
      date: '2026-09-15',
      summary:
        'Executive committee sanctioned 45 student research fellowships and hardship welfare allocations for the autumn semester.',
      isPinned: true,
      urgency: 'high',
    },
    {
      id: 'ann-3',
      title: 'Inter-Departmental Debating Championship: Final Round Schedule',
      category: 'Notice',
      date: '2026-09-10',
      summary:
        'Final parliamentary debates will take place at the Central Auditorium on Saturday, 10:00 AM sharp.',
      isPinned: false,
      urgency: 'normal',
    },
    {
      id: 'ann-4',
      title: 'Results Declared: Union Literary & Calligraphy Fest 2026',
      category: 'Result',
      date: '2026-09-05',
      summary:
        'The Department of Humanities and Arabic Studies secures first position in traditional calligraphy and poetry recitation.',
      isPinned: false,
      urgency: 'normal',
    },
  ],
  leaders: [
    {
      id: 'ldr-1',
      name: 'Muhammad Farhan Qasmi',
      role: 'President',
      tenure: '2026-27',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      department: 'Department of Islamic Studies & Jurisprudence',
      quote:
        "Leadership is a trust, an Amanah. Our compass is sincere service to every student on this campus.",
      email: 'president@anjumanehuda.org',
      phone: '+91 98765 43210',
    },
    {
      id: 'ldr-2',
      name: 'Sayyid Adil Hashmi',
      role: 'General Secretary',
      tenure: '2026-27',
      photo:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      department: 'Department of Computer Science & Media',
      quote:
        'Bridging age-old wisdom with cutting-edge student innovation across every wing.',
      email: 'gensec@anjumanehuda.org',
      phone: '+91 98765 43211',
    },
    {
      id: 'ldr-3',
      name: 'Zayan Tariq Al-Huda',
      role: 'Treasurer',
      tenure: '2026-27',
      photo:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
      department: 'Department of Economics & Commerce',
      quote:
        'Uncompromising fiscal transparency and equitable fund allocation for maximum student benefit.',
      email: 'treasurer@anjumanehuda.org',
      phone: '+91 98765 43212',
    },
    {
      id: 'ldr-4',
      name: 'Shafeequr Rahman',
      role: 'Vice President',
      tenure: '2026-27',
      photo:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      department: 'Department of Political Science',
      quote:
        'Empowering minority voices and fostering an environment of active campus participation.',
      email: 'vp@anjumanehuda.org',
    },
    {
      id: 'ldr-5',
      name: 'Amaanullah Ansari',
      role: 'President',
      tenure: '2025-26',
      photo:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      department: 'Department of English Literature',
      quote:
        'Nurtured 12 groundbreaking student research platforms during our proud tenure.',
      email: 'archive.2025@anjumanehuda.org',
    },
    {
      id: 'ldr-6',
      name: 'Irfan Masroor',
      role: 'General Secretary',
      tenure: '2025-26',
      photo:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      department: 'Department of Physics & Technology',
      quote: 'Streamlined campus digital grievance and welfare protocols.',
      email: 'archive.gensec25@anjumanehuda.org',
    },
    {
      id: 'ldr-7',
      name: 'Bilal Ahmad Nadwi',
      role: 'Treasurer',
      tenure: '2025-26',
      photo:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
      department: 'Faculty of Law',
      quote: 'Maintained 100% audited institutional reserves.',
      email: 'archive.tr25@anjumanehuda.org',
    },
    {
      id: 'ldr-8',
      name: 'Dr. Tariq Anwar Siddiqui',
      role: 'President',
      tenure: '2024-25',
      photo:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      department: 'Department of History & Civilizations',
      quote: 'Spearheaded the 30th Anniversary Golden Jubilee Convention.',
    },
  ],
  niicsInCharge: [
    {
      id: 'niics-ic-1',
      name: 'Dr. Sayyid M. Zubair Al-Bukhari',
      designation: 'Central NIICS In-Charge & Off-Campus Director',
      tenure: '2026-27',
      photo:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80',
      department: 'Central Directorate of Off-Campus Affairs & Academic Harmonization',
      jurisdiction: 'Supervisory Jurisdiction across all 6 Recognized Off-Campuses',
      campuses: [
        'DH NIICS Chemmad',
        'DH NIICS Hangal',
        'DH NIICS Punganur',
        'DH NIICS Maharashtra',
        'DH NIICS Assam',
        'DH NIICS West Bengal',
      ],
      quote:
        'Directing moral discipline, integrated curricula, and empowering student welfare across all regional NIICS off-campuses under one unified union vision.',
      email: 'niics.director@anjumanehuda.org',
      phone: '+91 98765 43220',
      officeLocation: 'Directorate Wing, Central Secretariat Quadrangle, Gate 4',
    },
  ],
  programs: [
    {
      id: 'prog-1',
      title: 'National Intellectual Seminar: Faith, Ethics & Artificial Intelligence',
      category: 'Academic',
      banner:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      date: '2026-10-12',
      time: '09:30 AM - 04:30 PM',
      venue: 'Main University Auditorium & Live Stream',
      description:
        'A flagship academic symposium bringing together ethicists, computer scientists, and scholars to deliberate moral boundaries in modern technological evolution.',
      tags: ['Symposium', 'Ethics', 'Tech & AI', 'Academic'],
      status: 'Upcoming',
      registrationLink: '#register',
    },
    {
      id: 'prog-2',
      title: 'Al-Bayan: Annual Inter-College Declamation & Debating Gala',
      category: 'Cultural',
      banner:
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
      date: '2026-10-25',
      time: '10:00 AM - 06:00 PM',
      venue: 'Al-Huda Heritage Hall',
      description:
        'Celebrating oratory mastery in English, Urdu, and Arabic. Over 28 collegiate teams competing for the coveted Rolling Trophy.',
      tags: ['Debate', 'Oratory', 'Trophy', 'Inter-Collegiate'],
      status: 'Upcoming',
      registrationLink: '#register',
    },
    {
      id: 'prog-3',
      title: 'Rahma Blood Donation & Free Health Screening Camp',
      category: 'Outreach',
      banner:
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      date: '2026-09-28',
      time: '08:00 AM - 03:00 PM',
      venue: 'Campus Medical Quadrangle',
      description:
        'Organized in coordination with the Red Crescent and State Blood Bank, offering free preventive health diagnostics and voluntary donation drives.',
      tags: ['Community', 'Healthcare', 'Social Welfare'],
      status: 'Live',
      registrationLink: '#volunteer',
    },
    {
      id: 'prog-4',
      title: 'Tarbiyah & Character Development Immersion Retreat',
      category: "Religious & Ta'lim",
      banner:
        'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
      date: '2026-08-18',
      time: 'Full Weekend Session',
      venue: 'Pine Hills Spiritual Center',
      description:
        'Intensive weekend retreat addressing inner spirituality, time stewardship, moral integrity, and brotherhood.',
      tags: ['Ta\'lim', 'Tarbiyah', 'Spiritual', 'Workshop'],
      status: 'Completed',
    },
    {
      id: 'prog-5',
      title: 'Huda Champions League: Inter-Wing Football Tournament',
      category: 'Sports',
      banner:
        'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
      date: '2026-08-02',
      time: '04:00 PM Daily',
      venue: 'Union Central Sports Complex',
      description:
        'High-voltage sporting contest featuring all 6 operational wings competing across group stages and knockout finals.',
      tags: ['Sports', 'Football', 'Athletics', 'Unity'],
      status: 'Completed',
    },
    {
      id: 'prog-6',
      title: 'Leadership Incubator: Public Policy & Union Governance Masterclass',
      category: 'Leadership',
      banner:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      date: '2026-07-22',
      time: '02:00 PM - 05:00 PM',
      venue: 'Council Chambers',
      description:
        'Specialized workshop for emerging student leaders on parliamentary procedure, drafting union resolutions, and conflict mediation.',
      tags: ['Leadership', 'Governance', 'CAU'],
      status: 'Completed',
    },
  ],
  highlights: [
    {
      id: 'hl-1',
      title: 'Oath-Taking Ceremony of 2026-27 Executive Council',
      category: 'Event',
      imageUrl:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      date: '2026-09-01',
      description:
        'The newly elected union leaders take solemn oath before the Patron and thousands of students gathered in the central courtyard.',
      tags: ['Oath Ceremony', 'Leadership', 'Council'],
    },
    {
      id: 'hl-2',
      title: 'Grand Ta\'lim Book Exhibition & Heritage Calligraphy Pavilion',
      category: 'Event',
      imageUrl:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
      date: '2026-08-25',
      description:
        'Over 5,000 scholarly volumes showcased alongside rare historical manuscripts and student Arabic calligraphy pieces.',
      tags: ['Exhibition', 'Books', 'Art', 'Heritage'],
    },
    {
      id: 'hl-3',
      title: 'Gazette Release & Union Annual Bulletin Unveiling',
      category: 'Announcement',
      imageUrl:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      date: '2026-08-14',
      description:
        'Official unveiling of the commemorative issue of Al-Huda Journal, spotlighting outstanding student research and union initiatives.',
      tags: ['Publication', 'Gazette', 'Media'],
    },
    {
      id: 'hl-4',
      title: 'Emergency Community Relief Delegation Dispatch',
      category: 'Event',
      imageUrl:
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      date: '2026-07-30',
      description:
        'Union volunteers packing and transporting 1,200 humanitarian aid kits for flood-affected families in the riverine district.',
      tags: ['Outreach', 'Humanitarian', 'Relief'],
    },
    {
      id: 'hl-5',
      title: 'Inter-Collegiate Qira\'at & Quranic Recitation Champions',
      category: 'Event',
      imageUrl:
        'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=1200&q=80',
      date: '2026-07-15',
      description:
        'Felicitation of winners in the prestigious All-India Holy Quran Recitation and Tajweed Competition.',
      tags: ['Qiraat', 'Spiritual', 'Honors'],
    },
    {
      id: 'hl-6',
      title: 'National Student Welfare Policy Circular Circular No. 9',
      category: 'Announcement',
      imageUrl:
        'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      date: '2026-06-28',
      description:
        'Central Academic Union notice approving zero-cost digital textbook access for first-year scholars across all faculties.',
      tags: ['Policy', 'Scholarship', 'Welfare'],
    },
  ],
  wings: [
    {
      id: 'wing-1',
      name: "Da'wah & Moral Guidance Wing",
      shortName: 'DMW',
      description:
        'Dedicated to spiritual elevation, weekly Halaqas, ethics workshops, Friday congregation oversight, and interfaith understanding.',
      iconName: 'Sparkles',
      status: 'Active',
      currentTenure: '2026-27',
      chairman: {
        name: 'Hafiz Umair Farooqi',
        contact: 'umair.dmw@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      },
      manager: {
        name: 'Hafiz Umair Farooqi',
        contact: 'umair.dmw@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      },
      convener: {
        name: 'Zubair Al-Ameen',
        contact: 'zubair.dmw@anjuman.edu',
      },
      assistant: {
        name: 'Saad bin Khalid',
        contact: 'saad.dmw@anjuman.edu',
      },
      history: [
        {
          tenure: '2026-27',
          chairman: 'Hafiz Umair Farooqi',
          manager: 'Hafiz Umair Farooqi',
          convener: 'Zubair Al-Ameen',
          assistant: 'Saad bin Khalid',
          keyMilestone: 'Launched campus-wide Spiritual Mentorship Circle reaching 800+ students.',
        },
        {
          tenure: '2025-26',
          chairman: 'Maulana Danish Wani',
          manager: 'Maulana Danish Wani',
          convener: 'Taha Masood',
          assistant: 'Ammar Yasir',
          keyMilestone: 'Organized Ramadan Iftar feeding for 14,000 on-campus scholars.',
        },
        {
          tenure: '2024-25',
          chairman: 'Suhail Quraishi',
          manager: 'Suhail Quraishi',
          convener: 'Noman Siddiqui',
          assistant: 'Areeb Khan',
          keyMilestone: 'Renovated student prayer halls and installed sound acoustics.',
        },
      ],
    },
    {
      id: 'wing-2',
      name: 'Literature, Oratory & Arts Wing',
      shortName: 'LAW',
      description:
        'Custodians of bilingual journalism, creative expression, parliamentary debate clubs, calligraphy circles, and annual wall-magazines.',
      iconName: 'BookOpen',
      status: 'Active',
      currentTenure: '2026-27',
      chairman: {
        name: 'Rayyan Shibli',
        contact: 'rayyan.lit@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      },
      manager: {
        name: 'Rayyan Shibli',
        contact: 'rayyan.lit@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      },
      convener: {
        name: 'Hamza Kausar',
        contact: 'hamza.lit@anjuman.edu',
      },
      assistant: {
        name: 'Danish Alam',
        contact: 'danish.lit@anjuman.edu',
      },
      history: [
        {
          tenure: '2026-27',
          chairman: 'Rayyan Shibli',
          manager: 'Rayyan Shibli',
          convener: 'Hamza Kausar',
          assistant: 'Danish Alam',
          keyMilestone: 'Published quarterly peer-reviewed student literary journal "Nawa-e-Huda".',
        },
        {
          tenure: '2025-26',
          chairman: 'Asim Manzoor',
          manager: 'Asim Manzoor',
          convener: 'Faizan Elahi',
          assistant: 'Shoaib Akhtar',
          keyMilestone: 'Won 1st prize at National Parliamentary Debate Conclave.',
        },
        {
          tenure: '2024-25',
          chairman: 'Tariq Jameel Nadwi',
          manager: 'Tariq Jameel Nadwi',
          convener: 'Haris Kamal',
          assistant: 'Zakir Husain',
          keyMilestone: 'Hosted international Urdu & Arabic Ghazal recitation evening.',
        },
      ],
    },
    {
      id: 'wing-3',
      name: 'Social Service & Disaster Relief Wing',
      shortName: 'SSW',
      description:
        'The philanthropic vanguard driving emergency flood relief, free community medical camps, orphan sponsorship, and winter warmth drives.',
      iconName: 'HeartHandshake',
      status: 'Active',
      currentTenure: '2026-27',
      chairman: {
        name: 'Aasim Barkati',
        contact: 'aasim.relief@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      },
      manager: {
        name: 'Aasim Barkati',
        contact: 'aasim.relief@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      },
      convener: {
        name: 'Mudassir Latif',
        contact: 'mudassir.relief@anjuman.edu',
      },
      assistant: {
        name: 'Kamran Zia',
        contact: 'kamran.relief@anjuman.edu',
      },
      history: [
        {
          tenure: '2026-27',
          chairman: 'Aasim Barkati',
          manager: 'Aasim Barkati',
          convener: 'Mudassir Latif',
          assistant: 'Kamran Zia',
          keyMilestone: 'Distributed 2,500 flood relief food kits across eastern wetlands.',
        },
        {
          tenure: '2025-26',
          chairman: 'Mushtaq Ahmad',
          manager: 'Mushtaq Ahmad',
          convener: 'Iqbal Javed',
          assistant: 'Sharif Raza',
          keyMilestone: 'Set up 10 clean drinking water filtration kiosks in nearby villages.',
        },
      ],
    },
    {
      id: 'wing-4',
      name: 'IT, Media & Digital Broadcast Wing',
      shortName: 'IMW',
      description:
        'Managing live event webcasts, union portal development, cybersecurity workshops, graphic branding, and video documentary production.',
      iconName: 'Laptop',
      status: 'Active',
      currentTenure: '2026-27',
      chairman: {
        name: 'Zohran Sheikh',
        contact: 'media@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      },
      manager: {
        name: 'Zohran Sheikh',
        contact: 'media@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      },
      convener: {
        name: 'Sameer Hashmi',
        contact: 'broadcast@anjuman.edu',
      },
      assistant: {
        name: 'Waleed Mustafa',
        contact: 'dev@anjuman.edu',
      },
      history: [
        {
          tenure: '2026-27',
          chairman: 'Zohran Sheikh',
          manager: 'Zohran Sheikh',
          convener: 'Sameer Hashmi',
          assistant: 'Waleed Mustafa',
          keyMilestone: 'Launched new high-speed Union Portal with dynamic real-time database.',
        },
        {
          tenure: '2025-26',
          chairman: 'Fahad Rizvi',
          manager: 'Fahad Rizvi',
          convener: 'Naveed Zafar',
          assistant: 'Adeel Khan',
          keyMilestone: 'Reached 100K YouTube subscribers on official union media channel.',
        },
      ],
    },
    {
      id: 'wing-5',
      name: 'Sports & Athletic Fitness Wing',
      shortName: 'SFW',
      description:
        'Fostering physical discipline, inter-collegiate tournaments in football, cricket, table tennis, track athletics, and martial arts.',
      iconName: 'Trophy',
      status: 'Active',
      currentTenure: '2026-27',
      chairman: {
        name: 'Capt. Arshad Malik',
        contact: 'sports@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      },
      manager: {
        name: 'Capt. Arshad Malik',
        contact: 'sports@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      },
      convener: {
        name: 'Junaid Pathan',
        contact: 'athletics@anjuman.edu',
      },
      assistant: {
        name: 'Omer Basheer',
        contact: 'fitness@anjuman.edu',
      },
      history: [
        {
          tenure: '2026-27',
          chairman: 'Capt. Arshad Malik',
          manager: 'Capt. Arshad Malik',
          convener: 'Junaid Pathan',
          assistant: 'Omer Basheer',
          keyMilestone: 'Upgraded stadium turf lighting and launched Inter-Wing Football Cup.',
        },
        {
          tenure: '2025-26',
          chairman: 'Sarmad Bukhari',
          manager: 'Sarmad Bukhari',
          convener: 'Shahrukh Khan',
          assistant: 'Imran Baig',
          keyMilestone: 'Won State University Cricket Championship.',
        },
      ],
    },
    {
      id: 'wing-6',
      name: 'Academic Research & Career Guidance Wing',
      shortName: 'ACW',
      description:
        'Organizing civil service coaching, fellowship application mentorship, language labs, and international graduate study seminars.',
      iconName: 'GraduationCap',
      status: 'Active',
      currentTenure: '2026-27',
      chairman: {
        name: 'Dr. (Cand.) Burhanuddin',
        contact: 'research@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      },
      manager: {
        name: 'Dr. (Cand.) Burhanuddin',
        contact: 'research@anjuman.edu',
        photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      },
      convener: {
        name: 'Mohsin Shafi',
        contact: 'careers@anjuman.edu',
      },
      assistant: {
        name: 'Yasir Hameed',
        contact: 'fellowships@anjuman.edu',
      },
      history: [
        {
          tenure: '2026-27',
          chairman: 'Dr. (Cand.) Burhanuddin',
          manager: 'Dr. (Cand.) Burhanuddin',
          convener: 'Mohsin Shafi',
          assistant: 'Yasir Hameed',
          keyMilestone: 'Mentored 38 scholars securing national postgraduate fellowships.',
        },
      ],
    },
  ],
  achievements: {
    totalAchievements: 142,
    totalOutreachInitiatives: 89,
    eventsOrganized: 310,
    activeMembers: 4250,
    items: [
      {
        id: 'ach-1',
        title: 'National Best Collegiate Union Award',
        category: 'Governance & Leadership',
        year: '2025-26',
        description:
          'Conferred by the All-India Council of Student Bodies for stellar democratic process, transparency, and social impact.',
        badge: 'National Distinction',
      },
      {
        id: 'ach-2',
        title: 'Excellence in Humanitarian Disaster Mitigation',
        category: 'Outreach & Social Service',
        year: '2025',
        description:
          'Recognized by District Administration for providing 30,000+ meals and medical support during severe regional crises.',
        badge: 'Civic Honor',
      },
      {
        id: 'ach-3',
        title: '1st Position: Inter-University Arabic Oratory Cup',
        category: 'Academic & Literary',
        year: '2026',
        description:
          'Union debating squad clinched the championship against 34 national university delegations in New Delhi.',
        badge: 'Gold Trophy',
      },
      {
        id: 'ach-4',
        title: '100% Digital Open-Access Scholarly Repository',
        category: 'Innovation & IT',
        year: '2026',
        description:
          'Built custom cloud library housing 12,000+ digitized manuscripts, academic papers, and lecture archives freely accessible to all.',
        badge: 'Tech Milestone',
      },
      {
        id: 'ach-5',
        title: 'State Inter-College Athletics Overall Championship',
        category: 'Sports & Athletics',
        year: '2024-25',
        description:
          'Union track and field team secured 18 Gold, 12 Silver, and 9 Bronze medals across 22 competitive events.',
        badge: 'Champions',
      },
    ],
  },
  cau: {
    constitutionSummary:
      'The Central Academic Union (CAU) is the supreme constitutional legislative body of ANJUMAN-E-HUDA. Established under the Charter of 1994, it convenes bi-weekly to deliberate student rights, approve wing budgets, codify union resolutions, and preserve democratic integrity.',
    councilMembersCount: 64,
    sessionTerm: 'Spring-Autumn 2026 Ordinary Session',
    latestResolutions: [
      {
        id: 'res-101',
        title: 'Statute Amendment: Universal Health & Emergency Relief Endowment',
        date: '2026-09-08',
        fileNumber: 'CAU/RES/2026/89',
        status: 'Adopted',
      },
      {
        id: 'res-102',
        title: 'Sanction of Budget for High-Speed Fibre Connectivity across Hostels',
        date: '2026-08-20',
        fileNumber: 'CAU/RES/2026/88',
        status: 'Adopted',
      },
      {
        id: 'res-103',
        title: 'Code of Decorum for Inter-Wing Annual Sports & Debate Competitions',
        date: '2026-08-05',
        fileNumber: 'CAU/RES/2026/87',
        status: 'Gazetted',
      },
      {
        id: 'res-104',
        title: 'Establishment of Graduate Placement & Civil Service Mentorship Hub',
        date: '2026-07-19',
        fileNumber: 'CAU/RES/2026/86',
        status: 'Adopted',
      },
    ],
  },
  rankings: {
    topWings: [
      { rank: 1, wingName: 'Literature, Oratory & Arts Wing', points: 940, badge: 'Leading Wing' },
      { rank: 2, wingName: 'Social Service & Disaster Relief Wing', points: 915, badge: 'Honor Roll' },
      { rank: 3, wingName: "Da'wah & Moral Guidance Wing", points: 880, badge: 'High Merit' },
      { rank: 4, wingName: 'IT, Media & Digital Broadcast Wing', points: 835, badge: 'Notable' },
      { rank: 5, wingName: 'Sports & Athletic Fitness Wing', points: 810, badge: 'Active' },
      { rank: 6, wingName: 'Academic Research & Career Guidance', points: 790, badge: 'Developing' },
    ],
    topParticipants: [
      {
        rank: 1,
        name: 'Zeeshan Mukhtar',
        department: 'Dept. of Law & Shariah',
        points: 320,
        eventsWon: 6,
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      },
      {
        rank: 2,
        name: 'Talha Bin Zubair',
        department: 'Dept. of Computer Applications',
        points: 295,
        eventsWon: 5,
        photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      },
      {
        rank: 3,
        name: 'Faraz Ahmad Usmani',
        department: 'Dept. of Arabic Literature',
        points: 270,
        eventsWon: 4,
        photo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
      },
      {
        rank: 4,
        name: 'Nomanullah Siddiqui',
        department: 'Dept. of Commerce & Finance',
        points: 245,
        eventsWon: 3,
      },
      {
        rank: 5,
        name: 'Amaan Ur-Rahman',
        department: 'Dept. of History & Culture',
        points: 230,
        eventsWon: 3,
      },
    ],
  },
  contactSettings: {
    campusAddress: "Darul Huda Islamic University",
    officialEmail: "anjumanehuda@dhiu.in",
    helplinePhone: "+91 98765 43210",
    secondaryPhone: "+91 98765 43211",
    officeHours: "Monday – Saturday: 08:30 AM – 06:00 PM (IST)",
    emergencyDesk: "24/7 Student Grievance Desk Available Online",
  },
  inquiries: [
    {
      id: 'inq-1',
      name: 'Muhammad Tariq',
      email: 'tariq.student@univ.edu',
      category: 'Welfare Fellowship',
      message: 'Kindly clarify the deadline for submitting the Autumn Research Grant verification form.',
      createdAt: '2026-09-21 14:30',
      status: 'Reviewed',
    },
    {
      id: 'inq-2',
      name: 'Zaid Al-Bihari',
      email: 'zaid.bihari@univ.edu',
      category: 'Program Participation',
      message: 'Requesting permission to enroll our inter-departmental quiz team for the upcoming Colloquium.',
      createdAt: '2026-09-22 09:15',
      status: 'Pending',
    },
  ],
  pillars: [
    {
      id: 'talim',
      name: "Ta'lim",
      englishTitle: 'Illuminated Education',
      desc: 'Rigor in modern disciplines and scholastic literacy.',
      arabicMotto: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
      arabicMeaning: 'Scholastic Depth & Enlightened Inquiry',
      colorName: 'emerald',
      badge: 'Academic Council • 1,200+ Scholars',
      keyPoints: [
        'Inter-Departmental Research Colloquiums',
        'Classical Islamic & Contemporary Discourse',
        "Annual Grand Ta'lim Convocation",
      ],
      wingAffiliation: 'Central Academic Union & Research Wing',
    },
    {
      id: 'tarbiyah',
      name: 'Tarbiyah',
      englishTitle: 'Character Stewardship',
      desc: 'Moral discipline, ethics, and empathetic consciousness.',
      arabicMotto: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ',
      arabicMeaning: 'Noble Character & Moral Rectitude',
      colorName: 'amber',
      badge: 'Ethics Guild • Unbroken Lineage',
      keyPoints: [
        'Moral Stewardship & Mentorship Circles',
        'Spiritual Assemblies & Tahajjud Vigils',
        'Ethical Leadership Incubation',
      ],
      wingAffiliation: 'Spiritual & Ethical Development Council',
    },
    {
      id: 'khidmah',
      name: 'Khidmah',
      englishTitle: 'Public Service',
      desc: 'Welfare drives, student aid, and altruistic relief.',
      arabicMotto: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
      arabicMeaning: 'Selfless Benevolence & Community Relief',
      colorName: 'sky',
      badge: 'Social Relief • 24/7 Response',
      keyPoints: [
        'State-Wide Blood Donor Registry',
        'Needy Student Hardship Welfare Grants',
        'Campus Health Camps & Relief Convoys',
      ],
      wingAffiliation: 'Rahma Public Welfare & Relief Wing',
    },
    {
      id: 'ittihad',
      name: 'Ittihad',
      englishTitle: 'Harmonious Unity',
      desc: 'Inter-departmental camaraderie, fraternity, and peace.',
      arabicMotto: 'وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا',
      arabicMeaning: 'Harmonious Fraternity & Democratic Voice',
      colorName: 'purple',
      badge: 'Student Parliament • 100% Representation',
      keyPoints: [
        'Democratic Student Council Deliberations',
        'Inter-Collegiate Cultural Symposia',
        'Equal Voice Across Every Department',
      ],
      wingAffiliation: 'Central Executive Secretariat & Parliament',
    },
  ],
};
