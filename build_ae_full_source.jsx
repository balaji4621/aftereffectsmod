// Adobe After Effects 2025 Full Source Automation Pipeline
(function () {
    app.beginUndoGroup("Antigravity Full Source AE Pipeline");

    var proj = app.newProject();
    var compWidth = 1080;
    var compHeight = 1920;
    var pixelAspect = 1.0;
    var frameRate = 30;

    // Import Source Video
    var videoFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/source_video.mp4");
    if (!videoFile.exists) {
        return;
    }

    var importOptions = new ImportOptions(videoFile);
    var videoAsset = proj.importFile(importOptions);
    var durationSeconds = videoAsset.duration > 0 ? videoAsset.duration : 30.34;

    // Create Main Composition matching full source duration
    var comp = proj.items.addComp(
        "ANTIGRAVITY_FULL_SOURCE",
        compWidth,
        compHeight,
        pixelAspect,
        durationSeconds,
        frameRate
    );

    // Add Dark Atmosphere Solid
    var bgSolid = comp.layers.addSolid([0.03, 0.04, 0.07], "Atmosphere_BG", compWidth, compHeight, pixelAspect);

    // Add Video Layer
    var videoLayer = comp.layers.add(videoAsset);

    // Position & Scale to fit 1080x1920
    videoLayer.property("Position").setValue([compWidth / 2, compHeight / 2]);

    // Calculate scale factor to cover 1080x1920 frame
    var scaleX = (compWidth / videoAsset.width) * 100;
    var scaleY = (compHeight / videoAsset.height) * 100;
    var maxScale = Math.max(scaleX, scaleY);
    videoLayer.property("Scale").setValue([maxScale, maxScale]);

    // Enable Native AE Motion Blur
    videoLayer.motionBlur = true;
    comp.motionBlur = true;

    // Expression-driven Beat Shake & Velocity Scale Punch (0.633s Phonk Drop)
    var posProp = videoLayer.property("Position");
    posProp.expression = "var tempo = 0.633; var t = time % tempo; if (t < 0.12) { wiggle(36, 30); } else { value; }";

    var scaleProp = videoLayer.property("Scale");
    scaleProp.expression = "var tempo = 0.633; var t = time % tempo; if (t < 0.1) { [" + (maxScale * 1.12) + ", " + (maxScale * 1.12) + "]; } else { [" + maxScale + ", " + maxScale + "]; }";

    // Add Native AE Glow Effect
    try {
        var glow = videoLayer.property("Effects").addProperty("ADBE Glow");
        if (glow) {
            glow.property("Glow Threshold").setValue(55);
            glow.property("Glow Radius").setValue(42);
            glow.property("Glow Intensity").setValue(0.75);
        }
    } catch (e) {}

    // Add Native AE Brightness & Contrast Effect
    try {
        var bc = videoLayer.property("Effects").addProperty("ADBE Brightness & Contrast");
        if (bc) {
            bc.property("Contrast").setValue(26);
            bc.property("Brightness").setValue(6);
        }
    } catch (e) {}

    // Save AE Project (.aep)
    var aepPath = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/antigravity_source.aep");
    proj.save(aepPath);

    app.endUndoGroup();
})();
