# CSS layering note

`editorial-redesign.css` establishes the new design tokens and visual direction. `editorial-fix.css` is imported immediately after it to neutralize the old fixed-shell and fixed homepage card geometry that would otherwise win through selector specificity. These are temporary migration layers; once rendered QA is stable, consolidate legacy Stitch files rather than continuing to stack overrides.
