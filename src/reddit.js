// Only the main page (reddit.com/, including its Best/Hot/New/Top/Rising sorts).
// Popular, All, subreddits, posts, comments, search, and profiles stay visible.
browserToolkitHideOnPaths({
  settingKey: "hideRedditFeed",
  attribute: "data-browser-toolkit-hide-feed",
  matchesPath: (path) => /^\/((best|hot|new|top|rising)\/?)?$/.test(path),
});
