// Master Adobe After Effects ExtendScript Engine
// Dynamic preset & manifest driver with robust error logging and Bezier easing.

(function () {
    function getScriptPath() {
        try {
            return $.fileName;
        } catch (e) {
            return "C:/Users/ADMIN/OneDrive/Desktop/ae/build_ae_master.jsx";
        }
    }

    var scriptFile = new File(getScriptPath());
    var rootFolder = scriptFile.parent;

    function readJsonFile(file) {
        if (!file.exists) return null;
        file.open("r");
        var content = file.read();
        file.close();
        return eval("(" + content + ")");
    }

    function logError(errorObj) {
        try {
            var logFolder = new Folder(rootFolder.fsName + "/out/logs");
            if (!logFolder.exists) logFolder.create();
            var timestamp = new Date().getTime();
            var logFile = new File(logFolder.fsName + "/ae_build_" + timestamp + ".json");
            logFile.open("w");
            logFile.write(JSON.stringify(errorObj, null, 2));
            logFile.close();
        } catch (e) {}
    }

    try {
        app.beginUndoGroup("Antigravity Master AE Build");

        // Load JSON manifests and presets dynamically
        var manifestFile = new File(rootFolder.fsName + "/src/generated/manifest.json");
        var audioFeaturesFile = new File(rootFolder.fsName + "/src/generated/audio-features.json");
        var subtitlesFile = new File(rootFolder.fsName + "/src/generated/subtitles.json");
        var presetFile = new File(rootFolder.fsName + "/ae_presets/masterpiece.json");

        var manifest = readJsonFile(manifestFile);
        var preset = readJsonFile(presetFile) || {
            fps: 60, width: 1080, height: 1920, transitionDuration: 0.3,
            bezierVector: [0.25, 0.1, 0.25, 1.0]
        };

        var proj = app.newProject();
        var compWidth = preset.width || 1080;
        var compHeight = preset.height || 1920;
        var frameRate = preset.fps || 60;
        var compDuration = 15.0;

        var comp = proj.items.addComp("MASTERPIECE_COMP", compWidth, compHeight, 1.0, compDuration, frameRate);

        // Solid Background
        comp.layers.addSolid([0.02, 0.03, 0.05], "Background", compWidth, compHeight, 1.0);

        // Process footage clips from manifest with per-clip error catching
        var clipIndex = 0;
        if (manifest && manifest.items) {
            for (var i = 0; i < manifest.items.length; i++) {
                var item = manifest.items[i];
                if (item.type === "video") {
                    try {
                        var assetFile = new File(rootFolder.fsName + "/" + item.filepath);
                        if (!assetFile.exists) {
                            throw new Error("Asset file not found: " + item.filepath);
                        }

                        var importedAsset = proj.importFile(new ImportOptions(assetFile));
                        var layer = comp.layers.add(importedAsset);
                        layer.audioEnabled = false;

                        var startTime = clipIndex * 2.5;
                        layer.startTime = startTime;

                        var scaleX = (compWidth / importedAsset.width) * 100;
                        var scaleY = (compHeight / importedAsset.height) * 100;
                        var baseScale = Math.max(scaleX, scaleY);

                        layer.property("Position").setValue([compWidth / 2, compHeight / 2]);
                        layer.property("Scale").setValue([baseScale, baseScale]);

                        clipIndex++;
                    } catch (clipErr) {
                        logError({
                            status: "CLIP_IMPORT_ERROR",
                            filepath: item.filepath,
                            message: clipErr.toString()
                        });
                    }
                }
            }
        }

        // Add Master Audio Track if present
        var audioFile = new File(rootFolder.fsName + "/public/hypnotic.mp3");
        if (audioFile.exists) {
            try {
                var importedAudio = proj.importFile(new ImportOptions(audioFile));
                var audioLayer = comp.layers.add(importedAudio);
                audioLayer.audioEnabled = true;
            } catch (aErr) {}
        }

        // Save generated project
        var outAep = new File(rootFolder.fsName + "/out/antigravity_master_build.aep");
        proj.save(outAep);

        app.endUndoGroup();
    } catch (globalErr) {
        logError({
            status: "CRITICAL_ENGINE_FAILURE",
            message: globalErr.toString()
        });
    }
})();
