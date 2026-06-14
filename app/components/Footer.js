"use client";

import { profile, socials } from "../data/portfolioData";

export default function Footer() {
  return (
    <section
      id="contact"
      data-snap-section
      data-nav-section="contact"
      className="content-section relative isolate flex h-[100dvh] w-full flex-col justify-between overflow-hidden px-[8vw] pb-5 pt-[clamp(4.75rem,7vh,6rem)] text-white max-md:px-4 max-md:pb-3 max-md:pt-[5.05rem] max-sm:pt-[4.9rem]"
    >
      <div className="relative z-10 my-auto grid w-full grid-cols-1 items-center gap-5 max-md:my-auto max-md:items-center max-md:gap-3 sm:gap-6 lg:grid-cols-2 lg:gap-14 xl:gap-20">
        <div className="min-w-0">
          <h2 className="fadeRightAll relative left-[-100px] text-[clamp(3.2rem,17vw,5.7rem)] font-black uppercase leading-[0.88] tracking-[-0.08em] opacity-0 max-md:text-[2.5rem] md:text-8xl">
            Let's <span className="bg-clip-text text-transparent [background-image:var(--theme-gradient)]">talk.</span>
          </h2>
          <p className="fadeRightAll relative left-[-100px] mt-3 max-w-xl font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white opacity-0 max-md:mt-2 max-md:text-[7.5px] max-md:tracking-[0.16em] sm:text-[10px] md:mt-6 md:text-sm">
            Available for new masterpieces. Based in Egypt.
          </p>

          <form
            action={`mailto:${profile.email}?subject=Masterpiece Inquiry`}
            method="post"
            encType="text/plain"
            className="fadeRightAll relative left-[-100px] mt-5 max-w-md opacity-0 max-md:mt-3 sm:block md:mt-10"
          >
            <div className="relative rounded-[1.6rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg)] p-2 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md max-md:rounded-[1.15rem] max-md:p-1.5">
              <input
                type="text"
                placeholder="Get In Touch"
                className="w-full rounded-[1.2rem] border border-white/10 bg-white/[0.045] px-4 py-4 pr-24 font-mono text-xs font-bold text-white outline-none placeholder:text-white/45 focus:border-[color:var(--theme-accent)] max-md:rounded-[0.95rem] max-md:py-3 max-md:pr-20 max-md:text-[10px]"
              />
              <div className="magnetic-wrap absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1">
                <button
                  type="submit"
                  className="cv-btn rounded-[1rem] [background:var(--theme-gradient)] px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#071014] [box-shadow:var(--theme-button-shadow)] transition duration-300 max-md:rounded-[0.85rem] max-md:px-3 max-md:py-2.5 max-md:text-[8px]"
                >
                  Send →
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-3 max-md:grid-cols-2 max-md:gap-2 sm:grid-cols-2 sm:gap-5 md:gap-7">
          <div className="fadeLeftAll relative left-[100px] rounded-[1.45rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg)] p-4 opacity-0 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md max-md:rounded-[1rem] max-md:p-2.5 sm:rounded-[2rem] md:p-7">
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.38em] text-[color:var(--theme-accent)] max-md:mb-2 max-md:text-[8px] max-md:tracking-[0.24em]">Direct</h4>
            <p className="break-all font-mono text-xs font-bold text-white max-md:text-[9px] md:text-sm">{profile.email}</p>
            <p className="mt-3 font-mono text-xs font-bold text-white max-md:mt-1.5 max-md:text-[9px] md:text-sm">{profile.phone}</p>
          </div>

          <div className="fadeLeftAll relative left-[100px] block rounded-[1.45rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg)] p-4 opacity-0 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md max-md:rounded-[1rem] max-md:p-2.5 md:rounded-[2rem] md:p-7">
            <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.38em] text-[color:var(--theme-accent)] max-md:mb-2 max-md:text-[8px] max-md:tracking-[0.24em]">Location</h4>
            <p className="font-mono text-xs font-bold text-white max-md:text-[9px] md:text-sm">{profile.location}</p>
            <p className="mt-3 font-mono text-xs font-bold text-white max-md:mt-1.5 max-md:text-[9px] md:text-sm">GMT+3 / Remote</p>
          </div>

          <div className="fadeUpAll relative top-[100px] rounded-[1.45rem] border border-[color:var(--theme-border)] [background:var(--theme-panel-bg-strong)] p-4 opacity-0 [box-shadow:var(--theme-panel-shadow)] backdrop-blur-md max-md:col-span-2 max-md:rounded-[1rem] max-md:p-2.5 sm:col-span-2 sm:rounded-[2rem] md:p-7">
            <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.38em] text-[color:var(--theme-accent)] max-md:mb-2 max-md:text-[8px] max-md:tracking-[0.24em]">Digital Footprint</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 max-md:gap-x-2 sm:grid-cols-2 sm:gap-x-5">
              {socials.map((social) => (
                <SocialLink key={social.label} href={social.href} label={social.label} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fadeUpAll relative top-[100px] z-10 flex w-full flex-col items-end justify-between gap-2 border-t border-white/10 pt-4 font-mono text-[7px] font-black uppercase tracking-[0.22em] text-white opacity-0 max-md:pt-2 max-md:text-[6.5px] max-md:tracking-[0.16em] sm:flex-row sm:items-center md:text-[10px]">
        <p className="lg:pl-[6rem]">© 2026 NOUR GAMIL. ALL RIGHTS RESERVED.</p>
        <p className="bg-clip-text text-transparent [background-image:var(--theme-gradient)]">Designed to be a masterpiece</p>
      </div>
    </section>
  );
}

function SocialLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex cursor-pointer items-center justify-between border-b border-white/10 py-2 transition duration-300 hover:border-[color:var(--theme-accent)] max-md:py-1.5 md:py-3"
    >
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/82 transition duration-300 group-hover:text-white max-md:text-[8px] max-md:tracking-[0.14em] md:text-sm">
        {label}
      </span>
      <span className="text-[color:var(--theme-accent)] opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100">↗</span>
    </a>
  );
}
