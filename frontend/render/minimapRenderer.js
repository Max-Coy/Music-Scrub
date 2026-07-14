import { timelineState } from "/static/state/timelineState.js";
import { dom } from "/static/ui/dom.js"



// const clipStart = startTime;
//     const clipEnd = duration + startTime;

//     const visibleStart = Math.max(viewportStart, clipStart);
//     const visibleEnd = Math.min(viewportEnd, clipEnd);
//     if(visibleEnd <= visibleStart) return;

//     const startRatio = (visibleStart - startTime) / duration;
//     const endRatio = (visibleEnd - startTime)/ duration;

export function renderMinimapStatic() {
    const canvas = dom.timelineMinimapStatic;

    const ctx = canvas.getContext("2d");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const channelCount = timelineState.channels.length;

    const channelHeight = height / channelCount;

    for(let c = 0; c < channelCount; c++) {
        const channelName = timelineState.channels[c];
        const channelData = timelineState[`${channelName}Data`];
        
        if(channelData === null) continue;

        const peaks = channelData.peaks;

        const mid = c * channelHeight + channelHeight/2;

        const pixelsPerSecond = width / timelineState.projectDuration;

        const waveformWidth = channelData.duration *pixelsPerSecond;

        const step = waveformWidth / peaks.length;

        for(let i = 0; i < peaks.length; i++) {
            const peak = peaks[i]
            const x = i * step;
            const amplitude = peak * (channelHeight * 0.4);
            ctx.beginPath();
            ctx.moveTo(x, mid - amplitude);
            ctx.lineTo(x, mid+amplitude);

            ctx.strokeStyle = "#888"
            ctx.stroke();
        }
    }
}

export function renderMinimapOverlay() {
    const canvas = dom.timelineMinimapOverlay;

    const ctx = canvas.getContext("2d");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const totalDuration  = timelineState.projectDuration;

    const viewportX = (timelineState.viewportStartTime / totalDuration) * width;

    const viewportWidth = (timelineState.viewportDuration / totalDuration) * width;

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    ctx.strokeRect(viewportX, 0, viewportWidth, height);

    const playHeadX = (timelineState.currentTime / timelineState.projectDuration) * width;

    ctx.beginPath();
    ctx.moveTo(playHeadX, 0);
    ctx.lineTo(playHeadX, height);

    ctx.strokeStyle = "white";
    ctx.linewidth = 2;

    ctx.stroke();
}