# REFERENCE VIDEO RECREATION FRAMEWORK

## OVERVIEW
An end-to-end framework to reverse-engineer any reference video and recreate its exact aesthetic, pacing, transitions, and composition with user footage.

---

## 4-PHASE WORKFLOW

### PHASE 1: REFERENCE ANALYSIS & MASTER TEMPLATE
Run the automated analyzer on any reference video to extract the structural DNA:
```bash
python framework/reference_analyzer.py --input "path/to/reference_video.mp4"
```
**Output**: `out/master_template.json` containing:
- Frame rate, resolution, aspect ratio, total duration.
- Scene Cut Timestamps & Segment Durations.
- Audio BPM & Beat Grid alignment.
- Color Distribution (Mean RGB/Lab & std dev for color transfer).
- Motion/Transition markers (Flash transitions, whip zooms, speed ramps).

---

### PHASE 2: PRE-PRODUCTION & SHOT LIST GENERATION
Generate a shot list for capturing user footage:
```bash
python framework/shotlist_generator.py --template "out/master_template.json"
```
**Output**: `out/SHOT_LIST.md` specifying for each clip:
- Exact required duration (in seconds & frames).
- Recommended camera angles and movements (e.g. tracking shot, low angle, whip pan).
- Target action/subject matter matching reference rhythm.

---

### PHASE 3: ASSET INTEGRATION & COMPOSITING
Once user clips are recorded and saved into `public/` (`clip_1.mp4`, `clip_2.mp4`, etc.):
```bash
python framework/asset_mapper.py --template "out/master_template.json"
```
This prepares the clips (color transfer matching reference, audio beat sync) and invokes After Effects:
- Launches `AfterFX.exe` to run `framework/build_ae_from_template.jsx`
- Compiles a native `.aep` project (`out/recreated_master.aep`).

---

### PHASE 4: SPEED OPTIMIZED PRODUCTION RENDER
Execute headless production export via `aerender`:
```bash
python run_master_pipeline.py
```
- Multi-threaded rendering.
- Proxy/Low-res fast preview options available.
- Final high-quality output saved to `out/final_render.mp4`.
