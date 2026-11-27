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

## Current correction: external-folder-only backups and cover diagnostics

This section supersedes the automatic browser recovery behavior documented for 31f4f42 above. No save path creates or rotates browser recovery snapshots, regardless of the legacy autoRecovery setting. Existing recoverySnapshots are preserved unchanged and remain exportable/restorable under Older recovery copies. Automatic external folder writes remain permission-gated and serialized, retain the latest two app-owned files, and do no snapshot serialization unless a real supported folder handle is connected. On iPhone/WebKit without showDirectoryPicker the picker is unavailable, no enabled Auto Backup toggle is shown, and manual Save to Files/plain/encrypted export remains available. Normal recipe persistence is unchanged.

The supplied IMG_3774.jpeg visibly contains the app's navy three-line icon (matching its 24px-by-2px strokes at screenshot scale) on a darker brown bear cover. It contains no address bar, app build identifier or service-worker state, so it cannot establish the running release, URL, or whether it is an installed app rather than a cropped browser view. It is not evidence of an iOS-owned control. Current cover now detaches the entire header/menu from the DOM, with initial hidden/inert HTML and critical CSS still protecting first paint. Paper pages reattach the same controls and event handlers. Backups displays build, address, current route, browser/standalone display mode and controlling worker build, plus a safe Reload app button.

WebKit checks at the supplied screenshot's 337-by-617 CSS aspect confirmed no header/menu DOM on cover, keyboard/click bear navigation, blue menu on contents, return-to-cover removal and unavailable external picker UI. Standalone identity was simulated for diagnostic testing; this is not a physical iPhone test. Upgrade regression retains the old enabled setting and old recovery copies, saves a recipe and Prior Trial, confirms the legacy snapshots are byte-for-byte unchanged and verifies manual JSON export includes the current recipe/trial. All 26 automated tests pass.

For a visibly stale installed copy: in that same Home Screen app, open its visible menu, Backups, Check for app update; keep it open online until the download/reload finishes, then return to Cover. Closing and reopening that same app is safe if a downloaded update has not repainted. Do not uninstall or clear website data. If the old screen persists, obtain the Backups app/worker build and address details; this cannot be inferred from the cropped cover screenshot or proven by an emulator.

## Seven illustrated pages and reader cleanup

Seven of the 26 supplied pages now have distinct graphite art: Brown Butter Miso Chocolate Chip Cookies, Pistachio Olive Oil Cake, Milk Bread, Crab Cakes, Zucchini Bread, Sourdough Discard Naan and Spring roll shrimp. The existing three image assets and cover are unchanged. Added original big-eyed crab and jumping zucchini characters plus straight naan and shrimp-roll studies. Display-only registry `recipe-presentation.js` selects art by stable ID, sizes and positions; it does not mutate stored recipes. Editor no longer carries illustration fields into newly saved personal overrides. Four transparent local WebP additions total about 350 KiB; all seven assets and the presentation module are in the offline shell list.

Recipe typography is about 7–10% smaller, including headings, body, notes, numbers and labels; Kristi retains larger font-specific sizes and generous line spacing. TOC styles and navigation touch targets are unchanged. WebKit at 320px measured default ingredient text 21px before vs 19.5px after. All three fonts switched through the menu successfully. Screenshots at 320/390/1024px confirmed no horizontal overflow or art/text overlap; desktop left/right placement and between-section art become left/right-aligned stacked illustrations on narrow screens.

Generated missing-data amounts and default transcription uncertainty callouts are omitted only from presentation. Names render without invented amounts. Stored data, editing fields, component labels, substantive notes and user-amended uncertainty text remain intact. Empty methods and generic empty trial messages are omitted; the Prior Trials action remains. Browser checks covered exact titles and ingredients across all 26 routes, exactly seven images, a restored legacy Crab Cakes record with all ten names and unchanged raw placeholder amounts, an edit retaining contextual notes without storing art, cover/menu behavior and Files-only Auto Backup. All 29 automated tests pass, including presentation/data integrity regressions. Physical iPhone testing remains unavailable.

