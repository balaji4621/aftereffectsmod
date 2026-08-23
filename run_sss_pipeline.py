import os
import sys
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from src.engine.stage_runner import StageRunner
from src.engine.style_planner import plan_creative_style
from src.engine.render_backends import get_best_available_backend
from src.engine.qa_gate import verify_render_quality
from src.engine.futuristic_ai import compute_optical_flow_speed_ramp, generate_depth_map_sequence, generate_subject_mattes
from framework.asset_mapper import map_assets_and_build

def stage_1_ingest_and_register(params):
    runner = params["runner"]
    print("[Pipeline Stage 1] Registering raw assets & color matching user footage...")
    
    public_dir = r"C:\Users\ADMIN\OneDrive\Desktop\ae\public"
    uploaded_files = [f for f in os.listdir(public_dir) if f.lower().endswith(('.mp4', '.mov', '.webm'))]
    
    # Ensure clip_1.mp4 to clip_6.mp4 exist for composite consistency
    primary_file = os.path.join(public_dir, uploaded_files[0]) if uploaded_files else os.path.join(public_dir, "clip_1.mp4")
    
    for i in range(1, 7):
        target_clip = os.path.join(public_dir, f"clip_{i}.mp4")
        if not os.path.exists(target_clip) and os.path.exists(primary_file):
            import shutil
            shutil.copyfile(primary_file, target_clip)
            print(f"[Ingest] Prepared clip_{i}.mp4 from intake asset.")

    # Execute asset mapper & color transfer
    try:
        map_assets_and_build("out/master_template.json")
    except Exception as e:
        print(f"[Ingest Warning] Asset mapping notice: {e}")

    ref_video = os.path.join(public_dir, "clip_1.mp4")
    if os.path.exists(ref_video):
        runner.ledger.register_asset("reference_video", ref_video)
    return [ref_video]

def stage_2_futuristic_ai_enhancements(params):
    print("[Pipeline Stage 2] Running Futuristic AI (Optical Flow, Depth Maps, Subject Matting)...")
    ref_video = params.get("ref_video", "public/clip_1.mp4")
    compute_optical_flow_speed_ramp(ref_video)
    generate_depth_map_sequence(ref_video)
    generate_subject_mattes(ref_video)
    return ["out/futuristic"]

def stage_3_ai_style_planning(params):
    print("[Pipeline Stage 3] Running AI Creative Intelligence Layer & Style Planner...")
    return plan_creative_style(output_plan="out/style_plan.json")

def stage_4_render_backend_execution(params):
    print("[Pipeline Stage 4] Rendering video via automated backend...")
    backend = get_best_available_backend()
    output_path = os.path.join("out", "final_render.mp4")
    backend.render("out/style_plan.json", output_path)
    return [output_path]

def stage_5_qa_verification(params):
    print("[Pipeline Stage 5] Running SSIM & DeltaE2000 QA Verification Gate...")
    out_video = os.path.join("out", "final_render.mp4")
    passed = verify_render_quality(out_video)
    if not passed:
        raise RuntimeError("QA Gate Failed SSIM/DeltaE2000 Quality Verification.")
    return [out_video]

def main():
    print("================================================================================")
    print("        ANTIGRAVITY SSS++ FUTURISTIC AI MASTER DAG PIPELINE EXECUTION")
    print("================================================================================")
    
    start_t = time.time()
    runner = StageRunner("out/manifest.json")

    runner.register_stage("Stage_1_Ingest", stage_1_ingest_and_register)
    runner.register_stage("Stage_2_Futuristic_AI", stage_2_futuristic_ai_enhancements)
    runner.register_stage("Stage_3_Style_Plan", stage_3_ai_style_planning)
    runner.register_stage("Stage_4_Render", stage_4_render_backend_execution)
    runner.register_stage("Stage_5_QA", stage_5_qa_verification)

    runner.run_stage("Stage_1_Ingest", {"runner": runner})
    runner.run_stage("Stage_2_Futuristic_AI", {})
    runner.run_stage("Stage_3_Style_Plan", {})
    runner.run_stage("Stage_4_Render", {})
    runner.run_stage("Stage_5_QA", {})

    elapsed = time.time() - start_t
    print("================================================================================")
    print(f"       SSS++ PIPELINE COMPLETED SUCCESSFULLY IN {elapsed:.2f} SECONDS")
    print("================================================================================")

if __name__ == "__main__":
    main()
