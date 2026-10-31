# free-simple-mending-pack

Free printable guides for confident, simple clothing mending. Every sheet is written in
plain, friendly English with kind step-by-step instructions — the way a friend would sit
next to you and talk you through it. Print at home, tape them inside a closet door, slide
them into your sewing tin.

No signups, no accounts, no tracking. The PDFs are built locally on your own machine.

## The nine printables (in `printables/`)

| File | What it gives you |
| --- | --- |
| `sew-a-button-card.pdf` | Thread-the-needle and attach-a-button, step by step |
| `patch-knees.pdf` | Iron-on and sew-on methods for worn or torn knees |
| `hem-pants-guide.pdf` | Measure, pin, cut (or don't cut), and slipstitch a hem |
| `fallen-hem-fixes.pdf` | The 60-second safety-pin rescue plus the proper re-stitch |
| `zipper-smarts.pdf` | Fix the four most common zipper failures by symptom |
| `hole-darning-practice.pdf` | Darning instructions plus a warm-up practice grid |
| `thread-needle-cheat-chart.pdf` | Which thread and which needle for what fabric |
| `repair-decision-card.pdf` | A calm two-question repair-or-replace decision card |
| `sewing-kit-checklist.pdf` | What a beginner sewing kit actually needs, with checkboxes |

All pages are US Letter. Print black or color as you like — the PDFs are unbranded and
there is nothing to sign up for.

## Build it yourself (all local)

Requirements: Node.js and any Chrome or Chromium (Google Chrome works). Nothing is
downloaded from the network during the build; there are no npm dependencies.

```sh
npm run build    # rebuilds every PDF from the HTML/CSS sources into printables/
npm test         # builds from scratch and verifies every PDF is valid
```

The build script (`build.js`) renders each HTML sheet in `src/sheets/` through headless
Chrome's print-to-PDF. The test script (`test/build.test.js`) rebuilds everything from a
clean `printables/` folder and checks each PDF for:

- a valid PDF header and trailer
- a clean `pdfinfo` parse with at least one page
- a real text layer containing the key instructions for that sheet
- exact US Letter page size
- no branding or personal data anywhere in the output
- no stray files left in `printables/`

You can also open any sheet in `src/sheets/` in a normal browser and print it yourself —
the sources are plain HTML and CSS with a print-ready stylesheet.

## Changes and fixes

Edit an HTML file in `src/sheets/` or the shared stylesheet `src/style.css`, then run
`npm run build`. If you're adding a new sheet, add its filename (without `.html`) to the
`sheets` list at the top of `build.js` and the expectations table in
`test/build.test.js`.

## Project family

This pack is a companion to the free-home-labeling-kit: label what you own, then mend
what you love. Both are designed the same way — free, offline, beginner-friendly, and
free of signups.

## License

MIT — see `LICENSE`. Copyright (c) 2026 Asdale Dynamics, LLC. This project is part of
Asdale Dynamics, LLC's beginner-friendly library of plain-English guides and practical
tools. Healthcare and everyday-life content in these printables is general education
only, never medical advice.
