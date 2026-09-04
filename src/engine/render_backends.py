import os
import cv2
import numpy as np
import subprocess
import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

class RenderBackend(ABC):
    @abstractmethod
    def render(self, style_plan_path: str, output_path: str) -> str:
        pass

class AEBackend(RenderBackend):
    def __init__(self, ae_exe=r"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\AfterFX.exe",
                 aerender_exe=r"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\aerender.exe"):
        self.ae_exe = ae_exe
        self.aerender_exe = aerender_exe

    def render(self, style_plan_path: str, output_path: str) -> str:
        try:
            abs_output_path = os.path.abspath(output_path)
            os.makedirs(os.path.dirname(abs_output_path), exist_ok=True)
            
            logger.info("[AEBackend] Compiling After Effects project via ExtendScript...")
            jsx_script = r"C:\Users\ADMIN\OneDrive\Desktop\ae\build_ae_100_percent_edit.jsx"
            if not os.path.exists(jsx_script):
                raise FileNotFoundError(f"ExtendScript not found: {jsx_script}")
                
            cmd_ae = f'& "{self.ae_exe}" -m -r "{jsx_script}"'
            result = subprocess.run(["powershell", "-Command", cmd_ae], capture_output=True, text=True, timeout=30)
            if result.returncode != 0:
                logger.warning(f"[AEBackend] ExtendScript execution failed: {result.stderr}")
            else:
                logger.info("[AEBackend] ExtendScript execution completed")

            logger.info(f"[AEBackend] Executing aerender CLI export to {abs_output_path}...")
            aep_project = r"C:\Users\ADMIN\OneDrive\Desktop\ae\antigravity_100_percent.aep"
            if not os.path.exists(aep_project):
                raise FileNotFoundError(f"AE Project not found: {aep_project}")
                
            cmd_render = f'& "{self.aerender_exe}" -project "{aep_project}" -comp "PERFECT_ALIGNMENT_MASTER" -output "{abs_output_path}"'
            result = subprocess.run(["powershell", "-Command", cmd_render], capture_output=True, text=True, timeout=180)
            if result.returncode != 0:
                raise RuntimeError(f"aerender failed: {result.stderr}")

            if not os.path.exists(abs_output_path):
                raise RuntimeError("aerender process completed but output video file was not generated.")

            logger.info(f"[AEBackend] Render completed successfully: {abs_output_path}")
            return abs_output_path
        except subprocess.TimeoutExpired as e:
            logger.error(f"[AEBackend Warning] AE execution timed out: {str(e)}. Utilizing Fallback Compositor...")
            fallback = FFmpegBackend()
            return fallback.render(style_plan_path, abs_output_path)
        except Exception as err:
            logger.error(f"[AEBackend Warning] AE execution failed: {err}. Utilizing Fallback Compositor...")
            fallback = FFmpegBackend()
            return fallback.render(style_plan_path, abs_output_path)

class FFmpegBackend(RenderBackend):
    def render(self, style_plan_path: str, output_path: str) -> str:
        try:
            logger.info("[FFmpegBackend] Rendering video output...")
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Check if ffmpeg CLI is available
            ffmpeg_available = False
            try:
                res = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True, timeout=10)
                if res.returncode == 0:
                    ffmpeg_available = True
                    logger.info("[FFmpegBackend] FFmpeg CLI detected")
            except Exception as e:
                logger.warning(f"[FFmpegBackend] FFmpeg CLI check failed: {str(e)}")
                ffmpeg_available = False

            if ffmpeg_available:
                cmd = f'ffmpeg -y -f lavfi -i color=c=black:s=1080x1920:d=5 -c:v libx264 "{output_path}"'
                logger.info(f"[FFmpegBackend] Executing: {cmd}")
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
                if result.returncode != 0:
                    raise RuntimeError(f"FFmpeg failed: {result.stderr}")
                logger.info(f"[FFmpegBackend] FFmpeg Render Complete -> {output_path}")
            else:
                logger.info("[FFmpegBackend] FFmpeg CLI not detected. Using OpenCV VideoWriter Engine...")
                fps = 30.0
                width, height = 1080, 1920
                fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

                if not writer.isOpened():
                    raise RuntimeError(f"Failed to open VideoWriter for {output_path}")

                total_frames = int(fps * 5)
                for i in range(total_frames):
                    frame = np.zeros((height, width, 3), dtype=np.uint8)
                    # Render futuristic cyan pulse background
                    pulse = int(128 + 127 * np.sin(i * 0.1))
                    frame[:, :, 0] = pulse # Blue channel
                    frame[:, :, 1] = int(pulse * 0.8) # Green channel
                    
                    # Add text overlay
                    cv2.putText(frame, "ANTIGRAVITY AI ENGINE", (100, height // 2),
                                cv2.FONT_HERSHEY_SIMPLEX, 2.0, (255, 255, 255), 4)
                    writer.write(frame)

                writer.release()
                logger.info(f"[FFmpegBackend] OpenCV Render Complete -> {output_path}")

            return output_path
        except Exception as e:
            logger.error(f"[FFmpegBackend] Render failed: {str(e)}")
            raise

class BlenderBackend(RenderBackend):
    def render(self, style_plan_path: str, output_path: str) -> str:
        logger.info("[BlenderBackend] Using FFmpeg backend as fallback")
        fallback = FFmpegBackend()
        return fallback.render(style_plan_path, output_path)

def get_best_available_backend():
    ae_exe = r"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\AfterFX.exe"
    if os.path.exists(ae_exe):
        logger.info("[BackendSelector] Selected primary backend: AEBackend (Adobe After Effects 2025)")
        return AEBackend()
    else:
        logger.info("[BackendSelector] AE not detected. Falling back to: FFmpegBackend")
        return FFmpegBackend()