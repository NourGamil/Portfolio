"use client";

import { useEffect, useMemo, useState } from "react";
import { sectionThemes } from "../data/sectionThemes";

const MINIMUM_LOADER_TIME = 2600;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const orbitDots = useMemo(() => {
    const palette = sectionThemes.map((theme) => theme.accent);
    return Array.from({ length: 24 }, (_, index) => ({
      id: index,
      color: palette[index % palette.length],
      delay: `${index * -0.14}s`,
      size: `${5 + (index % 4) * 1.5}px`,
      orbitRadius: `clamp(${70 + (index % 7) * 9}px, ${9 + (index % 7) * 1.5}vw, ${118 + (index % 7) * 16}px)`,
      orbitDepth: `${(index % 5) * 10}px`,
    }));
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    let loadReached = document.readyState === "complete";
    let finishTimer = 0;
    let exitTimer = 0;
    let hideTimer = 0;

    document.body.classList.add("loader-lock");

    const completeLoader = () => {
      const elapsed = performance.now() - startedAt;
      const waitTime = Math.max(0, MINIMUM_LOADER_TIME - elapsed);

      finishTimer = window.setTimeout(() => {
        setProgress(100);
        setIsLoaded(true);

        exitTimer = window.setTimeout(() => {
          setIsExiting(true);
        }, 650);

        hideTimer = window.setTimeout(() => {
          document.body.classList.remove("loader-lock");
          window.dispatchEvent(new CustomEvent("portfolio-loader-complete"));
          setIsHidden(true);
        }, 1650);
      }, waitTime);
    };

    const handleLoad = () => {
      loadReached = true;
      completeLoader();
    };

    if (loadReached) {
      completeLoader();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (loadReached) return Math.min(99, current + 3.8);
        if (current < 40) return current + 2.9;
        if (current < 72) return current + 1.35;
        if (current < 92) return current + 0.42;
        return current;
      });
    }, 95);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.clearInterval(progressTimer);
      window.clearTimeout(finishTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
      document.body.classList.remove("loader-lock");
    };
  }, []);

  if (isHidden) return null;

  const progressValue = Math.round(Math.min(progress, 100));

  return (
    <div
      className={`portfolio-loader fixed inset-0 z-[99999] overflow-hidden bg-[#01040b] text-white transition-[opacity,transform,filter] duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? "pointer-events-none scale-[1.045] opacity-0 blur-xl" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label={isLoaded ? "Portfolio loaded" : "Loading portfolio"}
    >
      <div className="loader-atmosphere absolute inset-0" />
      <div className="loader-star-noise absolute inset-0" />
      <div className="loader-vignette absolute inset-0" />

      <div className="relative z-10 flex h-full min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <div className="loader-singularity relative mb-8 grid h-[clamp(16rem,42vw,31rem)] w-[clamp(16rem,42vw,31rem)] place-items-center sm:mb-10">
          <div className="loader-disk loader-disk-one absolute" />
          <div className="loader-disk loader-disk-two absolute" />
          <div className="loader-lens absolute" />
          <div className="loader-event-horizon relative z-10 grid place-items-center">
            <div className="loader-core-pulse absolute" />
            <div className="loader-core relative" />
          </div>

          {orbitDots.map((dot) => (
            <span
              key={dot.id}
              className="loader-orbit-dot absolute rounded-full"
              style={{
                "--dot-index": dot.id,
                "--dot-color": dot.color,
                "--dot-delay": dot.delay,
                "--orbit-radius": dot.orbitRadius,
                "--dot-depth": dot.orbitDepth,
                width: dot.size,
                height: dot.size,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-[34rem]">
          <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.55em] text-[color:var(--theme-accent)] sm:text-xs">
            {isLoaded ? "Loaded" : "Initializing singularity"}
          </p>
          <h1 className="text-[clamp(2.5rem,10vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.09em] text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.35)]">
            Nour Gamil
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-6 text-white/85 sm:text-base">
            {isLoaded ? "Portfolio loaded. Releasing the scene." : "Pulling particles, titles, and motion systems into orbit."}
          </p>

          <div className="mt-7 overflow-hidden rounded-full border border-white/15 [background:rgba(255,255,255,0.08)] p-1 shadow-[0_0_45px_color-mix(in_srgb,var(--theme-accent)_20%,transparent)] backdrop-blur-md sm:mt-9">
            <div
              className="h-2.5 rounded-full [background:var(--theme-gradient)] transition-[width] duration-300 ease-out shadow-[0_0_24px_color-mix(in_srgb,var(--theme-accent)_55%,transparent)]"
              style={{ width: `${progressValue}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/65 sm:text-xs">
            <span>{isLoaded ? "Ready" : "Loading"}</span>
            <span>{progressValue}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
