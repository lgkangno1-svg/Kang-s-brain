"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QUICK_HELP_NODES, QUICK_HELP_ROOT_ID } from "./data";

export function QuickHelp() {
  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState(QUICK_HELP_ROOT_ID);
  const [history, setHistory] = useState<string[]>([]);
  const node = useMemo(() => QUICK_HELP_NODES[nodeId] ?? QUICK_HELP_NODES[QUICK_HELP_ROOT_ID], [nodeId]);

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

  return (
    <aside className="quickHelp" aria-label="Free Korea Quick Help">
      {open ? (
        <section className="quickHelpPanel" role="dialog" aria-modal="false" aria-labelledby="quick-help-title">
          <div className="quickHelpHeader">
            <div>
              <small>FREE · NO AI API</small>
              <strong id="quick-help-title">{node.title}</strong>
            </div>
            <button type="button" className="quickHelpIconButton" onClick={() => setOpen(false)} aria-label="Close Quick Help">×</button>
          </div>

          <div className="quickHelpBody" aria-live="polite">
            <p>{node.answer}</p>
            {node.choices?.length ? (
              <div className="quickHelpChoices" aria-label="Choose a question">
                {node.choices.map((choice) => (
                  <button key={choice.nextId} type="button" onClick={() => go(choice.nextId)}>{choice.label}</button>
                ))}
              </div>
            ) : null}
            {node.cta ? <Link className="quickHelpCta" href={node.cta.href} onClick={() => setOpen(false)}>{node.cta.label} →</Link> : null}
          </div>

          <div className="quickHelpFooter">
            <button type="button" onClick={back} disabled={nodeId === QUICK_HELP_ROOT_ID && history.length === 0}>Back</button>
            <button type="button" onClick={reset} disabled={nodeId === QUICK_HELP_ROOT_ID && history.length === 0}>Topics</button>
            <span>0 credits</span>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        className="quickHelpLauncher"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="quick-help-title"
      >
        <span aria-hidden="true">?</span>
        <span><strong>Quick Help</strong><small>Free answers</small></span>
      </button>
    </aside>
  );
}
