(() => {
  const attribute = "data-browser-toolkit-hide-related";
  const apply = (enabled) => {
    document.documentElement.toggleAttribute(attribute, enabled);
  };
  // CSS applies automatically to recommendations added during SPA navigation.
  apply(true);
  chrome.storage.local.get({ hideYoutubeRelated: true }).then((settings) => {
    apply(settings.hideYoutubeRelated);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.hideYoutubeRelated) {
      apply(changes.hideYoutubeRelated.newValue !== false);
    }
  });
})();
