// Exports the therapist "drafts" that exist in the repo (the design sample cards in src/views/Therapists*.jsx / TherapistProfile.jsx) untouched.
// Usage: node audit/scripts/export-therapist-drafts.mjs  -> audit/import/old-therapist-drafts.json
import fs from 'node:fs';
const files = ['Therapists', 'TherapistsCity', 'TherapistsProvince', 'TherapistProfile'];
const cols = ['name', 'credentials', 'city', 'session_mode', 'bio', 'tags', 'fee', 'availability'];
const out = { generated_by: 'audit/scripts/export-therapist-drafts.mjs', note: 'These are the DESIGN SAMPLE cards of the four draft therapist pages (placeholder name "Therapist name", sample fees, "verified: true" hard-coded in the view). They are not real therapists and are not published.', files: {} };
for (const f of files) {
  const src = fs.readFileSync(`src/views/${f}.jsx`, 'utf8');
  const m = src.match(/const thRaw = (\[[\s\S]*?\n    \]);/);
  if (!m) { out.files[f] = { error: 'thRaw not found' }; continue; }
  const rows = (0, eval)(m[1]);
  out.files[f] = { count: rows.length, fields: cols, records: rows.map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i]]))) };
}
const distinct = new Map();
for (const f of Object.values(out.files)) for (const r of f.records ?? []) distinct.set(JSON.stringify(r), r);
out.distinct_records = distinct.size;
out.fields_present_in_every_record = cols;
fs.writeFileSync('audit/import/old-therapist-drafts.json', JSON.stringify(out, null, 1));
console.log(Object.fromEntries(Object.entries(out.files).map(([k, v]) => [k, v.count ?? v.error])), 'distinct:', distinct.size);
