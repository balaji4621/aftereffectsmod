import os
import cv2
import numpy as np

def compute_optical_flow_speed_ramp(video_path, output_dir="out/futuristic/optical_flow"):
    """Generates optical flow vectors for hyper-smooth speed ramps."""
    if not os.path.exists(video_path):
        print(f"[Futuristic AI] Input video '{video_path}' not found, skipping optical flow.")
        return None

    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    ret, prev_frame = cap.read()
    if not ret:
        cap.release()
        return None

    prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    frame_idx = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret or frame_idx > 30:  # Sample key frames for performance
            break

        curr_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        flow = cv2.calcOpticalFlowFarneback(prev_gray, curr_gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        
        # Visualize motion magnitude
        magnitude, angle = cv2.cartToPolar(flow[..., 0], flow[..., 1])
        hsv = np.zeros_like(frame)
        hsv[..., 1] = 255
        hsv[..., 0] = angle * 180 / np.pi / 2
        hsv[..., 2] = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)
        bgr_flow = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

        flow_out_path = os.path.join(output_dir, f"flow_{frame_idx:04d}.jpg")
        cv2.imwrite(flow_out_path, bgr_flow)

        prev_gray = curr_gray
        frame_idx += 1

    cap.release()
    print(f"[Futuristic AI] Optical flow motion vectors generated in '{output_dir}'.")
    return output_dir

def generate_depth_map_sequence(video_path, output_dir="out/futuristic/depth_maps"):
    """Generates synthetic depth maps for 3D depth-of-field and spatial text placement."""
    if not os.path.exists(video_path):
        return None

    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    frame_idx = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret or frame_idx > 30:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # Compute gradient-based pseudo depth map
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        grad = np.sqrt(grad_x**2 + grad_y**2)
        depth_sim = cv2.GaussianBlur(grad, (21, 21), 0)
        depth_norm = cv2.normalize(depth_sim, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        depth_color = cv2.applyColorMap(depth_norm, cv2.COLORMAP_INFERNO)

        depth_out_path = os.path.join(output_dir, f"depth_{frame_idx:04d}.jpg")
        cv2.imwrite(depth_out_path, depth_color)
        frame_idx += 1

    cap.release()
    print(f"[Futuristic AI] Depth maps generated in '{output_dir}'.")
    return output_dir

def generate_subject_mattes(video_path, output_dir="out/futuristic/subject_mattes"):
    """Generates subject matting masks for behind-subject text compositing."""
    if not os.path.exists(video_path):
        return None

    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    frame_idx = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret or frame_idx > 30:
            break

        # Saliency / GrabCut style segmentation mask simulation
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        mask_out_path = os.path.join(output_dir, f"matte_{frame_idx:04d}.jpg")
        cv2.imwrite(mask_out_path, mask)
        frame_idx += 1

    cap.release()
    print(f"[Futuristic AI] Subject matting masks generated in '{output_dir}'.")
    return output_dir
