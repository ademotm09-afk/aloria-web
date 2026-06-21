import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand";
import { z } from "zod";
import { Toaster, toast } from "react-hot-toast";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bell,
  Brush,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Download,
  Edit3,
  Eye,
  Globe2,
  Heart,
  Home,
  Image,
  Languages,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Package,
  Palette,
  Phone,
  Plus,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  Upload,
  User,
  Users,
  Wand2,
  X,
} from "lucide-react";

type Lang = "fr" | "en" | "ar";
type Localized = Record<Lang, string>;
type ProductStatus = "active" | "draft";
type OrderStatus = "created" | "confirmed" | "shipped" | "delivered";

type ThemeSettings = {
  primaryBg: string;
  secondaryBg: string;
  cardBg: string;
  primaryGold: string;
  darkGold: string;
  primaryText: string;
  secondaryText: string;
  border: string;
  success: string;
  error: string;
  warning: string;
};

type TypographySettings = {
  logoFont: string;
  headingFont: string;
  bodyFont: string;
  arabicFont: string;
  decorativeFont: string;
  baseSize: number;
  headingScale: number;
  letterSpacing: number;
  lineHeight: number;
  weight: number;
};

type AnimationSettings = {
  enabled: boolean;
  speed: "slow" | "normal" | "fast";
  pageTransitions: boolean;
  scrollAnimations: boolean;
  hoverEffects: boolean;
  customCursor: boolean;
  loadingScreen: boolean;
  marquee: boolean;
  parallax: boolean;
  style: "subtle" | "standard" | "dramatic";
};

type Product = {
  id: string;
  name: Localized;
  slug: string;
  shortDescription: Localized;
  description: Localized;
  category: string;
  subcategory: string;
  tags: string[];
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  lowStock: number;
  unlimitedStock: boolean;
  images: string[];
  alt: Localized;
  videoUrl?: string;
  colors: { name: Localized; value: string; stock: number; price?: number }[];
  sizes: string[];
  badges: string[];
  featured: boolean;
  status: ProductStatus;
  seo: { title: Localized; description: Localized; slug: string; ogImage: string };
  publishedAt: string;
};

type CartItem = { productId: string; quantity: number; color?: string; size?: string };
type Customer = { id: string; name: string; phone: string; email: string; wilaya: string; totalSpent: number; totalOrders: number; notes: string; blocked: boolean };
type Order = { id: string; number: string; customerId: string; customerName: string; phone: string; wilaya: string; items: CartItem[]; total: number; status: OrderStatus; payment: string; shipping: string; createdAt: string; timeline: { label: string; date: string }[] };
type Category = { id: string; name: Localized; description: Localized; image: string; parent?: string; order: number };
type Review = { id: string; name: string; wilaya: string; rating: number; text: Localized; approved: boolean; displayHome: boolean };
type MediaItem = { id: string; url: string; name: string; folder: string; alt: string; usedIn: string };
type PromoCode = { id: string; code: string; type: "percent" | "fixed"; value: number; min: number; max: number; limit: number; used: number; active: boolean; start: string; end: string };
type Wilaya = { code: number; name: string; enabled: boolean; homePrice: number; officePrice: number; eta: string; zone: string };

type SiteContent = {
  identity: {
    siteName: Localized;
    tagline: Localized;
    description: Localized;
    logoMain: string;
    logoDark: string;
    logoMobile: string;
    favicon: string;
    logoSize: number;
  };
  announcement: { enabled: boolean; text: Localized; link: string; bg: string; color: string; start: string; end: string };
  home: {
    heroTitle: Localized;
    heroHighlight: Localized;
    heroSubtitle: Localized;
    cta1: Localized;
    cta1Link: string;
    cta2: Localized;
    cta2Link: string;
    heroImages: string[];
    badge: Localized;
    marquee: Localized[];
    marqueeSpeed: number;
    marqueeEnabled: boolean;
    featuredTitle: Localized;
    featuredSubtitle: Localized;
    featuredProducts: string[];
    featuredCount: number;
    whyTitle: Localized;
    why: { icon: string; title: Localized; description: Localized }[];
    instagram: { image: string; caption: string; link: string }[];
    newsletterTitle: Localized;
    newsletterSubtitle: Localized;
  };
  boutique: { title: Localized; subtitle: Localized; badge: Localized; productsPerPage: number; defaultSort: string; filtersEnabled: boolean; filterLabels: Record<string, Localized> };
  contact: { title: Localized; subtitle: Localized; phone: string; email: string; address: Localized; hours: Localized; whatsapp: string; mapEmbed: string; cards: { icon: string; title: Localized; value: Localized; subtitle: Localized }[] };
  about: { title: Localized; subtitle: Localized; story: Localized; mission: Localized; vision: Localized; values: Localized[]; timeline: { year: string; event: Localized }[]; team: { name: string; role: Localized; photo: string }[] };
  customPages: { id: string; title: Localized; slug: string; body: Localized; status: "published" | "draft"; seoTitle: Localized; seoDescription: Localized }[];
  social: { platform: string; url: string; enabled: boolean; order: number }[];
};

type Settings = {
  defaultLanguage: Lang;
  currency: string;
  freeShipping: number;
  orderFormat: string;
  maintenance: boolean;
  cookieConsent: boolean;
  taxRate: number;
  payments: { cod: boolean; ccp: boolean; cib: boolean; ccpDetails: string; instructions: Localized; order: string[] };
  email: { smtpHost: string; smtpUser: string; templates: Record<string, Localized> };
  seo: { title: Localized; description: Localized; keywords: string; ogImage: string; ga: string; pixel: string; gtm: string; robots: string };
  admins: { id: string; name: string; username: string; role: string; lastLogin: string; active: boolean }[];
  security: { timeoutMinutes: number; attemptsLimit: number; twoFactor: boolean; ipWhitelist: string; activityLog: string[] };
};

type AppState = {
  language: Lang;
  theme: ThemeSettings;
  typography: TypographySettings;
  animations: AnimationSettings;
  content: SiteContent;
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  cart: CartItem[];
  wishlist: string[];
  wilayas: Wilaya[];
  promoCodes: PromoCode[];
  media: MediaItem[];
  reviews: Review[];
  translations: Record<Lang, Record<string, string>>;
  settings: Settings;
  setLanguage: (language: Lang) => void;
  updateTheme: (patch: Partial<ThemeSettings>) => void;
  updateTypography: (patch: Partial<TypographySettings>) => void;
  updateAnimations: (patch: Partial<AnimationSettings>) => void;
  updateContent: (content: SiteContent) => void;
  updateProducts: (products: Product[]) => void;
  updateOrders: (orders: Order[]) => void;
  updateCustomers: (customers: Customer[]) => void;
  updateCategories: (categories: Category[]) => void;
  updateWilayas: (wilayas: Wilaya[]) => void;
  updatePromoCodes: (codes: PromoCode[]) => void;
  updateMedia: (media: MediaItem[]) => void;
  updateReviews: (reviews: Review[]) => void;
  updateSettings: (settings: Settings) => void;
  updateTranslations: (translations: Record<Lang, Record<string, string>>) => void;
  addToCart: (item: CartItem) => void;
  updateCart: (cart: CartItem[]) => void;
  toggleWishlist: (productId: string) => void;
  backup: () => string;
  restore: (json: string) => void;
};

const img = (path: string) => (path.startsWith("/") ? path : `/${path}`);

const l = (fr: string, en: string, ar: string): Localized => ({ fr, en, ar });
const money = (value: number) => `${new Intl.NumberFormat("fr-DZ").format(value)} DZD`;
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const storageKeys = {
  products: "aloria_products",
  orders: "aloria_orders",
  customers: "aloria_customers",
  categories: "aloria_categories",
  cart: "aloria_cart",
  wishlist: "aloria_wishlist",
  session: "aloria_admin_session",
  theme: "aloria_theme_settings",
  typography: "aloria_typography_settings",
  content: "aloria_site_content",
  translations: "aloria_translations",
  wilayas: "aloria_wilayas",
  promoCodes: "aloria_promo_codes",
  media: "aloria_media_library",
  reviews: "aloria_reviews",
  settings: "aloria_general_settings",
  animations: "aloria_animation_settings",
  language: "aloria_language",
};

const themePresets: Record<string, ThemeSettings> = {
  "Classic Luxury": { primaryBg: "#FAF6F0", secondaryBg: "#F5EDE3", cardBg: "#FFFFFF", primaryGold: "#C5A55A", darkGold: "#B8943F", primaryText: "#1A1A1A", secondaryText: "#6B6B6B", border: "#E8E0D5", success: "#2D8A4E", error: "#D94444", warning: "#E8A838" },
  "Dark Mode": { primaryBg: "#0E0D0B", secondaryBg: "#17130F", cardBg: "#1E1A16", primaryGold: "#D6B866", darkGold: "#B8943F", primaryText: "#F8F1E8", secondaryText: "#B8AFA3", border: "#342D25", success: "#4AA66B", error: "#E15B5B", warning: "#E8A838" },
  "Rose Gold": { primaryBg: "#FFF7F4", secondaryBg: "#F7E7E1", cardBg: "#FFFFFF", primaryGold: "#C78C7B", darkGold: "#A86F62", primaryText: "#211817", secondaryText: "#7C6560", border: "#EBD7D1", success: "#2D8A4E", error: "#D94444", warning: "#E8A838" },
  "Emerald Premium": { primaryBg: "#F5F7F2", secondaryBg: "#E7ECE1", cardBg: "#FFFFFF", primaryGold: "#A69355", darkGold: "#0D5C49", primaryText: "#111A16", secondaryText: "#64706A", border: "#DCE3D6", success: "#2D8A4E", error: "#D94444", warning: "#E8A838" },
};

const defaultTypography: TypographySettings = { logoFont: "Playfair Display", headingFont: "Playfair Display", bodyFont: "Inter", arabicFont: "Cairo", decorativeFont: "Playfair Display", baseSize: 15, headingScale: 1.34, letterSpacing: 0.3, lineHeight: 1.65, weight: 400 };
const defaultAnimations: AnimationSettings = { enabled: true, speed: "normal", pageTransitions: true, scrollAnimations: true, hoverEffects: true, customCursor: true, loadingScreen: true, marquee: true, parallax: true, style: "standard" };

const allWilayas = ["Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra", "Bechar", "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Setif", "Saida", "Skikda", "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent", "Ghardaia", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Beni Abbes", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"];
const defaultWilayas: Wilaya[] = allWilayas.map((name, index) => ({ code: index + 1, name, enabled: true, homePrice: index === 15 ? 500 : index < 30 ? 700 : 950, officePrice: index === 15 ? 300 : index < 30 ? 500 : 750, eta: index < 20 ? "1-2 jours" : "2-5 jours", zone: index < 30 ? "Nord" : "Sud" }));

const sampleProducts: Product[] = [
  { id: "p1", name: l("Sahara Tote", "Sahara Tote", "حقيبة سهارى"), slug: "sahara-tote", shortDescription: l("Cuir grainé, silhouette architecturale.", "Grained leather, architectural silhouette.", "جلد محبب بتصميم هندسي راق."), description: l("Un tote luxueux pense pour les journees actives, avec doublure douce, poche interieure et finitions dorees.", "A luxurious tote made for active days, with soft lining, interior pocket and gold finishes.", "حقيبة فاخرة للايام العملية مع بطانة ناعمة وجيب داخلي ولمسات ذهبية."), category: "Totes", subcategory: "Work", tags: ["new", "premium"], sku: "ALR-ST-001", price: 18500, salePrice: 16500, stock: 18, lowStock: 3, unlimitedStock: false, images: [img("/images/products/sahara-tote.jpg")], alt: l("Sac Sahara Tote", "Sahara Tote bag", "حقيبة سهارى"), videoUrl: "", colors: [{ name: l("Sable", "Sand", "رملي"), value: "#CBB89A", stock: 10 }, { name: l("Noir", "Black", "اسود"), value: "#111111", stock: 8 }], sizes: ["M", "L"], badges: ["NEW", "PREMIUM"], featured: true, status: "active", seo: { title: l("Sahara Tote ALORIA", "Sahara Tote ALORIA", "حقيبة سهارى ألوريا"), description: l("Tote de luxe en Algerie", "Luxury tote in Algeria", "حقيبة فاخرة في الجزائر"), slug: "sahara-tote", ogImage: img("/images/products/sahara-tote.jpg") }, publishedAt: "2026-01-05" },
  { id: "p2", name: l("Oran Mini", "Oran Mini", "اوران ميني"), slug: "oran-mini", shortDescription: l("Format bijou pour les soirees elegantes.", "A jewel format for elegant evenings.", "تصميم صغير للامسيات الانيقة."), description: l("Sac mini avec poignee structuree, chaine amovible et fermoir dore delicat.", "Mini handbag with structured handle, detachable chain and delicate gold clasp.", "حقيبة صغيرة بمقبض متين وسلسلة قابلة للازالة وقفل ذهبي."), category: "Mini Bags", subcategory: "Evening", tags: ["best", "limited"], sku: "ALR-OM-002", price: 14200, stock: 9, lowStock: 2, unlimitedStock: false, images: [img("/images/products/oran-mini.jpg")], alt: l("Sac Oran Mini", "Oran Mini bag", "حقيبة اوران ميني"), colors: [{ name: l("Ivoire", "Ivory", "عاجي"), value: "#EFE8DA", stock: 6 }, { name: l("Rose poudre", "Powder rose", "وردي ناعم"), value: "#D9B8AE", stock: 3 }], sizes: ["S"], badges: ["BESTSELLER", "LIMITED"], featured: true, status: "active", seo: { title: l("Oran Mini ALORIA", "Oran Mini ALORIA", "اوران ميني ألوريا"), description: l("Mini sac de luxe", "Luxury mini bag", "حقيبة صغيرة فاخرة"), slug: "oran-mini", ogImage: img("/images/products/oran-mini.jpg") }, publishedAt: "2026-01-14" },
  { id: "p3", name: l("Constantine Satchel", "Constantine Satchel", "قسنطينة ساتشل"), slug: "constantine-satchel", shortDescription: l("Lignes intemporelles, cuir espresso.", "Timeless lines, espresso leather.", "خطوط كلاسيكية بجلد اسبريسو."), description: l("Une piece signature inspiree des ponts de Constantine, faite pour durer saison apres saison.", "A signature piece inspired by Constantine bridges, made to last season after season.", "قطعة مميزة مستوحاة من جسور قسنطينة صممت لتدوم."), category: "Satchels", subcategory: "Signature", tags: ["premium"], sku: "ALR-CS-003", price: 22600, salePrice: 19900, stock: 12, lowStock: 2, unlimitedStock: false, images: [img("/images/products/constantine-satchel.jpg")], alt: l("Sac Constantine Satchel", "Constantine Satchel bag", "حقيبة قسنطينة"), colors: [{ name: l("Espresso", "Espresso", "اسبريسو"), value: "#4A3024", stock: 12 }], sizes: ["M"], badges: ["PREMIUM"], featured: true, status: "active", seo: { title: l("Constantine Satchel ALORIA", "Constantine Satchel ALORIA", "قسنطينة ساتشل ألوريا"), description: l("Sac signature ALORIA", "ALORIA signature bag", "حقيبة ألوريا المميزة"), slug: "constantine-satchel", ogImage: img("/images/products/constantine-satchel.jpg") }, publishedAt: "2026-01-22" },
];

