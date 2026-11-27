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

## Student handwriting, Prior Trials and bear-face icons

- 23 automated checks pass: legacy records/backups without trials, multiple/edit/remove trial operations, invalid or duplicate trial rejection, IndexedDB persistence across bundle updates, plain/encrypted backup round-trips, wrong passphrase rejection and restoring original text while retaining trial history. The icon test checks PNG dimensions and versioned manifest/HTML/cache references.
- Local browser checks: created a trial on the supplied cookie recipe, reloaded and edited both fields, added a second trial, cancelled a removal (both kept), then confirmed removal (only the selected trial removed). Created a typed recipe and saved its own trial through the phone-width interface. All test entries exist only in temporary browser test storage.
- Inspected desktop and 390px recipe/trial screenshots. Navy handwriting remains readable, headings carry sparse yellow highlights, steps have red irregular circles, and outcomes have hand-drawn red arrows. Phone client/scroll widths both 375px inside the 390px frame excluding scrollbar.
- The recipe data file, contents module and full `bear.svg` are byte-for-byte unchanged. The face icon reuses and clips that exact vector's face region, excluding the cookie and paws, rather than drawing a new face. Inspected 32px and 60px icon rendering plus the 512px source. Versioned PNG sizes: 192, 512, Apple touch 180 and favicon 32.
- Patrick Hand is self-hosted WOFF with its OFL license. The student stylesheet, trials module, font and all new icon files are included in the offline shell.
- Physical iPhone/Safari, installed iOS PWA appearance and automatic artwork refresh of existing iOS shortcuts cannot be verified in this environment. No reinstall or storage clearing is recommended.

### Completed live and restore checks

- Deployed student/trials build `a198198574bcfadd` was checked through GitHub Pages. All 26 original routes retained exact titles and matching page-number footers, Ingredients and Prior Trials sections; no trial examples were seeded into the owner's 26-recipe library.
- On the isolated 390px live review, added and edited a supplied-cookie trial, added a second and removed it, then typed a separate QA recipe and added its own trial. The bear link opened Contents by pointer; the direct live bear link also opened it with Enter. The cover has no visible title or link text.
- Downloaded actual plain/encrypted backups from the direct local test app. Confirmed a 28-record plain replacement restore; then removed a typed recipe's trial and recovered it by encrypted restore. Wrong passphrase produced no restore action. In the direct live app, a plain restore kept all 26 duplicates unchanged; encrypted wrong/correct passphrases produced rejection/a valid preview without uploading or overwriting owner data. Cross-origin iframe download/file-chooser events are blocked by the managed browser; direct-tab download and chooser flows work.
- Font follow-up: 24 tests now pass. The menu offers Notebook default, Kalam and Kristi, with actual distinct licensed local WOFFs. Verified computed body families, FontFaceSet loaded checks for each, 390px screenshots and selected-font persistence on reload. The preference is independent of recipe/backup content and survives IndexedDB library updates. Kristi is enlarged; headings and controls remain in the default face.

- Real offline check: stopped the preview server, reloaded build `c524eee786f4d275`, retained the selected Kristi preference and saved trials. Switched among Notebook default, Kalam and Kristi; FontFaceSet confirmed each actual face loaded from cache. Added a new trial and reloaded it successfully while the server remained stopped.

## Header wordmark removal

Inspected the owner's full-size IMG_3772.jpeg: the indicated item is the blue `recipe.` header wordmark on the cover, not stored recipe content. Removed that visible wordmark from the shared header and retained return-to-cover navigation as Cover inside the existing menu. The menu remains at the right; recipe data, trial history, font preferences and cover artwork are unchanged.

## Compact Contents and removed tagline

