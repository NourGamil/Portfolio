"use client";

import { useEffect, useMemo, useState } from "react";
import { asset, navLinks, profile } from "../data/portfolioData";

export default function Navbar() {
  const [active, setActive] = useState(navLinks[0]?.href || "#home");
  const [open, setOpen] = useState(false);

  const activeLink = useMemo(
    () => navLinks.find((link) => link.href === active) || navLinks[0],
    [active]
  );

  useEffect(() => {
    let frame = 0;

    const isVisible = (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 1 && rect.height > 1;
    };

    const getLinkedSections = () =>
      navLinks.flatMap((link) => {
        const key = link.href.replace("#", "");
        const grouped = Array.from(document.querySelectorAll(`[data-nav-section="${key}"]`));
        return grouped.length ? grouped : [document.querySelector(link.href)].filter(Boolean);
      });

    const updateActive = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;
      const visibleSections = getLinkedSections().filter(isVisible);
      if (!visibleSections.length) return;

      const closest = visibleSections.reduce((best, section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        return distance < best.distance ? { section, distance } : best;
      }, { section: visibleSections[0], distance: Infinity }).section;

      const key = closest.dataset.navSection || closest.id;
      if (key) setActive(`#${key}`);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
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

  const resolveTarget = (href) => {
    const key = href.replace("#", "");
    const grouped = Array.from(document.querySelectorAll(`[data-nav-section="${key}"]`));
    const visibleGrouped = grouped.find((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 1 && rect.height > 1;
    });

    return visibleGrouped || document.querySelector(href);
  };

  const scrollToSection = (href) => {
    setOpen(false);
    setActive(href);
    const target = resolveTarget(href);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <header className="pointer-events-none fixed inset-0 z-[100] text-white">
      <div className="pointer-events-auto fixed left-4 top-4 z-[102] max-md:left-2 max-md:top-2 lg:left-6 lg:top-6">
        <button
          type="button"
          onClick={() => scrollToSection("#home")}
          className="group flex cursor-pointer items-center gap-3 rounded-[1.75rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] px-3 py-3 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md transition duration-500 hover:border-[color:var(--theme-color-c)] max-md:gap-0 max-md:rounded-2xl max-md:px-1.5 max-md:py-1.5"
          aria-label="Go to intro"
        >
          <span className="relative grid h-11 w-11 place-items-center rounded-2xl lg:h-12 lg:w-12 border border-[color:var(--theme-border)] [background:var(--theme-gradient-soft)] [box-shadow:inset_0_0_26px_rgba(255,255,255,0.08),0_0_42px_var(--theme-color-a)] max-md:h-9 max-md:w-9 max-md:rounded-xl">
            <span className="absolute inset-1 rounded-xl border border-[color:var(--theme-color-a)] transition duration-500 group-hover:rotate-45 group-hover:border-[color:var(--theme-color-c)]" />
            <span className="absolute h-2 w-2 rounded-full [background:var(--theme-color-c)] [box-shadow:0_0_18px_var(--theme-color-c)]" />
            <span className="relative text-sm font-black tracking-[-0.12em] text-[#eaf6ff] max-md:text-[11px]">NG</span>
          </span>

          <span className="hidden pr-2 text-left lg:block">
            <span className="block text-[10px] font-black uppercase tracking-[0.42em] text-[color:var(--theme-color-c)]">
              Nour Gamil
            </span>
            <span className="mt-1 block text-xs font-semibold text-[#f8fcff]">
              Creative front-end systems
            </span>
          </span>
        </button>
      </div>

      <div className="pointer-events-auto fixed right-4 top-4 z-[102] hidden items-center gap-2 rounded-[1.65rem] border border-[color:var(--theme-border)] [background:linear-gradient(145deg,rgba(2,7,13,0.86),rgba(7,18,29,0.64)),var(--theme-gradient-soft)] p-1.5 [box-shadow:0_22px_70px_color-mix(in_srgb,var(--theme-accent)_18%,transparent),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl lg:right-6 lg:top-6 lg:flex">
        <a
          href={asset(profile.cv)}
          download
          className="group relative isolate flex cursor-pointer items-center gap-2 overflow-hidden rounded-[1.2rem] border border-white/12 bg-white/[0.045] px-4 py-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#f8fcff] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition duration-500 hover:-translate-y-0.5 hover:border-[color:var(--theme-color-c)] hover:bg-white/[0.09] hover:text-white"
        >
          <span className="absolute inset-y-1 left-1 w-7 rounded-[0.95rem] [background:var(--theme-gradient)] opacity-[0.18] blur-md transition duration-500 group-hover:opacity-[0.35]" />
          <span className="relative grid h-6 w-6 place-items-center max-md:h-5 max-md:w-5 rounded-[0.75rem] border border-white/12 bg-white/[0.07] text-[9px] text-[color:var(--theme-color-c)] transition duration-500 group-hover:border-[color:var(--theme-color-c)] group-hover:bg-white/[0.12]">↓</span>
          <span className="relative">CV</span>
          <span className="relative inline-block text-[color:var(--theme-color-c)] transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </a>
        <button
          type="button"
          onClick={() => scrollToSection("#contact")}
          className="group relative isolate flex cursor-pointer items-center gap-2 overflow-hidden rounded-[1.2rem] border border-white/35 [background:var(--theme-gradient)] px-4 py-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#061014] [box-shadow:var(--theme-button-shadow)] transition duration-500 hover:-translate-y-0.5 hover:scale-[1.015] hover:border-white/70"
        >
          <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.55),transparent)] opacity-0 transition duration-500 group-hover:translate-x-8 group-hover:opacity-55" />
          <span className="relative grid h-6 w-6 place-items-center max-md:h-5 max-md:w-5 rounded-[0.75rem] bg-[#061014]/12 text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">✦</span>
          <span className="relative">Hire</span>
        </button>
      </div>

      <aside className="pointer-events-auto fixed right-4 top-1/2 z-[101] hidden -translate-y-1/2 lg:block xl:right-5">
        <div className="relative rounded-[2rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] p-2 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md">
          <div className="absolute bottom-8 left-1/2 top-8 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(234,246,255,0.22),transparent)]" />
          <div className="grid gap-2">
            {navLinks.map((link) => {
              const isActive = active === link.href;

              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollToSection(link.href)}
                  className={`group relative flex cursor-pointer items-center justify-end gap-3 rounded-[1.35rem] px-2 py-2 transition duration-500 ${isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"}`}
                  aria-label={`Go to ${link.label}`}
                >
                  <span className={`pointer-events-none absolute right-[3.65rem] whitespace-nowrap rounded-full border px-3 py-2 text-[9px] font-black uppercase tracking-[0.22em] opacity-0 shadow-2xl transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${isActive ? "border-[color:var(--theme-color-c)] [background:var(--theme-gradient)] text-[#061014]" : "border-white/10 bg-[#06101d] text-[#f8fcff]"}`}>
                    {link.label}
                  </span>
                  <span className={`relative grid h-11 w-11 place-items-center rounded-2xl border font-mono text-[10px] font-black transition duration-500 ${isActive ? "border-[color:var(--theme-color-c)] [background:var(--theme-gradient)] text-[#071014] [box-shadow:var(--theme-button-shadow)]" : "border-white/12 bg-[#06101d]/78 text-[#f2fbff] group-hover:border-[color:var(--theme-color-a)] group-hover:text-white"}`}>
                    {link.number}
                    <span className={`absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition duration-500 ${isActive ? "[background:var(--theme-color-c)] [box-shadow:0_0_18px_var(--theme-color-c)]" : "bg-white/18"}`} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="pointer-events-auto fixed bottom-4 left-1/2 z-[102] hidden -translate-x-1/2 rounded-[1.5rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] px-3 py-2 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md">
        {navLinks.map((link) => {
          const isActive = active === link.href;

          return (
            <button
              key={link.href}
              type="button"
              onClick={() => scrollToSection(link.href)}
              className={`cursor-pointer rounded-full px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition duration-300 ${isActive ? "[background:var(--theme-gradient)] text-[#071014]" : "text-[#f2fbff] hover:bg-white/[0.05] hover:text-white"}`}
            >
              {link.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto fixed right-4 top-4 z-[103] grid h-14 w-14 cursor-pointer place-items-center rounded-2xl border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] text-white [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md max-md:right-2 max-md:top-2 max-md:h-11 max-md:w-11 max-md:rounded-xl lg:hidden"
        aria-label="Open navigation"
      >
        <span className="relative grid h-6 w-6 place-items-center max-md:h-5 max-md:w-5">
          <span className={`absolute h-0.5 w-6 rounded-full bg-white transition duration-300 max-md:w-5 ${open ? "rotate-45" : "-translate-y-2"}`} />
          <span className={`absolute h-0.5 w-6 rounded-full bg-white transition duration-300 max-md:w-5 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute h-0.5 w-6 rounded-full bg-white transition duration-300 max-md:w-5 ${open ? "-rotate-45" : "translate-y-2"}`} />
        </span>
      </button>

      <div className={`pointer-events-auto fixed inset-x-3 top-[5.3rem] max-md:inset-x-2 max-md:top-[4rem] z-[101] overflow-hidden rounded-[2rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md transition-all duration-500 lg:hidden ${open ? "max-h-[34rem] opacity-100" : "max-h-0 border-transparent opacity-0"}`}>
        <div className="p-3">
          <div className="mb-3 rounded-[1.5rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-[color:var(--theme-color-c)]">Navigation Deck</p>
            <p className="mt-2 text-sm font-semibold text-[#f8fcff]">Jump through the portfolio sections.</p>
          </div>

          <div className="grid gap-2">
            {navLinks.map((link) => {
              const isActive = active === link.href;

              return (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`flex cursor-pointer items-center justify-between rounded-[1.45rem] px-4 py-4 text-left transition duration-300 ${isActive ? "[background:var(--theme-gradient)] text-[#071014]" : "bg-white/[0.04] text-[#f8fcff] hover:bg-white/[0.08] hover:text-white"}`}
                >
                  <span className="text-sm font-black uppercase tracking-[0.22em]">{link.label}</span>
                  <span className="font-mono text-xs font-black opacity-70">{link.number}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={asset(profile.cv)}
              download
              className="cursor-pointer rounded-[1.35rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-center text-[10px] font-black uppercase tracking-[0.22em] text-[#f8fcff]"
            >
              Download CV
            </a>
            <button
              type="button"
              onClick={() => scrollToSection("#contact")}
              className="cursor-pointer rounded-[1.3rem] [background:var(--theme-gradient)] px-4 py-4 text-center text-[10px] font-black uppercase tracking-[0.22em] text-[#071014] [box-shadow:var(--theme-button-shadow)]"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-5 left-5 z-[101] hidden rounded-[1.45rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] px-4 py-3 text-white [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md lg:block xl:left-6">
        <p className="text-[9px] font-black uppercase tracking-[0.32em] text-[#f2fbff]">Now viewing</p>
        <p className="mt-1 text-xs font-black uppercase tracking-[0.24em] text-[color:var(--theme-color-c)]">
          {activeLink?.number} / {activeLink?.label}
        </p>
      </div>
    </header>
  );
}
