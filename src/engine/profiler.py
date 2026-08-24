import os
import time
import json

class PipelineProfiler:
    def __init__(self, profile_output="out/render_profile.json"):
        self.profile_output = profile_output
        self.records = []
        self.start_time = None

    def start_stage(self, stage_name):
        self.start_time = time.time()
        print(f"[Profiler] Started profiling stage: '{stage_name}'")

    def end_stage(self, stage_name):
        if self.start_time is None:
            return
        elapsed = time.time() - self.start_time
        self.records.append({
            "stage": stage_name,
            "duration_sec": round(elapsed, 3),
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        })
        self.start_time = None
        self.save()

    def save(self):
        os.makedirs(os.path.dirname(self.profile_output), exist_ok=True)
        with open(self.profile_output, "w") as f:
            json.dump({
                "engine": "Antigravity SSS++ Profiler",
                "total_stages": len(self.records),
                "stages": self.records
            }, f, indent=2)
