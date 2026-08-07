"use client";

/**
 * A small scene under each step of the automation chain, showing what that
 * step actually produces rather than restating its label.
 *
 * Each is a fixed 120×72 viewBox so the six sit on a consistent baseline. They
 * are pure SVG with no timers: `done` drives every transition, so the chain's
 * scrub position is the only thing animating them.
 */

const OFF = "rgba(233,238,255,0.22)";

function Frame({
  done,
  children,
}: {
  done: boolean;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 120 72"
      className="mt-3 h-[62px] w-full"
      aria-hidden="true"
      style={{
        opacity: done ? 1 : 0.45,
        transition: "opacity 500ms ease",
      }}
    >
      {children}
    </svg>
  );
}

/** 01 — a form with its fields filling in and a submit button lighting up. */
function FormGraphic({ done }: { done: boolean }) {
  return (
    <Frame done={done}>
      <rect
        x="14" y="6" width="92" height="60" rx="6"
        fill="rgba(255,255,255,0.03)"
        stroke={done ? "#7ea6ff" : OFF}
        strokeWidth="1.2"
        style={{ transition: "stroke 500ms ease" }}
      />
      {[18, 30, 42].map((y, i) => (
        <rect
          key={y}
          x="22" y={y} height="6" rx="3"
          width={done ? [56, 68, 44][i] : 10}
          fill={done ? "rgba(158,183,255,0.55)" : OFF}
          style={{ transition: `all 420ms ease ${i * 90}ms` }}
        />
      ))}
      <rect
        x="22" y="52" width="34" height="10" rx="5"
        fill={done ? "#4f6bff" : OFF}
        style={{ transition: "fill 500ms ease 300ms" }}
      />
    </Frame>
  );
}

/** 02 — a CRM record card written into a list. */
function RecordGraphic({ done }: { done: boolean }) {
  return (
    <Frame done={done}>
      {[6, 26].map((y) => (
        <rect
          key={y}
          x="14" y={y} width="92" height="16" rx="4"
          fill="rgba(255,255,255,0.03)"
          stroke={OFF}
          strokeWidth="1"
        />
      ))}
      <rect
        x="14" y="46" width="92" height="18" rx="4"
        fill={done ? "rgba(79,107,255,0.16)" : "rgba(255,255,255,0.03)"}
        stroke={done ? "#7ea6ff" : OFF}
        strokeWidth="1.2"
        style={{ transition: "all 500ms ease" }}
      />
      <circle
        cx="24" cy="55" r="4"
        fill={done ? "#34e5b0" : OFF}
        style={{ transition: "fill 500ms ease 200ms" }}
      />
      <rect
        x="33" y="52" height="6" rx="3"
        width={done ? 52 : 0}
        fill="rgba(205,216,255,0.7)"
        style={{ transition: "width 450ms ease 250ms" }}
      />
    </Frame>
  );
}

/** 03 — a score dial sweeping up, with routing arrows. */
function ScoreGraphic({ done }: { done: boolean }) {
  const ARC = 88;
  return (
    <Frame done={done}>
      <path
        d="M22 52 A26 26 0 0 1 74 52"
        fill="none" stroke={OFF} strokeWidth="6" strokeLinecap="round"
      />
      <path
        d="M22 52 A26 26 0 0 1 74 52"
        fill="none" stroke="#34e5b0" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={ARC}
        strokeDashoffset={done ? ARC * 0.13 : ARC}
        style={{ transition: "stroke-dashoffset 700ms ease" }}
      />
      <text
        x="48" y="50" textAnchor="middle" fontSize="15" fontWeight="600"
        fill={done ? "#ffffff" : OFF}
        style={{ transition: "fill 500ms ease" }}
      >
        {done ? "87" : "—"}
      </text>
      <path
        d="M84 34 H104 M96 27 l8 7 -8 7"
        fill="none"
        stroke={done ? "#7ea6ff" : OFF}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: "stroke 500ms ease 300ms" }}
      />
    </Frame>
  );
}

