// @ts-check
import { test, expect } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════════
   NoorCast Visual Regression Tests
   Full UI coverage: splash, panels, themes, overlays, modals.
   Run:  npm test              (compare against baselines)
         npm run test:update   (regenerate baselines)
   ══════════════��════════════════════════════════════════════════════ */

// ──────────── Helpers ────────────

/** Wait for the app to finish its splash / init sequence */
async function waitForApp(page) {
  await page.goto('/');
  // Wait for stage to be visible (splash dismissed or auto-hidden)
  await page.waitForSelector('#tcStage', { state: 'visible', timeout: 10_000 });
  // Let layout settle (animations disabled globally via playwright.config.js)
  await page.waitForTimeout(500);
}

/** Select a theme via JS */
async function setTheme(page, name) {
  await page.evaluate((n) => {
    document.documentElement.setAttribute('data-theme', n);
  }, name);
  await page.waitForTimeout(300);
}

// ──────────── 1. Initial Load ────────────

test.describe('Initial Load', () => {
  test('splash screen renders', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot('01-initial-load.png');
  });

  test('main UI after splash', async ({ page }) => {
    await waitForApp(page);
    await expect(page).toHaveScreenshot('02-main-ui.png');
  });
});

// ──────────── 2. Sidebar Panels ────────────

test.describe('Sidebar Panels', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
  });

  test('sources panel (default)', async ({ page }) => {
    // Sources panel is active by default
    const panel = page.locator('#tcSidebarSources');
    await expect(panel).toBeVisible();
    await expect(page).toHaveScreenshot('03-panel-sources.png');
  });

  test('micro:bit panel', async ({ page }) => {
    await page.click('button[data-stab="microbit"]');
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('04-panel-microbit.png');
  });

  test('scenes sidebar', async ({ page }) => {
    // Right sidebar with scenes is always visible
    const scenes = page.locator('#tcScenes');
    await expect(scenes).toBeVisible();
    await expect(page).toHaveScreenshot('05-sidebar-scenes.png');
  });

  test('settings panel', async ({ page }) => {
    await page.click('#settingsBtn');
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('06-panel-settings.png');
  });
});

// ──────────── 3. Themes ────────────

test.describe('Themes', () => {
  const themes = [
    'dark', 'light', 'midnight', 'ocean', 'forest', 'sunset', 'candy', 'hacker'
  ];

  for (const theme of themes) {
    test(`theme: ${theme}`, async ({ page }) => {
      await waitForApp(page);
      await setTheme(page, theme);
      await expect(page).toHaveScreenshot(`08-theme-${theme}.png`);
    });
  }
});

// ──────────── 4. Language Switching ────────────

test.describe('Languages', () => {
  test('French (default)', async ({ page }) => {
    await waitForApp(page);
    await expect(page).toHaveScreenshot('09-lang-fr.png');
  });

  test('English', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('tc-lang', 'en'));
    await page.reload();
    await waitForApp(page);
    await expect(page).toHaveScreenshot('10-lang-en.png');
  });

  test('Arabic (RTL)', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('tc-lang', 'ar'));
    await page.reload();
    await waitForApp(page);
    await expect(page).toHaveScreenshot('11-lang-ar.png');
  });
});

// ──────────── 5. Stage & Canvas ────────────

test.describe('Stage', () => {
  test('empty stage (no sources)', async ({ page }) => {
    await waitForApp(page);
    const stage = page.locator('#tcStage');
    await expect(stage).toHaveScreenshot('12-stage-empty.png');
  });

  test('stage aspect ratio 16:9', async ({ page }) => {
    await waitForApp(page);
    const stage = page.locator('#tcStage');
    const box = await stage.boundingBox();
    if (box) {
      const ratio = box.width / box.height;
      expect(ratio).toBeGreaterThan(1.5);
      expect(ratio).toBeLessThan(1.9);
    }
  });
});

// ──────────── 6. Overlays & HUD ────────────

