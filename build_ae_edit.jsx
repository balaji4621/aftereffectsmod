// Adobe After Effects 2025 Master Compositing & Editing Automation
(function () {
    app.beginUndoGroup("Antigravity Native AE Compositing Pipeline");

    var proj = app.newProject();
    var compWidth = 1080;
    var compHeight = 1920;
    var pixelAspect = 1.0;
    var durationSeconds = 15.0;
    var frameRate = 30;

    // Create Master Composition
    var comp = proj.items.addComp(
        "ANTIGRAVITY_AE_MASTER",
        compWidth,
        compHeight,
        pixelAspect,
        durationSeconds,
        frameRate
    );

    // Import Source Video
    var videoFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/source_video.mp4");
    if (videoFile.exists) {
        var importOptions = new ImportOptions(videoFile);
        var videoAsset = proj.importFile(importOptions);
        var videoLayer = comp.layers.add(videoAsset);

        // Scale to fit 1080x1920 story frame
        videoLayer.property("Scale").setValue([100, 100]);
        videoLayer.property("Position").setValue([compWidth / 2, compHeight / 2]);

        // Keyframe Beat Impact Scale Punches (every 19 frames @ 30 FPS)
        var scaleProp = videoLayer.property("Scale");
        var numBeats = Math.floor(durationSeconds * frameRate / 19);
        for (var b = 0; b < numBeats; b++) {
            var beatTime = (b * 19) / frameRate;
            scaleProp.setValueAtTime(beatTime, [110, 110]);
            scaleProp.setValueAtTime(beatTime + 0.1, [100, 100]);
        }
    }

    // Save AE Project (.aep)
    var aepPath = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/antigravity_ae_master.aep");
    proj.save(aepPath);

    app.endUndoGroup();
})();
