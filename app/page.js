"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

import Skills from "./components/Skills";
import Footer from "./components/Footer";
import { asset, projectsData } from "./data/portfolioData";

function chunkItems(items, size) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size)
  );
}

function getVisibleProjectTarget() {
  if (typeof window === "undefined") return "#projects";
  if (window.matchMedia("(max-width: 767px)").matches) return "#projects-phone-1";
  if (window.matchMedia("(max-width: 1023px)").matches) return "#projects-tablet-1";
  return "#projects";
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

export default function Home() {
  const containerRef = useRef(null);
  const tabletProjectPages = chunkItems(projectsData, 4);
  const phoneProjectPages = chunkItems(projectsData, 2);

  const scrollToProjects = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: getVisibleProjectTarget(),
      ease: "power4.inOut",
    });
  };

  useEffect(() => {
    const magneticCleanups = gsap.utils.toArray(".magnetic-wrap").map((wrapper) => {
      const button = wrapper.querySelector(".cv-btn");
      if (!button) return () => {};

      const handleMove = (event) => {
        const { left, top, width, height } = wrapper.getBoundingClientRect();
        const x = event.clientX - (left + width / 2);
        const y = event.clientY - (top + height / 2);

        gsap.to(button, {
          x: x * 0.4,
          y: y * 0.4,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.3)",
        });
      };

      wrapper.addEventListener("mousemove", handleMove);
      wrapper.addEventListener("mouseleave", handleLeave);

      return () => {
        wrapper.removeEventListener("mousemove", handleMove);
        wrapper.removeEventListener("mouseleave", handleLeave);
      };
    });

    return () => {
      magneticCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <main ref={containerRef} className="relative z-10 overflow-hidden">
      <SingularityHoldTrigger />
      <section id="home" data-nav-section="home" data-snap-section className="relative isolate h-[100dvh] w-full overflow-hidden px-[8vw] max-sm:px-5">
        <div className="absolute left-1/2 top-[clamp(5.25rem,15dvh,7rem)] w-[min(92vw,42rem)] -translate-x-1/2 text-center sm:top-[clamp(5.5rem,14dvh,7.25rem)] md:top-[clamp(6rem,13dvh,8rem)] lg:left-[8vw] lg:top-[56%] lg:w-auto lg:max-w-4xl lg:translate-x-0 lg:-translate-y-1/2 lg:text-left">
          <div className="hero-welcome-mark mb-3 flex items-center justify-center gap-3 lg:mb-5 lg:justify-start">
            <span className="h-px w-10 rounded-full bg-gradient-to-r from-transparent via-[color:var(--theme-accent)] to-white/50 shadow-[0_0_20px_color-mix(in_srgb,var(--theme-accent)_42%,transparent)] sm:w-14" />
            <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-white/75 sm:text-[10px] md:text-xs">
              Welcome To
            </span>
            <span className="h-px w-10 rounded-full bg-gradient-to-l from-transparent via-[color:var(--theme-accent)] to-white/50 shadow-[0_0_20px_color-mix(in_srgb,var(--theme-accent)_42%,transparent)] sm:w-14 lg:hidden" />
          </div>

          <h1 className="mx-auto flex max-w-[22rem] flex-col items-center text-center font-black leading-[0.9] tracking-[-0.085em] text-white drop-shadow-[0_24px_80px_rgba(255,255,255,0.2)] sm:max-w-xl md:max-w-3xl lg:mx-0 lg:max-w-5xl lg:items-start lg:text-left lg:leading-[0.82]">
            <span className="relative block text-[clamp(3.15rem,15vw,6.4rem)] text-white/95 [text-shadow:0_0_38px_rgba(255,255,255,0.28),0_10px_36px_rgba(0,0,0,0.75)] md:text-[clamp(5rem,11vw,8rem)] lg:text-[clamp(5.05rem,7.45vw,8.25rem)]">
              My
            </span>
            <span className="relative mt-1 block bg-clip-text text-[clamp(3.65rem,16vw,7rem)] italic text-transparent [background-image:linear-gradient(110deg,#ffffff_0%,var(--theme-accent)_42%,var(--theme-color-c)_68%,#ffffff_100%)] drop-shadow-[0_0_46px_color-mix(in_srgb,var(--theme-accent)_45%,transparent)] md:mt-2 md:text-[clamp(5.55rem,11.4vw,8.55rem)] lg:-mt-3 lg:text-[clamp(5.85rem,8.05vw,9.05rem)]">
              Portfolio
            </span>
          </h1>

 <div className="relative mt-5 hidden lg:block lg:mt-10">
            <div onClick={scrollToProjects} className="magnetic-wrap inline-block cursor-pointer p-1 sm:p-2 md:p-10 md:-ml-10">
              <div className="cv-btn rounded-full border-2 border-[color:var(--theme-accent)] px-6 py-3 text-sm font-bold uppercase text-[color:var(--theme-accent)] transition-colors duration-300 hover:bg-[#004973] hover:text-white sm:px-8 sm:py-4 sm:text-lg md:px-12 md:py-6 md:text-xl">
                Explore the Magic
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[10vh] left-1/2 z-20 -translate-x-1/2 lg:hidden">
          <div onClick={scrollToProjects} className="magnetic-wrap inline-block cursor-pointer p-1 sm:p-2">
            <div className="cv-btn whitespace-nowrap rounded-full border-2 border-[color:var(--theme-accent)] px-7 py-3.5 text-sm font-bold uppercase text-[color:var(--theme-accent)] transition-colors duration-300 hover:bg-[#004973] hover:text-white sm:px-9 sm:py-4 sm:text-base md:px-12 md:py-5 md:text-lg">
              Explore the Magic
            </div>
          </div>
        </div>
      </section>

      <section id="about" data-nav-section="about" data-snap-section className="content-section relative isolate h-[100dvh] w-full overflow-hidden px-[8vw] py-[clamp(4.75rem,8vh,6.5rem)] max-md:px-5 max-md:py-[5.35rem] max-sm:px-4 max-sm:py-[5.1rem]">
        <div className="grid h-full grid-cols-1 items-center gap-5 max-md:content-center max-md:items-center max-md:gap-5 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-4 max-md:space-y-3 md:space-y-6 lg:col-span-7">
 <h2 className="relative max-w-4xl text-[clamp(2.35rem,12vw,3.75rem)] font-black uppercase leading-[0.98] tracking-[-0.07em] text-white max-md:text-[2.15rem] max-md:leading-[0.94] max-md:tracking-[-0.06em] md:text-6xl xl:text-7xl">
              Creating digital <span className="bg-clip-text text-transparent [background-image:var(--theme-gradient)]">poetry</span> through code.
            </h2>

 <div className="relative rounded-[1.6rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg)] p-4 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md max-md:rounded-[1.25rem] max-md:p-4 sm:rounded-[2rem] md:p-7 lg:p-8">
              <p className="text-xs font-semibold leading-6 text-white max-md:text-[12px] max-md:leading-[1.65] sm:text-sm md:text-base md:leading-8 lg:text-lg">
                I bridge the gap between complex 3D mathematics and clean UI design. Every pixel is intentional, every motion is calculated, and every section is shaped to feel alive without losing performance.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 max-md:mt-4 max-md:gap-3 max-md:pt-4 md:mt-7 md:pt-7">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--theme-accent)] max-md:text-[9px] max-md:tracking-[0.22em] md:text-xs">Experience</h4>
                  <p className="mt-2 font-mono text-xs font-bold uppercase text-white max-md:mt-1.5 max-md:text-[11px] md:text-sm">3 Years</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.28em] text-[color:var(--theme-accent)] max-md:text-[9px] max-md:tracking-[0.22em] md:text-xs">Location</h4>
                  <p className="mt-2 font-mono text-xs font-bold uppercase text-white max-md:mt-1.5 max-md:text-[11px] md:text-sm">Global / Remote</p>
                </div>
              </div>
            </div>
          </div>

 <div className="relative flex justify-center max-md:mt-2 md:flex lg:col-span-5">
            <div
              className="w-full max-w-[280px] cursor-pointer max-md:max-w-[205px] md:max-w-[340px]"
              style={{ perspective: "1200px" }}
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                gsap.to(event.currentTarget.querySelector(".cv-card"), {
                  rotateY: x * 26,
                  rotateX: -y * 26,
                  scale: 1.02,
                  duration: 0.45,
                  ease: "power2.out",
                });
              }}
              onMouseLeave={(event) => {
                gsap.to(event.currentTarget.querySelector(".cv-card"), {
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1,
                  duration: 1.15,
                  ease: "elastic.out(1, 0.5)",
                });
              }}
            >
              <a
                href={asset("/Nour Gamil CV.pdf")}
                download
                className="cv-card group relative flex aspect-[4/5] w-full flex-col items-center justify-between overflow-hidden rounded-[2.5rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] p-8 text-center [box-shadow:var(--theme-panel-shadow)] backdrop-blur-xl max-md:aspect-[5/4] max-md:rounded-[1.4rem] max-md:p-4 md:p-10"
              >
                <div className="absolute -inset-24 bg-[color:var(--theme-accent)] opacity-0 blur-[90px] transition-opacity duration-700 group-hover:opacity-20" />
                <p className="relative z-10 font-mono text-[9px] font-black uppercase tracking-[0.42em] text-[color:var(--theme-accent)] max-md:text-[7.5px] max-md:tracking-[0.26em] md:text-[10px]">Personal Archive</p>
                <div className="relative z-10 grid h-24 w-24 place-items-center max-md:h-14 max-md:w-14 md:h-28 md:w-28">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/80 animate-[spin_10s_linear_infinite]" />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white max-md:h-6 max-md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </div>
                <div className="relative z-10 w-full">
                  <h3 className="text-xl font-black uppercase tracking-[-0.04em] text-white max-md:text-sm md:text-2xl">Download CV</h3>
                  <div className="mx-auto mt-3 h-[2px] w-0 [background:var(--theme-gradient)] transition-all duration-500 group-hover:w-full max-md:mt-1" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Skills />

      <section
        id="projects"
        data-nav-section="projects"
        data-snap-section
        data-theme-section="projects"
        className="content-section relative isolate hidden h-[100dvh] w-full items-center overflow-hidden bg-transparent px-[8vw] py-[clamp(4.5rem,8vh,6rem)] lg:flex"
      >
        <div className="grid w-full grid-cols-4 gap-5 xl:gap-6">
          {projectsData.map((project) => (
            <ProjectCard key={project.num} project={project} />
          ))}
        </div>
      </section>

      {tabletProjectPages.map((projectPage, pageIndex) => (
        <section
          key={`projects-tablet-${pageIndex}`}
          id={pageIndex === 0 ? "projects-tablet-1" : undefined}
          data-nav-section="projects"
          data-snap-section
          data-theme-section="projects"
          className="content-section relative isolate hidden h-[100dvh] w-full items-center overflow-hidden bg-transparent px-[6vw] py-[5.5rem] md:flex lg:hidden"
        >
          <div className="grid w-full grid-cols-2 gap-4">
            {projectPage.map((project) => (
              <ProjectCard key={project.num} project={project} />
            ))}
          </div>
          <p className="pointer-events-none absolute bottom-5 right-6 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/72">
            {String(pageIndex + 1).padStart(2, "0")} / {String(tabletProjectPages.length).padStart(2, "0")}
          </p>
        </section>
      ))}

      {phoneProjectPages.map((projectPage, pageIndex) => (
        <section
          key={`projects-phone-${pageIndex}`}
          id={pageIndex === 0 ? "projects-phone-1" : undefined}
          data-nav-section="projects"
          data-snap-section
          data-theme-section="projects"
          className="content-section relative isolate flex h-[100dvh] w-full items-center overflow-hidden bg-transparent px-5 pb-7 pt-[5.9rem] md:hidden"
        >
          <div className="grid w-full grid-cols-1 gap-4">
            {projectPage.map((project) => (
              <ProjectCard key={project.num} project={project} />
            ))}
          </div>
          <p className="pointer-events-none absolute bottom-4 right-5 font-mono text-[9px] font-black uppercase tracking-[0.26em] text-white/72">
            {String(pageIndex + 1).padStart(2, "0")} / {String(phoneProjectPages.length).padStart(2, "0")}
          </p>
        </section>
      ))}

      <Footer />
    </main>
  );
}

