// Only the home timeline (/home, which holds both the For you and Following tabs).
// Profiles, single posts, search, Explore, notifications, and messages stay visible.
browserToolkitHideOnPaths({
  settingKey: "hideTwitterFeed",
  attribute: "data-browser-toolkit-hide-feed",
  matchesPath: (path) => /^\/home\/?$/.test(path),
});
