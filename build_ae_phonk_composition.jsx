// Adobe After Effects 2025 Automation Pipeline
(function () {
    app.beginUndoGroup("Build Antigravity Phonk Edit");

    // Create New AE Project
    var proj = app.newProject();
    var compWidth = 1080;
    var compHeight = 1920;
    var pixelAspect = 1.0;
    var durationSeconds = 15.0;
    var frameRate = 30;

    // Create Main Composition
    var comp = proj.items.addComp(
        "PHONK_VELOCITY_EDIT",
        compWidth,
        compHeight,
        pixelAspect,
        durationSeconds,
        frameRate
    );

    // Create Dark Atmospheric Background Solid
    var bg = comp.layers.addSolid([0.04, 0.05, 0.08], "Background_Atmosphere", compWidth, compHeight, pixelAspect);

    // Save AE Project file (.aep)
    var projectFile = new File("C:/Users/ADMIN/OneDrive/Desktop/ae/antigravity_phonk.aep");
    proj.save(projectFile);

    app.endUndoGroup();
})();
