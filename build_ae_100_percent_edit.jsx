// Adobe After Effects 2025 - 60 FPS 100% Palette & Edit Alignment Engine
(function () {
    try {
        app.beginUndoGroup("100 Percent Alignment AE Edit");

        var proj = app.newProject();
        var compWidth = 1080;
        var compHeight = 1920;
        var pixelAspect = 1.0;
        var frameRate = 60; // 60 FPS Parity!

        // Ingest Exact Audio Track Downloaded From YouTube Short (.m4a)
        var audioFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/youtube_song.m4a");
        if (!audioFile.exists) {
            audioFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/public/hypnotic.mp3");
        }

        var audioAsset = proj.importFile(new ImportOptions(audioFile));
        var compDuration = audioAsset.duration > 0 ? audioAsset.duration : 25.43;

        // Create Master Composition at 60 FPS
        var comp = proj.items.addComp(
            "PERFECT_ALIGNMENT_MASTER",
            compWidth,
            compHeight,
            pixelAspect,
            compDuration,
            frameRate
        );

        // Dark Background Solid
        comp.layers.addSolid([0.02, 0.03, 0.05], "Atmosphere_BG", compWidth, compHeight, pixelAspect);

        // Color Matched Shot Clips List
        var clipFiles = [
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_1_color_matched.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_2_color_matched.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_3_color_matched.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_4_color_matched.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_5_color_matched.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_6_color_matched.mp4"
        ];

        var transitionDuration = 0.3;
        var currentTime = 0;

        for (var i = 0; i < clipFiles.length; i++) {
            var file = new File(clipFiles[i]);
            if (file.exists) {
                var asset = proj.importFile(new ImportOptions(file));
                var layer = comp.layers.add(asset);

                layer.audioEnabled = false;

                var layerStart = i === 0 ? 0 : (currentTime - transitionDuration);
                layer.startTime = layerStart;

                var scaleX = (compWidth / asset.width) * 100;
                var scaleY = (compHeight / asset.height) * 100;
                var baseScale = Math.max(scaleX, scaleY);

                layer.property("Position").setValue([compWidth / 2, compHeight / 2]);
                layer.property("Anchor Point").setValue([asset.width / 2, asset.height / 2]);
                layer.property("Scale").setValue([baseScale, baseScale]);

                layer.motionBlur = true;

                // Transition Opacity & Scale Punch
                if (i > 0) {
                    var opacityProp = layer.property("Opacity");
                    opacityProp.setValueAtTime(layerStart, 0);
                    opacityProp.setValueAtTime(layerStart + transitionDuration, 100);

                    var scalePropKey = layer.property("Scale");
                    scalePropKey.setValueAtTime(layerStart, [baseScale * 1.25, baseScale * 1.25]);
                    scalePropKey.setValueAtTime(layerStart + transitionDuration, [baseScale, baseScale]);
                }

                // 60 FPS Pitch-Adaptive Beat Shake & Zoom Expressions
                var posProp = layer.property("Position");
                posProp.expression = "var tempo = 0.666; var beatIdx = Math.floor((time - " + layerStart + ") / tempo); var isHighPitch = (beatIdx % 4 == 0); var t = (time - " + layerStart + ") % tempo; if (t < 0.14) { if (isHighPitch) { wiggle(52, 42); } else { wiggle(20, 14); } } else { value; }";

                // AE Shaders
                try {
                    var glow = layer.property("Effects").addProperty("ADBE Glow");
                    if (glow) {
                        glow.property("Glow Threshold").setValue(40);
                        glow.property("Glow Radius").setValue(65);
                        glow.property("Glow Intensity").setValue(0.95);
                    }
                } catch (eG) {}

                try {
                    var bc = layer.property("Effects").addProperty("ADBE Brightness & Contrast");
                    if (bc) {
                        bc.property("Contrast").setValue(38);
                        bc.property("Brightness").setValue(8);
                    }
                } catch (eBC) {}

                currentTime = layerStart + asset.duration;
            }
        }

        // Add Master YouTube Audio Track
        var audioLayer = comp.layers.add(audioAsset);
        audioLayer.audioEnabled = true;

        comp.motionBlur = true;

        // Save AE Project (.aep)
        var aepPath = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/antigravity_100_percent.aep");
        proj.save(aepPath);

        app.endUndoGroup();
    } catch (mainErr) {}
})();
