#!/usr/bin/env node

const assert = require("assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "printables");
const buildJs = path.join(root, "build.js");

const expectations = {
  "sew-a-button-card": ["button", "knot", "buttonhole"],
  "patch-knees": ["iron-on patch", "knee", "whipstitch"],
  "hem-pants-guide": ["hem", "slipstitch", "pin"],
  "fallen-hem-fixes": ["safety pin", "hem", "slipstitch"],
  "zipper-smarts": ["zipper", "slider", "teeth"],
  "hole-darning-practice": ["darn", "weave", "gr"],
  "thread-needle-cheat-chart": ["thread", "needle", "tapestry"],
  "repair-decision-card": ["repair", "replace", "20-minute"],
  "sewing-kit-checklist": ["scissors", "seam ripper", "thread"],
};

const brandTerms = ["asdale", "dynamics", "dylan", "opencode"];

function pdfInfo(pdf) {
  const out = execFileSync("pdfinfo", [pdf], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const pages = /Pages:\s+(\d+)/.exec(out);
  const size = /Page size:\s+([\d.]+ x [\d.]+)/.exec(out);
  const errors = out.match(/.*(rror|orrupt).*$/gim) || [];
  return {
    pageCount: pages ? parseInt(pages[1], 10) : 0,
    pageSize: size ? size[1].replace(/\s+/g, " ") : "",
    errors,
  };
}

function pdfText(pdf) {
  return execFileSync("pdftotext", [pdf, "-"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).toLowerCase();
}

function looksLikeTrailer(pdf) {
  const buf = fs.readFileSync(pdf);
  const head = buf.subarray(0, 8).toString("ascii");
  const tail = buf.subarray(buf.length - 2048).toString("latin1");
  assert.ok(head.startsWith("%PDF-"), pdf + ": missing %PDF header");
  assert.ok(tail.includes("%%EOF"), pdf + ": missing %%EOF trailer");
  return { buffer: buf };
}

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log("ok   " + name);
  } catch (e) {
    failed++;
    failures.push(name + ": " + e.message);
    console.log("FAIL " + name);
  }
}

test("build.js runs and produces a PDF for each of the " + Object.keys(expectations).length + " sheets", () => {
  fs.rmSync(outDir, { recursive: true, force: true });
  execFileSync("node", [buildJs], { cwd: root, encoding: "utf8" });
  for (const sheet of Object.keys(expectations)) {
    const pdf = path.join(outDir, sheet + ".pdf");
    assert.ok(fs.existsSync(pdf), "missing " + pdf);
  }
});

for (const sheet of Object.keys(expectations)) {
  test(sheet + " pdf is structurally valid", () => {
    const pdf = path.join(outDir, sheet + ".pdf");
    looksLikeTrailer(pdf);
    const info = pdfInfo(pdf);
    assert.strictEqual(info.errors.length, 0, "pdfinfo reported errors");
    assert.ok(info.pageCount >= 1, pdf + " has no pages");
  });

  test(sheet + " pdf has rendered text content", () => {
    const pdf = path.join(outDir, sheet + ".pdf");
    const text = pdfText(pdf);
    assert.ok(text.trim().length > 100, pdf + " seems to have no text layer");
    for (const word of expectations[sheet]) {
      assert.ok(text.includes(word), pdf + " missing expected phrase: " + word);
    }
  });

  test(sheet + " pages are US Letter size", () => {
    const pdf = path.join(outDir, sheet + ".pdf");
    const info = pdfInfo(pdf);
    assert.ok(
      /^612(\.\d+)? x 792(\.\d+)?$/.test(info.pageSize),
      "unexpected page size: " + info.pageSize
    );
  });

  test(sheet + " pdf is unbranded", () => {
    const pdf = path.join(outDir, sheet + ".pdf");
    const text = pdfText(pdf);
    for (const term of brandTerms) {
      assert.ok(!text.includes(term), pdf + " contains branding term: " + term);
    }
  });
}

test("no stray files in printables/", () => {
  const files = fs
    .readdirSync(outDir)
    .filter((f) => !f.startsWith("."))
    .sort();
  const expected = Object.keys(expectations)
    .map((s) => s + ".pdf")
    .sort();
  assert.deepStrictEqual(files, expected, "unexpected files in printables/: " + files.join(", "));
});

console.log("");
if (failures.length) {
  console.log(failures.join("\n"));
  process.exit(1);
}
console.log(passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
