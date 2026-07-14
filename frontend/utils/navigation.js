import { timelineState } from "/static/state/timelineState.js";
import { startAnimationLoop, stopAnimationLoop } from "/static/playback/transport.js";
import { playSong, stopSong } from "/static/audio/audioEngine.js";

function applyTime(videoPlayer, time, render) {
    let clampedTime;
    if(timelineState.selectedChannel === "video") {
        clampedTime = Math.max(0, Math.min(timelineState.videoData.duration, time));
    } else {
        clampedTime = Math.max(0, Math.min(timelineState.projectDuration, time));
    }
    
    timelineState.currentTime = clampedTime;

    timelineState.rawScrubTime = clampedTime;

    timelineState.transportStartTime = clampedTime;

    videoPlayer.currentTime = clampedTime;

    render();
}
// 
export function stepFrame(videoPlayer, direction, render) {

    const frameDuration = 1 / timelineState.videoFPS;

    applyTime(videoPlayer, 
        timelineState.currentTime + direction * frameDuration, 
        render
    );
}

export function stepTick(videoPlayer, direction, render) {

    let majorInterval;

    if(timelineState.tickMode === "fixed") {
        majorInterval = timelineState.fixedTickInterval;
    } else {
        majorInterval = timelineState.duration / timelineState.majorTickCount;
    }

    const minorInterval = majorInterval / (timelineState.minorTicksPerMajor + 1);

    applyTime(videoPlayer,
        timelineState.currentTime + direction * minorInterval,
        render
    );
}

export function togglePlayback(videoPlayer) {
    if(timelineState.isPlaying) {
        timelineState.isPlaying = false;
        timelineState.currentTime = timelineState.transportStartTime;

        videoPlayer.pause();
        stopSong();

        stopAnimationLoop();

        return;
    }

    timelineState.isPlaying = true;
    
    const withinVideoBounds = timelineState.currentTime <= timelineState.videoData.duration;

    if(withinVideoBounds) {
        videoPlayer.currentTime = timelineState.currentTime;

        videoPlayer.play();

    } 
    playSong();
    startAnimationLoop();
}

export function moveSelectedChannel(direction, render) {

    const currentIndex = timelineState.channels.indexOf(timelineState.selectedChannel);

    const nextIndex = Math.max(0, Math.min(timelineState.channels.length - 1, currentIndex + direction));

    timelineState.selectedChannel = timelineState.channels[nextIndex];

    render();
}