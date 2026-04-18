/**
 * NoorCast Etsy Package Builder
 * Renders HTML printables to PNG and builds the final ZIP
 *
 * Usage: node build-package.js
 * Requires: @playwright/test (already in devDependencies)
 *
 * v0.9.5 update: ZIP_DIR + version refs bumped to v0.9 (Reels arc). The legacy
 * NoorCast-v0.7/ directory and NoorCast-v0.7.zip stay in the repo as
 * historical artifacts until the next build run replaces them.
 *
 * To regenerate the v0.9 ZIP for the Etsy listing, run:
 *   1. npm install (if @playwright/test isn't in node_modules)
 *   2. node etsy-package/build-package.js
 *   3. Upload etsy-package/NoorCast-v0.9.zip to your Etsy listing
 *   4. (optional) Delete the old NoorCast-v0.7/ + .zip if you don't
 *      want to ship the legacy version anymore
 */

import { chromium } from '@playwright/test';
import { execSync } from 'child_process';
import { mkdirSync, existsSync, copyFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const PKG = resolve(import.meta.dirname);
const OUT = resolve(PKG, 'output');
const ZIP_DIR = resolve(PKG, 'NoorCast-v0.9');

// Ensure output dirs
mkdirSync(OUT, { recursive: true });
mkdirSync(join(ZIP_DIR, 'printables'), { recursive: true });
mkdirSync(join(ZIP_DIR, 'etsy-mockups'), { recursive: true });
// v0.10.4: assets/ and firmware/ subdirs needed for the new layout
mkdirSync(join(ZIP_DIR, 'assets'), { recursive: true });
mkdirSync(join(ZIP_DIR, 'firmware'), { recursive: true });

async function renderHTML(browser, htmlFile, outputPng, opts = {}) {
  const page = await browser.newPage({
    viewport: {
      width: opts.width || 794,   // A4 at 96dpi
      height: opts.height || 1123
    },
    deviceScaleFactor: opts.scale || 2
  });
  await page.goto(`file://${resolve(PKG, htmlFile)}`, { waitUntil: 'networkidle' });

  // Wait for fonts
  await page.waitForTimeout(2000);

  if (opts.fullPage) {
    await page.screenshot({ path: outputPng, fullPage: true });
  } else {
    await page.screenshot({ path: outputPng });
  }
  await page.close();
  console.log(`  ✓ ${outputPng.split('/').pop()}`);
}

async function renderMockups(browser) {
  const page = await browser.newPage({
    viewport: { width: 2000, height: 1500 },
    deviceScaleFactor: 1
  });
  await page.goto(`file://${resolve(PKG, 'etsy-listing-mockups.html')}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const mockups = await page.$$('.mockup');
  for (let i = 0; i < mockups.length; i++) {
    const path = join(OUT, `etsy-mockup-${i + 1}.png`);
    await mockups[i].screenshot({ path });
    console.log(`  ✓ etsy-mockup-${i + 1}.png`);
  }
  await page.close();
}

async function main() {
  console.log('\n🎬 NoorCast Etsy Package Builder\n');
  console.log('📦 Rendering printables to PNG...\n');

  const browser = await chromium.launch();

  // 1. Quick-Start Card (A4 portrait)
  await renderHTML(browser, 'quickstart-card.html', join(OUT, 'quickstart-card.png'));

  // 2. Shortcuts Cheat Sheet (A4 landscape)
  await renderHTML(browser, 'shortcuts-cheatsheet.html', join(OUT, 'shortcuts-cheatsheet.png'), {
    width: 1123, height: 794  // landscape
  });

  // 3. Classroom Poster (A3 portrait)
  await renderHTML(browser, 'classroom-poster.html', join(OUT, 'classroom-poster.png'), {
    width: 1123, height: 1587  // A3
  });

  // 4. Lesson Plan (A4 portrait, full page = 2 pages)
  await renderHTML(browser, 'lesson-plan-template.html', join(OUT, 'lesson-plan-template.png'), {
    fullPage: true
  });

  // 5. Sticker Sheet (A4 portrait)
  await renderHTML(browser, 'sticker-sheet.html', join(OUT, 'sticker-sheet.png'));

  // 6. README Quick-Start (A4 portrait)
  await renderHTML(browser, 'README-quickstart.html', join(OUT, 'README-quickstart.png'));

  // 7. Etsy listing mockups (2000x1500 each)
  console.log('\n🖼️  Rendering Etsy listing mockups...\n');
  await renderMockups(browser);

  await browser.close();

  // Build ZIP structure
  console.log('\n📁 Building ZIP structure...\n');

  // Copy app files
  const appFiles = [
    'index.html', 'noorcast.js', 'style.css', 'sw.js',
    'icon.svg', 'assets/logo.svg', 'manifest.json',
    'docs/guide.html', 'docs/cheatsheet.html', 'docs/faq.html', 'docs/start.html',
    'firmware/makecode.ts', 'assets/workshop-diy-logo.svg'
  ];
  for (const f of appFiles) {
    const src = join(ROOT, f);
    if (existsSync(src)) {
      copyFileSync(src, join(ZIP_DIR, f));
      console.log(`  ✓ ${f}`);
    }
  }

  // Copy fonts dir if exists
  const fontsDir = join(ROOT, 'fonts');
  if (existsSync(fontsDir)) {
    mkdirSync(join(ZIP_DIR, 'fonts'), { recursive: true });
    for (const f of readdirSync(fontsDir)) {
      copyFileSync(join(fontsDir, f), join(ZIP_DIR, 'fonts', f));
    }
    console.log('  ✓ fonts/');
  }

  // Copy LICENSE
  copyFileSync(join(PKG, 'LICENSE.txt'), join(ZIP_DIR, 'LICENSE.txt'));
  console.log('  ✓ LICENSE.txt');

  // Copy flyer
  const flyer = join(ROOT, 'assets/noorcast-flyer.png');
  if (existsSync(flyer)) {
    copyFileSync(flyer, join(ZIP_DIR, 'assets/noorcast-flyer.png'));
    console.log('  ✓ noorcast-flyer.png');
  }

  // Copy printable PNGs
  const printables = [
    'quickstart-card.png', 'shortcuts-cheatsheet.png',
    'classroom-poster.png', 'lesson-plan-template.png',
    'sticker-sheet.png', 'README-quickstart.png'
  ];
  for (const f of printables) {
    const src = join(OUT, f);
    if (existsSync(src)) {
      copyFileSync(src, join(ZIP_DIR, 'printables', f));
    }
  }
  console.log('  ✓ printables/ (6 files)');

  // Copy printable HTML source files too (for editing)
  const htmlSources = [
    'quickstart-card.html', 'shortcuts-cheatsheet.html',
    'classroom-poster.html', 'lesson-plan-template.html',
    'sticker-sheet.html', 'README-quickstart.html'
  ];
  for (const f of htmlSources) {
    copyFileSync(join(PKG, f), join(ZIP_DIR, 'printables', f));
  }
  console.log('  ✓ printables/ HTML sources (6 files)');

  // Copy etsy mockup PNGs
  for (let i = 1; i <= 7; i++) {
    const f = `etsy-mockup-${i}.png`;
    const src = join(OUT, f);
    if (existsSync(src)) {
      copyFileSync(src, join(ZIP_DIR, 'etsy-mockups', f));
    }
  }
  console.log('  ✓ etsy-mockups/ (7 files)');

  // Create ZIP
  console.log('\n📦 Creating ZIP archive...\n');
  const zipPath = join(PKG, 'NoorCast-v0.9.zip');
  try {
    execSync(`cd "${PKG}" && zip -r "${zipPath}" NoorCast-v0.9/`, { stdio: 'pipe' });
    console.log(`  ✅ ${zipPath}`);
  } catch {
    console.log('  ⚠️  zip command not available, trying ditto...');
    try {
      execSync(`cd "${PKG}" && ditto -c -k --keepParent NoorCast-v0.9 "${zipPath}"`, { stdio: 'pipe' });
      console.log(`  ✅ ${zipPath}`);
    } catch {
      console.log('  ❌ Could not create ZIP. Manually zip the NoorCast-v0.9 folder.');
    }
  }

  // Show final size
  try {
    const size = execSync(`du -sh "${zipPath}" 2>/dev/null || echo "N/A"`).toString().trim();
    console.log(`\n📊 ZIP size: ${size.split('\t')[0]}`);
  } catch { /* ignore */ }

  console.log('\n🎉 Done! Your Etsy package is ready.\n');
  console.log('Files:');
  console.log(`  📦 ZIP:      ${zipPath}`);
  console.log(`  📁 Folder:   ${ZIP_DIR}/`);
  console.log(`  🖼️  Mockups:  ${join(OUT, 'etsy-mockup-*.png')}`);
  console.log(`  🖨️  Prints:   ${join(OUT, '*.png')}`);
  console.log('');
}

main().catch(console.error);
