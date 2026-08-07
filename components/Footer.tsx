import { site, services } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--glass-border)] px-5 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#4f6bff] to-[#a855f7] text-sm font-bold text-white">
                K
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                Kingsberry
                <span className="ml-1.5 font-normal text-[var(--text-faint)]">
                  Consulting
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-[var(--text-dim)]">
              {site.positioning}
            </p>
          </div>

          <div>
            <h3 className="mono mb-4 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="text-[13.5px] text-[var(--text-dim)] transition-colors hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mono mb-4 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Contact
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[13.5px] text-[var(--text-dim)] transition-colors hover:text-white"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                  className="text-[13.5px] text-[var(--text-dim)] transition-colors hover:text-white"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13.5px] text-[var(--text-dim)] transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[13.5px] text-[var(--text-dim)] transition-colors hover:text-white"
                >
                  Book a call
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12 h-px w-full opacity-50" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-[12.5px] text-[var(--text-faint)]">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
            {site.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
