'use strict';

const fs = require('fs');
const assert = require('assert');

const SECTION_CONFIG = {
  'l1-physical': {
    label: 'L1-Physical',
    parent: '## L1: Predictor',
    heading: '### Physical World',
  },
  'l1-digital': {
    label: 'L1-Digital',
    parent: '## L1: Predictor',
    heading: '### Digital World',
  },
  'l1-social': {
    label: 'L1-Social',
    parent: '## L1: Predictor',
    heading: '### Social World',
  },
  'l1-scientific': {
    label: 'L1-Scientific',
    parent: '## L1: Predictor',
    heading: '### Scientific World',
  },
  'l2-physical': {
    label: 'L2-Physical',
    parent: '## L2: Simulator',
    heading: '### Physical World',
  },
  'l2-digital': {
    label: 'L2-Digital',
    parent: '## L2: Simulator',
    heading: '### Digital World',
  },
  'l2-social': {
    label: 'L2-Social',
    parent: '## L2: Simulator',
    heading: '### Social World',
  },
  'l2-scientific': {
    label: 'L2-Scientific',
    parent: '## L2: Simulator',
    heading: '### Scientific World',
  },
  'l3-physical': {
    label: 'L3-Physical',
    parent: '## L3: Evolver',
    heading: '### Physical World',
  },
  'l3-digital': {
    label: 'L3-Digital',
    parent: '## L3: Evolver',
    heading: '### Digital World',
  },
  'l3-social': {
    label: 'L3-Social',
    parent: '## L3: Evolver',
    heading: '### Social World',
  },
  'l3-scientific': {
    label: 'L3-Scientific',
    parent: '## L3: Evolver',
    heading: '### Scientific World',
  },
  'benchmark-physical': {
    label: 'Benchmark-Physical',
    parent: '## Benchmarks & Evaluation',
    heading: '### Physical',
  },
  'benchmark-digital': {
    label: 'Benchmark-Digital',
    parent: '## Benchmarks & Evaluation',
    heading: '### Digital',
  },
  'benchmark-social': {
    label: 'Benchmark-Social',
    parent: '## Benchmarks & Evaluation',
    heading: '### Social',
  },
  'benchmark-scientific': {
    label: 'Benchmark-Scientific',
    parent: '## Benchmarks & Evaluation',
    heading: '### Scientific',
  },
  // Surveys are a flat list under "## Related Surveys" (no Law subsection).
  survey: {
    label: 'Survey',
    parent: '## Related Surveys',
    heading: null,
  },
};

const SECTION_ALIASES = {
  'l1-physical': 'l1-physical',
  'l1-digital': 'l1-digital',
  'l1-social': 'l1-social',
  'l1-scientific': 'l1-scientific',
  'l2-physical': 'l2-physical',
  'l2-digital': 'l2-digital',
  'l2-social': 'l2-social',
  'l2-scientific': 'l2-scientific',
  'l3-physical': 'l3-physical',
  'l3-digital': 'l3-digital',
  'l3-social': 'l3-social',
  'l3-scientific': 'l3-scientific',
  'benchmark-physical': 'benchmark-physical',
  'benchmark-digital': 'benchmark-digital',
  'benchmark-social': 'benchmark-social',
  'benchmark-scientific': 'benchmark-scientific',
  'benchmarks-physical': 'benchmark-physical',
  'benchmarks-digital': 'benchmark-digital',
  'benchmarks-social': 'benchmark-social',
  'benchmarks-scientific': 'benchmark-scientific',
  'bench-physical': 'benchmark-physical',
  'bench-digital': 'benchmark-digital',
  'bench-social': 'benchmark-social',
  'bench-scientific': 'benchmark-scientific',
  'eval-physical': 'benchmark-physical',
  'eval-digital': 'benchmark-digital',
  'eval-social': 'benchmark-social',
  'eval-scientific': 'benchmark-scientific',
  survey: 'survey',
  surveys: 'survey',
  'related-survey': 'survey',
  'related-surveys': 'survey',
};

