export const PAPER_TITLE = 'Agentic World Modeling: Foundations, Capabilities, Laws, and Beyond'
export const SITE_URL = 'https://agentic-world-modeling.xyz'
export const REPOSITORY_URL = 'https://github.com/matrix-agent/awesome-agentic-world-modeling'
export const PAPER_URL = 'https://arxiv.org/abs/2604.22748'

export const ABSTRACT = `As AI systems move from generating text to accomplishing goals through sustained interaction, the ability to model environment dynamics becomes a central bottleneck. Agents that manipulate objects, navigate software, coordinate with others, or design experiments require predictive environment models, yet the term "world model" carries different meanings across research communities. We introduce a "levels \u00d7 laws" taxonomy organized along two axes. The first defines three capability levels: L1 Predictor, which learns one-step local transition operators; L2 Simulator, which composes them into multi-step, action-conditioned rollouts that respect domain laws; and L3 Evolver, which autonomously revises its own model when predictions fail against new evidence.

The second identifies four governing-law regimes (physical, digital, social, and scientific) that determine what constraints a world model must satisfy and where it is most likely to fail. Using this framework, we synthesize over 400 works and summarize more than 100 representative systems spanning model-based reinforcement learning, video generation, web and GUI agents, multi-agent social simulation, and AI-driven scientific discovery. We analyze methods, failure modes, and evaluation practices across level-regime pairs, propose decision-centric evaluation principles and a minimal reproducible evaluation package, and outline architectural guidance, open problems, and governance challenges. The resulting roadmap connects previously isolated communities and charts a path from passive next-step prediction toward world models that can simulate, and ultimately reshape, the environments in which agents operate.`

export interface Author {
  name: string
  aff: number[]
  core?: boolean
  senior?: boolean
  lead?: boolean
}

export const AUTHORS: Author[] = [
  { name: 'Meng Chu', aff: [1], core: true },
  { name: 'Xuan Billy Zhang', aff: [2], core: true, lead: true },
  { name: 'Kevin Qinghong Lin', aff: [3], core: true },
  { name: 'Lingdong Kong', aff: [2], core: true },
  { name: 'Jize Zhang', aff: [3], core: true },
  { name: 'Teng Tu', aff: [2], core: true },
  { name: 'Weijian Ma', aff: [2], core: true },
  { name: 'Ziqi Huang', aff: [4] },
  { name: 'Senqiao Yang', aff: [5] },
  { name: 'Wei Huang', aff: [6] },
  { name: 'Yeying Jin', aff: [2] },
  { name: 'Zhefan Rao', aff: [1] },
  { name: 'Jinhui Ye', aff: [1] },
  { name: 'Xinyu Lin', aff: [2] },
  { name: 'Xichen Zhang', aff: [1] },
  { name: 'Qisheng Hu', aff: [4] },
  { name: 'Shuai Yang', aff: [6] },
  { name: 'Leyang Shen', aff: [2] },
  { name: 'Wei Chow', aff: [2] },
  { name: 'Yifei Dong', aff: [7] },
  { name: 'Fengyi Wu', aff: [7] },
  { name: 'Quanyu Long', aff: [4] },
  { name: 'Bin Xia', aff: [5] },
  { name: 'Shaozuo Yu', aff: [5] },
  { name: 'Mingkang Zhu', aff: [5] },
  { name: 'Wenhu Zhang', aff: [1] },
  { name: 'Jiehui Huang', aff: [1] },
  { name: 'Haokun Gui', aff: [1] },
  { name: 'Haoxuan Che', aff: [1], senior: true },
  { name: 'Long Chen', aff: [1], senior: true },
  { name: 'Qifeng Chen', aff: [1], senior: true },
  { name: 'Wenxuan Zhang', aff: [9], senior: true },
  { name: 'Wenya Wang', aff: [4], senior: true },
  { name: 'Xiaojuan Qi', aff: [6], senior: true },
  { name: 'Yang Deng', aff: [10], senior: true },
  { name: 'Yanwei Li', aff: [5], senior: true },
  { name: 'Mike Zheng Shou', aff: [2], senior: true },
  { name: 'Zhi-Qi Cheng', aff: [7], senior: true },
  { name: 'See-Kiong Ng', aff: [2], senior: true },
  { name: 'Ziwei Liu', aff: [4], senior: true },
  { name: 'Philip Torr', aff: [3], senior: true },
  { name: 'Jiaya Jia', aff: [1], senior: true },
]

export const AFFILIATIONS: Record<number, string> = {
  1: 'Hong Kong University of Science and Technology',
  2: 'National University of Singapore',
  3: 'University of Oxford',
  4: 'Nanyang Technological University',
  5: 'Chinese University of Hong Kong',
  6: 'University of Hong Kong',
  7: 'University of Washington',
  8: 'Hong Kong University of Science and Technology (Guangzhou)',
  9: 'Singapore University of Technology and Design',
  10: 'Singapore Management University',
}