const defaultCategories: Category[] = [
  { id: "c1", name: l("Totes", "Totes", "حقائب كبيرة"), description: l("Pour le quotidien raffine.", "For refined everyday life.", "للحياة اليومية الراقية."), image: img("/images/products/sahara-tote.jpg"), order: 1 },
  { id: "c2", name: l("Mini Bags", "Mini Bags", "حقائب صغيرة"), description: l("Pour les soirees.", "For evenings.", "للامسيات."), image: img("/images/products/oran-mini.jpg"), order: 2 },
  { id: "c3", name: l("Satchels", "Satchels", "ساتشل"), description: l("Signatures intemporelles.", "Timeless signatures.", "تصاميم خالدة."), image: img("/images/products/constantine-satchel.jpg"), order: 3 },
];

const defaultContent: SiteContent = {
  identity: { siteName: l("ALORIA", "ALORIA", "ألوريا"), tagline: l("MAISON DE LUXE", "MAISON DE LUXE", "دار فاخرة"), description: l("Maroquinerie feminine de luxe nee en Algerie.", "Luxury women's leather goods born in Algeria.", "منتجات جلدية نسائية فاخرة من الجزائر."), logoMain: "", logoDark: "", logoMobile: "", favicon: "", logoSize: 112 },
  announcement: { enabled: true, text: l("Livraison disponible dans les 58 wilayas", "Delivery available across all 58 wilayas", "التوصيل متوفر في 58 ولاية"), link: "/boutique", bg: "#1A1A1A", color: "#FAF6F0", start: "", end: "" },
  home: {
    heroTitle: l("ALORIA", "ALORIA", "ألوريا"), heroHighlight: l("L'elegance algerienne", "Algerian elegance", "اناقة جزائرية"), heroSubtitle: l("Des sacs a main sculpturaux, concus pour les femmes modernes qui portent leur presence avec douceur et assurance.", "Sculptural handbags designed for modern women who carry their presence with softness and confidence.", "حقائب يد مصممة للمرأة العصرية التي تحمل حضورها برقة وثقة."), cta1: l("Explorer la collection", "Explore collection", "اكتشفي المجموعة"), cta1Link: "/boutique", cta2: l("Acheter maintenant", "Shop now", "تسوقي الان"), cta2Link: "/checkout", heroImages: [img("/images/hero/aloria-hero.jpg")], badge: l("Pieces en edition limitee", "Limited edition pieces", "قطع محدودة"), marquee: [l("Cuir premium", "Premium leather", "جلد فاخر"), l("Paiement a la livraison", "Cash on delivery", "الدفع عند الاستلام"), l("58 wilayas", "58 wilayas", "58 ولاية"), l("Finitions dorees", "Gold finishes", "لمسات ذهبية")], marqueeSpeed: 28, marqueeEnabled: true, featuredTitle: l("Collection Signature", "Signature Collection", "المجموعة المميزة"), featuredSubtitle: l("Une selection courte, precise et luxueuse.", "A short, precise and luxurious selection.", "اختيار مختصر وفاخر بعناية."), featuredProducts: ["p1", "p2", "p3"], featuredCount: 3, whyTitle: l("Pourquoi ALORIA", "Why ALORIA", "لماذا ألوريا"), why: [{ icon: "Sparkles", title: l("Finition premium", "Premium finish", "تشطيب فاخر"), description: l("Details dores, coutures nettes et silhouettes intemporelles.", "Gold details, clean stitching and timeless silhouettes.", "تفاصيل ذهبية وخياطة دقيقة وتصاميم خالدة.") }, { icon: "Truck", title: l("58 wilayas", "58 wilayas", "58 ولاية"), description: l("Expedition rapide partout en Algerie.", "Fast shipping everywhere in Algeria.", "شحن سريع في كل الجزائر.") }, { icon: "Shield", title: l("Achat serein", "Secure purchase", "شراء مطمئن"), description: l("COD, CCP, CIB et EDAHABIA selon votre preference.", "COD, CCP, CIB and EDAHABIA based on your preference.", "الدفع عند الاستلام او CCP او CIB او الذهبية.") }, { icon: "Heart", title: l("Service feminin", "Feminine service", "خدمة راقية"), description: l("Accompagnement doux avant et apres la commande.", "Gentle support before and after ordering.", "مرافقة لطيفة قبل وبعد الطلب.") }], instagram: [{ image: img("/images/products/sahara-tote.jpg"), caption: "#AloriaSahara", link: "#" }, { image: img("/images/products/oran-mini.jpg"), caption: "#AloriaEvening", link: "#" }, { image: img("/images/products/constantine-satchel.jpg"), caption: "#AloriaSignature", link: "#" }], newsletterTitle: l("Recevoir les editions privees", "Receive private editions", "استقبلي الاصدارات الخاصة"), newsletterSubtitle: l("Un email discret pour les nouveaux lancements et invitations.", "A discreet email for new launches and invitations.", "رسالة هادئة للاصدارات الجديدة والدعوات.")
  },
  boutique: { title: l("Boutique", "Shop", "المتجر"), subtitle: l("Sacs a main et pieces de maroquinerie pour chaque moment.", "Handbags and leather goods for every moment.", "حقائب ومنتجات جلدية لكل لحظة."), badge: l("Nouvelle saison", "New season", "موسم جديد"), productsPerPage: 6, defaultSort: "featured", filtersEnabled: true, filterLabels: { ALL: l("TOUT", "ALL", "الكل"), NEW: l("NEW", "NEW", "جديد"), BESTSELLERS: l("BEST SELLERS", "BEST SELLERS", "الاكثر مبيعا"), PREMIUM: l("PREMIUM", "PREMIUM", "فاخر"), LIMITED: l("LIMITED", "LIMITED", "محدود") } },
  contact: { title: l("Contact", "Contact", "تواصل"), subtitle: l("Notre equipe vous accompagne avec attention.", "Our team supports you with attention.", "فريقنا يرافقك بكل اهتمام."), phone: "+213 555 00 00 00", email: "contact@aloria.dz", address: l("Alger Centre, Algerie", "Algiers Center, Algeria", "الجزائر الوسطى، الجزائر"), hours: l("Samedi - Jeudi, 10:00 - 18:00", "Saturday - Thursday, 10:00 - 18:00", "السبت - الخميس، 10:00 - 18:00"), whatsapp: "+213555000000", mapEmbed: "", cards: [{ icon: "Phone", title: l("Telephone", "Phone", "الهاتف"), value: l("+213 555 00 00 00", "+213 555 00 00 00", "+213 555 00 00 00"), subtitle: l("Conseil client", "Client care", "خدمة العملاء") }, { icon: "Mail", title: l("Email", "Email", "البريد"), value: l("contact@aloria.dz", "contact@aloria.dz", "contact@aloria.dz"), subtitle: l("Reponse sous 24h", "Reply within 24h", "رد خلال 24 ساعة") }, { icon: "MapPin", title: l("Adresse", "Address", "العنوان"), value: l("Alger Centre", "Algiers Center", "الجزائر الوسطى"), subtitle: l("Sur rendez-vous", "By appointment", "بموعد مسبق") }, { icon: "Clock", title: l("Horaires", "Hours", "الاوقات"), value: l("10:00 - 18:00", "10:00 - 18:00", "10:00 - 18:00"), subtitle: l("Samedi a jeudi", "Saturday to Thursday", "السبت الى الخميس") }] },
  about: { title: l("A propos d'ALORIA", "About ALORIA", "عن ألوريا"), subtitle: l("Une maison de maroquinerie algerienne pour une elegance durable.", "An Algerian leather goods maison for lasting elegance.", "دار جزائرية للمنتجات الجلدية من اجل اناقة تدوم."), story: l("ALORIA imagine des sacs feminins qui parlent doucement, avec precision et presence. Chaque piece celebre le rythme des femmes algeriennes modernes.", "ALORIA imagines feminine bags that speak softly, with precision and presence. Every piece celebrates the rhythm of modern Algerian women.", "ألوريا تصمم حقائب نسائية تتحدث بهدوء ودقة وحضور. كل قطعة تحتفي بنبض المرأة الجزائرية العصرية."), mission: l("Creer des pieces luxueuses, utiles et intemporelles.", "Create luxurious, useful and timeless pieces.", "ابتكار قطع فاخرة وعملية وخالدة."), vision: l("Faire rayonner l'elegance algerienne contemporaine.", "Make contemporary Algerian elegance shine.", "ابراز الاناقة الجزائرية المعاصرة."), values: [l("Precision", "Precision", "الدقة"), l("Douceur", "Softness", "الرقة"), l("Exclusivite", "Exclusivity", "التميز")], timeline: [{ year: "2024", event: l("Naissance de la maison.", "The maison is born.", "انطلاق الدار.") }, { year: "2026", event: l("Livraison dans les 58 wilayas.", "Delivery across 58 wilayas.", "التوصيل الى 58 ولاية.") }], team: [{ name: "Nour", role: l("Direction creative", "Creative direction", "الادارة الابداعية"), photo: img("/images/products/oran-mini.jpg") }] },
  customPages: [{ id: "terms", title: l("Conditions", "Terms", "الشروط"), slug: "conditions", body: l("Retours acceptes sous 7 jours si la piece est intacte.", "Returns accepted within 7 days if the piece is intact.", "تقبل المرتجعات خلال 7 ايام اذا كانت القطعة سليمة."), status: "published", seoTitle: l("Conditions ALORIA", "ALORIA Terms", "شروط ألوريا"), seoDescription: l("Conditions de vente", "Terms of sale", "شروط البيع") }],
  social: [{ platform: "Instagram", url: "https://instagram.com", enabled: true, order: 1 }, { platform: "Facebook", url: "https://facebook.com", enabled: true, order: 2 }, { platform: "TikTok", url: "https://tiktok.com", enabled: true, order: 3 }],
};

const defaultReviews: Review[] = [
  { id: "r1", name: "Lina", wilaya: "Alger", rating: 5, text: l("La finition est superbe, le sac arrive tres bien emballe.", "The finish is superb, the bag arrived beautifully packaged.", "التشطيب رائع والحقيبة وصلت بتغليف جميل."), approved: true, displayHome: true },
  { id: "r2", name: "Meriem", wilaya: "Oran", rating: 5, text: l("Elegant et pratique, exactement ce que je cherchais.", "Elegant and practical, exactly what I wanted.", "انيقة وعملية، بالضبط كما اردت."), approved: true, displayHome: true },
  { id: "r3", name: "Rania", wilaya: "Setif", rating: 4, text: l("Service tres doux et livraison rapide.", "Very gentle service and fast delivery.", "خدمة راقية وتوصيل سريع."), approved: true, displayHome: true },
];

const sampleCustomers: Customer[] = [
  { id: "u1", name: "Lina A.", phone: "+213 555 11 22 33", email: "lina@example.com", wilaya: "Alger", totalSpent: 35100, totalOrders: 2, notes: "Prefere livraison bureau", blocked: false },
  { id: "u2", name: "Meriem B.", phone: "+213 666 44 55 66", email: "meriem@example.com", wilaya: "Oran", totalSpent: 14200, totalOrders: 1, notes: "", blocked: false },
];

const sampleOrders: Order[] = [
  { id: "o1", number: "ALR-2026-0001", customerId: "u1", customerName: "Lina A.", phone: "+213 555 11 22 33", wilaya: "Alger", items: [{ productId: "p1", quantity: 1, color: "Sable", size: "M" }], total: 17000, status: "confirmed", payment: "Paiement a la livraison", shipping: "Domicile", createdAt: "2026-01-18", timeline: [{ label: "Created", date: "2026-01-18" }, { label: "Confirmed", date: "2026-01-18" }] },
  { id: "o2", number: "ALR-2026-0002", customerId: "u2", customerName: "Meriem B.", phone: "+213 666 44 55 66", wilaya: "Oran", items: [{ productId: "p2", quantity: 1, color: "Ivoire", size: "S" }], total: 14900, status: "shipped", payment: "CCP", shipping: "Bureau", createdAt: "2026-01-20", timeline: [{ label: "Created", date: "2026-01-20" }, { label: "Confirmed", date: "2026-01-20" }, { label: "Shipped", date: "2026-01-21" }] },
];

const defaultSettings: Settings = {
  defaultLanguage: "fr", currency: "DZD", freeShipping: 10000, orderFormat: "ALR-YYYY-XXXX", maintenance: false, cookieConsent: true, taxRate: 0,
  payments: { cod: true, ccp: true, cib: true, ccpDetails: "CCP 00000000 Cle 00 - ALORIA", instructions: l("Choisissez le mode qui vous convient.", "Choose your preferred method.", "اختاري طريقة الدفع المناسبة."), order: ["cod", "ccp", "cib"] },
  email: { smtpHost: "smtp.example.com", smtpUser: "contact@aloria.dz", templates: { order: l("Votre commande {{number}} est confirmee.", "Your order {{number}} is confirmed.", "تم تاكيد طلبك {{number}}."), shipped: l("Votre commande est expediee.", "Your order has shipped.", "تم شحن طلبك.") } },
  seo: { title: l("ALORIA - Maison de luxe algerienne", "ALORIA - Algerian luxury maison", "ألوريا - دار فاخرة جزائرية"), description: l("Sacs a main de luxe pour femmes en Algerie.", "Luxury handbags for women in Algeria.", "حقائب يد فاخرة للنساء في الجزائر."), keywords: "sac, luxe, algerie, femme, maroquinerie", ogImage: img("/images/hero/aloria-hero.jpg"), ga: "", pixel: "", gtm: "", robots: "User-agent: *\nAllow: /" },
  admins: [{ id: "a1", name: "Admin User", username: "admin", role: "Super Admin", lastLogin: "", active: true }],
  security: { timeoutMinutes: 120, attemptsLimit: 5, twoFactor: false, ipWhitelist: "", activityLog: ["System initialized"] },
};

