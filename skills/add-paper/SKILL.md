---
name: add-paper
description: Generate an issue body for adding a paper to awesome-agentic-world-models through the Awesome Paper Agent GitHub Action. Use when a user or AI agent wants to add a paper by opening an issue that will be parsed into a README pull request.
---

# Add Paper

Create a GitHub issue body that the repository's `Awesome Paper Agent` workflow can parse into a README pull request.

## Output Contract

Generate exactly one fenced `awwm-paper` block per paper:

````
```awwm-paper
{
  "section": "L2-Digital",
  "title": "Paper title",
  "paper_url": "https://arxiv.org/abs/2601.00001",
  "venue": "arXiv",
  "year": 2026,
  "summary": "Concise contribution phrase.",
  "code_url": "https://github.com/org/repo"
}
```
````

Minimum arXiv payload fields: `section` and `paper_url`, assuming the workflow can fetch arXiv metadata.

For deterministic submissions, include `title`, `venue`, `year`, and `summary`. Non-arXiv papers must include those fields because the workflow cannot hydrate them from arXiv.

Optional field: `code_url`.

URLs must use `http` or `https` and must not contain whitespace, control characters, or Markdown delimiter characters such as brackets or parentheses.

## Two Orthogonal Axes

The taxonomy follows the survey *Agentic World Modeling: Foundations, Capabilities, Laws, and Beyond* ([paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) in this repo). Every paper sits at the intersection of two **independent** axes — pick one value from each, then look up the section label.

### Axis 1 — Capability Level (L1 / L2 / L3)

What does the system *demonstrate*, not what it merely contains.

- **L1 Predictor — Local Markov Prediction.** Learns *local* predictive operators on an internal state `z_t` and produces a one-step (or short fixed-horizon) transition. Factorises into four operators over `z_t`: state inference (`o → z`), forward dynamics (`z_{t-1}, a_t → z_t`, the core operator), observation decoding (`z → o`), and inverse dynamics (`z_{t-1}, z_t → a`). Pick L1 when the paper's central contribution is *one-step* predictive quality of any of these operators. ([paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) §3.)
- **L2 Simulator — Decision-Usable Multi-Step Simulation.** Stitches L1 operators into trajectory-level queries `p̂(τ | z_0, a_{1:H}, c)` so an agent can compare candidate plans before acting. Elevation from L1 requires three boundary conditions: (i) **long-horizon coherence** (rollouts remain usable as `H` grows), (ii) **intervention sensitivity** (changing `a_t` produces stable, directionally meaningful trajectory changes), and (iii) **constraint consistency** (rollouts respect the governing-law regime `c`). Pick L2 when the paper evaluates multi-step rollouts under domain constraints, not just next-step accuracy. ([paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) §4.)
- **L3 Evolver — Evidence-Driven Model Revision.** Realises the full *design → execute → observe → reflect* loop on the world-modeling stack `M_t → a_t → o_t → d_t → M_{t+1}`, where evidence is translated into **persistent, validated** model updates rather than transient in-context adjustments. Boundary conditions: (i) **active information expansion** (designs experiments that probe uncertainty), (ii) **autonomous execution and observation** (acquires fresh evidence from interaction), (iii) **belief revision under challenge** (parameters, structure, or assets change as a result). Pick L3 only when the paper closes the loop and persists the revision (regression-gated, reusable) — a system that just retries within an episode is L2. ([paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) §5.)

### Axis 2 — Governing-Law Regime (Physical / Digital / Social / Scientific)

Which laws does the world model have to respect for its rollouts to be legitimate? Pick the regime by the *constraints the system must satisfy*, not the surface modality.

- **Physical** — Newtonian mechanics, contact dynamics, geometry, kinematics, and conservation laws (energy, momentum, mass). Constraints: contact, reachability, stability, energy conservation. Continuous, largely deterministic, observable. Includes embodied robotics, physics simulators, autonomous driving, and physical video world models. ([paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) §4.3.1, §5.3.1.)
- **Digital** — Software state machines, DOM trees, file systems, code execution, game state, and OS interfaces. Transitions are *explicitly specified and mechanically verifiable*: a step either satisfies the program's semantics or does not. Failures are loggable (error codes, popups, timeouts). Includes web/GUI agents, code world models, OS emulators, and game-engine generators. ([paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) §4.3.2, §5.3.2.)
- **Social** — Beliefs, desires, intentions, norms, institutions, and incentives, in place of physics. Three distinctive properties: **opacity** (mental states are not directly observed), **reflexivity** (beliefs about social state feed back into it), and **normativity** (transitions are partly constituted by shared norms). Includes theory-of-mind models, multi-agent dialogue/negotiation, sandbox societies, and policy/governance simulators. ([paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) §4.3.3, §5.3.3.)
- **Scientific** — Conservation laws, PDE constraints, symmetry and invariance, and experimental falsifiability. Neural surrogates must respect invariants, and predictions must be checkable against measurement. Includes weather/climate, materials, chemistry/biology, fluid/PDE solvers, and autonomous laboratories. ([paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) §4.3.4, §5.3.4.)

### Composition rule

- **L2 / L3 papers**: Section label is `{L2,L3}-{Physical,Digital,Social,Scientific}` — Axis 1 × Axis 2 directly.
- **L1 papers**: There is no four-worlds split inside L1. Instead, L1 has its own *operator-family* sub-axis (Representation / Model-Based-RL / Token-Diffusion), reflecting how L1 papers are most naturally organised. Section label is `L1-{Representation,Model-Based-RL,Token-Diffusion}`.

For deeper context (cross-domain analysis tables, failure modes, evaluation principles), open [paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) at the section reference next to each definition above.

## Valid Sections

Cross-reference of label, level definition, and regime. Place the paper where its main contribution sits.