test.describe('Overlays', () => {
  test.beforeEach(async ({ page }) => {
    await waitForApp(page);
  });

  test('grid overlay toggle', async ({ page }) => {
    await page.evaluate(() => {
      if (typeof Grid !== 'undefined') Grid.toggle();
    });
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('13-overlay-grid.png');
  });

  test('source labels toggle', async ({ page }) => {
    await page.evaluate(() => {
      if (typeof SourceLabels !== 'undefined') SourceLabels.toggle();
    });
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('14-overlay-labels.png');
  });

  test('FPS counter toggle', async ({ page }) => {
    await page.evaluate(() => {
      if (typeof FpsCounter !== 'undefined') FpsCounter.toggle();
    });
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('15-overlay-fps.png');
  });

  test('clock overlay', async ({ page }) => {
    await page.evaluate(() => {
      if (typeof Clock !== 'undefined') Clock.toggle();
    });
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('16-overlay-clock.png');
  });

  test('letterbox overlay', async ({ page }) => {
    await page.evaluate(() => {
      if (typeof Letterbox !== 'undefined') Letterbox.toggle();
    });
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('17-overlay-letterbox.png');
  });

  test('vignette overlay', async ({ page }) => {
    await page.evaluate(() => {
      if (typeof Vignette !== 'undefined') Vignette.setVisible(true);
    });
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('18-overlay-vignette.png');
  });
});

// ──────────── 7. Teleprompter ────────────

test.describe('Teleprompter', () => {
  test('teleprompter panel open', async ({ page }) => {
    await waitForApp(page);
    await page.evaluate(() => {
      if (typeof Teleprompter !== 'undefined') Teleprompter.toggle();
    });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot('19-teleprompter.png');
  });
});

// ──────────── 8. Focus Mode ────────────

test.describe('Focus Mode', () => {
  test('focus mode hides sidebar', async ({ page }) => {
    await waitForApp(page);
    await page.evaluate(() => {
      if (typeof FocusMode !== 'undefined') FocusMode.toggle();
    });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot('20-focus-mode.png');
  });
});

// ──────────── 9. Responsive / Viewport ────────────

test.describe('Responsive', () => {
  test('narrow viewport (900x600)', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 600 });
    await waitForApp(page);
    await expect(page).toHaveScreenshot('21-responsive-narrow.png');
  });

  test('wide viewport (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await waitForApp(page);
    await expect(page).toHaveScreenshot('22-responsive-wide.png');
  });
});

// ──────────── 10. Keyboard Shortcuts Modal ────────────

test.describe('Modals', () => {
  test('keyboard shortcuts help', async ({ page }) => {
    await waitForApp(page);
    await page.keyboard.press('?');
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('23-shortcuts-modal.png');
  });
});

// ──────────── 11. Settings Sections ────────────

test.describe('Settings Sections', () => {
  test('settings panel visible', async ({ page }) => {
    await waitForApp(page);
    await page.click('#settingsBtn');
    await page.waitForTimeout(300);
    const panel = page.locator('#settingsPanel');
    await expect(panel).toBeVisible();
    await expect(page).toHaveScreenshot('24-settings-general.png');
  });

  test('settings scroll to bottom', async ({ page }) => {
    await waitForApp(page);
    await page.click('#settingsBtn');
    await page.waitForTimeout(300);
    const panel = page.locator('#settingsPanel');
    await panel.evaluate(el => el.scrollTop = el.scrollHeight);
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('25-settings-bottom.png');
  });
});

// ──────────── 12. Watermark ────────────

test.describe('Watermark', () => {
  test('watermark visible on stage', async ({ page }) => {
    await waitForApp(page);
    await page.evaluate(() => {
      if (typeof Watermark !== 'undefined') {
        Watermark.setText('NoorCast Test');
      }
    });
    await page.waitForTimeout(400);
    const stage = page.locator('#tcStage');
    await expect(stage).toHaveScreenshot('26-watermark.png');
  });
});

// ──────────── 13. Recording Controls ────────────

test.describe('Recording Controls', () => {
  test('record button visible and idle', async ({ page }) => {
    await waitForApp(page);
    const recBtn = page.locator('#tcRecBtn');
    await expect(recBtn).toBeVisible();
    await expect(page).toHaveScreenshot('27-rec-controls-idle.png');
  });
});

// ──────────── 14. Sticky Notes ────────────

test.describe('Sticky Notes', () => {
  test('add and display sticky note', async ({ page }) => {
    await waitForApp(page);
    await page.evaluate(() => {
      if (typeof StickyNotes !== 'undefined') {
        StickyNotes.add('Test note content');
      }
    });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot('28-sticky-note.png');
  });
});

// ──────────── 15. Help / Wiki ────────────

test.describe('Help', () => {
  test('help content in settings', async ({ page }) => {
    await waitForApp(page);
    await page.click('#settingsBtn');
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('30-settings-with-help.png');
  });
});
