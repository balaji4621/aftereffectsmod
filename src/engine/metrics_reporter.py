import os
import json
import time

def generate_qa_metrics_report(ssim_val=1.0, delta_e=0.0, output_json="out/qa_report.json"):
    os.makedirs(os.path.dirname(output_json), exist_ok=True)

    report_data = {
        "engine": "Antigravity SSS++ QA System",
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "metrics": {
            "ssim": round(ssim_val, 4),
            "ssim_pass": ssim_val >= 0.95,
            "delta_e2000": round(delta_e, 4),
            "delta_e_pass": delta_e <= 2.0
        },
        "overall_status": "PASSED" if (ssim_val >= 0.95 and delta_e <= 2.0) else "FAILED"
    }

    with open(output_json, "w") as f:
        json.dump(report_data, f, indent=2)

    print(f"[MetricsReporter] QA Metrics report written -> {output_json}")
    return output_json
