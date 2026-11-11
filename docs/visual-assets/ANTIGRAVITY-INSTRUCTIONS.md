# Import instructions

1. Read FINAL-IMAGE-MAPPING.json and ALL-93-ID-STATUS.csv. Match each included ID to its actual page/component using Page URL, Exact image placement and Topic. Audit URLs are hints; inspect real routing before editing. Report ambiguous placements rather than guessing.
2. Copy desktop/ and mobile/ to the appropriate repository public asset directory, retaining exact filenames and unit folders. Prefix mapping paths with that directory. Do not flatten directories or reuse one image across unrelated IDs.
3. Use each mapped desktop/mobile pair with responsive picture/source markup, appropriate explicit dimensions and alt text describing the image. Respect existing breakpoints. Avoid new crops that cut faces or useful details. Keep course names and CTA text as editable HTML.
4. Preserve current fees, curricula, CTAs, navigation, links and unrelated assets. Use these as editorial visuals without inventing authentic students, faculty, testimonials or outcomes. Do not add visible placeholder labels.
5. Include all requested visual units in suitable galleries/placements where supported; report any unused units rather than silently dropping them. Keep the 10 existing-source pending IDs unchanged. Do not add imagery to no-image rows.
6. Eager-load only actual above-fold/LCP imagery, lazy-load below-fold images, and verify mobile cropping, no layout shift, no broken paths and relevant build/lint checks.
7. Follow the existing development-branch release policy. Prepare changes and report implemented/unresolved IDs. Do not merge or deploy as part of this import task.
