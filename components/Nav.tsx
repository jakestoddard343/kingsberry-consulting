"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/lib/content";
import BrandMark from "./BrandMark";

const links = [
  { href: "#problem", label: "The Problem" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#packages", label: "Packages" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/*
        Full-width scrim behind the header. The pill alone only blurs what sits
        directly under it, so content passing either side of it collides with
        the nav text. This band blurs the whole strip and fades out downward, so
        there is no hard edge where the blur stops.
      */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 h-28 transition-opacity duration-500 sm:h-32 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 backdrop-blur-md"
          style={{
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060d] via-[#04060d]/72 to-transparent" />
      </div>

      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <nav
          // The pill carries its own tint on top of the scrim so it stays a
          // distinct surface rather than dissolving into the blurred band.
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-5 ${
            scrolled
              ? "glass glass-refract bg-[#0b1020]/72"
              : "border border-transparent"
          }`}
        >
          <a
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label={`${site.name} home`}
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-berry)] text-white shadow-[0_0_22px_-6px_rgba(150,60,240,0.9)]">
              <BrandMark className="h-[22px] w-[22px]" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Kingsberry
              <span className="ml-1.5 font-normal text-[var(--text-faint)]">
                Consulting
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative rounded-lg px-3 py-2 text-[13.5px] text-[var(--text-dim)] transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-xl bg-white px-4 py-2 text-[13.5px] font-semibold text-[#04060d] transition-transform duration-300 hover:scale-[1.03] active:scale-95 sm:block"
            >
              Book a call
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--glass-border)] md:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 h-px w-full bg-white transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-px w-full bg-white transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-white transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#04060d]/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex h-full flex-col items-center justify-center gap-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.05, duration: 0.5 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-3 text-2xl font-medium tracking-tight"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6"
              >
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-white px-6 py-3 font-semibold text-[#04060d]"
                >
                  Book a call
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
