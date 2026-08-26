"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { QUICK_HELP_NODES, QUICK_HELP_ROOT_ID } from "./data";

const PANEL_ID = "quick-help-panel";
const TITLE_ID = "quick-help-title";
const ANSWER_ID = "quick-help-answer";

export function QuickHelp() {
  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState(QUICK_HELP_ROOT_ID);
  const [history, setHistory] = useState<string[]>([]);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const node = useMemo(() => QUICK_HELP_NODES[nodeId] ?? QUICK_HELP_NODES[QUICK_HELP_ROOT_ID], [nodeId]);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      requestAnimationFrame(() => launcherRef.current?.focus());
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }

  function go(nextId: string) {
    if (!QUICK_HELP_NODES[nextId]) return;
    setHistory((items) => [...items.slice(-5), node.id]);
    setNodeId(nextId);
  }

  function back() {
    const previous = history.at(-1);
    if (!previous) {
      setNodeId(QUICK_HELP_ROOT_ID);
      return;
    }
    setHistory((items) => items.slice(0, -1));
    setNodeId(previous);
  }

  function reset() {
    setNodeId(QUICK_HELP_ROOT_ID);
    setHistory([]);
  }

  const atRoot = nodeId === QUICK_HELP_ROOT_ID && history.length === 0;

  return (
    <aside className="quickHelp" aria-label="Free Korea Quick Help">
      {open ? (
        <section
          id={PANEL_ID}
          className="quickHelpPanel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={TITLE_ID}
          aria-describedby={ANSWER_ID}
        >
          <div className="quickHelpHeader">
            <div>
              <small>FREE · NO AI API</small>
              <strong id={TITLE_ID}>{node.title}</strong>
            </div>
            <button ref={closeRef} type="button" className="quickHelpIconButton" onClick={close} aria-label="Close Quick Help">×</button>
          </div>

          <div className="quickHelpBody">
            <p id={ANSWER_ID} aria-live="polite" aria-atomic="true">{node.answer}</p>
            {node.choices?.length ? (
              <div className="quickHelpChoices" aria-label={`Questions about ${node.title}`}>
                {node.choices.map((choice) => (
                  <button key={choice.nextId} type="button" onClick={() => go(choice.nextId)}>{choice.label}</button>
                ))}
              </div>
            ) : null}
            {node.cta ? <Link className="quickHelpCta" href={node.cta.href} onClick={close}>{node.cta.label} →</Link> : null}
          </div>

          <div className="quickHelpFooter">
            <button type="button" onClick={back} disabled={atRoot}>Back</button>
            <button type="button" onClick={reset} disabled={atRoot}>Topics</button>
            <span aria-label="Cost: zero credits">0 credits</span>
          </div>
        </section>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        className="quickHelpLauncher"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true">?</span>
        <span><strong>Quick Help</strong><small>Free answers</small></span>
      </button>
    </aside>
  );
}
