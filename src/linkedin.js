// The home feed, including its tabs (/feed/, /feed/foryou/, /feed/following/).
// Single posts (/feed/update/...), hashtags, and profiles stay visible.
browserToolkitHideOnPaths({
  settingKey: "hideLinkedinFeed",
  attribute: "data-browser-toolkit-hide-feed",
  matchesPath: (path) => /^\/feed(\/(?!update\/?$)[^/]+)?\/?$/.test(path),
});
