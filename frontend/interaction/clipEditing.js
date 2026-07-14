import { timelineState } from "/static/state/timelineState.js";
import { togglePlayback } from "/static/utils/navigation.js";
import { dom } from "/static/ui/dom.js";

export function beginClipDrag(event, videoPlayer) {
    timelineState.isDraggingClip = true;
    timelineState.wasPlayingBeforeDrag = timelineState.isPlaying;
    if(timelineState.wasPlayingBeforeDrag) togglePlayback(videoPlayer);
    timelineState.clipDragStartMouseX = event.clientX;
    timelineState.clipDragStartTime = timelineState.songClipStartTime;
}

export function updateClipDrag(event, render) {
    if(!timelineState.isDraggingClip) return;

    const deltaX = event.clientX - timelineState.previousMouseX;
    timelineState.previousMouseX = event.clientX;

    const secondsPerPixel = timelineState.viewportDuration / dom.songWaveformOverlay.clientWidth;

    const deltaTime = deltaX * secondsPerPixel;

    timelineState.songClipStartTime += deltaTime;

    timelineState.songClipStartTime = Math.max(0, timelineState.songClipStartTime);
    timelineState.projectDuration = 
        Math.max(timelineState.videoData.duration, timelineState.songData.duration + timelineState.songClipStartTime);

    render({staticWaveforms: true});
}

export function endClipDrag(videoPlayer) {
    timelineState.isDraggingClip = false;
    timelineState.currentTime = timelineState.songClipStartTime;
    if(timelineState.wasPlayingBeforeDrag) togglePlayback(videoPlayer);
}