function SingularityHoldTrigger() {
  const activeRef = useRef(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const getAudio = () => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) audioRef.current = createSingularityAudio();
    return audioRef.current;
  };

  const clearHoldTimer = () => {
    if (!timerRef.current) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const fireExplosion = () => {
    if (!activeRef.current) return;

    activeRef.current = false;
    clearHoldTimer();
    getAudio()?.explode();
    document.body.classList.remove("singularity-active");
    document.body.classList.add("singularity-explode");

    window.dispatchEvent(
      new CustomEvent("portfolio-singularity-hold", {
        detail: { active: false },
      })
    );
    window.dispatchEvent(new CustomEvent("portfolio-singularity-explode"));

    window.setTimeout(() => {
      document.body.classList.remove("singularity-explode");
    }, 1250);
  };

  const setActive = (active) => {
    activeRef.current = active;
    document.body.classList.toggle("singularity-active", active);

    if (active) {
      document.body.classList.remove("singularity-explode");
      getAudio()?.startHold();
      clearHoldTimer();
      timerRef.current = window.setTimeout(fireExplosion, 3000);
    } else {
      clearHoldTimer();
      getAudio()?.release();
    }

    window.dispatchEvent(
      new CustomEvent("portfolio-singularity-hold", {
        detail: { active },
      })
    );
  };

  useEffect(() => {
    const release = () => {
      if (activeRef.current) setActive(false);
    };

    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);

    return () => {
      release();
      clearHoldTimer();
      audioRef.current?.release();
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
    };
  }, []);

  const hold = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setActive(true);
  };

  const release = (event) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setActive(false);
  };

  return (
    <button
      type="button"
      aria-label="Click and hold the black hole"
      onPointerDown={hold}
      onPointerUp={release}
      onPointerCancel={release}
      className="singularity-trigger group fixed left-1/2 top-1/2 z-[80] block h-36 w-36 -translate-x-1/2 -translate-y-1/2 cursor-grab select-none touch-none rounded-full bg-transparent sm:h-44 sm:w-44 lg:h-56 lg:w-56 active:cursor-grabbing"
    >
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] px-4 py-2 text-[9px] font-black uppercase tracking-[0.28em] text-white shadow-[var(--theme-button-shadow)] backdrop-blur-md transition duration-300 group-hover:-translate-y-1 group-hover:border-[color:var(--theme-accent)]">
        Click and Hold
      </span>
    </button>
  );
}


