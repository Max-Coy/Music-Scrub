import { timelineState } from "/static/state/timelineState.js";
import { dom } from "/static/ui/dom.js";
import { snapTime } from "/static/utils/snapping.js";
import { togglePlayback } from "/static/utils/navigation.js";


export function beginScrub(event, videoPlayer, render) {
    timelineState.wasPlayingBeforeDrag = timelineState.isPlaying;
    if(timelineState.wasPlayingBeforeDrag) togglePlayback(videoPlayer);
    timelineState.isScrubbing = true;
    timelineState.previousMouseX = event.clientX;
    seekTimelineFromMouse(event.clientX, videoPlayer, render);
    timelineState.rawScrubTime = timelineState.currentTime;
}

export function updateScrub(event, videoPlayer, render) {
    const rect = dom.videoWaveformOverlay.getBoundingClientRect();

    const outsideDistance = Math.max(0, rect.top - event.clientY);

    const sensitivity = 1 / (1 + outsideDistance * 0.02);

    const timelineWidth = dom.videoWaveformOverlay.clientWidth;

    const secondsPerPixel = timelineState.viewportDuration / timelineWidth;

    const deltaX = event.clientX - timelineState.previousMouseX;
    timelineState.previousMouseX = event.clientX;

    const deltaTime = deltaX * secondsPerPixel * sensitivity;

    timelineState.rawScrubTime += deltaTime;

    const newTime = timelineState.rawScrubTime;

    // const clampedTime = timelineState.snappingEnabled
    //     ? snapTime(newTime)
    //     : Math.max(0, Math.min(timelineState.projectDuration, newTime));
    const clampedTime = processTimelineTime(newTime, timelineState.snappingEnabled);

    
    if(clampedTime <= timelineState.videoData.duration) {
        videoPlayer.currentTime = clampedTime;
    }

    timelineState.currentTime = clampedTime;
    timelineState.transportStartTime = clampedTime;

    render();
}

export function endScrub(videoPlayer) {
    timelineState.isScrubbing = false;
    if(timelineState.wasPlayingBeforeDrag) togglePlayback(videoPlayer);
}


function processTimelineTime(time, shouldSnap) {
    const processedTime = shouldSnap 
    ? snapTime(time)
    : time;

    return Math.max(0, Math.min(timelineState.projectDuration, processedTime));
}   

function seekTimelineFromMouse(clientX, videoPlayer, render) {
    const rect = dom.videoWaveformOverlay.getBoundingClientRect();

    const x = clientX - rect.left;

    const timelineWidth = dom.videoWaveformOverlay.clientWidth;

    const ratio = x / timelineWidth;

    const seekTime = timelineState.viewportStartTime + ratio * timelineState.viewportDuration;

    const clampedTime = processTimelineTime(seekTime, timelineState.snappingEnabled);

    const videoTime = Math.max(0, Math.min(timelineState.projectDuration, clampedTime));
    videoPlayer.currentTime = videoTime;
    
    timelineState.currentTime = clampedTime;
    timelineState.transportStartTime = clampedTime;

    render();
}

