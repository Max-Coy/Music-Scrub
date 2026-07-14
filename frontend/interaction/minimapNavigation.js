import { timelineState } from "/static/state/timelineState.js";
import { dom } from "/static/ui/dom.js";


export function beginViewportShift(event, render) {
    timelineState.isDraggingViewport = true;
    timelineState.viewportLastMouseY = event.clientY;
    translateViewport(event);
    render({staticWaveforms: true});

}

export function updateViewportShift(event, render) {
    if(!timelineState.isDraggingViewport) return;
    scaleViewport(event);
    translateViewport(event);
    render({staticWaveforms: true});
}

export function endViewportShift(event, render) {
    timelineState.isDraggingViewport = false;
}

function translateViewport(event) {
    const rect = dom.timelineMinimapOverlay.getBoundingClientRect();

    const width = rect.width;
    const half = timelineState.viewportDuration / 2;
    const x = Math.max(0, event.clientX - rect.left - half);

    const ratio = x / width;

    timelineState.viewportStartTime = ratio * timelineState.projectDuration;

    const maxViewportStart = timelineState.projectDuration - timelineState.viewportDuration;
    timelineState.viewportStartTime = Math.max(0, Math.min(maxViewportStart, timelineState.viewportStartTime));
}

function scaleViewport(event) {
    const deltaY = event.clientY - timelineState.viewportLastMouseY;
    const denominator = Math.max(0.1, 1 + deltaY*0.002);
    const zoomSensitivity = 0.005;

    const scale = Math.exp(-deltaY * zoomSensitivity);

    const newDuration = timelineState.viewportDuration * scale;
    
    if(newDuration >= timelineState.projectDuration) {
        timelineState.viewportStartTime = 0;
        timelineState.viewportDuration = timelineState.projectDuration;
    } else {
        const deltaDuration = newDuration - timelineState.viewportDuration 
        timelineState.viewportStartTime -= deltaDuration/2;
        const maxViewportStart = timelineState.projectDuration - newDuration;
        timelineState.viewportStartTime = Math.max(0, Math.min(maxViewportStart, timelineState.viewportStartTime));
        timelineState.viewportDuration = newDuration;
    }

    timelineState.viewportLastMouseY = event.clientY;
}
