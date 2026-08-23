import os
import json

def plan_creative_style(analysis_json="out/master_template.json", output_plan="out/style_plan.json"):
    os.makedirs(os.path.dirname(output_plan), exist_ok=True)
    
    if os.path.exists(analysis_json):
        with open(analysis_json, "r") as f:
            template_data = json.load(f)
    else:
        template_data = {
            "metadata": {"duration_sec": 15.0, "fps": 30.0, "total_cuts": 4},
            "color_profile": {"mean_bgr": [128, 128, 128], "std_bgr": [50, 50, 50]},
            "clips": []
        }

    style_plan = {
        "version": "SSS++ 1.0",
        "audio_intelligence": {
            "bpm": 128.0,
            "energy_curve": "high_transient_boost",
            "transients_sec": [0.0, 1.25, 2.5, 3.75, 5.0, 6.25, 7.5, 8.75, 10.0]
        },
        "color_transfer_policy": {
            "method": "GPU_3D_LUT_NORMALIZATION",
            "mean_bgr": template_data.get("color_profile", {}).get("mean_bgr", [128, 128, 128]),
            "std_bgr": template_data.get("color_profile", {}).get("std_bgr", [50, 50, 50])
        },
        "composition_directives": {
            "resolution": [1080, 1920],
            "fps": template_data.get("metadata", {}).get("fps", 60.0),
            "vfx_stack": ["ChromaticAberration", "FilmGrain", "Vignette", "ColorGrade", "MotionBlurLayer"],
            "camera_shake_intensity": 0.85
        },
        "clip_mappings": template_data.get("clips", [])
    }

    with open(output_plan, "w") as f:
        json.dump(style_plan, f, indent=2)

    print(f"[StylePlanner] Generated AI Creative Plan -> {output_plan}")
    return [output_plan]
