// ====================================================== Types =====================================================

export type BadgeVariant = "free" | "paid" | "premium";

export type CardCategory =
  | "APPS"
  | "TOOLS"
  | "BRUSH"
  | "TEMPLATE"
  | "ICON"
  | "ART FOR SELL"
  | "OTHERS";

/** Data used in the grid card (listing view) */
export interface CardItem {
  id: string;
  title: string;
  /** Path relative to /public — e.g. "/img/minicard001.svg" */
  thumbnail: string;
  /** Icon shown on grid card and detail page */
  icon?: string;
  badge: BadgeVariant;
  categories: CardCategory[];
}

/** Extended data used in the detail view */
export interface CardDetail extends CardItem {
  /** Wide banner image for the detail page header */
  banner: string;
  /** Small icon shown beside the title on detail page */
  icon: string;
  description: string;
  requirements: string[];
  downloadUrl: string;
  donateUrl?: string;
  price?: number;
  version?: string;
  fileSize?: string;
  fileType?: string;
  fileFormat?: string;
  downloads?: number;
  license?: string;
  changelog?: string | string[];
  features?: string[];
  specs?: Record<string, string>;
  checksum?: string;
  author?: string;
  updatedAt?: string;
}

// __________________________________________ Sample Data ________________________________________________

export const CARDS: CardDetail[] = [
  {
    id: "product001",
    title: "Pixprint App V.1.02.00",
    thumbnail: "/img/minicard001.svg",
    banner: "/img/banner01.svg",
    icon: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788114009/AutoCAD.ico",
    badge: "free",
    categories: ["APPS"],
    version: "v1.02.00",
    fileSize: "18.4 MB",
    fileType: ".APK / .ZIP",
    license: "Free Commercial",
    author: "PIXLape Lab",
    updatedAt: "2026-08-20",
    checksum: "sha256: 4a9f8b2c7e1109a3de88b43f1190bcda",
    description:
      "Pixprint is a lightweight utility that allows you to print your retro pixel art directly to physical thermal paper and standard home printers. Supports thermal ESC/POS 58mm/80mm bluetooth receipt printers, USB connection, and system print dialogs.",
    features: [
      "Zero Dithering Distortion with 1-to-1 dot matrix mapping",
      "Wireless Bluetooth BLE & USB ESC/POS thermal printer support",
      "Instant canvas aspect ratio calculator and paper preview",
      "Preset profiles for 58mm and 80mm roll printers",
    ],
    specs: {
      "App Version": "v1.02.00 (Build #1042)",
      "Runtime Engine": "Android 11+ / Windows 10+ (Electron/Native)",
      "Printer Protocol": "ESC/POS, Bluetooth SPP/BLE, USB Direct",
      "RAM Target": "< 65 MB Active Working Set",
      "License": "Free for Personal & Commercial Use",
    },
    requirements: [
      "Android 11.0+ or Windows 10/11 (64-bit)",
      "Bluetooth 4.2+ (BLE) or USB-OTG connection",
      "100 MB free device storage",
      "ESC/POS compatible printer (optional)",
    ],
    changelog:
      "### v1.02.00 (Current Build) — 2026-08-20\n" +
      "- Added: Android 14 target SDK compatibility and permission handling.\n" +
      "- Improved: BLE auto-reconnect reliability on low-energy thermal devices.\n" +
      "- Fixed: Canvas truncation on 80mm wide paper rolls.\n\n" +
      "### v1.00.00 (Initial Launch) — 2026-06-12\n" +
      "- First stable release with standard ESC/POS printing pipeline.",
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product002",
    title: "BeatTones Brush Procreate",
    thumbnail: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788273646/Screenshot_2026-09-01_213847.png",
    banner: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788273646/Screenshot_2026-09-01_213847.png",
    icon: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788149472/brush.svg",
    badge: "free",
    categories: ["BRUSH"],
    version: "v1.00",
    fileSize: "151 MB",
    fileType: ".ZIP / .BRUSHSET",
    license: "Paid License",
    author: "PIXLape",
    updatedAt: "2026-08-15",
    checksum: "sha256: 8f4a9b2c7e9903b12dc34509aa88fe12",
    description:
      "A complete pixel-perfect brush set designed specifically for vintage game art, pixel illustration, and textured halftone shading.\n\n" +
      "Includes more 10+ unique handcrafted dynamic brushes formatted for Procreate.",
    features: [
      "10+ Custom pressure-sensitive pixel and stippling brushes",
      "Native .brushset format for Procreate 5+ on iPad",
      "High-res format compatible with Procreate",
    ],
    specs: {
      "Brush Count": "10+ Handcrafted Presets",
      "Canvas Target": "300 DPI High-Resolution",
      "File Formats": ".BRUSHSET",
      "License": "CC-BY 4.0 (Commercial OK)",
    },
    requirements: [
      "Procreate 5.0.70",
    ],
    changelog:
      "### v2.1.0 — 2026-08-15\n" +
      "- Added 12 new retro halftone stippling brushes.\n" +
      "- Optimized pressure curves for Apple Pencil 2 and Pro.",
    downloadUrl: "https://modlab.gumroad.com/l/jslpqd",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product003",
    title: "PixGrid Icon Set",
    thumbnail: "/img/minicard003.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
    badge: "premium",
    categories: ["ICON"],
    version: "v3.0.0",
    fileSize: "12.8 MB",
    fileType: ".SVG / .PNG / .FIG",
    license: "Royalty-Free Premium",
    author: "PIXLape Design",
    updatedAt: "2026-08-10",
    checksum: "sha256: e3b0c44298fc1c149afbf4c8996fb924",
    description:
      "Over 450+ pixel-aligned retro cyber interface icons crafted on an ultra-sharp 16x16 grid with 24x24 and 32x32 scaled variants.\n\n" +
      "Perfect for web dashboards, developer tools, indie games, and terminal UI design.",
    features: [
      "450+ Pixel-perfect SVG vector icons",
      "Figma component library with auto-layout variants",
      "React & Vue icon component packages included",
      "Light and dark mode optical sizing",
    ],
    specs: {
      "Icon Total": "450+ Icons across 14 categories",
      "Base Grid": "16x16 px (with 24px and 32px variants)",
      "Color Palettes": "Monochrome, Terminal Green, Amber, Cyber Blue",
      "Format": "SVG, PNG (1x, 2x, 4x), Figma (.FIG)",
    },
    requirements: [
      "Figma / Adobe XD / Illustrator / Penpot",
      "SVG & PNG viewer or any modern browser",
      "React 18+ or Vue 3+ for web package",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product004",
    title: "AdobeXD V.59.0.0",
    thumbnail: "/img/minicard008.svg",
    banner: "/img/tempbnr.svg",
    icon: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788149472/adobexd.svg",
    badge: "paid",
    categories: ["TEMPLATE"],
    version: "v59.0.0",
    fileSize: "444.1 MB",
    fileType: ".FIG / Next.js Source",
    license: "Single & Extended Commercial",
    author: "Adobe Company",
    updatedAt: "2026-07-28",
    description:
      "AdobeXD V.59.0.0 UI web designs, retro monospace landing page design system , developer tools, and creative digital studios.",
    features: [
      "UI web designs",
      "Interactive ",
      "design system ",
      "100+ UI components",
    ],
    requirements: [
      "Adobe XD 2024+",
      "web designs",
      "developer tools",
      "creative digital studios",
    ],
    downloadUrl: "https://www.mediafire.com/file/pzjhch149edtzne/Adobe.XD.v59.0.12.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product005",
    title: "DevToolkit CLI",
    thumbnail: "/img/minicard005.svg",
    banner: "/img/banner01.svg",
    icon: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788114324/Terminal_Windows.ico",
    badge: "free",
    categories: ["TOOLS"],
    version: "v0.9.4",
    fileSize: "8.2 MB",
    fileType: "Binary (Cross-Platform)",
    license: "MIT Open Source",
    author: "Alex Mercer",
    updatedAt: "2026-08-01",
    description:
      "A fast cross-platform developer terminal CLI for converting image assets, generating sprite sheets, and packing game resources on the fly.",
    features: [
      "Batch asset compression with multi-threaded C++ backend",
      "Direct sprite atlas packing with JSON coordinates export",
      "WebAssembly browser preview build included",
    ],
    requirements: [
      "Windows 10+, macOS 12+, or Linux x86_64",
      "PowerShell 7+ or Bash terminal",
    ],
    downloadUrl: "#",
  },
  {
    id: "product006",
    title: "ArtCanvas Poster",
    thumbnail: "/img/minicard006.svg",
    banner: "/img/tempbnr.svg",
    icon: "/img/Icontemp2.svg",
    badge: "free",
    categories: ["ART FOR SELL"],
    version: "v1.0.0",
    fileSize: "124 MB",
    fileType: ".PSD / .TIFF / .PDF",
    license: "Personal & Print Ready",
    author: "PIXLape Collective",
    updatedAt: "2026-07-15",
    description:
      "Ultra high resolution 300 DPI print-ready cyberpunk pixel city landscape poster artwork with separated atmospheric depth layers.",
    features: [
      "300 DPI CMYK print-ready master file (A1 / A2 / A3)",
      "Layered PSD with isolated lighting and neon effects",
      "Includes non-compressed TIFF and vector PDF copies",
    ],
    requirements: [
      "Photoshop / Affinity Photo / GIMP",
      "300 DPI color-accurate monitor recommended",
      "CMYK color profile support",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product007",
    title: "WinRar 7.23 x64",
    thumbnail: "/img/minicard_winrar.svg",
    banner: "/img/banner01.svg",
    icon: "/img/winrar_icon.svg",
    badge: "free",
    categories: ["APPS"],
    version: "v7.23.0",
    fileSize: "4.06 MB",
    fileType: ".ZIP Archive",
    license: "Free Commercial",
    author: "WinRar Team",
    updatedAt: "2026-06-30",
    description:
      "WinRAR is a powerful compression tool with many integrated additional functions to help you organize your compressed archives. " +
      "WinRAR puts you ahead of the crowd when it comes to compression. By consistently creating smaller archives, WinRAR is often faster than the competition. This will save you disk space, transmission costs AND valuable working time as well.",
    features: [
      "Supports all popular compression formats (RAR, ZIP, CAB, ARJ, LZH, TAR, GZip, UUE, ISO, BZIP2, Z and 7-Zip)",
      "Ideal for multimedia files with automatic compression method selection",
      "Special compression algorithm for executables and object libraries",
      "AES 256-bit encryption support",
    ],
    requirements: [
      "Windows 7 / 8 / 10 / 11 (64-bit)",
      "64 MB RAM",
      "3 MB available hard disk space",
    ],
    downloadUrl: "https://www.mediafire.com/file/ih4apm9sn0b89bm/Winrar.7.23.x64.zip/file",
  },
  {
    id: "product008",
    title: "CorelDraw 2026 v27.0.0.780",
    thumbnail: "/img/minicard004.svg",
    banner: "/img/tempbnr.svg",
    icon: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788114032/corel_draw.ico",
    badge: "free",
    categories: ["APPS"],
    version: "27.0.0.780",
    fileSize: "1.16 GB",
    fileType: ".EXE",
    license: "Single & Extended Commercial",
    author: "Corel Company",
    updatedAt: "2026-07-28",
    description:
      "CorelDraw 2026 V.27.0.0.780 APP designs, retro monospace landing page design system , developer tools, and creative digital studios.",
    features: [
      "VECTOR APP",
      "graphic editing",
      "design system ",
      "100+ UI components",
    ],
    requirements: [
      "Windows 10 / 11",
      "Intel Core i3/i5 AMD Ryzen 3/5",
      "RAM : 8GB",
      "Storage : 5GB",
      "VGA : 1GB",
    ],
    downloadUrl: "https://www.mediafire.com/file/pzjhch149edtzne/Adobe.XD.v59.0.12.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product009",
    title: "Font Bundle 2026",
    thumbnail: "/img/minicard007.svg",
    banner: "/img/banner01.svg",
    icon: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788114335/Typora.ico",
    badge: "free",
    categories: ["APPS"],
    version: "1.0.0",
    fileSize: "10.5 MB",
    fileType: ".TTF, .OTF",
    license: "Personal & Commercial",
    author: "PIXLape Collective",
    updatedAt: "2026-08-01",
    description:
      "A curated bundle of 20+ monospace and pixel-style fonts suitable for UI design, coding, and retro-themed projects.",
    features: [
      "20+ font families",
      "Commercial usage license included",
      "Supports multiple weights and styles",
    ],
    requirements: [
      "Windows 10 / 11",
      "MacOS 10.15+",
      "Linux",
    ],
    downloadUrl: "https://www.mediafire.com/file/pzjhch149edtzne/Adobe.XD.v59.0.12.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product010",
    title: "PixelShader FX Studio",
    thumbnail: "/img/minicard001.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
    badge: "free",
    categories: ["TOOLS"],
    version: "v2.0.4",
    fileSize: "28.5 MB",
    fileType: ".EXE / .DMG",
    license: "MIT Open Source",
    author: "PIXLape Lab",
    updatedAt: "2026-08-22",
    description:
      "Real-time GLSL shader editor and post-processing FX suite for retro pixel art, CRT curvature, scanlines, and chromatic aberration effects.",
    features: [
      "Live GLSL viewport preview with FPS counter",
      "Preset CRT, Bloom, and Vignette pixel pipelines",
      "Export LUT and HLSL shader codes for Unity/Godot",
    ],
    requirements: [
      "Windows 10/11 or macOS 12+",
      "Dedicated GPU with OpenGL 3.3+ support",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product011",
    title: "Retro 8-Bit Game Tileset",
    thumbnail: "/img/minicard002.svg",
    banner: "/img/tempbnr.svg",
    icon: "/img/Icontemp2.svg",
    badge: "free",
    categories: ["TEMPLATE"],
    version: "v1.4.0",
    fileSize: "15.2 MB",
    fileType: ".PNG / .TSX (Tiled)",
    license: "CC0 Public Domain",
    author: "PixelForge Studio",
    updatedAt: "2026-08-18",
    description:
      "Over 600+ top-down and side-scroller 16x16 tiles for dungeon crawlers, sci-fi platforms, and RPG maker projects with auto-tiling templates.",
    features: [
      "600+ 16x16 pixel tiles in PNG spritesheets",
      "Pre-configured Tiled Map Editor TSX files",
      "Animated water, lava, and torch tiles",
    ],
    requirements: [
      "Any game engine (Godot, Unity, RPG Maker, GameMaker)",
      "Image viewer or tilemap software",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product012",
    title: "Cyberpunk Glow Brushes",
    thumbnail: "/img/minicard003.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
    badge: "premium",
    categories: ["BRUSH"],
    version: "v3.0.0",
    fileSize: "45.0 MB",
    fileType: ".ABR / .BRUSHSET",
    license: "Royalty-Free Premium",
    author: "Brandon Herera",
    updatedAt: "2026-08-25",
    description:
      "Specialized luminous neon and glow brushes designed for digital painting, cyberpunk concept art, and high-intensity wireframes.",
    features: [
      "32 High-energy neon tube and glow presets",
      "Dynamic color jitter based on stylus pen pressure",
      "Compatible with Photoshop CC & Procreate iPad",
    ],
    requirements: [
      "Adobe Photoshop CC 2021+ or Procreate 5+",
      "Pressure-sensitive drawing tablet or Apple Pencil",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product013",
    title: "Terminal UI System Icons",
    thumbnail: "/img/minicard004.svg",
    banner: "/img/tempbnr.svg",
    icon: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788114093/Microsoft_Remote_Desktop.ico",
    badge: "free",
    categories: ["ICON"],
    version: "v2.2.0",
    fileSize: "8.6 MB",
    fileType: ".SVG / .FIG",
    license: "Free Commercial",
    author: "PIXLape Design",
    updatedAt: "2026-08-26",
    description:
      "A complete monospace retro CLI symbol and icon suite for command line tools, terminal HUDs, status monitors, and sysadmin apps.",
    features: [
      "300+ Vector terminal indicators and glyphs",
      "SVG optimized for zero layout shift in React CLI",
      "Figma variants with pixel snapping guides",
    ],
    requirements: [
      "Modern Web Browser / Figma / Penpot",
      "Any code editor supporting SVG icons",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product014",
    title: "Neon Cityscape Print A2",
    thumbnail: "/img/minicard005.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
    badge: "paid",
    categories: ["ART FOR SELL"],
    version: "v1.0.0",
    fileSize: "210 MB",
    fileType: ".TIFF / .PSD",
    license: "Single Print & Commercial",
    author: "PIXLape Collective",
    updatedAt: "2026-08-27",
    description:
      "High-density 400 DPI vector-rendered isometric cyberpunk metropolis poster file ready for large format print output.",
    features: [
      "400 DPI CMYK master print resolution (A2 / A1)",
      "Layered PSD separating neon glows and buildings",
      "Color-calibrated with ISO Coated v2 ICC profile",
    ],
    requirements: [
      "Adobe Photoshop / Affinity Photo",
      "16GB RAM recommended for opening 400 DPI PSD",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product015",
    title: "8-Bit Chiptune SFX Pack",
    thumbnail: "/img/minicard006.svg",
    banner: "/img/tempbnr.svg",
    icon: "/img/Icontemp2.svg",
    badge: "free",
    categories: ["OTHERS"],
    version: "v1.2.0",
    fileSize: "68.4 MB",
    fileType: ".WAV / .OGG",
    license: "CC-BY 4.0",
    author: "SoundByte Studio",
    updatedAt: "2026-08-28",
    description:
      "Over 250 authentic pulse-wave, triangle bass, and noise channel sound effects recorded directly from authentic vintage sound chips.",
    features: [
      "250+ WAV 24-bit 48kHz audio samples",
      "Looping ambient background chiptune tracks",
      "Normalized volume levels ready for game engines",
    ],
    requirements: [
      "Any digital audio workstation (DAW) or game engine",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product016",
    title: "Vault IDE Dev Extension",
    thumbnail: "/img/minicard007.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
    badge: "free",
    categories: ["TOOLS"],
    version: "v1.0.8",
    fileSize: "4.1 MB",
    fileType: ".VSIX",
    license: "MIT Open Source",
    author: "Alex Mercer",
    updatedAt: "2026-08-29",
    description:
      "A VS Code and Antigravity IDE extension featuring high-contrast retro themes, monospace glyph formatting, and pixel-asset quick previews.",
    features: [
      "6 Retro CRT and green phosphor editor themes",
      "Inline SVG sprite and pixel asset previewer",
      "Monospace ASCII box drawing helper shortcuts",
    ],
    requirements: [
      "VS Code 1.80+ or Antigravity IDE",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "product017",
    title: "Isometric Cyber Rooms 3D",
    thumbnail: "/img/minicard008.svg",
    banner: "/img/tempbnr.svg",
    icon: "/img/Icontemp2.svg",
    badge: "premium",
    categories: ["TEMPLATE"],
    version: "v2.0.0",
    fileSize: "92.0 MB",
    fileType: ".BLEND / .GLTF / .PNG",
    license: "Royalty-Free Premium",
    author: "PIXLape 3D Team",
    updatedAt: "2026-08-30",
    description:
      "Low-poly isometric cybernetic laboratory and hacker room 3D scene templates ready for Blender, Godot 4, and Three.js web apps.",
    features: [
      "Complete modular room pieces and server racks",
      "Low-poly count optimized for web 3D (Three.js/Spline)",
      "Includes rendered isometric 2D sprite sheets",
    ],
    requirements: [
      "Blender 3.6+ or any GLTF 2.0 compatible 3D software",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
    donateUrl: "https://trakteer.id",
  },
];

// ────────────────────────────────────────── Synchronous Helpers & Reactive Store ──────────────────────────────────────────

// In-memory dynamic store initialized with CARDS
export let memoryCards: CardDetail[] = [...CARDS];

export type StoreListener = () => void;
export const listeners: Set<StoreListener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore errors in listeners
    }
  });
}

/**
 * Add a new asset to in-memory store
 */
export function addAssetToStore(data: Partial<CardDetail> & { title: string; category?: CardCategory }): CardDetail {
  const nextNumber = memoryCards.length + 1;
  const id = data.id && data.id.trim() !== '' ? data.id.trim() : `card-${nextNumber}`;
  const categories: CardCategory[] = data.categories || (data.category ? [data.category] : ['TOOLS']);

  const newAsset: CardDetail = {
    id,
    title: data.title,
    thumbnail: data.thumbnail || '/img/minicard001.svg',
    banner: data.banner || '/img/banner01.svg',
    icon: data.icon || '/img/Icontemp1.svg',
    badge: data.badge || 'free',
    categories,
    description: data.description || 'No description provided.',
    requirements: data.requirements || ['Standard web or design software'],
    downloadUrl: data.downloadUrl || '#',
    donateUrl: data.donateUrl || 'https://trakteer.id',
    version: data.version || 'v1.0.0',
    fileSize: data.fileSize || '10.0 MB',
    fileType: data.fileType || '.ZIP',
    license: data.license || 'Free Commercial',
    author: data.author || 'PIXLape Lab',
    checksum: data.checksum || `sha256: ${Math.random().toString(16).substring(2, 18)}`,
    features: data.features || ['High-performance digital asset package', '100% Vector and pixel aligned'],
    specs: data.specs || {
      'Asset Engine': 'PIXLApe Vault Architecture',
      'Compatibility': 'Cross-Platform',
    },
    changelog: data.changelog || '### v1.0.0 (Initial Release)\n- First stable vault asset package.',
    updatedAt: data.updatedAt || new Date().toISOString().split('T')[0],
  };

  // Prepend new asset
  memoryCards = [newAsset, ...memoryCards.filter((c) => c.id !== id)];
  notifyListeners();
  return newAsset;
}

/**
 * Update an existing asset in the in-memory store
 */
export function updateAssetInStore(id: string, updates: Partial<CardDetail> & { category?: CardCategory }): CardDetail | null {
  const index = memoryCards.findIndex(
    (c) => c.id === id || c.id === `card-${id}` || c.id.endsWith(id)
  );

  if (index === -1) {
    // If not found, add as new asset if title is provided
    return addAssetToStore({
      ...updates,
      id,
      title: updates.title || `Asset #${id}`,
    });
  }

  const existing = memoryCards[index];
  const categories: CardCategory[] = updates.categories || (updates.category ? [updates.category] : existing.categories);

  const updated: CardDetail = {
    ...existing,
    ...updates,
    categories,
    updatedAt: updates.updatedAt || new Date().toISOString().split('T')[0],
  };

  memoryCards[index] = updated;
  notifyListeners();
  return updated;
}

/**
 * Delete an asset from in-memory store
 */
export function deleteAssetFromStore(id: string): boolean {
  const initialLength = memoryCards.length;
  memoryCards = memoryCards.filter((c) => c.id !== id && c.id !== `card-${id}`);
  const removed = memoryCards.length < initialLength;
  if (removed) {
    notifyListeners();
  }
  return removed;
}

/** Filter cards by ID */
export function getCardById(id: string): CardDetail | undefined {
  if (!id) return memoryCards[0] || CARDS[0];
  const normalizedId = id.toLowerCase().startsWith('card-') ? id : `card-${id}`;
  return (
    memoryCards.find((c) => c.id === id || c.id === normalizedId) ||
    memoryCards.find((c) => c.id.endsWith(id)) ||
    CARDS.find((c) => c.id === id || c.id === normalizedId) ||
    memoryCards[0] ||
    CARDS[0]
  );
}

/** Filter cards by category */
export function getCardsByCategory(category: CardCategory): CardDetail[] {
  return memoryCards.filter((c) => c.categories.includes(category));
}

/** Filter cards by badge variant */
export function getCardsByBadge(badge: BadgeVariant): CardDetail[] {
  return memoryCards.filter((c) => c.badge === badge);
}