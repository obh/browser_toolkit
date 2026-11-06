const settings = [
  ["#youtube", "hideYoutubeRelated"],
  ["#linkedin", "hideLinkedinFeed"],
  ["#linkedin-tracking", "blockLinkedinTracking"],
  ["#linkedin-probes", "guardLinkedinProbes"],
  ["#reddit", "hideRedditFeed"],
  ["#twitter", "hideTwitterFeed"],
  ["#gemini", "measureGemini"],
].map(([selector, key]) => [document.querySelector(selector), key]);
const latest = document.querySelector("#latest");
const status = document.querySelector("#status");

function renderMeasurement(sample) {
  latest.textContent = sample
    ? `Paste → frame estimate: ${sample.durationMs.toLocaleString()} ms\n${new Date(sample.recordedAt).toLocaleString()}`
    : "No measurement yet.";
}

const defaults = Object.fromEntries(settings.map(([, key]) => [key, true]));
chrome.storage.local.get({ ...defaults, lastPaste: null })
  .then((stored) => {
    for (const [input, key] of settings) {
      input.checked = stored[key];
      input.disabled = false;
    }
    renderMeasurement(stored.lastPaste);
  }).catch(() => { status.textContent = "Could not load settings."; });

for (const [input, key] of settings) {
  input.addEventListener("change", async () => {
    try {
      await chrome.storage.local.set({ [key]: input.checked });
      status.textContent = "";
    } catch {
      input.checked = !input.checked;
      status.textContent = "Could not save setting.";
    }
  });
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.lastPaste) renderMeasurement(changes.lastPaste.newValue);
});
