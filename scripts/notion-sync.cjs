'use strict';

/**
 * Notion sync for the Awesome Paper Agent.
 *
 * Given a normalized submission (the same shape `scripts/paper-agent.cjs`
 * produces), create a page in the Notion "Papers" database — but only if a
 * page with the same Paper URL does not already exist (dedup).
 *
 * Designed to run from the GitHub Action on PR merge, and to be testable
 * locally with `--dry-run` (builds the payload, performs no network calls).
 *
 * Env:
 *   NOTION_TOKEN        - internal integration token (required for live writes)
 *   NOTION_DATABASE_ID  - target database id (defaults to the Papers DB below)
 *
 * CLI:
 *   node scripts/notion-sync.cjs <submission.json> [--dry-run]
 *   node scripts/notion-sync.cjs --self-test
 */

const fs = require('fs');

const NOTION_VERSION = '2022-06-28';
const DEFAULT_DATABASE_ID = '35dc27ec-3fd9-80ce-b9f6-fc99e181e572'; // "Papers" database

// section (taxonomy level) -> Notion "Category" select option
const CATEGORY_BY_SECTION = {
  l1: 'L1 Predictor',
  l2: 'L2 Simulator',
  l3: 'L3 Evolver',
  benchmark: 'Benchmark',
  survey: 'Survey',
};

// world-type subsection -> Notion "Law" select option (L1 subsections are
// operator families, not worlds, so they yield no Law).
const LAW_BY_SUBSECTION = {
  physical: 'Physical',
  digital: 'Digital',
  social: 'Social',
  scientific: 'Scientific',
};

/** Derive {category, law} from a normalized `section` key like "l2-digital". */
function deriveTaxonomy(sectionKey) {
  const key = String(sectionKey || '').toLowerCase();
  const [level, ...rest] = key.split('-');
  const sub = rest.join('-');
  const category = CATEGORY_BY_SECTION[level] || null;
  const law = LAW_BY_SUBSECTION[sub] || null;
  return { category, law };
}

function normalizeUrl(value) {
  return String(value || '').trim().replace(/\/$/, '');
}

/** Build the Notion `properties` object for a create-page request. */
function buildProperties(submission) {
  const { category, law } = deriveTaxonomy(submission.section);
  const props = {
    Name: { title: [{ text: { content: String(submission.title || '').slice(0, 2000) } }] },
    Paper: { url: normalizeUrl(submission.paper_url) || null },
  };
  if (category) props.Category = { select: { name: category } };
  if (law) props.Law = { select: { name: law } };
  if (submission.venue) props.Venue = { select: { name: String(submission.venue).slice(0, 100) } };
  if (submission.year && !Number.isNaN(Number(submission.year))) props.Year = { number: Number(submission.year) };
  if (submission.authors) props.Authors = { rich_text: [{ text: { content: String(submission.authors).slice(0, 2000) } }] };
  if (submission.code_url) props.GitHub = { url: normalizeUrl(submission.code_url) || null };
  return props;
}

async function notionRequest(fetchImpl, token, path, init) {
  const res = await fetchImpl(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(init && init.headers),
    },
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch (_) { json = { raw: text }; }
  if (!res.ok) {
    const message = json && json.message ? json.message : `HTTP ${res.status}`;
    throw new Error(`Notion API ${path} failed: ${message}`);
  }
  return json;
}

/** Return true if a page with this Paper URL already exists in the database. */
async function pageExists({ fetchImpl, token, databaseId, paperUrl }) {
  const url = normalizeUrl(paperUrl);
  if (!url) return false;
  const result = await notionRequest(fetchImpl, token, `/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({ filter: { property: 'Paper', url: { equals: url } }, page_size: 1 }),
  });
  return Array.isArray(result.results) && result.results.length > 0;
}

/**
 * Create one Notion page for a submission (with dedup).
 * Returns { created, skipped, reason, properties, id? }.
 * With dryRun=true (or no token), it only builds the payload.
 */
async function syncSubmission({ submission, token, databaseId, fetch: fetchImpl, dryRun }) {
  const db = databaseId || process.env.NOTION_DATABASE_ID || DEFAULT_DATABASE_ID;
  const properties = buildProperties(submission);

  if (dryRun || !token) {
    return { created: false, skipped: true, reason: 'dry-run', properties };
  }
  const f = fetchImpl || global.fetch;
  if (!f) throw new Error('No fetch implementation available (Node >=18 or pass fetch).');

  if (await pageExists({ fetchImpl: f, token, databaseId: db, paperUrl: submission.paper_url })) {
    return { created: false, skipped: true, reason: 'already-exists', properties };
  }

  const page = await notionRequest(f, token, '/pages', {
    method: 'POST',
    body: JSON.stringify({ parent: { database_id: db }, properties }),
  });
  return { created: true, skipped: false, id: page.id, properties };
}

function selfTest() {
  const assert = require('assert');
  assert.deepStrictEqual(deriveTaxonomy('l2-digital'), { category: 'L2 Simulator', law: 'Digital' });
  assert.deepStrictEqual(deriveTaxonomy('l1-physical'), { category: 'L1 Predictor', law: 'Physical' });
  assert.deepStrictEqual(deriveTaxonomy('benchmark-scientific'), { category: 'Benchmark', law: 'Scientific' });
  assert.deepStrictEqual(deriveTaxonomy('survey'), { category: 'Survey', law: null });
  const props = buildProperties({
    section: 'l2-physical', title: 'Example WM', paper_url: 'https://arxiv.org/abs/2601.00001',
    venue: 'arXiv', year: 2026, authors: 'A. One, B. Two', code_url: 'https://github.com/x/y',
  });
  assert.strictEqual(props.Category.select.name, 'L2 Simulator');
  assert.strictEqual(props.Law.select.name, 'Physical');
  assert.strictEqual(props.Paper.url, 'https://arxiv.org/abs/2601.00001');
  assert.strictEqual(props.Year.number, 2026);
  assert.strictEqual(props.Name.title[0].text.content, 'Example WM');
  assert.strictEqual(props.Authors.rich_text[0].text.content, 'A. One, B. Two');
  assert.strictEqual(props.GitHub.url, 'https://github.com/x/y');
  // Survey -> Category set, no Law key.
  const survey = buildProperties({ section: 'survey', title: 'T', paper_url: 'https://arxiv.org/abs/2601.0', year: 2026, venue: 'arXiv' });
  assert.strictEqual(survey.Category.select.name, 'Survey');
  assert.ok(!('Law' in survey));
  console.log('notion-sync self-test passed');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) { selfTest(); process.exit(0); }
  const dryRun = args.includes('--dry-run');
  const file = args.find((a) => !a.startsWith('--'));
  const submission = JSON.parse(file ? fs.readFileSync(file, 'utf8') : fs.readFileSync(0, 'utf8'));
  syncSubmission({ submission, token: process.env.NOTION_TOKEN, fetch: global.fetch, dryRun })
    .then((r) => { console.log(JSON.stringify(r, null, 2)); })
    .catch((e) => { console.error(e.message); process.exit(1); });
}

module.exports = { deriveTaxonomy, buildProperties, syncSubmission, pageExists, DEFAULT_DATABASE_ID };