WebKit's active cache was inspected after a real service-worker install: all seven art URLs were present. Full offline reload still returns the headless WebKit internal-engine error noted in previous releases; VM offline shell tests pass. All 26 browser routes additionally matched their complete root/component method steps, except removal of the cookie step's orphaned generated footnote marker. The recipe data file, existing three art assets, cover and icon files have no diff.

## Crab and CAMP COOKIES placement refinement
Crab Cakes uses the identical crab WebP, now reduced to 64px on phones / 84px on desktop and rotated -30 degrees beside its ingredients. CAMP COOKIES (stable ID camp-cookies, exact verified title) gains a small original shaded graphite sketch of both elephants from the owner's private reference: larger on right with grass, smaller on left. It sits beside ingredients at +30 degrees. The reference photo is not part of repository files. This adds an eighth illustrated page without changing any of the original seven assets or recipe data.

Rotation-aware wrappers reserve 90px on phones / 120px on desktop; 64 × (cos 30° + sin 30°) < 90 and 84 × (cos 30° + sin 30°) < 120. Margin notes span the full width below the ingredient row. WebKit checks at 320/390/1024px verified both rotations from computed transform matrices, adjacency to ingredients, containment in wrappers and paper, zero intersection with ingredient text, no horizontal overflow, exact titles and ingredient lists. All 30 automated tests pass. New art is included in service-worker precache. Physical iPhone remains unavailable.

## Larger upright elephants, side shrimp and shortbread landmark
CAMP COOKIES keeps its identical elephant WebP, now unrotated, with responsive side-image widths of 100px at a 320px viewport, 120px at 390px, and up to 210px on desktop (previously 64px on phones). Spring roll shrimp keeps its original asset and angle, moves beside ingredients, and uses the same space-aware sizing rather than a full-width row. Fortnum & Mason Shortbread (fortnum-mason-shortbread) gains an original tall graphite Elizabeth Tower drawing with clock face and Gothic spire beside its ingredients; the new local WebP is precached. No recipe data or existing image bytes changed. Crab Cakes retains its same asset, -30 degree tilt and 64px phone / 84px desktop sizing.

WebKit geometry and screenshots at 320/390/600/1024px verify exact titles/ingredient lists, adjacency, image containment, no art/text overlap, no ingredient overflow and no horizontal scrolling for all four side-image pages. At 320px the new right-side layouts retain 150px ingredient columns; at 390px they retain 200px. All 31 automated tests pass. Physical iPhone testing is unavailable.

The shortbread page also has a separate smaller shaded bearskin cap below the primary Big Ben sketch in the same column. Both assets have distinct meaningful alt text and both are in the offline precache. The figure grows naturally to contain them; the cap is 65% of the primary image width. WebKit checks explicitly confirm it lies below Big Ben, is smaller, and remains outside ingredient text at 320/390/600/1024px. All three handwriting options were checked at 320/390px on the four side-art pages without ingredient overflow. All 32 automated tests pass.

## Chocolate Lava Cake character
Added an original shaded graphite drawing on the exact Chocolate Lava Cake route (chocolate-lava-cake), based on the owner's inspected private PNG. It preserves the smiling porous cake character, ribbed ramekin hat, small arms and boots, plus ice cream and mint. Only the new WebP is shipped. It uses the established responsive right-side ingredient column (100px image at 320px, 120px at 390px), with no tilt. Recipe data and all existing artwork remain unchanged. Asset is explicitly precached; all 33 automated tests pass. WebKit geometry checks at 320/390/600/1024px confirm unchanged titles/ingredients, adjacency, containment and zero text overlap or horizontal overflow. Physical iPhone testing remains unavailable.

