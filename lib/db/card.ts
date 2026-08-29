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
    id: "card-1",
    title: "Pixprint App V.1.02.00",
    thumbnail: "/img/minicard001.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
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
    id: "card-2",
    title: "VaultBrush Pack",
    thumbnail: "/img/minicard002.svg",
    banner: "/img/tempbnr.svg",
    icon: "/img/Icontemp2.svg",
    badge: "free",
    categories: ["BRUSH"],
    version: "v2.1.0",
    fileSize: "34.2 MB",
    fileType: ".ABR / .BRUSHSET",
    license: "Free Commercial",
    author: "Brandon Herera",
    updatedAt: "2026-08-15",
    checksum: "sha256: 8f4a9b2c7e9903b12dc34509aa88fe12",
    description:
      "A complete pixel-perfect brush set designed specifically for vintage game art, pixel illustration, and textured halftone shading.\n\n" +
      "Includes 48 unique handcrafted dynamic brushes formatted for Photoshop, Procreate, Aseprite, and Clip Studio Paint.",
    features: [
      "48 Custom pressure-sensitive pixel and stippling brushes",
      "Native .brushset format for Procreate 5+ on iPad",
      "High-res ABR format compatible with Photoshop CS6 through CC 2026",
      "Includes 16 dithering pattern texture stamps",
    ],
    specs: {
      "Brush Count": "48 Handcrafted Presets",
      "Canvas Target": "300 DPI High-Resolution & Low-Res Sprite Modes",
      "File Formats": ".ABR, .BRUSHSET, .SUT (Clip Studio)",
      "License": "CC-BY 4.0 (Commercial OK)",
    },
    requirements: [
      "Photoshop CS6+ / CC 2020+",
      "Procreate 5+ on iPadOS 15+",
      "Clip Studio Paint 1.10+",
      "300 DPI canvas recommended",
    ],
    changelog:
      "### v2.1.0 — 2026-08-15\n" +
      "- Added 12 new retro halftone stippling brushes.\n" +
      "- Optimized pressure curves for Apple Pencil 2 and Pro.",
    downloadUrl: "#",
    donateUrl: "https://trakteer.id",
  },
  {
    id: "card-3",
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
    id: "card-4",
    title: "AdobeXD V.59.0.0",
    thumbnail: "/img/minicard004.svg",
    banner: "/img/tempbnr.svg",
    icon: "/img/Icontemp2.svg",
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
    id: "card-5",
    title: "DevToolkit CLI",
    thumbnail: "/img/minicard005.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
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
    id: "card-6",
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
    id: "card-7",
    title: "MiscPack Bundle",
    thumbnail: "/img/minicard007.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
    badge: "free",
    categories: ["OTHERS"],
    version: "v1.1.0",
    fileSize: "42.0 MB",
    fileType: ".ZIP Archive",
    license: "Free Commercial",
    author: "PIXLape Team",
    updatedAt: "2026-06-30",
    description:
      "A miscellaneous collection of retro sound effects (8-bit chiptune WAVs), pixel patterns, UI sound cues, and monospace fonts.",
    requirements: [
      "Any standard ZIP unarchiver",
      "Audio player supporting 24-bit WAV files",
    ],
    downloadUrl: "https://www.mediafire.com/file/f62118y1doja5eh/Pixlape-download.rar/file",
  },
];

// ────────────────────────────────────────── Synchronous Helpers & Reactive Store ──────────────────────────────────────────

// In-memory dynamic store initialized with CARDS
export let memoryCards: CardDetail[] = [...CARDS];

type StoreListener = () => void;
const listeners: Set<StoreListener> = new Set();

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
 * React hook to subscribe to asset cards state changes
 */
export function useAssets(): CardDetail[] {
  // Use React dynamic import/hook safely for both client and server
  const [assets, setAssets] = typeof window !== 'undefined'
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      require('react').useState(() => [...memoryCards])
    : [[...memoryCards], () => {}];

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    require('react').useEffect(() => {
      const update = () => setAssets([...memoryCards]);
      listeners.add(update);
      return () => {
        listeners.delete(update);
      };
    }, []);
  }

  return assets;
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