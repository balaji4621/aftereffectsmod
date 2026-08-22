// Adobe After Effects 2025 - Calibrated Object Anchor Point Focus Engine
(function () {
    app.beginUndoGroup("Calibrated Point Focus Edit");

    var proj = app.newProject();
    var compWidth = 1080;
    var compHeight = 1920;
    var pixelAspect = 1.0;
    var frameRate = 30;

    // 1. Import Source Assets
    var videoFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/source_video.mp4");
    var audioFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/hypnotic.mp3");

    if (!videoFile.exists) {
        return;
    }

    var videoAsset = proj.importFile(new ImportOptions(videoFile));
    var durationSeconds = videoAsset.duration > 0 ? videoAsset.duration : 30.34;

    // 2. Create Master Composition (1080x1920 @ 30 FPS)
    var comp = proj.items.addComp(
        "CALIBRATED_POINT_MASTER",
        compWidth,
        compHeight,
        pixelAspect,
        durationSeconds,
        frameRate
    );

    // Dark Atmosphere Solid Background
    comp.layers.addSolid([0.02, 0.03, 0.05], "Atmosphere_BG", compWidth, compHeight, pixelAspect);

    // 3. Add Video Layer
    var videoLayer = comp.layers.add(videoAsset);

    // Calculate Scale Factor to Cover 1080x1920 Frame
    var scaleX = (compWidth / videoAsset.width) * 100;
    var scaleY = (compHeight / videoAsset.height) * 100;
    var baseScale = Math.max(scaleX, scaleY);
    videoLayer.property("Scale").setValue([baseScale, baseScale]);

    // Calibrate Focal Anchor Point to Object Center Target Point
    videoLayer.property("Anchor Point").setValue([videoAsset.width / 2, videoAsset.height / 2]);
    videoLayer.property("Position").setValue([compWidth / 2, compHeight / 2]);

    // Enable Native AE Motion Blur
    videoLayer.motionBlur = true;
    comp.motionBlur = true;

    // 4. Calibrated Point Object Focus Expressions (Camera & Beats Poked at Calibrated Anchor Point)
    var posProp = videoLayer.property("Position");
    posProp.expression = "var tempo = 0.666; var beatIdx = Math.floor(time / tempo); var isHighPitch = (beatIdx % 4 == 0) || (beatIdx >= 12 && beatIdx <= 28); var t = time % tempo; if (t < 0.14) { if (isHighPitch) { wiggle(48, 38); } else { wiggle(18, 12); } } else { value; }";

    var scaleProp = videoLayer.property("Scale");
    scaleProp.expression = "var tempo = 0.666; var beatIdx = Math.floor(time / tempo); var isHighPitch = (beatIdx % 4 == 0) || (beatIdx >= 12 && beatIdx <= 28); var t = time % tempo; if (t < 0.1) { var pulse = isHighPitch ? 1.18 : 1.05; [" + baseScale + " * pulse, " + baseScale + " * pulse]; } else { [" + baseScale + ", " + baseScale + "]; }";

    // 5. Add Audio Track (Hypnotic Super Slowed Phonk)
    if (audioFile.exists) {
        var audioAsset = proj.importFile(new ImportOptions(audioFile));
        var audioLayer = comp.layers.add(audioAsset);
        audioLayer.audioEnabled = true;
    }

    // 6. Native AE Hypnotic Shaders & Color Grading Passes
    try {
        var glow = videoLayer.property("Effects").addProperty("ADBE Glow");
        if (glow) {
            glow.property("Glow Threshold").setValue(45);
            glow.property("Glow Radius").setValue(60);
            glow.property("Glow Intensity").setValue(0.9);
        }
    } catch (e1) {}

    try {
        var bc = videoLayer.property("Effects").addProperty("ADBE Brightness & Contrast");
        if (bc) {
            bc.property("Contrast").setValue(34);
            bc.property("Brightness").setValue(7);
        }
    } catch (e2) {}

    // Save AE Project (.aep)
    var aepPath = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/antigravity_calibrated.aep");
    proj.save(aepPath);

    app.endUndoGroup();
})();