## Shortbread cap upper-left and opposing tilts
Only the shortbread illustration composition changes. The unchanged bearskin asset is now above-left of the unchanged Big Ben asset. Cap is rotated -15 degrees and Big Ben +15 degrees, so their tops lean away. Ingredient column widths remain 150px at 320px and 200px at 390px. The cap retains its previous CSS width; the tower is scaled to 78% of its prior width to reserve its rotated rectangular bounds inside the existing illustration column without crowding the text. It retains the right-aligned placement, with diagonal separation and a clear gap between cap and tower.

WebKit before/after checks at 320/390/1024px verified exact recipe title/ingredients, both transform angles, cap above-left, no intersection between either rotated image and ingredients or the other image, and full containment without clipping/horizontal scrolling. Screenshots were checked with fonts fully loaded. All 33 automated tests pass; recipe data and all image bytes have no diff. Physical iPhone testing remains unavailable.

## Shortbread spacing and ruled TOC refinement
Shortbread's two unchanged, oppositely tilted assets move up 20px through real figure margin reduction. The grid's notes-row gap is 4px. Against b01425d at 320px the visible gap after the last ingredient decreases from 16.06px to 8.06px and Margin Notes moves up 8px; at 390px that gap decreases from 62.25px to 34.25px and notes moves up 28px. The art's reserved row height also shrinks where it determined the grid height. All rotated bounds remain clear of headings, ingredient text and notes.

TOC ink placement was compared with the owner's private row reference. Its ink baseline sits about 4 CSS pixels above the paper rule, leaving the descenders just clear, and its dotted leader is about 5px above the baseline. A compact 22px ruling rhythm, measured inline baselines and ink-only offsets align section headings, optional custom subheadings, wrapped title lines and page numbers. ResizeObserver and font readiness realign after wrapping/layout changes; link and drag boxes retain their 44px minimum. The existing Recipe Font choice remains recipe-only, so TOC typeface is preserved and the ruling works under all three choices. Colors and pink margin remain notebook paper; recipe text/cover styles are unaffected.

Indian, Chinese and Other TOC subheadings and their empty rows are omitted. Their stored sections, categories, recipe order, stable routes and page numbering remain unchanged. Reorder drop targets and destination options remain; hidden default subsection removal remains available in the edit panel. All visible section counts are removed, including numeric totals in removal confirmation; internal counts and reassignment logic remain intact.

34 automated tests pass. WebKit checks at 320/390/1024px measure zero baseline, title/page-number and dotted-leader alignment error. At phone width 48–52 ink blocks move upward and only 2–6 downward. The initial TOC is 1372px tall versus 1566.23px previously, with every entry once and in its original order. Tests cover all three font preferences, all 26 original routes/page numbers, pointer recipe reordering, a drop into hidden Indian with undo, keyboard chapter reorder/cancel, subsection removal cancellation, and a 34-recipe synthetic long list with wrapped titles and a visible custom subsection. The input reference is not published. Physical iPhone remains untested.

## Recipe writing aligned to paper, reading-label cleanup
All recipe reading pages now have light paper guides 4 CSS pixels beneath their measured writing baselines, matching the approved TOC reference gap. Wrapped titles, ingredient/component lines, methods, margin notes and Prior Trials are covered. The guides follow the existing font metrics rather than changing content flow or adding blank rows; rotated margin notes carry their own local rules. Font readiness, font preference changes and responsive resizing refresh the guides. SVG guides are decorative, noninteractive and never saved in recipe records; the module is precached.

Removed the visible THE RECIPE NOTEBOOK TOC eyebrow, FROM THE RECIPE NOTEBOOK recipe eyebrow and recipe category/cuisine strip. Their layout rows are removed; recipe heading top margin closes the leftover gap. Category assignments, editor selectors, TOC group headings and page links remain. Recipe data, artwork registry/assets, storage, backups, cover and icon have no changes.

