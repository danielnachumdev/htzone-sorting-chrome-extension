# HTZone Sorting Chrome Extension – Agent Context

Implementation guide for coding agents changing this repo. Product pitch and user-facing install: [`README.md`](README.md).

---

## Orientation

| Question | Answer |
| -------- | ------ |
| What is this? | Chrome **MV3** extension: client-side product sorting UI on htzone.co.il |
| Source | `src/scripts/` (content), `src/popup/` (toolbar popup) |
| Toolchain | Node + TypeScript (`tsc`) + `build.js` (package ZIP / unpacked) |
| Manifest | Root `manifest.json` (packaged paths: `scripts/`, `popup/`, `icons/`) |
| Tests | `npm test` — smoke no-op for the CI Node lane |
| Secrets | Never commit Web Store credentials, API keys, or tokens |

```text
.
├── .github/                 # CODEOWNERS, thin CI orchestrator
├── src/
│   ├── scripts/             # content.ts → packaged as scripts/content.js
│   └── popup/               # popup.html + popup.ts
├── assets/icons/            # → packaged as icons/
├── docs/
│   ├── privacy-policy.md
│   └── screenshots/         # Store / README visuals
├── manifest.json            # MV3; version source for the extension
├── build.js                 # tsc + copy assets → dist/, releases/, unpacked/
├── package.json
├── tsconfig.json
├── README.md                # Marketing / user docs
├── CHANGELOG.md
├── LICENSE
└── AGENTS.md
```

Packaged layout under `dist/` / `unpacked/` keeps `scripts/`, `popup/`, and `icons/` so `manifest.json` paths stay stable. `build.js` maps `src/` and `assets/` into that layout.

Shared CI: [`danielnachumdev/actions`](https://github.com/danielnachumdev/actions) (`@latest`). How to adopt: [`HOW-TO-USE.md`](https://github.com/danielnachumdev/actions/blob/latest/HOW-TO-USE.md).

---

## Develop

```bash
npm ci
npm test          # smoke no-op (CI lane)
npm run compile   # tsc only → dist/scripts, dist/popup
npm run build     # tsc + assets + ZIP in releases/ + unpacked/
```

Load `unpacked/` via Chrome → Extensions → Developer mode → Load unpacked.

---

## Domain notes

- **Matches** (manifest + content routing): `/subcategory/*`, `/sale/*`, `/search-result_algolia*`. Each page type has its own initializer and DOM selectors in `src/scripts/content.ts`.
- **Enable flag:** `chrome.storage.sync` key `extensionEnabled` (default on). Content script exits early when `false`. Popup may prompt reload on matching tabs.
- **Sorting** reorders existing product list nodes in place (MutationObserver re-applies after DOM churn). Do not invent a backend or network calls.
- **UI copy** for the sort control is Hebrew (מיון, option labels). Keep strings consistent with the live site language.
- **Permissions:** `storage` (prefs), `tabs` (reload from popup). Avoid adding host or broader permissions without a clear need.
- **Version:** bump/`CHANGELOG` track the string in `manifest.json` (e.g. `1.3`). CD to the Chrome Web Store is **not** wired yet — do not invent publish secrets or upload steps without an explicit issue/PR.

---

## PRs, CI, and releases

1. Branch off `main`; open a PR into `main`.
2. Attach **exactly one** semver label: `noBump` | `bumpPatch` | `bumpMinor` | `bumpMajor`.
3. **CI** — `…/ci.yml@latest` (Node smoke) + `…/semver-ci.yml@latest` (validate label). Prefer **`CI / CI`** and **`Semver / Semver`**.
4. Dependabot PRs stay on `noBump`.
5. Change shared CI/semver behavior in **`danielnachumdev/actions`**, not by re-vendoring here.
6. Chrome Web Store publish is manual / not automated in this repo.

### Repo gates (already configured)

- `.github/CODEOWNERS` — `@danielnachumdev`
- Semver label required on PRs via shared `semver-ci`

---

## Sensitive / ignored

Do not commit: Web Store credentials, API keys, tokens, `node_modules/`, `dist/`, `releases/`, `unpacked/`. No personal / live PII in issues, PRs, or docs. Respect `.gitignore`.
