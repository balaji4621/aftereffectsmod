import os
import json
import argparse
import cv2
import numpy as np

def analyze_reference_video(video_path, output_json="out/master_template.json"):
    if not os.path.exists(video_path):
        print(f"Error: Video file '{video_path}' not found.")
        return False

    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    cap = cv2.VideoCapture(video_path)

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = frame_count / fps

    print(f"[Analysis] Video: {video_path}")
    print(f"[Analysis] Res: {width}x{height} | FPS: {fps:.2f} | Duration: {duration:.2f}s ({frame_count} frames)")

    # Scene cut detection via HSV histogram differences
    cuts = [0.0]
    prev_hist = None
    frame_idx = 0

    sample_frames = []
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Collect sample frames for color statistics
        if frame_idx % int(max(1, fps / 2)) == 0:
            sample_frames.append(frame)

        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        hist = cv2.calcHist([hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])
        cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)

        if prev_hist is not None:
            diff = cv2.compareHist(prev_hist, hist, cv2.HISTCMP_BHATTACHARYYA)
            if diff > 0.45:  # Cut threshold
                timestamp = round(frame_idx / fps, 3)
                if timestamp - cuts[-1] >= 0.3:  # Min 0.3s clip length
                    cuts.append(timestamp)

        prev_hist = hist
        frame_idx += 1

    cap.release()
    cuts.append(round(duration, 3))

    # Calculate clips breakdown
    clips = []
    for i in range(len(cuts) - 1):
        start = cuts[i]
        end = cuts[i+1]
        dur = round(end - start, 3)
        clips.append({
            "clip_index": i + 1,
            "start_sec": start,
            "end_sec": end,
            "duration_sec": dur,
            "suggested_motion": "dynamic zoom" if i % 2 == 0 else "whip pan",
            "suggested_angle": "medium close-up" if i % 3 == 0 else "wide tracking shot"
        })

    # Color palette stats
    if sample_frames:
        sample_stack = np.array(sample_frames)
        color_mean = np.mean(sample_stack, axis=(0,1,2)).tolist()
        color_std = np.std(sample_stack, axis=(0,1,2)).tolist()
    else:
        color_mean = [128.0, 128.0, 128.0]
        color_std = [50.0, 50.0, 50.0]

    template_data = {
        "metadata": {
            "source_file": os.path.basename(video_path),
            "width": width,
            "height": height,
            "fps": fps,
            "duration_sec": duration,
            "total_frames": frame_count,
            "total_cuts": len(clips)
        },
        "color_profile": {
            "mean_bgr": color_mean,
            "std_bgr": color_std
        },
        "clips": clips
    }

    with open(output_json, "w") as f:
        json.dump(template_data, f, indent=2)

    print(f"[Analysis] Master template generated -> {output_json} ({len(clips)} clips detected)")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyze reference video to generate master template.")
    parser.add_argument("--input", required=True, help="Path to reference video MP4")
    parser.add_argument("--output", default="out/master_template.json", help="Path to output JSON template")
    args = parser.parse_args()

    analyze_reference_video(args.input, args.output)
