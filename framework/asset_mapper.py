import os
import json
import argparse
import subprocess
import cv2
import numpy as np

PROJECT_DIR = r"C:\Users\ADMIN\OneDrive\Desktop\ae"
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")
OUT_DIR = os.path.join(PROJECT_DIR, "out")
AE_EXE = r"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\AfterFX.exe"
AERENDER_EXE = r"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\aerender.exe"

def validate_color_profile(color_mean, color_std):
    """Validate that color profile statistics are within acceptable ranges."""
    if color_mean is None or color_std is None:
        raise ValueError("Color profile mean and std cannot be None")
    if len(color_mean) != 3 or len(color_std) != 3:
        raise ValueError("Color profile must have exactly 3 BGR channels")
    if any(s < 0 for s in color_std):
        raise ValueError("Color standard deviation cannot be negative")
    return True

def map_assets_and_build(template_json="out/master_template.json"):
    if not os.path.exists(template_json):
        print(f"Error: Template file '{template_json}' not found.")
        return False

    with open(template_json, "r") as f:
        data = json.load(f)

    color_mean = np.array(data["color_profile"]["mean_bgr"])
    color_std = np.array(data["color_profile"]["std_bgr"])

    # Validate color profile before processing
    validate_color_profile(color_mean, color_std)

    clips = data["clips"]
    print(f"[AssetMapper] Checking uploaded clips in {PUBLIC_DIR}...")

    matched_clips = []
    for clip in clips:
        idx = clip["clip_index"]
        cfile = os.path.join(PUBLIC_DIR, f"clip_{idx}.mp4")
        if not os.path.exists(cfile):
            print(f"[Warning] Missing public/clip_{idx}.mp4 - placeholder will be used.")
            continue
        
        # Color match processing
        out_cfile = os.path.join(PUBLIC_DIR, f"clip_{idx}_color_matched.mp4")
        cap = cv2.VideoCapture(cfile)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        writer = cv2.VideoWriter(out_cfile, fourcc, fps, (w, h))

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            f_float = frame.astype(np.float32)
            mean_src = np.mean(f_float, axis=(0,1))
            std_src = np.std(f_float, axis=(0,1)) + 1e-5
            matched = (f_float - mean_src) / std_src * color_std + color_mean
            matched = np.clip(matched, 0, 255).astype(np.uint8)
            writer.write(matched)

        cap.release()
        writer.release()
        matched_clips.append(out_cfile)
        print(f"[AssetMapper] Color-matched clip_{idx}.mp4 -> clip_{idx}_color_matched.mp4")

    print(f"[AssetMapper] Asset processing complete. Integrated {len(matched_clips)} footage clips.")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Map assets and run color grade matching.")
    parser.add_argument("--template", default="out/master_template.json", help="Path to master template JSON")
    args = parser.parse_args()

    map_assets_and_build(args.template)
