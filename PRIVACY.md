# Privacy Policy — X Mate

X Mate does not collect, transmit, sell, or share any user data.

- All the extension does is hide ad elements on x.com / twitter.com using
  local CSS rules and a content script.
- The only data it stores is a single on/off preference and a local counter
  of how many ads were hidden, kept entirely on-device via
  `chrome.storage.local`.
- Nothing is sent to any server, analytics provider, or third party.
- The source code is public — see [content.js](content.js) and
  [content.css](content.css) for the full extent of what the extension does.

## Permissions used

- `storage` — stores the on/off toggle and the local ad-blocked counter.
- Host access to `x.com` / `twitter.com` — required to run the content
  script that hides ad elements on those sites. No other sites are accessed.
