import { timelineState } from "/static/state/timelineState.js";
import { dom } from "/static/ui/dom.js";
import { generateTicks } from "/static/render/ticks.js";

export function renderStaticWaveforms() {
    drawStaticWaveform(dom.videoWaveformStatic, timelineState.videoData.peaks, timelineState.videoData.duration, 0, 0);
    console.log(timelineState.songData.duration);
    drawStaticWaveform(dom.songWaveformStatic, timelineState.songData.peaks, 
                        timelineState.songData.duration, timelineState.songClipStartTime, timelineState.channelHeaderHeightRatio);
}

export function renderDynamicOverlays() {
    drawPlayhead(dom.videoWaveformOverlay, "video", 0);
    drawPlayhead(dom.songWaveformOverlay, "song", timelineState.channelHeaderHeightRatio);
}

function drawTicks(canvas) {
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const ticks = generateTicks();

    for(const tick of ticks) {
        const ratio = tick.time / timelineState.duration;

        const x = ratio * width;

        const tickHeight = tick.major ? 20: 10;

        ctx.beginPath();

        ctx.moveTo(x, height);
        ctx.lineTo(x, height - tickHeight);

        ctx.strokeStyle = "#888"

        ctx.lineWidth = 1;

        ctx.stroke();
    }
}

function drawStaticWaveform(canvas, peaks, duration, startTime, channelHeaderRatio) {
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const width = canvas.width;
    const height = canvas.height;

    // clear canvas
    ctx.clearRect(0,0,width, height); 

    //draw background
    ctx.fillStyle = ("#222");
    ctx.fillRect(0, 0, width, height);

    

    //draw waveform
    const mid = height / 2;

    const totalDuration = duration;

    const viewportStart = timelineState.viewportStartTime;
    const viewportEnd = viewportStart + timelineState.viewportDuration;

    const clipStart = startTime;
    const clipEnd = duration + startTime;
    console.log(duration, startTime);
    const clipWidth = clipEnd - clipStart;
    console.log(clipWidth, width);
    ctx.fillStyle = "#444";
    ctx.fillRect(clipStart, 0, clipWidth, height * channelHeaderRatio);

    const visibleStart = Math.max(viewportStart, clipStart);
    const visibleEnd = Math.min(viewportEnd, clipEnd);
    if(visibleEnd <= visibleStart) return;

    const startRatio = (visibleStart - startTime) / duration;
    const endRatio = (visibleEnd - startTime)/ duration;

    const startIndex = Math.floor(startRatio * peaks.length);

    const endIndex = Math.min(peaks.length, Math.ceil(endRatio * peaks.length));
    const visiblePeaks = peaks.slice(startIndex, endIndex);


    // // Drawing Waveforms
    for(let i = 0; i < visiblePeaks.length; i++) {
        const peak = visiblePeaks[i];

        const peakTime = visibleStart + (i/visiblePeaks.length) * (visibleEnd - visibleStart);

        const x = (peakTime - viewportStart) / timelineState.viewportDuration * width;

        const amplitude = peak * mid;

        ctx.beginPath();

        ctx.moveTo(x, mid - amplitude);
        ctx.lineTo(x, mid + amplitude);
        
        ctx.strokeStyle = "white";

        ctx.stroke();
    }

}

function drawPlayhead(canvas, channelName, channelHeaderRatio) {
    
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if(timelineState.selectedChannel !== channelName) return;

    drawTicks(canvas);

    const timelineWidth = dom.videoWaveformStatic.clientWidth;

    const viewportStart = timelineState.viewportStartTime;
    const viewportEnd = viewportStart + timelineState.viewportDuration;
    
    if(timelineState.currentTime < viewportStart ||
        timelineState.currentTime > viewportEnd) return;
    
    
    const playheadRatio = (timelineState.currentTime - viewportStart) 
                            / timelineState.viewportDuration;

    const playHeadX = playheadRatio * timelineWidth;

    ctx.beginPath();
    ctx.moveTo(playHeadX, height * channelHeaderRatio);
    ctx.lineTo(playHeadX, height);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    ctx.stroke();
}