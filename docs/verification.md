# Verification

Verified 27 November 2026.

- 26 supplied recipe entries from 13 unique photos in the 16-photo intake. Three byte-identical duplicate uploads were skipped. IMG_3763 repeats the starter cookie recipe and was used to cross-check that same entry, not create another. `intake.json` records filenames, SHA-256 and recipe mapping.
- Viewed the original photo pixels; enlarged uncertain titles/quantities. Ambiguities and missing quantities, temperature units and methods remain visible in each recipe. These are transcriptions, not test-baked recipes.
- Build and automated checks pass: exact starter measurements, routes and component grouping; offline asset completeness; backup schema checks, duplicate merge policies, source reference preservation; encrypted round-trip, random salt/IV, wrong passphrase and tamper rejection; new-recipe editor; category/cuisine page ordering; service-worker shell/assets served with simulated network failure.
- Chrome browser: cover to contents to individual recipe, page-number back link, supplied recipe components and notes.
- Typed a temporary Main/Indian recipe, saved it, reloaded and verified persistence. Modified the bundled cookie amount, removed a salt line and added a note; reload retained all changes and the original stable route/artwork. Inspected downloaded plain backup and confirmed those edits and source reference were included.
- Downloaded encrypted backup; selected it through the actual restore UI. Wrong passphrase changed no data. Correct passphrase produced a 27-duplicate preview. Replacing was blocked until the explicit overwrite checkbox was selected, then a single transaction restored all 27 preview records.
- Those sample recipes and altered measurements existed only in the localhost QA database. They were not committed or placed into the production app.
- Inspected cover, recipe and entry form inside a 390px browser viewport. Original photos are excluded; three occasional recipe illustrations are spaced through the book.
- Applied an updated service worker in one preview tab while a second had a typed draft; the draft remained intact. Local records/overrides remained after update and reload. Deferred reload also waits for an editor to close if another tab activates an update.
- GitHub source readback matched local source; GitHub Actions build passed. GitHub Pages enabled with HTTPS. Visited the live deployed cover and followed its contents and Chocolate Birthday Cake page; original source reference and frosting rendered together. Production contained 26 supplied entries, without QA samples.

Limits: no physical iPhone or Safari is available here. Native Add to Home Screen installation and real airplane-mode behavior on iOS were not exercised. Offline fallback was tested with a simulated unavailable network, and browser storage remains subject to browser eviction or clearing. Personal encrypted backups are download/manual-upload only; no owner backup was sent to GitHub.

## Reference style, full-screen and editable contents release

The recipe data file is unchanged in this release: all 26 supplied titles,
quantities, components and uncertainty notes are preserved. Styling now uses
bundled URW Z003 and DejaVu fonts, a measured cream ruled sheet/pink margin,
binder dots, the two-line cookie title, rust underline, right-hand outlined notes,
circled steps and footer notes. Navigation/edit controls moved outside the sheet.
The bear cover was redrawn from the actual supplied photo with the matching
silhouette, pose, cookie, sticker border and brown kraft composition; the raw
photo is excluded from source and deployment.

Additional completed checks:

- 15 automated tests pass, including a real IndexedDB implementation in Node.
  Reorder within a section, cross-section and empty-cuisine placement, safe
  section removal/reassignment, parent removal, invalid section trees, legacy
  custom-category adoption, cancellation preserving concurrent text edits,
  encrypted layout round-trip, data persistence across updated bundles and
  removed-default/update-preference preservation are covered.
- Actual browser pointer drag in a 390px iframe moved Chocolate Birthday Cake
  before the cookie and changed the derived page numbers from 04/03 to 03/04.
  Undo returned the original order. Desktop keyboard Enter on the Up control
  performed the same operation.
- Phone move controls placed a recipe into empty Chinese and newly created
  sections. Removing a populated section without a destination was blocked;
  choosing Desserts reassigned it while retaining all 27 local QA records.
  Cancel restored the original book layout.
- Added an empty section, completed reorder mode, reloaded and verified it
  persisted. Removed it, reloaded and verified it stayed removed. A synthetic
  recipe moved from Indian to Chinese still had `main-chinese` after reload.
- Inspected the downloaded backup: all 27 QA records had stable section IDs and
  ordering, together with six section definitions. These are localhost-only QA
  records; no backup or synthetic recipe is published.
- Compared actual phone screenshots side by side with the native high-resolution
  cookie card and the original cover photo. Both remain editable HTML/vector
  compositions, not flattened recipe images. Verified an unillustrated birthday
  cake page has zero sketch elements and all 19 cake/frosting ingredient lines.