- `L1-Representation` — L1 systems whose contribution is **state inference**: contrastive, predictive, masked-region, or self-distillation objectives that shape `z_t` for downstream control (CPC, SimCLR, MoCo, CURL, SPR, JEPA family, DINOv2, RSSM-style belief inference, β-VAE, VQ-VAE).
- `L1-Model-Based-RL` — L1 systems whose contribution is **forward dynamics for planning/control**: latent transition models trained for value alignment, planning, or model-based RL (Dreamer family, MuZero, EfficientZero, TD-MPC/TD-MPC2, PETS, MBPO, PILCO, World Models, DeepMDP, E2C).
- `L1-Token-Diffusion` — L1 systems whose contribution is a **tokenised, autoregressive, or diffusion-based** one-step transition operator (IRIS, Delta-IRIS, STORM, TransDreamer, DIAMOND, Latent Diffusion as the transition step).
- `L2-Physical` — L2 simulators for physical worlds. Action-conditioned video/embodied generation, robotics rollout, geometry-/contact-aware simulators, autonomous-driving world models (Sora, Cosmos, Genie, GAIA-1/2, Vista, DreamerV3 as physical simulator, DriveDreamer, Lumiere, OccWorld, DIAMOND-as-Atari, PIN-WM, RoboScape, Aether, GameCraft).
- `L2-Digital` — L2 simulators for digital worlds: web/GUI/OS/game/code state simulators that respect formal program semantics (WebDreamer, WMA, WebWorld, gWorld, MobileDreamer, GameNGen, GameFactory, NeuralOS, WorldCoder, CodeWM, Code2World, Word2World).
- `L2-Social` — L2 simulators for social worlds: theory-of-mind models, multi-agent dialogue, negotiation, deception, and sandbox society simulators (Generative Agents, CICERO, Sotopia, Project Sid, OASIS, Werewolf, AvalonBench, Social Simulacra, BToM/ToMnet, AIvilization, MASim, PolicySim).
- `L2-Scientific` — L2 simulators for scientific worlds: weather/climate, materials, chemistry/biology, fluids/PDEs, with neural surrogates that respect physical invariants (GraphCast, Pangu-Weather, GenCast, NeuralGCM, ClimaX, Aurora, FNO, GNS, ChemBO, P3BO, Lingshu-Cell).
- `L3-Physical` — L3 evolvers in embodied settings. Diagnostic action selection, sim-to-real adaptation, persistent self-model updates from morphology change or contact-dynamics mismatch (Self-Modeling, AdaptSim).
- `L3-Digital` — L3 evolvers using execution feedback and regression gates from code/web/UI environments to persistently revise the underlying generator or policy (FunSearch, AlphaEvolve, CodeIt, SWE-agent, AUI).
- `L3-Social` — L3 evolvers that revise social/normative models from interaction evidence: evolved constitutions, governance rules, behavioural-drift tracking in multi-agent populations (Evolving Constitutions, AgentSociety).
- `L3-Scientific` — L3 evolvers closing the design–execute–observe–reflect loop with real instrumentation: autonomous wet/computational labs, hypothesis-driven discovery agents (Robot Scientist, A-Lab, CAMEO, BacterAI, Yeast Cycles, SDL Lasers, AI Scientist, AI Scientist v2, Co-Scientist, MOOSE-Chem, MOOSE-Chem2, Biomni, BioLab, OriGene).

Legacy `L1` is accepted by the workflow, but prefer one of the precise L1 section names.

## How to Choose a Section

1. **Identify the level.** What capability does the paper *demonstrate* (not just claim)?
   - Reports next-step / one-step accuracy of a transition operator → **L1**.
   - Evaluates multi-step rollouts under domain constraints (compounding error, intervention, constraint violation) → **L2**.
   - Persistently updates the model from new evidence collected through deployment, with a validation gate → **L3**.
2. **Identify the regime.** What constraints must legitimate transitions satisfy?
   - Physical/contact/conservation → **Physical**. Formal program semantics → **Digital**. Beliefs/norms/institutions → **Social**. PDE/invariant/falsifiability → **Scientific**.
3. **For L1, identify the operator family** (Representation / Model-Based-RL / Token-Diffusion).
4. **One section per submission.** If the paper is genuinely cross-cutting, pick the most prominent contribution and note alternatives in the issue comment for maintainer review.

## Workflow

1. Extract or ask for the paper URL and target section.
2. Fetch metadata if needed:
   - arXiv API: `https://export.arxiv.org/api/query?id_list=ARXIV_ID`
   - optional arXiv abstract page for GitHub links.
3. **If the section choice is non-obvious**, consult [paper.pdf](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) for the relevant section (mapping listed under each definition above) — it gives the formal boundary conditions, representative methods, and failure modes for that level × regime cell. Also browse the existing entries under that label in `README.md` to match tone and granularity.
4. Write a concise one-sentence `summary` in the style of existing README entries — describe the *contribution* (architecture, mechanism, or result), not the marketing claim.
5. Return the complete issue body. If the user asks you to open the issue and `gh` is authenticated, run:

```bash
gh issue create --title "Add paper: PAPER_TITLE" --body-file ISSUE_BODY_FILE
```

Do not edit `README.md` directly for normal paper submissions. The GitHub Action should create the pull request.

## Issue Body Template

````markdown
## Paper Submission

Please add this paper to the awesome list.

```awwm-paper
{
  "section": "L2-Digital",
  "title": "Paper title",
  "paper_url": "https://arxiv.org/abs/2601.00001",
  "venue": "arXiv",
  "year": 2026,
  "summary": "Concise contribution phrase.",
  "code_url": "https://github.com/org/repo"
}
```
````

If there is no code link, omit `code_url` rather than leaving it blank.