// Issue-form "Category" value -> taxonomy level token used to build a section key.
const CATEGORY_TO_LEVEL = {
  'l1 predictor': 'l1', l1: 'l1', predictor: 'l1',
  'l2 simulator': 'l2', l2: 'l2', simulator: 'l2',
  'l3 evolver': 'l3', l3: 'l3', evolver: 'l3',
  benchmark: 'benchmark', benchmarks: 'benchmark',
  survey: 'survey', surveys: 'survey',
};

function categoryToLevel(value) {
  const key = String(value || '').trim().toLowerCase();
  return CATEGORY_TO_LEVEL[key] || key;
}

function normalizeSection(value) {
  if (!value) return null;
  const key = String(value)
    .trim()
    .toLowerCase()
    .replace(/[`"']/g, '')
    .replace(/&/g, 'and')
    .replace(/[ _/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return SECTION_ALIASES[key] || null;
}

function sectionOptions() {
  return Object.values(SECTION_CONFIG).map((item) => item.label).join(', ');
}

function extractArxivId(value) {
  if (!value) return null;
  const match = String(value).match(/arxiv\.org\/(?:abs|pdf)\/(\d{4}\.\d{4,5})(?:v\d+)?/i)
    || String(value).match(/^(\d{4}\.\d{4,5})(?:v\d+)?$/);
  return match ? match[1] : null;
}

function canonicalArxivUrl(arxivId) {
  return `https://arxiv.org/abs/${arxivId}`;
}

function decodeXml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeUrl(value) {
  return String(value || '').trim().replace(/\/$/, '');
}

function hasUnsafeUrlCharacters(value) {
  return /[\s<>()\[\]{}\\`\u0000-\u001f\u007f]/.test(String(value || ''));
}

function isHttpUrl(value) {
  const url = normalizeUrl(value);
  if (!url || hasUnsafeUrlCharacters(url)) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function validateUrl(value, field) {
  if (!isHttpUrl(value)) {
    return `${field} must be an http(s) URL without whitespace, control characters, or Markdown delimiters.`;
  }
  return null;
}

function firstTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? normalizeWhitespace(decodeXml(match[1])) : '';
}

function summaryFromAbstract(abstract) {
  const clean = normalizeWhitespace(abstract);
  if (!clean) return '';
  const firstSentence = clean.match(/^(.{40,220}?[.!?])\s/)?.[1] || clean;
  const words = firstSentence.split(/\s+/).slice(0, 20).join(' ');
  return words.replace(/[.;:,\s]+$/, '') + '.';
}

function findGithubUrl(text) {
  const match = String(text || '').match(/https?:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/);
  return match ? match[0].replace(/[),.;]+$/, '') : '';
}

async function fetchArxivMetadata(arxivId, fetchImpl) {
  if (!fetchImpl) return {};
  const api = await fetchImpl(`https://export.arxiv.org/api/query?id_list=${arxivId}`);
  if (!api.ok) throw new Error(`arXiv API returned ${api.status} for ${arxivId}`);
  const xml = await api.text();
  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/i)?.[1];
  if (!entry) throw new Error(`arXiv API returned no entry for ${arxivId}`);

  const title = firstTag(entry, 'title');
  const published = firstTag(entry, 'published');
  const summary = firstTag(entry, 'summary');
  const authors = [...entry.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/gi)]
    .map((match) => normalizeWhitespace(decodeXml(match[1])))
    .filter(Boolean)
    .join(', ');
  const codeFromApi = findGithubUrl(entry);
  let codeUrl = codeFromApi;

  if (!codeUrl) {
    try {
      const page = await fetchImpl(`https://arxiv.org/abs/${arxivId}`);
      if (page.ok) codeUrl = findGithubUrl(await page.text());
    } catch (_) {
      // Optional enrichment only.
    }
  }

  return {
    title,
    paper_url: canonicalArxivUrl(arxivId),
    venue: 'arXiv',
    year: published ? Number(published.slice(0, 4)) : undefined,
    summary: summaryFromAbstract(summary),
    code_url: codeUrl || undefined,
    authors: authors || undefined,
  };
}

function parseFieldBlock(block) {
  const result = {};
  for (const rawLine of block.split(/\r?\n/)) {
    const line = rawLine.trim();
    const match = line.match(/^([A-Za-z][A-Za-z0-9 _-]*):\s*(.+)$/);
    if (!match) continue;
    const key = match[1].trim().toLowerCase().replace(/[ -]+/g, '_');
    result[key] = match[2].trim().replace(/^["']|["']$/g, '');
  }
  return result;
}

function parseStructuredBlocks(body) {
  const blocks = [];
  const fence = /```(?:awwm-paper|awesome-paper|paper-agent)\s*([\s\S]*?)```/gi;
  let match;
  while ((match = fence.exec(body)) !== null) {
    const raw = match[1].trim();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) blocks.push(...parsed);
      else blocks.push(parsed);
    } catch (_) {
      const parsed = parseFieldBlock(raw);
      if (Object.keys(parsed).length > 0) blocks.push(parsed);
    }
  }
  return blocks;
}

// Parse a GitHub issue-FORM body, which renders as repeated
// "### <Field label>\n\n<value>" blocks (empty optional fields show
// "_No response_"). Returns a raw submission object or null if the body does
// not look like the add-paper form.
function parseIssueForm(body) {
  const text = String(body || '');
  if (!/^###\s+/m.test(text)) return null;
  const fields = {};
  const re = /^###[ \t]+(.+?)[ \t]*\r?\n+([\s\S]*?)(?=\r?\n###[ \t]+|$)/gm;
  let match;
  while ((match = re.exec(text)) !== null) {
    const label = match[1].trim().toLowerCase();
    const value = match[2].trim();
    if (!value || /^_no response_$/i.test(value)) continue;
    fields[label] = value;
  }
  const get = (...keys) => {
    for (const key of keys) if (fields[key]) return fields[key];
    return '';
  };
  const paper = get('arxiv url', 'arxiv', 'arxiv link', 'paper url', 'paper');
  // New form fields are "Category" (taxonomy level) and "Law" (world).
  const categoryRaw = get('category', 'section', 'taxonomy level', 'level');
  if (!paper || !categoryRaw) return null;
  const level = categoryToLevel(categoryRaw);
  const law = get('law', 'subsection', 'sub-section', 'world', 'regime');
  return {
    arxiv_id: paper,
    paper_url: paper,
    section: level,
    subsection: level === 'survey' ? '' : law,
    title: get('title'),
    venue: get('venue'),
    year: get('year'),
    summary: get('summary', 'description', 'contribution'),
    code_url: get('code url', 'code', 'github', 'repository'),
    homepage_url: get('homepage', 'homepage url', 'project page', 'website'),
    authors: get('authors', 'author'),
    institutions: get('institutions', 'affiliations', 'affiliation'),
  };
}

function findSectionInText(body) {
  const explicit = String(body || '').match(/(?:^|\n)\s*(?:section|target[_ -]?section)\s*:\s*`?([A-Za-z0-9 _/-]+)`?/i);
  if (explicit) return normalizeSection(explicit[1]);

  const aliases = Object.keys(SECTION_ALIASES).sort((a, b) => b.length - a.length);
  for (const alias of aliases) {
    const pattern = new RegExp(`(^|[^A-Za-z0-9-])${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z0-9-]|$)`, 'i');
    if (pattern.test(body)) return SECTION_ALIASES[alias];
  }
  return null;
}

function normalizeSubmission(raw, fallbackSection) {
  const rawPaperUrl = raw.paper_url || raw.arxiv_url || raw.url || '';
  const arxivId = extractArxivId(raw.arxiv_id) || extractArxivId(rawPaperUrl);
  const paperUrl = arxivId ? canonicalArxivUrl(arxivId) : rawPaperUrl;
  const sectionRaw = raw.section || raw.target_section || '';
  const subsectionRaw = raw.subsection || raw.sub_section || raw.sub || '';
  const combinedSection = subsectionRaw ? `${sectionRaw}-${subsectionRaw}` : sectionRaw;
  return {
    section: normalizeSection(combinedSection) || fallbackSection || null,
    title: normalizeWhitespace(raw.title || ''),
    paper_url: normalizeUrl(paperUrl),
    venue: normalizeWhitespace(raw.venue || (arxivId ? 'arXiv' : '')),
    year: raw.year ? Number(raw.year) : undefined,
    summary: normalizeWhitespace(raw.summary || raw.description || ''),
    code_url: normalizeUrl(raw.code_url || raw.github_url || raw.code || ''),
    homepage_url: normalizeUrl(raw.homepage_url || raw.website_url || raw.project_url || raw.homepage || raw.website || ''),
    authors: normalizeWhitespace(raw.authors || ''),
    institutions: normalizeWhitespace(raw.institutions || ''),
    arxiv_id: arxivId,
  };
}

async function collectSubmissions(body, fetchImpl) {
  const fallbackSection = findSectionInText(body);
  let submissions = parseStructuredBlocks(body).map((item) => normalizeSubmission(item, fallbackSection));

  if (submissions.length === 0) {
    const form = parseIssueForm(body);
    if (form) submissions = [normalizeSubmission(form, fallbackSection)];
  }

  if (submissions.length === 0) {
    const seen = new Set();
    const arxivMatches = [...String(body || '').matchAll(/https?:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5})(?:v\d+)?/gi)];
    submissions = arxivMatches
      .map((match) => match[1])
      .filter((id) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .map((id) => normalizeSubmission({ arxiv_id: id }, fallbackSection));
  }

  const hydrated = [];
  const errors = [];

  for (const submission of submissions) {
    let item = { ...submission };
    if (item.arxiv_id && (!item.title || !item.year || !item.code_url || !item.authors)) {
      try {
        const metadata = await fetchArxivMetadata(item.arxiv_id, fetchImpl);
        item = { ...metadata, ...item };
        item.title = submission.title || metadata.title;
        item.year = submission.year || metadata.year;
        item.code_url = submission.code_url || metadata.code_url || '';
        item.venue = submission.venue || metadata.venue || 'arXiv';
        item.authors = submission.authors || metadata.authors || '';
      } catch (error) {
        errors.push(error.message);
      }
    }
    hydrated.push(item);
  }

  return { submissions: hydrated, errors, fallbackSection };
}

function ensureValidSubmission(item) {
  const errors = [];
  if (!item.section) errors.push(`Missing or invalid section. Valid sections: ${sectionOptions()}`);
  if (!item.paper_url) errors.push('Missing paper_url.');
  else {
    const paperUrlError = validateUrl(item.paper_url, 'paper_url');
    if (paperUrlError) errors.push(paperUrlError);
  }
  if (item.code_url) {
    const codeUrlError = validateUrl(item.code_url, 'code_url');
    if (codeUrlError) errors.push(codeUrlError);
  }
  if (item.homepage_url) {
    const homepageUrlError = validateUrl(item.homepage_url, 'homepage_url');
    if (homepageUrlError) errors.push(homepageUrlError);
  }
  if (!item.title) errors.push(`Missing title for ${item.paper_url || 'submission'}.`);
  if (!item.year || Number.isNaN(item.year)) errors.push(`Missing numeric year for ${item.title || item.paper_url}.`);
  if (!item.venue) errors.push(`Missing venue for ${item.title || item.paper_url}.`);
  return errors;
}

function escapeMarkdownText(value) {
  return normalizeWhitespace(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/([\\`*_{}\[\]()#|])/g, '\\$1');
}

function renderCodeBadge(codeUrl) {
  if (!codeUrl) return '';
  const match = String(codeUrl).match(/^https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/);
  if (match) {
    const slug = `${match[1]}/${match[2]}`;
    return ` [![Stars](https://img.shields.io/github/stars/${slug}?style=flat&logo=github&color=181717)](${codeUrl})`;
  }
  return ` [![Code](https://img.shields.io/badge/Code-Link-181717?logo=github)](${codeUrl})`;
}

function renderHomepageBadge(homepageUrl) {
  if (!homepageUrl) return '';
  return ` [![Homepage](https://img.shields.io/badge/Homepage-Online-1f6feb?logo=googlechrome&logoColor=white)](${homepageUrl})`;
}

function renderEntry(item) {
  const code = renderCodeBadge(item.code_url);
  const homepage = renderHomepageBadge(item.homepage_url);
  return `+ [**${escapeMarkdownText(item.title)}**](${item.paper_url}) (${escapeMarkdownText(item.venue)}, ${item.year})${code}${homepage}`;
}

// Read the year from the "(venue, YYYY)" group that follows the paper link.
function parseYearFromEntry(line) {
  const match = line.match(/\)\s+\([^()]*?((?:19|20)\d{2})\)/);
  return match ? Number(match[1]) : null;
}

// Read the entry title (the bold link text).
function parseTitleFromEntry(line) {
  const match = line.match(/^\+ \[\*\*(.+?)\*\*\]/);
  return match ? match[1] : '';
}

function hasPaperEntry(readme, paperUrl) {
  const normalizedPaperUrl = normalizeUrl(paperUrl);
  return readme.split('\n').some((line) => {
    if (!line.startsWith('+ [**')) return false;
    const match = line.match(/^\+ \[\*\*.*?\*\*\]\(([^)]+)\)/);
    return match ? normalizeUrl(match[1]) === normalizedPaperUrl : false;
  });
}

function findHeadingLine(lines, heading, start, end) {
  for (let index = start; index < end; index += 1) {
    if (lines[index].trim() === heading) return index;
  }
  return -1;
}

function nextHeadingLine(lines, start, prefixes) {
  for (let index = start; index < lines.length; index += 1) {
    if (prefixes.some((prefix) => lines[index].startsWith(prefix))) return index;
  }
  return lines.length;
}

function insertEntry(readme, item) {
  const config = SECTION_CONFIG[item.section];
  if (!config) throw new Error(`Unsupported section: ${item.section}`);

  const paperUrl = normalizeUrl(item.paper_url);
  if (hasPaperEntry(readme, paperUrl)) {
    return { readme, skipped: true, reason: `README already contains ${paperUrl}` };
  }

  const lines = readme.split('\n');
  const parentLine = findHeadingLine(lines, config.parent, 0, lines.length);
  if (parentLine === -1) throw new Error(`Could not find parent heading ${config.parent}`);

  let headingLine;
  let sectionEnd;
  if (config.heading) {
    const parentEnd = nextHeadingLine(lines, parentLine + 1, ['## ']);
    headingLine = findHeadingLine(lines, config.heading, parentLine + 1, parentEnd);
    if (headingLine === -1) throw new Error(`Could not find section heading ${config.heading}`);
    sectionEnd = nextHeadingLine(lines, headingLine + 1, ['### ', '## ']);
  } else {
    // Flat section (e.g. "## Related Surveys"): entries sit directly under the parent.
    headingLine = parentLine;
    sectionEnd = nextHeadingLine(lines, parentLine + 1, ['## ']);
  }

  // Keep the section ordered by (year descending, then title ascending).
  const itemTitle = String(item.title || '').toLowerCase();
  const sortsBefore = (line) => {
    const year = parseYearFromEntry(line) || 0;
    if (item.year !== year) return item.year > year;
    return itemTitle < parseTitleFromEntry(line).toLowerCase();
  };

  let insertAt = headingLine + 1;
  while (insertAt < sectionEnd && lines[insertAt].trim() === '') insertAt += 1;

  let foundEntries = false;
  for (let index = insertAt; index < sectionEnd; index += 1) {
    if (!lines[index].startsWith('+ [**')) continue;
    foundEntries = true;
    if (sortsBefore(lines[index])) { insertAt = index; break; }
    insertAt = index + 1;
  }

  // Empty section: leave a blank line between the heading and the new entry.
  if (!foundEntries) insertAt = Math.min(headingLine + 2, sectionEnd);

  lines.splice(insertAt, 0, renderEntry(item));
  return { readme: lines.join('\n'), skipped: false };
}

async function applySubmission({ readme, body, fetch: fetchImpl }) {
  const { submissions, errors } = await collectSubmissions(body, fetchImpl);
  const added = [];
  const skipped = [];
  const validationErrors = [...errors];
  let nextReadme = readme;

  for (const submission of submissions) {
    const itemErrors = ensureValidSubmission(submission);
    if (itemErrors.length > 0) {
      validationErrors.push(...itemErrors);
      continue;
    }

    const result = insertEntry(nextReadme, submission);
    nextReadme = result.readme;
    if (result.skipped) skipped.push({ title: submission.title, reason: result.reason });
    else added.push({ ...submission, line: renderEntry(submission), sectionLabel: SECTION_CONFIG[submission.section].label });
  }

  return {
    readme: nextReadme,
    added,
    skipped,
    errors: validationErrors,
    sectionOptions: sectionOptions(),
  };
}

function selfTest() {
  // Self-contained fixture README mirroring the real section structure
  // (no dependency on README.md content, so the test is deterministic).
  const readme = [
    '## L1: Predictor', '',
    '### Physical World', '',
    '+ [**An L1 Physical 2025 Paper**](https://arxiv.org/abs/2500.00001) (arXiv, 2025)', '',
    '### Digital World', '',
    '### Social World', '',
    '### Scientific World', '',
    '## L2: Simulator', '',
    '### Physical World', '',
    '### Digital World', '',
    '+ [**Existing Digital 2024**](https://arxiv.org/abs/2400.00002) (arXiv, 2024)', '',
    '### Social World', '',
    '### Scientific World', '',
    '## L3: Evolver', '',
    '### Physical World', '',
    '### Digital World', '',
    '### Social World', '',
    '### Scientific World', '',
    '## Benchmarks & Evaluation', '',
    '### Physical', '',
    '### Digital', '',
    '### Social', '',
    '### Scientific', '',
    '## Related Surveys', '',
    '+ [**An Existing Survey 2023**](https://arxiv.org/abs/2300.00003) (arXiv, 2023)', '',
    '## Welcome to Contribute', '',
  ].join('\n');

  // Build an issue-FORM body from [label, value] pairs.
  const form = (fields) => fields.flatMap(([k, v]) => [`### ${k}`, '', v, '']).join('\n');

  return (async () => {
    // 1) New Category/Law form parses and is placed in the right subsection.
    const formBody = form([
      ['arXiv URL', 'https://arxiv.org/abs/2600.00010'],
      ['Category', 'L2 Simulator'],
      ['Law', 'Digital'],
      ['Title', 'Example World Model'],
      ['Authors', 'Jane Doe, John Roe'],
      ['Venue', 'arXiv'],
      ['Year', '2026'],
      ['Code URL', 'https://github.com/example/world-model'],
    ]);
    const parsed = parseIssueForm(formBody);
    assert.strictEqual(parsed.section, 'l2');
    assert.strictEqual(parsed.subsection, 'Digital');
    assert.strictEqual(parsed.authors, 'Jane Doe, John Roe');
    assert.strictEqual(normalizeSubmission(parsed, null).section, 'l2-digital');

    const result = await applySubmission({ readme, body: formBody });
    assert.strictEqual(result.errors.length, 0, JSON.stringify(result.errors));
    assert.strictEqual(result.added.length, 1);
    const entry = result.added[0].line;
    assert(entry.includes('+ [**Example World Model**](https://arxiv.org/abs/2600.00010) (arXiv, 2026)'));
    assert(!entry.includes(' — '), 'entries should carry no summary em-dash');
    assert(entry.includes('img.shields.io/github/stars/example/world-model'));
    assert.strictEqual(result.added[0].sectionLabel, 'L2-Digital');
    assert(result.readme.indexOf('Example World Model') < result.readme.indexOf('Existing Digital 2024'));
    assert.strictEqual(hasPaperEntry(result.readme, 'https://arxiv.org/abs/2600.00010'), true);

    // 2) Survey category -> flat "## Related Surveys", newest first.
    const surveyResult = await applySubmission({ readme, body: form([
      ['arXiv URL', 'https://arxiv.org/abs/2600.00020'],
      ['Category', 'Survey'], ['Law', 'Physical'],
      ['Title', 'A New 2026 Survey'], ['Venue', 'arXiv'], ['Year', '2026'],
    ]) });
    assert.strictEqual(surveyResult.errors.length, 0, JSON.stringify(surveyResult.errors));
    assert.strictEqual(surveyResult.added[0].sectionLabel, 'Survey');
    assert(surveyResult.readme.indexOf('A New 2026 Survey') < surveyResult.readme.indexOf('An Existing Survey 2023'));

    // 3) Benchmark category + Law.
    const benchResult = await applySubmission({ readme, body: form([
      ['arXiv URL', 'https://arxiv.org/abs/2600.00030'],
      ['Category', 'Benchmark'], ['Law', 'Physical'],
      ['Title', 'A Benchmark'], ['Venue', 'arXiv'], ['Year', '2026'],
    ]) });
    assert.strictEqual(benchResult.errors.length, 0, JSON.stringify(benchResult.errors));
    assert.strictEqual(benchResult.added[0].sectionLabel, 'Benchmark-Physical');

    // 4) Dedup by paper URL incl. arXiv version suffix (via the submission path).
    const dup = await applySubmission({ readme: result.readme, body: form([
      ['arXiv URL', 'https://arxiv.org/abs/2600.00010v2'],
      ['Category', 'L2 Simulator'], ['Law', 'Digital'],
      ['Title', 'Example World Model'], ['Venue', 'arXiv'], ['Year', '2026'],
    ]) });
    assert.strictEqual(dup.added.length, 0);
    assert.strictEqual(dup.skipped.length, 1);

    // 5) Code URL validation / injection rejection.
    const bad = await applySubmission({ readme, body: form([
      ['arXiv URL', 'https://arxiv.org/abs/2600.00040'],
      ['Category', 'L2 Simulator'], ['Law', 'Digital'],
      ['Title', 'Bad Code'], ['Venue', 'arXiv'], ['Year', '2026'],
      ['Code URL', 'javascript:alert(1)'],
    ]) });
    assert(bad.errors.some((e) => e.startsWith('code_url must be an http(s) URL')));

    // 6) Markdown/HTML escaping in the rendered entry.
    const esc = await applySubmission({ readme, body: form([
      ['arXiv URL', 'https://arxiv.org/abs/2600.00050'],
      ['Category', 'L2 Simulator'], ['Law', 'Digital'],
      ['Title', 'A [tricky](title) <b>x</b>'], ['Venue', 'Test (Venue)'], ['Year', '2026'],
    ]) });
    assert(esc.added[0].line.includes('A \\[tricky\\]\\(title\\) &lt;b&gt;x&lt;/b&gt;'));
    assert(esc.added[0].line.includes('(Test \\(Venue\\), 2026)'));

    // 7) Legacy awwm-paper block (L2/L3/Benchmark) still works.
    const legacy = await applySubmission({ readme, body: [
      '```awwm-paper',
      '{"section":"L2-Digital","title":"Legacy Block 2026","paper_url":"https://arxiv.org/abs/2600.00060","venue":"arXiv","year":2026}',
      '```',
    ].join('\n') });
    assert.strictEqual(legacy.errors.length, 0, JSON.stringify(legacy.errors));
    assert.strictEqual(legacy.added[0].sectionLabel, 'L2-Digital');

    // 8) Misc: non-form text is not a form; taxonomy aliases resolve.
    assert.strictEqual(parseIssueForm('just some text, no form headers'), null);
    assert.strictEqual(normalizeSection('survey'), 'survey');
    assert.strictEqual(normalizeSection('l1-physical'), 'l1-physical');

    console.log('paper-agent self-test passed');
  })();
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) {
    selfTest().catch((error) => {
      console.error(error);
      process.exit(1);
    });
  } else {
    const bodyPath = args[0];
    const body = bodyPath ? fs.readFileSync(bodyPath, 'utf8') : fs.readFileSync(0, 'utf8');
    const readme = fs.readFileSync('README.md', 'utf8');
    applySubmission({ readme, body, fetch: global.fetch }).then((result) => {
      console.log(JSON.stringify({
        added: result.added.map((item) => ({ title: item.title, section: item.sectionLabel })),
        skipped: result.skipped,
        errors: result.errors,
      }, null, 2));
    }).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  }
}

module.exports = {
  SECTION_CONFIG,
  applySubmission,
  collectSubmissions,
  hasPaperEntry,
  normalizeSection,
  normalizeSubmission,
  parseIssueForm,
  renderEntry,
  insertEntry,
};
