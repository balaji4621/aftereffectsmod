// Adobe After Effects 2025 - Sliced Multi-Clip Master Editing Pipeline
(function () {
    try {
        app.beginUndoGroup("Sliced Multi-Clip Master AE Edit");

        var proj = app.newProject();
        var compWidth = 1080;
        var compHeight = 1920;
        var pixelAspect = 1.0;
        var frameRate = 30;
        var compDuration = 30.0;

        // 1. Create Master Composition (1080x1920 @ 30 FPS)
        var comp = proj.items.addComp(
            "SLICED_MULTICLIP_MASTER",
            compWidth,
            compHeight,
            pixelAspect,
            compDuration,
            frameRate
        );

        // Atmosphere Solid BG
        comp.layers.addSolid([0.02, 0.03, 0.05], "Atmosphere_BG", compWidth, compHeight, pixelAspect);

        // List of Sliced Shot Clips
        var clipFiles = [
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_1.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_2.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_3.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_4.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_5.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_6.mp4"
        ];

        var currentTime = 0;
        var beatTempo = 0.666; // 90 BPM Super Slowed Phonk

        for (var i = 0; i < clipFiles.length; i++) {
            var file = new File(clipFiles[i]);
            if (file.exists) {
                var asset = proj.importFile(new ImportOptions(file));
                var layer = comp.layers.add(asset);

                layer.startTime = currentTime;

                // Position & Scale to Cover 1080x1920 Frame
                layer.property("Position").setValue([compWidth / 2, compHeight / 2]);

                var scaleX = (compWidth / asset.width) * 100;
                var scaleY = (compHeight / asset.height) * 100;
                var baseScale = Math.max(scaleX, scaleY);
                layer.property("Scale").setValue([baseScale, baseScale]);

                // Enable Motion Blur
                layer.motionBlur = true;

                // Calibrated Anchor Point Focus
                layer.property("Anchor Point").setValue([asset.width / 2, asset.height / 2]);

                // Expressions for Hypnotic Beat Zoom Punch & Shake
                var posProp = layer.property("Position");
                posProp.expression = "var tempo = 0.666; var beatIdx = Math.floor((time - " + currentTime + ") / tempo); var isHighPitch = (beatIdx % 4 == 0); var t = (time - " + currentTime + ") % tempo; if (t < 0.14) { if (isHighPitch) { wiggle(45, 36); } else { wiggle(18, 12); } } else { value; }";

                var scaleProp = layer.property("Scale");
                scaleProp.expression = "var tempo = 0.666; var beatIdx = Math.floor((time - " + currentTime + ") / tempo); var isHighPitch = (beatIdx % 4 == 0); var t = (time - " + currentTime + ") % tempo; if (t < 0.1) { var pulse = isHighPitch ? 1.16 : 1.05; [" + baseScale + " * pulse, " + baseScale + " * pulse]; } else { [" + baseScale + ", " + baseScale + "]; }";

                // Effects Passes
                try {
                    var glow = layer.property("Effects").addProperty("ADBE Glow");
                    if (glow) {
                        glow.property("Glow Threshold").setValue(46);
                        glow.property("Glow Radius").setValue(55);
                        glow.property("Glow Intensity").setValue(0.85);
                    }
                } catch (eG) {}

                try {
                    var bc = layer.property("Effects").addProperty("ADBE Brightness & Contrast");
                    if (bc) {
                        bc.property("Contrast").setValue(32);
                        bc.property("Brightness").setValue(6);
                    }
                } catch (eBC) {}

                currentTime += asset.duration;
            }
        }

        // Enable Comp Motion Blur
        comp.motionBlur = true;

        // Add Audio Track (Hypnotic Super Slowed Phonk)
        var audioFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/hypnotic.mp3");
        if (audioFile.exists) {
            var audioAsset = proj.importFile(new ImportOptions(audioFile));
            var audioLayer = comp.layers.add(audioAsset);
            audioLayer.audioEnabled = true;
        }

        // Save AE Project (.aep)
        var aepPath = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/antigravity_sliced.aep");
        proj.save(aepPath);

        app.endUndoGroup();
    } catch (mainErr) {}
})();
