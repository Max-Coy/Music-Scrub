import { timelineState } from "/static/state/timelineState.js";
import { stepFrame, stepTick, togglePlayback, moveSelectedChannel } from "/static/utils/navigation.js";

export function setupKeyboardShortcuts(videoPlayer, render, startAnimationLoop, stopAnimationLoop) {
    document.addEventListener("keydown", (event) => {
        if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) {
            event.preventDefault();
        }
        
        if(event.key === "Control") {
            timelineState.snappingEnabled = !timelineState.snappingEnabled;
        }

        if(event.repeat) return;

        if(event.key === " ") {
            togglePlayback(videoPlayer);
        }

        if(event.key === "ArrowLeft") {
            stepTick(videoPlayer, -1, render);
        }

        if(event.key === "ArrowRight") {
            stepTick(videoPlayer, 1, render);
        }

        if(event.key === ".") { 
            stepFrame(videoPlayer, 1, render);
        }

        if(event.key === ",") {
            stepFrame(videoPlayer, -1, render);
        }

        if(event.key === "ArrowUp") {
            moveSelectedChannel(-1, render);
        }

        if(event.key === "ArrowDown") { 
            moveSelectedChannel(1, render);
        }
    })

    document.addEventListener("keyup", (event) => {
        if(event.key === "Control") {
            timelineState.snappingEnabled = !timelineState.snappingEnabled;
        }
    })
}