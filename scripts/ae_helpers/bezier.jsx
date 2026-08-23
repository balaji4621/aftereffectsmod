// ExtendScript Bezier Vector Helper
// Translates 4-point Cubic Bezier vectors [x1, y1, x2, y2] into After Effects KeyframeEase influence and speed vectors.

function createAEKeyframeEase(bezierVector, valueDelta, durationSec) {
    if (!bezierVector || bezierVector.length !== 4) {
        bezierVector = [0.25, 0.1, 0.25, 1.0]; // Default standard ease
    }

    var x1 = bezierVector[0];
    var y1 = bezierVector[1];
    var x2 = bezierVector[2];
    var y2 = bezierVector[3];

    if (durationSec <= 0) durationSec = 0.001;

    // Influence percentage (0 to 100%)
    var incomingInfluence = Math.max(0.1, Math.min(100, (1 - x2) * 100));
    var outgoingInfluence = Math.max(0.1, Math.min(100, x1 * 100));

    // Instantaneous speed at keyframe handles (units per second)
    var incomingSpeed = (1 - y2) / (1 - x2 + 1e-5) * (valueDelta / durationSec);
    var outgoingSpeed = y1 / (x1 + 1e-5) * (valueDelta / durationSec);

    var easeIn = new KeyframeEase(incomingSpeed, incomingInfluence);
    var easeOut = new KeyframeEase(outgoingSpeed, outgoingInfluence);

    return {
        easeIn: easeIn,
        easeOut: easeOut
    };
}

function applyBezierToLayerProperty(property, times, values, bezierVector) {
    if (!property || !times || times.length < 2) return;

    property.setValuesAtTimes(times, values);

    for (var i = 0; i < times.length - 1; i++) {
        var duration = times[i + 1] - times[i];
        var val1 = values[i];
        var val2 = values[i + 1];

        var delta = 0;
        if (typeof val1 === 'number') {
            delta = val2 - val1;
        } else if (val1 instanceof Array && val1.length > 0) {
            delta = val2[0] - val1[0];
        }

        var aeEase = createAEKeyframeEase(bezierVector, delta, duration);

        if (property.propertyValueType === PropertyValueType.TwoD_SPATIAL ||
            property.propertyValueType === PropertyValueType.ThreeD_SPATIAL) {
            property.setTemporalEaseAtKey(i + 1, [aeEase.easeOut]);
            property.setTemporalEaseAtKey(i + 2, [aeEase.easeIn]);
        } else if (property.propertyValueType === PropertyValueType.OneD) {
            property.setTemporalEaseAtKey(i + 1, [aeEase.easeOut]);
            property.setTemporalEaseAtKey(i + 2, [aeEase.easeIn]);
        }
    }
}
