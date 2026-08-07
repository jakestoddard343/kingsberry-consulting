"use client";

import { industries, credibility } from "@/lib/content";
import Reveal, { RevealWords } from "./Reveal";

const tools = [
  "Salesforce",
  "HubSpot",
  "Qualtrics",
  "Tableau",
  "Power BI",
  "Looker Studio",
  "Zapier",
  "Make",
  "Claude",
  "ChatGPT",
  "Intercom",
  "ActiveCampaign",
  "Marketing Cloud",
  "Mailchimp",
];

export default function Edge() {
  return (
    <section className="relative border-t border-[var(--glass-border)] px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
              The edge
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2.75rem]">
              <RevealWords text="A rare combination, not a generic agency." />
            </h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-[var(--text-dim)]">
              Plenty of firms can run ads. Very few bring Salesforce
              administration, Qualtrics customer-experience work, analytics,
              automation, and AI workflow design to the same table — which is
              exactly what rebuilding a lead-generation system takes.
            </p>

            <div className="mt-10">
              <h3 className="mono mb-4 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                Where we start · B2B manufacturing
              </h3>
              <ul className="flex flex-wrap gap-2">
                {industries.map((ind, i) => (
                  <Reveal key={ind} as="li" delay={i * 0.05}>
                    <span className="glass sheen inline-block rounded-xl px-3.5 py-2 text-[13.5px] text-[rgba(233,238,255,0.82)]">
                      {ind}
                    </span>
                  </Reveal>
                ))}
              </ul>
              <p className="mt-5 max-w-md text-[14px] leading-relaxed text-[var(--text-faint)]">
                Manufacturing, aviation, CRM systems, customer experience, and
                marketing analytics — domains we have already worked inside, so
                the discovery call starts at the second question.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:pt-2">
            {credibility.map((c, i) => (
              <Reveal key={c.k} delay={i * 0.08}>
                <div className="glass sheen h-full rounded-2xl p-6">
                  <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#7ea6ff]">
                    {c.k}
                  </div>
                  <h3 className="mt-2.5 text-[17px] font-semibold tracking-tight">
                    {c.v}
                  </h3>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--text-dim)]">
                    {c.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Tool marquee */}
        <div className="marquee-mask mt-20 overflow-hidden border-y border-[var(--glass-border)] py-6">
          <div className="marquee-track flex w-max gap-10">
            {[...tools, ...tools].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="mono whitespace-nowrap text-[13px] uppercase tracking-[0.14em] text-[var(--text-faint)]"
                aria-hidden={i >= tools.length}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
