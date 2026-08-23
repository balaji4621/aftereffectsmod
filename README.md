# 🚀 ANTIGRAVITY AI ENTERPRISE VIDEO AUTOMATION ENGINE

An autonomous, enterprise-grade video production and editing engine. Combines **React / Remotion 4.0**, **Native Adobe After Effects 2025 Headless Automation (ExtendScript)**, **DSP Audio/Subtitle Ingestion**, **Dual-Engine Cubic Bézier Motion Parity**, and **Futuristic AI Modules (Optical Flow, Depth Maps, Subject Matting)** with a **1-Click Web UI Dashboard**.

---

## ⚡ QUICK START & CLI ORCHESTRATOR

### 1. Ingest Assets & Perform Offline DSP Analysis
Generates `manifest.json`, `audio-features.json`, and `subtitles.json`:
```bash
npm run ingest
```

### 2. Render Options
- **Remotion Render (React WebGL)**:
  ```bash
  npm run render:remotion
  ```
- **After Effects Master Render (Headless aerender)**:
  ```bash
  npm run render:ae
  ```

### 3. Interactive Web UI Dashboard (1-Click Local Web App)
```bash
python server.py
```
Open your browser at: **`http://localhost:8000`**

---

## 🏗️ ARCHITECTURE & SUBSYSTEMS

### 1. Ingestion & Offline DSP Pipeline (`scripts/`)
- `scripts/discover-assets.mjs`: Scans media assets, extracts metadata, and generates lightweight 720p/30fps proxies for 4K video streams. Outputs `src/generated/manifest.json`.
- `scripts/analyze-audio.mjs`: Multi-band spectral flux analysis extracting sub/kick (20-150Hz) and snare hits. Outputs `src/generated/audio-features.json`.
- `scripts/extract-subtitles.mjs`: Forced alignment word-level transcription and emphasis scoring. Outputs `src/generated/subtitles.json`.
- `src/schemas/`: Strict Zod validation schemas (`manifest.schema.ts`, `audio-features.schema.ts`, `subtitles.schema.ts`).

### 2. Dual-Engine Motion Parity (`src/utils/motion.ts` & `scripts/ae_helpers/`)
- `src/utils/motion.ts`: Normalizes 4-point Cubic Bézier vectors (`[x1, y1, x2, y2]`) using `bezier-easing`.
- `scripts/ae_helpers/bezier.jsx`: Extends After Effects ExtendScript to translate cubic vectors into native `KeyframeEase` influence and speed parameters.

### 3. Unified Master After Effects Engine (`build_ae_master.jsx`)
- Eliminates legacy script duplication. Dynamically ingests `manifest.json`, `audio-features.json`, and `subtitles.json` using relative paths (`$.fileName`).
- Implements error logging to `out/logs/ae_build_<timestamp>.json` and loads presets from `ae_presets/masterpiece.json` and `ae_presets/phonk.json`.

### 4. Futuristic AI Modules & Web Interface (`src/engine/` & `web/`)
- `src/engine/futuristic_ai.py`: Optical flow motion vectors, synthetic depth maps, and subject matting masks.
- `src/engine/stage_runner.py` & `manifest.py`: SHA-256 state ledger enforcing idempotent DAG execution.
- `web/index.html` & `server.py`: Dark-mode Web UI with live output preview player and terminal console.

---

## 📂 PROJECT STRUCTURE

```
/
├── server.py                        # 🌐 Local Web App Server (http://localhost:8000)
├── run_sss_pipeline.py              # ⚙️ Master SSS++ DAG Pipeline Runner
├── build_ae_master.jsx              # 🔮 Unified Master AE ExtendScript Builder
├── scripts/
│   ├── discover-assets.mjs          # Asset scanner & 4K proxy generator
│   ├── analyze-audio.mjs           # Multi-band spectral flux analyzer
│   ├── extract-subtitles.mjs        # Word-level forced alignment subtitles
│   └── ae_helpers/
│       └── bezier.jsx               # AE Cubic Bezier vector math helper
├── ae_presets/                      # 🎨 Configuration presets (masterpiece, phonk)
├── src/
│   ├── schemas/                     # 🛡️ Zod runtime validation schemas
│   ├── generated/                   # 📄 Offline DSP generated manifests
│   ├── utils/