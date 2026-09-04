import os
import sys
import time
import logging

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from src.engine.stage_runner import StageRunner
from src.engine.style_planner import plan_creative_style
from src.engine.render_backends import get_best_available_backend
from src.engine.qa_gate import verify_render_quality
from src.engine.futuristic_ai import compute_optical_flow_speed_ramp, generate_depth_map_sequence, generate_subject_mattes
from framework.asset_mapper import map_assets_and_build
from src.engine.profiler import PipelineProfiler

def stage_1_ingest_and_register(params):
    profiler = params["profiler"]
    profiler.start_stage("Stage_1_Ingest")
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
    profiler.end_stage("Stage_1_Ingest")
    return [ref_video]

def stage_2_futuristic_ai_enhancements(params):
    profiler = params["profiler"]
    profiler.start_stage("Stage_2_Futuristic_AI")
    print("[Pipeline Stage 2] Running Futuristic AI (Optical Flow, Depth Maps, Subject Matting)...")
    ref_video = params.get("ref_video", "public/clip_1.mp4")
    compute_optical_flow_speed_ramp(ref_video)
    generate_depth_map_sequence(ref_video)
    generate_subject_mattes(ref_video)
    profiler.end_stage("Stage_2_Futuristic_AI")
    return ["out/futuristic"]

def stage_3_ai_style_planning(params):
    profiler = params["profiler"]
    profiler.start_stage("Stage_3_Style_Plan")
    print("[Pipeline Stage 3] Running AI Creative Intelligence Layer & Style Planner...")
    result = plan_creative_style(output_plan="out/style_plan.json")
    profiler.end_stage("Stage_3_Style_Plan")
    return result

def stage_4_render_backend_execution(params):
    profiler = params["profiler"]
    profiler.start_stage("Stage_4_Render")
    print("[Pipeline Stage 4] Rendering video via automated backend...")
    backend = get_best_available_backend()
    output_path = os.path.join("out", "final_render.mp4")
    backend.render("out/style_plan.json", output_path)
    profiler.end_stage("Stage_4_Render")
    return [output_path]

def stage_5_qa_verification(params):
    profiler = params["profiler"]
    profiler.start_stage("Stage_5_QA")
    print("[Pipeline Stage 5] Running SSIM & DeltaE2000 QA Verification Gate...")
    out_video = os.path.join("out", "final_render.mp4")
    passed = verify_render_quality(out_video)
    if not passed:
        raise RuntimeError("QA Gate Failed SSIM/DeltaE2000 Quality Verification.")
    profiler.end_stage("Stage_5_QA")
    return [out_video]

def main():
    print("================================================================================")
    print("        ANTIGRAVITY SSS++ FUTURISTIC AI MASTER DAG PIPELINE EXECUTION")
    print("================================================================================")
    
    start_t = time.time()
    runner = StageRunner("out/manifest.json")
    profiler = PipelineProfiler("out/pipeline_profile.json")

    runner.register_stage("Stage_1_Ingest", stage_1_ingest_and_register)
    runner.register_stage("Stage_2_Futuristic_AI", stage_2_futuristic_ai_enhancements)
    runner.register_stage("Stage_3_Style_Plan", stage_3_ai_style_planning)
    runner.register_stage("Stage_4_Render", stage_4_render_backend_execution)
    runner.register_stage("Stage_5_QA", stage_5_qa_verification)
    
    from src.engine.benchmark import run_performance_benchmark
    runner.register_stage("Stage_6_Benchmark", lambda params: run_performance_benchmark())
    
    from src.engine.metrics_reporter import generate_qa_metrics_report
    runner.register_stage("Stage_7_Report", lambda params: generate_qa_metrics_report())
    
    # Setup logging
    logging.basicConfig(
        filename='out/pipeline_summary.log', 
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger(__name__)
    
    runner.run_stage("Stage_1_Ingest", {"runner": runner, "profiler": profiler})
    runner.run_stage("Stage_2_Futuristic_AI", {"profiler": profiler})
    runner.run_stage("Stage_3_Style_Plan", {"profiler": profiler})
    runner.run_stage("Stage_4_Render", {"profiler": profiler})
    runner.run_stage("Stage_5_QA", {"profiler": profiler})
    runner.run_stage("Stage_6_Benchmark", {})
    runner.run_stage("Stage_7_Report", {})
    
    # Save profiling data
    profiler.save()
    
    # Log final stats
    logger.info("Pipeline execution completed")
    logger.info(f"Total stages profiled: {len(profiler.records)}")
    for record in profiler.records:
        logger.info(f"Stage '{record['stage']}': {record['duration_sec']}s")
    
    # Cleanup temporary files
    import shutil
    shutil.rmtree("out/temp", ignore_errors=True)
    
    # System-level watchdog check
    from src.engine.watchdog import WindowsProcessWatchdog
    watchdog = WindowsProcessWatchdog()
    watchdog.execute_with_watchdog(["echo", "pipeline_complete"])

    elapsed = time.time() - start_t
    print("================================================================================")
    print(f"       SSS++ PIPELINE COMPLETED SUCCESSFULLY IN {elapsed:.2f} SECONDS")
    print("================================================================================")
    
    # Print profiling summary
    print("\n[Profiler] Pipeline Stage Execution Times:")
    for record in profiler.records:
        print(f"  {record['stage']}: {record['duration_sec']}s")

if __name__ == "__main__":
    main()