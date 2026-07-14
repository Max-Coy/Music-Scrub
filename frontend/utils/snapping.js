import { timelineState } from "/static/state/timelineState.js";

export function snapTime(time) {

    let majorInterval;

    if(timelineState.tickMode === "fixed") {
        majorInterval = timelineState.fixedTickInterval;
    }else {
        majorInterval = timelineState.duration / timelineState.majorTickCount;
    }

    const minorInterval = majorInterval / (timelineState.minorTicksPerMajor + 1);

    const snappedTime = Math.floor(time/minorInterval) * minorInterval;

    return Math.max(0, Math.min(timelineState.projectDuration, snappedTime));
}