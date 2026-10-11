# Ikramul’s websites

- Academic: https://hkikramul.github.io/
- Learning: https://hkikramul.github.io/making-sense/
- Editing guide: https://hkikramul.github.io/admin/

## Editing without code

Sign in at https://app.pagescms.org/ and grant the Pages CMS GitHub app access to **only this repository**. Select the main branch. The root `.pages.yml` defines form-based editors for both sites. Save to publish via GitHub Pages. Content is stored in `content/academic/` and `content/learning/` JSON files. Content is public; never store credentials, personal records, or private drafts in this repository.

The public pages load same-origin JSON using `content-loader.js`. Original content remains available as a fallback if a fetch fails. Lesson and resource content use escaped text and HTTPS-only resource URLs. The visual demo runs locally in the visitor’s browser. No visitor editor credentials are stored or requested by the public websites.

To change the layout, edit HTML/CSS. For everyday content changes, use Pages CMS. GitHub commit history preserves prior versions.
