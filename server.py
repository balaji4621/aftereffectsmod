import os
import sys
import json
import subprocess
import socketserver
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000
PROJECT_DIR = r"C:\Users\ADMIN\OneDrive\Desktop\ae"

class ReusableHTTPServer(socketserver.TCPServer):
    allow_reuse_address = True

class AntigravityServer(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        if path == "/":
            return os.path.join(PROJECT_DIR, "web", "index.html")
        if path.startswith("/out/"):
            return os.path.join(PROJECT_DIR, path.lstrip("/"))
        return os.path.join(PROJECT_DIR, path.lstrip("/"))

    def do_POST(self):
        if self.path == "/api/run":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
            try:
                payload = json.loads(post_data.decode('utf-8'))
            except Exception:
                payload = {}

            preset_name = payload.get("preset", "masterpiece")

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()

            log_output = []
            try:
                log_output.append(f"[Pipeline] Triggering master SSS++ engine with preset: '{preset_name}'...")
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
        elif self.path == "/api/stop":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "SHUTTING_DOWN"}).encode('utf-8'))
            print("[Server] Shutdown request received via Web API.")
            sys.exit(0)
        else:
            self.send_error(404, "Endpoint not found")

def clean_previous_renders():
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
                    except Exception:
                        try:
                            temp_path = file_path + ".old"
                            if os.path.exists(temp_path):
                                os.remove(temp_path)
                            os.rename(file_path, temp_path)
                            os.remove(temp_path)
                            cleaned_count += 1
                        except Exception:
                            pass
        print(f"[Cleanup] Cleaned {cleaned_count} previous render video(s) from 'out/' directory.")

def main():
    os.chdir(PROJECT_DIR)
    clean_previous_renders()
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, AntigravityServer)
    httpd.allow_reuse_address = True
    print(f"================================================================================")
    print(f"  ANTIGRAVITY AI VIDEO ENGINE LOCAL WEB APP DASHBOARD RUNNING")
    print(f"  Open in Browser: http://localhost:{PORT}")
    print(f"================================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down web application server.")
        httpd.server_close()

if __name__ == "__main__":
    main()
