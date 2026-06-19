import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  FiGithub, FiLinkedin, FiInstagram, FiMail, FiDownload, FiArrowUpRight,
  FiArrowUp, FiExternalLink, FiMapPin, FiSend, FiStar,
} from "react-icons/fi";
import {
  HiOutlineSquare3Stack3D, HiOutlineComputerDesktop, HiOutlineServer,
  HiOutlineCircleStack, HiOutlineGlobeAlt,
} from "react-icons/hi2";
import { TbPlugConnected } from "react-icons/tb";
import portraitAsset from "@/assets/raja-photo.jpeg.asset.json";
const portrait = portraitAsset.url;
import dataJson from "@/data/portfolio.json";
type AnyArr = any[];
const data = dataJson as unknown as Omit<typeof dataJson, "projects" | "certifications" | "experience"> & {
  projects: AnyArr;
  certifications: AnyArr;
  experience: AnyArr;
  about: typeof dataJson.about & { stats: AnyArr };
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raja Nagaraju — Software Engineer & Full Stack Developer" },
      { name: "description", content: "Raja Nagaraju is a software engineer and full stack developer building scalable, high-performance web applications with React, Next.js, Node.js and AWS." },
      { name: "keywords", content: "Raja Nagaraju, Software Engineer, Full Stack Developer, React Developer, Next.js Developer, Web Developer" },
      { property: "og:title", content: "Raja Nagaraju — Software Engineer & Full Stack Developer" },
      { property: "og:description", content: "Premium portfolio of Raja Nagaraju — full stack engineer building modern digital experiences." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "Raja Nagaraju — Software Engineer" },
      { name: "twitter:description", content: "Full stack developer building scalable web applications." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Raja Nagaraju",
          jobTitle: "Software Engineer & Full Stack Developer",
          url: "/",
          sameAs: [data.social.github, data.social.linkedin, data.social.instagram],
          knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
        }),
      },
    ],
  }),
  component: Portfolio,
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-6 py-28 md:py-36 ${className}`}>
      {children}
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
      className="mb-16 text-center"
    >
      <motion.p variants={fadeUp} className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[var(--accent-cyan)]">
        {eyebrow}
      </motion.p>
      <motion.h2 variants={fadeUp} custom={1} className="text-4xl font-semibold text-white md:text-5xl">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeUp} custom={2} className="mx-auto mt-4 max-w-2xl text-[var(--text-muted)]">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Background FX                                                      */
/* ------------------------------------------------------------------ */

function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute left-1/2 top-0 h-[800px] w-[1200px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.25), transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute right-[-200px] top-[40%] h-[600px] w-[600px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.22), transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute left-[-200px] top-[70%] h-[600px] w-[600px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(6,182,212,0.18), transparent 70%)", filter: "blur(80px)" }} />
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 22 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/40"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
          }}
          animate={{
            y: ["0%", "-120%"],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            delay: Math.random() * 6,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ left: `${Math.random() * 100}%`, top: `${80 + Math.random() * 20}%` }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

const navItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#top" className={`flex items-center gap-2 rounded-2xl px-4 py-2 transition ${scrolled ? "glass-strong" : ""}`}>
          <span className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-white"
            style={{ background: "var(--gradient-brand)" }}>R</span>
          <span className="font-display text-base font-semibold text-white">Raja<span className="text-gradient">.N</span></span>
        </a>
        <nav className={`hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex ${scrolled ? "glass-strong" : "glass"}`}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className="rounded-full px-4 py-1.5 text-sm text-[var(--text-muted)] transition hover:bg-white/5 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden rounded-full px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-[1.03] md:inline-flex"
          style={{ background: "var(--gradient-brand)" }}>
          Let's Talk
        </a>
        <button className="rounded-lg glass p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
            <span className="block h-0.5 w-5 bg-white" />
          </div>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mx-6 mt-3 grid gap-1 rounded-2xl glass-strong p-3 md:hidden">
            {navItems.map((i) => (
              <a key={i.href} href={i.href} onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-[var(--text-muted)] hover:bg-white/5 hover:text-white">
                {i.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function TypingText({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const current = words[i % words.length];
    const speed = del ? 35 : 75;
    const t = setTimeout(() => {
      if (!del) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDel(true), 1400);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") { setDel(false); setI(i + 1); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return (
    <span className="text-gradient">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-[var(--accent-cyan)] animate-pulse-glow" />
    </span>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  return (
    <div id="top" ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setMouse({ x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 });
      }}
      className="relative min-h-screen overflow-hidden pt-32"
    >
      <Particles />
      <div
        aria-hidden
        className="pointer-events-none absolute h-[500px] w-[500px] rounded-full opacity-50 transition-transform duration-300"
        style={{
          left: "50%", top: "50%",
          transform: `translate(calc(-50% + ${mouse.x * 0.05}px), calc(-50% + ${mouse.y * 0.05}px))`,
          background: "radial-gradient(closest-side, rgba(59,130,246,0.35), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <Section id="hero" className="grid items-center gap-16 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        {/* Left */}
        <motion.div initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-[var(--text-muted)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for new opportunities
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1}
            className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-[5.5rem]">
            RAJA<br />NAGARAJU
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mt-5 text-lg text-[var(--text-muted)] md:text-xl">
            {data.title}
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="mt-3 min-h-[2em] font-display text-2xl font-medium md:text-3xl">
            <TypingText words={data.typing} />
          </motion.div>
          <motion.p variants={fadeUp} custom={4} className="mt-6 max-w-xl text-[var(--text-muted)] leading-relaxed">
            {data.summary}
          </motion.p>
          <motion.div variants={fadeUp} custom={5} className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#projects" className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-xl transition hover:scale-[1.04]"
              style={{ background: "var(--gradient-brand)" }}>
              View Projects <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">
              <FiDownload /> Download Resume
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition hover:bg-white/5">
              Contact Me
            </a>
          </motion.div>
          <motion.div variants={fadeUp} custom={6} className="mt-10 flex items-center gap-3">
            {[
              { Icon: FiGithub, href: data.social.github },
              { Icon: FiLinkedin, href: data.social.linkedin },
              { Icon: FiInstagram, href: data.social.instagram },
              { Icon: FiMail, href: `mailto:${data.social.email}` },
            ].map(({ Icon, href }, idx) => (
              <a key={idx} href={href} aria-label="social"
                className="grid h-11 w-11 place-items-center rounded-full glass text-[var(--text-muted)] transition hover:scale-110 hover:text-white hover:glow-blue">
                <Icon />
              </a>
            ))}
          </motion.div>
        </motion.div>
        {/* Right: portrait */}
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[440px]">
          <div className="absolute -inset-6 rounded-[2rem] opacity-70 animate-gradient blur-2xl"
            style={{ background: "var(--gradient-brand)" }} />
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-[2rem] glass-strong p-2">
            <img src={portrait} alt="Raja Nagaraju portrait" width={896} height={1152}
              className="aspect-[4/5] w-full rounded-[1.7rem] object-cover" />
            <div className="pointer-events-none absolute inset-2 rounded-[1.7rem] ring-1 ring-white/10" />
          </motion.div>
          {/* floating badges */}
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -right-4 bottom-12 hidden rounded-2xl glass-strong px-4 py-3 text-sm shadow-xl md:block">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ background: "var(--gradient-brand)" }}>
                <FiStar />
              </span>
              <div>
                <div className="text-xs text-[var(--text-muted)]">1.6y experience</div>
                <div className="font-medium text-white">Software Engineer</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = () => {
      start += Math.max(1, Math.ceil(to / 60));
      if (start >= to) { setVal(to); return; }
      setVal(start);
      requestAnimationFrame(step);
    };
    step();
  }, [inView, to]);
  return <span ref={ref}>{val}+</span>;
}

function About() {
  return (
    <Section id="about">
      <SectionHeading eyebrow="About" title="About Raja" subtitle="Engineering with craft, empathy, and a relentless bias for shipping." />
      <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-5">
          {data.about.paragraphs.map((p, i) => (
            <motion.p key={i} variants={fadeUp} custom={i} className="text-[var(--text-muted)] leading-relaxed">
              {p}
            </motion.p>
          ))}
        </motion.div>
        <div className="grid grid-cols-2 gap-4">
          {data.about.highlights.map((h, i) => (
            <motion.div key={h.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl glass p-5 transition hover:-translate-y-1 hover:glow-blue">
              <div className="mb-3 h-10 w-10 rounded-xl" style={{ background: "var(--gradient-brand)" }} />
              <h3 className="text-base font-semibold text-white">{h.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
        {data.about.stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl glass p-6 text-center">
            <div className="font-display text-4xl font-semibold text-gradient md:text-5xl">
              <CountUp to={Number(s.value) || 0} />
            </div>
            <div className="mt-2 text-xs uppercase tracking-wider text-[var(--text-muted)]">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Skills                                                             */
/* ------------------------------------------------------------------ */

function Skills() {
  const groups = Object.entries(data.skills);
  return (
    <Section id="skills">
      <SectionHeading eyebrow="Skills" title="The Stack I Build With" subtitle="Years of hands-on craft across the modern web stack." />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {groups.map(([group, items], gi) => (
          <motion.div key={group} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: gi * 0.08 }}
            className="group relative overflow-hidden rounded-3xl glass p-6 transition hover:-translate-y-1">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition group-hover:opacity-100"
              style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.4), transparent 70%)", filter: "blur(20px)" }} />
            <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent-cyan)]">{group}</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {(items as string[]).map((s) => (
                <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/90 transition hover:scale-105 hover:border-[var(--accent-blue)]/60 hover:text-white">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      {/* Tech wall ticker */}
      <div className="relative mt-16 overflow-hidden rounded-3xl glass py-6">
        <div className="flex animate-scroll-x gap-12 whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex shrink-0 gap-12">
              {Object.values(data.skills).flat().map((tech, i) => (
                <span key={`${dup}-${i}`} className="font-display text-2xl text-white/40 transition hover:text-white">
                  {tech as string}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050816] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050816] to-transparent" />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Experience                                                         */
/* ------------------------------------------------------------------ */

function Experience() {
  return (
    <Section id="experience">
      <SectionHeading eyebrow="Experience" title="Career Timeline" subtitle="A snapshot of teams I've built with and the impact we shipped." />
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-blue)] via-[var(--accent-purple)] to-transparent md:left-1/2" />
        <div className="space-y-12">
          {data.experience.map((exp, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className={`relative grid gap-6 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="absolute left-4 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[var(--accent-blue)] bg-[#050816] md:left-1/2">
                <div className="absolute inset-0 animate-ping rounded-full bg-[var(--accent-blue)]/40" />
              </div>
              <div className={`pl-12 md:pl-0 ${i % 2 ? "md:pl-12 md:text-left" : "md:pr-12 md:text-right"}`}>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--accent-cyan)]">{exp.duration}</div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">{exp.role}</h3>
                <p className="mt-1 text-[var(--text-muted)]">{exp.company}</p>
              </div>
              <div className={`pl-12 md:pl-0 ${i % 2 ? "md:pr-12" : "md:pl-12"}`}>
                <div className="rounded-2xl glass p-5">
                  <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                    {exp.responsibilities.map((r: string, ri: number) => (
                      <li key={ri} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-blue)]" />{r}</li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <div className="text-xs uppercase tracking-wider text-[var(--accent-cyan)]">Wins</div>
                    <ul className="mt-2 space-y-1 text-sm text-white/90">
                      {exp.achievements.map((a: string, ai: number) => <li key={ai}>↗ {a}</li>)}
                    </ul>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.stack.map((s: string) => (
                      <span key={s} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/70">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */

const projectGradients: Record<string, string> = {
  lumen: "linear-gradient(135deg,#3B82F6,#06B6D4)",
  orbit: "linear-gradient(135deg,#8B5CF6,#3B82F6)",
  pulse: "linear-gradient(135deg,#06B6D4,#8B5CF6)",
  nimbus: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
  atlas: "linear-gradient(135deg,#8B5CF6,#06B6D4)",
  vault: "linear-gradient(135deg,#06B6D4,#3B82F6)",
};

function ProjectVisual({ name, image }: { name: string; image: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl"
      style={{ background: projectGradients[image] || "var(--gradient-brand)" }}>
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-2xl glass-strong px-6 py-4 text-center">
          <div className="font-display text-2xl font-semibold text-white">{name}</div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/70">live preview</div>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-white/30" />
        <div className="h-1.5 w-8 rounded-full bg-white/60" />
      </div>
    </div>
  );
}

function Projects() {
  const cats = ["All", "Full Stack", "Frontend", "Backend", "APIs", "Open Source"];
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? data.projects : data.projects.filter((p) => p.category === cat);
  return (
    <Section id="projects">
      <SectionHeading eyebrow="Selected Work" title="Featured Projects" subtitle="A few products I'm proud of — each one shipped, scaled, and loved." />
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              cat === c ? "text-white shadow-lg" : "glass text-[var(--text-muted)] hover:text-white"
            }`}
            style={cat === c ? { background: "var(--gradient-brand)" } : {}}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((p, i) => (
          <motion.article key={p.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl glass p-5 transition hover:glow-blue">
            <ProjectVisual name={p.name} image={p.image} />
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-white">{p.name}</h3>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-[var(--accent-cyan)]">{p.category}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{p.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                {Object.entries(p.metrics).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{k}</div>
                    <div className="text-xs font-medium text-white">{String(v)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((s: string) => <span key={s} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/70">{s}</span>)}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <a href={p.github} className="inline-flex items-center gap-1.5 text-sm text-white hover:text-[var(--accent-blue)]"><FiGithub /> Code</a>
                <a href={p.demo} className="inline-flex items-center gap-1.5 text-sm text-white hover:text-[var(--accent-blue)]"><FiExternalLink /> Demo</a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers: HiOutlineSquare3Stack3D,
  Monitor: HiOutlineComputerDesktop,
  Server: HiOutlineServer,
  Plug: TbPlugConnected,
  Database: HiOutlineCircleStack,
  Compass: HiOutlineGlobeAlt,
};

function Services() {
  return (
    <Section id="services">
      <SectionHeading eyebrow="Services" title="How I Can Help" subtitle="From greenfield products to scaling pains — I plug in where it matters." />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {data.services.map((s, i) => {
          const Icon = serviceIcons[s.icon] ?? HiOutlineSquare3Stack3D;
          return (
            <motion.div key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-3xl glass p-6 transition hover:-translate-y-1 hover:glow-purple">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl text-white"
                style={{ background: "var(--gradient-brand)" }}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{s.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-xs text-[var(--accent-cyan)] opacity-0 transition group-hover:opacity-100">
                Learn more <FiArrowUpRight />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Certifications                                                     */
/* ------------------------------------------------------------------ */

function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeading eyebrow="Achievements" title="Certifications & Recognition" subtitle="Continuous learning, recognized." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.certifications.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl glass p-5 transition hover:-translate-y-1">
            <div className="absolute right-3 top-3 rounded-full bg-white/5 px-2 py-0.5 text-xs text-[var(--accent-cyan)]">{c.year}</div>
            <div className="mb-3 h-8 w-8 rounded-lg" style={{ background: "var(--gradient-brand)" }} />
            <h3 className="font-medium text-white">{c.title}</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{c.issuer}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [err, setErr] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.name.length > 100) return setErr("Please enter a valid name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setErr("Please enter a valid email.");
    if (!form.message.trim() || form.message.length > 1000) return setErr("Please enter a message.");
    setErr(null);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };
  return (
    <Section id="contact">
      <SectionHeading eyebrow="Contact" title="Let's Build Something Amazing Together"
        subtitle="Have a product to ship, a team to scale, or an idea to validate? I'd love to hear about it." />
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <div className="rounded-2xl glass p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--accent-cyan)]">Email</div>
            <a href={`mailto:${data.contact.email}`} className="mt-1 block break-all text-lg text-white hover:text-[var(--accent-blue)]">
              {data.contact.email}
            </a>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--accent-cyan)]">Location</div>
            <div className="mt-1 flex items-center gap-2 text-white"><FiMapPin /> {data.contact.location}</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--accent-cyan)]">Find me online</div>
            <div className="mt-3 flex gap-3">
              {[
                { Icon: FiGithub, href: data.social.github },
                { Icon: FiLinkedin, href: data.social.linkedin },
                { Icon: FiInstagram, href: data.social.instagram },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="grid h-11 w-11 place-items-center rounded-full glass-strong text-white transition hover:scale-110 hover:glow-blue">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="rounded-3xl glass-strong p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your name" />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" type="email" />
          </div>
          <div className="mt-4">
            <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} placeholder="What's this about?" />
          </div>
          <div className="mt-4">
            <label className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={1000} rows={5} placeholder="Tell me about your project..."
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[var(--accent-blue)] focus:outline-none" />
          </div>
          {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
          <button type="submit"
            className="group mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white shadow-xl transition hover:scale-[1.03]"
            style={{ background: "var(--gradient-brand)" }}>
            <FiSend /> Send Message
          </button>
          <AnimatePresence>
            {sent && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                ✓ Message sent — I'll get back to you soon.
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </Section>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={255}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[var(--accent-blue)] focus:outline-none" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer + Back to top                                               */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>R</span>
          <span className="font-display font-semibold text-white">Raja<span className="text-gradient">.N</span></span>
        </div>
        <nav className="flex flex-wrap justify-center gap-5 text-sm text-[var(--text-muted)]">
          {navItems.map((n) => <a key={n.href} href={n.href} className="hover:text-white">{n.label}</a>)}
        </nav>
        <div className="flex gap-3">
          {[
            { Icon: FiGithub, href: data.social.github },
            { Icon: FiLinkedin, href: data.social.linkedin },
            { Icon: FiInstagram, href: data.social.instagram },
            { Icon: FiMail, href: `mailto:${data.social.email}` },
          ].map(({ Icon, href }, i) => (
            <a key={i} href={href} className="grid h-9 w-9 place-items-center rounded-full glass text-[var(--text-muted)] hover:text-white">
              <Icon />
            </a>
          ))}
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-[var(--text-muted)]">© 2025 Raja Nagaraju. All Rights Reserved.</p>
    </footer>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full text-white shadow-2xl"
          style={{ background: "var(--gradient-brand)" }} aria-label="Back to top">
          <FiArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

function Portfolio() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <div className="relative">
      <BackgroundFX />
      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
        // brand gradient
        // eslint-disable-next-line react/forbid-dom-props
      >
        <div className="h-full w-full" style={{ background: "var(--gradient-brand)" }} />
      </motion.div>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Services />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}