function createSingularityAudio() {
  let context = null;
  let master = null;
  let compressor = null;
  let holdNodes = [];

  const ensureContext = () => {
    if (typeof window === "undefined") return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!context) {
      context = new AudioContextClass();
      compressor = context.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 24;
      compressor.ratio.value = 9;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.32;

      master = context.createGain();
      master.gain.value = 0.95;
      master.connect(compressor).connect(context.destination);
    }

    if (context.state === "suspended") context.resume();
    return context;
  };

  const createNoiseBuffer = (ctx, seconds = 2.4) => {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i += 1) {
 const fade = 1 - i / length;
      const crackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 2.4 : 0;
 data[i] = (Math.random() * 2 - 1) * (0.55 + fade * 0.75) + crackle;
    }

    return buffer;
  };

  const createDistortion = (ctx, amount = 28) => {
    const shaper = ctx.createWaveShaper();
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i += 1) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    shaper.curve = curve;
    shaper.oversample = "4x";
    return shaper;
  };

  const safeStop = (node, when = 0) => {
    try {
      node.stop(when);
    } catch {}
  };

  const release = () => {
    if (!context || !holdNodes.length) return;

    const time = context.currentTime;
    holdNodes.forEach(({ source, gain }) => {
      try {
        gain.gain.cancelScheduledValues(time);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);
        safeStop(source, time + 0.5);
      } catch {}
    });

    holdNodes = [];
  };

  const playClickIgnition = (ctx, time) => {
    const hit = ctx.createOscillator();
    const hitGain = ctx.createGain();
    hit.type = "triangle";
    hit.frequency.setValueAtTime(92, time);
    hit.frequency.exponentialRampToValueAtTime(26, time + 0.42);
    hitGain.gain.setValueAtTime(0.55, time);
    hitGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.48);
    hit.connect(hitGain).connect(master);
    hit.start(time);
    safeStop(hit, time + 0.52);

    const snap = ctx.createBufferSource();
    const snapFilter = ctx.createBiquadFilter();
    const snapDistortion = createDistortion(ctx, 40);
    const snapGain = ctx.createGain();
    snap.buffer = createNoiseBuffer(ctx, 0.42);
    snapFilter.type = "bandpass";
    snapFilter.frequency.setValueAtTime(2200, time);
    snapFilter.Q.setValueAtTime(1.8, time);
    snapGain.gain.setValueAtTime(0.34, time);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.38);
    snap.connect(snapFilter).connect(snapDistortion).connect(snapGain).connect(master);
    snap.start(time);
    safeStop(snap, time + 0.42);

    const spark = ctx.createOscillator();
    const sparkGain = ctx.createGain();
    spark.type = "sawtooth";
    spark.frequency.setValueAtTime(920, time + 0.015);
    spark.frequency.exponentialRampToValueAtTime(140, time + 0.24);
    sparkGain.gain.setValueAtTime(0.13, time + 0.015);
    sparkGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);
    spark.connect(sparkGain).connect(master);
    spark.start(time + 0.015);
    safeStop(spark, time + 0.32);
  };

  const startHold = () => {
    const ctx = ensureContext();
    if (!ctx) return;

    release();

    const time = ctx.currentTime;
    playClickIgnition(ctx, time);

    const lowHum = ctx.createOscillator();
    const lowHumGain = ctx.createGain();
    lowHum.type = "sine";
    lowHum.frequency.setValueAtTime(32, time);
    lowHum.frequency.exponentialRampToValueAtTime(74, time + 3);
    lowHumGain.gain.setValueAtTime(0.0001, time);
    lowHumGain.gain.exponentialRampToValueAtTime(0.18, time + 0.18);
    lowHumGain.gain.linearRampToValueAtTime(0.32, time + 3);
    lowHum.connect(lowHumGain).connect(master);
    lowHum.start(time);

    const pressure = ctx.createOscillator();
    const pressureGain = ctx.createGain();
    pressure.type = "square";
    pressure.frequency.setValueAtTime(19, time);
    pressure.frequency.linearRampToValueAtTime(34, time + 3);
    pressureGain.gain.setValueAtTime(0.0001, time);
    pressureGain.gain.exponentialRampToValueAtTime(0.045, time + 0.3);
    pressureGain.gain.linearRampToValueAtTime(0.12, time + 3);
    pressure.connect(pressureGain).connect(master);
    pressure.start(time);

    const pullTone = ctx.createOscillator();
    const pullFilter = ctx.createBiquadFilter();
    const pullDistortion = createDistortion(ctx, 18);
    const pullGain = ctx.createGain();
    pullTone.type = "sawtooth";
    pullTone.frequency.setValueAtTime(76, time);
    pullTone.frequency.exponentialRampToValueAtTime(390, time + 3);
    pullFilter.type = "lowpass";
    pullFilter.frequency.setValueAtTime(180, time);
    pullFilter.frequency.exponentialRampToValueAtTime(2200, time + 3);
    pullFilter.Q.setValueAtTime(11, time);
    pullGain.gain.setValueAtTime(0.0001, time);
    pullGain.gain.exponentialRampToValueAtTime(0.055, time + 0.32);
    pullGain.gain.linearRampToValueAtTime(0.16, time + 3);
    pullTone.connect(pullFilter).connect(pullDistortion).connect(pullGain).connect(master);
    pullTone.start(time);

    const dust = ctx.createBufferSource();
    const dustFilter = ctx.createBiquadFilter();
    const dustDistortion = createDistortion(ctx, 26);
    const dustGain = ctx.createGain();
    dust.buffer = createNoiseBuffer(ctx, 2.4);
    dust.loop = true;
    dustFilter.type = "bandpass";
    dustFilter.frequency.setValueAtTime(420, time);
    dustFilter.frequency.exponentialRampToValueAtTime(3100, time + 3);
    dustFilter.Q.setValueAtTime(0.92, time);
    dustGain.gain.setValueAtTime(0.0001, time);
    dustGain.gain.exponentialRampToValueAtTime(0.035, time + 0.35);
    dustGain.gain.linearRampToValueAtTime(0.13, time + 3);
    dust.connect(dustFilter).connect(dustDistortion).connect(dustGain).connect(master);
    dust.start(time);

    holdNodes = [
      { source: lowHum, gain: lowHumGain },
      { source: pressure, gain: pressureGain },
      { source: pullTone, gain: pullGain },
      { source: dust, gain: dustGain },
    ];
  };

  const explode = () => {
    const ctx = ensureContext();
    if (!ctx) return;

    const time = ctx.currentTime;
    release();

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(58, time);
    sub.frequency.exponentialRampToValueAtTime(18, time + 0.95);
    subGain.gain.setValueAtTime(0.9, time);
    subGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.08);
    sub.connect(subGain).connect(master);
    sub.start(time);
    safeStop(sub, time + 1.15);

    const body = ctx.createOscillator();
    const bodyFilter = ctx.createBiquadFilter();
    const bodyDistortion = createDistortion(ctx, 34);
    const bodyGain = ctx.createGain();
    body.type = "sawtooth";
    body.frequency.setValueAtTime(128, time);
    body.frequency.exponentialRampToValueAtTime(28, time + 0.82);
    bodyFilter.type = "lowpass";
    bodyFilter.frequency.setValueAtTime(900, time);
    bodyFilter.frequency.exponentialRampToValueAtTime(180, time + 0.9);
    bodyFilter.Q.setValueAtTime(5, time);
    bodyGain.gain.setValueAtTime(0.42, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.02);
    body.connect(bodyFilter).connect(bodyDistortion).connect(bodyGain).connect(master);
    body.start(time);
    safeStop(body, time + 1.1);

    const blast = ctx.createBufferSource();
    const blastFilter = ctx.createBiquadFilter();
    const blastDistortion = createDistortion(ctx, 55);
    const blastGain = ctx.createGain();
    blast.buffer = createNoiseBuffer(ctx, 1.15);
    blastFilter.type = "lowpass";
    blastFilter.frequency.setValueAtTime(9600, time);
    blastFilter.frequency.exponentialRampToValueAtTime(520, time + 0.95);
    blastFilter.Q.setValueAtTime(0.36, time);
    blastGain.gain.setValueAtTime(0.62, time);
    blastGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.15);
    blast.connect(blastFilter).connect(blastDistortion).connect(blastGain).connect(master);
    blast.start(time);
    safeStop(blast, time + 1.22);

    // Keep the explosion clean: no trailing shock tail or sparkle/shard sounds after the main blast.
  };

  return { startHold, release, explode };
}

