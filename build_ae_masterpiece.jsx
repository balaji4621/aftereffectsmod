// Adobe After Effects 2025 Masterpiece Phonk Velocity Automation
(function () {
    app.beginUndoGroup("Antigravity AE Masterpiece Edit");

    var proj = app.newProject();
    var compWidth = 1080;
    var compHeight = 1920;
    var pixelAspect = 1.0;
    var durationSeconds = 15.0;
    var frameRate = 30;

    // Create Main Composition
    var comp = proj.items.addComp(
        "MASTERPIECE_PHONK_EDIT",
        compWidth,
        compHeight,
        pixelAspect,
        durationSeconds,
        frameRate
    );

    // 1. Add Atmospheric Background Layer
    var bgSolid = comp.layers.addSolid([0.03, 0.04, 0.07], "Atmosphere_BG", compWidth, compHeight, pixelAspect);

    // 2. Import & Setup Video Layer
    var videoFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/source_video.mp4");
    if (videoFile.exists) {
        var importOptions = new ImportOptions(videoFile);
        var videoAsset = proj.importFile(importOptions);
        var videoLayer = comp.layers.add(videoAsset);

        // Position & Scale
        videoLayer.property("Position").setValue([compWidth / 2, compHeight / 2]);
        videoLayer.property("Scale").setValue([102, 102]);

        // Enable Native AE Motion Blur
        videoLayer.motionBlur = true;

        // Apply Expression-driven Beat Shake & Velocity Zoom on Phonk Drop (95 BPM = 0.633s)
        var posProp = videoLayer.property("Position");
        posProp.expression = "var tempo = 0.633; var t = time % tempo; if (t < 0.12) { wiggle(35, 28); } else { value; }";

        var scaleProp = videoLayer.property("Scale");
        scaleProp.expression = "var tempo = 0.633; var t = time % tempo; if (t < 0.1) { [114, 114]; } else { [102, 102]; }";

        // 3. Add Native AE Glow Effect
        try {
            var glow = videoLayer.property("Effects").addProperty("ADBE Glow");
            if (glow) {
                glow.property("Glow Threshold").setValue(55);
                glow.property("Glow Radius").setValue(40);
                glow.property("Glow Intensity").setValue(0.7);
            }
        } catch (e) {}

        // 4. Add Native Brightness & Contrast Color Grade Pass
        try {
            var bc = videoLayer.property("Effects").addProperty("ADBE Brightness & Contrast");
            if (bc) {
                bc.property("Contrast").setValue(25);
                bc.property("Brightness").setValue(5);
            }
        } catch (e) {}
    }

    // Enable Comp Motion Blur
    comp.motionBlur = true;

    // Save AE Project (.aep)
    var aepPath = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/antigravity_masterpiece.aep");
    proj.save(aepPath);

    app.endUndoGroup();
})();
