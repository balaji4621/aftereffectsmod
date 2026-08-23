import os
import json
import hashlib
from datetime import datetime

class ManifestLedger:
    def __init__(self, manifest_path="out/manifest.json"):
        self.manifest_path = manifest_path
        os.makedirs(os.path.dirname(self.manifest_path), exist_ok=True)
        self.data = self._load()

    def _load(self):
        if os.path.exists(self.manifest_path):
            try:
                with open(self.manifest_path, "r") as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "project_id": "proj_sss_master",
            "state": "INITIALIZED",
            "hash_registry": {},
            "stages": {}
        }

    def save(self):
        with open(self.manifest_path, "w") as f:
            json.dump(self.data, f, indent=2)

    def calculate_file_hash(self, filepath):
        if not os.path.exists(filepath):
            return None
        hasher = hashlib.sha256()
        with open(filepath, "rb") as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
        return hasher.hexdigest()

    def register_asset(self, asset_key, filepath):
        file_hash = self.calculate_file_hash(filepath)
        if file_hash:
            self.data["hash_registry"][asset_key] = {
                "path": filepath,
                "hash": file_hash,
                "registered_at": datetime.utcnow().isoformat() + "Z"
            }
            self.save()
        return file_hash

    def is_stage_completed(self, stage_name, stage_hash):
        stage_info = self.data["stages"].get(stage_name)
        if stage_info and stage_info.get("status") == "COMPLETED":
            if stage_info.get("stage_hash") == stage_hash:
                return True
        return False

    def mark_stage_start(self, stage_name, stage_hash):
        self.data["stages"][stage_name] = {
            "status": "IN_PROGRESS",
            "stage_hash": stage_hash,
            "started_at": datetime.utcnow().isoformat() + "Z"
        }
        self.save()

    def mark_stage_complete(self, stage_name, stage_hash, outputs=None):
        self.data["stages"][stage_name] = {
            "status": "COMPLETED",
            "stage_hash": stage_hash,
            "completed_at": datetime.utcnow().isoformat() + "Z",
            "outputs": outputs or []
        }
        self.data["state"] = "IN_PROGRESS"
        self.save()

    def mark_stage_failed(self, stage_name, stage_hash, error_msg):
        self.data["stages"][stage_name] = {
            "status": "FAILED",
            "stage_hash": stage_hash,
            "failed_at": datetime.utcnow().isoformat() + "Z",
            "error": error_msg
        }
        self.data["state"] = "ERROR"
        self.save()
