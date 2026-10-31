# STATUS — free-simple-mending-pack

Last updated: 2026-10-31

## What was built

A free, local-only printable pack of nine mending guides for beginners, written in a
plain, friendly, step-by-step voice. HTML/CSS sources print to unbranded PDFs through a
single build script; no signups, no network calls, no npm dependencies.

### The nine sheets (sources in `src/sheets/`, PDFs in `printables/`)

1. `sew-a-button-card` — thread-the-needle and attach-a-button walkthrough
2. `patch-knees` — iron-on and sew-on methods for worn or torn knees
3. `hem-pants-guide` — measure, pin, fold, slipstitch (includes a no-cut option)
4. `fallen-hem-fixes` — 60-second safety-pin rescue plus a proper re-stitch
5. `zipper-smarts` — fixes for the four most common zipper failures, by symptom
6. `hole-darning-practice` — darning steps plus a printable warm-up practice grid
7. `thread-needle-cheat-chart` — which thread and which needle for which fabric
8. `repair-decision-card` — a calm repair-or-replace decision card (two questions)
9. `sewing-kit-checklist` — beginner sewing kit shopping checklist with checkboxes

### Supporting files

- `build.js` — renders every sheet through headless Chrome (`--print-to-pdf`) into
  `printables/`. Honors `CHROME_PATH` if Chrome isn't named `google-chrome`.
- `src/style.css` — shared print-ready stylesheet (US Letter, numbered steps, checkboxes,
  practice grid). PDFs are unbranded by design.
- `test/build.test.js` — rebuilds `printables/` from scratch, then validates every PDF.
- `README.md`, `LICENSE` (MIT, Copyright (c) 2026 Asdale Dynamics, LLC), `package.json`,
  `.gitignore`.
- Companion project: free-home-labeling-kit (labels what you own; this pack mends it).

## How to run it

```sh
npm run build    # rebuild all 9 PDFs from src/sheets/ into printables/
npm test         # clean rebuild + full validation suite
```

Requirements: Node.js (tested with v20) and any Chrome or Chromium. The build is fully
local; nothing is fetched from the npm registry or the internet.

## Verification results

- `npm run build`: builds all 9 PDFs, ~68–132 KB each, exit code 0.
- `npm test`: **38 passed, 0 failed** (exit code 0). Tests assert, per sheet:
  - clean rebuild of `printables/` from scratch
  - valid PDF header (`%PDF-`) and trailer (`%%EOF`)
  - clean `pdfinfo` parse with at least one page
  - PDF text layer contains that sheet's key instructions (via `pdftotext`)
  - exact US Letter page size (612 x 792 pt)
  - no branding terms (unbranded) in the extracted text
  - no stray files in `printables/`
- Page-count sanity check: seven sheets are single-page; hem-pants-guide,
  hole-darning-practice, and thread-needle-cheat-chart are two pages by design (the
  darning practice grids break intentionally onto their own page).

## Commit

- Repository initialized with `main` branch.
- Commit `5c4cb6d` "Add free simple mending printables: 9 HTML/CSS sheets, local PDF
  build, and tests" authored as the existing git identity (Dylan Asdale), no
  co-authored-by trailers. Not pushed; no remote configured.

## Known gaps / ideas for later

- Tests rely on the system `pdfinfo`/`pdftotext` (poppler-utils) being installed; the
  suite falls back gracefully but a CI container should preinstall poppler-utils.
- Page-break placement is tuned for US Letter at default Chrome margins; A4 printing
  works but pagination may shift a line or two.
- No dark-mode/ink-saver variant of the stylesheet yet.
- Possible future sheets: visible-mending motifs (embroidery over patches), sewing
  machine basics, replacing a zipper end-to-end, buttonhole re-stitching.
- PDFs are regenerated on `npm test`; if you edit a source and only run tests, the
  committed `printables/` files will be refreshed as part of the test run.
