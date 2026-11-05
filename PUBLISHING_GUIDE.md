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

## Shared reading and accessibility
All public pages load /assets/edition.js, reading-shade.js, site-tools.js and shared CSS. Do not add separate theme algorithms or autoplay. Automatic display uses solar elevation only after a visitor explicitly requests geolocation; otherwise a local-clock 18:00–20:00 fade-in and 06:00–08:00 fade-out. The same stored automatic/light/dark preference applies across this origin. Coordinates remain in memory.

## Bilingual mirrors
The English cover uses the same HTML/CSS and images as Bangla with `?lang=en`. Text-node maps in assets/translations translate the source in place. Existing independently published -en.html article pairs remain linked. Every new or edited Bengali paragraph needs a matching English entry, including dynamic controls, labels and alt text. Retain citation links, dates, factual qualifiers and the full text. Do not silently present an English summary as a complete translation. The academic profile and Debabrata Basu remain English-only. Probash Watch is native Bangla/English; additional country languages are explicitly opt-in external machine translations, not verified native editions.

## Audio, rights and privacy
Speech uses local browser voices by default; visitors may opt into online voices with disclosure. No form inputs are narrated. Optional procedural ambient sound is CC0, off by default, and stops for narration/media or hidden pages. The national anthem has its own user-controlled player and separate rights notice; never reuse it as ambient sound. Respect reduced-motion preferences. Read ASSET_RIGHTS.md and the public reuse/privacy policy before adding third-party material. No blanket promise of legal compliance or blanket relicensing. Do not restore analytics or third-party media auto-loading without revising the actual privacy behavior and notice.