const defaultTranslations: Record<Lang, Record<string, string>> = {
  fr: { nav_home: "Accueil", nav_shop: "Boutique", nav_contact: "Contact", nav_about: "A propos", cart: "Panier", wishlist: "Favoris", add_to_cart: "Ajouter au panier", buy_now: "Acheter", checkout: "Commande", admin: "Admin" },
  en: { nav_home: "Home", nav_shop: "Shop", nav_contact: "Contact", nav_about: "About", cart: "Cart", wishlist: "Wishlist", add_to_cart: "Add to cart", buy_now: "Buy now", checkout: "Checkout", admin: "Admin" },
  ar: { nav_home: "الرئيسية", nav_shop: "المتجر", nav_contact: "تواصل", nav_about: "عن ألوريا", cart: "السلة", wishlist: "المفضلة", add_to_cart: "اضافة للسلة", buy_now: "شراء", checkout: "الدفع", admin: "الادارة" },
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

const useStore = create<AppState>((set, get) => ({
  language: readLocal(storageKeys.language, "fr" as Lang),
  theme: readLocal(storageKeys.theme, themePresets["Classic Luxury"]),
  typography: readLocal(storageKeys.typography, defaultTypography),
  animations: readLocal(storageKeys.animations, defaultAnimations),
  content: readLocal(storageKeys.content, defaultContent),
  products: readLocal(storageKeys.products, sampleProducts),
  categories: readLocal(storageKeys.categories, defaultCategories),
  orders: readLocal(storageKeys.orders, sampleOrders),
  customers: readLocal(storageKeys.customers, sampleCustomers),
  cart: readLocal(storageKeys.cart, [] as CartItem[]),
  wishlist: readLocal(storageKeys.wishlist, [] as string[]),
  wilayas: readLocal(storageKeys.wilayas, defaultWilayas),
  promoCodes: readLocal(storageKeys.promoCodes, [{ id: "promo1", code: "ALORIA10", type: "percent", value: 10, min: 10000, max: 2500, limit: 100, used: 8, active: true, start: "2026-01-01", end: "2026-12-31" }] as PromoCode[]),
  media: readLocal(storageKeys.media, [{ id: "m1", url: img("/images/hero/aloria-hero.jpg"), name: "Hero campaign", folder: "hero", alt: "ALORIA hero", usedIn: "Home hero" }] as MediaItem[]),
  reviews: readLocal(storageKeys.reviews, defaultReviews),
  translations: readLocal(storageKeys.translations, defaultTranslations),
  settings: readLocal(storageKeys.settings, defaultSettings),
  setLanguage: (language) => { writeLocal(storageKeys.language, language); set({ language }); },
  updateTheme: (patch) => set((s) => { const theme = { ...s.theme, ...patch }; writeLocal(storageKeys.theme, theme); return { theme }; }),
  updateTypography: (patch) => set((s) => { const typography = { ...s.typography, ...patch }; writeLocal(storageKeys.typography, typography); return { typography }; }),
  updateAnimations: (patch) => set((s) => { const animations = { ...s.animations, ...patch }; writeLocal(storageKeys.animations, animations); return { animations }; }),
  updateContent: (content) => { writeLocal(storageKeys.content, content); set({ content }); },
  updateProducts: (products) => { writeLocal(storageKeys.products, products); set({ products }); },
  updateOrders: (orders) => { writeLocal(storageKeys.orders, orders); set({ orders }); },
  updateCustomers: (customers) => { writeLocal(storageKeys.customers, customers); set({ customers }); },
  updateCategories: (categories) => { writeLocal(storageKeys.categories, categories); set({ categories }); },
  updateWilayas: (wilayas) => { writeLocal(storageKeys.wilayas, wilayas); set({ wilayas }); },
  updatePromoCodes: (promoCodes) => { writeLocal(storageKeys.promoCodes, promoCodes); set({ promoCodes }); },
  updateMedia: (media) => { writeLocal(storageKeys.media, media); set({ media }); },
  updateReviews: (reviews) => { writeLocal(storageKeys.reviews, reviews); set({ reviews }); },
  updateSettings: (settings) => { writeLocal(storageKeys.settings, settings); set({ settings }); },
  updateTranslations: (translations) => { writeLocal(storageKeys.translations, translations); set({ translations }); },
  addToCart: (item) => set((s) => {
    const existing = s.cart.find((i) => i.productId === item.productId && i.color === item.color && i.size === item.size);
    const cart = existing ? s.cart.map((i) => (i === existing ? { ...i, quantity: i.quantity + item.quantity } : i)) : [...s.cart, item];
    writeLocal(storageKeys.cart, cart);
    return { cart };
  }),
  updateCart: (cart) => { writeLocal(storageKeys.cart, cart); set({ cart }); },
  toggleWishlist: (productId) => set((s) => { const wishlist = s.wishlist.includes(productId) ? s.wishlist.filter((id) => id !== productId) : [...s.wishlist, productId]; writeLocal(storageKeys.wishlist, wishlist); return { wishlist }; }),
  backup: () => JSON.stringify({ products: get().products, orders: get().orders, customers: get().customers, categories: get().categories, cart: get().cart, wishlist: get().wishlist, theme: get().theme, typography: get().typography, content: get().content, translations: get().translations, wilayas: get().wilayas, promoCodes: get().promoCodes, media: get().media, reviews: get().reviews, settings: get().settings, animations: get().animations }, null, 2),
  restore: (json) => {
    const data = JSON.parse(json) as Partial<AppState>;
    if (data.products) writeLocal(storageKeys.products, data.products);
    if (data.orders) writeLocal(storageKeys.orders, data.orders);
    if (data.customers) writeLocal(storageKeys.customers, data.customers);
    if (data.categories) writeLocal(storageKeys.categories, data.categories);
    if (data.cart) writeLocal(storageKeys.cart, data.cart);
    if (data.wishlist) writeLocal(storageKeys.wishlist, data.wishlist);
    if (data.theme) writeLocal(storageKeys.theme, data.theme);
    if (data.typography) writeLocal(storageKeys.typography, data.typography);
    if (data.content) writeLocal(storageKeys.content, data.content);
    if (data.translations) writeLocal(storageKeys.translations, data.translations);
    if (data.wilayas) writeLocal(storageKeys.wilayas, data.wilayas);
    if (data.promoCodes) writeLocal(storageKeys.promoCodes, data.promoCodes);
    if (data.media) writeLocal(storageKeys.media, data.media);
    if (data.reviews) writeLocal(storageKeys.reviews, data.reviews);
    if (data.settings) writeLocal(storageKeys.settings, data.settings);
    if (data.animations) writeLocal(storageKeys.animations, data.animations);
    set(data as Partial<AppState>);
  },
}));

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return { path, navigate };
}

function useT() {
  const { language, translations } = useStore();
  return (key: string) => translations[language]?.[key] || defaultTranslations[language]?.[key] || key;
}

function localized(value: Localized | undefined, lang: Lang) {
  return value?.[lang] || value?.fr || "";
}

function AppEffects() {
  const { theme, typography, animations, language, content } = useStore();
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-bg", theme.primaryBg);
    root.style.setProperty("--secondary-bg", theme.secondaryBg);
    root.style.setProperty("--card-bg", theme.cardBg);
    root.style.setProperty("--gold", theme.primaryGold);
    root.style.setProperty("--dark-gold", theme.darkGold);
    root.style.setProperty("--text", theme.primaryText);
    root.style.setProperty("--muted", theme.secondaryText);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--success", theme.success);
    root.style.setProperty("--error", theme.error);
    root.style.setProperty("--warning", theme.warning);
    root.style.setProperty("--font-logo", `'${typography.logoFont}', serif`);
    root.style.setProperty("--font-heading", `'${typography.headingFont}', serif`);
    root.style.setProperty("--font-body", language === "ar" ? `'${typography.arabicFont}', sans-serif` : `'${typography.bodyFont}', sans-serif`);
    root.style.setProperty("--font-decor", `'${typography.decorativeFont}', serif`);
    root.style.setProperty("--base-size", `${typography.baseSize}px`);
    root.style.setProperty("--heading-scale", `${typography.headingScale}`);
    root.style.setProperty("--logo-tracking", `${typography.letterSpacing}em`);
    root.style.setProperty("--line-height", `${typography.lineHeight}`);
    root.dir = language === "ar" ? "rtl" : "ltr";
    document.title = localized(content.identity.siteName, language) + " - " + localized(content.identity.tagline, language);
  }, [theme, typography, language, content]);
  useEffect(() => {
    const id = "aloria-google-fonts";
    const existing = document.getElementById(id);
    const fonts = [typography.logoFont, typography.headingFont, typography.bodyFont, typography.arabicFont, typography.decorativeFont].filter(Boolean);
    const unique = Array.from(new Set(fonts)).map((f) => `family=${f.replace(/ /g, "+")}:wght@300;400;500;600;700;800`);
    const href = `https://fonts.googleapis.com/css2?${unique.join("&")}&display=swap`;
    if (existing) existing.setAttribute("href", href);
    else {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, [typography]);
  useEffect(() => {
    document.body.classList.toggle("no-motion", !animations.enabled);
  }, [animations.enabled]);
  return null;
}

function LoadingScreen() {
  const enabled = useStore((s) => s.animations.loadingScreen && s.animations.enabled);
  const [show, setShow] = useState(enabled);
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => setShow(false), 1200);
    return () => window.clearTimeout(timer);
  }, [enabled]);
  if (!show) return null;
  return <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-[var(--primary-bg)]" exit={{ opacity: 0 }}><motion.div initial={{ opacity: 0, y: 20, letterSpacing: "0.1em" }} animate={{ opacity: 1, y: 0, letterSpacing: "0.45em" }} transition={{ duration: 0.9 }} className="font-logo text-3xl font-bold text-[var(--text)]">ALORIA</motion.div></motion.div>;
}

function CustomCursor() {
  const enabled = useStore((s) => s.animations.customCursor && s.animations.enabled);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => setHover(Boolean((e.target as HTMLElement).closest("a,button,input,select,textarea,[data-hover]")));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, [enabled]);
  if (!enabled || window.matchMedia("(pointer: coarse)").matches) return null;
  return <motion.div className="pointer-events-none fixed z-[120] h-7 w-7 rounded-full border border-[var(--gold)] mix-blend-multiply" animate={{ x: pos.x - 14, y: pos.y - 14, scale: hover ? 1.9 : 1 }} transition={{ type: "spring", stiffness: 420, damping: 28 }} />;
}

function Page({ children }: { children: React.ReactNode }) {
  const animations = useStore((s) => s.animations);
  if (!animations.enabled || !animations.pageTransitions) return <>{children}</>;
  return <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: animations.speed === "slow" ? 1 : animations.speed === "fast" ? 0.45 : 0.8 }}>{children}</motion.main>;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const enabled = useStore((s) => s.animations.enabled && s.animations.scrollAnimations);
  if (!enabled) return <>{children}</>;
  return <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay }}>{children}</motion.div>;
}

function IconByName({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const icons: Record<string, React.ElementType> = { Phone, Mail, MapPin, Clock, Sparkles, Truck, Shield, Heart, Image, Palette, Brush, Settings, User, Package };
  const Icon = icons[name] || Sparkles;
  return <Icon className={className} />;
}

function Button({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger"; className?: string; type?: "button" | "submit"; disabled?: boolean }) {
  const base = "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition disabled:opacity-50";
  const styles = variant === "primary" ? "bg-[var(--text)] text-[var(--primary-bg)] shadow-[0_14px_35px_rgba(0,0,0,0.12)] before:absolute before:inset-0 before:-translate-x-full before:bg-[var(--gold)] before:transition before:duration-500 hover:before:translate-x-0" : variant === "secondary" ? "border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] hover:border-[var(--gold)]" : variant === "danger" ? "bg-[var(--error)] text-white" : "text-[var(--text)] hover:text-[var(--gold)]";
  return <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles} ${className}`} data-hover><span className="relative z-10 inline-flex items-center gap-2">{children}</span></button>;
}

function Input({ label, value, onChange, type = "text", placeholder = "", className = "" }: { label?: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string }) {
  return <label className={`group block ${className}`}><span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span><input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[color:var(--gold)]/10" /></label>;
}

function Textarea({ label, value, onChange, rows = 4 }: { label?: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return <label className="block"><span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span><textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[color:var(--gold)]/10" /></label>;
}

function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return <label className="block"><span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)]"><option value="">Selectionner</option>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-left text-sm"><span>{label}</span><span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-[var(--gold)]" : "bg-[var(--border)]"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`} /></span></button>;
}

function FileInput({ label, onLoad }: { label: string; onLoad: (url: string) => void }) {
  return <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--secondary-bg)]/45 p-6 text-center text-sm text-[var(--muted)] transition hover:border-[var(--gold)]"><Upload className="mb-2 h-5 w-5 text-[var(--gold)]" />{label}<input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => onLoad(String(reader.result)); reader.readAsDataURL(file); }} /></label>;
}

function LanguageSwitcher() {
  const { language, setLanguage } = useStore();
  return <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--card-bg)] p-1 text-xs font-semibold"><button className={`rounded-full px-3 py-2 ${language === "fr" ? "bg-[var(--text)] text-[var(--primary-bg)]" : ""}`} onClick={() => setLanguage("fr")}>FR</button><button className={`rounded-full px-3 py-2 ${language === "en" ? "bg-[var(--text)] text-[var(--primary-bg)]" : ""}`} onClick={() => setLanguage("en")}>EN</button><button className={`rounded-full px-3 py-2 ${language === "ar" ? "bg-[var(--text)] text-[var(--primary-bg)]" : ""}`} onClick={() => setLanguage("ar")}>AR</button></div>;
}

function AnnouncementBar({ navigate }: { navigate: (to: string) => void }) {
  const { content, language } = useStore();
  if (!content.announcement.enabled) return null;
  return <button onClick={() => navigate(content.announcement.link)} className="w-full px-4 py-2 text-center text-xs uppercase tracking-[0.18em]" style={{ background: content.announcement.bg, color: content.announcement.color }}>{localized(content.announcement.text, language)}</button>;
}

function Navbar({ navigate, path }: { navigate: (to: string) => void; path: string }) {
  const { content, language, cart, wishlist } = useStore();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  const links = [["/", t("nav_home")], ["/boutique", t("nav_shop")], ["/about", t("nav_about")], ["/contact", t("nav_contact")]];
  return <>
    <AnnouncementBar navigate={navigate} />
    <header className={`sticky top-0 z-40 border-b border-[var(--border)] transition ${scrolled ? "bg-[var(--primary-bg)]/80 backdrop-blur-xl" : "bg-[var(--primary-bg)]"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <button className="lg:hidden" onClick={() => setOpen(true)}><Menu /></button>
        <button onClick={() => navigate("/")} className="text-left"><span className="font-logo block text-xl font-bold tracking-[var(--logo-tracking)]">{localized(content.identity.siteName, language)}</span><span className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">{localized(content.identity.tagline, language)}</span></button>
        <nav className="hidden items-center gap-8 lg:flex">{links.map(([href, label]) => <button key={href} onClick={() => navigate(href)} className={`nav-link text-sm ${path === href ? "text-[var(--gold)]" : "text-[var(--text)]"}`}>{label}</button>)}</nav>
        <div className="flex items-center gap-2"><LanguageSwitcher /><button onClick={() => navigate("/wishlist")} className="relative hidden rounded-full border border-[var(--border)] p-3 lg:block"><Heart className="h-4 w-4" />{wishlist.length > 0 && <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[var(--gold)] text-[10px] text-white">{wishlist.length}</span>}</button><button onClick={() => navigate("/checkout")} className="cart-bounce relative rounded-full bg-[var(--text)] p-3 text-[var(--primary-bg)]"><ShoppingBag className="h-4 w-4" />{cart.length > 0 && <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[var(--gold)] text-[10px] text-white">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}</button></div>
      </div>
    </header>
    <AnimatePresence>{open && <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed inset-y-0 left-0 z-50 w-80 border-r border-[var(--border)] bg-[var(--primary-bg)] p-6"><div className="mb-10 flex items-center justify-between"><span className="font-logo text-xl tracking-[0.3em]">ALORIA</span><button onClick={() => setOpen(false)}><X /></button></div><div className="grid gap-4">{links.map(([href, label]) => <button key={href} onClick={() => { navigate(href); setOpen(false); }} className="text-left text-2xl font-heading">{label}</button>)}<Button onClick={() => navigate("/admin/login")} variant="secondary">Admin</Button></div></motion.aside>}</AnimatePresence>
  </>;
}

function Footer({ navigate }: { navigate: (to: string) => void }) {
  const { content, language } = useStore();
  return <footer className="border-t border-[var(--border)] bg-[var(--secondary-bg)]/70 px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]"><div><div className="font-logo text-3xl font-bold tracking-[var(--logo-tracking)]">{localized(content.identity.siteName, language)}</div><p className="mt-4 max-w-md text-[var(--muted)]">{localized(content.identity.description, language)}</p><div className="mt-6 flex gap-3">{content.social.filter((s) => s.enabled).sort((a, b) => a.order - b.order).map((s) => <a key={s.platform} href={s.url} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">{s.platform}</a>)}</div></div><div><h3 className="font-heading text-xl">Maison</h3><div className="mt-4 grid gap-2 text-sm text-[var(--muted)]"><button onClick={() => navigate("/boutique")} className="text-left">Boutique</button><button onClick={() => navigate("/about")} className="text-left">A propos</button><button onClick={() => navigate("/contact")} className="text-left">Contact</button><button onClick={() => navigate("/pages/conditions")} className="text-left">Conditions</button></div></div><div><h3 className="font-heading text-xl">Newsletter</h3><p className="mt-4 text-sm text-[var(--muted)]">{localized(content.home.newsletterSubtitle, language)}</p><div className="mt-4 flex rounded-full border border-[var(--border)] bg-[var(--card-bg)] p-1"><input className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" placeholder="email@exemple.com" /><button className="rounded-full bg-[var(--text)] px-5 text-sm text-[var(--primary-bg)]">OK</button></div></div></div></footer>;
}

function PublicLayout({ children, navigate, path }: { children: React.ReactNode; navigate: (to: string) => void; path: string }) {
  return <div className="min-h-screen bg-[var(--primary-bg)] text-[var(--text)]"><Navbar navigate={navigate} path={path} />{children}<Footer navigate={navigate} /><WhatsAppButton /><ScrollToTop /></div>;
}

function WhatsAppButton() {
  const number = useStore((s) => s.content.contact.whatsapp);
  return <a href={`https://wa.me/${number.replace(/\D/g, "")}`} className="fixed bottom-6 left-6 z-40 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-2xl">WhatsApp</a>;
}

function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const fn = () => setShow(window.scrollY > 700); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  if (!show) return null;
  return <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-40 rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 text-sm shadow-xl">Top</button>;
}