36 automated tests pass. WebKit inspected all 26 routes at 320 and 390px in Notebook Default, Kalam and Kristi (156 combinations), plus four varied desktop recipes in all three fonts (12 combinations). Across 806 wrapped text blocks the measured last-line baseline-to-rule error was 0 CSS pixels; no horizontal overflow or artwork/text intersections occurred. Font-loaded screenshots of cookie, crab, elephants, shortbread and edited multiline trials were checked against the private reference. Before/after checks on six illustrated pages at 320/390/1024px confirm identical reading text/block dimensions and artwork assets, dimensions, tilts and offsets from ingredients (within 0.01px rounding).

A real isolated WebKit service-worker transition from deployed build 15fb3f6f00618d32 to this release retained all 27 test records, bundled edits, multiline trials, section layout and stable routes without reinstalling. Actual UI tests covered adding a long local recipe, editing a bundled amount/note, trial save/edit/reload, plain JSON download, encrypted download, wrong-passphrase rejection, checked encrypted restore into clean storage and plain duplicate-skip merge. Restored/edited reading pages use the same rules and omit the removed labels. The active worker cache contains the ruler and local handwriting fonts. TOC regression checks pass at 320/390/1024px: every original route/page footer, baseline/leader alignment, pointer drag, hidden-cuisine drop/undo, keyboard chapter reorder/cancel, and a 34-recipe wrapped/custom-section list. The new TOC is 1344px tall on phones with no orphaned label row. Physical iPhone testing is unavailable; headless WebKit full offline navigation remains limited by its previously recorded internal engine error, so cache inspection and automated offline-worker tests are used.

