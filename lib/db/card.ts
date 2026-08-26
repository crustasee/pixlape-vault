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
    description:
      "Pixprint is an application that allows you to print your pixel art to a physical paper.
      "Work in android version 11 and above"
      "with bluetooth ble connection to printer",
    requirements: [
      "Windows 10 / macOS 12+",
      "4 GB RAM minimum",
      "500 MB free disk space",
    ],
    downloadUrl: "#",
  },
  {
    id: "card-2",
    title: "VaultBrush Pack",
    thumbnail: "/img/minicard002.svg",
    banner: "/img/tempbnr.svg",
    icon: "/img/Icontemp2.svg",
    badge: "free",
    categories: ["BRUSH"],
    description:
      "Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. " +
      "Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis " +
      "dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus.",
    requirements: [
      "Photoshop CS6+ / Procreate 5+",
      "300 DPI canvas recommended",
    ],
    downloadUrl: "#",
    donateUrl: "#",
  },
  {
    id: "card-3",
    title: "PixGrid Icon Set",
    thumbnail: "/img/minicard003.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
    badge: "premium",
    categories: ["ICON"],
    description:
      "Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, " +
      "sed rhoncus pronin sapien nunc accuan eget. Aenean euismod bibendum laoreet.",
    requirements: [
      "Figma / Adobe XD / Illustrator",
      "SVG & PNG formats included",
    ],
    downloadUrl: "#",
    donateUrl: "#",
  },
  {
    id: "card-4",
    title: "LandingKit Template",
    thumbnail: "/img/minicard004.svg",
    banner: "/img/tempbnr.svg",
    icon: "/img/Icontemp2.svg",
    badge: "paid",
    categories: ["TEMPLATE"],
    description:
      "Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus " +
      "mus. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus.",
    requirements: [
      "Figma 2024+",
      "Auto Layout knowledge recommended",
    ],
    downloadUrl: "#",
  },
  {
    id: "card-5",
    title: "DevToolkit CLI",
    thumbnail: "/img/minicard005.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
    badge: "free",
    categories: ["TOOLS"],
    description:
      "Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis " +
      "parturient montes. Nam fermentum, nulla luctus pharetra vulputate.",
    requirements: [
      "Node.js 18+",
      "Unix / Windows PowerShell",
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
    description:
      "Felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget. " +
      "Aenean euismod bibendum laoreet proin gravida.",
    requirements: [
      "300 DPI print-ready",
      "CMYK color profile",
    ],
    downloadUrl: "#",
    donateUrl: "#",
  },
  {
    id: "card-7",
    title: "MiscPack Bundle",
    thumbnail: "/img/minicard007.svg",
    banner: "/img/banner01.svg",
    icon: "/img/Icontemp1.svg",
    badge: "free",
    categories: ["OTHERS"],
    description:
      "Nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus " +
      "pronin sapien nunc accuan eget lorem ipsum dolor sit amet.",
    requirements: [
      "No special requirements",
    ],
    downloadUrl: "#",
  },
];

// ───__________________________________________________Helpers ──────────────────────────────────────────────────────────────────

export function getCardById(id: string): CardDetail | undefined {
  if (!id) return CARDS[0];
  const normalizedId = id.toLowerCase().startsWith("card-") ? id : `card-${id}`;
  return (
    CARDS.find((c) => c.id === id || c.id === normalizedId) ||
    CARDS.find((c) => c.id.endsWith(id)) ||
    CARDS[0]
  );
}

/** ................................................Filter cards by category......................................... */
export function getCardsByCategory(category: CardCategory): CardDetail[] {
  return CARDS.filter((c) => c.categories.includes(category));
}

/** ................................................Filter cards by badge variant......................................... */
export function getCardsByBadge(badge: BadgeVariant): CardDetail[] {
  return CARDS.filter((c) => c.badge === badge);
}