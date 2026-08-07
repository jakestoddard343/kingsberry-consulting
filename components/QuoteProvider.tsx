"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { projectOptions, retainer } from "@/lib/content";

/**
 * Shared state between the engagement picker and the lead form.
 *
 * The picker and the form are siblings on the page, so whatever a visitor
 * checks upstairs has to be readable downstairs — otherwise they select four
 * outcomes and then get asked what they need all over again, which is the
 * fastest way to lose a filled-in form.
 */

type Quote = {
  selected: Set<string>;
  toggle: (id: string) => void;
  clear: () => void;

  otherOn: boolean;
  toggleOther: () => void;
  otherText: string;
  setOtherText: (v: string) => void;

  wantsRetainer: boolean;
  toggleRetainer: () => void;

  /** Human-readable labels for everything selected, for the form summary. */
  summary: string[];
  count: number;
};

const QuoteContext = createContext<Quote | null>(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider");
  return ctx;
}

export default function QuoteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [otherOn, setOtherOn] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [wantsRetainer, setWantsRetainer] = useState(false);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelected(new Set());
    setOtherOn(false);
    setOtherText("");
  }, []);

  const value = useMemo<Quote>(() => {
    const labels = projectOptions
      .filter((o) => selected.has(o.id))
      .map((o) => o.label);

    if (otherOn) labels.push(otherText.trim() ? otherText.trim() : "Something else");
    if (wantsRetainer) labels.push(retainer.name);

    return {
      selected,
      toggle,
      clear,
      otherOn,
      toggleOther: () => setOtherOn((v) => !v),
      otherText,
      setOtherText,
      wantsRetainer,
      toggleRetainer: () => setWantsRetainer((v) => !v),
      summary: labels,
      count: selected.size + (otherOn ? 1 : 0),
    };
  }, [selected, toggle, clear, otherOn, otherText, wantsRetainer]);

  return (
    <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
  );
}
