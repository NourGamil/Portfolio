export const profile = {
  name: "Nour Gamil",
  role: "Creative Front-End Developer",
  email: "nouragmil135@gmail.com",
  phone: "+20 01221646925",
  location: "Cairo, Egypt",
  cv: "/Nour Gamil CV.pdf",
};

export const navLinks = [
  { label: "Intro", href: "#home", number: "01" },
  { label: "About", href: "#about", number: "02" },
  { label: "Skills", href: "#skills", number: "03" },
  { label: "Showcase", href: "#projects", number: "04" },
  { label: "Contact", href: "#contact", number: "05" },
];

export const stats = [
  { value: "3+", label: "Years learning & building" },
  { value: "12+", label: "Interfaces shipped" },
  { value: "3D", label: "Motion-first approach" },
];

export const skillGroups = [
  {
    label: "Interface Engineering",
    color: "#0070f3",
    items: [
      { name: "Next.js", level: 92 },
      { name: "React.js", level: 86 },
      { name: "Tailwind CSS", level: 94 },
      { name: "GSAP", level: 88 },
    ],
  },
  {
    label: "Immersive Motion",
    color: "#0ae448",
    items: [
      { name: "Three.js", level: 76 },
      { name: "R3F", level: 72 },
      { name: "ScrollTrigger", level: 86 },
      { name: "Creative Direction", level: 84 },
    ],
  },
  {
    label: "Systems & Tools",
    color: "#fdc700",
    items: [
      { name: "Figma", level: 78 },
      { name: "Blender", level: 64 },
      { name: "PHP / Laravel", level: 62 },
      { name: "MySQL", level: 70 },
    ],
  },
];

export const projectsData = [
  {
    num: "01",
    title: "Sonic Sneaks",
    category: "3D Commerce",
    description:
      "Interactive shoe retail experience with 3D product motion, expressive scrolling, and a cinematic shopping flow.",
    img: "/images/Shoe-Show.webp",
    githubLink: "https://github.com/nourgamil/Sonic-Sneak",
    websiteLink: "https://nourgamil.github.io/Sonic-Sneak/",
    accent: "#0070f3",
  },
  {
    num: "02",
    title: "Velocity",
    category: "Automotive UI",
    description:
      "Luxury automotive landing page built around bold product framing, deep contrast, and premium motion rhythm.",
    img: "/images/Cars-Lambo.webp",
    githubLink: "https://github.com/nourgamil/Velocity/",
    websiteLink: "https://nourgamil.github.io/Velocity/",
    accent: "#ff2d20",
  },
  {
    num: "03",
    title: "Globe Trotter",
    category: "Travel Experience",
    description:
      "A destination-driven travel interface with smooth transitions, large visual moments, and exploration-focused content.",
    img: "/images/Globe-Trotter.webp",
    githubLink: "https://github.com/nourgamil/Globe-Trotter",
    websiteLink: "https://nourgamil.github.io/Globe-Trotter/",
    accent: "#0ae448",
  },
  {
    num: "04",
    title: "SoleAura",
    category: "Sneaker Store",
    description:
      "Premium sneaker storefront with curated collections, product filtering, quick-view flow, and cart interactions.",
    img: "/images/SoleAura.webp",
    githubLink: "https://github.com/NourGamil/SoulAura",
    websiteLink: "https://nourgamil.github.io/SoulAura/",
    accent: "#fdc700",
  },
  {
    num: "05",
    title: "Bunora",
    category: "Restaurant Brand",
    description:
      "Warm restaurant website with refined menu presentation, polished sections, and a premium dining atmosphere.",
    img: "/images/Bunora.webp",
    githubLink: "https://github.com/NourGamil/Bunora",
    websiteLink: "https://nourgamil.github.io/Bunora/",
    accent: "#fdc700",
  },
  {
    num: "06",
    title: "FitForge",
    category: "Fitness Studio",
    description:
      "High-energy fitness platform with program highlights, training content, bold contrast, and strong brand movement.",
    img: "/images/FitForge.webp",
    githubLink: "https://github.com/NourGamil/FitForge",
    websiteLink: "https://nourgamil.github.io/FitForge/",
    accent: "#0ae448",
  },
  {
    num: "07",
    title: "EduVanta",
    category: "Learning Platform",
    description:
      "Modern education website with course discovery, mentor sections, learning benefits, and a student-first feel.",
    img: "/images/Eduvanta.webp",
    githubLink: "https://github.com/NourGamil/EduVanta",
    websiteLink: "https://nourgamil.github.io/EduVanta/",
    accent: "#004973",
  },
  {
    num: "08",
    title: "Fioré",
    category: "Floral Boutique",
    description:
      "Elegant flower boutique experience with editorial layouts, gallery moments, and soft luxury visuals.",
    img: "/images/Fiore.webp",
    githubLink: "https://github.com/NourGamil/Fiore",
    websiteLink: "https://nourgamil.github.io/Fiore/",
    accent: "#fdc700",
  },
];

export const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nour-gamil-5901a7286/" },
  { label: "GitHub", href: "https://github.com/NourGamil" },
  { label: "WhatsApp", href: "https://wa.me/201221646925" },
  { label: "Instagram", href: "https://www.instagram.com/nourgamil12/" },
];

export function asset(path = "") {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
