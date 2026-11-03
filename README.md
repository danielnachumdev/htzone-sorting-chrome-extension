# HTZone Sorting Chrome Extension

[![Click here](https://img.shields.io/badge/Chrome%20Web%20Store-Click%20here-brightgreen?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/htzone-sorting-extension/dpkejceaflbadlikcdipibcgmgchpmfb)

A Chrome extension that enhances your experience on [htzone.co.il](https://www.htzone.co.il) by adding advanced product sorting capabilities to subcategory, sale, and search results pages.

## Features

- Adds a sorting dropdown to product lists on htzone.co.il subcategory, sale, and search results pages
- Sort products by:
  - Name (A-Z, Z-A)
  - Price (Low to High, High to Low)
  - Discount (Absolute/Percentage, Ascending/Descending)
- Works entirely client-side; no data is sent or stored externally
- Toggle extension on/off from the popup menu
- Sticky sidebar for sorting controls

## Installation

### From the Chrome Web Store

[Install directly from the Chrome Web Store](https://chromewebstore.google.com/detail/htzone-sorting-extension/dpkejceaflbadlikcdipibcgmgchpmfb)

### From Source (Unpacked)
1. Clone or download this repository.
2. Run `npm install` to install dependencies.
3. Build the extension:
   ```sh
   npm run build
   ```
   This will generate the unpacked extension in the `unpacked/` directory.
4. Open Chrome and go to `chrome://extensions/`.
5. Enable "Developer mode" (top right).
6. Click "Load unpacked" and select the `unpacked/` directory.

## Usage

- Visit any [htzone.co.il](https://www.htzone.co.il) subcategory, sale, or search results page.
- Use the sorting dropdown (מיון) added to the sidebar to sort products as you like.
- You can enable/disable the extension globally from the extension popup.
- If you change the enable/disable setting, reload the page for changes to take effect.

## Development

- Source TypeScript lives under `src/scripts/` (content script) and `src/popup/` (popup UI).
- Icons are in `assets/icons/`; privacy policy and screenshots under `docs/`.
- Build with `npm run build` (TypeScript compile + package assets). Packaged paths remain `scripts/`, `popup/`, and `icons/` to match `manifest.json`.
- Outputs: `dist/`, ZIP in `releases/`, unpacked load directory in `unpacked/`.
- Edit popup UI in `src/popup/popup.html` and `src/popup/popup.ts`.
- Main content script: `src/scripts/content.ts`.
- Agent / contributor layout notes: [AGENTS.md](AGENTS.md).

## Privacy

See [docs/privacy-policy.md](docs/privacy-policy.md) for details. This extension does **not** collect, store, or transmit any personal data. All operations are performed locally in your browser.

## License

MIT License. See [LICENSE](LICENSE) for details. 