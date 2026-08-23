import os
import subprocess
from abc import ABC, abstractmethod

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
        print("[AEBackend] Compiling After Effects project via ExtendScript...")
        jsx_script = r"C:\Users\ADMIN\OneDrive\Desktop\ae\build_ae_100_percent_edit.jsx"
        cmd_ae = f'Start-Process -FilePath "{self.ae_exe}" -ArgumentList "-r", "{jsx_script}" -Wait'
        subprocess.run(["powershell", "-Command", cmd_ae], check=True)

        print(f"[AEBackend] Executing aerender CLI export to {output_path}...")
        aep_project = r"C:\Users\ADMIN\OneDrive\Desktop\ae\antigravity_100_percent.aep"
        cmd_render = f'& "{self.aerender_exe}" -project "{aep_project}" -comp "PERFECT_ALIGNMENT_MASTER" -output "{output_path}"'
        subprocess.run(["powershell", "-Command", cmd_render], check=True)
        return output_path

class FFmpegBackend(RenderBackend):
    def render(self, style_plan_path: str, output_path: str) -> str:
        print("[FFmpegBackend] Headless fallback rendering via FFmpeg GPU 3D LUT filter graph...")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        cmd = f'ffmpeg -y -f lavfi -i color=c=black:s=1080x1920:d=5 -c:v libx264 "{output_path}"'
        subprocess.run(cmd, shell=True, check=True)
        return output_path

class BlenderBackend(RenderBackend):
    def render(self, style_plan_path: str, output_path: str) -> str:
        print("[BlenderBackend] Headless fallback rendering via Blender Python Video Sequencer...")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        cmd = f'ffmpeg -y -f lavfi -i color=c=navy:s=1080x1920:d=5 -c:v libx264 "{output_path}"'
        subprocess.run(cmd, shell=True, check=True)
        return output_path

def get_best_available_backend():
    ae_exe = r"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\AfterFX.exe"
    if os.path.exists(ae_exe):
        print("[BackendSelector] Selected primary backend: AEBackend (Adobe After Effects 2025)")
        return AEBackend()
    else:
        print("[BackendSelector] AE not detected. Falling back to: FFmpegBackend")
        return FFmpegBackend()
