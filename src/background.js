// Applies the LinkedIn privacy settings: the tracking-block ruleset and the
// main-world script that hides installed extensions from LinkedIn's probes.
const RULESET_ID = "linkedin_tracking";
const GUARD_ID = "linkedin-probe-guard";
const DEFAULTS = { blockLinkedinTracking: true, guardLinkedinProbes: true };

async function apply() {
  const settings = await chrome.storage.local.get(DEFAULTS);

  await chrome.declarativeNetRequest.updateEnabledRulesets(
    settings.blockLinkedinTracking
      ? { enableRulesetIds: [RULESET_ID] }
      : { disableRulesetIds: [RULESET_ID] },
  );

  const registered = await chrome.scripting.getRegisteredContentScripts({ ids: [GUARD_ID] });
  if (settings.guardLinkedinProbes && registered.length === 0) {
    await chrome.scripting.registerContentScripts([{
      id: GUARD_ID,
      matches: ["https://www.linkedin.com/*"],
      js: ["src/linkedin-probe-guard.js"],
      runAt: "document_start",
      world: "MAIN",
      allFrames: true,
      persistAcrossSessions: true,
    }]);
  } else if (!settings.guardLinkedinProbes && registered.length > 0) {
    await chrome.scripting.unregisterContentScripts({ ids: [GUARD_ID] });
  }
}

// Serialize runs so quick toggles cannot register the script twice.
let queue = Promise.resolve();
const sync = () => {
  queue = queue.then(apply).catch((error) => console.error("Browser Toolkit:", error));
};

chrome.runtime.onInstalled.addListener(sync);
chrome.runtime.onStartup.addListener(sync);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && Object.keys(DEFAULTS).some((key) => key in changes)) sync();
});
