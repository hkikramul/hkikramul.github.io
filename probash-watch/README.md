# প্রবাসপ্রহরী | Probash Watch
Private pilot for evidence-led tracking of Bangladeshi migrant worker incidents worldwide.

## Working capabilities
Bangla/English responsive UI, global country selection, approximate country markers, gender filters, categorical charts, JSON export, source-linked incident details and Arabic draft summaries where available. D1 stores signed-in reports, moderation status, audit events and RSS candidates. Owner editor approval gates publication. Polling refreshes displayed records every minute; this is separate from unattended news collection.

## Runtime
Vinext on Cloudflare Workers with Sites-managed `DB` D1. Run dependency helper, `pnpm db:generate`, TypeScript check, and Sites build helper. Commit schema migrations. Sites provides sign-in headers. Editor account: ikramul.statistics@gmail.com. This is a private pilot, not a public reporting service. GitHub Pages alone cannot run these server APIs.

## Scheduled updater
POST `/api/scan` with a JSON body `{ "candidates": [{ "title": "...", "url": "https://original-publisher/...", "date": "YYYY-MM-DD", "source": "...", "country": "SA" }] }` accepts up to 50 source discoveries for unattended ingestion. POST with an empty body retrieves Google News RSS, hashes URLs for deduplication, stores candidates as unverified; GET `/api/scan` reads them back. Obtain the current private Site service bearer from `get_site`, send as `OAI-Sites-Authorization: Bearer ...`. The private dispatch boundary authorizes service requests with no visitor identity. Signed-in non-editors cannot trigger scans. **Do not make this Site public without replacing service-route authorization**, adding abuse controls and auditing disclosure. Never place bearer values in code, schedules or GitHub.
RSS is discovery only: follow through to the original publisher, check country, nationality, worker status, incident dates, duplicate incidents, evidence, official response and privacy before creating a report. No AI model or automated translation is currently configured. Scans can fail or miss reporting. Country rankings or prevalence estimates are invalid without denominators and sampling design.

## Privacy and editorial operations
No NID/passport numbers or document uploads. Login authenticates an account, not a government identity. Production identity verification requires an authorized provider, encrypted isolated storage, restricted access, retention/deletion policies and a tested review process. Do not request raw documents through this pilot. Initial seed records are sourced examples, not a complete incident registry. Distinguish allegations from findings. Translation drafts must be checked. Assistance should not require party membership. Public release needs a named editor, survivor consent process, corrections channel and verified help directory for each destination.

## Current limits
No government NID/passport verification, unrestricted public intake, confidential survivor case management, full-language AI translations, automated factual verification or complete all-country helpline directory. Sources may be syndicated; URL deduplication is not incident deduplication. The review step is essential. No party representation is claimed or published.

## Audience scope and source policy
Track Bangladeshi citizen migrant workers, irrespective of birthplace. Birthplace/ancestry is not proof of citizenship. Reporter accounts are distinct from worker eligibility; no government identity-document verification is integrated. Record source-reported/self-declared/officially confirmed/unknown nationality basis; unknown basis blocks publication. Public readers may be any nationality. `public/sources.json` is a proposed monitoring registry, not connected-feed status. Prioritize original reporting, independent corroboration, official case statements, translated claim alignment, incident deduplication and a documented correction process.

## GitHub Pages edition
The public dashboard at https://hkikramul.github.io/probash-watch/ is a static public-source snapshot. It reads its own JSON, never the private intake database, and links to the owner-private reporting portal. Pages cannot execute the Workers/D1 APIs. Updating public records requires an explicit reviewed data export/commit. The twice-daily cloud task still writes to the private discovery queue; it does not automatically promote to the public snapshot. Public page refresh checks the committed snapshot every minute and is not a guarantee of live incident discovery.
