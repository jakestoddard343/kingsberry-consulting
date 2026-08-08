"use client";

import { industries } from "@/lib/content";
import { usePinnedSteps } from "@/lib/use-pinned-steps";
import { usePeak } from "@/lib/use-fly-in";
import Reveal, { RevealWords } from "./Reveal";
import RevenueMachine from "./RevenueMachine";

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

/**
 * Pinned while the exploded machine assembles — seven plates, pulled apart
 * along their own axis, converge into one unit as you scroll. The four
 * credibility callouts that used to be plain cards now land wired directly
 * to the layer of the machine each one describes (see RevenueMachine.tsx).
 */
export default function Edge() {
  const { sectionRef, pinRef, progressMV, scrubbed } = usePinnedSteps(1, {
    stepVh: 120,
    tailVh: 30,
  });
  const peak = usePeak(progressMV);

  return (
    <section ref={sectionRef} className="relative border-t border-[var(--glass-border)]">
      {/* pt-24 (well past the nav's 112px blur scrim, h-28) so the heading's
          first line doesn't sit half-washed-out under it while pinned. */}
      <div ref={pinRef} className="px-5 pb-14 pt-24 sm:px-6 sm:pt-24 lg:pb-10 lg:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-4">
            <div>
              <span className="mono text-[11px] uppercase tracking-[0.2em] text-[#22d3ee]">
                The edge
              </span>
              <h2 className="mt-3 text-balance text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-3xl lg:text-[2.1rem]">
                <RevealWords text="A rare combination, not a generic agency." />
              </h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[var(--text-dim)]">
                Plenty of firms can run ads. Very few bring Salesforce
                administration, Qualtrics customer-experience work,
                analytics, automation, and AI workflow design to the same
                table — which is exactly what rebuilding a lead-generation
                system takes.
              </p>
            </div>

            <RevenueMachine peak={peak} scrubbed={scrubbed} />
          </div>

          <div className="mt-8 border-t border-[var(--glass-border)] pt-6">
            <h3 className="mono mb-3 text-[10px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Where we start · B2B manufacturing
            </h3>
            <ul className="flex flex-wrap gap-2">
              {industries.map((ind, i) => (
                <Reveal key={ind} as="li" delay={i * 0.05}>
                  <span className="glass sheen inline-block rounded-xl px-3.5 py-2 text-[13px] text-[rgba(233,238,255,0.82)]">
                    {ind}
                  </span>
                </Reveal>
              ))}
            </ul>
            <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-[var(--text-faint)]">
              Manufacturing, aviation, CRM systems, customer experience, and
              marketing analytics — domains we have already worked inside, so
              the discovery call starts at the second question.
            </p>
          </div>

          {/* Tool marquee */}
          <div className="marquee-mask mt-8 overflow-hidden border-y border-[var(--glass-border)] py-6">
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
      </div>
    </section>
  );
}
