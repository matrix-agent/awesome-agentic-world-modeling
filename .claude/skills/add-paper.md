---
name: add-paper
description: Generate an issue body for the Awesome Paper Agent workflow.
command: /add-paper
arguments:
  - name: paper_url
    description: "Paper URL, preferably an arXiv URL"
    required: true
  - name: section
    description: "Target section such as L2-Digital"
    required: false
---

# Add Paper

Use the canonical repository skill at `skills/add-paper/SKILL.md`.

That skill emits an `awwm-paper` fenced JSON block. The GitHub Action parses that block, inserts the README entry in reverse chronological order, and opens a pull request.
