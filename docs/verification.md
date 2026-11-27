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