- Phone DOM viewport and scroll width both measured 375 CSS pixels (390px iframe
  including its scrollbar): no horizontal overflow. Browser zoom also had equal
  viewport/scroll widths at 899 CSS pixels. Dynamic viewport heights, safe-area
  control padding and standalone manifest are present; zoom remains enabled.
- Stopped the actual preview server, reloaded the app under its service worker,
  and opened Contents, the cookie and the editor successfully offline. The DOM
  build identity was `a53aa3f64596cbb1`, and all 27 local QA recipes persisted.
  This exercised the actual browser cache, beyond simulated-network unit tests.
- Previous-version localhost storage migrated without loss; saved synthetic
  records and overrides remained after loading the new build identity.

Physical touch hardware, Safari and iOS Home Screen installation remain unavailable
in this environment. Pointer gestures and touch-friendly move alternatives were
verified in a phone-sized browser viewport; ordinary Safari chrome is not claimed
hidden. Screenshot comparisons were captured in the browser thread; screenshot
file export was unavailable, so no Library screenshot ID is claimed.

Live release readback: GitHub checks and Pages deployment succeeded. The already
open previous-version production app updated through **Check for app update** to
build `a53aa3f64596cbb1` without a manual reload or reinstall, retained 26 recipes,
and displayed the new reorder control. All 26 deployed title/TOC pairs and footer
back-links matched, every ingredient list was present, and no synthetic QA record
was in production. Reorder mode exposed 26 handles, six drop zones and the section
form; leaving with Done made no recipe moves. The live bundled editor opened and
cancelled correctly. The final cover adjustment uses a single continuous kraft
background for header and cover and keeps the bear centered across aspect ratios.


The final live cache identity check exposed an HTTP-cache regression: precaching
unversioned URLs could reuse an earlier script response. Installation now fetches
every asset with the release cache ID in its URL and `cache: no-store`, then stores
it under the canonical offline URL. The offline test asserts this bypass for every
precache request. A failed asset download rejects installation rather than claiming
a complete update. This does not touch IndexedDB owner records or settings.

## Hamburger menu, chapter order and graphite sketches

- Inspected the owner's marked JPEG. Contents, Write a recipe, Backups, Keep this book, contextual Edit recipe and Restore original are now in one three-line dropdown. Escape closes it and returns focus; navigation closes it. The chapter label remains outside the recipe sheet.
- Removed the rendered source notation; internal source fields and intake mappings remain unchanged.
- Default top-level order is Main → Sides → Desserts. Only an exact untouched former default tree migrates, in one IndexedDB transaction with an order-version marker. Custom names, removed/added sections, saved custom order, local recipes and ingredient edits remain. Restoring a backup saves its explicit order, including an older order, without reapplying the default migration.
- Reorder mode includes a compact section-order panel for phone dragging. Whole chapters move with cuisine descendants; cuisine siblings can move within their parent. Up/Down buttons work by touch or keyboard. Undo and Cancel retain the existing safety behavior. Recipe page numbers and previous/next links derive from the same arranged book.
- 18 automated checks pass, including new default migration, explicit old-order restore, custom section order, whole-chapter/subsection moves, IndexedDB persistence across bundle updates and encrypted backups.
- Browser-tested local menu navigation and Escape; Enter on Move section Main down; reload retained custom order and all 27 synthetic preview entries. Phone-width pointer drag moved Main before Sides; the saved order and first-page number were verified after reload. Phone body width and scroll width both 375px inside a 390px review frame (scrollbar excluded).
- Inspected all three new graphite masters at full resolution and their actual cookie, Bundt cake and milk-bread rendering at phone width. The cake matches the supplied Bundt method. Only three supplied pages contain drawings. Optimized transparent WebP assets total 635,510 bytes and are included in the service-worker cache. See food-sketches.md for the generation prompt set.
- Compared all 26 recipes with the preceding release, excluding only illustration path/alt metadata: titles, quantities, method, components, uncertainty notes and internal provenance are unchanged. Cover artwork is unchanged.
- Physical iPhone, Safari and an installed iOS Home Screen app are unavailable in this environment; phone-width browser/pointer tests are not a substitute for those device checks.

### Deployed readback and final edit-order regression

- GitHub Pages served build `267a9a094b26c661`; both CI and deployment succeeded. Updating from build `5f254506680a7f91` through Check for app update retained a temporary browser-local note, all 26 supplied IDs and the migrated Main → Sides → Desserts order. The synthetic note was then removed with Restore original.
- That live check exposed an older editor ordering problem: a bundled recipe with no stored order received a new-entry timestamp and moved to the end of its section. The final patch materializes the existing fallback order before editing; a new regression test verifies that changing ingredients retains the page position.
- With the real preview server stopped, the new build reloaded from its service worker with all 27 local QA records and the custom layout retained. Cookies, Bundt cake and milk bread images all loaded from cache.
