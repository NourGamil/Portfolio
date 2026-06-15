"use client";

import { useEffect, useState } from "react";

const MINIMUM_LOADER_TIME = 2100;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

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
        }, 520);

        hideTimer = window.setTimeout(() => {
          document.body.classList.remove("loader-lock");
          window.dispatchEvent(new CustomEvent("portfolio-loader-complete"));
          setIsHidden(true);
        }, 1350);
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
        if (loadReached) return Math.min(99, current + 4.2);
        if (current < 42) return current + 3.1;
        if (current < 76) return current + 1.45;
        if (current < 94) return current + 0.5;
        return current;
      });
    }, 90);

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
      className={`cinematic-loader fixed inset-0 z-[99999] overflow-hidden text-white transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? "pointer-events-none scale-[1.035] opacity-0 blur-lg" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label={isLoaded ? "Portfolio loaded" : "Loading portfolio"}
    >
      <div className="cinematic-loader-bg absolute inset-0" />
      <div className="cinematic-loader-stars absolute inset-0" />
      <div className="cinematic-loader-vignette absolute inset-0" />

      <div className="relative z-10 flex h-full min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <div className="cinematic-loader-object relative grid h-[clamp(14rem,34vw,25rem)] w-[clamp(14rem,34vw,25rem)] place-items-center">
          <div className="cinematic-loader-haze absolute" />
          <div className="cinematic-loader-disk cinematic-loader-disk-back absolute" />
          <div className="cinematic-loader-hole absolute" />
          <div className="cinematic-loader-disk cinematic-loader-disk-front absolute" />
          <div className="cinematic-loader-light cinematic-loader-light-one absolute" />
          <div className="cinematic-loader-light cinematic-loader-light-two absolute" />
        </div>

        <div className="mt-8 w-full max-w-[34rem] sm:mt-10">
          <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[0.55em] text-[#7dd3fc] sm:text-xs">
            {isLoaded ? "Experience Ready" : "Loading Experience"}
          </p>
          <h1 className="text-[clamp(2.6rem,9vw,6.3rem)] font-black uppercase leading-[0.82] tracking-[-0.09em] text-white drop-shadow-[0_0_40px_rgba(125,211,252,0.24)]">
            Nour Gamil
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-6 text-white/75 sm:text-base">
            {isLoaded ? "Opening the scene." : "Preparing the interactive black hole."}
          </p>

          <div className="mt-7 overflow-hidden rounded-full border border-white/15 bg-white/[0.065] p-1 shadow-[0_0_45px_rgba(125,211,252,0.18)] backdrop-blur-md sm:mt-8">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#7dd3fc] via-white to-[#fdc700] transition-[width] duration-300 ease-out shadow-[0_0_24px_rgba(125,211,252,0.6)]"
              style={{ width: `${progressValue}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/55 sm:text-xs">
            <span>{isLoaded ? "Ready" : "Loading"}</span>
            <span>{progressValue}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
