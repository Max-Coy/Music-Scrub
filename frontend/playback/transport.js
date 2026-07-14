import { timelineState } from "/static/state/timelineState.js";
import { togglePlayback } from "/static/utils/navigation.js";
import { playSong } from "/static/audio/audioEngine.js";

let videoPlayerRef = null;
let renderRef = null;

export function setupTransport(videoPlayer, render) {
    videoPlayerRef = videoPlayer;
    renderRef = render;

    videoPlayer.addEventListener("loadedmetadata", () => {
        timelineState.duration = videoPlayer.duration;
        timelineState.videoFPS = 30; //replace!
    });
}

function animationLoop(timestamp) {
    if(!timelineState.isPlaying) return;

    if(timelineState.lastFrameTimestamp === null) {
        timelineState.lastFrameTimestamp = timestamp;
    }

    const deltaSeconds = (timestamp - timelineState.lastFrameTimestamp) / 1000;

    timelineState.lastFrameTimestamp = timestamp;

    if(timelineState.currentTime < timelineState.videoData.duration) {
        timelineState.currentTime = videoPlayerRef.currentTime;
    } else {
        timelineState.currentTime += deltaSeconds;
    }
    

    timelineState.currentTime = Math.max(0, Math.min(timelineState.currentTime, timelineState.projectDuration));
    if(!timelineState.audioIsOn){
        if(timelineState.currentTime >= timelineState.songClipStartTime){
            playSong();
        }
    }
    renderRef();


    let playbackLimit;
    if(timelineState.selectedChannel === "video") {
        playbackLimit = timelineState.videoData.duration;
    } else {
        playbackLimit = timelineState.projectDuration;
    }

    if(timelineState.currentTime >= playbackLimit) {
        togglePlayback(videoPlayerRef)
        timelineState.isPlaying = false;

        return;
    }

    timelineState.animationFrameID = requestAnimationFrame(animationLoop);
}

export function startAnimationLoop() {
    if(timelineState.animationFrameID !== null) return;

    timelineState.lastFrameTimestamp = null;
    timelineState.animationFrameID = requestAnimationFrame(animationLoop);
}

export function stopAnimationLoop() {
    if(timelineState.animationFrameID === null) return;

    cancelAnimationFrame(timelineState.animationFrameID);

    timelineState.animationFrameID = null;
}