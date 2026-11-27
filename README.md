# recipes

An iPhone-friendly, installable recipe notebook PWA. A kraft cover opens into generated contents, then bookmarkable recipe pages in the saved “written recipe” style.

## Run

No third-party runtime dependencies.

```sh
npm test
npm run build
```

Serve `dist/` over HTTPS (or localhost for development). Cloudflare Pages: build `npm run build`, output `dist`, production branch `main`. The app works at the origin root or a GitHub Pages repository subpath. It uses no backend, paid APIs, or account data.

On iPhone, open in Safari, choose Share → Add to Home Screen. The service worker saves the entire notebook after the first online visit. Offline reading requires that initial successful visit; iOS may later evict browser storage.

## Add a supplied recipe

Edit `public/recipes.js`, add a stable unique slug, category (`Desserts`, `Sides`, `Main`), optional cuisine, accurate ingredients/steps/notes, and optionally an occasional dish illustration in `public/assets/`. Main recipes are automatically grouped by cuisine; Indian and Chinese start as empty headings. Contents and page numbers are generated from the ordered data. Never add invented recipes or fill unspecified measurements.

Add every new asset to `FILES` in `public/sw.js` and increment its cache version when any deployed app content changes. Hash links such as `#recipe/brown-butter-miso-chocolate-chip-cookies` are directly bookmarkable and work offline.

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
