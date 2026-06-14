"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function isVisibleSection(section) {
  if (!section) return false;
  const rect = section.getBoundingClientRect();
  const style = window.getComputedStyle(section);
  return style.display !== "none" && style.visibility !== "hidden" && rect.width > 1 && rect.height > 1;
}

function getActiveSnapSections() {
  return gsap.utils.toArray("[data-snap-section]").filter(isVisibleSection);
}

function getSnapPositions(sections) {
  const maxScroll = ScrollTrigger.maxScroll(window) || 1;

  return sections.map((section) => {
    const rect = section.getBoundingClientRect();
    const centeredY = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
    return Math.max(0, Math.min(centeredY, maxScroll));
  });
}

export default function GsapSnapper() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let sections = getActiveSnapSections();
    if (!sections.length) return undefined;

    let snapPositions = getSnapPositions(sections);
    let refreshFrame = 0;

    const refreshSnapPositions = () => {
      sections = getActiveSnapSections();
      snapPositions = getSnapPositions(sections);
    };

    const requestRefresh = () => {
      if (refreshFrame) return;
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = 0;
        refreshSnapPositions();
        ScrollTrigger.refresh();
      });
    };

    const snapper = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      invalidateOnRefresh: true,
      snap: {
        snapTo: (progress) => {
          if (!snapPositions.length) refreshSnapPositions();

          const maxScroll = ScrollTrigger.maxScroll(window) || 1;
          const currentY = progress * maxScroll;

          const nearest = snapPositions.reduce((closest, position) => {
            return Math.abs(position - currentY) < Math.abs(closest - currentY) ? position : closest;
          }, snapPositions[0] || 0);

          return nearest / maxScroll;
        },
        duration: { min: 0.38, max: 0.78 },
        delay: window.matchMedia("(max-width: 767px)").matches ? 0.04 : 0.08,
        ease: "power3.out",
      },
    });

    ScrollTrigger.addEventListener("refresh", refreshSnapPositions);
    window.addEventListener("resize", requestRefresh);
    window.addEventListener("orientationchange", requestRefresh);
    window.addEventListener("load", requestRefresh);
    window.addEventListener("portfolio-loader-complete", requestRefresh);

    refreshSnapPositions();
    ScrollTrigger.refresh();

    return () => {
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
      window.removeEventListener("resize", requestRefresh);
      window.removeEventListener("orientationchange", requestRefresh);
      window.removeEventListener("load", requestRefresh);
      window.removeEventListener("portfolio-loader-complete", requestRefresh);
      ScrollTrigger.removeEventListener("refresh", refreshSnapPositions);
      snapper.kill();
    };
  }, []);

  return null;
}