function HomePage({ navigate }: { navigate: (to: string) => void }) {
  const { content, language, products, reviews, animations } = useStore();
  const featured = content.home.featuredProducts.map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, content.home.featuredCount) as Product[];
  return <Page>
    <section className="relative min-h-[calc(100vh-104px)] overflow-hidden">
      <div className="absolute inset-0"><motion.img src={content.home.heroImages[0]} alt="ALORIA" className="h-full w-full object-cover" animate={animations.enabled && animations.parallax ? { scale: [1.03, 1.08, 1.03] } : {}} transition={{ duration: 12, repeat: Infinity }} /><div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-bg)] via-[var(--primary-bg)]/70 to-transparent" /></div>
      <div className="absolute inset-x-0 top-16 text-center font-logo text-[18vw] font-bold tracking-[0.25em] text-[var(--text)] opacity-[0.03]">ALORIA</div>
      <div className="relative mx-auto flex min-h-[calc(100vh-104px)] max-w-7xl items-center px-5 py-20 lg:px-8"><div className="max-w-2xl"><motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-5 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">{localized(content.identity.tagline, language)}</motion.p><h1 className="font-logo text-6xl font-bold uppercase leading-[0.88] tracking-[var(--logo-tracking)] md:text-8xl">{localized(content.home.heroTitle, language)}</h1><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-5 font-heading text-3xl italic text-[var(--gold)] md:text-5xl">{localized(content.home.heroHighlight, language)}</motion.p><p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{localized(content.home.heroSubtitle, language)}</p><div className="mt-9 flex flex-wrap gap-4"><Button onClick={() => navigate(content.home.cta1Link)}>{localized(content.home.cta1, language)} <ChevronRight className="h-4 w-4" /></Button><Button onClick={() => navigate(content.home.cta2Link)} variant="secondary">{localized(content.home.cta2, language)}</Button></div></div></div>
    </section>
    {content.home.marqueeEnabled && animations.marquee && <div className="overflow-hidden border-y border-[var(--border)] bg-[var(--text)] py-4 text-[var(--primary-bg)]"><div className="marquee flex w-max gap-10" style={{ animationDuration: `${content.home.marqueeSpeed}s` }}>{[...content.home.marquee, ...content.home.marquee, ...content.home.marquee].map((m, i) => <span key={i} className="flex items-center gap-10 text-sm uppercase tracking-[0.24em]"><span>{localized(m, language)}</span><span className="text-[var(--gold)]">✦</span></span>)}</div></div>}
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><Reveal><div className="mb-12 max-w-2xl"><h2 className="font-heading text-5xl">{localized(content.home.featuredTitle, language)}</h2><p className="mt-4 text-[var(--muted)]">{localized(content.home.featuredSubtitle, language)}</p></div></Reveal><ProductGrid products={featured} navigate={navigate} /></section>
    <section className="bg-[var(--secondary-bg)]/60 px-5 py-24 lg:px-8"><div className="mx-auto max-w-7xl"><Reveal><h2 className="font-heading text-5xl">{localized(content.home.whyTitle, language)}</h2></Reveal><div className="mt-12 grid gap-8 md:grid-cols-4">{content.home.why.map((f, i) => <Reveal key={i} delay={i * 0.1}><div className="border-t border-[var(--border)] pt-6"><IconByName name={f.icon} className="mb-6 h-7 w-7 text-[var(--gold)]" /><h3 className="font-heading text-2xl">{localized(f.title, language)}</h3><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{localized(f.description, language)}</p></div></Reveal>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><Reveal><h2 className="font-heading text-5xl">Elles portent ALORIA</h2></Reveal><div className="mt-12 grid gap-6 lg:grid-cols-3">{reviews.filter((r) => r.approved && r.displayHome).map((r, i) => <Reveal key={r.id} delay={i * 0.1}><blockquote className="rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-7 shadow-[0_4px_30px_rgba(0,0,0,0.04)]"><div className="mb-4 flex text-[var(--gold)]">{Array.from({ length: r.rating }).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}</div><p className="leading-7 text-[var(--muted)]">"{localized(r.text, language)}"</p><footer className="mt-6 font-semibold">{r.name} - {r.wilaya}</footer></blockquote></Reveal>)}</div></section>
    <section className="px-5 pb-24 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="mb-10 font-heading text-5xl">Instagram</h2><div className="grid gap-4 md:grid-cols-3">{content.home.instagram.map((item) => <a key={item.caption} href={item.link} className="group relative aspect-square overflow-hidden"><img src={item.image} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 text-white">{item.caption}</span></a>)}</div></div></section>
  </Page>;
}

function ProductCard({ product, navigate }: { product: Product; navigate: (to: string) => void }) {
  const { language, addToCart, toggleWishlist, wishlist, animations } = useStore();
  const t = useT();
  const sale = product.salePrice || product.price;
  return <motion.article whileHover={animations.enabled && animations.hoverEffects ? { y: -8 } : {}} className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[0_4px_30px_rgba(0,0,0,0.04)]"><button onClick={() => navigate(`/boutique/${product.slug}`)} className="relative block aspect-[4/5] w-full overflow-hidden bg-[var(--secondary-bg)]"><img src={product.images[0]} alt={localized(product.alt, language)} className="h-full w-full object-cover transition duration-700 group-hover:scale-108" />{product.badges[0] && <span className="badge-pulse absolute left-4 top-4 rounded-full bg-[var(--text)] px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-[var(--primary-bg)]">{product.badges[0]}</span>}<span className="absolute inset-x-4 bottom-4 translate-y-8 rounded-full bg-[var(--primary-bg)]/95 px-4 py-3 text-sm font-semibold opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">Voir details</span></button><div className="p-5"><div className="flex items-start justify-between gap-3"><button onClick={() => navigate(`/boutique/${product.slug}`)} className="text-left"><h3 className="font-heading text-2xl">{localized(product.name, language)}</h3><p className="mt-1 text-sm text-[var(--muted)]">{localized(product.shortDescription, language)}</p></button><button onClick={() => { toggleWishlist(product.id); toast.success("Wishlist mise a jour"); }} className="rounded-full border border-[var(--border)] p-2"><Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-[var(--gold)] text-[var(--gold)]" : ""}`} /></button></div><div className="mt-5 flex items-center justify-between"><div className="font-semibold"><span>{money(sale)}</span>{product.salePrice && <span className="ms-2 text-xs text-[var(--muted)] line-through">{money(product.price)}</span>}</div><button onClick={() => { addToCart({ productId: product.id, quantity: 1, color: localized(product.colors[0]?.name, language), size: product.sizes[0] }); toast.success(t("add_to_cart")); }} className="rounded-full bg-[var(--text)] px-4 py-2 text-xs font-semibold text-[var(--primary-bg)]">{t("add_to_cart")}</button></div></div></motion.article>;
}

function ProductGrid({ products, navigate }: { products: Product[]; navigate: (to: string) => void }) {
  return <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{products.map((p, i) => <Reveal key={p.id} delay={i * 0.08}><ProductCard product={p} navigate={navigate} /></Reveal>)}</div>;
}

function BoutiquePage({ navigate }: { navigate: (to: string) => void }) {
  const { content, language, products } = useStore();
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState(content.boutique.defaultSort);
  const filtered = useMemo(() => products.filter((p) => p.status === "active").filter((p) => filter === "ALL" || p.badges.includes(filter.replace("BESTSELLERS", "BESTSELLER"))), [products, filter]);
  const sorted = [...filtered].sort((a, b) => sort === "price-asc" ? (a.salePrice || a.price) - (b.salePrice || b.price) : sort === "price-desc" ? (b.salePrice || b.price) - (a.salePrice || a.price) : Number(b.featured) - Number(a.featured));
  return <Page><section className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Accueil / Boutique</p><h1 className="mt-5 font-heading text-6xl md:text-8xl">{localized(content.boutique.title, language)}</h1><p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">{localized(content.boutique.subtitle, language)}</p><div className="mt-10 flex flex-wrap items-center justify-between gap-5">{content.boutique.filtersEnabled && <div className="flex flex-wrap gap-2">{Object.entries(content.boutique.filterLabels).map(([key, label]) => <button key={key} onClick={() => setFilter(key)} className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.14em] ${filter === key ? "border-[var(--text)] bg-[var(--text)] text-[var(--primary-bg)]" : "border-[var(--border)]"}`}>{localized(label, language)}</button>)}</div>}<select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-5 py-3 text-sm"><option value="featured">Featured</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix decroissant</option></select></div><div className="mt-12"><ProductGrid products={sorted.slice(0, content.boutique.productsPerPage)} navigate={navigate} /></div><div className="mt-12 flex justify-center gap-2"><button className="rounded-full bg-[var(--text)] px-5 py-2 text-sm text-[var(--primary-bg)]">1</button><button className="rounded-full border border-[var(--border)] px-5 py-2 text-sm">2</button></div></div></section></Page>;
}

function SingleProductPage({ slug, navigate }: { slug: string; navigate: (to: string) => void }) {
  const { products, language, addToCart } = useStore();
  const t = useT();
  const product = products.find((p) => p.slug === slug || p.seo.slug === slug) || products[0];
  const [color, setColor] = useState(localized(product.colors[0]?.name, language));
  const [size, setSize] = useState(product.sizes[0] || "M");
  const [open, setOpen] = useState("details");
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  return <Page><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Boutique / {localized(product.name, language)}</p><h1 className="mt-5 max-w-5xl font-heading text-6xl md:text-8xl">{localized(product.name, language)}</h1><div className="mt-12 grid gap-12 lg:grid-cols-2"><div className="relative"><div className="aspect-[4/5] overflow-hidden bg-[var(--secondary-bg)]"><img src={product.images[0]} className="h-full w-full object-cover" /></div><div className="circular-text absolute -right-6 top-8 hidden h-28 w-28 rounded-full border border-[var(--gold)] bg-[var(--primary-bg)] text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] md:grid place-items-center">ALORIA ✦ LUXE ✦</div></div><div><div className="flex items-center gap-3"><span className="text-3xl font-semibold">{money(product.salePrice || product.price)}</span>{product.salePrice && <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-bold text-white">-{Math.round((1 - product.salePrice / product.price) * 100)}%</span>}</div><p className="mt-6 text-lg leading-8 text-[var(--muted)]">{localized(product.description, language)}</p><div className="mt-8"><p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Couleur</p><div className="flex gap-3">{product.colors.map((c) => <button key={c.value} onClick={() => setColor(localized(c.name, language))} className={`h-10 w-10 rounded-full border-2 ${color === localized(c.name, language) ? "border-[var(--text)]" : "border-transparent"}`} style={{ background: c.value }} title={localized(c.name, language)} />)}</div></div><div className="mt-7"><p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Taille</p><div className="flex gap-3">{product.sizes.map((s) => <button key={s} onClick={() => setSize(s)} className={`rounded-full border px-5 py-2 text-sm ${size === s ? "border-[var(--text)] bg-[var(--text)] text-[var(--primary-bg)]" : "border-[var(--border)]"}`}>{s}</button>)}</div></div><div className="mt-9 flex flex-wrap gap-3"><Button onClick={() => { addToCart({ productId: product.id, quantity: 1, color, size }); toast.success(t("add_to_cart")); }}>{t("add_to_cart")}</Button><Button onClick={() => { addToCart({ productId: product.id, quantity: 1, color, size }); navigate("/checkout"); }} variant="secondary">{t("buy_now")}</Button></div><div className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]">{[["details", "Details"], ["delivery", "Livraison 58 wilayas"], ["payment", "Paiement"]].map(([id, label]) => <div key={id}><button onClick={() => setOpen(open === id ? "" : id)} className="flex w-full items-center justify-between py-5 text-left font-semibold">{label}<ChevronDown className={`transition ${open === id ? "rotate-180" : ""}`} /></button>{open === id && <p className="pb-5 text-sm leading-7 text-[var(--muted)]">{id === "details" ? localized(product.description, language) : id === "delivery" ? "Livraison a domicile ou bureau, tarifs controles dans l'administration." : "Paiement a la livraison, CCP, CIB ou EDAHABIA."}</p>}</div>)}</div></div></div><div className="mt-24"><h2 className="mb-10 font-heading text-4xl">Pieces associees</h2><ProductGrid products={related} navigate={navigate} /></div></section></Page>;
}

function CheckoutPage({ navigate }: { navigate: (to: string) => void }) {
  const { cart, updateCart, products, language, wilayas, settings, orders, updateOrders, customers, updateCustomers } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", email: "", wilaya: "Alger", address: "", shipping: "home", payment: "cod", promo: "" });
  const checkoutSchema = z.object({ name: z.string().min(2), phone: z.string().min(8), wilaya: z.string().min(1), address: z.string().min(4) });
  const subtotal = cart.reduce((sum, item) => sum + ((products.find((p) => p.id === item.productId)?.salePrice || products.find((p) => p.id === item.productId)?.price || 0) * item.quantity), 0);
  const wilaya = wilayas.find((w) => w.name === form.wilaya) || wilayas[0];
  const shipping = subtotal >= settings.freeShipping ? 0 : form.shipping === "home" ? wilaya.homePrice : wilaya.officePrice;
  const total = subtotal + shipping;
  const submit = () => {
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) { toast.error("Veuillez completer les champs obligatoires"); return; }
    const id = uid("o");
    const order: Order = { id, number: `ALR-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, "0")}`, customerId: uid("u"), customerName: form.name, phone: form.phone, wilaya: form.wilaya, items: cart, total, status: "created", payment: form.payment, shipping: form.shipping, createdAt: new Date().toISOString().slice(0, 10), timeline: [{ label: "Created", date: new Date().toISOString().slice(0, 10) }] };
    updateOrders([order, ...orders]);
    updateCustomers([{ id: order.customerId, name: form.name, phone: form.phone, email: form.email, wilaya: form.wilaya, totalSpent: total, totalOrders: 1, notes: "", blocked: false }, ...customers]);
    updateCart([]);
    toast.success("Commande confirmee");
    navigate("/checkout/success");
  };
  return <Page><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><h1 className="font-heading text-6xl">Commande</h1><div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px]"><div className="space-y-8"><div><h2 className="mb-5 font-heading text-3xl">Panier</h2><div className="divide-y divide-[var(--border)] rounded-3xl border border-[var(--border)] bg-[var(--card-bg)]">{cart.length === 0 ? <div className="p-8 text-[var(--muted)]">Votre panier est vide.</div> : cart.map((item, i) => { const p = products.find((x) => x.id === item.productId); if (!p) return null; return <div key={`${item.productId}-${i}`} className="flex gap-4 p-4"><img src={p.images[0]} className="h-24 w-20 object-cover" /><div className="flex-1"><h3 className="font-heading text-xl">{localized(p.name, language)}</h3><p className="text-sm text-[var(--muted)]">{item.color} / {item.size}</p><p className="mt-2 font-semibold">{money(p.salePrice || p.price)}</p></div><div className="flex items-center gap-2"><button onClick={() => updateCart(cart.map((x, idx) => idx === i ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x))} className="rounded-full border px-3">-</button><span>{item.quantity}</span><button onClick={() => updateCart(cart.map((x, idx) => idx === i ? { ...x, quantity: x.quantity + 1 } : x))} className="rounded-full border px-3">+</button></div><button onClick={() => updateCart(cart.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></button></div>; })}</div></div><div><h2 className="mb-5 font-heading text-3xl">Livraison</h2><div className="grid gap-4 md:grid-cols-2"><Input label="Nom complet" value={form.name} onChange={(v) => setForm({ ...form, name: v })} /><Input label="Telephone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} /><Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} /><Select label="Wilaya" value={form.wilaya} onChange={(v) => setForm({ ...form, wilaya: v })} options={wilayas.filter((w) => w.enabled).map((w) => ({ value: w.name, label: `${w.code}. ${w.name}` }))} /></div><div className="mt-4"><Textarea label="Adresse" value={form.address} onChange={(v) => setForm({ ...form, address: v })} /></div></div><div><h2 className="mb-5 font-heading text-3xl">Options</h2><div className="grid gap-4 md:grid-cols-2"><button onClick={() => setForm({ ...form, shipping: "home" })} className={`rounded-3xl border p-5 text-left ${form.shipping === "home" ? "border-[var(--gold)]" : "border-[var(--border)]"}`}>Domicile<br /><span className="text-sm text-[var(--muted)]">{money(wilaya.homePrice)}</span></button><button onClick={() => setForm({ ...form, shipping: "office" })} className={`rounded-3xl border p-5 text-left ${form.shipping === "office" ? "border-[var(--gold)]" : "border-[var(--border)]"}`}>Bureau<br /><span className="text-sm text-[var(--muted)]">{money(wilaya.officePrice)}</span></button></div><div className="mt-4 grid gap-3 md:grid-cols-3">{settings.payments.cod && <button onClick={() => setForm({ ...form, payment: "cod" })} className={`rounded-2xl border p-4 ${form.payment === "cod" ? "border-[var(--gold)]" : "border-[var(--border)]"}`}>COD</button>}{settings.payments.ccp && <button onClick={() => setForm({ ...form, payment: "ccp" })} className={`rounded-2xl border p-4 ${form.payment === "ccp" ? "border-[var(--gold)]" : "border-[var(--border)]"}`}>CCP</button>}{settings.payments.cib && <button onClick={() => setForm({ ...form, payment: "cib" })} className={`rounded-2xl border p-4 ${form.payment === "cib" ? "border-[var(--gold)]" : "border-[var(--border)]"}`}>CIB/EDAHABIA</button>}</div></div></div><aside className="h-fit rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-7 shadow-[0_4px_30px_rgba(0,0,0,0.06)]"><h2 className="font-heading text-3xl">Resume</h2><Input label="Code promo" value={form.promo} onChange={(v) => setForm({ ...form, promo: v })} className="mt-6" /><div className="mt-6 space-y-3 text-sm"><div className="flex justify-between"><span>Sous-total</span><span>{money(subtotal)}</span></div><div className="flex justify-between"><span>Livraison</span><span>{money(shipping)}</span></div><div className="flex justify-between border-t border-[var(--border)] pt-4 text-lg font-semibold"><span>Total</span><span>{money(total)}</span></div></div><Button onClick={submit} className="mt-8 w-full" disabled={cart.length === 0}>Confirmer la commande</Button></aside></div></section></Page>;
}

