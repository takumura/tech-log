#!/usr/bin/env node
// publish-sync.mjs — copy only notes marked `publish: true` into content/, then npx quartz sync.
// Usage: node scripts/publish-sync.mjs [--dry-run] [--no-sync]
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const VAULT = "D:/github-repos/Obsidian-Notebook/Notebook";
const CONTENT = path.resolve("content"); // run from the tech-log repo root
const DRY = process.argv.includes("--dry-run");
const DO_SYNC = !process.argv.includes("--no-sync");
const EXCLUDE_TOP = new Set(["00_Trash", "01_Rules", ".obsidian"]);
const IMG_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif", "mp4", "pdf", "webm"]);

function hasPublishFlag(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return false;
  return /^\s*publish:\s*"?true"?\s*$/im.test(m[1]);
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (EXCLUDE_TOP.has(e.name)) continue;
      walk(path.join(dir, e.name), out);
    } else if (e.isFile() && e.name.endsWith(".md")) out.push(path.join(dir, e.name));
  }
  return out;
}

// index for asset resolution: basename -> absolute path (first match wins)
const assetIndex = new Map();
function indexAssets(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (EXCLUDE_TOP.has(e.name)) continue;
      indexAssets(path.join(dir, e.name));
    } else {
      const ext = path.extname(e.name).slice(1).toLowerCase();
      if (IMG_EXT.has(ext) && !assetIndex.has(path.basename(e.name).toLowerCase())) {
        assetIndex.set(path.basename(e.name).toLowerCase(), path.join(dir, e.name));
      }
    }
  }
}
indexAssets(VAULT);

const mdFiles = walk(VAULT);
const noteIndex = new Map();
for (const f of mdFiles) noteIndex.set(path.basename(f).toLowerCase(), f);

const targets = mdFiles.filter((f) => hasPublishFlag(fs.readFileSync(f, "utf8")));
const warnings = [];
const plan = [];

for (const src of targets) {
  const rel = path.relative(VAULT, src);
  plan.push({ src, dest: path.join(CONTENT, rel) });
  // embedded assets referenced by this note: ![[name]] / ![[name|alt]]
  const text = fs.readFileSync(src, "utf8");
  for (const m of text.matchAll(/!\[\[([^\]|#]+)/g)) {
    const key = path.basename(m[1]).toLowerCase();
    if (noteIndex.has(key) || noteIndex.has(key + ".md")) {
      warnings.push(`text transclusion needs target flagged too: ![[${m[1]}]] <- ${rel}`);
      continue;
    }
    const hit = assetIndex.get(key);
    if (!hit) { warnings.push(`missing asset: ${m[1]} <- ${rel}`); continue; }
    plan.push({ src: hit, dest: path.join(CONTENT, path.relative(VAULT, hit)) });
  }
  // links to notes not flagged for publish -> Quartz renders as plain text; informational
  for (const m of text.matchAll(/\[\[([^\]|#]+)/g)) {
    const key = path.basename(m[1]).toLowerCase();
    const hit = noteIndex.get(key) || noteIndex.get(key + ".md");
    if (hit && !targets.includes(hit)) warnings.push(`link to unflagged note: [[${m[1]}]] <- ${rel}`);
  }
}

console.log(`publish:true notes: ${targets.length}, copies: ${plan.length}`);
for (const p of plan) console.log(`copy ${path.relative(VAULT, p.src)} -> content/${p.dest.split(CONTENT)[1] ?? ""}`);
for (const w of warnings) console.log(`WARN ${w}`);

if (DRY) process.exit(0);

// content/ must contain ONLY what this run produced: drop anything else (managed types only), then copy fresh
const managed = new Set([".md", ...IMG_EXT].map((x) => "." + x.replace(/^\./, "")));
const planSet = new Set(plan.map((p) => path.resolve(p.dest)));
function walkFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(f);
    else if (managed.has(path.extname(e.name).toLowerCase()) && !planSet.has(path.resolve(f))) fs.rmSync(f);
  }
}
walkFiles(CONTENT);

for (const p of plan) {
  fs.mkdirSync(path.dirname(p.dest), { recursive: true });
  fs.copyFileSync(p.src, p.dest);
}
if (DO_SYNC) {
  console.log("running: npx quartz sync");
  execSync("npx quartz sync", { stdio: "inherit" });
} else {
  console.log("skipped sync (--no-sync). Review in Obsidian/Quartz before npx quartz sync.");
}
