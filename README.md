# Browser Toolkit

A small, dependency-free Manifest V3 Chrome extension for personal browsing.

## Features

- **YouTube:** hides the related-video recommendations beside watch pages by default. Live chat, search, subscriptions, and the home feed remain available. On narrow windows, YouTube may place this same related-video section below the player; it is hidden there too.
- **LinkedIn:** hides posts on the home feed (`/feed/` and its tabs such as `/feed/foryou/`) by default. The "Start a post" box, navigation, messaging, notifications, profiles, and individual posts opened from a link remain available.
- **LinkedIn tracking:** blocks LinkedIn's analytics beacons (`/li/track`, `/li/tscp/`), its ad pixels (`px.ads`, `px4.ads`, `dc.ads.linkedin.com`), and its Insight Tag script, using Chrome's `declarativeNetRequest`. The extension never sees request contents. The list lives in `rules/linkedin-tracking.json`.
- **LinkedIn extension probing:** LinkedIn's page requests `chrome-extension://<id>/<file>` URLs to detect installed extensions. A small script injected into LinkedIn's page redirects those `fetch` and `XMLHttpRequest` calls to an invalid extension URL, so every probe fails as if nothing were installed. This shields all your extensions, not just this one. It does not cover other detection methods (for example `<img>` tags or looking for page changes that extensions make), and LinkedIn may change its technique.
- **Reddit:** hides posts on the main page (reddit.com, including its Best/Hot/New/Top/Rising sorts) on www.reddit.com and old.reddit.com by default. Popular, All, subreddits, posts and comments, search, and profiles remain available.
- **X/Twitter:** hides posts on the home timeline (`/home`, both the For you and Following tabs) on x.com and twitter.com by default. The composer, profiles, single posts, search, Explore, notifications, and messages remain available.
- **Gemini:** shows a paste-to-frame timing estimate and saves the latest measurement locally. The extension never reads or saves clipboard text or sends telemetry.
- The extension popup lets you toggle each feature immediately.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repository's folder.
4. Refresh any YouTube, LinkedIn, Reddit, X/Twitter, and Gemini tabs that were already open.
5. Open the extension's popup from Chrome's Extensions menu to change settings.

After editing source files, click **Reload** on the extension card and refresh affected tabs. No build step or Chrome Web Store publication is required for local use.

## Measurement limits

The Gemini measurement runs from the paste event's timestamp to a second animation-frame callback. It includes synchronous paste work and a rendering opportunity, but does **not** guarantee that pixels reached the screen or that asynchronous editor processing finished. Background-tab and superseded measurements are discarded. The result is not INP and does not measure Gemini response generation or network latency.

Use this lightweight estimate to compare the same paste across chats. For exact attribution, record a Chrome DevTools Performance trace. This version does not collect long tasks, profile functions, or export traces.

## Manual checks

- Open a YouTube watch page: recommendations should disappear; the player should still work.
- Toggle hiding off and on: recommendations should return and disappear without a reload.
- Navigate to another video through YouTube: hiding should persist.
- Check a live video: live chat should remain available.
- Open the LinkedIn home feed: posts should disappear; "Start a post" should remain.
- Open a single LinkedIn post or a profile: it should display normally.
- Toggle LinkedIn hiding off and on: the feed should return and disappear without a reload.
- Open reddit.com: posts should disappear.
- Open /r/popular, a subreddit such as /r/chrome, or a single post: it should display normally.
- Toggle Reddit hiding off and on: the feed should return and disappear without a reload.
- Open x.com/home: posts should disappear on both tabs; the composer should remain.
- Open a profile or a single post on X: it should display normally.
- Toggle X/Twitter hiding off and on: the timeline should return and disappear without a reload.
- Paste into Gemini: a timing badge should appear, and the popup should show the latest result.
- Disable paste measurement: further pastes should produce no badge or new sample.

YouTube can change its DOM. If recommendations return after a site update, inspect the related-video container and update `src/youtube.css`. Likewise, if LinkedIn posts reappear, inspect the feed container and update `src/linkedin.css`. The same applies to Reddit and `src/reddit.css`, and X/Twitter and `src/twitter.css`.

## Repository

https://github.com/obh/browser_toolkit
