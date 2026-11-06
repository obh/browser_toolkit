// Shared helper: sets an attribute on <html> while a setting is on and the
// current path matches, so a CSS file can hide feed content. Handles SPA navigation.
globalThis.browserToolkitHideOnPaths = ({ settingKey, attribute, matchesPath }) => {
  let enabled = true;
  const apply = () => {
    document.documentElement.toggleAttribute(attribute, enabled && matchesPath(location.pathname));
  };

  apply();
  chrome.storage.local.get({ [settingKey]: true }).then((settings) => {
    enabled = settings[settingKey];
    apply();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[settingKey]) {
      enabled = changes[settingKey].newValue !== false;
      apply();
    }
  });

  if (window.navigation) {
    navigation.addEventListener("currententrychange", apply);
  } else {
    let lastPath = location.pathname;
    setInterval(() => {
      if (location.pathname !== lastPath) {
        lastPath = location.pathname;
        apply();
      }
    }, 500);
  }
  addEventListener("popstate", apply);
};
