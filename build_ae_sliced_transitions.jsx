// Adobe After Effects 2025 - Sliced Multi-Clip Edit with Organic Transitions
(function () {
    try {
        app.beginUndoGroup("Sliced Edit with Organic Transitions");

        var proj = app.newProject();
        var compWidth = 1080;
        var compHeight = 1920;
        var pixelAspect = 1.0;
        var frameRate = 30;

        // List of Sliced Clips
        var clipFiles = [
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_1.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_2.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_3.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_4.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_5.mp4",
            "C:/Users/ADMIN/OneDrive/Desktop/ae/public/clip_6.mp4"
        ];

        var transitionDuration = 0.3; // 0.3s transition overlap
        var compDuration = 30.0;

        // Create Master Composition
        var comp = proj.items.addComp(
            "TRANSITION_MULTICLIP_MASTER",
            compWidth,
            compHeight,
            pixelAspect,
            compDuration,
            frameRate
        );

        // Dark Background Solid
        comp.layers.addSolid([0.02, 0.03, 0.05], "Atmosphere_BG", compWidth, compHeight, pixelAspect);

        var currentTime = 0;

        for (var i = 0; i < clipFiles.length; i++) {
            var file = new File(clipFiles[i]);
            if (file.exists) {
                var asset = proj.importFile(new ImportOptions(file));
                var layer = comp.layers.add(asset);

                // Start layer with slight transition overlap
                var layerStart = i === 0 ? 0 : (currentTime - transitionDuration);
                layer.startTime = layerStart;

                // Scale to fit 1080x1920
                var scaleX = (compWidth / asset.width) * 100;
                var scaleY = (compHeight / asset.height) * 100;
                var baseScale = Math.max(scaleX, scaleY);

                layer.property("Position").setValue([compWidth / 2, compHeight / 2]);
                layer.property("Anchor Point").setValue([asset.width / 2, asset.height / 2]);
                layer.property("Scale").setValue([baseScale, baseScale]);

                // Enable Motion Blur & Pixel Motion Frame Blending
                layer.motionBlur = true;

                // Keyframe Organic Transition: Opacity Fade-In + Zoom Warp Punch at Cut Point
                if (i > 0) {
                    var opacityProp = layer.property("Opacity");
                    opacityProp.setValueAtTime(layerStart, 0);
                    opacityProp.setValueAtTime(layerStart + transitionDuration, 100);

                    var scalePropKey = layer.property("Scale");
                    scalePropKey.setValueAtTime(layerStart, [baseScale * 1.25, baseScale * 1.25]);
                    scalePropKey.setValueAtTime(layerStart + transitionDuration, [baseScale, baseScale]);
                }

                // Beat Shake & Zoom Pulse Expressions
                var posProp = layer.property("Position");
                posProp.expression = "var tempo = 0.666; var beatIdx = Math.floor((time - " + layerStart + ") / tempo); var isHighPitch = (beatIdx % 4 == 0); var t = (time - " + layerStart + ") % tempo; if (t < 0.14) { if (isHighPitch) { wiggle(45, 36); } else { wiggle(18, 12); } } else { value; }";

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

                currentTime = layerStart + asset.duration;
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
        var aepPath = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/antigravity_transitions.aep");
        proj.save(aepPath);

        app.endUndoGroup();
    } catch (mainErr) {}
})();
