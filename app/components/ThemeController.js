"use client";

import { useEffect } from "react";
import { sectionThemeById, sectionThemes } from "../data/sectionThemes";

function applyTheme(theme) {
  if (typeof document === "undefined" || !theme) return;

  const root = document.documentElement;
  root.dataset.themeSection = theme.id;
  root.style.setProperty("--theme-accent", theme.accent);
  root.style.setProperty("--theme-color-a", theme.colorA);
  root.style.setProperty("--theme-color-b", theme.colorB);
  root.style.setProperty("--theme-color-c", theme.colorC);
  root.style.setProperty("--theme-gradient", theme.gradient);
  root.style.setProperty("--theme-gradient-soft", theme.softGradient);
  root.style.setProperty(
    "--theme-panel-bg",
    `linear-gradient(145deg, rgba(3,9,16,0.82), rgba(7,21,31,0.68)), ${theme.softGradient}`
  );
  root.style.setProperty(
    "--theme-panel-bg-strong",
    `linear-gradient(145deg, rgba(2,7,13,0.94), rgba(6,18,27,0.82)), ${theme.softGradient}`
  );
  root.style.setProperty("--theme-border", `color-mix(in srgb, ${theme.accent} 28%, rgba(255,255,255,0.2))`);
  root.style.setProperty(
    "--theme-panel-shadow",
    `0 24px 90px color-mix(in srgb, ${theme.accent} 16%, transparent), 0 0 42px rgba(255,255,255,0.075), inset 0 1px 0 rgba(255,255,255,0.16)`
  );
  root.style.setProperty(
    "--theme-button-shadow",
    `0 18px 58px color-mix(in srgb, ${theme.accent} 28%, transparent), 0 0 30px rgba(255,255,255,0.16)`
  );
}

function isVisibleSection(section) {
  if (!section) return false;
  const rect = section.getBoundingClientRect();
  const style = window.getComputedStyle(section);
  return style.display !== "none" && style.visibility !== "hidden" && rect.width > 1 && rect.height > 1;
}

function getClosestSectionTheme() {
  const sections = Array.from(document.querySelectorAll("[data-snap-section]")).filter(isVisibleSection);
  if (!sections.length) return sectionThemes[0];

  const viewportCenter = window.innerHeight / 2;
  let closestId = sectionThemes[0].id;
  let closestDistance = Infinity;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);
    const themeId = section.dataset.themeSection || section.dataset.navSection || section.id;

    if (distance < closestDistance && themeId) {
      closestDistance = distance;
      closestId = themeId;
    }
  });

  return sectionThemeById[closestId] || sectionThemes[0];
}

export default function ThemeController() {
  useEffect(() => {
    let frame = 0;
    let activeId = "";

    const updateTheme = () => {
      frame = 0;
      const theme = getClosestSectionTheme();
      if (!theme || theme.id === activeId) return;
      activeId = theme.id;
      applyTheme(theme);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateTheme);
    };

    applyTheme(sectionThemes[0]);
    updateTheme();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("orientationchange", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("orientationchange", requestUpdate);
    };
  }, []);

  return null;
}
