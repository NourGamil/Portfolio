"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sectionThemes } from "../data/sectionThemes";

const PALETTE = {
  white: "#ffffff",
  accent: "#fdc700",
};

const BACKGROUND_STAR_PALETTE = [
  "#7dd3fc",
  "#fdc700",
  "#c084fc",
  "#fb7185",
  "#86efac",
  "#ffffff",
  "#0ae448",
  "#ff2d20",
  "#0070f3",
];

const BACKGROUND_ORB_PALETTE = [
  "#7dd3fc",
  "#fdc700",
  "#c084fc",
  "#fb7185",
  "#86efac",
  "#ffffff",
];

const SECTION_TITLES = [
  { id: "home", text: "INTRO", side: -1, scale: 0.0084 },
  { id: "about", text: "ABOUT", side: 1, scale: 0.0091 },
  { id: "skills", text: "SKILLS", side: -1, scale: 0.0091 },
  { id: "projects", text: "PROJECTS", side: 1, scale: 0.0082 },
  { id: "contact", text: "CONTACT", side: -1, scale: 0.0087 },
].map((section) => {
  const theme = sectionThemes.find((item) => item.id === section.id) || sectionThemes[0];
  return {
    ...section,
    colorA: theme.colorA,
    colorB: theme.colorB,
    colorC: theme.colorC,
  };
});

const TITLE_DOT_COUNT = 2800;
const FIELD_DOT_COUNT = 13000;
const BACKGROUND_ORB_COUNT = 220;
const HERO_MAGIC_DOT_COUNT = 2200;
const DESKTOP_BREAKPOINT = 1024;

function random(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}
function createDotTexture({ glow = false } = {}) {
  if (typeof document === "undefined") return null;

  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  const center = size / 2;
  const gradient = context.createRadialGradient(center, center, 0, center, center, center);

  if (glow) {
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.12, "rgba(255,255,255,1)");
    gradient.addColorStop(0.32, "rgba(255,255,255,0.82)");
    gradient.addColorStop(0.62, "rgba(255,255,255,0.24)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
  } else {
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.42, "rgba(255,255,255,1)");
    gradient.addColorStop(0.68, "rgba(255,255,255,0.72)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
  }

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}


