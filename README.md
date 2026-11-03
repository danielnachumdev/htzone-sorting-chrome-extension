# HTZone Sorting Chrome Extension

**Client-side product sorting for [htzone.co.il](https://www.htzone.co.il)** — name, price, and discount controls on subcategory, sale, and search results pages.

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-brightgreen?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/htzone-sorting-extension/dpkejceaflbadlikcdipibcgmgchpmfb)
[![CI](https://github.com/danielnachumdev/htzone-sorting-chrome-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/danielnachumdev/htzone-sorting-chrome-extension/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

![Sorting UI on htzone.co.il](docs/screenshots/showcase.png)

## Why this extension?

htzone.co.il product grids do not expose the sort options many shoppers want. This MV3 extension injects a sticky **מיון** (sort) control so you can reorder visible products locally — no accounts, no backend, no data leaving the browser.

- **Sort by** name (A–Z / Z–A), price (low↔high), discount absolute or percent (asc/desc)
- **Works on** subcategory (`/subcategory/*`), sale (`/sale/*`), and Algolia search (`/search-result_algolia*`) pages
- **Toggle** on/off from the toolbar popup (reload the tab after changing)
- **Privacy-first** — all sorting runs in-page; nothing is collected or transmitted

## Install

### Chrome Web Store (recommended)

[Install from the Chrome Web Store](https://chromewebstore.google.com/detail/htzone-sorting-extension/dpkejceaflbadlikcdipibcgmgchpmfb)

### From source (unpacked)

1. Clone this repository.
2. `npm install`
3. `npm run build` → output in `unpacked/`
4. Chrome → `chrome://extensions/` → Developer mode → **Load unpacked** → select `unpacked/`

## Usage

1. Open a subcategory, sale, or search results page on [htzone.co.il](https://www.htzone.co.il).
2. Use the **מיון** dropdown in the sidebar to sort the product list.
3. Enable or disable the extension from the popup; reload the page for the change to apply.

## Privacy

See [docs/privacy-policy.md](docs/privacy-policy.md). The extension does **not** collect, store externally, or transmit personal data. Preferences use `chrome.storage.sync` locally in the browser.

## Contributors / agents

Build layout, CI/semver labels, and DOM domain notes: **[AGENTS.md](AGENTS.md)**.

## License

MIT. See [LICENSE](LICENSE).