function ContactPage() {
  const { content, language } = useStore();
  const [form, setForm] = useState({ name: "", email: "", subject: "Commande", message: "" });
  return <Page><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><h1 className="font-heading text-6xl md:text-8xl">{localized(content.contact.title, language)}</h1><p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">{localized(content.contact.subtitle, language)}</p><div className="mt-12 grid gap-5 md:grid-cols-4">{content.contact.cards.map((c) => <div key={localized(c.title, language)} className="rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-6"><IconByName name={c.icon} className="mb-5 h-6 w-6 text-[var(--gold)]" /><h3 className="font-heading text-2xl">{localized(c.title, language)}</h3><p className="mt-2 font-semibold">{localized(c.value, language)}</p><p className="text-sm text-[var(--muted)]">{localized(c.subtitle, language)}</p></div>)}</div><div className="mt-12 grid gap-10 lg:grid-cols-2"><div className="rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-7"><h2 className="font-heading text-3xl">Envoyer un message</h2><div className="mt-6 grid gap-4"><Input label="Nom" value={form.name} onChange={(v) => setForm({ ...form, name: v })} /><Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} /><Select label="Sujet" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} options={["Commande", "Produit", "Livraison", "Partenariat"].map((x) => ({ value: x, label: x }))} /><Textarea label="Message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} /><Button onClick={() => toast.success("Message envoye")}>Envoyer</Button></div></div><div className="rounded-3xl border border-[var(--border)] bg-[var(--secondary-bg)] p-8"><h2 className="font-heading text-3xl">Horaires</h2><p className="mt-4 text-[var(--muted)]">{localized(content.contact.hours, language)}</p><h3 className="mt-10 font-heading text-2xl">Reseaux sociaux</h3><div className="mt-4 flex gap-3">{content.social.filter((s) => s.enabled).map((s) => <a className="rounded-full border border-[var(--border)] px-4 py-2" href={s.url} key={s.platform}>{s.platform}</a>)}</div></div></div></section></Page>;
}

function AboutPage() {
  const { content, language } = useStore();
  return <Page><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><h1 className="font-heading text-6xl md:text-8xl">{localized(content.about.title, language)}</h1><p className="mt-5 max-w-3xl text-xl leading-9 text-[var(--muted)]">{localized(content.about.subtitle, language)}</p><div className="mt-16 grid gap-10 lg:grid-cols-2"><div><h2 className="font-heading text-4xl">Histoire</h2><p className="mt-5 text-lg leading-9 text-[var(--muted)]">{localized(content.about.story, language)}</p></div><div className="space-y-6"><div className="border-t border-[var(--border)] pt-5"><h3 className="font-heading text-3xl">Mission</h3><p className="mt-2 text-[var(--muted)]">{localized(content.about.mission, language)}</p></div><div className="border-t border-[var(--border)] pt-5"><h3 className="font-heading text-3xl">Vision</h3><p className="mt-2 text-[var(--muted)]">{localized(content.about.vision, language)}</p></div></div></div><div className="mt-16 grid gap-6 md:grid-cols-3">{content.about.values.map((v) => <div key={localized(v, language)} className="border-t border-[var(--gold)] pt-5 font-heading text-3xl italic text-[var(--gold)]">{localized(v, language)}</div>)}</div><div className="mt-16"><h2 className="font-heading text-4xl">Timeline</h2><div className="mt-6 grid gap-4">{content.about.timeline.map((t) => <div key={t.year} className="flex gap-6 border-t border-[var(--border)] py-5"><span className="font-logo text-2xl text-[var(--gold)]">{t.year}</span><span>{localized(t.event, language)}</span></div>)}</div></div></section></Page>;
}

function WishlistPage({ navigate }: { navigate: (to: string) => void }) {
  const { products, wishlist } = useStore();
  return <Page><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><h1 className="font-heading text-6xl">Favoris</h1><div className="mt-12"><ProductGrid products={products.filter((p) => wishlist.includes(p.id))} navigate={navigate} /></div></section></Page>;
}

function CustomPage({ slug }: { slug: string }) {
  const { content, language } = useStore();
  const page = content.customPages.find((p) => p.slug === slug) || content.customPages[0];
  return <Page><section className="mx-auto max-w-4xl px-5 py-20 lg:px-8"><h1 className="font-heading text-6xl">{localized(page.title, language)}</h1><p className="mt-8 whitespace-pre-line text-lg leading-9 text-[var(--muted)]">{localized(page.body, language)}</p></section></Page>;
}

function AdminLogin({ navigate }: { navigate: (to: string) => void }) {
  const [form, setForm] = useState({ username: "", password: "", remember: true });
  const [shake, setShake] = useState(false);
  const login = () => {
    if (form.username === "admin" && form.password === "admin123") {
      const expiry = Date.now() + (form.remember ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 120);
      writeLocal(storageKeys.session, { username: "admin", expiry });
      toast.success("Bienvenue");
      navigate("/admin/dashboard");
    } else { setShake(true); window.setTimeout(() => setShake(false), 550); toast.error("Identifiants invalides"); }
  };
  return <div className="grid min-h-screen place-items-center bg-[var(--primary-bg)] px-5"><motion.div animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : {}} className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--card-bg)] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.08)]"><div className="text-center"><div className="font-logo text-3xl font-bold tracking-[0.35em]">ALORIA</div><div className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--gold)]">Admin Panel</div></div><div className="mt-8 grid gap-4"><Input label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} /><Input label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> Remember me</label><Button onClick={login} className="w-full">Connexion</Button><p className="text-center text-xs text-[var(--muted)]">Default: admin / admin123</p></div></motion.div></div>;
}

function isLoggedIn() {
  const session = readLocal<{ username: string; expiry: number } | null>(storageKeys.session, null);
  return Boolean(session && session.expiry > Date.now());
}

type AdminLink = [string, string, React.ElementType];

const adminLinks: { group: string; items: AdminLink[] }[] = [
  { group: "PRINCIPAL", items: [["/admin/dashboard", "Tableau de Bord", LayoutDashboard], ["/admin/orders", "Commandes", ShoppingBag], ["/admin/products", "Produits", Package], ["/admin/customers", "Clientes", Users], ["/admin/categories", "Categories", Menu]] },
  { group: "APPARENCE", items: [["/admin/appearance/theme", "Theme & Couleurs", Palette], ["/admin/appearance/typography", "Typographie", Brush], ["/admin/appearance/logo", "Logo & Identite", Image], ["/admin/appearance/animations", "Animations", Wand2]] },
  { group: "CONTENU DU SITE", items: [["/admin/content/home", "Page Accueil", Home], ["/admin/content/boutique", "Page Boutique", ShoppingBag], ["/admin/content/contact", "Page Contact", Phone], ["/admin/content/about", "Page A Propos", Sparkles], ["/admin/content/pages", "Pages du Site", Edit3], ["/admin/content/media", "Mediatheque", Image], ["/admin/content/reviews", "Avis Clients", Star], ["/admin/content/banners", "Bannieres & Promos", Bell], ["/admin/content/hero", "Section Hero", Wand2], ["/admin/content/social", "Reseaux Sociaux", Globe2]] },
  { group: "TRADUCTIONS", items: [["/admin/translations/fr", "Francais", Languages], ["/admin/translations/en", "English", Languages], ["/admin/translations/ar", "العربية", Languages]] },
  { group: "CONFIGURATION", items: [["/admin/settings/delivery", "Livraison & Wilayas", Truck], ["/admin/settings/payment", "Paiements", CircleDollarSign], ["/admin/settings/promo-codes", "Codes Promo", Sparkles], ["/admin/settings/email", "Email", Mail], ["/admin/settings/seo", "SEO & Metadata", Search], ["/admin/settings/general", "Parametres", Settings], ["/admin/settings/admins", "Gestion Admins", User], ["/admin/settings/security", "Securite", Lock]] },
];

