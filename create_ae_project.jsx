// Adobe After Effects 2025 Automation Script
(function () {
    app.beginUndoGroup("Create Antigravity AE Composition");

    // 1. Create New Project & Vertical Composition (1080x1920 @ 30 FPS, 15 seconds)
    var proj = app.project ? app.project : app.newProject();
    var compWidth = 1080;
    var compHeight = 1920;
    var pixelAspect = 1.0;
    var durationSeconds = 15.0;
    var frameRate = 30;

    var comp = proj.items.addComp(
        "ANTIGRAVITY_INSTA_EDIT",
        compWidth,
        compHeight,
        pixelAspect,
        durationSeconds,
        frameRate
    );

    // 2. Create Background Solid Layer
    var bgSolid = comp.layers.addSolid([0.05, 0.05, 0.08], "Background", compWidth, compHeight, pixelAspect);

    // 3. Add Text Title Layer
    var titleLayer = comp.layers.addText("AFTER EFFECTS AUTOMATION");
    var textProp = titleLayer.property("Source Text");
    var textDocument = textProp.value;
    textDocument.fontSize = 72;
    textDocument.fillColor = [1, 1, 1];
    textDocument.justification = ParagraphJustification.CENTER_JUSTIFY;
    textProp.setValue(textDocument);
    titleLayer.property("Position").setValue([compWidth / 2, compHeight / 2]);

    app.endUndoGroup();
})();
