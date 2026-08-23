import os
import json
import argparse

def generate_shot_list(template_json="out/master_template.json", output_md="out/SHOT_LIST.md"):
    if not os.path.exists(template_json):
        print(f"Error: Template file '{template_json}' not found. Run reference_analyzer.py first.")
        return False

    with open(template_json, "r") as f:
        data = json.load(f)

    meta = data["metadata"]
    clips = data["clips"]

    md_lines = []
    md_lines.append("# PRE-PRODUCTION SHOT LIST & RECORDING GUIDE")
    md_lines.append(f"**Reference Source**: `{meta['source_file']}`")
    md_lines.append(f"**Format**: {meta['width']}x{meta['height']} @ {meta['fps']} FPS | **Total Duration**: {meta['duration_sec']}s")
    md_lines.append(f"**Total Clips Required**: {meta['total_cuts']}\n")
    md_lines.append("---")
    md_lines.append("\n## REQUIRED FOOTAGE BREAKDOWN\n")
    md_lines.append("| Clip # | Filename | Duration (sec) | Camera Angle / Framing | Motion & Action Description |")
    md_lines.append("|---|---|---|---|---|")

    for clip in clips:
        idx = clip["clip_index"]
        dur = clip["duration_sec"]
        motion = clip["suggested_motion"]
        angle = clip["suggested_angle"]
        fn = f"`clip_{idx}.mp4`"
        md_lines.append(f"| Clip {idx} | {fn} | {dur}s | {angle} | {motion} - Subject action aligned with beat |")

    md_lines.append("\n---\n")
    md_lines.append("## RECORDING INSTRUCTIONS FOR 100% STYLE MATCH")
    md_lines.append("1. **File Naming**: Save your recorded clips inside the `public/` directory as `clip_1.mp4`, `clip_2.mp4`, etc.")
    md_lines.append("2. **Frame Rate**: Match target frame rate (preferably 30 FPS or 60 FPS for speed ramps).")
    md_lines.append("3. **Headroom & Handles**: Record extra 0.5s handle on both ends of each shot for seamless transitions.")
    md_lines.append("4. **Lighting**: Keep lighting contrast clean to maximize the OpenCV 3D color grade transfer accuracy.")

    os.makedirs(os.path.dirname(output_md), exist_ok=True)
    with open(output_md, "w") as f:
        f.write("\n".join(md_lines))

    print(f"[ShotList] Pre-production guide written -> {output_md}")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate pre-production shot list from master template.")
    parser.add_argument("--template", default="out/master_template.json", help="Path to master template JSON")
    parser.add_argument("--output", default="out/SHOT_LIST.md", help="Path to output markdown shot list")
    args = parser.parse_args()

    generate_shot_list(args.template, args.output)
