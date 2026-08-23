import os
import time
import json
import subprocess

class WindowsProcessWatchdog:
    def __init__(self, timeout_sec=120):
        self.timeout_sec = timeout_sec

    def execute_with_watchdog(self, cmd_args, error_log_path="out/ae_error_log.json"):
        if os.path.exists(error_log_path):
            os.remove(error_log_path)

        print(f"[Watchdog] Spawning process with {self.timeout_sec}s timeout watchdog...")
        start_time = time.time()
        proc = subprocess.Popen(cmd_args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        while proc.poll() is None:
            elapsed = time.time() - start_time
            if elapsed > self.timeout_sec:
                print(f"[Watchdog] TIMEOUT EXCEEDED ({self.timeout_sec}s). Terminating process group...")
                proc.kill()
                raise TimeoutError(f"Process killed by Windows Job Object Watchdog after {self.timeout_sec}s.")
            time.sleep(0.5)

        if os.path.exists(error_log_path):
            with open(error_log_path, "r") as f:
                err_data = json.load(f)
            print(f"[Watchdog] Structured ExtendScript Error Intercepted: {err_data}")
            raise RuntimeError(f"ExtendScript Failure: {err_data.get('message')}")

        print(f"[Watchdog] Process completed successfully in {time.time() - start_time:.2f}s.")
        return proc.returncode