- Inspected IMG_3773.jpeg at full size. The screenshot shows the Contents front matter, subtitle, reorder control and first section header, rather than the open menu. Condensed only the Contents screen: its header, heading/reorder row, section headings, empty-section notes, recipe rows and reorder panel. Removed “A few good things, worth making again.” and its paragraph. The removed wordmark remains absent; recipe text/data, cover, menu and recipe-page styling are unchanged.
- Retained 44px recipe-link heights and 44px drag handle widths/heights, with minimum 44px Up/Down buttons. Smaller 14px entry text, compact headings and reduced noninteractive margins preserve long-title wrapping and separate page-number alignment.
- Compared the old 9a5a6a0 layout with the new layout using the same 28-entry temporary local test library. At 390px frame width (375px excluding scrollbar), book height fell from 2337px to 1686px (27.9%); first section top from 337px to 135px. Fully visible recipe rows increased from 4 to 11. At 320px (305px excluding scrollbar), book height fell from 2409px to 1686px (30.0%); first section top from 363px to 135px, visible rows from 3 to 11. Both widths had no horizontal overflow or title/page-number overlap. Minimum link height was 44px.
- Browser tests at 320px: dragged a whole section using its handle, checked new order/page 03, undid it, used Enter on a section move control, cancelled layout changes, moved Crab Cakes up via keyboard, cancelled, navigated the long Copycat Mary O’s Irish Soda Bread Scones title and returned via the footer Contents link. No test order changes were retained.
- Physical iPhone/Safari is unavailable; phone-width Chrome comparison and pointer/keyboard interactions were tested. Private baseline/comparison files are outside the deployed public source.

## Contextual TOC menu and unobstructed cover

Removed the visible Contents heading from the TOC; its h1 remains screen-reader-only without layout space. Moved Reorder sections into the contextual TOC menu; Finish reordering, Undo last change and Cancel changes are also available there during reorder mode. These actions do not appear on recipes or other pages. The cover hides the menu/header entirely and retains the keyboard-accessible bear link to Contents. Recipe data and ordering storage are unchanged.

- Phone-width interaction check: cover menu is not visible; bear Enter opens the TOC. TOC h1 is clipped to 1×1px with no visible heading gap, and there are no inline reorder buttons. Entered Reorder sections from the menu, moved Sides up, used Finish reordering from the menu, checked Shrimp Marinade at page 03 and retained order after reload. Restored the test order, then verified recipe and backup pages contain no TOC reorder actions and recipe Edit still works.
- Refined the requested cover tone to light muted firewood brown `#c8b69d` (RGB 200,182,157), compared with previous RGB 168,129,93. Matched HTML/body background, manifest launch fill and cover theme color; non-cover theme color stays unchanged. Side-by-side 320px screenshots show the same bear/texture and no edge seam. Full bear and Home Screen icon files were not modified.

## Cover cold launch and Auto Backup

The header and menu button now start hidden in HTML, the header is inert, and an inline critical CSS guard allows it only after a non-cover route renders. This covers no-hash launches, #cover and pre-hydration. The service worker reports its build to clients; mismatched shells refresh only without a draft. Activation refreshes cover clients, including older shells that did not reload on first controller claim. Online/pageshow trigger checks. No database/cache-storage coupling or uninstall is used.

Auto Backup creates the latest two recovery snapshots in the same IndexedDB transaction as recipe edits, additions, trials and book saves. Restore stages the selected snapshot in the existing checked merge/explicit-overwrite flow. Export uses file sharing where available, or a download. These snapshots do not protect against clearing origin storage. iPhone Safari/Home Screen does not support showDirectoryPicker; OPFS is not Files. References: https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/ and https://github.com/WebKit/standards-positions/issues/28 . Capability detection controls the folder UI.

Reusable core: public/backup-core.js exports serializeBackup(work) and rotateFolder(directoryHandle, backup, ownedFilenames, rememberOwned). App adapters supply snapshots and persist the returned owned filenames. The core writes a new UUID filename, closes and reads it back before deleting only tracked app files beyond the latest two. Failures preserve prior copies; permission denial pauses folder copies. Folder snapshots are explicitly plain JSON; no encryption key/passphrase is retained. Existing AES-GCM encrypted manual export remains separate. Never reuse the Recipe ownership filename list in another app; each adapter needs its own directory/namespace and ownership state. Other repositories were not changed.

26 automated tests pass, including atomic two-snapshot rotation, lossless trial/ingredient restore, serialized folder writes, unrelated file preservation, write-failure preservation and service-worker build/cover activation behavior. Linux WebKit 26.5 ran no-script/no-hash/#cover first-paint and 320px keyboard/navigation checks. Physical installed iPhone testing is unavailable.

WebKit phone UI also verified typed recipe creation, a saved Prior Trial, latest/previous snapshots after reload, JSON export contents and restore preview with explicit overwrite approval. Old controlled shell and uncontrolled stale shell both upgraded automatically while retaining a saved font and durable probe. WebKit offline reload emulation returned an internal engine error, so that path remains covered by the service-worker offline regression test rather than a claimed installed-device test.
