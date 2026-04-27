'use strict';

const fs = require('fs');
const assert = require('assert');

const SECTION_CONFIG = {
  'l1-representation': {
    label: 'L1-Representation',
    parent: '## L1: Predictor',
    heading: '### Representation Learning',
  },
  'l1-model-based-rl': {
    label: 'L1-Model-Based-RL',
    parent: '## L1: Predictor',
    heading: '### Model-Based RL',
  },
  'l1-token-diffusion': {
    label: 'L1-Token-Diffusion',
    parent: '## L1: Predictor',
    heading: '### Token & Diffusion-Based',
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
};

const SECTION_ALIASES = {
  l1: 'l1-representation',
  'l1-representation': 'l1-representation',
  'l1-representation-learning': 'l1-representation',
  'l1-model-based-rl': 'l1-model-based-rl',
  'l1-mbrl': 'l1-model-based-rl',
  'l1-modelbasedrl': 'l1-model-based-rl',
  'l1-token': 'l1-token-diffusion',
  'l1-token-diffusion': 'l1-token-diffusion',
  'l1-token-and-diffusion': 'l1-token-diffusion',
  'l1-token-diffusion-based': 'l1-token-diffusion',
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
};

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
    arxiv_id: arxivId,
  };
}

async function collectSubmissions(body, fetchImpl) {
  const fallbackSection = findSectionInText(body);
  let submissions = parseStructuredBlocks(body).map((item) => normalizeSubmission(item, fallbackSection));

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
    if (item.arxiv_id && (!item.title || !item.year || !item.summary || !item.code_url)) {
      try {
        const metadata = await fetchArxivMetadata(item.arxiv_id, fetchImpl);
        item = { ...metadata, ...item };
        item.title = submission.title || metadata.title;
        item.year = submission.year || metadata.year;
        item.summary = submission.summary || metadata.summary;
        item.code_url = submission.code_url || metadata.code_url || '';
        item.venue = submission.venue || metadata.venue || 'arXiv';
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
  if (!item.summary) errors.push(`Missing summary for ${item.title || item.paper_url}.`);
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
  const summaryText = normalizeWhitespace(item.summary);
  const summary = summaryText.endsWith('.') ? summaryText : `${summaryText}.`;
  const code = renderCodeBadge(item.code_url);
  const homepage = renderHomepageBadge(item.homepage_url);
  return `+ [**${escapeMarkdownText(item.title)}**](${item.paper_url}) (${escapeMarkdownText(item.venue)}, ${item.year}) \u2014 ${escapeMarkdownText(summary)}${code}${homepage}`;
}

function parseYearFromEntry(line) {
  const match = line.match(/\((?:[^)]*?)(19|20)\d{2}[^)]*\)\s+\u2014\s+/);
  return match ? Number(match[0].match(/(19|20)\d{2}/)[0]) : null;
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

  const parentEnd = nextHeadingLine(lines, parentLine + 1, ['## ']);
  const headingLine = findHeadingLine(lines, config.heading, parentLine + 1, parentEnd);
  if (headingLine === -1) throw new Error(`Could not find section heading ${config.heading}`);

  const sectionEnd = nextHeadingLine(lines, headingLine + 1, ['### ', '## ']);
  let insertAt = headingLine + 1;
  while (insertAt < sectionEnd && lines[insertAt].trim() === '') insertAt += 1;

  let lastEntry = -1;
  for (let index = insertAt; index < sectionEnd; index += 1) {
    if (!lines[index].startsWith('+ [**')) continue;
    const year = parseYearFromEntry(lines[index]);
    if (year && item.year > year) {
      insertAt = index;
      break;
    }
    lastEntry = index;
    insertAt = index + 1;
  }

  if (lastEntry === -1 && insertAt === headingLine + 1) {
    insertAt = headingLine + 2;
  }

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
  const readme = fs.readFileSync('README.md', 'utf8');
  const body = [
    '```awwm-paper',
    '{',
    '  "section": "L2-Digital",',
    '  "title": "Example World Model",',
    '  "paper_url": "https://arxiv.org/abs/2601.00001",',
    '  "venue": "arXiv",',
    '  "year": 2026,',
    '  "summary": "Tests structured paper insertion.",',
    '  "code_url": "https://github.com/example/world-model"',
    '}',
    '```',
  ].join('\n');

  return applySubmission({ readme, body }).then(async (result) => {
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.added.length, 1);
    assert(result.readme.includes('+ [**Example World Model**](https://arxiv.org/abs/2601.00001)'));
    assert(result.readme.indexOf('Example World Model') < result.readme.indexOf('Word2World'));
    assert.strictEqual(hasPaperEntry(result.readme, 'https://arxiv.org/abs/2601.00001'), true);
    const duplicateResult = insertEntry(result.readme, {
      section: 'l2-digital',
      title: 'Example World Model',
      paper_url: 'https://arxiv.org/abs/2601.00001',
      venue: 'arXiv',
      year: 2026,
      summary: 'Tests duplicate detection.',
    });
    assert.strictEqual(duplicateResult.skipped, true);

    const docOnlyUrl = 'https://arxiv.org/abs/2699.99996';
    const readmeWithDocBlock = [
      readme,
      '```awwm-paper',
      `{"paper_url":"${docOnlyUrl}"}`,
      '```',
    ].join('\n');
    const docOnlyResult = insertEntry(readmeWithDocBlock, {
      section: 'l2-digital',
      title: 'Doc Only URL',
      paper_url: docOnlyUrl,
      venue: 'arXiv',
      year: 2026,
      summary: 'Tests that documentation examples do not count as papers.',
    });
    assert.strictEqual(docOnlyResult.skipped, false);

    const invalidUrlResult = await applySubmission({
      readme,
      body: [
        '```awwm-paper',
        '{"section":"L2-Digital","title":"Bad URL","paper_url":"javascript:alert(1)","venue":"Test","year":2026,"summary":"Checks URL validation."}',
        '```',
      ].join('\n'),
    });
    assert(invalidUrlResult.errors.some((error) => error.startsWith('paper_url must be an http(s) URL')));

    const injectedUrlResult = await applySubmission({
      readme,
      body: [
        '```awwm-paper',
        '{"section":"L2-Digital","title":"Injected URL","paper_url":"https://example.com/paper)\\n+ [**Injected Entry**](https://evil.example/paper","venue":"Test","year":2026,"summary":"Checks newline injection.","code_url":"https://github.com/org/repo)\\n+ [**Injected Code Entry**](https://evil.example/code"}',
        '```',
      ].join('\n'),
    });
    assert(injectedUrlResult.errors.some((error) => error.startsWith('paper_url must be an http(s) URL')));
    assert(injectedUrlResult.errors.some((error) => error.startsWith('code_url must be an http(s) URL')));

    const versionDuplicateResult = await applySubmission({
      readme,
      body: [
        '```awwm-paper',
        '{"section":"L2-Digital","title":"Code2World Duplicate","paper_url":"https://arxiv.org/abs/2602.09856v2","venue":"arXiv","year":2026,"summary":"Checks arXiv version duplicate handling."}',
        '```',
      ].join('\n'),
    });
    assert.strictEqual(versionDuplicateResult.errors.length, 0);
    assert.strictEqual(versionDuplicateResult.added.length, 0);
    assert.strictEqual(versionDuplicateResult.skipped.length, 1);

    const escapedMarkdownResult = await applySubmission({
      readme,
      body: [
        '```awwm-paper',
        '{"section":"L2-Digital","title":"A [tricky](title)","paper_url":"https://example.com/tricky","venue":"Test (Venue)","year":2026,"summary":"Checks *markdown* escaping."}',
        '```',
      ].join('\n'),
    });
    assert(escapedMarkdownResult.added[0].line.includes('A \\[tricky\\]\\(title\\)'));
    assert(escapedMarkdownResult.added[0].line.includes('(Test \\(Venue\\), 2026)'));
    assert(escapedMarkdownResult.added[0].line.includes('Checks \\*markdown\\* escaping.'));

    const escapedHtmlResult = await applySubmission({
      readme,
      body: [
        '```awwm-paper',
        '{"section":"L2-Digital","title":"<img src=x onerror=alert(1)>","paper_url":"https://example.com/html-text","venue":"<b>Venue</b>","year":2026,"summary":"Uses <script>alert(1)</script> text & symbols."}',
        '```',
      ].join('\n'),
    });
    assert(escapedHtmlResult.added[0].line.includes('&lt;img src=x onerror=alert\\(1\\)&gt;'));
    assert(escapedHtmlResult.added[0].line.includes('(&lt;b&gt;Venue&lt;/b&gt;, 2026)'));
    assert(escapedHtmlResult.added[0].line.includes('Uses &lt;script&gt;alert\\(1\\)&lt;/script&gt; text &amp; symbols.'));

    const legacy = normalizeSection('L1');
    assert.strictEqual(legacy, 'l1-representation');
    const precise = normalizeSection('L1-Token-Diffusion');
    assert.strictEqual(precise, 'l1-token-diffusion');
    console.log('paper-agent self-test passed');
  });
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
  renderEntry,
  insertEntry,
};
