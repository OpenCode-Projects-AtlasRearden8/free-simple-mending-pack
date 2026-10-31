#!/usr/bin/env node

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const sheets = [
  "sew-a-button-card",
  "patch-knees",
  "hem-pants-guide",
  "fallen-hem-fixes",
  "zipper-smarts",
  "hole-darning-practice",
  "thread-needle-cheat-chart",
  "repair-decision-card",
  "sewing-kit-checklist",
];

const root = __dirname;
const srcDir = path.join(root, "src", "sheets");
const outDir = path.join(root, "printables");

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      execFileSync(c, ["--version"], { stdio: "pipe" });
      return c;
    } catch {
      continue;
    }
  }
  throw new Error(
    "No Chrome/Chromium found. Install google-chrome or set CHROME_PATH to its binary."
  );
}

function buildSheet(chrome, sheet) {
  const html = path.join(srcDir, sheet + ".html");
  if (!fs.existsSync(html)) {
    throw new Error("Missing source sheet: " + html);
  }
  const pdf = path.join(outDir, sheet + ".pdf");
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--no-pdf-header-footer",
      "--print-to-pdf=" + pdf,
      "file://" + html,
    ],
    { stdio: ["ignore", "pipe", "pipe"], timeout: 120000 }
  );
  if (!fs.existsSync(pdf)) {
    throw new Error("Chrome did not produce " + pdf);
  }
  const size = fs.statSync(pdf).size;
  if (size < 1024) {
    throw new Error("Suspiciously small PDF: " + pdf + " (" + size + " bytes)");
  }
  console.log("built " + path.relative(root, pdf) + " (" + size + " bytes)");
}

function main() {
  const chrome = findChrome();
  fs.mkdirSync(outDir, { recursive: true });
  for (const sheet of sheets) {
    buildSheet(chrome, sheet);
  }
  console.log("done: " + sheets.length + " PDFs in printables/");
}

main();
