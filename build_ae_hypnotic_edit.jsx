// Adobe After Effects 2025 - Hypnotic Super Slowed Phonk Masterpiece
(function () {
    app.beginUndoGroup("Hypnotic Super Slowed Phonk AE Edit");

    var proj = app.newProject();
    var compWidth = 1080;
    var compHeight = 1920;
    var pixelAspect = 1.0;
    var frameRate = 30;

    // 1. Import Video & Audio Assets
    var videoFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/source_video.mp4");
    var audioFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/hypnotic.mp3");

    if (!videoFile.exists) {
        return;
    }

    var videoAsset = proj.importFile(new ImportOptions(videoFile));
    var durationSeconds = videoAsset.duration > 0 ? videoAsset.duration : 30.34;

    // 2. Create Master 9:16 Vertical Composition
    var comp = proj.items.addComp(
        "HYPNOTIC_PHONK_MASTER",
        compWidth,
        compHeight,
        pixelAspect,
        durationSeconds,
        frameRate
    );

    // Dark Atmospheric Solid Background
    comp.layers.addSolid([0.02, 0.03, 0.05], "Dark_Atmosphere_BG", compWidth, compHeight, pixelAspect);

    // 3. Add Video Layer
    var videoLayer = comp.layers.add(videoAsset);
    videoLayer.property("Position").setValue([compWidth / 2, compHeight / 2]);

    // Calculate scale factor to cover 1080x1920 frame
    var scaleX = (compWidth / videoAsset.width) * 100;
    var scaleY = (compHeight / videoAsset.height) * 100;
    var baseScale = Math.max(scaleX, scaleY);
    videoLayer.property("Scale").setValue([baseScale, baseScale]);

    // Enable Native AE Motion Blur
    videoLayer.motionBlur = true;
    comp.motionBlur = true;

    // 4. Add Audio Layer (Hypnotic Super Slowed Phonk)
    if (audioFile.exists) {
        var audioAsset = proj.importFile(new ImportOptions(audioFile));
        var audioLayer = comp.layers.add(audioAsset);
        audioLayer.audioEnabled = true;
    }

    // 5. Hypnotic Zoom Pump & Beat Drop Camera Shake (90 BPM Tempo = 0.666s cycle)
    var posProp = videoLayer.property("Position");
    posProp.expression = "var tempo = 0.666; var t = time % tempo; if (t < 0.12) { wiggle(45, 36); } else { value; }";

    var scaleProp = videoLayer.property("Scale");
    var pulseScale = baseScale * 1.15;
    scaleProp.expression = "var tempo = 0.666; var t = time % tempo; if (t < 0.1) { [" + pulseScale + ", " + pulseScale + "]; } else { [" + baseScale + ", " + baseScale + "]; }";

    // 6. Native AE Moody Glow & High-Contrast Shader Passes
    try {
        var glow = videoLayer.property("Effects").addProperty("ADBE Glow");
        if (glow) {
            glow.property("Glow Threshold").setValue(48);
            glow.property("Glow Radius").setValue(52);
            glow.property("Glow Intensity").setValue(0.85);
        }
    } catch (e) {}

    try {
        var bc = videoLayer.property("Effects").addProperty("ADBE Brightness & Contrast");
        if (bc) {
            bc.property("Contrast").setValue(32);
            bc.property("Brightness").setValue(8);
        }
    } catch (e) {}

    // Save AE Project (.aep)
    var aepPath = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/hypnotic_phonk_master.aep");
    proj.save(aepPath);

    app.endUndoGroup();
})();
