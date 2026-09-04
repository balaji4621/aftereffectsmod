import os
import cv2
import numpy as np
import logging

logger = logging.getLogger(__name__)

def _is_cuda_available():
    """Check if CUDA is available in OpenCV."""
    try:
        return cv2.cuda.getCudaEnabledDeviceCount() > 0
    except Exception:
        return False

def compute_optical_flow_speed_ramp(video_path, output_dir="out/futuristic/optical_flow", use_gpu=False):
    """Generates optical flow vectors for hyper-smooth speed ramps.
    
    Args:
        video_path (str): Path to input video file
        output_dir (str): Directory to save output flow frames
        use_gpu (bool): Whether to use GPU acceleration if available
        
    Returns:
        str: Path to output directory or None if failed
    """
    try:
        if not os.path.exists(video_path):
            logger.warning(f"[Futuristic AI] Input video '{video_path}' not found, skipping optical flow.")
            return None

        os.makedirs(output_dir, exist_ok=True)
        
        # Try GPU acceleration if requested and available
        gpu_available = use_gpu and _is_cuda_available()
        if gpu_available:
            logger.info("[Futuristic AI] Using GPU-accelerated optical flow (CUDA)")
            return _compute_optical_flow_gpu(video_path, output_dir)
        else:
            if use_gpu and not _is_cuda_available():
                logger.warning("[Futuristic AI] GPU requested but not available, falling back to CPU")
            logger.info("[Futuristic AI] Using CPU optical flow")
            return _compute_optical_flow_cpu(video_path, output_dir)
    except Exception as e:
        logger.error(f"[Futuristic AI] Error in compute_optical_flow_speed_ramp: {str(e)}")
        return None

def _compute_optical_flow_cpu(video_path, output_dir):
    """CPU-based optical flow computation."""
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        logger.error(f"[Futuristic AI] Failed to open video file: {video_path}")
        return None
        
    ret, prev_frame = cap.read()
    if not ret:
        logger.error(f"[Futuristic AI] Failed to read first frame from: {video_path}")
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
        success = cv2.imwrite(flow_out_path, bgr_flow)
        if not success:
            logger.warning(f"[Futuristic AI] Failed to write flow frame {frame_idx}")

        prev_gray = curr_gray
        frame_idx += 1

    cap.release()
    logger.info(f"[Futuristic AI] Optical flow motion vectors generated in '{output_dir}'.")
    return output_dir

def _compute_optical_flow_gpu(video_path, output_dir):
    """GPU-accelerated optical flow computation using CUDA."""
    try:
        # Initialize GPU objects
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logger.error(f"[Futuristic AI] Failed to open video file: {video_path}")
            return None
            
        ret, prev_frame = cap.read()
        if not ret:
            logger.error(f"[Futuristic AI] Failed to read first frame from: {video_path}")
            cap.release()
            return None

        # Upload first frame to GPU
        prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
        gpu_prev = cv2.cuda_GpuMat()
        gpu_prev.upload(prev_gray)
        
        # Create GPU optical flow object
        flow = cv2.cuda_FarnebackOpticalFlow.create(5, 0.5, False, 15, 3, 5, 1.2, 0)
        
        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret or frame_idx > 30:  # Sample key frames for performance
                break

            # Process frame on GPU
            curr_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gpu_curr = cv2.cuda_GpuMat()
            gpu_curr.upload(curr_gray)
            
            gpu_flow = flow.calc(gpu_prev, gpu_curr, None)
            
            # Download flow data for visualization
            flow_np = gpu_flow.download()
            magnitude, angle = cv2.cartToPolar(flow_np[..., 0], flow_np[..., 1])
            hsv = np.zeros_like(frame)
            hsv[..., 1] = 255
            hsv[..., 0] = angle * 180 / np.pi / 2
            hsv[..., 2] = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)
            bgr_flow = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

            flow_out_path = os.path.join(output_dir, f"flow_{frame_idx:04d}.jpg")
            success = cv2.imwrite(flow_out_path, bgr_flow)
            if not success:
                logger.warning(f"[Futuristic AI] Failed to write flow frame {frame_idx}")

            # Prepare for next iteration
            gpu_prev = gpu_curr
            frame_idx += 1

        cap.release()
        logger.info(f"[Futuristic AI] GPU-accelerated optical flow motion vectors generated in '{output_dir}'.")
        return output_dir
    except Exception as e:
        logger.error(f"[Futuristic AI] GPU optical flow failed: {str(e)}. Falling back to CPU.")
        # Fallback to CPU implementation
        return _compute_optical_flow_cpu(video_path, output_dir)
    finally:
        if 'cap' in locals():
            cap.release()

def generate_depth_map_sequence(video_path, output_dir="out/futuristic/depth_maps", use_gpu=False):
    """Generates synthetic depth maps for 3D depth-of-field and spatial text placement.
    
    Args:
        video_path (str): Path to input video file
        output_dir (str): Directory to save output depth maps
        use_gpu (bool): Whether to use GPU acceleration if available
        
    Returns:
        str: Path to output directory or None if failed
    """
    try:
        if not os.path.exists(video_path):
            logger.warning(f"[Futuristic AI] Input video '{video_path}' not found, skipping depth map generation.")
            return None

        os.makedirs(output_dir, exist_ok=True)
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            logger.error(f"[Futuristic AI] Failed to open video file: {video_path}")
            return None
            
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
            success = cv2.imwrite(depth_out_path, depth_color)
            if not success:
                logger.warning(f"[Futuristic AI] Failed to write depth frame {frame_idx}")
                
            frame_idx += 1

        cap.release()
        logger.info(f"[Futuristic AI] Depth maps generated in '{output_dir}'.")
        return output_dir
    except Exception as e:
        logger.error(f"[Futuristic AI] Error in generate_depth_map_sequence: {str(e)}")
        if 'cap' in locals():
            cap.release()
        return None

def generate_subject_mattes(video_path, output_dir="out/futuristic/subject_mattes", use_gpu=False):
    """Generates subject matting masks for behind-subject text compositing.
    
    Args:
        video_path (str): Path to input video file
        output_dir (str): Directory to save output matte masks
        use_gpu (bool): Whether to use GPU acceleration if available
        
    Returns:
        str: Path to output directory or None if failed
    """
    try:
        if not os.path.exists(video_path):
            logger.warning(f"[Futuristic AI] Input video '{video_path}' not found, skipping subject matte generation.")
            return None

        os.makedirs(output_dir, exist_ok=True)
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            logger.error(f"[Futuristic AI] Failed to open video file: {video_path}")
            return None
            
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
            success = cv2.imwrite(mask_out_path, mask)
            if not success:
                logger.warning(f"[Futuristic AI] Failed to write matte frame {frame_idx}")
                
            frame_idx += 1

        cap.release()
        logger.info(f"[Futuristic AI] Subject matting masks generated in '{output_dir}'.")
        return output_dir
    except Exception as e:
        logger.error(f"[Futuristic AI] Error in generate_subject_mattes: {str(e)}")
        if 'cap' in locals():
            cap.release()
        return None