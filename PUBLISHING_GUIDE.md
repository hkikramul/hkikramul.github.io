# One publishing system

## Permanent homes
- Making Sense (`making-sense/`): statistics, mathematics, research methods, technical notes, and research explained for general readers. Bangla, English, or paired editions.
- Debabrata Basu (`making-sense/debabrata-basu/`): English-only long-term personal founding vision; update only when a real milestone occurs.
- East Bengal Renaissance (`east-bengal-renaissance/`): society, labour, policy, world affairs, history, culture, and public-health issues. Bangla, English, or paired editions.
- Probash Watch (`east-bengal-renaissance/probash-watch/`): EBR subsection; maintain dashboard source and public data here only. Follow its UPDATE_POLICY.md.
- Academic profile (root): biography, CV, research records, publications, teaching, contact; link to full writing rather than reproduce it.

## One home per article
Choose the destination before drafting. Link from other sites with a title and short introduction. Preserve original publication dates and sources. Record a substantive revision date only when the content changes. Keep existing reader controls and accessible layouts.

## Languages
Publish in Bangla, English, or both. Never promise a translation that does not exist. Use a visible বাংলা | English switch and alternate links for paired editions. Apply substantive corrections to both editions. Debabrata Basu remains English-only.

## Editing
HTML controls page layouts and editorial text. `making-sense/app.js` still loads lesson and resource data from `content/learning/lessons.json` and `resources.json`. Old academic/CMS text fields do not control revised static pages. Update the actual HTML, and use JSON only where explicitly loaded. Probash Watch remains a compiled React app: edit source/ and rebuild when changing app functionality; public data updates need no rebuild.

## Publishing and review
Use PUBLISHING_QUEUE.md for all ideas: Idea → Draft → Review → Published. One current priority across the system is enough. In a weekly 30-minute review, check corrections and broken links, inspect scheduled output, then choose the next priority. There is no per-section publication quota.

## Migration
`publishing-migration.json` maps the moved files. Old public HTML addresses forward to their corresponding pages, preserving hash/query through `/assets/redirect.js`; ordinary links and canonical URLs use the new addresses. The general reading anthology was split: statistical history/research collections remain in Making Sense; other reading moved to EBR. Old reading anchors provide forwarding links. Do not republish data or full articles at legacy addresses. Scheduled news writes must use the nested Probash Watch path.
