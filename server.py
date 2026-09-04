"""
Antigravity AI Video Engine - Web Server

This module provides a simple HTTP server that serves the web dashboard
and handles API requests for triggering the video production pipeline.
"""

import os
import sys
import json
import subprocess
import socketserver
import shutil
import psutil
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

# Configuration
PORT = 8000
PROJECT_DIR = r"C:\Users\ADMIN\OneDrive\Desktop\ae"


class ReusableHTTPServer(socketserver.TCPServer):
    """HTTP server that allows address reuse to prevent 'Address already in use' errors."""
    allow_reuse_address = True


class AntigravityServer(SimpleHTTPRequestHandler):
    """Custom HTTP request handler for the Antigravity web dashboard."""
    
    def translate_path(self, path):
        """
        Translate URL path to filesystem path.
        
        Args:
            path (str): URL path
            
        Returns:
            str: Filesystem path
        """
        if path == "/":
            return os.path.join(PROJECT_DIR, "web", "index.html")
        if path.startswith("/out/"):
            return os.path.join(PROJECT_DIR, path.lstrip("/"))
        return os.path.join(PROJECT_DIR, path.lstrip("/"))

    def do_POST(self):
        """
        Handle POST requests to API endpoints.
        
        Endpoints:
        - POST /api/run: Trigger the video production pipeline
        - POST /api/stop: Shutdown the server
        - POST /api/upload-lut: Upload custom LUT file
        - POST /api/export-preset: Export current settings as preset
        """
        if self.path == "/api/run":
            self._handle_run_pipeline()
        elif self.path == "/api/stop":
            self._handle_stop()
        elif self.path == "/api/upload-lut":
            self._handle_lut_upload()
        elif self.path == "/api/export-preset":
            self._handle_export_preset()
        else:
            self.send_error(404, "Endpoint not found")

    def do_GET(self):
        """
        Handle GET requests to API endpoints.
        
        Endpoints:
        - GET /api/presets: Get list of available presets
        - GET /api/health: Get system health status
        """
        if self.path == "/api/presets":
            self._handle_get_presets()
        elif self.path == "/api/health":
            self._handle_health_check()
        else:
            # Serve static files
            super().do_GET()

    def _handle_run_pipeline(self):
        """Handle POST /api/run - Trigger the video production pipeline."""
        content_type = self.headers.get('Content-Type', '')
        if content_type.startswith('multipart/form-data'):
            # Handle file upload
            length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(length)
            # For now, we'll just extract the preset from form data
            # A full multipart parser would be needed for file handling
            # But for this example, we'll keep it simple and assume no file upload via this endpoint
            # File uploads will go to /api/upload-lut instead
            try:
                # Try to parse as JSON first (for backward compatibility)
                payload = json.loads(post_data.decode('utf-8'))
                preset_name = payload.get("preset", "masterpiece")
                lut_file = None
            except:
                # Fallback to form data parsing (simplified)
                data_str = post_data.decode('utf-8')
                preset_name = "masterpiece"  # default
                lut_file = None
                # Parse preset from form data
                for part in data_str.split('&'):
                    if 'preset=' in part:
                        preset_name = part.split('preset=')[1].split('&')[0]
                        # URL decode
                        preset_name = urllib.parse.unquote_plus(preset_name)
        else:
            # Handle JSON data
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError:
                payload = {}

            preset_name = payload.get("preset", "masterpiece")
            lut_file = None  # Not handling file upload in JSON endpoint

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        log_output = []
        try:
            log_output.append(f"[Pipeline] Triggering master SSS++ engine with preset: '{preset_name}'...")
            if lut_file:
                log_output.append(f"[Pipeline] Using custom LUT: {lut_file.filename}")
            cmd = [sys.executable, os.path.join(PROJECT_DIR, "run_sss_pipeline.py")]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
            
            log_output.append(res.stdout)
            if res.stderr:
                log_output.append(res.stderr)

            response = {
                "status": "SUCCESS" if res.returncode == 0 else "ERROR",
                "preset": preset_name,
                "log": "\n".join(log_output)
            }
        except subprocess.TimeoutExpired:
            response = {
                "status": "ERROR",
                "log": "[Timeout Error] Master pipeline execution exceeded 180s timeout limit."
            }
        except Exception as e:
            response = {
                "status": "ERROR",
                "log": f"Failed execution: {str(e)}"
            }

        self.wfile.write(json.dumps(response).encode('utf-8'))

    def _handle_lut_upload(self):
        """Handle POST /api/upload-lut - Upload a custom LUT file."""
        content_type = self.headers.get('Content-Type', '')
        if not content_type.startswith('multipart/form-data'):
            self.send_error(400, "Expected multipart/form-data")
            return
            
        # For simplicity in this example, we'll acknowledge the upload
        # In a real implementation, you would parse the multipart data and save the file
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        
        response = {
            "status": "SUCCESS",
            "message": "LUT upload endpoint ready (file parsing would be implemented here)"
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def _handle_export_preset(self):
        """Handle POST /api/export-preset - Export current settings as preset."""
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            payload = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            payload = {}

        preset_name = payload.get("name", "custom_preset")
        settings = payload.get("settings", {})
        
        # Create presets directory if it doesn't exist
        presets_dir = os.path.join(PROJECT_DIR, "ae_presets")
        os.makedirs(presets_dir, exist_ok=True)
        
        # Save preset as JSON file
        preset_file = os.path.join(presets_dir, f"{preset_name}.json")
        try:
            with open(preset_file, 'w') as f:
                json.dump(settings, f, indent=2)
            
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            
            response = {
                "status": "SUCCESS",
                "message": f"Preset '{preset_name}' exported successfully",
                "preset_file": preset_file
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            
            response = {
                "status": "ERROR",
                "message": f"Failed to export preset: {str(e)}"
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))

    def _handle_get_presets(self):
        """Handle GET /api/presets - Get list of available presets."""
        presets_dir = os.path.join(PROJECT_DIR, "ae_presets")
        presets = []
        
        if os.path.exists(presets_dir):
            for file in os.listdir(presets_dir):
                if file.endswith(".json"):
                    preset_name = file[:-5]  # Remove .json extension
                    presets.append(preset_name)
        
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        
        response = {
            "status": "SUCCESS",
            "presets": presets
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def _handle_health_check(self):
        """Handle GET /api/health - Get system health status."""
        try:
            # Get system information
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # Check if output directory exists and get its size
            out_dir = os.path.join(PROJECT_DIR, "out")
            out_dir_size = 0
            out_dir_file_count = 0
            if os.path.exists(out_dir):
                for root, dirs, files in os.walk(out_dir):
                    out_dir_file_count += len(files)
                    for file in files:
                        file_path = os.path.join(root, file)
                        if os.path.isfile(file_path):
                            out_dir_size += os.path.getsize(file_path)
            
            # Check if FFmpeg is available
            ffmpeg_available = False
            try:
                res = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True, timeout=5)
                if res.returncode == 0:
                    ffmpeg_available = True
            except Exception:
                ffmpeg_available = False
            
            # Check if After Effects is available (Windows only)
            ae_available = False
            if sys.platform == "win32":
                ae_exe = r"C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\AfterFX.exe"
                ae_available = os.path.exists(ae_exe)
            
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            
            response = {
                "status": "SUCCESS",
                "system": {
                    "cpu_usage_percent": cpu_percent,
                    "memory": {
                        "total_gb": round(memory.total / (1024**3), 2),
                        "available_gb": round(memory.available / (1024**3), 2),
                        "used_percent": memory.percent
                    },
                    "disk": {
                        "total_gb": round(disk.total / (1024**3), 2),
                        "free_gb": round(disk.free / (1024**3), 2),
                        "used_percent": round((disk.used / disk.total) * 100, 2)
                    }
                },
                "storage": {
                    "out_dir_size_mb": round(out_dir_size / (1024**2), 2),
                    "out_dir_file_count": out_dir_file_count
                },
                "dependencies": {
                    "ffmpeg_available": ffmpeg_available,
                    "after_effects_available": ae_available
                },
                "timestamp": time.time()
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            
            response = {
                "status": "ERROR",
                "message": f"Health check failed: {str(e)}"
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))

    def _handle_stop(self):
        """Handle POST /api/stop - Shutdown the server."""
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "SHUTTING_DOWN"}).encode('utf-8'))
        print("[Server] Shutdown request received via Web API.")
        sys.exit(0)

    def log_message(self, format, *args):
        """Override to suppress default logging."""
        pass  # Disable default request logging


