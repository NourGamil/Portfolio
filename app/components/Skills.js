"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SKILLS = {
  frontend: [
    { name: "Next.js", level: 90, color: "#0070f3" },
    { name: "React.js", level: 80, color: "#61dafb" },
    { name: "GSAP", level: 80, color: "#88ce02" },
    { name: "Three.js", level: 70, color: "#ffffff" },
    { name: "Tailwind", level: 90, color: "#38bdf8" },
    { name: "Bootstrap", level: 80, color: "#7952b3" },
  ],
  backend: [
    { name: "MySQL", level: 70, color: "#7dd3fc" },
    { name: "PHP", level: 60, color: "#777bb4" },
    { name: "Laravel", level: 60, color: "#ff2d20" },
  ],
};

const TOOLS = ["Photoshop", "Blender", "Figma"];

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".skill-item").forEach((group) => {
        const bar = group.querySelector(".skill-bar-fill");
        const numberSpan = group.querySelector(".skill-number");
        if (!bar || !numberSpan) return;

        const targetLevel = Number(bar.getAttribute("data-level")) || 0;

        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: `${targetLevel}%`,
            duration: 2.2,
            delay: 0.25,
            ease: "power4.out",
            scrollTrigger: {
              trigger: group,
              start: "top 86%",
              end: "bottom 14%",
              toggleActions: "play reverse play reverse",
            },
            onUpdate() {
              numberSpan.innerText = `${Math.floor(parseFloat(bar.style.width) || 0)}%`;
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderSkillItem = (skill) => (
    <div key={skill.name} className="skill-item relative">
      <div className="mb-1.5 flex justify-between font-mono text-[9px] font-black uppercase tracking-[0.2em] text-white max-md:mb-1.5 max-md:text-[8.5px] max-md:tracking-[0.16em] sm:text-[10px] md:mb-2 md:text-xs">
        <span>{skill.name}</span>
        <span className="skill-number text-[color:var(--theme-accent)]">0%</span>
      </div>
      <div className="h-[6px] w-full overflow-hidden rounded-full bg-white/10 shadow-[inset_0_1px_8px_rgba(0,0,0,0.45)] max-md:h-[5px] md:h-[8px]">
        <div
          className="skill-bar-fill relative h-full rounded-full"
          data-level={skill.level}
          style={{
            background: `linear-gradient(90deg, ${skill.color}, #ffffff)`,
            boxShadow: `0 0 18px ${skill.color}, 0 0 34px color-mix(in srgb, ${skill.color} 44%, transparent)`,
            width: "0%",
          }}
        />
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      data-snap-section
      data-nav-section="skills"
      className="content-section relative isolate flex h-[100dvh] w-full flex-col justify-center overflow-hidden px-[8vw] py-[clamp(4.75rem,8vh,6.5rem)] text-white max-md:justify-center max-md:px-4 max-md:pb-5 max-md:pt-[5.15rem] max-sm:pt-[5rem]"
    >
      <div className="grid grid-cols-1 items-start gap-3 max-md:gap-3 sm:gap-4 md:gap-5 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className="fadeRightAll relative left-[-100px] rounded-[1.5rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg)] p-4 opacity-0 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md max-md:rounded-[1.2rem] max-md:p-4 sm:rounded-[2rem] md:p-7 lg:p-8">
          <h3 className="mb-3 text-lg font-black uppercase tracking-[-0.045em] text-white max-md:mb-3 max-md:text-lg sm:text-xl md:mb-7 md:text-3xl">
            Front-End <span className="bg-clip-text text-base text-transparent [background-image:var(--theme-gradient)] md:text-xl">Strong Points</span>
          </h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 max-md:gap-x-3 max-md:gap-y-3 md:gap-y-5 lg:grid-cols-1 lg:gap-y-7">
            {SKILLS.frontend.map(renderSkillItem)}
          </div>
        </div>

        <div className="flex flex-col gap-3 max-md:gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          <div className="fadeLeftAll relative left-[100px] rounded-[1.5rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg)] p-4 opacity-0 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md max-md:rounded-[1.2rem] max-md:p-4 sm:rounded-[2rem] md:p-7 lg:p-8">
            <h3 className="mb-3 text-lg font-black uppercase tracking-[-0.045em] text-white max-md:mb-3 max-md:text-lg sm:text-xl md:mb-7 md:text-3xl">
              Back-End
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 max-md:gap-x-3 max-md:gap-y-3 md:gap-y-5 lg:grid-cols-1 lg:gap-y-7">
              {SKILLS.backend.map(renderSkillItem)}
            </div>
          </div>

          <div className="fadeUpAll relative top-[100px] block rounded-[1.5rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] p-4 opacity-0 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md max-md:rounded-[1.2rem] max-md:p-4 sm:rounded-[2rem] md:p-7 lg:p-8">
            <h3 className="mb-4 bg-clip-text text-base font-black uppercase tracking-[0.05em] text-transparent [background-image:var(--theme-gradient)] max-md:mb-3 max-md:text-base md:mb-6 md:text-2xl">
              Creative Tools
            </h3>
            <div className="flex flex-wrap gap-2 max-md:gap-2 md:gap-4">
              {TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-[color:var(--theme-border)] bg-white/[0.045] px-3 py-2 font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white transition duration-300 hover:[background:var(--theme-gradient)] hover:text-[#071014] max-md:px-3 max-md:py-1.5 max-md:text-[8px] max-md:tracking-[0.16em] md:px-6 md:text-xs"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