## Temperature units and usable recipe copy
Audited all 26 bundled recipes, including components, method, notes and uncertainty fields. Fourteen unitless oven settings across eleven recipes now say °F (eleven degree-marked settings and Sourdough's three bare settings). Existing 167°F remains unchanged. CAMP COOKIES retains both explicitly supplied numbers/scales, with 350°F first and 175°C second; neither numeral was reinterpreted or converted. Sourdough retains the ambiguous “475°F oven” wording without inventing a preheat sequence. Missing oven temperatures remain missing.

Twenty-one recipes have exact source-commentary cleanup, preserving alternate batches, ratios, trial quantities, cooking guidance and meaningful uncertainty. For example, Chocolate pie dupe retains all seven small-pie amounts and its 167°F target, without the “handwritten values, not a calculated scaling” sentence. Blueberry's uncertain 45-minute duration stays explicitly uncertain. All main/component ingredient amounts, titles, IDs, category assignments and source identifiers are unchanged. Overall, 22 recipes changed when combining copy and temperature cleanup. Original source-copy strings remain in the narrowly scoped compatibility table and pre-update bundled-data test fixture; no private device recipes are included.

Reading normalization is independent of storage. It handles explicit missing temperature scales and only exact known editorial strings under bundled IDs, never broad deletion of a user's handwriting/scaling notes. The editor and exports keep personal saved text. Normalizing original and saved records equally prevents unchanged legacy uncertainty fields from appearing as new custom callouts. New modules are precached.

40 automated tests pass, including every legacy bundled recipe against the canonical result, input immutability, retained ingredient amounts/alternate quantities, Celsius preservation, ranges, times/weights/angles, custom-note preservation and offline-worker/storage regression tests. WebKit checks all 26 routes at 320/390px in all three fonts plus desktop samples (168 combinations): no overflow/art collisions and 0px last-line ruling error. A real previous-build service-worker transition preserves edited records and section layout while refreshing untouched bundled recipes. Actual UI tests cover a saved bare-unit method rendering °F without database rewriting, a personal “My handwritten notes” note retained, local additions, multiline trials, plain/encrypted export/restore and wrong-passphrase refusal. Physical iPhone unavailable; full offline navigation retains the recorded headless WebKit limitation, with cache inspection and automated worker tests used instead.

## CAMP COOKIES Fahrenheit-only reading follow-up
The exact canonical CAMP step and its known legacy transcription now display the original supplied 350°F only. Canonical recipes.js, stored device records, editor text and backups retain the supplied Celsius/Fahrenheit pair. The compatibility map is restricted to the bundled CAMP identity and exact full source strings; distinct personal Celsius methods/notes and custom recipes are unchanged. An audit of all 26 bundled reading records finds no remaining Celsius, so no standalone Celsius conversion was needed. All 41 tests pass, including source immutability and distinct personal temperature preservation. WebKit checks all 26 routes, page footer links, CAMP at 320/390px in all three fonts, actual bundled edits/reload and ruled-line alignment; source pair and personal edits remain unchanged in storage.

## Alphabetical contents with recoverable Manual order
Recipe order defaults to A–Z on existing and new installations. Case-insensitive title sorting combines root recipes with hidden Indian/Chinese/Other cuisines inside each visible category; category order and cuisine assignments are preserved. Visible custom subsections retain their own alphabetized lists. One derived sequence drives TOC entries, page footers and Previous/Next. Adding or renaming a recipe updates its alphabetical position immediately. Reading sorting never writes the stored bookOrder, so the previous manual arrangement remains recoverable.

The TOC-only menu's Recipe order picker switches between A–Z and Manual (saved order). Recipe drag/Up/Down/Move to controls are available in Manual; chapter ordering, section management and cancellation remain available. The choice persists separately from recipe text. Plain/encrypted exports and permissioned external-folder snapshots include it; checked layout restore restores it atomically with the sections and records. Legacy backups without a mode preserve the current preference. Restore success is announced only after the in-memory library refresh completes, fixing a race exposed by immediately opening a restored page.

45 automated tests pass. WebKit verifies all 26 built-in plus three mixed-case/wrapped recipes across hidden cuisines, actual editor renaming, customized category order, exact TOC/page/Previous/Next sequence, pointer manual reorder, A–Z/Manual switching and reload, and real backup download metadata. Screenshots and ruling measurements pass at 320/390/1024px without overflow. A real service-worker upgrade from the preceding deployed release applies A–Z while retaining all 27 test records, existing edits/trials, customized section order and the older Manual arrangement. Plain/encrypted restore and wrong-passphrase checks pass. No recipe content, art, cover, font or paper CSS changed. Physical iPhone testing is unavailable.

## Chocolate Pecan Pie chicken and Sourdough scarf character
Added two original monochrome graphite drawings from the owner's privately inspected PNG references: a cheerful chicken spooning chocolate and pecans into miniature pie crusts, and a smiling scored sourdough loaf wrapped in a knitted scarf and heart-patterned shawl. Only the generated drawings ship. The exact routes are chocolate-pecan-pie and sourdough; Chocolate pie dupe and all discard recipes stay unchanged. Existing art entries/assets and recipe data are unchanged.

Both are on the right of ingredients in the established responsive side-food layout. A filename-scoped portrait rule gives the chicken full available width without changing other pages. Optimized local WebPs (720px) preserve alpha and graphite shading, with descriptive alt text and explicit offline precache entries. Built-in image generation was used; final prompt subjects and saved asset paths are recorded in food-sketches.md.

46 automated tests pass. WebKit traverses the cover/TOC entry point and checks both exact recipe titles/routes at 320/390/1024px in Notebook Default, Kalam and Kristi. Screenshots, image and ingredient bounding boxes, containment checks and ruled-baseline measurements verify right-side placement, no collision/clipping/horizontal scrolling and unchanged line alignment. Physical iPhone testing remains unavailable. No unfinished Drive integration code is included in this release.

## TOC title search and explicit recipe reordering
A TOC-only magnifying-glass button sits immediately left of the menu. It opens/focuses a compact title search with literal case-insensitive matching, Clear, Close and Escape dismissal. Rows are hidden rather than renumbered: matching category groups, A–Z/Manual sequence, original page numbers and full-book Previous/Next remain intact. Empty headings hide during a search and a simple no-results status appears. Search works on current local titles, including typed/renamed entries, and is memory-only. It closes and clears before reordering; the button is absent from cover/reading pages and hidden during reorder mode.

The menu now exposes Reorder recipes directly. This intentionally enters Manual mode and makes recipe handles, Up/Down and Move to controls available. A separate saved ID sequence allows moves across hidden cuisine groups without losing the recipe's original cuisine during same-category row moves. Explicit Move to/drop destinations reassign categories/cuisines. Empty sections remain usable targets. Numbers update in the applied reorder view immediately; Cancel restores layout/order/mode while retaining current recipe text edits. Existing legacy Manual order remains the fallback until a user explicitly establishes the new sequence. A–Z remains the default and is independently selectable.

Plain/encrypted and external-folder backups include the manual ID sequence; checked layout restore restores it atomically. Legacy layout restores clear the new sequence so their original bookOrder remains usable. Recipe data, fonts, illustrations and cover are unchanged.

49 automated tests pass. WebKit at 320/390px checks button adjacency/focus, mixed-case search, empty headings/no-results, clearing/Escape, result/footer links, local mixed-case/wrapped titles, automatic renumbering after each same-category and cross-category move, moving into an empty section, cancellation/save/reload and encrypted backup restore. Every recipe footer and Previous/Next link is checked after saving the custom order. Loaded-app offline search and navigation pass with network disabled. No horizontal overflow or page errors were observed. Physical iPhone/cold offline launch remains unverified; existing offline-worker regression tests pass. This focused release excludes all unfinished Drive integration work.

## Lentil Dosa and Bolognese content release

Added Lentil Dosa (Main / Indian) and one Bolognese (Main / Italian), reconciled from the two overlapping screenshots. Source images stay outside the repository. All previous 26 recipe objects are unchanged. Lentil Dosa contains the eight supplied ingredients and the only visible method step (soak and drain); its missing blending/cooking instructions are clearly flagged rather than invented. Bolognese contains 15 ingredients, eight steps, and the owner's finely-chopped-vegetables note.

52 automated tests pass. Fresh WebKit phone checks at 320/390 px in all three font options confirm both title searches, one entry per recipe, links/page numbers, ingredient counts, readable wrapping and no horizontal overflow. Actual previous-build service-worker upgrade preserves raw existing records, edited ingredients/trials, deliberately missing recipes, custom section order and manual order; adds only the two new records; repeat reload is idempotent and subsequent deletion stays deleted. Hidden Italian is added once without a visible cuisine heading or reordered roots. Physical iPhone not available.

## Opt-in Google Drive pilot (disabled until owner setup)

61 automated regression/security tests pass, including JWE fresh content-key/IV, wrong recovery key/tamper rejection, server-encrypted refresh tokens, PKCE/owner allowlist, replay/body binding, absent-Origin same-origin signed GETs, two download-verified copies, empty 502 upload cleanup, failed pruning/visibility changes and unrelated-file protection. Explicit complete-target handoff replacement is atomic: an injected write failure rolls back the clear, ordinary restore remains additive, and deliberate omissions stay missing after the next seed merge.

Synthetic WebKit browser interaction checks pass on the isolated same-origin deployment shape: explicit Google connection (mock consent/upstream only), recovery-file creation and verification, opt-in upload, real recipe/trial edits, exactly two encrypted copies, offline-edit catch-up, expired access-token renewal without consent, cold browser process close/reopen with persisted nonextractable device authorization followed by edit/renewal, and revoked-consent failure with both prior copies retained. Fresh-device restore rejects wrong keys and tampering before writes, requires preview/replacement approval, and restores exact edited amounts/trials. An encrypted handoff to a different localhost origin verifies content/sections/order and requires explicit complete-target approval to remove target-only records; source data remains intact.

Worker + static-assets dry-run passes. Cloudflare `whoami` reports not authenticated; production Google client/consent and actual Drive round trip have not been set up or verified. The shared GitHub Pages frontend fails closed even with stale enabled settings; it cannot enable this reusable device authorization. No real recipe data or Google credentials were uploaded, and no other app/repository was changed. Setup, free-hosting evidence and reusable source API are documented in `docs/drive-backup-setup.md`. Physical iPhone testing remains unavailable.