/** 04 — a rep avatar picking up a notification. */
function AlertGraphic({ done }: { done: boolean }) {
  return (
    <Frame done={done}>
      <circle
        cx="38" cy="30" r="13"
        fill={done ? "rgba(79,107,255,0.2)" : "rgba(255,255,255,0.03)"}
        stroke={done ? "#7ea6ff" : OFF}
        strokeWidth="1.2"
        style={{ transition: "all 500ms ease" }}
      />
      <circle cx="38" cy="26" r="4.5" fill={done ? "#9db4ff" : OFF}
              style={{ transition: "fill 500ms ease" }} />
      <path d="M30 40 a8 8 0 0 1 16 0" fill={done ? "#9db4ff" : OFF}
            style={{ transition: "fill 500ms ease" }} />
      <circle
        cx="49" cy="20" r="6"
        fill={done ? "#ff5c7a" : "transparent"}
        style={{ transition: "fill 400ms ease 250ms" }}
      />
      {done && (
        <text x="49" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
          1
        </text>
      )}
      {[62, 62, 62].map((x, i) => (
        <rect
          key={i}
          x={x} y={22 + i * 11} height="5" rx="2.5"
          width={done ? [40, 32, 24][i] : 8}
          fill="rgba(205,216,255,0.45)"
          style={{ transition: `width 420ms ease ${300 + i * 80}ms` }}
        />
      ))}
    </Frame>
  );
}

/** 05 — an email leaving the outbox. */
function EmailGraphic({ done }: { done: boolean }) {
  return (
    <Frame done={done}>
      <rect
        x="18" y="18" width="62" height="40" rx="5"
        fill={done ? "rgba(168,85,247,0.14)" : "rgba(255,255,255,0.03)"}
        stroke={done ? "#c9a4ff" : OFF}
        strokeWidth="1.2"
        style={{ transition: "all 500ms ease" }}
      />
      <path
        d="M18 24 L49 42 L80 24"
        fill="none"
        stroke={done ? "#c9a4ff" : OFF}
        strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: "stroke 500ms ease" }}
      />
      <path
        d="M86 38 H108 M100 31 l8 7 -8 7"
        fill="none"
        stroke={done ? "#34e5b0" : OFF}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{
          transition: "stroke 500ms ease 250ms, transform 500ms ease 250ms",
          transform: done ? "translateX(0)" : "translateX(-6px)",
        }}
      />
    </Frame>
  );
}

/** 06 — a calendar with the booked slot filled. */
function CalendarGraphic({ done }: { done: boolean }) {
  return (
    <Frame done={done}>
      <rect
        x="20" y="12" width="80" height="52" rx="6"
        fill="rgba(255,255,255,0.03)"
        stroke={done ? "#34e5b0" : OFF}
        strokeWidth="1.2"
        style={{ transition: "stroke 500ms ease" }}
      />
      <line x1="20" y1="26" x2="100" y2="26" stroke={done ? "#34e5b0" : OFF}
            strokeWidth="1.2" style={{ transition: "stroke 500ms ease" }} />
      <line x1="36" y1="8" x2="36" y2="16" stroke={done ? "#34e5b0" : OFF}
            strokeWidth="2.4" strokeLinecap="round"
            style={{ transition: "stroke 500ms ease" }} />
      <line x1="84" y1="8" x2="84" y2="16" stroke={done ? "#34e5b0" : OFF}
            strokeWidth="2.4" strokeLinecap="round"
            style={{ transition: "stroke 500ms ease" }} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const booked = i === 4;
        return (
          <rect
            key={i}
            x={29 + (i % 3) * 25}
            y={33 + Math.floor(i / 3) * 15}
            width="17" height="10" rx="2.5"
            fill={
              booked && done
                ? "#34e5b0"
                : "rgba(255,255,255,0.08)"
            }
            style={{ transition: `fill 400ms ease ${booked ? 350 : 0}ms` }}
          />
        );
      })}
    </Frame>
  );
}

const GRAPHICS = [
  FormGraphic,
  RecordGraphic,
  ScoreGraphic,
  AlertGraphic,
  EmailGraphic,
  CalendarGraphic,
];

export default function FlowStepGraphic({
  index,
  done,
}: {
  index: number;
  done: boolean;
}) {
  const G = GRAPHICS[index];
  return G ? <G done={done} /> : null;
}
