# X Mate

A tiny Chrome extension that blocks ads on **X (twitter.com / x.com)** — both
promoted posts in the timeline and the sidebar's ad banner.

## What it blocks

X ads come in two distinct shapes, and X Mate targets both by matching the
same DOM markers X's own client uses internally:

1. **Promoted timeline posts.** Every ad tweet is wrapped in a
   `data-testid="placementTracking"` impression-tracking block. X Mate hides
   the entire virtualized list cell (`data-testid="cellInnerDiv"`) whenever
   it contains one of these, removing the promoted tweet and its tracking
   pixels together.
2. **Sidebar ad banner.** The "Who to follow" module is immediately followed
   by a `data-testid="whoToFollowSspAd"` block — a real Google Ad Manager
   (GPT) iframe. X Mate hides it, along with any other `div-gpt-ad*` /
   `google_ads_iframe*` slot or `googlesyndication.com` / `doubleclick.net`
   iframe anywhere else on the page.

Blocking is done with a single CSS `:has()` rule (Chrome 105+), so ads are
hidden before they ever paint — no flash of promoted content. A lightweight
content script only exists to count how many ads were hidden, for the
popup's stats.

## Install (unpacked / dev mode)

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
background.js    Service worker — updates the toolbar badge
popup.html/.css/.js   Toolbar popup UI (toggle + counter)
icons/           Generated via gen_icons.py (Pillow)
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
