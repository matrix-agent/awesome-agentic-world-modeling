<p align="center">
  <img src="public/banner.png" alt="Agentic World Modeling: Foundations, Capabilities, Laws, and Beyond" width="100%"/>
</p>

# Awesome Agentic World Modeling

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re) [![arXiv](https://img.shields.io/badge/arXiv-2604.22748-b31b1b)](https://arxiv.org/abs/2604.22748) [![Website](https://img.shields.io/badge/Website-agentic--world--modeling.xyz-1f6feb?logo=googlechrome&logoColor=white)](https://agentic-world-modeling.xyz/) [![HF #1 Paper of the Day](https://img.shields.io/badge/%F0%9F%A4%97%20HF-%231%20Paper%20of%20the%20Day-FFD21E)](https://huggingface.co/papers/2604.22748) [![@_akhaliq](https://img.shields.io/badge/%40__akhaliq-6366F1?logo=x&logoColor=white&labelColor=000000)](https://x.com/_akhaliq/status/2048805921485148284) [![@dotey](https://img.shields.io/badge/%40dotey-6366F1?logo=x&logoColor=white&labelColor=000000)](https://x.com/dotey/status/2049187740084731991) <!-- omit in toc -->

This repository accompanies the [**Agentic World Modeling: Foundations, Capabilities, Laws, and Beyond**](https://arxiv.org/abs/2604.22748), providing a taxonomy-aligned bibliography of **400+** cited works and **100+** representative systems. Papers are grouped by taxonomy section and listed in reverse chronological order within each subsection to support literature navigation, comparison, and ongoing updates. Released under the [MIT License](LICENSE). Check out our poster [here](public/poster.png).

> [!TIP]
> 👋 Welcome to join the discussion on [![Discord](https://img.shields.io/badge/Discord-Server-5865F2?logo=discord&logoColor=white)](https://discord.gg/NEAkmhPxqm) or [![WeChat](https://img.shields.io/badge/WeChat-Group-07C160?logo=wechat&logoColor=white)](public/wechat-group.jpg), share your work in progress, and help us grow the agentic world modeling community together.

> [!NOTE]
> 📚 If you find this resource useful, please cite and [![Stars](https://img.shields.io/github/stars/matrix-agent/awesome-agentic-world-modeling?style=social)](https://github.com/matrix-agent/awesome-agentic-world-modeling) the repo:
>
> ```bibtex
> @article{chu2026agenticworldmodelingfoundations,
>   title         = {Agentic World Modeling: Foundations, Capabilities, Laws, and Beyond},
>   author        = {Meng Chu and Xuan Billy Zhang and Kevin Qinghong Lin and Lingdong Kong and Jize Zhang and Teng Tu and Weijian Ma and Ziqi Huang and Senqiao Yang and Wei Huang and Yeying Jin and Zhefan Rao and Jinhui Ye and Xinyu Lin and Xichen Zhang and Qisheng Hu and Shuai Yang and Leyang Shen and Wei Chow and Yifei Dong and Fengyi Wu and Quanyu Long and Bin Xia and Shaozuo Yu and Mingkang Zhu and Wenhu Zhang and Jiehui Huang and Haokun Gui and Haoxuan Che and Long Chen and Qifeng Chen and Wenxuan Zhang and Wenya Wang and Xiaojuan Qi and Yang Deng and Yanwei Li and Mike Zheng Shou and Zhi-Qi Cheng and See-Kiong Ng and Ziwei Liu and Philip Torr and Jiaya Jia},
>   year          = {2026},
>   eprint        = {2604.22748},
>   archivePrefix = {arXiv},
>   primaryClass  = {cs.AI},
>   url           = {https://arxiv.org/abs/2604.22748}
> }
> ```

## Table of Contents <!-- omit in toc -->

- [Taxonomy Overview](#taxonomy-overview)
- [L1: Predictor](#l1-predictor)
- [L2: Simulator](#l2-simulator)
- [L3: Evolver](#l3-evolver)
- [Benchmarks & Evaluation](#benchmarks--evaluation)
- [Related Surveys](#related-surveys)
- [Welcome to Contribute](#welcome-to-contribute)

## Overview

| Level | Definition | Key Capability | Physical | Digital | Social | Scientific |
|:------|:-----------|:---------------|:---------|:--------|:-------|:-----------|
| **L1 Predictor** | One-step local transition | Prediction accuracy, robustness, identifiability | RSSM, V-JEPA, TD-MPC2 | LLM pred., Othello-WM | ToMnet, BToM | GNN, FNO |
| **L2 Simulator** | Multi-step rollout respecting governing laws | Long-horizon coherence, intervention sensitivity, constraint consistency | DreamerV3, Sora, Cosmos | WebDreamer, Code2World | Generative Agents, CICERO | GraphCast, NeuralGCM |
| **L3 Evolver** | Design → Execute → Observe → Reflect with model revision | Active information expansion, autonomous execution, belief revision | AdaptSim, Self-Modeling | AlphaEvolve, FunSearch | Evolving Constitutions, AgentSociety | A-Lab, AI Scientist |

## L1: Predictor

Methods learning local one-step operators: state inference, forward dynamics, observation decoding, and inverse dynamics.

### Representation Learning

+ [**VJEPA**](https://arxiv.org/abs/2601.14354) (arXiv, 2026) — Variational JEPA as probabilistic world model.
+ [**V-JEPA 2**](https://arxiv.org/abs/2506.09985) (arXiv, 2025) — Scaled V-JEPA; action-conditioned world model from video.
+ [**DINOv2**](https://arxiv.org/abs/2304.07193) (TMLR, 2024) — Self-supervised vision features; strong transfer. [![Stars](https://img.shields.io/github/stars/facebookresearch/dinov2?style=flat&logo=github&color=181717)](https://github.com/facebookresearch/dinov2)
+ [**V-JEPA**](https://arxiv.org/abs/2404.08471) (TMLR, 2024) — Video JEPA; temporal prediction in feature space. [![Stars](https://img.shields.io/github/stars/facebookresearch/jepa?style=flat&logo=github&color=181717)](https://github.com/facebookresearch/jepa)
+ [**I-JEPA**](https://arxiv.org/abs/2301.08243) (CVPR, 2023) — Image Joint-Embedding Predictive Architecture. [![Stars](https://img.shields.io/github/stars/facebookresearch/ijepa?style=flat&logo=github&color=181717)](https://github.com/facebookresearch/ijepa)
+ [**SPR**](https://arxiv.org/abs/2007.05929) (ICLR, 2021) — Self-Predictive Representations; temporal consistency for data-efficient RL. [![Stars](https://img.shields.io/github/stars/mila-iqia/spr?style=flat&logo=github&color=181717)](https://github.com/mila-iqia/spr)
+ [**MoCo**](https://arxiv.org/abs/1911.05722) (CVPR, 2020) — Momentum contrast for unsupervised visual features. [![Stars](https://img.shields.io/github/stars/facebookresearch/moco?style=flat&logo=github&color=181717)](https://github.com/facebookresearch/moco)
+ [**SimCLR**](https://arxiv.org/abs/2002.05709) (ICML, 2020) — Simple contrastive learning with strong augmentation. [![Stars](https://img.shields.io/github/stars/google-research/simclr?style=flat&logo=github&color=181717)](https://github.com/google-research/simclr)
+ [**CURL**](https://arxiv.org/abs/2004.04136) (ICML, 2020) — Contrastive unsupervised representations for RL. [![Stars](https://img.shields.io/github/stars/MishaLaskin/curl?style=flat&logo=github&color=181717)](https://github.com/MishaLaskin/curl)
+ [**CPC**](https://arxiv.org/abs/1807.03748) (arXiv, 2018) — Contrastive Predictive Coding; predicts future in latent space.
+ [**β-VAE**](https://openreview.net/forum?id=Sy2fzU9gl) (ICLR, 2017) — Disentangled representations via increased KL penalty.
+ [**VQ-VAE**](https://arxiv.org/abs/1711.00937) (NeurIPS, 2017) — Discrete codebook tokenization. [![Stars](https://img.shields.io/github/stars/MishaLaskin/vqvae?style=flat&logo=github&color=181717)](https://github.com/MishaLaskin/vqvae)
+ [**VAE**](https://arxiv.org/abs/1312.6114) (ICLR, 2014) — Variational autoencoder; foundational latent variable model.

### Model-Based RL

+ [**DreamerV3**](https://arxiv.org/abs/2301.04104) (Nature, 2025) — Generalizes across 150+ tasks; unified symlog world model. [![Stars](https://img.shields.io/github/stars/danijar/dreamerv3?style=flat&logo=github&color=181717)](https://github.com/danijar/dreamerv3)
+ [**TD-MPC2**](https://arxiv.org/abs/2310.16828) (ICLR, 2024) — Temporal difference-aligned dynamics; 317M parameters. [![Stars](https://img.shields.io/github/stars/nicklashansen/tdmpc2?style=flat&logo=github&color=181717)](https://github.com/nicklashansen/tdmpc2)
+ [**DreamerV2**](https://arxiv.org/abs/2010.02193) (ICLR, 2021) — Discrete latent representations; human-level Atari. [![Stars](https://img.shields.io/github/stars/danijar/dreamerv2?style=flat&logo=github&color=181717)](https://github.com/danijar/dreamerv2)
+ [**EfficientZero**](https://arxiv.org/abs/2111.00210) (NeurIPS, 2021) — MuZero + self-supervised consistency. [![Stars](https://img.shields.io/github/stars/YeWR/EfficientZero?style=flat&logo=github&color=181717)](https://github.com/YeWR/EfficientZero)
+ [**Dreamer**](https://arxiv.org/abs/1912.01603) (ICLR, 2020) — Latent imagination via RSSM; multi-step backpropagation. [![Stars](https://img.shields.io/github/stars/danijar/dreamer?style=flat&logo=github&color=181717)](https://github.com/danijar/dreamer)
+ [**MuZero**](https://arxiv.org/abs/1911.08265) (Nature, 2020) — Value-aligned dynamics without reconstruction; masters Go, chess, Atari.
+ [**DeepMDP**](https://arxiv.org/abs/1906.02736) (ICML, 2019) — Bellman-aligned latent state abstraction.
+ [**MBPO**](https://arxiv.org/abs/1906.08253) (NeurIPS, 2019) — Model-Based Policy Optimization; short-horizon rollouts + off-policy RL. [![Stars](https://img.shields.io/github/stars/jannerm/mbpo?style=flat&logo=github&color=181717)](https://github.com/jannerm/mbpo)
+ [**PETS**](https://arxiv.org/abs/1805.12114) (NeurIPS, 2018) — Probabilistic Ensemble + Trajectory Sampling. [![Stars](https://img.shields.io/github/stars/kchua/handful-of-trials?style=flat&logo=github&color=181717)](https://github.com/kchua/handful-of-trials)
+ [**World Models**](https://arxiv.org/abs/1803.10122) (NeurIPS, 2018) — VAE + MDN-RNN; influential early architecture. [![Stars](https://img.shields.io/github/stars/hardmaru/WorldModelsExperiments?style=flat&logo=github&color=181717)](https://github.com/hardmaru/WorldModelsExperiments)
+ [**E2C**](https://arxiv.org/abs/1506.07365) (NeurIPS, 2015) — Embed to Control; locally linear latent dynamics from images.
+ [**PILCO**](https://dl.acm.org/doi/10.5555/3104482.3104541) (ICML, 2011) — Gaussian process dynamics for data-efficient policy search. [![Stars](https://img.shields.io/github/stars/UCL-SML/pilco-matlab?style=flat&logo=github&color=181717)](https://github.com/UCL-SML/pilco-matlab)

### Token & Diffusion-Based

+ [**DIAMOND**](https://arxiv.org/abs/2405.12399) (NeurIPS, 2024) — U-Net diffusion transition operator. [![Stars](https://img.shields.io/github/stars/eloialonso/diamond?style=flat&logo=github&color=181717)](https://github.com/eloialonso/diamond)
+ [**Delta-IRIS**](https://arxiv.org/abs/2406.19320) (ICML, 2024) — Delta-based tokenization for world models. [![Stars](https://img.shields.io/github/stars/vmicheli/delta-iris?style=flat&logo=github&color=181717)](https://github.com/vmicheli/delta-iris)
+ [**IRIS**](https://arxiv.org/abs/2209.00588) (ICLR, 2023) — VQ-VAE + Transformer autoregressive world model. [![Stars](https://img.shields.io/github/stars/eloialonso/iris?style=flat&logo=github&color=181717)](https://github.com/eloialonso/iris)
+ [**STORM**](https://arxiv.org/abs/2310.09615) (NeurIPS, 2023) — Stochastic Transformer + VAE world model. [![Stars](https://img.shields.io/github/stars/weipu-zhang/STORM?style=flat&logo=github&color=181717)](https://github.com/weipu-zhang/STORM)
+ [**Latent Diffusion**](https://arxiv.org/abs/2112.10752) (CVPR, 2022) — Diffusion in latent space; high-quality decoding. [![Stars](https://img.shields.io/github/stars/CompVis/latent-diffusion?style=flat&logo=github&color=181717)](https://github.com/CompVis/latent-diffusion)
+ [**TransDreamer**](https://arxiv.org/abs/2202.09481) (arXiv, 2022) — Transformer-XL replacing RSSM. [![Stars](https://img.shields.io/github/stars/changchencc/TransDreamer?style=flat&logo=github&color=181717)](https://github.com/changchencc/TransDreamer)

## L2: Simulator

Systems composing operators into multi-step rollouts satisfying governing laws.

### Physical World

+ [**HWM**](https://arxiv.org/abs/2604.03208) (arXiv, 2026) — Hierarchical latent world model + multi-scale planning. [![Stars](https://img.shields.io/github/stars/kevinghst/HWM_PLDM?style=flat&logo=github&color=181717)](https://github.com/kevinghst/HWM_PLDM)
+ [**BridgeV2W**](https://arxiv.org/abs/2602.03793) (arXiv, 2026) — Action-conditioned embodied video generation.
+ [**Yume**](https://arxiv.org/abs/2507.17744) (arXiv, 2025) — Video diffusion interactive world generation. [![Stars](https://img.shields.io/github/stars/stdstu12/YUME?style=flat&logo=github&color=181717)](https://github.com/stdstu12/YUME)
+ [**RoboScape**](https://arxiv.org/abs/2506.23135) (arXiv, 2025) — Physics-informed robotic video world model. [![Stars](https://img.shields.io/github/stars/tsinghua-fib-lab/RoboScape?style=flat&logo=github&color=181717)](https://github.com/tsinghua-fib-lab/RoboScape)
+ [**PIN-WM**](https://arxiv.org/abs/2504.16693) (arXiv, 2025) — Differentiable rigid-body physics + 3DGS. [![Stars](https://img.shields.io/github/stars/XuAdventurer/PIN-WM?style=flat&logo=github&color=181717)](https://github.com/XuAdventurer/PIN-WM)
+ [**GAIA-2**](https://arxiv.org/abs/2503.20523) (arXiv, 2025) — Latent diffusion multi-view AD generation.
+ [**Aether**](https://arxiv.org/abs/2503.18945) (arXiv, 2025) — CogVideoX geometry-aware fine-tune. [![Stars](https://img.shields.io/github/stars/OpenRobotLab/Aether?style=flat&logo=github&color=181717)](https://github.com/OpenRobotLab/Aether)
+ [**Cosmos**](https://arxiv.org/abs/2501.03575) (arXiv, 2025) — NVIDIA autoregressive + diffusion hybrid. [![Stars](https://img.shields.io/github/stars/NVIDIA/Cosmos?style=flat&logo=github&color=181717)](https://github.com/NVIDIA/Cosmos)
+ [**LWM**](https://arxiv.org/abs/2402.08268) (ICLR, 2025) — RingAttention long-context LLM world model. [![Stars](https://img.shields.io/github/stars/LargeWorldModel/LWM?style=flat&logo=github&color=181717)](https://github.com/LargeWorldModel/LWM)
+ [**DreamerV3**](https://arxiv.org/abs/2301.04104) (Nature, 2025) — RSSM + symlog loss for generalist long-horizon rollout. [![Stars](https://img.shields.io/github/stars/danijar/dreamerv3?style=flat&logo=github&color=181717)](https://github.com/danijar/dreamerv3)
+ [**DreMa**](https://arxiv.org/abs/2412.14957) (arXiv, 2024) — Compositional 3DGS digital twins for manipulation. [![Stars](https://img.shields.io/github/stars/leobarcellona/drema_code?style=flat&logo=github&color=181717)](https://github.com/leobarcellona/drema_code)
+ [**Vista**](https://arxiv.org/abs/2405.17398) (NeurIPS, 2024) — Diffusion driving world model. [![Stars](https://img.shields.io/github/stars/OpenDriveLab/Vista?style=flat&logo=github&color=181717)](https://github.com/OpenDriveLab/Vista)
+ [**iVideoGPT**](https://arxiv.org/abs/2405.15223) (NeurIPS, 2024) — Transformer + VQ-VAE interactive prediction. [![Stars](https://img.shields.io/github/stars/thuml/iVideoGPT?style=flat&logo=github&color=181717)](https://github.com/thuml/iVideoGPT)
+ [**DIAMOND**](https://arxiv.org/abs/2405.12399) (NeurIPS, 2024) — U-Net diffusion as Atari simulator. [![Stars](https://img.shields.io/github/stars/eloialonso/diamond?style=flat&logo=github&color=181717)](https://github.com/eloialonso/diamond)
+ [**Sora**](https://openai.com/index/video-generation-models-as-world-simulators/) (OpenAI, 2024) — DiT video diffusion world simulator.
+ [**VideoPoet**](https://proceedings.mlr.press/v235/kondratyuk24a.html) (ICML, 2024) — LLM multimodal video tokenizer.
+ [**Genie**](https://arxiv.org/abs/2402.15391) (ICML, 2024) — Latent action discovery; generative interactive environment.
+ [**OccWorld**](https://arxiv.org/abs/2311.16038) (arXiv, 2024) — GPT 3D occupancy prediction for AD. [![Stars](https://img.shields.io/github/stars/wzzheng/OccWorld?style=flat&logo=github&color=181717)](https://github.com/wzzheng/OccWorld)
+ [**Copilot4D**](https://arxiv.org/abs/2311.01017) (ICLR, 2024) — VQ-VAE + discrete point diffusion.
+ [**DriveDreamer**](https://arxiv.org/abs/2309.09777) (ECCV, 2024) — Diffusion AD generation. [![Stars](https://img.shields.io/github/stars/JeffWang987/DriveDreamer?style=flat&logo=github&color=181717)](https://github.com/JeffWang987/DriveDreamer)
+ [**Lumiere**](https://doi.org/10.1145/3680528.3687614) (SIGGRAPH, 2024) — Space-time U-Net diffusion.
+ [**GAIA-1**](https://arxiv.org/abs/2309.17080) (arXiv, 2023) — Transformer video generation for AD.
+ [**DayDreamer**](https://arxiv.org/abs/2206.14176) (CoRL, 2023) — RSSM on real-world robots. [![Stars](https://img.shields.io/github/stars/danijar/daydreamer?style=flat&logo=github&color=181717)](https://github.com/danijar/daydreamer)
+ [**Diffuser**](https://arxiv.org/abs/2205.09991) (ICML, 2022) — Diffusion trajectory planning. [![Stars](https://img.shields.io/github/stars/jannerm/diffuser?style=flat&logo=github&color=181717)](https://github.com/jannerm/diffuser)
+ [**DreamingV2**](https://arxiv.org/abs/2203.00494) (arXiv, 2022) — DreamerV2 + reconstruction-free objective.
+ [**DreamerPro**](https://arxiv.org/abs/2110.14565) (ICML, 2022) — RSSM + prototypical representations. [![Stars](https://img.shields.io/github/stars/fdeng18/dreamer-pro?style=flat&logo=github&color=181717)](https://github.com/fdeng18/dreamer-pro)
+ [**PathDreamer**](https://arxiv.org/abs/2105.08756) (ICCV, 2021) — Autoregressive visual world model for VLN. [![Stars](https://img.shields.io/github/stars/google-research/pathdreamer?style=flat&logo=github&color=181717)](https://github.com/google-research/pathdreamer)
+ [**Plan2Explore**](https://arxiv.org/abs/2005.05960) (ICML, 2020) — Dreamer + self-supervised exploration. [![Stars](https://img.shields.io/github/stars/ramanans1/plan2explore?style=flat&logo=github&color=181717)](https://github.com/ramanans1/plan2explore)
+ [**MuZero**](https://arxiv.org/abs/1911.08265) (Nature, 2020) — Value-aligned dynamics with MCTS for long-horizon planning.

### Digital World

+ [**Code2World**](https://arxiv.org/abs/2602.09856) (arXiv, 2026) — VLM code rendering as environment. [![Stars](https://img.shields.io/github/stars/AMAP-ML/Code2World?style=flat&logo=github&color=181717)](https://github.com/AMAP-ML/Code2World)
+ [**RWML**](https://arxiv.org/abs/2602.05842) (arXiv, 2026) — LLM + RL sim-to-real alignment.
+ [**gWorld**](https://arxiv.org/abs/2602.01576) (arXiv, 2026) — VLM code rendering for web simulation. [![Stars](https://img.shields.io/github/stars/trillion-labs/gWorld?style=flat&logo=github&color=181717)](https://github.com/trillion-labs/gWorld)
+ [**WebWorld**](https://arxiv.org/abs/2602.14721) (arXiv, 2026) — Fine-tuned VLM web simulator.
+ [**MobileDreamer**](https://arxiv.org/abs/2601.04035) (arXiv, 2026) — LLM GUI sketch prediction.
+ [**Word2World**](https://arxiv.org/abs/2512.18832) (arXiv, 2025) — LLM text-based world model evaluation. [![Stars](https://img.shields.io/github/stars/X1AOX1A/Word2World?style=flat&logo=github&color=181717)](https://github.com/X1AOX1A/Word2World)
+ [**NeuralOS**](https://arxiv.org/abs/2507.08800) (arXiv, 2025) — RNN + pixel diffusion for desktop GUI. [![Stars](https://img.shields.io/github/stars/yuntian-group/neural-os?style=flat&logo=github&color=181717)](https://github.com/yuntian-group/neural-os)
+ [**WebSynthesis**](https://arxiv.org/abs/2507.04370) (arXiv, 2025) — LLM + MCTS trajectory synthesis. [![Stars](https://img.shields.io/github/stars/LucusFigoGao/WebSynthesis?style=flat&logo=github&color=181717)](https://github.com/LucusFigoGao/WebSynthesis)
+ [**GameCraft**](https://arxiv.org/abs/2506.17201) (arXiv, 2025) — Diffusion game video generation. [![Stars](https://img.shields.io/github/stars/Tencent-Hunyuan/Hunyuan-GameCraft-1.0?style=flat&logo=github&color=181717)](https://github.com/Tencent-Hunyuan/Hunyuan-GameCraft-1.0)
+ [**GameFactory**](https://arxiv.org/abs/2501.08325) (ICCV, 2025) — Action-controlled interactive game video generation. [![Stars](https://img.shields.io/github/stars/KwaiVGI/GameFactory?style=flat&logo=github&color=181717)](https://github.com/KwaiVGI/GameFactory)
+ [**WebDreamer**](https://arxiv.org/abs/2411.06559) (TMLR, 2025) — LLM web state simulation + tree search. [![Stars](https://img.shields.io/github/stars/OSU-NLP-Group/WebDreamer?style=flat&logo=github&color=181717)](https://github.com/OSU-NLP-Group/WebDreamer)
+ [**WMA**](https://arxiv.org/abs/2410.13232) (ICLR, 2025) — LLM web transition prediction. [![Stars](https://img.shields.io/github/stars/kyle8581/WMA-Agents?style=flat&logo=github&color=181717)](https://github.com/kyle8581/WMA-Agents)
+ [**GameGen-X**](https://arxiv.org/abs/2411.00769) (ICLR, 2025) — interactive open-world game video world model. [![Stars](https://img.shields.io/github/stars/GameGen-X/GameGen-X?style=flat&logo=github&color=181717)](https://github.com/GameGen-X/GameGen-X)
+ [**GameNGen**](https://arxiv.org/abs/2408.14837) (ICLR, 2025) — U-Net diffusion runs DOOM at 20 FPS.
+ [**CodeWM**](https://arxiv.org/abs/2405.15383) (arXiv, 2024) — LLM + MCTS code world model generation. [![Stars](https://img.shields.io/github/stars/nicoladainese96/code-world-models?style=flat&logo=github&color=181717)](https://github.com/nicoladainese96/code-world-models)
+ [**WorldCoder**](https://arxiv.org/abs/2402.12275) (NeurIPS, 2024) — LLM incremental code synthesis world model.
+ [**GameGAN**](https://arxiv.org/abs/2005.12126) (CVPR, 2020) — GAN neural game engine from gameplay videos. [![Stars](https://img.shields.io/github/stars/nv-tlabs/GameGAN_code?style=flat&logo=github&color=181717)](https://github.com/nv-tlabs/GameGAN_code)

### Social World

+ [**PolicySim**](https://arxiv.org/abs/2603.19649) (arXiv, 2026) — LLM platform policy sandbox. [![Stars](https://img.shields.io/github/stars/renH2/PolicySim?style=flat&logo=github&color=181717)](https://github.com/renH2/PolicySim)
+ [**AIvilization**](https://arxiv.org/abs/2602.10429) (arXiv, 2026) — Large-scale sandbox economy simulation.
+ [**MASim**](https://arxiv.org/abs/2512.07195) (arXiv, 2025) — Multilingual agent social simulation.
+ [**SWM-AP**](https://arxiv.org/abs/2510.19270) (arXiv, 2025) — Social world model for mechanism design.
+ [**OASIS**](https://arxiv.org/abs/2411.11581) (arXiv, 2024) — 1M-agent social simulation at scale. [![Stars](https://img.shields.io/github/stars/camel-ai/oasis?style=flat&logo=github&color=181717)](https://github.com/camel-ai/oasis)
+ [**Project Sid**](https://arxiv.org/abs/2411.00114) (arXiv, 2024) — 1000 LLM agents with emergent civilization. [![Stars](https://img.shields.io/github/stars/altera-al/project-sid?style=flat&logo=github&color=181717)](https://github.com/altera-al/project-sid)
+ [**Werewolf**](https://arxiv.org/abs/2310.18940) (arXiv, 2024) — LLM + RL strategic deception. [![Stars](https://img.shields.io/github/stars/xuyuzhuang11/Werewolf?style=flat&logo=github&color=181717)](https://github.com/xuyuzhuang11/Werewolf)
+ [**Sotopia**](https://arxiv.org/abs/2310.11667) (ICLR, 2024) — LLM social evaluation framework. [![Stars](https://img.shields.io/github/stars/sotopia-lab/sotopia?style=flat&logo=github&color=181717)](https://github.com/sotopia-lab/sotopia)
+ [**AvalonBench**](https://arxiv.org/abs/2310.05036) (NeurIPS, 2023) — LLM deductive social reasoning. [![Stars](https://img.shields.io/github/stars/jonathanmli/Avalon-LLM?style=flat&logo=github&color=181717)](https://github.com/jonathanmli/Avalon-LLM)
+ [**Generative Agents**](https://arxiv.org/abs/2304.03442) (UIST, 2023) — LLM reflective memory stream in Smallville. [![Stars](https://img.shields.io/github/stars/joonspk-research/generative_agents?style=flat&logo=github&color=181717)](https://github.com/joonspk-research/generative_agents)
+ [**CICERO**](https://doi.org/10.1126/science.ade9097) (Science, 2022) — LLM + strategic planning for human-level Diplomacy. [![Stars](https://img.shields.io/github/stars/facebookresearch/diplomacy_cicero?style=flat&logo=github&color=181717)](https://github.com/facebookresearch/diplomacy_cicero)
+ [**Social Simulacra**](https://dl.acm.org/doi/10.1145/3526113.3545616) (UIST, 2022) — GPT prompt-chain community simulation.
+ [**Deal or No Deal**](https://arxiv.org/abs/1706.05125) (EMNLP, 2017) — RNN + RL self-play negotiation. [![Stars](https://img.shields.io/github/stars/facebookresearch/end-to-end-negotiator?style=flat&logo=github&color=181717)](https://github.com/facebookresearch/end-to-end-negotiator)

### Scientific World

+ [**Lingshu-Cell**](https://arxiv.org/abs/2603.25240) (arXiv, 2026) — Masked discrete diffusion cellular world model.
+ [**Aurora**](https://arxiv.org/abs/2405.13063) (arXiv, 2025) — 3D Swin Earth system foundation model. [![Stars](https://img.shields.io/github/stars/microsoft/aurora?style=flat&logo=github&color=181717)](https://github.com/microsoft/aurora)
+ [**GenCast**](https://arxiv.org/abs/2312.15796) (Nature, 2025) — Spherical ensemble diffusion forecasting. [![Stars](https://img.shields.io/github/stars/google-deepmind/graphcast?style=flat&logo=github&color=181717)](https://github.com/google-deepmind/graphcast)
+ [**NeuralGCM**](https://arxiv.org/abs/2311.07222) (Nature, 2024) — Hybrid physics-NN general circulation model. [![Stars](https://img.shields.io/github/stars/google-research/neuralgcm?style=flat&logo=github&color=181717)](https://github.com/google-research/neuralgcm)
+ [**BAX**](https://www.nature.com/articles/s41524-024-01326-2) (npj Computational Materials, 2024) — Bayesian algorithm execution for targeted materials discovery. [![Stars](https://img.shields.io/github/stars/sathya-chitturi/multibax-sklearn?style=flat&logo=github&color=181717)](https://github.com/sathya-chitturi/multibax-sklearn)
+ [**GraphCast**](https://arxiv.org/abs/2212.12794) (Science, 2023) — GNN autoregressive weather in under 1 minute. [![Stars](https://img.shields.io/github/stars/google-deepmind/graphcast?style=flat&logo=github&color=181717)](https://github.com/google-deepmind/graphcast)
+ [**ClimaX**](https://arxiv.org/abs/2301.10343) (ICML, 2023) — ViT climate foundation model. [![Stars](https://img.shields.io/github/stars/microsoft/ClimaX?style=flat&logo=github&color=181717)](https://github.com/microsoft/ClimaX)
+ [**Pangu-Weather**](https://arxiv.org/abs/2211.02556) (Nature, 2023) — 3D Earth Transformer weather forecasting. [![Stars](https://img.shields.io/github/stars/198808xc/Pangu-Weather?style=flat&logo=github&color=181717)](https://github.com/198808xc/Pangu-Weather)
+ [**FNO**](https://arxiv.org/abs/2010.08895) (ICLR, 2021) — Fourier Neural Operator; 1000x speedup for PDEs. [![Stars](https://img.shields.io/github/stars/neuraloperator/neuraloperator?style=flat&logo=github&color=181717)](https://github.com/neuraloperator/neuraloperator)
+ [**GNS**](https://arxiv.org/abs/2002.09405) (ICML, 2020) — Graph Network Simulator; learned particle dynamics. [![Stars](https://img.shields.io/github/stars/deepmind/deepmind-research?style=flat&logo=github&color=181717)](https://github.com/deepmind/deepmind-research)
+ [**ChemBO**](https://proceedings.mlr.press/v108/korovina20a.html) (AISTATS, 2020) — Bayesian optimization for synthesizable small molecules. [![Stars](https://img.shields.io/github/stars/kamikaze0923/ChemBo?style=flat&logo=github&color=181717)](https://github.com/kamikaze0923/ChemBo)
+ [**P3BO**](https://proceedings.mlr.press/v119/angermueller20a.html) (ICML, 2020) — Population-based black-box optimization for biological sequence design.

## L3: Evolver

Systems closing the **design → execute → observe → reflect** loop to autonomously revise their models.

### Physical World

+ [**Self-Modeling**](https://arxiv.org/abs/2207.03386) (npj Robotics, 2025) — Robot detects morphology changes and retrains kinematic model. [![Stars](https://img.shields.io/github/stars/H-Y-H-Y-H/Egocentric_VSM?style=flat&logo=github&color=181717)](https://github.com/H-Y-H-Y-H/Egocentric_VSM)
+ [**AdaptSim**](https://arxiv.org/abs/2302.04903) (CoRL, 2023) — Sim-parameter adaptation via Bayesian optimization. [![Stars](https://img.shields.io/github/stars/irom-princeton/AdaptSim?style=flat&logo=github&color=181717)](https://github.com/irom-princeton/AdaptSim)

### Digital World

+ [**AUI**](https://arxiv.org/abs/2511.15567) (arXiv, 2025) — VLM + adaptive UI grounding. [![Stars](https://img.shields.io/github/stars/showlab/AUI?style=flat&logo=github&color=181717)](https://github.com/showlab/AUI)
+ [**AlphaEvolve**](https://arxiv.org/abs/2506.13131) (DeepMind, 2025) — LLM + evolutionary coding agent for algorithm discovery. [![Stars](https://img.shields.io/github/stars/google-deepmind/alphaevolve_results?style=flat&logo=github&color=181717)](https://github.com/google-deepmind/alphaevolve_results)
+ [**SWE-agent**](https://arxiv.org/abs/2405.15793) (arXiv, 2024) — LLM + shell interface with regression gates. [![Stars](https://img.shields.io/github/stars/princeton-nlp/SWE-agent?style=flat&logo=github&color=181717)](https://github.com/princeton-nlp/SWE-agent)
+ [**CodeIt**](https://arxiv.org/abs/2402.04858) (ICML, 2024) — LLM code generation + self-play fine-tuning. [![Stars](https://img.shields.io/github/stars/Qualcomm-AI-research/codeit?style=flat&logo=github&color=181717)](https://github.com/Qualcomm-AI-research/codeit)
+ [**FunSearch**](https://doi.org/10.1038/s41586-023-06924-6) (Nature, 2024) — LLM + evolutionary search discovers math algorithms. [![Stars](https://img.shields.io/github/stars/google-deepmind/funsearch?style=flat&logo=github&color=181717)](https://github.com/google-deepmind/funsearch)

### Social World

+ [**Evolving Constitutions**](https://arxiv.org/abs/2602.00755) (arXiv, 2026) — LLM constitution revision via genetic programming.
+ [**AgentSociety**](https://arxiv.org/abs/2502.08691) (arXiv, 2025) — LLM multi-agent simulation with behavioral drift tracking. [![Stars](https://img.shields.io/github/stars/tsinghua-fib-lab/AgentSociety?style=flat&logo=github&color=181717)](https://github.com/tsinghua-fib-lab/AgentSociety)

### Scientific World

+ [**BioLab**](https://doi.org/10.1101/2025.09.03.674085) (bioRxiv, 2025) — Autonomous biological laboratory agent.
+ [**OriGene**](https://doi.org/10.1101/2025.06.03.657658) (bioRxiv, 2025) — Self-evolving virtual disease biologist for therapeutic target discovery. [![Stars](https://img.shields.io/github/stars/GENTEL-lab/OriGene?style=flat&logo=github&color=181717)](https://github.com/GENTEL-lab/OriGene)
+ [**Biomni**](https://doi.org/10.1101/2025.05.30.656746) (bioRxiv, 2025) — Foundation model for biological experimentation. [![Stars](https://img.shields.io/github/stars/snap-stanford/Biomni?style=flat&logo=github&color=181717)](https://github.com/snap-stanford/Biomni)
+ [**AI Scientist v2**](https://arxiv.org/abs/2504.08066) (arXiv, 2025) — Agentic tree search for workshop-level discovery. [![Stars](https://img.shields.io/github/stars/SakanaAI/AI-Scientist-v2?style=flat&logo=github&color=181717)](https://github.com/SakanaAI/AI-Scientist-v2)
+ [**Co-Scientist**](https://arxiv.org/abs/2502.18864) (arXiv, 2025) — Multi-agent tournament for biomedical hypothesis generation.
+ [**MOOSE-Chem2**](https://arxiv.org/abs/2505.19209) (NeurIPS, 2025) — Hierarchical hypothesis search for chemistry. [![Stars](https://img.shields.io/github/stars/ZonglinY/MOOSE-Chem2?style=flat&logo=github&color=181717)](https://github.com/ZonglinY/MOOSE-Chem2)
+ [**MOOSE-Chem**](https://arxiv.org/abs/2410.07076) (ICLR, 2025) — Rediscovered chemistry hypotheses from pre-2024 data. [![Stars](https://img.shields.io/github/stars/ZonglinY/MOOSE-Chem?style=flat&logo=github&color=181717)](https://github.com/ZonglinY/MOOSE-Chem)
+ [**AI Scientist**](https://arxiv.org/abs/2408.06292) (arXiv, 2024) — Full-paper generation + peer review loop. [![Stars](https://img.shields.io/github/stars/SakanaAI/AI-Scientist?style=flat&logo=github&color=181717)](https://github.com/SakanaAI/AI-Scientist)
+ [**SDL Lasers**](https://doi.org/10.1126/science.adk9227) (Science, 2024) — Multi-site self-driving lab for organic lasers. [![Stars](https://img.shields.io/github/stars/aspuru-guzik-group/acdc_laser?style=flat&logo=github&color=181717)](https://github.com/aspuru-guzik-group/acdc_laser)
+ [**A-Lab**](https://doi.org/10.1038/s41586-023-06734-w) (Nature, 2023) — Autonomous robotic lab; 41 novel compounds in 17 days.
+ [**BacterAI**](https://doi.org/10.1038/s41564-023-01376-0) (Nature Microbiology, 2023) — Zero-knowledge iterative amino acid requirement mapping. [![Stars](https://img.shields.io/github/stars/jensenlab/BacterAI?style=flat&logo=github&color=181717)](https://github.com/jensenlab/BacterAI)
+ [**CAMEO**](https://arxiv.org/abs/2006.06141) (Nature Comms, 2020) — Bayesian active learning at synchrotron beamline. [![Stars](https://img.shields.io/github/stars/KusneNIST/CAMEO_NComm?style=flat&logo=github&color=181717)](https://github.com/KusneNIST/CAMEO_NComm)
+ [**Yeast Cycles**](https://doi.org/10.1073/pnas.1900548116) (PNAS, 2019) — Closed-loop experiment design for yeast metabolism.
+ [**Robot Scientist**](https://doi.org/10.1186/1759-4499-2-1) (Automated Experimentation, 2010) — Robot scientist framework for autonomous scientific discovery.

## Benchmarks & Evaluation

### Physical

+ [**RoboCasa**](https://arxiv.org/abs/2406.02523) (arXiv, 2024) — 100+ kitchen task completion. [![Stars](https://img.shields.io/github/stars/robocasa/robocasa?style=flat&logo=github&color=181717)](https://github.com/robocasa/robocasa)
+ [**CALVIN**](https://arxiv.org/abs/2112.03227) (arXiv, 2021) — Multi-step language-conditioned manipulation. [![Stars](https://img.shields.io/github/stars/mees/calvin?style=flat&logo=github&color=181717)](https://github.com/mees/calvin)
+ [**Meta-World**](https://arxiv.org/abs/1910.10897) (CoRL, 2019) — Success rate over 50 manipulation tasks. [![Stars](https://img.shields.io/github/stars/Farama-Foundation/Metaworld?style=flat&logo=github&color=181717)](https://github.com/Farama-Foundation/Metaworld)
+ [**nuScenes**](https://arxiv.org/abs/1903.11027) (CVPR, 2019) — 3D detection and tracking; mAP, NDS. [![Stars](https://img.shields.io/github/stars/nutonomy/nuscenes-devkit?style=flat&logo=github&color=181717)](https://github.com/nutonomy/nuscenes-devkit)
+ [**Atari 100k**](https://arxiv.org/abs/1903.00374) (arXiv, 2019) — Human-normalized score; 26 games, 100k steps.

### Digital

+ [**GameWorld**](https://arxiv.org/abs/2604.07429) (arXiv, 2026) — Standardized multimodal game-agent evaluation. [![Stars](https://img.shields.io/github/stars/gameworld-project/gameworld?style=flat&logo=github&color=181717)](https://github.com/gameworld-project/gameworld) [![Homepage](https://img.shields.io/badge/Homepage-Online-1f6feb?logo=googlechrome&logoColor=white)](https://gameworld-project.github.io/)
+ [**OSWorld**](https://arxiv.org/abs/2404.07972) (arXiv, 2024) — Desktop OS task success. [![Stars](https://img.shields.io/github/stars/xlang-ai/OSWorld?style=flat&logo=github&color=181717)](https://github.com/xlang-ai/OSWorld)
+ [**SWE-bench**](https://arxiv.org/abs/2310.06770) (ICLR, 2024) — Multi-file patch resolved rate. [![Stars](https://img.shields.io/github/stars/princeton-nlp/SWE-bench?style=flat&logo=github&color=181717)](https://github.com/princeton-nlp/SWE-bench)
+ [**WebArena**](https://arxiv.org/abs/2307.13854) (ICLR, 2024) — 812 web task success rate. [![Stars](https://img.shields.io/github/stars/web-arena-x/webarena?style=flat&logo=github&color=181717)](https://github.com/web-arena-x/webarena)

### Social

+ [**Sotopia**](https://arxiv.org/abs/2310.11667) (ICLR, 2024) — 7-dimensional social score. [![Stars](https://img.shields.io/github/stars/sotopia-lab/sotopia?style=flat&logo=github&color=181717)](https://github.com/sotopia-lab/sotopia)
+ [**Hi-ToM**](https://arxiv.org/abs/2310.16755) (arXiv, 2023) — Higher-order theory of mind. [![Stars](https://img.shields.io/github/stars/ying-hui-he/Hi-ToM_dataset?style=flat&logo=github&color=181717)](https://github.com/ying-hui-he/Hi-ToM_dataset)
+ [**FANToM**](https://arxiv.org/abs/2310.15421) (arXiv, 2023) — Conversational false-belief accuracy. [![Stars](https://img.shields.io/github/stars/skywalker023/fantom?style=flat&logo=github&color=181717)](https://github.com/skywalker023/fantom)

### Scientific

+ [**DiscoveryBench**](https://arxiv.org/abs/2407.01725) (NeurIPS, 2024) — Evidence-based hypothesis accuracy. [![Stars](https://img.shields.io/github/stars/allenai/discoverybench?style=flat&logo=github&color=181717)](https://github.com/allenai/discoverybench)
+ [**Minecraft (MCU)**](https://arxiv.org/abs/2310.08367) (arXiv, 2023) — Open-world tech-tree completion. [![Stars](https://img.shields.io/github/stars/CraftJarvis/MCU?style=flat&logo=github&color=181717)](https://github.com/CraftJarvis/MCU)
+ [**ScienceWorld**](https://arxiv.org/abs/2203.07540) (EMNLP, 2022) — 30 elementary science experiments. [![Stars](https://img.shields.io/github/stars/allenai/ScienceWorld?style=flat&logo=github&color=181717)](https://github.com/allenai/ScienceWorld)

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

**We welcome contributions!** This project is actively maintained. If you know a paper or benchmark that should be listed, open an issue with the link and target section.

### Automatic Paper Agent

Papers and benchmarks share the **same** submission flow: open an issue containing an `awwm-paper` block. AI agents can use the repository skill at `skills/add-paper/SKILL.md` to generate it. For plain arXiv-link submissions, include lines such as `Section: L2` and `Subsection: Digital`; the workflow cannot infer taxonomy placement from the URL alone.

```awwm-paper
{
  "section": "L2",
  "subsection": "Digital",
  "title": "Paper title",
  "paper_url": "https://arxiv.org/abs/2601.00001",
  "venue": "arXiv",
  "year": 2026,
  "summary": "Concise contribution phrase.",
  "code_url": "https://github.com/org/repo",
  "homepage_url": "https://project-name.github.io/"
}
```

For a benchmark, set `"section": "Benchmark"` and choose the regime as the subsection (`Physical` / `Digital` / `Social` / `Scientific`). Everything else stays the same.

The GitHub Action parses the block, inserts the entry in reverse chronological order under the right section, and opens a PR for maintainer review. `code_url` (rendered as a live GitHub-stars badge when on github.com) and `homepage_url` (rendered as a Homepage badge) are optional. Valid section / subsection pairs:

- **`L1` — Predictor** · subsections `Representation`, `Model-Based-RL`, `Token-Diffusion`.
- **`L2` — Simulator** · subsections `Physical`, `Digital`, `Social`, `Scientific`.
- **`L3` — Evolver** · subsections `Physical`, `Digital`, `Social`, `Scientific`.
- **`Benchmark`** · subsections `Physical`, `Digital`, `Social`, `Scientific`.

The legacy combined form (`"section": "L2-Digital"`, no subsection) is still accepted but should not be used for new submissions. You can also submit a traditional PR if you prefer.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=matrix-agent/awesome-agentic-world-modeling&type=Date)](https://www.star-history.com/#matrix-agent/awesome-agentic-world-modeling&Date)