function createBlackHoleLayerTexture(type = "disk") {
  if (typeof document === "undefined") return null;

  const size = 768;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  const center = size / 2;

  context.clearRect(0, 0, size, size);
  context.translate(center, center);

  if (type === "disk") {
    context.globalCompositeOperation = "lighter";

    for (let i = 0; i < 520; i += 1) {
      const t = i / 520;
      const angle = t * Math.PI * 2;
      const noisyAngle = angle + Math.sin(angle * 7.0) * 0.018 + Math.sin(angle * 17.0) * 0.008;
      const radius = 132 + Math.pow(random(i + 6100), 0.78) * 190;
      const arc = 0.008 + random(i + 6200) * 0.028;
      const doppler = 0.36 + Math.pow((Math.cos(angle - 0.65) + 1) / 2, 1.9) * 0.96;
      const innerHeat = 1 - Math.min(Math.max((radius - 132) / 190, 0), 1);
      const alpha = (0.12 + innerHeat * 0.48 + random(i + 6300) * 0.12) * doppler;
      const hue = 24 + innerHeat * 24 + random(i + 6400) * 8;
      const light = 52 + innerHeat * 34;

      context.beginPath();
      context.lineCap = "round";
      context.lineWidth = 2.4 + innerHeat * 8 + random(i + 6500) * 2.4;
      context.strokeStyle = `hsla(${hue}, 100%, ${light}%, ${Math.min(alpha, 0.9)})`;
      context.arc(0, 0, radius, noisyAngle, noisyAngle + arc);
      context.stroke();
    }

    const inner = context.createRadialGradient(0, 0, 80, 0, 0, 250);
    inner.addColorStop(0, "rgba(255,255,255,0.05)");
    inner.addColorStop(0.34, "rgba(255,214,102,0.35)");
    inner.addColorStop(0.55, "rgba(255,115,27,0.22)");
    inner.addColorStop(1, "rgba(255,45,32,0)");
    context.fillStyle = inner;
    context.beginPath();
    context.arc(0, 0, 265, 0, Math.PI * 2);
    context.fill();
  }

  if (type === "halo") {
    context.globalCompositeOperation = "lighter";

    // Soft lensing haze only — no bright closed white ring.
    const halo = context.createRadialGradient(0, 0, 78, 0, 0, 310);
    halo.addColorStop(0, "rgba(255,255,255,0)");
    halo.addColorStop(0.34, "rgba(125,211,252,0.12)");
    halo.addColorStop(0.54, "rgba(253,199,0,0.08)");
    halo.addColorStop(0.78, "rgba(125,211,252,0.035)");
    halo.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = halo;
    context.beginPath();
    context.arc(0, 0, 310, 0, Math.PI * 2);
    context.fill();

    for (let i = 0; i < 120; i += 1) {
      const angle = random(i + 7100) * Math.PI * 2;
      const radius = 122 + random(i + 7200) * 112;
      const length = 0.01 + random(i + 7300) * 0.045;
      const alpha = 0.035 + random(i + 7400) * 0.075;

      context.beginPath();
      context.lineCap = "round";
      context.lineWidth = 1.2 + random(i + 7500) * 2.2;
      context.strokeStyle = `rgba(125,211,252,${alpha})`;
      context.arc(0, 0, radius, angle, angle + length);
      context.stroke();
    }
  }

  if (type === "shadow") {
    const shadow = context.createRadialGradient(0, 0, 0, 0, 0, 220);
    shadow.addColorStop(0, "rgba(0,0,0,1)");
    shadow.addColorStop(0.55, "rgba(0,0,0,1)");
    shadow.addColorStop(0.72, "rgba(0,0,0,0.78)");
    shadow.addColorStop(0.86, "rgba(0,0,0,0.22)");
    shadow.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = shadow;
    context.beginPath();
    context.arc(0, 0, 235, 0, Math.PI * 2);
    context.fill();
  }

  context.setTransform(1, 0, 0, 1, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function writeSectionThemeColors({ colors, count, sectionIndex, seedOffset, minBrightness, maxBrightness }) {
  const section = SECTION_TITLES[sectionIndex] || SECTION_TITLES[0];
  const accent = new THREE.Color(section.colorA);
  const white = new THREE.Color(section.colorB || "#ffffff");
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const index = i * 3;
    const whiteMix = 0.22 + random(i + seedOffset) * 0.78;
    const brightness = minBrightness + random(i + seedOffset + 1000) * (maxBrightness - minBrightness);

    color.copy(accent).lerp(white, whiteMix);

    colors[index] = color.r * brightness;
    colors[index + 1] = color.g * brightness;
    colors[index + 2] = color.b * brightness;
  }
}

function writeOriginalBackgroundColors({ colors, count, palette, seedOffset, minBrightness, maxBrightness, whiteBlend = 0.05 }) {
  const color = new THREE.Color();
  const white = new THREE.Color("#ffffff");

  for (let i = 0; i < count; i += 1) {
    const index = i * 3;
    const paletteIndex = Math.floor(random(i + seedOffset) * palette.length);
    const brightness = minBrightness + random(i + seedOffset + 1000) * (maxBrightness - minBrightness);
    const softWhiteMix = whiteBlend * random(i + seedOffset + 2000);

    color.set(palette[paletteIndex]).lerp(white, softWhiteMix);

    colors[index] = color.r * brightness;
    colors[index + 1] = color.g * brightness;
    colors[index + 2] = color.b * brightness;
  }
}

function createTextPointSet({ text, scale }) {
  if (typeof document === "undefined") {
    return {
      positions: new Float32Array(TITLE_DOT_COUNT * 3),
      bounds: { width: 1, height: 1 },
    };
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const width = 780;
  const height = text.includes("\n") ? 330 : 240;
  const lines = text.split("\n");
  const fontSize = lines.length > 1 ? 70 : 80;
  const lineHeight = fontSize * 1.02;

  canvas.width = width;
  canvas.height = height;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `650 ${fontSize}px Inter, Arial, sans-serif`;

  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    context.fillText(line, width / 2, startY + index * lineHeight);
  });

  const image = context.getImageData(0, 0, width, height).data;
  const sampled = [];
  const gap = 3;
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const alpha = image[(y * width + x) * 4 + 3];
      if (alpha > 120) {
        sampled.push([x, y, alpha / 255]);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (!sampled.length) {
    sampled.push([width / 2, height / 2, 1]);
    minX = width / 2;
    maxX = width / 2;
    minY = height / 2;
    maxY = height / 2;
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const bounds = {
    width: Math.max(0.5, (maxX - minX) * scale),
    height: Math.max(0.3, (maxY - minY) * scale),
  };

  const positions = new Float32Array(TITLE_DOT_COUNT * 3);

  for (let i = 0; i < TITLE_DOT_COUNT; i += 1) {
    const source = sampled[Math.floor(random(i + text.length * 23) * sampled.length)];
    const [x, y, alpha] = source;
    const jitterX = (random(i * 3 + 1) - 0.5) * 0.006;
    const jitterY = (random(i * 5 + 2) - 0.5) * 0.006;
    const jitterZ = (random(i * 7 + 3) - 0.5) * 0.08 * alpha;

    positions[i * 3] = (x - centerX) * scale + jitterX;
    positions[i * 3 + 1] = -(y - centerY) * scale + jitterY;
    positions[i * 3 + 2] = jitterZ;
  }

  return { positions, bounds };
}

function createScatterPoints() {
  const positions = new Float32Array(TITLE_DOT_COUNT * 3);

  for (let i = 0; i < TITLE_DOT_COUNT; i += 1) {
    positions[i * 3] = (random(i + 11) - 0.5) * 8.8;
    positions[i * 3 + 1] = (random(i + 23) - 0.5) * 5.2;
    positions[i * 3 + 2] = (random(i + 37) - 0.5) * 2.8;
  }

  return positions;
}

function createHeroMagicShape() {
  const positions = new Float32Array(HERO_MAGIC_DOT_COUNT * 3);
  const radii = new Float32Array(HERO_MAGIC_DOT_COUNT);
  const angles = new Float32Array(HERO_MAGIC_DOT_COUNT);
  const layers = new Float32Array(HERO_MAGIC_DOT_COUNT);
  const sparks = new Float32Array(HERO_MAGIC_DOT_COUNT);

  const setPoint = (i, x, y, z, radius, angle, layer, spark = 0) => {
    const index = i * 3;
    positions[index] = x;
    positions[index + 1] = y;
    positions[index + 2] = z;
    radii[i] = radius;
    angles[i] = angle;
    layers[i] = layer;
    sparks[i] = spark;
  };

  for (let i = 0; i < HERO_MAGIC_DOT_COUNT; i += 1) {
    const selector = random(i + 3300);
    const angle = random(i + 3400) * Math.PI * 2;

    if (selector < 0.66) {
      // Thin accretion particles: flat, bright, and stretched around the horizon.
      const t = Math.pow(random(i + 3600), 0.58);
      const radius = 0.62 + t * 2.08;
      const compression = 0.17 + t * 0.035;
      const turbulence = (random(i + 3650) - 0.5) * (0.085 - t * 0.035);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * compression + turbulence;
      const z = Math.sin(angle) * radius * 0.075 + (random(i + 3700) - 0.5) * 0.08;
      setPoint(i, x, y, z, radius, angle, 0, random(i + 3750));
    } else if (selector < 0.84) {
      // Gravitational lens arc: brighter upper/lower light bending near the shadow.
      const radius = 0.58 + random(i + 3900) * 0.52;
      const bend = Math.sin(angle * 2.0) * 0.035;
      const x = Math.cos(angle + bend) * radius;
      const y = Math.sin(angle + bend) * radius * 0.48 + (random(i + 4000) - 0.5) * 0.018;
      const z = Math.sin(angle) * 0.06 + (random(i + 4100) - 0.5) * 0.05;
      setPoint(i, x, y, z, radius, angle, 1, random(i + 4150));
    } else if (selector < 0.96) {
      // Infalling streams: sparse matter pulled into the disk over time.
      const t = random(i + 4300);
      const radius = 0.85 + t * 2.65;
      const spiralAngle = angle + t * Math.PI * 4.6;
      const x = Math.cos(spiralAngle) * radius;
      const y = Math.sin(spiralAngle) * radius * 0.28 + (random(i + 4400) - 0.5) * 0.16;
      const z = (random(i + 4500) - 0.5) * 0.82 + Math.sin(spiralAngle) * 0.12;
      setPoint(i, x, y, z, radius, spiralAngle, 2, random(i + 4550));
    } else {
      // Few distant stars being weakly disturbed by gravity.
      const radius = 2.25 + random(i + 4600) * 1.45;
      const x = Math.cos(angle) * radius + (random(i + 4700) - 0.5) * 0.45;
      const y = Math.sin(angle) * radius * 0.66 + (random(i + 4800) - 0.5) * 0.38;
      const z = (random(i + 4900) - 0.5) * 1.35;
      setPoint(i, x, y, z, radius, angle, 3, random(i + 4950));
    }
  }

  return { positions, radii, angles, layers, sparks };
}
function createHeroMagicScatter() {
  const positions = new Float32Array(HERO_MAGIC_DOT_COUNT * 3);

  for (let i = 0; i < HERO_MAGIC_DOT_COUNT; i += 1) {
    positions[i * 3] = random(i + 1900) - 0.5;
    positions[i * 3 + 1] = random(i + 2100) - 0.5;
    positions[i * 3 + 2] = random(i + 2300) - 0.5;
  }

  return positions;
}

function getTitleAnchor({ bounds, viewport, size }) {
  const topPixels = 30;
  const topOffset = (topPixels / Math.max(1, size.height)) * viewport.height;

  return {
    x: 0,
    y: viewport.height / 2 - topOffset - bounds.height / 2,
  };
}

function getBlackHoleAnchor() {
  return {
    x: 0,
    y: 0,
    z: 0,
  };
}

function SectionTracker({ inputRef }) {
  useEffect(() => {
    let frame = 0;
    let settleTimer = 0;
    let lastIndex = inputRef.current.sectionIndex || 0;
    let pendingIndex = lastIndex;
    let lastScroll = window.scrollY || 0;

    const findClosestSectionIndex = () => {
      const visibleSections = Array.from(document.querySelectorAll("[data-snap-section]")).filter((section) => {
        const rect = section.getBoundingClientRect();
        const style = window.getComputedStyle(section);
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 1 && rect.height > 1;
      });
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = lastIndex;
      let closestDistance = Infinity;

      visibleSections.forEach((section) => {
        const sectionKey = section.dataset.navSection || section.dataset.themeSection || section.id;
        const titleIndex = SECTION_TITLES.findIndex((item) => item.id === sectionKey);
        if (titleIndex < 0) return;

        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = titleIndex;
        }
      });

      return closestIndex;
    };

    const setTitleAbsorbingClass = (active) => {
      document.body.classList.toggle("title-absorbing", active);
    };

    const commitTitleIndex = (nextIndex) => {
      pendingIndex = nextIndex;
      inputRef.current.pendingSectionIndex = nextIndex;
      inputRef.current.isTitleWaitingForScrollStop = 0;
      setTitleAbsorbingClass(false);

      if (nextIndex !== lastIndex) {
        lastIndex = nextIndex;
        inputRef.current.sectionIndex = nextIndex;
        inputRef.current.scatterPower = 1;
        inputRef.current.colorPulse = 1;
      }

      if (nextIndex !== 0 && inputRef.current.singularityTarget > 0) {
        inputRef.current.singularityTarget = 0;
        inputRef.current.singularityHoldAge = 0;
      }
    };

    const update = ({ commit = false } = {}) => {
      frame = 0;
      const closestIndex = findClosestSectionIndex();
      pendingIndex = closestIndex;
      inputRef.current.pendingSectionIndex = closestIndex;

      const currentScroll = window.scrollY || 0;
      inputRef.current.scrollVelocity = THREE.MathUtils.clamp((currentScroll - lastScroll) * 0.014, -2.2, 2.2);
      lastScroll = currentScroll;

      if (commit) {
        commitTitleIndex(closestIndex);
        return;
      }

      const titleIsAlreadyCorrect = closestIndex === lastIndex && !inputRef.current.isTitleWaitingForScrollStop;
      if (titleIsAlreadyCorrect) {
        inputRef.current.isTitleWaitingForScrollStop = 0;
        setTitleAbsorbingClass(false);
        return;
      }

      inputRef.current.isTitleWaitingForScrollStop = 1;
      setTitleAbsorbingClass(true);
      inputRef.current.scatterPower = Math.max(inputRef.current.scatterPower || 0, 1);

      if (closestIndex !== 0 && inputRef.current.singularityTarget > 0) {
        inputRef.current.singularityTarget = 0;
        inputRef.current.singularityHoldAge = 0;
      }
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => update({ commit: false }));
      }

      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
        update({ commit: true });
      }, 260);
    };

    const handleSingularityHold = (event) => {
      const active = event.detail?.active ? 1 : 0;
      inputRef.current.singularityTarget = active;
      if (!active) inputRef.current.singularityHoldAge = 0;
    };

    const handleSingularityExplode = () => {
      inputRef.current.singularityTarget = 0;
      inputRef.current.singularityHoldAge = 0;
      inputRef.current.explosion = 1;
    };

    update({ commit: true });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("portfolio-singularity-hold", handleSingularityHold);
    window.addEventListener("portfolio-singularity-explode", handleSingularityExplode);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (settleTimer) window.clearTimeout(settleTimer);
      document.body.classList.remove("title-absorbing");
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("portfolio-singularity-hold", handleSingularityHold);
      window.removeEventListener("portfolio-singularity-explode", handleSingularityExplode);
    };
  }, [inputRef]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      inputRef.current.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      inputRef.current.targetMouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const handlePointerLeave = () => {
      inputRef.current.targetMouse.x = 0;
      inputRef.current.targetMouse.y = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [inputRef]);

  useFrame((state, delta) => {
    const dt = Math.min(delta || 0.016, 0.033);
    inputRef.current.mouse.x = THREE.MathUtils.lerp(inputRef.current.mouse.x, inputRef.current.targetMouse.x, 0.055);
    inputRef.current.mouse.y = THREE.MathUtils.lerp(inputRef.current.mouse.y, inputRef.current.targetMouse.y, 0.055);
    const scatterTarget = inputRef.current.isTitleWaitingForScrollStop ? 1 : 0;
    inputRef.current.scatterPower = THREE.MathUtils.lerp(
      inputRef.current.scatterPower,
      scatterTarget,
      inputRef.current.isTitleWaitingForScrollStop ? 0.18 : 0.085
    );
    inputRef.current.scrollVelocity = THREE.MathUtils.lerp(inputRef.current.scrollVelocity, 0, 0.035);
    inputRef.current.colorPulse = THREE.MathUtils.lerp(inputRef.current.colorPulse, 0, 0.06);

    if (inputRef.current.singularityTarget > 0) {
      inputRef.current.singularityHoldAge = Math.min(1, (inputRef.current.singularityHoldAge || 0) + dt * 0.34);
    } else {
      inputRef.current.singularityHoldAge = 0;
    }

    inputRef.current.explosion = THREE.MathUtils.lerp(inputRef.current.explosion || 0, 0, 0.055);
    if (inputRef.current.explosion < 0.001) inputRef.current.explosion = 0;

    inputRef.current.singularity = THREE.MathUtils.lerp(
      inputRef.current.singularity,
      inputRef.current.singularityTarget,
      inputRef.current.singularityTarget > 0 ? 0.034 : 0.16
    );
  });

  return null;
}

