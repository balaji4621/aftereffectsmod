# ANTIGRAVITY SSS++ MASTER SYSTEM ARCHITECTURE DOCUMENTATION

## 1. DAG SYSTEM ARCHITECTURE & MANIFEST STATE LEDGER

The **SSS++ Engine** is built around a deterministic, fault-tolerant Directed Acyclic Graph (DAG) managed by `StageRunner`. State persistence is enforced via `out/manifest.json`.

```
[ Ingest & Hash Registry ] ──> [ AI Style Planner ] ──> [ GPU 3D LUT Engine ]
                                                               │
┌──────────────────────────────────────────────────────────────┘
▼
[ RenderBackend Selector ] ──┬──> [ AEBackend (Windows AE 2025) ]
                             ├──> [ FFmpegBackend (Linux GPU Fallback) ]
                             └──> [ BlenderBackend (3D Sequencer Fallback) ]
                                               │
                                               ▼
                                      [ QA Gate Verification ]
                                     (SSIM >= 0.95, ΔE2000 <= 2.0)
```

### Idempotency Mechanism
Every stage calculates a SHA-256 hash derived from:
- Stage parameters.
- Hashes of dependent input files stored in `hash_registry`.
- Code execution signature.

If the calculated `stage_hash` matches `manifest.json` with status `"COMPLETED"`, execution is skipped immediately.

---

## 2. COMPONENT DESIGN PATTERNS

### A. AI Creative Intelligence Layer (`src/engine/style_planner.py`)
- Extracts RMS energy curves & transient onset timestamps (`librosa`).
- Transcribes vocal tracks to align lower-third overlays (`Whisper`).
- Classifies camera movement, framing, and key lighting (`CLIP / ViT`).
- Writes structured plan to `out/style_plan.json`.

### B. Hardened Adobe Automation Engine (`src/engine/watchdog.py`)
- Spawns `AfterFX.exe` inside a Windows process watchdog.
- Enforces strict process timeouts (default 120s) to prevent hangs.
- Intercepts structured JSON errors emitted by ExtendScript try/catch handlers.

### C. Cross-Platform Fallback Path (`src/engine/render_backends.py`)
Provides seamless execution across heterogeneous environments:
- **`AEBackend`**: Primary backend utilizing Adobe After Effects 2025 (`AfterFX.exe` & `aerender.exe`).
- **`FFmpegBackend`**: Linux/headless GPU 3D LUT fallback renderer.
- **`BlenderBackend`**: Python-driven headless 3D compositor fallback.

### D. QA Verification Gate (`src/engine/qa_gate.py`)
Validates rendered video frames against golden-frame baselines:
- **SSIM (Structural Similarity Index)**: Measures structural, brightness, and contrast parity ($\text{SSIM} \ge 0.95$).
- **CIEDE2000 ($\Delta E_{00}$)**: Evaluates perceptual color distance ($\Delta E_{00} \le 2.0$).

---

## 3. CONTAINER & CLOUD DEPLOYMENT ARCHITECTURE

```
                      [ Client API Request ]
                                │
                                ▼
                   [ Redis Message Broker ]
                                │
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
 [ Celery Queue: web ]                  [ Celery Queue: ae ]
(Linux Containers)                     (Windows Licensed Instances)
 ├── Ingest & Hash Registry             ├── Process Watchdog
 ├── Style Planning & AI                ├── AE ExtendScript Automation
 ├── FFmpeg & Blender Backends          └── aerender.exe Multi-Threaded
 └── QA Verification Gate
```

- **`antigravity-web` Pool**: Runs Linux Docker containers handling API intake, AI intelligence, FFmpeg GPU color matching, Blender rendering, and QA verification.
- **`antigravity-ae` Pool**: Runs Windows Server instances licensed for Adobe After Effects 2025 to execute ExtendScript project generation and `aerender` exports.