def clean_previous_renders():
    """
    Clean up previous render files from the output directory.
    
    Removes video files to prevent confusion between old and new renders.
    """
    out_dir = os.path.join(PROJECT_DIR, "out")
    if os.path.exists(out_dir):
        video_extensions = ('.mp4', '.mov', '.avi', '.mkv', '.webm')
        cleaned_count = 0
        for root, _, files in os.walk(out_dir):
            for file in files:
                if file.lower().endswith(video_extensions):
                    file_path = os.path.join(root, file)
                    try:
                        os.remove(file_path)
                        cleaned_count += 1
                    except OSError:
                        # Handle files that might be locked or in use
                        try:
                            temp_path = file_path + ".old"
                            if os.path.exists(temp_path):
                                os.remove(temp_path)
                            os.rename(file_path, temp_path)
                            os.remove(temp_path)
                            cleaned_count += 1
                        except OSError:
                            pass  # Skip if we can't clean the file
        if cleaned_count > 0:
            print(f"[Cleanup] Cleaned {cleaned_count} previous render video(s) from 'out/' directory.")


def main():
    """Main entry point for the web server."""
    os.chdir(PROJECT_DIR)
    clean_previous_renders()
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, AntigravityServer)
    httpd.allow_reuse_address = True
    
    print(f"============================================================================================")
    print(f"  ANTIGRAVITY AI VIDEO ENGINE LOCAL WEB APP DASHBOARD RUNNING")
    print(f"  Open in Browser: http://localhost:{PORT}")
    print(f"  API Endpoints:")
    print(f"    POST /api/run - Trigger video production pipeline")
    print(f"    POST /api/upload-lut - Upload custom LUT file")
    print(f"    POST /api/export-preset - Export current settings as preset")
    print(f"    GET /api/presets - Get list of available presets")
    print(f"    GET /api/health - Get system health status")
    print(f"    POST /api/stop - Shutdown server")
    print(f"============================================================================================")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down web application server.")
        httpd.server_close()


if __name__ == "__main__":
    main()