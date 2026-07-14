import * as scrubbing from "/static/interaction/scrubbing.js";
import * as minimapNavigation from "/static/interaction/minimapNavigation.js";
import * as clipEditing from "/static/interaction/clipEditing.js";
import { timelineState } from "/static/state/timelineState.js";
import { dom } from "/static/ui/dom.js";
import { isInChannelHeader } from "/static/interaction/channelRegions.js";


const waveformSongCanvases = [
        {canvas: dom.songWaveformStatic, channel: "song"}
];

export function setupMouse(videoPlayer, render) {

    dom.videoWaveformStatic.addEventListener("mousedown", (event) => { // don't want all the same functionality on the video waveform
        timelineState.selectedChannel = "video"
        timelineState.soloChannel = "video";
        if(!isInChannelHeader(dom.videoWaveformStatic, event.clientY)) {
            scrubbing.beginScrub(event, videoPlayer, render);
        }
    });

    for(const entry of waveformSongCanvases) {
        entry.canvas.addEventListener("mousedown", (event) => {
            timelineState.selectedChannel = entry.channel; // switching selected channel to clicked canvas
            timelineState.soloChannel = "song";
            if(isInChannelHeader(entry.canvas, event.clientY)) {
                clipEditing.beginClipDrag(event, videoPlayer);
            } else {
                
                scrubbing.beginScrub(event, videoPlayer, render);
            }
                    
        });
    }

    dom.timelineMinimapOverlay.addEventListener("mousedown", (event) => {
        minimapNavigation.beginViewportShift(event, render);
    });


    document.addEventListener("mousemove", (event) => {
        if(timelineState.isScrubbing) {
            scrubbing.updateScrub(event, videoPlayer, render);
        }
        if(timelineState.isDraggingViewport) {
            minimapNavigation.updateViewportShift(event, render);
        }
        if(timelineState.isDraggingClip) {
            clipEditing.updateClipDrag(event, render);
        }
    });

    document.addEventListener("mouseup", (event) => {
        if(timelineState.isScrubbing) {
            scrubbing.endScrub(videoPlayer);
        }
        if(timelineState.isDraggingViewport) {
            minimapNavigation.endViewportShift(event);
        }
        if(timelineState.isDraggingClip) {
            clipEditing.endClipDrag(videoPlayer);
        }
    });
}


