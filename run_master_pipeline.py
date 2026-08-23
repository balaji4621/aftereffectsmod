import os
import subprocess
import time
import cv2
import numpy as np

PROJECT_DIR = r"C:\Users\ADMIN\OneDrive\Desktop\ae"
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")
OUT_DIR = os.path.join(PROJECT_DIR, "out")
AE_EXE = r"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\AfterFX.exe"
AERENDER_EXE = r"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\aerender.exe"
REF_VIDEO = r"C:\Users\ADMIN\AppData\Local\Temp\kilo\ref_video.mp4.f399.mp4"

def step_1_color_transfer():
    print("[1/3] Applying 3D Color Transfer Palette Match...")
    cap_ref = cv2.VideoCapture(REF_VIDEO)
    ref_frames = []
    for _ in range(60):
        ret, frame = cap_ref.read()
        if ret:
            ref_frames.append(frame)
    cap_ref.release()

    if not ref_frames:
        print("Reference video missing, skipping color transfer.")
        return

    ref_stack = np.array(ref_frames)
    mean_ref = np.mean(ref_stack, axis=(0,1,2))
    std_ref = np.std(ref_stack, axis=(0,1,2))

    clip_files = [os.path.join(PUBLIC_DIR, f"clip_{i}.mp4") for i in range(1, 7)]
    for cfile in clip_files:
        if not os.path.exists(cfile):
            continue
        cap = cv2.VideoCapture(cfile)
        fps = cap.get(cv2.CAP_PROP_FPS)
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out_file = cfile.replace('.mp4', '_color_matched.mp4')
        writer = cv2.VideoWriter(out_file, fourcc, fps, (w, h))

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            f_float = frame.astype(np.float32)
            mean_src = np.mean(f_float, axis=(0,1))
            std_src = np.std(f_float, axis=(0,1)) + 1e-5
            matched = (f_float - mean_src) / std_src * std_ref + mean_ref
            matched = np.clip(matched, 0, 255).astype(np.uint8)
            writer.write(matched)

        cap.release()
        writer.release()
    print("Color transfer complete.")

def step_2_build_ae_project():
    print("[2/3] Generating Native Adobe After Effects 2025 Project...")
    jsx_path = os.path.join(PROJECT_DIR, "build_ae_100_percent_edit.jsx")
    cmd = f'Start-Process -FilePath "{AE_EXE}" -ArgumentList "-r", "{jsx_path}" -Wait'
    subprocess.run(["powershell", "-Command", cmd], check=True)
    print("AE project generated.")

def step_3_render():
    print("[3/3] Executing aerender CLI Export...")
    aep_path = os.path.join(PROJECT_DIR, "antigravity_100_percent.aep")
    out_mp4 = os.path.join(OUT_DIR, "final_render.mp4")
    cmd = f'& "{AERENDER_EXE}" -project "{aep_path}" -comp "PERFECT_ALIGNMENT_MASTER" -output "{out_mp4}"'
    subprocess.run(["powershell", "-Command", cmd], check=True)
    print(f"Render completed -> {out_mp4}")

if __name__ == "__main__":
    start_t = time.time()
    step_1_color_transfer()
    step_2_build_ae_project()
    step_3_render()
    elapsed = time.time() - start_t
    print(f"=== MASTER PIPELINE COMPLETE ({elapsed:.1f}s) ===")
