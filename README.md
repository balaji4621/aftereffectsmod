<div align="center">

# <img src="https://img.shields.io/badge/ANTIGRAVITY-ENGINE-purple?style=for-the-badge&logo=aftereffects&logoColor=white" alt="Antigravity"/>
<img src="https://img.shields.io/badge/ENTERPRISE-VIDEO-AUTOMATION-ff0040?style=for-the-badge" alt="EVA"/>

### **Autonomous AI-Powered Video Production Engine**

*React Remotion · Adobe After Effects 2025 · DSP Audio Analysis · Futuristic AI Modules*

---

![Status](https://img.shields.io/badge/STATUS-PRODUCTION-green?style=flat-square)
![Version](https://img.shields.io/badge/VERSION-1.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/LICENSE-PROPRIETARY-red?style=flat-square)
![Pipeline](https://img.shields.io/badge/DAG-PIPELINE-active-orange?style=flat-square)

</div>

---

## <img src="https://img.shields.io/badge/INDEX-000-yellow" /> Overview

Antigravity is a **self-driving video production engine** that ingests raw media assets, applies AI-driven cinematic analysis, and renders broadcast-quality video through either **Remotion (React WebGL)** or **Adobe After Effects 2025 (headless ExtendScript)** — all from a single CLI command.

It replaces the need for manual editing by automating the entire post-production pipeline: **asset discovery → audio DSP → AI style planning → motion parity rendering → QA verification → export**.

---

## <img src="https://img.shields.io/badge/INDEX-001-yellow" /> Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ANTIGRAVITY PIPELINE                                │
│                                                                             │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │  INGEST  │──▶│   DSP    │──▶│AI STYLE  │──▶│  RENDER  │──▶│   QA    │ │
│  │  & HASH  │   │ ANALYSIS │   │ PLANNER  │   │  ENGINE  │   │  GATE   │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│       │              │              │              │              │         │
│  ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐    │
│  │manifest │   │ audio-  │   │ style_  │   │ AE/     │   │ SSIM ≥  │    │
│  │  .json  │   │features │   │ plan    │   │ Remotion│   │ 0.95    │    │
│  │         │   │  .json  │   │  .json  │   │         │   │ ΔE ≤ 2.0│    │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    WEB UI DASHBOARD (server.py)                     │   │
│  │              http://localhost:8000                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## <img src="https://img.shields.io/badge/INDEX-002-yellow" /> Features

<table>
<tr>
<td width="50%">

### <img src="https://img.shields.io/badge/AI-INTELLIGENCE-cyan" />
- **Optical Flow** motion vector analysis
- **Depth Map** synthetic scene understanding
- **Subject Matting** foreground segmentation
- **Style Planner** AI scene classification (CLIP/ViT)
- **Audio DSP** multi-band spectral flux analysis
- **Word-Level** forced alignment subtitles

</td>
<td width="50%">

### <img src="https://img.shields.io/badge/RENDERING-ENGINE-purple" />
- **Remotion 4.0** React WebGL renderer
- **After Effects 2025** headless automation
- **Dual-Engine** cubic Bézier motion parity
- **LUT Engine** 3D color lookup + trilinear sampling
- **Film Overlays** grain, vignette, chromatic aberration
- **Beat-Synced** camera & audio-reactive motion

</td>
</tr>
</table>

---

## <img src="https://img.shields.io/badge/INDEX-003-yellow" /> Quick Start

### Prerequisites
```
Node.js 18+    ·    Python 3.11+    ·    Adobe After Effects 2025 (optional)
```

### 1 — Ingest Assets & Run DSP Analysis
```bash
npm run ingest
# Generates: manifest.json, audio-features.json, subtitles.json
```

### 2 — Render
```bash
# Option A: Remotion (React WebGL — cross-platform)
npm run render:remotion

# Option B: After Effects (Windows — requires AE 2025)
npm run render:ae
```

### 3 — Launch Web Dashboard
```bash
python server.py
# Open: http://localhost:8000
```

---

## <img src="https://img.shields.io/badge/INDEX-004-yellow" /> Project Structure

```
antigravity/
│
├── 📁 src/                          ◀ SOURCE CODE
│   ├── components/                   ◀ 20+ React video components
│   │   ├── BeatSyncedCamera.tsx      ◀ Audio-reactive 3D camera
│   │   ├── CaptionsLayer.tsx         ◀ Karaoke-style word highlights
│   │   ├── ChromaticAberration.tsx   ◀ RGB channel splitting
│   │   ├── FilmGrain.tsx             ◀ Procedural noise grain
│   │   ├── GlowShaderPass.tsx        ◀ Bloom post-processing
│   │   ├── LensFlarePass.tsx         ◀ Anamorphic lens flare
│   │   ├── LowerThird.tsx            ◀ Animated lower thirds
│   │   ├── ParticleEmitter.tsx       ◀ Configurable particle system
│   │   ├── TextReveal.tsx            ◀ Staggered text animation
│   │   ├── Vignette.tsx              ◀ Edge darkening overlay
│   │   └── ...                       ◀ 10+ more components
│   │
│   ├── engine/                       ◀ Python AI engine
│   │   ├── futuristic_ai.py          ◀ Optical flow + depth + matting
│   │   ├── qa_gate.py                ◀ SSIM/ΔE verification
│   │   ├── render_backends.py        ◀ AE / FFmpeg / Blender
│   │   ├── style_planner.py          ◀ CLIP scene classification
│   │   ├── stage_runner.py           ◀ DAG orchestrator
│   │   ├── manifest.py               ◀ SHA-256 state ledger
│   │   ├── watchdog.py               ◀ Process timeout guard
│   │   ├── profiler.py               ◀ Performance benchmarks
│   │   └── benchmark.py              ◀ Render quality scoring
│   │
│   ├── utils/                        ◀ TypeScript utilities
│   │   ├── math.ts                   ◀ lerp, clamp, mapRange
│   │   ├── easing.ts                 ◀ 12 easing functions
│   │   ├── interpolation.ts          ◀ Keyframe engine
│   │   ├── noise.ts                  ◀ Perlin noise generator
│   │   ├── colorUtils.ts             ◀ RGB/HSV/HEX conversion
│   │   ├── timeUtils.ts              ◀ Timecode ↔ frames
│   │   ├── motion.ts                 ◀ Bézier vector normalization
│   │   ├── lutEngine.ts              ◀ 3D LUT parser
│   │   ├── colorTransfer.ts          ◀ Color palette matching
│   │   └── ...                       ◀ 5+ more utilities
│   │
│   ├── schemas/                      ◀ Zod validation schemas
│   ├── generated/                    ◀ Offline DSP output manifests
│   ├── types/                        ◀ TypeScript type definitions
│   └── index.ts                      ◀ Entry point
│
├── 📁 scripts/                       ◀ CLI TOOLS
│   ├── discover-assets.mjs           ◀ Asset scanner + proxy gen
│   ├── analyze-audio.mjs             ◀ Spectral flux analyzer
│   ├── extract-subtitles.mjs         ◀ Word-level subtitles
│   ├── export-preset.mjs             ◀ AE preset exporter
│   ├── build-timeline-segments.mjs   ◀ Timeline generator
│   ├── generate-ai-template.mjs      ◀ AI template creator
│   └── ae_helpers/bezier.jsx         ◀ ExtendScript Bézier math
│
├── 📁 framework/                     ◀ PYTHON FRAMEWORK
│   ├── reference_analyzer.py         ◀ Reference video analysis
│   ├── shotlist_generator.py         ◀ Shot list automation
│   └── asset_mapper.py              ◀ Asset → timeline mapping
│
├── 📁 ae_presets/                    ◀ AFTER EFFECTS PRESETS
│   ├── masterpiece.json              ◀ Masterpiece style config
│   └── phonk.json                    ◀ Phonk aesthetic config
│
├── 📁 web/                           ◀ WEB UI DASHBOARD
│   └── index.html                    ◀ Live preview + log console
│
├── build_ae_master.jsx               ◀ Unified AE build script
├── server.py                         ◀ Local web server (port 8000)
├── run_sss_pipeline.py               ◀ Master DAG pipeline runner
├── run_master_pipeline.py            ◀ Pipeline orchestrator
└── package.json                      ◀ Dependencies + CLI scripts
```

---

## <img src="https://img.shields.io/badge/INDEX-005-yellow" /> Pipeline Stages

| Stage | Module | Input | Output |
|-------|--------|-------|--------|
| **1. Ingest** | `discover-assets.mjs` | Raw media files | `manifest.json` |
| **2. Audio DSP** | `analyze-audio.mjs` | Audio tracks | `audio-features.json` |
| **3. Subtitles** | `extract-subtitles.mjs` | Speech audio | `subtitles.json` |
| **4. AI Planning** | `style_planner.py` | Features + manifest | `style_plan.json` |
| **5. Render** | `render_backends.py` | Style plan | Video frames |
| **6. QA** | `qa_gate.py` | Rendered frames | SSIM/ΔE report |

---

## <img src="https://img.shields.io/badge/INDEX-006-yellow" /> Tech Stack

<table>
<tr>
<td><b>LAYER</b></td>
<td><b>TECHNOLOGY</b></td>
<td><b>PURPOSE</b></td>
</tr>
<tr>
<td>Frontend</td>
<td>React 18 + Remotion 4.0 + TypeScript</td>
<td>WebGL video composition</td>
</tr>
<tr>
<td>Engine</td>
<td>Python 3.11 + OpenCV + Librosa + NumPy</td>
<td>AI analysis + rendering</td>
</tr>
<tr>
<td>Adobe</td>
<td>ExtendScript + After Effects 2025</td>
<td>Headless AE automation</td>
</tr>
<tr>
<td>AI Models</td>
<td>CLIP / ViT / Whisper</td>
<td>Scene classification + transcription</td>
</tr>
<tr>
<td>QA</td>
<td>scikit-image + CIEDE2000</td>
<td>Structural + perceptual verification</td>
</tr>
<tr>
<td>Web UI</td>
<td>Python HTTP + Vanilla JS</td>
<td>Live dashboard at localhost:8000</td>
</tr>
</table>

---

## <img src="https://img.shields.io/badge/INDEX-007-yellow" /> CLI Commands

| Command | Description |
|---------|-------------|
| `npm run ingest` | Run full asset discovery + audio DSP + subtitles |
| `npm run render` | Render via Remotion (default) |
| `npm run render:remotion` | Explicit Remotion WebGL render |
| `npm run render:ae` | Headless After Effects render |
| `npm run render:fast` | Half-scale preview render |
| `npm run typecheck` | Run TypeScript type checking |
| `python server.py` | Launch web dashboard |

---

## <img src="https://img.shields.io/badge/INDEX-008-yellow" /> DAG Execution Flow

```
                          ┌──────────────┐
                          │  START HERE  │
                          └──────┬───────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Asset Discovery &     │
                    │   SHA-256 Hash Registry │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   AI Style Planning     │
                    │   (CLIP + ViT + Whisper)│
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   3D LUT Color Engine   │
                    │   (Trilinear Sampling)  │
                    └────────────┬────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
       ┌────────▼────────┐ ┌────▼──────┐ ┌───────▼───────┐
       │   AE Backend    │ │ FFmpeg    │ │ Blender      │
       │   (Win AE 2025) │ │ (Linux)   │ │ (3D Fallback)│
       └────────┬────────┘ └────┬──────┘ └───────┬───────┘
                │                │                │
                └────────────────┼────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      QA Verification    │
                    │  SSIM ≥ 0.95  ΔE ≤ 2.0 │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    ✅ EXPORT COMPLETE   │
                    └─────────────────────────┘
```

---

## <img src="https://img.shields.io/badge/INDEX-009-yellow" /> License

Proprietary. All rights reserved by **@balaji4621**.

---

<div align="center">

<img src="https://img.shields.io/badge/BUILT_WITH-ANTIGRAVITY-purple?style=for-the-badge" alt="Built with Antigravity"/>

**Star this repo if you found it useful**

</div>
