import hashlib
from src.engine.manifest import ManifestLedger

class StageRunner:
    def __init__(self, manifest_path="out/manifest.json"):
        self.ledger = ManifestLedger(manifest_path)
        self.stages = {}

    def register_stage(self, stage_name, fn, dependencies=None):
        self.stages[stage_name] = {
            "fn": fn,
            "dependencies": dependencies or []
        }

    def compute_stage_hash(self, stage_name, params):
        hasher = hashlib.sha256()
        hasher.update(stage_name.encode('utf-8'))
        hasher.update(str(params).encode('utf-8'))
        
        # Include registered asset hashes
        for key, asset in self.ledger.data.get("hash_registry", {}).items():
            hasher.update(asset["hash"].encode('utf-8'))
            
        return hasher.hexdigest()

    def run_stage(self, stage_name, params=None):
        params = params or {}
        if stage_name not in self.stages:
            raise ValueError(f"Stage '{stage_name}' not registered in DAG.")

        stage_hash = self.compute_stage_hash(stage_name, params)

        if self.ledger.is_stage_completed(stage_name, stage_hash):
            print(f"[StageRunner] Skipping '{stage_name}' (Idempotent: matching hash in manifest.json)")
            return True

        print(f"[StageRunner] Executing stage: '{stage_name}'...")
        self.ledger.mark_stage_start(stage_name, stage_hash)

        try:
            outputs = self.stages[stage_name]["fn"](params)
            self.ledger.mark_stage_complete(stage_name, stage_hash, outputs=outputs)
            print(f"[StageRunner] Completed stage: '{stage_name}'")
            return True
        except Exception as e:
            self.ledger.mark_stage_failed(stage_name, stage_hash, str(e))
            print(f"[StageRunner] Failed stage '{stage_name}': {e}")
            raise e
