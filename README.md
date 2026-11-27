# recipes

An iPhone-friendly, installable recipe notebook PWA. A kraft cover opens into generated contents, then bookmarkable recipe pages in the saved “written recipe” style.

## Run

No third-party runtime dependencies. IndexedDB regression tests use the development-only fake-indexeddb package.

```sh
npm ci
npm test
npm run build
```

Serve `dist/` over HTTPS (or localhost for development). Cloudflare Pages: build `npm run build`, output `dist`, production branch `main`. The app works at the origin root or a GitHub Pages repository subpath. It uses no backend, paid APIs, or account data.

On iPhone, open in Safari, choose Share → Add to Home Screen. The service worker saves the entire notebook after the first online visit. Offline reading requires that initial successful visit; iOS may later evict browser storage.

## Add a supplied recipe

Edit `public/recipes.js`, add a stable unique slug, category (`Desserts`, `Sides`, `Main`), optional cuisine, accurate ingredients/steps/notes, and optionally an occasional dish illustration in `public/assets/`. Main recipes are automatically grouped by cuisine; Indian and Chinese start as empty headings. Contents and page numbers are generated from the ordered data. Never add invented recipes or fill unspecified measurements.

Add every new asset to `FILES` in `public/sw.js` The build automatically derives a new offline-cache revision from all app content. Hash links such as `#recipe/brown-butter-miso-chocolate-chip-cookies` are directly bookmarkable and work offline.

See [the saved written recipe style](docs/written-recipe-style.md). The supplied notebook photos yield 26 distinct entries, including the starter cookie recipe. Intake hashes and recipe mapping are recorded in `docs/intake.json`. Its source does not specify oven temperature, bake time, add-in quantities, or when to add sesame paste/milk powder; these remain visibly unspecified.

Original reference images are not published. Cover and cookie illustrations are new SVG drawings inspired by the approved references.


## Personal recipes and updates

Use **Write a recipe** for a title, ingredients, method, notes, category and optional Main cuisine. Every recipe page has **Edit recipe**, including bundled recipes and all their component ingredient lists. Add, change or remove ingredient lines. Edits keep the stable route and source reference. Bundled recipes offer **Restore original** with confirmation after an edit.

All recipes live in IndexedDB (`recipe-personal-notebook`, schema 1), independently of the service-worker cache. Fresh bundles update only unmodified bundled records; personal recipes, edits and restored overrides are preserved. Future database versions must add migrations in `openDatabase` rather than delete the database. Hash routes and TOC/page numbers derive from the stored library.

App updates are checked at registration and when the app returns to the foreground. Automatic application defaults on and can be disabled in Backups. A waiting service worker activates only outside the editor; no app-initiated reload replaces an open draft. Save or leave the editor to apply a pending update. **Check for app update** and **Apply update** provide manual fallbacks. iOS delivery is controlled by Safari and requires opening online; installation itself does not need to be repeated.

## Backups

**Backups** downloads plain JSON or a passphrase-encrypted JSON envelope. Encryption uses AES-256-GCM with a random 96-bit IV, random 128-bit salt and PBKDF2-SHA256 (310,000 iterations). The versioned envelope authenticates its format/version. Passphrases are never persisted or transmitted. Losing one makes that backup unrecoverable.

Restore validates the file and schema before showing add/copy/skip/replace counts and recipe titles. Duplicate detection uses stable IDs and normalized titles. Replacement additionally requires checking explicit approval. Writes are a single IndexedDB transaction. Imported artwork URLs and arbitrary extra fields are discarded. Keep-both assigns fresh local IDs.

GitHub backup is a manual opt-in path: download an encrypted `.encrypted.json` file, then upload only that ciphertext to a repository you choose (prefer private). Download and select it to restore. No GitHub credentials, remote backup uploads or personal-data sync are implemented. Deploying this app’s source is separate from backing up owner data. Original photos, passphrases, tokens and plaintext personal backups must never be added to this repository.

Browser storage remains subject to eviction or clearing. The app offers `navigator.storage.persist()` where supported and external backups. A service worker is not a substitute for a backup.


## Contents, sections and book order

Choose **Reorder & sections** in Contents. Drag only the dotted handles; recipe links and the rest of the page remain available for navigation and scrolling. Drop before another row or into a named drop zone, including an empty category or Main cuisine. **Up**, **Down** and **Move to** work with touch controls and keyboard activation too. The recipe’s stable bookmark ID remains unchanged; page numbers and previous/next links derive from the same newly ordered library.

Add named top-level sections or Main cuisine subsections in reorder mode. A nonempty section requires a destination before removal. Removing a parent safely reassigns all its child recipes and removes its subsection labels; recipes are never deleted. **Undo last change**, **Cancel changes** and **Done** are explicit controls. Cancelling layout changes preserves any recipe text edits or additions made while the reorder session was open.

Section definitions are stored in the versioned local settings store, seeded only when absent. Existing custom categories/cuisines from older versions migrate into the first section layout. Intentionally removed defaults are not recreated by bundle updates. Layout/category/order changes are local overrides. Backups include section definitions, stable section IDs and per-recipe book ordering; restoring a section layout requires its own visible checkbox in the checked restore preview. Older version-1 backups without layout metadata remain compatible.

The detail sheet now follows the approved written recipe card using bundled local fonts; the cover uses a fresh reference-matched bear vector. The mobile app fills the dynamic viewport with safe-area padding for controls. Normal Safari browser chrome remains controlled by Safari; Home Screen standalone display is declared in the manifest. Zoom is not disabled.

## Prior Trials and the student notebook style

Every recipe page uses a locally bundled Patrick Hand print font on lined ivory paper, restrained yellow highlighter, red circled step numbers and pen underlines. The three graphite food drawings remain occasional. Cover and contents retain their existing styling.

Use **Add a trial** at the bottom of any recipe page. Ingredient / amount and Outcome are separate free-text fields; multiple trials can be edited or removed. Trials are device-local and included in plain and encrypted backups. Recipe editing, section moves, bundle updates and restoring the original recipe text preserve trial history. Old records/backups without a trials field load with an empty history. No example trials are added to supplied recipe data.

The full existing bear on the cover is the Contents link, accessible by pointer or keyboard. Visible cover title/link copy has been removed. The versioned PWA, Apple touch and favicon assets crop only that same bear artwork's face, on ivory with safe padding. No new bear was drawn, and no raw reference photo was published. Physical iOS Home Screen icon refresh is unverified; code updates preserve local data and do not require clearing website storage.

Font: Patrick Hand from the official Google Fonts repository, bundled under OFL; see `public/assets/fonts/PATRICK-HAND-OFL.txt`.
