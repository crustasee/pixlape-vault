// ====================================================== Team Data =====================================================

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  experienceYears: number;
  joinedYear: number;
  skills: string[];
  resume: {
    education: string;
    specialty: string;
    projectsCount: number;
    highlights: string[];
  };
  socials: {
    github?: string;
    twitter?: string;
    email?: string;
  };
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "brandon-herera",
    name: "Brandon Herera",
    role: "DEVELOPER + ART DIRECTION",
    avatar: "/img/Icontemp1.svg",
    bio: "Developer and art director for the PIXLape project since 1999. Specializes in retro UI design, C++ asset compilation, and high-performance WebAssembly engines.",
    experienceYears: 12,
    joinedYear: 1999,
    skills: ["C++", "Next.js", "Pixel Art", "WebGL", "UI/UX Architecture"],
    resume: {
      education: "B.S. Computer Science & Visual Arts",
      specialty: "Retro Graphics & Vault Engine Architecture",
      projectsCount: 24,
      highlights: [
        "Architected PIXLape Vault core asset indexing system.",
        "Designed retro-pixel UI component design system.",
        "Lead developer for PixelForge App and DevToolkit CLI.",
      ],
    },
    socials: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "brandon@pixlape.com",
    },
  },
  {
    id: "alex-mercer",
    name: "Alex Mercer",
    role: "LEAD BACKEND ARCHITECT",
    avatar: "/img/Icontemp2.svg",
    bio: "Core backend engineer focusing on distributed vault storage, API rate limiting, and zero-latency asset distribution networks.",
    experienceYears: 8,
    joinedYear: 2021,
    skills: ["Rust", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    resume: {
      education: "M.S. Distributed Systems",
      specialty: "High-Performance APIs & CDN Pipelines",
      projectsCount: 18,
      highlights: [
        "Built multi-region CDN caching for zero-downtime downloads.",
        "Implemented SHA-256 asset verification checksum engine.",
      ],
    },
    socials: {
      github: "https://github.com",
      email: "alex@pixlape.com",
    },
  },
];


