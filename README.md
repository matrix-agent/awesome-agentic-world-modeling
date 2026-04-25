<p align="center">
  <img src="public/banner.png" alt="Agentic World Modeling: Foundations, Capabilities, Laws, and Beyond" width="100%"/>
</p>

# Awesome Agentic World Modeling [![Awesome](https://awesome.re/badge.svg)](https://awesome.re) [![Paper](https://img.shields.io/badge/Preprint-b31b1b)](https://github.com/matrix-agent/awesome-agentic-world-modeling/blob/main/paper.pdf) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) <!-- omit in toc -->

This repository accompanies the 2026 preprint [**Agentic World Modeling: Foundations, Capabilities, Laws, and Beyond**](paper.pdf), providing a taxonomy-aligned bibliography of **400+** cited works and **100+** representative systems.

Papers are grouped by taxonomy section and listed in reverse chronological order within each subsection to support literature navigation, comparison, and ongoing updates.

## Table of Contents <!-- omit in toc -->

- [Taxonomy Overview](#taxonomy-overview)
- [L1: Predictor](#l1-predictor)
- [L2: Simulator](#l2-simulator)
- [L3: Evolver](#l3-evolver)
- [Benchmarks & Evaluation](#benchmarks--evaluation)
- [Related Surveys](#related-surveys)
- [Welcome to Contribute](#welcome-to-contribute)
- [Citation](#citation)

## Taxonomy Overview

| | Physical | Digital | Social | Scientific |
|:--|:---------|:--------|:-------|:-----------|
| **L1 Predictor** | RSSM, V-JEPA, TD-MPC2 | LLM pred., Othello-WM | ToMnet, BToM | GNN, FNO |
| **L2 Simulator** | DreamerV3, Sora, Cosmos | WebDreamer, Code2World | Generative Agents, CICERO | GraphCast, NeuralGCM |
| **L3 Evolver** | AdaptSim, Self-Modeling | AlphaEvolve, FunSearch | Evolving Constitutions, AgentSociety | A-Lab, AI Scientist |

| Level | Definition | Key Capability |
|:------|:-----------|:---------------|
| **L1 Predictor** | One-step local transition | Prediction accuracy, robustness, identifiability |
| **L2 Simulator** | Multi-step rollout respecting governing laws | Long-horizon coherence, intervention sensitivity, constraint consistency |
| **L3 Evolver** | Design → Execute → Observe → Reflect with model revision | Active information expansion, autonomous execution, belief revision |

## L1: Predictor

Methods learning local one-step operators: state inference, forward dynamics, observation decoding, and inverse dynamics.

### Representation Learning

+ [**VJEPA**](https://arxiv.org/abs/2601.14354) (arXiv, 2026) — Variational JEPA as probabilistic world model.
+ [**V-JEPA 2**](https://arxiv.org/abs/2506.09985) (arXiv, 2025) — Scaled V-JEPA; action-conditioned world model from video.
+ [**DINOv2**](https://arxiv.org/abs/2304.07193) (TMLR, 2024) — Self-supervised vision features; strong transfer. [[Code]](https://github.com/facebookresearch/dinov2)
+ [**V-JEPA**](https://arxiv.org/abs/2404.08471) (TMLR, 2024) — Video JEPA; temporal prediction in feature space. [[Code]](https://github.com/facebookresearch/jepa)
+ [**I-JEPA**](https://arxiv.org/abs/2301.08243) (CVPR, 2023) — Image Joint-Embedding Predictive Architecture. [[Code]](https://github.com/facebookresearch/ijepa)
+ [**SPR**](https://arxiv.org/abs/2007.05929) (ICLR, 2021) — Self-Predictive Representations; temporal consistency for data-efficient RL. [[Code]](https://github.com/mila-iqia/spr)
+ [**MoCo**](https://arxiv.org/abs/1911.05722) (CVPR, 2020) — Momentum contrast for unsupervised visual features. [[Code]](https://github.com/facebookresearch/moco)
+ [**SimCLR**](https://arxiv.org/abs/2002.05709) (ICML, 2020) — Simple contrastive learning with strong augmentation. [[Code]](https://github.com/google-research/simclr)
+ [**CURL**](https://arxiv.org/abs/2004.04136) (ICML, 2020) — Contrastive unsupervised representations for RL. [[Code]](https://github.com/MishaLaskin/curl)
+ [**CPC**](https://arxiv.org/abs/1807.03748) (arXiv, 2018) — Contrastive Predictive Coding; predicts future in latent space.
+ [**β-VAE**](https://openreview.net/forum?id=Sy2fzU9gl) (ICLR, 2017) — Disentangled representations via increased KL penalty.
+ [**VQ-VAE**](https://arxiv.org/abs/1711.00937) (NeurIPS, 2017) — Discrete codebook tokenization. [[Code]](https://github.com/MishaLaskin/vqvae)
+ [**VAE**](https://arxiv.org/abs/1312.6114) (ICLR, 2014) — Variational autoencoder; foundational latent variable model.

### Model-Based RL

+ [**DreamerV3**](https://arxiv.org/abs/2301.04104) (Nature, 2025) — Generalizes across 150+ tasks; unified symlog world model. [[Code]](https://github.com/danijar/dreamerv3)
+ [**TD-MPC2**](https://arxiv.org/abs/2310.16828) (ICLR, 2024) — Temporal difference-aligned dynamics; 317M parameters. [[Code]](https://github.com/nicklashansen/tdmpc2)
+ [**DreamerV2**](https://arxiv.org/abs/2010.02193) (ICLR, 2021) — Discrete latent representations; human-level Atari. [[Code]](https://github.com/danijar/dreamerv2)
+ [**EfficientZero**](https://arxiv.org/abs/2111.00210) (NeurIPS, 2021) — MuZero + self-supervised consistency. [[Code]](https://github.com/YeWR/EfficientZero)
+ [**Dreamer**](https://arxiv.org/abs/1912.01603) (ICLR, 2020) — Latent imagination via RSSM; multi-step backpropagation. [[Code]](https://github.com/danijar/dreamer)
+ [**MuZero**](https://arxiv.org/abs/1911.08265) (Nature, 2020) — Value-aligned dynamics without reconstruction; masters Go, chess, Atari.
+ [**DeepMDP**](https://arxiv.org/abs/1906.02736) (ICML, 2019) — Bellman-aligned latent state abstraction.
+ [**MBPO**](https://arxiv.org/abs/1906.08253) (NeurIPS, 2019) — Model-Based Policy Optimization; short-horizon rollouts + off-policy RL. [[Code]](https://github.com/jannerm/mbpo)
+ [**PETS**](https://arxiv.org/abs/1805.12114) (NeurIPS, 2018) — Probabilistic Ensemble + Trajectory Sampling. [[Code]](https://github.com/kchua/handful-of-trials)
+ [**World Models**](https://arxiv.org/abs/1803.10122) (NeurIPS, 2018) — VAE + MDN-RNN; influential early architecture. [[Code]](https://github.com/hardmaru/WorldModelsExperiments)
+ [**E2C**](https://arxiv.org/abs/1506.07365) (NeurIPS, 2015) — Embed to Control; locally linear latent dynamics from images.
+ [**PILCO**](https://dl.acm.org/doi/10.5555/3104482.3104541) (ICML, 2011) — Gaussian process dynamics for data-efficient policy search. [[Code]](https://github.com/UCL-SML/pilco-matlab)

### Token & Diffusion-Based

+ [**DIAMOND**](https://arxiv.org/abs/2405.12399) (NeurIPS, 2024) — U-Net diffusion transition operator. [[Code]](https://github.com/eloialonso/diamond)
+ [**Delta-IRIS**](https://arxiv.org/abs/2406.19320) (ICML, 2024) — Delta-based tokenization for world models. [[Code]](https://github.com/vmicheli/delta-iris)
+ [**IRIS**](https://arxiv.org/abs/2209.00588) (ICLR, 2023) — VQ-VAE + Transformer autoregressive world model. [[Code]](https://github.com/eloialonso/iris)
+ [**STORM**](https://arxiv.org/abs/2310.09615) (NeurIPS, 2023) — Stochastic Transformer + VAE world model. [[Code]](https://github.com/weipu-zhang/STORM)
+ [**Latent Diffusion**](https://arxiv.org/abs/2112.10752) (CVPR, 2022) — Diffusion in latent space; high-quality decoding. [[Code]](https://github.com/CompVis/latent-diffusion)
+ [**TransDreamer**](https://arxiv.org/abs/2202.09481) (arXiv, 2022) — Transformer-XL replacing RSSM. [[Code]](https://github.com/changchencc/TransDreamer)

## L2: Simulator

Systems composing operators into multi-step rollouts satisfying governing laws.

### Physical World

+ [**HWM**](https://arxiv.org/abs/2604.03208) (arXiv, 2026) — Hierarchical latent world model + multi-scale planning. [[Code]](https://github.com/kevinghst/HWM_PLDM)
+ [**BridgeV2W**](https://arxiv.org/abs/2602.03793) (arXiv, 2026) — Action-conditioned embodied video generation.
+ [**Yume**](https://arxiv.org/abs/2507.17744) (arXiv, 2025) — Video diffusion interactive world generation. [[Code]](https://github.com/stdstu12/YUME)
+ [**RoboScape**](https://arxiv.org/abs/2506.23135) (arXiv, 2025) — Physics-informed robotic video world model. [[Code]](https://github.com/tsinghua-fib-lab/RoboScape)
+ [**PIN-WM**](https://arxiv.org/abs/2504.16693) (arXiv, 2025) — Differentiable rigid-body physics + 3DGS. [[Code]](https://github.com/XuAdventurer/PIN-WM)
+ [**GAIA-2**](https://arxiv.org/abs/2503.20523) (arXiv, 2025) — Latent diffusion multi-view AD generation.
+ [**Aether**](https://arxiv.org/abs/2503.18945) (arXiv, 2025) — CogVideoX geometry-aware fine-tune. [[Code]](https://github.com/OpenRobotLab/Aether)
+ [**Cosmos**](https://arxiv.org/abs/2501.03575) (arXiv, 2025) — NVIDIA autoregressive + diffusion hybrid. [[Code]](https://github.com/NVIDIA/Cosmos)
+ [**LWM**](https://arxiv.org/abs/2402.08268) (ICLR, 2025) — RingAttention long-context LLM world model. [[Code]](https://github.com/LargeWorldModel/LWM)
+ [**DreamerV3**](https://arxiv.org/abs/2301.04104) (Nature, 2025) — RSSM + symlog loss for generalist long-horizon rollout. [[Code]](https://github.com/danijar/dreamerv3)
+ [**DreMa**](https://arxiv.org/abs/2412.14957) (arXiv, 2024) — Compositional 3DGS digital twins for manipulation. [[Code]](https://github.com/leobarcellona/drema_code)
+ [**Vista**](https://arxiv.org/abs/2405.17398) (NeurIPS, 2024) — Diffusion driving world model. [[Code]](https://github.com/OpenDriveLab/Vista)
+ [**iVideoGPT**](https://arxiv.org/abs/2405.15223) (NeurIPS, 2024) — Transformer + VQ-VAE interactive prediction. [[Code]](https://github.com/thuml/iVideoGPT)
+ [**DIAMOND**](https://arxiv.org/abs/2405.12399) (NeurIPS, 2024) — U-Net diffusion as Atari simulator. [[Code]](https://github.com/eloialonso/diamond)
+ [**Sora**](https://openai.com/index/video-generation-models-as-world-simulators/) (OpenAI, 2024) — DiT video diffusion world simulator.
+ [**VideoPoet**](https://proceedings.mlr.press/v235/kondratyuk24a.html) (ICML, 2024) — LLM multimodal video tokenizer.
+ [**Genie**](https://arxiv.org/abs/2402.15391) (ICML, 2024) — Latent action discovery; generative interactive environment.
+ [**OccWorld**](https://arxiv.org/abs/2311.16038) (arXiv, 2024) — GPT 3D occupancy prediction for AD. [[Code]](https://github.com/wzzheng/OccWorld)
+ [**Copilot4D**](https://arxiv.org/abs/2311.01017) (ICLR, 2024) — VQ-VAE + discrete point diffusion.
+ [**DriveDreamer**](https://arxiv.org/abs/2309.09777) (ECCV, 2024) — Diffusion AD generation. [[Code]](https://github.com/JeffWang987/DriveDreamer)
+ [**Lumiere**](https://doi.org/10.1145/3680528.3687614) (SIGGRAPH, 2024) — Space-time U-Net diffusion.
+ [**GAIA-1**](https://arxiv.org/abs/2309.17080) (arXiv, 2023) — Transformer video generation for AD.
+ [**DayDreamer**](https://arxiv.org/abs/2206.14176) (CoRL, 2023) — RSSM on real-world robots. [[Code]](https://github.com/danijar/daydreamer)
+ [**Diffuser**](https://arxiv.org/abs/2205.09991) (ICML, 2022) — Diffusion trajectory planning. [[Code]](https://github.com/jannerm/diffuser)
+ [**DreamingV2**](https://arxiv.org/abs/2203.00494) (arXiv, 2022) — DreamerV2 + reconstruction-free objective.
+ [**DreamerPro**](https://arxiv.org/abs/2110.14565) (ICML, 2022) — RSSM + prototypical representations. [[Code]](https://github.com/fdeng18/dreamer-pro)
+ [**PathDreamer**](https://arxiv.org/abs/2105.08756) (ICCV, 2021) — Autoregressive visual world model for VLN. [[Code]](https://github.com/google-research/pathdreamer)
+ [**Plan2Explore**](https://arxiv.org/abs/2005.05960) (ICML, 2020) — Dreamer + self-supervised exploration. [[Code]](https://github.com/ramanans1/plan2explore)
+ [**MuZero**](https://arxiv.org/abs/1911.08265) (Nature, 2020) — Value-aligned dynamics with MCTS for long-horizon planning.

### Digital World

+ [**Code2World**](https://arxiv.org/abs/2602.09856) (arXiv, 2026) — VLM code rendering as environment. [[Code]](https://github.com/AMAP-ML/Code2World)
+ [**RWML**](https://arxiv.org/abs/2602.05842) (arXiv, 2026) — LLM + RL sim-to-real alignment.
+ [**gWorld**](https://arxiv.org/abs/2602.01576) (arXiv, 2026) — VLM code rendering for web simulation. [[Code]](https://github.com/trillion-labs/gWorld)
+ [**WebWorld**](https://arxiv.org/abs/2602.14721) (arXiv, 2026) — Fine-tuned VLM web simulator.
+ [**MobileDreamer**](https://arxiv.org/abs/2601.04035) (arXiv, 2026) — LLM GUI sketch prediction.
+ [**Word2World**](https://arxiv.org/abs/2512.18832) (arXiv, 2025) — LLM text-based world model evaluation. [[Code]](https://github.com/X1AOX1A/Word2World)
+ [**NeuralOS**](https://arxiv.org/abs/2507.08800) (arXiv, 2025) — RNN + pixel diffusion for desktop GUI. [[Code]](https://github.com/yuntian-group/neural-os)
+ [**WebSynthesis**](https://arxiv.org/abs/2507.04370) (arXiv, 2025) — LLM + MCTS trajectory synthesis. [[Code]](https://github.com/LucusFigoGao/WebSynthesis)
+ [**GameCraft**](https://arxiv.org/abs/2506.17201) (arXiv, 2025) — Diffusion game video generation. [[Code]](https://github.com/Tencent-Hunyuan/Hunyuan-GameCraft-1.0)
+ [**GameFactory**](https://arxiv.org/abs/2501.08325) (ICCV, 2025) — Action-controlled interactive game video generation. [[Code]](https://github.com/KwaiVGI/GameFactory)
+ [**WebDreamer**](https://arxiv.org/abs/2411.06559) (TMLR, 2025) — LLM web state simulation + tree search. [[Code]](https://github.com/OSU-NLP-Group/WebDreamer)
+ [**WMA**](https://arxiv.org/abs/2410.13232) (ICLR, 2025) — LLM web transition prediction. [[Code]](https://github.com/kyle8581/WMA-Agents)
+ [**GameNGen**](https://arxiv.org/abs/2408.14837) (ICLR, 2025) — U-Net diffusion runs DOOM at 20 FPS.
+ [**CodeWM**](https://arxiv.org/abs/2405.15383) (arXiv, 2024) — LLM + MCTS code world model generation. [[Code]](https://github.com/nicoladainese96/code-world-models)
+ [**WorldCoder**](https://arxiv.org/abs/2402.12275) (NeurIPS, 2024) — LLM incremental code synthesis world model. [[Code]](https://github.com/ma-labo/worldcoder)
+ [**GameGAN**](https://arxiv.org/abs/2005.12126) (CVPR, 2020) — GAN neural game engine from gameplay videos. [[Code]](https://github.com/nv-tlabs/GameGAN_code)

### Social World

+ [**PolicySim**](https://arxiv.org/abs/2603.19649) (arXiv, 2026) — LLM platform policy sandbox. [[Code]](https://github.com/renH2/PolicySim)
+ [**AIvilization**](https://arxiv.org/abs/2602.10429) (arXiv, 2026) — Large-scale sandbox economy simulation.
+ [**MASim**](https://arxiv.org/abs/2512.07195) (arXiv, 2025) — Multilingual agent social simulation.
+ [**SWM-AP**](https://arxiv.org/abs/2510.19270) (arXiv, 2025) — Social world model for mechanism design.
+ [**OASIS**](https://arxiv.org/abs/2411.11581) (arXiv, 2024) — 1M-agent social simulation at scale. [[Code]](https://github.com/camel-ai/oasis)
+ [**Project Sid**](https://arxiv.org/abs/2411.00114) (arXiv, 2024) — 1000 LLM agents with emergent civilization. [[Code]](https://github.com/altera-al/project-sid)
+ [**Werewolf**](https://arxiv.org/abs/2310.18940) (arXiv, 2024) — LLM + RL strategic deception. [[Code]](https://github.com/xuyuzhuang11/Werewolf)
+ [**Sotopia**](https://arxiv.org/abs/2310.11667) (ICLR, 2024) — LLM social evaluation framework. [[Code]](https://github.com/sotopia-lab/sotopia)
+ [**AvalonBench**](https://arxiv.org/abs/2310.05036) (NeurIPS, 2023) — LLM deductive social reasoning. [[Code]](https://github.com/jonathanmli/Avalon-LLM)
+ [**Generative Agents**](https://arxiv.org/abs/2304.03442) (UIST, 2023) — LLM reflective memory stream in Smallville. [[Code]](https://github.com/joonspk-research/generative_agents)
+ [**CICERO**](https://doi.org/10.1126/science.ade9097) (Science, 2022) — LLM + strategic planning for human-level Diplomacy. [[Code]](https://github.com/facebookresearch/diplomacy_cicero)
+ [**Social Simulacra**](https://dl.acm.org/doi/10.1145/3526113.3545616) (UIST, 2022) — GPT prompt-chain community simulation.
+ [**Deal or No Deal**](https://arxiv.org/abs/1706.05125) (EMNLP, 2017) — RNN + RL self-play negotiation. [[Code]](https://github.com/facebookresearch/end-to-end-negotiator)

### Scientific World

+ [**Lingshu-Cell**](https://arxiv.org/abs/2603.25240) (arXiv, 2026) — Masked discrete diffusion cellular world model.
+ [**Aurora**](https://arxiv.org/abs/2405.13063) (arXiv, 2025) — 3D Swin Earth system foundation model. [[Code]](https://github.com/microsoft/aurora)
+ [**GenCast**](https://arxiv.org/abs/2312.15796) (Nature, 2025) — Spherical ensemble diffusion forecasting. [[Code]](https://github.com/google-deepmind/graphcast)
+ [**NeuralGCM**](https://arxiv.org/abs/2311.07222) (Nature, 2024) — Hybrid physics-NN general circulation model. [[Code]](https://github.com/google-research/neuralgcm)
+ [**BAX**](https://www.nature.com/articles/s41524-024-01326-2) (npj Computational Materials, 2024) — Bayesian algorithm execution for targeted materials discovery. [[Code]](https://github.com/sathya-chitturi/multibax-sklearn)
+ [**GraphCast**](https://arxiv.org/abs/2212.12794) (Science, 2023) — GNN autoregressive weather in under 1 minute. [[Code]](https://github.com/google-deepmind/graphcast)
+ [**ClimaX**](https://arxiv.org/abs/2301.10343) (ICML, 2023) — ViT climate foundation model. [[Code]](https://github.com/microsoft/ClimaX)
+ [**Pangu-Weather**](https://arxiv.org/abs/2211.02556) (Nature, 2023) — 3D Earth Transformer weather forecasting. [[Code]](https://github.com/198808xc/Pangu-Weather)
+ [**FNO**](https://arxiv.org/abs/2010.08895) (ICLR, 2021) — Fourier Neural Operator; 1000x speedup for PDEs. [[Code]](https://github.com/neuraloperator/neuraloperator)
+ [**GNS**](https://arxiv.org/abs/2002.09405) (ICML, 2020) — Graph Network Simulator; learned particle dynamics. [[Code]](https://github.com/deepmind/deepmind-research)
+ [**ChemBO**](https://proceedings.mlr.press/v108/korovina20a.html) (AISTATS, 2020) — Bayesian optimization for synthesizable small molecules. [[Code]](https://github.com/kamikaze0923/ChemBo)
+ [**P3BO**](https://proceedings.mlr.press/v119/angermueller20a.html) (ICML, 2020) — Population-based black-box optimization for biological sequence design.

## L3: Evolver

Systems closing the **design → execute → observe → reflect** loop to autonomously revise their models.

### Physical World

+ [**Self-Modeling**](https://arxiv.org/abs/2207.03386) (npj Robotics, 2025) — Robot detects morphology changes and retrains kinematic model. [[Code]](https://github.com/H-Y-H-Y-H/Egocentric_VSM)
+ [**AdaptSim**](https://arxiv.org/abs/2302.04903) (CoRL, 2023) — Sim-parameter adaptation via Bayesian optimization. [[Code]](https://github.com/irom-princeton/AdaptSim)

### Digital World

+ [**AUI**](https://arxiv.org/abs/2511.15567) (arXiv, 2025) — VLM + adaptive UI grounding. [[Code]](https://github.com/showlab/AUI)
+ [**AlphaEvolve**](https://arxiv.org/abs/2506.13131) (DeepMind, 2025) — LLM + evolutionary coding agent for algorithm discovery. [[Code]](https://github.com/google-deepmind/alphaevolve_results)
+ [**SWE-agent**](https://arxiv.org/abs/2405.15793) (arXiv, 2024) — LLM + shell interface with regression gates. [[Code]](https://github.com/princeton-nlp/SWE-agent)
+ [**CodeIt**](https://arxiv.org/abs/2402.04858) (ICML, 2024) — LLM code generation + self-play fine-tuning. [[Code]](https://github.com/Qualcomm-AI-research/codeit)
+ [**FunSearch**](https://doi.org/10.1038/s41586-023-06924-6) (Nature, 2024) — LLM + evolutionary search discovers math algorithms. [[Code]](https://github.com/google-deepmind/funsearch)

### Social World

+ [**Evolving Constitutions**](https://arxiv.org/abs/2602.00755) (arXiv, 2026) — LLM constitution revision via genetic programming.
+ [**AgentSociety**](https://arxiv.org/abs/2502.08691) (arXiv, 2025) — LLM multi-agent simulation with behavioral drift tracking. [[Code]](https://github.com/tsinghua-fib-lab/AgentSociety)

### Scientific World

+ [**BioLab**](https://doi.org/10.1101/2025.09.03.674085) (bioRxiv, 2025) — Autonomous biological laboratory agent.
+ [**OriGene**](https://doi.org/10.1101/2025.06.03.657658) (bioRxiv, 2025) — Self-evolving virtual disease biologist for therapeutic target discovery. [[Code]](https://github.com/GENTEL-lab/OriGene)
+ [**Biomni**](https://doi.org/10.1101/2025.05.30.656746) (bioRxiv, 2025) — Foundation model for biological experimentation. [[Code]](https://github.com/snap-stanford/Biomni)
+ [**AI Scientist v2**](https://arxiv.org/abs/2504.08066) (arXiv, 2025) — Agentic tree search for workshop-level discovery. [[Code]](https://github.com/SakanaAI/AI-Scientist-v2)
+ [**Co-Scientist**](https://arxiv.org/abs/2502.18864) (arXiv, 2025) — Multi-agent tournament for biomedical hypothesis generation.
+ [**MOOSE-Chem2**](https://arxiv.org/abs/2505.19209) (NeurIPS, 2025) — Hierarchical hypothesis search for chemistry. [[Code]](https://github.com/ZonglinY/MOOSE-Chem2)
+ [**MOOSE-Chem**](https://arxiv.org/abs/2410.07076) (ICLR, 2025) — Rediscovered chemistry hypotheses from pre-2024 data. [[Code]](https://github.com/ZonglinY/MOOSE-Chem)
+ [**AI Scientist**](https://arxiv.org/abs/2408.06292) (arXiv, 2024) — Full-paper generation + peer review loop. [[Code]](https://github.com/SakanaAI/AI-Scientist)
+ [**SDL Lasers**](https://doi.org/10.1126/science.adk9227) (Science, 2024) — Multi-site self-driving lab for organic lasers. [[Code]](https://github.com/aspuru-guzik-group/acdc_laser)
+ [**A-Lab**](https://doi.org/10.1038/s41586-023-06734-w) (Nature, 2023) — Autonomous robotic lab; 41 novel compounds in 17 days.
+ [**BacterAI**](https://doi.org/10.1038/s41564-023-01376-0) (Nature Microbiology, 2023) — Zero-knowledge iterative amino acid requirement mapping. [[Code]](https://github.com/jensenlab/BacterAI)
+ [**CAMEO**](https://arxiv.org/abs/2006.06141) (Nature Comms, 2020) — Bayesian active learning at synchrotron beamline. [[Code]](https://github.com/KusneNIST/CAMEO_NComm)
+ [**Yeast Cycles**](https://doi.org/10.1073/pnas.1900548116) (PNAS, 2019) — Closed-loop experiment design for yeast metabolism.
+ [**Robot Scientist**](https://doi.org/10.1186/1759-4499-2-1) (Automated Experimentation, 2010) — Robot scientist framework for autonomous scientific discovery.

## Benchmarks & Evaluation

### Physical

+ [**RoboCasa**](https://arxiv.org/abs/2406.02523) (arXiv, 2024) — 100+ kitchen task completion. [[Code]](https://github.com/robocasa/robocasa)
+ [**CALVIN**](https://arxiv.org/abs/2112.03227) (arXiv, 2021) — Multi-step language-conditioned manipulation. [[Code]](https://github.com/mees/calvin)
+ [**Meta-World**](https://arxiv.org/abs/1910.10897) (CoRL, 2019) — Success rate over 50 manipulation tasks. [[Code]](https://github.com/Farama-Foundation/Metaworld)
+ [**nuScenes**](https://arxiv.org/abs/1903.11027) (CVPR, 2019) — 3D detection and tracking; mAP, NDS. [[Code]](https://github.com/nutonomy/nuscenes-devkit)
+ [**Atari 100k**](https://arxiv.org/abs/1903.00374) (arXiv, 2019) — Human-normalized score; 26 games, 100k steps.

### Digital

+ [**OSWorld**](https://arxiv.org/abs/2404.07972) (arXiv, 2024) — Desktop OS task success. [[Code]](https://github.com/xlang-ai/OSWorld)
+ [**SWE-bench**](https://arxiv.org/abs/2310.06770) (ICLR, 2024) — Multi-file patch resolved rate. [[Code]](https://github.com/princeton-nlp/SWE-bench)
+ [**WebArena**](https://arxiv.org/abs/2307.13854) (ICLR, 2024) — 812 web task success rate. [[Code]](https://github.com/web-arena-x/webarena)

### Social

+ [**Sotopia**](https://arxiv.org/abs/2310.11667) (ICLR, 2024) — 7-dimensional social score. [[Code]](https://github.com/sotopia-lab/sotopia)
+ [**Hi-ToM**](https://arxiv.org/abs/2310.16755) (arXiv, 2023) — Higher-order theory of mind. [[Code]](https://github.com/ying-hui-he/Hi-ToM_dataset)
+ [**FANToM**](https://arxiv.org/abs/2310.15421) (arXiv, 2023) — Conversational false-belief accuracy. [[Code]](https://github.com/skywalker023/fantom)

### Scientific

+ [**DiscoveryBench**](https://arxiv.org/abs/2407.01725) (NeurIPS, 2024) — Evidence-based hypothesis accuracy. [[Code]](https://github.com/allenai/discoverybench)
+ [**Minecraft (MCU)**](https://arxiv.org/abs/2310.08367) (arXiv, 2023) — Open-world tech-tree completion. [[Code]](https://github.com/CraftJarvis/MCU)
+ [**ScienceWorld**](https://arxiv.org/abs/2203.07540) (EMNLP, 2022) — 30 elementary science experiments. [[Code]](https://github.com/allenai/ScienceWorld)

## Related Surveys

+ [**Yue et al.**](https://arxiv.org/abs/2511.08585) (arXiv, 2025) — Visual world model roadmap G1-G4.
+ [**Zhang, P-F et al.**](https://arxiv.org/abs/2511.02097) (arXiv, 2025) — Robotic manipulation world models.
+ [**Li et al.**](https://arxiv.org/abs/2510.16732) (arXiv, 2025) — Embodied world models (3-axis).
+ [**Kong et al.**](https://arxiv.org/abs/2509.07996) (arXiv, 2025) — 3D/4D world modeling.
+ [**Wei, Jiaqi et al.**](https://arxiv.org/abs/2508.14111) (arXiv, 2025) — AI-for-Science autonomous discovery.
+ [**Tu et al.**](https://arxiv.org/abs/2502.10498) (arXiv, 2025) — AD world models.
+ [**Feng et al.**](https://arxiv.org/abs/2501.11260) (arXiv, 2025) — AD world models.
+ [**Ding et al.**](https://arxiv.org/abs/2411.14499) (ACM CSUR, 2025) — Understanding vs predicting world models.
+ [**Kang et al.**](https://arxiv.org/abs/2411.02385) (arXiv, 2025) — How far is video generation from world model.
+ [**Zhu et al.**](https://arxiv.org/abs/2405.03520) (arXiv, 2024) — Sora / video world models.
+ [**Moerland et al.**](https://arxiv.org/abs/2006.16712) (FnT ML, 2023) — Model-based RL.

## Welcome to Contribute

**We welcome contributions!** This project is actively maintained. If you know a paper that should be listed, open an issue with the paper link and target taxonomy section.

### Automatic Paper Agent

Open an issue containing an `awwm-paper` block. AI agents can use the repository skill at `skills/add-paper/SKILL.md` to generate it. For plain arXiv-link submissions, include a line such as `Section: L2-Digital`; the workflow cannot infer taxonomy placement from the URL alone.

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

The GitHub Action will parse the block, insert the entry in reverse chronological order, and open a PR for maintainer review. Valid sections are `L1-Representation`, `L1-Model-Based-RL`, `L1-Token-Diffusion`, `L2-Physical`, `L2-Digital`, `L2-Social`, `L2-Scientific`, `L3-Physical`, `L3-Digital`, `L3-Social`, and `L3-Scientific`.

You can also submit a traditional PR if you prefer.

## Citation

If you find this resource useful, please cite:

```bibtex
@misc{chu2026agentic,
  title        = {Agentic World Modeling: Foundations, Capabilities, Laws, and Beyond},
  author       = {Chu, Meng and Zhang, Xuan Billy and Lin, Kevin Qinghong and
                  Kong, Lingdong and Zhang, Jize and Tu, Teng and Ma, Weijian and
                  Huang, Ziqi and Yang, Senqiao and Huang, Wei and Jin, Yeying and
                  Rao, Zhefan and Ye, Jinhui and Lin, Xinyu and Zhang, Xichen and
                  Hu, Qisheng and Yang, Shuai and Shen, Leyang and Chow, Wei and
                  Dong, Yifei and Wu, Fengyi and Long, Quanyu and Xia, Bin and
                  Yu, Shaozuo and Zhu, Mingkang and Zhang, Wenhu and Huang, Jiehui and
                  Gui, Haokun and Che, Haoxuan and Chen, Long and Chen, Qifeng and
                  Zhang, Wenxuan and Wang, Wenya and Qi, Xiaojuan and Deng, Yang and
                  Li, Yanwei and Shou, Mike Zheng and Cheng, Zhi-Qi and Ng, See-Kiong and
                  Liu, Ziwei and Torr, Philip and Jia, Jiaya},
  year         = {2026},
  howpublished = {\url{https://github.com/matrix-agent/awesome-agentic-world-modeling}},
  note         = {GitHub repository}
}
```

---

**⭐ Star this repo if you find it useful!**