function ProjectCard({ project }) {
  const openLink = project.websiteLink || project.githubLink;
  const words = project.title.split(" ");
  const firstWord = words[0];
  const restTitle = words.slice(1).join(" ");

  const openProject = () => {
    if (!openLink) return;
    window.open(openLink, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      role={openLink ? "link" : undefined}
      tabIndex={openLink ? 0 : undefined}
      onClick={openProject}
      onKeyDown={(event) => {
        if (!openLink) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProject();
        }
      }}
      className="group relative h-[34dvh] min-h-[210px] cursor-pointer overflow-hidden rounded-[1.35rem] border border-white/10 bg-transparent text-white transition duration-700 hover:-translate-y-1.5 hover:border-[color:var(--theme-border)] hover:[box-shadow:var(--theme-button-shadow)] md:h-[36dvh] lg:h-[31vh] xl:h-[33vh]"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {project.img ? (
          <img src={project.img} alt={project.title} className="h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
        ) : (
          <div className="h-full w-full [background:var(--theme-gradient-soft)]" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/48 to-black/12 pointer-events-none" />
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full border border-[color:var(--theme-border)] bg-black/30 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[0.18em] text-[color:var(--theme-accent)] backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[8px] md:text-[9px]">
            {project.category}
          </span>
          <span className="font-mono text-[8px] font-black uppercase tracking-[0.26em] text-white/90 md:text-[10px]">{project.num}</span>
        </div>
        <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
          <h3 className="text-3xl font-black uppercase italic leading-none tracking-[-0.06em] sm:text-4xl md:text-4xl lg:text-4xl xl:text-5xl">
            {firstWord} {restTitle && <span className="text-white/25 [-webkit-text-stroke:1px_rgba(255,255,255,0.72)]">{restTitle}</span>}
          </h3>
        </div>
      </div>
      <a
        href={project.githubLink || "#"}
        target={project.githubLink ? "_blank" : undefined}
        rel={project.githubLink ? "noopener noreferrer" : undefined}
        title={project.githubLink ? `View ${project.title} code` : `${project.title} GitHub link will be added later`}
        aria-label={project.githubLink ? `View ${project.title} code` : `${project.title} GitHub link will be added later`}
        onClick={(event) => {
          event.stopPropagation();
          if (!project.githubLink) event.preventDefault();
        }}
        className="group/code absolute bottom-3 right-3 z-30 flex h-11 w-11 items-center justify-center gap-0 overflow-hidden rounded-full border border-white/25 bg-black/80 px-0 text-white shadow-[0_0_22px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition-all duration-500 hover:w-[8.5rem] hover:gap-2 hover:-translate-y-1 hover:border-[color:var(--theme-accent)] hover:bg-[color:var(--theme-accent)] hover:px-4 hover:text-black hover:shadow-[0_0_34px_color-mix(in_srgb,var(--theme-accent)_52%,transparent)] md:bottom-4 md:right-4 md:h-12 md:w-12 md:hover:w-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="block h-5 w-5 shrink-0 fill-current md:h-6 md:w-6" viewBox="0 0 24 24">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18.92-.26 1.9-.38 2.88-.39.98 0 1.96.13 2.88.39 2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.67.41.35.78 1.05.78 2.12v3.12c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
        <span className="block max-w-0 overflow-hidden whitespace-nowrap font-mono text-[9px] font-black uppercase tracking-[0.22em] opacity-0 transition-all duration-500 group-hover/code:max-w-24 group-hover/code:opacity-100 md:text-[10px]">
          View Code
        </span>
      </a>
      <div className="absolute bottom-0 left-0 z-40 h-[4px] w-0 [background:var(--theme-gradient)] transition-all duration-1000 group-hover:w-full" />
    </article>
  );
}
