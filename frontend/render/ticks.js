import { timelineState } from "/static/state/timelineState.js";

export function generateTicks() {
    const ticks = [];

    let majorInterval;

    if(timelineState.tickMode === "fixed") {
        majorInterval = timelineState.fixedTickInterval;
    }else {
        majorInterval = timelineState.duration / timelineState.majorTickCount;
    }

    const minorInterval = majorInterval / (timelineState.minorTicksPerMajor + 1);

    for(let t = 0; t < timelineState.duration; t += majorInterval) {
        ticks.push({time: t, major: true});
        for(let i = 1; i <= timelineState.minorTicksPerMajor; i++) {
            const subTime = t + i * minorInterval;

            if(subTime >= timelineState.duration) break;

            ticks.push({time: subTime, major: false});
        }
    }

    return ticks;
}