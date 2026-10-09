# Progress

Nothing is committed or pushed. Dev server: port 3217. Re-run everything: `sh audit/scripts/run-all.sh`; article images: `node audit/scripts/check-article-images.mjs --routes ...`.

## Done
- Pages rebuilt from `designs/*.dc.html` and passing `compare-design.mjs`: Promote, Centre, City, Province, Drug, Intervention, ClaimListing, CentreOnboarding. Header/footer: `compare-header-footer.mjs` (known differences: "Sign in" / "Find a Therapist" omitted, 390px touch-target sizes).
- Fix A (stacked and blurry article images): `tidyImages()` in `src/dc/guide.js`, used by `buildBody` and `buildGuide` (Drug, Alcohol, Intervention and the treatment pages, BlogPost, Centre, City, Province). Checked by `check-article-images.mjs`.
- Fix B (Centre): Team section removed; Reviews rebuilt without invented scores or reviewers; demo text swept from `src/`. Compare script: `--skip ...,Team` and `--changed Reviews`.

## Open (needs the client)
- No `FORM_ENDPOINT` / payment processor: ClaimListing and CentreOnboarding payment steps and all callback forms are not connected.
- Header omits "Sign in" and "Find a Therapist" (draft pages).
- Rows in `DESIGN-PLACEHOLDERS.csv` marked "yes".
