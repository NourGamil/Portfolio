const makeTheme = ({ id, name, accent }) => ({
  id,
  name,
  accent,
  colorA: accent,
  colorB: "#ffffff",
  colorC: accent,
  gradient: `linear-gradient(45deg, ${accent} 0%, #ffffff 100%)`,
  softGradient: `linear-gradient(45deg, color-mix(in srgb, ${accent} 18%, transparent) 0%, rgba(255,255,255,0.13) 100%)`,
});

export const sectionThemes = [
  makeTheme({ id: "home", name: "Intro", accent: "#7dd3fc" }),
  makeTheme({ id: "about", name: "About", accent: "#fdc700" }),
  makeTheme({ id: "skills", name: "Skills", accent: "#c084fc" }),
  makeTheme({ id: "projects", name: "Projects", accent: "#c0f500" }),
  makeTheme({ id: "contact", name: "Contact", accent: "#fffca0" }),
];

export const sectionThemeById = Object.fromEntries(sectionThemes.map((theme) => [theme.id, theme]));