export const STATS = [
  { value: 400, suffix: '+', label: 'Cited Works' },
  { value: 100, suffix: '+', label: 'Representative Systems' },
  { value: 3, suffix: '', label: 'Capability Levels' },
  { value: 4, suffix: '', label: 'Governing Regimes' },
]

export const LEVELS = [
  {
    id: 'l1',
    tag: 'L1',
    name: 'Predictor',
    color: '#3d7a52',
    desc: 'Learns local one-step transition operators. Factorizes into state inference, forward dynamics, observation decoding, and inverse dynamics.',
    systems: ['Dreamer', 'TD-MPC2', 'MuZero', 'DIAMOND', 'IRIS', 'EfficientZero'],
  },
  {
    id: 'l2',
    tag: 'L2',
    name: 'Simulator',
    color: '#4f61b8',
    desc: 'Composes L1 operators into multi-step rollouts respecting governing laws. Requires long-horizon coherence, intervention sensitivity, and constraint consistency.',
    systems: ['Sora', 'Genie', 'CICERO', 'GraphCast', 'WebWorld', 'NeuralGCM'],
  },
  {
    id: 'l3',
    tag: 'L3',
    name: 'Evolver',
    color: '#b54e28',
    desc: 'Autonomously revises its model when predictions fail: design \u2192 execute \u2192 observe \u2192 reflect. Closes the loop with active information expansion.',
    systems: ['AlphaEvolve', 'FunSearch', 'A-Lab', 'AI Scientist', 'AdaptSim', 'Co-Scientist'],
  },
]

export const REGIMES = [
  { icon: 'fa-solid fa-atom', title: 'Physical World', desc: 'Newtonian mechanics, contact dynamics, rigid & deformable body physics. Continuous, deterministic, observable.' },
  { icon: 'fa-solid fa-laptop-code', title: 'Digital World', desc: 'Software state machines, DOM trees, game logic. Formally specified and mechanically verifiable transitions.' },
  { icon: 'fa-solid fa-users', title: 'Social World', desc: 'Beliefs, desires, norms, institutions. Opacity, reflexivity, and normativity govern transitions.' },
  { icon: 'fa-solid fa-flask', title: 'Scientific World', desc: 'Conservation laws, PDE constraints, experimental falsifiability. Neural surrogates must respect invariants.' },
]

export const BIBTEX = `@article{chu2026agenticworldmodelingfoundations,
  title         = {Agentic World Modeling: Foundations, Capabilities, Laws, and Beyond},
  author        = {Meng Chu and Xuan Billy Zhang and Kevin Qinghong Lin and Lingdong Kong and Jize Zhang and Teng Tu and Weijian Ma and Ziqi Huang and Senqiao Yang and Wei Huang and Yeying Jin and Zhefan Rao and Jinhui Ye and Xinyu Lin and Xichen Zhang and Qisheng Hu and Shuai Yang and Leyang Shen and Wei Chow and Yifei Dong and Fengyi Wu and Quanyu Long and Bin Xia and Shaozuo Yu and Mingkang Zhu and Wenhu Zhang and Jiehui Huang and Haokun Gui and Haoxuan Che and Long Chen and Qifeng Chen and Wenxuan Zhang and Wenya Wang and Xiaojuan Qi and Yang Deng and Yanwei Li and Mike Zheng Shou and Zhi-Qi Cheng and See-Kiong Ng and Ziwei Liu and Philip Torr and Jiaya Jia},
  year          = {2026},
  eprint        = {2604.22748},
  archivePrefix = {arXiv},
  primaryClass  = {cs.AI},
  url           = {https://arxiv.org/abs/2604.22748}
}`

export const MATRIX_WORDS = [
  'L1', 'L2', 'L3', 'Predictor', 'Simulator', 'Evolver',
  'Dreamer', 'MuZero', 'Sora', 'Genie', 'CICERO', 'GraphCast',
  'FunSearch', 'A-Lab', 'DIAMOND', 'IRIS', 'TD-MPC2', 'DreamerV3',
  'WebWorld', 'AlphaEvolve', 'NeuralGCM', 'GenCast', 'Aurora',
  'WorldCoder', 'CodeWM', 'ToMnet', 'FNO', 'GNS', 'AdaptSim',
  'MBPO', 'RSSM', 'VAE', 'VQ-VAE', 'CPC', 'SPR',
  'Physical', 'Digital', 'Social', 'Scientific',
  'Rollout', 'Dynamics', 'Latent', 'Agent', 'World', 'Model',
  'Predict', 'Simulate', 'Evolve', 'Revise', 'Plan', 'Act',
  // Katakana — world-model lexicon for the matrix rain
  'ワールド・モデリング', 'エージェント', 'プレディクター', 'シミュレーター', 'エボルバー',
  'ダイナミクス', 'ロールアウト', 'レイテント', 'リフレクト',
  'フィジカル', 'デジタル', 'ソーシャル', 'サイエンティフィック',
]