function AdminLayout({ children, path, navigate }: { children: React.ReactNode; path: string; navigate: (to: string) => void }) {
  const [mobile, setMobile] = useState(false);
  const logout = () => { localStorage.removeItem(storageKeys.session); navigate("/admin/login"); };
  const current = adminLinks.flatMap((g) => g.items).find(([href]) => path === href)?.[1] || "Admin";
  const sidebar = <aside className="h-full w-72 overflow-y-auto border-r border-[var(--border)] bg-[#11100E] p-5 text-[#F8F1E8]"><div className="mb-6"><div className="font-logo text-xl font-bold tracking-[0.28em]">ALORIA</div><div className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--gold)]">Admin Panel</div></div><div className="mb-6 rounded-3xl bg-white/5 p-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--gold)] text-black"><User className="h-4 w-4" /></div><div><div className="font-semibold">Admin User</div><div className="text-xs text-white/55">Super Administrateur</div></div></div></div>{adminLinks.map((group) => <div key={group.group} className="mb-6"><div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/40">{group.group}</div><div className="grid gap-1">{group.items.map(([href, label, Icon]) => <button key={href} onClick={() => { navigate(href); setMobile(false); }} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${path === href ? "bg-[var(--gold)] text-black" : "text-white/75 hover:bg-white/10 hover:text-white"}`}><Icon className="h-4 w-4" />{label}</button>)}</div></div>)}</aside>;
  return <div className="min-h-screen bg-[#F7F1E8] text-[#1A1A1A]"><div className="fixed inset-y-0 left-0 hidden lg:block">{sidebar}</div><AnimatePresence>{mobile && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setMobile(false)}><motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="h-full" onClick={(e) => e.stopPropagation()}>{sidebar}</motion.div></motion.div>}</AnimatePresence><div className="lg:pl-72"><header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E8E0D5] bg-white/80 px-5 py-4 backdrop-blur-xl"><div className="flex items-center gap-3"><button className="lg:hidden" onClick={() => setMobile(true)}><Menu /></button><div><h1 className="font-heading text-2xl">{current}</h1><p className="text-xs text-[#6B6B6B]">Admin / {current}</p></div></div><div className="hidden flex-1 justify-center px-8 md:flex"><div className="flex w-full max-w-md items-center gap-2 rounded-full border border-[#E8E0D5] bg-white px-4 py-2"><Search className="h-4 w-4 text-[#6B6B6B]" /><input className="w-full bg-transparent text-sm outline-none" placeholder="Recherche globale" /></div></div><div className="flex items-center gap-2"><button className="rounded-full border border-[#E8E0D5] p-3"><Bell className="h-4 w-4" /></button><LanguageSwitcher /><Button variant="secondary" onClick={() => window.open("/", "_blank")} className="hidden md:inline-flex">View Website</Button><button onClick={logout} className="rounded-full bg-[#11100E] p-3 text-white"><LogOut className="h-4 w-4" /></button></div></header><main className="p-5 lg:p-8">{children}</main></div></div>;
}

function AdminDashboard({ navigate }: { navigate: (to: string) => void }) {
  const { orders, products, customers } = useStore();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const chart = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d, i) => ({ day: d, sales: Math.round(revenue / 7 + i * 1200) }));
  const stats: [string, string, React.ElementType][] = [["Revenus", money(revenue), CircleDollarSign], ["Commandes", String(orders.length), ShoppingBag], ["Clientes", String(customers.length), Users], ["Produits", String(products.length), Package]];
  return <AdminPanel><div className="grid gap-5 md:grid-cols-4">{stats.map(([label, value, Icon]) => <div key={label} className="rounded-3xl border border-[#E8E0D5] bg-white p-6 shadow-[0_4px_30px_rgba(0,0,0,0.04)]"><Icon className="mb-5 h-6 w-6 text-[#C5A55A]" /><div className="text-sm text-[#6B6B6B]">{label}</div><div className="mt-1 text-3xl font-semibold">{value}</div></div>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]"><div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><div className="mb-6 flex items-center justify-between"><h2 className="font-heading text-3xl">Sales chart</h2><select className="rounded-full border px-4 py-2 text-sm"><option>Semaine</option><option>Mois</option><option>Annee</option></select></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart}><defs><linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C5A55A" stopOpacity={0.4} /><stop offset="95%" stopColor="#C5A55A" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area type="monotone" dataKey="sales" stroke="#C5A55A" fill="url(#gold)" /></AreaChart></ResponsiveContainer></div></div><div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Quick actions</h2><div className="mt-6 grid gap-3"><Button onClick={() => navigate("/admin/products")}>Ajouter un produit</Button><Button variant="secondary" onClick={() => navigate("/admin/content/home")}>Modifier l'accueil</Button><Button variant="secondary" onClick={() => navigate("/admin/appearance/theme")}>Changer le theme</Button></div></div></div><div className="mt-6 rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Recent orders</h2><OrdersTable compact /></div></AdminPanel>;
}

function AdminPanel({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }

function OrdersTable({ compact = false }: { compact?: boolean }) {
  const { orders, updateOrders } = useStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const rows = orders.filter((o) => (status === "all" || o.status === status) && `${o.number} ${o.customerName} ${o.wilaya}`.toLowerCase().includes(query.toLowerCase()));
  return <div><div className={`mb-4 gap-3 ${compact ? "hidden" : "grid md:grid-cols-3"}`}><Input label="Search" value={query} onChange={setQuery} /><Select label="Status" value={status} onChange={setStatus} options={["all", "created", "confirmed", "shipped", "delivered"].map((s) => ({ value: s, label: s }))} /><Button variant="secondary" onClick={() => { const csv = orders.map((o) => `${o.number},${o.customerName},${o.total}`).join("\n"); navigator.clipboard.writeText(csv); toast.success("CSV copie"); }}><Download className="h-4 w-4" /> Export CSV</Button></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs uppercase tracking-[0.15em] text-[#6B6B6B]"><tr><th className="py-3">Numero</th><th>Cliente</th><th>Wilaya</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody className="divide-y divide-[#E8E0D5]">{rows.map((o) => <tr key={o.id}><td className="py-4 font-semibold">{o.number}</td><td>{o.customerName}<div className="text-xs text-[#6B6B6B]">{o.phone}</div></td><td>{o.wilaya}</td><td>{money(o.total)}</td><td><select value={o.status} onChange={(e) => updateOrders(orders.map((x) => x.id === o.id ? { ...x, status: e.target.value as OrderStatus, timeline: [...x.timeline, { label: e.target.value, date: new Date().toISOString().slice(0, 10) }] } : x))} className="rounded-full border border-[#E8E0D5] px-3 py-2"><option value="created">created</option><option value="confirmed">confirmed</option><option value="shipped">shipped</option><option value="delivered">delivered</option></select></td><td><Button variant="secondary" onClick={() => toast(`Timeline: ${o.timeline.map((t) => t.label).join(" > ")}`)} className="px-4 py-2"><Eye className="h-4 w-4" /> Details</Button></td></tr>)}</tbody></table></div></div>;
}

function OrdersAdmin() { return <AdminPanel><div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="mb-6 font-heading text-3xl">Gestion des commandes</h2><OrdersTable /></div></AdminPanel>; }

function ProductForm({ product, onSave, onCancel }: { product: Product; onSave: (p: Product) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState<Product>(product);
  const [tab, setTab] = useState("general");
  const setLoc = (field: keyof Pick<Product, "name" | "description" | "shortDescription">, lang: Lang, value: string) => setDraft({ ...draft, [field]: { ...(draft[field] as Localized), [lang]: value } });
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="font-heading text-3xl">{draft.id.startsWith("new") ? "Ajouter" : "Modifier"} Produit</h2><div className="flex gap-2">{["general", "price", "media", "variants", "badges", "seo"].map((x) => <button key={x} onClick={() => setTab(x)} className={`rounded-full px-4 py-2 text-sm ${tab === x ? "bg-[#11100E] text-white" : "border border-[#E8E0D5]"}`}>{x}</button>)}</div></div>{tab === "general" && <div className="grid gap-4 md:grid-cols-3">{(["fr", "en", "ar"] as Lang[]).map((lang) => <Input key={lang} label={`Nom ${lang}`} value={draft.name[lang]} onChange={(v) => setLoc("name", lang, v)} />)}{(["fr", "en", "ar"] as Lang[]).map((lang) => <Textarea key={lang} label={`Description ${lang}`} value={draft.description[lang]} onChange={(v) => setLoc("description", lang, v)} />)}<Input label="Categorie" value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} /><Input label="Sous-categorie" value={draft.subcategory} onChange={(v) => setDraft({ ...draft, subcategory: v })} /><Input label="SKU" value={draft.sku} onChange={(v) => setDraft({ ...draft, sku: v })} /></div>}{tab === "price" && <div className="grid gap-4 md:grid-cols-3"><Input label="Prix regulier" type="number" value={draft.price} onChange={(v) => setDraft({ ...draft, price: Number(v) })} /><Input label="Prix promo" type="number" value={draft.salePrice || 0} onChange={(v) => setDraft({ ...draft, salePrice: Number(v) })} /><Input label="Remise auto" value={draft.salePrice ? `${Math.round((1 - draft.salePrice / draft.price) * 100)}%` : "0%"} onChange={() => null} /><Input label="Stock" type="number" value={draft.stock} onChange={(v) => setDraft({ ...draft, stock: Number(v) })} /><Input label="Alerte stock" type="number" value={draft.lowStock} onChange={(v) => setDraft({ ...draft, lowStock: Number(v) })} /><Toggle label="Stock illimite" checked={draft.unlimitedStock} onChange={(v) => setDraft({ ...draft, unlimitedStock: v })} /></div>}{tab === "media" && <div className="grid gap-5 md:grid-cols-[260px_1fr]"><FileInput label="Drag & drop upload image" onLoad={(url) => setDraft({ ...draft, images: [url, ...draft.images] })} /><div className="grid gap-3 md:grid-cols-4">{draft.images.map((im, idx) => <div key={im} className="relative aspect-square overflow-hidden rounded-2xl"><img src={im} className="h-full w-full object-cover" /><button onClick={() => setDraft({ ...draft, images: draft.images.filter((_, i) => i !== idx) })} className="absolute right-2 top-2 rounded-full bg-white p-2"><Trash2 className="h-4 w-4" /></button></div>)}</div><Input label="Video URL" value={draft.videoUrl || ""} onChange={(v) => setDraft({ ...draft, videoUrl: v })} /></div>}{tab === "variants" && <div><div className="grid gap-4 md:grid-cols-3">{draft.colors.map((c, idx) => <div key={idx} className="rounded-2xl border p-4"><Input label="Nom FR" value={c.name.fr} onChange={(v) => setDraft({ ...draft, colors: draft.colors.map((x, i) => i === idx ? { ...x, name: { ...x.name, fr: v } } : x) })} /><Input label="Couleur" type="color" value={c.value} onChange={(v) => setDraft({ ...draft, colors: draft.colors.map((x, i) => i === idx ? { ...x, value: v } : x) })} /><Input label="Stock" type="number" value={c.stock} onChange={(v) => setDraft({ ...draft, colors: draft.colors.map((x, i) => i === idx ? { ...x, stock: Number(v) } : x) })} /></div>)}</div><Button className="mt-4" variant="secondary" onClick={() => setDraft({ ...draft, colors: [...draft.colors, { name: l("Nouvelle", "New", "جديد"), value: "#C5A55A", stock: 1 }] })}>Ajouter couleur</Button><Input label="Tailles separees par virgule" value={draft.sizes.join(", ")} onChange={(v) => setDraft({ ...draft, sizes: v.split(",").map((s) => s.trim()).filter(Boolean) })} className="mt-4" /></div>}{tab === "badges" && <div className="grid gap-4 md:grid-cols-3">{["NEW", "BESTSELLER", "LIMITED", "PREMIUM"].map((b) => <Toggle key={b} label={`Badge ${b}`} checked={draft.badges.includes(b)} onChange={(v) => setDraft({ ...draft, badges: v ? [...draft.badges, b] : draft.badges.filter((x) => x !== b) })} />)}<Toggle label="Produit vedette" checked={draft.featured} onChange={(v) => setDraft({ ...draft, featured: v })} /><Select label="Statut" value={draft.status} onChange={(v) => setDraft({ ...draft, status: v as ProductStatus })} options={["active", "draft"].map((s) => ({ value: s, label: s }))} /><Input label="Date publication" type="date" value={draft.publishedAt} onChange={(v) => setDraft({ ...draft, publishedAt: v })} /></div>}{tab === "seo" && <div className="grid gap-4 md:grid-cols-2"><Input label="URL slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v, seo: { ...draft.seo, slug: v } })} /><Input label="OG Image" value={draft.seo.ogImage} onChange={(v) => setDraft({ ...draft, seo: { ...draft.seo, ogImage: v } })} />{(["fr", "en", "ar"] as Lang[]).map((lang) => <Input key={lang} label={`Meta title ${lang}`} value={draft.seo.title[lang]} onChange={(v) => setDraft({ ...draft, seo: { ...draft.seo, title: { ...draft.seo.title, [lang]: v } } })} />)}</div>}<div className="mt-8 flex gap-3"><Button onClick={() => onSave(draft)}><Check className="h-4 w-4" /> Enregistrer</Button><Button variant="secondary" onClick={onCancel}>Annuler</Button></div></div>;
}

function ProductsAdmin() {
  const { products, updateProducts, language } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const empty: Product = { ...sampleProducts[0], id: uid("new"), name: l("Nouveau produit", "New product", "منتج جديد"), slug: "nouveau-produit", sku: "ALR-NEW", images: [img("/images/products/sahara-tote.jpg")], badges: [], featured: false };
  if (editing) return <ProductForm product={editing} onCancel={() => setEditing(null)} onSave={(p) => { const exists = products.some((x) => x.id === p.id); updateProducts(exists ? products.map((x) => x.id === p.id ? p : x) : [p, ...products]); setEditing(null); toast.success("Produit sauvegarde"); }} />;
  return <AdminPanel><div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="font-heading text-3xl">Produits</h2><Button onClick={() => setEditing(empty)}><Plus className="h-4 w-4" /> Ajouter un Produit</Button></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{products.map((p, idx) => <div key={p.id} className="rounded-3xl border border-[#E8E0D5] p-4"><img src={p.images[0]} className="h-56 w-full rounded-2xl object-cover" /><div className="mt-4 flex items-start justify-between"><div><h3 className="font-heading text-2xl">{localized(p.name, language)}</h3><p className="text-sm text-[#6B6B6B]">{p.sku} - Stock {p.stock}</p><p className="mt-2 font-semibold">{money(p.salePrice || p.price)}</p></div><span className="rounded-full bg-[#F5EDE3] px-3 py-1 text-xs">{p.status}</span></div><div className="mt-4 flex flex-wrap gap-2"><Button variant="secondary" onClick={() => setEditing(p)} className="px-4 py-2"><Edit3 className="h-4 w-4" /> Edit</Button><Button variant="secondary" onClick={() => updateProducts(products.map((x, i) => i === idx - 1 ? p : i === idx ? products[idx - 1] || x : x))} className="px-4 py-2">Up</Button><Button variant="danger" onClick={() => updateProducts(products.filter((x) => x.id !== p.id))} className="px-4 py-2"><Trash2 className="h-4 w-4" /></Button></div></div>)}</div></div></AdminPanel>;
}

function CustomersAdmin() {
  const { customers, updateCustomers, orders } = useStore();
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="mb-6 font-heading text-3xl">Clientes</h2><div className="grid gap-4">{customers.map((c) => <div key={c.id} className="grid gap-4 rounded-2xl border border-[#E8E0D5] p-4 md:grid-cols-[1fr_1fr_1fr_auto]"><div><strong>{c.name}</strong><p className="text-sm text-[#6B6B6B]">{c.phone}</p></div><div>{c.email}<p className="text-sm text-[#6B6B6B]">{c.wilaya}</p></div><div>{money(c.totalSpent)}<p className="text-sm text-[#6B6B6B]">{orders.filter((o) => o.customerId === c.id).length || c.totalOrders} commandes</p></div><Button variant={c.blocked ? "secondary" : "danger"} onClick={() => updateCustomers(customers.map((x) => x.id === c.id ? { ...x, blocked: !x.blocked } : x))}>{c.blocked ? "Unblock" : "Block"}</Button></div>)}</div></div>;
}

function CategoriesAdmin() {
  const { categories, updateCategories } = useStore();
  const add = () => updateCategories([...categories, { id: uid("cat"), name: l("Nouvelle categorie", "New category", "تصنيف جديد"), description: l("", "", ""), image: img("/images/products/sahara-tote.jpg"), order: categories.length + 1 }]);
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><div className="mb-6 flex justify-between"><h2 className="font-heading text-3xl">Categories</h2><Button onClick={add}><Plus className="h-4 w-4" /> Ajouter</Button></div><div className="grid gap-4">{categories.sort((a, b) => a.order - b.order).map((c, idx) => <div key={c.id} className="grid gap-4 rounded-2xl border border-[#E8E0D5] p-4 md:grid-cols-[80px_1fr_auto]"><img src={c.image} className="h-20 w-20 rounded-xl object-cover" /><div className="grid gap-2 md:grid-cols-3"><Input label="FR" value={c.name.fr} onChange={(v) => updateCategories(categories.map((x) => x.id === c.id ? { ...x, name: { ...x.name, fr: v } } : x))} /><Input label="EN" value={c.name.en} onChange={(v) => updateCategories(categories.map((x) => x.id === c.id ? { ...x, name: { ...x.name, en: v } } : x))} /><Input label="AR" value={c.name.ar} onChange={(v) => updateCategories(categories.map((x) => x.id === c.id ? { ...x, name: { ...x.name, ar: v } } : x))} /></div><div className="flex gap-2"><Button variant="secondary" onClick={() => updateCategories(categories.map((x, i) => i === idx - 1 ? c : i === idx ? categories[idx - 1] || x : x))}>Up</Button><Button variant="danger" onClick={() => updateCategories(categories.filter((x) => x.id !== c.id))}><Trash2 className="h-4 w-4" /></Button></div></div>)}</div><p className="mt-4 text-sm text-[#6B6B6B]">Tree view active: parent categories can be assigned in data and order can be changed with Up.</p></div>;
}

function ThemeAdmin() {
  const { theme, updateTheme } = useStore();
  const entries = Object.entries(theme) as [keyof ThemeSettings, string][];
  return <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Theme & Couleurs</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{entries.map(([key, value]) => <label key={key} className="flex items-center justify-between rounded-2xl border border-[#E8E0D5] p-4"><span className="capitalize">{key.replace(/[A-Z]/g, (m) => ` ${m.toLowerCase()}`)}</span><input type="color" value={value} onChange={(e) => updateTheme({ [key]: e.target.value } as Partial<ThemeSettings>)} /></label>)}</div><div className="mt-6 flex flex-wrap gap-2">{Object.entries(themePresets).map(([name, preset]) => <Button key={name} variant="secondary" onClick={() => updateTheme(preset)}>{name}</Button>)}<Button variant="secondary" onClick={() => updateTheme(themePresets["Classic Luxury"])}>Reset to Default</Button></div></div><ThemePreview /></div>;
}

function ThemePreview() { return <div className="rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-[var(--text)]"><h3 className="font-heading text-3xl">Live Preview</h3><p className="mt-3 text-[var(--muted)]">Les changements s'appliquent instantanement au site.</p><div className="mt-8 h-40 bg-[var(--secondary-bg)] p-5"><div className="font-logo tracking-[var(--logo-tracking)]">ALORIA</div><button className="mt-5 rounded-full bg-[var(--gold)] px-5 py-2 text-white">CTA</button></div></div>; }

function TypographyAdmin() {
  const { typography, updateTypography } = useStore();
  const fonts = ["Playfair Display", "Inter", "Outfit", "Cairo", "Tajawal", "Cormorant Garamond", "Montserrat", "Lora"];
  return <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Typographie & Polices</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{(["logoFont", "headingFont", "bodyFont", "arabicFont", "decorativeFont"] as (keyof TypographySettings)[]).map((key) => <Select key={key} label={String(key)} value={String(typography[key])} onChange={(v) => updateTypography({ [key]: v } as Partial<TypographySettings>)} options={fonts.map((f) => ({ value: f, label: f }))} />)}<Input label="Base size" type="number" value={typography.baseSize} onChange={(v) => updateTypography({ baseSize: Number(v) })} /><Input label="Heading scale" type="number" value={typography.headingScale} onChange={(v) => updateTypography({ headingScale: Number(v) })} /><Input label="Letter spacing" type="number" value={typography.letterSpacing} onChange={(v) => updateTypography({ letterSpacing: Number(v) })} /><Input label="Line height" type="number" value={typography.lineHeight} onChange={(v) => updateTypography({ lineHeight: Number(v) })} /><FileInput label="Upload custom font (.woff/.ttf demo)" onLoad={() => toast.success("Font file saved in browser session")}/></div></div><div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h3 className="font-heading text-3xl">Preview</h3><p className="mt-4 font-logo text-3xl tracking-[var(--logo-tracking)]">ALORIA</p><p className="mt-4 font-heading text-4xl italic">Maison de luxe</p><p className="mt-4 text-[#6B6B6B]">Body copy with live Google Fonts loading.</p></div></div>;
}

function LogoAdmin() {
  const { content, updateContent, language } = useStore();
  const c = content;
  const setId = (patch: Partial<SiteContent["identity"]>) => updateContent({ ...c, identity: { ...c.identity, ...patch } });
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Logo & Identite</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><FileInput label="Upload logo principal" onLoad={(url) => setId({ logoMain: url })} /><FileInput label="Upload favicon" onLoad={(url) => setId({ favicon: url })} />{(["fr", "en", "ar"] as Lang[]).map((lang) => <Input key={lang} label={`Site name ${lang}`} value={c.identity.siteName[lang]} onChange={(v) => setId({ siteName: { ...c.identity.siteName, [lang]: v } })} />)}{(["fr", "en", "ar"] as Lang[]).map((lang) => <Input key={lang} label={`Tagline ${lang}`} value={c.identity.tagline[lang]} onChange={(v) => setId({ tagline: { ...c.identity.tagline, [lang]: v } })} />)}<Input label="Logo size" type="number" value={c.identity.logoSize} onChange={(v) => setId({ logoSize: Number(v) })} /></div><div className="mt-8 rounded-3xl bg-[#11100E] p-8 text-white"><div className="font-logo font-bold tracking-[0.35em]" style={{ fontSize: c.identity.logoSize / 4 }}>{localized(c.identity.siteName, language)}</div><p className="text-[#C5A55A]">{localized(c.identity.tagline, language)}</p></div></div>;
}

function AnimationsAdmin() {
  const { animations, updateAnimations } = useStore();
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Animations</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{(Object.keys(animations).filter((k) => typeof animations[k as keyof AnimationSettings] === "boolean") as (keyof AnimationSettings)[]).map((key) => <Toggle key={key} label={String(key)} checked={Boolean(animations[key])} onChange={(v) => updateAnimations({ [key]: v } as Partial<AnimationSettings>)} />)}<Select label="Speed" value={animations.speed} onChange={(v) => updateAnimations({ speed: v as AnimationSettings["speed"] })} options={["slow", "normal", "fast"].map((x) => ({ value: x, label: x }))} /><Select label="Style" value={animations.style} onChange={(v) => updateAnimations({ style: v as AnimationSettings["style"] })} options={["subtle", "standard", "dramatic"].map((x) => ({ value: x, label: x }))} /></div></div>;
}

function ContentHomeAdmin() {
  const { content, updateContent, products, language } = useStore();
  const h = content.home;
  const setHome = (patch: Partial<SiteContent["home"]>) => updateContent({ ...content, home: { ...h, ...patch } });
  const setLoc = (key: keyof Pick<SiteContent["home"], "heroTitle" | "heroHighlight" | "heroSubtitle" | "cta1" | "cta2" | "featuredTitle" | "featuredSubtitle" | "whyTitle" | "newsletterTitle" | "newsletterSubtitle">, lang: Lang, v: string) => setHome({ [key]: { ...(h[key] as Localized), [lang]: v } } as Partial<SiteContent["home"]>);
  return <div className="grid gap-6 lg:grid-cols-[1fr_380px]"><div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Home Page Builder</h2><div className="mt-6 grid gap-5">{(["fr", "en", "ar"] as Lang[]).map((lang) => <div key={lang} className="grid gap-3 rounded-2xl border border-[#E8E0D5] p-4 md:grid-cols-2"><Input label={`Hero title ${lang}`} value={h.heroTitle[lang]} onChange={(v) => setLoc("heroTitle", lang, v)} /><Input label={`Highlight ${lang}`} value={h.heroHighlight[lang]} onChange={(v) => setLoc("heroHighlight", lang, v)} /><Textarea label={`Subtitle ${lang}`} value={h.heroSubtitle[lang]} onChange={(v) => setLoc("heroSubtitle", lang, v)} /></div>)}<div className="grid gap-4 md:grid-cols-2"><Input label="CTA 1 link" value={h.cta1Link} onChange={(v) => setHome({ cta1Link: v })} /><Input label="CTA 2 link" value={h.cta2Link} onChange={(v) => setHome({ cta2Link: v })} /><Input label="Featured title FR" value={h.featuredTitle.fr} onChange={(v) => setLoc("featuredTitle", "fr", v)} /><Input label="Products count" type="number" value={h.featuredCount} onChange={(v) => setHome({ featuredCount: Number(v) })} /></div><FileInput label="Upload hero image" onLoad={(url) => setHome({ heroImages: [url, ...h.heroImages] })} /><Toggle label="Marquee enabled" checked={h.marqueeEnabled} onChange={(v) => setHome({ marqueeEnabled: v })} /><Input label="Marquee items FR separated by |" value={h.marquee.map((m) => m.fr).join(" | ")} onChange={(v) => setHome({ marquee: v.split("|").map((x) => l(x.trim(), x.trim(), x.trim())) })} /><div><p className="mb-2 text-sm font-semibold">Select featured products</p><div className="grid gap-2 md:grid-cols-3">{products.map((p) => <Toggle key={p.id} label={localized(p.name, language)} checked={h.featuredProducts.includes(p.id)} onChange={(v) => setHome({ featuredProducts: v ? [...h.featuredProducts, p.id] : h.featuredProducts.filter((id) => id !== p.id) })} />)}</div></div></div></div><ThemePreview /></div>;
}

function SimpleContentAdmin({ section }: { section: "boutique" | "contact" | "about" }) {
  const { content, updateContent } = useStore();
  const data = content[section] as any;
  const set = (patch: any) => updateContent({ ...content, [section]: { ...data, ...patch } } as SiteContent);
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Page {section}</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{data.title && (["fr", "en", "ar"] as Lang[]).map((lang) => <Input key={lang} label={`Title ${lang}`} value={data.title[lang]} onChange={(v) => set({ title: { ...data.title, [lang]: v } })} />)}{data.subtitle && (["fr", "en", "ar"] as Lang[]).map((lang) => <Textarea key={lang} label={`Subtitle ${lang}`} value={data.subtitle[lang]} onChange={(v) => set({ subtitle: { ...data.subtitle, [lang]: v } })} />)}{section === "contact" && <><Input label="Phone" value={data.phone} onChange={(v) => set({ phone: v })} /><Input label="Email" value={data.email} onChange={(v) => set({ email: v })} /><Input label="WhatsApp" value={data.whatsapp} onChange={(v) => set({ whatsapp: v })} /></>}{section === "about" && <Textarea label="Story FR" value={data.story.fr} onChange={(v) => set({ story: { ...data.story, fr: v } })} rows={8} />}{section === "boutique" && <><Input label="Products per page" type="number" value={data.productsPerPage} onChange={(v) => set({ productsPerPage: Number(v) })} /><Toggle label="Enable filters" checked={data.filtersEnabled} onChange={(v) => set({ filtersEnabled: v })} /></>}</div></div>;
}

function PagesAdmin() {
  const { content, updateContent, language } = useStore();
  const pages = content.customPages;
  const setPages = (customPages: SiteContent["customPages"]) => updateContent({ ...content, customPages });
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><div className="mb-6 flex justify-between"><h2 className="font-heading text-3xl">Pages du Site</h2><Button onClick={() => setPages([...pages, { id: uid("page"), title: l("Nouvelle page", "New page", "صفحة جديدة"), slug: "nouvelle-page", body: l("", "", ""), status: "draft", seoTitle: l("", "", ""), seoDescription: l("", "", "") }])}>Create page</Button></div><div className="grid gap-4">{pages.map((p) => <div key={p.id} className="rounded-2xl border border-[#E8E0D5] p-4"><div className="grid gap-3 md:grid-cols-3"><Input label="Title FR" value={p.title.fr} onChange={(v) => setPages(pages.map((x) => x.id === p.id ? { ...x, title: { ...x.title, fr: v } } : x))} /><Input label="Slug" value={p.slug} onChange={(v) => setPages(pages.map((x) => x.id === p.id ? { ...x, slug: v } : x))} /><Select label="Status" value={p.status} onChange={(v) => setPages(pages.map((x) => x.id === p.id ? { ...x, status: v as "published" | "draft" } : x))} options={["published", "draft"].map((x) => ({ value: x, label: x }))} /></div><Textarea label={`Body ${language}`} value={p.body[language]} onChange={(v) => setPages(pages.map((x) => x.id === p.id ? { ...x, body: { ...x.body, [language]: v } } : x))} rows={5} /></div>)}</div></div>;
}

function MediaAdmin() {
  const { media, updateMedia } = useStore();
  const [query, setQuery] = useState("");
  const items = media.filter((m) => `${m.name} ${m.folder}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Mediatheque</h2><div className="mt-6 grid gap-4 md:grid-cols-[260px_1fr]"><FileInput label="Upload images" onLoad={(url) => updateMedia([{ id: uid("media"), url, name: "Uploaded image", folder: "uploads", alt: "", usedIn: "Manual" }, ...media])} /><Input label="Search images" value={query} onChange={setQuery} /></div><div className="mt-6 grid gap-4 md:grid-cols-4">{items.map((m) => <div key={m.id} className="rounded-2xl border border-[#E8E0D5] p-3"><img src={m.url} className="aspect-square w-full rounded-xl object-cover" /><Input label="Name" value={m.name} onChange={(v) => updateMedia(media.map((x) => x.id === m.id ? { ...x, name: v } : x))} /><p className="text-xs text-[#6B6B6B]">Used in: {m.usedIn}</p><div className="mt-2 flex gap-2"><Button variant="secondary" onClick={() => { navigator.clipboard.writeText(m.url); toast.success("URL copiee"); }} className="px-3 py-2">Copy URL</Button><Button variant="danger" onClick={() => updateMedia(media.filter((x) => x.id !== m.id))} className="px-3 py-2"><Trash2 className="h-4 w-4" /></Button></div></div>)}</div></div>;
}

function ReviewsAdmin() {
  const { reviews, updateReviews } = useStore();
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Avis Clients</h2><div className="mt-6 grid gap-4">{reviews.map((r) => <div key={r.id} className="rounded-2xl border border-[#E8E0D5] p-4"><div className="flex justify-between gap-4"><div><strong>{r.name}</strong><p className="text-sm text-[#6B6B6B]">{r.wilaya} - {r.rating} etoiles</p></div><div className="flex gap-2"><Toggle label="Approved" checked={r.approved} onChange={(v) => updateReviews(reviews.map((x) => x.id === r.id ? { ...x, approved: v } : x))} /><Toggle label="Home" checked={r.displayHome} onChange={(v) => updateReviews(reviews.map((x) => x.id === r.id ? { ...x, displayHome: v } : x))} /></div></div><Textarea label="Review FR" value={r.text.fr} onChange={(v) => updateReviews(reviews.map((x) => x.id === r.id ? { ...x, text: { ...x.text, fr: v } } : x))} /></div>)}</div></div>;
}

function BannersAdmin() {
  const { content, updateContent } = useStore();
  const a = content.announcement;
  const set = (patch: Partial<SiteContent["announcement"]>) => updateContent({ ...content, announcement: { ...a, ...patch } });
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Bannieres & Promos</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><Toggle label="Announcement bar" checked={a.enabled} onChange={(v) => set({ enabled: v })} /><Input label="Text FR" value={a.text.fr} onChange={(v) => set({ text: { ...a.text, fr: v } })} /><Input label="Link" value={a.link} onChange={(v) => set({ link: v })} /><Input label="Background" type="color" value={a.bg} onChange={(v) => set({ bg: v })} /><Input label="Text color" type="color" value={a.color} onChange={(v) => set({ color: v })} /><Input label="Start date" type="date" value={a.start} onChange={(v) => set({ start: v })} /><Input label="End date" type="date" value={a.end} onChange={(v) => set({ end: v })} /></div></div>;
}

function SocialAdmin() {
  const { content, updateContent } = useStore();
  const setSocial = (social: SiteContent["social"]) => updateContent({ ...content, social });
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><div className="mb-6 flex justify-between"><h2 className="font-heading text-3xl">Reseaux Sociaux</h2><Button onClick={() => setSocial([...content.social, { platform: "Pinterest", url: "https://", enabled: true, order: content.social.length + 1 }])}>Add</Button></div><div className="grid gap-4">{content.social.map((s, idx) => <div key={idx} className="grid gap-3 rounded-2xl border border-[#E8E0D5] p-4 md:grid-cols-4"><Input label="Platform" value={s.platform} onChange={(v) => setSocial(content.social.map((x, i) => i === idx ? { ...x, platform: v } : x))} /><Input label="URL" value={s.url} onChange={(v) => setSocial(content.social.map((x, i) => i === idx ? { ...x, url: v } : x))} /><Input label="Order" type="number" value={s.order} onChange={(v) => setSocial(content.social.map((x, i) => i === idx ? { ...x, order: Number(v) } : x))} /><Toggle label="Enabled" checked={s.enabled} onChange={(v) => setSocial(content.social.map((x, i) => i === idx ? { ...x, enabled: v } : x))} /></div>)}</div></div>;
}

function TranslationsAdmin({ lang }: { lang: Lang }) {
  const { translations, updateTranslations } = useStore();
  const [query, setQuery] = useState("");
  const keys = Object.keys(defaultTranslations.fr).filter((k) => k.includes(query));
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Traductions {lang.toUpperCase()}</h2><div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto]"><Input label="Search" value={query} onChange={setQuery} /><Button variant="secondary" onClick={() => { navigator.clipboard.writeText(JSON.stringify(translations[lang], null, 2)); toast.success("JSON exporte"); }}>Export JSON</Button><Button variant="secondary" onClick={() => toast("Import JSON via backup/restore")}>Import</Button></div><div className="mt-6 divide-y divide-[#E8E0D5]">{keys.map((key) => <div key={key} className="grid gap-4 py-4 md:grid-cols-[220px_1fr]"><div className="font-mono text-sm">{key}</div><Input value={translations[lang]?.[key] || ""} onChange={(v) => updateTranslations({ ...translations, [lang]: { ...translations[lang], [key]: v } })} /></div>)}</div></div>;
}

function DeliveryAdmin() {
  const { wilayas, updateWilayas, settings, updateSettings } = useStore();
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Livraison & Wilayas</h2><div className="mt-6 grid gap-4 md:grid-cols-3"><Input label="Free shipping threshold" type="number" value={settings.freeShipping} onChange={(v) => updateSettings({ ...settings, freeShipping: Number(v) })} /><Button variant="secondary" onClick={() => updateWilayas(wilayas.map((w) => ({ ...w, homePrice: w.homePrice + 100, officePrice: w.officePrice + 100 })))}>Bulk +100 DZD</Button></div><div className="mt-6 max-h-[620px] overflow-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="text-xs uppercase text-[#6B6B6B]"><th>Code</th><th>Wilaya</th><th>Enabled</th><th>Home</th><th>Office</th><th>ETA</th><th>Zone</th></tr></thead><tbody className="divide-y divide-[#E8E0D5]">{wilayas.map((w) => <tr key={w.code}><td className="py-3">{w.code}</td><td>{w.name}</td><td><input type="checkbox" checked={w.enabled} onChange={(e) => updateWilayas(wilayas.map((x) => x.code === w.code ? { ...x, enabled: e.target.checked } : x))} /></td><td><input className="w-24 rounded border px-2 py-1" type="number" value={w.homePrice} onChange={(e) => updateWilayas(wilayas.map((x) => x.code === w.code ? { ...x, homePrice: Number(e.target.value) } : x))} /></td><td><input className="w-24 rounded border px-2 py-1" type="number" value={w.officePrice} onChange={(e) => updateWilayas(wilayas.map((x) => x.code === w.code ? { ...x, officePrice: Number(e.target.value) } : x))} /></td><td><input className="w-28 rounded border px-2 py-1" value={w.eta} onChange={(e) => updateWilayas(wilayas.map((x) => x.code === w.code ? { ...x, eta: e.target.value } : x))} /></td><td>{w.zone}</td></tr>)}</tbody></table></div></div>;
}

function PaymentAdmin() {
  const { settings, updateSettings, language } = useStore();
  const p = settings.payments;
  const set = (patch: Partial<Settings["payments"]>) => updateSettings({ ...settings, payments: { ...p, ...patch } });
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Methodes de Paiement</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><Toggle label="Paiement a la livraison" checked={p.cod} onChange={(v) => set({ cod: v })} /><Toggle label="Virement CCP" checked={p.ccp} onChange={(v) => set({ ccp: v })} /><Toggle label="CIB / EDAHABIA" checked={p.cib} onChange={(v) => set({ cib: v })} /><Input label="CCP details" value={p.ccpDetails} onChange={(v) => set({ ccpDetails: v })} /><Textarea label={`Instructions ${language}`} value={p.instructions[language]} onChange={(v) => set({ instructions: { ...p.instructions, [language]: v } })} /></div></div>;
}

function PromoAdmin() {
  const { promoCodes, updatePromoCodes } = useStore();
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><div className="mb-6 flex justify-between"><h2 className="font-heading text-3xl">Codes Promo</h2><Button onClick={() => updatePromoCodes([...promoCodes, { id: uid("promo"), code: "NEWCODE", type: "percent", value: 10, min: 0, max: 0, limit: 100, used: 0, active: true, start: "", end: "" }])}>Create</Button></div><div className="grid gap-4">{promoCodes.map((p) => <div key={p.id} className="grid gap-3 rounded-2xl border border-[#E8E0D5] p-4 md:grid-cols-6"><Input label="Code" value={p.code} onChange={(v) => updatePromoCodes(promoCodes.map((x) => x.id === p.id ? { ...x, code: v } : x))} /><Select label="Type" value={p.type} onChange={(v) => updatePromoCodes(promoCodes.map((x) => x.id === p.id ? { ...x, type: v as "percent" | "fixed" } : x))} options={["percent", "fixed"].map((x) => ({ value: x, label: x }))} /><Input label="Value" type="number" value={p.value} onChange={(v) => updatePromoCodes(promoCodes.map((x) => x.id === p.id ? { ...x, value: Number(v) } : x))} /><Input label="Min" type="number" value={p.min} onChange={(v) => updatePromoCodes(promoCodes.map((x) => x.id === p.id ? { ...x, min: Number(v) } : x))} /><Toggle label="Active" checked={p.active} onChange={(v) => updatePromoCodes(promoCodes.map((x) => x.id === p.id ? { ...x, active: v } : x))} /><Button variant="danger" onClick={() => updatePromoCodes(promoCodes.filter((x) => x.id !== p.id))}><Trash2 className="h-4 w-4" /></Button></div>)}</div></div>;
}

function SettingsAdmin({ section }: { section: "email" | "seo" | "general" | "admins" | "security" }) {
  const { settings, updateSettings, backup, restore } = useStore();
  const [restoreText, setRestoreText] = useState("");
  if (section === "email") return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Email & Notifications</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><Input label="SMTP host" value={settings.email.smtpHost} onChange={(v) => updateSettings({ ...settings, email: { ...settings.email, smtpHost: v } })} /><Input label="SMTP user" value={settings.email.smtpUser} onChange={(v) => updateSettings({ ...settings, email: { ...settings.email, smtpUser: v } })} /><Textarea label="Order confirmation FR" value={settings.email.templates.order.fr} onChange={(v) => updateSettings({ ...settings, email: { ...settings.email, templates: { ...settings.email.templates, order: { ...settings.email.templates.order, fr: v } } } })} /></div></div>;
  if (section === "seo") return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">SEO & Metadata</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><Input label="Meta title FR" value={settings.seo.title.fr} onChange={(v) => updateSettings({ ...settings, seo: { ...settings.seo, title: { ...settings.seo.title, fr: v } } })} /><Textarea label="Meta description FR" value={settings.seo.description.fr} onChange={(v) => updateSettings({ ...settings, seo: { ...settings.seo, description: { ...settings.seo.description, fr: v } } })} /><Input label="Keywords" value={settings.seo.keywords} onChange={(v) => updateSettings({ ...settings, seo: { ...settings.seo, keywords: v } })} /><Input label="Google Analytics ID" value={settings.seo.ga} onChange={(v) => updateSettings({ ...settings, seo: { ...settings.seo, ga: v } })} /><Textarea label="Robots.txt" value={settings.seo.robots} onChange={(v) => updateSettings({ ...settings, seo: { ...settings.seo, robots: v } })} /></div></div>;
  if (section === "admins") return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><div className="mb-6 flex justify-between"><h2 className="font-heading text-3xl">Gestion Admins</h2><Button onClick={() => updateSettings({ ...settings, admins: [...settings.admins, { id: uid("admin"), name: "New Admin", username: "new", role: "Editor", lastLogin: "", active: true }] })}>Add admin</Button></div>{settings.admins.map((a) => <div key={a.id} className="mb-3 grid gap-3 rounded-2xl border p-4 md:grid-cols-5"><Input label="Name" value={a.name} onChange={(v) => updateSettings({ ...settings, admins: settings.admins.map((x) => x.id === a.id ? { ...x, name: v } : x) })} /><Input label="Username" value={a.username} onChange={(v) => updateSettings({ ...settings, admins: settings.admins.map((x) => x.id === a.id ? { ...x, username: v } : x) })} /><Select label="Role" value={a.role} onChange={(v) => updateSettings({ ...settings, admins: settings.admins.map((x) => x.id === a.id ? { ...x, role: v } : x) })} options={["Super Admin", "Manager", "Editor", "Viewer"].map((x) => ({ value: x, label: x }))} /><Toggle label="Active" checked={a.active} onChange={(v) => updateSettings({ ...settings, admins: settings.admins.map((x) => x.id === a.id ? { ...x, active: v } : x) })} /><span className="text-sm text-[#6B6B6B]">Last login {a.lastLogin || "never"}</span></div>)}</div>;
  if (section === "security") return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Securite</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><Input label="Session timeout minutes" type="number" value={settings.security.timeoutMinutes} onChange={(v) => updateSettings({ ...settings, security: { ...settings.security, timeoutMinutes: Number(v) } })} /><Input label="Login attempts limit" type="number" value={settings.security.attemptsLimit} onChange={(v) => updateSettings({ ...settings, security: { ...settings.security, attemptsLimit: Number(v) } })} /><Toggle label="Two-factor authentication" checked={settings.security.twoFactor} onChange={(v) => updateSettings({ ...settings, security: { ...settings.security, twoFactor: v } })} /><Textarea label="IP whitelist" value={settings.security.ipWhitelist} onChange={(v) => updateSettings({ ...settings, security: { ...settings.security, ipWhitelist: v } })} /><Textarea label="Activity log" value={settings.security.activityLog.join("\n")} onChange={(v) => updateSettings({ ...settings, security: { ...settings.security, activityLog: v.split("\n") } })} /></div></div>;
  return <div className="rounded-3xl border border-[#E8E0D5] bg-white p-6"><h2 className="font-heading text-3xl">Parametres Generaux</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><Select label="Default language" value={settings.defaultLanguage} onChange={(v) => updateSettings({ ...settings, defaultLanguage: v as Lang })} options={["fr", "en", "ar"].map((x) => ({ value: x, label: x }))} /><Input label="Currency" value={settings.currency} onChange={(v) => updateSettings({ ...settings, currency: v })} /><Input label="Order number format" value={settings.orderFormat} onChange={(v) => updateSettings({ ...settings, orderFormat: v })} /><Input label="Tax rate" type="number" value={settings.taxRate} onChange={(v) => updateSettings({ ...settings, taxRate: Number(v) })} /><Toggle label="Maintenance mode" checked={settings.maintenance} onChange={(v) => updateSettings({ ...settings, maintenance: v })} /><Toggle label="Cookie consent" checked={settings.cookieConsent} onChange={(v) => updateSettings({ ...settings, cookieConsent: v })} /></div><div className="mt-8 grid gap-4 md:grid-cols-2"><Button variant="secondary" onClick={() => { navigator.clipboard.writeText(backup()); toast.success("Backup JSON copie"); }}>Backup all data as JSON</Button><div><Textarea label="Restore JSON" value={restoreText} onChange={setRestoreText} /><Button onClick={() => { try { restore(restoreText); toast.success("Data restored"); } catch { toast.error("JSON invalide"); } }} className="mt-3">Restore</Button></div></div></div>;
}

function AdminRouter({ path, navigate }: { path: string; navigate: (to: string) => void }) {
  if (!isLoggedIn() && path !== "/admin/login") return <AdminLogin navigate={navigate} />;
  if (path === "/admin/login") return <AdminLogin navigate={navigate} />;
  let page: React.ReactNode = <AdminDashboard navigate={navigate} />;
  if (path === "/admin/orders") page = <OrdersAdmin />;
  if (path === "/admin/products") page = <ProductsAdmin />;
  if (path === "/admin/customers") page = <CustomersAdmin />;
  if (path === "/admin/categories") page = <CategoriesAdmin />;
  if (path === "/admin/appearance/theme") page = <ThemeAdmin />;
  if (path === "/admin/appearance/typography") page = <TypographyAdmin />;
  if (path === "/admin/appearance/logo") page = <LogoAdmin />;
  if (path === "/admin/appearance/animations") page = <AnimationsAdmin />;
  if (path === "/admin/content/home") page = <ContentHomeAdmin />;
  if (path === "/admin/content/boutique") page = <SimpleContentAdmin section="boutique" />;
  if (path === "/admin/content/contact") page = <SimpleContentAdmin section="contact" />;
  if (path === "/admin/content/about") page = <SimpleContentAdmin section="about" />;
  if (path === "/admin/content/pages") page = <PagesAdmin />;
  if (path === "/admin/content/media") page = <MediaAdmin />;
  if (path === "/admin/content/reviews") page = <ReviewsAdmin />;
  if (path === "/admin/content/banners") page = <BannersAdmin />;
  if (path === "/admin/content/hero") page = <ContentHomeAdmin />;
  if (path === "/admin/content/social") page = <SocialAdmin />;
  if (path === "/admin/translations/fr") page = <TranslationsAdmin lang="fr" />;
  if (path === "/admin/translations/en") page = <TranslationsAdmin lang="en" />;
  if (path === "/admin/translations/ar") page = <TranslationsAdmin lang="ar" />;
  if (path === "/admin/settings/delivery") page = <DeliveryAdmin />;
  if (path === "/admin/settings/payment") page = <PaymentAdmin />;
  if (path === "/admin/settings/promo-codes") page = <PromoAdmin />;
  if (path === "/admin/settings/email") page = <SettingsAdmin section="email" />;
  if (path === "/admin/settings/seo") page = <SettingsAdmin section="seo" />;
  if (path === "/admin/settings/general") page = <SettingsAdmin section="general" />;
  if (path === "/admin/settings/admins") page = <SettingsAdmin section="admins" />;
  if (path === "/admin/settings/security") page = <SettingsAdmin section="security" />;
  return <AdminLayout path={path} navigate={navigate}>{page}</AdminLayout>;
}

function PublicRouter({ path, navigate }: { path: string; navigate: (to: string) => void }) {
  let page: React.ReactNode = <HomePage navigate={navigate} />;
  if (path === "/boutique") page = <BoutiquePage navigate={navigate} />;
  else if (path.startsWith("/boutique/")) page = <SingleProductPage slug={path.split("/").pop() || ""} navigate={navigate} />;
  else if (path === "/checkout") page = <CheckoutPage navigate={navigate} />;
  else if (path === "/checkout/success") page = <Page><section className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-heading text-6xl">Commande confirmee</h1><p className="mt-5 text-[var(--muted)]">Merci. Votre commande est enregistree dans le dashboard admin.</p><Button onClick={() => navigate("/")} className="mt-8">Retour accueil</Button></section></Page>;
  else if (path === "/contact") page = <ContactPage />;
  else if (path === "/about") page = <AboutPage />;
  else if (path === "/wishlist") page = <WishlistPage navigate={navigate} />;
  else if (path.startsWith("/pages/")) page = <CustomPage slug={path.split("/").pop() || ""} />;
  return <PublicLayout navigate={navigate} path={path}>{page}</PublicLayout>;
}

export default function App() {
  const { path, navigate } = useRoute();
  return <><AppEffects /><Toaster position="top-right" toastOptions={{ style: { borderRadius: "18px", background: "var(--card-bg)", color: "var(--text)", border: "1px solid var(--border)" } }} /><AnimatePresence><LoadingScreen /></AnimatePresence><CustomCursor />{path.startsWith("/admin") ? <AdminRouter path={path} navigate={navigate} /> : <PublicRouter path={path} navigate={navigate} />}</>;
}