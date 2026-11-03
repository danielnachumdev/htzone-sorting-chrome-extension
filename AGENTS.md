# HTZone Sorting Chrome Extension – Agent Context

## Project purpose

Chrome MV3 extension that adds client-side product sorting UI on [htzone.co.il](https://www.htzone.co.il) subcategory, sale, and search-results pages. Toggle on/off via the popup. No external data collection.

## Layout

```
.
├── src/
│   ├── scripts/          # Content scripts (content.ts → packaged as scripts/)
│   └── popup/            # Popup HTML + TS
├── assets/
│   └── icons/            # Extension icons (packaged as icons/)
├── docs/
│   ├── privacy-policy.md
│   └── screenshots/      # Store / README visuals
├── .github/workflows/    # CI (danielnachumdev/actions@latest)
├── manifest.json         # MV3 manifest (packaged paths: scripts/, popup/, icons/)
├── build.js              # compile + package → dist/, releases/, unpacked/
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
├── LICENSE
└── AGENTS.md
```

Packaged extension layout (under `dist/` / `unpacked/`) keeps `scripts/`, `popup/`, and `icons/` so `manifest.json` paths stay stable. `build.js` maps `src/` and `assets/` into that layout.

## Build / test

```sh
npm ci
npm test          # smoke no-op (CI lane)
npm run compile   # tsc only
npm run build     # tsc + copy assets + ZIP in releases/ + unpacked/
```

Load `unpacked/` via Chrome → Extensions → Developer mode → Load unpacked.

## CI / CD

- **CI:** `.github/workflows/ci.yml` consumes `danielnachumdev/actions@latest` (Node smoke + semver-ci on PRs).
- **CD / Chrome Web Store publish:** not wired yet. Track separately; do not invent deploy secrets or store upload steps without an explicit issue/PR.

## Do not commit

- Secrets, API keys, Web Store credentials, `.pypirc`-style files
- Generated output: `node_modules/`, `dist/`, `releases/`, `unpacked/`
- Personal / live PII in issues, PRs, or docs
