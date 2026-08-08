# X Mate

[![Available in the Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-4285F4?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/knmbphanfjenpobhkfgphccbmgifihke)

A tiny Chrome extension that blocks ads on **X (twitter.com / x.com)** — both
promoted posts in the timeline and the sidebar's ad banner.

**[→ Install from the Chrome Web Store](https://chromewebstore.google.com/detail/knmbphanfjenpobhkfgphccbmgifihke)**

## What it blocks

X ads come in two distinct shapes, and X Mate targets both by matching the
same DOM markers X's own client uses internally:

1. **Promoted timeline posts.** Every ad tweet is wrapped in a
   `data-testid="placementTracking"` impression-tracking block. X Mate hides
   the entire virtualized list cell (`data-testid="cellInnerDiv"`) that
   contains one, removing the promoted tweet and its tracking pixels
   together. X reuses that same test id for the wrapper its video player
   mounts into, so the rules only count a block that sits *outside* the
   tweet's `<article>` — an ordinary video won't vanish when you press play.
2. **Sidebar ad banner.** The "Who to follow" module is immediately followed
   by a `data-testid="whoToFollowSspAd"` block — a real Google Ad Manager
   (GPT) iframe. X Mate hides it, along with any other `div-gpt-ad*` /
   `google_ads_iframe*` slot or `googlesyndication.com` / `doubleclick.net`
   iframe anywhere else on the page.

Blocking is done with CSS `:has()` rules (Chrome 105+), so ads are hidden
before they ever paint — no flash of promoted content. A lightweight content
script counts how many ads were hidden for the popup's stats, and flags the
one case CSS can't tell apart on its own: a promoted *video*, which carries
both kinds of `placementTracking` block.

## Install

**[From the Chrome Web Store](https://chromewebstore.google.com/detail/knmbphanfjenpobhkfgphccbmgifihke)** — one click, auto-updates.

### Or unpacked (dev mode)

1. Clone this repo.
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the `x_mate` folder.
5. Open x.com — ads are blocked. Click the toolbar icon to toggle
   blocking on/off or see how many ads have been blocked.

## Project structure

```
manifest.json    Manifest V3 config
content.css      The actual ad-hiding rules
content.js       Sets the on/off state early, counts blocked ads
popup.html/.css/.js   Toolbar popup UI (toggle + counter)
icons/           Extension icons
```

## Why this approach

X's markup is unstable (auto-generated class names change constantly), but
`data-testid` attributes are how X's own frontend tests target these
elements, so they're the most stable hooks available from outside the app.
If X changes these test ids, the rules in `content.css` are the only place
that needs updating.

## Limitations

- Requires a Chromium browser new enough to support CSS `:has()` (Chrome 105+).
- Only targets the two ad surfaces described above; it is not a general
  purpose ad/tracker blocker.

## License

MIT — see [LICENSE](LICENSE).
