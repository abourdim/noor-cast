// @ts-check
import { test, expect } from '@playwright/test';

/* v0.7.252 — verification of the "Saved X to disk" toast.
   Repros the user complaint: "always the 0 octect message. it is fake".
   Mocks the FileSystemFileHandle returned by showSaveFilePicker so we
   can simulate the three real-world outcomes (success, zero-byte file,
   verification unavailable) and assert the toast tells the truth in
   each case. */

async function loadAppAndDismissSplash(page) {
  await page.goto('/');
  await page.waitForSelector('#tcStage', { state: 'visible', timeout: 10_000 });
  // Some splash / mode picker / template picker may be open — dismiss them all
  await page.evaluate(() => {
    document.querySelectorAll('.splash-overlay, .tc-splash, .tc-mode-picker').forEach(el => { el.style.display = 'none'; });
    document.querySelectorAll('button').forEach(b => {
      const t = (b.textContent || '').trim();
      if (t === 'PASSER' || t === 'CONTINUER' || t === '×' || t === '✕') b.click();
    });
  });
  await page.waitForTimeout(300);
}

/** Drives Recorder.finish() with a mocked _fileWriter + _fileHandle so we can
 *  test the verification path without a real recording. Returns the toast
 *  message that fired during finish(). */
async function runFinishWithMockHandle(page, { actualBytes, promisedBytes = 5_000_000, writeErrors = 0, getFileThrows = false }) {
  return await page.evaluate(async ({ actualBytes, promisedBytes, writeErrors, getFileThrows }) => {
    // Capture toasts by patching showToast
    const captured = [];
    const origToast = window.showToast;
    window.showToast = (msg, ms) => { captured.push(msg); origToast?.(msg, ms); };
    try {
      // Mock the writer + handle
      const mockHandle = {
        getFile: async () => {
          if (getFileThrows) throw new Error('simulated getFile failure');
          return { size: actualBytes };
        },
      };
      const mockWriter = {
        close: () => Promise.resolve(),
      };
      Recorder._fileWriter = mockWriter;
      Recorder._fileHandle = mockHandle;
      Recorder._totalBytes = promisedBytes;
      Recorder._fileWriteErrors = writeErrors;
      Recorder.chunks = [];
      Recorder._chunkCount = 0;
      Recorder._suppressNextStopFinish = false;
      Recorder._savedToDisk = false;
      // Call finish directly. It returns synchronously but the toast fires
      // inside an async .then() — wait for it.
      Recorder.finish();
      // Spin until our toast appears (max 1500ms)
      const start = Date.now();
      while (Date.now() - start < 1500) {
        if (captured.length > 0) break;
        await new Promise(r => setTimeout(r, 50));
      }
    } finally {
      window.showToast = origToast;
    }
    return captured;
  }, { actualBytes, promisedBytes, writeErrors, getFileThrows });
}

test.describe('v0.7.252 save-verification', () => {

  test('toast shows REAL on-disk size when file is non-zero', async ({ page }) => {
    await loadAppAndDismissSplash(page);
    const toasts = await runFinishWithMockHandle(page, { actualBytes: 13_400_000, promisedBytes: 13_500_000 });
    expect(toasts.length).toBeGreaterThan(0);
    const t0 = toasts[0];
    // Should be the success toast with 12.8 MB (13_400_000 / 1024 / 1024 ≈ 12.8)
    expect(t0).toMatch(/💾 Saved/);
    expect(t0).toContain('12.8 MB');
    expect(t0).toContain('✓');
    // Critically: it must NOT be the optimistic "ignore Chrome chip" message anymore
    expect(t0).not.toContain('ignore Chrome');
  });

  test('toast shows EXPLICIT FAILURE when file is 0 bytes (the original blocking bug)', async ({ page }) => {
    await loadAppAndDismissSplash(page);
    const toasts = await runFinishWithMockHandle(page, { actualBytes: 0, promisedBytes: 5_000_000, writeErrors: 12 });
    expect(toasts.length).toBeGreaterThan(0);
    const t0 = toasts[0];
    // Must clearly say save failed
    expect(t0).toMatch(/❌ Save failed/);
    expect(t0).toContain('0 bytes');
    // Should mention the cause — disk write errors in this case
    expect(t0).toMatch(/disk write errors/);
    // Critically: must NOT be a happy "Saved!" toast lying about success
    expect(t0).not.toMatch(/^💾 Saved/);
  });

  test('toast distinguishes "no recorder data" from "disk errors" when zero bytes', async ({ page }) => {
    await loadAppAndDismissSplash(page);
    const toasts = await runFinishWithMockHandle(page, { actualBytes: 0, promisedBytes: 0, writeErrors: 0 });
    const t0 = toasts[0];
    expect(t0).toMatch(/❌ Save failed/);
    expect(t0).toContain('recorder produced no data');
  });

  test('falls back to estimate when getFile() unavailable', async ({ page }) => {
    await loadAppAndDismissSplash(page);
    const toasts = await runFinishWithMockHandle(page, { actualBytes: 0, promisedBytes: 8_400_000, getFileThrows: true });
    const t0 = toasts[0];
    // Should be a soft "saved approximately" toast, not failure (since we
    // can't verify either way) — and must use the ~ prefix to flag it.
    expect(t0).toMatch(/💾 Saved/);
    expect(t0).toContain('~');
    expect(t0).toContain('8.0 MB');
  });
});
