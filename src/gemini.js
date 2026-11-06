(() => {
  let enabled = true;
  let sequence = 0;
  let badge;
  let hideTimer;

  chrome.storage.local.get({ measureGemini: true }).then((settings) => {
    enabled = settings.measureGemini;
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.measureGemini) {
      enabled = changes.measureGemini.newValue !== false;
      sequence++;
      if (!enabled) badge?.remove();
    }
  });
  document.addEventListener("visibilitychange", () => { sequence++; });

  function show(durationMs) {
    if (!badge) {
      badge = document.createElement("div");
      const shadow = badge.attachShadow({ mode: "closed" });
      const label = document.createElement("div");
      label.setAttribute("role", "status");
      label.style.cssText = "font:13px/1.5 system-ui,sans-serif;background:#182232;color:#fff;padding:10px 14px;border:1px solid #465773;border-radius:10px;box-shadow:0 4px 20px #0003";
      shadow.append(label);
      badge.updateLabel = (text) => { label.textContent = text; };
    }
    badge.style.cssText = "position:fixed;right:16px;top:16px;z-index:2147483647;pointer-events:none";
    badge.updateLabel(`Paste → frame estimate: ${durationMs.toLocaleString()} ms`);
    document.documentElement.append(badge);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => badge.remove(), 6000);
  }

  document.addEventListener("paste", (event) => {
    if (!enabled || document.visibilityState !== "visible" || !event.isTrusted) return;
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('[contenteditable="true"], textarea, input')) return;
    const current = ++sequence;
    // Event timestamp can include dispatch queuing. Do not read clipboard data.
    const now = performance.now();
    const start = event.timeStamp > 0 && event.timeStamp <= now ? event.timeStamp : now;
    // Two animation callbacks allow a rendering opportunity between callbacks.
    // This is NOT a guarantee that Gemini finished all asynchronous editor work.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!enabled || current !== sequence || document.visibilityState !== "visible") return;
      const durationMs = Math.round(performance.now() - start);
      const sample = { durationMs, recordedAt: Date.now() };
      show(durationMs);
      chrome.storage.local.set({ lastPaste: sample }).catch(() => {});
    }));
  }, true);
})();