function StarField({ inputRef }) {
  const pointsRef = useRef(null);
  const starTexture = useMemo(() => createDotTexture({ glow: true }), []);
  const coreTexture = useMemo(() => createDotTexture(), []);
  const basePositions = useMemo(() => {
    const positions = new Float32Array(FIELD_DOT_COUNT * 3);

    for (let i = 0; i < FIELD_DOT_COUNT; i += 1) {
      positions[i * 3] = (random(i + 100) - 0.5) * 25;
      positions[i * 3 + 1] = (random(i + 200) - 0.5) * 15.8;
      positions[i * 3 + 2] = -1.6 - random(i + 300) * 8.2;
    }

    return positions;
  }, []);
  const geometry = useMemo(() => {
    const positions = new Float32Array(basePositions);
    const colors = new Float32Array(FIELD_DOT_COUNT * 3);

    for (let i = 0; i < FIELD_DOT_COUNT; i += 1) {
      const index = i * 3;
      const brightness = 1.2 + random(i + 400) * 1.15;
      colors[index] = brightness;
      colors[index + 1] = brightness;
      colors[index + 2] = brightness;
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return buffer;
  }, [basePositions]);

  useFrame((state) => {
    const group = pointsRef.current;
    const geometryRef = group?.children?.[0]?.geometry;
    if (!group || !geometryRef) return;

    const time = state.clock.elapsedTime;
    const input = inputRef.current;
    const singularity = input.singularity || 0;
    const explosion = input.explosion || 0;
    const positions = geometryRef.attributes.position.array;
    const { viewport, size } = state;
    const anchor = getBlackHoleAnchor({ viewport, size });

    for (let i = 0; i < FIELD_DOT_COUNT; i += 1) {
      const index = i * 3;
      const baseX = basePositions[index];
      const baseY = basePositions[index + 1];
      const baseZ = basePositions[index + 2];
      const phase = random(i + 5100) * Math.PI * 2;
      const orbitPhase = THREE.MathUtils.smoothstep(singularity, 0.04, 0.52);
      const absorbPhase = THREE.MathUtils.smoothstep(singularity, 0.52, 0.98);
      const spiral = time * (1.35 + orbitPhase * 3.25 + random(i + 5200) * 1.4) + phase;
      const orbitRadius = (1 - absorbPhase) * (1.25 + random(i + 5300) * 5.9) + absorbPhase * 0.035;
      const orbitX = anchor.x + Math.cos(spiral) * orbitRadius * 0.6;
      const orbitY = anchor.y + Math.sin(spiral * 0.84) * orbitRadius * 0.34;
      const orbitZ = anchor.z + Math.sin(spiral * 0.55) * orbitRadius * 0.55;
      const targetX = baseX * (1 - orbitPhase) + orbitX * orbitPhase;
      const targetY = baseY * (1 - orbitPhase) + orbitY * orbitPhase;
      const targetZ = baseZ * (1 - orbitPhase) + orbitZ * orbitPhase;
      const dirX = baseX - anchor.x;
      const dirY = baseY - anchor.y;
      const dirZ = baseZ - anchor.z;
      const dirLength = Math.max(0.001, Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ));
      const blastStrength = explosion * (4.2 + random(i + 8600) * 5.6);
      const blastX = baseX + (dirX / dirLength) * blastStrength + Math.sin(time * 2.4 + phase) * explosion * 0.55;
      const blastY = baseY + (dirY / dirLength) * blastStrength + Math.cos(time * 2.0 + phase) * explosion * 0.45;
      const blastZ = baseZ + (dirZ / dirLength) * blastStrength + Math.sin(time * 1.7 + phase) * explosion * 0.85;
      const finalX = targetX * (1 - explosion) + blastX * explosion;
      const finalY = targetY * (1 - explosion) + blastY * explosion;
      const finalZ = targetZ * (1 - explosion) + blastZ * explosion;
      const speed = explosion > 0.02 ? 0.18 : singularity > 0.02 ? 0.026 + orbitPhase * 0.028 + absorbPhase * 0.068 : 0.045;

      positions[index] += (finalX - positions[index]) * speed;
      positions[index + 1] += (finalY - positions[index + 1]) * speed;
      positions[index + 2] += (finalZ - positions[index + 2]) * speed;
    }

    geometryRef.attributes.position.needsUpdate = true;
    group.rotation.z = Math.sin(time * 0.018) * 0.018 * (1 - singularity);
  });

  return (
    <group ref={pointsRef}>
      <points geometry={geometry} frustumCulled={false}>
        <pointsMaterial
          map={starTexture}
          alphaMap={starTexture}
          vertexColors
          transparent
          opacity={0.72}
          size={0.19}
          sizeAttenuation
          alphaTest={0.004}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points geometry={geometry} frustumCulled={false}>
        <pointsMaterial
          map={coreTexture}
          alphaMap={coreTexture}
          vertexColors
          transparent
          opacity={1}
          size={0.052}
          sizeAttenuation
          alphaTest={0.025}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function MovingGlowOrbs({ inputRef }) {
  const pointsRef = useRef(null);
  const orbTexture = useMemo(() => createDotTexture({ glow: true }), []);
  const bases = useMemo(() => {
    const values = new Float32Array(BACKGROUND_ORB_COUNT * 6);

    for (let i = 0; i < BACKGROUND_ORB_COUNT; i += 1) {
      values[i * 6] = (random(i + 700) - 0.5) * 22;
      values[i * 6 + 1] = (random(i + 900) - 0.5) * 13.4;
      values[i * 6 + 2] = -2.2 - random(i + 1100) * 6.4;
      values[i * 6 + 3] = 0.08 + random(i + 1300) * 0.34;
      values[i * 6 + 4] = random(i + 1500) * Math.PI * 2;
      values[i * 6 + 5] = 0.35 + random(i + 1700) * 0.95;
    }

    return values;
  }, []);
  const geometry = useMemo(() => {
    const positions = new Float32Array(BACKGROUND_ORB_COUNT * 3);
    const colors = new Float32Array(BACKGROUND_ORB_COUNT * 3);

    for (let i = 0; i < BACKGROUND_ORB_COUNT; i += 1) {
      positions[i * 3] = bases[i * 6];
      positions[i * 3 + 1] = bases[i * 6 + 1];
      positions[i * 3 + 2] = bases[i * 6 + 2];
    }

    writeOriginalBackgroundColors({
      colors,
      count: BACKGROUND_ORB_COUNT,
      palette: BACKGROUND_ORB_PALETTE,
      seedOffset: 2100,
      minBrightness: 1.5,
      maxBrightness: 2.65,
      whiteBlend: 0.05,
    });

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return buffer;
  }, [bases]);

  useFrame((state) => {
    const points = pointsRef.current;
    const geometryRef = points?.geometry;
    if (!points || !geometryRef) return;


    const time = state.clock.elapsedTime;
    const positions = geometryRef.attributes.position.array;

    for (let i = 0; i < BACKGROUND_ORB_COUNT; i += 1) {
      const index = i * 3;
      const base = i * 6;
      const speed = bases[base + 5];
      const phase = bases[base + 4];
      const radius = bases[base + 3];

      const singularity = inputRef.current.singularity || 0;
      const explosion = inputRef.current.explosion || 0;
      const orbitPhase = THREE.MathUtils.smoothstep(singularity, 0.04, 0.5);
      const absorbPhase = THREE.MathUtils.smoothstep(singularity, 0.52, 0.98);
      const anchor = getBlackHoleAnchor({ viewport: state.viewport, size: state.size });
      const baseX = bases[base] + Math.sin(time * speed * 0.35 + phase) * radius * 1.8;
      const baseY = bases[base + 1] + Math.cos(time * speed * 0.28 + phase * 0.7) * radius * 1.15;
      const baseZ = bases[base + 2] + Math.sin(time * speed * 0.22 + phase * 1.2) * 0.16;
      const spiral = time * (1.6 + speed + orbitPhase * 3.1) + phase;
      const sinkRadius = (1 - absorbPhase) * (0.7 + radius * 3.1) + absorbPhase * 0.045;
      const sinkX = anchor.x + Math.cos(spiral) * sinkRadius * 0.42;
      const sinkY = anchor.y + Math.sin(spiral * 0.78) * sinkRadius * 0.24;
      const sinkZ = anchor.z + Math.sin(spiral * 0.45) * sinkRadius * 0.44;
      const targetX = baseX * (1 - orbitPhase) + sinkX * orbitPhase;
      const targetY = baseY * (1 - orbitPhase) + sinkY * orbitPhase;
      const targetZ = baseZ * (1 - orbitPhase) + sinkZ * orbitPhase;
      const dirX = baseX - anchor.x;
      const dirY = baseY - anchor.y;
      const dirZ = baseZ - anchor.z;
      const dirLength = Math.max(0.001, Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ));
      const blastStrength = explosion * (3.2 + radius * 9 + random(i + 8800) * 4.5);
      const blastX = baseX + (dirX / dirLength) * blastStrength;
      const blastY = baseY + (dirY / dirLength) * blastStrength;
      const blastZ = baseZ + (dirZ / dirLength) * blastStrength;
      const finalX = targetX * (1 - explosion) + blastX * explosion;
      const finalY = targetY * (1 - explosion) + blastY * explosion;
      const finalZ = targetZ * (1 - explosion) + blastZ * explosion;
      const pullSpeed = explosion > 0.02 ? 0.2 : singularity > 0.02 ? 0.03 + orbitPhase * 0.035 + absorbPhase * 0.075 : 1;

      positions[index] += (finalX - positions[index]) * pullSpeed;
      positions[index + 1] += (finalY - positions[index + 1]) * pullSpeed;
      positions[index + 2] += (finalZ - positions[index + 2]) * pullSpeed;
    }

    geometryRef.attributes.position.needsUpdate = true;
    const singularity = inputRef.current.singularity || 0;
    const explosion = inputRef.current.explosion || 0;
    points.material.opacity = 0.96 + Math.sin(time * 0.8) * 0.04;
    points.material.size = 0.76 + singularity * 0.28 + explosion * 0.36;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        map={orbTexture}
        alphaMap={orbTexture}
        vertexColors
        transparent
        opacity={0.94}
        size={0.68}
        sizeAttenuation
        alphaTest={0.003}
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}


function HeroMagicPoints({ inputRef }) {
  const coreRef = useRef(null);
  const glowRef = useRef(null);
  const visualGroupRef = useRef(null);
  const accretionRef = useRef(null);
  const haloRef = useRef(null);
  const shadowRef = useRef(null);
  const photonRef = useRef(null);
  const formRef = useRef(1);
  const { viewport, size } = useThree();
  const coreTexture = useMemo(() => createDotTexture(), []);
  const glowTexture = useMemo(() => createDotTexture({ glow: true }), []);
  const diskTexture = useMemo(() => createBlackHoleLayerTexture("disk"), []);
  const haloTexture = useMemo(() => createBlackHoleLayerTexture("halo"), []);
  const shadowTexture = useMemo(() => createBlackHoleLayerTexture("shadow"), []);
  const shape = useMemo(() => createHeroMagicShape(), []);
  const scatter = useMemo(() => createHeroMagicScatter(), []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(HERO_MAGIC_DOT_COUNT * 3);
    const colors = new Float32Array(HERO_MAGIC_DOT_COUNT * 3);
    const hotWhite = new THREE.Color("#ffffff");
    const hotGold = new THREE.Color("#ffd36a");
    const plasmaOrange = new THREE.Color("#ff8a1f");
    const deepRed = new THREE.Color("#ff2d20");
    const lensBlue = new THREE.Color("#7dd3fc");
    const color = new THREE.Color();

    for (let i = 0; i < HERO_MAGIC_DOT_COUNT; i += 1) {
      positions[i * 3] = scatter[i * 3] * 7;
      positions[i * 3 + 1] = scatter[i * 3 + 1] * 4;
      positions[i * 3 + 2] = scatter[i * 3 + 2] * 2;

      const layer = shape.layers[i];
      const radialHotness = THREE.MathUtils.clamp(1 - shape.radii[i] / 2.7, 0, 1);
      const flicker = random(i + 2700);

      if (layer === 1) {
        color.copy(lensBlue).lerp(hotWhite, 0.7 + flicker * 0.2);
      } else if (layer === 2) {
        color.copy(plasmaOrange).lerp(hotGold, 0.28 + flicker * 0.22).lerp(hotWhite, radialHotness * 0.34);
      } else if (layer === 3) {
        color.copy(deepRed).lerp(hotGold, flicker * 0.36);
      } else {
        color.copy(plasmaOrange).lerp(hotGold, 0.42 + radialHotness * 0.24).lerp(hotWhite, radialHotness * 0.32);
      }

      const brightness = 1.22 + radialHotness * 0.7 + flicker * 0.22;
      colors[i * 3] = Math.min(1, color.r * brightness);
      colors[i * 3 + 1] = Math.min(1, color.g * brightness);
      colors[i * 3 + 2] = Math.min(1, color.b * brightness);
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return buffer;
  }, [scatter, shape]);

  useFrame((state) => {
    const core = coreRef.current;
    const glow = glowRef.current;
    const visualGroup = visualGroupRef.current;
    const accretion = accretionRef.current;
    const halo = haloRef.current;
    const shadow = shadowRef.current;
    const photon = photonRef.current;
    const geometryRef = core?.geometry;
    if (!core || !glow || !geometryRef || !visualGroup) return;

    const input = inputRef.current;
    const time = state.clock.elapsedTime;
    const targetForm = 1;
    formRef.current = THREE.MathUtils.lerp(formRef.current, targetForm, 0.048);
    const form = THREE.MathUtils.smoothstep(formRef.current, 0, 1);
    const scatterPower = 1 - form;
    const positions = geometryRef.attributes.position.array;
    const isDesktop = size.width >= DESKTOP_BREAKPOINT;
    const showHeroObject = true;
    const objectScale = size.width < 640 ? 0.68 : size.width < DESKTOP_BREAKPOINT ? 1.0 : 1.7;
    const anchor = getBlackHoleAnchor({ viewport, size });

    if (!showHeroObject) {
      formRef.current = 0;
      core.visible = false;
      glow.visible = false;
      visualGroup.visible = false;
      core.material.opacity = 0;
      glow.material.opacity = 0;
      return;
    }

    core.visible = true;
    glow.visible = true;
    const anchorX = anchor.x;
    const anchorY = anchor.y;
    const singularity = input.singularity || 0;
    const explosion = input.explosion || 0;
    const driftX = Math.sin(time * 0.12) * 0.07 * form * (1 - singularity);
    const driftY = Math.cos(time * 0.15) * 0.048 * form * (1 - singularity);
    const orbitPhase = THREE.MathUtils.smoothstep(singularity, 0.04, 0.56);
    const absorbPhase = THREE.MathUtils.smoothstep(singularity, 0.56, 0.99);
    const diskSpin = time * (0.34 + orbitPhase * 2.25);
    const pullPulse = 0.9 + Math.sin(time * 1.05) * 0.035;

    for (let i = 0; i < HERO_MAGIC_DOT_COUNT; i += 1) {
      const index = i * 3;
      const layer = shape.layers[i];
      const radius = shape.radii[i];
      const angle = shape.angles[i];
      const spark = shape.sparks[i];
      const baseZ = shape.positions[index + 2];
      const spinStrength = layer === 1 ? 0.34 : layer === 2 ? 0.96 : layer === 3 ? 0.28 : 0.68;
      const inwardPulse = layer === 2 ? 0.72 + Math.sin(time * 1.35 + spark * 6.28) * 0.1 : pullPulse;
      const absorbedRadius = radius * (1 - absorbPhase * 0.96) + 0.028 * absorbPhase;
      const animatedRadius = absorbedRadius * inwardPulse;
      const animatedAngle = angle + diskSpin * spinStrength + spark * 0.08;
      const flatness = layer === 1 ? 0.46 : layer === 3 ? 0.62 : 0.2;
      const spiralX = Math.cos(animatedAngle) * animatedRadius;
      const spiralY = Math.sin(animatedAngle) * animatedRadius * flatness;
      const spiralZ = baseZ + Math.sin(animatedAngle * 1.15 + time * 0.5) * 0.045;
      const localX = spiralX * objectScale;
      const localY = spiralY * objectScale;
      const localZ = spiralZ * objectScale;
      const formedX = anchorX + driftX + localX;
      const formedY = anchorY + driftY + localY;
      const formedZ = localZ;
      const spreadX = scatter[index] * viewport.width * 1.34 + Math.sin(time * 0.42 + i * 0.019) * 0.32;
      const spreadY = scatter[index + 1] * viewport.height * 1.22 + Math.cos(time * 0.38 + i * 0.015) * 0.24;
      const spreadZ = -0.35 + scatter[index + 2] * 3.45;
      const targetX = formedX * form + spreadX * scatterPower;
      const targetY = formedY * form + spreadY * scatterPower;
      const targetZ = formedZ * form + spreadZ * scatterPower;
      const dirX = spreadX - anchorX;
      const dirY = spreadY - anchorY;
      const dirZ = spreadZ;
      const dirLength = Math.max(0.001, Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ));
      const blastStrength = explosion * (2.8 + spark * 4.8);
      const blastX = anchorX + (dirX / dirLength) * blastStrength + spreadX * 0.2;
      const blastY = anchorY + (dirY / dirLength) * blastStrength + spreadY * 0.2;
      const blastZ = (dirZ / dirLength) * blastStrength + spreadZ * 0.35;
      const finalX = targetX * (1 - explosion) + blastX * explosion;
      const finalY = targetY * (1 - explosion) + blastY * explosion;
      const finalZ = targetZ * (1 - explosion) + blastZ * explosion;
      const speed = explosion > 0.02 ? 0.2 : singularity > 0.02 ? 0.035 + orbitPhase * 0.035 + absorbPhase * 0.08 : 0.038 + random(i + 3100) * 0.026 + scatterPower * 0.018;

      positions[index] += (finalX - positions[index]) * speed;
      positions[index + 1] += (finalY - positions[index + 1]) * speed;
      positions[index + 2] += (finalZ - positions[index + 2]) * speed;
    }

    geometryRef.attributes.position.needsUpdate = true;

    visualGroup.position.set(anchorX + driftX, anchorY + driftY, 0.02);
    visualGroup.rotation.z = 0;
    visualGroup.scale.setScalar(form * (1 + singularity * 0.08 + explosion * 0.42));
    visualGroup.visible = form > 0.015;

    if (accretion) {
      accretion.position.set(0, 0, 0);
      accretion.rotation.x = 0;
      accretion.rotation.y = 0;
      accretion.rotation.z = 0;
      accretion.scale.set(isDesktop ? 4.05 : 2.32, isDesktop ? 1.18 : 0.68, 1);
      accretion.material.opacity = 0.78 * form * (1 - explosion * 0.45);
    }

    if (halo) {
      halo.visible = false;
      halo.material.opacity = 0;
    }

    if (shadow) {
      shadow.scale.set(isDesktop ? 0.98 : 0.58, isDesktop ? 0.98 : 0.58, 1);
      shadow.material.opacity = 0.98 * form * (1 - explosion * 0.2);
    }

    if (photon) {
      photon.rotation.z = 0;
      photon.scale.set(isDesktop ? 1.25 : 0.76, isDesktop ? 0.78 : 0.48, 1);
      photon.material.opacity = 0;
    }

    core.material.opacity = (0.86 + form * 0.14) * (1 - explosion * 0.6);
    glow.material.opacity = 0.28 + form * 0.36 + explosion * 0.55;
    core.material.size = (isDesktop ? 0.036 : 0.031) + scatterPower * 0.006;
    glow.material.size = (isDesktop ? 0.15 : 0.11) + scatterPower * 0.035;
  });

  return (
    <group>
      <group ref={visualGroupRef} renderOrder={2}>
        <mesh ref={haloRef} frustumCulled={false} renderOrder={2}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={haloTexture}
            transparent
            opacity={0}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={accretionRef} frustumCulled={false} renderOrder={3}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={diskTexture}
            transparent
            opacity={0.9}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={shadowRef} frustumCulled={false} renderOrder={4}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={shadowTexture}
            transparent
            opacity={0.98}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={photonRef} frustumCulled={false} renderOrder={5}>
          <ringGeometry args={[0.48, 0.53, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.44}
            side={THREE.DoubleSide}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      <points ref={glowRef} geometry={geometry} frustumCulled={false} renderOrder={1}>
        <pointsMaterial
          map={glowTexture}
          alphaMap={glowTexture}
          vertexColors
          transparent
          opacity={0.56}
          size={0.15}
          sizeAttenuation
          alphaTest={0.004}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points ref={coreRef} geometry={geometry} frustumCulled={false} renderOrder={6}>
        <pointsMaterial
          map={coreTexture}
          alphaMap={coreTexture}
          vertexColors
          transparent
          opacity={1}
          size={0.036}
          sizeAttenuation
          alphaTest={0.01}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function ParticleTitles({ inputRef }) {
  const pointsRef = useRef(null);
  const { viewport, size } = useThree();
  const targetSets = useMemo(() => SECTION_TITLES.map(createTextPointSet), []);
  const dotTexture = useMemo(() => createDotTexture(), []);
  const glowTexture = useMemo(() => createDotTexture({ glow: true }), []);

  const geometry = useMemo(() => {
    const positions = createScatterPoints();
    const colors = new Float32Array(TITLE_DOT_COUNT * 3);
    const color = new THREE.Color(PALETTE.white);

    for (let i = 0; i < TITLE_DOT_COUNT; i += 1) {
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return buffer;
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    const geometryRef = points?.geometry;
    if (!points || !geometryRef) return;

    const input = inputRef.current;
    const positions = geometryRef.attributes.position.array;
    const colors = geometryRef.attributes.color.array;
    const section = SECTION_TITLES[input.sectionIndex] || SECTION_TITLES[0];
    const set = targetSets[input.sectionIndex] || targetSets[0];
    const target = set.positions;
    const mobileTitleScale = size.width < 640 ? 0.48 : size.width < DESKTOP_BREAKPOINT ? 0.68 : 1;
    const scaledBounds = {
      width: set.bounds.width * mobileTitleScale,
      height: set.bounds.height * mobileTitleScale,
    };
    const anchor = getTitleAnchor({ bounds: scaledBounds, viewport, size });
    const colorA = new THREE.Color(section.colorA);
    const colorB = new THREE.Color(section.colorB);
    const time = state.clock.elapsedTime;
    const transitionPower = input.scatterPower;
    const transitionMix = THREE.MathUtils.smoothstep(transitionPower, 0.08, 0.68);
    const titleMix = 1 - transitionMix;
    const mousePushX = input.mouse.x * 0.09 * titleMix;
    const mousePushY = input.mouse.y * 0.065 * titleMix;
    const singularity = input.singularity || 0;
    const explosion = input.explosion || 0;
    const blackHoleAnchor = getBlackHoleAnchor({ viewport, size });

    for (let i = 0; i < TITLE_DOT_COUNT; i += 1) {
      const index = i * 3;
      const phase = random(i + 41) * Math.PI * 2;
      const aliveX = Math.sin(time * 0.56 + phase) * 0.003 * titleMix;
      const aliveY = Math.cos(time * 0.52 + phase) * 0.003 * titleMix;
      const titleX = target[index] * mobileTitleScale + anchor.x + aliveX;
      const titleY = target[index + 1] * mobileTitleScale + anchor.y + aliveY;
      const titleZ = target[index + 2];
      const transitionAngle = time * (2.15 + random(i + 6100) * 1.15) + phase;
      const transitionDepth = random(i + 6200) - 0.5;
      const transitionRadius = (0.025 + random(i + 6300) * 0.18) * (1 - transitionMix * 0.48);
      const absorbedTitleX = blackHoleAnchor.x + Math.cos(transitionAngle) * transitionRadius * 0.75;
      const absorbedTitleY = blackHoleAnchor.y + Math.sin(transitionAngle * 0.72) * transitionRadius * 0.42;
      const absorbedTitleZ = blackHoleAnchor.z + transitionDepth * 0.22 * (1 - transitionMix * 0.35);
      const baseTx = titleX * titleMix + absorbedTitleX * transitionMix + mousePushX;
      const baseTy = titleY * titleMix + absorbedTitleY * transitionMix + mousePushY;
      const baseTz = titleZ * titleMix + absorbedTitleZ * transitionMix;
      const singularityOrbit = THREE.MathUtils.smoothstep(singularity, 0.04, 0.52);
      const singularityAbsorb = THREE.MathUtils.smoothstep(singularity, 0.54, 0.99);
      const singularityAngle = time * (1.8 + singularityOrbit * 3.6 + random(i + 8300) * 1.3) + phase;
      const singularityRadius = (1 - singularityAbsorb) * (0.42 + random(i + 8400) * 2.5) + 0.03 * singularityAbsorb;
      const absorbedX = blackHoleAnchor.x + Math.cos(singularityAngle) * singularityRadius * 0.34;
      const absorbedY = blackHoleAnchor.y + Math.sin(singularityAngle * 0.82) * singularityRadius * 0.2;
      const absorbedZ = blackHoleAnchor.z + Math.sin(singularityAngle * 0.58) * singularityRadius * 0.42;
      const tx = baseTx * (1 - singularityOrbit) + absorbedX * singularityOrbit;
      const ty = baseTy * (1 - singularityOrbit) + absorbedY * singularityOrbit;
      const tz = baseTz * (1 - singularityOrbit) + absorbedZ * singularityOrbit;
      const blastDirX = baseTx - blackHoleAnchor.x + Math.sin(phase) * 0.7;
      const blastDirY = baseTy - blackHoleAnchor.y + Math.cos(phase) * 0.5;
      const blastDirZ = baseTz - blackHoleAnchor.z + Math.sin(phase * 1.7) * 0.8;
      const blastDirLength = Math.max(0.001, Math.sqrt(blastDirX * blastDirX + blastDirY * blastDirY + blastDirZ * blastDirZ));
      const blastDistance = explosion * (2.0 + random(i + 8700) * 4.2);
      const blastX = blackHoleAnchor.x + (blastDirX / blastDirLength) * blastDistance;
      const blastY = blackHoleAnchor.y + (blastDirY / blastDirLength) * blastDistance;
      const blastZ = blackHoleAnchor.z + (blastDirZ / blastDirLength) * blastDistance;
      const finalTx = tx * (1 - explosion) + blastX * explosion;
      const finalTy = ty * (1 - explosion) + blastY * explosion;
      const finalTz = tz * (1 - explosion) + blastZ * explosion;
      const speed = explosion > 0.02 ? 0.2 : singularity > 0.02 ? 0.045 + singularityOrbit * 0.04 + singularityAbsorb * 0.1 : 0.07 + random(i + 11) * 0.018 + transitionMix * 0.06;

      positions[index] += (finalTx - positions[index]) * speed;
      positions[index + 1] += (finalTy - positions[index + 1]) * speed;
      positions[index + 2] += (finalTz - positions[index + 2]) * speed;

      const horizontalBand = THREE.MathUtils.clamp((target[index] / Math.max(set.bounds.width, 0.001)) + 0.5, 0, 1);
      const liveSweep = (Math.sin(time * 1.25 + phase + input.sectionIndex * 2.4) + 1) / 2;
      const transitionPulse = input.colorPulse;
      const blend = THREE.MathUtils.clamp(horizontalBand * 0.72 + liveSweep * 0.28, 0, 1);
      const c = colorA.clone().lerp(colorB, blend);
      const flashColor = new THREE.Color(section.colorC);

      if (transitionPulse > 0.02) {
        c.lerp(flashColor, transitionPulse * 0.95);
      }

      if ((i + input.sectionIndex) % 17 === 0) {
        c.lerp(colorB, 0.28);
      }

      colors[index] = Math.min(1, c.r * 1.18);
      colors[index + 1] = Math.min(1, c.g * 1.18);
      colors[index + 2] = Math.min(1, c.b * 1.18);
    }

    geometryRef.attributes.position.needsUpdate = true;
    geometryRef.attributes.color.needsUpdate = true;
    points.rotation.y = Math.sin(time * 0.06) * 0.014 + input.mouse.x * 0.018;
    points.rotation.x = Math.cos(time * 0.05) * 0.01 + input.mouse.y * 0.014;
    points.material.size = (size.width < 640 ? 0.038 : size.width < DESKTOP_BREAKPOINT ? 0.044 : 0.054) + transitionMix * 0.008 + explosion * 0.018;
    points.material.opacity = 1;
  });

  return (
    <group>
      <points geometry={geometry} frustumCulled={false}>
        <pointsMaterial
          map={glowTexture}
          alphaMap={glowTexture}
          vertexColors
          transparent
          opacity={0.24}
          size={size.width < 640 ? 0.082 : size.width < DESKTOP_BREAKPOINT ? 0.096 : 0.12}
          sizeAttenuation
          alphaTest={0.005}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
        <pointsMaterial
          map={dotTexture}
          alphaMap={dotTexture}
          vertexColors
          transparent
          opacity={1}
          size={size.width < 640 ? 0.038 : size.width < DESKTOP_BREAKPOINT ? 0.044 : 0.054}
          sizeAttenuation
          alphaTest={0.01}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function SceneStage() {
  const inputRef = useRef({
    sectionIndex: 0,
    pendingSectionIndex: 0,
    isTitleWaitingForScrollStop: 0,
    scatterPower: 1,
    scrollVelocity: 0,
    colorPulse: 1,
    mouse: { x: 0, y: 0 },
    targetMouse: { x: 0, y: 0 },
    singularity: 0,
    singularityTarget: 0,
    singularityHoldAge: 0,
    explosion: 0,
  });

  return (
    <>
      <SectionTracker inputRef={inputRef} />
      <StarField inputRef={inputRef} />
      <MovingGlowOrbs inputRef={inputRef} />
      <HeroMagicPoints inputRef={inputRef} />
      <ParticleTitles inputRef={inputRef} />
    </>
  );
}

function CameraRig() {
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(time * 0.05) * 0.045;
    state.camera.position.y = Math.cos(time * 0.07) * 0.032;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6.4], fov: 48 }}
        dpr={[1, 1.15]}
        gl={{ alpha: false, antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#020711"]} />
        <fog attach="fog" args={["#020711", 6, 15]} />
        <ambientLight intensity={0.45} />
        <SceneStage />
        <CameraRig />
      </Canvas>
    </div>
  );
}